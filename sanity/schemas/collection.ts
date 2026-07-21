import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'collection',
  title: 'Collection / Lookbook',
  type: 'document',
  fields: [
    defineField({ name: 'title_ar', title: 'Title (Arabic)', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'title_en', title: 'Title (English)', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title_en' }, validation: Rule => Rule.required() }),
    defineField({ name: 'description_ar', title: 'Description (Arabic)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'description_en', title: 'Description (English)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroVideo', title: 'Hero Video (Optional URL/File)', type: 'file' }),
    defineField({ 
      name: 'season', 
      title: 'Season', 
      type: 'string',
      options: { list: ['SS25', 'FW25', 'SS26', 'FW26', 'Core'] }
    }),
    defineField({ name: 'isActive', title: 'Is Active', type: 'boolean', initialValue: true }),
    defineField({ name: 'launchDate', title: 'Launch Date', type: 'date' }),
  ],
});
