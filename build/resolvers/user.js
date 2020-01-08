"use strict";
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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var models_1 = require("../models");
var media_1 = require("./media");
var compareHash = function (hash, password) {
    return bcryptjs_1.default.compare(hash, password);
};
var hashPassword = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcryptjs_1.default.hash(password, 8)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var generateToken = function (id) {
    return jsonwebtoken_1.default.sign({ id: id }, 'secret!', {
        expiresIn: 86400
    });
};
exports.userFields = {
    User: {
        media: function (user, _args, ctx) {
            if (!user.media_id)
                return {};
            return media_1.mediaQueries.media({}, { id: user.media_id }, ctx);
        }
    }
};
exports.userQueries = {
    me: function (_, _args, _a) {
        var db = _a.db, user = _a.user;
        if (!user)
            return null;
        return db
            .get(models_1.MODEL_TYPES.User)
            .find({ id: user.id })
            .value();
    },
    user: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db
            .get(models_1.MODEL_TYPES.User)
            .find({ id: id })
            .value();
    }
};
exports.userMutations = {
    createUser: function (_, _a, ctx) {
        var input = _a.input;
        return __awaiter(void 0, void 0, void 0, function () {
            var db, mutationResult, generateId, email, password, name, userData, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        db = ctx.db, mutationResult = ctx.mutationResult, generateId = ctx.generateId;
                        email = input.email, password = input.password, name = input.name;
                        _b = {
                            id: generateId(models_1.MODEL_TYPES.User)
                        };
                        return [4 /*yield*/, hashPassword(password)];
                    case 1:
                        userData = (_b.password = _c.sent(),
                            _b.email = email,
                            _b.name = name,
                            _b.media_id = null,
                            _b);
                        /** @TODO Adds a default image for every new user */
                        db.get(models_1.MODEL_TYPES.User)
                            .push(userData)
                            .write();
                        delete userData.password;
                        return [2 /*return*/, mutationResult(true, 'User successfully created!', userData)];
                }
            });
        });
    },
    updateUser: function (_, _a, ctx) {
        var input = _a.input;
        var db = ctx.db, mutationResult = ctx.mutationResult, generateId = ctx.generateId;
        var id = input.id, name = input.name, mediaSource = input.mediaSource;
        var user = db.get(models_1.MODEL_TYPES.User).find({ id: id });
        var userData = { name: name };
        if (mediaSource) {
            var currentMediaId = user.value().media_id;
            if (currentMediaId) {
                db.get(models_1.MODEL_TYPES.Media)
                    .find()
                    .assign({ source: mediaSource })
                    .write();
            }
            else {
                var mediaId = generateId(models_1.MODEL_TYPES.Media);
                db.get(models_1.MODEL_TYPES.Media)
                    .push({ id: mediaId, user_id: id, source: mediaSource })
                    .write();
                userData.media_id = mediaId;
            }
        }
        user.assign(userData).write();
        return mutationResult(true, 'User successfully updated!', user.value());
    }
};
