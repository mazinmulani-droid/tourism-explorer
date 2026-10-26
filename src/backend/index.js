import express from 'express'
import cors from 'cors'
import { httpServerHandler } from 'cloudflare:node';
import { env } from 'cloudflare:workers';
import { getCuratedPlaces } from './curatedPlaces.js';

// Create Express app
const app = express();

// Middleware: JSON body parsing
app.use(express.json())


const devDomain = env.DEV_DOMAIN
const stagingDomain = env.STAGING_DOMAIN
const prodDomain = env.PROD_DOMAIN



// Middleware: CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  // If your frontend runs on a different local port (e.g. 5174),
  // add it here like: 'http://localhost:5174'

  // ⚠️ DEV_DOMAIN and PROD_DOMAIN are injected via Cloudflare env vars.
  // These values are available at runtime once your component is
  // published and approved. Do NOT remove them — they are required
  // for deployed environments to work correctly.
  devDomain,
  stagingDomain,
  prodDomain
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))


// Placeholder for DB access
const getDB = () => env.DB

// In order to use table, it shoule be created using
// wrangler d1 execute my-db --local --command "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE);"
// Here my-db refers to the database name defined in wrangler.jsonc
// The create table command should also be part of schema.jsonc in order to create tables remotely


// Route: Basic Test
app.get('/api/message', (req, res) => {
  const db = getDB();
  console.log('db', db)
  res.json({ message: 'Hello from Express on Workers!' })
})

// Route: Dynamic Hello
app.get('/api/hello/:name', (req, res) => {
  const environment = global.ENVIRONMENT || 'unknown'
  res.json({ message: `Hello, ${req.params.name} ${environment}` })
})

// Route: Tourism Explorer Attractions
app.get('/api/attractions', async (req, res) => {
  const { lat, lon, city = '', category = 'all', radius = 10000 } = req.query;
  const apiKey = (typeof env !== 'undefined' && env?.GEOAPIFY_API_KEY) || process.env.GEOAPIFY_API_KEY;

  const categoryMap = {
    museums: 'entertainment.museum',
    historic: 'building.historic,heritage',
    temples: 'building.place_of_worship',
    nature: 'leisure.park,natural',
    viewpoints: 'viewpoint',
    all: 'tourism.sights,building.historic,entertainment.museum'
  };

  const geoCategory = categoryMap[category] || categoryMap.all;

  if (apiKey && lat && lon) {
    try {
      // Geoapify format: circle:longitude,latitude,radius
      const geoUrl = `https://api.geoapify.com/v2/places?categories=${geoCategory}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;
      const response = await fetch(geoUrl);
      if (response.ok) {
        const data = await response.json();
        const features = data.features || [];

        // Strictly filter out restaurants, hotels, and retail shops
        const places = features
          .map((f, idx) => {
            const props = f.properties || {};
            const cats = props.categories || [];

            const isHotel = cats.some((c) => c.startsWith('accommodation.hotel') || c.startsWith('accommodation.motel'));
            const isRestaurant = cats.some((c) => c.startsWith('catering.restaurant') || c.startsWith('catering.fast_food'));
            const isShop = cats.some((c) => c.startsWith('commercial.shopping') || c.startsWith('commercial.supermarket'));

            if ((isHotel || isRestaurant || isShop) && !cats.includes('tourism.sights') && !cats.includes('building.historic')) {
              return null;
            }

            const name = props.name || props.address_line1;
            if (!name) return null;

            let catLabel = 'Attraction';
            if (cats.some((c) => c.includes('museum'))) catLabel = 'Museum';
            else if (cats.some((c) => c.includes('historic') || c.includes('heritage'))) catLabel = 'Historic Site';
            else if (cats.some((c) => c.includes('worship') || c.includes('temple') || c.includes('church'))) catLabel = 'Sacred Site';
            else if (cats.some((c) => c.includes('park') || c.includes('garden'))) catLabel = 'Park';
            else if (cats.some((c) => c.includes('viewpoint'))) catLabel = 'Viewpoint';

            return {
              id: props.place_id || `geo-${idx}`,
              name,
              category: category === 'all' ? (cats.includes('entertainment.museum') ? 'museums' : cats.includes('building.historic') ? 'historic' : 'all') : category,
              categoryLabel: catLabel,
              lat: props.lat || (f.geometry?.coordinates ? f.geometry.coordinates[1] : null),
              lon: props.lon || (f.geometry?.coordinates ? f.geometry.coordinates[0] : null),
              address: props.formatted || props.address_line2 || props.city || '',
              description: props.description || (props.wiki_and_media ? props.wiki_and_media.description : '') || `Notable ${catLabel.toLowerCase()} located in ${city || 'the area'}.`,
              image: props.wiki_and_media?.image || null,
              rating: Number((4.3 + (idx % 7) * 0.1).toFixed(1)),
              recommendedDuration: '1.5-2 hours',
              timeOfDay: idx % 3 === 0 ? 'morning' : idx % 3 === 1 ? 'afternoon' : 'evening'
            };
          })
          .filter(Boolean);

        if (places.length > 0) {
          return res.json({ source: 'geoapify', count: places.length, places });
        }
      }
    } catch (err) {
      console.warn('Geoapify fetch failed, falling back to curated:', err);
    }
  }

  // Curated fallback
  const fallback = getCuratedPlaces(city, category);
  return res.json({ source: 'curated', count: fallback.length, places: fallback });
});



// Route: Insert Data into D1
// app.post('/api/users', async (req, res) => {
//   console.log('reqq', req.body)
//   const { name, email } = req.body

//   if (!name || !email) {
//     return res.status(400).json({ error: 'Name and email are required' })
//   }

//   try {
//     const db = getDB();
//     console.log('db', db)
//     await db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
//       .bind(name, email)
//       .run()

//     res.status(201).json({ success: true, message: 'User added successfully' })
//   } catch (err) {
//     res.status(500).json({ error: 'Database error', details: err.message })
//   }
// })

// Route: Fetch All Users
// app.get('/api/users', async (req, res) => {
//   try {
//     const db = getDB()
//     const { results } = await db.prepare('SELECT * FROM users').all()
//     res.json(results)
//   } catch (err) {
//     res.status(500).json({ error: 'Database error', details: err.message })
//   }
// })

app.listen(3000)
export default httpServerHandler({ port: 3000 })
