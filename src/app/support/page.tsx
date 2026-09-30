import React from "react";

export const metadata = {
  title: "Support — Thantra Astro",
  description: "Support and contact information for the Thantra Astro app.",
};

export default function SupportPage() {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "32px 20px 64px",
        background: "#ffffff",
        color: "#1c1c1e",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        lineHeight: 1.6,
        WebkitUserSelect: "text",
        userSelect: "text",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Support</h1>
      <p style={{ color: "#6b7280", marginTop: 0 }}>Thantra Astro — Learn Astrology</p>

      <p>
        Need help with the Thantra Astro app? We are happy to assist you with sign-in, lessons,
        playback, or account questions.
      </p>

      <h2 style={h2}>Contact Us</h2>
      <ul>
        <li>Phone / WhatsApp: 8639870841</li>
        <li>Alternate: 9182107145</li>
      </ul>

      <h2 style={h2}>Common Help</h2>
      <ul>
        <li>
          <strong>Sign in:</strong> Enter your mobile number and the OTP sent to it to access your
          lessons.
        </li>
        <li>
          <strong>Continue watching:</strong> After signing in, your video progress is saved so you
          can resume where you left off.
        </li>
        <li>
          <strong>Video not playing:</strong> Please check your internet connection and try again.
        </li>
      </ul>

      <h2 style={h2}>Account Deletion</h2>
      <p>
        To request deletion of your account and associated data, contact us at the phone number above.
      </p>

      <h2 style={h2}>Privacy</h2>
      <p>
        Read our{" "}
        <a href="/privacy" style={{ color: "#007aff" }}>
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

const h2: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  marginTop: 28,
  marginBottom: 8,
};
