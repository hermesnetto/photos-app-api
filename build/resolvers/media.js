"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var user_1 = require("./user");
exports.mediaFields = {
    Media: {
        author: function (media, _args, ctx) {
            return user_1.userQueries.user({}, { id: media.user_id }, ctx);
        }
    }
};
exports.mediaQueries = {
    media: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db
            .get(models_1.MODEL_TYPES.Media)
            .find({ id: id })
            .value();
    }
};
exports.mediaMutations = {};
