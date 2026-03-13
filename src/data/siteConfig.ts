/**
 * Конфигурация сайта — редактируй здесь текст статуса, email и другие настройки.
 */
export const siteConfig = {
    name: {
        ru: "Влад Субботин",
        en: "Vlad Subbotin"
    },
    role: {
        ru: "Solutions Architect & Automation Lead", // Более солидно
        en: "Solutions Architect & Automation Lead"
    },
    age: 26,
    email: "vladsubbotin35@gmail.com",
    avatar: "/vlad.JPG",
    bio: {
        ru: "Архитектор IT-инфраструктуры и автоматизации. Проектирую отказоустойчивые системы на базе Docker, развертываю сервисы и создаю сложные сценарии в n8n. Бесшовно интегрирую HubSpot и другие CRM-системы с вашим стеком, превращая хаос в процессах в стабильный и безопасный цифровой механизм.",
        en: "IT Infrastructure & Automation Architect. I design resilient Docker-based systems and build complex n8n workflows. I seamlessly integrate HubSpot and other CRMs into your tech stack, transforming process chaos into a stable, secure, and scalable digital engine."
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
            name: "n8n & Make",
            description: {
                ru: "Проектирование сложных сценариев интеграции и автоматизации бизнес-процессов",
                en: "Designing complex integration scenarios and business process automations"
            },
            icon: "Workflow"
        },
        {
            name: "Docker & Infrastructure", // Добавили вместо чистого реакта
            description: {
                ru: "Контейнеризация приложений и развертывание отказоустойчивых сред",
                en: "App containerization and deploying resilient environments"
            },
            icon: "Box"
        },
        {
            name: "HubSpot & CRM",
            description: {
                ru: "Глубокая кастомизация CRM, создание кастомных карточек и автоматизаций",
                en: "Deep CRM customization, building custom cards and automations"
            },
            icon: "Database"
        },
        {
            name: "Linux & Networks", // Добавили вместо Framer Motion
            description: {
                ru: "Администрирование серверов, настройка VPN и безопасных соединений",
                en: "Server administration, VPN setup, and secure networking"
            },
            icon: "Shield"
        },
        {
            name: "TypeScript & Node.js",
            description: {
                ru: "Разработка надежной серверной логики и API",
                en: "Developing robust server-side logic and APIs"
            },
            icon: "Code2"
        },
        {
            name: "Git & Version Control",
            description: {
                ru: "Управление кодом и автоматизация деплоя (CI/CD)",
                en: "Code management and deployment automation (CI/CD)"
            },
            icon: "GitBranch"
        },
        {
            name: "AI & LLM Integration",
            description: {
                ru: "Внедрение нейросетей (OpenAI, Anthropic) в бизнес-процессы через n8n",
                en: "Integrating AI models (OpenAI, Anthropic) into business workflows via n8n"
            },
            icon: "Zap"
        },
        {
            name: "Databases (SQL/NoSQL)",
            description: {
                ru: "Проектирование структур данных и работа с PostgreSQL/Supabase",
                en: "Database schema design and working with PostgreSQL/Supabase"
            },
            icon: "Database"
        },
        {
            name: "API Design & Webhooks",
            description: {
                ru: "Проектирование REST интеграций и обработка данных в реальном времени",
                en: "Designing REST integrations and real-time data processing"
            },
            icon: "Link"
        }
        // React можно оставить в конце как доп. навык
    ],

    /** Список оборудования (для GearWidget) */
    gear: [
        // Твой обновленный блок с Environment идеально вписывается
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
                ru: "MacBook Pro / Remote setup",
                en: "MacBook Pro / Remote setup"
            },
            icon: "Laptop"
        },
        {
            name: { ru: "Environment", en: "Environment" },
            description: {
                ru: "Windows 11 + Ubuntu (WSL2) / Docker Engine",
                en: "Windows 11 + Ubuntu (WSL2) / Docker Engine"
            },
            icon: "Terminal"
        },
    ],

    metrics: [
        { value: 4, suffix: "+", label: { ru: "Года опыта", en: "Years exp" } },
        { value: 50, suffix: "+", label: { ru: "Сценариев n8n", en: "n8n Workflows" } },
        { value: 1000, suffix: "+", label: { ru: "Часов рутины сэкономлено", en: "Hours of manual work saved" } },
        { value: 99, suffix: ".9%", label: { ru: "Uptime систем", en: "Uptime" } } // Заменили вовлеченность
    ],

    /** Переводы для интерфейса */
    ui: {
        nav: {
            home: { ru: "Главная", en: "Home" },
            blog: { ru: "Блог", en: "Blog" }
        },
        widgets: {
            metrics: { ru: "В цифрах", en: "By the numbers" },
            workflow: {
                title: { ru: "Мои воркфлоу", en: "My Workflows" },
                nodes: {
                    source: { ru: "Источник данных (CRM, Внешняя система)", en: "Data Source (CRM, External System)" },
                    engine: { ru: "Инструмент автоматизации (n8n, Make, Python)", en: "Automation Tool (n8n, Make, Python)" },
                    output: { ru: "Выходная система (База, Сервис, Дашборд)", en: "Output System (Database, SaaS, Dashboard)" }
                },
                scenarios: [
                    {
                        ru: "Двусторонняя синхронизация HubSpot и PostgreSQL",
                        en: "Two-way HubSpot and PostgreSQL synchronization",
                        link: "https://n8n.io/workflows/1831-keep-hubspot-and-postgres-in-sync/"
                    },
                    {
                        ru: "Автоматизация скоринга лидов с помощью OpenAI",
                        en: "AI-powered lead scoring using OpenAI",
                        link: "https://n8n.io/workflows/1951-score-leads-using-openai-and-update-hubspot/"
                    },
                    {
                        ru: "Интеллектуальная маршрутизация лидов в Slack/CRM",
                        en: "Intelligent lead routing to Slack/CRM",
                        link: "https://n8n.io/workflows/1987-send-a-slack-notification-for-new-hubspot-leads/"
                    },
                    {
                        ru: "Мониторинг здоровья инфраструктуры и уведомления",
                        en: "Infrastructure health monitoring and alerts",
                        link: "https://n8n.io/workflows/1033-server-monitoring-and-notification-workflow/"
                    }
                ]
            }
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
            location: { ru: "Россия / Удаленно", en: "Remote / Worldwide" }
        }
    }
};
