import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'size',
  title: 'Size',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'value', title: 'Value', type: 'string', description: 'Internal value (e.g., S, M, L, XL)', validation: Rule => Rule.required() }),
  ],
});
