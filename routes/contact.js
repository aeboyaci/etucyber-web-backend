const express = require("express");
const router = express.Router();
const Authorize = require("../authorize");

const Contacts = require("../models/contact");

router.get("/", Authorize, (req, resp) => {
    Contacts.find({}).then((data) => {
        return resp.status(200).json({success: true, messages: data});
    }).catch((err) => {
        return resp.status(500).json({ success: false, message: "DB_ERROR" });
    });
});

router.post("/", (req, resp) => {
    Contacts.create({
        ...req.body
    }).then((data) => {
        return resp.status(201).json({ success: true, message: "Mesajınız başarı ile iletildi. Teşekkür ederiz :)" });
    }).catch((err) => {
        return resp.status(500).json({ success: false, message: "Sunucu hatası meydana geldi. Lütfen daha sonra tekrar deneyin." });
    });
});

module.exports = router;