"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var picture_1 = require("./picture");
var user_1 = require("./user");
var comment_1 = require("./comment");
var key = models_1.MODEL_TYPES.Posts;
exports.postFields = {
    Post: {
        picture: function (post, _args, ctx) {
            return picture_1.pictureQueries.picture({}, { id: post.picture_id }, ctx);
        },
        author: function (post, _args, ctx) {
            return user_1.userQueries.user({}, { id: post.user_id }, ctx);
        },
        likes: function (post, _args, ctx) {
            return post.likes_ids.map(function (id) {
                return user_1.userQueries.user({}, { id: id }, ctx);
            });
        },
        comments: function (post, _args, ctx) {
            return post.comments_ids.map(function (id) {
                console.log(comment_1.commentQueries.comment({}, { id: id }, ctx));
                return comment_1.commentQueries.comment({}, { id: id }, ctx);
            });
        }
    }
};
exports.postQueries = {
    /** Gets a single Post by its id */
    post: function (_root, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db
            .get(key)
            .find({ id: id })
            .value();
    },
    /** Gets all Posts */
    posts: function (_root, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db.get(key).value();
    },
    /** Gets all Posts from a User */
    postsByUser: function (_root, _a, _b) {
        var userId = _a.userId;
        var db = _b.db;
        return db
            .get(key)
            .filter({ user_id: userId })
            .value();
    }
};
