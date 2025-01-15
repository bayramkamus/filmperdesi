const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT Secret key'i .env dosyasından al
const JWT_SECRET = process.env.JWT_SECRET;

// Kayıt olma controller'ı
exports.register = async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;
    console.log("Kayıt isteği alındı:", { username, email, isAdmin });

    // Kullanıcı kontrolü
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Bu e-posta veya kullanıcı adı zaten kullanılıyor",
      });
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      username,
      email,
      password,
      role: isAdmin ? "admin" : "user",
    });

    await user.save();
    console.log("Yeni kullanıcı oluşturuldu:", user);

    // JWT token oluştur
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      jwt: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    res.status(500).json({ message: "Kayıt işlemi başarısız oldu" });
  }
};

// Giriş yapma controller'ı
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log("Giriş isteği alındı:", { identifier });

    // Kullanıcıyı bul
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Kullanıcı adı/e-posta veya şifre hatalı",
      });
    }

    // Şifre kontrolü
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Kullanıcı adı/e-posta veya şifre hatalı",
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      jwt: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Giriş hatası:", error);
    res.status(500).json({ message: "Giriş işlemi başarısız oldu" });
  }
};
