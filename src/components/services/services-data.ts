export type ServiceOption = 'STANDARD' | 'PREMIUM' | 'EMERGENCY';
export type ServiceLocation =
  | 'SEOUL'
  | 'BUSAN'
  | 'INCHEON'
  | 'DAEGU'
  | 'GYEONGJU'
  | 'GWANGJU'
  | 'JEONJU'
  | 'DAEJON'
  | 'JEJU';
export type ServicePriceBand = 'UNDER_100K' | 'FROM_100K_TO_250K' | 'FROM_250K_TO_500K' | 'ABOVE_500K';

export type ServiceItem = {
  slug: string;
  image: string;
  title: string;
  category: string;
  description: string;
  lead: string;
  priceLabel: string;
  priceBand: ServicePriceBand;
  locations: ServiceLocation[];
  options: ServiceOption[];
  responseTime: string;
  highlights: string[];
  deliverables: string[];
};

export const serviceItems: ServiceItem[] = [
  {
    slug: 'emergency-plumbing',
    image: '/theme/images/service/1.jpg',
    title: 'Emergency plumbing',
    category: 'PLUMBING',
    description:
      'Rapid response for burst pipes, severe leaks, blocked drains, and urgent water damage before things get worse.',
    lead:
      'Fast dispatch for high-priority plumbing issues when water damage, flooding, or pipe failure cannot wait until later.',
    priceLabel: '₩180k - ₩420k',
    priceBand: 'FROM_100K_TO_250K',
    locations: ['SEOUL', 'INCHEON', 'DAEGU', 'GYEONGJU'],
    options: ['STANDARD', 'PREMIUM', 'EMERGENCY'],
    responseTime: 'Same day / emergency dispatch',
    highlights: [
      'Burst pipe stabilization and urgent leak stopping',
      'Drain blockage relief and fixture isolation',
      'Water damage prevention guidance before arrival',
    ],
    deliverables: ['On-site diagnosis', 'Repair recommendation', 'Immediate fix when parts are available'],
  },
  {
    slug: 'water-heater-support',
    image: '/theme/images/service/2.jpg',
    title: 'Water heater support',
    category: 'WATER LINE',
    description:
      'Diagnostics, repair, replacement planning, and hot water recovery support for apartments and family homes.',
    lead:
      'Keep hot water reliable with inspections, repairs, and replacement planning for aging or underperforming heater systems.',
    priceLabel: '₩140k - ₩380k',
    priceBand: 'FROM_100K_TO_250K',
    locations: ['SEOUL', 'BUSAN', 'INCHEON', 'DAEJON'],
    options: ['STANDARD', 'PREMIUM'],
    responseTime: 'Within 24 hours',
    highlights: [
      'Heating performance diagnosis',
      'Pressure and temperature troubleshooting',
      'Replacement consultation for old units',
    ],
    deliverables: ['Inspection report', 'Repair estimate', 'Maintenance checklist'],
  },
  {
    slug: 'gas-line-services',
    image: '/theme/images/service/3.jpg',
    title: 'Gas line services',
    category: 'GAS LINE',
    description:
      'Certified help for gas appliance hookup, safety checks, valve replacement, leak inspection, and line upgrades.',
    lead:
      'Certified gas-line work with safety-first checks for appliance installation, leak concerns, and valve replacement.',
    priceLabel: '₩220k - ₩520k',
    priceBand: 'FROM_250K_TO_500K',
    locations: ['SEOUL', 'BUSAN', 'DAEGU', 'GWANGJU'],
    options: ['STANDARD', 'PREMIUM', 'EMERGENCY'],
    responseTime: 'Priority scheduling available',
    highlights: [
      'Leak inspection and shutoff diagnosis',
      'Appliance hook-up and reconnection',
      'Valve replacement and line safety checks',
    ],
    deliverables: ['Safety inspection', 'Work completion summary', 'Recommended follow-up actions'],
  },
  {
    slug: 'electrical-repairs',
    image: '/theme/images/service/4.jpg',
    title: 'Electrical repairs',
    category: 'ELECTRICITY',
    description:
      'Fix switches, outlets, lighting issues, and urgent breaker faults with specialists who work clean and safely.',
    lead:
      'Targeted residential electrical repair support for switches, outlets, lighting circuits, and breaker-related faults.',
    priceLabel: '₩90k - ₩260k',
    priceBand: 'FROM_100K_TO_250K',
    locations: ['SEOUL', 'BUSAN', 'INCHEON', 'DAEGU', 'JEONJU'],
    options: ['STANDARD', 'PREMIUM', 'EMERGENCY'],
    responseTime: 'Flexible same-day slots',
    highlights: [
      'Outlet, switch, and lighting fixes',
      'Fault isolation and breaker review',
      'Clean finish with safety-first work area setup',
    ],
    deliverables: ['Issue diagnosis', 'Repair work', 'Usage and safety notes'],
  },
  {
    slug: 'bathroom-remodeling',
    image: '/theme/images/service/5.jpg',
    title: 'Bathroom remodeling',
    category: 'REMODELING',
    description:
      'Upgrade fixtures, tiling, layout, and finishes with coordinated bathroom refresh work from vetted crews.',
    lead:
      'Planned bathroom upgrades for homeowners who want layout improvements, better fixtures, and cleaner finishing quality.',
    priceLabel: '₩500k+',
    priceBand: 'ABOVE_500K',
    locations: ['SEOUL', 'INCHEON', 'JEJU'],
    options: ['STANDARD', 'PREMIUM'],
    responseTime: 'Project scheduling required',
    highlights: [
      'Fixture and tiling upgrades',
      'Layout improvement planning',
      'Coordinated finishing and cleanup',
    ],
    deliverables: ['Site review', 'Scope estimate', 'Timeline outline'],
  },
  {
    slug: 'clean-up-services',
    image: '/theme/images/service/6.jpg',
    title: 'Clean-up services',
    category: 'CLEANING',
    description:
      'Post-repair, move-in, and post-renovation cleaning support so every job ends with a ready-to-use space.',
    lead:
      'Detailed cleaning support after repairs, remodeling, or move-in prep when you need the space ready right away.',
    priceLabel: 'Under ₩100k',
    priceBand: 'UNDER_100K',
    locations: ['SEOUL', 'BUSAN', 'INCHEON', 'GWANGJU'],
    options: ['STANDARD', 'PREMIUM'],
    responseTime: 'Next available visit',
    highlights: [
      'Post-repair cleaning and dust removal',
      'Move-in refresh for kitchens and bathrooms',
      'Post-renovation surface cleanup',
    ],
    deliverables: ['Cleaning checklist', 'Consumables included', 'Ready-to-use handoff'],
  },
  {
    slug: 'water-line-repair',
    image: '/theme/images/service/2.jpg',
    title: 'Water line repair',
    category: 'WATER LINE',
    description:
      'Track down pressure issues, hidden pipe damage, and main line problems before they disrupt daily living.',
    lead:
      'Diagnose water line failures, pressure loss, and hidden pipe damage before they become major property issues.',
    priceLabel: '₩260k - ₩480k',
    priceBand: 'FROM_250K_TO_500K',
    locations: ['SEOUL', 'BUSAN', 'DAEGU', 'DAEJON'],
    options: ['STANDARD', 'PREMIUM', 'EMERGENCY'],
    responseTime: 'Priority repair slots available',
    highlights: [
      'Pressure-loss tracing and line diagnosis',
      'Hidden leak investigation',
      'Main line repair planning and isolation support',
    ],
    deliverables: ['Diagnostic summary', 'Repair proposal', 'Urgency assessment'],
  },
  {
    slug: 'basement-plumbing',
    image: '/theme/images/service/5.jpg',
    title: 'Basement plumbing',
    category: 'BASEMENT PLUMBING',
    description:
      'Sump pump, utility drains, moisture-prone pipework, and basement plumbing upgrades handled by trusted pros.',
    lead:
      'Basement-focused plumbing support for drainage, sump systems, moisture-prone lines, and utility-area fixes.',
    priceLabel: '₩130k - ₩330k',
    priceBand: 'FROM_100K_TO_250K',
    locations: ['SEOUL', 'INCHEON', 'DAEGU', 'JEONJU', 'GYEONGJU'],
    options: ['STANDARD', 'PREMIUM'],
    responseTime: 'Within 1-2 business days',
    highlights: [
      'Sump pump checks and servicing',
      'Utility drain troubleshooting',
      'Moisture-risk piping improvements',
    ],
    deliverables: ['Inspection notes', 'Repair options', 'Recommended prevention steps'],
  },
];

export const locationOptions: ServiceLocation[] = [
  'SEOUL',
  'BUSAN',
  'INCHEON',
  'DAEGU',
  'GYEONGJU',
  'GWANGJU',
  'JEONJU',
  'DAEJON',
  'JEJU',
];
export const serviceTypeOptions = [
  'PLUMBING',
  'WATER LINE',
  'GAS LINE',
  'ELECTRICITY',
  'REMODELING',
  'CLEANING',
  'BASEMENT PLUMBING',
] as const;
export const serviceOptionChoices: ServiceOption[] = ['STANDARD', 'PREMIUM', 'EMERGENCY'];
export const priceRangeOptions: Array<{ value: ServicePriceBand | 'ANY'; label: string }> = [
  { value: 'ANY', label: 'Any' },
  { value: 'UNDER_100K', label: 'Under ₩100k' },
  { value: 'FROM_100K_TO_250K', label: '₩100k - ₩250k' },
  { value: 'FROM_250K_TO_500K', label: '₩250k - ₩500k' },
  { value: 'ABOVE_500K', label: '₩500k+' },
];
