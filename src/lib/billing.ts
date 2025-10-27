/**
 * Billing API utilities
 */

import { api } from './api';

export interface PlanSyncResult {
  success: boolean;
  message: string;
  planId?: string | null;
}

/**
 * Manually sync user's plan from Stripe
 * 
 * Use this when:
 * - Payment succeeded but plan didn't update
 * - Webhooks are failing
 * - User reports billing issues
 * 
 * This fetches the user's active subscription directly from Stripe
 * and updates their plan in the database.
 */
export async function syncPlanFromStripe(): Promise<PlanSyncResult> {
  try {
    const response = await api.post<PlanSyncResult>('/api/v1/billing/sync');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to sync plan',
    };
  }
}

/**
 * Get current plan and usage information
 */
export async function getCurrentPlan() {
  try {
    const response = await api.get('/api/v1/billing/plan');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch plan:', error);
    throw error;
  }
}

/**
 * Create a checkout session for subscribing to a plan
 */
export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
  try {
    const response = await api.post('/api/v1/billing/checkout', {
      priceId,
      successUrl,
      cancelUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    throw error;
  }
}

/**
 * Create a portal session for managing subscription
 */
export async function createPortalSession(returnUrl: string) {
  try {
    const response = await api.post('/api/v1/billing/portal', {
      returnUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create portal session:', error);
    throw error;
  }
}

