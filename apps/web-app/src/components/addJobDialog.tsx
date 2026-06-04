"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useJobStore } from "@/stores/jobStore";
import { skillService, type Skill } from "@/lib/api/application.service";
import { JOB } from "@/constants/job";
import { Skeleton } from "@/components/ui/skeleton";

const JOB_TYPES = ["Remote", "On-site", "Hybrid"] as const;

const EMPTY_FORM = {
  title: "",
  description: "",
  location: "",
  jobType: "",
  openings: 1,
  skillIds: [] as string[],
};

export function AddJobDialog() {
  const { createJob } = useJobStore();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && skills.length === 0) {
      setSkillsLoading(true);
      skillService
        .getAllSkills()
        .then((res) => setSkills(res.skills))
        .catch(() => {})
        .finally(() => setSkillsLoading(false));
    }
  }, [open, skills.length]);

  const toggleSkill = (skillId: string) => {
    setForm(prev => ({
      ...prev,
      skillIds: prev.skillIds.includes(skillId)
        ? prev.skillIds.filter(id => id !== skillId)
        : [...prev.skillIds, skillId],
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.jobType) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.openings < 1) {
      setError("Openings must be at least 1.");
      return;
    }
    try {
      setSubmitting(true);
      await createJob(form);
      setForm({ ...EMPTY_FORM });
      setOpen(false);
    } catch (e: any) {
      setError(e.message || "Failed to create job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          {JOB.NEW_JOB.ADD}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{JOB.NEW_JOB.ADD_NEW}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label>{JOB.NEW_JOB.TITLE} <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g. Backend Developer"
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label>{JOB.NEW_JOB.DESCRIPTION} <span className="text-red-500">*</span></Label>
            <textarea
              className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              placeholder="Describe the role and responsibilities..."
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <Label>{JOB.NEW_JOB.LOCATION} <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g. Bhubaneswar, India"
              value={form.location}
              onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          {/* Job Type + Openings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>{JOB.NEW_JOB.JOB_TYPE} <span className="text-red-500">*</span></Label>
              <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={form.jobType}
                onChange={e => setForm(prev => ({ ...prev, jobType: e.target.value }))}
              >
                <option value="">{JOB.NEW_JOB.SELECT_TYPE}</option>
                {JOB_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{JOB.NEW_JOB.OPENINGS} <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                min={1}
                value={form.openings}
                onChange={e => setForm(prev => ({ ...prev, openings: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          {/* Required Skills */}
          <div className="flex flex-col gap-1.5">
            <Label>{JOB.NEW_JOB.REQ_SKILLS}</Label>
            <div className="border border-input rounded-md p-3 max-h-40 overflow-y-auto grid grid-cols-2 gap-2">
              {skillsLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </>
              ) : skills.length === 0 ? (
                <p className="text-muted-foreground text-xs col-span-2">No skills found.</p>
              ) : skills.map(skill => (
                <label
                  key={skill.skillId}
                  className="flex items-center gap-2 text-sm cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-primary"
                    checked={form.skillIds.includes(skill.skillId)}
                    onChange={() => toggleSkill(skill.skillId)}
                  />
                  {skill.skillName}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            {JOB.NEW_JOB.CANCEL}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? JOB.NEW_JOB.CREATING_JOB : JOB.NEW_JOB.CREATE_JOB}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
