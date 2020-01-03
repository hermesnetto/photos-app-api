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
var picture_1 = require("./picture");
var key = models_1.MODEL_TYPES.Users;
exports.userFields = {
    User: {
        friends: function (user, _args, ctx) {
            return user.friends_ids.map(function (friendId) {
                return exports.userQueries.user({}, { id: friendId }, ctx);
            });
        },
        profile_picture: function (user, _args, ctx) {
            if (!user.profile_picture_id) {
                return {};
            }
            return picture_1.pictureQueries.picture({}, { id: user.profile_picture_id }, ctx);
        }
    }
};
exports.userQueries = {
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
exports.userMutations = {
    /** Creates a new User */
    addUser: function (_root, _a, ctx) {
        var input = _a.input;
        var db = ctx.db, generateId = ctx.generateId, getMutationResult = ctx.getMutationResult;
        var email = input.email, password = input.password, name = input.name;
        var newUser = {
            email: email,
            password: password,
            name: name,
            id: generateId(key),
            description: '',
            profile_picture_id: null,
            friends_ids: []
        };
        db.get(key)
            .push(newUser)
            .write();
        return getMutationResult(true, 'User succesfully creates', newUser);
    },
    /** Updates a User */
    updateUser: function (_root, _a, ctx) {
        var input = _a.input;
        var db = ctx.db, getMutationResult = ctx.getMutationResult;
        var id = input.id, data = __rest(input, ["id"]);
        var user = db.get(key).find({ id: id });
        if (!user.value()) {
            return getMutationResult(false, 'User not found!', {});
        }
        var updatedUser = user.assign(data);
        updatedUser.write();
        return getMutationResult(true, 'User succesfully updated!', updatedUser.value());
    },
    /** Deletes a User */
    deleteUser: function (_root, _a, ctx) {
        var input = _a.input;
        var db = ctx.db, getMutationResult = ctx.getMutationResult;
        var id = input.id;
        var users = db.get(key);
        if (!users.find({ id: id }).value()) {
            return getMutationResult(false, 'User not found!', {});
        }
        users.remove({ id: id }).write();
        return getMutationResult(true, 'User succesfully deleted!', {});
    }
};
