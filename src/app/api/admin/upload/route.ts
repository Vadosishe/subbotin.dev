import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function POST(request: Request) {
    try {
        const isAuth = await verifySession();
        if (!isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Content = buffer.toString('base64');

        // Generate a unique filename using timestamp
        const ext = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filePath = `public/uploads/${fileName}`;

        // Upload to GitHub
        const githubToken = process.env.GITHUB_TOKEN;
        const repoOwner = process.env.GITHUB_OWNER || "Vadosishe";
        const repoName = process.env.GITHUB_REPO || "subbotin.dev";
        const branch = process.env.GITHUB_BRANCH || "main";

        if (!githubToken) {
            return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
        }

        const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

        const githubRes = await fetch(githubApiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
                'User-Agent': 'subbotin-dev-cms'
            },
            body: JSON.stringify({
                message: `📸 chore: upload image ${fileName} [skip ci]`,
                content: base64Content,
                branch: branch
            })
        });

        if (!githubRes.ok) {
            const errorData = await githubRes.json();
            console.error("GitHub API Image Upload Error:", errorData);
            return NextResponse.json({ error: "Failed to upload image to GitHub", details: errorData }, { status: 500 });
        }

        const publicUrl = `/uploads/${fileName}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        console.error("Admin Image Upload error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
