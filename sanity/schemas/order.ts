export const order = {
  name: 'order',
  title: 'الطلبات (Orders)',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'رقم الطلب',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'customerName',
      title: 'اسم الزبون',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'phone',
      title: 'رقم الهاتف',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'wilaya',
      title: 'الولاية',
      type: 'reference',
      to: [{ type: 'shippingZone' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'deliveryType',
      title: 'نوع التوصيل',
      type: 'string',
      options: {
        list: [
          { title: 'توصيل للمنزل', value: 'home' },
          { title: 'توصيل للمكتب/نقطة استلام', value: 'office' },
        ],
      },
    },
    {
      name: 'address',
      title: 'العنوان الكامل (البلدية/الشارع)',
      type: 'text',
    },
    {
      name: 'items',
      title: 'المنتجات المطلوبة',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'المنتج',
              type: 'reference',
              to: [{ type: 'product' }],
            },
            {
              name: 'quantity',
              title: 'الكمية',
              type: 'number',
            },
            {
              name: 'size',
              title: 'المقاس',
              type: 'string',
            },
            {
              name: 'color',
              title: 'اللون',
              type: 'string',
            },
            {
              name: 'priceAtPurchase',
              title: 'السعر وقت الشراء',
              type: 'number',
            },
          ],
          preview: {
            select: {
              title: 'product.name',
              subtitle: 'quantity',
              media: 'product.images.0',
            },
            prepare(selection: any) {
              const { title, subtitle, media } = selection
              return {
                title: title,
                subtitle: `الكمية: ${subtitle}`,
                media: media,
              }
            }
          }
        },
      ],
    },
    {
      name: 'totalAmount',
      title: 'المبلغ الإجمالي (شامل التوصيل)',
      type: 'number',
    },
    {
      name: 'status',
      title: 'حالة الطلب',
      type: 'string',
      options: {
        list: [
          { title: 'قيد الانتظار (Pending)', value: 'pending' },
          { title: 'تم التأكيد (Confirmed)', value: 'confirmed' },
          { title: 'قيد التوصيل (Shipped)', value: 'shipped' },
          { title: 'تم التوصيل (Delivered)', value: 'delivered' },
          { title: 'ملغى (Cancelled)', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    },
    {
      name: 'notes',
      title: 'ملاحظات إضافية',
      type: 'text',
    },
    {
      name: 'createdAt',
      title: 'تاريخ الطلب',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }
  ],
  preview: {
    select: {
      title: 'orderNumber',
      customer: 'customerName',
      status: 'status',
      total: 'totalAmount'
    },
    prepare(selection: any) {
      const { title, customer, status, total } = selection
      
      const statusMap: Record<string, string> = {
        pending: '🟡 قيد الانتظار',
        confirmed: '🟢 تم التأكيد',
        shipped: '🚚 قيد التوصيل',
        delivered: '✅ تم التوصيل',
        cancelled: '❌ ملغى'
      }

      return {
        title: `طلب #${title || 'جديد'} - ${customer}`,
        subtitle: `${statusMap[status] || status} | المجموع: ${total} د.ج`
      }
    }
  },
  orderings: [
    {
      title: 'الأحدث أولاً',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }]
    }
  ]
}
