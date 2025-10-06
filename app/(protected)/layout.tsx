import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "@/components/navigation";
import { Suspense } from "react";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/soho-light/theme.css";


const LoadingPlaceholder = ({ text = "Loading..." }) => (
  <div className="animate-pulse bg-gray-100 dark:bg-slate-800 rounded-md h-12 flex items-center justify-center">
    <span className="text-gray-500 text-sm">{text}</span>
  </div>
);

const DashCodeSidebar = dynamic(() => import("@/components/partials/sidebar"));

const LayoutProvider = dynamic(() => import("@/providers/layout.provider"), {
  ssr: true,
  loading: () => null,
});

const LayoutContentProvider = dynamic(
  () => import("@/providers/content.provider"),
  {
    ssr: true,
    loading: () => null,
  }
);

const DashCodeHeader = dynamic(() => import("@/components/partials/header"), {
 
});

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }


  

  return (
    <LayoutProvider>
      <Suspense fallback={<LoadingPlaceholder text="Loading Header" />}>
        <DashCodeHeader />
      </Suspense>
      <Suspense fallback={<LoadingPlaceholder text="Loading Sidebar" />}>
        <DashCodeSidebar />
      </Suspense>
      <LayoutContentProvider>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-pulse">Loading content...</div>
            </div>
          }
        >
          {children}
        </Suspense>
      </LayoutContentProvider>
    </LayoutProvider>
  );
};

export default layout;
