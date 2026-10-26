import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Grid,
  Stack,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Alert
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  Place as PlaceIcon,
  Museum as MuseumIcon,
  AccountBalance as HistoricIcon,
  Park as ParkIcon,
  Visibility as ViewpointIcon,
  TempleHindu as TempleIcon,
  Star as StarIcon,
  CalendarMonth as CalendarIcon,
  Map as MapIcon,
  ViewList as ListIcon,
  DirectionsWalk as WalkIcon,
  OpenInNew as OpenInNewIcon,
  Close as CloseIcon,
  SearchOff as SearchOffIcon,
  Navigation as NavigationIcon,
  Layers as LayersIcon,
  Radar as RadarIcon
} from "@mui/icons-material";

import { CATEGORIES, parseSearchData, calculateDistanceKm } from "../utils/queryParser";
import { fetchSightseeingWeather } from "../services/weatherService";
import { getCuratedPlaces } from "../backend/curatedPlaces";

export default function TourismExplorer(props) {
  // Sync theme with hyperDart props.theme or system preference
  const isDark = Boolean(
    props.theme?.mode === "dark" ||
    props.theme === "dark" ||
    props.theme?.palette?.mode === "dark" ||
    (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches && !props.theme)
  );

  const explorerTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light"
        }
      }),
    [isDark]
  );

  // Parse location and parameters from searchData prop (supports Array and Object formats)
  const searchInfo = useMemo(() => {
    return parseSearchData(props.searchData) || {
      city: "New York City",
      country: "United States",
      lat: 40.7128,
      lon: -74.006,
      suggestedPlace: "sidebar",
      initialCategory: "all",
      query: "Tourist attractions in NYC"
    };
  }, [props.searchData]);

  // View state
  const isSidebar = (props.format || searchInfo.suggestedPlace) === "sidebar";
  const [selectedCategory, setSelectedCategory] = useState(searchInfo.initialCategory || "all");
  const [viewTab, setViewTab] = useState(0); // 0: Sights, 1: Day Plan, 2: Map
  const [mapSubMode, setMapSubMode] = useState("street"); // "street" | "radar"
  const [places, setPlaces] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("curated");
  const [activePlace, setActivePlace] = useState(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);

  // Sync category when query intent changes
  useEffect(() => {
    if (searchInfo.initialCategory) {
      setSelectedCategory(searchInfo.initialCategory);
    }
  }, [searchInfo.initialCategory]);

  // Fetch weather and attractions
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadData() {
      // 1. Fetch live weather (no API key needed)
      fetchSightseeingWeather(searchInfo.lat, searchInfo.lon).then((w) => {
        if (isMounted) setWeather(w);
      });

      // 2. Resolve backend URL
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? props.deployedBackendURL || ""
          : import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";

      let fetchedPlaces = [];
      let source = "curated";

      try {
        const queryParams = new URLSearchParams({
          lat: searchInfo.lat != null ? searchInfo.lat : "",
          lon: searchInfo.lon != null ? searchInfo.lon : "",
          city: searchInfo.city || "",
          category: selectedCategory || "all"
        });

        const res = await fetch(`${apiUrl}/api/attractions?${queryParams.toString()}`, {
          signal: AbortSignal.timeout(3000)
        });

        if (res.ok) {
          const json = await res.json();
          if (json.places && json.places.length > 0) {
            fetchedPlaces = json.places;
            source = json.source || "geoapify";
          }
        }
      } catch (err) {
        // Backend offline or timeout -> use client fallback
      }

      if (fetchedPlaces.length === 0) {
        fetchedPlaces = getCuratedPlaces(searchInfo.city, selectedCategory);
        source = "curated";
      }

      // Compute distances from user location or city center
      const enriched = fetchedPlaces.map((p) => {
        const dist =
          calculateDistanceKm(searchInfo.userLat, searchInfo.userLon, p.lat, p.lon) ||
          calculateDistanceKm(searchInfo.lat, searchInfo.lon, p.lat, p.lon);
        return {
          ...p,
          distanceText: dist ? `${dist} away` : null
        };
      });

      if (isMounted) {
        setPlaces(enriched);
        setDataSource(source);
        setLoading(false);

        if (props.messageHandlers?.componentLoaded) {
          props.messageHandlers.componentLoaded();
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [searchInfo.city, searchInfo.lat, searchInfo.lon, selectedCategory, props.deployedBackendURL]);

  // Group places for the 1-Day Itinerary
  const itinerary = useMemo(() => {
    const morning = places.filter((p) => p.timeOfDay === "morning");
    const afternoon = places.filter((p) => p.timeOfDay === "afternoon");
    const evening = places.filter((p) => p.timeOfDay === "evening");

    return [
      { slot: "Morning (9:00 AM – 1:00 PM)", icon: "🌅", items: morning.length ? morning : places.slice(0, 2) },
      { slot: "Afternoon (1:30 PM – 5:00 PM)", icon: "☀️", items: afternoon.length ? afternoon : places.slice(2, 4) },
      { slot: "Evening & Sunset (5:30 PM – 8:30 PM)", icon: "🌇", items: evening.length ? evening : places.slice(4, 6) }
    ].filter((s) => s.items.length > 0);
  }, [places]);

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case "museums":
        return <MuseumIcon fontSize="small" />;
      case "historic":
        return <HistoricIcon fontSize="small" />;
      case "temples":
        return <TempleIcon fontSize="small" />;
      case "nature":
        return <ParkIcon fontSize="small" />;
      case "viewpoints":
        return <ViewpointIcon fontSize="small" />;
      default:
        return <PlaceIcon fontSize="small" />;
    }
  };

  return (
    <ThemeProvider theme={explorerTheme}>
      <Box
        sx={{
          width: "100%",
          maxWidth: isSidebar ? 420 : 960,
          margin: "0 auto",
          p: { xs: 1.5, sm: 2.5 },
          bgcolor: isDark ? "#121418" : "#fcfdfe",
          color: isDark ? "#f0f3f6" : "#1a1d20",
          borderRadius: 3,
          boxShadow: isDark
            ? "0 4px 20px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
          fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        }}
      >
        {/* Header bar */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    bgcolor: isDark ? "#2563eb" : "#3b82f6",
                    color: "#fff",
                    p: 0.6,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <PlaceIcon fontSize="small" />
                </Box>
                <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: "-0.02em" }}>
                  {searchInfo.city}
                </Typography>
              </Stack>
              {searchInfo.country && (
                <Typography variant="caption" sx={{ color: isDark ? "#94a3b8" : "#64748b", ml: 4, display: "block" }}>
                  {searchInfo.state ? `${searchInfo.state}, ` : ""}
                  {searchInfo.country}
                </Typography>
              )}
            </Box>

            {/* Sightseeing Weather Badge */}
            {weather && (
              <Tooltip title={weather.sightseeingAdvice} arrow>
                <Paper
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: 1.2,
                    py: 0.6,
                    borderRadius: 2,
                    bgcolor: isDark ? "rgba(30, 41, 59, 0.7)" : "#f1f5f9",
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    cursor: "help"
                  }}
                >
                  <Typography variant="body1">{weather.icon}</Typography>
                  <Box>
                    <Typography variant="caption" fontWeight={700} display="block" lineHeight={1.1}>
                      {weather.temp}°C
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: "0.68rem", color: isDark ? "#94a3b8" : "#64748b" }}>
                      {weather.condition}
                    </Typography>
                  </Box>
                </Paper>
              </Tooltip>
            )}
          </Stack>
        </Box>

        {/* Category Filter Chips */}
        <Box
          sx={{
            display: "flex",
            gap: 0.8,
            overflowX: "auto",
            pb: 1,
            mb: 1.5,
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(0,0,0,0.15)", borderRadius: 2 }
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Chip
                key={cat.id}
                label={`${cat.icon} ${cat.label}`}
                size="small"
                clickable
                onClick={() => setSelectedCategory(cat.id)}
                sx={{
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.78rem",
                  bgcolor: isSelected
                    ? isDark
                      ? "#3b82f6"
                      : "#2563eb"
                    : isDark
                    ? "#1e293b"
                    : "#f1f5f9",
                  color: isSelected ? "#fff" : isDark ? "#cbd5e1" : "#475569",
                  border: `1px solid ${isSelected ? "transparent" : isDark ? "#334155" : "#e2e8f0"}`,
                  "&:hover": {
                    bgcolor: isSelected ? (isDark ? "#2563eb" : "#1d4ed8") : isDark ? "#334155" : "#e2e8f0"
                  }
                }}
              />
            );
          })}
        </Box>

        {/* View Switcher: Sights / 1-Day Plan / Map */}
        <Tabs
          value={viewTab}
          onChange={(e, val) => setViewTab(val)}
          variant="fullWidth"
          sx={{
            mb: 2,
            minHeight: 36,
            bgcolor: isDark ? "#1a2230" : "#f1f5f9",
            borderRadius: 2,
            p: 0.3,
            "& .MuiTabs-indicator": {
              bgcolor: isDark ? "#3b82f6" : "#2563eb",
              height: "100%",
              borderRadius: 1.8,
              zIndex: 1
            },
            "& .MuiTab-root": {
              minHeight: 32,
              py: 0.5,
              fontSize: "0.76rem",
              fontWeight: 600,
              textTransform: "none",
              zIndex: 2,
              color: isDark ? "#94a3b8" : "#64748b",
              "&.Mui-selected": { color: "#fff" }
            }
          }}
        >
          <Tab icon={<ListIcon sx={{ fontSize: "1rem !important" }} />} iconPosition="start" label="Top Sights" />
          <Tab icon={<CalendarIcon sx={{ fontSize: "1rem !important" }} />} iconPosition="start" label="1-Day Plan" />
          <Tab icon={<MapIcon sx={{ fontSize: "1rem !important" }} />} iconPosition="start" label="Map View" />
        </Tabs>

        {/* Loading indicator */}
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6 }}>
            <CircularProgress size={32} thickness={4} />
            <Typography variant="caption" sx={{ mt: 1.5, color: isDark ? "#94a3b8" : "#64748b" }}>
              Finding best places in {searchInfo.city}...
            </Typography>
          </Box>
        ) : places.length === 0 ? (
          /* Empty state */
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              px: 2,
              bgcolor: isDark ? "#1a2230" : "#f8fafc",
              borderRadius: 2.5,
              border: `1px dashed ${isDark ? "#334155" : "#cbd5e1"}`
            }}
          >
            <SearchOffIcon sx={{ fontSize: 40, color: isDark ? "#64748b" : "#94a3b8", mb: 1 }} />
            <Typography variant="subtitle2" fontWeight={600}>
              No matching attractions found
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? "#94a3b8" : "#64748b", display: "block", mb: 2 }}>
              Try selecting a broader category like &quot;All Sights&quot;.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedCategory("all")}
              sx={{ textTransform: "none", fontSize: "0.78rem" }}
            >
              Show All Sights
            </Button>
          </Box>
        ) : (
          <>
            {/* TAB 0: SIGHTS CARD LIST */}
            {viewTab === 0 && (
              <Grid container spacing={1.5}>
                {places.map((place, idx) => {
                  return (
                    <Grid item xs={12} sm={isSidebar ? 12 : 6} key={place.id || idx}>
                      <Card
                        elevation={0}
                        onClick={() => setActivePlace(place)}
                        onMouseEnter={() => setHoveredPlaceId(place.id)}
                        onMouseLeave={() => setHoveredPlaceId(null)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          bgcolor: isDark ? "#18202c" : "#ffffff",
                          border: `1px solid ${
                            hoveredPlaceId === place.id
                              ? isDark
                                ? "#3b82f6"
                                : "#2563eb"
                              : isDark
                              ? "#2a3749"
                              : "#e2e8f0"
                          }`,
                          borderRadius: 2.5,
                          transition: "all 0.18s ease-in-out",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: isDark
                              ? "0 6px 20px rgba(0,0,0,0.4)"
                              : "0 6px 16px rgba(0,0,0,0.06)"
                          }
                        }}
                      >
                        {/* Image Thumbnail */}
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            height={isSidebar ? 120 : 140}
                            image={place.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80"}
                            alt={place.name}
                            sx={{ objectFit: "cover" }}
                          />
                          {/* Number badge */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              bgcolor: "rgba(15, 23, 42, 0.85)",
                              color: "#fff",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              px: 0.9,
                              py: 0.2,
                              borderRadius: 1.5,
                              backdropFilter: "blur(4px)"
                            }}
                          >
                            #{idx + 1}
                          </Box>

                          {/* Rating pill */}
                          {place.rating && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                                bgcolor: "rgba(15, 23, 42, 0.85)",
                                color: "#fbbf24",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                px: 0.8,
                                py: 0.2,
                                borderRadius: 1.5,
                                backdropFilter: "blur(4px)"
                              }}
                            >
                              <StarIcon sx={{ fontSize: "0.85rem" }} />
                              <Typography variant="caption" sx={{ color: "#fff", fontWeight: 700 }}>
                                {place.rating}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Content */}
                        <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={0.6} sx={{ mb: 0.5 }}>
                            <Chip
                              icon={getCategoryIcon(place.category)}
                              label={place.categoryLabel || "Attraction"}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 600,
                                bgcolor: isDark ? "#1e293b" : "#f1f5f9",
                                color: isDark ? "#93c5fd" : "#1d4ed8"
                              }}
                            />
                            {place.distanceText && (
                              <Typography variant="caption" sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: "0.68rem" }}>
                                • {place.distanceText}
                              </Typography>
                            )}
                          </Stack>

                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            sx={{
                              lineHeight: 1.25,
                              mb: 0.6,
                              color: isDark ? "#f1f5f9" : "#0f172a",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}
                          >
                            {place.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color: isDark ? "#94a3b8" : "#64748b",
                              lineHeight: 1.35,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}
                          >
                            {place.description}
                          </Typography>
                        </CardContent>

                        {/* Footer Actions */}
                        <CardActions sx={{ px: 1.5, py: 1, pt: 0, justifyContent: "space-between" }}>
                          <Typography variant="caption" sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: "0.68rem" }}>
                            ⏱️ {place.recommendedDuration || "1.5-2 hrs"}
                          </Typography>
                          <Button
                            size="small"
                            endIcon={<OpenInNewIcon sx={{ fontSize: "0.8rem !important" }} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              const gmaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + searchInfo.city)}`;
                              window.open(gmaps, "_blank");
                            }}
                            sx={{
                              textTransform: "none",
                              fontSize: "0.72rem",
                              py: 0.2,
                              px: 1,
                              color: isDark ? "#60a5fa" : "#2563eb"
                            }}
                          >
                            Directions
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {/* TAB 1: 1-DAY PLAN ITINERARY */}
            {viewTab === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Alert
                  severity="info"
                  icon={<CalendarIcon fontSize="inherit" />}
                  sx={{
                    py: 0.5,
                    px: 1.5,
                    fontSize: "0.75rem",
                    bgcolor: isDark ? "#1e293b" : "#eff6ff",
                    color: isDark ? "#cbd5e1" : "#1e40af",
                    "& .MuiAlert-icon": { color: isDark ? "#60a5fa" : "#3b82f6" }
                  }}
                >
                  Suggested sequential tour of top sights optimized for {searchInfo.city}.
                </Alert>

                {itinerary.map((slot, sIdx) => (
                  <Paper
                    key={sIdx}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor: isDark ? "#18202c" : "#ffffff",
                      border: `1px solid ${isDark ? "#2a3749" : "#e2e8f0"}`
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: isDark ? "#60a5fa" : "#2563eb" }}>
                      {slot.icon} {slot.slot}
                    </Typography>

                    <Stack spacing={1}>
                      {slot.items.map((place, pIdx) => (
                        <Box
                          key={place.id || pIdx}
                          onClick={() => setActivePlace(place)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            p: 1,
                            borderRadius: 2,
                            bgcolor: isDark ? "#121820" : "#f8fafc",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            "&:hover": {
                              bgcolor: isDark ? "#1e293b" : "#f1f5f9"
                            }
                          }}
                        >
                          <Box
                            component="img"
                            src={place.image}
                            alt={place.name}
                            sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: "cover" }}
                          />
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
                              {place.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                              {place.categoryLabel} • {place.recommendedDuration || "1.5 hrs"}
                            </Typography>
                          </Box>
                          <WalkIcon sx={{ fontSize: "1rem", color: isDark ? "#64748b" : "#94a3b8" }} />
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                ))}
              </Box>
            )}

            {/* TAB 2: INTERACTIVE MAP VIEW (REAL STREET MAP + RADAR PINBOARD) */}
            {viewTab === 2 && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: isDark ? "#18202c" : "#ffffff",
                  border: `1px solid ${isDark ? "#2a3749" : "#e2e8f0"}`
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {mapSubMode === "street" ? "Live Interactive Street Map" : "Sightseeing Radar Pinboard"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? "#94a3b8" : "#64748b", display: "block" }}>
                      {mapSubMode === "street"
                        ? "Real street-level cartography centered at destination"
                        : "Click any numbered pin to preview and explore directions"}
                    </Typography>
                  </Box>

                  {/* Toggle between Real Map and Radar */}
                  <Stack direction="row" spacing={0.5}>
                    <Chip
                      icon={<LayersIcon sx={{ fontSize: "0.85rem !important" }} />}
                      label="Street"
                      size="small"
                      clickable
                      onClick={() => setMapSubMode("street")}
                      sx={{
                        fontSize: "0.7rem",
                        height: 24,
                        bgcolor: mapSubMode === "street" ? (isDark ? "#3b82f6" : "#2563eb") : "transparent",
                        color: mapSubMode === "street" ? "#fff" : isDark ? "#94a3b8" : "#64748b",
                        border: `1px solid ${mapSubMode === "street" ? "transparent" : isDark ? "#334155" : "#cbd5e1"}`
                      }}
                    />
                    <Chip
                      icon={<RadarIcon sx={{ fontSize: "0.85rem !important" }} />}
                      label="Radar"
                      size="small"
                      clickable
                      onClick={() => setMapSubMode("radar")}
                      sx={{
                        fontSize: "0.7rem",
                        height: 24,
                        bgcolor: mapSubMode === "radar" ? (isDark ? "#3b82f6" : "#2563eb") : "transparent",
                        color: mapSubMode === "radar" ? "#fff" : isDark ? "#94a3b8" : "#64748b",
                        border: `1px solid ${mapSubMode === "radar" ? "transparent" : isDark ? "#334155" : "#cbd5e1"}`
                      }}
                    />
                  </Stack>
                </Stack>

                {/* SUBMODE 1: REAL OPENSTREETMAP EMBED */}
                {mapSubMode === "street" ? (
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: isSidebar ? 220 : 280,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: `1px solid ${isDark ? "#1e293b" : "#cbd5e1"}`
                    }}
                  >
                    {searchInfo.lat != null && searchInfo.lon != null ? (
                      <Box
                        component="iframe"
                        title="Destination Map"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${searchInfo.lon - 0.05}%2C${searchInfo.lat - 0.04}%2C${searchInfo.lon + 0.05}%2C${searchInfo.lat + 0.04}&layer=mapnik&marker=${searchInfo.lat}%2C${searchInfo.lon}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          filter: isDark ? "invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%)" : "none"
                        }}
                      />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Typography variant="caption">Location coordinates unavailable</Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  /* SUBMODE 2: INTERACTIVE SPATIAL RADAR PINBOARD */
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: isSidebar ? 220 : 280,
                      bgcolor: isDark ? "#0f172a" : "#e2e8f0",
                      borderRadius: 2,
                      overflow: "hidden",
                      border: `1px solid ${isDark ? "#1e293b" : "#cbd5e1"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        width: "80%",
                        height: "80%",
                        borderRadius: "50%",
                        border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        width: "50%",
                        height: "50%",
                        borderRadius: "50%",
                        border: `1px dashed ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`
                      }}
                    />

                    {/* City Center Marker */}
                    <Box
                      sx={{
                        position: "absolute",
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "#ef4444",
                          boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)"
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          color: isDark ? "#f87171" : "#dc2626",
                          bgcolor: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.8)",
                          px: 0.5,
                          borderRadius: 1,
                          mt: 0.2
                        }}
                      >
                        Center
                      </Typography>
                    </Box>

                    {/* Plot Pins relatively */}
                    {places.map((place, idx) => {
                      const angle = (idx / places.length) * 2 * Math.PI - Math.PI / 2;
                      const radiusFactor = 0.25 + (idx % 3) * 0.12;
                      const leftPercent = 50 + Math.cos(angle) * (radiusFactor * 100);
                      const topPercent = 50 + Math.sin(angle) * (radiusFactor * 100);

                      return (
                        <Tooltip key={place.id || idx} title={`#${idx + 1}: ${place.name}`} arrow>
                          <Box
                            onClick={() => setActivePlace(place)}
                            sx={{
                              position: "absolute",
                              left: `${leftPercent}%`,
                              top: `${topPercent}%`,
                              transform: "translate(-50%, -50%)",
                              zIndex: 3,
                              cursor: "pointer",
                              bgcolor: isDark ? "#3b82f6" : "#2563eb",
                              color: "#fff",
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                              border: "2px solid #ffffff",
                              transition: "transform 0.15s ease",
                              "&:hover": {
                                transform: "translate(-50%, -50%) scale(1.25)",
                                bgcolor: "#f59e0b"
                              }
                            }}
                          >
                            {idx + 1}
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </Box>
                )}

                {/* Pin list below map */}
                <Box sx={{ mt: 1.5, maxHeight: 150, overflowY: "auto" }}>
                  <Stack spacing={0.6}>
                    {places.map((place, idx) => (
                      <Stack
                        key={place.id || idx}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        onClick={() => setActivePlace(place)}
                        sx={{
                          p: 0.6,
                          borderRadius: 1.5,
                          cursor: "pointer",
                          "&:hover": { bgcolor: isDark ? "#1e293b" : "#f1f5f9" }
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            bgcolor: isDark ? "#3b82f6" : "#2563eb",
                            color: "#fff",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          {idx + 1}
                        </Box>
                        <Typography variant="caption" fontWeight={600} noWrap sx={{ flexGrow: 1 }}>
                          {place.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: "0.68rem" }}>
                          {place.distanceText}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            )}
          </>
        )}

        {/* Place Detail Dialog / Modal */}
        {activePlace && (
          <Dialog
            open={Boolean(activePlace)}
            onClose={() => setActivePlace(null)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: isDark ? "#18202c" : "#ffffff",
                color: isDark ? "#f1f5f9" : "#0f172a",
                borderRadius: 3,
                overflow: "hidden"
              }
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={activePlace.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80"}
                alt={activePlace.name}
                sx={{ width: "100%", height: 180, objectFit: "cover" }}
              />
              <IconButton
                size="small"
                onClick={() => setActivePlace(null)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <DialogTitle sx={{ pb: 1, pt: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Chip
                  label={activePlace.categoryLabel}
                  size="small"
                  sx={{
                    bgcolor: isDark ? "#1e293b" : "#eff6ff",
                    color: isDark ? "#60a5fa" : "#2563eb",
                    fontWeight: 600,
                    fontSize: "0.7rem"
                  }}
                />
                {activePlace.rating && (
                  <Stack direction="row" alignItems="center" spacing={0.3}>
                    <StarIcon sx={{ fontSize: "1rem", color: "#fbbf24" }} />
                    <Typography variant="caption" fontWeight={700}>
                      {activePlace.rating}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.25 }}>
                {activePlace.name}
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ py: 1 }}>
              {activePlace.address && (
                <Stack direction="row" alignItems="flex-start" spacing={0.8} sx={{ mb: 1.5 }}>
                  <PlaceIcon sx={{ fontSize: "1.1rem", color: isDark ? "#64748b" : "#94a3b8", mt: 0.2 }} />
                  <Typography variant="caption" sx={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                    {activePlace.address}
                  </Typography>
                </Stack>
              )}

              <Typography variant="body2" sx={{ lineHeight: 1.5, mb: 2 }}>
                {activePlace.description}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ p: 1.2, bgcolor: isDark ? "#121820" : "#f8fafc", borderRadius: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: isDark ? "#94a3b8" : "#64748b", display: "block" }}>
                    Suggested Duration
                  </Typography>
                  <Typography variant="caption" fontWeight={700}>
                    {activePlace.recommendedDuration || "1.5 – 2 hours"}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="caption" sx={{ color: isDark ? "#94a3b8" : "#64748b", display: "block" }}>
                    Best Time
                  </Typography>
                  <Typography variant="caption" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                    {activePlace.timeOfDay || "Morning / Afternoon"}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<NavigationIcon />}
                onClick={() => {
                  const gmaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.name + " " + searchInfo.city)}`;
                  window.open(gmaps, "_blank");
                }}
                sx={{
                  bgcolor: isDark ? "#2563eb" : "#3b82f6",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Get Directions on Map
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </ThemeProvider>
  );
}
