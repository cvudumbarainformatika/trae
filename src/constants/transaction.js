/**
 * Transaction status constants
 */

export const PURCHASE_STATUS = {
  DRAFT: 'draft',
  ORDERED: 'ordered',
  RECEIVED: 'received',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PARTIAL: 'partial',
  UNPAID: 'unpaid'
}

export const PAYMENT_METHODS = {
  CASH: 'cash',
  TRANSFER: 'transfer',
  CREDIT: 'credit'
}
