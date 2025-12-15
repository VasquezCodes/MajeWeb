import { groq } from 'next-sanity'

// Home Page
export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    heroTitle,
    heroSubtitle,
    heroImage,
    heroButtons[] {
      label,
      url,
      variant
    },
    aboutLabel,
    aboutTitle,
    aboutContent,
    aboutImage,
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonUrl
  }
`

// Courses
export const coursesQuery = groq`
  *[_type == "course"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    image,
    price,
    originalPrice,
    duration,
    format,
    tags,
    isMarketingCourse,
    temario[] {
      title,
      items
    }
  }
`

// Testimonials
export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id,
    quote,
    author,
    role,
    image
  }
`

// FAQs
export const faqsQuery = groq`
  *[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer
  }
`

// Digital Products
export const digitalProductsQuery = groq`
  *[_type == "digitalProduct"] | order(order asc) {
    _id,
    title,
    description,
    image,
    features,
    badge,
    badgeColor,
    ctaText,
    ctaLink
  }
`

// Site Settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    logo,
    contactEmail,
    contactPhone,
    socialLinks[] {
      platform,
      url
    }
  }
`
