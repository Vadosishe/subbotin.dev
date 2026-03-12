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
            const filePath = `content/${slug}.md`;
            const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

            // Encode to base64 for GitHub API
            const encodedContent = Buffer.from(frontmatter).toString('base64');

            const githubRes = await fetch(githubApiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'subbotin-dev-cms'
                },
                body: JSON.stringify({
                    message: `📝 feat(blog): added post "${title}"`,
                    content: encodedContent,
                    branch: branch
                })
            });

            if (!githubRes.ok) {
                const errorData = await githubRes.json();
                console.error("GitHub API Error:", errorData);
                return NextResponse.json({ error: "Failed to save to GitHub", details: errorData }, { status: 500 });
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
