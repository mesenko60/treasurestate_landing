const fs = require('fs');
const path = require('path');

const CURATED_SITES = [
  // === NATIONAL PARKS (use nearest major entrance) ===
  { name: 'Glacier National Park (West Glacier)', type: 'National Park', lat: 48.4957, lng: -113.9810 },
  { name: 'Glacier National Park (East Glacier)', type: 'National Park', lat: 48.4472, lng: -113.2250 },
  { name: 'Yellowstone National Park (West Entrance)', type: 'National Park', lat: 44.6571, lng: -111.0937 },
  { name: 'Yellowstone National Park (North Entrance)', type: 'National Park', lat: 45.0283, lng: -110.7043 },

  // === NATIONAL FORESTS (use ranger district offices / main access) ===
  { name: 'Flathead National Forest', type: 'National Forest', lat: 48.2300, lng: -114.0100 },
  { name: 'Gallatin National Forest', type: 'National Forest', lat: 45.5500, lng: -111.0500 },
  { name: 'Helena-Lewis & Clark NF', type: 'National Forest', lat: 46.7000, lng: -112.0000 },
  { name: 'Lolo National Forest', type: 'National Forest', lat: 46.9500, lng: -114.1000 },
  { name: 'Bitterroot National Forest', type: 'National Forest', lat: 46.2500, lng: -114.1000 },
  { name: 'Kootenai National Forest', type: 'National Forest', lat: 48.2200, lng: -115.5500 },
  { name: 'Custer-Gallatin NF', type: 'National Forest', lat: 45.5000, lng: -109.5000 },
  { name: 'Beaverhead-Deerlodge NF', type: 'National Forest', lat: 45.8000, lng: -113.0000 },

  // === WILDERNESS AREAS (use nearest primary trailhead / access point) ===
  { name: 'Bob Marshall Wilderness', type: 'Wilderness', lat: 47.3600, lng: -113.1000 },
  { name: 'Absaroka-Beartooth Wilderness', type: 'Wilderness', lat: 45.1700, lng: -109.5500 },
  { name: 'Scapegoat Wilderness', type: 'Wilderness', lat: 47.0600, lng: -112.8000 },
  { name: 'Selway-Bitterroot Wilderness', type: 'Wilderness', lat: 46.3800, lng: -114.2500 },
  { name: 'Rattlesnake Wilderness', type: 'Wilderness', lat: 46.9350, lng: -113.9500 },
  { name: 'Lee Metcalf Wilderness (Spanish Peaks)', type: 'Wilderness', lat: 45.4200, lng: -111.3500 },
  { name: 'Lee Metcalf Wilderness (Madison Range)', type: 'Wilderness', lat: 45.2100, lng: -111.4000 },
  { name: 'Mission Mountains Wilderness', type: 'Wilderness', lat: 47.3200, lng: -113.8500 },
  { name: 'Great Bear Wilderness', type: 'Wilderness', lat: 47.8500, lng: -113.3000 },
  { name: 'Anaconda-Pintler Wilderness', type: 'Wilderness', lat: 46.0500, lng: -113.1500 },
  { name: 'Cabinet Mountains Wilderness', type: 'Wilderness', lat: 47.9700, lng: -115.6000 },
  { name: 'Welcome Creek Wilderness', type: 'Wilderness', lat: 46.6800, lng: -113.5500 },
  { name: 'Gates of the Mountains Wilderness', type: 'Wilderness', lat: 46.8500, lng: -111.8500 },

  // === STATE PARKS ===
  { name: 'Makoshika State Park', type: 'State Park', lat: 47.0900, lng: -104.6881 },
  { name: 'Lewis and Clark Caverns', type: 'State Park', lat: 45.8333, lng: -111.8667 },
  { name: 'Giant Springs State Park', type: 'State Park', lat: 47.5189, lng: -111.2153 },
  { name: 'Bannack State Park', type: 'State Park', lat: 45.1611, lng: -112.9986 },
  { name: 'Pictograph Cave State Park', type: 'State Park', lat: 45.7339, lng: -108.4742 },
  { name: 'Travelers Rest State Park', type: 'State Park', lat: 46.7389, lng: -114.0897 },
  { name: 'First Peoples Buffalo Jump', type: 'State Park', lat: 47.4700, lng: -111.0600 },
  { name: 'Missouri Headwaters State Park', type: 'State Park', lat: 45.9300, lng: -111.5000 },
  { name: 'Flathead Lake State Park', type: 'State Park', lat: 47.8500, lng: -114.2000 },
  { name: 'Wild Horse Island State Park', type: 'State Park', lat: 47.7833, lng: -114.2167 },
  { name: 'Whitefish Lake State Park', type: 'State Park', lat: 48.4200, lng: -114.3700 },
  { name: 'Tongue River Reservoir SP', type: 'State Park', lat: 45.1833, lng: -106.5833 },
  { name: 'Medicine Rocks State Park', type: 'State Park', lat: 46.6200, lng: -104.4700 },
  { name: 'Rosebud Battlefield SP', type: 'State Park', lat: 45.4700, lng: -106.9700 },
  { name: 'Chief Plenty Coups SP', type: 'State Park', lat: 45.2911, lng: -107.4611 },
  { name: 'Pirogue Island State Park', type: 'State Park', lat: 46.3833, lng: -105.7833 },
  { name: 'Cooney State Park', type: 'State Park', lat: 45.5600, lng: -109.1600 },
  { name: 'Spring Meadow Lake SP', type: 'State Park', lat: 46.6000, lng: -112.0700 },
  { name: 'Painted Rocks State Park', type: 'State Park', lat: 45.8500, lng: -114.1500 },
  { name: 'Salmon Lake State Park', type: 'State Park', lat: 47.1667, lng: -113.4000 },
  { name: 'Lake Elmo State Park', type: 'State Park', lat: 45.8000, lng: -108.4500 },
  { name: 'Wayfarers State Park', type: 'State Park', lat: 48.0833, lng: -114.0667 },
  { name: 'Thompson Falls State Park', type: 'State Park', lat: 47.5967, lng: -115.3400 },
  { name: 'Ackley Lake State Park', type: 'State Park', lat: 47.0600, lng: -109.8900 },
  { name: 'Tower Rock State Park', type: 'State Park', lat: 47.3500, lng: -111.8833 },
  { name: 'Clark\'s Lookout State Park', type: 'State Park', lat: 45.1200, lng: -112.6300 },
  { name: 'Beavertail Hill State Park', type: 'State Park', lat: 46.6100, lng: -113.4400 },
  { name: 'Milltown State Park', type: 'State Park', lat: 46.8700, lng: -113.8600 },
  { name: 'Lone Pine State Park', type: 'State Park', lat: 48.1700, lng: -114.3600 },

  // === LAKES & RESERVOIRS ===
  { name: 'Flathead Lake', type: 'Lake', lat: 47.8833, lng: -114.1333 },
  { name: 'Fort Peck Lake', type: 'Lake', lat: 47.6000, lng: -106.9500 },
  { name: 'Canyon Ferry Lake', type: 'Lake', lat: 46.6500, lng: -111.7333 },
  { name: 'Hungry Horse Reservoir', type: 'Lake', lat: 48.3000, lng: -113.7833 },
  { name: 'Whitefish Lake', type: 'Lake', lat: 48.4200, lng: -114.3700 },
  { name: 'Seeley Lake', type: 'Lake', lat: 47.1800, lng: -113.4800 },
  { name: 'Hauser Lake', type: 'Lake', lat: 46.6700, lng: -111.8300 },
  { name: 'Holter Lake', type: 'Lake', lat: 46.8200, lng: -111.8200 },
  { name: 'Georgetown Lake', type: 'Lake', lat: 46.2167, lng: -113.2667 },
  { name: 'Hebgen Lake', type: 'Lake', lat: 44.7700, lng: -111.3000 },
  { name: 'Fresno Reservoir', type: 'Lake', lat: 48.6200, lng: -109.6400 },
  { name: 'Nelson Reservoir', type: 'Lake', lat: 48.4900, lng: -107.5400 },
  { name: 'Lake Koocanusa', type: 'Lake', lat: 48.7500, lng: -115.3500 },
  { name: 'Noxon Reservoir', type: 'Lake', lat: 47.9600, lng: -115.7700 },
  { name: 'Holland Lake', type: 'Lake', lat: 47.4500, lng: -113.6000 },
  { name: 'Swan Lake', type: 'Lake', lat: 47.9300, lng: -113.8800 },
  { name: 'Echo Lake', type: 'Lake', lat: 48.0700, lng: -114.0400 },
  { name: 'Lake Mary Ronan', type: 'Lake', lat: 47.8900, lng: -114.3900 },
  { name: 'Tiber Reservoir', type: 'Lake', lat: 48.3000, lng: -111.1000 },
  { name: 'Deadmans Basin Reservoir', type: 'Lake', lat: 46.3200, lng: -109.4200 },
  { name: 'Lindbergh Lake', type: 'Lake', lat: 47.4000, lng: -113.6700 },
  { name: 'Lake Inez', type: 'Lake', lat: 47.2000, lng: -113.5200 },
  { name: 'Placid Lake', type: 'Lake', lat: 47.1500, lng: -113.5500 },
  { name: 'Lake Alva', type: 'Lake', lat: 47.2300, lng: -113.5600 },
  { name: 'Rainy Lake', type: 'Lake', lat: 47.2500, lng: -113.5400 },
  { name: 'Browns Lake', type: 'Lake', lat: 47.3100, lng: -113.5300 },
  { name: 'Clearwater Lake', type: 'Lake', lat: 47.2000, lng: -113.5000 },
  { name: 'Upsata Lake', type: 'Lake', lat: 47.0900, lng: -113.3600 },
  { name: 'Blanchard Lake', type: 'Lake', lat: 47.1000, lng: -113.5800 },
  { name: 'Ennis Lake', type: 'Lake', lat: 45.5200, lng: -111.7200 },
  { name: 'Wade Lake', type: 'Lake', lat: 44.8800, lng: -111.6400 },
  { name: 'Lake Como', type: 'Lake', lat: 46.0600, lng: -114.2200 },
  { name: 'Painted Rocks Reservoir', type: 'Lake', lat: 45.6800, lng: -114.3000 },
  { name: 'Elbow Lake', type: 'Lake', lat: 47.2600, lng: -113.5000 },
  { name: 'Big Salmon Lake', type: 'Lake', lat: 47.3500, lng: -113.2000 },
  { name: 'Cliff Lake', type: 'Lake', lat: 44.8200, lng: -111.5100 },
  { name: 'Dailey Lake', type: 'Lake', lat: 45.4800, lng: -110.7100 },
  { name: 'Hyalite Reservoir', type: 'Lake', lat: 45.5300, lng: -111.0400 },

  // === RIVERS (blue-ribbon fishing) ===
  { name: 'Missouri River (Great Falls)', type: 'River', lat: 47.5100, lng: -111.2800 },
  { name: 'Missouri River (Craig)', type: 'River', lat: 47.0600, lng: -112.0200 },
  { name: 'Madison River (Ennis)', type: 'River', lat: 45.3500, lng: -111.7300 },
  { name: 'Gallatin River', type: 'River', lat: 45.5000, lng: -111.1500 },
  { name: 'Yellowstone River (Livingston)', type: 'River', lat: 45.6600, lng: -110.5600 },
  { name: 'Yellowstone River (Columbus)', type: 'River', lat: 45.6300, lng: -109.2500 },
  { name: 'Bighorn River', type: 'River', lat: 45.8100, lng: -107.6500 },
  { name: 'Blackfoot River', type: 'River', lat: 46.9000, lng: -113.5000 },
  { name: 'Bitterroot River', type: 'River', lat: 46.4200, lng: -114.0700 },
  { name: 'Clark Fork River', type: 'River', lat: 46.8700, lng: -114.0000 },
  { name: 'Big Hole River', type: 'River', lat: 45.7200, lng: -113.2000 },
  { name: 'Beaverhead River', type: 'River', lat: 45.2200, lng: -112.6400 },
  { name: 'Jefferson River', type: 'River', lat: 45.8200, lng: -112.0500 },
  { name: 'Rock Creek', type: 'River', lat: 46.5500, lng: -113.5700 },
  { name: 'Smith River', type: 'River', lat: 46.9500, lng: -111.2000 },
  { name: 'Sun River', type: 'River', lat: 47.4500, lng: -111.9000 },
  { name: 'Kootenai River', type: 'River', lat: 48.3800, lng: -115.5500 },
  { name: 'Flathead River', type: 'River', lat: 48.0900, lng: -114.3100 },
  { name: 'Swan River', type: 'River', lat: 47.6500, lng: -113.7500 },
  { name: 'Tongue River', type: 'River', lat: 45.5800, lng: -106.6200 },
  { name: 'Musselshell River', type: 'River', lat: 46.5000, lng: -108.5000 },
  { name: 'Stillwater River', type: 'River', lat: 45.6500, lng: -109.5500 },
  { name: 'Boulder River', type: 'River', lat: 45.7000, lng: -110.0000 },

  // === HOT SPRINGS (Developed Resorts) ===
  { name: 'Chico Hot Springs', type: 'Hot Spring', lat: 45.3550, lng: -110.6210 },
  { name: 'Yellowstone Hot Springs', type: 'Hot Spring', lat: 45.1130, lng: -110.7850 },
  { name: 'Bozeman Hot Springs', type: 'Hot Spring', lat: 45.6330, lng: -111.1110 },
  { name: 'Norris Hot Springs', type: 'Hot Spring', lat: 45.5600, lng: -111.6900 },
  { name: 'Broadwater Hot Springs', type: 'Hot Spring', lat: 46.5950, lng: -112.0250 },
  { name: 'Quinn\'s Hot Springs', type: 'Hot Spring', lat: 47.2830, lng: -115.0630 },
  { name: 'Fairmont Hot Springs', type: 'Hot Spring', lat: 46.1400, lng: -112.7800 },
  { name: 'Lolo Hot Springs', type: 'Hot Spring', lat: 46.7300, lng: -114.5700 },
  { name: 'Jackson Hot Springs', type: 'Hot Spring', lat: 45.3700, lng: -113.4200 },
  { name: 'Elkhorn Hot Springs', type: 'Hot Spring', lat: 45.4700, lng: -113.1400 },
  { name: 'Symes Hot Springs', type: 'Hot Spring', lat: 47.6200, lng: -114.7700 },
  { name: 'Big Medicine Hot Springs', type: 'Hot Spring', lat: 47.6145, lng: -114.6658 },
  { name: 'Sleeping Buffalo Hot Springs', type: 'Hot Spring', lat: 48.5000, lng: -107.1000 },
  { name: 'Boulder Hot Springs', type: 'Hot Spring', lat: 46.2100, lng: -112.1200 },
  { name: 'Alameda Hot Springs', type: 'Hot Spring', lat: 47.6100, lng: -114.7500 },
  { name: 'Wild Horse Hot Springs', type: 'Hot Spring', lat: 47.6350, lng: -114.7900 },
  { name: 'Spa Hot Springs (White Sulphur Springs)', type: 'Hot Spring', lat: 46.5500, lng: -110.9000 },
  { name: 'Alhambra Hot Springs', type: 'Hot Spring', lat: 46.4200, lng: -112.0500 },
  { name: 'Potosi Hot Springs', type: 'Hot Spring', lat: 45.7700, lng: -112.0100 },
  { name: 'Lost Trail Hot Springs', type: 'Hot Spring', lat: 45.7519, lng: -113.9434 },
  { name: 'Sleeping Child Hot Springs', type: 'Hot Spring', lat: 46.1700, lng: -114.0300 },
  { name: 'K Bar L Ranch / Medicine Springs', type: 'Hot Spring', lat: 47.5400, lng: -112.7800 },

  // === HOT SPRINGS (Primitive / Backcountry) ===
  { name: 'Nimrod Hot Springs', type: 'Hot Spring', lat: 46.6700, lng: -113.4600 },
  { name: 'Boiling River (Yellowstone)', type: 'Hot Spring', lat: 45.1290, lng: -110.6960 },
  { name: 'Gigantic Warm Spring', type: 'Hot Spring', lat: 47.1800, lng: -109.4200 },
  { name: 'The Landusky Plunge', type: 'Hot Spring', lat: 47.8430, lng: -108.5980 },

  // === HOT SPRINGS (Near-border, Idaho, accessible from MT) ===
  { name: 'Jerry Johnson Hot Springs (ID)', type: 'Hot Spring', lat: 46.4150, lng: -115.1600 },
  { name: 'Weir Creek Hot Springs (ID)', type: 'Hot Spring', lat: 46.5100, lng: -115.0800 },
  { name: 'Goldbug Hot Springs (ID)', type: 'Hot Spring', lat: 44.9300, lng: -113.7100 },

  // === SKI AREAS ===
  { name: 'Whitefish Mountain Resort', type: 'Ski Area', lat: 48.4817, lng: -114.3497 },
  { name: 'Big Sky Resort', type: 'Ski Area', lat: 45.2833, lng: -111.4017 },
  { name: 'Bridger Bowl', type: 'Ski Area', lat: 45.8167, lng: -110.8983 },
  { name: 'Snowbowl', type: 'Ski Area', lat: 47.0167, lng: -114.1500 },
  { name: 'Red Lodge Mountain', type: 'Ski Area', lat: 45.1897, lng: -109.3344 },
  { name: 'Lost Trail Powder Mountain', type: 'Ski Area', lat: 45.6911, lng: -113.9489 },
  { name: 'Discovery Ski Area', type: 'Ski Area', lat: 46.2500, lng: -113.2500 },
  { name: 'Showdown Montana', type: 'Ski Area', lat: 46.8400, lng: -110.7200 },
  { name: 'Maverick Mountain', type: 'Ski Area', lat: 45.5700, lng: -113.2200 },
  { name: 'Blacktail Mountain', type: 'Ski Area', lat: 48.0500, lng: -114.3700 },
  { name: 'Teton Pass Ski Area', type: 'Ski Area', lat: 47.8100, lng: -112.5300 },
  { name: 'Turner Mountain', type: 'Ski Area', lat: 48.3100, lng: -115.3200 },
  { name: 'Bear Paw Ski Bowl', type: 'Ski Area', lat: 48.0300, lng: -109.6400 },

  // === SCENIC DRIVES ===
  { name: 'Beartooth Highway', type: 'Scenic Drive', lat: 45.0100, lng: -109.4300 },
  { name: 'Going-to-the-Sun Road', type: 'Scenic Drive', lat: 48.6967, lng: -113.7217 },
  { name: 'Kings Hill Scenic Byway', type: 'Scenic Drive', lat: 46.8900, lng: -110.7300 },
  { name: 'Pioneer Mountains Scenic Byway', type: 'Scenic Drive', lat: 45.5500, lng: -113.1000 },
  { name: 'Pintler Veterans Memorial Scenic Route', type: 'Scenic Drive', lat: 46.1700, lng: -113.2500 },
  { name: 'Lake Koocanusa Scenic Byway', type: 'Scenic Drive', lat: 48.6500, lng: -115.2500 },
  { name: 'Seeley-Swan Scenic Drive', type: 'Scenic Drive', lat: 47.5000, lng: -113.5000 },
  { name: 'Big Sheep Creek Backcountry Byway', type: 'Scenic Drive', lat: 44.7000, lng: -112.9000 },

  // === WILDLIFE REFUGES ===
  { name: 'National Bison Range', type: 'Wildlife Refuge', lat: 47.3292, lng: -114.1742 },
  { name: 'Red Rock Lakes NWR', type: 'Wildlife Refuge', lat: 44.6500, lng: -111.8000 },
  { name: 'Charles M. Russell NWR', type: 'Wildlife Refuge', lat: 47.6500, lng: -108.0000 },
  { name: 'Lee Metcalf NWR', type: 'Wildlife Refuge', lat: 46.6300, lng: -114.0700 },
  { name: 'Benton Lake NWR', type: 'Wildlife Refuge', lat: 47.6200, lng: -111.4300 },
  { name: 'Bowdoin NWR', type: 'Wildlife Refuge', lat: 48.4100, lng: -107.6600 },
  { name: 'Medicine Lake NWR', type: 'Wildlife Refuge', lat: 48.5000, lng: -104.5000 },
  { name: 'Hailstone NWR', type: 'Wildlife Refuge', lat: 46.2500, lng: -108.7500 },
  { name: 'Ninepipe NWR', type: 'Wildlife Refuge', lat: 47.3900, lng: -114.1000 },
  { name: 'Pablo NWR', type: 'Wildlife Refuge', lat: 47.5800, lng: -114.0900 },
  { name: 'Black Coulee NWR', type: 'Wildlife Refuge', lat: 48.7500, lng: -108.5500 },

  // === NATIONAL MONUMENTS & HISTORIC SITES ===
  { name: 'Missouri Breaks NM', type: 'Historic Site', lat: 47.8000, lng: -109.5000 },
  { name: 'Little Bighorn Battlefield', type: 'Historic Site', lat: 45.5700, lng: -107.4264 },
  { name: 'Pompeys Pillar National Monument', type: 'Historic Site', lat: 45.9933, lng: -108.0042 },
  { name: 'Grant-Kohrs Ranch NHS', type: 'Historic Site', lat: 46.4100, lng: -112.7400 },
  { name: 'Big Hole National Battlefield', type: 'Historic Site', lat: 45.6500, lng: -113.6500 },
  { name: 'Fort Benton Historic District', type: 'Historic Site', lat: 47.8200, lng: -110.6600 },
  { name: 'Virginia City Historic District', type: 'Historic Site', lat: 45.2937, lng: -111.9469 },
  { name: 'Butte Historic District', type: 'Historic Site', lat: 46.0038, lng: -112.5348 },
  { name: 'Marcus Daly Mansion', type: 'Historic Site', lat: 46.3800, lng: -114.0900 },
  { name: 'Moss Mansion (Billings)', type: 'Historic Site', lat: 45.7807, lng: -108.5072 },

  // === NATIONAL RECREATION AREAS ===
  { name: 'Bighorn Canyon NRA', type: 'National Rec Area', lat: 45.1000, lng: -108.2000 },

  // === GOLF COURSES ===
  { name: 'Old Works Golf Course', type: 'Golf', lat: 46.1300, lng: -112.9600 },
  { name: 'Whitefish Lake Golf Club', type: 'Golf', lat: 48.4100, lng: -114.3800 },
  { name: 'Eagle Bend Golf Club', type: 'Golf', lat: 48.0800, lng: -114.0700 },
  { name: 'Meadow Lake Golf Resort', type: 'Golf', lat: 48.4000, lng: -114.2800 },
  { name: 'Yellowstone Country Club', type: 'Golf', lat: 45.7700, lng: -108.5700 },
  { name: 'Bridger Creek Golf Course', type: 'Golf', lat: 45.7200, lng: -111.0100 },
  { name: 'Big Sky Golf Course', type: 'Golf', lat: 45.2700, lng: -111.3700 },
  { name: 'Hamilton Golf Club', type: 'Golf', lat: 46.2600, lng: -114.1500 },

  // === DISC GOLF COURSES ===
  { name: 'Blue Mountain Disc Golf', type: 'Disc Golf', lat: 46.8355, lng: -114.1053 },
  { name: 'Pattee Canyon Disc Golf', type: 'Disc Golf', lat: 46.8280, lng: -113.9251 },
  { name: 'Gilman Gauntlet', type: 'Disc Golf', lat: 46.9014, lng: -114.2903 },
  { name: 'Linda Vista Disc Golf', type: 'Disc Golf', lat: 46.8207, lng: -114.0601 },
  { name: 'Diamond X Disc Golf', type: 'Disc Golf', lat: 45.8161, lng: -108.6882 },
  { name: 'Pioneer Park Disc Golf', type: 'Disc Golf', lat: 45.7750, lng: -108.5400 },
  { name: 'Makoshika Disc Golf (Buccaneer Flats)', type: 'Disc Golf', lat: 47.0900, lng: -104.6700 },
  { name: 'Flag Hill at Warden Park', type: 'Disc Golf', lat: 47.4910, lng: -111.3037 },
  { name: 'Spiritwood Disc Golf', type: 'Disc Golf', lat: 46.3536, lng: -114.2006 },
  { name: 'South Hills (Hyzer Hills)', type: 'Disc Golf', lat: 46.5723, lng: -111.9799 },
  { name: 'The Wooden Hollow', type: 'Disc Golf', lat: 46.5900, lng: -112.0100 },
  { name: 'Eagle\'s Nest Disc Golf', type: 'Disc Golf', lat: 45.8917, lng: -112.4736 },
  { name: 'Sky View Disc Golf', type: 'Disc Golf', lat: 45.3627, lng: -111.7412 },
  { name: 'The Fortress Disc Golf', type: 'Disc Golf', lat: 48.0078, lng: -106.4318 },
  { name: 'Wilderness Club Disc Golf', type: 'Disc Golf', lat: 48.9277, lng: -115.1217 },
  { name: 'Woodruff Park Disc Golf', type: 'Disc Golf', lat: 46.4100, lng: -105.8400 },
  { name: 'Bad Rock Disc Golf', type: 'Disc Golf', lat: 47.6001, lng: -115.3607 },
  { name: 'Lawrence Park Disc Golf', type: 'Disc Golf', lat: 48.2112, lng: -114.2939 },
  { name: 'Timber Beast Disc Golf', type: 'Disc Golf', lat: 48.4579, lng: -115.8922 },
  { name: 'Smith Lake Disc Golf', type: 'Disc Golf', lat: 48.4083, lng: -114.3522 },
  { name: 'Blackhawk Disc Golf', type: 'Disc Golf', lat: 47.1752, lng: -113.4672 },
  { name: 'Kooky Noosa Disc Golf', type: 'Disc Golf', lat: 48.4134, lng: -115.3195 },
  { name: 'Rose Park Disc Golf', type: 'Disc Golf', lat: 45.6964, lng: -111.0703 },
  { name: 'Chico Hot Springs Disc Golf', type: 'Disc Golf', lat: 45.3404, lng: -110.6978 },
  { name: 'Sheep Mountain Disc Golf', type: 'Disc Golf', lat: 46.4891, lng: -112.0384 },
  { name: 'Darby Disc Golf', type: 'Disc Golf', lat: 46.0200, lng: -114.1800 },
  { name: 'Blodgett Disc Golf', type: 'Disc Golf', lat: 46.2500, lng: -114.1600 },
  { name: 'Centennial Park Disc Golf', type: 'Disc Golf', lat: 48.1988, lng: -106.6187 },
  { name: 'Richland Park Disc Golf', type: 'Disc Golf', lat: 47.7567, lng: -104.0848 },
  { name: 'Lewis & Clark Disc Golf', type: 'Disc Golf', lat: 48.0693, lng: -105.5375 },
  { name: 'River\'s Edge Park Disc Golf', type: 'Disc Golf', lat: 48.3700, lng: -114.1800 },
  { name: 'Blacktail Mountain Disc Golf', type: 'Disc Golf', lat: 48.0114, lng: -114.3647 },
  { name: 'MSU-Northern Disc Golf', type: 'Disc Golf', lat: 48.5500, lng: -109.6800 },
  { name: 'Forsyth Riverside Park DG', type: 'Disc Golf', lat: 46.2700, lng: -106.6800 },
  { name: 'Teton Disc Golf', type: 'Disc Golf', lat: 47.8100, lng: -112.2300 },
  { name: 'Salish Kootenai College DG', type: 'Disc Golf', lat: 47.5300, lng: -114.0900 },
  { name: 'Arrowstone Park Disc Golf', type: 'Disc Golf', lat: 46.4000, lng: -112.7300 },

  // === NOTABLE HIKES & NATURAL FEATURES (not in OSM) ===
  { name: 'Natural Bridge Falls', type: 'Waterfall', lat: 45.5850, lng: -109.9150 },
  { name: 'Lost Creek Falls', type: 'Waterfall', lat: 46.1300, lng: -112.8500 },
  { name: 'Pine Creek Falls', type: 'Waterfall', lat: 45.5250, lng: -110.4900 },
  { name: 'Sweathouse Falls', type: 'Waterfall', lat: 46.6800, lng: -114.3500 },
  { name: 'Woodbine Falls', type: 'Waterfall', lat: 45.3800, lng: -109.8100 },
  { name: 'Passage Falls', type: 'Waterfall', lat: 45.3900, lng: -111.3500 },
  { name: 'Hyalite Canyon', type: 'Trailhead', lat: 45.5500, lng: -111.0200 },
  { name: 'Sacajawea Peak', type: 'Trailhead', lat: 45.8900, lng: -110.9700 },
  { name: 'Jewel Basin Hiking Area', type: 'Trailhead', lat: 48.0700, lng: -113.7000 },
  { name: 'Danny On Trail', type: 'Trailhead', lat: 48.4700, lng: -114.3600 },
  { name: 'Bear Canyon Trail', type: 'Trailhead', lat: 45.6300, lng: -111.0800 },
  { name: 'Greenough Park', type: 'State Park', lat: 46.8800, lng: -113.9900 },
  { name: 'Grizzly Peak', type: 'Trailhead', lat: 45.3000, lng: -111.4200 },
  { name: 'M Trail (Mount Sentinel)', type: 'Trailhead', lat: 46.8580, lng: -113.9760 },
  { name: 'Kim Williams Nature Trail', type: 'Trailhead', lat: 46.8500, lng: -113.9800 },
  { name: 'Drinking Horse Mountain', type: 'Trailhead', lat: 45.7400, lng: -111.0300 },
  { name: 'Story Mill Community Park', type: 'State Park', lat: 45.7000, lng: -111.0200 },

  // === NATIONAL ORGANIZATION HEADQUARTERS ===
  { name: 'Rocky Mountain Elk Foundation HQ & Visitor Center', type: 'National HQ', lat: 46.9100, lng: -114.0900 },
  { name: 'Boone and Crockett Club National HQ', type: 'National HQ', lat: 46.8700, lng: -114.0000 },
  { name: 'Adventure Cycling Association HQ', type: 'National HQ', lat: 46.8720, lng: -113.9940 },
  { name: 'Wilderness Watch National HQ', type: 'National HQ', lat: 46.8700, lng: -113.9900 },
  { name: 'Vital Ground Foundation HQ', type: 'National HQ', lat: 46.8700, lng: -113.9900 },
  { name: 'International Wildlife Film Festival', type: 'National HQ', lat: 46.8720, lng: -113.9940 },
  { name: 'Five Valleys Land Trust', type: 'National HQ', lat: 46.8710, lng: -113.9930 },
  { name: 'Heart of the Rockies Initiative HQ', type: 'National HQ', lat: 46.8700, lng: -113.9900 },
  { name: 'Greater Yellowstone Coalition HQ', type: 'National HQ', lat: 45.6790, lng: -111.0400 },
  { name: 'Wild Sheep Foundation HQ', type: 'National HQ', lat: 45.6830, lng: -111.0500 },
  { name: 'Montana Wilderness Association HQ', type: 'National HQ', lat: 46.5850, lng: -112.0300 },
  { name: 'Montana Wildlife Federation HQ', type: 'National HQ', lat: 46.5860, lng: -112.0200 },

  // === MUSEUMS (curated top-tier) ===
  { name: 'Museum of the Rockies', type: 'Museum', lat: 45.6603, lng: -111.0485 },
  { name: 'C.M. Russell Museum', type: 'Museum', lat: 47.5062, lng: -111.2774 },
  { name: 'World Museum of Mining', type: 'Museum', lat: 46.0200, lng: -112.5400 },
  { name: 'Montana Historical Society', type: 'Museum', lat: 46.5858, lng: -112.0184 },
  { name: 'Yellowstone Art Museum', type: 'Museum', lat: 45.7826, lng: -108.5110 },
  { name: 'Glacier Park Museum', type: 'Museum', lat: 48.5102, lng: -114.3137 },
  { name: 'Museum of the Plains Indian', type: 'Museum', lat: 48.5627, lng: -112.8813 },
  { name: 'Frontier Montana Museum', type: 'Museum', lat: 46.4050, lng: -112.7250 },
  { name: 'Montana Dinosaur Center', type: 'Museum', lat: 47.8100, lng: -112.5500 },
  { name: 'Range Riders Museum', type: 'Museum', lat: 46.4050, lng: -105.8450 },
  { name: 'Historical Museum at Fort Missoula', type: 'Museum', lat: 46.8370, lng: -114.0810 },
  { name: 'Miracle of America Museum', type: 'Museum', lat: 47.6930, lng: -114.1500 },
];

const DEFAULT_RADIUS = 30;

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildRecreation() {
  const coordsPath = path.resolve(__dirname, '..', 'data', 'town-coordinates.json');
  const osmPath = path.resolve(__dirname, '..', 'data', 'osm-recreation-sites.json');
  const outPath = path.resolve(__dirname, '..', 'data', 'town-recreation.json');

  const coordinates = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
  const osmSites = JSON.parse(fs.readFileSync(osmPath, 'utf8'));

  const gnisFishingPath = path.resolve(__dirname, '..', 'data', 'gnis-fishing-access.json');
  const gnisFishing = fs.existsSync(gnisFishingPath) ? JSON.parse(fs.readFileSync(gnisFishingPath, 'utf8')) : [];
  if (gnisFishing.length) console.log(`Loaded ${gnisFishing.length} GNIS fishing access sites`);

  // Merge curated + GNIS fishing + OSM, curated wins on name collisions
  const allSites = [...CURATED_SITES, ...gnisFishing];
  const seenNames = new Set(allSites.map(s => s.name.toLowerCase().trim()));

  const TYPE_MAP = {
    'Golf Course': 'Golf',
    'Visitor Center': 'Museum',
  };

  // Drop junk OSM entries: generic labels, unnamed pools, institutional land parcels
  const JUNK_RE = /^(Pool\s*#?\d*|#\d+|Swimming Pool|Hot tub|crab cooker|BLM|MT University|Public Land|State Trust|USFWS|US BOR|US DOD|MT DOT|MT FWP|MT Corrections|US Government|Local Government|County|State|NBC|Private)$/i;
  const JUNK_NAME_RE = /(^Selfie Spot$|^Picnic Area$|^10 Commandments$|^Practice Bunker\b|LLC$|Services$| HQ\b)/i;
  const DROP_NAMES = new Set([
    'Yellowstone National Park',
  ]);

  const DROP_TYPES = new Set(['Swimming Area', 'Picnic Area', 'National HQ']);

  let dropped = 0;
  for (const osm of osmSites) {
    const key = osm.name.toLowerCase().trim();
    if (seenNames.has(key)) continue;
    if (JUNK_RE.test(osm.name.trim())) { dropped++; continue; }
    if (JUNK_NAME_RE.test(osm.name.trim())) { dropped++; continue; }
    if (DROP_NAMES.has(osm.name.trim())) { dropped++; continue; }
    if (osm.name.trim().length <= 3) { dropped++; continue; }
    if (DROP_TYPES.has(osm.type)) { dropped++; continue; }

    seenNames.add(key);
    const type = TYPE_MAP[osm.type] || osm.type;
    allSites.push({ ...osm, type });
  }
  console.log(`Filtered out ${dropped} low-quality OSM entries`);

  console.log(`Merged database: ${allSites.length} total sites (${CURATED_SITES.length} curated + ${allSites.length - CURATED_SITES.length} from OSM)`);

  const results = {};
  let totalPlaces = 0;
  let minPlaces = Infinity;
  let maxPlaces = 0;
  let minTown = '';
  let maxTown = '';

  for (const [slug, town] of Object.entries(coordinates)) {
    const all = allSites.filter(site => (
      site.type !== 'National HQ'
      && !JUNK_NAME_RE.test(site.name.trim())
      && !DROP_NAMES.has(site.name.trim())
    )).map(site => ({
      name: site.name,
      type: site.type,
      lat: site.lat,
      lng: site.lng,
      distMiles: Math.round(haversineMiles(town.lat, town.lng, site.lat, site.lng)),
    }))
      .sort((a, b) => a.distMiles - b.distMiles);

    const nearby = all.filter(p => p.distMiles <= DEFAULT_RADIUS);

    totalPlaces += nearby.length;
    if (nearby.length < minPlaces) { minPlaces = nearby.length; minTown = slug; }
    if (nearby.length > maxPlaces) { maxPlaces = nearby.length; maxTown = slug; }

    results[slug] = { name: town.name, places: nearby };
  }

  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

  const townCount = Object.keys(results).length;
  console.log(`\nRecreation data built for ${townCount} towns.`);
  console.log(`Average sites per town: ${Math.round(totalPlaces / townCount)}`);
  console.log(`Min: ${minPlaces} (${minTown}), Max: ${maxPlaces} (${maxTown})`);

  // Show a few samples
  for (const sample of ['missoula', 'bozeman', 'glendive', 'whitefish']) {
    if (results[sample]) {
      console.log(`\n${sample}: ${results[sample].places.length} sites`);
      const byType = {};
      for (const p of results[sample].places) {
        byType[p.type] = (byType[p.type] || 0) + 1;
      }
      for (const [t, c] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${t}: ${c}`);
      }
    }
  }
}

buildRecreation();
require('./stamp-freshness').stamp('recreation');
