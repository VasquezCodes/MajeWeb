// app/api/sanity/homepage/route.js
// API Route para obtener datos del homepage desde Sanity
import { createClient } from '@sanity/client'

const client = createClient({
    projectId: 'oxiz2wg2',
    dataset: 'production',
    apiVersion: '2025-12-12',
    useCdn: true,
})

const homePageQuery = `
  *[_type == "homePage"][0] {
    heroTitle,
    heroSubtitle,
    heroButtons[] {
      label,
      url,
      variant
    },
    aboutLabel,
    aboutTitle,
    aboutContent,
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonUrl
  }
`

export async function GET() {
    try {
        const data = await client.fetch(homePageQuery)
        return Response.json(data || {})
    } catch (error) {
        console.error('Error fetching homepage from Sanity:', error)
        return Response.json({}, { status: 500 })
    }
}
