/**
 * Конфигурация сайта — редактируй здесь текст статуса, email и другие настройки.
 */
export const siteConfig = {
    name: {
        ru: "Влад Субботин",
        en: "Vlad Subbotin"
    },
    role: {
        ru: "HubSpot Admin & Automation Lead",
        en: "HubSpot Admin & Automation Lead"
    },
    age: 26,
    email: "vladsubbotin35@gmail.com",
    avatar: "/vlad.JPG",
    bio: {
        ru: "Архитектор IT-инфраструктуры и автоматизации. Проектирую отказоустойчивые системы на базе Docker, развертываю сервисы и создаю сложные сценарии в n8n. Бесшовно интегрирую HubSpot и другие CRM-системы с вашим стеком, превращая хаос в процессах в стабильный и безопасный цифровой механизм.",
        en: "I automate business logic and build reliable IT environments. Expert in n8n workflows and CRM integrations (HubSpot & others). From Docker containerization to secure VPN setup, I provide end-to-end infrastructure that eliminates routine and ensures data security."
    },
    /** Текст и состояние виджета статуса */
    status: {
        text: {
            ru: "Работаю над чем-то новым",
            en: "Currently working on something new"
        },
        online: true,
    },

    socials: {
        telegram: "https://t.me/vlvdvlvd",
        github: "https://github.com/vadosishe",
    },

    /** Список навыков (для TechMarquee) */
    skills: [
        {
            name: "React & Next.js",
            description: {
                ru: "Создаю быстрые и SEO-оптимизированные веб-приложения",
                en: "Building fast and SEO-optimized web applications"
            },
            icon: "Atom"
        },
        {
            name: "TypeScript",
            description: {
                ru: "Строгая типизация для надежного и масштабируемого кода",
                en: "Strict typing for reliable and scalable code"
            },
            icon: "Code2"
        },
        {
            name: "HubSpot",
            description: {
                ru: "Глубокая кастомизация CRM, создание кастомных карточек и автоматизаций",
                en: "Deep CRM customization, building custom cards and automations"
            },
            icon: "Database"
        },
        {
            name: "n8n & Make",
            description: {
                ru: "Проектирование сложных сценариев интеграции и автоматизации бизнес-процессов",
                en: "Designing complex integration scenarios and business process automations"
            },
            icon: "Workflow"
        },
        {
            name: "Tailwind CSS",
            description: {
                ru: "Верстка современных и адаптивных интерфейсов",
                en: "Styling modern and responsive interfaces"
            },
            icon: "Palette"
        },
        {
            name: "Node.js",
            description: {
                ru: "Разработка надежных API и серверной логики",
                en: "Developing robust APIs and server-side logic"
            },
            icon: "Server"
        },
        {
            name: "Framer Motion",
            description: {
                ru: "Оживление интерфейсов с помощью плавных анимаций",
                en: "Bringing interfaces to life with smooth animations"
            },
            icon: "Sparkles"
        }
    ],

    /** Список оборудования (для GearWidget) */
    gear: [
        {
            name: { ru: "Workstation", en: "Workstation" },
            description: {
                ru: "AMD Ryzen 9 5950X / 32GB RAM / RTX 5070 Ti",
                en: "AMD Ryzen 9 5950X / 32GB RAM / RTX 5070 Ti"
            },
            icon: "Cpu"
        },
        {
            name: { ru: "Display", en: "Display" },
            description: {
                ru: "2x Xiaomi 27\" MiniLED / 200Hz",
                en: "2x Xiaomi 27\" MiniLED / 200Hz"
            },
            icon: "Monitor"
        },
        {
            name: { ru: "Mobility", en: "Mobility" },
            description: {
                ru: "MacBook Pro / Удаленная работа",
                en: "MacBook Pro / Remote setup"
            },
            icon: "Laptop"
        },
        {
            name: { ru: "Device", en: "Device" },
            description: {
                ru: "Nothing Phone (2) / Glyph Interface",
                en: "Nothing Phone (2) / Glyph Interface"
            },
            icon: "Smartphone"
        },
    ],

    /** Переводы для интерфейса */
    ui: {
        nav: {
            home: { ru: "Главная", en: "Home" },
            blog: { ru: "Блог", en: "Blog" }
        },
        blog: {
            latest: { ru: "Последние записи", en: "Latest Posts" },
            all: { ru: "Все посты", en: "All Posts" },
            empty: { ru: "Постов пока нет.", en: "No posts yet." }
        },
        github: {
            title: { ru: "Активность GitHub", en: "GitHub Activity" },
            activity: { ru: "GitHub Активность", en: "GitHub Activity" },
            latestEvents: { ru: "Последние действия", en: "Recent Activity" },
            view: { ru: "Открыть Git", en: "View Git" },
            live: { ru: "Live", en: "Live" },
            noActivity: { ru: "Нет недавней активности", en: "No recent activity" },
            ago: { ru: "назад", en: "ago" },
        },
        skills: {
            title: { ru: "Stack & Workflow", en: "Stack & Workflow" },
            hoverPrompt: { ru: "Наведи на навык", en: "Hover over a skill" }
        },
        common: {
            copied: { ru: "Скопировано!", en: "Copied!" },
            email: { ru: "Email", en: "Email" },
            age: { ru: "лет", en: "years old" },
            location: { ru: "Россия", en: "Based in Russia" }
        }
    }
};
