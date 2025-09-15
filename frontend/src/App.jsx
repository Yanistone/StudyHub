import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Layout from "./components/Layout.jsx";

// Écrans (placeholders : adapte les chemins si besoin)
import HomeScreen from "./screens/HomeScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
//import ArticlesListScreen from "./screens/ArticlesListScreen.jsx";
// import ArticleDetailScreen from "./screens/ArticleDetailScreen.jsx";
// import SubmitArticleScreen from "./screens/SubmitArticleScreen.jsx";
// import AdminDashboardScreen from "./screens/AdminDashboardScreen.jsx";

function AuthStatus() {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/", { replace: true });
  };

  return (
    <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
      {isAuthed ? (
        <>
          <span>Connecté</span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </>
      ) : (
        <Link to="/login">Se connecter</Link>
      )}
    </div>
  );
}

function AppShell({ children }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <AuthStatus />
      </header>
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppShell>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            {/* <Route path="/articles" element={<ArticlesListScreen />} /> */}
            {/* <Route path="/articles/:slug" element={<ArticleDetailScreen />} /> */}

            {/* Protégé */}
            {/* <Route element={<ProtectedRoutes />}>
              <Route path="/submit" element={<SubmitArticleScreen />} />
              <Route path="/admin" element={<AdminDashboardScreen />} />
            </Route> */}

            {/* 404 */}
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </AppShell>
      </Layout>
    </BrowserRouter>
  );
}
