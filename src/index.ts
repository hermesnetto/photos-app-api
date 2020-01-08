import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';

// import cors from 'cors';
import { typeDefs } from './types';
import { resolvers } from './resolvers';
import { getDBInstance } from './db';
import { MODEL_TYPES, MutationResult } from './models';

const db = getDBInstance();
const port = 4000;
const gqlPath = '/graphql';
/** Used for credentials security */
const SECRET_KEY = 'secret!';

const upload = multer({
  storage: multer.diskStorage({
    destination: function(_req, _file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(_req, file, cb) {
      const { fieldname, originalname } = file;
      cb(null, `${fieldname}-${Date.now()}.${path.extname(originalname)}`);
    }
  })
});

const app = express();

// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.post('/login', async (req, res) => {
  // Update DB
  db.read();

  const { email, password } = req.body;

  const user = db
    .get(MODEL_TYPES.User)
    .find({ email: email.trim() })
    .value();

  if (!user) {
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`
    });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    //return error to user to let them know the password is incorrect
    res.status(401).send({
      success: false,
      message: 'Incorrect credentials'
    });
    return;
  }

  const token = jwt.sign({ email: user.email, id: user.id }, SECRET_KEY);

  res.send({
    success: true,
    token: token
  });
});

app.post('/upload', upload.single('photo'), (req, res) => {
  res.send({
    success: true,
    message: 'File successfully uploaded!',
    data: {
      source: req.file.path
    }
  });
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (context: any) => {
    const { req } = context;
    const token = req.headers.authorization || '';
    let user = null;

    try {
      const { id, email } = jwt.verify(token.split(' ')[1], SECRET_KEY);
      user = { id, email };
    } catch (e) {}

    /**
     * @TODO Add the right types for context
     * @TODO Resolve n + 1 problem
     */
    return {
      ...context,
      user,

      /**
       * @TODO Implement better function to generate the ID's
       */
      generateId(type: MODEL_TYPES): number {
        return db.get(type).value().length + 1;
      },

      mutationResult<T>(success: boolean, message: string, data: T): MutationResult<T> {
        return { success, message, data };
      },
      db
    };
  }
});

server.applyMiddleware({ app, path: gqlPath });

app.listen(port, () => {
  console.log(`🚀 Server ready at ${port}`);
});
