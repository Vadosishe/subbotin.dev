import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
    try {
        const isAuth = await verifySession();
        if (!isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const projectsDir = path.join(process.cwd(), "content/projects");

        if (!fs.existsSync(projectsDir)) {
            return NextResponse.json({ projects: [] });
        }

        const files = fs.readdirSync(projectsDir).filter(file => file.endsWith('.md'));

        const projects = files.map(file => {
            const filePath = path.join(projectsDir, file);
            const source = fs.readFileSync(filePath, "utf-8");
            const { data, content } = matter(source);

            return {
                slug: file.replace('.md', ''),
                title: data.title || "Untitled",
                date: data.date || "",
                // In projects we often use 'stack' (array) instead of just 'tags'
                stack: Array.isArray(data.stack) ? data.stack.join(", ") : (data.stack || ""),
                description: data.description || "",
                link: data.link || "",
                github: data.github || "",
                status: data.status || "active",
                content: content
            };
        });

        return NextResponse.json({ projects });
    } catch (error: any) {
        console.error("Failed to fetch projects:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
