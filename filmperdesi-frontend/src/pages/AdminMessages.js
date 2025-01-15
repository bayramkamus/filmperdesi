import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllMessages, deleteMessage } from "../services/api";

const AdminMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchMessages();
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getAllMessages();
      setMessages(response.data);
    } catch (err) {
      setError("Mesajlar yüklenirken bir hata oluştu");
      console.error("Mesajlar yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setSuccessMessage("Mesaj başarıyla silindi");
      setMessages(messages.filter((message) => message._id !== messageId));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Mesaj silinirken bir hata oluştu");
      console.error("Mesaj silme hatası:", err);
      setTimeout(() => setError(""), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "warning";
      case "inProgress":
        return "info";
      case "resolved":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "new":
        return "Yeni";
      case "inProgress":
        return "İşlemde";
      case "resolved":
        return "Çözüldü";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Mesaj Yönetimi
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Gönderen</TableCell>
                <TableCell>Konu</TableCell>
                <TableCell>İçerik</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message._id}>
                  <TableCell>
                    {message.user?.username || "Silinmiş Kullanıcı"}
                  </TableCell>
                  <TableCell>{message.messageData.subject}</TableCell>
                  <TableCell>{message.messageData.content}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(message.status)}
                      color={getStatusColor(message.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(message.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleDeleteMessage(message._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default AdminMessages;
