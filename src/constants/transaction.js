/**
 * Transaction status constants
 * Used for consistent status values across the application
 */

export const PURCHASE_STATUS = {
  DRAFT: 'draft',
  ORDERED: 'ordered',
  RECEIVED: 'received',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const PURCHASE_ORDER_STATUS = {
  DRAFT: 'draft',
  ORDERED: 'ordered',
  PARTIAL: 'partial',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid'
}

export const PAYMENT_METHODS = {
  CASH: 'cash',
  TRANSFER: 'transfer',
  CREDIT: 'credit'
}