import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Principal from "./Pages/principal";
import LoginForm from "./Pages/login";
import Relatorio from "./Pages/relatorio";
import Register from "./Pages/register";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já existe uma sessão ativa
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao obter sessão:", error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listener para mudanças no estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função para logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro no logout:", error);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  // Loading spinner enquanto verifica autenticação
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/principal" replace /> : <LoginWrapper />
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/principal" replace /> : <Register />}
        />
        <Route
          path="/principal"
          element={
            <ProtectedRoute user={user}>
              <Principal user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/relatorio"
          element={
            <ProtectedRoute user={user}>
              <Relatorio user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        {/* Rota para capturar URLs inválidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function LoginWrapper() {
  const navigate = useNavigate();

  const handleLogin = (authData) => {
    navigate("/principal");
  };

  return <LoginForm onLogin={handleLogin} />;
}

export default App;
