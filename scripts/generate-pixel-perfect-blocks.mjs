import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../public/blocks')
const frontendOutDir = path.resolve(__dirname, '../../seidler-group-website/public/blocks')
const websiteImgDir = path.resolve(__dirname, '../../seidler-group-website/public/images')
const mediaDir = path.resolve(__dirname, '../media')
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
if (!fs.existsSync(frontendOutDir)) fs.mkdirSync(frontendOutDir, { recursive: true })

function toBase64(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).slice(1)
      const data = fs.readFileSync(filePath)
      return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${data.toString('base64')}`
    }
  } catch (e) {}
  return ''
}

const heroImgB64 = toBase64(path.join(mediaDir, 'dfr_View01.jpg')) || toBase64(path.join(websiteImgDir, 'dubai-penthouse.jpg'))
const founderImgB64 = toBase64(path.join(websiteImgDir, 'founder.jpg'))
const stadiumImgB64 = toBase64(path.join(websiteImgDir, 'ganja-stadium.jpg'))
const feldenImgB64 = toBase64(path.join(mediaDir, 'felden 2.jpg')) || toBase64(path.join(websiteImgDir, 'square-house.jpg'))
const journal1B64 = toBase64(path.join(mediaDir, 'modern-luxury-home-earthy-palettes-archia.jpg.jpeg')) || toBase64(path.join(websiteImgDir, 'square-house.jpg'))
const journal2B64 = toBase64(path.join(mediaDir, 'formula-1-baku-pedestrian-bridge-archia-interior-red.jpg.jpg')) || toBase64(path.join(websiteImgDir, 'ganja-stadium.jpg'))
const studioHeroImgB64 = toBase64(path.join(websiteImgDir, 'studio-hero.jpg'))
const contactBgB64 = toBase64(path.join(websiteImgDir, 'contact-bg.jpg'))

const baseCss = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 600px;
    height: 400px;
    overflow: hidden;
    background: #eee7dc;
    color: #151515;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`

const templates = [
  // 1. Home Hero
  {
    name: 'home-hero.jpg',
    html: `
      <div style="position: relative; width: 600px; height: 400px; overflow: hidden; background: #000;">
        <img src="${heroImgB64}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;" />
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);"></div>
        <div style="position: absolute; top: 24px; left: 28px; right: 28px; display: flex; justify-content: space-between; align-items: center; color: #fff;">
          <span style="font-size: 16px; font-weight: 700; letter-spacing: 0.25em;">A R C H I A</span>
          <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; opacity: 0.8;">Menu —</span>
        </div>
        <div style="position: absolute; bottom: 32px; left: 28px; right: 28px; color: #fff;">
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.7); margin-bottom: 6px;">London Studio</div>
          <h1 style="font-size: 26px; font-weight: 400; line-height: 1.15; letter-spacing: -0.02em;">Multidisciplinary Architecture & Interiors</h1>
        </div>
      </div>
    `
  },

  // 2. Featured Projects Showcase
  {
    name: 'featured-projects.jpg',
    html: `
      <div style="width: 600px; height: 400px; padding: 24px 28px; display: flex; flex-direction: column; justify-content: space-between; background: #eee7dc;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(0,0,0,0.12); padding-bottom: 10px;">
          <div>
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: #777;">02 / Architectural Commissions</div>
            <h2 style="font-size: 20px; font-weight: 500; margin-top: 2px;">Selected Works</h2>
          </div>
          <span style="font-size: 10px; color: #777;">All Works (20) →</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; margin-top: 14px;">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="flex: 1; border-radius: 2px; overflow: hidden; background: #ddd;">
              <img src="${stadiumImgB64}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <div style="font-size: 12px; font-weight: 600;">Ganja Football Stadium</div>
              <div style="font-size: 10px; color: #777;">Public Infrastructure • Azerbaijan</div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="flex: 1; border-radius: 2px; overflow: hidden; background: #ddd;">
              <img src="${feldenImgB64}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <div style="font-size: 12px; font-weight: 600;">Kensington Residence</div>
              <div style="font-size: 10px; color: #777;">Residential Architecture • London</div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // 3. Studio Intro & Manifesto
  {
    name: 'studio-intro.jpg',
    html: `
      <div style="width: 600px; height: 400px; padding: 40px 36px; display: flex; flex-direction: column; justify-content: center; background: #eee7dc;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.15); padding-bottom: 14px; margin-bottom: 24px;">
          <h1 style="font-size: 28px; font-weight: 400; letter-spacing: -0.02em;">Studio</h1>
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #777;">London Practice</span>
        </div>
        <p style="font-size: 17px; line-height: 1.5; color: #151515; font-weight: 400;">
          We are a multidisciplinary design studio delivering unique architectural commissions of any scale. Our works range from bespoke residential architecture, commercial interiors, and sports infrastructure to urban masterplanning.
        </p>
      </div>
    `
  },

  // 4. Founder Profile (Davud Farzulla)
  {
    name: 'founder-profile.jpg',
    html: `
      <div style="width: 600px; height: 400px; padding: 28px 32px; display: grid; grid-template-columns: 190px 1fr; gap: 24px; align-items: center; background: #eee7dc;">
        <div style="height: 340px; border-radius: 2px; overflow: hidden; background: #222; position: relative;">
          <img src="${founderImgB64}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; font-size: 8px; color: rgba(255,255,255,0.85); text-align: center;">
            Davud Farzulla — Founder
          </div>
        </div>
        <div style="display: flex; flex-direction: column; justify-content: center;">
          <h2 style="font-size: 22px; font-weight: 500; margin-bottom: 2px;">Davud Farzulla</h2>
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #777; margin-bottom: 14px;">Founder & RIBA Chartered Architect</div>
          <p style="font-size: 11.5px; line-height: 1.5; color: #333; margin-bottom: 10px;">
            Davud Farzulla is a RIBA Chartered Architect and Interior Designer with over 20 years’ experience in the UK construction industry.
          </p>
          <p style="font-size: 11px; line-height: 1.5; color: #555;">
            In 2020, Davud founded Archia to provide a fully integrated design and management service tailored specifically to private clients and large-scale civic projects.
          </p>
        </div>
      </div>
    `
  },

  // 5. About Us Section (Crucial!)
  {
    name: 'about-section.jpg',
    html: `
      <div style="width: 600px; height: 400px; padding: 36px 36px; display: grid; grid-template-columns: 180px 1fr; gap: 28px; align-items: start; background: #eee7dc;">
        <div>
          <h2 style="font-size: 26px; font-weight: 400; line-height: 1.15; letter-spacing: -0.02em;">About us</h2>
          <div style="width: 32px; height: 1px; background: rgba(0,0,0,0.25); margin-top: 14px;"></div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 13.5px; line-height: 1.5; color: #151515; font-weight: 500;">
            Our experienced team brings together strong design expertise with extensive project management experience across commercial and high-end residential sectors.
          </p>
          <p style="font-size: 11px; line-height: 1.5; color: #555;">
            We work closely with a trusted network of consultants, specialists, and suppliers, drawing on a well-established supply chain to ensure the highest standards of quality at every stage.
          </p>
          <div style="margin-top: 6px; font-size: 11px; font-weight: 600; color: #444; display: flex; align-items: center; gap: 4px;">
            Learn more ↗
          </div>
        </div>
      </div>
    `
  },

  // 6. Studio Pillars / Disciplines Grid (All 4 columns visible, not cut off!)
  {
    name: 'studio-pillars.jpg',
    html: `
      <div style="width: 600px; height: 400px; padding: 24px 24px; display: flex; flex-direction: column; justify-content: center; background: #eee7dc;">
        <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.16em; color: #777; margin-bottom: 14px; text-align: center;">
          Disciplines & Capabilities
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; border-top: 1px solid rgba(0,0,0,0.12); padding-top: 16px;">
          <div style="border-right: 1px solid rgba(0,0,0,0.08); padding-right: 8px;">
            <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-bottom: 4px;">01 / Architecture</div>
            <div style="font-size: 11px; font-weight: 600; line-height: 1.25; margin-bottom: 6px;">Residential & Masterplanning</div>
            <div style="font-size: 9px; line-height: 1.35; color: #555;">Private lateral apartments and sweeping country estates.</div>
          </div>
          <div style="border-right: 1px solid rgba(0,0,0,0.08); padding-right: 8px;">
            <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-bottom: 4px;">02 / Infrastructure</div>
            <div style="font-size: 11px; font-weight: 600; line-height: 1.25; margin-bottom: 6px;">Sports & Civic Landmarks</div>
            <div style="font-size: 9px; line-height: 1.35; color: #555;">UEFA Category 4 stadiums and public civic masterplans.</div>
          </div>
          <div style="border-right: 1px solid rgba(0,0,0,0.08); padding-right: 8px;">
            <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-bottom: 4px;">03 / Interiors</div>
            <div style="font-size: 11px; font-weight: 600; line-height: 1.25; margin-bottom: 6px;">Turnkey Craftsmanship</div>
            <div style="font-size: 9px; line-height: 1.35; color: #555;">Singular discipline: custom stone, millwork & curated art.</div>
          </div>
          <div>
            <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-bottom: 4px;">04 / Management</div>
            <div style="font-size: 11px; font-weight: 600; line-height: 1.25; margin-bottom: 6px;">Full Lifecycle Delivery</div>
            <div style="font-size: 9px; line-height: 1.35; color: #555;">From feasibility and planning permissions to turnkey handover.</div>
          </div>
        </div>
      </div>
    `
  },

  // 7. Journal & Editorial Feed
  {
    name: 'journal-feed.jpg',
    html: `
      <div style="width: 600px; height: 400px; padding: 24px 28px; display: flex; flex-direction: column; justify-content: space-between; background: #eee7dc;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(0,0,0,0.12); padding-bottom: 10px;">
          <div>
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: #777;">04 / Insights & Essays</div>
            <h2 style="font-size: 20px; font-weight: 500; margin-top: 2px;">Journal</h2>
          </div>
          <span style="font-size: 10px; color: #777;">Publications (20) →</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; margin-top: 14px;">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="flex: 1; border-radius: 2px; overflow: hidden; background: #ddd;">
              <img src="${journal1B64}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 600;">Warm Earthy Palettes</div>
              <div style="font-size: 9px; color: #777;">Modern Luxury Interiors</div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="flex: 1; border-radius: 2px; overflow: hidden; background: #ddd;">
              <img src="${journal2B64}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 600;">Formula 1 Baku Pedestrian Bridge</div>
              <div style="font-size: 9px; color: #777;">Architecture & Innovation</div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // 8. Contact Hero Header
  {
    name: 'contact-hero.jpg',
    html: `
      <div style="width: 600px; height: 400px; padding: 44px 36px; display: flex; flex-direction: column; justify-content: center; background: #eee7dc;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: #777; margin-bottom: 8px;">
          Direct Inquiries
        </div>
        <h1 style="font-size: 32px; font-weight: 400; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 18px;">
          Start a Conversation
        </h1>
        <p style="font-size: 13.5px; line-height: 1.5; color: #333; max-width: 440px; margin-bottom: 24px;">
          For new architectural commissions, private residences, and masterplanning inquiries, our London studio is available globally.
        </p>
        <div style="display: flex; gap: 24px; align-items: center; font-size: 12px; font-weight: 500;">
          <span>info@archia.com</span>
          <span style="color: #888;">•</span>
          <span>London Studio</span>
        </div>
      </div>
    `
  },

  // 9. Contact Locations / Office Cards
  {
    name: 'contact-locations.jpg',
    html: `
      <div style="width: 600px; height: 400px; padding: 28px 28px; display: flex; flex-direction: column; justify-content: space-between; background: #eee7dc;">
        <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.16em; color: #777; border-bottom: 1px solid rgba(0,0,0,0.12); padding-bottom: 8px;">
          Global Studios
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; margin-top: 14px;">
          <div style="background: rgba(255,255,255,0.4); border: 1px solid rgba(0,0,0,0.08); padding: 18px; border-radius: 2px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; color: #777;">Headquarters</div>
              <div style="font-size: 16px; font-weight: 600; margin: 4px 0 10px;">London Studio</div>
              <div style="font-size: 11px; line-height: 1.45; color: #444;">
                167-169 Great Portland Street<br>5th Floor, London W1W 5PF<br>United Kingdom
              </div>
            </div>
            <div style="font-size: 10px; font-weight: 600; color: #222; margin-top: 12px;">info@archia.com</div>
          </div>
          <div style="background: rgba(255,255,255,0.4); border: 1px solid rgba(0,0,0,0.08); padding: 18px; border-radius: 2px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; color: #777;">Regional Office</div>
              <div style="font-size: 16px; font-weight: 600; margin: 4px 0 10px;">Baku Studio</div>
              <div style="font-size: 11px; line-height: 1.45; color: #444;">
                Port Baku Towers<br>153 Neftchilar Avenue<br>Baku, Azerbaijan
              </div>
            </div>
            <div style="font-size: 10px; font-weight: 600; color: #222; margin-top: 12px;">baku@archia.com</div>
          </div>
        </div>
      </div>
    `
  },

  // 10. Full Width Media
  {
    name: 'full-width-media.jpg',
    html: `
      <div style="position: relative; width: 600px; height: 400px; overflow: hidden; background: #222;">
        <img src="${studioHeroImgB64 || contactBgB64}" style="width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%);"></div>
        <div style="position: absolute; bottom: 20px; left: 24px; right: 24px; display: flex; justify-content: space-between; align-items: center; color: #fff;">
          <span style="font-size: 12px; font-weight: 500; letter-spacing: 0.04em;">Full-Bleed Atmosphere & Spatial Photography</span>
          <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; opacity: 0.8;">Full Width Media</span>
        </div>
      </div>
    `
  },

  // 11. Content Block
  {
    name: 'content-block.jpg',
    html: `
      <div style="width: 600px; height: 400px; padding: 44px 38px; display: flex; flex-direction: column; justify-content: center; background: #eee7dc;">
        <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: #777; margin-bottom: 8px;">
          Editorial Section
        </div>
        <h2 style="font-size: 24px; font-weight: 500; line-height: 1.25; margin-bottom: 16px;">
          Design Principles & Practice Standards
        </h2>
        <p style="font-size: 12px; line-height: 1.6; color: #333; max-width: 480px;">
          Our practice is dedicated to timeless design, exacting material standards, and comprehensive oversight. Every commission is developed in direct dialogue with our clients, balancing architectural monumentality with domestic warmth.
        </p>
      </div>
    `
  }
]

async function run() {
  console.log('🚀 Launching headless Chrome to generate pixel-perfect block previews...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 600, height: 400, deviceScaleFactor: 2 })

  for (const t of templates) {
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${baseCss}</style>
        </head>
        <body>
          ${t.html}
        </body>
      </html>
    `
    await page.setContent(fullHtml, { waitUntil: 'load' })
    const buffer = await page.screenshot({ type: 'jpeg', quality: 92 })
    
    // Save to payload-test/public/blocks
    fs.writeFileSync(path.join(outDir, t.name), buffer)
    // Save to seidler-group-website/public/blocks
    fs.writeFileSync(path.join(frontendOutDir, t.name), buffer)

    console.log(`✅ Saved ${t.name} (600x400 crisp 2x)`)
  }

  await browser.close()
  console.log('🎉 ALL PIXEL-PERFECT BLOCK THUMBNAILS GENERATED!')
}

run().catch((err) => {
  console.error('Error generating previews:', err)
  process.exit(1)
})
