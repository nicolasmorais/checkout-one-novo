// src/app/dashboard/layout.tsx

import { createTables } from "@/lib/seed-db";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Garante que as tabelas do banco de dados existam antes de renderizar o layout do dashboard.
  // Isso é executado uma vez no servidor para esta rota.
  await createTables();

  return (
    <DashboardLayoutClient>{children}</DashboardLayoutClient>
  );
}
