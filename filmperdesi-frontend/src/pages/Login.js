import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Container,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
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
    try {
      const response = await login(formData.identifier, formData.password);
      if (response.jwt) {
        localStorage.setItem("jwt", response.jwt);
        localStorage.setItem("user", JSON.stringify(response.user));
        if (response.user.role === "admin") {
          navigate("/admin/users");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Giriş yapılırken bir hata oluştu"
      );
    }
  };

  return (
    <Box sx={{ height: "100vh", bgcolor: "#f5f5f5" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ height: "100vh" }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Typography variant="h3" component="h2" fontWeight="bold">
              FİLM PERDESİ' ne
            </Typography>
            <Typography variant="h3" component="h2" fontWeight="bold">
              Hoşgeldiniz
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: "80%" }}
            >
              Kitaplardan ilham alan film önerileri keşfedin
            </Typography>
            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <IconButton color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit">
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              mt: 0,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: "bold",
                mb: 4,
              }}
            >
              GİRİŞ FORMU
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                width: "100%",
                maxWidth: 400,
                bgcolor: "white",
                p: 4,
                borderRadius: 2,
              }}
            >
              <TextField
                fullWidth
                name="identifier"
                placeholder="kullanıcı adı"
                variant="outlined"
                margin="normal"
                value={formData.identifier}
                onChange={handleChange}
                sx={{ bgcolor: "#f5f5f5" }}
              />
              <TextField
                fullWidth
                name="password"
                placeholder="şifre"
                type="password"
                variant="outlined"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                sx={{ bgcolor: "#f5f5f5" }}
              />
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
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
                GİRİŞ YAP
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/register")}
                sx={{
                  color: "black",
                  borderColor: "black",
                  "&:hover": {
                    borderColor: "#333",
                    color: "#333",
                  },
                }}
              >
                KAYIT OL
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
