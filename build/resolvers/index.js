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
var picture_1 = require("./picture");
var post_1 = require("./post");
var comment_1 = require("./comment");
exports.resolvers = __assign(__assign(__assign(__assign({ Query: __assign(__assign(__assign(__assign({}, user_1.userResolvers), picture_1.pictureResolvers), post_1.postResolvers), comment_1.commentResolvers) }, user_1.userFieldResolvers), picture_1.pictureFieldResolvers), post_1.postFieldResolvers), comment_1.commentFieldResolvers);
