#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CAMPGROUNDS_RAW = [
  { name: "Missoula KOA Holiday", type: "Campground", rating: 4.0, reviews: 1088, lat: 46.8964609, lng: -114.0424053, address: "3450 Tina Ave, Missoula, MT 59808", phone: "(406) 370-6633", website: null },
  { name: "Granite Peak RV Resort", type: "Campground", rating: 4.4, reviews: 752, lat: 46.9609708, lng: -114.1350457, address: "9900 Thoroughbred Ln, Missoula, MT 59808", phone: "(406) 549-4416", website: "https://www.jimandmarys.com/" },
  { name: "Great Falls KOA Holiday", type: "Campground", rating: 4.2, reviews: 747, lat: 47.4875491, lng: -111.2216082, address: "1500 51st St S, Great Falls, MT 59405", phone: "(406) 791-7700", website: null },
  { name: "Butte KOA Journey", type: "Campground", rating: 4.0, reviews: 728, lat: 45.993959, lng: -112.531173, address: "1601 Kaw Ave, Butte, MT 59701", phone: "(406) 494-2147", website: null },
  { name: "Bozeman Hot Springs Campground", type: "Campground", rating: 4.2, reviews: 630, lat: 45.660086, lng: -111.1899187, address: "150 Welcome Dr, Bozeman, MT 59718", phone: "(406) 587-1575", website: null },
  { name: "Yellowstone River Campground", type: "Campground", rating: 3.9, reviews: 597, lat: 45.7634704, lng: -108.4818803, address: "309 Garden Ave, Billings, MT 59101", phone: "(406) 252-3104", website: null },
  { name: "7th Ranch RV Camp", type: "RV park", rating: 4.7, reviews: 527, lat: 45.4919436, lng: -107.3776587, address: "I-90 S Exit 514, Reno Creek Rd, Garryowen, MT 59031", phone: "(406) 671-0121", website: null },
  { name: "Miles City KOA Journey", type: "Campground", rating: 4.3, reviews: 458, lat: 46.406312, lng: -105.859304, address: "1 Palmer St, Miles City, MT 59301", phone: "(406) 234-1511", website: null },
  { name: "Great Falls RV Park", type: "RV park", rating: 3.9, reviews: 401, lat: 47.4900362, lng: -111.3321764, address: "1403 11th St SW, Great Falls, MT 59404", phone: "(406) 727-3191", website: null },
  { name: "Cardwell Campground", type: "Campground", rating: 4.1, reviews: 386, lat: 45.8692311, lng: -111.9488101, address: "770 MT-2 Suite A, Cardwell, MT 59721", phone: "(406) 287-3541", website: null },
  { name: "Grandview Campground & RV Park", type: "Campground", rating: 4.0, reviews: 359, lat: 45.7392106, lng: -107.6140043, address: "1002 N Mitchell Ave, Hardin, MT 59034", phone: "(406) 665-1635", website: null },
  { name: "Spring Creek Campground and Trout Ranch", type: "Campground", rating: 4.6, reviews: 353, lat: 45.8022867, lng: -109.9610833, address: "257 Main Boulder Rd, Big Timber, MT 59011", phone: "(406) 932-6569", website: null },
  { name: "Big Timber / Greycliff KOA Journey", type: "Campground", rating: 4.0, reviews: 353, lat: 45.773938, lng: -109.799312, address: "693 Hwy 10 E, Big Timber, MT 59011", phone: "(406) 932-6569", website: null },
  { name: "Three Forks KOA", type: "Campground", rating: 4.2, reviews: 335, lat: 45.902613, lng: -111.602346, address: "15 KOA Rd, Three Forks, MT 59752", phone: null, website: null },
  { name: "Wayfarers Campground", type: "Campground", rating: 4.5, reviews: 329, lat: 48.0534723, lng: -114.0829755, address: "8600 Montana Hwy 35, Bigfork, MT 59911", phone: "(406) 752-5501", website: null },
  { name: "Bernie and Sharon's Riverfront RV Park", type: "RV park", rating: 4.3, reviews: 329, lat: 46.5191421, lng: -112.7955245, address: "115 Riverfront Ln, Garrison, MT 59731", phone: "(406) 846-3848", website: null },
  { name: "Campground St. Regis", type: "Campground", rating: 4.7, reviews: 328, lat: 47.3014197, lng: -115.1343771, address: "660 Frontage Rd W, St Regis, MT 59866", phone: "(406) 822-4233", website: null },
  { name: "Red Lodge KOA Journey", type: "Campground", rating: 4.3, reviews: 322, lat: 45.2567399, lng: -109.2281638, address: "7464 US-212, Red Lodge, MT 59068", phone: "(406) 446-2103", website: null },
  { name: "Indian Creek Campground", type: "Campground", rating: 4.4, reviews: 302, lat: 46.4088701, lng: -112.7238506, address: "745 Maverick Ln, Deer Lodge, MT 59722", phone: "(406) 563-2967", website: null },
  { name: "Rocky Mountain Hi Campground", type: "Campground", rating: 4.5, reviews: 293, lat: 48.2526012, lng: -114.2504345, address: "825 Helena Flats Rd, Kalispell, MT 59901", phone: "(406) 752-4008", website: null },
  { name: "Polson / Flathead Lake KOA Holiday", type: "Campground", rating: 4.5, reviews: 293, lat: 47.6993947, lng: -114.1867449, address: "200 Irvine Flats Rd, Polson, MT 59860", phone: "(406) 887-2715", website: null },
  { name: "Cooney Reservoir", type: "Campground", rating: 4.3, reviews: 275, lat: 45.4415815, lng: -109.2054711, address: "86 Lake Shore Rd, Roberts, MT 59070", phone: "(406) 662-3677", website: null },
  { name: "Dew Drop RV Park", type: "RV park", rating: 4.0, reviews: 267, lat: 45.5225478, lng: -109.4381657, address: "3315 MT-78, Absarokee, MT 59001", phone: null, website: null },
  { name: "Angler's Roost RV and Campground", type: "Campground", rating: 4.0, reviews: 248, lat: 46.1995511, lng: -114.1670273, address: "815 US-93, Hamilton, MT 59840", phone: "(406) 363-7100", website: null },
  { name: "Kootenai River Campground", type: "Campground", rating: 4.8, reviews: 246, lat: 48.500132, lng: -115.9202107, address: "11251 US-2, Troy, MT 59935", phone: "(406) 293-8395", website: null },
  { name: "Fox Den RV and Campground", type: "RV park", rating: 3.6, reviews: 232, lat: 44.6641161, lng: -111.1117919, address: "635 Gibbon Ave, West Yellowstone, MT 59758", phone: "(626) 848-3080", website: null },
  { name: "2 Bar Lazy H RV Campgrounds", type: "Campground", rating: 3.8, reviews: 224, lat: 46.009929, lng: -112.623382, address: "122015 W Browns Gulch Rd, Butte, MT 59701", phone: "(406) 683-3900", website: null },
  { name: "Perry's RV Park and Campground", type: "Campground", rating: 4.6, reviews: 205, lat: 45.1514817, lng: -109.2729924, address: "6664 US-212, Red Lodge, MT 59068", phone: "(406) 446-2103", website: null },
  { name: "Lewis & Clark Caverns Campground", type: "Campground", rating: 4.5, reviews: 204, lat: 45.8233217, lng: -111.8558022, address: "Whitehall, MT 59759", phone: null, website: null },
  { name: "Choteau Mountain View RV Campground", type: "RV park", rating: 4.7, reviews: 186, lat: 47.8160095, lng: -112.165596, address: "85 Hwy 221, Choteau, MT 59422", phone: "(406) 466-2510", website: null },
  { name: "Chewing Black Bones Campground", type: "Campground", rating: 4.0, reviews: 186, lat: 48.8264757, lng: -113.418262, address: "US-89, Babb, MT 59411", phone: "(406) 239-4454", website: null },
  { name: "Two Medicine Campground", type: "Campground", rating: 4.7, reviews: 184, lat: 48.4915363, lng: -113.364551, address: "East Glacier Park, MT 59434", phone: "(406) 666-2412", website: null },
  { name: "Shady Rest RV Park", type: "RV park", rating: 4.4, reviews: 178, lat: 48.1967637, lng: -106.6204788, address: "8 Lasar Dr, Glasgow, MT 59230", phone: "(406) 672-5196", website: null },
  { name: "Helena Campground and RV Park", type: "Campground", rating: 3.2, reviews: 175, lat: 46.6572066, lng: -112.0224042, address: "5820 N Montana Ave, Helena, MT 59602", phone: "(406) 475-3921", website: null },
  { name: "Big Sky Camp and RV Park", type: "Campground", rating: 4.2, reviews: 173, lat: 46.425574, lng: -105.791162, address: "1294 US-12, Miles City, MT 59301", phone: "(406) 232-3991", website: null },
  { name: "Outback Montana RV Park & Campground", type: "Campground", rating: 3.9, reviews: 151, lat: 48.0127785, lng: -114.0557064, address: "13772 Outback Ln, Bigfork, MT 59911", phone: "(406) 837-3041", website: null },
  { name: "Sundance Campground", type: "Campground", rating: 4.3, reviews: 151, lat: 48.4339477, lng: -114.0442148, address: "10545 Hwy 2 E, Columbia Falls, MT 59912", phone: "(406) 608-9653", website: null },
  { name: "Montana Basecamp RV Park", type: "Campground", rating: 4.0, reviews: 148, lat: 48.1539456, lng: -114.293963, address: "1000 Basecamp Dr, Kalispell, MT 59901", phone: "(800) 968-5637", website: null },
  { name: "Philipsburg Bay Campground", type: "Campground", rating: 4.5, reviews: 148, lat: 46.2060891, lng: -113.2886054, address: "Philipsburg, MT 59858", phone: null, website: "https://www.recreation.gov/camping/campgrounds/234010" },
  { name: "Yellowrock Campground", type: "Campground", rating: 4.4, reviews: 130, lat: 46.7487572, lng: -114.1362484, address: "9955 US-12, Lolo, MT 59847", phone: "(406) 370-6633", website: null },
  { name: "Birdland Bay RV Resort", type: "Campground", rating: 4.7, reviews: 126, lat: 47.6253521, lng: -115.3906393, address: "2148 Blue Slide Rd, Thompson Falls, MT 59873", phone: "(406) 827-3110", website: null },
  { name: "Evergreen Campground", type: "Campground", rating: 4.4, reviews: 123, lat: 48.509139, lng: -109.7889599, address: "4850 72nd Ave W, Havre, MT 59501", phone: null, website: null },
  { name: "Twin Bridges Bike Camp", type: "Campground", rating: 4.5, reviews: 122, lat: 45.5448767, lng: -112.3347083, address: "2829 MT-41 S, Twin Bridges, MT 59754", phone: null, website: null },
  { name: "Missouri Headwaters Campground", type: "Campground", rating: 4.2, reviews: 116, lat: 45.917875, lng: -111.5019943, address: "Three Forks, MT 59752", phone: "(406) 285-3610", website: "https://fwp.mt.gov/stateparks/missouri-headwaters/" },
  { name: "Small Towne RV Campground", type: "RV park", rating: 4.6, reviews: 114, lat: 46.7863006, lng: -105.310028, address: "803 Towne Ave, Terry, MT 59349", phone: "(406) 635-5520", website: null },
  { name: "Holland Lake Campground", type: "Campground", rating: 4.6, reviews: 113, lat: 47.4514404, lng: -113.6087732, address: "Condon, MT 59826", phone: null, website: null },
  { name: "Beaverhead Campground", type: "Campground", rating: 4.6, reviews: 108, lat: 44.9969053, lng: -112.855936, address: "I-15, Dillon, MT 59725", phone: "(406) 683-6472", website: null },
  { name: "Lake Sheloole Campground And RV Park", type: "Campground", rating: 4.1, reviews: 101, lat: 48.5220185, lng: -111.8536083, address: "1210 Oilfield Ave, Shelby, MT 59474", phone: "(406) 434-5222", website: null },
  { name: "Charles Waters Campground", type: "Campground", rating: 4.6, reviews: 100, lat: 46.575266, lng: -114.1408389, address: "Highway 93, Florence, MT 59833", phone: "(406) 777-7424", website: null },
  { name: "Big Sky RV Park & Campground", type: "Campground", rating: 4.4, reviews: 97, lat: 46.134757, lng: -112.954066, address: "350 Copper Sands Rd, Anaconda, MT 59711", phone: "(406) 417-1050", website: null },
  { name: "Rosebud East Campground", type: "Campground", rating: 4.3, reviews: 93, lat: 46.2747367, lng: -106.6773772, address: "660 15th Ave, Forsyth, MT 59327", phone: "(406) 356-7982", website: null },
  { name: "Red Shale Campground", type: "Campground", rating: 4.7, reviews: 92, lat: 45.5679777, lng: -106.1456913, address: "Ashland, MT 59003", phone: "(406) 784-2344", website: null },
  { name: "Wayside RV Park", type: "Campground", rating: 4.6, reviews: 92, lat: 45.463267, lng: -105.463795, address: "19 Talcott Rd, Broadus, MT 59317", phone: "(406) 923-8127", website: null },
  { name: "Sleeping Wolf Campground", type: "Campground", rating: 3.7, reviews: 91, lat: 48.5619664, lng: -113.0272954, address: "56 Sleeping Wolf Ln, Browning, MT 59417", phone: "(406) 338-4557", website: null },
  { name: "Alhambra RV Park", type: "Campground", rating: 3.8, reviews: 91, lat: 46.4550815, lng: -111.9845361, address: "515 State Highway 282, Clancy, MT 59634", phone: "(406) 449-5201", website: null },
  { name: "Big Arm Campground", type: "Campground", rating: 4.5, reviews: 87, lat: 47.8069113, lng: -114.3110485, address: "45143 Big Arm State Pk, Big Arm, MT 59910", phone: "(406) 752-5501", website: "https://fwp.mt.gov/stateparks/big-arm/" },
  { name: "Town Of Drummond Campground", type: "Campground", rating: 4.1, reviews: 86, lat: 46.6604898, lng: -113.1494644, address: "18 Old Hwy 10A, Drummond, MT 59832", phone: null, website: null },
  { name: "Barretts Park Campground", type: "Campground", rating: 4.7, reviews: 85, lat: 45.1288212, lng: -112.7414994, address: "Dillon, MT 59725", phone: "(406) 596-5021", website: null },
  { name: "Sunset RV Park Montana", type: "Campground", rating: 4.5, reviews: 83, lat: 48.632856, lng: -112.3441781, address: "401 4th Ave SW, Cut Bank, MT 59427", phone: "(406) 548-2266", website: null },
  { name: "Red Mountain Campground", type: "Campground", rating: 4.5, reviews: 80, lat: 45.6119696, lng: -111.5692526, address: "Manhattan, MT 59741", phone: null, website: null },
  { name: "Livingston Campground", type: "Campground", rating: 3.2, reviews: 79, lat: 45.646749, lng: -110.5758646, address: "11 Rogers Ln, Livingston, MT 59047", phone: "(406) 223-9836", website: null },
  { name: "Kiwanis Club Campground", type: "Campground", rating: 4.7, reviews: 79, lat: 47.0551543, lng: -109.460688, address: "80398 US-87, Lewistown, MT 59457", phone: null, website: null },
  { name: "Wagon Wheel Campground", type: "Campground", rating: 4.3, reviews: 76, lat: 46.2625695, lng: -106.658919, address: "58 Slaughterhouse Creek Rd, Forsyth, MT 59327", phone: null, website: null },
  { name: "Mission Meadows Camping & RV Park", type: "Campground", rating: 3.8, reviews: 73, lat: 47.566745, lng: -114.1247403, address: "44457 Mission Meadow Dr, Ronan, MT 59864", phone: "(406) 676-2267", website: null },
  { name: "River Point Campground", type: "Campground", rating: 4.3, reviews: 72, lat: 47.1869, lng: -113.5141299, address: "Boy Scout Rd, Seeley Lake, MT 59868", phone: "(406) 677-2233", website: null },
  { name: "West Shore Campground", type: "Campground", rating: 4.6, reviews: 68, lat: 47.9503856, lng: -114.1884613, address: "17768 U.S. 93 S, Lakeside, MT 59922", phone: "(406) 844-3044", website: "https://fwp.mt.gov/stateparks/west-shore/" },
  { name: "Benton RV Park & Campground", type: "Campground", rating: 4.2, reviews: 68, lat: 47.8286702, lng: -110.6626817, address: "2410 Chouteau St, Fort Benton, MT 59442", phone: "(406) 622-5505", website: null },
  { name: "Firemans Park Campground", type: "Campground", rating: 4.4, reviews: 67, lat: 48.3910483, lng: -115.5627602, address: "Libby, MT 59923", phone: "(406) 293-8395", website: null },
  { name: "Holter Dam Campground", type: "Campground", rating: 4.4, reviews: 65, lat: 46.9948535, lng: -112.0118712, address: "1390 Holter Dam Rd, Wolf Creek, MT 59648", phone: "(406) 235-4314", website: "https://www.blm.gov/visit/holter-lake-campground" },
  { name: "Whitefish Campground", type: "Campground", rating: 3.4, reviews: 64, lat: 48.4248828, lng: -114.3720492, address: "1615 W Lakeshore Dr, Whitefish, MT 59937", phone: "(406) 862-7275", website: null },
  { name: "Beaver Valley Haven RV & Cabins", type: "Campground", rating: 4.0, reviews: 64, lat: 46.98104, lng: -104.19015, address: "7941 MT-7, Wibaux, MT 59353", phone: null, website: null },
  { name: "Hellgate Campground", type: "Campground", rating: 4.3, reviews: 63, lat: 46.6118805, lng: -111.6533091, address: "Helena, MT 59602", phone: "(406) 475-3921", website: null },
  { name: "Fresno Beach Campground", type: "Campground", rating: 4.6, reviews: 63, lat: 48.5959552, lng: -109.9568639, address: "Havre, MT 59501", phone: null, website: null },
  { name: "Divide Bridge Campground", type: "Campground", rating: 4.7, reviews: 60, lat: 45.7531517, lng: -112.7746759, address: "74916 MT-43, Divide, MT 59727", phone: null, website: null },
  { name: "Blodgett Campground", type: "Campground", rating: 4.4, reviews: 57, lat: 46.269922, lng: -114.244263, address: "Blodgett Camp Rd, Hamilton, MT 59840", phone: "(406) 363-3744", website: null },
  { name: "Fort Peck Campground", type: "Campground", rating: 4.6, reviews: 53, lat: 48.0066863, lng: -106.4279682, address: "Nashua, MT 59248", phone: null, website: null },
  { name: "Jocko Hollow Campground", type: "Campground", rating: 4.0, reviews: 50, lat: 47.1773454, lng: -114.0978134, address: "71370 Campground Ln, Arlee, MT 59821", phone: null, website: null },
  { name: "Trafton Park Campground", type: "Campground", rating: 4.3, reviews: 50, lat: 48.3634576, lng: -107.8728387, address: "Malta, MT 59538", phone: "(406) 654-1302", website: null },
  { name: "Galena Gulch Campground", type: "Campground", rating: 4.4, reviews: 49, lat: 46.2540671, lng: -112.1827506, address: "Boulder, MT 59632", phone: "(406) 449-5201", website: null },
  { name: "Bull River Campground", type: "Campground", rating: 4.3, reviews: 49, lat: 48.0289378, lng: -115.8419008, address: "1091-1121 MT-200, Noxon, MT 59853", phone: "(406) 847-2291", website: null },
  { name: "Bitterroot Valley RV and Campground", type: "Campground", rating: 3.2, reviews: 45, lat: 46.135204, lng: -114.176912, address: "1744 US-93, Hamilton, MT 59840", phone: null, website: null },
  { name: "Moose Creek Campground", type: "Campground", rating: 4.3, reviews: 45, lat: 46.5250655, lng: -112.2567786, address: "Rimini Rd, Helena, MT 59601", phone: null, website: null },
  { name: "Grasshopper Campground and Picnic Area", type: "Campground", rating: 4.6, reviews: 44, lat: 45.4520204, lng: -113.119831, address: "Pioneer Mountains Scenic By-Way, Wise River, MT 59762", phone: "(406) 689-3243", website: null },
  { name: "Glacier Elkhorn Cabins and Campground", type: "Campground", rating: 4.2, reviews: 44, lat: 48.9127536, lng: -113.4355366, address: "4379 US-89, Babb, MT 59411", phone: "(406) 338-4557", website: null },
  { name: "Fairy Lake Campground", type: "Campground", rating: 4.4, reviews: 39, lat: 45.9072759, lng: -110.9642668, address: "Wilsall, MT 59086", phone: "(406) 222-1892", website: null },
  { name: "Spring Gulch Campground", type: "Campground", rating: 4.6, reviews: 39, lat: 45.8587387, lng: -114.0233457, address: "US-93, Hamilton, MT 59840", phone: null, website: null },
  { name: "Tiny Town Campground", type: "Campground", rating: 4.9, reviews: 37, lat: 45.370495, lng: -110.7336182, address: "9 Counts Ln, Emigrant, MT 59027", phone: "(406) 224-1599", website: null },
  { name: "Coalbanks Campground", type: "Campground", rating: 4.6, reviews: 37, lat: 48.0320354, lng: -110.2358319, address: "5901 Virgelle Ferry Rd N, Loma, MT 59460", phone: null, website: null },
  { name: "Devil Creek Campground", type: "Campground", rating: 4.7, reviews: 35, lat: 48.2513501, lng: -113.4639876, address: "15485 US-2, Essex, MT 59916", phone: "(406) 226-4479", website: null },
  { name: "Thain Creek Campground", type: "Campground", rating: 4.4, reviews: 35, lat: 47.4755556, lng: -110.5852778, address: "Forest Road 8840, Highwood, MT 59450", phone: null, website: null },
  { name: "Cascade Creek Campground", type: "Campground", rating: 4.4, reviews: 35, lat: 47.3055073, lng: -114.8247695, address: "MT-135, Plains, MT 59859", phone: null, website: null },
  { name: "Cow Bells Campground", type: "Campground", rating: 4.3, reviews: 34, lat: 46.4399145, lng: -108.5299617, address: "Roundup, MT 59072", phone: null, website: null },
  { name: "Cromwell Dixon Campground", type: "Campground", rating: 4.6, reviews: 34, lat: 46.5561682, lng: -112.315871, address: "Helena, MT 59601", phone: null, website: null },
  { name: "Sanford Park Campground", type: "Campground", rating: 4.7, reviews: 33, lat: 48.3113861, lng: -111.0882461, address: "Chester, MT 59522", phone: "(406) 759-5637", website: null },
  { name: "American Legion Memorial Park", type: "Campground", rating: 4.8, reviews: 32, lat: 45.6184416, lng: -113.4590966, address: "26650 MT-43, Wisdom, MT 59761", phone: "(406) 689-3243", website: null },
  { name: "Crystal Lake Campground", type: "Campground", rating: 4.5, reviews: 31, lat: 46.7941052, lng: -109.5110964, address: "21970 Crystal Lake Rd, Moore, MT 59464", phone: "(406) 632-4391", website: null },
  { name: "Ackley Lake West Campground", type: "Campground", rating: 4.5, reviews: 31, lat: 46.9556429, lng: -109.9435775, address: "989 Ackley Lake Rd, Hobson, MT 59452", phone: null, website: null },
  { name: "Willow Creek Campground", type: "Campground", rating: 4.9, reviews: 29, lat: 47.456808, lng: -114.1528183, address: "54624 MT-212, Charlo, MT 59824", phone: null, website: null },
  { name: "Eddies Corner Campground", type: "Campground", rating: 4.5, reviews: 28, lat: 46.9826166, lng: -109.744663, address: "65000 US-87, Moore, MT 59464", phone: null, website: null },
  { name: "City Park Campground", type: "Campground", rating: 4.3, reviews: 26, lat: 45.2959637, lng: -108.9108889, address: "306 E Broadway Ave, Bridger, MT 59014", phone: null, website: null },
  { name: "Springs Campground", type: "Campground", rating: 4.2, reviews: 26, lat: 46.5480317, lng: -110.9140221, address: "1004 W Main St, White Sulphur Springs, MT 59645", phone: null, website: null },
  { name: "Trout Creek Campground", type: "Campground", rating: 4.5, reviews: 24, lat: 47.8616, lng: -115.630727, address: "Trout Creek, MT 59874", phone: null, website: null },
  { name: "Fort Peck Campground (Downstream)", type: "Campground", rating: 4.6, reviews: 53, lat: 48.0066863, lng: -106.4279682, address: "Nashua, MT 59248", phone: null, website: null },
  { name: "Bolster Dam Campgrounds", type: "Campground", rating: 4.3, reviews: 13, lat: 48.7844724, lng: -104.5524571, address: "Plentywood, MT 59254", phone: "(406) 808-7117", website: null },
  { name: "Holland Lake Campground", type: "Campground", rating: 4.6, reviews: 113, lat: 47.4514404, lng: -113.6087732, address: "Condon, MT 59826", phone: null, website: null },
  { name: "Wagons West Campground", type: "Campground", rating: 4.6, reviews: 15, lat: 47.4960547, lng: -112.3875482, address: "956 N US-287, Augusta, MT 59410", phone: "(406) 562-3247", website: null },
  { name: "Pondera RV Resort", type: "RV park", rating: 4.7, reviews: 18, lat: 48.1650655, lng: -111.9516596, address: "713 S Maryland St, Conrad, MT 59425", phone: "(406) 271-2263", website: "https://ponderarvresort.com/" },
];

// Deduplicate by name
const seen = new Set();
const CAMPGROUNDS = CAMPGROUNDS_RAW.filter(c => {
  if (seen.has(c.name)) return false;
  seen.add(c.name);
  return true;
});

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function categorize(name, address) {
  const n = name.toLowerCase();
  if (n.includes('koa')) return 'koa';
  if (n.includes('state') || (address && address.toLowerCase().includes('state p'))) return 'state';
  const stateKeywords = ['wayfarers', 'big arm', 'west shore', 'lewis & clark caverns', 'cooney reservoir', 'missouri headwaters'];
  if (stateKeywords.some(k => n.includes(k))) return 'state';
  const publicKeywords = ['national forest', 'blm', 'forest service', 'holter dam'];
  if (publicKeywords.some(k => n.includes(k))) return 'public';
  if (n.includes('rv park') || n.includes('rv resort') || n.includes('rv camp')) return 'rv';
  return 'private';
}

const townData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'town-data.json'), 'utf8'));
const towns = Object.entries(townData).map(([slug, t]) => ({ slug, name: t.name, lat: t.lat, lng: t.lng }));

function findNearestTown(lat, lng) {
  let best = null;
  let bestDist = Infinity;
  for (const t of towns) {
    const d = haversineMiles(lat, lng, t.lat, t.lng);
    if (d < bestDist) { bestDist = d; best = t; }
  }
  return best;
}

const result = CAMPGROUNDS.map(c => {
  const nearest = findNearestTown(c.lat, c.lng);
  const cat = categorize(c.name, c.address);
  return {
    name: c.name,
    slug: slugify(c.name),
    category: cat,
    lat: c.lat,
    lng: c.lng,
    nearestTown: nearest.slug,
    nearestTownName: nearest.name,
    address: c.address || null,
    phone: c.phone || null,
    website: c.website || null,
    rating: c.rating || null,
    reviews: c.reviews || null,
  };
}).sort((a, b) => (b.reviews || 0) - (a.reviews || 0));

const outPath = path.join(__dirname, '..', 'data', 'campgrounds.json');
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log(`Wrote ${result.length} campgrounds to ${outPath}`);
console.log(`  KOA: ${result.filter(c=>c.category==='koa').length}`);
console.log(`  State Park: ${result.filter(c=>c.category==='state').length}`);
console.log(`  Public Land: ${result.filter(c=>c.category==='public').length}`);
console.log(`  RV Park: ${result.filter(c=>c.category==='rv').length}`);
console.log(`  Private: ${result.filter(c=>c.category==='private').length}`);
