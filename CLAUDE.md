# CLAUDE.md — Техническое задание на создание сайта Best Practice AI

> Этот файл — главный источник истины для агентов вайбкодинга.  
> Читай его полностью перед тем как писать любой код.

---

## 1. ОБЗОР ПРОЕКТА

**Название сайта:** bestpracticeai.ru  
**Тип:** Одностраничный премиальный маркетинговый сайт с подстраницами услуг + встроенная CMS + панель администратора  
**Позиционирование:** AI Студия — генеративные нейросети для бизнеса и частных лиц  
**Владелец:** Иван Салин — эксперт по промышленной безопасности, пионер применения ИИ в бизнесе  
**Основная цель посетителя:** Познакомиться с услугами → оставить заявку или позвонить  
**Аудитория:** B2B (корпоративные клиенты на AI-консалтинг, видеотренинги, промо-ролики) + B2C (частные лица)  

**Сервер:** Россия (РФ-хостинг, будет предоставлен отдельно). Сборка выполняется локально.  
**Соответствие законодательству:** 152-ФЗ РФ (персональные данные), cookies-баннер обязателен.

---

## 2. ТЕХНИЧЕСКИЙ СТЕК

### Frontend
- **React 18** + **Vite** — основа SPA
- **TypeScript** — обязателен для всего кода
- **Tailwind CSS** — утилитарные классы (layout, spacing), для бренд-цветов использовать inline styles (см. раздел 5)
- **React Router v6** — навигация (hash-режим для статичного хостинга, или history если есть nginx)
- **react-markdown** + **remark-gfm** — рендер MD-контента статей на фронтенде
- **Framer Motion** — анимации scroll-triggered, hover-эффекты
- **react-intersection-observer** — ленивая загрузка секций и счётчиков
- **react-hot-toast** — уведомления

### Backend / CMS API
- **Node.js** + **Express** (или **Fastify**) — REST API
- **SQLite** (через `better-sqlite3`) для локальной разработки → **PostgreSQL** для продакшна на РФ-сервере
- **JWT** (jsonwebtoken) — аутентификация администратора
- **bcrypt** — хеширование пароля администратора
- **multer** — загрузка изображений
- **nodemailer** — отправка уведомлений о заявках на email

### Инструменты
- **ESLint** + **Prettier** — качество кода
- **Vite** proxy — в dev-режиме проксирует /api → backend
- **dotenv** — переменные окружения

### Структура репозитория
```
bestpracticeai/
├── client/               # React + Vite фронтенд
│   ├── src/
│   │   ├── components/   # UI-компоненты
│   │   ├── pages/        # Страницы (Home, ServicePage, AdminPanel)
│   │   ├── hooks/        # Кастомные хуки
│   │   ├── api/          # API-клиент (fetch-обёртки)
│   │   ├── types/        # TypeScript типы
│   │   └── styles/       # globals.css (CSS-переменные BP)
│   ├── public/
│   │   └── assets/       # Иконки, изображения (см. папку Assets/)
│   └── index.html
├── server/               # Node.js backend
│   ├── routes/           # api/articles, api/reviews, api/leads, api/auth
│   ├── middleware/       # authMiddleware, rateLimiter, corsConfig
│   ├── db/               # схема БД, миграции
│   └── index.ts
├── Assets/               # Визуальные ассеты (иконки, изображения)
├── CLAUDE.md             # Этот файл
├── ASSETS_PROMPTS.md     # Промпты для генерации ассетов
├── CONTENT.md            # Текстовый контент
└── PRIVACY_POLICY.md     # Политика данных (152-ФЗ)
```

---

## 3. АРХИТЕКТУРА САЙТА

### 3.1 Навигация (Header)

Фиксированный header, появляется с тенью при скролле.

```
[Логотип BP + «AI Студия»]    [О нас] [Услуги] [Медиа] [Отзывы] [Контакты]    [Оставить заявку — CTA кнопка]
```

- Логотип: картинка слева (светлый вариант для светлого фона), высота 48px
- Надпись «AI Студия» серым рядом с логотипом
- На мобильных: бургер-меню, full-screen overlay
- При скролле к якорной секции — подсвечивается активный пункт меню
- CTA-кнопка в header: цвет Gold (#D4AF37), текст Dark Blue, плавный scroll к #contacts

### 3.2 Секции главной страницы (One-Page)

Страница состоит из следующих секций с id-якорями:

#### БЕГУЩАЯ СТРОКА (между Hero и О нас, или под Hero)

- Полноширинная полоса, фон: Gold (#D4AF37)
- Бесконечная горизонтальная прокрутка (CSS animation `marquee` или JS)
- Текст чередуется через разделитель-ромб: `✦ Экспертиза  ✦ Инновации  ✦ Результат  ✦ Экспертиза  ✦ Инновации  ✦ Результат ...`
- Шрифт: Montserrat Bold, 14px, цвет: Dark Blue (#0B1D3A), letter-spacing: 2px, text-transform: uppercase
- Высота полосы: 44px
- Скорость: ~40 секунд на полный цикл (плавно, не слишком быстро)
- На hover — пауза анимации (`animation-play-state: paused`)
- Дублировать текст минимум 3 раза для бесшовного loop

```css
.marquee-track {
  background: var(--bp-gold);
  height: 44px;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.marquee-content {
  display: flex;
  animation: marquee 40s linear infinite;
  white-space: nowrap;
  gap: 0;
}
.marquee-track:hover .marquee-content {
  animation-play-state: paused;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-33.333%); }
}
```

---

#### HERO `#home`
- **Левая колонка (60%):**
  - Бейдж: «AI Студия · bestpracticeai.ru»
  - H1: «Генеративные нейросети для бизнеса и частных лиц»
  - Подзаголовок: краткое описание (см. CONTENT.md)
  - Две CTA-кнопки: «Оставить заявку» (Gold/primary) и «Смотреть услуги» (outline)
- **Правая колонка (40%):**
  - Видео в мокапе планшета/ноутбука (Device Frame компонент)
  - Видео подключается через iframe embed с Кинескоп (kinescope.io)
  - URL видео хранится в переменной окружения или конфиге admin
  - Фоновые декоративные элементы: концентрические круги (SVG), шестиугольники — стиль «AI-Engineering Aesthetic» из бренд-гайда

#### О НАС `#about`
- Фон: Light BG (#FAF9F6)
- **Блок «В цифрах»** — 4 анимированных счётчика (react-intersection-observer):
  - 500+ часов видеоконтента
  - 500+ часов обучения ИИ
  - 2 федеральные премии
  - 70% экономия на контент
- **Блок «Почему Best Practice»** — 3-4 карточки с иконками и текстом (контент из CONTENT.md)
- Фото Ивана или AI-аватар (справа), краткое bio (слева)

#### УСЛУГИ `#services`
- Фон: White
- Заголовок секции + подзаголовок
- **5 карточек услуг** в сетке (3+2 на десктоп, 1 колонка на мобильных):
  1. Корпоративные ИИ-видео с кастомными аватарами
  2. Обучение созданию ИИ-видео роликов
  3. Обучение применению нейросетей
  4. Вайбкодинг & Telegram-боты
  5. Дополнительные услуги
- Каждая карточка: **премиальная иконка** (PNG из папки Assets/) + название + 1-2 строки описания + «Подробнее →»
- При клике → переход на отдельную страницу `/services/[slug]`
- Hover-эффект: подсветка Gold-бордера, лёгкий подъём (translateY -3px)

#### МЕДИА `#media`
- Фон: #FAF9F6
- Сетка статей (карточки): превью-картинка + заголовок + дата + 2-3 строки превью
- Пагинация или «Загрузить ещё» (lazy load)
- При клике → страница статьи `/blog/[slug]` с полным MD-рендером

#### ОТЗЫВЫ `#reviews`
- Фон: Dark Blue (#0B1D3A)
- Carousel (Swiper.js или кастомный)
- Карточка отзыва:
  - Фото (круглое, 80px) — опционально, загружается по URL или заглушка-монограмма
  - Текст отзыва (в кавычках, Lora Italic)
  - ФИО жирным
  - Должность / компания — серым
  - Декоративные кавычки в Gold

#### КОНТАКТЫ `#contacts`
- Фон: Light BG
- **Левая колонка:** контактные данные
  - Телефон: +7 (910) 170-11-26 (кликабельный tel:)
  - Email: salinivan@mail.ru (кликабельный mailto:)
  - Telegram: https://t.me/bestpractice_hs_ai (кнопка)
  - VK: https://vk.com/club224447229 (кнопка)
- **Правая колонка:** форма обратной связи
  - Поля: ФИО (обязательное), Компания (необязательное), Телефон (обязательное), Тип запроса (выпадающий список или textarea)
  - Кнопка «Отправить заявку» (Gold)
  - После отправки: успех-сообщение + заявка сохраняется в БД + уведомление на email администратора
  - Валидация: frontend (React Hook Form) + backend
  - CSRF-защита: токен в заголовке или double-submit cookie

#### FOOTER
- Фон: #0B1D3A
- Логотип (белый/золотой вариант)
- Ссылка «Создано с Best Practice AI · bestpracticeai.ru»
- Ссылки: Политика обработки данных, Cookies
- Copyright: © 2025 Best Practice AI. Все права защищены.
- Соцсети: Telegram, VK иконки

---

## 4. ПОДСТРАНИЦЫ УСЛУГ

Роутинг: `/services/corporate-ai-video`, `/services/ai-video-training`, `/services/neural-networks-training`, `/services/vibecoding`, `/services/additional`

Каждая страница содержит:
1. **Hero-блок** — название услуги, краткое описание, CTA «Оставить заявку»
2. **Описание** — развёрнутый текст + список того, что входит
3. **Специфичный контент** (см. ниже)
4. **CTA-блок** — «Готовы начать? Свяжитесь с нами»
5. **Хлебные крошки**: Главная → Услуги → [Название]

### Специфичный контент по услугам:

**Корпоративные ИИ-видео** (`/services/corporate-ai-video`):
- Описание: обучающие видео, инструктажи, онбординг, коммуникационные и промо-ролики
- **Видео-портфолио**: карусель с iframe-видео с Кинескоп
  - Поддержка форматов 16:9 и 9:16 (отдельные вкладки или смешанная сетка)
  - Возможность развернуть на весь экран (fullscreen)
  - Подписи под каждым видео (редактируются в admin-панели)
  - URL видео и подписи хранятся в БД

**Обучение ИИ-видео** (`/services/ai-video-training`):
- Фото/иллюстрация + текст о программе
- Программа: от базы знаний → кастомный аватар → уникальная музыка → спецэффекты

**Обучение нейросетям** (`/services/neural-networks-training`):
- Фото корпоративного занятия (Иван + аудитория)
- Групповые и индивидуальные занятия
- Темы: промптинг, выбор нейросетей, ассистенты, агенты, вайбкодинг

**Вайбкодинг** (`/services/vibecoding`):
- Иллюстрация + описание
- Портфолио проектов с ссылками:
  - Vincent AI — Telegram-бот, развивающая игра
  - Kopilka — трекер карманных денег для детей
  - Лендинг Aeterra
- Что создаём: Telegram-боты с ИИ, лендинги, обучение программированию с ИИ

**Дополнительные услуги** (`/services/additional`):
- Создание брендбука
- Нейрофотосессии
- Генерация музыки
- Создание персональных видеоаватаров

---

## 5. БРЕНД И ДИЗАЙН-СИСТЕМА

### Цветовая палитра (CSS-переменные — обязательны в globals.css)

```css
:root {
  --bp-dark-blue: #0B1D3A;     /* фоны hero, header, footer, тёмные секции */
  --bp-gold: #D4AF37;           /* акценты, CTA, золотые элементы */
  --bp-steel-blue: #1E3A5F;    /* вторичные элементы, градиенты */
  --bp-beige: #F5DEB3;          /* callout-блоки, мягкие акценты */
  --bp-light-bg: #FAF9F6;      /* основной светлый фон */
  --bp-medium-gold: #C4A032;   /* hover на Gold */
  --bp-soft-gold: #E8D48B;     /* фон карточек */
  --bp-light-steel: #2A4F7A;   /* градиенты */
  --bp-text-dark: #1a1a1a;     /* основной текст */
  --bp-text-light: #FAF9F6;    /* текст на тёмных фонах */
  --bp-font-heading: 'Montserrat', sans-serif;
  --bp-font-body: 'Lora', serif;
  --bp-font-ui: 'Inter', 'Montserrat', sans-serif;
}
```

### Шрифты

Подключить в `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Применение | Шрифт | Насыщенность | Размер |
|---|---|---|---|
| H1 | Montserrat | Bold 700 | 48–60px |
| H2 | Montserrat | Bold 700 | 32–40px |
| H3 | Montserrat | SemiBold 600 | 20–24px |
| Body | Lora | Regular 400 | 16–18px |
| Цитаты | Lora | Italic 400 | 16–18px |
| UI / nav | Montserrat | Medium 500 | 14–16px |
| CTA | Montserrat | Bold 700 | 16px |

### Логотипы

```
Светлый фон → LogoBP_YellowCircle.png:
https://raw.githubusercontent.com/Isalin84/assets/main/media/LogoBP_YellowCircle.png

Тёмный фон → BP CircleBlue.png:
https://raw.githubusercontent.com/Isalin84/assets/main/media/BP%20CircleBlue.png
```

- Минимальная высота: 48px (desktop), 36px (mobile)
- Не искажать пропорции, не менять цвета

### Визуальный язык «AI-Engineering Aesthetic»

Декоративные SVG-элементы (не перегружать):
- Концентрические круги (тонкие линии, opacity 0.1–0.2)
- Шестиугольные паттерны
- Тонкие линии-коннекторы
- Золотые точки-ноды

Анимации:
- Scroll-triggered fade-in (Framer Motion: `initial={{opacity:0, y:30}}`, `whileInView={{opacity:1, y:0}}`)
- Счётчики: анимированный increment при попадании в viewport
- Hover на карточках: translateY(-3px) + gold border + box-shadow
- CTA-кнопки: scale(1.02) + darken gold on hover

### CTA-кнопка (primary)

```css
.btn-primary {
  background: var(--bp-gold);
  color: var(--bp-dark-blue);
  font-family: var(--bp-font-heading);
  font-weight: 700;
  font-size: 16px;
  padding: 14px 36px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-primary:hover {
  background: var(--bp-medium-gold);
  transform: translateY(-2px);
}
```

### CTA-кнопка (outline/secondary)

```css
.btn-secondary {
  background: transparent;
  color: var(--bp-dark-blue);
  border: 2px solid var(--bp-dark-blue);
  font-family: var(--bp-font-heading);
  font-weight: 600;
  padding: 12px 34px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: var(--bp-dark-blue);
  color: var(--bp-gold);
}
```

---

## 6. CMS — СИСТЕМА УПРАВЛЕНИЯ КОНТЕНТОМ

### 6.1 База данных (схема)

```sql
-- Статьи (Медиа-секция)
CREATE TABLE articles (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT UNIQUE NOT NULL,
  title      TEXT NOT NULL,
  excerpt    TEXT,
  content    TEXT NOT NULL,  -- Markdown
  cover_url  TEXT,           -- URL обложки
  published  INTEGER DEFAULT 0,  -- 0=черновик, 1=опубликовано
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Отзывы
CREATE TABLE reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  position   TEXT,
  company    TEXT,
  text       TEXT NOT NULL,
  photo_url  TEXT,           -- URL фото (внешний) или NULL
  published  INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Заявки из формы
CREATE TABLE leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name  TEXT NOT NULL,
  company    TEXT,
  phone      TEXT NOT NULL,
  message    TEXT,
  status     TEXT DEFAULT 'new',  -- new, in_progress, done
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Видео портфолио
CREATE TABLE portfolio_videos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  service_slug TEXT NOT NULL,   -- к какой услуге относится
  kinescope_id TEXT NOT NULL,   -- ID видео на Кинескоп
  title        TEXT,
  caption      TEXT,
  aspect_ratio TEXT DEFAULT '16:9',  -- '16:9' или '9:16'
  sort_order   INTEGER DEFAULT 0,
  published    INTEGER DEFAULT 1,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Настройки сайта (hero видео, контакты и т.д.)
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);
```

### 6.2 API Endpoints

```
POST   /api/auth/login           — вход администратора
POST   /api/auth/logout          — выход
GET    /api/auth/me              — проверка токена

GET    /api/articles             — список опубликованных статей
GET    /api/articles/:slug       — одна статья
POST   /api/admin/articles       — создать статью (auth)
PUT    /api/admin/articles/:id   — обновить (auth)
DELETE /api/admin/articles/:id   — удалить (auth)

GET    /api/reviews              — список опубликованных отзывов
POST   /api/admin/reviews        — создать (auth)
PUT    /api/admin/reviews/:id    — обновить (auth)
DELETE /api/admin/reviews/:id    — удалить (auth)

POST   /api/leads                — отправить заявку (публичный)
GET    /api/admin/leads          — список заявок (auth)
PUT    /api/admin/leads/:id      — обновить статус (auth)

GET    /api/portfolio            — видео по service_slug
POST   /api/admin/portfolio      — добавить видео (auth)
PUT    /api/admin/portfolio/:id  — обновить (auth)
DELETE /api/admin/portfolio/:id  — удалить (auth)

GET    /api/settings             — публичные настройки
PUT    /api/admin/settings/:key  — обновить настройку (auth)
```

### 6.3 Видео с Кинескоп

Embed-формат:
```html
<iframe
  src="https://kinescope.io/embed/{kinescope_id}"
  allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
  allowfullscreen
  style="width:100%; aspect-ratio:16/9; border:none;"
/>
```
Для формата 9:16 — `aspect-ratio: 9/16`.

---

## 7. ADMIN-ПАНЕЛЬ

### 7.1 Доступ

- URL: `/admin` (или `/admin/login`)
- Отдельный защищённый роут — не индексируется поисковиками (`<meta name="robots" content="noindex">`)
- Аутентификация: JWT в httpOnly cookie (не localStorage!)
- Один администратор, пароль задаётся в `.env`
- Rate limiting на `/api/auth/login`: не более 5 попыток за 15 минут с одного IP
- Автоматический logout через 8 часов

### 7.2 Разделы admin-панели

```
Sidebar навигация:
├── 📊 Дашборд          — сводка: новые заявки, статьи, отзывы
├── 📩 Заявки           — список лидов, статусы, фильтры
├── 📝 Статьи           — CMS: список, создать/редактировать
├── ⭐ Отзывы           — управление отзывами, drag-and-drop сортировка
├── 🎬 Видео портфолио  — управление видео по услугам
└── ⚙️ Настройки        — hero-видео URL, контакты, SEO
```

### 7.3 Редактор статей

- **MD-редактор**: CodeMirror или SimpleMDE с preview
- Поля: Заголовок, Slug (авто из заголовка, редактируемый), Превью-текст, Обложка (URL), Контент (Markdown), Статус (черновик/опубликовано)
- Preview: render Markdown → HTML рядом с редактором
- Поддержка в Markdown: заголовки, курсив, жирный, списки, ссылки, изображения по URL, видео (iframe через HTML в MD)

### 7.4 Управление отзывами

- Список карточек с drag-and-drop для сортировки (react-dnd или @dnd-kit)
- Поля: Имя, Должность, Компания, Текст отзыва, URL фото (необязательно), Опубликовать
- Если нет фото — отображается аватар-монограмма (первые буквы имени на Gold фоне)

### 7.5 Управление видео-портфолио

- Привязка к услуге (dropdown: corporate-ai-video и т.д.)
- Поля: Kinescope ID, Подпись, Соотношение сторон (16:9 / 9:16), Порядок, Опубликовать
- Preview: показывает embed при вводе ID

### 7.6 Управление заявками

- Таблица: ФИО, Компания, Телефон, Запрос, Дата, Статус
- Статусы: Новая 🔴 / В работе 🟡 / Завершена 🟢
- Клик по заявке — детальная карточка
- Экспорт в CSV

### 7.7 Настройки

- Kinescope ID для hero-видео
- Email для получения уведомлений о заявках
- Яндекс.Метрика: поле для ввода номера счётчика (вставляется в `<head>`)

---

## 8. БЕЗОПАСНОСТЬ

### 8.1 Аутентификация
- JWT в httpOnly, Secure, SameSite=Strict cookie
- Refresh token механизм (опционально)
- Bcrypt для хеширования пароля (saltRounds: 12)
- Запрет перебора: express-rate-limit на auth endpoints

### 8.2 Защита форм
- CSRF: double-submit cookie или synchronizer token
- Honeypot-поле в форме заявки (скрытое поле, если заполнено — спам)
- Валидация на backend: sanitize-html для текстовых полей
- Rate limit на `POST /api/leads`: не более 3 заявок с одного IP за час

### 8.3 HTTP-заголовки (Helmet.js)
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://mc.yandex.ru"],
      frameSrc: ["https://kinescope.io"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
    }
  },
  hsts: { maxAge: 31536000 }
}));
```

### 8.4 CORS
```javascript
cors({
  origin: ['https://bestpracticeai.ru', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})
```

### 8.5 Переменные окружения (.env — НИКОГДА не коммитить)
```
PORT=3001
NODE_ENV=production
DATABASE_URL=./db/bestpractice.db
JWT_SECRET=<случайная строка 64 символа>
ADMIN_PASSWORD_HASH=<bcrypt hash>
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_USER=salinivan@mail.ru
SMTP_PASS=<пароль>
NOTIFY_EMAIL=salinivan@mail.ru
```

---

## 9. СООТВЕТСТВИЕ 152-ФЗ И COOKIES

### 9.1 Политика обработки персональных данных
- Отдельная страница `/privacy` (см. PRIVACY_POLICY.md)
- Ссылка в футере обязательна
- В форме заявки: чекбокс «Согласен с политикой обработки персональных данных» — **обязательное поле**

### 9.2 Cookie-баннер
- Отображается при первом посещении (до взаимодействия с сайтом)
- Текст: «Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с нашей [Политикой использования cookies]»
- Кнопки: «Принять» и «Узнать подробнее»
- После принятия: флаг в localStorage `bp_cookie_consent=true`, баннер не показывается
- Яндекс.Метрика загружается только ПОСЛЕ принятия cookies

### 9.3 Яндекс.Метрика
- Номер счётчика задаётся в admin-настройках (в settings таблице)
- Скрипт Метрики инжектируется динамически только после получения cookie-consent
- Не использовать для WebVisor без отдельного согласия

---

## 10. SEO И МЕТА-ТЕГИ

### Базовые теги (в index.html и через react-helmet-async)

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Best Practice AI — Генеративные нейросети для бизнеса</title>
<meta name="description" content="AI Студия Best Practice. Корпоративные ИИ-видео, обучение нейросетям, вайбкодинг. Эксперт Иван Салин — 20+ лет опыта, 2 федеральные премии.">
<meta name="keywords" content="нейросети для бизнеса, корпоративные AI видео, обучение ИИ, вайбкодинг, генеративный ИИ">
<link rel="canonical" href="https://bestpracticeai.ru">

<!-- OG для соцсетей -->
<meta property="og:title" content="Best Practice AI — Генеративные нейросети для бизнеса">
<meta property="og:description" content="AI Студия. Видео с кастомными аватарами, обучение, вайбкодинг.">
<meta property="og:image" content="https://bestpracticeai.ru/assets/og-image.jpg">
<meta property="og:url" content="https://bestpracticeai.ru">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
```

### robots.txt
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://bestpracticeai.ru/sitemap.xml
```

---

## 11. АДАПТИВНОСТЬ (RESPONSIVE)

| Breakpoint | Поведение |
|---|---|
| Mobile < 768px | Бургер-меню, 1 колонка, карточки услуг стопка |
| Tablet 768–1024px | 2 колонки карточек, hero колонки стопкой |
| Desktop > 1024px | Полный макет, hero 60/40, услуги 3+2 |
| Wide > 1440px | max-width: 1280px, центрирование |

---

## 12. ПРОИЗВОДИТЕЛЬНОСТЬ

- Lazy loading изображений (loading="lazy")
- Код-сплиттинг: каждая страница услуги — отдельный chunk (`React.lazy`)
- Шрифты: `display=swap`, preconnect Google Fonts
- Kinescope iframe: загружается только когда попадает в viewport (IntersectionObserver)
- Изображения в Assets/: форматы WebP + PNG fallback

---

## 13. КОНТАКТЫ ДЛЯ ПОДСТАНОВКИ В КОД

```
Иван Салин
Телефон: +7 (910) 170-11-26
Email: salinivan@mail.ru
Telegram личный: @isalin
Telegram канал: https://t.me/bestpractice_hs_ai
VK сообщество: https://vk.com/club224447229
Сайт: https://bestpracticeai.ru
```

---

## 14. ПАПКА ASSETS/

Структура (файлы будут сгенерированы по промптам из ASSETS_PROMPTS.md):

```
Assets/
├── logos/
│   ├── logo-light.png      (для светлых фонов)
│   └── logo-dark.png       (для тёмных фонов)
├── icons/
│   ├── icon-corporate-video.png
│   ├── icon-video-training.png
│   ├── icon-neural-training.png
│   ├── icon-vibecoding.png
│   └── icon-additional.png
├── hero/
│   ├── hero-bg-pattern.svg  (декоративные концентрические круги)
│   └── tablet-mockup.png    (мокап планшета)
├── about/
│   └── ivan-photo.jpg       (фото или AI-портрет)
└── og/
    └── og-image.jpg         (1200×630, OG-preview)
```

---

## 15. ЛОКАЛЬНЫЙ ЗАПУСК

```bash
# Backend
cd server
npm install
npm run dev      # http://localhost:3001

# Frontend (другой терминал)
cd client
npm install
npm run dev      # http://localhost:5173

# Создать первого администратора
cd server
node scripts/create-admin.js  # спросит email и пароль, сохранит bcrypt hash в .env
```

---

## 16. ЧЕКЛИСТ ПЕРЕД ДЕПЛОЕМ НА РФ-СЕРВЕР

- [ ] `NODE_ENV=production` в .env
- [ ] JWT_SECRET: случайная строка 64+ символа
- [ ] HTTPS (Let's Encrypt / российский CA)
- [ ] Nginx reverse proxy: frontend на 80/443, API на /api
- [ ] Бэкап БД настроен (cron)
- [ ] robots.txt: /admin и /api в Disallow
- [ ] Яндекс.Метрика: номер счётчика введён в admin-настройках
- [ ] Cookie-баннер работает
- [ ] Форма заявки: уведомление приходит на email
- [ ] Политика конфиденциальности опубликована на /privacy
- [ ] Проверка: форм-чекбокс согласия работает
- [ ] CSP заголовки проверены
- [ ] Сервер в РФ (обязательно для 152-ФЗ)

---

*CLAUDE.md v1.0 · Best Practice AI · bestpracticeai.ru*
