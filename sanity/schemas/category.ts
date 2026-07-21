// sanity/schemas/category.ts
export const category = {
  name: 'category',
  title: 'الأقسام',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'اسم القسم',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleAr',
      title: 'اسم القسم بالعربية',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'الرابط المختصر (Slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'صورة القسم',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'وصف القسم',
      type: 'text',
      rows: 3,
    },
    {
      name: 'order',
      title: 'الترتيب',
      type: 'number',
      initialValue: 0,
    },
  ],
  preview: {
    select: { title: 'titleAr', media: 'image' },
  },
}
