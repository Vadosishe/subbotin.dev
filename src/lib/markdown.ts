import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

export interface BlogPostData {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
}

export interface BlogPost extends BlogPostData {
    contentHtml: string;
}

// Загружает все посты (превью)
export function getSortedPostsData(): BlogPostData[] {
    if (!fs.existsSync(contentDirectory)) return [];

    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(contentDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            const matterResult = matter(fileContents);

            return {
                slug,
                title: matterResult.data.title || slug,
                date: matterResult.data.date || '',
                excerpt: matterResult.data.excerpt || '',
            };
        });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

// Загружает отдельный пост по слагу
export async function getPostData(slug: string): Promise<BlogPost> {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        title: matterResult.data.title || slug,
        date: matterResult.data.date || '',
        excerpt: matterResult.data.excerpt || '',
    };
}
