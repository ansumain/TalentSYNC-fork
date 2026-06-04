import * as React from "react"

import { NavMain } from "@/components/home/navMain"
import { NavUser } from "@/components/home/navUser"
import { TeamSwitcher } from "@/components/home/teamSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/authStore"
import { navigationByRole } from "@/constants/sidebar"
import { getPrimaryRole } from "@/lib/auth/defaultRoute"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)

  const userRole = getPrimaryRole(user?.roles) || 'candidate'

  const navigationItems = navigationByRole[userRole as keyof typeof navigationByRole] || navigationByRole.candidate

  const userData = user ? {
    name: user.name,
    role: userRole,
    avatar: "",
  } : {
    name: "User",
    role: "Member",
    avatar: "",
  }

  if (loading) {
    return null
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
