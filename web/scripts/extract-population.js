const fs = require('fs');
const path = require('path');

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

function extractPopulation() {
  const contentDir = path.resolve(__dirname, '..', '..', 'cities_towns_content');
  const dataPath = path.resolve(__dirname, '..', 'data', 'town-data.json');

  const townData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

  let found = 0;
  let missing = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const townName = file.replace(', Montana.md', '').replace('.md', '');
    const slug = slugify(townName);

    if (!townData[slug]) continue;

    // Match patterns: ~560, 3,591, Approximately 58,000, Around 60,000, ** 29,886
    const popMatch = content.match(/\*\*Population:\*\*\s*\*?\*?\s*(?:~|Approximately|Around|About)?\s*([\d,]+)/);
    if (popMatch) {
      const pop = parseInt(popMatch[1].replace(/,/g, ''), 10);
      townData[slug].population = pop;
      found++;
    } else {
      console.log(`No population found for ${townName}`);
      missing++;
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(townData, null, 2));
  console.log(`Population extracted: ${found} found, ${missing} missing`);
}

extractPopulation();
