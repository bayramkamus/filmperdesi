const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Bu işlem için admin yetkisi gerekiyor" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Yetki kontrolü yapılamadı" });
  }
};
