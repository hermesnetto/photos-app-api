import low, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { DBSchema } from './models';

export const getDBInstance = (): LowdbSync<DBSchema> => {
  const adapter = new FileSync('db.json');
  const db = low(adapter);
  const defaultDb = {
    users: [],
    posts: [],
    medias: [],
    comments: [],
    postMedias: []
  };

  db.defaults(defaultDb).write();

  return db;
};
