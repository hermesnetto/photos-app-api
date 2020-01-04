"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var media_1 = require("./media");
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
        var db = ctx.db, mutationResult = ctx.mutationResult, generateId = ctx.generateId;
        var email = input.email, password = input.password, name = input.name;
        var userData = { id: generateId(models_1.MODEL_TYPES.User), email: email, password: password, name: name, media_id: null };
        db.get(models_1.MODEL_TYPES.User)
            .push(userData)
            .write();
        delete userData.password;
        return mutationResult(true, 'User successfully created!', userData);
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
