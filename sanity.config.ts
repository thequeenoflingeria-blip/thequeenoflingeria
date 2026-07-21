import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vjerk6i1'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'the-queen-of-lingerie',
  title: 'The Queen of Lingerie - Admin',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('لوحة التحكم')
          .items([
            S.listItem()
              .title('المنتجات')
              .icon(() => '👗')
              .child(
                S.documentTypeList('product')
                  .title('جميع المنتجات')
              ),
            S.listItem()
              .title('الأقسام')
              .icon(() => '📂')
              .child(
                S.documentTypeList('category')
                  .title('الأقسام')
              ),
            S.listItem()
              .title('التوصيل والشحن')
              .icon(() => '🚚')
              .child(
                S.documentTypeList('shippingZone')
                  .title('مناطق التوصيل')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !['product', 'category', 'shippingZone'].includes(item.getId() ?? '')
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
