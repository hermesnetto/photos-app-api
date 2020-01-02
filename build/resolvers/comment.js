"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var post_1 = require("./post");
var key = 'comments';
exports.commentFieldResolvers = {
    Comment: {
        author: function (comment, _args, _a) {
            var db = _a.db;
            return user_1.userResolvers.user({}, { id: comment.user_id }, { db: db });
        },
        post: function (comment, _args, _a) {
            var db = _a.db;
            return post_1.postResolvers.post({}, { id: comment.post_id }, { db: db });
        }
    }
};
exports.commentResolvers = {
    /** Gets a single Comment by its id */
    comment: function (_root, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db
            .get(key)
            .find({ id: id })
            .value();
    },
    /** Gets all Comments from a Post */
    commentsByPost: function (_root, _a, _b) {
        var postId = _a.postId;
        var db = _b.db;
        return db
            .get(key)
            .filter({ post_id: postId })
            .value();
    }
};
