"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var user_1 = require("./user");
exports.commentFields = {
    Comment: {
        author: function (comment, _args, ctx) {
            return user_1.userQueries.user({}, { id: comment.user_id }, ctx);
        }
    }
};
exports.commentQueries = {
    commentsByPost: function (_, _a, _b) {
        var postId = _a.postId;
        var db = _b.db;
        return db
            .get(models_1.MODEL_TYPES.Comment)
            .filter({ post_id: postId })
            .value();
    }
};
exports.commentMutations = {
    createComment: function (_, args, ctx) {
        var db = ctx.db, mutationResult = ctx.mutationResult, generateId = ctx.generateId;
        var _a = args.input, body = _a.body, user_id = _a.user_id, post_id = _a.post_id;
        if (!db
            .get(models_1.MODEL_TYPES.User)
            .find({ id: user_id })
            .value()) {
            return mutationResult(true, 'User not found!', null);
        }
        if (!db
            .get(models_1.MODEL_TYPES.Post)
            .find({ id: post_id })
            .value()) {
            return mutationResult(true, 'Post not found!', null);
        }
        var commentData = { id: generateId(models_1.MODEL_TYPES.Comment), user_id: user_id, body: body, post_id: post_id };
        db.get(models_1.MODEL_TYPES.Comment)
            .push(commentData)
            .write();
        delete commentData.user_id;
        delete commentData.post_id;
        return mutationResult(true, 'Comment successfully created!', commentData);
    },
    deleteComment: function (_, args, ctx) {
        var db = ctx.db, mutationResult = ctx.mutationResult, generateId = ctx.generateId;
        var id = args.input.id;
        if (!db
            .get(models_1.MODEL_TYPES.Comment)
            .find({ id: id })
            .value()) {
            return mutationResult(true, 'Comment not found!', null);
        }
        db.get(models_1.MODEL_TYPES.Comment)
            .remove({ id: id })
            .write();
        return mutationResult(true, 'Comment successfully deleted!', null);
    }
};
