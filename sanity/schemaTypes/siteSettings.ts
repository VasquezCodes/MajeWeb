import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'siteSettings',
    title: 'Configuración del Sitio',
    type: 'document',
    fields: [
        defineField({
            name: 'siteName',
            title: 'Nombre del sitio',
            type: 'string',
            initialValue: 'Maje Nail Spa'
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
        }),
        defineField({
            name: 'contactEmail',
            title: 'Email de contacto',
            type: 'string',
        }),
        defineField({
            name: 'contactPhone',
            title: 'Teléfono de contacto',
            type: 'string',
        }),
        defineField({
            name: 'socialLinks',
            title: 'Redes Sociales',
            type: 'array',
            of: [{
                type: 'object',
                name: 'socialLink',
                title: 'Red Social',
                fields: [
                    {
                        name: 'platform',
                        type: 'string',
                        title: 'Plataforma',
                        options: {
                            list: [
                                { title: 'Instagram', value: 'instagram' },
                                { title: 'TikTok', value: 'tiktok' },
                                { title: 'Facebook', value: 'facebook' },
                                { title: 'YouTube', value: 'youtube' },
                                { title: 'WhatsApp', value: 'whatsapp' }
                            ]
                        }
                    },
                    {
                        name: 'url',
                        type: 'url',
                        title: 'URL del perfil'
                    }
                ]
            }]
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Configuración del Sitio',
                subtitle: 'Logo, redes sociales, contacto'
            }
        }
    }
})
