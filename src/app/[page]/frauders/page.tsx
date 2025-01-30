"use client"
import CreateFrauder from "@/components/create_frauder/CreateFrauder";
import FrauderCompanies from "@/components/frauderView/FrauderCompanies";
import useFrauderMode from "@/hooks/ActiveFrauderMode";
import React from "react";

const Frauders = () => {
  const { activeMode } = useFrauderMode();

  return (
    <div>
      {activeMode === "view" && <FrauderCompanies />}
      {activeMode === "create" && <CreateFrauder />}
    </div>
  );
};

export default Frauders;
