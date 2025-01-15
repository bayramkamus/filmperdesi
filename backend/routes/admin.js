const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Message = require("../models/Message");
const auth = require("../middleware/auth");
const adminMiddleware = require("../middleware/adminMiddleware");

// Tüm kullanıcıları getir
router.get("/users", [auth, adminMiddleware], async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json({ data: users });
  } catch (error) {
    console.error("Kullanıcılar getirilirken hata:", error);
    res.status(500).json({ message: "Kullanıcılar getirilemedi" });
  }
});

// Kullanıcı sil
router.delete("/users/:id", [auth, adminMiddleware], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin kullanıcılar silinemez" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    console.error("Kullanıcı silinirken hata:", error);
    res.status(500).json({ message: "Kullanıcı silinemedi" });
  }
});

// Tüm mesajları getir
router.get("/messages", [auth, adminMiddleware], async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("user", "username email")
      .sort("-createdAt");
    res.json({ data: messages });
  } catch (error) {
    console.error("Mesajlar getirilirken hata:", error);
    res.status(500).json({ message: "Mesajlar getirilemedi" });
  }
});

// Mesaj sil
router.delete("/messages/:id", [auth, adminMiddleware], async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Mesaj bulunamadı" });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Mesaj başarıyla silindi" });
  } catch (error) {
    console.error("Mesaj silinirken hata:", error);
    res.status(500).json({ message: "Mesaj silinemedi" });
  }
});

module.exports = router;
