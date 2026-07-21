import { type SchemaTypeDefinition } from 'sanity';

// Named exports (updated schemas)
import { product } from './schemas/product';
import { category } from './schemas/category';
import { shippingZone } from './schemas/shippingZone';
import { order } from './schemas/order';

// Default exports (original schemas)
import collection from './schemas/collection';
import review from './schemas/review';
import size from './schemas/size';
import color from './schemas/color';
import siteSettings from './schemas/siteSettings';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    product,
    category,
    shippingZone,
    order,
    collection,
    review,
    size,
    color,
    siteSettings,
  ],
}
