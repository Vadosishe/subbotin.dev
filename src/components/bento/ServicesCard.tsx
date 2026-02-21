import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { projects } from "@/data/projects";

const statusColors: Record<string, string> = {
    active: "bg-green-500/20 text-green-400",
    beta: "bg-yellow-500/20 text-yellow-400",
    archived: "bg-gray-500/20 text-gray-400",
};

export function ServicesCard() {
    return (
        <div className="bento-card col-span-1 md:col-span-1 row-span-2 rounded-3xl p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-sm" style={{ color: 'var(--accent)' }}>🛠</span>
                Мои поделки
            </h2>

            <div className="flex flex-col gap-4 flex-grow">
                {projects.map((project) => (
                    <Link
                        key={project.slug}
                        href={`/projects/${project.slug}`}
                        className="group relative flex flex-col gap-1 p-4 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold group-hover:text-indigo-400 transition-colors">
                                    {project.title}
                                </h3>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>
                                    {project.status === "active" ? "●" : project.status === "beta" ? "β" : "◌"}
                                </span>
                            </div>
                            <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm line-clamp-2 mt-1" style={{ color: 'var(--muted)' }}>
                            {project.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
