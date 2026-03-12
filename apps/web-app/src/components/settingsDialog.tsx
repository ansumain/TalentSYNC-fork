import {
  User
} from "lucide-react"

import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { apiClient } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import { SETTINGS } from "@/constants/settings"
import { COMMON_MESSAGE } from "@/constants/common"
import { useAuthStore } from "@/stores/authStore"
import { skillService } from "@/lib/api/application.service"
import type { Skill } from "@/lib/api/application.service"


const data = {
  nav: [
    { name: "Profile", icon: User }
  ],
}

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const { user } = useAuthStore()
  const showSkills = user?.roles.includes('candidate') || user?.roles.includes('interviewer')

  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
  })

  const [mySkills, setMySkills] = useState<Skill[]>([])
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [selectedSkillId, setSelectedSkillId] = useState('')
  const [skillsLoading, setSkillsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchProfile()
      if (showSkills) fetchSkills()
    }
  }, [open])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get<{
        data: {
          name: string;
          email: string;
          phone: string;
        }
      }>(API_ENDPOINTS.USER.PROFILE)
      setProfile(res.data)
    } catch (error) {
      const err = error as { message: string }
      toast.error(err.message || SETTINGS.DIALOG.LOAD_PROFILE_FAILED)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await apiClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profile)
      toast.success(SETTINGS.DIALOG.PROFILE_UPDATED)
      setIsEditing(false)
    } catch (error) {
      const err = error as { message: string }
      toast.error(err.message || SETTINGS.DIALOG.PROFILE_UPDATE_FAILED)
    }
  }

  const handleUpdatePassword = async () => {
    try {
      await apiClient.patch(API_ENDPOINTS.USER.UPDATE_PASSWORD, password)
      toast.success(SETTINGS.DIALOG.PASSWORD_UPDATED)
      setShowPassword(false)
      setPassword({ oldPassword: "", newPassword: "" })
    } catch (error) {
      const err = error as { message: string }
      toast.error(err.message || SETTINGS.DIALOG.PASSWORD_UPDATE_FAILED)
    }
  }

  const fetchSkills = async () => {
    setSkillsLoading(true)
    try {
      const [myRes, allRes] = await Promise.all([
        skillService.getMySkills(),
        skillService.getAllSkills(),
      ])
      setMySkills(myRes.skills)
      setAllSkills(allRes.skills)
    } catch {
      toast.error('Failed to load skills')
    } finally {
      setSkillsLoading(false)
    }
  }

  const handleAddSkill = async () => {
    if (!selectedSkillId) return
    try {
      await skillService.addMySkill(selectedSkillId)
      const added = allSkills.find(s => s.skillId === selectedSkillId)
      if (added) setMySkills(prev => [...prev, added])
      setSelectedSkillId('')
      toast.success('Skill added')
    } catch (e: unknown) {
      const err = e as { message: string }
      toast.error(err.message || 'Failed to add skill')
    }
  }

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await skillService.removeMySkill(skillId)
      setMySkills(prev => prev.filter(s => s.skillId !== skillId))
      toast.success('Skill removed')
    } catch (e: unknown) {
      const err = e as { message: string }
      toast.error(err.message || 'Failed to remove skill')
    }
  }



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === "Profile"}
                        >
                          <a href="#">
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {loading ? (
                <p>{COMMON_MESSAGE.LOADING}</p>
              ) : (
                <div className="space-y-4 max-w-xl">
                  <Input
                    placeholder="Name"
                    value={profile.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Email"
                    value={profile.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Phone"
                    value={profile.phone}
                    disabled={!isEditing}
                    maxLength={10}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />

                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      {SETTINGS.DIALOG.EDIT_PROFILE}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile}>
                        {COMMON_MESSAGE.SAVE}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        {COMMON_MESSAGE.CANCEL}
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {SETTINGS.DIALOG.UPDATE_PASSWORD}
                  </Button>

                  {showPassword && (
                    <div className="space-y-3">
                      <Input
                        type="password"
                        placeholder="Current Password"
                        value={password.oldPassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            oldPassword: e.target.value,
                          })
                        }
                      />

                      <Input
                        type="password"
                        placeholder="New Password"
                        value={password.newPassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            newPassword: e.target.value,
                          })
                        }
                      />

                      <Button onClick={handleUpdatePassword}>
                        {SETTINGS.DIALOG.UPDATE_PASSWORD}
                      </Button>
                    </div>
                  )}

                  {showSkills && (
                    <div className="space-y-3 pt-4 border-t">
                      <p className="text-sm font-medium">Skills</p>
                      {skillsLoading ? (
                        <p className="text-sm text-muted-foreground">Loading skills...</p>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {mySkills.length === 0 && (
                              <p className="text-sm text-muted-foreground">No skills added yet.</p>
                            )}
                            {mySkills.map((skill) => (
                              <span
                                key={skill.skillId}
                                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                              >
                                {skill.skillName}
                                <button
                                  onClick={() => handleRemoveSkill(skill.skillId)}
                                  className="ml-1 hover:text-destructive leading-none"
                                  aria-label={`Remove ${skill.skillName}`}
                                >
                                  x
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={selectedSkillId}
                              onChange={(e) => setSelectedSkillId(e.target.value)}
                              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <option value="">Select a skill to add</option>
                              {allSkills
                                .filter(s => !mySkills.some(ms => ms.skillId === s.skillId))
                                .map(skill => (
                                  <option key={skill.skillId} value={skill.skillId}>
                                    {skill.skillName}
                                  </option>
                                ))}
                            </select>
                            <Button onClick={handleAddSkill} disabled={!selectedSkillId} size="sm">
                              Add
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}