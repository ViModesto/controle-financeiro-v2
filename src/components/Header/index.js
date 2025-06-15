import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar página atual baseada na rota
  const currentPage = location.pathname === "/relatorio" ? "reports" : "main";

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      onLogout();
    }
  };

  const handlePageChange = (page) => {
    if (page === "main") {
      navigate("/principal");
    } else if (page === "reports") {
      navigate("/relatorio");
    }
  };

  return (
    <>
      {/* Header principal */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backgroundColor: "#6041BF",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <div>
          {/* <h2 style={{ margin: 0, color: "#fff" }}>
            Bem-vindo, {user?.nome || user?.email || "Usuário"}!
          </h2> */}
          <h2 style={{ margin: 0, color: "#fff" }}>
            Bem-vindo, {user?.nome?.trim() ? user.nome : "Administrador"}!
          </h2>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.9rem", color: "#fff" }}>
            ID: {user?.id?.slice(0, 8)}...
          </span>

          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Barra de navegação */}
      <nav
        style={{
          backgroundColor: "#fff",
          padding: "0 2rem",
          borderBottom: "1px solid #e9ecef",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", gap: "2rem" }}>
          <button
            onClick={() => handlePageChange("main")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 0",
              backgroundColor: "transparent",
              border: "none",
              borderBottom:
                currentPage === "main"
                  ? "3px solid #8B5CF6"
                  : "3px solid transparent",
              color: currentPage === "main" ? "#8B5CF6" : "#6B7280",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: currentPage === "main" ? "600" : "400",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (currentPage !== "main") {
                e.target.style.color = "#374151";
              }
            }}
            onMouseOut={(e) => {
              if (currentPage !== "main") {
                e.target.style.color = "#6B7280";
              }
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>🏠</span>
            Principal
          </button>

          <button
            onClick={() => handlePageChange("reports")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 0",
              backgroundColor: "transparent",
              border: "none",
              borderBottom:
                currentPage === "reports"
                  ? "3px solid #8B5CF6"
                  : "3px solid transparent",
              color: currentPage === "reports" ? "#8B5CF6" : "#6B7280",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: currentPage === "reports" ? "600" : "400",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (currentPage !== "reports") {
                e.target.style.color = "#374151";
              }
            }}
            onMouseOut={(e) => {
              if (currentPage !== "reports") {
                e.target.style.color = "#6B7280";
              }
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>📊</span>
            Relatórios
          </button>
        </div>
      </nav>
    </>
  );
};

export default Header;
