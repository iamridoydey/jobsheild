"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import Link from "next/link";
import { Search } from "lucide-react";
import NotificationPopup from "../ui/NotificationPopup";

interface FraudCompanyView {
  _id: string;
  companyName: string;
  logo: string;
}

const FraudCompaniesView = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [frauderData, setFrauderData] = useState<FraudCompanyView[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch frauder data from the backend
  useEffect(() => {
    const fetchFrauders = async () => {
      try {
        const fraudRes = await fetch(
          `/api/graphql`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                query GetFrauders {
                  getFrauders {
                    _id
                    companyName
                    logo
                  }
                }
              `,
            }),
          }
        );

        const { data, errors } = await fraudRes.json();

        if (errors) {
          throw new Error(errors[0].message);
        }

        setFrauderData(data.getFrauders);
      } catch (error) {
        console.error("Error fetching frauders:", error);
        setNotification("Failed to fetch frauder companies. Please try again.");
      }
    };

    fetchFrauders();
  }, []);

  // Filter the fraud companies based on search query
  const filteredFrauderData = frauderData.filter((frauder) =>
    frauder.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="frauders_main p-4 sm:p-6">
      {/* Breadcrumb */}
      <div className="breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href={"/"}>Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Frauder Companies</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Frauder companies view */}
      <div className="frauders_view_wrapper mt-4">
        {/* Frauder companies search */}
        <div className="frauders_search w-full relative">
          <input
            type="text"
            className="frauders_searchbar w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search frauder companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        {/* Frauder companies list */}
        <div className="frauders_view mt-6">
          <div className="frauders_view_main flex flex-col gap-4">
            {filteredFrauderData.map((frauder) => (
              <Link
                key={frauder._id}
                href={`/fraud_companies/${encodeURIComponent(
                  frauder.companyName
                )}`}
                passHref
                className="bg-red-500 p-4 rounded-md shadow-md hover:bg-red-600 transition"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={frauder.logo}
                    alt={`${frauder.companyName} logo`}
                    width={48}
                    height={48}
                    className="rounded object-contain"
                  />
                  <h2 className="text-lg font-semibold">
                    {frauder.companyName}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Notification Popup */}
        {notification && (
          <NotificationPopup
            message={notification}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </section>
  );
};

export default FraudCompaniesView;
