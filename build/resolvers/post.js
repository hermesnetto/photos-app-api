"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var media_1 = require("./media");
var comment_1 = require("./comment");
var user_1 = require("./user");
exports.postFields = {
    Post: {
        medias: function (post, _args, ctx) {
            var db = ctx.db;
            var mediasIds = db
                .get(models_1.MODEL_TYPES.PostMedia)
                .filter({ post_id: post.id })
                .value()
                .map(function (_a) {
                var media_id = _a.media_id;
                return media_id;
            });
            return mediasIds.map(function (mediaId) {
                return media_1.mediaQueries.media({}, { id: mediaId }, ctx);
            });
        },
        comments: function (post, _args, ctx) {
            return comment_1.commentQueries.commentsByPost({}, { postId: post.id }, ctx);
        },
        user: function (post, _args, ctx) {
            return user_1.userQueries.user({}, { id: post.user_id }, ctx);
        }
    }
};
exports.postQueries = {
    post: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db
            .get(models_1.MODEL_TYPES.Post)
            .find({ id: id })
            .value();
    },
    posts: function (_, _args, _a) {
        var db = _a.db;
        /** @TODO Instead of reverse, should paginate and use timestamps */
        return db
            .get(models_1.MODEL_TYPES.Post)
            .reverse()
            .value();
    },
    postsByUser: function (_, _a, _b) {
        var userId = _a.userId;
        var db = _b.db;
        /** @TODO Instead of reverse, should paginate and use timestamps */
        return db
            .get(models_1.MODEL_TYPES.Post)
            .filter({ user_id: userId })
            .reverse()
            .value();
    }
};
exports.postMutations = {
    createPost: function (_, _a, ctx) {
        var input = _a.input;
        var db = ctx.db, mutationResult = ctx.mutationResult, generateId = ctx.generateId;
        var title = input.title, user_id = input.user_id, mediasSource = input.mediasSource;
        var postId = generateId(models_1.MODEL_TYPES.Post);
        var postData = { id: postId, user_id: user_id, title: title };
        db.get(models_1.MODEL_TYPES.Post)
            .push(postData)
            .write();
        mediasSource.forEach(function (source) {
            var postMediaId = generateId(models_1.MODEL_TYPES.PostMedia);
            var mediaId = generateId(models_1.MODEL_TYPES.Media);
            db.get(models_1.MODEL_TYPES.Media)
                .push({ id: mediaId, user_id: user_id, source: source })
                .write();
            db.get(models_1.MODEL_TYPES.PostMedia)
                .push({ id: postMediaId, user_id: user_id, post_id: postId, media_id: mediaId })
                .write();
        });
        return mutationResult(true, 'Post successfully created!', postData);
    },
    deletePost: function (_, _a, ctx) {
        var input = _a.input;
        var db = ctx.db, mutationResult = ctx.mutationResult;
        var id = input.id;
        var post = db
            .get(models_1.MODEL_TYPES.Post)
            .find({ id: id })
            .value();
        if (!post) {
            return mutationResult(false, 'Post not found!', null);
        }
        db.get(models_1.MODEL_TYPES.PostMedia)
            .filter({ post_id: post.id })
            .value()
            .forEach(function (_a) {
            var id = _a.id, media_id = _a.media_id;
            db.get(models_1.MODEL_TYPES.Media)
                .remove({ id: media_id })
                .write();
            db.get(models_1.MODEL_TYPES.PostMedia)
                .remove({ id: id })
                .write();
        });
        db.get(models_1.MODEL_TYPES.Comment)
            .filter({ post_id: id })
            .value()
            .forEach(function (_a) {
            var id = _a.id;
            db.get(models_1.MODEL_TYPES.Comment)
                .remove({ id: id })
                .write();
        });
        db.get(models_1.MODEL_TYPES.Post)
            .remove({ id: id })
            .write();
        return mutationResult(true, 'Post successfully deleted!', null);
    }
};
