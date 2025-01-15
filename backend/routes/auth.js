const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Kayıt olma route'u
router.post("/register", register);

// Giriş yapma route'u
router.post("/login", login);

module.exports = router;
