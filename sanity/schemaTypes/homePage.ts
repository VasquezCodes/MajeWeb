import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'homePage',
    title: 'Página Principal',
    type: 'document',
    fields: [
        // Hero Section
        defineField({
            name: 'heroTitle',
            title: 'Hero - Título',
            type: 'string',
            description: 'Ej: "Hola, soy Mariajesus,"',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Hero - Subtítulo',
            type: 'text',
            rows: 4,
            description: 'Descripción debajo del título'
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero - Imagen de fondo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'heroButtons',
            title: 'Hero - Botones',
            type: 'array',
            of: [{
                type: 'object',
                name: 'heroButton',
                title: 'Botón',
                fields: [
                    {
                        name: 'label',
                        type: 'string',
                        title: 'Texto del botón',
                        validation: Rule => Rule.required()
                    },
                    {
                        name: 'url',
                        type: 'string',
                        title: 'URL / Enlace',
                        description: 'Ej: "/academia" o "https://..."',
                        validation: Rule => Rule.required()
                    },
                    {
                        name: 'variant',
                        type: 'string',
                        title: 'Estilo',
                        options: {
                            list: [
                                { title: 'Primario (fondo blanco)', value: 'primary' },
                                { title: 'Secundario (borde)', value: 'secondary' }
                            ]
                        },
                        initialValue: 'primary'
                    }
                ],
                preview: {
                    select: {
                        title: 'label',
                        subtitle: 'url'
                    }
                }
            }],
            validation: Rule => Rule.max(3)
        }),

        // About Section
        defineField({
            name: 'aboutLabel',
            title: 'Sobre mí - Etiqueta',
            type: 'string',
            description: 'Ej: "Mi Historia"'
        }),
        defineField({
            name: 'aboutTitle',
            title: 'Sobre mí - Título',
            type: 'string',
            description: 'Ej: "De Sueños a Realidad"'
        }),
        defineField({
            name: 'aboutContent',
            title: 'Sobre mí - Contenido',
            type: 'array',
            of: [{ type: 'text' }],
            description: 'Cada párrafo por separado'
        }),
        defineField({
            name: 'aboutImage',
            title: 'Sobre mí - Imagen',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),

        // CTA Section
        defineField({
            name: 'ctaTitle',
            title: 'CTA - Título',
            type: 'string',
            description: 'Ej: "¿Lista para tu próximo turno?"'
        }),
        defineField({
            name: 'ctaDescription',
            title: 'CTA - Descripción',
            type: 'text',
            rows: 2
        }),
        defineField({
            name: 'ctaButtonText',
            title: 'CTA - Texto del botón',
            type: 'string',
            description: 'Ej: "Reservar Turno Ahora"'
        }),
        defineField({
            name: 'ctaButtonUrl',
            title: 'CTA - URL del botón',
            type: 'string',
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Página Principal',
                subtitle: 'Editar contenido del home'
            }
        }
    }
})
