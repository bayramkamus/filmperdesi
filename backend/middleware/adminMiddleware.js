const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Bu işlem için yönetici yetkisi gerekiyor",
      });
    }

    next();
  } catch (error) {
    console.error("Admin yetki kontrolü hatası:", error);
    res.status(500).json({
      message: "Yetkilendirme kontrol edilemedi",
    });
  }
};

module.exports = adminMiddleware;
