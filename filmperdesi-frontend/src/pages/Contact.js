import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { createMessage } from "../services/api";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("jwt");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        navigate("/login");
        return;
      }

      const messageData = {
        subject: formData.subject,
        content: formData.content,
        status: "new",
      };

      const response = await createMessage(messageData);

      if (response) {
        setSuccess(true);
        setFormData({ subject: "", content: "" });
        setTimeout(() => {
          navigate("/messages");
        }, 2000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message || "Mesaj gönderilirken bir hata oluştu"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          İletişim
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          Bizimle iletişime geçmek için aşağıdaki formu doldurun.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <TextField
            label="Konu"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Mesajınız"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            multiline
            rows={4}
            fullWidth
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Mesajınız başarıyla gönderildi! Mesajlar sayfasına
              yönlendiriliyorsunuz...
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#63f",
              "&:hover": {
                backgroundColor: "#52f",
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Gönder"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Contact;
