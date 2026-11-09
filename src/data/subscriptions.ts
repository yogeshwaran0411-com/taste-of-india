import { SubscriptionPlan } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 49,
    durationMonths: 1,
    durationText: '1 Month',
    features: [
      'Unlimited Recipe PDF Downloads',
      'High-Resolution Print-Ready Formats',
      'Ad-Free Browsing Experience',
      'Exclusive Chef Tips & Substitutions',
      'Standard Member Support'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly Plan',
    price: 129,
    durationMonths: 3,
    durationText: '3 Months',
    badge: 'POPULAR',
    savings: 'Save ₹18 vs Monthly',
    popular: true,
    features: [
      'Unlimited Recipe PDF Downloads',
      'Curated State-Wise Recipe E-Books',
      'Ad-Free Browsing Experience',
      'Nutritional Breakdown & Macro Calculators',
      'Priority Member Support',
      'Save ₹18 compared to monthly renewals'
    ]
  },
  {
    id: 'halfyearly',
    name: 'Half-Yearly Plan',
    price: 229,
    durationMonths: 6,
    durationText: '6 Months',
    badge: 'BEST VALUE',
    savings: 'Save ₹65 vs Monthly',
    features: [
      'Unlimited Recipe PDF Downloads',
      'Download Full Festival Collections (Diwali, Eid, Pongal)',
      'Ad-Free Browsing Experience',
      'All Regional Cooking Guides',
      'Offline Access to Downloaded PDFs Forever',
      'Save ₹65 compared to monthly renewals'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    price: 399,
    durationMonths: 12,
    durationText: '12 Months',
    badge: 'BEST SAVINGS',
    savings: 'Save ₹189 vs Monthly',
    features: [
      'Unlimited Recipe PDF Downloads All Year',
      'All 28 States & 8 UTs Master Heritage Cookbooks',
      'Complete Ad-Free Platform Experience',
      'Exclusive Festival & Royal Nizami/Awadhi Guides',
      'Early Access to New Community Collections',
      'Best Value: Save ₹189 compared to monthly renewals'
    ]
  }
];
