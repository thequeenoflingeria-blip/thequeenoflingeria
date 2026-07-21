export const product = {
  name: 'product',
  title: 'المنتجات',
  type: 'document',

  groups: [
    { name: 'info',    title: '📋 معلومات المنتج', default: true },
    { name: 'media',   title: '🖼️ الصور' },
    { name: 'pricing', title: '💰 السعر والمخزون' },
    { name: 'variants', title: '🎨 الألوان والمقاسات' },
    { name: 'flags',   title: '🏷️ تصنيفات' },
    { name: 'seo',     title: '🔍 SEO' },
  ],

  fields: [
    // ─── INFO GROUP ───────────────────────────────────────────────
    {
      name: 'name',
      title: '🇸🇦 اسم المنتج بالعربية',
      type: 'string',
      group: 'info',
      validation: (Rule: any) => Rule.required().error('هذا الحقل مطلوب'),
    },
    {
      name: 'nameEn',
      title: '🇬🇧 اسم المنتج بالإنجليزية',
      type: 'string',
      group: 'info',
    },
    {
      name: 'nameFr',
      title: '🇫🇷 اسم المنتج بالفرنسية',
      type: 'string',
      group: 'info',
    },
    {
      name: 'slug',
      title: '🔗 الرابط المختصر (Slug)',
      type: 'slug',
      group: 'info',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: '📂 القسم',
      type: 'reference',
      group: 'info',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required().error('اختر قسم للمنتج'),
    },
    {
      name: 'description',
      title: '📝 وصف المنتج (عربي)',
      type: 'text',
      rows: 4,
      group: 'info',
    },
    {
      name: 'descriptionEn',
      title: '📝 وصف المنتج (إنجليزي)',
      type: 'text',
      rows: 4,
      group: 'info',
    },
    {
      name: 'descriptionFr',
      title: '📝 وصف المنتج (فرنسي)',
      type: 'text',
      rows: 4,
      group: 'info',
    },

    // ─── MEDIA GROUP ─────────────────────────────────────────────
    {
      name: 'images',
      title: 'صور المنتج (ارفع صورة واحدة على الأقل)',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'وصف الصورة (للمحركات البحث)',
              type: 'string',
            },
          ],
        },
      ],
      options: { layout: 'grid' },
      validation: (Rule: any) => Rule.min(1).error('يجب رفع صورة واحدة على الأقل'),
    },

    // ─── PRICING GROUP ───────────────────────────────────────────
    {
      name: 'price',
      title: '💵 السعر الحالي (دج)',
      type: 'number',
      group: 'pricing',
      validation: (Rule: any) => Rule.required().positive().error('أدخل سعراً صحيحاً'),
    },
    {
      name: 'originalPrice',
      title: '🏷️ السعر الأصلي قبل الخصم (دج) — اتركه فارغاً لو ما عنده خصم',
      type: 'number',
      group: 'pricing',
    },
    {
      name: 'stock',
      title: '📦 الكمية المتاحة في المخزون',
      type: 'number',
      group: 'pricing',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0).integer(),
    },

    // ─── VARIANTS GROUP ──────────────────────────────────────────
    {
      name: 'sizes',
      title: '📏 المقاسات المتاحة',
      description: 'اختر كل المقاسات المتوفرة لهذا المنتج',
      type: 'array',
      group: 'variants',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
        list: [
          { title: '30', value: '30' },
          { title: '32', value: '32' },
          { title: '34', value: '34' },
          { title: '36', value: '36' },
          { title: '38', value: '38' },
          { title: '40', value: '40' },
          { title: '42', value: '42' },
          { title: '44', value: '44' },
          { title: '46', value: '46' },
          { title: '48', value: '48' },
          { title: '50', value: '50' },
          { title: '52', value: '52' },
          { title: '54', value: '54' },
          { title: 'XS', value: 'XS' },
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
          { title: 'XXXL', value: 'XXXL' },
          { title: '🟢 فري سايز', value: 'Free Size' },
        ],
      },
    },
    {
      name: 'colors',
      title: '🎨 الألوان المتاحة',
      description: 'أضف كل لون متوفر مع كود اللون (HEX) للعرض الصحيح في الموقع',
      type: 'array',
      group: 'variants',
      of: [
        {
          type: 'object',
          title: 'لون',
          fields: [
            {
              name: 'nameAr',
              title: 'اسم اللون (عربي)',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'nameEn',
              title: 'اسم اللون (إنجليزي)',
              type: 'string',
            },
            {
              name: 'hex',
              title: 'كود اللون (HEX) — مثال: #FF69B4',
              type: 'string',
              validation: (Rule: any) =>
                Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                  name: 'hex color',
                  invert: false,
                }).warning('يجب أن يكون كود لون صحيح مثل #FF69B4'),
            },
          ],
          preview: {
            select: {
              title: 'nameAr',
              subtitle: 'hex',
            },
            prepare({ title, subtitle }: any) {
              return {
                title: title || 'لون جديد',
                subtitle: subtitle || '',
              }
            },
          },
        },
      ],
    },

    // ─── FLAGS GROUP ─────────────────────────────────────────────
    {
      name: 'isFeatured',
      title: '⭐ منتج مميز (يظهر في الصفحة الرئيسية)',
      type: 'boolean',
      group: 'flags',
      initialValue: false,
    },
    {
      name: 'isNewArrival',
      title: '🆕 وصل حديثاً',
      type: 'boolean',
      group: 'flags',
      initialValue: false,
    },
    {
      name: 'isOnSale',
      title: '🔥 عليه خصم (Sale)',
      type: 'boolean',
      group: 'flags',
      initialValue: false,
    },

    // ─── SEO GROUP ───────────────────────────────────────────────
    {
      name: 'seoTitle',
      title: 'عنوان الصفحة (SEO)',
      type: 'string',
      group: 'seo',
    },
    {
      name: 'seoDescription',
      title: 'وصف الصفحة (SEO)',
      type: 'text',
      rows: 3,
      group: 'seo',
    },
  ],

  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      price: 'price',
      stock: 'stock',
      isOnSale: 'isOnSale',
      isFeatured: 'isFeatured',
    },
    prepare({ title, media, price, stock, isOnSale, isFeatured }: any) {
      const badges = [
        isFeatured ? '⭐' : '',
        isOnSale ? '🔥' : '',
        stock === 0 ? '❌ نفد' : '',
      ].filter(Boolean).join(' ')

      return {
        title: `${title || 'منتج جديد'} ${badges}`,
        subtitle: price ? `${price} دج | المخزون: ${stock ?? 0}` : '',
        media,
      }
    },
  },

  orderings: [
    {
      title: 'الأحدث أولاً',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'الأرخص أولاً',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'الأغلى أولاً',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'المخزون الأقل',
      name: 'stockAsc',
      by: [{ field: 'stock', direction: 'asc' }],
    },
  ],
}
