import SharedLayout from "../SharedLayout";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SharedLayout className={`mx-4 md:mx-8`}>{children}</SharedLayout>;
}
