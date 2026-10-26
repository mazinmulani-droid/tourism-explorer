/**
 * Curated benchmark attraction catalog for fail-safe testing and offline demos
 */

export const CURATED_PLACES = {
  // 1. NYC
  "nyc": [
    {
      id: "nyc-1",
      name: "Statue of Liberty & Ellis Island",
      category: "historic",
      categoryLabel: "Monument",
      lat: 40.6892,
      lon: -74.0445,
      address: "Liberty Island, New York, NY 10004",
      description: "Iconic copper neoclassical statue on Liberty Island, gifted by France as a universal symbol of freedom and democracy.",
      image: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "3-4 hours",
      timeOfDay: "morning"
    },
    {
      id: "nyc-2",
      name: "The Metropolitan Museum of Art (The Met)",
      category: "museums",
      categoryLabel: "Art Museum",
      lat: 40.7794,
      lon: -73.9632,
      address: "1000 5th Ave, New York, NY 10028",
      description: "One of the world's greatest art institutions, housing over two million works spanning 5,000 years of human history.",
      image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80",
      rating: 4.9,
      recommendedDuration: "2-3 hours",
      timeOfDay: "morning"
    },
    {
      id: "nyc-3",
      name: "Central Park",
      category: "nature",
      categoryLabel: "Urban Park",
      lat: 40.7829,
      lon: -73.9654,
      address: "Central Park, Manhattan, New York, NY",
      description: "Expansive 843-acre urban oasis featuring landscaped walking paths, Bow Bridge, Bethesda Fountain, and lush meadows.",
      image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format&fit=crop&q=80",
      rating: 4.9,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "nyc-4",
      name: "Empire State Building Observatory",
      category: "viewpoints",
      categoryLabel: "Observation Deck",
      lat: 40.7484,
      lon: -73.9857,
      address: "20 W 34th St, New York, NY 10001",
      description: "World-famous 102-story Art Deco skyscraper offering breathtaking 360-degree panoramic skyline views across the tri-state area.",
      image: "https://images.unsplash.com/photo-1546436836-07a91091f160?w=800&auto=format&fit=crop&q=80",
      rating: 4.7,
      recommendedDuration: "1.5 hours",
      timeOfDay: "evening"
    },
    {
      id: "nyc-5",
      name: "Brooklyn Bridge & Promenade",
      category: "historic",
      categoryLabel: "Historic Landmark",
      lat: 40.7061,
      lon: -73.9969,
      address: "Brooklyn Bridge, New York, NY 10038",
      description: "Pioneering 1883 suspension bridge with Gothic limestone arches, connecting Manhattan and Brooklyn with striking river views.",
      image: "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "1 hour",
      timeOfDay: "afternoon"
    },
    {
      id: "nyc-6",
      name: "American Museum of Natural History",
      category: "museums",
      categoryLabel: "Natural History Museum",
      lat: 40.7813,
      lon: -73.974,
      address: "200 Central Park West, New York, NY 10024",
      description: "Renowned institution showcasing dinosaur fossils, the Milstein Hall of Ocean Life with its blue whale, and planetarium exhibits.",
      image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "2-3 hours",
      timeOfDay: "afternoon"
    }
  ],

  // 2. Paris
  "paris": [
    {
      id: "paris-1",
      name: "Eiffel Tower (Tour Eiffel)",
      category: "historic",
      categoryLabel: "Monument & Viewpoint",
      lat: 48.8584,
      lon: 2.2945,
      address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris",
      description: "Gustave Eiffel's 1889 wrought-iron lattice masterpiece and quintessential global symbol of Paris standing 330 meters tall.",
      image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "2 hours",
      timeOfDay: "evening"
    },
    {
      id: "paris-2",
      name: "Louvre Museum (Musée du Louvre)",
      category: "museums",
      categoryLabel: "National Art Museum",
      lat: 48.8606,
      lon: 2.3376,
      address: "Rue de Rivoli, 75001 Paris",
      description: "World's most visited museum, housed in a historic royal palace with I.M. Pei's glass pyramid, home to the Mona Lisa and Venus de Milo.",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80",
      rating: 4.9,
      recommendedDuration: "3-4 hours",
      timeOfDay: "morning"
    },
    {
      id: "paris-3",
      name: "Cathédrale Notre-Dame de Paris",
      category: "temples",
      categoryLabel: "Medieval Cathedral",
      lat: 48.853,
      lon: 2.3499,
      address: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris",
      description: "Masterpiece of French Gothic architecture on the Île de la Cité, celebrated for its twin bell towers, gargoyles, and stained rose windows.",
      image: "https://images.unsplash.com/photo-1478358161113-b0e11994a36b?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "1.5 hours",
      timeOfDay: "morning"
    },
    {
      id: "paris-4",
      name: "Musée d'Orsay",
      category: "museums",
      categoryLabel: "Fine Arts Museum",
      lat: 48.86,
      lon: 2.3266,
      address: "1 Rue de la Légion d'Honneur, 75007 Paris",
      description: "Housed in a grand Beaux-Arts railway station, featuring world-leading Impressionist treasures by Monet, Van Gogh, Renoir, and Degas.",
      image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "paris-5",
      name: "Sacré-Cœur Basilica & Montmartre",
      category: "viewpoints",
      categoryLabel: "Basilica & Viewpoint",
      lat: 48.8867,
      lon: 2.3431,
      address: "35 Rue du Chevalier de la Barre, 75018 Paris",
      description: "Striking white domed basilica crowning the hilltop district of Montmartre, offering sweeping vistas across the Parisian skyline.",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80",
      rating: 4.7,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "paris-6",
      name: "Jardin du Luxembourg",
      category: "nature",
      categoryLabel: "Royal Palace Gardens",
      lat: 48.8462,
      lon: 2.3372,
      address: "75006 Paris",
      description: "Splendid 17th-century formal gardens featuring tree-lined promenades, the Medici Fountain, model sailboats, and tranquil statues.",
      image: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "1 hour",
      timeOfDay: "afternoon"
    }
  ],

  // 3. Rome
  "rome": [
    {
      id: "rome-1",
      name: "Colosseum (Colosseo)",
      category: "historic",
      categoryLabel: "Ancient Amphitheater",
      lat: 41.8902,
      lon: 12.4922,
      address: "Piazza del Colosseo, 1, 00184 Roma RM",
      description: "The monumental 80 AD Flavian Amphitheatre of Imperial Rome, celebrated for gladiator contests and architectural genius.",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "2-3 hours",
      timeOfDay: "morning"
    },
    {
      id: "rome-2",
      name: "The Pantheon",
      category: "historic",
      categoryLabel: "Ancient Roman Temple",
      lat: 41.8986,
      lon: 12.4769,
      address: "Piazza della Rotonda, 00186 Roma RM",
      description: "Exceptionally preserved former Roman temple built by Emperor Hadrian, famed for its monumental unreinforced concrete dome and oculus.",
      image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&auto=format&fit=crop&q=80",
      rating: 4.9,
      recommendedDuration: "1 hour",
      timeOfDay: "morning"
    },
    {
      id: "rome-3",
      name: "Trevi Fountain (Fontana di Trevi)",
      category: "historic",
      categoryLabel: "Baroque Fountain",
      lat: 41.9009,
      lon: 12.4833,
      address: "Piazza di Trevi, 00187 Roma RM",
      description: "Nicola Salvi's dramatic 18th-century Baroque masterpiece depicting Oceanus with winged horses; toss a coin to ensure your return to Rome.",
      image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "45 mins",
      timeOfDay: "evening"
    },
    {
      id: "rome-4",
      name: "Vatican Museums & Sistine Chapel",
      category: "museums",
      categoryLabel: "Papal Art Museum",
      lat: 41.9067,
      lon: 12.4536,
      address: "00120 Vatican City",
      description: "Extraordinary papal collections including classical Roman statuary, the Raphael Rooms, and Michelangelo's Sistine Chapel ceiling.",
      image: "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=800&auto=format&fit=crop&q=80",
      rating: 4.9,
      recommendedDuration: "3-4 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "rome-5",
      name: "Villa Borghese Gardens",
      category: "nature",
      categoryLabel: "Landscape Park",
      lat: 41.913,
      lon: 12.4921,
      address: "Piazzale Napoleone I, 00197 Roma RM",
      description: "Picturesque English-style landscape garden featuring walking paths, an artificial lake with rowboats, and the Galleria Borghese.",
      image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&auto=format&fit=crop&q=80",
      rating: 4.7,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    }
  ],

  // 4. Delhi
  "delhi": [
    {
      id: "delhi-1",
      name: "National Museum, New Delhi",
      category: "museums",
      categoryLabel: "Premier Museum",
      lat: 28.6118,
      lon: 77.2193,
      address: "Janpath, New Delhi, Delhi 110011",
      description: "India's premier museum housing artifacts from the Harappan civilization (Dancing Girl), ancient sculptures, miniature paintings, and silk textiles.",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
      rating: 4.7,
      recommendedDuration: "2-3 hours",
      timeOfDay: "morning"
    },
    {
      id: "delhi-2",
      name: "National Gallery of Modern Art (NGMA)",
      category: "museums",
      categoryLabel: "Modern Art Museum",
      lat: 28.6094,
      lon: 77.2346,
      address: "Jaipur House, Shershah Rd, India Gate, New Delhi 110003",
      description: "Housed in the former palace of the Maharaja of Jaipur, displaying Indian modern art from Raja Ravi Varma, Amrita Sher-Gil, and Rabindranath Tagore.",
      image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&auto=format&fit=crop&q=80",
      rating: 4.6,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "delhi-3",
      name: "National Crafts Museum & Hastkala Academy",
      category: "museums",
      categoryLabel: "Heritage & Craft Museum",
      lat: 28.6148,
      lon: 77.2427,
      address: "Bhairon Marg, Pragati Maidan, New Delhi 110001",
      description: "Charming village-themed complex with authentic rural tribal art, wooden carvings, live artisan demonstrations, and handcrafted textiles.",
      image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800&auto=format&fit=crop&q=80",
      rating: 4.7,
      recommendedDuration: "2 hours",
      timeOfDay: "morning"
    },
    {
      id: "delhi-4",
      name: "Qutub Minar Complex",
      category: "historic",
      categoryLabel: "UNESCO World Heritage",
      lat: 28.5244,
      lon: 77.1855,
      address: "Seth Sarai, Mehrauli, New Delhi, Delhi 110030",
      description: "Towering 73-meter victory tower built in 1192 with fluted red sandstone, featuring the famous 1,600-year-old rust-resistant Iron Pillar of Delhi.",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "delhi-5",
      name: "Humayun's Tomb",
      category: "historic",
      categoryLabel: "Mughal Architecture",
      lat: 28.5933,
      lon: 77.2507,
      address: "Mathura Rd, Nizamuddin East, New Delhi 110013",
      description: "Spectacular 1570 garden tomb that served as the architectural inspiration for the Taj Mahal, set within tranquil Charbagh geometric gardens.",
      image: "https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "1.5 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "delhi-6",
      name: "Lotus Temple (Bahá'í House of Worship)",
      category: "temples",
      categoryLabel: "Architectural Wonder",
      lat: 28.5535,
      lon: 77.2588,
      address: "Lotus Temple Rd, Bahapur, New Delhi 110019",
      description: "Stunning marble flower-shaped sanctuary with 27 free-standing petals open to people of all religions for peaceful meditation.",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
      rating: 4.7,
      recommendedDuration: "1 hour",
      timeOfDay: "evening"
    }
  ],

  // 5. Kurukshetra
  "kurukshetra": [
    {
      id: "kkr-1",
      name: "Brahma Sarovar",
      category: "historic",
      categoryLabel: "Sacred Water Reservoir",
      lat: 29.9622,
      lon: 76.8373,
      address: "Thanesar, Kurukshetra, Haryana 136118",
      description: "Colossal ancient water tank measuring 1,800 by 1,400 feet, mentioned in Mahabharata and renowned for the holy solar eclipse dip.",
      image: "https://images.unsplash.com/photo-1609137144822-26d9c6efc1f1?w=800&auto=format&fit=crop&q=80",
      rating: 4.7,
      recommendedDuration: "2 hours",
      timeOfDay: "morning"
    },
    {
      id: "kkr-2",
      name: "Jyotisar Birthplace of Gita",
      category: "historic",
      categoryLabel: "Heritage Site",
      lat: 29.9576,
      lon: 76.7628,
      address: "Jyotisar, Kurukshetra, Haryana 136119",
      description: "Revered historic site under an ancient Banyan tree where Lord Krishna is believed to have delivered the Bhagavad Gita discourse to Arjuna.",
      image: "https://images.unsplash.com/photo-1545629124-7bfb9a71a396?w=800&auto=format&fit=crop&q=80",
      rating: 4.6,
      recommendedDuration: "1.5 hours",
      timeOfDay: "morning"
    },
    {
      id: "kkr-3",
      name: "Kurukshetra Panorama & Science Centre",
      category: "museums",
      categoryLabel: "Science & History Museum",
      lat: 29.967,
      lon: 76.8402,
      address: "Near Brahma Sarovar, Kurukshetra 136118",
      description: "Interactive museum featuring a dramatic 360-degree cylindrical painted panorama depicting the 18-day battle of Mahabharata with sound effects.",
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80",
      rating: 4.5,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "kkr-4",
      name: "Sheikh Chilli's Tomb",
      category: "historic",
      categoryLabel: "Mughal Architecture",
      lat: 29.9806,
      lon: 76.8228,
      address: "Thanesar, Kurukshetra, Haryana 136118",
      description: "Elegantly constructed Persian-style octagonal mausoleum of Sufi saint Abd-ur-Rahim, crowned by a pear-shaped white marble dome.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
      rating: 4.6,
      recommendedDuration: "1 hour",
      timeOfDay: "afternoon"
    },
    {
      id: "kkr-5",
      name: "Sri Krishna Museum",
      category: "museums",
      categoryLabel: "Mythological Museum",
      lat: 29.9691,
      lon: 76.8415,
      address: "Old Kurukshetra, Thanesar, Kurukshetra 136118",
      description: "Extensive 6-gallery museum dedicated to the life, philosophy, and artistic representations of Lord Krishna across Indian classical history.",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
      rating: 4.5,
      recommendedDuration: "1.5 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "kkr-6",
      name: "Bhadrakali Temple (Shaktipeeth)",
      category: "temples",
      categoryLabel: "Ancient Shaktipeeth",
      lat: 29.9818,
      lon: 76.8252,
      address: "Jhansa Rd, Thanesar, Kurukshetra 136118",
      description: "One of the 51 sacred Shakti Peethas where the right ankle of Goddess Sati is believed to have fallen; Pandavas prayed here before the battle.",
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "1 hour",
      timeOfDay: "evening"
    },
    {
      id: "kkr-7",
      name: "Sthaneshwar Mahadev Temple",
      category: "temples",
      categoryLabel: "Historic Shiva Temple",
      lat: 29.9854,
      lon: 76.8189,
      address: "Thanesar, Kurukshetra, Haryana 136118",
      description: "Ancient temple dedicated to Lord Shiva where the Pandavas along with Lord Krishna worshipped and received blessings for victory in the Mahabharata war.",
      image: "https://images.unsplash.com/photo-1545629124-7bfb9a71a396?w=800&auto=format&fit=crop&q=80",
      rating: 4.7,
      recommendedDuration: "1 hour",
      timeOfDay: "morning"
    },
    {
      id: "kkr-8",
      name: "Sannihit Sarovar",
      category: "temples",
      categoryLabel: "Sacred Holy Reservoir",
      lat: 29.9678,
      lon: 76.8339,
      address: "Thanesar, Kurukshetra, Haryana 136118",
      description: "Believed to be the meeting point of seven sacred Saraswatis, containing holy water where taking a bath on Amavasya brings immense spiritual merit.",
      image: "https://images.unsplash.com/photo-1609137144822-26d9c6efc1f1?w=800&auto=format&fit=crop&q=80",
      rating: 4.6,
      recommendedDuration: "1 hour",
      timeOfDay: "afternoon"
    }
  ],

  // 6. Tokyo
  "tokyo": [
    {
      id: "tokyo-1",
      name: "Sensō-ji Temple & Kaminarimon",
      category: "temples",
      categoryLabel: "Ancient Buddhist Temple",
      lat: 35.7148,
      lon: 139.7967,
      address: "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032",
      description: "Tokyo's oldest and most significant Buddhist temple founded in 645 AD, famed for its towering red thunder gate and Nakamise shopping street.",
      image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "2 hours",
      timeOfDay: "morning"
    },
    {
      id: "tokyo-2",
      name: "Tokyo Skytree",
      category: "viewpoints",
      categoryLabel: "Broadcasting Tower & Deck",
      lat: 35.71,
      lon: 139.8107,
      address: "1 Chome-1-2 Oshiage, Sumida City, Tokyo 131-0045",
      description: "Towering 634-meter futuristic tower, the world's third-tallest structure, featuring dizzying glass-floored viewing decks over Greater Tokyo.",
      image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&auto=format&fit=crop&q=80",
      rating: 4.7,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "tokyo-3",
      name: "Meiji Jingu Shrine",
      category: "temples",
      categoryLabel: "Shinto Shrine",
      lat: 35.6764,
      lon: 139.6993,
      address: "1-1 Yoyogikamizonocho, Shibuya City, Tokyo 151-8557",
      description: "Tranquil Shinto shrine nestled in a serene 170-acre evergreen forest in the heart of Shibuya, dedicated to Emperor Meiji and Empress Shoken.",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "1.5 hours",
      timeOfDay: "morning"
    },
    {
      id: "tokyo-4",
      name: "Tokyo National Museum (Ueno Park)",
      category: "museums",
      categoryLabel: "National Art & Artifacts",
      lat: 35.7188,
      lon: 139.7765,
      address: "13-9 Uenokoen, Taito City, Tokyo 110-8712",
      description: "Japan's oldest national museum housing an unmatched collection of samurai armor, national treasure scrolls, kimonos, and Buddhist statuary.",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
      rating: 4.7,
      recommendedDuration: "2-3 hours",
      timeOfDay: "afternoon"
    },
    {
      id: "tokyo-5",
      name: "Shinjuku Gyoen National Garden",
      category: "nature",
      categoryLabel: "National Botanical Garden",
      lat: 35.6852,
      lon: 139.71,
      address: "11 Naitomachi, Shinjuku City, Tokyo 160-0014",
      description: "Idyllic 144-acre botanical park blending traditional Japanese landscape gardening, English lawns, French formal flower gardens, and cherry blossoms.",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    }
  ]
};

export function getCuratedPlaces(city = "", category = "all") {
  const normCity = city.toLowerCase().replace(/[^a-z]/g, "");
  let matchKey = Object.keys(CURATED_PLACES).find((k) => normCity.includes(k) || k.includes(normCity));

  if (!matchKey) {
    if (normCity.includes("york") || normCity.includes("manhattan")) matchKey = "nyc";
    else if (normCity.includes("delhi")) matchKey = "delhi";
    else if (normCity.includes("kuruk")) matchKey = "kurukshetra";
    else if (normCity.includes("paris")) matchKey = "paris";
    else if (normCity.includes("rome") || normCity.includes("roma")) matchKey = "rome";
    else if (normCity.includes("tokyo")) matchKey = "tokyo";
  }

  const list = matchKey ? CURATED_PLACES[matchKey] : [];
  if (category === "all" || !category) {
    return list;
  }
  return list.filter((p) => p.category === category);
}
