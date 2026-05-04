# Terrain pipeline (follow-up)

This directory is reserved for **Montana DEM → raster-dem / PMTiles** tooling (LiDAR sources, GDAL/Tippecanoe-style tooling, Cloudflare R2 or static CDN uploads).

The production site’s **Montana map** (`/map/`) currently uses Mapbox **terrain-rgb** (`mapbox://mapbox.terrain-rgb`) for optional 3D terrain — no custom tiles are required for that MVP.

When custom terrain ships:

1. Document download URLs and CRS for source DEMs (state/USGS feeds).
2. Add scripts here + a short runbook (RAM/disk, tile bounds, upload target).
3. Wire `NEXT_PUBLIC_TERRAIN_TILES_URL` (or equivalent) in `web/.env.example` once the client protocol is implemented.
