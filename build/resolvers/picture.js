"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
exports.pictureMutations = {
    /** Creates a new Picture */
    addPicture: function (_root, _a, ctx) {
        var input = _a.input;
        var db = ctx.db, generateId = ctx.generateId, getMutationResult = ctx.getMutationResult;
        var source = input.source, author_id = input.author_id;
        if (!user_1.userQueries.user({}, { id: author_id }, ctx)) {
            return getMutationResult(false, 'User not found!', {});
        }
        var newPicture = {
            source: source,
            id: generateId(key),
            user_id: author_id
        };
        db.get(key)
            .push(newPicture)
            .write();
        return getMutationResult(true, 'Picture succesfully created!', newPicture);
    },
    /** Updates a Picture */
    updatePicture: function (_root, _a, ctx) {
        var input = _a.input;
        var db = ctx.db, getMutationResult = ctx.getMutationResult;
        var id = input.id, data = __rest(input, ["id"]);
        var picture = db.get(key).find({ id: id });
        if (!picture.value()) {
            return getMutationResult(false, 'Picture not found!', {});
        }
        var updatedPicture = picture.assign(data);
        updatedPicture.write();
        return getMutationResult(true, 'Picture succesfully updated!', updatedPicture.value());
    },
    /** Deletes a Picture */
    deletePicture: function (_root, _a, ctx) {
        var input = _a.input;
        var db = ctx.db, getMutationResult = ctx.getMutationResult;
        var id = input.id;
        var pictures = db.get(key);
        if (!pictures.find({ id: id }).value()) {
            return getMutationResult(false, 'Picture not found!', {});
        }
        pictures.remove({ id: id }).write();
        return getMutationResult(true, 'Picture succesfully deleted!', {});
    }
};
