const express = require("express");
const router = express.Router();
const Match = require("../models/Match");
const auth = require("../middleware/auth");

// Tüm eşleşmeleri getir
router.get("/", auth, async (req, res) => {
  try {
    const matches = await Match.find({ user: req.user.id })
      .populate("user", "username email")
      .sort("-createdAt");
    res.json({ data: matches });
  } catch (error) {
    res.status(500).json({ message: "Eşleşmeler getirilemedi" });
  }
});

// Yeni eşleşme oluştur
router.post("/", auth, async (req, res) => {
  try {
    const match = new Match({
      user: req.user.id,
      matchData: req.body.matchData,
      status: req.body.status || "pending",
    });

    await match.save();
    res.status(201).json({ data: match });
  } catch (error) {
    res.status(500).json({ message: "Eşleşme oluşturulamadı" });
  }
});

// Eşleşme durumunu güncelle
router.put("/:id", auth, async (req, res) => {
  try {
    const match = await Match.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: req.body.status },
      { new: true }
    );

    if (!match) {
      return res.status(404).json({ message: "Eşleşme bulunamadı" });
    }

    res.json({ data: match });
  } catch (error) {
    res.status(500).json({ message: "Eşleşme güncellenemedi" });
  }
});

// Eşleşme sil
router.delete("/:id", auth, async (req, res) => {
  try {
    const match = await Match.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!match) {
      return res.status(404).json({ message: "Eşleşme bulunamadı" });
    }

    res.json({ message: "Eşleşme başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Eşleşme silinemedi" });
  }
});

module.exports = router;
