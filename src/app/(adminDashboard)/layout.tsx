import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-1 lg:p-4 w-full min-w-0">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
