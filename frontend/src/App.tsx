import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { ShieldCheck, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Demo from "@/pages/Demo";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "@/components/ProtectedRoute";

function NavBar() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="border-b px-6 py-4 flex items-center gap-6">
      <NavLink to="/" className="text-lg font-bold hover:text-primary flex items-center gap-2">
        <ShieldCheck className="h-5 w-5" />
        Fraud Detection
      </NavLink>
      <div className="ml-auto flex items-center gap-4">
        {isLoading ? null : isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`
              }
            >
              <LogIn className="h-4 w-4" />
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 ${isActive ? "opacity-90" : ""}`
              }
            >
              <UserPlus className="h-4 w-4" />
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <NavBar />

        <main className="mx-auto max-w-6xl px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/demo" element={<ProtectedRoute><Demo /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
