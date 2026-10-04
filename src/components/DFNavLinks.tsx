'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const DF_PROJECTS_URL =
  '/admin/collections/projects?where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5Bwebsite%5D%5Bin%5D%5B0%5D=DF&where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5Bwebsite%5D%5Bin%5D%5B1%5D=All'

const DF_PUBLICATIONS_URL =
  '/admin/collections/publications?where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5Bwebsite%5D%5Bin%5D%5B0%5D=DF&where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5Bwebsite%5D%5Bin%5D%5B1%5D=All'

const ARCHIA_PROJECTS_URL =
  '/admin/collections/projects?where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5Bwebsite%5D%5Bin%5D%5B0%5D=Archia&where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5Bwebsite%5D%5Bin%5D%5B1%5D=All'

const ARCHIA_PUBLICATIONS_URL =
  '/admin/collections/publications?where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5Bwebsite%5D%5Bin%5D%5B0%5D=Archia&where%5Bor%5D%5B0%5D%5Band%5D%5B0%5D%5Bwebsite%5D%5Bin%5D%5B1%5D=All'

export function DFNavLinks() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    function injectLinks() {
      const navGroups = document.querySelectorAll('.nav-group')
      let dfGroup: Element | null = null
      let archiaGroup: Element | null = null

      navGroups.forEach((group) => {
        const text =
          group.querySelector('.nav-group__label, [class*="label"]')?.textContent?.trim() || ''
        if (text.toLowerCase().includes('davud farzulla')) {
          dfGroup = group
        } else if (text.toLowerCase().includes('archia')) {
          archiaGroup = group
        }
      })

      // 1. In Davud Farzulla Website group: Add Projects and Publications
      if (dfGroup) {
        const container =
          dfGroup.querySelector('nav, .nav-group__content, [class*="content"]') || dfGroup

        // Add Projects if not present
        if (!container.querySelector('.df-injected-projects')) {
          const a = document.createElement('a')
          a.className = 'nav__link df-injected-projects'
          a.href = DF_PROJECTS_URL
          a.innerHTML = '<span class="nav__link-label">Projects</span>'
          a.addEventListener('click', (e) => {
            e.preventDefault()
            window.location.href = DF_PROJECTS_URL
          })
          container.appendChild(a)
        }

        // Add Publications if not present
        if (!container.querySelector('.df-injected-publications')) {
          const a = document.createElement('a')
          a.className = 'nav__link df-injected-publications'
          a.href = DF_PUBLICATIONS_URL
          a.innerHTML = '<span class="nav__link-label">Publications</span>'
          a.addEventListener('click', (e) => {
            e.preventDefault()
            window.location.href = DF_PUBLICATIONS_URL
          })
          container.appendChild(a)
        }
      }

      // 2. In Archia Website group: Filter to Archia & All
      if (archiaGroup) {
        const links = archiaGroup.querySelectorAll('a.nav__link')
        links.forEach((a) => {
          const text = a.textContent?.trim()
          if (text === 'Projects') {
            a.setAttribute('href', ARCHIA_PROJECTS_URL)
            if (!(a as any).__archia_click_bound) {
              ;(a as any).__archia_click_bound = true
              a.addEventListener('click', (e) => {
                e.preventDefault()
                window.location.href = ARCHIA_PROJECTS_URL
              })
            }
          }
          if (text === 'Publications') {
            a.setAttribute('href', ARCHIA_PUBLICATIONS_URL)
            if (!(a as any).__archia_click_bound) {
              ;(a as any).__archia_click_bound = true
              a.addEventListener('click', (e) => {
                e.preventDefault()
                window.location.href = ARCHIA_PUBLICATIONS_URL
              })
            }
          }
        })
      }

      // 3. Highlight active link
      const currentFullUrl = window.location.pathname + window.location.search
      document.querySelectorAll('.nav__link').forEach((link) => {
        const href = link.getAttribute('href')
        if (href && currentFullUrl.includes(href)) {
          link.classList.add('active')
        }
      })
    }

    injectLinks()

    const observer = new MutationObserver(() => {
      injectLinks()
    })

    const navWrap = document.querySelector('.nav__wrap, nav, aside, .template-default__nav')
    if (navWrap) {
      observer.observe(navWrap, { childList: true, subtree: true })
    }

    return () => {
      observer.disconnect()
    }
  }, [pathname, searchParams])

  return null
}

export default DFNavLinks
