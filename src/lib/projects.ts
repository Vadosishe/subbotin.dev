import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export interface ProjectData {
    slug: string;
    title: string;
    date: string;
    description: { ru: string; en: string };
    longDescription: { ru: string; en: string }; // Keep for compatibility with ProjectClient
    stack: string[];
    status: "active" | "beta" | "archived";
    link?: string;
    github?: string;
    contentHtml: string;
}

export function getAllProjects(): ProjectData[] {
    if (!fs.existsSync(projectsDirectory)) return [];

    const fileNames = fs.readdirSync(projectsDirectory);
    const allProjectsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(projectsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            const matterResult = matter(fileContents);
            const data = matterResult.data;

            // Handle description which might be a string in dynamic files or object in migrated files
            const desc = typeof data.description === 'string'
                ? { ru: data.description, en: data.description }
                : data.description || { ru: '', en: '' };

            return {
                slug,
                title: data.title || slug,
                date: data.date || '',
                description: desc,
                longDescription: { ru: matterResult.content, en: matterResult.content }, // Content is now our long description
                stack: data.stack || [],
                status: data.status || 'active',
                link: data.link || '',
                github: data.github || '',
                contentHtml: '', // To be filled by async fetcher if needed, or left empty for list
            } as ProjectData;
        });

    return allProjectsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getProjectData(slug: string): Promise<ProjectData | null> {
    const fullPath = path.join(projectsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const data = matterResult.data;

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    const desc = typeof data.description === 'string'
        ? { ru: data.description, en: data.description }
        : data.description || { ru: '', en: '' };

    return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        description: desc,
        longDescription: { ru: matterResult.content, en: matterResult.content },
        stack: data.stack || [],
        status: data.status || 'active',
        link: data.link || '',
        github: data.github || '',
        contentHtml,
    };
}
