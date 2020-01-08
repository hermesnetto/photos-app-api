"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var user_1 = require("./user");
exports.mediaFields = {
    Media: {
        user: function (media, _args, ctx) {
            return user_1.userQueries.user({}, { id: media.user_id }, ctx);
        }
    }
};
exports.mediaQueries = {
    media: function (_, _a, _b) {
        var id = _a.id;
        var db = _b.db;
        return db
            .get(models_1.MODEL_TYPES.Media)
            .find({ id: id })
            .value();
    }
};
exports.mediaMutations = {
    uploadMedia: function (_, _a) {
        var _parts = _a.file._parts;
        _parts.forEach(function (_a) {
            var name = _a[0], file = _a[1];
            try {
                cloudinary.uploader.upload(file.uri, {}, function (error, result) {
                    console.log(error, result);
                });
                // const result = await new Promise((resolve, reject) => {
                //   createReadStream().pipe(
                //     cloudinary.uploader.upload_stream((error, result) => {
                //       if (error) {
                //         reject(error);
                //       }
                //       resolve(result);
                //     })
                //   );
                // });
                // const newPicture = { filename, path: result.secure_url };
                // console.log(newPicture);
                // photos.push(newPicture)
                // return newPicture;
            }
            catch (err) {
                console.log(err);
            }
        });
        return { ok: true };
        // const { filename, createReadStream } = await file;
    }
};
