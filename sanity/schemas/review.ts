import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({ name: 'product', title: 'Product', type: 'reference', to: [{ type: 'product' }] }),
    defineField({ name: 'customerName', title: 'Customer Name', type: 'string' }),
    defineField({ name: 'rating', title: 'Rating (1-5)', type: 'number', validation: Rule => Rule.min(1).max(5).required() }),
    defineField({ name: 'comment_ar', title: 'Comment (Arabic)', type: 'text' }),
    defineField({ name: 'comment_en', title: 'Comment (English)', type: 'text' }),
    defineField({ name: 'images', title: 'User Photos', type: 'array', of: [{ type: 'image' }] }),
    defineField({ name: 'isApproved', title: 'Is Approved', type: 'boolean', initialValue: false }),
    defineField({ name: 'isVerifiedPurchase', title: 'Verified Purchase', type: 'boolean', initialValue: false }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime' }),
  ],
});
