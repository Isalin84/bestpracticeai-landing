# CLAUDE.md — Best Practice AI: спецификация сайта (актуальное состояние)

> Главный источник истины для агентов. Описывает сайт **как он реализован сейчас**, а не первоначальное ТЗ.
> Правила работы (план в `tasks/todo.md`, уроки в `tasks/lessons.md`, верификация до «готово») — в корневом `../CLAUDE.md`.
> Перед правками главной перечитай раздел 5 «Правила вёрстки»: там зафиксированы решения владельца.

---

## 1. ОБЗОР ПРОЕКТА

**Сайт:** bestpracticeai.ru
**Тип:** одностраничный премиальный маркетинговый сайт + страницы услуг из CMS + блог + админ-панель
**Позиционирование:** AI Студия — генеративные нейросети для бизнеса и частных лиц
**Владелец:** Иван Салин — эксперт по промышленной безопасности, пионер применения ИИ в бизнесе
**Цель посетителя:** познакомиться с услугами → оставить заявку или позвонить
**Аудитория:** B2B (AI-консалтинг, видеотренинги, промо-ролики) + B2C

**Прод:** VPS в РФ (185.139.70.35, FirstByte), nginx (HTTPS с **HTTP/2** — обязателен: из мобильных сетей РФ проходят только первые 2–3 TLS-соединения) + pm2. Фронт собирается локально и заливается как `client/dist` (см. `tasks/` и память деплоя). 152-ФЗ: политика на `/privacy`, чекбокс согласия в форме, cookie-баннер.

---

## 2. ТЕХНИЧЕСКИЙ СТЕК

### Frontend (`client/`)
- **React 19** + **Vite** + **TypeScript** (строго)
- **Tailwind CSS v4** (`@import "tailwindcss"`) — утилиты для layout; бренд-цвета через CSS-переменные и inline styles
- **React Router v6** (`createBrowserRouter`, history-режим, SPA-fallback в nginx/Express)
- **Framer Motion** — fade-in при появлении, скролл-скраб hero, drag-карусели
- **Lenis** — плавный скролл (`useLenis`), `ScrollProgress` под шапкой
- **react-intersection-observer** — счётчики, ленивые iframe
- **react-hook-form**, **react-hot-toast**, **react-helmet-async**, **react-markdown** + **remark-gfm**

### Backend (`server/`)
- **Node.js + Express**, запускается через `tsx` (`pm2` на проде: `--import tsx/esm index.ts`, порт 3001)
- **better-sqlite3** (WAL), файл `server/bestpractice.db` (`DATABASE_URL`)
- **JWT** в httpOnly cookie `bp_admin_token` (8 ч), **bcrypt**, **express-rate-limit**, **helmet**, **cors**, **cookie-parser**
- **nodemailer** — письмо о заявке (создаётся инлайн в `routes/leads.ts`)
- **markdown-it** — серверный рендер статей для SEO

### Структура репозитория
```
Bestpracticeai/
├── client/
│   ├── src/
│   │   ├── components/sections/   Header, Hero, Marquee, About, Services, Media, Reviews, Contacts, Footer
│   │   ├── components/ui/         Section, SectionBackdrop, SectionHeading, CoverflowCarousel, DragCarousel,
│   │   │                          SectionSpotlight, ScrollProgress, ScrollToTop, AnimatedCounter, DeviceFrame, HeroScrubVideo
│   │   ├── pages/                 Home, ArticlePage, PrivacyPage, NotFound, services/ServicePage(+ServiceLayout), admin/*
│   │   ├── config/heroVideo.ts    ACTIVE_HERO и источники видео
│   │   ├── hooks/ api/ types/ styles/globals.css
│   └── public/assets/             hero/ services/ decorative/ icons/ logos/ og/
├── server/
│   ├── routes/      auth, articles, reviews, leads, portfolio, settings, services, seo
│   ├── db/          database.ts (схема + сид), services.ts
│   ├── data/servicesFallback.ts   сид + фолбэк контента услуг
│   ├── middleware/authMiddleware.ts
│   └── index.ts
├── tasks/todo.md, tasks/lessons.md
├── CLAUDE.md (этот файл), CONTENT.md, PRIVACY_POLICY.md, ASSETS_PROMPTS.md
```

---

## 3. ГЛАВНАЯ СТРАНИЦА

Порядок в `pages/Home.tsx`: **Hero → Marquee → About → Services → Media (Блог) → Reviews → Contacts**. Header, Footer и ScrollToTop живут в `PublicLayout` (`App.tsx`).

### 3.1 Header
- `position: fixed`, высота 72px, фон `rgba(11,29,58,0.55)` → `0.85` после 20px скролла, blur, золотая нижняя линия; под ним `ScrollProgress` (2px).
- Логотип `/assets/logos/LogoBP_YellowCircle.png` (44px) + «AI Студия».
- Меню: **О нас `/#about` · Услуги `/#services` · Блог `/#media` · Отзывы `/#reviews` · Контакты `/#contacts`**, hover-подчёркивание (`layoutId`). Активный пункт при скролле не подсвечивается.
- CTA `.btn-primary` «Оставить заявку» → `#contacts`. На ≤768px — бургер с выпадающей панелью под шапкой.

### 3.2 Hero `#home` (`sections/Hero.tsx`, `ui/HeroScrubVideo.tsx`, `config/heroVideo.ts`)
- Тёмная секция с **полноэкранным фоновым видео**. Режим выбирается на маунте:
  - `scrub` (десктоп): секция 250vh со sticky-слоем, видео перематывается скроллом (all-intra mp4, lerp 0.5);
  - `loop` (≤767px или `pointer: coarse`): зацикленный mp4 720p;
  - `static` (`prefers-reduced-motion`): постер.
- `src` подставляется после `window load`, до этого — постер webp (LCP).
- `ACTIVE_HERO = 'hero3'`; наборы hero1–hero3 лежат в `public/assets/hero/` (scrub ≈6–7 МБ, loop ≈1.1–1.5 МБ, poster ≈30 КБ).
- Левая колонка: бейдж «AI Студия · bestpracticeai.ru», H1 «Генеративные нейросети для бизнеса и частных лиц» (пословная анимация, «для бизнеса» золотом), подзаголовок, кнопки «Оставить заявку» (`.btn-primary`) и «Смотреть услуги» (`.btn-primary-outline`).
- Правая колонка: `DeviceFrame` (glow + золотая рамка, без мокапа планшета) с Kinescope-iframe; ID видео из `settings.hero_video_id`.
- Подсказка «Листайте» только в scrub-режиме. На ≤900px — одна колонка.

### 3.3 Бегущая строка (`sections/Marquee.tsx`)
Золотая полоса 48px между Hero и About. 6 слов через `✦`: Экспертиза · Инновации · Результат · Технологии · Качество · Развитие, продублированы ×3, 40 с/цикл, пауза на hover. Стили `.marquee-track` / `.marquee-content` в `globals.css`.

### 3.4 О нас `#about` (`tone="light"`, padding 72px)
- Заголовок «Best Practice AI» без подзаголовка.
- **Цифры** — тёмная плашка с 4 счётчиками (`AnimatedCounter`): **500+** часов видеоконтента · **300+** часов обучения ИИ · **2** федеральные премии · **70%** экономия на контенте. На ≤768px — 2×2.
- **Почему Best Practice** — `DragCarousel` (светлая тема, стрелки справа) из 4 карточек `.why-card` с иконками `public/assets/icons/*.webp` (128px): Реальный опыт · Пионеры генеративного AI · Измеримые результаты · Доступно каждому.
- Фото Ивана и bio на главной нет (bio — в футере).

### 3.5 Услуги `#services` (`tone="dark"`)
- **Тёмная секция** с фото-подложкой (серверные стойки) и заголовком «Наши услуги».
- Список услуг из CMS: `GET /api/services`; массив `SERVICES` в компоненте — только фолбэк до загрузки.
- Рендер: **`CoverflowCarousel`** во всю ширину (3D-coverflow как на weichie.com): активная карточка по центру, соседние развёрнуты и уходят вглубь; drag, горизонтальное колесо, стрелки, клавиатура, клик по соседней центрирует её; под каруселью теги «01 Название».
- Карточка `.service-photo-card`: фото `public/assets/services/service-0N-*.webp`, номер обводкой, градиентная золотая рамка, тело (h3 + описание + «Подробнее →») только у активной. Ссылка `/services/{slug}`; неактивные `aria-hidden` + `tabIndex=-1`.

### 3.6 Блог `#media` (`sections/Media.tsx`, `tone="light"`)
- Заголовок «Блог», подзаголовок «Статьи, кейсы и инсайты о применении ИИ в бизнесе».
- Тот же **`CoverflowCarousel`** (`theme="light"`, точки-индикаторы вместо тегов). Элементы: статьи, 3 скелетона на время загрузки, карточка **«Ещё статьи»** (дозагружает следующую страницу, `PAGE_SIZE = 6`).
- Карточка `.blog-card`: обложка (или заглушка «BP») с датой-пилюлей, заголовок, превью (3 строки), «Читать статью →». На ≤640px превью скрыто. Ссылка `/blog/{slug}`.

### 3.7 Отзывы `#reviews` (`tone="dark"`)
- Заголовок «Отзывы», подзаголовок «Реальные результаты — реальные люди».
- Самописный слайдер на framer-motion: один отзыв, `AnimatePresence`, автопрокрутка 7 с (пауза на hover, выключена при reduced-motion), свайп по X (порог 80px), стрелки, точки с прогресс-заливкой.
- Карточка: текст курсивом в кавычках (Lora Italic), фото 72px с золотой рамкой или `Monogram` (инициалы на золотом), имя, должность · компания. Декоративные кавычки `decorative/quote-marks.svg`.
- Данные `GET /api/reviews`; при пустом ответе — 3 плейсхолдера.

### 3.8 Контакты `#contacts` (`tone="light"`)
- Заголовок «Свяжитесь с нами». Сетка `1fr 1.4fr`, на ≤900px — одна колонка.
- Слева: карточки Телефон `+7 (910) 170-11-26`, Email `salinivan@mail.ru`, Telegram `@isalin`; кнопки Telegram-канал (`.btn-primary`) и VK (`.btn-secondary`).
- Справа: форма на react-hook-form с плавающими лейблами (`.bp-input`): ФИО*, Компания, Телефон*, Ваш запрос* (textarea), чекбокс согласия* со ссылкой на `/privacy`, скрытый honeypot. Успех — inline-экран с анимированной галочкой. Отправка `POST /api/leads`.

### 3.9 Footer
Тёмный, `bp-grain` + `.section-topline`, 4 колонки: бренд (логотип, слоган, кнопки TG/VK) · Навигация (5 якорей) · Правовое (политика, cookies → `/privacy`) · **Основатель** (Иван Салин, bio, ссылка salinsafety.ru). Низ: «© 2026 Best Practice AI. Все права защищены.» + bestpracticeai.ru.

---

## 4. СТРАНИЦЫ УСЛУГ (CMS)

Роут `/services/:slug` → **одна** страница `pages/services/ServicePage.tsx` (ленивый чанк) + `ServiceLayout.tsx`. Весь контент приходит из таблицы `services` (`GET /api/services/:slug`) и правится в `/admin/services`; `server/data/servicesFallback.ts` — только сид при пустой таблице и фолбэк при ошибке БД.

Слаги (`KNOWN_SLUGS`): `corporate-ai-video` (01), `ai-video-training` (02), `neural-networks-training` (03), `vibecoding` (04), `additional` (05).

Каркас (`ServiceLayout`): hero — `<Section tone="dark">` с серверной подложкой (`strength` 0.32, заметнее, чем на главной); тело + FAQ — одна `<Section tone="light">` с клавиатурой полосой сверху (`backdrop.height: 'min(100%, 1100px)'`); финальный CTA «Готовы начать?» — тёмный, без фото. Страница статьи `/blog/:slug` (`ArticlePage`) — тоже `<Section tone="light">` с клавиатурной полосой.

Страница содержит: hero (H1 = name, `hero_subtitle`, CTA по `CTA_BY_SLUG`), блоки `blocks` (JSON: заголовок + markdown/список) в 2 колонки, портфолио `portfolio` (JSON-ссылки, сетка 3 колонки), **видео-портфолио** из `portfolio_videos` (табы 16:9 / 9:16, lazy Kinescope-iframe, подписи), FAQ-аккордеон (`<details>`), CTA-блок «Готовы начать?», хлебные крошки. Helmet + schema.org: `Service`, `BreadcrumbList`, `FAQPage`. Серверный SSR этих страниц — в `server/routes/seo.ts`.

---

## 5. БРЕНД, ДИЗАЙН-СИСТЕМА И ПРАВИЛА ВЁРСТКИ

### Токены (`client/src/styles/globals.css`)
```css
--bp-dark-blue: #0B1D3A;  --bp-gold: #D4AF37;  --bp-steel-blue: #1E3A5F;  --bp-beige: #F5DEB3;
--bp-light-bg: #FAF9F6;   --bp-medium-gold: #C4A032;  --bp-soft-gold: #E8D48B;  --bp-light-steel: #2A4F7A;
--bp-text-dark: #1a1a1a;  --bp-text-light: #FAF9F6;
--bp-dark-blue-rgb: 11, 29, 58;   --bp-light-bg-rgb: 250, 249, 246;   /* для rgba(var(--…), α) */
--bp-font-heading: 'Montserrat'; --bp-font-body: 'Lora'; --bp-font-ui: 'Inter', 'Montserrat';
--bp-shadow-card / --bp-shadow-card-hover
```
Шрифты **локальные**: `client/public/assets/fonts/fonts.css` (переменные woff2 Montserrat 400–700, Lora 400–700 + italic 400; сабсеты latin/cyrillic) подключён в `index.html`. Google Fonts не использовать: в РФ запрос к fonts.googleapis.com виснет, а внешний stylesheet в `<head>` блокирует рендер и запуск JS — сайт «не открывался» без VPN (2026-09-05). H1 Montserrat 700 · H2 `clamp(32px, 4.5vw, 52px)`, letter-spacing −0.02em · Body Lora 16–18 · UI Montserrat 500–600.

### Утилитарные классы
`.btn-primary` (золото + shimmer), `.btn-secondary` (outline dark-blue), `.btn-primary-outline` (outline gold для тёмного фона), `.bp-grain::after` (плёночное зерно, `mix-blend-mode: overlay`, z-index 0), `.section-topline` (золотая линия 1px сверху секции), `.bp-input`, `.prose-bp` (markdown статей), `.marquee-*`, `.admin-nav-item`.

### Каркас секций главной — только через компоненты
- **`<Section id tone padding backdrop>`** — фон по тону, `.section-topline`, `SectionBackdrop`, для `dark` ещё `bp-grain` + `SectionSpotlight`; **контент рендерится в обёртке с `z-index: 1`** поверх декоративных слоёв. Не собирать секцию вручную.
- **`<SectionBackdrop tone image? position? strength?>`** — один слой: градиент цвета секции поверх фирменного фото (light → `decorative/keyboard-bg.webp`, dark → `decorative/reviews-bg.webp`). `strength` — доля фото в средней полосе (0.09 / 0.14 по умолчанию). `height` — высота слоя (по умолчанию вся секция); для длинных страниц (услуга, статья) задавать полосу `min(100%, 1100px)`, иначе `cover` растянет фото в разы. У полосы низ гасится маской (дробный край иначе даёт шов). Без `opacity` на слое и без z-index.
- **`<SectionHeading title subtitle? tone marginBottom? subtitleMaxWidth?>`** — H2 + подзаголовок с fade-in.
- **`<CoverflowCarousel items getKey renderCard getShadowImage? renderTag? theme>`** — 3D-coverflow (Услуги, Блог). При `renderTag` — теги, иначе точки. При n < 5 показывает меньше соседей, чтобы элемент не дублировался по кругу.
- **`<DragCarousel gap theme arrowsAlign>`** — плоская инерционная лента (О нас). На ≤640px стрелки по центру.
- **`<SectionSpotlight>`** — золотое пятно за курсором (только `pointer: fine`, без reduced-motion).

### Решения владельца (не переспрашивать, не откатывать)
1. **Никаких кикеров/eyebrow над H2.** Заголовок секции — только `SectionHeading`.
2. Названия секций короткие, как в меню: «Блог», «Отзывы», «Наши услуги», «Свяжитесь с нами». Переименовывая, менять и Header, Footer, крошки статьи, `server/routes/seo.ts`.
3. «Услуги» и «Отзывы» — тёмные секции с фото-подложкой; «О нас», «Блог», «Контакты» — светлые с клавиатурой.
4. Карусели — coverflow как на weichie.com; hero — видео со скролл-скрабом (Hero3).
5. Полупрозрачные фирменные цвета — `rgba(var(--bp-dark-blue-rgb), α)`, не литералы.
6. Секции Hero и Footer собраны отдельно (не через `Section`) — это осознанно.

### Анимации
Fade-in `initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}}`; счётчики по вхождению; hover карточек — подъём/зум фото + золотая рамка + свечение; `prefers-reduced-motion` отключает marquee, автоплей отзывов, spotlight и скраб.

### Логотипы
Светлый и тёмный фон — один файл `public/assets/logos/LogoBP_YellowCircle.png` (44px в шапке, 36px мобайл). Пропорции и цвета не менять.

---

## 6. CMS

### 6.1 Схема БД (`server/db/database.ts`, применяется при старте)
```sql
articles (id, slug UNIQUE, title, excerpt, content /*markdown*/, cover_url, published 0|1, created_at, updated_at)
reviews  (id, name, position, company, text, photo_url, published 1, sort_order, created_at)
leads    (id, full_name, company, phone, message, status 'new'|'in_progress'|'done', created_at)
portfolio_videos (id, service_slug, kinescope_id, title, caption, aspect_ratio '16:9'|'9:16', sort_order, published, created_at)
settings (key PK, value)   -- hero_video_id, notify_email, yandex_metrika_id
services (slug PK, name, seo_title, seo_description, hero_subtitle, card_image, card_num, card_description,
          blocks TEXT/*JSON*/, faq TEXT/*JSON*/, portfolio TEXT/*JSON*/, sort_order, published, updated_at)
```
`seedServices` заполняет `services` из `servicesFallback.ts` только если таблица пуста, ничего не перезаписывает.

### 6.2 API (админские эндпоинты вложены в ресурс: `/api/<res>/admin/...`)
```
POST /api/auth/login (rate-limit 5/15 мин) · POST /api/auth/logout · GET /api/auth/me
GET  /api/articles?page&limit · GET /api/articles/:slug · GET/POST /api/articles/admin[/all] · PUT/DELETE /api/articles/admin/:id
GET  /api/reviews · GET /api/reviews/admin/all · POST /api/reviews/admin · PUT/DELETE /api/reviews/admin/:id
POST /api/leads (rate-limit 3/час, honeypot, email) · GET /api/leads/admin/all · PUT /api/leads/admin/:id
GET  /api/portfolio?service_slug · GET /api/portfolio/admin/all · POST/PUT/DELETE /api/portfolio/admin[/:id]
GET  /api/settings · PUT /api/settings/admin/:key
GET  /api/services · GET /api/services/:slug · GET /api/services/admin/all · POST /api/services/admin · PUT/DELETE /api/services/admin/:slug
GET  /health · GET /sitemap.xml · SSR: / , /blog/:slug , /services/:slug , /privacy (см. 10)
```

### 6.3 Видео Кинескоп
```html
<iframe src="https://kinescope.io/embed/{kinescope_id}" allow="autoplay; fullscreen; picture-in-picture; encrypted-media;" allowfullscreen style="width:100%; aspect-ratio:16/9; border:none;" />
```
Для 9:16 — `aspect-ratio: 9/16`. Iframe грузится только в viewport.

---

## 7. ADMIN-ПАНЕЛЬ

- `/admin/login`, `/admin/*` (`pages/admin/*`), `noindex`. Один администратор: `ADMIN_PASSWORD_HASH` в `.env`, JWT в httpOnly cookie, logout через 8 ч.
- Sidebar: **Дашборд · Заявки · Статьи · Отзывы · Услуги · Видео · Настройки**.
- Статьи: заголовок, slug (авто из заголовка), превью, обложка (URL), markdown-контент с превью, статус.
- Отзывы: имя, должность, компания, текст, фото (URL), порядок `sort_order`, публикация; без фото — монограмма.
- Услуги (`AdminServices`): name, SEO title/description, hero_subtitle, карточка (image/num/description), blocks, faq, portfolio, порядок, публикация.
- Видео: привязка к услуге, Kinescope ID, подпись, 16:9 / 9:16, порядок, публикация.
- Заявки: таблица со статусами Новая / В работе / Завершена.
- Настройки: `hero_video_id`, `notify_email`, `yandex_metrika_id`.

---

## 8. БЕЗОПАСНОСТЬ

- JWT в httpOnly + `sameSite: strict` cookie (это и есть CSRF-защита; отдельного токена нет), bcrypt saltRounds 12, rate-limit на login и leads, honeypot в форме.
- Helmet CSP: `scriptSrc 'self' https://mc.yandex.ru`, `frameSrc https://kinescope.io`, `imgSrc 'self' data: https: blob:`; `crossOriginEmbedderPolicy: false`. Для SSR-HTML CSP-заголовок снимается.
- CORS: `https://bestpracticeai.ru`, `http://localhost:5173`, `http://localhost:4173`, `credentials: true`.
- `.env` (не коммитить): `PORT`, `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD_HASH`, `SMTP_HOST/PORT/USER/PASS`, `NOTIFY_EMAIL`, `CLIENT_DIST`.

---

## 9. 152-ФЗ И COOKIES

- `/privacy` (PRIVACY_POLICY.md), ссылки в футере, обязательный чекбокс согласия в форме.
- Cookie-баннер при первом визите → `localStorage.bp_cookie_consent=true`; Яндекс.Метрика (`useYandexMetrika`, номер из settings) грузится только после согласия.

---

## 10. SEO

- `react-helmet-async` на страницах; базовые мета и OG в `client/index.html` (`og:image` → `/assets/og/OG.jpg`).
- **SSR в `server/routes/seo.ts`**: берёт `client/dist/index.html`, подменяет title/description/og, добавляет canonical, JSON-LD (Organization, Article + BreadcrumbList, Service + BreadcrumbList + FAQPage) и пререндеренный HTML в `#root`. `sitemap.xml` собирается из БД. nginx проксирует `/`, `@seo`-fallback и `/sitemap.xml` в Express.
- `robots.txt`: `Disallow: /admin`, `/api/`.

---

## 11. АДАПТИВНОСТЬ

| Breakpoint | Поведение |
|---|---|
| ≤640px | coverflow показывает ±1 карточку, теги скрыты, стрелки DragCarousel по центру, превью в блоге скрыто |
| ≤768px | бургер-меню, hero в loop-режиме, статистика 2×2 |
| ≤900px | hero и контакты в одну колонку |
| >1024px | полный макет, контейнер `max-width: 1280px` |

---

## 12. ПРОИЗВОДИТЕЛЬНОСТЬ

- Hero-видео подключается после `window load`, до этого постер; на мобильных только loop 720p.
- Изображения `loading="lazy"`, ассеты webp (карточки услуг 19–50 КБ, подложки 25–30 КБ, иконки 128px ≈10 КБ).
- `ServicePage` — отдельный чанк (`React.lazy`); основной бандл ≈830 КБ (≈255 КБ gzip).
- Kinescope-iframe только в viewport; фото-подложка секций — один слой без group-opacity.

---

## 13. КОНТАКТЫ

```
Иван Салин · +7 (910) 170-11-26 · salinivan@mail.ru
Telegram личный: @isalin · канал: https://t.me/bestpractice_ai · VK: https://vk.com/club224447229
Сайты: https://bestpracticeai.ru · https://salinsafety.ru
```

---

## 14. АССЕТЫ (`client/public/assets/`)

```
hero/        hero{1,2,3}-scrub.mp4, -loop.mp4, -poster.webp   (активен hero3)
services/    service-01-corporate-ai-video.webp … service-05-additional.webp
decorative/  keyboard-bg.webp (светлые секции), reviews-bg.webp (тёмные), quote-marks.svg
icons/       neiroset.webp, Pioneers.webp, roi.webp, training.webp   (карточки «Почему BP», 128px)
logos/       LogoBP_YellowCircle.png
og/          OG.jpg (1200×630)
```
Папка `Assets/` в корне репо — исходники и промпты (`ASSETS_PROMPTS.md`), в сборку не попадает.

---

## 15. ЛОКАЛЬНЫЙ ЗАПУСК

```bash
cd server && npm install && npm run dev     # http://localhost:3001
cd client && npm install && npm run dev     # http://localhost:5173 (proxy /api → 3001)
```
Превью в Claude Code: `.claude/launch.json` (`frontend`, `backend`). Проверки: `npx tsc --noEmit -p .` в client и server, `npm run build` в client.

---

## 16. ДЕПЛОЙ (кратко; подробности — в памяти и `tasks/`)

1. Локально `npm run build` в client → tar `dist` → scp на сервер → распаковать в `dist.new` → `chown root:root`, `chmod 755/644` → swap `dist` ↔ `dist.old`.
2. Бэкап БД перед рискованными операциями (`better-sqlite3 .backup()` в `/root/db-backups`).
3. Серверный код: `git pull --no-rebase`, `npm install` (**без** `--omit=dev`, нужен `tsx`), `pm2 restart bestpracticeai`.
4. Проверки только через `https://bestpracticeai.ru` (на 127.0.0.1 nginx отдаёт 301).

*CLAUDE.md v2.2 · Best Practice AI · bestpracticeai.ru · обновлено 2026-09-05*
