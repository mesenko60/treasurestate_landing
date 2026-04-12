# Montana Railroad History — GeoJSON Mapping Reference

This document describes the geo-mapping dataset produced for the 18-article Montana Railroad History series. It is intended as a reference guide for a coding agent building an interactive map.

---

## Files in This Package

| File | Format | Contents |
| :--- | :--- | :--- |
| `montana_railroad_map.geojson` | GeoJSON (RFC 7946) | All 42 features: 33 Points + 9 LineStrings |
| `montana_railroad_locations.csv` | CSV | 33 Point features with lat/lon, metadata, article links |
| `montana_railroad_routes.csv` | CSV | 9 LineString routes with waypoints, railroad, status |

---

## GeoJSON Structure

The GeoJSON file is a standard `FeatureCollection`. Every feature carries a `properties` object with the following fields:

### Common Properties (all features)

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Unique slug identifier for the feature |
| `name` | string | Human-readable location or route name |
| `type` | string | `"point_of_interest"` or `"route"` |
| `subtype` | string | Detailed classification (see table below) |
| `article` | string | Full title of the linked article |
| `article_file` | string | Filename of the linked article (e.g. `bear-creek-coal-trains.md`) |
| `author_voice` | string | Author voice used for the article |
| `description` | string | 1-3 sentence narrative description for map popups |
| `marker_color` | string | Hex color code for map rendering (per article/theme) |

### Point-Only Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `year` | string | Year of primary historical significance |
| `county` | string | Montana county (or state for cross-border features) |

### Route-Only Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `railroad` | string | Full railroad company name |
| `status` | string | `active`, `active_as_bnsf`, `abandoned`, `abandoned_trail` |

---

## Feature Subtypes

| Subtype | Count | Description |
| :--- | :--- | :--- |
| `depot` | 9 | Historic or active railroad stations |
| `main_line` | 3 | Primary transcontinental route corridors |
| `railroad_town` | 3 | Towns platted or founded by railroads |
| `historic_site` | 4 | General sites of historical significance |
| `mine_disaster` | 2 | Sites of coal or hard rock mine disasters |
| `branch_line` | 2 | Secondary or industrial branch lines |
| `industrial_site` | 2 | Smelters and industrial facilities |
| `tunnel_portal` | 2 | Railroad tunnel portals |
| `disaster_site` | 1 | Train wreck site |
| `historic_ceremony` | 1 | Golden spike / completion ceremony site |
| `mountain_pass` | 1 | Continental Divide crossing |
| `monument` | 1 | Historic monument |
| `electrification_terminal` | 1 | End-of-electrification changeover point |
| `electrified_main_line` | 1 | Electrified railroad corridor |
| `historic_community` | 1 | Ethnic/immigrant community site |
| `indigenous_site` | 1 | Native American nation territory site |
| `abandonment_site` | 1 | Railroad abandonment marker point |
| `abandoned_right_of_way` | 1 | Abandoned railroad corridor |
| `historic_landing` | 1 | Missouri River steamboat landing |
| `passenger_main_line` | 1 | Active passenger rail corridor |
| `labor_history` | 1 | Labor strike / riot site |
| `historic_district` | 1 | Designated historic district |

---

## Color Coding by Theme

Each article cluster uses a consistent hex color for marker rendering:

| Color | Hex | Articles |
| :--- | :--- | :--- |
| Dark Red | `#8B0000` | Bear Creek Coal, Blackfeet Displacement, Butte Labor Riots |
| Navy Blue | `#1A3A5C` | Custer Creek Wreck, Marias Pass, Milwaukee Road Electrification |
| Gold | `#8B6914` | Gold Creek Ceremony, Chinese Workers, Fort Benton Steamboats |
| Purple | `#4A0080` | BA&P Railway, Copper Kings |
| Forest Green | `#2E5E1E` | Jawbone Railroad, Homestead Promoters, NP Towns |
| Saddle Brown | `#8B4513` | Milwaukee Road Electrification Route, St. Paul Pass Tunnel |
| Dark Green | `#1A5C2E` | Glacier Park, Empire Builder |
| Gray | `#555555` | Abandoned Milwaukee Road |

---

## Article-to-Feature Mapping

| Article File | Points | Routes | Key Locations |
| :--- | :--- | :--- | :--- |
| `bear-creek-coal-trains.md` | 2 | 1 | Smith Mine, Red Lodge Depot |
| `custer-creek-train-wreck.md` | 1 | 1 | Custer Creek Wreck Site |
| `gold-creek-golden-spike.md` | 1 | 1 | Gold Creek Completion Site |
| `butte-anaconda-pacific-railway.md` | 2 | 1 | Butte Terminus, Anaconda Smelter |
| `jawbone-railroad.md` | 2 | 1 | Harlowton, Lewistown |
| `marias-pass-great-northern.md` | 2 | 0 | Marias Pass Summit, Stevens Monument |
| `milwaukee-road-electrification.md` | 1 | 1 | Harlowton Electrification Terminal |
| `homestead-boom-railroad-promoters.md` | 2 | 0 | Billings NP Land Office, Livingston Depot |
| `chinese-railroad-workers.md` | 2 | 0 | Helena Chinatown, Missoula NP Division |
| `blackfeet-displacement-railroad.md` | 2 | 0 | Browning, Cut Bank |
| `glacier-park-great-northern.md` | 2 | 1 | East Glacier Station, Whitefish Station |
| `st-paul-pass-tunnel.md` | 2 | 0 | East Portal (MT), West Portal (ID) |
| `abandoned-milwaukee-road.md` | 1 | 1 | Harlowton Abandonment Point |
| `end-of-steamboat-era.md` | 2 | 0 | Fort Benton Levee, GN Depot |
| `empire-builder-passenger-train.md` | 1 | 1 | Whitefish Empire Builder Station |
| `butte-labor-riots-1914.md` | 2 | 0 | Miners Union Hall, Granite Mountain Mine |
| `northern-pacific-birth-of-towns.md` | 3 | 0 | Billings, Miles City, Glendive |
| `copper-kings-railroad-wars.md` | 3 | 0 | Butte Mine District, Anaconda, Great Falls |

---

## Route Status Values

| Status | Meaning |
| :--- | :--- |
| `active` | Currently operating railroad |
| `active_as_bnsf` | Former NP/GN line, now operated by BNSF Railway |
| `abandoned` | Tracks removed, right-of-way may be visible |
| `abandoned_trail` | Right-of-way converted to recreational trail |

---

## Suggested Coding Agent Usage

**Leaflet.js / Mapbox GL JS:**
Load `montana_railroad_map.geojson` directly. Use `feature.properties.type` to switch between Point (circle/icon markers) and LineString (polyline) rendering. Use `feature.properties.marker_color` for consistent color coding. Bind `feature.properties.description` and `feature.properties.article` to popup content.

**Python (GeoPandas / Folium):**
```python
import geopandas as gpd
gdf = gpd.read_file('montana_railroad_map.geojson')
points = gdf[gdf.geometry.type == 'Point']
routes = gdf[gdf.geometry.type == 'LineString']
```

**Filtering by article:**
```python
article_features = gdf[gdf['article_file'] == 'bear-creek-coal-trains.md']
```

**CSV for tabular tools (ArcGIS, QGIS, Google Maps import):**
Use `montana_railroad_locations.csv` for point import. Latitude column: `latitude`, Longitude column: `longitude`.
