// Currency utilities for Indian Rupees (INR)

export interface CurrencyConfig {
  code: string
  symbol: string
  locale: string
  decimalPlaces: number
}

export const INR_CURRENCY: CurrencyConfig = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN',
  decimalPlaces: 2
}

// Format price in INR format
export const formatINR = (price: number): string => {
  return new Intl.NumberFormat(INR_CURRENCY.locale, {
    style: 'currency',
    currency: INR_CURRENCY.code,
    minimumFractionDigits: INR_CURRENCY.decimalPlaces,
    maximumFractionDigits: INR_CURRENCY.decimalPlaces
  }).format(price)
}

// Format price in INR with Rs. prefix (alternative format)
export const formatINRWithRs = (price: number): string => {
  return `Rs. ${price.toFixed(2)}`
}

// Format price in INR with ₹ symbol
export const formatINRWithSymbol = (price: number): string => {
  return `${INR_CURRENCY.symbol}${price.toFixed(2)}`
}

// Convert USD to INR (approximate conversion rate)
export const convertUSDToINR = (usdAmount: number): number => {
  // Using approximate conversion rate: 1 USD = 83 INR
  const conversionRate = 83
  return Math.round(usdAmount * conversionRate * 100) / 100
}

// Convert INR to USD (approximate conversion rate)
export const convertINRToUSD = (inrAmount: number): number => {
  // Using approximate conversion rate: 1 USD = 83 INR
  const conversionRate = 83
  return Math.round(inrAmount / conversionRate * 100) / 100
}

// Format price without currency symbol (for calculations)
export const formatPriceWithoutSymbol = (price: number): string => {
  return price.toFixed(2)
}

// Parse price string to number
export const parsePrice = (priceString: string): number => {
  // Remove currency symbols and commas, then parse
  const cleaned = priceString.replace(/[₹Rs.,\s]/g, '')
  return parseFloat(cleaned) || 0
}

// Check if a string contains INR currency
export const isINRCurrency = (text: string): boolean => {
  return /₹|Rs\.|INR/i.test(text)
}

// Get currency symbol
export const getCurrencySymbol = (): string => {
  return INR_CURRENCY.symbol
}

// Get currency code
export const getCurrencyCode = (): string => {
  return INR_CURRENCY.code
}

// Format large amounts in Indian numbering system (lakhs, crores)
export const formatIndianLargeNumber = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore
    return `${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) { // 1 lakh
    return `${(amount / 100000).toFixed(2)} L`
  } else if (amount >= 1000) { // 1 thousand
    return `${(amount / 1000).toFixed(2)} K`
  }
  return formatINR(amount)
}

// Price validation for Indian market
export const validateIndianPrice = (price: number): boolean => {
  return price >= 0 && price <= 1000000 // Max 10 lakhs for typical food items
}

// Round price to nearest 0.05 (common in Indian pricing)
export const roundToNearestFivePaise = (price: number): number => {
  return Math.round(price * 20) / 20
}

// Calculate GST (Indian tax)
export const calculateGST = (basePrice: number, gstRate: number = 18): number => {
  return Math.round((basePrice * gstRate / 100) * 100) / 100
}

// Calculate total with GST
export const calculateTotalWithGST = (basePrice: number, gstRate: number = 18): number => {
  const gst = calculateGST(basePrice, gstRate)
  return Math.round((basePrice + gst) * 100) / 100
}

// Format price with discount
export const formatDiscountedPrice = (originalPrice: number, discountPercentage: number): string => {
  const discountedPrice = originalPrice * (1 - discountPercentage / 100)
  return formatINR(discountedPrice)
}

// Get price range display
export const formatPriceRange = (minPrice: number, maxPrice: number): string => {
  return `${formatINR(minPrice)} - ${formatINR(maxPrice)}`
}

// Default export for convenience
const currencyUtils = {
  format: formatINR,
  formatWithRs: formatINRWithRs,
  formatWithSymbol: formatINRWithSymbol,
  convertUSDToINR,
  convertINRToUSD,
  parse: parsePrice,
  symbol: getCurrencySymbol,
  code: getCurrencyCode,
  formatLarge: formatIndianLargeNumber,
  validate: validateIndianPrice,
  round: roundToNearestFivePaise,
  calculateGST,
  calculateTotalWithGST,
  formatDiscount: formatDiscountedPrice,
  formatRange: formatPriceRange
}

export default currencyUtils