import React from "react";
import Image from "next/image";
import fraudersData from "@/lib/frauders_temp_data";

const FrauderDetailPage = ({ params }: { params: { companyName: string } }) => {
  const { companyName } = params;

  console.log("companyName:", companyName);

  if (!companyName) return null;

  // Find the frauder based on companyName
  const frauder = fraudersData.find(
    (f) => f.companyName === decodeURIComponent(companyName)
  );

  if (!frauder)
    return <p className="text-center text-red-500">Company not found</p>;

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex items-center gap-4">
        <Image
          src={frauder.logo}
          alt={`${frauder.companyName} logo`}
          width={80}
          height={80}
          className="rounded object-contain"
        />
        <h1 className="text-2xl font-bold">{frauder.companyName}</h1>
      </div>

      {/* HR List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">HR Contacts</h2>
        <ul className="mt-2 space-y-2">
          {frauder.hrList?.map((hr, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded">
              <p className="font-medium">{hr.name}</p>
              <a
                href={hr.accountUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {hr.account}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Important Links */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Important Links</h2>
        <ul className="mt-2 space-y-2">
          {frauder.importantLinks?.map((link, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded">
              <span className="font-medium">{link.key}: </span>
              <a
                href={link.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {link.value}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FrauderDetailPage;
