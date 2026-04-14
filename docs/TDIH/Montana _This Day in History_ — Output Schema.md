# Montana "This Day in History" — Output Schema

## Card Format (per day)

Each day produces one JSON object with the following fields:

```json
{
  "id": "0113",
  "month": 1,
  "day": 13,
  "date_display": "January 13",
  "headline": "The Marias Massacre, 1870",
  "year": 1870,
  "body": "On January 23, 1870, U.S. Army troops under Major Eugene Baker attacked a Piegan Blackfeet encampment on the Marias River in northern Montana Territory...",
  "category": "native_history",
  "location": "Marias River, Chouteau County",
  "latitude": 48.0,
  "longitude": -110.5,
  "tags": ["Blackfeet", "U.S. Army", "massacre", "Marias River", "1870"],
  "expandable": true,
  "sources": ["Wikipedia: Marias Massacre", "Montana Historical Society"],
  "related_article": null
}
```

## Field Definitions

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Zero-padded MMDD, e.g. `"0113"` for January 13 |
| `month` | integer | Month number 1–12 |
| `day` | integer | Day number 1–31 |
| `date_display` | string | Human-readable date, e.g. `"January 13"` |
| `headline` | string | Event title with year, e.g. `"The Marias Massacre, 1870"` |
| `year` | integer | Year of the primary event (null if multiple years) |
| `body` | string | 150–300 word narrative card text |
| `category` | string | One of the category slugs below |
| `location` | string | City, county, or region name |
| `latitude` | float or null | Decimal degrees latitude of primary location |
| `longitude` | float or null | Decimal degrees longitude of primary location |
| `tags` | array of strings | 3–6 keyword tags for filtering/search |
| `expandable` | boolean | true = strong candidate for full article expansion |
| `sources` | array of strings | Source references used |
| `related_article` | string or null | Filename of related railroad/marker article if applicable |

## Category Slugs

| Slug | Description |
| :--- | :--- |
| `native_history` | Native American nations, treaties, battles, culture |
| `military` | Battles, wars, forts, veterans |
| `railroad` | Railroad construction, disasters, milestones |
| `mining` | Gold strikes, disasters, labor, copper kings |
| `statehood` | Territorial and state government, elections, laws |
| `exploration` | Lewis & Clark, fur trade, early explorers |
| `natural_disaster` | Floods, fires, earthquakes, weather records |
| `weather` | Temperature records, storms, drought |
| `wildlife_nature` | Parks, forests, conservation, wildlife |
| `crime_outlaws` | Vigilantes, outlaws, famous crimes |
| `sports` | Athletes, events, records |
| `notable_birth` | Birthday of a notable Montanan |
| `notable_death` | Death of a notable Montanan |
| `arts_culture` | Writers, artists, musicians, film |
| `agriculture` | Homesteading, farming, ranching |
| `labor` | Unions, strikes, worker history |
| `science_medicine` | Discoveries, records, public health |
| `infrastructure` | Dams, highways, bridges, public works |

## Master Output Files

| File | Format | Contents |
| :--- | :--- | :--- |
| `montana_tdih.json` | JSON array | All 365 card objects, sorted by `id` |
| `montana_tdih.csv` | CSV | All fields except `tags` and `sources` (flattened) |
| `montana_tdih_full.md` | Markdown | All 365 cards formatted for human reading |
| `cards/MMDD.json` | JSON | Individual card file per day |
