import React, { useState, useEffect } from "react";
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
  InputAdornment,
  Modal,
  IconButton,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Library = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem("jwt");

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  const fetchPopularBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=8&langRestrict=tr"
      );
      setPopularBooks(response.data.items || []);
    } catch (error) {
      console.error("Popüler kitaplar yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&langRestrict=tr&maxResults=20`
      );
      setSearchResults(response.data.items || []);
    } catch (error) {
      console.error("Arama sırasında hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleMatch = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/movie-suggestions/${selectedBook.id}`);
  };

  const renderBookCard = (book) => {
    const { volumeInfo } = book;
    return (
      <Grid item xs={12} sm={6} md={3} key={book.id}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.02)",
              cursor: "pointer",
            },
          }}
          onClick={() => handleBookClick(book)}
        >
          <CardMedia
            component="img"
            height="250"
            image={
              volumeInfo.imageLinks?.thumbnail ||
              "https://via.placeholder.com/150x200?text=Resim+Yok"
            }
            alt={volumeInfo.title}
            sx={{ objectFit: "contain", pt: 2 }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h6" component="div" noWrap>
              {volumeInfo.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              noWrap
            >
              {volumeInfo.authors?.join(", ") || "Yazar bilgisi yok"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {volumeInfo.publishedDate?.split("-")[0] || "Yayın tarihi yok"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Kütüphane
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Kitap adı, yazar veya konu ara..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: "white" }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{
              backgroundColor: "#63f",
              "&:hover": {
                backgroundColor: "#52f",
              },
              minWidth: "100px",
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Ara"}
          </Button>
        </Box>

        {!searchResults.length && (
          <>
            <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3 }}>
              Popüler Kitaplar
            </Typography>
            <Grid container spacing={3}>
              {popularBooks.map((book) => renderBookCard(book))}
            </Grid>
          </>
        )}

        {searchResults.length > 0 && (
          <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
              Arama Sonuçları
            </Typography>
            <Grid container spacing={3}>
              {searchResults.map((book) => renderBookCard(book))}
            </Grid>
          </>
        )}

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="book-modal-title"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "70%", md: "60%" },
              maxWidth: 800,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            {selectedBook && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" component="h2" gutterBottom>
                    {selectedBook.volumeInfo.title}
                  </Typography>
                  <IconButton
                    onClick={() => setModalOpen(false)}
                    sx={{ mt: -1, mr: -1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <img
                      src={
                        selectedBook.volumeInfo.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/150x200?text=Resim+Yok"
                      }
                      alt={selectedBook.volumeInfo.title}
                      style={{
                        width: "100%",
                        maxWidth: "200px",
                        height: "auto",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Yazar:</strong>{" "}
                      {selectedBook.volumeInfo.authors?.join(", ") ||
                        "Yazar bilgisi yok"}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Yayın Tarihi:</strong>{" "}
                      {selectedBook.volumeInfo.publishedDate ||
                        "Tarih bilgisi yok"}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Sayfa Sayısı:</strong>{" "}
                      {selectedBook.volumeInfo.pageCount || "Bilgi yok"}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Açıklama:</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      {selectedBook.volumeInfo.description ||
                        "Kitap açıklaması bulunmuyor."}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleMatch}
                      sx={{
                        mt: 2,
                        backgroundColor: "#63f",
                        "&:hover": {
                          backgroundColor: "#52f",
                        },
                      }}
                    >
                      Film Eşleştir
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default Library;
