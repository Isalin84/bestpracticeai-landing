import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Hero } from '../components/sections/Hero'
import { Marquee } from '../components/sections/Marquee'
import { About } from '../components/sections/About'
import { Services } from '../components/sections/Services'
import { Media } from '../components/sections/Media'
import { Reviews } from '../components/sections/Reviews'
import { Contacts } from '../components/sections/Contacts'
import { api } from '../api/client'

export function Home() {
  const [kinescopeId, setKinescopeId] = useState('xmACts9kgZPMEWgLG5sfys')

  useEffect(() => {
    api.getSettings()
      .then(settings => {
        if (settings.hero_video_id) setKinescopeId(settings.hero_video_id)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <Helmet>
        <title>Best Practice AI — Генеративные нейросети для бизнеса и частных лиц</title>
        <meta name="description" content="AI Студия Best Practice. Корпоративные ИИ-видео с кастомными аватарами, обучение работе с нейросетями, вайбкодинг." />
        <link rel="canonical" href="https://bestpracticeai.ru/" />
      </Helmet>
      <Hero kinescopeId={kinescopeId} />
      <Marquee />
      <About />
      <Services />
      <Media />
      <Reviews />
      <Contacts />
    </>
  )
}
