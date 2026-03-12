/**
 * Типы блоков для конструктора
 */
export type BlockType =
    | 'ProfileCard'
    | 'ServicesCard'
    | 'BlogWidget'
    | 'GitHubWidget'
    | 'GearWidget'
    | 'StatusWidget'
    | 'TechMarquee';

export interface GridBlock {
    id: string;
    type: BlockType;
    colSpan: number; // 1, 2, or 3
    rowSpan?: number;
    color?: string; // Цвет Spotlight эффекта
    delay?: number; // Задержка анимации FadeIn
    props?: any;    // Дополнительные пропсы для компонента
}

/**
 * Текущая конфигурация главной страницы
 */
export const gridConfig: GridBlock[] = [
    {
        id: 'profile',
        type: 'ProfileCard',
        colSpan: 2,
        rowSpan: 2,
        color: 'rgba(129, 140, 248, 0.15)',
        delay: 0.1
    },
    {
        id: 'services',
        type: 'ServicesCard',
        colSpan: 1,
        rowSpan: 2,
        color: 'rgba(99, 102, 241, 0.1)',
        delay: 0.2
    },
    {
        id: 'blog',
        type: 'BlogWidget',
        colSpan: 3,
        color: 'rgba(16, 185, 129, 0.12)',
        delay: 0.3
    },
    {
        id: 'github',
        type: 'GitHubWidget',
        colSpan: 1,
        color: 'rgba(79, 70, 229, 0.15)',
        delay: 0.4
    },
    {
        id: 'gear',
        type: 'GearWidget',
        colSpan: 1,
        color: 'rgba(249, 115, 22, 0.1)',
        delay: 0.5
    },
    {
        id: 'status',
        type: 'StatusWidget',
        colSpan: 1,
        color: 'rgba(34, 197, 94, 0.15)',
        delay: 0.6
    },
    {
        id: 'marquee',
        type: 'TechMarquee',
        colSpan: 3,
        delay: 0.7
    }
];
