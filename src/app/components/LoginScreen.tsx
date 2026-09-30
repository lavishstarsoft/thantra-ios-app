"use client";

import React, { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { getDeviceId, setSession } from "../lib/session";

interface LoginScreenProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "phone" | "otp";

export default function LoginScreen({ onClose, onSuccess }: LoginScreenProps) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [needsRegister, setNeedsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = async (purpose?: "login" | "register") => {
    setError(null);
    if (phone.trim().length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/public/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), ...(purpose ? { purpose } : {}) }),
      });
      const json = await res.json();
      if (res.ok) {
        setStep("otp");
      } else if (json.requiresRegistration) {
        // New user: switch to register mode and resend so an OTP is actually sent.
        setNeedsRegister(true);
        await sendOtp("register");
        return;
      } else {
        setError(json.error?.toString?.() || "Could not send OTP. Try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError(null);
    if (otp.trim().length < 4) {
      setError("Please enter the OTP.");
      return;
    }
    if (needsRegister && (name.trim().length < 2 || !/^[^@]+@[^@]+\.[^@]+$/.test(email.trim()))) {
      setError("Please enter your name and a valid email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/public/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          otp: otp.trim(),
          deviceId: getDeviceId(),
          ...(needsRegister ? { name: name.trim(), email: email.trim() } : {}),
        }),
      });
      const json = await res.json();
      if (res.ok && json.accessToken) {
        setSession(json.user, json.accessToken, json.refreshToken);
        onSuccess();
      } else if (json.requiresRegistration) {
        setNeedsRegister(true);
        setError("Please complete your details to continue.");
      } else {
        setError(json.error?.toString?.() || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col ios-modal-in">
      {/* Nav */}
      <div className="ios-nav-bar flex items-center px-4 relative">
        <button
          className="ios-clickable text-[#007aff] flex items-center absolute left-2 h-full px-2"
          onClick={() => (step === "otp" ? setStep("phone") : onClose())}
        >
          <IoChevronBack size={26} className="-ml-1" />
          <span className="text-[17px] -ml-0.5">Back</span>
        </button>
        <h1 className="ios-nav-title flex-1 text-center">Sign In</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-8 safe-area-pb">
        <div className="text-center mb-8">
          <img
            src="/thantra-logo.png"
            alt="Thantra Astro"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-md border border-gray-200 bg-black"
          />
          <h2 className="text-[26px] font-bold text-gray-900 mb-1 tracking-tight">
            {step === "phone" ? "Welcome to Thantra" : "Verify OTP"}
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed">
            {step === "phone"
              ? "Enter your mobile number to continue learning."
              : `We sent a code to +91 ${phone}.`}
          </p>
        </div>

        {step === "phone" ? (
          <div>
            <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider ml-1">
              Mobile Number
            </label>
            <div className="bg-[#f2f2f7] rounded-xl flex items-center px-4 py-3.5 mt-2">
              <span className="text-gray-500 text-[17px] mr-2 font-medium">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="9876543210"
                className="bg-transparent border-none outline-none text-[17px] w-full text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider ml-1">
                Enter OTP
              </label>
              <div className="bg-[#f2f2f7] rounded-xl flex items-center px-4 py-3.5 mt-2">
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Enter 6-digit code"
                  className="bg-transparent border-none outline-none text-[17px] w-full text-gray-900 placeholder-gray-400 tracking-[0.3em]"
                />
              </div>
            </div>

            {needsRegister && (
              <>
                <div>
                  <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <div className="bg-[#f2f2f7] rounded-xl flex items-center px-4 py-3.5 mt-2">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="bg-transparent border-none outline-none text-[17px] w-full text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider ml-1">
                    Email
                  </label>
                  <div className="bg-[#f2f2f7] rounded-xl flex items-center px-4 py-3.5 mt-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-transparent border-none outline-none text-[17px] w-full text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              className="text-[#007aff] text-[14px] font-medium ml-1 ios-clickable"
              onClick={() => sendOtp(needsRegister ? "register" : undefined)}
              disabled={loading}
            >
              Resend OTP
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-[14px] mt-4 text-center">{error}</p>}

        {/* Action button — sits right under the input, not pinned to the bottom */}
        <button
          className="w-full bg-[#007aff] text-white font-semibold py-4 rounded-xl text-[17px] ios-clickable disabled:opacity-50 flex items-center justify-center mt-7"
          onClick={() => (step === "phone" ? sendOtp() : verifyOtp())}
          disabled={loading}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : step === "phone" ? (
            "Send OTP"
          ) : (
            "Verify & Continue"
          )}
        </button>
      </div>
    </div>
  );
}
