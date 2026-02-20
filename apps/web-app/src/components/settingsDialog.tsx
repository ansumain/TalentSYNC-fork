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

  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
  })


  useEffect(() => {
    if (open) {
      fetchProfile()
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
      toast.error(err.message || "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await apiClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profile)
      toast.success("Profile updated")
      setIsEditing(false)
    } catch (error) {
      const err = error as { message: string }
      toast.error(err.message || "Profile update failed")
    }
  }

  const handleUpdatePassword = async () => {
    try {
      await apiClient.patch(API_ENDPOINTS.USER.UPDATE_PASSWORD, password)
      toast.success("Password updated")
      setShowPassword(false)
      setPassword({ oldPassword: "", newPassword: "" })
    } catch (error) {
      const err = error as { message: string }
      toast.error(err.message || "Password update failed")
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
                <p>Loading...</p>
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
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile}>
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    Update Password
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
                        Update Password
                      </Button>
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