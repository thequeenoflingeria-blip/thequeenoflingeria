import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'storeName', title: 'Store Name', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({
      name: 'announcement',
      title: 'Announcement Bar',
      type: 'object',
      fields: [
        defineField({ name: 'isActive', type: 'boolean', initialValue: true }),
        defineField({ name: 'text_ar', type: 'string', title: 'Text (Arabic)' }),
        defineField({ name: 'text_en', type: 'string', title: 'Text (English)' }),
        defineField({ name: 'link', type: 'url', title: 'Link (Optional)' }),
      ]
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', type: 'url' }),
        defineField({ name: 'snapchat', type: 'url' }),
        defineField({ name: 'tiktok', type: 'url' }),
        defineField({ name: 'whatsapp', type: 'string' }),
      ]
    }),
    defineField({
      name: 'currency',
      title: 'Default Currency',
      type: 'string',
      options: { list: ['SAR', 'AED', 'KWD', 'DZD', 'USD'] },
      initialValue: 'SAR',
    }),
  ],
});
