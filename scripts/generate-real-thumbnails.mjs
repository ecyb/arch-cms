import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../public/blocks')
const websiteImgDir = path.resolve(__dirname, '../../seidler-group-website/public/images')
const mediaDir = path.resolve(__dirname, '../media')

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const W = 600
const H = 400

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

async function createOverlay(title, subtitle, badge) {
  const safeTitle = escapeXml(title)
  const safeSubtitle = escapeXml(subtitle)
  const safeBadge = badge ? escapeXml(badge) : ''

  const badgeSvg = safeBadge
    ? `<rect x="30" y="30" width="${safeBadge.length * 8 + 24}" height="24" rx="12" fill="rgba(0,0,0,0.75)" stroke="rgba(255,255,255,0.3)"/>
       <text x="42" y="46" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="10" font-weight="600" letter-spacing="1">${safeBadge}</text>`
    : ''

  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.25"/>
        <stop offset="50%" stop-color="#000000" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#grad)"/>
    ${badgeSvg}
    <text x="30" y="${H - 55}" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="22" font-weight="700" letter-spacing="1">${safeTitle}</text>
    <text x="30" y="${H - 30}" fill="#CCCCCC" font-family="-apple-system, sans-serif" font-size="13" font-weight="500">${safeSubtitle}</text>
  </svg>
  `
  return Buffer.from(svg)
}

async function run() {
  console.log('Generating real photographic block previews...')

  // 1. Home Hero
  const heroImg = path.join(mediaDir, 'dfr_View01.jpg')
  const heroOverlay = await createOverlay('ARCHIA', 'Multidisciplinary Architecture & Interiors • Video Slideshow', 'HOME HERO')
  await sharp(heroImg)
    .resize(W, H, { fit: 'cover' })
    .composite([{ input: heroOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'home-hero.jpg'))
  console.log('✅ home-hero.jpg')

  // 2. Featured Projects
  const projLeft = await sharp(path.join(websiteImgDir, 'ganja-stadium.jpg')).resize(300, H, { fit: 'cover' }).toBuffer()
  const projRight = await sharp(path.join(mediaDir, 'felden 2.jpg')).resize(300, H, { fit: 'cover' }).toBuffer()
  const projOverlay = await createOverlay('Selected Works', '02 / Architectural Commissions', 'PROJECTS SHOWCASE')
  await sharp({
    create: { width: W, height: H, channels: 3, background: '#000000' },
  })
    .composite([
      { input: projLeft, top: 0, left: 0 },
      { input: projRight, top: 0, left: 300 },
      { input: projOverlay, top: 0, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'featured-projects.jpg'))
  console.log('✅ featured-projects.jpg')

  // 3. Studio Intro
  const studioImg = path.join(websiteImgDir, 'studio-hero.jpg')
  const studioOverlay = await createOverlay('Studio Manifesto', 'London Practice • Philosophy & Approach', 'STUDIO INTRO')
  await sharp(studioImg)
    .resize(W, H, { fit: 'cover' })
    .composite([{ input: studioOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'studio-intro.jpg'))
  console.log('✅ studio-intro.jpg')

  // 4. Founder Profile (Davud Farzulla)
  const founderImg = path.join(websiteImgDir, 'founder.jpg')
  const founderOverlay = await createOverlay('Davud Farzulla', 'Founder & RIBA Chartered Architect • Leadership', 'LEADERSHIP')
  await sharp(founderImg)
    .resize(W, H, { fit: 'cover', position: 'top' })
    .composite([{ input: founderOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'founder-profile.jpg'))
  console.log('✅ founder-profile.jpg')

  // 5. Studio Pillars
  const pil1 = await sharp(path.join(websiteImgDir, 'square-house.jpg')).resize(200, H, { fit: 'cover' }).toBuffer()
  const pil2 = await sharp(path.join(websiteImgDir, 'xatai-residence.jpg')).resize(200, H, { fit: 'cover' }).toBuffer()
  const pil3 = await sharp(path.join(websiteImgDir, 'ganja-stadium.jpg')).resize(200, H, { fit: 'cover' }).toBuffer()
  const pilOverlay = await createOverlay('Practice Disciplines', '01 / Architecture • 02 / Interiors • 03 / Civic', 'PILLARS')
  await sharp({
    create: { width: W, height: H, channels: 3, background: '#000000' },
  })
    .composite([
      { input: pil1, top: 0, left: 0 },
      { input: pil2, top: 0, left: 200 },
      { input: pil3, top: 0, left: 400 },
      { input: pilOverlay, top: 0, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'studio-pillars.jpg'))
  console.log('✅ studio-pillars.jpg')

  // 6. Journal Feed
  const journalLeft = await sharp(path.join(mediaDir, 'modern-luxury-home-earthy-palettes-archia.jpg.jpeg')).resize(300, H, { fit: 'cover' }).toBuffer()
  const journalRight = await sharp(path.join(mediaDir, 'formula-1-baku-pedestrian-bridge-archia-interior-red.jpg.jpg')).resize(300, H, { fit: 'cover' }).toBuffer()
  const journalOverlay = await createOverlay('Journal & Editorial', '04 / Insights, Essays & Architecture Dialogue', 'JOURNAL FEED')
  await sharp({
    create: { width: W, height: H, channels: 3, background: '#000000' },
  })
    .composite([
      { input: journalLeft, top: 0, left: 0 },
      { input: journalRight, top: 0, left: 300 },
      { input: journalOverlay, top: 0, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'journal-feed.jpg'))
  console.log('✅ journal-feed.jpg')

  // 7. Contact Hero
  const contactImg = path.join(websiteImgDir, 'contact-bg.jpg')
  const contactOverlay = await createOverlay('Start a Conversation', 'London Practice • Available for Global Commissions', 'CONTACT HERO')
  await sharp(contactImg)
    .resize(W, H, { fit: 'cover' })
    .composite([{ input: contactOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'contact-hero.jpg'))
  console.log('✅ contact-hero.jpg')

  // 8. Studio Office Cards
  const locLeft = await sharp(path.join(websiteImgDir, 'contact-bg.jpg')).resize(300, H, { fit: 'cover' }).toBuffer()
  const locRight = await sharp(path.join(mediaDir, 'Xatai for carousel.jpg')).resize(300, H, { fit: 'cover' }).toBuffer()
  const locOverlay = await createOverlay('Studio Locations', 'London Studio • Baku Studio', 'OFFICES')
  await sharp({
    create: { width: W, height: H, channels: 3, background: '#000000' },
  })
    .composite([
      { input: locLeft, top: 0, left: 0 },
      { input: locRight, top: 0, left: 300 },
      { input: locOverlay, top: 0, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'contact-locations.jpg'))
  console.log('✅ contact-locations.jpg')

  // 9. Full Width Media
  const fwmOverlay = await createOverlay('Atmospheric Photography', 'Studio Environment & Architectural Materiality', 'FULL-BLEED MEDIA')
  await sharp(studioImg)
    .resize(W, H, { fit: 'cover' })
    .composite([{ input: fwmOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'full-width-media.jpg'))
  console.log('✅ full-width-media.jpg')

  // 10. Content Block
  const contentImg = path.join(mediaDir, '1stfloor_View02.jpg')
  const contentOverlay = await createOverlay('Editorial Content Block', 'Rich Text, Headings & Material Specifications', 'CONTENT BLOCK')
  await sharp(contentImg)
    .resize(W, H, { fit: 'cover' })
    .composite([{ input: contentOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'content-block.jpg'))
  console.log('✅ content-block.jpg')

  console.log('🎉 ALL 10 REAL PHOTOGRAPHIC BLOCK PREVIEWS GENERATED!')
}

run().catch(console.error)
