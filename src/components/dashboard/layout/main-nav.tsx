'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { List, X } from '@phosphor-icons/react'

const genres = [
  { label: 'HOME', path: '/home' },
  { label: 'SHOUNEN', path: '/shounen' },
  { label: 'SHOJO', path: '/shojo' },
  { label: 'SEINEN', path: '/seinen' },
  { label: 'ISEKAI', path: '/isekai' },
  { label: 'MECHA', path: '/mecha' },
  { label: 'SLICE OF LIFE', path: '/slice-of-life' },
  { label: 'FANTASY', path: '/fantasy' },
  { label: 'HORROR', path: '/horror' },
]

export function MainNav(): React.JSX.Element {
  const pathname = usePathname()
  const [underlineProps, setUnderlineProps] = React.useState({ left: 0, width: 0 })
  const navRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<Record<string, HTMLDivElement | null>>({})
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const setItemRef = React.useCallback((label: string) => {
    return (el: HTMLDivElement | null) => {
      itemRefs.current[label] = el
    }
  }, [])

  React.useEffect(() => {
    const activeGenre = genres.find((g) => g.path === pathname)
    const navLeft = navRef.current?.getBoundingClientRect().left || 0
    const activeEl = itemRefs.current[activeGenre?.label || '']

    if (activeEl) {
      const rect = activeEl.getBoundingClientRect()
      setUnderlineProps({
        left: rect.left - navLeft,
        width: rect.width,
      })
    } else {
      setUnderlineProps({ left: 0, width: 0 })
    }

    setMobileMenuOpen(false)
  }, [pathname])

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>): void => {
    const navLeft = navRef.current?.getBoundingClientRect().left || 0
    const rect = event.currentTarget.getBoundingClientRect()
    setUnderlineProps({ left: rect.left - navLeft, width: rect.width })
  }

  const handleMouseLeave = (): void => {
    const segments = pathname.split('/').filter(Boolean)
    const genreFromPath = segments[0]
    const activeGenre = genres.find((g) => g.path === `/${genreFromPath}`)

    const navLeft = navRef.current?.getBoundingClientRect().left || 0
    const activeEl = itemRefs.current[activeGenre?.label || '']

    if (activeEl) {
      const rect = activeEl.getBoundingClientRect()
      setUnderlineProps({ left: rect.left - navLeft, width: rect.width })
    } else {
      setUnderlineProps({ left: 0, width: 0 })
    }
  }

  return (
    <Box
      component="header"
      ref={navRef}
      onMouseLeave={handleMouseLeave}
      sx={{
        borderBottom: '1px solid var(--mui-palette-divider)',
        backgroundColor: '#1e3a8a',
        top: 0,
        zIndex: 'var(--mui-zIndex-appBar)',
        px: 2,
        height: { xs: '80px', md: '110px' },
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        position: 'fixed',
        width: '100%',
      }}
    >
      <Box
        component="img"
        src="/assets/logo_otaku_recomenda.png"
        alt="Otaku Recomenda Logo"
        sx={{
          width: { xs: '200px', md: '320px' },
          height: { xs: '50px', md: '80px' },
          objectFit: 'contain',
          mr: { xs: 1, md: 18 },
          flexShrink: 0,
        }}
      />

      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          ml: 'auto',
          cursor: 'pointer',
          color: 'white',
          zIndex: 1201,
        }}
        onClick={() => {
          setMobileMenuOpen((open) => !open)
        }}
        aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setMobileMenuOpen((open) => !open)
          }
        }}
      >
        {mobileMenuOpen ? <X size={32} weight="bold" /> : <List size={32} weight="bold" />}
      </Box>

      <Stack
        direction="row"
        spacing={0}
        alignItems="center"
        justifyContent="center"
        width="100%"
        sx={{
          display: { xs: 'none', md: 'flex' },
          userSelect: 'none',
        }}
      >
        {genres.map((genre) => (
          <Link key={genre.label} href={genre.path} passHref>
            <Box
              ref={setItemRef(genre.label)}
              onMouseEnter={handleMouseEnter}
              sx={{
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                px: 1.2,
                py: 1,
                cursor: 'pointer',
                position: 'relative',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              {genre.label}
            </Box>
          </Link>
        ))}
      </Stack>

      <Box
        sx={{
          position: 'absolute',
          bottom: '-3px',
          left: underlineProps.left,
          width: underlineProps.width,
          height: '3px',
          bgcolor: '#809afc',
          borderRadius: '2px 2px 0 0',
          transition: 'left 0.3s ease, width 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* eslint-disable-next-line react/jsx-no-leaked-render -- o menu mobile é renderizado condicionalmente com base no estado para evitar vazamentos */}
      {mobileMenuOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: { xs: '80px', md: '110px' },
            left: 0,
            width: '100%',
            bgcolor: '#1e3a8a',
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
            py: 2,
          }}
          onClick={() => {
            setMobileMenuOpen(false)
          }}
        >
          {genres.map((genre) => (
            <Link key={genre.label} href={genre.path} passHref>
              <Box
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  py: 1.5,
                  px: 3,
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                }}
              >
                {genre.label}
              </Box>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  )
}
