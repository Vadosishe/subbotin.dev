import { NextResponse } from "next/server";

export const revalidate = 300; // 5 minutes

type GitHubEvent = {
    id: string;
    type: string;
    repo: { name: string; url: string };
    payload: any;
    created_at: string;
};

function getEventDetails(event: GitHubEvent): { icon: string; description: string; url: string } | null {
    const repoUrl = `https://github.com/${event.repo.name}`;

    switch (event.type) {
        case "PushEvent": {
            const commits = event.payload.commits ?? [];
            const msg = commits[0]?.message?.split("\n")[0] || "Pushed commits";
            const sha = commits[0]?.sha;
            return {
                icon: "push",
                description: msg,
                url: sha ? `${repoUrl}/commit/${sha}` : repoUrl,
            };
        }
        case "CreateEvent": {
            const ref = event.payload.ref || "";
            const refType = event.payload.ref_type || "repository";
            return {
                icon: "create",
                description: refType === "branch" ? `Created branch ${ref}` : `Created ${refType}`,
                url: repoUrl,
            };
        }
        case "PullRequestEvent": {
            const pr = event.payload.pull_request;
            const action = event.payload.action || "opened";
            return {
                icon: "pr",
                description: `${action.charAt(0).toUpperCase() + action.slice(1)} PR: ${pr?.title || ""}`,
                url: pr?.html_url || repoUrl,
            };
        }
        case "IssuesEvent": {
            const issue = event.payload.issue;
            const action = event.payload.action || "opened";
            return {
                icon: "issue",
                description: `${action.charAt(0).toUpperCase() + action.slice(1)} issue: ${issue?.title || ""}`,
                url: issue?.html_url || repoUrl,
            };
        }
        case "WatchEvent":
            return {
                icon: "star",
                description: `Starred ${event.repo.name}`,
                url: repoUrl,
            };
        case "ForkEvent":
            return {
                icon: "fork",
                description: `Forked ${event.repo.name}`,
                url: repoUrl,
            };
        case "DeleteEvent":
            return {
                icon: "delete",
                description: `Deleted ${event.payload.ref_type} ${event.payload.ref}`,
                url: repoUrl,
            };
        default:
            return null;
    }
}

export async function GET() {
    const GITHUB_USERNAME = "Vadosishe";

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`,
            {
                headers: { Accept: "application/vnd.github+json" },
                next: { revalidate: 300 },
            }
        );

        if (!response.ok) throw new Error(`GitHub API: ${response.status}`);

        const events: GitHubEvent[] = await response.json();

        const activity = events
            .map((event) => {
                const details = getEventDetails(event);
                if (!details) return null;
                return {
                    id: event.id,
                    type: event.type,
                    icon: details.icon,
                    repo: event.repo.name.replace(`${GITHUB_USERNAME}/`, ""),
                    repoFull: event.repo.name,
                    description: details.description,
                    url: details.url,
                    date: event.created_at,
                };
            })
            .filter(Boolean)
            .slice(0, 5);

        return NextResponse.json({ activity });
    } catch (error) {
        console.error("GitHub Activity Error:", error);
        return NextResponse.json({ activity: [] });
    }
}
