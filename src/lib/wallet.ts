// Wallet service for managing user wallet functionality

export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  createdAt: Date
  updatedAt: Date
}

export interface WalletTransaction {
  id: string
  walletId: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  reference?: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
  metadata?: {
    orderId?: string
    paymentMethod?: string
    transactionId?: string
  }
}

export interface RechargeRequest {
  amount: number
  paymentMethod: 'qr_code' | 'upi'
  userId: string
}

export interface WalletPaymentRequest {
  amount: number
  userId: string
  orderId: string
  description: string
}

// Mock wallet service - in real implementation, this would integrate with database
export class WalletService {
  private static wallets: Map<string, Wallet> = new Map()
  private static transactions: Map<string, WalletTransaction[]> = new Map()

  /**
   * Get or create user wallet
   */
  static async getOrCreateWallet(userId: string): Promise<Wallet> {
    if (this.wallets.has(userId)) {
      return this.wallets.get(userId)!
    }

    const wallet: Wallet = {
      id: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      balance: 0, // Start with zero balance
      currency: 'INR',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.wallets.set(userId, wallet)
    this.transactions.set(userId, [])
    
    return wallet
  }

  /**
   * Get wallet balance
   */
  static async getBalance(userId: string): Promise<number> {
    const wallet = await this.getOrCreateWallet(userId)
    return wallet.balance
  }

  /**
   * Add money to wallet (recharge)
   */
  static async rechargeWallet(request: RechargeRequest): Promise<{
    success: boolean
    wallet?: Wallet
    transaction?: WalletTransaction
    error?: string
  }> {
    try {
      const wallet = await this.getOrCreateWallet(request.userId)
      
      // Create transaction record
      const transaction: WalletTransaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        walletId: wallet.id,
        type: 'credit',
        amount: request.amount,
        description: `Wallet recharge via ${request.paymentMethod}`,
        status: 'pending',
        createdAt: new Date(),
        metadata: {
          paymentMethod: request.paymentMethod
        }
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate payment success (95% success rate)
      const paymentSuccess = Math.random() > 0.05
      
      if (paymentSuccess) {
        // Update wallet balance
        wallet.balance += request.amount
        wallet.updatedAt = new Date()
        
        // Update transaction status
        transaction.status = 'completed'
        
        // Store updated wallet and transaction
        this.wallets.set(request.userId, wallet)
        const userTransactions = this.transactions.get(request.userId) || []
        userTransactions.push(transaction)
        this.transactions.set(request.userId, userTransactions)
        
        return {
          success: true,
          wallet,
          transaction
        }
      } else {
        transaction.status = 'failed'
        
        const userTransactions = this.transactions.get(request.userId) || []
        userTransactions.push(transaction)
        this.transactions.set(request.userId, userTransactions)
        
        return {
          success: false,
          error: 'Payment failed. Please try again.'
        }
      }
    } catch (error) {
      console.error('Wallet recharge error:', error)
      return {
        success: false,
        error: 'Failed to recharge wallet'
      }
    }
  }

  /**
   * Deduct money from wallet (for payments)
   */
  static async makePayment(request: WalletPaymentRequest): Promise<{
    success: boolean
    wallet?: Wallet
    transaction?: WalletTransaction
    error?: string
  }> {
    try {
      const wallet = await this.getOrCreateWallet(request.userId)
      
      // Check if user has sufficient balance
      if (wallet.balance < request.amount) {
        return {
          success: false,
          error: 'Insufficient wallet balance'
        }
      }

      // Create transaction record
      const transaction: WalletTransaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        walletId: wallet.id,
        type: 'debit',
        amount: request.amount,
        description: request.description,
        status: 'pending',
        createdAt: new Date(),
        metadata: {
          orderId: request.orderId
        }
      }

      // Process payment
      wallet.balance -= request.amount
      wallet.updatedAt = new Date()
      transaction.status = 'completed'

      // Store updated wallet and transaction
      this.wallets.set(request.userId, wallet)
      const userTransactions = this.transactions.get(request.userId) || []
      userTransactions.push(transaction)
      this.transactions.set(request.userId, userTransactions)

      return {
        success: true,
        wallet,
        transaction
      }
    } catch (error) {
      console.error('Wallet payment error:', error)
      return {
        success: false,
        error: 'Failed to process wallet payment'
      }
    }
  }

  /**
   * Get transaction history for user
   */
  static async getTransactionHistory(userId: string): Promise<WalletTransaction[]> {
    const transactions = this.transactions.get(userId) || []
    return transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Get wallet details with recent transactions
   */
  static async getWalletDetails(userId: string): Promise<{
    wallet: Wallet
    recentTransactions: WalletTransaction[]
  }> {
    const wallet = await this.getOrCreateWallet(userId)
    const transactions = await this.getTransactionHistory(userId)
    
    return {
      wallet,
      recentTransactions: transactions.slice(0, 10) // Last 10 transactions
    }
  }

  /**
   * Format wallet balance for display
   */
  static formatBalance(balance: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(balance)
  }

  /**
   * Check if user can afford a payment
   */
  static async canAffordPayment(userId: string, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId)
    return balance >= amount
  }
}