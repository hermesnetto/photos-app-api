"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lowdb_1 = __importDefault(require("lowdb"));
var FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
exports.getDBInstance = function () {
    var adapter = new FileSync_1.default('db.json');
    var db = lowdb_1.default(adapter);
    // const defaultDb = { users: [], accounts: [], posts: [], pictures: [], comments: [] };
    // db.defaults(defaultDb).write();
    return db;
};
