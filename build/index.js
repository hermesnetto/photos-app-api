"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var express_1 = __importDefault(require("express"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
// import cors from 'cors';
var types_1 = require("./types");
var resolvers_1 = require("./resolvers");
var db_1 = require("./db");
var models_1 = require("./models");
var db = db_1.getDBInstance();
var port = 4000;
var gqlPath = '/graphql';
/** Used for credentials security */
var SECRET_KEY = 'secret!';
var upload = multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (_req, file, cb) {
            var fieldname = file.fieldname, originalname = file.originalname;
            cb(null, fieldname + "-" + Date.now() + "." + path_1.default.extname(originalname));
        }
    })
});
var app = express_1.default();
// app.use(cors());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, match, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // Update DB
                db.read();
                _a = req.body, email = _a.email, password = _a.password;
                user = db
                    .get(models_1.MODEL_TYPES.User)
                    .find({ email: email.trim() })
                    .value();
                if (!user) {
                    res.status(404).send({
                        success: false,
                        message: "Could not find account: " + email
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 1:
                match = _b.sent();
                if (!match) {
                    //return error to user to let them know the password is incorrect
                    res.status(401).send({
                        success: false,
                        message: 'Incorrect credentials'
                    });
                    return [2 /*return*/];
                }
                token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, SECRET_KEY);
                res.send({
                    success: true,
                    token: token
                });
                return [2 /*return*/];
        }
    });
}); });
app.post('/upload', upload.single('photo'), function (req, res) {
    res.send({
        success: true,
        message: 'File successfully uploaded!',
        data: {
            source: req.file.path
        }
    });
});
var server = new apollo_server_express_1.ApolloServer({
    typeDefs: types_1.typeDefs,
    resolvers: resolvers_1.resolvers,
    context: function (context) { return __awaiter(void 0, void 0, void 0, function () {
        var req, token, user, _a, id, email;
        return __generator(this, function (_b) {
            req = context.req;
            token = req.headers.authorization || '';
            user = null;
            try {
                _a = jsonwebtoken_1.default.verify(token.split(' ')[1], SECRET_KEY), id = _a.id, email = _a.email;
                user = { id: id, email: email };
            }
            catch (e) { }
            /**
             * @TODO Add the right types for context
             * @TODO Resolve n + 1 problem
             */
            return [2 /*return*/, __assign(__assign({}, context), { user: user,
                    /**
                     * @TODO Implement better function to generate the ID's
                     */
                    generateId: function (type) {
                        return db.get(type).value().length + 1;
                    },
                    mutationResult: function (success, message, data) {
                        return { success: success, message: message, data: data };
                    },
                    db: db })];
        });
    }); }
});
server.applyMiddleware({ app: app, path: gqlPath });
app.listen(port, function () {
    console.log("\uD83D\uDE80 Server ready at " + port);
});
