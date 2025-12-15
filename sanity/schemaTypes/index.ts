import { type SchemaTypeDefinition } from 'sanity'

import course from './course'
import testimonial from './testimonial'
import faq from './faq'
import homePage from './homePage'
import digitalProduct from './digitalProduct'
import siteSettings from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    course,
    testimonial,
    faq,
    homePage,
    digitalProduct,
    siteSettings,
  ],
}
