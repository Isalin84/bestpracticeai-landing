# Редизайн-волна: скролл-видео Hero, карусели, CMS услуг

- [x] Шаг 0. Ассеты: webp-карточки услуг (19–50 КБ), скраб 1440px crf26 (5.9/7.5 МБ), луп 720p (1.3/1.6 МБ), постеры, OG.jpg
- [x] Шаг 1. Hero: скролл-скраб (sticky 250vh), config heroVideo.ts, HeroScrubVideo.tsx, фикс «Инновации»
- [x] Шаг 2. DragCarousel.tsx + карусель услуг (weichie-стиль) с новыми заголовками, подгрузка из CMS
- [x] Шаг 3. CMS сервер: таблица services, сид, /api/services, seo.ts из БД с фолбэком
- [x] Шаг 4. CMS клиент: ServicePage (:slug), AdminServices, api-клиент; 5 статичных страниц удалены
- [x] Шаг 5. About: без фото, карусель карточек, дописанные тексты; Footer: колонка «Основатель» + salinsafety
- [x] Шаг 6. Плотность: паддинги 80, hairlines, зерно .bp-grain, H2 крупнее + кикеры, marquee, чистка ассетов
- [x] Верификация: build/tsc ок; API/SSR/sitemap/404/401; правка в БД → API+SSR; unpublish → 404; скраб 0→10→0
- [x] Проверка после фикса каруселей (transform none), мобайл (loop, без скраба), страница услуги из CMS, админ-API через логин
- [x] Скриншоты Hero1 vs Hero2 отправлены пользователю (ACTIVE_HERO пока = hero1)
- [x] Коммит 6ba4109 (ветка redesign/hero-video-carousels-cms)
- [x] Решение пользователя: Hero2

## Волна 2 (правки пользователя)
- [x] ACTIVE_HERO = hero2; скраб отзывчивее (lerp 0.18 → 0.5)
- [x] Услуги: 3D coverflow-карусель (CoverflowCarousel.tsx) вместо плоской ленты
- [x] Hero: убран дублирующий ряд цифр (500+/2/70%)
- [x] Отзывы: фон 1st frame (webp 25 КБ, opacity .32 + синий градиент)
- [ ] Коммит волны 2

## Ревью
- Найдено и исправлено в процессе: конфликт `animate.opacity` + `style.opacity` (MotionValue) на одном элементе → контент невидим; числовые dragConstraints `{0,0}` на старте → трек прыгал на край.
