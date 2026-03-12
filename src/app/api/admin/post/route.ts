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

            let sha = undefined;

            // Try to get the file first to check if it exists (for updates)
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

            // Encode to base64 for GitHub API
            const encodedContent = Buffer.from(frontmatter).toString('base64');

            const payload: any = {
                message: sha ? `📝 feat(blog): updated post "${title}"` : `📝 feat(blog): added post "${title}"`,
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

        const filePath = `content/${slug}.md`;
        const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

        // Get file SHA first
        const getRes = await fetch(githubApiUrl, {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'User-Agent': 'subbotin-dev-cms'
            }
        });

        if (!getRes.ok) {
            return NextResponse.json({ error: "Post not found or GitHub API error" }, { status: 404 });
        }

        const fileData = await getRes.json();

        // Delete file
        const deleteRes = await fetch(githubApiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
                'User-Agent': 'subbotin-dev-cms'
            },
            body: JSON.stringify({
                message: `🗑️ chore(blog): deleted post "${slug}"`,
                sha: fileData.sha,
                branch: branch
            })
        });

        if (!deleteRes.ok) {
            const errorData = await deleteRes.json();
            return NextResponse.json({ error: "Failed to delete from GitHub", details: errorData }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
