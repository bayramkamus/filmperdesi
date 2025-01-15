import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Lütfen bir arama terimi girin");
      return;
    }

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=10&langRestrict=tr`
      );

      if (response.data.totalItems === 0) {
        setError("Kitap bulunamadı");
        return;
      }

      const formattedBooks = response.data.items.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors
          ? item.volumeInfo.authors[0]
          : "Bilinmiyor",
        publishedDate: item.volumeInfo.publishedDate
          ? item.volumeInfo.publishedDate.substring(0, 4)
          : "Bilinmiyor",
        coverImage: item.volumeInfo.imageLinks
          ? item.volumeInfo.imageLinks.thumbnail
          : "https://via.placeholder.com/128x196?text=Resim+Yok",
        description: item.volumeInfo.description || "Açıklama bulunmuyor",
      }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error("Kitap arama hatası:", error);
      setError("Kitaplar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/movie-suggestions/${bookId}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/vintage-projector-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            sx={{
              color: "#1976d2",
              fontWeight: "bold",
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Film Perdesi
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{
              color: "#FFF",
              mb: 4,
              opacity: 0.9,
              maxWidth: "800px",
              mx: "auto",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Kitaplardan İlham Alan Filmler Dünyasına Hoş Geldiniz
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              maxWidth: 600,
              mx: "auto",
              mb: 4,
              px: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Kitap ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 1,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{
                bgcolor: "#1976d2",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#1565c0",
                },
                minWidth: 120,
                borderRadius: 1,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                py: 1.5,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Kitap Ara"
              )}
            </Button>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                maxWidth: 600,
                mx: "auto",
                bgcolor: "rgba(253, 237, 237, 0.9)",
              }}
            >
              {error}
            </Alert>
          )}

          <Grid container spacing={3} sx={{ px: 2 }}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    },
                  }}
                  onClick={() => handleBookClick(book.id)}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    image={book.coverImage}
                    alt={book.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      {book.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {book.author}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {book.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
