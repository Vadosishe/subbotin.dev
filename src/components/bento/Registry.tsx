"use client";

import React from "react";
import { ProfileCard } from "./ProfileCard";
import { ServicesCard } from "./ServicesCard";
import { BlogWidget } from "./BlogWidget";
import { GitHubWidget } from "./GitHubWidget";
import { GearWidget } from "./GearWidget";
import { StatusWidget } from "./StatusWidget";
import { TechMarquee } from "./TechMarquee";
import { MetricsWidget } from "./MetricsWidget";
import { WorkflowWidget } from "./WorkflowWidget";
import { BlockType } from "@/data/gridConfig";

/**
 * Реестр доступных компонентов Bento
 */
export const COMPONENT_REGISTRY: Record<BlockType, React.ComponentType<any>> = {
    ProfileCard: ProfileCard,
    ServicesCard: ServicesCard,
    BlogWidget: BlogWidget,
    GitHubWidget: GitHubWidget,
    GearWidget: GearWidget,
    StatusWidget: StatusWidget,
    TechMarquee: TechMarquee,
    MetricsWidget: MetricsWidget,
    WorkflowWidget: WorkflowWidget,
};

interface RenderBlockProps {
    type: BlockType;
    props?: any;
}

/**
 * Вспомогательная функция для рендеринга компонента по его типу
 */
export function RenderBlock({ type, props }: RenderBlockProps) {
    const Component = COMPONENT_REGISTRY[type];

    if (!Component) {
        return <div className="p-4 bg-red-500/10 text-red-500 rounded-xl">Unknown block type: {type}</div>;
    }

    return <Component {...props} />;
}
