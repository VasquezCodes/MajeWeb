import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'faq',
    title: 'Preguntas Frecuentes',
    type: 'document',
    fields: [
        defineField({
            name: 'question',
            title: 'Pregunta',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'answer',
            title: 'Respuesta',
            type: 'text',
            rows: 4,
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
            title: 'question',
        }
    }
})
