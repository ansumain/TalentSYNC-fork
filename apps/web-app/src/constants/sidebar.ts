import { SquareTerminal } from "lucide-react"

const navigationByRole = {
    candidate: [
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
        },
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
                    title: "Applied",
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
                    title: "Manage Interviews",
                    url: "/interviews",
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
        }
    ]
}

const SIDEBAR_TITLE = 'TalentSYNC';

export { navigationByRole, SIDEBAR_TITLE };