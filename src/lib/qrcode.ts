import QRCode from 'qrcode';
import { formatINRWithRs } from './currency';

export interface QRCodePaymentData {
  upiId: string;
  amount: number;
  currency: string;
  merchantName: string;
  transactionNote?: string;
  orderId?: string;
}

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export class QRCodeService {
  private static readonly DEFAULT_UPI_ID = 'pizzaxperts@ybl';
  private static readonly MERCHANT_NAME = 'PizzaXperts';

  /**
   * Generate UPI payment URL for QR code
   */
  static generateUPIPaymentURL(data: QRCodePaymentData): string {
    const {
      upiId = this.DEFAULT_UPI_ID,
      amount,
      currency = 'INR',
      merchantName = this.MERCHANT_NAME,
      transactionNote,
      orderId
    } = data;

    // UPI URL format: upi://pay?pa=UPI_ID&pn=MERCHANT_NAME&am=AMOUNT&cu=CURRENCY&tn=TRANSACTION_NOTE
    const params = new URLSearchParams({
      pa: upiId,
      pn: merchantName,
      am: amount.toString(),
      cu: currency,
      ...(transactionNote && { tn: transactionNote }),
      ...(orderId && { tr: orderId })
    });

    return `upi://pay?${params.toString()}`;
  }

  /**
   * Generate QR code as data URL
   */
  static async generateQRCodeDataURL(
    data: QRCodePaymentData,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const paymentURL = this.generateUPIPaymentURL(data);
    
    const qrOptions = {
      width: options.width || 300,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF'
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M' as const
    };

    try {
      return await QRCode.toDataURL(paymentURL, qrOptions);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code as SVG string
   */
  static async generateQRCodeSVG(
    data: QRCodePaymentData,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const paymentURL = this.generateUPIPaymentURL(data);
    
    const qrOptions = {
      width: options.width || 300,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF'
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M' as const
    };

    try {
      return await QRCode.toString(paymentURL, { type: 'svg', ...qrOptions });
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code as buffer
   */
  static async generateQRCodeBuffer(
    data: QRCodePaymentData,
    options: QRCodeOptions = {}
  ): Promise<Buffer> {
    const paymentURL = this.generateUPIPaymentURL(data);
    
    const qrOptions = {
      width: options.width || 300,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF'
      },
      errorCorrectionLevel: options.errorCorrectionLevel || 'M' as const
    };

    try {
      return await QRCode.toBuffer(paymentURL, qrOptions);
    } catch (error) {
      console.error('Error generating QR code buffer:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Validate UPI ID format
   */
  static validateUPIId(upiId: string): boolean {
    // Basic UPI ID validation (should contain @ and valid characters)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  }

  /**
   * Format amount for UPI payment
   */
  static formatUPIAmount(amount: number): string {
    // UPI expects amount in rupees with up to 2 decimal places
    return amount.toFixed(2);
  }

  /**
   * Generate payment details for display
   */
  static generatePaymentDetails(data: QRCodePaymentData) {
    return {
      upiId: data.upiId || this.DEFAULT_UPI_ID,
      amount: formatINRWithRs(data.amount),
      merchantName: data.merchantName || this.MERCHANT_NAME,
      currency: data.currency || 'INR',
      transactionNote: data.transactionNote || `Payment for order ${data.orderId || ''}`,
      paymentURL: this.generateUPIPaymentURL(data)
    };
  }

  /**
   * Create payment data for order
   */
  static createOrderPaymentData(
    orderId: string,
    amount: number,
    upiId?: string,
    merchantName?: string
  ): QRCodePaymentData {
    return {
      upiId: upiId || this.DEFAULT_UPI_ID,
      amount,
      currency: 'INR',
      merchantName: merchantName || this.MERCHANT_NAME,
      transactionNote: `Payment for PizzaXperts order ${orderId}`,
      orderId
    };
  }
}