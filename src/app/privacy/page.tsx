import React from "react";

export const metadata = {
  title: "Privacy Policy — Thantra Astro",
  description: "Privacy Policy for the Thantra Astro app.",
};

export default function PrivacyPolicyPage() {
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
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Privacy Policy</h1>
      <p style={{ color: "#6b7280", marginTop: 0 }}>Thantra Astro • Last updated: 30 September 2026</p>

      <p>
        Thantra Astro (&quot;we&quot;, &quot;our&quot;, or &quot;the app&quot;) respects your privacy.
        The app is free to use and lets you watch astrology lessons without creating an account or
        signing in. This Privacy Policy explains our practices.
      </p>

      <h2 style={h2}>Information We Collect</h2>
      <p>
        Thantra Astro does <strong>not require you to log in</strong> and does{" "}
        <strong>not ask you for personal information</strong> such as your name, phone number, or
        email to watch lessons. We do not collect or store personal data that identifies you.
      </p>
      <p>
        Like most apps and websites, standard, non-identifying technical data (such as basic device
        or network information) may be processed by our hosting and content-delivery providers purely
        to load and display the lessons reliably.
      </p>

      <h2 style={h2}>How Information Is Used</h2>
      <ul>
        <li>To load and display astrology video lessons in the app.</li>
        <li>To operate, maintain, and improve the app.</li>
      </ul>

      <h2 style={h2}>Information Sharing</h2>
      <p>
        We do not sell any information. We only rely on service providers (such as secure hosting and
        content delivery) needed to run the app, or as required by law.
      </p>

      <h2 style={h2}>Data Security</h2>
      <p>
        We use reasonable technical measures to keep the app secure. However, no method of
        transmission or storage over the internet is completely secure.
      </p>

      <h2 style={h2}>Children&apos;s Privacy</h2>
      <p>
        The app is intended for a general audience and is not directed to children under 13. We do
        not knowingly collect personal information from children.
      </p>

      <h2 style={h2}>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us:</p>
      <ul>
        <li>Phone / WhatsApp: 8639870841</li>
        <li>App: Thantra Astro (Learn Astrology)</li>
      </ul>

      <h2 style={h2}>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page
        with an updated date.
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
