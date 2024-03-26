import Navbar from "@/components/admin/navbar";
import Sidebar from "@/components/admin/sidebar";
import Footer from "@/components/admin/footer/Footer";
import SidebarProvider from "@/providers/SidebarProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session: User | null = await getServerSession(authOptions);
  return (
    <>
      <SidebarProvider>
        <section className="flex h-full w-full">
          <Sidebar />

          {/* Navbar & Main Content */}
          <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
            {/* Main Content */}
            <main className="mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]">
              {/* Routes */}
              <div className="h-full">
                <Navbar session={session} />

                <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                  {children}
                </div>

                <div className="p-3">
                  <Footer />
                </div>
              </div>
            </main>
          </div>
        </section>
      </SidebarProvider>
    </>
  );
}
