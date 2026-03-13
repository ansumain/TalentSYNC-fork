import { FileUpload } from "@/components/upload"
import { AppSidebar } from "@/components/home/appSideBar"
import { AppPageHeader } from "@/components/layout/AppPageHeader"
import {
    SidebarInset,
    SidebarProvider
} from "@/components/ui/sidebar"
import { UPLOAD } from "@/constants/upload"

export default function UploadPage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppPageHeader title={UPLOAD.UPLOAD_COMPONENT.UPLOAD_RESUME} />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <FileUpload />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
