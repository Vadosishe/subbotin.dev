/**
 * Конфигурация сайта — редактируй здесь текст статуса, email и другие настройки.
 */
export const siteConfig = {
    name: "Влад Субботин",
    role: {
        ru: "Tech Explorer & Creator",
        en: "Tech Explorer & Creator"
    },
    age: 26,
    email: "vladsubbotin35@gmail.com",
    avatar: "/vlad.JPG",
    bio: {
        ru: "Я разработчик и творец, увлеченный современными технологиями. Создаю полезные инструменты и делюсь своим опытом.",
        en: "I am a developer and creator passionate about modern technologies. Building useful tools and sharing my experience."
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
            view: { ru: "Открыть Git", en: "View Git" },
            live: { ru: "Live", en: "Live" }
        },
        common: {
            copied: { ru: "Скопировано!", en: "Copied!" },
            email: { ru: "Email", en: "Email" },
            age: { ru: "лет", en: "years old" },
            location: { ru: "Москва", en: "Based in MSK" }
        }
    }
};
