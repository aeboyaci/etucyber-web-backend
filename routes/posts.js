const express = require("express");
const router = express.Router();

const posts = require("../models/post");
const users = require("../models/account");
const Authorize = require("../authorize");

router.get("/", (req, resp) => {
    posts.find({}).then((data) => {
        return resp.status(200).json(data);
    }).catch((err) => {
        return resp.status(500).json({success: false, message: "DB_ERROR"});
    });
});

router.get("/my-posts", Authorize, (req, resp) => {
    const email = req.userEmail;

    posts.find({email}).then((data) => {
        return resp.status(200).json(data);
    }).catch((err) => {
        return resp.status(500).json({success: false, message: "DB_ERROR"});
    });
});

router.get("/by-id/:id", Authorize, (req, resp) => {
    const email = req.userEmail;
    const {id} = req.params;
    console.log(email, id);

    posts.find({"_id": id, email}).then((data) => {
        if (data.length === 0) return resp.status(404).json({sucess: false});

        return resp.status(200).json({success: true, post: data[0]});
    }).catch((err) => {
        return resp.status(500).json({success: false, message: "DB_ERROR"});
    });
});

router.get("/:title", (req, resp) => {
    const {title} = req.params;

    posts.find({title}).then((data) => {
        if (data.length === 0) return resp.status(404).json(data);

        return resp.status(200).json(data[0]);
    }).catch((err) => {
        return resp.status(500).json({success: false, message: "DB_ERROR"});
    });
});


router.post("/", Authorize, (req, resp) => {
    const email = req.userEmail;
    const {imageUrl, title, description, isActive, html} = req.body;
    console.log(email);
    console.table(req.body);

    users.find({email}).then((data) => {
        const {displayName, photoUrl} = data[0];
        const createdAt = new Date().toLocaleString("tr").split(" ")[0].replace(".", "/").replace(".", "/");

        posts.create({
            imageUrl,
            title,
            description,
            isActive,
            html,
            displayName,
            photoUrl,
            createdAt,
            email
        }).then((data) => {
            return resp.status(201).json({ success: true, message: "Gönderi başarılı bir şekilde oluşturuldu." });
        }).catch((err) => {
            return resp.status(500).json({success: false, message: "Veri tabanı hatası meydana geldi."});
        });
    }).catch((err) => {
        return resp.status(500).json({success: false, message: "Veri tabanı hatası meydana geldi."});
    });
});

router.post("/by-id/:id", Authorize, async (req, resp) => {
    const email = req.userEmail;
    const { id } = req.params;

    let post = await posts.findOne({email, "_id": id});

    if (!post) return resp.status(404).json({ success: false, message: "Gönderi bulunamadı." });

    for (let key in req.body) {
        post[key] = req.body[key];
    }

    await post.save();

    return resp.status(200).json({ success: true, message: "Gönderi başarılı bir şekilde güncellendi." });
});

router.get("/delete/by-id/:id", Authorize, async (req, resp) => {
    const email = req.userEmail;
    const { id } = req.params;
    console.log(email, id);

    let post = await posts.findOne({email, "_id": id});

    if (!post) return resp.status(404).json({ success: false, message: "Gönderi bulunamadı." });

    await posts.deleteOne({email, "_id": id});

    return resp.status(200).json({ success: true, message: "Gönderi başarılı bir şekilde silindi." });
});


module.exports = router;