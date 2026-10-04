'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function DFNavLinks() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    function injectLinks() {
      const navGroups = document.querySelectorAll('.nav-group')
      let dfGroup: Element | null = null
      let archiaGroup: Element | null = null

      navGroups.forEach((group) => {
        const text = group.querySelector('.nav-group__label, [class*="label"]')?.textContent?.trim() || ''
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
          a.href =
            '/admin/collections/projects?where%5Bwebsite%5D%5Bin%5D%5B0%5D=DF&where%5Bwebsite%5D%5Bin%5D%5B1%5D=All'
          a.innerHTML = '<span class="nav__link-label">Projects</span>'
          container.appendChild(a)
        }

        // Add Publications if not present
        if (!container.querySelector('.df-injected-publications')) {
          const a = document.createElement('a')
          a.className = 'nav__link df-injected-publications'
          a.href =
            '/admin/collections/publications?where%5Bwebsite%5D%5Bin%5D%5B0%5D=DF&where%5Bwebsite%5D%5Bin%5D%5B1%5D=All'
          a.innerHTML = '<span class="nav__link-label">Publications</span>'
          container.appendChild(a)
        }
      }

      // 2. In Archia Website group: Filter to Archia & All
      if (archiaGroup) {
        const links = archiaGroup.querySelectorAll('a.nav__link')
        links.forEach((a) => {
          const text = a.textContent?.trim()
          if (text === 'Projects' && !a.getAttribute('href')?.includes('where')) {
            a.setAttribute(
              'href',
              '/admin/collections/projects?where%5Bwebsite%5D%5Bin%5D%5B0%5D=Archia&where%5Bwebsite%5D%5Bin%5D%5B1%5D=All'
            )
          }
          if (text === 'Publications' && !a.getAttribute('href')?.includes('where')) {
            a.setAttribute(
              'href',
              '/admin/collections/publications?where%5Bwebsite%5D%5Bin%5D%5B0%5D=Archia&where%5Bwebsite%5D%5Bin%5D%5B1%5D=All'
            )
          }
        })
      }

      // 3. Highlight active link
      const currentFullUrl = window.location.pathname + window.location.search
      document.querySelectorAll('.nav__link').forEach((link) => {
        const href = link.getAttribute('href')
        if (href && (href === currentFullUrl || (href.includes('where') && currentFullUrl === href))) {
          link.classList.add('active')
        }
      })
    }

    injectLinks()

    // Observe sidebar DOM in case of lazy render or toggle
    const observer = new MutationObserver(() => {
      injectLinks()
    })

    const navWrap = document.querySelector('.nav__wrap, nav, aside')
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
