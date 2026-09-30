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
        This Privacy Policy explains what information we collect, how we use it, and the choices you
        have. By using the Thantra Astro app you agree to this policy.
      </p>

      <h2 style={h2}>Information We Collect</h2>
      <ul>
        <li>
          <strong>Mobile number:</strong> When you sign in, we collect your mobile number to send a
          one-time password (OTP) and to create and secure your account.
        </li>
        <li>
          <strong>Name and email (optional):</strong> If you register, we may collect your name and
          email address to personalise your account.
        </li>
        <li>
          <strong>Learning activity:</strong> We store which lessons you watch and your video progress
          so you can continue watching where you left off.
        </li>
        <li>
          <strong>Basic device information:</strong> A device identifier may be used to keep your
          session secure and signed in.
        </li>
      </ul>

      <h2 style={h2}>How We Use Your Information</h2>
      <ul>
        <li>To create your account and sign you in securely.</li>
        <li>To show your enrolled lessons and &quot;continue watching&quot; progress.</li>
        <li>To operate, maintain, and improve the app.</li>
        <li>To respond to your support requests.</li>
      </ul>

      <h2 style={h2}>Information Sharing</h2>
      <p>
        We do not sell your personal information. We only share information with service providers
        that help us run the app (for example, secure hosting and SMS/OTP delivery), and only as
        needed to provide the service, or when required by law.
      </p>

      <h2 style={h2}>Data Security</h2>
      <p>
        We use reasonable technical and organisational measures to protect your information. However,
        no method of transmission or storage is completely secure.
      </p>

      <h2 style={h2}>Data Retention</h2>
      <p>
        We keep your information for as long as your account is active or as needed to provide the
        service. You may request deletion of your account and associated data at any time.
      </p>

      <h2 style={h2}>Your Choices</h2>
      <ul>
        <li>You can request access to, correction of, or deletion of your personal data.</li>
        <li>You can stop using the app and request that your account be removed.</li>
      </ul>

      <h2 style={h2}>Children&apos;s Privacy</h2>
      <p>
        The app is intended for a general audience and is not directed to children under 13. We do
        not knowingly collect personal information from children under 13.
      </p>

      <h2 style={h2}>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or wish to request data deletion, please
        contact us:
      </p>
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
