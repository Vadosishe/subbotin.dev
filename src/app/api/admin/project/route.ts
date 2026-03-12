import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function POST(request: Request) {
    try {
        const isAuth = await verifySession();
        if (!isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, slug, content, date, stack, description, link, github, status } = body;

        if (!title || !slug || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Prepare stack as array for frontmatter
        const stackArr = stack ? stack.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
        const stackString = JSON.stringify(stackArr);

        const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date || new Date().toISOString().split('T')[0]}"
description: "${(description || "").replace(/"/g, '\\"')}"
stack: ${stackString}
status: "${status || "active"}"
link: "${link || ""}"
github: "${github || ""}"
---

${content}`;

        const githubToken = process.env.GITHUB_TOKEN;
        const repoOwner = process.env.GITHUB_OWNER || "Vadosishe";
        const repoName = process.env.GITHUB_REPO || "subbotin.dev";
        const branch = process.env.GITHUB_BRANCH || "main";

        if (githubToken) {
            const filePath = `content/projects/${slug}.md`;
            const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

            let sha = undefined;
            const getRes = await fetch(githubApiUrl, {
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'User-Agent': 'subbotin-dev-cms'
                }
            });

            if (getRes.ok) {
                const fileData = await getRes.json();
                sha = fileData.sha;
            }

            const encodedContent = Buffer.from(frontmatter).toString('base64');
            const payload: any = {
                message: sha ? `📝 feat(projects): updated project "${title}"` : `📝 feat(projects): added project "${title}"`,
                content: encodedContent,
                branch: branch
            };
            if (sha) payload.sha = sha;

            const githubRes = await fetch(githubApiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'subbotin-dev-cms'
                },
                body: JSON.stringify(payload)
            });

            if (!githubRes.ok) {
                const errorData = await githubRes.json();
                return NextResponse.json({ error: errorData.message || "Failed to save to GitHub" }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, slug });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const isAuth = await verifySession();
        if (!isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const slug = url.searchParams.get("slug");

        if (!slug) {
            return NextResponse.json({ error: "Missing slug" }, { status: 400 });
        }

        const githubToken = process.env.GITHUB_TOKEN;
        const repoOwner = process.env.GITHUB_OWNER || "Vadosishe";
        const repoName = process.env.GITHUB_REPO || "subbotin.dev";
        const branch = process.env.GITHUB_BRANCH || "main";

        if (!githubToken) {
            return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
        }

        const filePath = `content/projects/${slug}.md`;
        const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

        // Get SHA
        const getRes = await fetch(githubApiUrl, {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'User-Agent': 'subbotin-dev-cms'
            }
        });

        if (!getRes.ok) {
            return NextResponse.json({ error: "Project not found or GitHub API error" }, { status: 404 });
        }

        const fileData = await getRes.json();

        // Delete
        const deleteRes = await fetch(githubApiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
                'User-Agent': 'subbotin-dev-cms'
            },
            body: JSON.stringify({
                message: `🗑️ chore(projects): deleted project "${slug}"`,
                sha: fileData.sha,
                branch: branch
            })
        });

        if (!deleteRes.ok) {
            return NextResponse.json({ error: "Failed to delete from GitHub" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
