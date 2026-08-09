import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { ProductionsProvider } from "@/contexts/ProductionsContext";
import { SearchProvider } from "@/contexts/SearchContext";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProductionsProvider>
      <SearchProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar onOpenSidebar={() => setSidebarOpen(true)} />
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </SearchProvider>
    </ProductionsProvider>
  );
}
