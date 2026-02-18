/**
 * Stripe Payment Links for SynapZ AI Platform
 * Simple integration using Stripe-hosted payment links
 */

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  paymentLink: string | null;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: '$',
    interval: 'month',
    paymentLink: null,
    description: 'Get started with basic learning tools',
    features: [
      'Basic lessons (Math, English)',
      'Limited quizzes (5/day)',
      'Community access',
      'Basic progress tracking',
      'Web Speech TTS/STT',
    ],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 10,
    currency: '$',
    interval: 'month',
    paymentLink: 'https://buy.stripe.com/14A28t8MfawW2pSdFH7EQ05',
    description: 'Unlock the full learning experience',
    features: [
      'All lessons across subjects',
      'Unlimited quizzes & assessments',
      'AI Voice Tutor (Sara)',
      'BDSL Sign Language translator',
      'Detailed progress analytics',
      'ADHD-optimized learning mode',
      'Story generator with AI images',
      'Visual schedule planner',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 30,
    currency: '$',
    interval: 'month',
    paymentLink: 'https://buy.stripe.com/5kQ8wRe6z9sS9Sk1WZ7EQ06',
    description: 'Everything you need for career readiness',
    features: [
      'Everything in Pro',
      'Career coaching & interview prep',
      'Job matching & recommendations',
      'Skills assessment tools',
      'Parent/Guardian dashboard',
      'Priority support',
      'Offline PWA access',
      'Custom learning paths',
    ],
    highlighted: false,
    badge: 'Best Value',
  },
  {
    id: 'master',
    name: 'Master',
    price: 90,
    currency: '$',
    interval: 'month',
    paymentLink: 'https://buy.stripe.com/7sYbJ3d2vfRg2pS7hj7EQ07',
    description: 'The ultimate all-inclusive learning experience',
    features: [
      'Everything in Premium',
      'Dedicated AI learning assistant',
      'One-on-one career mentoring',
      'Advanced analytics & reports',
      'Organization/school admin tools',
      'API access for custom integrations',
      'White-glove onboarding support',
      'Early access to new features',
      'Unlimited team members',
      'SLA-backed uptime guarantee',
    ],
    highlighted: false,
    badge: 'Enterprise',
  },
];

/**
 * Redirect user to a Stripe Payment Link
 */
export function redirectToCheckout(paymentLink: string): void {
  window.open(paymentLink, '_blank');
}
