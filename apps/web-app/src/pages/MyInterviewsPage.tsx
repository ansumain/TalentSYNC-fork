import { useEffect, useState, useCallback } from "react";
import { AppSidebar } from "@/components/home/appSideBar";
import { AppPageHeader } from "@/components/layout/AppPageHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { interviewService, type Interview } from "@/lib/api/interview.service";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  noshow: "bg-orange-100 text-orange-700",
};

const RESULT_COLORS: Record<string, string> = {
  passed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export default function MyInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit result dialog
  const [resultTarget, setResultTarget] = useState<Interview | null>(null);
  const [result, setResult] = useState<"passed" | "failed" | "">("");
  const [submittingResult, setSubmittingResult] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await interviewService.getAssigned();
      setInterviews(res.interviews);
    } catch {
      toast.error("Failed to load assigned interviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleCancel = async (interviewId: string) => {
    if (!window.confirm("Cancel this interview? The application will be rolled back to shortlisted.")) return;
    try {
      await interviewService.cancel(interviewId);
      toast.success("Interview cancelled.");
      fetchInterviews();
    } catch (e: any) {
      toast.error(e.message || "Failed to cancel interview.");
    }
  };

  const openResultDialog = (interview: Interview) => {
    setResultTarget(interview);
    setResult("");
    setResultError(null);
  };

  const handleSubmitResult = async () => {
    if (!resultTarget || !result) {
      setResultError("Please select a result.");
      return;
    }
    setSubmittingResult(true);
    try {
      await interviewService.submitResult(resultTarget.interviewId, result);
      toast.success(`Result submitted: ${result}. Application updated.`);
      setResultTarget(null);
      setResult("");
      fetchInterviews();
    } catch (e: any) {
      setResultError(e.message || "Failed to submit result.");
    } finally {
      setSubmittingResult(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppPageHeader title="My Interviews" />

        <div className="flex flex-col gap-4 p-4">
          {loading && (
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {!loading && interviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No interviews assigned to you.
            </div>
          )}

          {!loading && interviews.length > 0 && (
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Scheduled At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {interviews.map((iv) => (
                        <TableRow key={iv.interviewId}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            #{iv.applicationId.slice(0, 6)}
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">
                            {new Date(iv.scheduledAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                STATUS_COLORS[iv.status] ?? "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {iv.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {iv.result ? (
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                  RESULT_COLORS[iv.result] ?? ""
                                }`}
                              >
                                {iv.result}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                disabled={iv.status !== "scheduled"}
                                onClick={() => openResultDialog(iv)}
                              >
                                Submit Result
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
                                disabled={iv.status !== "scheduled"}
                                onClick={() => handleCancel(iv.interviewId)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Submit Result Dialog */}
        <Dialog
          open={!!resultTarget}
          onOpenChange={(open) => {
            if (!open) { setResultTarget(null); setResult(""); setResultError(null); }
          }}
        >
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Submit Interview Result</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              {resultTarget && (
                <p className="text-sm text-muted-foreground">
                  Scheduled:{" "}
                  <span className="font-medium text-foreground">
                    {new Date(resultTarget.scheduledAt).toLocaleString()}
                  </span>
                </p>
              )}
              <div className="flex flex-col gap-2">
                <Label>
                  Result <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={result} onValueChange={(val) => setResult(val as "passed" | "failed")} className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="passed" id="passed" />
                    <Label htmlFor="passed" className="font-medium text-green-700 cursor-pointer">Passed</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="failed" id="failed" />
                    <Label htmlFor="failed" className="font-medium text-red-700 cursor-pointer">Failed</Label>
                  </div>
                </RadioGroup>
              </div>
              {resultError && <p className="text-sm text-destructive">{resultError}</p>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => { setResultTarget(null); setResult(""); setResultError(null); }}
              >
                Cancel
              </Button>
              <Button disabled={submittingResult || !result} onClick={handleSubmitResult}>
                {submittingResult ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
