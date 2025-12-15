import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      // Página Principal (singleton)
      S.listItem()
        .title('Página Principal')
        .id('homePage')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
        ),

      // Configuración del Sitio (singleton)
      S.listItem()
        .title('Configuración del Sitio')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.divider(),

      // Academia
      S.listItem()
        .title('Academia')
        .child(
          S.list()
            .title('Academia')
            .items([
              S.documentTypeListItem('course').title('Cursos / Mentorías'),
              S.documentTypeListItem('testimonial').title('Testimonios'),
              S.documentTypeListItem('faq').title('Preguntas Frecuentes'),
            ])
        ),

      // Productos Digitales
      S.documentTypeListItem('digitalProduct').title('Productos Digitales'),
    ])

