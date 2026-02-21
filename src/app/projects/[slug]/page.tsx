import { projects, getProjectBySlug } from "@/data/projects";
import ProjectClient from "@/components/ProjectClient";
import Link from "next/link";
import { Metadata } from "next";

interface Params {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const project = getProjectBySlug(params.slug);
    if (!project) return { title: "Проект не найден" };

    return {
        title: `${project.title} | Влад Субботин`,
        description: project.description.ru, // Для SEO используем RU описание по умолчанию
    };
}

export async function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage(props: Params) {
    const params = await props.params;
    const project = getProjectBySlug(params.slug);

    if (!project) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Проект не найден</h1>
                <Link href="/" className="text-indigo-400 hover:underline">← На главную</Link>
            </div>
        );
    }

    return <ProjectClient project={project} />;
}
