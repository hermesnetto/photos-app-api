"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var user_1 = require("./user");
var key = models_1.MODEL_TYPES.Pictures;
exports.pictureFields = {
    Picture: {
        author: function (picture, _args, ctx) {
            return user_1.userQueries.user({}, { id: picture.user_id }, ctx);
        }
    }
};
exports.pictureQueries = {
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
