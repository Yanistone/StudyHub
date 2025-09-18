import { useEffect } from "react";

export default function HomeScreen() {
  useEffect(() => {
    document.title = "StudyHub";
  }, []);

  const styles = {
    home: {
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      background: 'none',
    },
    title: {
      fontSize: '42px',
      fontWeight: 800,
      color: '#111827',
      margin: 0,
    },
    spanWrapper: {
      position: 'relative',
      display: 'inline-block',
    },
    underline: {
      position: 'absolute',
      left: 0,
      bottom: -6,
      width: '100%',
      height: 4,
      backgroundColor: '#4b5563',
      borderRadius: 2,
    },
    spanText: {
      color: '#4b5563',
    },
    text: {
      marginTop: 20,
      maxWidth: 700,
      fontSize: 18,
      lineHeight: 1.6,
      color: '#374151',
    },
  };

  return (
    <section style={styles.home}>
      <h1 style={styles.title}>
        Bienvenue sur{' '}
        <span style={styles.spanWrapper}>
          <span style={styles.spanText}>StudyHub</span>
          <span style={styles.underline}></span>
        </span>
      </h1>
      <p style={styles.text}>
        Cette base de connaissances vous permet de rechercher, consulter et
        proposer des fiches pour partager les bonnes pratiques rencontrées
        durant le cursus.
      </p>
    </section>
  );
}
