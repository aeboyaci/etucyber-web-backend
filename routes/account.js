const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");

const Authorize = require("../authorize");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const users = require("../models/account");
const codes = require("../models/invite_code");

router.get("/validate", Authorize, (req, resp) => {
    return resp.status(200).json({ success: true });
});
router.get("/logout", (req, resp) => {
    resp.clearCookie("token", { path: "/", domain: ".etucyber.com" });
    resp.clearCookie("user", { path: "/", domain: ".etucyber.com" });

    return resp.status(200).send();
});

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
        const user = {displayName: data[0].displayName, photoUrl: data[0].photoUrl};

        resp.cookie("token", token, { path: "/", httpOnly: true, secure: true, sameSite: "none", domain: ".etucyber.com" });
        resp.cookie("user", JSON.stringify(user), { path: "/", secure: true, sameSite: "none", domain: ".etucyber.com" });

        return resp.status(200).json({success: true, message: "Sign-in successful", ...user});
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

// Uploads
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/uploads`);
    },
    filename: (req, file, cb) => {
        const fn = file.originalname;
        cb(null, `${new Date().toLocaleString('tr').split(" ")[0].replace(".", "-").replace(".", "-")}_${fn}`);
    },
});
const upload = multer({
    storage: multerStorage
});

router.post("/profile-update/change-avatar", Authorize, upload.single("profilePic"), (req, resp, next) => {
    const email = req.userEmail;
    const photoUrl = `http://localhost:3001/api/uploads/${req.file.filename}`;

    users.updateOne({email}, {$set: { photoUrl }}).then((data) => {
        return resp.status(200).json({success: true, message: "Profil resmi başarı ile güncellendi."});
    }).catch((err) => {
        console.log(err);
        return resp.status(500).json({success: false, message: "Veri tabanı hatası meydana geldi. Profil resmi güncellenemedi."});
    });
});

router.post("/profile-update/change-password", Authorize, (req, resp, next) => {
    const email = req.userEmail;
});

module.exports = router;
