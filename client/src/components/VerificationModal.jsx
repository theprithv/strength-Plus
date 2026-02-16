import { useState, useEffect } from "react";
import api from "../services/api";
import "./VerificationModal.css";

const VerificationModal = ({ email, onVerified, onCancel }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Automatically send OTP when modal opens
    handleResendOTP();
  }, []);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      await api.post("/auth/send-otp", { email });
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/verify-otp", { email, otp: otpString });
      onVerified(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-backdrop">
      <div className="verification-modal">
        <div className="verification-header">
          <h2>Verify your email</h2>
          <p>We've sent a 6-digit code to <strong>{email}</strong></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {error && <p className="verification-error">{error}</p>}

          <button type="submit" className="verify-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Activate"}
          </button>
        </form>

        <div className="verification-footer">
          <button 
            className="resend-link" 
            onClick={handleResendOTP}
            disabled={resendCooldown > 0}
          >
            {resendCooldown > 0 
              ? `Resend code in ${resendCooldown}s` 
              : "Didn't receive code? Resend"}
          </button>
          <button className="cancel-link" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
