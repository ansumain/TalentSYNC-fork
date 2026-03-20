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
import { interviewService, type AvailableInterviewer } from "@/lib/api/interview.service";
import type { JobApplication } from "@/lib/api/application.service";

const EMPTY_FORM = { applicationId: "", scheduledAt: "", interviewerId: "" };

interface ScheduleInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  managerId: string;
  schedulableApps: JobApplication[];
  onScheduled: () => Promise<void>;
}

export function ScheduleInterviewDialog({
  open,
  onOpenChange,
  managerId,
  schedulableApps,
  onScheduled,
}: ScheduleInterviewDialogProps) {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [availableInterviewers, setAvailableInterviewers] = useState<AvailableInterviewer[]>([]);
  const [fetchingInterviewers, setFetchingInterviewers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const resetState = () => {
    setForm({ ...EMPTY_FORM });
    setAvailableInterviewers([]);
    setScheduleError(null);
  };

  const handleFindInterviewers = async () => {
    if (!form.applicationId || !form.scheduledAt) {
      setScheduleError("Select an application and date/time first.");
      return;
    }

    setScheduleError(null);
    setFetchingInterviewers(true);
    try {
      const date = form.scheduledAt.split("T")[0];
      const res = await interviewService.getAvailableInterviewers(date, form.applicationId);
      setAvailableInterviewers(res.availableInterviewers);
      if (res.availableInterviewers.length === 0) {
        setScheduleError("No interviewers available for this date/application.");
      }
    } catch (e: any) {
      setScheduleError(e.message || "Failed to fetch interviewers.");
    } finally {
      setFetchingInterviewers(false);
    }
  };

  const handleSchedule = async () => {
    setScheduleError(null);
    if (!form.applicationId || !form.scheduledAt || !form.interviewerId) {
      setScheduleError("All fields are required.");
      return;
    }

    setSubmitting(true);
    try {
      await interviewService.schedule({
        applicationId: form.applicationId,
        interviewerId: form.interviewerId,
        managerId,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      toast.success("Interview scheduled.");
      onOpenChange(false);
      resetState();
      await onScheduled();
    } catch (e: any) {
      setScheduleError(e.message || "Failed to schedule interview.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) resetState();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>
              Application <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.applicationId}
              onValueChange={(val: string) => {
                setForm((p) => ({ ...p, applicationId: val, interviewerId: "" }));
                setAvailableInterviewers([]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a candidate..." />
              </SelectTrigger>
              <SelectContent>
                {schedulableApps.map((a) => (
                  <SelectItem key={a.applicationId} value={a.applicationId}>
                    {a.candidateName ?? a.applicationId.slice(0, 8)} - {a.jobTitle ?? "Unknown Job"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {schedulableApps.length === 0 && (
              <p className="text-xs text-muted-foreground">No shortlisted applications available.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>
              Date & Time <span className="text-red-500">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => {
                setForm((p) => ({ ...p, scheduledAt: e.target.value, interviewerId: "" }));
                setAvailableInterviewers([]);
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

          {availableInterviewers.length > 0 && (
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
                  {availableInterviewers.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name} ({i.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {scheduleError && <p className="text-sm text-destructive">{scheduleError}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={submitting || !form.interviewerId} onClick={handleSchedule}>
            {submitting ? "Scheduling..." : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}