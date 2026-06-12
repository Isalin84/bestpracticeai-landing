import { useEffect } from 'react'

function injectMetrika(id: string) {
  if (!id || document.getElementById('ym-script')) return

  const script = document.createElement('script')
  script.id = 'ym-script'
  script.type = 'text/javascript'
  script.innerHTML = `
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${id}', 'ym');

    ym(${id}, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true
    });
  `
  document.head.appendChild(script)

  const noscript = document.createElement('noscript')
  noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute;left:-9999px;" alt=""/></div>`
  document.body.appendChild(noscript)
}

export function useYandexMetrika() {
  useEffect(() => {
    let metrikaId = ''

    // Fetch ID from API
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        metrikaId = data.yandex_metrika_id || ''
        if (!metrikaId) return

        // If consent already given — inject immediately
        if (localStorage.getItem('bp_cookie_consent') === 'true') {
          injectMetrika(metrikaId)
        }
      })
      .catch(() => {})

    // Listen for consent event
    const onConsent = () => {
      if (metrikaId) injectMetrika(metrikaId)
    }
    window.addEventListener('cookie-consent-granted', onConsent)
    return () => window.removeEventListener('cookie-consent-granted', onConsent)
  }, [])
}
