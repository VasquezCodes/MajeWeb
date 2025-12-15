import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'testimonial',
    title: 'Testimonios',
    type: 'document',
    fields: [
        defineField({
            name: 'quote',
            title: 'Testimonio',
            type: 'text',
            rows: 4,
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'author',
            title: 'Nombre del autor',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'role',
            title: 'Rol / Tipo de clase',
            type: 'string',
            description: 'Ej: "Clase privada VIP"'
        }),
        defineField({
            name: 'image',
            title: 'Foto del autor',
            type: 'image',
            options: {
                hotspot: true,
            },
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
            title: 'author',
            subtitle: 'role',
            media: 'image'
        }
    }
})
