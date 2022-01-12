const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Authorize = require("../authorize");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const users = require("../models/account");
const codes = require("../models/invite_code");

router.post("/sign-in", (req, resp) => {
    const {email, password} = req.body;

    users.find({email}).then((data) => {
        if (data.length === 0) return resp.status(404).json({
            success: false,
            message: "E-mail adresi veya parola hatalı."
        });

        const dbPassword = data[0].password;
        console.log(dbPassword);

        if (!bcrypt.compareSync(password, dbPassword)) return resp.status(404).json({
            success: false,
            message: "E-mail adresi veya parola hatalı."
        });

        const token = jwt.sign({email}, JWT_SECRET);

        resp.cookie("token", token, { path: "/", httpOnly: true });

        return resp.status(200).json({success: true, message: "Sign-in successful"});
    });
});

router.post("/sign-up", (req, resp) => {
    const {firstName, lastName, email, password, inviteCode} = req.body;

    codes.find({code: inviteCode}).then((data) => {
        if (data.length === 0) return resp.status(400).json({success: false, message: "INVITE_CODE_ERROR"});

        const displayName = `${firstName} ${lastName}`;
        const hashedPassword = bcrypt.hashSync(password, 10);

        users.create({
            displayName,
            photoUrl: "https://i.hizliresim.com/b6rvi98.png",
            email,
            password: hashedPassword
        }).then((data) => {
            codes.deleteOne({code: inviteCode}).then((data) => {
                return resp.status(201).json({success: true, message: "Kayıt işlemi başarı ile gerçekleştirildi."});
            }).catch((err) => {
                console.log(err);
                return resp.status(500).json({success: false, message: "DB_ERROR"});
            });
        }).catch((err) => {
            console.log(err);
            return resp.status(500).json({success: false, message: "DB_ERROR"});
        });
    }).catch((err) => {
        console.log(err);
        return resp.status(500).json({success: false, message: "DB_ERROR"});
    });

});

router.post("/profile-update", Authorize, (req, resp, next) => {
    const email = req.userEmail;
});

module.exports = router;