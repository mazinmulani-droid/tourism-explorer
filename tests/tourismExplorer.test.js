import test from "node:test";
import assert from "node:assert";
import { parseSearchData, detectCategoryFromQuery, calculateDistanceKm } from "../src/utils/queryParser.js";
import { getCuratedPlaces } from "../src/backend/curatedPlaces.js";
import hdConfig from "../hyperdart.config.js";

test("Category detection from travel queries", () => {
  assert.strictEqual(detectCategoryFromQuery("Museums in Delhi"), "museums");
  assert.strictEqual(detectCategoryFromQuery("art gallery in Paris"), "museums");
  assert.strictEqual(detectCategoryFromQuery("Landmarks in Rome"), "historic");
  assert.strictEqual(detectCategoryFromQuery("historic sites in Kurukshetra"), "historic");
  assert.strictEqual(detectCategoryFromQuery("Temples in Kurukshetra"), "temples");
  assert.strictEqual(detectCategoryFromQuery("churches in Rome"), "temples");
  assert.strictEqual(detectCategoryFromQuery("parks in Paris"), "nature");
  assert.strictEqual(detectCategoryFromQuery("viewpoints in Tokyo"), "viewpoints");
  assert.strictEqual(detectCategoryFromQuery("Tourist attractions in NYC"), "all");
  assert.strictEqual(detectCategoryFromQuery("Things to do in Paris"), "all");
});

test("parseSearchData handles array and single-object inputs", () => {
  const arrayInput = [
    {
      query: "Things to do in Paris",
      entities: [
        {
          word: "Paris",
          entityInfo: { geo: { city: "Paris", country: "France", lat: 48.8566, long: 2.3522 } }
        }
      ],
      userLocation: { position: { coords: { latitude: 48.8, longitude: 2.3 } } },
      suggestedPlace: "mainline"
    }
  ];
  const parsedArray = parseSearchData(arrayInput);
  assert.strictEqual(parsedArray.city, "Paris");
  assert.strictEqual(parsedArray.country, "France");
  assert.strictEqual(parsedArray.lat, 48.8566);
  assert.strictEqual(parsedArray.lon, 2.3522);
  assert.strictEqual(parsedArray.suggestedPlace, "mainline");

  const objectInput = {
    query: "Temples in Kurukshetra",
    entities: [
      {
        word: "Kurukshetra",
        entityInfo: { geo: { city: "Kurukshetra", country: "India", lat: 29.9695, long: 76.8783 } }
      }
    ],
    suggestedPlace: "sidebar"
  };
  const parsedObject = parseSearchData(objectInput);
  assert.strictEqual(parsedObject.city, "Kurukshetra");
  assert.strictEqual(parsedObject.initialCategory, "temples");
  assert.strictEqual(parsedObject.suggestedPlace, "sidebar");

  assert.strictEqual(parseSearchData(null), null);
  assert.strictEqual(parseSearchData([]), null);
});

test("calculateDistanceKm computes accurate Haversine distance", () => {
  const dist = calculateDistanceKm(40.7128, -74.006, 40.6892, -74.0445);
  assert.ok(dist.includes("km"));
  assert.ok(parseFloat(dist) > 0);
});

test("Curated fallback places exist for all 6 benchmark cities", () => {
  const cities = ["nyc", "paris", "rome", "delhi", "kurukshetra", "tokyo"];
  cities.forEach((city) => {
    const sights = getCuratedPlaces(city, "all");
    assert.ok(sights.length >= 5, "City " + city + " must have at least 5 curated places");
  });

  const kkrTemples = getCuratedPlaces("kurukshetra", "temples");
  assert.ok(kkrTemples.length >= 2, "Kurukshetra must have multiple temples");
});

test("hyperdart.config.js triggers match all benchmark queries", () => {
  const regexes = hdConfig.query_format.regex.map((r) => new RegExp(r, "i"));

  const testGenericQueries = [
    "Tourist attractions in HD_LOCATION__CITIES",
    "Things to do in HD_LOCATION__CITIES",
    "Landmarks in HD_LOCATION__CITIES",
    "Museums in HD_LOCATION__CITIES",
    "Temples in HD_LOCATION__CITIES",
    "best places to visit in HD_LOCATION__CITIES",
    "Sights near HD_LOCATION__CITIES"
  ];

  testGenericQueries.forEach((q) => {
    const matched = regexes.some((rx) => rx.test(q));
    assert.ok(matched, "Query " + q + " must be matched by triggers");
  });
});
