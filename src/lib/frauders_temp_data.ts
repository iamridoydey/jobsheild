const fraudersData = [
  {
    companyName: "ScamTech Ltd",
    hrList: [
      {
        name: "John Doe",
        account: "johndoe123",
        accountUrl: "http://linkedin.com/in/johndoe123",
      },
      {
        name: "Jane Smith",
        account: "janesmith456",
        accountUrl: "http://linkedin.com/in/janesmith456",
      },
    ],
    logo: "./fallback.svg",
    importantLinks: [
      { key: "Website", value: "http://scamtech.com" },
      { key: "Facebook", value: "http://example.com/job123" },
    ],
    createdBy: "650f1b2e8e4b3c001f93a5e1",
    contributors: ["650f1b2e8e4b3c001f93a5e2", "650f1b2e8e4b3c001f93a5e3"],
    isJustified: false,
    proofs: ["651a7c3d9a2b5c002f94b7c5", "651a7c3d9a2b5c002f94b7c6"],
  },
  {
    companyName: "FakeWorks Inc",
    hrList: [
      {
        name: "Michael Johnson",
        account: "michael_j",
        accountUrl: "http://linkedin.com/in/michaelj",
      },
    ],
    logo: "./fallback.svg",
    importantLinks: [
      { key: "Website", value: "http://scamalert.com/fakeworks" },
    ],
    createdBy: "650f1b2e8e4b3c001f93a5e4",
    contributors: ["650f1b2e8e4b3c001f93a5e5"],
    isJustified: true,
    proofs: ["651a7c3d9a2b5c002f94b7c7"],
  },
];

export default fraudersData;
