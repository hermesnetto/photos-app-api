"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var picture_1 = require("./picture");
var user_1 = require("./user");
var comment_1 = require("./comment");
var key = 'posts';
exports.postFieldResolvers = {
    Post: {
        picture: function (post, _args, _a) {
            var db = _a.db;
            return picture_1.pictureResolvers.picture({}, { id: post.picture_id }, { db: db });
        },
        author: function (post, _args, _a) {
            var db = _a.db;
            return user_1.userResolvers.user({}, { id: post.user_id }, { db: db });
        },
        likes: function (post, _args, _a) {
            var db = _a.db;
            return post.likes_ids.map(function (id) {
                return user_1.userResolvers.user({}, { id: id }, { db: db });
            });
        },
        comments: function (post, _args, _a) {
            var db = _a.db;
            return post.comments_ids.map(function (id) {
                console.log(comment_1.commentResolvers.comment({}, { id: id }, { db: db }));
                return comment_1.commentResolvers.comment({}, { id: id }, { db: db });
            });
        }
    }
};
exports.postResolvers = {
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
