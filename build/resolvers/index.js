"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var media_1 = require("./media");
var post_1 = require("./post");
var comment_1 = require("./comment");
exports.resolvers = __assign(__assign(__assign(__assign({ Query: __assign(__assign(__assign(__assign({}, user_1.userQueries), media_1.mediaQueries), post_1.postQueries), comment_1.commentQueries), Mutation: __assign(__assign(__assign({}, user_1.userMutations), post_1.postMutations), comment_1.commentMutations), MutationResponse: {
        __resolveType: function () {
            return null;
        }
    } }, user_1.userFields), media_1.mediaFields), post_1.postFields), comment_1.commentFields);
