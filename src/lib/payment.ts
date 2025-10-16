// Payment service for handling payment processing

export interface PaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'upi' | 'qr_code' | 'net_banking' | 'wallet' | 'cash_on_delivery'
  lastFour?: string
  expiryMonth?: number
  expiryYear?: number
  name: string
}

export interface PaymentRequest {
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  orderId: string
  customerEmail: string
  customerName: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
  message?: string
}

export interface Order {
  id: string
  userId: string
  items: any[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  deliveryAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  orderDate: Date
  estimatedDeliveryTime: Date
  paymentMethod: string
  transactionId?: string
}

// Mock payment service - in real implementation, this would integrate with payment gateways like Razorpay, PayU, etc.
export class PaymentService {
  static async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Validate currency for Indian market
    if (paymentRequest.currency !== 'INR') {
      return {
        success: false,
        error: 'Currency not supported. Only INR is accepted.',
        message: 'Currency validation failed'
      };
    }
    
    // Mock payment processing - 90% success rate
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Payment processed successfully'
      };
    } else {
      return {
        success: false,
        error: 'Payment failed. Please try again.',
        message: 'Payment processing failed'
      };
    }
  }
  
  static async createOrder(orderData: Omit<Order, 'id' | 'orderDate' | 'estimatedDeliveryTime'>): Promise<Order> {
    // Simulate order creation
    const order: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderDate: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000) // 45 minutes from now
    };
    
    // In real implementation, this would save to database
    return order;
  }
  
  static async getOrderStatus(orderId: string): Promise<Order | null> {
    // Mock order status retrieval
    // In real implementation, this would fetch from database
    return null;
  }
  
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    // Mock order status update
    // In real implementation, this would update in database
    return true;
  }
}

// Utility functions for payment validation
export const validateCardNumber = (cardNumber: string): boolean => {
  // Basic card number validation (Luhn algorithm would be better)
  return /^\d{16}$/.test(cardNumber.replace(/\s/g, ''));
};

export const validateExpiryDate = (month: string, year: string): boolean => {
  const expiryMonth = parseInt(month);
  const expiryYear = parseInt(year);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  if (expiryMonth < 1 || expiryMonth > 12) return false;
  if (expiryYear < currentYear) return false;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
  
  return true;
};

export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

export const formatCardNumber = (cardNumber: string): string => {
  return cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
};

export const getCardType = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, '');
  if (number.startsWith('4')) return 'Visa';
  if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
  if (number.startsWith('3')) return 'American Express';
  return 'Card';
};