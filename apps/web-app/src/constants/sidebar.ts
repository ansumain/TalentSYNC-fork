import { SquareTerminal } from "lucide-react"

const navigationByRole = {
    candidate: [
        {
            title: "Jobs",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Open",
                    url: "/job-board",
                },
                {
                    title: "My Applications",
                    url: "/my-applications",
                }
            ],
        },
        {
            title: "Interviews",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Scheduled",
                    url: "/candidate-interviews?status=scheduled",
                },
                {
                    title: "Completed",
                    url: "/candidate-interviews?status=completed",
                }
            ],
        },
        {
            title: "Resume",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Upload Resume",
                    url: "/upload",
                },
                {
                    title: "My Resumes",
                    url: "/my-resumes",
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
                    title: "My Interviews",
                    url: "/my-interviews",
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
                    url: "/candidates",
                }
            ],
        }
    ],
    manager: [
        {
            title: "Analytics",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Dashboard",
                    url: "/analytics",
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
                    title: "Add Resumes",
                    url: "/upload",
                },
                {
                    title: "Candidates",
                    url: "/candidates",
                }
            ],
        },
        {
            title: "Manage",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Jobs",
                    url: "/jobs",
                },
                {
                    title: "Applications",
                    url: "/applications",
                },
            ]
        },
        {
            title: "Interviews",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Manage Interviews",
                    url: "/interviews",
                },
            ],
        }
    ],
    admin: [
        {
            title: "Analytics",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Dashboard",
                    url: "/analytics",
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
                    title: "Add Resume",
                    url: "/upload",
                },
                {
                    title: "Candidates",
                    url: "/candidates",
                }
            ],
        },
        {
            title: "Manage",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Jobs",
                    url: "/jobs",
                },
                {
                    title: "Applications",
                    url: "/applications",
                },
            ],
        },
        {
            title: "Interviews",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Manage Interviews",
                    url: "/interviews",
                },
            ],
        },
    ]
}

const SIDEBAR_TITLE = 'TalentSYNC';

export { navigationByRole, SIDEBAR_TITLE };