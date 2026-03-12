import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function POST(request: Request) {
    try {
        const isAuth = await verifySession();
        if (!isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slugs, mode, action } = await request.json();

        if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
            return NextResponse.json({ error: "No slugs provided" }, { status: 400 });
        }

        const githubToken = process.env.GITHUB_TOKEN;
        const repoOwner = process.env.GITHUB_OWNER || "Vadosishe";
        const repoName = process.env.GITHUB_REPO || "subbotin.dev";
        const branch = process.env.GITHUB_BRANCH || "main";

        if (!githubToken) {
            return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
        }

        const { commitMultipleFiles } = await import("@/lib/github");
        const filesToCommit: { path: string, content: string }[] = [];

        const baseDir = mode === "posts" ? "content" : "content/projects";

        for (const slug of slugs) {
            // Check both potential files for the slug: .md and .en.md
            const filePathsToCheck = [`${slug}.md`, `${slug}.en.md`];

            for (const fileSuffix of filePathsToCheck) {
                const localPath = path.join(process.cwd(), baseDir, fileSuffix);
                
                if (fs.existsSync(localPath)) {
                    const fileContents = fs.readFileSync(localPath, "utf-8");
                    const parsed = matter(fileContents);
                    let { data, content } = parsed;

                    if (mode === "posts") {
                        if (action === "hide") {
                            data.draft = true;
                        } else if (action === "publish") {
                            delete data.draft;
                        }
                    } else if (mode === "projects") {
                        if (action === "hide") {
                            data.status = "archived";
                        } else if (action === "publish") {
                            data.status = "active";
                        }
                    }

                    const newMarkdown = matter.stringify(content.trim() + "\n", data);

                    filesToCommit.push({
                        path: `${baseDir}/${fileSuffix}`,
                        content: newMarkdown
                    });
                }
            }
        }

        if (filesToCommit.length === 0) {
             return NextResponse.json({ error: "No physical files found to update" }, { status: 400 });
        }

        const commitMessage = action === "hide" 
            ? `🙈 chore(${mode}): bulk hid ${slugs.length} items` 
            : `👁️ chore(${mode}): bulk published ${slugs.length} items`;

        await commitMultipleFiles({
            files: filesToCommit,
            commitMessage,
            githubToken,
            repoOwner,
            repoName,
            branch
        });

        return NextResponse.json({ success: true, count: filesToCommit.length });

    } catch (error: any) {
        console.error("Bulk Status API Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
