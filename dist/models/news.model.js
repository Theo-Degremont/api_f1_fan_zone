"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NewsSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image_url: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null },
    is_active: { type: Boolean, default: true }
});
exports.default = (0, mongoose_1.model)('News', NewsSchema);
