import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const isAdmin = session.user.email === process.env.ADMIN_EMAIL;

  return (
    <DashboardClient 
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }} 
      isAdmin={isAdmin} 
    />
  );
}
