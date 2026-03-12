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
            const { commitMultipleFiles } = await import("@/lib/github");

            const filesToCommit = [];
            
            // Add RU file
            filesToCommit.push({
                path: `content/projects/${slug}.md`,
                content: frontmatter
            });

            const { titleEn, contentEn, descriptionEn } = body;
            if (titleEn && contentEn) {
                const frontmatterEn = `---
title: "${titleEn.replace(/"/g, '\\"')}"
date: "${date || new Date().toISOString().split('T')[0]}"
description: "${(descriptionEn || "").replace(/"/g, '\\"')}"
stack: ${stackString}
status: "${status || "active"}"
link: "${link || ""}"
github: "${github || ""}"
lang: en
---

${contentEn}`;
                filesToCommit.push({
                    path: `content/projects/${slug}.en.md`,
                    content: frontmatterEn
                });
            }

            try {
                await commitMultipleFiles({
                    files: filesToCommit,
                    commitMessage: `📝 feat(projects): updated project "${title}"${titleEn ? ' (+ en)' : ''}`,
                    githubToken,
                    repoOwner,
                    repoName,
                    branch
                });
            } catch (err: any) {
                return NextResponse.json({ error: "Failed to save to GitHub", details: err.message }, { status: 500 });
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

        const { commitMultipleFiles } = await import("@/lib/github");

        try {
            await commitMultipleFiles({
                files: [
                    { path: `content/projects/${slug}.md`, content: null },
                    { path: `content/projects/${slug}.en.md`, content: null }
                ],
                commitMessage: `🗑️ chore(projects): deleted project "${slug}"`,
                githubToken,
                repoOwner,
                repoName,
                branch
            });
        } catch (err: any) {
            return NextResponse.json({ error: "Failed to delete from GitHub", details: err.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
