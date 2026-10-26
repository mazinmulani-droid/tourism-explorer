/**
 * Weather service using Open-Meteo API (free, reliable, no key needed)
 */

export async function fetchSightseeingWeather(lat, lon) {
  if (lat == null || lon == null) return null;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const curr = data.current;

    const temp = Math.round(curr.temperature_2m);
    const feelsLike = Math.round(curr.apparent_temperature);
    const code = curr.weather_code;

    let icon = "☀️";
    let condition = "Sunny & Clear";
    let sightseeingAdvice = "Perfect for outdoor sights";

    if (code === 0) {
      icon = curr.is_day ? "☀️" : "🌙";
      condition = "Clear Sky";
      sightseeingAdvice = "Ideal for walking and photography";
    } else if (code <= 3) {
      icon = "⛅";
      condition = "Partly Cloudy";
      sightseeingAdvice = "Pleasant for outdoor exploration";
    } else if (code === 45 || code === 48) {
      icon = "🌫️";
      condition = "Misty / Fog";
      sightseeingAdvice = "Moderate visibility at viewpoints";
    } else if (code >= 51 && code <= 67) {
      icon = "🌧️";
      condition = "Rainy";
      sightseeingAdvice = "Great day for museums & indoor monuments";
    } else if (code >= 71 && code <= 77) {
      icon = "❄️";
      condition = "Snowy";
      sightseeingAdvice = "Cold weather; dress warmly for sights";
    } else if (code >= 80 && code <= 82) {
      icon = "🌦️";
      condition = "Passing Showers";
      sightseeingAdvice = "Carry an umbrella while exploring";
    } else if (code >= 95) {
      icon = "⛈️";
      condition = "Thunderstorm";
      sightseeingAdvice = "Best to visit indoor museums";
    }

    return {
      temp,
      feelsLike,
      condition,
      icon,
      sightseeingAdvice
    };
  } catch (err) {
    console.warn("Weather fetch failed (silent fallback):", err);
    return null;
  }
}
