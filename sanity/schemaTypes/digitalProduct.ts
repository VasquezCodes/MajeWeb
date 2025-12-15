import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'digitalProduct',
    title: 'Productos Digitales',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
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
            name: 'features',
            title: 'Características',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Lista de beneficios incluidos'
        }),
        defineField({
            name: 'badge',
            title: 'Badge / Etiqueta',
            type: 'string',
            description: 'Ej: "Con Derechos de Reventa", "Workshop Online"'
        }),
        defineField({
            name: 'badgeColor',
            title: 'Color del Badge',
            type: 'string',
            options: {
                list: [
                    { title: 'Amarillo/Dorado', value: 'yellow' },
                    { title: 'Rosa', value: 'pink' },
                    { title: 'Azul', value: 'blue' },
                    { title: 'Negro', value: 'black' }
                ]
            },
            initialValue: 'yellow'
        }),
        defineField({
            name: 'ctaText',
            title: 'Texto del botón',
            type: 'string',
            description: 'Ej: "Comprar Ahora"',
            initialValue: 'Comprar Ahora'
        }),
        defineField({
            name: 'ctaLink',
            title: 'Link del botón (Hotmart)',
            type: 'url',
            validation: Rule => Rule.required()
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
            badge: 'badge'
        },
        prepare({ title, media, badge }) {
            return {
                title,
                subtitle: badge || 'Producto digital',
                media
            }
        }
    }
})
