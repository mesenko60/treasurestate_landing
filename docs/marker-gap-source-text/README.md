# Marker gap source text

Plain-text exports of **inscription and metadata** for curated markers that do **not** yet have a companion article under `articles_information/markers/`. Each file is named `<slug>.txt` and matches a row in [`marker-companion-gaps.md`](../marker-companion-gaps.md).

Source data: `web/data/historic-markers.json` (built from the Montana historic markers CSV).

**Regenerate** after updating the gaps list or marker data:

```bash
cd web && npm run markers:gaps && npm run markers:export-gap-sources
```
