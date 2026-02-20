import * as React from "react"
import { SquareTerminal } from "lucide-react"

import { NavMain } from "@/components/dashBoard/navMain"
import { NavUser } from "@/components/dashBoard/navUser"
import { TeamSwitcher } from "@/components/dashBoard/teamSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/authStore"

// Navigation options by role
const navigationByRole = {
  candidate: [
    {
      title: "Interviews",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Scheduled",
          url: "#",
        },
        {
          title: "Applied",
          url: "#",
        },
        {
          title: "Completed",
          url: "#",
        }
      ],
    }
  ],
  interviewer: [
    {
      title: "Interviews",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Assigned",
          url: "#",
        },
        {
          title: "Scheduled",
          url: "#",
        },
        {
          title: "Completed",
          url: "#",
        },
        {
          title: "Feedback Pending",
          url: "#",
        },
      ],
    },
    {
      title: "Candidates",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "My Candidates",
          url: "#",
        }
      ],
    }
  ],
  manager: [
    {
      title: "Interviews",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Assigned",
          url: "#",
        },
        {
          title: "Schedule",
          url: "#",
        },
        {
          title: "Completed",
          url: "#",
        },
        {
          title: "Pending Feedback",
          url: "#",
        }
      ],
    },
    {
      title: "Candidates",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Shortlisted",
          url: "#",
        },
        {
          title: "Hired",
          url: "#",
        },
        {
          title: "Rejected",
          url: "#",
        },
      ],
    }
  ],
  admin: [
    {
      title: "Interviews",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Assigned",
          url: "#",
        },
        {
          title: "Schedule",
          url: "#",
        },
        {
          title: "Completed",
          url: "#",
        },
        {
          title: "Pending Feedback",
          url: "#",
        }
      ],
    },
    {
      title: "Candidates",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Shortlisted",
          url: "#",
        },
        {
          title: "Hired",
          url: "#",
        },
        {
          title: "Rejected",
          url: "#",
        },
        {
          title: "All",
          url: "#",
        },
      ],
    },
    {
      title: "Manage",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Roles",
          url: "#",
        },
        {
          title: "Permissions",
          url: "#",
        }
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Interview Report",
          url: "#",
        },
        {
          title: "Candidate Report",
          url: "#",
        },
        {
          title: "Hiring Summary",
          url: "#",
        },
      ],
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const fetchUser = useAuthStore((state) => state.fetchUser)

  React.useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const userRole = user?.roles?.[0] || 'candidate'
  
  const navigationItems = navigationByRole[userRole as keyof typeof navigationByRole] || navigationByRole.candidate

  const userData = user ? {
    name: user.name,
    role: userRole,
    avatar: "/avatars/shadcn.jpg",
  } : {
    name: "Loading...",
    role: "...",
    avatar: "/avatars/shadcn.jpg",
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
