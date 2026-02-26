import { CandidateTable } from "@/components/candidateTable"

export default function CandidateTablePage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <CandidateTable />
            </div>
        </div>
    )
}
