import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// GET request to list all posts
export async function GET() {
    try {
        const isAuth = await verifySession();
        if (!isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const contentDir = path.join(process.cwd(), "content");

        if (!fs.existsSync(contentDir)) {
            return NextResponse.json({ posts: [] });
        }

        const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));

        const posts = files.map(file => {
            const filePath = path.join(contentDir, file);
            const source = fs.readFileSync(filePath, "utf-8");
            const { data, content } = matter(source);

            return {
                slug: file.replace('.md', ''),
                title: data.title || "Untitled",
                date: data.date || "",
                tags: data.tags?.join(", ") || "",
                content: content
            };
        });

        // Sort posts by date descending
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({ posts });
    } catch (error: any) {
        console.error("Failed to fetch posts:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
