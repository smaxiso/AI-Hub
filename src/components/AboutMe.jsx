import React from "react";
import "../index.css";
import theme from "../theme";

const aboutMeStyles = {
  background: theme.background,
  color: theme.text,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: theme.fontFamily,
  padding: "2rem",
};

const cardStyles = {
  background: theme.card,
  boxShadow: theme.boxShadow,
  borderRadius: theme.borderRadius,
  padding: "2rem 3rem",
  maxWidth: "500px",
  textAlign: "center",
};

export default function AboutMe() {
  return (
    <div style={aboutMeStyles}>
      <div style={cardStyles}>
        <h1 style={{ color: theme.primary }}>About Me</h1>
        <p>
          Welcome to AI-Hub! I’m Sumit, a passionate developer and AI enthusiast. This platform is designed to help you discover, compare, and explore the latest AI tools with a premium, modern experience.
        </p>
        <p>
          Feel free to reach out, share feedback, or connect for collaboration. Enjoy exploring AI-Hub!
        </p>
      </div>
    </div>
  );
}
