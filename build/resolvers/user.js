"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var picture_1 = require("./picture");
var post_1 = require("./post");
var key = 'users';
exports.userFieldResolvers = {
    User: {
        posts: function (user, _args, _a) {
            var db = _a.db;
            return user.posts_ids.map(function (postId) {
                return post_1.postResolvers.post({}, { id: postId }, { db: db });
            });
        },
        friends: function (user, _args, _a) {
            var db = _a.db;
            return user.friends_ids.map(function (friendId) {
                return exports.userResolvers.user({}, { id: friendId }, { db: db });
            });
        },
        profile_picture: function (user, _args, _a) {
            var db = _a.db;
            return picture_1.pictureResolvers.picture({}, { id: user.profile_picture_id }, { db: db });
        }
    }
};
exports.userResolvers = {
    /** Gets a single User by its id */
    user: function (_root, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db
            .get(key)
            .find({ id: id })
            .value();
    },
    /** Gets all friends of a User */
    userFriends: function (_root, _a, _b) {
        var userId = _a.userId;
        var db = _b.db;
        var user = db
            .get(key)
            .find({ id: userId })
            .value();
        return db
            .get(key)
            .filter(function (_a) {
            var id = _a.id;
            return user.friends_ids.includes(id);
        })
            .value();
    }
};
