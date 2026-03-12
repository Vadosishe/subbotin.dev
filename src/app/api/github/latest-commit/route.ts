import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch(
            "https://api.github.com/repos/vadosishe/subbotin.dev/commits?per_page=1",
            {
                headers: {
                    "Accept": "application/vnd.github+json",
                },
                next: { revalidate: 300 }, // Cache for 5 minutes
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub API responded with ${response.status}`);
        }

        const commits = await response.json();

        if (!Array.isArray(commits) || commits.length === 0) {
            throw new Error("No commits found");
        }

        const latest = commits[0];

        return NextResponse.json({
            message: latest.commit?.message || "Latest update",
            sha: latest.sha,
            url: latest.html_url,
            date: latest.commit?.author?.date,
        });
    } catch (error) {
        console.error("GitHub Latest Commit API Error:", error);
        return NextResponse.json({
            message: "Latest update",
            sha: null,
            url: "https://github.com/vadosishe/subbotin.dev",
            date: null,
        });
    }
}
