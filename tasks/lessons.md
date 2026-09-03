# Уроки (Best Practice AI)

## Framer Motion
- Не смешивать `animate={{opacity}}` и `style={{opacity: motionValue}}` на одном элементе — анимация «залипает» на initial (контент невидим). Разделять на два вложенных `motion.div`: внешний — scroll-driven MotionValue, внутренний — initial/animate.
- `dragConstraints` числами, которые на первом рендере равны `{left:0,right:0}`, ломают позицию трека при последующем обновлении (framer пересчитывает относительную позицию 0/0 и уносит трек на край). Использовать `dragConstraints={containerRef}`.
- Хуки (`useTransform`) нельзя вызывать внутри условного JSX. Для «спрятать по прогрессу» надёжнее `useMotionValueEvent` + state + CSS transition.

## Скролл-скраб видео
- All-intra кодирование (`-g 1 -bf 0`) обязательно для плавного `currentTime`; 1440px/crf 26 даёт ≈6–7.5 МБ на 10–12 с.
- `overflow: hidden` на внешнем 250vh-контейнере ломает `position: sticky` — держать его только на внутреннем sticky-блоке.
- В Playwright `window.scrollTo` с Lenis доезжает с задержкой (Lenis сглаживает) — ждать 2–3 с и проверять `scrollY` перед скриншотом.

## Инструменты
- Playwright MCP пишет файлы только внутри корня репо/.playwright-mcp — потом переносить в scratchpad и не коммитить.
- В zsh `grep --include=*.tsx` без кавычек падает («no matches found») — квотить паттерн.
- sqlite3 на macOS не понимает JSON-путь `$[#]` — править JSON через Python.

## CMS
- Контент услуг: источник истины — таблица `services`; `server/data/servicesFallback.ts` только сид + фолбэк. Сид идёт при пустой таблице, ничего не перезаписывает.
