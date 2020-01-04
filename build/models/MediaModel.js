"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var key = models_1.MODEL_TYPES.Media;
var MediaModel = /** @class */ (function () {
    function MediaModel() {
    }
    MediaModel.createMedia = function (data, db) {
        db.get(key)
            .push(data)
            .write();
    };
    MediaModel.updateMedia = function (id, data, db) {
        db.get(key)
            .find({ id: id })
            .assign(data)
            .write();
    };
    return MediaModel;
}());
exports.MediaModel = MediaModel;
