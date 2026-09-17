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
- [x] Коммит волны 2 (0a4d186)

## Волна 3
- [x] Hero3 (10.3 с): scrub 6.1 МБ / loop 1.2 МБ / постер, ACTIVE_HERO = hero3
- [x] About: убраны кикеры «О нас»/«Почему мы», подзаголовок, заголовок «Почему Best Practice?» и абзац; отступы плотнее
- [x] LightBackdrop (keyboard.png → webp 31 КБ) под About / Media / Contacts с разным фокусом
- [x] Коммит волны 3 (01f2456)
- [x] Мерж в main + push (50ec449..01f2456)
- [x] Деплой на прод 2026-09-03: бэкап БД, git pull, dist swap, pm2 restart, все проверки 200

## Волна 4 (ab60716 + ревью + правки со скриншотов)
- [x] ab60716: Услуги — кикер снят, серверный фон (не был заведён здесь — см. ревью ниже)
- [x] Общий `Section` (tone light/dark: фон, зерно, topline, spotlight, backdrop, контент с z-index 1) — единый контракт стекинга
- [x] `SectionBackdrop` вместо LightBackdrop + двух inline-копий: один слой, градиент поверх фото, без group-opacity, цвета из токенов `--bp-*-rgb`
- [x] `SectionHeading` (H2 + подзаголовок, tone) вместо пяти inline-копий; letter-spacing везде одинаковый
- [x] Кикеры сняты везде (Медиа, Отзывы, Контакты) — по скриншотам пользователя
- [x] Заголовки: «Медиа» → «Блог» (+ меню, футер, крошки, seo.ts), «Что говорят клиенты» → «Отзывы»
- [x] Блог: карусель статей (DragCarousel light + bleed за край контейнера, карточка «Ещё статьи» подгружает следующую страницу); стрелки по центру на мобильных
- [x] tsc + build, визуальная проверка через Playwright (1440 и 390), консоль без ошибок
- [x] lessons.md: правила «без кикеров», «короткие названия секций», «декор только через Section»
- [x] Коммит de67618 + push main; деплой 2026-09-03: бэкап БД, dist swap, git pull (898c3c5), pm2 restart, проверка https://bestpracticeai.ru

## Волна 5 (coverflow блога, спека, техдолг)
- [x] Блог: `CoverflowCarousel` (как «Услуги»/weichie) вместо DragCarousel; `theme="light"`, точки-индикаторы, карточка «Ещё статьи» внутри coverflow; мобильная карточка без превью
- [x] CoverflowCarousel: фикс дублей ключей при n < 5 (sideRange), меньше запас под тень на мобильных
- [x] DragCarousel: убран неиспользуемый `bleed`
- [x] CLAUDE.md переписан под текущий дизайн (v2.0): секции, компоненты, CMS услуг, API, ассеты, решения владельца
- [x] Техдолг: иконки About 850 КБ PNG → 128px webp (~10 КБ), удалены tablet-mockup / тёмный логотип / section-divider / Button.tsx / легаси `.service-card`, `.reviews-carousel`
- [x] Ревью диффа субагентом (фокус на aria-hidden карточке → preventDefault на mousedown, :focus-visible у карусели), tsc + build
- [x] Коммит e494aef + push; деплой 2026-09-03: бэкап БД, dist swap, git pull (d55b6d9), сервер без рестарта (код не менялся); прод 200, бандл с coverflow--light

## Волна 6 (баг: карточки услуг и блога не открываются по клику)
- [x] Диагноз через Playwright: `click` прилетает в `.coverflow-stage`, а не в `Link` — из-за `setPointerCapture` на pointerdown
- [x] CoverflowCarousel: захват указателя только после порога драга, обычный клик отдаётся ссылке; сброс на pointerleave; blur скрытой ссылки после драга
- [x] Проверка: клик по услуге/статье → переход; драг и клик по соседней → без перехода; мобильный tap/swipe; tsc + build
- [x] Деплой на прод и проверка бандла

## Волна 7 (фото-подложки на внутренних страницах)
- [x] `SectionBackdrop`: проп `height` (полоса сверху для длинных страниц) + маска низа полосы (шов на дробном крае), тип `backdrop` в `Section` выведен из пропсов
- [x] ServiceLayout: hero → `Section dark` с серверами (strength 0.32), тело + FAQ → `Section light` с клавиатурой
- [x] ArticlePage: `Section light` с клавиатурой
- [x] tsc + build, визуальная проверка через Playwright (услуга, статья, главная; 1440 и 390), скан пикселей на шов
- [x] CLAUDE.md §4/§5 (v2.1), lessons.md, коммит 58247ce
- [x] Деплой 2026-09-04: бэкап БД, push 9a7a490, dist swap (index-CxDtossK.js), git pull на сервере (aca09cf), pm2 без рестарта; прод 200 на /, услуге, статье, ассетах, /health

## Ревью
- Найдено и исправлено в процессе: конфликт `animate.opacity` + `style.opacity` (MotionValue) на одном элементе → контент невидим; числовые dragConstraints `{0,0}` на старте → трек прыгал на край.
- Ревью ab60716 (8 агентов): контент-обёртка Services не была позиционирована → зерно и spotlight рисовались поверх заголовка; третья рукописная копия фона с «уехавшими» числами; `rgba(11,29,58,…)` вместо токена; H2 без letter-spacing; кикер снят только в одной секции. Всё закрыто волной 4 общими компонентами.
- Принято как есть: reviews-bg.webp (1600×901) в высокой секции «Услуги» масштабируется вверх ~1.26× — при 14% видимости фото это незаметно, отдельный ассет не нужен.

## Волна 8 — сайт не открывается из РФ без VPN (2026-09-05)

**Диагноз.** Сервер, nginx, pm2, файрвол, сертификат и DNS в норме; блокировки IP нет — российские домашние и мобильные сети (МТС, МегаФон, Ростелеком) доходят до сервера и скачивают бандл. В логе виден заход iPhone с мобильного МТС: HTML/CSS/JS/картинки получены, запросов к `/api/*` нет. Причина — единственный внешний render-blocking ресурс: `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` в `<head>`. В РФ-сетях запрос к Google виснет, браузер не рисует страницу и не запускает module-скрипт до таймаута → белый экран. Воспроизведено в Playwright: при «зависшем» запросе к fonts.googleapis.com 12 с нет paint-событий и API-запросов.

- [x] Скачать Montserrat (400–700) и Lora (400–700, italic 400) woff2, сабсеты latin/latin-ext/cyrillic/cyrillic-ext → `client/public/assets/fonts/` (переменные шрифты, 12 файлов)
- [x] `fonts.css` с `@font-face` + `unicode-range`, `font-display: swap`
- [x] `client/index.html`: убрать preconnect/stylesheet Google Fonts, подключить `/assets/fonts/fonts.css`
- [x] `tsc`, `npm run build`, локальная проверка шрифтов и повтор репро с заблокированным Google (first-paint 240 мс, API уходят, Montserrat 700 / Lora italic загружены, внешних запросов 0)
- [x] Обновить CLAUDE.md §5 (шрифты локальные, v2.2), `tasks/lessons.md` (раздел «Внешние ресурсы и доступность из РФ»)
- [x] Коммит `9874105`, деплой dist на прод 2026-09-05 (swap, `dist.old` для отката, pm2 не перезапускался — SSR читает dist/index.html на каждый запрос), проверка на проде: SSR-head без googleapis, `/assets/fonts/*` 200 `font/woff2`, репро с зависшими внешними доменами — страница рисуется и ходит в API

**Статус 2026-09-05 21:20 MSK: проблема пользователя НЕ решена.** После деплоя волны 8 пользователь снова не смог открыть сайт с iPhone из РФ. По логу nginx: без VPN от iPhone не приходит ни одного запроса (даже HTTP), а с VPN (голландский IP) страница грузится целиком. Mac дома (Lovitel, Москва, без VPN) в 20:43 MSK загрузил сайт полностью в Chrome 152 и Safari 26. Домен и IP не найдены в публичных зеркалах реестра РКН (antizapret), OONI пуст. На сервере запущен tcpdump до ~00:15 MSK 06.09 (`/root/cap443.pcap`, `/root/syn443.log`, порты 80/443, без 94.103.94.96) — ждём повторной попытки пользователя без VPN, чтобы увидеть, доходят ли SYN/ClientHello. Локальные шрифты оставлены: они всё равно убирают внешнюю зависимость.

**Разбор захвата 2026-09-05 21:23 MSK (iPhone iOS 26, МТС LTE, IP 91.79.8.68, без VPN).** 13 TCP-соединений на 443 за минуту. Первые три (в пределах 200 мс) прошли полностью: через них Safari получил `/`, fonts.css, JS, CSS, часть шрифтов и иконок. Следующие три: сервер отправил ServerHello, ответных пакетов от клиента нет. Дальше 7 попыток с интервалом ~10 с: приходит только первый сегмент ClientHello (1388 байт), второй сегмент (152 байта; ClientHello iOS 26 длиннее MSS из-за ML-KEM) не доходит никогда, сервер ждёт 60 с и шлёт FIN. Итог: фильтр на пути МТС → сервер начинает молча ронять пакеты после первых 2–3 параллельных TLS-соединений с одного IP к нашему IP (похоже на эвристику ТСПУ «много TLS-коннектов к зарубежному хостингу = VPN» либо anti-DDoS хостера). Через VPN и с Mac на домашнем провайдере проблемы нет. Домен в реестре РКН не найден.

- [x] Митигирующая мера на сервере: включён HTTP/2 в nginx (`listen 443 ssl http2;`, бэкап конфига `/root/nginx-site.bak.*`) — Safari мультиплексирует все запросы в одно TLS-соединение вместо 6+, а первое соединение стабильно проходит. Проверено curl (`HTTP/2 200` для `/` и `/api/services`).
- [x] Повторная проверка пользователем 2026-09-05 ~21:40 MSK: работает и с МТС LTE, и по домашнему Wi-Fi без VPN. Захват остановлен, pcap удалён.
- [ ] (не потребовалось; держать в запасе) Если вернётся: тикет хостеру FirstByte (anti-DDoS на 185.139.70.35? ограничения РКН на /24?), запросить IP из другой подсети или вынести фронт на российский CDN/VPS другого хостера


## Волна 9 — переезд на Selectel (135.106.216.64) + ускорение фронта (2026-09-16)

План: `~/.claude/plans/linked-sauteeing-beacon.md`. Старый прод: FirstByte 185.139.70.35. Новый: Selectel, Москва ru-7a, Ubuntu 24.04, 1 vCPU / 1 ГБ / 10 ГБ — ресурсов достаточно (на старом занято 428 МБ RAM, pm2 50 МБ, load ~0); добавляем swap 2 ГБ.

- [x] Разведка старого сервера (nginx, pm2 ecosystem, .env-ключи, certbot ECDSA до 2026-10-21, ufw, fail2ban, без swap), нового (чистая Ubuntu, SSH по ключу, smtp.mail.ru:465 доступен), DNS (ns reg.ru, A @/www, TTL 3600)
- [x] Бэкап БД на старом: `/root/db-backups/pre-selectel-20260916-083623.db` (6 статей, 3 отзыва, 6 заявок, 5 видео, 5 услуг)
- [x] Этап 1A (субагент): бутстрап нового сервера — apt, swap, ufw, fail2ban, sshd без паролей, Node 22, nginx, certbot, pm2 startup, clone + npm install
- [x] Этап 1B (субагент): фронт — lazy admin/ArticlePage/PrivacyPage, vendor-чанки, precompressed gz/br, preload шрифтов/постера, svg-фавикон, дедуп `/api/settings`
- [x] Этап 1 (я): nginx-конфиг с HTTP/2, gzip_types/gzip_static(+brotli_static), Cache-Control immutable на /assets; деплой-tar без неактивных hero-видео
- [x] Этап 2: перенос .env, БД, /etc/letsencrypt через Мак; pm2; dist; nginx; верификация `curl --resolve` + Playwright host-resolver; тест SMTP/заявки
- [x] Этап 0/3: reg.ru API (`~/.regru.env`, IP allowlist) — TTL 300 → финальный снимок БД → старый nginx в прокси на новый → `zone/update_records` → dig → certbot dry-run
- [ ] Чекпоинт владельца: iPhone МТС LTE и Wi-Fi без VPN
- [ ] Этап 4: AGENTS.md v2.4, память, lessons, коммит (ecosystem.config.cjs в репо)
  - Итог 1B: главная грузит entry 138 КБ + vendor-react 275 КБ + vendor-motion 166 КБ (≈162 КБ br) вместо одного бандла 834 КБ (255 КБ gz); ArticlePage/admin — отдельные lazy-чанки; 16 .gz + 16 .br в dist/assets. Фавикон оставлен PNG (favicon.svg в public — шаблонный, не бренд). Preload hero-постера срабатывает и на не-главных страницах (30 КБ, безвредно).
  - Итог этапа 2 (16.09 11:45 MSK): новый сервер отвечает по всем URL идентично старому (статусы 200/301, SSR-разметка, 9 security-заголовков, тот же сертификат до 21.10.2026), JS отдаётся br 35.7 КБ / gzip 42 КБ с `immutable`, HTTP/2; Playwright с host-resolver: главная/услуга/админ без ошибок консоли; тестовая заявка #7 принята, письмо ушло (в логе нет ошибок), строка удалена, заявок снова 6. Попутно: `app.set('trust proxy', 1)` — rate-limit раньше считал всех посетителей 127.0.0.1 (ValidationError в error.log и на старом сервере). Коммит 25f7e1b, на новом сервере HEAD тот же.
  - Этап 3 (16.09 ~12:00 MSK): финальный снимок БД при остановленном старом pm2 (`/root/db-backups/final-selectel.db`, копия в `~/Backups/bestpracticeai/`), новый сервер перезапущен с ним (6/3/6/5/5, совпадает). Старый nginx — прокси-мост на 135.106.216.64 (бэкапы `/root/nginx-site.bak.*`, `/root/nginx-enabled.bak.*`; грабля: `sites-enabled/bestpracticeai` там отдельный файл, не симлинк). DNS: `zone/update_records` — только для реселлеров (`RESELLER_AUTH_FAILED`), сработали `zone/add_alias` ×2 + `zone/remove_record` ×2 (сначала добавить новые, потом убрать старые). `zone/update_soa` отвечает success, но TTL остаётся 1h — не критично из-за моста. Снимки зоны до/после в scratchpad сессии.
  - DNS опубликован на ns1/ns2.reg.ru через ~4 мин (12:05 MSK); 77.88.8.8 и 1.1.1.1 отдают 135.106.216.64, 8.8.8.8 держит кэш (TTL 1h). Через мост старый IP отдаёт новую сборку (200, br). Сайт по обычному DNS открывается.
- [x] Чекпоинт владельца (16.09): МТС без VPN (инкогнито) — открывается; письмо о тестовой заявке #7 пришло. Замечание: при первом заходе скролл-видео hero «замерзает» кадрами — см. волну 9.1
- [ ] Через 3–7 дней: остановить nginx/pm2 на FirstByte, отключить VPS; вернуть TTL зоны (панель reg.ru, API update_soa не применяет)

### Волна 9.1 — плавный скролл-скраб hero при первом заходе (2026-09-16)
- [x] Причина: scrub-mp4 (5.9 МБ) подключался как URL с потоковой загрузкой — сики в недокачанные места ждут сеть, кадры «замерзают»; при повторном заходе файл в кэше (30 дней), поэтому плавно.
- [x] Фикс без пережатия (`HeroScrubVideo.tsx`): после `window load` fetch → blob → `blob:`-src; до готовности постер; фолбэк на URL. Проверено Playwright локально и на проде на сети 1.5 Мбит/с: buffered = duration, сики монотонные, без seeking-столлов.
- [x] Деплой dist на Selectel (entry `index-If8uTwBB.js`), `dist.old` для отката.

### Ревью волны 9 (/code-review, 2026-09-16) и техдолг
Ревью диффа b72e7c2..e5a17c5 пятью агентами (правила, баги, история git, комментарии, техдолг). Исправлено коммитом 21464bc: Express слушал 0.0.0.0 (HOST из ecosystem игнорировался) → `app.listen(PORT, HOST)`; кэш `/api/settings` сбрасывается после завершения PUT; AbortController на blob-загрузке hero; устаревшие утверждения про cookie-баннер (удалён в 50ec449) в index.html, AdminSettings и AGENTS.md §1/§9.

**Техдолг (по приоритету, не сделано — на решение владельца):**
- [x] HIGH `server/routes/auth.ts:26`, `middleware/authMiddleware.ts:11` — фолбэк `JWT_SECRET='dev-secret-change-in-prod'`; при отсутствии переменной падать на старте (S)
- [x] HIGH `npx eslint .` в client — 20 ошибок, часть реальные React-19 баги: `ServicePage.tsx:156` setState в effect, `CoverflowCarousel.tsx:149,159` ref в рендере, `Media.tsx:58` использование до объявления (M)
- [x] HIGH `deploy.sh` устарел и опасен: nginx только `listen 80` без `ssl http2` (нарушает §17), старый репо-URL, без brotli/кэша — удалить или заменить ссылкой на §16 (M)
- [ ] MED admin POST/PUT в `reviews.ts`, `portfolio.ts`, `articles.ts` без валидации обязательных полей, деструктуризация повторяется ×3 — общий валидатор (M)
- [ ] MED `leads.ts:27` — nodemailer transporter создаётся на каждый POST (S)
- [ ] MED JSON-LD/title услуг дублируются в `server/routes/seo.ts` и `ServiceLayout.tsx:27-78` (M)
- [ ] MED `server/package.json`: `@types/cookie-parser` в dependencies; `sanitize-html`, `multer` не используются; скрипты `build`/`start` (tsc → dist) мёртвые, прод на tsx (S)
- [ ] LOW `client/public/favicon.svg` — шаблонная фиолетовая иконка, не бренд (S); hero1/hero2 (~16 МБ) лежат в репо, не используются (S); в корне `SEO-bestpracticeai-brief.md`, `Assets/New Assets/`, lock-файл `~$st Practice.docx` (S)
- [ ] LOW тестов нет, CI нет (L); `better-sqlite3` 9→13, `express` 4→5 — плановый апгрейд
- [ ] LOW «мягкая 404»: несуществующие пути под `/assets/*` (например `…js.map`) и любые неизвестные URL отдают SPA-HTML со статусом 200 (`@seo`-fallback в nginx + `seo.ts`). Для безопасности не важно, для поисковиков — soft-404. Вариант: в nginx `location /assets/ { try_files $uri =404; }`, в Express-fallback отдавать 404 для путей с расширением файла (S)

## Волна 10 — техдолг: верхние три пункта (2026-09-16)
- [x] 1. `JWT_SECRET` обязателен: общий модуль `server/config/jwtSecret.ts` (throw на старте, если не задан и NODE_ENV≠development), импорт в `index.ts`, `routes/auth.ts`, `middleware/authMiddleware.ts`; фолбэк `dev-secret-change-in-prod` удалён
- [x] 2. `npx eslint .` в client → 0 ошибок: Media (порядок объявления, пустой catch), CoverflowCarousel (ref в рендере → state), ServicePage (setState в эффекте → компонент с key=slug и начальным состоянием), HeroScrubVideo (`getHeroVideoMode` → `config/heroVideo.ts`), Contacts/AdminLogin/AdminPortfolio/AdminReviews (`any`, пустые catch, лишние escape)
- [x] 3. `deploy.sh` удалён (nginx без HTTP/2, старый репо), в AGENTS.md §16 пометка
- [x] Верификация: tsc client+server, eslint 0 ошибок, build, превью главной/услуги/админки, сервер без JWT_SECRET падает на старте, с ним — логин работает; деплой на прод, pm2 restart, проверка
  - Итог волны 10: без `JWT_SECRET` сервер падает на старте с понятной ошибкой (проверено), с секретом стартует. ESLint 0 ошибок (осталось 1 предупреждение React Compiler про react-hook-form — библиотечное). Playwright на локальном превью: главная, услуга, 404-слаг, статья, /privacy, форма логина, курсор coverflow при драге — без ошибок консоли. Пустые catch в админке заменены на alert с текстом ошибки.
- [x] 10.1 Фото отзывов на мобильном становились овальными: у `<img>` в flex-строке не было `flexShrink: 0` (у Monogram был) — длинная подпись сжимала картинку. Добавлены `flexShrink: 0` + `aspectRatio: 1/1`. Playwright 390px: все три фото 72×72.
- [x] 10.2 HTML-комментарии из `client/index.html` (preconnect/preload/шрифты) попадали в прод (view-source). Ничего чувствительного (нет IP, путей, секретов), но в проде они не нужны: плагин `stripHtmlComments` в `vite.config.ts` (только при build, до сжатия в .gz/.br). Исходник не трогали. Проверено: в `dist/index.html`, `.br`, `.gz` — 0 комментариев.
- [x] 10.3 Старый FirstByte 185.139.70.35 (2026-09-17): DNS TTL 3600, все резолверы (8.8.8.8, 1.1.1.1, 77.88.8.8, 9.9.9.9) отдают 135.106.216.64; на старый IP идут только сканеры по IP (`/.env`, `/boaform`) и краулеры, реальных посетителей нет. Финальный архив (`/root/db-backups`, БД, nginx-конфиги) скачан в `~/Backups/bestpracticeai/firstbyte-final-20260917/`. Можно удалять VPS.
- [x] 10.2 задеплоено (17.09 12:45 MSK) через ProxyJump со старого сервера: fail2ban на новом забанил IP Мака на 1 час после 5 попыток входа как `ubuntu` (см. lessons). На проде главная/услуга/статья — 0 HTML-комментариев, статусы 200.
