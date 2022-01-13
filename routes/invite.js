const express = require("express");
const router = express.Router();
const Authorize = require("../authorize");

const inviteCodes = require("../models/invite_code");

router.post("/", Authorize, (req, resp) => {
   const { inviteCode } = req.body;

   inviteCodes.create({
       code: inviteCode
   }).then((data) => {
       return resp.status(201).json({success: true, message: "Davet kodu başarı ile oluşturuldu."});
   }).catch((err) => {
       console.log(err);
       return resp.status(500).json({success: false, message: "Veri tabanı hatası meydana geldi. Kod oluşturulamadı."});
   });
});

module.exports = router;