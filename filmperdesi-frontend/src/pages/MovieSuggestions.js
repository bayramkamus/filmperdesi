import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { createMatch } from "../services/api";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";

const TMDB_API_KEY = "dec6112c07b8c832e5f5c9b3e0cd6fa1";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const MovieSuggestions = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBookAndMovie = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Kitap bilgilerini al
        console.log("Kitap ID:", bookId);
        const bookResponse = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        console.log("Kitap yanıtı:", bookResponse.data);
        const bookData = bookResponse.data;
        setBook(bookData);

        // 2. Kitap başlığına göre film ara
        const searchQuery = `${bookData.volumeInfo.title} ${
          bookData.volumeInfo.authors?.[0] || ""
        }`;
        console.log("Film arama sorgusu:", searchQuery);
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
            searchQuery
          )}&language=tr-TR&page=1`
        );
        console.log("Film arama yanıtı:", movieResponse.data);

        if (
          movieResponse.data.results &&
          movieResponse.data.results.length > 0
        ) {
          // İlk 5 sonuç arasından rastgele bir film seç
          const topMovies = movieResponse.data.results.slice(0, 5);
          const randomMovie =
            topMovies[Math.floor(Math.random() * topMovies.length)];
          console.log("Seçilen film:", randomMovie);
          setMovie(randomMovie);
        } else {
          console.log("Film bulunamadı, türe göre aranıyor...");
          // Kitap türüne göre popüler filmlerden öner
          const genreResponse = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=tr-TR&sort_by=popularity.desc&with_genres=18&vote_count.gte=100&page=1`
          );
          console.log("Tür bazlı film yanıtı:", genreResponse.data);

          if (
            genreResponse.data.results &&
            genreResponse.data.results.length > 0
          ) {
            const topMovies = genreResponse.data.results.slice(0, 5);
            const randomMovie =
              topMovies[Math.floor(Math.random() * topMovies.length)];
            console.log("Türe göre seçilen film:", randomMovie);
            setMovie(randomMovie);
          } else {
            setError("Bu kitap için film önerisi bulunamadı.");
          }
        }
      } catch (err) {
        console.error("Film önerisi alınırken hata:", err);
        console.error("Hata detayı:", err.response?.data || err.message);
        setError(
          `Film önerisi alınırken bir hata oluştu: ${
            err.response?.data?.status_message || err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookAndMovie();
    }
  }, [bookId]);

  const handleSaveMatch = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        setErrorMessage("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      const userData = JSON.parse(userStr);

      const matchData = {
        matchData: {
          book: {
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors[0],
          },
          movie: {
            title: movie.title,
            year: movie.release_date,
            overview: movie.overview,
            posterPath: movie.poster_path,
          },
        },
        user: userData.id,
        status: "pending",
      };

      const response = await createMatch(matchData);
      if (response) {
        setSuccessMessage("Eşleşme başarıyla kaydedildi!");
        setTimeout(() => {
          navigate("/library");
        }, 2000);
      }
    } catch (error) {
      console.error("Eşleşme kaydedilirken hata:", error);
      if (error.response?.status === 401) {
        setErrorMessage("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "Eşleşme kaydedilirken bir hata oluştu."
        );
      }
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
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 8,
            fontWeight: "bold",
            letterSpacing: 8,
          }}
        >
          ÖNERİ
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Eşleşme başarıyla kaydedildi! Eşleşmeler sayfasına
            yönlendiriliyorsunuz...
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        {book && movie && (
          <>
            <Box
              sx={{
                display: "flex",
                gap: 4,
                mb: 4,
              }}
            >
              <Card sx={{ flex: 1, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  sx={{ height: 400, objectFit: "cover" }}
                  image={
                    book.volumeInfo.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/400x600?text=Kitap+Kapağı"
                  }
                  alt={book.volumeInfo.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {book.volumeInfo.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.volumeInfo.authors?.[0] || "Bilinmeyen Yazar"}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  sx={{ height: 400, objectFit: "cover" }}
                  image={
                    movie.poster_path
                      ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                      : "https://via.placeholder.com/400x600?text=Film+Posteri"
                  }
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movie.release_date?.split("-")[0] || ""}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Card sx={{ mb: 4, p: 2, boxShadow: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: "#FFD700" }}>
                FİLM
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {movie.overview || "Film açıklaması bulunamadı."}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveMatch}
                disabled={saveSuccess}
                fullWidth
                sx={{ mt: 2 }}
              >
                Eşleşmeyi Kaydet
              </Button>
            </Card>
          </>
        )}
      </Box>
    </Container>
  );
};

export default MovieSuggestions;
