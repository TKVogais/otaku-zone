'use client'

import React, { useEffect } from 'react'
import type { JSX } from 'react'
import { AnimeFeed } from '@/components/feed/AnimeFeed'

interface GenrePageProps {
  params: {
    genre: string
  }
}

export default function GenrePage({ params }: GenrePageProps): JSX.Element {
  useEffect(() => {
    const genre = decodeURIComponent(params.genre).replace(/-/g, ' ')
    document.title = `Otaku Recomenda | ${genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()}`
  }, [params.genre])

  return <AnimeFeed genre={params.genre} />
}
