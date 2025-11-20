/**
 * Zoho CRM Integration Library
 * 
 * Handles Product Interest data storage in Zoho CRM
 * Requires Zoho CRM API credentials
 */

interface ZohoCRMConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  apiDomain?: string; // 'com' (default), 'eu', 'in', 'com.au', 'jp'
}

interface ProductInterestData {
  productId: string;
  productTitle: string;
  productCategory: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerMessage?: string;
  productsVisited?: string[];
  productsPurchased?: string[];
  cartItems?: string[];
  totalProductViews?: number;
  totalPurchases?: number;
  totalCartAdds?: number;
  totalSpent?: number;
  timeOnSiteMinutes?: number;
  referrer?: string;
  userAgent?: string;
  timestamp: string;
}

class ZohoCRMClient {
  private config: ZohoCRMConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private apiDomain: string;

  constructor(config: ZohoCRMConfig) {
    this.config = config;
    this.apiDomain = config.apiDomain || 'com';
  }

  /**
   * Get access token using refresh token
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(
        `https://accounts.zoho.${this.apiDomain}/oauth/v2/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            refresh_token: this.config.refreshToken,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            grant_type: 'refresh_token',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get access token: ${error}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Token expires in 1 hour, refresh 5 minutes early
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

      return this.accessToken!;
    } catch (error) {
      console.error('Zoho CRM token error:', error);
      throw error;
    }
  }

  /**
   * Create a Lead in Zoho CRM for Product Interest
   */
  async createProductInterestLead(data: ProductInterestData): Promise<string | null> {
    try {
      const accessToken = await this.getAccessToken();

      // Prepare lead data for Zoho CRM
      const leadData = {
        Last_Name: data.customerName || data.customerEmail || 'Product Interest',
        Email: data.customerEmail || '',
        Phone: data.customerPhone || '',
        Description: this.formatLeadDescription(data),
        Lead_Source: 'Website - Product Interest',
        Lead_Status: 'Not Contacted',
        Company: 'DarkStreet LLC Customer',
        // Custom fields (if you create them in Zoho CRM)
        Product_ID: data.productId,
        Product_Title: data.productTitle,
        Product_Category: data.productCategory,
        Customer_Message: data.customerMessage || '',
        Products_Visited: data.productsVisited?.join(', ') || '',
        Products_Purchased: data.productsPurchased?.join(', ') || '',
        Cart_Items: data.cartItems?.join(', ') || '',
        Total_Product_Views: data.totalProductViews || 0,
        Total_Purchases: data.totalPurchases || 0,
        Total_Cart_Adds: data.totalCartAdds || 0,
        Total_Spent: data.totalSpent || 0,
        Time_On_Site_Minutes: data.timeOnSiteMinutes || 0,
        Referrer: data.referrer || 'Direct',
        User_Agent: data.userAgent || '',
        Interest_Submitted_At: data.timestamp,
      };

      const response = await fetch(
        `https://www.zohoapis.${this.apiDomain}/crm/v3/Leads`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: [leadData],
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Zoho CRM API error:', error);
        throw new Error(`Failed to create lead: ${error}`);
      }

      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        console.log(`✅ Product Interest lead created in Zoho CRM: ${result.data[0].id}`);
        return result.data[0].id;
      }

      return null;
    } catch (error) {
      console.error('Error creating Zoho CRM lead:', error);
      return null;
    }
  }

  /**
   * Format lead description with all product interest details
   */
  private formatLeadDescription(data: ProductInterestData): string {
    return `
Product Interest Submission

Product Information:
- Product ID: ${data.productId}
- Product Title: ${data.productTitle}
- Category: ${data.productCategory}

Customer Information:
- Name: ${data.customerName || 'Not provided'}
- Email: ${data.customerEmail || 'Not provided'}
- Phone: ${data.customerPhone || 'Not provided'}
${data.customerMessage ? `- Message: ${data.customerMessage}` : ''}

Customer Profile:
- Products Visited (${data.totalProductViews || 0} total): ${data.productsVisited?.join(', ') || 'None'}
- Products Purchased (${data.totalPurchases || 0} total): ${data.productsPurchased?.join(', ') || 'None'}
- Cart Items Added (${data.totalCartAdds || 0} total): ${data.cartItems?.join(', ') || 'None'}
- Total Spent: $${(data.totalSpent || 0).toFixed(2)}
- Time on Site: ${data.timeOnSiteMinutes || 0} minutes

Technical Details:
- Referrer: ${data.referrer || 'Direct'}
- User Agent: ${data.userAgent || 'Unknown'}
- Submitted At: ${data.timestamp}
    `.trim();
  }

  /**
   * Search for existing lead by email
   */
  async findLeadByEmail(email: string): Promise<any | null> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(
        `https://www.zohoapis.${this.apiDomain}/crm/v3/Leads/search?criteria=(Email:equals:${encodeURIComponent(email)})`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      if (result.data && result.data.length > 0) {
        return result.data[0];
      }

      return null;
    } catch (error) {
      console.error('Error searching for lead:', error);
      return null;
    }
  }

  /**
   * Update existing lead with new product interest
   */
  async updateLeadWithProductInterest(leadId: string, data: ProductInterestData): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();

      const updateData = {
        Description: this.formatLeadDescription(data),
        Lead_Status: 'Not Contacted', // Reset status for new interest
        Product_ID: data.productId,
        Product_Title: data.productTitle,
        Product_Category: data.productCategory,
        Interest_Submitted_At: data.timestamp,
      };

      const response = await fetch(
        `https://www.zohoapis.${this.apiDomain}/crm/v3/Leads/${leadId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: [updateData],
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Zoho CRM update error:', error);
        return false;
      }

      console.log(`✅ Product Interest updated in Zoho CRM lead: ${leadId}`);
      return true;
    } catch (error) {
      console.error('Error updating lead:', error);
      return false;
    }
  }
}

/**
 * Create Zoho CRM client instance
 */
export function createZohoCRMClient(): ZohoCRMClient | null {
  const clientId = process.env.ZOHO_CRM_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CRM_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_CRM_REFRESH_TOKEN;
  const apiDomain = process.env.ZOHO_CRM_API_DOMAIN || 'com';

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('⚠️ Zoho CRM credentials not configured. Product Interest will only be sent via email.');
    return null;
  }

  return new ZohoCRMClient({
    clientId,
    clientSecret,
    refreshToken,
    apiDomain,
  });
}

/**
 * Store Product Interest in Zoho CRM
 */
export async function storeProductInterestInZoho(data: ProductInterestData): Promise<boolean> {
  const client = createZohoCRMClient();
  
  if (!client) {
    return false;
  }

  try {
    // If customer has email, check for existing lead
    if (data.customerEmail) {
      const existingLead = await client.findLeadByEmail(data.customerEmail);
      
      if (existingLead) {
        // Update existing lead
        return await client.updateLeadWithProductInterest(existingLead.id, data);
      }
    }

    // Create new lead
    const leadId = await client.createProductInterestLead(data);
    return leadId !== null;
  } catch (error) {
    console.error('Error storing product interest in Zoho CRM:', error);
    return false;
  }
}

export type { ProductInterestData, ZohoCRMConfig };

