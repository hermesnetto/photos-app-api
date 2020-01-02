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
var apollo_server_1 = require("apollo-server");
var types_1 = require("./types");
var resolvers_1 = require("./resolvers");
var db_1 = require("./db");
var db = db_1.getDBInstance();
var server = new apollo_server_1.ApolloServer({
    typeDefs: types_1.typeDefs,
    resolvers: resolvers_1.resolvers,
    context: function (c) {
        return __assign(__assign({}, c), { db: db });
    }
});
server.listen().then(function (_a) {
    var url = _a.url;
    console.log("\uD83D\uDE80  Server ready at " + url);
});
