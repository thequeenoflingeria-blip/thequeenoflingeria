export const shippingZone = {
  name: 'shippingZone',
  title: 'مناطق التوصيل',
  type: 'document',
  fields: [
    {
      name: 'wilaya',
      title: 'الولاية',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'wilayaCode',
      title: 'رقم الولاية',
      type: 'number',
    },
    {
      name: 'homeDeliveryPrice',
      title: 'سعر التوصيل للمنزل (دج)',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'officeDeliveryPrice',
      title: 'سعر التوصيل للمكتب (دج)',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'estimatedDays',
      title: 'مدة التوصيل (أيام)',
      type: 'string',
    },
    {
      name: 'isAvailable',
      title: 'التوصيل متاح لهذه الولاية',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'wilaya',
      homePrice: 'homeDeliveryPrice',
      officePrice: 'officeDeliveryPrice',
      code: 'wilayaCode',
    },
    prepare({ title, homePrice, officePrice, code }: any) {
      return {
        title: `${code ? `(${code}) ` : ''}${title}`,
        subtitle: `منزل: ${homePrice} دج | مكتب: ${officePrice} دج`,
      }
    },
  },
  orderings: [
    {
      title: 'رقم الولاية',
      name: 'wilayaCodeAsc',
      by: [{ field: 'wilayaCode', direction: 'asc' }],
    },
  ],
}
