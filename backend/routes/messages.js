const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const auth = require("../middleware/auth");

// Tüm mesajları getir
router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("user", "username email")
      .sort("-createdAt");
    res.json({ data: messages });
  } catch (error) {
    res.status(500).json({ message: "Mesajlar getirilemedi" });
  }
});

// Yeni mesaj oluştur
router.post("/", auth, async (req, res) => {
  try {
    const message = new Message({
      user: req.user.id,
      messageData: {
        subject: req.body.subject,
        content: req.body.content,
        status: "new",
      },
    });

    await message.save();
    res.status(201).json({ data: message });
  } catch (error) {
    res.status(500).json({ message: "Mesaj oluşturulamadı" });
  }
});

// Mesaj güncelle (yanıtla)
router.put("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Mesaj bulunamadı" });
    }

    message.messageData.response = req.body.response;
    message.messageData.status = req.body.status || "resolved";

    await message.save();
    res.json({ data: message });
  } catch (error) {
    res.status(500).json({ message: "Mesaj güncellenemedi" });
  }
});

// Mesaj sil
router.delete("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!message) {
      return res.status(404).json({ message: "Mesaj bulunamadı" });
    }

    res.json({ message: "Mesaj başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Mesaj silinemedi" });
  }
});

module.exports = router;
