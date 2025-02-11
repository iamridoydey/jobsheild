"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, X, Loader2 } from "lucide-react";
import { useAuthPopup } from "@/hooks/authPopup";

const SignInSignUpPopup = () => {
  const { setAuthPopup } = useAuthPopup();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Start loading

    try {
      if (!isSignUp) {
        // Sign In
        const res = await signIn("credentials", {
          redirect: false,
          identifier: formData.email,
          password: formData.password,
        });

        if (res?.error) {
          setError("Invalid email, username, or password");
        } else {
          setAuthPopup(false); // Close popup on successful sign-in
          window.location.href = "/dashboard"
        }
      } else {
        // Sign Up (Handle separately with API call)
        const res = await fetch(
          `/api/graphql`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
              mutation CreateUser($name: String!, $username: String!, $email: String!, $password: String!) {
                createUser(name: $name, username: $username, email: $email, password: $password) {
                  _id
                  name
                  email
                  username
                }
              }
            `,
              variables: {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
              },
            }),
          }
        );

        const data = await res.json();
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        // Automatically sign in after successful sign-up
        const signInRes = await signIn("credentials", {
          redirect: false,
          identifier: formData.email,
          password: formData.password,
        });

        if (signInRes?.error) {
          setError("Failed to sign in after sign-up. Please try logging in.");
        } else {
          setAuthPopup(false);
          window.location.href = "/settings"
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        isSignUp
          ? "Failed to create account. Please try again."
          : "Invalid email, username, or password"
      );
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 border-4 border-gray-900 mx-3 relative">
        <h2 className="text-xl font-bold text-center mb-4">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Enter your username"
                  className="w-full border rounded p-2"
                  required
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              {isSignUp ? "Email" : "Username or Email"}
            </label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder={isSignUp ? "Enter your email" : "Email / Username"}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter password"
                className="w-full border rounded p-2 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded mb-4 flex justify-center items-center"
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>

          {!isSignUp && (
            <div className="mb-4 flex justify-center">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="w-full bg-red-500 text-white py-2 rounded"
                disabled={isLoading} // Disable button during loading
              >
                Sign In with Google
              </button>
            </div>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 hover:underline"
              disabled={isLoading} // Disable button during loading
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        <button
          onClick={() => setAuthPopup(false)}
          className="absolute top-3 right-3 border rounded-full p-1 bg-gray-500 hover:text-gray-900"
          disabled={isLoading} // Disable button during loading
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default SignInSignUpPopup;
