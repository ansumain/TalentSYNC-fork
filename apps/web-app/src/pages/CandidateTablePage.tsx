import { CandidateTable } from "@/components/candidateTable"
import { AppSidebar } from "@/components/home/appSideBar"
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"

export default function CandidateTablePage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <h1 className="text-xl font-semibold">Candidates</h1>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <CandidateTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
