import React from "react";
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
import fraudersData from "@/lib/frauders_temp_data";

const FrauderCompanies = () => {
  return (
    <section className="frauders_main">
      {/* Breadcrumb */}
      <div className="breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href={"/"}>..</Link>
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
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        {/* Frauder companies list */}
        <div className="frauders_view mt-6">
          <div className="frauders_view_main flex flex-col gap-4">
            {fraudersData.map((frauder, index) => (
              <Link
                key={index}
                href={`frauders/${encodeURIComponent(frauder.companyName)}`}
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
      </div>
    </section>
  );
};

export default FrauderCompanies;
