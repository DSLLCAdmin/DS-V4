/**
 * Chatbot System for DS LLC Customer Support
 * Provides automated customer service and order assistance
 */

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  orderId?: string;
  customerId?: string;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  orderId?: string;
  status: 'active' | 'resolved' | 'escalated' | 'closed';
  createdAt: Date;
  lastActivity: Date;
  messages: ChatMessage[];
  context: {
    currentOrder?: any;
    customerHistory?: any[];
    supportTier: 'basic' | 'premium' | 'vip';
  };
}

export interface BotResponse {
  message: string;
  suggestions?: string[];
  actions?: {
    type: 'track_order' | 'contact_support' | 'view_products' | 'checkout';
    data?: any;
  }[];
  escalateToHuman?: boolean;
}

export class CustomerSupportBot {
  private sessions: Map<string, ChatSession> = new Map();
  private systemPrompts: Map<string, string> = new Map();

  constructor() {
    this.initializeSystemPrompts();
  }

  private initializeSystemPrompts() {
    this.systemPrompts.set('default', `
      You are a helpful customer service representative for DS LLC, a publishing company specializing in street culture books and merchandise.
      
      Company Information:
      - Name: DS LLC (Dark Streets Publishing)
      - Website: dsllc.com
      - Products: Books, apparel, merchandise
      - Support Email: support@dsllc.com
      - Phone: Available on website
      
      Your role:
      - Help customers with orders, shipping, returns, and general questions
      - Be friendly, professional, and helpful
      - Provide accurate information about products and services
      - Escalate complex issues to human support when needed
      - Always maintain a positive attitude
      
      Guidelines:
      - Keep responses concise but helpful
      - Ask clarifying questions when needed
      - Provide specific solutions when possible
      - Offer alternatives when primary solutions aren't available
      - Always end with asking if there's anything else you can help with
    `);

    this.systemPrompts.set('order_support', `
      You are helping a customer with order-related questions.
      
      Common order topics:
      - Order status and tracking
      - Shipping information
      - Delivery issues
      - Returns and refunds
      - Payment problems
      - Order modifications
      
      Always ask for order number when relevant and provide specific, actionable help.
    `);

    this.systemPrompts.set('product_support', `
      You are helping a customer with product-related questions.
      
      Product categories:
      - Books (e-books, paperbacks, hardcovers)
      - Apparel (tees, hoodies, caps)
      - Merchandise (mugs, accessories)
      
      Provide detailed product information, availability, and recommendations.
    `);
  }

  /**
   * Start a new chat session
   */
  startSession(customerId?: string, customerEmail?: string, customerName?: string, orderId?: string): ChatSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: ChatSession = {
      id: sessionId,
      customerId,
      customerEmail,
      customerName,
      orderId,
      status: 'active',
      createdAt: new Date(),
      lastActivity: new Date(),
      messages: [],
      context: {
        supportTier: 'basic'
      }
    };

    this.sessions.set(sessionId, session);
    
    // Send welcome message
    this.addMessage(sessionId, 'bot', this.getWelcomeMessage(customerName), sessionId);
    
    return session;
  }

  /**
   * Process user message and generate bot response
   */
  async processMessage(sessionId: string, userMessage: string): Promise<BotResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Add user message to session
    this.addMessage(sessionId, 'user', userMessage, sessionId);
    
    // Update last activity
    session.lastActivity = new Date();

    // Analyze message intent
    const intent = this.analyzeIntent(userMessage);
    
    // Generate appropriate response
    const response = await this.generateResponse(session, userMessage, intent);
    
    // Add bot response to session
    this.addMessage(sessionId, 'bot', response.message, sessionId);
    
    return response;
  }

  /**
   * Analyze user message intent
   */
  private analyzeIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Order-related intents
    if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('shipping')) {
      return 'order_support';
    }
    
    // Product-related intents
    if (lowerMessage.includes('product') || lowerMessage.includes('book') || lowerMessage.includes('buy')) {
      return 'product_support';
    }
    
    // Return/exchange intents
    if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange')) {
      return 'return_support';
    }
    
    // General support
    return 'general_support';
  }

  /**
   * Generate bot response based on session and intent
   */
  private async generateResponse(session: ChatSession, message: string, intent: string): Promise<BotResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Handle order tracking
    if (intent === 'order_support' && (lowerMessage.includes('track') || lowerMessage.includes('status'))) {
      return {
        message: "I'd be happy to help you track your order! Could you please provide your order number? You can find it in your order confirmation email.",
        suggestions: [
          "I don't have my order number",
          "My order is late",
          "I need to change my shipping address"
        ],
        actions: [{
          type: 'track_order',
          data: { sessionId: session.id }
        }]
      };
    }

    // Handle product questions
    if (intent === 'product_support') {
      return {
        message: "I can help you with information about our products! We have books, apparel, and merchandise. What specific product are you interested in?",
        suggestions: [
          "Tell me about your books",
          "Show me apparel options",
          "What merchandise do you have?",
          "Recommend something for me"
        ],
        actions: [{
          type: 'view_products',
          data: { sessionId: session.id }
        }]
      };
    }

    // Handle returns
    if (intent === 'return_support') {
      return {
        message: "I can help you with returns and exchanges! Our return policy allows returns within 30 days of purchase. What would you like to return?",
        suggestions: [
          "I want to return a book",
          "I want to exchange an item",
          "I need a refund",
          "What's your return policy?"
        ]
      };
    }

    // Handle greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
      return {
        message: `Hello${session.customerName ? ` ${session.customerName}` : ''}! I'm here to help you with any questions about DS LLC. How can I assist you today?`,
        suggestions: [
          "Track my order",
          "Ask about products",
          "Return an item",
          "Contact support"
        ]
      };
    }

    // Handle escalation triggers
    if (this.shouldEscalateToHuman(message)) {
      return {
        message: "I understand you need additional assistance. Let me connect you with our human support team who can provide more detailed help.",
        escalateToHuman: true,
        suggestions: [
          "Yes, connect me to support",
          "No, I'll try something else"
        ]
      };
    }

    // Default response
    return {
      message: "I'm here to help! Could you tell me more about what you need assistance with? I can help with orders, products, returns, or general questions.",
      suggestions: [
        "Track my order",
        "Ask about products", 
        "Return an item",
        "General question"
      ]
    };
  }

  /**
   * Determine if message should escalate to human support
   */
  private shouldEscalateToHuman(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    const escalationKeywords = [
      'speak to someone',
      'human',
      'representative',
      'manager',
      'supervisor',
      'complaint',
      'angry',
      'frustrated',
      'not working',
      'broken',
      'defective'
    ];
    
    return escalationKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Get welcome message for new sessions
   */
  private getWelcomeMessage(customerName?: string): string {
    return `Welcome${customerName ? ` ${customerName}` : ''} to DS LLC customer support! I'm here to help you with any questions about your orders, products, or our services. How can I assist you today?`;
  }

  /**
   * Add message to session
   */
  private addMessage(sessionId: string, type: ChatMessage['type'], content: string, customerId?: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
      sessionId,
      customerId
    };

    session.messages.push(message);
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).filter(session => session.status === 'active');
  }

  /**
   * Close session
   */
  closeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'closed';
      this.addMessage(sessionId, 'system', 'Session closed. Thank you for contacting DS LLC support!', sessionId);
    }
  }

  /**
   * Escalate session to human support
   */
  escalateSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'escalated';
      this.addMessage(sessionId, 'system', 'Your session has been escalated to human support. A representative will be with you shortly.', sessionId);
    }
  }
}

// Export singleton instance
export const customerSupportBot = new CustomerSupportBot();
