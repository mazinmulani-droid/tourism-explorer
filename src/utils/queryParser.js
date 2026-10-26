/**
 * Query parser and category classifier for Tourism Explorer
 */

export const CATEGORIES = [
  { id: "all", label: "All Sights", icon: "🌟", geoapify: "tourism.sights,building.historic,entertainment.museum" },
  { id: "museums", label: "Museums", icon: "🏛️", geoapify: "entertainment.museum" },
  { id: "historic", label: "Landmarks & Historic", icon: "🏰", geoapify: "building.historic,heritage" },
  { id: "temples", label: "Temples & Sacred", icon: "🛕", geoapify: "building.place_of_worship" },
  { id: "nature", label: "Parks & Nature", icon: "🌳", geoapify: "leisure.park,natural" },
  { id: "viewpoints", label: "Viewpoints", icon: "🔭", geoapify: "viewpoint" }
];

export function detectCategoryFromQuery(query = "") {
  const q = query.toLowerCase();

  if (/\b(museums?|galleries|gallery|art\s+museum)\b/i.test(q)) {
    return "museums";
  }
  if (/\b(temples?|churches?|church|cathedrals?|mosques?|gurudwara|shrine|monaster(y|ies)|sacred)\b/i.test(q)) {
    return "temples";
  }
  if (/\b(landmarks?|monuments?|forts?|palaces?|castles?|historic(al)?(\s+sites?)?|ruins?|memorials?)\b/i.test(q)) {
    return "historic";
  }
  if (/\b(parks?|gardens?|nature|lakes?|waterfalls?|beaches?|sanctuar(y|ies)|botanical)\b/i.test(q)) {
    return "nature";
  }
  if (/\b(viewpoints?|view\s+points?|scenic|observation\s+deck|lookout|skyline)\b/i.test(q)) {
    return "viewpoints";
  }

  return "all";
}

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 10 ? d.toFixed(1) + " km" : Math.round(d) + " km";
}

export function parseSearchData(searchData) {
  if (!searchData) return null;

  // SearchData can arrive as an array or object
  const data = Array.isArray(searchData) ? searchData[0] : searchData;
  if (!data) return null;

  const entity = data.entities?.[0];
  const geo = entity?.entityInfo?.geo;

  const city = geo?.city || entity?.word || "Unknown Destination";
  const state = geo?.state || "";
  const country = geo?.country || "";
  const lat = geo?.lat != null ? Number(geo.lat) : null;
  const lon = geo?.long != null ? Number(geo.long) : null;

  const userCoords = data.userLocation?.position?.coords;
  const userLat = userCoords?.latitude != null ? Number(userCoords.latitude) : null;
  const userLon = userCoords?.longitude != null ? Number(userCoords.longitude) : null;

  const query = data.query || "";
  const suggestedPlace = data.suggestedPlace || "sidebar";
  const initialCategory = detectCategoryFromQuery(query);

  return {
    query,
    city,
    state,
    country,
    lat,
    lon,
    userLat,
    userLon,
    suggestedPlace,
    initialCategory
  };
}
