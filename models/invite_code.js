const mongoose = require("mongoose");

const InviteCodesSchema = new mongoose.Schema({
    code: { type: String, required: true }
});

module.exports = mongoose.model("invite_codes", InviteCodesSchema);