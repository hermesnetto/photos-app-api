"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var key = 'accounts';
exports.accountResolvers = {
    /** Gets all Accounts */
    accounts: function (_root, _args, _a) {
        var db = _a.db;
        return db.get(key).value();
    },
    /** Gets a single Account by its id */
    account: function (_root, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db
            .get(key)
            .find({ id: id })
            .value();
    }
};
