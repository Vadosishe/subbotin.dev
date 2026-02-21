/**
 * Конфигурация сайта — редактируй здесь текст статуса, email и другие настройки.
 */
export const siteConfig = {
    name: "Влад Субботин",
    role: "Tech Explorer & Creator",
    age: 26,
    email: "your.email@example.com", // ← Замени на свой email
    bio: "Я разработчик и творец, увлеченный современными технологиями. Создаю полезные инструменты и делюсь своим опытом.",

    /** Текст и состояние виджета статуса */
    status: {
        text: "Currently building something cool", // ← Меняй этот текст
        online: true, // true = зелёный пульсирующий, false = серый
    },

    socials: {
        telegram: "https://t.me/vlvdvlvd",
        github: "https://github.com/vadosishe",
    },

    /** Список оборудования (для GearWidget) */
    gear: [
        { name: "MacBook Pro M3", description: "Основной рабочий инструмент", icon: "💻" },
        { name: "Keychron K2", description: "Механика на коричневых свичах", icon: "⌨️" },
        { name: "Logitech MX Master 3S", description: "Для долгой работы без усталости", icon: "🖱️" },
        { name: "LG UltraFine 4K", description: "Верный помощник для кода", icon: "🖥️" },
    ],
};
