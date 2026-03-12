import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function POST(request: Request) {
    try {
        const isAuth = await verifySession();
        if (!isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, slug, date, tags, content } = body;

        if (!title || !slug || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const formattedTags = tags
            ? tags.split(',').map((t: string) => `"${t.trim()}"`).filter(Boolean).join(', ')
            : "";

        const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date || new Date().toISOString().split('T')[0]}"
tags: [${formattedTags}]
---

${content}`;

        // 1. Commit to GitHub directly
        const githubToken = process.env.GITHUB_TOKEN;
        const repoOwner = process.env.GITHUB_OWNER || "Vadosishe";
        const repoName = process.env.GITHUB_REPO || "subbotin.dev";
        const branch = process.env.GITHUB_BRANCH || "main";

        if (githubToken) {
            const { commitMultipleFiles } = await import("@/lib/github");

            const filesToCommit = [];
            
            // Add RU file
            filesToCommit.push({
                path: `content/${slug}.md`,
                content: frontmatter
            });

            // Add EN file if provided in payload
            const { titleEn, contentEn } = body;
            if (titleEn && contentEn) {
                const frontmatterEn = `---
title: "${titleEn.replace(/"/g, '\\"')}"
date: "${date || new Date().toISOString().split('T')[0]}"
tags: [${formattedTags}]
lang: en
---

${contentEn}`;
                filesToCommit.push({
                    path: `content/${slug}.en.md`,
                    content: frontmatterEn
                });
            }

            try {
                await commitMultipleFiles({
                    files: filesToCommit,
                    commitMessage: `📝 feat(blog): updated post "${title}"${titleEn ? ' (+ en)' : ''}`,
                    githubToken,
                    repoOwner,
                    repoName,
                    branch
                });
            } catch (err: any) {
                console.error("GitHub API Error:", err);
                return NextResponse.json({ error: "Failed to save to GitHub", details: err.message }, { status: 500 });
            }
        } else {
            console.log("WARN: GITHUB_TOKEN not set, skipping GitHub commit. (Dev mode)");
        }

        // 2. Ping n8n Webhook for Crossposting / Automations
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (webhookUrl) {
            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'post_published',
                        data: {
                            title,
                            slug,
                            date,
                            tags,
                            url: `https://subbotin.dev/blog/${slug}`,
                            snippet: content.substring(0, 300) + '...'
                        }
                    })
                });
            } catch (err) {
                console.error("Failed to ping n8n webhook", err);
            }
        }

        return NextResponse.json({ success: true, slug });
    } catch (error: any) {
        console.error("Admin POST error:", error);
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
                    { path: `content/${slug}.md`, content: null },
                    { path: `content/${slug}.en.md`, content: null }
                ],
                commitMessage: `🗑️ chore(blog): deleted post "${slug}"`,
                githubToken,
                repoOwner,
                repoName,
                branch
            });
        } catch (err: any) {
            console.error("GitHub API Delete Error:", err);
            // It might fail if one of the files doesn't exist, but GitHub Trees API handles partial tree updates if we just omit sha,
            // actually if we pass sha: null for a non-existent file Trees API throws an error.
            // A more robust delete is needed, but for now we try/catch to let it pass or fail loudly.
            return NextResponse.json({ error: "Failed to delete from GitHub", details: err.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
