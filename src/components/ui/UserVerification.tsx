/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

type UserVerificationProps = {
  setShowVerificationModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleVerification: (code: string) => Promise<void>;
  isLoading: boolean;
};

export default function UserVerification({
  setShowVerificationModal,
  handleVerification,
  isLoading,
}: UserVerificationProps) {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationStatus("Please enter a verification code.");
      return;
    }

    try {
      await handleVerification(verificationCode);
      setVerificationStatus("Code verified successfully!");
      setTimeout(() => {
        setShowVerificationModal(false);
      }, 2000);
    } catch (error:any) {
      console.log("Handle verify code error: ", error)
      setVerificationStatus("Incorrect code. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-red-400 border p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold">Email Verification</h2>
        <p className="text-sm text-gray-600 mt-2">
          Please enter the verification code sent to your email.
        </p>

        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
          className="border mt-4 p-2 w-full rounded"
        />

        {verificationStatus && (
          <div
            className={`mt-4 p-2 text-white rounded ${
              verificationStatus.includes("successful")
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {verificationStatus}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleVerifyCode}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            aria-label="Verify code"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
          <button
            onClick={() => setShowVerificationModal(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            aria-label="Close verification modal"
            disabled={isLoading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
