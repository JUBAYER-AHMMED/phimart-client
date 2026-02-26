import { useState } from "react";
import { resendActivation } from "../../services/auth-service";import ErroAlert from "../ErroAlert";

const ResendActivation = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await resendActivation(email);
      setMessage("Activation email sent successfully. Please check your inbox.");
    } catch (err) {
      setError("Failed to resend activation email.");
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card bg-base-100 shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Resend Activation Email</h2>

        {message && (
          <div className="alert alert-success">
            <span>{message}</span>
          </div>
        )}

        {error && <ErroAlert error={error} />}

        <form onSubmit={handleResend} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary w-full">
            Resend Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResendActivation;