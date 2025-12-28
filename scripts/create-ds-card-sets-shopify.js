/**
 * CREATE DS-CARD SETS IN SHOPIFY
 * Creates three card set products in Shopify with DSLLC supplier configuration
 * Shipping from 90732 zip code with 3-5 day US rate
 */

const SHOPIFY_STORE_DOMAIN = 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';
const SHOPIFY_API_VERSION = '2024-10';

// Shipping origin zip code
const SHIPPING_ORIGIN_ZIP = '90732';

// Product data for the three card sets
const cardSets = [
  {
    dsId: 'C-11',
    title: 'DS-Card Sets - Lamp Post Set',
    description: 'Hand-crafted confession and dare game cards. Explore sultry opportunities of asking and answering provocative questions.',
    longDescription: 'Step into the shadows of DarkStreets with our exclusive Lamp Post Set—hand-crafted game cards designed for those who dare to explore the edges of desire and confession. Each set contains 20 beautifully designed cards featuring provocative questions that blur the lines between curiosity and temptation.\n\nThree sample questions are revealed, offering a glimpse into the sultry world of DarkStreets: "Who in this group could talk you into Trouble?", "What\'s One Thing you\'ve done just to feel Dangerous?", and "Compliment someone, but make it sound like an Insult" (Dare). The remaining 17 mystery questions await discovery, each one carefully crafted to spark intimate conversations and reveal hidden desires.\n\nThese cards are hand-made in the DarkStreets roadside factory by \'Streeters Ink, ensuring each set is unique and crafted with the authentic DarkStreets aesthetic. Perfect for intimate gatherings, late-night adventures, or anyone seeking to explore the deeper, more provocative side of connection.\n\nEach set includes 20 cards featuring a mix of "Confess" and "Dare" prompts, designed to create sultry opportunities for asking and answering questions that push boundaries and ignite passion.',
    price: '12.99',
    sku: 'DS-CARD-LAMP-POST',
    weight: 0.2, // Weight in kg (approximately 0.2kg for a deck of cards)
    tags: ['dsllc', 'manual', 'games', 'cards', 'lamp-post-set', 'new', 'handmade']
  },
  {
    dsId: 'C-12',
    title: 'DS-Card Sets - Streeter Set',
    description: 'Hand-crafted confession and dare game cards. Explore sultry opportunities of asking and answering provocative questions.',
    longDescription: 'Step into the shadows of DarkStreets with our exclusive Streeter Set—hand-crafted game cards designed for those who dare to explore the edges of desire and confession. Each set contains 20 beautifully designed cards featuring provocative questions that blur the lines between curiosity and temptation.\n\nThree sample questions are revealed, offering a glimpse into the sultry world of DarkStreets: "What\'s the Riskiest Place you\'ve ever Fooled around?", "What was your first \'real\' moment of Desire?", and "Who here would make the Best Partner-n-Crime?". The remaining 17 mystery questions await discovery, each one carefully crafted to spark intimate conversations and reveal hidden desires.\n\nThese cards are hand-made in the DarkStreets roadside factory by \'Streeters Ink, ensuring each set is unique and crafted with the authentic DarkStreets aesthetic. Perfect for intimate gatherings, late-night adventures, or anyone seeking to explore the deeper, more provocative side of connection.\n\nEach set includes 20 cards featuring a mix of "Confess" and "Dare" prompts, designed to create sultry opportunities for asking and answering questions that push boundaries and ignite passion.',
    price: '12.99',
    sku: 'DS-CARD-STREETER',
    weight: 0.2,
    tags: ['dsllc', 'manual', 'games', 'cards', 'streeter-set', 'new', 'handmade']
  },
  {
    dsId: 'C-13',
    title: 'DS-Card Sets - After-Hours Set',
    description: 'Hand-crafted confession and dare game cards. Explore sultry opportunities of asking and answering provocative questions.',
    longDescription: 'Step into the shadows of DarkStreets with our exclusive After-Hours Set—hand-crafted game cards designed for those who dare to explore the edges of desire and confession. Each set contains 20 beautifully designed cards featuring provocative questions that blur the lines between curiosity and temptation.\n\nThree sample questions are revealed, offering a glimpse into the sultry world of DarkStreets: "Who here would you trust with your biggest Secret?", "What would be the Title of your Romance Movie?", and "Describe a drive-time when fear and excitement blurred together. What Happened?". The remaining 17 mystery questions await discovery, each one carefully crafted to spark intimate conversations and reveal hidden desires.\n\nThese cards are hand-made in the DarkStreets roadside factory by \'Streeters Ink, ensuring each set is unique and crafted with the authentic DarkStreets aesthetic. Perfect for intimate gatherings, late-night adventures, or anyone seeking to explore the deeper, more provocative side of connection.\n\nEach set includes 20 cards featuring a mix of "Confess" and "Dare" prompts, designed to create sultry opportunities for asking and answering questions that push boundaries and ignite passion.',
    price: '12.99',
    sku: 'DS-CARD-AFTER-HOURS',
    weight: 0.2,
    tags: ['dsllc', 'manual', 'games', 'cards', 'after-hours-set', 'new', 'handmade']
  }
];

async function createShopifyProduct(cardSet) {
  const productData = {
    product: {
      title: cardSet.title,
      body_html: `<p>${cardSet.description}</p><p>${cardSet.longDescription.replace(/\n/g, '</p><p>')}</p>`,
      vendor: 'DSLLC', // Supplier set to DSLLC
      product_type: 'Accessories',
      status: 'active',
      published_scope: 'web',
      tags: cardSet.tags.join(', '),
      variants: [{
        title: 'Default Title',
        price: cardSet.price,
        sku: cardSet.sku,
        inventory_quantity: 999, // High inventory for manual fulfillment
        inventory_management: 'shopify',
        inventory_policy: 'deny',
        fulfillment_service: 'manual', // Manual fulfillment by DSLLC
        requires_shipping: true,
        taxable: true,
        weight: cardSet.weight,
        weight_unit: 'kg',
        option1: 'Default Title'
      }],
      options: [{
        name: 'Title',
        values: ['Default Title']
      }]
    }
  };

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/products.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
        },
        body: JSON.stringify(productData)
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const result = await response.json();
    return {
      success: true,
      product: result.product,
      variant: result.product.variants[0]
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function addProductToCollection(productId, collectionHandle = 'home-page') {
  try {
    // First, get the collection ID
    const collectionsResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/collections.json?handle=${collectionHandle}`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
        }
      }
    );

    if (!collectionsResponse.ok) {
      console.log(`⚠️  Could not find collection: ${collectionHandle}`);
      return false;
    }

    const collectionsData = await collectionsResponse.json();
    if (!collectionsData.collections || collectionsData.collections.length === 0) {
      console.log(`⚠️  Collection not found: ${collectionHandle}`);
      return false;
    }

    const collectionId = collectionsData.collections[0].id;

    // Add product to collection
    const addResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/collections/${collectionId}/products.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
        },
        body: JSON.stringify({
          product_id: productId
        })
      }
    );

    return addResponse.ok;
  } catch (error) {
    console.error(`Error adding to collection: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('\n🎴 Creating DS-Card Sets in Shopify...\n');
  console.log('='.repeat(70));
  console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`Shipping Origin: ${SHIPPING_ORIGIN_ZIP}`);
  console.log(`Supplier: DSLLC`);
  console.log('='.repeat(70));
  console.log('');

  const results = [];

  for (let i = 0; i < cardSets.length; i++) {
    const cardSet = cardSets[i];
    console.log(`\n📦 Creating: ${cardSet.title} (${cardSet.dsId})`);
    
    const result = await createShopifyProduct(cardSet);
    
    if (result.success) {
      const product = result.product;
      const variant = result.variant;
      
      console.log(`✅ Created successfully!`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Variant ID: ${variant.id}`);
      console.log(`   Variant Numeric ID: ${variant.id.split('/').pop()}`);
      console.log(`   SKU: ${variant.sku}`);
      console.log(`   Price: $${variant.price}`);
      console.log(`   Vendor: ${product.vendor}`);
      
      // Add to Home page collection
      const addedToCollection = await addProductToCollection(product.id, 'home-page');
      if (addedToCollection) {
        console.log(`   ✅ Added to Home page collection`);
      }
      
      results.push({
        dsId: cardSet.dsId,
        title: cardSet.title,
        shopifyProductId: product.id,
        shopifyVariantId: parseInt(variant.id.split('/').pop()),
        success: true
      });
      
      // Rate limiting - wait 1 second between requests
      if (i < cardSets.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } else {
      console.log(`❌ Failed: ${result.error}`);
      results.push({
        dsId: cardSet.dsId,
        title: cardSet.title,
        success: false,
        error: result.error
      });
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n📋 SUMMARY\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ Successfully Created Products:\n');
    successful.forEach(r => {
      console.log(`   ${r.dsId}: ${r.title}`);
      console.log(`      Shopify Product ID: ${r.shopifyProductId}`);
      console.log(`      Shopify Variant ID: ${r.shopifyVariantId}`);
      console.log('');
    });
    
    console.log('\n💡 NEXT STEPS:\n');
    console.log('1. Update data/products.ts with Shopify Variant IDs:');
    successful.forEach(r => {
      console.log(`   "shopifyVariantId": ${r.shopifyVariantId}, // ${r.dsId}: ${r.title}`);
    });
    console.log('\n2. Configure shipping in Shopify Admin:');
    console.log(`   - Go to Settings → Shipping and delivery`);
    console.log(`   - Set shipping origin zip code: ${SHIPPING_ORIGIN_ZIP}`);
    console.log(`   - Add 3-5 day US shipping rate`);
    console.log('\n3. Configure email notifications in Shopify Admin:');
    console.log('   - Go to Settings → Notifications');
    console.log('   - Enable: Order confirmation (with shipping cost)');
    console.log('   - Enable: Payment confirmation');
    console.log('   - Enable: Shipping confirmation');
    console.log('\n4. Verify products are published to Online Store');
    console.log('   - Go to Products → [Each Product] → Publishing');
    console.log('   - Ensure "Online Store" is enabled');
    console.log('   - Ensure "DS Website Integration" is enabled');
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Products:\n');
    failed.forEach(r => {
      console.log(`   ${r.dsId}: ${r.title}`);
      console.log(`      Error: ${r.error}`);
      console.log('');
    });
  }
  
  console.log('='.repeat(70));
  console.log('');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

