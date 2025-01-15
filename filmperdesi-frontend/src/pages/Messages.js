import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getMessages, updateMessage } from "../services/api";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await getMessages();
      setMessages(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Mesajlar yüklenirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (messageId) => {
    setSubmitting({ ...submitting, [messageId]: true });
    try {
      const messageData = {
        messageData: {
          response: responses[messageId],
          status: "resolved",
        },
      };

      await updateMessage(messageId, messageData);
      fetchMessages();
      setResponses({ ...responses, [messageId]: "" });
    } catch (err) {
      setError(
        err.response?.data?.message || "Yanıt gönderilirken bir hata oluştu"
      );
    } finally {
      setSubmitting({ ...submitting, [messageId]: false });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "error";
      case "in_progress":
        return "warning";
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
      case "in_progress":
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
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Mesajlar
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {messages.map((message) => (
            <Grid item xs={12} key={message._id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {message.messageData.subject}
                    </Typography>
                    <Chip
                      label={getStatusText(message.messageData.status)}
                      color={getStatusColor(message.messageData.status)}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-wrap", mb: 2 }}
                  >
                    {message.messageData.content}
                  </Typography>

                  {message.messageData.response && (
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        Yanıt:
                      </Typography>
                      <Typography variant="body2">
                        {message.messageData.response}
                      </Typography>
                    </Box>
                  )}

                  {message.messageData.status !== "resolved" && (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        label="Yanıtınız"
                        multiline
                        rows={3}
                        value={responses[message._id] || ""}
                        onChange={(e) =>
                          setResponses({
                            ...responses,
                            [message._id]: e.target.value,
                          })
                        }
                        sx={{ mb: 2 }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleResponse(message._id)}
                        disabled={
                          submitting[message._id] ||
                          !responses[message._id]?.trim()
                        }
                        sx={{
                          backgroundColor: "#63f",
                          "&:hover": {
                            backgroundColor: "#52f",
                          },
                        }}
                      >
                        {submitting[message._id] ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Yanıtla"
                        )}
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Messages;
