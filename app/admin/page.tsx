import type { Metadata } from "next";
import AdminClient from "@/components/admin-client";

export const metadata: Metadata = {
  title: "Admin | Jiawen Wang Portfolio",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return <AdminClient />;
}
