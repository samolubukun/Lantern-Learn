import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { DashboardHeader } from "@/components/dashboard-header";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({
  children,
}: Props) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col">
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <div className="lg:pl-[256px] min-h-screen flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
 
export default MainLayout;
