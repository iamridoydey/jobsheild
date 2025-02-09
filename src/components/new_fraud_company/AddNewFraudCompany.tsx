"use client";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import Link from "next/link";
import FileInput from "../ui/FileInput";
import AccountLinks from "../ui/AccountLinks";
import HrList from "../ui/HrList";
import CompanyName from "../ui/CompanyName";
import { ChevronRight, Loader2 } from "lucide-react";
import Proof from "../ui/Proof";
import { HR, URL } from "@/lib/interfaces";
import { handleUploadImages, handleUploadLogo } from "@/lib/imageOperator";
import { useSession } from "next-auth/react";
import NotificationPopup from "../ui/NotificationPopup"

const AddNewFraudCompany = () => {
  const [isAddingFrauder, setAddingFrauder] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [urls, setUrls] = useState<URL[]>([]);
  const [hrList, setHrList] = useState<HR[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Get session data
  const { data: session } = useSession();

  const validateFields = () => {
    if (!companyName) return "Company name is required.";
    if (!logo) return "Company logo is required.";
    if (
      urls.length === 0 ||
      urls.some((url) => !url.key || !url.value)
    )
      return "All account links must be filled.";
    if (
      hrList.length === 0 ||
      hrList.some((hr) => !hr.name || !hr.account || !hr.accountUrl)
    )
      return "All HR fields must be filled.";
    if (!text) return "Proof text is required.";
    if (images.length < 2) return "At least two images are required.";
    return null;
  };

  const handleOnAddFrauder = async () => {
    const validationError = validateFields();
    if (validationError) {
      setNotification(validationError);
      return;
    }

    setNotification(null);

    // Check if the user is verified
    if (!session?.user?.isVerified) {
      setNotification("You can't add a fraud company unless you are a verified user!");
      return;
    }

    setAddingFrauder(true);

    try {
      // Upload logo and images
      const uploadedLogoUrl = await handleUploadLogo(logo);
      if (!uploadedLogoUrl) {
        throw new Error("Failed to upload logo.");
      }

      const uploadedImageUrls = await handleUploadImages(images);
      if (uploadedImageUrls.length !== images.length) {
        throw new Error("Some images failed to upload.");
      }

      // Prepare HR list for the mutation
      const hrListInput = hrList.map((hr) => ({
        name: hr.name,
        account: hr.account,
        accountUrl: hr.accountUrl,
      }));

      // Prepare important links for the mutation
      const importantLinksInput = urls.map((url) => ({
        key: url.key,
        value: url.value,
      }));

      // Step 1: Create the Frauder
      const fraudRes = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateFrauder(
              $companyName: String!
              $hrList: [HrSchemaInput!]!
              $logo: String
              $importantLinks: [LinkInput!]
              $createdBy: ID!
            ) {
              createFrauder(
                companyName: $companyName
                hrList: $hrList
                logo: $logo
                importantLinks: $importantLinks
                createdBy: $createdBy
              ) {
                _id
              }
            }
          `,
            variables: {
              companyName,
              hrList: hrListInput,
              logo: uploadedLogoUrl,
              importantLinks: importantLinksInput,
              createdBy: session.user._id,
            },
          }),
        }
      );

      const fraudData = await fraudRes.json();
      if (fraudData.errors) {
        throw new Error(fraudData.errors[0].message);
      }

      const frauderId = fraudData.data.createFrauder._id;

      // Step 2: Create the Proof
      const proofRes = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateProof(
              $frauderId: ID!
              $submittedBy: ID!
              $screenshots: [String!]!
              $description: String
            ) {
              createProof(
                frauderId: $frauderId
                submittedBy: $submittedBy
                screenshots: $screenshots
                description: $description
              ) {
                _id
              }
            }
          `,
            variables: {
              frauderId,
              submittedBy: session.user._id,
              screenshots: uploadedImageUrls,
              description: text,
            },
          }),
        }
      );

      const proofData = await proofRes.json();
      if (proofData.errors) {
        throw new Error(proofData.errors[0].message);
      }

      // Reset form after successful submission
      setCompanyName("");
      setLogo(null);
      setUrls([]);
      setHrList([]);
      setText("");
      setImages([]);
      setNotification(null);

      // Notify the user of success
      setNotification("Successfully Added the Proof. It will be under review");


      // Redirect to home page
      window.location.href = "/fraud_companies";
    } catch (error) {
      console.error("Error during the process:", error);
      setNotification("An error occurred. Please try again.");
    } finally {
      setAddingFrauder(false);
    }
  };

  return (
    <section className="add_frauders p-4 sm:p-6">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href={"/"}>Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Fraud Company</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Form */}
      <div className="add_frauder_warpper mt-6 border-gray-800 border-4 bg-red-400 rounded-lg shadow-md">
        <h3 className="px-4 py-2 text-zinc-800 font-bold text-lg">
          Add New Fraud Company
        </h3>
        <hr className="border-gray-800 border-[1px]" />
        <div className="add_frauder p-6 flex flex-col gap-4">
          <CompanyName setCompanyName={setCompanyName} />
          <div className="pic_url_container flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <FileInput logo={logo} setLogo={setLogo} />
            </div>
            <div className="flex-1">
              <AccountLinks urls={urls} setUrls={setUrls} />
            </div>
          </div>
          <HrList hrList={hrList} setHrList={setHrList} />

          {/* Add Proof Button */}
          {!text || images.length < 2 ? (
            <button
              className="add_proof_btn self-end bg-white px-4 py-2 rounded-lg font-bold flex flex-row items-center justify-center hover:bg-gray-100"
              onClick={() => setIsOpen(true)}
            >
              <span>Add Proof</span>
              <ChevronRight className="ml-2" />
            </button>
          ) : (
            <button
              className="add_proof_btn self-end bg-white px-4 py-2 rounded-lg font-bold hover:bg-gray-100"
              onClick={handleOnAddFrauder}
              disabled={isAddingFrauder}
            >
              {isAddingFrauder ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span>Add</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Proof Modal */}
      <Proof
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        text={text}
        setText={setText}
        images={images}
        setImages={setImages}
      />

      {/* Error Popup */}
      {notification && <NotificationPopup message={notification} onClose={() => setNotification(null)} />}
    </section>
  );
};

export default AddNewFraudCompany;
