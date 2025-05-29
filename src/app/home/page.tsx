'use client'

import React, { useEffect } from 'react'
import type { JSX } from 'react'
import { AnimeFeed } from '@/components/feed/AnimeFeed'

export default function HomePage(): JSX.Element {
  useEffect(() => {
    document.title = 'Otaku Recomenda | Home'
  }, [])

  return <AnimeFeed />
}
