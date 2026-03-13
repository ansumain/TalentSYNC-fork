import { JobTable } from "@/components/jobTable"
import { AppSidebar } from "@/components/home/appSideBar"
import { AppPageHeader } from "@/components/layout/AppPageHeader"
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
                <AppPageHeader title={JOB.JOB_TABLE_PAGE.HEADER} actions={<AddJobDialog />} />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <JobTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
