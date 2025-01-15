import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmailIcon from "@mui/icons-material/Email";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("jwt");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 1 }}>
      <Toolbar>
        <MenuBookIcon sx={{ color: "black", mr: 2 }} />
        <Typography
          variant="h6"
          component={Link}
          to={isAdmin ? "/admin/users" : "/home"}
          sx={{
            flexGrow: 1,
            color: "black",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          FİLM PERDESİ
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {isAuthenticated && !isAdmin && (
            <>
              <Button component={Link} to="/home" sx={{ color: "black" }}>
                ANASAYFA
              </Button>
              <Button component={Link} to="/library" sx={{ color: "black" }}>
                KÜTÜPHANE
              </Button>
              <Button component={Link} to="/contact" sx={{ color: "black" }}>
                İLETİŞİM
              </Button>
              <Button component={Link} to="/matches" sx={{ color: "black" }}>
                EŞLEŞMELER
              </Button>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <Button
                component={Link}
                to="/admin/users"
                sx={{ color: "black" }}
              >
                KULLANICILAR
              </Button>
              <Button
                component={Link}
                to="/admin/messages"
                sx={{ color: "black" }}
                startIcon={<EmailIcon />}
              >
                MESAJLAR
              </Button>
            </>
          )}

          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: "#63f",
              color: "white",
              "&:hover": {
                backgroundColor: "#52f",
              },
            }}
          >
            ÇIKIŞ YAP
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
