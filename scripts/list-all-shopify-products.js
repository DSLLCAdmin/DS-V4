/**
 * LIST ALL SHOPIFY PRODUCTS
 * Lists all products in Shopify to help find correct titles and variant IDs
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'wenugu-5b.myshopify.com';
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_API_TOKEN;
if (!SHOPIFY_ADMIN_API_TOKEN) {
  console.error('\n❌ ERROR: Shopify Admin API Token is required');
  console.error('   Please set SHOPIFY_ACCESS_TOKEN or SHOPIFY_ADMIN_API_TOKEN environment variable');
  process.exit(1);
}
const SHOPIFY_API_VERSION = '2024-10';

async function listAllProducts() {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price
                  sku
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
      },
      body: JSON.stringify({ 
        query,
        variables: { first: 50 }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors, null, 2)}`);
    }
    
    const products = data.data.products.edges.map(edge => edge.node);
    
    console.log(`\n📦 Found ${products.length} total products in Shopify\n`);
    console.log('='.repeat(70));
    
    // Group by status
    const active = products.filter(p => p.status === 'ACTIVE');
    const draft = products.filter(p => p.status === 'DRAFT');
    
    console.log(`\n✅ ACTIVE Products (${active.length}):`);
    console.log('='.repeat(70));
    active.forEach(p => {
      console.log(`\n"${p.title}" [${p.status}]`);
      console.log(`  Product ID: ${p.id}`);
      if (p.variants.edges.length > 0) {
        p.variants.edges.forEach(v => {
          const variantId = v.node.id.split('/').pop();
          console.log(`  Variant: ${v.node.title || 'Default'}`);
          console.log(`    Variant ID: ${variantId}`);
          console.log(`    Price: $${v.node.price}`);
          console.log(`    SKU: ${v.node.sku || 'N/A'}`);
        });
      } else {
        console.log(`  ⚠️  No variants`);
      }
    });
    
    console.log(`\n📝 Searching for T-Shirt and Cap in ALL products:`);
    console.log('='.repeat(70));
    
    // Search for tee/cap in all products
    const teeMatches = products.filter(p => {
      const title = p.title.toLowerCase();
      return title.includes('tee') || title.includes('t-shirt') || title.includes('v-neck') || 
             (title.includes('darkstreet') && title.includes('tee'));
    });
    
    const capMatches = products.filter(p => {
      const title = p.title.toLowerCase();
      return title.includes('cap') || title.includes('hat') || title.includes('otto') ||
             (title.includes('darkstreet') && title.includes('cap'));
    });
    
    console.log(`\n🔍 Tee Shirt Matches (${teeMatches.length}):`);
    teeMatches.forEach(p => {
      console.log(`\n"${p.title}" [${p.status}]`);
      if (p.variants.edges.length > 0) {
        p.variants.edges.forEach(v => {
          const variantId = v.node.id.split('/').pop();
          console.log(`  Variant: ${v.node.title || 'Default'}`);
          console.log(`    Variant ID: ${variantId}`);
          console.log(`    Price: $${v.node.price}`);
          console.log(`    SKU: ${v.node.sku || 'N/A'}`);
        });
      }
    });
    
    console.log(`\n🔍 Cap/ Hat Matches (${capMatches.length}):`);
    capMatches.forEach(p => {
      console.log(`\n"${p.title}" [${p.status}]`);
      if (p.variants.edges.length > 0) {
        p.variants.edges.forEach(v => {
          const variantId = v.node.id.split('/').pop();
          console.log(`  Variant: ${v.node.title || 'Default'}`);
          console.log(`    Variant ID: ${variantId}`);
          console.log(`    Price: $${v.node.price}`);
          console.log(`    SKU: ${v.node.sku || 'N/A'}`);
        });
      }
    });
    
    console.log(`\n📝 DRAFT Products (${draft.length}):`);
    console.log('='.repeat(70));
    // Show first 10 draft products
    draft.slice(0, 10).forEach(p => {
      console.log(`\n"${p.title}" [${p.status}]`);
      if (p.variants.edges.length > 0) {
        const variantId = p.variants.edges[0].node.id.split('/').pop();
        console.log(`  Variant ID: ${variantId} | Price: $${p.variants.edges[0].node.price} | SKU: ${p.variants.edges[0].node.sku || 'N/A'}`);
      }
    });
    
    if (draft.length > 20) {
      console.log(`\n... and ${draft.length - 20} more DRAFT products`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

listAllProducts();

