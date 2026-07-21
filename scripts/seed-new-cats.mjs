import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'vjerk6i1',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skUoMjTsTVPVso0s3QxvKVnmsLkxI20L3CPgNmdzhPk2azQK6kGnicQVvZeBNq2Ca6P27Caj0Z4KC9ZzUa51DLxweihIh6PDfWTuDP1GujpW3fCAaRDi7vDQghko0xzqQRBStDWc4IVN4ASWnIc92xowjeg9Ul3f3c4TPzpKD3DJKPJVKBAS',
  useCdn: false,
})

const newCategories = [
  { _id: 'cat-doubleas', _type: 'category', title: 'Doubleas', titleAr: 'دوبياس', slug: { _type: 'slug', current: 'doubleas' }, order: 9 },
  { _id: 'cat-desabe', _type: 'category', title: 'Desabe', titleAr: 'ديزابيي', slug: { _type: 'slug', current: 'desabe' }, order: 10 },
  { _id: 'cat-linwizat', _type: 'category', title: 'Linwizat', titleAr: 'لينويزات', slug: { _type: 'slug', current: 'linwizat' }, order: 11 },
  { _id: 'cat-lyshort', _type: 'category', title: 'Lyshort', titleAr: 'ليشورت', slug: { _type: 'slug', current: 'lyshort' }, order: 12 },
]

async function seed() {
  for (const doc of newCategories) {
    try {
      await client.createOrReplace(doc)
      console.log(`✅ category: ${doc._id}`)
    } catch (err) {
      console.error(`❌ ${doc._id}: ${err.message}`)
    }
  }
  console.log('Done!')
}

seed()
