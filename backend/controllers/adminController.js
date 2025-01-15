const User = require("../models/User");
const Message = require("../models/Message");

// Tüm kullanıcıları listele
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Kullanıcılar getirilemedi" });
  }
};

// Kullanıcı sil
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin kullanıcılar silinemez" });
    }
    await user.remove();
    res.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silinemedi" });
  }
};

// Tüm mesajları listele
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("user", "username email")
      .sort("-createdAt");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Mesajlar getirilemedi" });
  }
};

// Mesaj durumunu güncelle
exports.updateMessageStatus = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Mesaj bulunamadı" });
    }

    message.messageData.status = req.body.status;
    if (req.body.response) {
      message.messageData.response = req.body.response;
    }

    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Mesaj güncellenemedi" });
  }
};
