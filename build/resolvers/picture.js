"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var key = 'pictures';
exports.pictureFieldResolvers = {
    Picture: {
        author: function (picture, _args, _a) {
            var db = _a.db;
            return user_1.userResolvers.user({}, { id: picture.user_id }, { db: db });
        }
    }
};
exports.pictureResolvers = {
    /** Gets a single Picture by its id */
    picture: function (_root, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db
            .get(key)
            .find({ id: id })
            .value();
    }
};
