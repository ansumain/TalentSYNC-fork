import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { interviewService, type AvailableInterviewer, type Interview } from "@/lib/api/interview.service";
import type { JobApplication } from "@/lib/api/application.service";

interface RescheduleInterviewDialogProps {
  target: Interview | null;
  appMap: Map<string, JobApplication>;
  onOpenChange: (target: Interview | null) => void;
  onRescheduled: () => Promise<void>;
}

export function RescheduleInterviewDialog({
  target,
  appMap,
  onOpenChange,
  onRescheduled,
}: RescheduleInterviewDialogProps) {
  const [form, setForm] = useState({ scheduledAt: "", interviewerId: "" });
  const [interviewers, setInterviewers] = useState<AvailableInterviewer[]>([]);
  const [fetchingInterviewers, setFetchingInterviewers] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setForm({ scheduledAt: "", interviewerId: "" });
    setInterviewers([]);
    setError(null);
  };

  const handleFindInterviewers = async () => {
    if (!form.scheduledAt || !target) {
      setError("Select a new date/time first.");
      return;
    }

    setError(null);
    setFetchingInterviewers(true);
    try {
      const date = form.scheduledAt.split("T")[0];
      const res = await interviewService.getAvailableInterviewers(date, target.applicationId);
      setInterviewers(res.availableInterviewers);
      if (res.availableInterviewers.length === 0) {
        setError("No interviewers available for this date.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch interviewers.");
    } finally {
      setFetchingInterviewers(false);
    }
  };

  const handleReschedule = async () => {
    if (!target || !form.scheduledAt || !form.interviewerId) {
      setError("All fields are required.");
      return;
    }

    setRescheduling(true);
    try {
      await interviewService.update(target.interviewId, {
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        interviewerId: form.interviewerId,
        status: "scheduled",
      });

      toast.success("Interview rescheduled.");
      onOpenChange(null);
      resetState();
      await onRescheduled();
    } catch (e: any) {
      setError(e.message || "Failed to reschedule interview.");
    } finally {
      setRescheduling(false);
    }
  };

  const candidateName = target
    ? appMap.get(target.applicationId)?.candidateName ?? "Unknown candidate"
    : "";

  return (
    <Dialog
      open={!!target}
      onOpenChange={(open) => {
        if (!open) {
          onOpenChange(null);
          resetState();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Interview</DialogTitle>
        </DialogHeader>

        {target && (
          <div className="flex flex-col gap-4 py-2">
            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              Candidate: <span className="font-medium text-foreground">{candidateName}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                New Date & Time <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => {
                  setForm((p) => ({ ...p, scheduledAt: e.target.value, interviewerId: "" }));
                  setInterviewers([]);
                }}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={fetchingInterviewers}
              onClick={handleFindInterviewers}
            >
              {fetchingInterviewers ? "Searching..." : "Find Available Interviewers"}
            </Button>

            {interviewers.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <Label>
                  Interviewer <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.interviewerId}
                  onValueChange={(val: string) => setForm((p) => ({ ...p, interviewerId: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an interviewer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewers.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.name} ({i.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(null)}>
            Cancel
          </Button>
          <Button disabled={rescheduling || !form.interviewerId} onClick={handleReschedule}>
            {rescheduling ? "Rescheduling..." : "Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}