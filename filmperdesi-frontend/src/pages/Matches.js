import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from "@mui/material";
import { getMatches } from "../services/api";

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      setError("Lütfen önce giriş yapın");
      setRedirecting(true);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      return;
    }

    fetchMatches();
  }, [navigate]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMatches();
      setMatches(response.data);
    } catch (err) {
      console.error("Eşleşmeler yüklenirken hata:", err);
      if (err.response?.status === 401) {
        setError("Oturum süresi dolmuş. Lütfen tekrar giriş yapın");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(
          err.response?.data?.message ||
            "Eşleşmeler yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "accepted":
        return "Kabul Edildi";
      case "rejected":
        return "Reddedildi";
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

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
          {redirecting && (
            <Typography variant="body2" color="text.secondary">
              5 saniye içinde giriş sayfasına yönlendirileceksiniz...
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleLoginClick}
            sx={{
              backgroundColor: "#63f",
              "&:hover": {
                backgroundColor: "#52f",
              },
            }}
          >
            Giriş Yap
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Kitap-Film Eşleşmelerim
        </Typography>

        {matches.length === 0 && !error ? (
          <Typography variant="body1" align="center" sx={{ mt: 4 }}>
            Henüz hiç eşleşmeniz bulunmuyor.
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {matches.map((match) => (
              <Grid item xs={12} md={6} key={match._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Kitap
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {match.matchData.book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Yazar: {match.matchData.book.author}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Film
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {match.matchData.movie.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Yıl: {match.matchData.movie.year}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                      }}
                    >
                      <Chip
                        label={getStatusText(match.status)}
                        color={
                          match.status === "accepted"
                            ? "success"
                            : match.status === "rejected"
                            ? "error"
                            : "warning"
                        }
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Matches;
