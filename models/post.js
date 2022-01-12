const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    html: { type: String, required: true },
    displayName: { type: String, required: true },
    photoUrl: { type: String, required: true },  // User Avatar
    email: { type: String, required: true }
});

module.exports = mongoose.model("posts", PostsSchema);