import { CandidateTable } from "@/components/candidateTable"
import { AppSidebar } from "@/components/home/appSideBar"
import { AppPageHeader } from "@/components/layout/AppPageHeader"
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { CANDIDATE } from "@/constants/candidate"

export default function CandidateTablePage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppPageHeader title={CANDIDATE.CANDIDATE_TABLE_PAGE.HEADING} />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <CandidateTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
