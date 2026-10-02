import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../public/blocks')
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

async function run() {
  console.log('🚀 Launching headless Chrome to capture REAL website sections...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  })

  const page = await browser.newPage()

  async function saveSection(rawBuffer, filename) {
    await sharp(rawBuffer)
      .resize(600, 400, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 90 })
      .toFile(path.join(outDir, filename))
    console.log(`✅ Captured real section: ${filename}`)
  }

  // 1. HOME HERO (from http://localhost:3000/)
  console.log('Navigating to http://localhost:3000/ ...')
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 15000 })
  await new Promise((r) => setTimeout(r, 1200))

  const homeHeroShot = await page.screenshot({
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  })
  await saveSection(homeHeroShot, 'home-hero.jpg')

  // 2. FEATURED PROJECTS (from http://localhost:3000/projects)
  console.log('Navigating to http://localhost:3000/projects ...')
  await page.goto('http://localhost:3000/projects', { waitUntil: 'networkidle2', timeout: 15000 })
  await new Promise((r) => setTimeout(r, 1200))

  const projectsEl = await page.$('.projects-feed-list') || await page.$('.projects-page-shell') || await page.$('main')
  if (projectsEl) {
    const shot = await projectsEl.screenshot()
    await saveSection(shot, 'featured-projects.jpg')
  }

  // 3. STUDIO SECTIONS (from http://localhost:3000/studio)
  console.log('Navigating to http://localhost:3000/studio ...')
  await page.goto('http://localhost:3000/studio', { waitUntil: 'networkidle2', timeout: 15000 })
  await new Promise((r) => setTimeout(r, 1200))

  // Studio Intro
  const studioHeroEl = await page.$('.studio-hero')
  if (studioHeroEl) {
    const shot = await studioHeroEl.screenshot()
    await saveSection(shot, 'studio-intro.jpg')
  }

  // Full Width Media
  const studioMediaEl = await page.$('.studio-full-media')
  if (studioMediaEl) {
    const shot = await studioMediaEl.screenshot()
    await saveSection(shot, 'full-width-media.jpg')
  }

  // Founder Section (Davud Farzulla)
  const founderEl = await page.$('.studio-founder-section')
  if (founderEl) {
    const shot = await founderEl.screenshot()
    await saveSection(shot, 'founder-profile.jpg')
  }

  // Studio Pillars Grid (3 columns)
  const pillarsEl = await page.$('.studio-pillars-grid')
  if (pillarsEl) {
    const shot = await pillarsEl.screenshot()
    await saveSection(shot, 'studio-pillars.jpg')
  }

  // 4. CONTACT SECTIONS (from http://localhost:3000/contact)
  console.log('Navigating to http://localhost:3000/contact ...')
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle2', timeout: 15000 })
  await new Promise((r) => setTimeout(r, 1200))

  // Contact Hero
  const contactHeroEl = await page.$('.contact-hero')
  if (contactHeroEl) {
    const shot = await contactHeroEl.screenshot()
    await saveSection(shot, 'contact-hero.jpg')
  }

  // Contact Locations (Cards)
  const contactCardsEl = await page.$('.contact-details-grid')
  if (contactCardsEl) {
    const shot = await contactCardsEl.screenshot()
    await saveSection(shot, 'contact-locations.jpg')
  }

  // 5. JOURNAL SECTIONS (from http://localhost:3000/journal)
  console.log('Navigating to http://localhost:3000/journal ...')
  await page.goto('http://localhost:3000/journal', { waitUntil: 'networkidle2', timeout: 15000 })
  await new Promise((r) => setTimeout(r, 1200))

  const journalGridEl = await page.$('.journal-grid') || await page.$('.journal-page-shell') || await page.$('main')
  if (journalGridEl) {
    const shot = await journalGridEl.screenshot()
    await saveSection(shot, 'journal-feed.jpg')
    await saveSection(shot, 'content-block.jpg')
  }

  await browser.close()
  console.log('🎉 REAL SECTION SCREENSHOTS CAPTURED SUCCESSFULLY!')
}

run().catch((err) => {
  console.error('Error capturing sections:', err)
  process.exit(1)
})
