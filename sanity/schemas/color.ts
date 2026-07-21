import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'color',
  title: 'Color',
  type: 'document',
  fields: [
    defineField({ name: 'name_ar', title: 'Name (Arabic)', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'name_en', title: 'Name (English)', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'hex', title: 'Hex Code', type: 'string', description: 'Color code (e.g., #FFFFFF)', validation: Rule => Rule.required() }),
  ],
});
