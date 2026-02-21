/**
 * Конфигурация сайта — редактируй здесь текст статуса, email и другие настройки.
 */
export const siteConfig = {
    name: "Влад Субботин",
    role: "Tech Explorer & Creator",
    age: 26,
    email: "vladsubbotin35@gmail.com", // ← Замени на свой email
    avatar: "/vlad.JPG", // ← Путь к фото в папке public
    bio: "Я разработчик и творец, увлеченный современными технологиями. Создаю полезные инструменты и делюсь своим опытом.",

    /** Текст и состояние виджета статуса */
    status: {
        text: "Currently working on something new", // ← Меняй этот текст
        online: true, // true = зелёный пульсирующий, false = серый
    },

    socials: {
        telegram: "https://t.me/vlvdvlvd",
        github: "https://github.com/vadosishe",
    },

    /** Список оборудования (для GearWidget) */
    gear: [
        {
            name: "Workstation",
            description: "AMD Ryzen 9 5950X / 32GB RAM / RTX 5070 Ti",
            icon: "Cpu"
        },
        {
            name: "Display",
            description: "2x Xiaomi 27\" MiniLED / 200Hz",
            icon: "Monitor"
        },
        {
            name: "Mobility",
            description: "MacBook Pro / Remote setup",
            icon: "Laptop"
        },
        {
            name: "Device",
            description: "Nothing Phone (2) / Glyph Interface",
            icon: "Smartphone"
        },
    ],
};
