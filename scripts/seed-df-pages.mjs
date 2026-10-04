import pg from 'pg'
import crypto from 'crypto'

const DB_URL =
  process.env.DATABASE_URI ||
  process.env.DATABASE_URL ||
  'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@66.33.22.221:45248/railway'

const client = new pg.Client({ connectionString: DB_URL })

function uid() {
  return crypto.randomBytes(12).toString('hex')
}

function makeLexical(paragraphs) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            type: 'text',
            version: 1,
          },
        ],
      })),
    },
  }
}

const pagesData = [
  {
    title: 'Davud Farzulla — Home',
    slug: 'home',
    subtitle: 'London Practice — RIBA Chartered Architect & Design Atelier',
    blocks: [
      {
        type: 'dfBiography',
        eyebrow: 'FOUNDER & PRINCIPAL ARCHITECT',
        quote:
          'Architecture begins with attentive listening. We translate each client distinct rhythm of life into structures of timeless proportion, warmth, and permanence.',
        bio: makeLexical([
          'Davud Farzulla is a RIBA Chartered Architect and Interior Designer with over 20 years’ experience in the UK construction industry. Davud obtained his education in the Midlands before moving to London to study Architecture. After receiving a degree in Architecture, he went on to complete a Master’s in History and Theory of Architecture.',
          'During his studies, Davud worked for a contractor, spending most of his time on construction sites, gaining first-hand experience in how buildings are constructed and managed. He later progressed into a design coordinator role on site, working closely with multiple trades. In his early career, Davud’s experience spanned both public and residential sectors.',
          'After obtaining RIBA Part III status, Davud moved into the ultra high-end residential sector, working directly for private clients as a project manager at a specialist family office consultancy. In this role, he delivered bespoke homes across London and the Home Counties for some of the country’s wealthiest families.',
          'In 2020, Davud founded Archia to provide a fully integrated design and management service tailored specifically to private clients. Established as a design-led practice, the studio rapidly evolved into a multidisciplinary office delivering projects ranging from high-end private residences to large-scale urban design concepts and sports complexes.',
          'Archia’s philosophy is centred on creating buildings that are thoughtful, beautiful, and sensitive to their environment. Today, the studio continues to pursue excellence in design and planning, working with international clients across Europe and the Middle East.',
        ]),
        portrait_id: 73,
        block_name: 'Founder Monograph Biography',
      },
      {
        type: 'dfProjects',
        tag: '01 / SELECTED COMMISSIONS',
        title: 'Selected Commissions & Built Works',
        project_ids: [2, 3, 5, 7, 8],
        block_name: 'Featured Architecture',
      },
      {
        type: 'dfMedia',
        media_type: 'image',
        image_id: 1,
        caption: 'Architectural Composition & Material Permanence',
        block_name: 'Hero Architectural Perspective',
      },
      {
        type: 'dfContact',
        headline: 'Private Commission Briefing',
        email: 'davud@archia.com',
        phone: '+44 (0) 20 7946 0928',
        office: 'Fitzrovia, Central London',
        block_name: 'Studio Inquiries',
      },
    ],
  },
  {
    title: 'Davud Farzulla',
    slug: 'davud-farzulla',
    subtitle: 'Founder & RIBA Chartered Architect',
    blocks: [
      {
        type: 'dfBiography',
        eyebrow: 'FOUNDER & PRINCIPAL ARCHITECT',
        quote:
          'Architecture begins with attentive listening. We translate each client distinct rhythm of life into structures of timeless proportion, warmth, and permanence.',
        bio: makeLexical([
          'Davud Farzulla is a RIBA Chartered Architect and Interior Designer with over 20 years’ experience in the UK construction industry. Davud obtained his education in the Midlands before moving to London to study Architecture. After receiving a degree in Architecture, he went on to complete a Master’s in History and Theory of Architecture.',
          'During his studies, Davud worked for a contractor, spending most of his time on construction sites, gaining first-hand experience in how buildings are constructed and managed. He later progressed into a design coordinator role on site, working closely with multiple trades. In his early career, Davud’s experience spanned both public and residential sectors.',
          'After obtaining RIBA Part III status, Davud moved into the ultra high-end residential sector, working directly for private clients as a project manager at a specialist family office consultancy. In this role, he delivered bespoke homes across London and the Home Counties for some of the country’s wealthiest families.',
          'In 2020, Davud founded Archia to provide a fully integrated design and management service tailored specifically to private clients. Established as a design-led practice, the studio rapidly evolved into a multidisciplinary office delivering projects ranging from high-end private residences to large-scale urban design concepts and sports complexes.',
          'Archia’s philosophy is centred on creating buildings that are thoughtful, beautiful, and sensitive to their environment. Today, the studio continues to pursue excellence in design and planning, working with international clients across Europe and the Middle East.',
        ]),
        portrait_id: 73,
        block_name: 'Biography & Credentials',
      },
      {
        type: 'dfContent',
        rich_text: makeLexical([
          'From high-profile developments in London to landmark public infrastructure and private commissions across Europe and the Middle East, Davud Farzulla’s architectural output is rooted in tactile materiality, spatial generosity, and enduring craftsmanship.',
          'The studio operates between London and international ateliers, coordinating every phase from initial spatial planning and planning permissions through complex structural engineering, interior millwork, and turnkey delivery.',
        ]),
        block_name: 'Philosophy & Methodology',
      },
      {
        type: 'dfMedia',
        media_type: 'image',
        image_id: 17,
        caption: 'Studio Atmosphere & Design Rigor',
        block_name: 'Atelier Atmosphere',
      },
      {
        type: 'dfContact',
        headline: 'Direct Architectural Consultation',
        email: 'davud@archia.com',
        phone: '+44 (0) 20 7946 0928',
        office: 'Fitzrovia, London W1',
        block_name: 'Direct Contact',
      },
    ],
  },
  {
    title: 'Studio Team & Practice',
    slug: 'office',
    subtitle: 'Multidisciplinary Design & Execution Team',
    blocks: [
      {
        type: 'dfContent',
        rich_text: makeLexical([
          'Davud Farzulla Architects has grown into an international practice of multidisciplinary collaborators. Realized work ranges from high-end bespoke residences across London and the Home Counties to large-scale urban design concepts and sports complexes across Europe and the Middle East.',
          'Today, the studio remains deeply rooted in its core values of thoughtful, beautiful design, contextual sensitivity, and purity of form.',
          'Studio Leadership & Core Team:\n• Davud Farzulla — Founder & Creative Director (CEO)\n• Kristof Geldmeyer — Partner & Team Director (COO)\n• Paul Grimbers — Finance and Operations (CFO)\n• Eugenio Cirmi — Press, Content & Communication Officer\n• Elizabeth Vyshniakova — Visual Content & 3D Atelier\n• Sophie Mallentjer — Chief of Staff\n• Melika Ali Zadeh — Interior Architect\n• Marta Bertani — Architect\n• Pascal Bilquin — Architect\n• Kristoff Biscop — Engineering Architect\n• José Bonifacino — Architect\n• Silke Bos — Interior Architect\n• Massimo Colagrande — Architect',
        ]),
        block_name: 'Team & Studio Roster',
      },
      {
        type: 'dfMedia',
        media_type: 'image',
        image_id: 18,
        caption: 'The Practice — London Studio & Fabrication Workshop',
        block_name: 'Studio Work Environment',
      },
      {
        type: 'dfContact',
        headline: 'Studio Operations & Press Inquiries',
        email: 'studio@archia.com',
        phone: '+44 (0) 20 7946 0928',
        office: 'Fitzrovia, Central London & Baku Atelier',
        block_name: 'Studio Contact',
      },
    ],
  },
  {
    title: 'Architecture Commissions',
    slug: 'architecture',
    subtitle: 'Built Architecture, Urban Masterplans & Civic Infrastructure',
    blocks: [
      {
        type: 'dfProjects',
        tag: '01 / ARCHITECTURE',
        title: 'Built Architecture & Masterplans',
        project_ids: [2, 5, 7, 8],
        block_name: 'Architecture Portfolio',
      },
      {
        type: 'dfMedia',
        media_type: 'image',
        image_id: 3,
        caption: 'Structural Clarity, Masonry & Tectonic Proportion',
        block_name: 'Architectural Focal Point',
      },
      {
        type: 'dfContent',
        rich_text: makeLexical([
          'Our architectural commissions encompass landmark private residences, sports infrastructure, and public urban installations. From the Formula 1 Glass Pedestrian Bridge in Baku to bespoke private homes in Central London, each structure is defined by contextual sensitivity and technical excellence.',
        ]),
        block_name: 'Architectural Practice Statement',
      },
    ],
  },
  {
    title: 'Interior Design & Spatial Craft',
    slug: 'interior',
    subtitle: 'Ultra-Prime Bespoke Residential & Curated Living Spaces',
    blocks: [
      {
        type: 'dfProjects',
        tag: '02 / INTERIOR DESIGN',
        title: 'Curated Living Spaces & Private Sanctuaries',
        project_ids: [2, 3, 7],
        block_name: 'Interior Works',
      },
      {
        type: 'dfMedia',
        media_type: 'image',
        image_id: 2,
        caption: 'Warm Minimalist Palettes, Tactile Stone & Custom Joinery',
        block_name: 'Interior Living Atmosphere',
      },
      {
        type: 'dfContent',
        rich_text: makeLexical([
          'Interiors are treated not as applied surface decoration, but as an intimate continuation of architecture itself. We balance warm natural stones, patinated metals, tactile textiles, and bespoke millwork to curate environments of calm sophistication.',
        ]),
        block_name: 'Interior Design Ethos',
      },
    ],
  },
  {
    title: 'Careers & Studio Opportunities',
    slug: 'jobs',
    subtitle: 'Join Davud Farzulla Architects in London',
    blocks: [
      {
        type: 'dfContent',
        rich_text: makeLexical([
          'Davud Farzulla Architects is always on the lookout for exceptional architectural talent, project managers, and interior designers to join our London practice.',
          'Current Openings:\n• Senior (Interior) Architect — Full Time, London\n• Project Architect (RIBA Part III or equivalent) — Ultra-Prime Residential\n• 3D Architectural Visualizer & Computational Designer\n• Studio Operations & Practice Coordinator',
          'Speculative Applications:\nWe welcome speculative submissions from talented architects and designers. Please send your portfolio (under 15MB) and curriculum vitae to careers@archia.com.',
        ]),
        block_name: 'Open Positions & Submissions',
      },
      {
        type: 'dfContact',
        headline: 'Recruitment & Talent Submissions',
        email: 'careers@archia.com',
        phone: '+44 (0) 20 7946 0928',
        office: 'Fitzrovia, Central London',
        block_name: 'Careers Contact',
      },
    ],
  },
  {
    title: 'Credits, Legal & Copyright',
    slug: 'credits-copyright',
    subtitle: 'Intellectual Property, Privacy & Legal Notice',
    blocks: [
      {
        type: 'dfContent',
        rich_text: makeLexical([
          'Data Protection Policy & Studio Governance\n\nAll architectural designs, drawings, photographs, texts, and 3D renderings published on this website are protected under international copyright law. Reproduction, distribution, or public display without prior written authorization from Davud Farzulla Architects is strictly prohibited.',
          'Privacy & GDPR Compliance:\nWe respect your personal privacy. We do not sell or trade personal information to third parties. Inquiries submitted through our forms are strictly handled by our executive practice team for project briefing purposes.',
          'Photography Credits:\nAll project photography courtesy of our commissioned architectural photographers and studio visualizers.',
        ]),
        block_name: 'Legal Governance',
      },
    ],
  },
]

async function seed() {
  console.log('Connecting to PostgreSQL...')
  await client.connect()
  console.log('Connected!')

  for (const page of pagesData) {
    console.log(`\nProcessing page: "${page.title}" (${page.slug})...`)

    // Check if page exists
    const existing = await client.query('SELECT id FROM df_pages WHERE slug = $1', [page.slug])
    let pageId

    if (existing.rows.length > 0) {
      pageId = existing.rows[0].id
      console.log(`Page already exists with ID ${pageId}, updating details...`)
      await client.query(
        'UPDATE df_pages SET title = $1, subtitle = $2, updated_at = NOW() WHERE id = $3',
        [page.title, page.subtitle, pageId]
      )

      // Clean existing blocks and relations for this page to cleanly repopulate
      await client.query('DELETE FROM df_pages_blocks_df_biography WHERE _parent_id = $1', [pageId])
      await client.query('DELETE FROM df_pages_blocks_df_projects WHERE _parent_id = $1', [pageId])
      await client.query('DELETE FROM df_pages_blocks_df_media WHERE _parent_id = $1', [pageId])
      await client.query('DELETE FROM df_pages_blocks_df_content WHERE _parent_id = $1', [pageId])
      await client.query('DELETE FROM df_pages_blocks_df_contact WHERE _parent_id = $1', [pageId])
      await client.query('DELETE FROM df_pages_rels WHERE parent_id = $1', [pageId])
    } else {
      const inserted = await client.query(
        'INSERT INTO df_pages (title, slug, subtitle, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
        [page.title, page.slug, page.subtitle]
      )
      pageId = inserted.rows[0].id
      console.log(`Created new page with ID ${pageId}`)
    }

    // Insert blocks in order
    let order = 1
    for (const b of page.blocks) {
      const blockId = uid()
      console.log(`  Inserting block ${order}: ${b.type} (${b.block_name})`)

      if (b.type === 'dfBiography') {
        await client.query(
          `INSERT INTO df_pages_blocks_df_biography 
           (_order, _parent_id, _path, id, eyebrow, quote, bio, portrait_id, block_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            order,
            pageId,
            'layout',
            blockId,
            b.eyebrow,
            b.quote,
            JSON.stringify(b.bio),
            b.portrait_id,
            b.block_name,
          ]
        )
      } else if (b.type === 'dfProjects') {
        await client.query(
          `INSERT INTO df_pages_blocks_df_projects 
           (_order, _parent_id, _path, id, tag, title, block_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [order, pageId, 'layout', blockId, b.tag, b.title, b.block_name]
        )

        // Insert relations in df_pages_rels
        let relOrder = 1
        for (const pid of b.project_ids) {
          await client.query(
            `INSERT INTO df_pages_rels 
             ("order", parent_id, path, projects_id)
             VALUES ($1, $2, $3, $4)`,
            [relOrder, pageId, `layout.${blockId}.projects`, pid]
          )
          relOrder++
        }
      } else if (b.type === 'dfMedia') {
        await client.query(
          `INSERT INTO df_pages_blocks_df_media 
           (_order, _parent_id, _path, id, type, image_id, video_url, caption, block_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            order,
            pageId,
            'layout',
            blockId,
            b.media_type,
            b.image_id,
            b.video_url || null,
            b.caption,
            b.block_name,
          ]
        )
      } else if (b.type === 'dfContent') {
        await client.query(
          `INSERT INTO df_pages_blocks_df_content 
           (_order, _parent_id, _path, id, rich_text, block_name)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [order, pageId, 'layout', blockId, JSON.stringify(b.rich_text), b.block_name]
        )
      } else if (b.type === 'dfContact') {
        await client.query(
          `INSERT INTO df_pages_blocks_df_contact 
           (_order, _parent_id, _path, id, headline, email, phone, office, block_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            order,
            pageId,
            'layout',
            blockId,
            b.headline,
            b.email,
            b.phone,
            b.office,
            b.block_name,
          ]
        )
      }
      order++
    }
  }

  console.log('\n✅ Successfully populated all 7 Davud Farzulla pages and authentic section blocks!')
  await client.end()
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seeding error:', err)
  process.exit(1)
})
