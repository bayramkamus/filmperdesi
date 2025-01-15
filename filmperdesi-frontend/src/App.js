import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Library from "./pages/Library";
import MovieSuggestions from "./pages/MovieSuggestions";
import Messages from "./pages/Messages";
import Contact from "./pages/Contact";
import Matches from "./pages/Matches";
import Navbar from "./components/Navbar";
import { ThemeProvider, createTheme, Box } from "@mui/material";
import AdminUsers from "./pages/AdminUsers";
import AdminMessages from "./pages/AdminMessages";

const theme = createTheme({
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
  },
});

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("jwt");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {shouldShowNavbar && <Navbar />}
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie-suggestions/:bookId"
            element={
              <ProtectedRoute>
                <MovieSuggestions />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
