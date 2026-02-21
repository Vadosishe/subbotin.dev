export interface Project {
    slug: string;
    title: string;
    description: { ru: string; en: string };
    longDescription: { ru: string; en: string };
    stack: string[];
    status: "active" | "beta" | "archived";
    link?: string;
    github?: string;
}

/**
 * Массив проектов. Чтобы добавить новый проект — добавь объект в этот массив.
 * slug — уникальный идентификатор, он же будет в URL: /projects/slug
 */
export const projects: Project[] = [
    {
        slug: "project-alpha",
        title: "Project Alpha",
        description: {
            ru: "Продвинутая система RAG для автоматизации поддержки клиентов на базе LLM.",
            en: "Advanced RAG system for customer support automation based on LLMs."
        },
        longDescription: {
            ru: `
Project Alpha — это интеллектуальная система Retrieval-Augmented Generation (RAG), 
разработанная для автоматизации клиентской поддержки.

## Основные возможности

- **Умный поиск по базе знаний** — система находит релевантные документы и формирует точные ответы
- **Интеграция с мессенджерами** — поддержка Telegram, WhatsApp, и виджета на сайте  
- **Аналитика обращений** — дашборд с метриками качества ответов и частых вопросов
- **Мультиязычность** — автоматическое определение языка и ответ на нём

## Как это работает

1. Пользователь задаёт вопрос через любой канал связи
2. Система ищет релевантные фрагменты в векторной базе данных (Pinecone)
3. LLM генерирует ответ на основе найденного контекста
4. Ответ проходит проверку на релевантность, затем отправляется пользователю
            `,
            en: `
Project Alpha is an intelligent Retrieval-Augmented Generation (RAG) system 
designed to automate customer support.

## Key Features

- **Smart Knowledge Base Search** — the system finds relevant documents and generates accurate answers
- **Messenger Integration** — support for Telegram, WhatsApp, and an on-site widget
- **Support Analytics** — dashboard with response quality metrics and FAQ tracking
- **Multilingual** — automatic language detection and response

## How it works

1. User asks a question through any communication channel
2. System searches for relevant fragments in a vector database (Pinecone)
3. LLM generates a response based on the found context
4. Response is validated for relevance and then sent to the user
            `
        },
        stack: ["Next.js", "Python", "Pinecone", "OpenAI", "n8n"],
        status: "active",
        github: "https://github.com/vadosishe",
    },
    {
        slug: "nexus-ui",
        title: "Nexus UI",
        description: {
            ru: "Библиотека компонентов для быстрых и красивых дашбордов на React.",
            en: "Component library for fast and beautiful React-based dashboards."
        },
        longDescription: {
            ru: `
Nexus UI — это библиотека React-компонентов, созданная для быстрого прототипирования 
и разработки аналитических дашбордов.

## Основные возможности

- **30+ компонентов** — графики, таблицы, фильтры, карточки KPI и многое другое
- **Темизация** — полная поддержка светлой и тёмной тем из коробки
- **Адаптивность** — все компоненты корректно работают на мобильных устройствах
- **TypeScript** — строгая типизация для безопасной разработки

## Философия

Минимум конфигурации, максимум результата. Каждый компонент разработан так, 
чтобы выглядеть хорошо по умолчанию, но легко кастомизироваться при необходимости.
            `,
            en: `
Nexus UI is a React component library built for rapid prototyping 
and analytical dashboard development.

## Key Features

- **30+ Components** — charts, tables, filters, KPI cards, and more
- **Theming** — full support for light and dark modes out of the box
- **Responsive** — all components work correctly on mobile devices
- **TypeScript** — strict typing for safe development

## Philosophy

Minimum configuration, maximum result. Each component is designed 
to look good by default while being easily customizable when needed.
            `
        },
        stack: ["React", "TypeScript", "Tailwind CSS", "Storybook"],
        status: "beta",
        link: "https://github.com/vadosishe",
    },
    {
        slug: "ai-writer",
        title: "AI Writer",
        description: {
            ru: "Генератор контента для блогов с SEO оптимизацией на Next.js.",
            en: "SEO-optimized blog content generator built with Next.js."
        },
        longDescription: {
            ru: `
AI Writer — инструмент для автоматической генерации SEO-оптимизированного контента 
для блогов и маркетинговых страниц.

## Основные возможности

- **Генерация статей** — полноценные посты по заданной теме с учётом ключевых слов
- **SEO-анализ** — проверка мета-тегов, заголовков, плотности ключевых слов
- **Стиль и тон** — настройка tone of voice под бренд

## Технические детали

Фронтенд на Next.js с App Router, бэкенд использует API OpenAI для генерации, 
а результаты сохраняются в Markdown-формате, готовом для публикации.
            `,
            en: `
AI Writer is a tool for automatic generation of SEO-optimized content 
for blogs and marketing pages.

## Key Features

- **Article Generation** — full-fledged posts based on a set topic and keywords
- **SEO Analysis** — metadata, headers, and keyword density checking
- **Style and Tone** — customizable tone of voice for branding

## Technical Details

Frontend on Next.js with App Router, backend uses OpenAI API for generation, 
and results are saved in Markdown format, ready for publication.
            `
        },
        stack: ["Next.js", "OpenAI", "Tailwind CSS", "MDX"],
        status: "archived",
        github: "https://github.com/vadosishe",
    },
];

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}
