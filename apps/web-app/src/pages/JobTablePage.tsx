import { JobTable } from "@/components/jobTable"
import { AppSidebar } from "@/components/home/appSideBar"
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { AddJobDialog } from "@/components/addJobDialog";
import { JOB } from "@/constants/job";

export default function JobTablePage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center justify-between w-full px-4">
                        <h1 className="text-xl font-semibold">{JOB.JOB_TABLE_PAGE.HEADER}</h1>
                        <AddJobDialog />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <JobTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
