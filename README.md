# subbotin.dev

Персональный сайт-визитка Влада Субботина.

## Запуск

```bash
npm install
npm run dev
```

Открой `http://localhost:3000`

## Сборка для продакшена

```bash
npm run build
```

Статические файлы появятся в папке `out/`.

---

## 📝 Как добавлять посты в блог

### 1. Создай файл в папке `/content`

Имя файла = slug поста в URL. Например:
- `content/my-post.md` → `/blog/my-post`

### 2. Формат файла (.md)

Каждый пост начинается с **фронтматтера** (метаданные в блоке `---`), а затем содержит текст в Markdown:

```markdown
---
title: "Заголовок поста"
date: "2026-03-15"
excerpt: "Краткое описание поста для превью на главной и странице блога."
---

# Текст поста

Обычный Markdown: **жирный**, *курсив*, [ссылки](https://example.com), списки, код и т.д.
```

### 3. Обязательные поля фронтматтера

| Поле | Описание | Формат |
|---|---|---|
| `title` | Заголовок поста | Строка в кавычках |
| `date` | Дата публикации | `"YYYY-MM-DD"` |
| `excerpt` | Краткое описание для превью | Строка в кавычках |

### 4. После добавления

- В **dev-режиме** (`npm run dev`) — пост появится при перезагрузке страницы.
- Для **продакшена** — нужно пересобрать: `npm run build`.

---

## 🛠 Как добавлять карточки проектов

Все проекты хранятся в файле `src/data/projects.ts`.

### 1. Открой `src/data/projects.ts`

### 2. Добавь новый объект в массив `projects`:

```typescript
{
  slug: "my-cool-project",          // URL: /projects/my-cool-project
  title: "My Cool Project",         // Название
  description: "Краткое описание.", // Для карточки на главной
  longDescription: `                // Подробное описание (Markdown-подмножество)
## Что это

Подробный текст о проекте...

- **Фича 1** — описание
- **Фича 2** — описание
  `,
  stack: ["React", "Node.js"],      // Теги технологий
  status: "active",                 // "active" | "beta" | "archived"
  link: "https://demo.com",        // Ссылка на демо (опционально)
  github: "https://github.com/...",// Ссылка на GitHub (опционально)
}
```

### 3. Поля проекта

| Поле | Обязательно | Описание |
|---|---|---|
| `slug` | ✅ | URL-фрагмент (`/projects/{slug}`) |
| `title` | ✅ | Название проекта |
| `description` | ✅ | Краткое описание (1-2 предложения) |
| `longDescription` | ✅ | Подробное описание (поддерживает `## заголовки`, `- списки`, `**жирный**`) |
| `stack` | ✅ | Массив строк с названиями технологий |
| `status` | ✅ | `"active"` (зелёный), `"beta"` (жёлтый), `"archived"` (серый) |
| `link` | ❌ | URL на демо-версию |
| `github` | ❌ | URL на репозиторий |

---

## ⚡ Как изменить статус

Статус отображается на главной странице в виджете с пульсирующим индикатором.

### Редактируй файл `src/data/siteConfig.ts`:

```typescript
status: {
  text: "Currently building something cool", // ← Измени текст
  online: true,  // true = зелёный пульсирующий, false = серый
},
```

Примеры текстов:
- `"Открыт для фриланса 🟢"`
- `"В отпуске до 15.03"`
- `"Строю свой стартап"`

---

## ⚙️ Другие настройки

Все основные настройки сайта — в `src/data/siteConfig.ts`:

```typescript
export const siteConfig = {
  name: "Влад Субботин",       // Имя
  role: "Tech Explorer & Creator", // Роль
  age: 26,                     // Возраст
  email: "your@email.com",    // Email (для кнопки «Скопировать»)
  bio: "...",                  // Описание в карточке профиля
  status: { ... },            // Виджет статуса
  socials: { ... },           // Ссылки на соцсети
};
```

---

## 🎨 Переключатель тем

Кнопка ☀️/🌙 в header. Выбор сохраняется в `localStorage`.

---

## Структура проекта

```
├── content/                ← Посты блога (Markdown)
│   └── hello-world.md
├── src/
│   ├── app/
│   │   ├── globals.css     ← Стили и CSS-переменные тем
│   │   ├── layout.tsx      ← Корневой Layout
│   │   ├── page.tsx        ← Главная (Bento Grid)
│   │   ├── blog/
│   │   │   ├── page.tsx         ← Список постов
│   │   │   └── [slug]/page.tsx  ← Страница поста
│   │   └── projects/
│   │       └── [slug]/page.tsx  ← Страница проекта
│   ├── components/
│   │   ├── Header.tsx / Footer.tsx
│   │   ├── ThemeProvider.tsx / ThemeToggle.tsx
│   │   ├── bento/
│   │   │   ├── BentoGrid.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── ServicesCard.tsx
│   │   │   ├── StatusWidget.tsx
│   │   │   ├── TechStackWidget.tsx
│   │   │   └── TimeWidget.tsx
│   │   └── ui/
│   │       └── FadeIn.tsx
│   ├── data/
│   │   ├── projects.ts     ← Массив проектов (добавляй сюда)
│   │   └── siteConfig.ts   ← Настройки сайта, статус, email
│   └── lib/
│       └── markdown.ts     ← Логика чтения MD-файлов
└── next.config.ts          ← output: 'export'
```
