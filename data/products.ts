export interface ProductVariant {
  size?: string; // Variant size (e.g., "11 oz", "15 oz", "S", "M", "L")
  price: number;
  shopifyVariantId: number; // Shopify product variant ID for checkout
  printfulVariantId?: string; // Printful product variant ID for fulfillment
  inStock: boolean;
  imageSetKey?: string; // Key to link to variant-specific image set in ProductImageGallery
}

export interface Product {
  id: string;
  category: string;
  title: string;
  author: string;
  price: number; // Default/fallback price (use first variant price if variants exist)
  description: string;
  longDescription?: string;
  image: string; // Default/fallback home image
  inStock: boolean;
  badge?: string;
  shopifyVariantId?: number; // Legacy: Shopify product variant ID for checkout (use variants array instead)
  printfulVariantId?: string; // Legacy: Printful product variant ID for fulfillment (use variants array instead)
  variants?: ProductVariant[]; // Array of product variants (size, color, etc.)
  requiresShipping?: boolean; // Whether product requires physical shipping
  fulfillmentProvider?: 'kdp' | 'printful' | 'manual' | 'digital'; // Fulfillment provider
  kdpASIN?: string; // KDP ASIN for Amazon integration
  kdpType?: 'ebook' | 'paperback'; // Type of KDP product
  sizeGuide?: {
    imperial: { [key: string]: { length: string; width: string } };
    metric: { [key: string]: { length: string; width: string } };
  };
  sizeGuideImages?: {
    imperial: string; // Path to imperial size guide image
    metric: string; // Path to metric size guide image
    selector: string; // Path to size selector UI image
  };
}

export const products: Product[] = [
  {
    "id": "A-01",
    "category": "Serials/Books",
    "title": "First & Light- E-book",
    "author": "Aries Tiger",
    "price": 2.99, // KDP price: $2.99 USD (free for Kindle Unlimited subscribers)
    "description": "Stage One- First & Light",
    "longDescription": "We meet Aries Tiger a 'Streeter extraodinaire. He confuses thrill with meaning but is learning how they intertwine. He prefers grey zones over the cut and dry of black and white. We cross paths with the Dancer. Dance is exposing exposure towards safety. Her memories unfolding from a life of trauma is pushing her to dark streets in search of control. They 'Street in style in Prowler a big cat on wheels and a growler that knows the highways and byways of LA's infamous DarkStreets.\r",
    "image": "/product-images/1a_first-light-ebook.jpg",
    "inStock": true,
    "badge": "New",
    "shopifyVariantId": 42143382044770, // CORRECTED: Actual Shopify variant ID for FREE e-book
    "requiresShipping": false,
    "fulfillmentProvider": "kdp",
    "kdpASIN": "B0FDH86NJJ", // E-book ASIN - CORRECTED
    "kdpType": "ebook"
  },
  {
    "id": "A-02",
    "category": "Serials/Books",
    "title": "First & Light- Paperback",
    "author": "Aries Tiger",
    "price": 6.99,
    "description": "Stage One- First & Light",
    "longDescription": "We meet Aries Tiger a 'Streeter extraodinaire. He confuses thrill with meaning but is learning how they intertwine. He prefers grey zones over the cut and dry of black and white. We cross paths with the Dancer. Dance is exposing exposure towards safety. Her memories unfolding from a life of trauma is pushing her to dark streets in search of control. They 'Street in style in Prowler a big cat on wheels and a growler that knows the highways and byways of LA's infamous DarkStreets.\r",
    "image": "/product-images/1a_first-light-PaperBack.jpg",
    "inStock": true,
    "badge": "New",
    "shopifyVariantId": 42146492383330, // CORRECTED: Actual Shopify variant ID for $6.99 paperback
    "requiresShipping": true,
    "fulfillmentProvider": "kdp",
    "kdpASIN": "B0FTX9YQFB", // Paperback ASIN (you found this one)
    "kdpType": "paperback"
  },
  {
    "id": "A-03",
    "category": "Serials/Books",
    "title": "Risque & Safety- E-book",
    "author": "Aries Tiger",
    "price": 4.99, // KDP price: $4.99 USD
    "description": "Stage Two- Risque & Safety",
    "longDescription": "Aries and Dance find graffitti of themselves from the Ruins. The glitched memory is coming back to remind them not only about where they've been but who they are. If only they could remember!?\r",
    "image": "/product-images/2a_risque-safety-ebook.jpg",
    "inStock": true,
    "badge": "New",
    "shopifyVariantId": 42143320866914, // Correct Shopify variant ID for $4.99 e-book
    "requiresShipping": false,
    "fulfillmentProvider": "kdp",
    "kdpASIN": "B0FFZWJ26Q", // E-book ASIN - CORRECTED
    "kdpType": "ebook"
  },
          {
            "id": "T-01",
            "category": "Apparel",
            "title": "DarkStreets Tee - V-Neck",
            "author": "DarkStreets",
            "price": 35.00, // CORRECTED: Match Shopify price
    "description": "Unisex Short Sleeve V-Neck T-Shirt",
    "longDescription": "This unisex tee has a classic v-neck cut and fits like a well-loved favorite. Made from 100% combed ring spun cotton with pre-shrunk fabric. Features side-seamed construction, coverstitched v-neck and hemmed sleeves, and shoulder-to-shoulder taping. Blank product sourced from Nicaragua, Guatemala, or the US.",
    "image": "/product-images/Tees-0.png",
    "inStock": true, // ACTIVE IN SHOPIFY (Updated: 10/31/2025)
    "badge": "New",
    "printfulVariantId": "93425083",
    "shopifyVariantId": 42224116793442, // Shopify Variant ID (Medium size) - Product: 7425246101602 - Verified 10/31/2025
    "requiresShipping": true,
    "sizeGuide": {
      imperial: {
        "XS": { length: "26 ⅛", width: "16 ½" },
        "S": { length: "27 ⅛", width: "18" },
        "M": { length: "28 ⅛", width: "20" },
        "L": { length: "29 ⅛", width: "22" },
        "XL": { length: "30 ⅛", width: "24" },
        "2XL": { length: "31 ⅛", width: "26" }
      },
      metric: {
        "XS": { length: "68", width: "42" },
        "S": { length: "70.5", width: "45.7" },
        "M": { length: "73", width: "50.8" },
        "L": { length: "75.6", width: "55.9" },
        "XL": { length: "78.1", width: "61" },
        "2XL": { length: "80.7", width: "66" }
      }
    },
    "sizeGuideImages": {
      imperial: "/product-images/Tee-SizeGuide-Imp.png",
      metric: "/product-images/Tee-SizeGuide-Metric.png",
      selector: "/product-images/Tee-SizeSelector.png"
    }
  },
  {
    "id": "A-04",
    "category": "Serials/Books",
    "title": "Risque & Safety- Paperback",
    "author": "Aries Tiger",
    "price": 9.99, // KDP price: $9.99 USD (in review, no ASIN yet)
    "description": "Stage Two- Risque & Safety",
    "longDescription": " Aries and Dance find graffitti of themselves from the Ruins. The glitched memory is coming back to remind them not only about where they've been but who they are. If only they could remember!? but who they are. If only they could remember!?\r",
    "image": "/product-images/2a_risque-safety-PaperBack.jpg",
    "inStock": false, // DEACTIVATED - In review, no ASIN yet
    "badge": "Coming Soon",
    "shopifyVariantId": 42146492448866, // CORRECTED: Actual Shopify variant ID for Risque & Safety Paperback
    "requiresShipping": true,
    "fulfillmentProvider": "kdp",
    "kdpASIN": undefined, // No ASIN yet - in review
    "kdpType": "paperback"
  },
  {
    "id": "A-05",
    "category": "Serials/Books",
    "title": "Mercury & Memory- E-book",
    "author": "Aries Tiger",
    "price": 4.99, // KDP price: $4.99 USD
    "description": "Stage Three- Aries is distracted by Dance's slip. Prowler turns a dimensional corner and finds themselves in TheWay station. Iridescent daylight",
    "longDescription": "A low hum and the steering wheel disappearing are just the beginning. Is it TheWay or just a dream? and the steering wheel disappearing are just the beginning. Is it TheWay or just a dream?\r",
    "image": "/product-images/3a_mercury-memory-ebook.jpg",
    "inStock": true,
    "badge": "New",
    "fulfillmentProvider": "kdp",
    "kdpASIN": "B0FKGH8XWP", // E-book ASIN - CORRECTED
    "kdpType": "ebook"
  },
  {
    "id": "A-06",
    "category": "Serials/Books",
    "title": "Mercury & Memory- Paperback",
    "author": "Aries Tiger",
    "price": 9.99, // KDP price: $9.99 USD
    "description": "Stage Three- Aries is distracted by Dance's slip. Prowler turns a dimensional corner and finds themselves in TheWay station. Iridescent daylight",
    "longDescription": "A low hum and the steering wheel disappearing are just the beginning. Is it TheWay or just a dream? and the steering wheel disappearing are just the beginning. Is it TheWay or just a dream?\r",
    "image": "/product-images/3a_mercury-memory-PaperBack.jpg",
    "inStock": true,
    "badge": "New",
    "shopifyVariantId": 42146492547170, // CORRECTED: Actual Shopify variant ID for Mercury & Memory Paperback
    "requiresShipping": true,
    "fulfillmentProvider": "kdp",
    "kdpASIN": "B0FTXBJBVR", // Paperback ASIN - CORRECTED
    "kdpType": "paperback"
  },
  {
    "id": "A-07",
    "category": "Serials/Books",
    "title": "Vol-1 - E-book",
    "author": "Aries Tiger",
    "price": 15.99,
    "description": "Compilation of Stages 1-10 ",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // DEACTIVATED - Not ready for publication
    "badge": "Coming Soon",
    "fulfillmentProvider": "kdp",
    "kdpASIN": undefined, // No ASIN - not published yet
    "kdpType": "ebook"
  },
  {
    "id": "A-08",
    "category": "Serials/Books",
    "title": "Vol-1 - Paperback",
    "author": "Aries Tiger",
    "price": 24.99,
    "description": "Compilation of Stages 1-10 ",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // DEACTIVATED - Not ready for publication
    "badge": "Coming Soon",
    "fulfillmentProvider": "kdp",
    "kdpASIN": undefined, // No ASIN - not published yet
    "kdpType": "paperback"
  },
  {
    "id": "B-01",
    "category": "Apparel & Intimate Wear",
    "title": "DarkStreet Panties",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Printed quotes Still here.  You smell like asphalt",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "B-02",
    "category": "Apparel & Intimate Wear",
    "title": "Mesh Bodysuits",
    "author": "DS LLC",
    "price": 24.99,
    "description": "\"Inspired by Dancer's wardrobe with \"\"Streetin\"\" detailing.\"",
    "longDescription": "\r",
    "image": "/product-images/A2_mesh-bodysuits.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "B-03",
    "category": "Apparel & Intimate Wear",
    "title": "Asphalt Black Denim Jackets",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Denim with hidden pocket sleeves.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "B-05",
    "category": "Apparel & Intimate Wear",
    "title": "Silk Scarves",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Graffiti-tagged street names (Memory & Mercury).",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "B-06",
    "category": "Apparel & Intimate Wear",
    "title": "Boxers",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Blackout: No Eyes No Rules print inside the waistband.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "B-07",
    "category": "Apparel & Intimate Wear",
    "title": "Tank Tops (Men/Women)",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Ribbed rib-cage hugging with DS tattoos or maplines",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "B-08",
    "category": "Apparel & Intimate Wear",
    "title": "DarkStreets' Otto Cap",
    "author": "DS LLC",
    "price": 22.00, // Printful retail price: $22
    "description": "Premium 6-Panel Low Profile Garment Washed Cotton Twill Dad Hat",
    "longDescription": "Embrace the essence of the streets with the DarkStreets Otto Cap 18-772. This premium 6-panel, low-profile dad hat is crafted from garment-washed cotton twill, offering a comfortable, broken-in feel from day one. Featuring the iconic DarkStreets logo with a sleek car silhouette, it's the perfect accessory to showcase your style and passion for the urban landscape. Durable, stylish, and effortlessly cool, this cap is designed for those who live and breathe the DarkStreets vibe. The classic dad hat profile sits comfortably while making a bold statement about your connection to the streets.\r",
    "image": "/product-images/otto-cap-18-772-black-front-690e44034c5ed.jpg", // New Printful mock-up - Front view (HOME IMAGE)
    "inStock": true, // ACTIVE IN SHOPIFY - Printful product (Updated: 10/31/2025)
    "badge": "New",
    "shopifyVariantId": 42283613552738, // Shopify Variant ID (Product: 7448102666338) - Verified 10/31/2025
    "printfulVariantId": "8178204_24534", // Printful SKU
    "fulfillmentProvider": "printful",
    "requiresShipping": true
  },
  {
    "id": "H-06",
    "category": "Culinary & Novelty",
    "title": "Streeter Mug",
    "author": "DS LLC",
    "price": 12.00, // Default to 11 oz variant - Product: 7448146477154
    "description": "Black Glossy Mug - This cupboard essential is sturdy, sleek, and perfect for your morning java or afternoon tea.",
    "longDescription": "This cupboard essential is sturdy, sleek, and perfect for your morning java or afternoon tea. Features ceramic construction, lead and BPA-free material, glossy finish, and is dishwasher and microwave safe. Available in 11 oz and 15 oz sizes.",
    "image": "/product-images/black-glossy-mug-black-11-oz-front-690e36e668bb4.jpg", // Default home image (11 oz)
    "inStock": true, // ACTIVE IN SHOPIFY - Published with "Home page" collection - ✅ CHECKOUT WORKS!
    "badge": "New",
    "shopifyVariantId": 42284001329250, // Legacy: Shopify Variant ID (11 oz) - Product: 7448146477154 - Verified 10/31/2025
    "printfulVariantId": "6360577_9323", // Legacy: Printful SKU (11 oz)
    "variants": [
      {
        "size": "11 oz",
        "price": 12.00,
        "shopifyVariantId": 42284001329250, // Shopify Variant ID (11 oz) - Product: 7448146477154 - Verified 10/31/2025
        "printfulVariantId": "6360577_9323", // Printful SKU (11 oz)
        "inStock": true,
        "imageSetKey": "H-06-11oz" // Key for variant-specific images
      },
      {
        "size": "15 oz",
        "price": 13.50, // Verified from Shopify Admin - Product: 7448146477154
        "shopifyVariantId": 42284001362018, // Shopify Variant ID (15 oz) - Product: 7448146477154 - Verified 11/7/2025
        "printfulVariantId": "6360577_9324", // Printful SKU (15 oz)
        "inStock": true,
        "imageSetKey": "H-06-15oz" // Key for variant-specific images
      }
    ],
    "fulfillmentProvider": "printful",
    "requiresShipping": true
  },
  {
    "id": "M-01",
    "category": "Vehicle Accessories",
    "title": "StreeterMagnet",
    "author": "DS LLC",
    "price": 8.50, // Printful retail price: $8.50 - Product: 7448341971042
    "description": "Bumper Magnet - Add your vibe to your ride with this sleek magnetic decal. These car magnets stick strong and stay sharp—rain or shine.",
    "longDescription": "Add your vibe to your ride with this sleek magnetic decal. These car magnets stick strong and stay sharp—rain or shine. With a matte finish, they're made to last and swap around as often as your mood changes. Features 100% vinyl construction, matte finish, black magnetic backing, and weather-resistant design. Blank product sourced from the US. Perfect for showcasing your DarkStreets connection on any metal surface.",
    "image": "/product-images/car-magnets-white-10x3-front-690e315a31d57.png", // Primary front view image (HOME IMAGE)
    "inStock": true, // ACTIVE IN SHOPIFY - Published with "Home page" and "All Current Available Products" collections
    "badge": "New",
    "shopifyVariantId": 7448341971042, // Shopify Variant ID - Product: 7448341971042 - Verified 11/1/2025
    "printfulVariantId": undefined, // TBD - Check if Printful product
    "fulfillmentProvider": "printful", // Confirmed Printful product
    "requiresShipping": true
  },
  {
    "id": "B-09",
    "category": "Apparel & Intimate Wear",
    "title": "Limited-Edition Hoodies",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Inside lining printed with scene excerpts.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "B-10",
    "category": "Apparel & Intimate Wear",
    "title": "Convertible Wrap Dresses",
    "author": "DS LLC",
    "price": 24.99,
    "description": "From streetlight to backseat.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "C-01",
    "category": "Auto & Mobility",
    "title": "Custom LED Underlighting Kits",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Streeter Mode with remote noir hues.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "C-02",
    "category": "Auto & Mobility",
    "title": "DarkStreet Branded Scent Diffusers",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Prowlers Leather  Bleach & Bourbon.",
    "longDescription": "\r",
    "image": "/product-images/B2_Dark-Streets-Scent-Diffusers.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New",
    "shopifyVariantId": 42143321325666, // Using Dark Street Mugs variant (same price)
    "requiresShipping": true
  },
  {
    "id": "C-03",
    "category": "Auto & Mobility",
    "title": "Window Shades",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Shades printed with silhouettes of Dancer mid-pirouette and iconic car kisses.",
    "longDescription": "\r",
    "image": "/product-images/B3_window-shades.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "C-04",
    "category": "Auto & Mobility",
    "title": "Prowler Dashboard Confessionals",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Recordable voice note keychains.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "C-05",
    "category": "Auto & Mobility",
    "title": "Seatbelt Harness Covers",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Embroidered with Feel the Wind. Follow the Heat.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "C-06",
    "category": "Auto & Mobility",
    "title": "Streetin' Survival Kits",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Mini Travel packs with wipes condoms pepper spray gum.",
    "longDescription": "\r",
    "image": "/product-images/D6_neon-light-wall-signs.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "C-07",
    "category": "Auto & Mobility",
    "title": "Mirror Charms",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Tiny dancers streetlight beads black feathers.",
    "longDescription": "\r",
    "image": "/product-images/B7_mirror-charms.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "C-08",
    "category": "Auto & Mobility",
    "title": " Erotic & Mystery-Inspired",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Glovebox Zines Micro-stories printed like erotic manuals.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "C-09",
    "category": "Auto & Mobility",
    "title": "Custom Vanity Plate Frames",
    "author": "DS LLC",
    "price": 24.99,
    "description": "No Rules After Midnight.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "C-10",
    "category": "Auto & Mobility",
    "title": "Backseat Throw Blankets",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Stealthy black embroidered with moon phases.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "C-11",
    "category": "Accessories",
    "title": "DS-Card Sets - Lamp Post Set",
    "author": "DS LLC",
    "price": 12.99,
    "description": "Hand-crafted confess and dare cards. Explore sultry opportunities of asking and answering provocative questions.",
    "longDescription": "Step into the shadows of DarkStreets with our exclusive Street-Set hand-crafted cards designed for those who dare to explore the edges of desire and confession. Each of the 3 sets contains 20 beautifully designed cards featuring provocative questions that blur the lines between curiosity and temptation.  \r\n\r\n In the Street-Set the three sample questions are revealed, offering a glimpse into the sultry world of DarkStreets: \"Who in this group could talk you into Trouble?\", \"What's One Thing you've done just to feel Dangerous?\", and \"Compliment someone, but make it sound like an Insult\" (Dare). The remaining 17 mystery questions await discovery, each question is carefully crafted to spark intimate conversations and reveal hidden desires.\r\n\r\nThese cards are hand-made in the DarkStreets roadside factory by 'Streeters Ink, ensuring each set is uniquely authentic laced with DarkStreet allure. Perfect for intimate gatherings, late-night adventures, or anyone seeking to explore the deeper, more provocative side of connection.\r\n\r\nEach set includes 20 unique cards featuring a mix of \"Confess\" and \"Dare\" prompts, designed to challenge the knights.\r",
    "image": "/product-images/C-11_ds-card-sets.png", // Home image (lead photo showing all 3 sets)
    "inStock": true,
    "badge": "New",
    "fulfillmentProvider": "manual",
    "requiresShipping": true
  },
  {
    "id": "C-12",
    "category": "Accessories",
    "title": "DS-Card Sets - Streeter Set",
    "author": "DS LLC",
    "price": 12.99,
    "description": "Hand-crafted confession and dare game cards. Explore sultry opportunities of asking and answering provocative questions.",
    "longDescription": "Step into the shadows of DarkStreets with our exclusive Streeter Set—hand-crafted game cards designed for those who dare to explore the edges of desire and confession. Each set contains 20 beautifully designed cards featuring provocative questions that blur the lines between curiosity and temptation.\r\n\r\nThree sample questions are revealed, offering a glimpse into the sultry world of DarkStreets: \"What's the Riskiest Place you've ever Fooled around?\", \"What was your first 'real' moment of Desire?\", and \"Who here would make the Best Partner-n-Crime?\". The remaining 17 mystery questions await discovery, each one carefully crafted to spark intimate conversations and reveal hidden desires.\r\n\r\nThese cards are hand-made in the DarkStreets roadside factory by 'Streeters Ink, ensuring each set is unique and crafted with the authentic DarkStreets aesthetic. Perfect for intimate gatherings, late-night adventures, or anyone seeking to explore the deeper, more provocative side of connection.\r\n\r\nEach set includes 20 cards featuring a mix of \"Confess\" and \"Dare\" prompts, designed to create sultry opportunities for asking and answering questions that push boundaries and ignite passion.\r",
    "image": "/product-images/C-11_ds-card-sets.png", // Home image (lead photo showing all 3 sets) - Update when C-12 images available
    "inStock": true,
    "badge": "New",
    "fulfillmentProvider": "manual",
    "requiresShipping": true
  },
  {
    "id": "C-13",
    "category": "Accessories",
    "title": "DS-Card Sets - After-Hours Set",
    "author": "DS LLC",
    "price": 12.99,
    "description": "Hand-crafted confession and dare game cards. Explore sultry opportunities of asking and answering provocative questions.",
    "longDescription": "Step into the shadows of DarkStreets with our exclusive After-Hours Set—hand-crafted game cards designed for those who dare to explore the edges of desire and confession. Each set contains 20 beautifully designed cards featuring provocative questions that blur the lines between curiosity and temptation.\r\n\r\nThree sample questions are revealed, offering a glimpse into the sultry world of DarkStreets: \"Who here would you trust with your biggest Secret?\", \"What would be the Title of your Romance Movie?\", and \"Describe a drive-time when fear and excitement blurred together. What Happened?\". The remaining 17 mystery questions await discovery, each one carefully crafted to spark intimate conversations and reveal hidden desires.\r\n\r\nThese cards are hand-made in the DarkStreets roadside factory by 'Streeters Ink, ensuring each set is unique and crafted with the authentic DarkStreets aesthetic. Perfect for intimate gatherings, late-night adventures, or anyone seeking to explore the deeper, more provocative side of connection.\r\n\r\nEach set includes 20 cards featuring a mix of \"Confess\" and \"Dare\" prompts, designed to create sultry opportunities for asking and answering questions that push boundaries and ignite passion.\r",
    "image": "/product-images/C-11_ds-card-sets.png", // Home image (lead photo showing all 3 sets) - Update when C-13 images available
    "inStock": true,
    "badge": "New",
    "fulfillmentProvider": "manual",
    "requiresShipping": true
  },
  {
    "id": "D-01",
    "category": "Accessories",
    "title": "Retro Noir Sunglass Series",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Aries Blackout & Dancer Glare",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "D-02",
    "category": "Accessories",
    "title": "Cigarette Case Wallets",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Matte black engraved with DS quotes.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "D-03",
    "category": "Accessories",
    "title": "Lighter Collabs",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Zippo-style with scene titles etched in chrome.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "D-04",
    "category": "Accessories",
    "title": "Silicone Wristbands",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Phrases like Bangin Joy Outta Satisfaction.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "D-05",
    "category": "Accessories",
    "title": "Temporary Tattoos",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Noir symbols quotes GPS coordinates.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "D-06",
    "category": "Accessories",
    "title": "Embroidered Patches",
    "author": "DS LLC",
    "price": 24.99,
    "description": "We Rehearse in the Ruins DSA Memory+Mercury.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "D-07",
    "category": "Accessories",
    "title": "Knuckle Rings",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Engraved with single words: Risk. Safety. Lust. Control.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "D-08",
    "category": "Accessories",
    "title": "Graffiti Street Tag Stickers",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Stickers for sticking",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "D-09",
    "category": "Accessories",
    "title": "Leather Keychains",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Still Thinking? & car outline silhouettes.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "D-10",
    "category": "Accessories",
    "title": "Dashboard Candles",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Featuring neon saints of the street on suction cups",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-01",
    "category": "Home & Mood & Atmosphere",
    "title": "DS Scented Candle Collection",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Featuring the scent of the street in mason jars",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-02",
    "category": "Home & Mood & Atmosphere",
    "title": "Asphalt & Aftershave",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Featuring the scent of the street in mason jars",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-03",
    "category": "Home & Mood & Atmosphere",
    "title": "Coconut & Gin",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Featuring the scent of the street in mason jars",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-04",
    "category": "Home & Mood & Atmosphere",
    "title": "Midnight Bleach",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Featuring the scent of the street in mason jars",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-05",
    "category": "Home & Mood & Atmosphere",
    "title": "Prowler Interior: '69 Edition",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Featuring the scent of the street in mason jars",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-06",
    "category": "Home & Mood & Atmosphere",
    "title": "Neon Light Wall Signs",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Phrases: Youre Art Feel the Wind.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-07",
    "category": "Home & Mood & Atmosphere",
    "title": "Backseat Room Fragrance",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Erotic scents from afar",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-08",
    "category": "Home & Mood & Atmosphere",
    "title": "Moonlight Noir Projection Lamps",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Cast your city's skyline to  silhouette your ceiling. (LA NYC CHI)",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-09",
    "category": "Home & Mood & Atmosphere",
    "title": "Soundscape Machines",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Prowler engine purr soft panting vinyl crackle.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-10",
    "category": "Home & Mood & Atmosphere",
    "title": "Secret-Safe Lamps",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Stash drawers + noir glow w/silhouette of dancer.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-11",
    "category": "Home & Mood & Atmosphere",
    "title": "Erotic Tarot Decks",
    "author": "DS LLC",
    "price": 24.99,
    "description": "DS themes: 'The Driver'  'The Dancer' 'The Signal'.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-12",
    "category": "Home & Mood & Atmosphere",
    "title": "Streetlight Bath Bombs",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Dissolve into deep shadowy hues. Mist in a bottle.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-13",
    "category": "Home & Mood & Atmosphere",
    "title": "Art Prints",
    "author": "DS LLC",
    "price": 24.99,
    "description": "High-contrast car scenes dancers in streetlight halos.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "E-14",
    "category": "Home & Mood & Atmosphere",
    "title": "Tabletop Graffiti Sets",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Chalk spray and DS stencils for home art.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "F-01",
    "category": "Media & Experiences",
    "title": "Official DarkStreet Driving Playlists",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Spotify/Apple collabs.",
    "longDescription": "\r",
    "image": "/product-images/E1_Official Dark Streets Driving Playlists.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "F-02",
    "category": "Media & Experiences",
    "title": "Guided Driving Meditation Audio",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Become the Car. Be the Curve.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "F-03",
    "category": "Media & Experiences",
    "title": "Erotic & Mystery-Inspired",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Erotic Soundtracks Lo-fi noir beats + DS dialogue intercuts.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "F-04",
    "category": "Media & Experiences",
    "title": "Interactive Audio Zines",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Choose-your-own-street drama.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "F-05",
    "category": "Media & Experiences",
    "title": "Midnight Poetry Readings",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Digital or IRL read by the characters.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "F-06",
    "category": "Media & Experiences",
    "title": "DS Short Film Anthology",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Episodes adapted from key scenes.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "F-07",
    "category": "Media & Experiences",
    "title": "Voice Memos from Aries or Dancer",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Digital experience & memorabilia",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "F-08",
    "category": "Media & Experiences",
    "title": "Car Sex Safety Course",
    "author": "DS LLC",
    "price": 24.99,
    "description": "cheeky online video/ebook for adventurous fans.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "F-09",
    "category": "Media & Experiences",
    "title": "Digital 'Rehearse in the Ruins'",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Photo Filters (like stickers as overlay to photos)",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "F-10",
    "category": "Media & Experiences",
    "title": "DSA: DarkStreeters Anonymous Newsletter",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Curated confessions.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "G-01",
    "category": "Digital & Curated Services",
    "title": "'DS Route Generator' App",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Find the darkest streets in your city.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "G-02",
    "category": "Digital & Curated Services",
    "title": "'Streetin' Score' AI Tool",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Analyze your mood suggest music + scent + route",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "G-03",
    "category": "Digital & Curated Services",
    "title": "Digital Streetlight Flash Fiction Pack",
    "author": "DS LLC",
    "price": 24.99,
    "description": "50 micro-tales unlocked by GPS.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "G-04",
    "category": "Digital & Curated Services",
    "title": "Text Message Confessional Subscription",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Daily noir thoughts or quotes.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "G-05",
    "category": "Digital & Curated Services",
    "title": "Augmented Reality Scene Overlays",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Point your phone at an alley watch DS unfold.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "G-06",
    "category": "Digital & Curated Services",
    "title": "Chatbot Roleplay with Aries or Dancer",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Text-based storytelling.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "G-07",
    "category": "Digital & Curated Services",
    "title": "Custom Memory Erasure Generator",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Write the memory you'd street away. Etchasketch shakabily",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "H-01",
    "category": "Culinary & Novelty",
    "title": "'Noir-ade' Beverages",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Black lemon tonic bittersweet gin mocktails.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "H-03",
    "category": "Culinary & Novelty",
    "title": "'Confession Shots' Kits",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Mini glass bottles labeled by mood.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "H-04",
    "category": "Culinary & Novelty",
    "title": "Streetlight Ice Cubes",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Glow LED cubes for drinks.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "H-05",
    "category": "Culinary & Novelty",
    "title": "Prowler Flask Kit",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Curved black flask + secret shot vial.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "I-01",
    "category": "Collector & Art-Based",
    "title": "Limited-Edition Zines",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Alternate POV stories or Aries' and Dancer's private journals.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "I-02",
    "category": "Collector & Art-Based",
    "title": "Graphic Novella Box Sets",
    "author": "DS LLC",
    "price": 24.99,
    "description": "illustrated DS episodes.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "I-03",
    "category": "Collector & Art-Based",
    "title": "Hand-Numbered Prints of DS Street Maps",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Each a unique and abstract routes through North Hollywood.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "I-04",
    "category": "Collector & Art-Based",
    "title": "Collectible Character Cards",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Noir RPG-style attributes and secrets.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "I-05",
    "category": "Collector & Art-Based",
    "title": "DS Polaroid Sets",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Found-footage style shots from iconic scenes.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "I-06",
    "category": "Collector & Art-Based",
    "title": "Tactile Memory Packs",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Scent swatches texture cards audio clips.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "I-07",
    "category": "Collector & Art-Based",
    "title": "Backseat Diorama Kits",
    "author": "DS LLC",
    "price": 24.99,
    "description": "For display collectors (adult and subtle).",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "J-01",
    "category": "Live & Social Activation",
    "title": "Backseat Theater Box",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Couple's improv prompt cards for car confessionals.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "J-02",
    "category": "Live & Social Activation",
    "title": "'Memory & Mercury' Scavenger Hunt",
    "author": "DS LLC",
    "price": 24.99,
    "description": "City-based DS clues",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "J-03",
    "category": "Live & Social Activation",
    "title": "Pop-Up Confession Booths",
    "author": "DS LLC",
    "price": 24.99,
    "description": "DS-branded limited times/locations.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "J-04",
    "category": "Live & Social Activation",
    "title": "Streetlight Salons",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Exclusive story readings at dive bars",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "J-05",
    "category": "Live & Social Activation",
    "title": "Backseat Photo Booth Pop-Ups",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Create your own DS scene.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "J-06",
    "category": "Live & Social Activation",
    "title": "Custom Drive-In Screenings",
    "author": "DS LLC",
    "price": 24.99,
    "description": "DS visual mixtapes + merch trucks.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "K-01",
    "category": "Relationship & Erotic & Mystery-Inspired",
    "title": "DS Bedroom Dice",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Window fog' 'Dash grip' 'Soft scream.'",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "K-02",
    "category": "Relationship & Erotic & Mystery-Inspired",
    "title": "Lovers Game",
    "author": "DS LLC",
    "price": 24.99,
    "description": "'What Are You Seeing?'  poetic prompt cards.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "K-03",
    "category": "Relationship & Erotic & Mystery-Inspired",
    "title": "Anonymous Drop Letters",
    "author": "DS LLC",
    "price": 24.99,
    "description": "prewritten mystery notes to leave behind.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "K-04",
    "category": "Relationship & Erotic & Mystery-Inspired",
    "title": "Stolen Glance Mirrors",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Vanity mirrors etched with sensual prompts.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "K-05",
    "category": "Relationship & Erotic & Mystery-Inspired",
    "title": "Aries' Burner Phone Prop Replica",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Flip-phone with auto-loaded audio drops.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "K-06",
    "category": "Relationship & Erotic & Mystery-Inspired",
    "title": "DS Mood Ring Keychains",
    "author": "DS LLC",
    "price": 24.99,
    "description": "Noir hues reflect emotional temp.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "K-07",
    "category": "Relationship & Erotic & Mystery-Inspired",
    "title": "Journals",
    "author": "DS LLC",
    "price": 24.99,
    "description": "'Crash Like You Mean It' with Cover Art",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "K-08",
    "category": "Relationship & Erotic & Mystery-Inspired",
    "title": "Customizable Digital Memory Vaults",
    "author": "DS LLC",
    "price": 24.99,
    "description": "USB drives with encrypted secret stories/visuals.",
    "longDescription": "\r",
    "image": "/product-images/placeholder.jpg",
    "inStock": false, // MOVED TO DRAFT IN SHOPIFY,
    "badge": "New"
  },
  {
    "id": "T-02",
    "category": "Apparel & Intimate Wear",
    "title": "Dancer's Tee",
    "author": "DS LLC",
    "price": 35.00, // Default to Small variant price
    "description": "Move like a secret in our Dancer's Tee. Every glance a dare, every step a confession. This unisex V-neck tee features a dynamic ballerina graphic on the front and the empowering Dark Streets message on the back.",
    "longDescription": "Express your passion for movement with the Dancer's Tee. This unisex V-neck t-shirt features a striking ballerina silhouette graphic on the front, set against a vibrant orange and white abstract background with the word 'Dance' elegantly scripted. The back showcases the powerful Dark Streets message: 'Move like a Secret, Every Glance a Dare, Every Step a Confession' within a bold circular design. Made from soft, breathable fabric with a classic V-neck cut, this tee offers comfort and style for everyday wear. Perfect for those who live to dance and move with purpose.",
    "image": "/product-images/unisex-v-neck-tee-dark-grey-heather-front-69091886bda87.jpg", // Default home image
    "inStock": true,
    "badge": "New",
    "shopifyVariantId": 42288984588386, // Legacy: Shopify Variant ID (Small) - Default
    "variants": [
      {
        "size": "Small",
        "price": 35.00,
        "shopifyVariantId": 42288984588386, // Shopify Variant ID (Small) - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-02" // Key for variant-specific images
      },
      {
        "size": "Medium",
        "price": 35.00,
        "shopifyVariantId": 42288984621154, // Shopify Variant ID (Medium) - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-02" // Key for variant-specific images
      },
      {
        "size": "Large",
        "price": 35.00,
        "shopifyVariantId": 42288984653922, // Shopify Variant ID (Large) - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-02" // Key for variant-specific images
      },
      {
        "size": "XL",
        "price": 35.00,
        "shopifyVariantId": 42288984686690, // Shopify Variant ID (XL) - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-02" // Key for variant-specific images
      },
      {
        "size": "2XL",
        "price": 38.00, // Verified from Shopify Admin - Different price for 2XL
        "shopifyVariantId": 42288984719458, // Shopify Variant ID (2XL) - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-02" // Key for variant-specific images
      }
    ],
    "fulfillmentProvider": "printful",
    "requiresShipping": true,
    "sizeGuide": {
      imperial: {
        "XS": { length: "26 ⅛", width: "16 ½" },
        "S": { length: "27 ⅛", width: "18" },
        "M": { length: "28 ⅛", width: "20" },
        "L": { length: "29 ⅛", width: "22" },
        "XL": { length: "30 ⅛", width: "24" },
        "2XL": { length: "31 ⅛", width: "26" }
      },
      metric: {
        "XS": { length: "68", width: "42" },
        "S": { length: "70.5", width: "45.7" },
        "M": { length: "73", width: "50.8" },
        "L": { length: "75.6", width: "55.9" },
        "XL": { length: "78.1", width: "61" },
        "2XL": { length: "80.7", width: "66" }
      }
    },
    "sizeGuideImages": {
      imperial: "/product-images/Tee-SizeGuide-Imp.png",
      metric: "/product-images/Tee-SizeGuide-Metric.png",
      selector: "/product-images/Tee-SizeSelector.png"
    }
  },
  {
    "id": "T-03",
    "category": "Apparel & Intimate Wear",
    "title": "Streeter Tee",
    "author": "DS LLC",
    "price": 26.00, // Default to Small variant price
    "description": "Hit the streets in style with the Streeter Tee. Featuring the iconic Dark Streets design with a classic car and vintage street lamp, this crew-neck tee embodies the spirit of the open road.",
    "longDescription": "Show your Dark Streets pride with the Streeter Tee. This crew-neck t-shirt features a bold rectangular graphic showcasing the classic Dark Streets design: a vintage street lamp casting its glow, the iconic 'Dark Streets' text in stylized red and white fonts, and a classic convertible sports car in motion. The back features a striking circular design with a vintage street lamp graphic. Made from soft, breathable fabric, this tee is perfect for everyday wear. Available in sizes from Small to 4XL.",
    "image": "/product-images/unisex-staple-t-shirt-black-heather-front-690eec6373405.jpg", // Default home image (Streeter Tee)
    "inStock": true,
    "badge": "New",
    "shopifyVariantId": 42299748384866, // Legacy: Shopify Variant ID (Small) - Default
    "variants": [
      {
        "size": "Small",
        "price": 26.00,
        "shopifyVariantId": 42299748384866, // Shopify Variant ID (Small) - Product: 7455140216930 - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-03" // Key for variant-specific images
      },
      {
        "size": "Medium",
        "price": 26.00,
        "shopifyVariantId": 42299748417634, // Shopify Variant ID (Medium) - Product: 7455140216930 - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-03" // Key for variant-specific images
      },
      {
        "size": "Large",
        "price": 26.00,
        "shopifyVariantId": 42299748450402, // Shopify Variant ID (Large) - Product: 7455140216930 - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-03" // Key for variant-specific images
      },
      {
        "size": "XL",
        "price": 26.00,
        "shopifyVariantId": 42299748483170, // Shopify Variant ID (XL) - Product: 7455140216930 - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-03" // Key for variant-specific images
      },
      {
        "size": "2XL",
        "price": 28.00, // Verified from Shopify Admin - Different price for 2XL
        "shopifyVariantId": 42299748515938, // Shopify Variant ID (2XL) - Product: 7455140216930 - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-03" // Key for variant-specific images
      },
      {
        "size": "3XL",
        "price": 30.00, // Verified from Shopify Admin - Different price for 3XL
        "shopifyVariantId": 42299748548706, // Shopify Variant ID (3XL) - Product: 7455140216930 - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-03" // Key for variant-specific images
      },
      {
        "size": "4XL",
        "price": 32.50, // Verified from Shopify Admin - Different price for 4XL
        "shopifyVariantId": 42299748581474, // Shopify Variant ID (4XL) - Product: 7455140216930 - Verified 11/7/2025
        "inStock": true,
        "imageSetKey": "T-03" // Key for variant-specific images
      }
    ],
    "fulfillmentProvider": "printful",
    "requiresShipping": true,
    "sizeGuide": {
      imperial: {
        "XS": { length: "26 ⅛", width: "16 ½" },
        "S": { length: "27 ⅛", width: "18" },
        "M": { length: "28 ⅛", width: "20" },
        "L": { length: "29 ⅛", width: "22" },
        "XL": { length: "30 ⅛", width: "24" },
        "2XL": { length: "31 ⅛", width: "26" },
        "3XL": { length: "32 ⅛", width: "28" },
        "4XL": { length: "33 ⅛", width: "30" }
      },
      metric: {
        "XS": { length: "68", width: "42" },
        "S": { length: "70.5", width: "45.7" },
        "M": { length: "73", width: "50.8" },
        "L": { length: "75.6", width: "55.9" },
        "XL": { length: "78.1", width: "61" },
        "2XL": { length: "80.7", width: "66" },
        "3XL": { length: "83.2", width: "71.1" },
        "4XL": { length: "85.7", width: "76.2" }
      }
    },
    "sizeGuideImages": {
      imperial: "/product-images/Tee-SizeGuide-Imp.png",
      metric: "/product-images/Tee-SizeGuide-Metric.png",
      selector: "/product-images/Tee-SizeSelector.png"
    }
  }
];