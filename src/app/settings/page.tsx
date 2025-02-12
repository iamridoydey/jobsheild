"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle, Loader2, Trash2 } from "lucide-react";
import UserVerification from "@/components/ui/UserVerification";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import DeleteAccount from "@/components/ui/DeleteAccount";

export default function SettingsPage() {
  const { data: session, update: sessionUpdate } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "********",
    isVerified: "No",
  });

  const [editableField, setEditableField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Popup for delete popup
  const [isDeletePopup, setDeletePopup] = useState(false);

  // Populate form data from session
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        username: session.user.username || "",
        email: session.user.email || "",
        password: "********",
        isVerified: session.user.isVerified ? "Yes" : "No",
      });
    }
  }, [session]);

  // Send verification email when modal opens
  useEffect(() => {
    if (showVerificationModal) {
      const sendVerificationEmail = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/graphql`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                  mutation SendVerificationEmail($email: String!) {
                    sendVerificationEmail(email: $email)
                  }
                `,
              variables: { email: session?.user?.email },
            }),
          });

          const data = await res.json();
          if (data.errors) {
            throw new Error(data.errors[0].message);
          }
          toast.success("Verification email sent!");
        } catch (error) {
          console.error("Error sending verification email:", error);
          setError("Failed to send verification email. Please try again.");
          toast.error("Failed to send verification email.");
        } finally {
          setIsLoading(false);
        }
      };

      sendVerificationEmail();
    }
  }, [session?.user?.email, showVerificationModal]);

  // Update user information
  const updateUser = async (field: string, value: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation UpdateUser($id: ID!, $${field}: String!) {
              updateUser(id: $id, ${field}: $${field}) {
                _id
                name
                username
                email
                isVerified
              }
            }
          `,
          variables: { id: session?.user._id, [field]: value },
        }),
      });

      const data = await res.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      // Update session
      const updatedUser = { ...session?.user, ...data.data.updateUser };
      await sessionUpdate({ user: updatedUser });

      toast.success("Profile updated successfully!");
      setEditableField(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update profile. Please try again.");
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email verification
  const handleVerification = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation VerifyCode($email: String!, $code: String!) {
              verifyCode(email: $email, code: $code) {
                _id
                isVerified
              }
            }
          `,
          variables: { email: session?.user.email, code },
        }),
      });

      const data = await res.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      // Update form data and session
      setFormData((prev) => ({ ...prev, isVerified: "Yes" }));
      const updatedUser = { ...session?.user, isVerified: true };
      await sessionUpdate({ user: updatedUser });

      toast.success("Email verified successfully!");
      setShowVerificationModal(false);
    } catch (error) {
      console.error("Error verifying email:", error);
      setError("Invalid verification code. Please try again.");
      toast.error("Failed to verify email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href={"/"}>Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-gray-700 shadow-lg rounded-lg border-zinc-200 border-[1px] mt-4">
        <h2 className="text-gray-200 font-bold text-lg md:text-xl border-zinc-200 border-b-[1px] px-6 py-2">Settings</h2>
        <div className="divide-y divide-zinc-200 font-semibold p-6 text-gray-200">
          {Object.entries(formData).map(([field, value]) => (
            <div
              key={field}
              className="flex flex-wrap items-center justify-between py-4"
            >
              <div className="w-full md:w-1/3 font-bold text-md md:text-base">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </div>
              <div className="w-full md:w-2/3 flex items-center justify-between">
                {field === "isVerified" ? (
                  <div className="w-full flex justify-end">
                    {value === "Yes" ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <button
                        onClick={() => setShowVerificationModal(true)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        aria-label="Verify account"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Verify"
                        )}
                      </button>
                    )}
                  </div>
                ) : editableField === field ? (
                  <div className="flex items-center gap-2 w-full">
                    <div className="relative w-full md:w-auto flex-grow">
                      <input
                        type={
                          field === "password" && !showPassword
                            ? "password"
                            : "text"
                        }
                        value={value}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                        className="w-full border border-blue-600 rounded p-2 outline-blue-500 pr-10"
                        disabled={isLoading}
                      />
                      {field === "password" && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateUser(field, value)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        onClick={() => setEditableField(null)}
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm md:text-base">{value}</span>
                    <button
                      onClick={() => setEditableField(field)}
                      className="text-blue-400 hover:underline text-sm md:text-base"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Delete button */}
          <div className="delete_account">
            <h4 className="text-md fotn-semibold py-3">Delete Account</h4>

            <div className="delete_button_wrapper flex justify-end">
              <button
                onClick={() => setDeletePopup(true)}
                className="py-1 px-2 text-white bg-red-600 flex gap-1 items-center rounded-sm"
              >
                <Trash2 size={16} /> <span>Delete</span>{" "}
              </button>
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>

      {showVerificationModal && (
        <UserVerification
          setShowVerificationModal={setShowVerificationModal}
          handleVerification={handleVerification}
          isLoading={isLoading}
        />
      )}

      {isDeletePopup && (
        <DeleteAccount
          userId={session?.user._id || ""}
          setDeletePopup={setDeletePopup}
        />
      )}
    </div>
  );
}
