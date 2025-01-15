import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { Facebook, Instagram, Twitter, Google } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";

const SocialButton = styled(IconButton)(({ theme }) => ({
  border: "1px solid #000",
  borderRadius: "50%",
  padding: "8px",
  margin: "0 8px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
}));

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await register(
        formData.username,
        formData.email,
        formData.password
      );

      if (response.jwt) {
        // JWT'yi localStorage'a kaydet
        localStorage.setItem("jwt", response.jwt);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Kayıt başarılı, /home rotasına yönlendir
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Kayıt işlemi sırasında bir hata oluştu"
      );
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Sol taraf - Hoş geldiniz mesajı */}
        <Box sx={{ flex: 1, pr: 4 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            FİLM PERDESİ' ne
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            Hoşgeldiniz
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Kitaplardan ilham alan film önerileri keşfedin
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Google />}
              sx={{
                textTransform: "none",
                color: "black",
                borderColor: "black",
                mr: 2,
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              Google ile Giriş Yap
            </Button>
          </Box>

          <Box sx={{ mt: 4 }}>
            <SocialButton>
              <Facebook />
            </SocialButton>
            <SocialButton>
              <Instagram />
            </SocialButton>
            <SocialButton>
              <Twitter />
            </SocialButton>
          </Box>
        </Box>

        {/* Sağ taraf - Kayıt formu */}
        <Box sx={{ flex: 1, pl: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            KAYIT FORMU
          </Typography>
          <form onSubmit={handleSubmit}>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              name="username"
              placeholder="kullanıcı adı"
              value={formData.username}
              onChange={handleChange}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="eposta giriniz"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              fullWidth
              name="password"
              type="password"
              placeholder="şifrenizi giriniz"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 4 }}
              variant="outlined"
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "black",
                color: "white",
                "&:hover": {
                  bgcolor: "#333",
                },
              }}
            >
              KAYIT OL
            </Button>
            <Button
              component="a"
              href="/login"
              fullWidth
              sx={{ textTransform: "none" }}
            >
              Zaten hesabınız var mı? Giriş yapın
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
