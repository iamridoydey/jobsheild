"use client";
import { usePathname } from "next/navigation";
import PagesHandler from "./[page]/page";

export default function Home() {
  const pathname = usePathname();
  const path = pathname.substring(1);

  return <>{path === "" ? <div>Jobsheild.com</div> : <PagesHandler />}</>;
}
