import { useEffect } from "react";

export default function HomeScreen() {
  useEffect(() => {
    document.title = "StudyHub — Accueil";
  }, []);

  return (
    <section>
      <h1 style={{ margin: 0, fontSize: 28 }}>Bienvenue sur StudyHub</h1>
      <p style={{ marginTop: 8, lineHeight: 1.6 }}>
        Cette base de connaissances vous permet de rechercher, consulter et
        proposer des fiches pour partager les bonnes pratiques rencontrées
        durant le cursus.
      </p>
    </section>
  );
}
