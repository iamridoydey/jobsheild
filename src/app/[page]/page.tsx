import dynamic from "next/dynamic";
import React from "react";

// Dynamically import pages
const Frauders = dynamic(() => import("./frauders/page"));
const Dashboard = dynamic(() => import("./dashboard/page"));

const PagesHandler = async ({ params }: { params: { page: string } }) => {
  const pages: { [key: string]: React.JSX.Element } = {
    frauders: <Frauders />,
    dashboard: <Dashboard />,
  };

  const { page } = await params;

  const current = pages[page] || <div>Page not found</div>;
  return <div className="pages_wrapper mx-6 md:mx-12">{current}</div>;
};

export default PagesHandler;
