import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'course',
    title: 'Cursos / Mentorías',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'Slug (URL)',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            rows: 3,
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'image',
            title: 'Imagen',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'price',
            title: 'Precio (USD)',
            type: 'number',
            validation: Rule => Rule.required().positive()
        }),
        defineField({
            name: 'originalPrice',
            title: 'Precio Original (para descuentos)',
            type: 'number',
        }),
        defineField({
            name: 'duration',
            title: 'Duración',
            type: 'string',
            description: 'Ej: "6-8 horas"'
        }),
        defineField({
            name: 'format',
            title: 'Formato',
            type: 'string',
            description: 'Ej: "Mentoría VIP Presencial"'
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags'
            }
        }),
        defineField({
            name: 'isMarketingCourse',
            title: '¿Es curso de Marketing?',
            type: 'boolean',
            initialValue: false
        }),
        defineField({
            name: 'temario',
            title: 'Temario',
            type: 'array',
            of: [{
                type: 'object',
                name: 'section',
                title: 'Sección',
                fields: [
                    { name: 'title', type: 'string', title: 'Título de la sección' },
                    {
                        name: 'items',
                        type: 'array',
                        title: 'Temas',
                        of: [{ type: 'string' }]
                    }
                ]
            }]
        }),
        defineField({
            name: 'order',
            title: 'Orden de visualización',
            type: 'number',
            initialValue: 0
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
            price: 'price'
        },
        prepare({ title, media, price }) {
            return {
                title,
                subtitle: price ? `$${price} USD` : 'Sin precio',
                media
            }
        }
    }
})
