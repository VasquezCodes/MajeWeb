// app/api/sanity/products/route.js
// API Route para obtener productos digitales desde Sanity
import { createClient } from '@sanity/client'

const client = createClient({
    projectId: 'oxiz2wg2',
    dataset: 'production',
    apiVersion: '2025-12-12',
    useCdn: true,
})

const digitalProductsQuery = `
  *[_type == "digitalProduct"] | order(order asc) {
    _id,
    title,
    description,
    features,
    badge,
    badgeColor,
    ctaText,
    ctaLink
  }
`

export async function GET() {
    try {
        const data = await client.fetch(digitalProductsQuery)
        return Response.json(data || [])
    } catch (error) {
        console.error('Error fetching products from Sanity:', error)
        return Response.json([], { status: 500 })
    }
}
