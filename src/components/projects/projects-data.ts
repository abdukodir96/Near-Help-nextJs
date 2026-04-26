export type ProjectItem = {
  slug: string;
  image: string;
  title: string;
  category: string;
  clientName: string;
  projectValue: string;
  date: string;
  description: string;
  description2: string;
  galleryImages: [string, string];
  workProcess: { title: string; desc: string }[];
  benefits: string[];
};

export const projectItems: ProjectItem[] = [
  {
    slug: 'luxury-bathroom-refresh',
    image: '/theme/images/projects/img-1.jpg',
    title: 'Luxury Bathroom Refresh',
    category: 'Remodeling',
    clientName: 'Robert William',
    projectValue: '₩1,200,000',
    date: '15 Mar 2024',
    description:
      'A full bathroom overhaul including retiling, new fixture installation, and waterproofing. The project transformed a dated bathroom into a modern, spa-like space with premium finishes and improved plumbing layout for better water pressure throughout.',
    description2:
      'Our team coordinated all trades — plumbing, tiling, and electrical — under one schedule to minimize disruption. The client received daily progress updates, and the project was completed two days ahead of the agreed timeline with zero punch-list issues at handover.',
    galleryImages: ['/theme/images/projects/img-2.jpg', '/theme/images/projects/img-3.jpg'],
    workProcess: [
      { title: 'Site Inspection', desc: 'Thorough evaluation of existing plumbing and structure before work begins.' },
      { title: 'Skilled Tradespeople', desc: 'Licensed specialists for each trade with verified experience records.' },
      { title: 'Quality Materials', desc: 'Only certified, durable materials approved for residential renovation use.' },
    ],
    benefits: [
      'Improved water pressure and drainage throughout the bathroom.',
      'Modern waterproofing prevents future moisture damage behind walls.',
      'Energy-efficient fixtures reduce monthly water and heating bills.',
      'Project managed end-to-end with one point of contact for the client.',
    ],
  },
  {
    slug: 'kitchen-pipe-rerouting',
    image: '/theme/images/projects/img-2.jpg',
    title: 'Kitchen Pipe Rerouting',
    category: 'Plumbing',
    clientName: 'Soomin Jang',
    projectValue: '₩680,000',
    date: '02 Jan 2024',
    description:
      'Complete rerouting of supply and drain lines in a 25-year-old kitchen to support a new island layout. Old galvanized pipes were replaced with PEX, improving flow rate and eliminating the persistent dripping that had been reported for months.',
    description2:
      'The rerouting required precise planning to avoid existing structural elements. Work was completed with minimal wall damage, and all openings were patched and painted to a finished standard. The client was able to resume full kitchen use within 48 hours of project start.',
    galleryImages: ['/theme/images/projects/img-3.jpg', '/theme/images/projects/img-8.jpg'],
    workProcess: [
      { title: 'Pipe Assessment', desc: 'Detailed mapping of existing supply and drain lines before any cuts are made.' },
      { title: 'Experienced Plumbers', desc: 'Master plumbers with 10+ years handling residential rerouting projects.' },
      { title: 'Pressure Testing', desc: 'All new lines are pressure-tested before walls are closed to ensure zero leaks.' },
    ],
    benefits: [
      'Eliminates recurring leaks caused by corroded old galvanized piping.',
      'PEX piping is flexible, freeze-resistant, and rated for 50+ years.',
      'Improved water pressure to all kitchen fixtures after rerouting.',
      'Minimal drywall damage with professional patch and paint included.',
    ],
  },
  {
    slug: 'whole-home-line-upgrade',
    image: '/theme/images/projects/img-3.jpg',
    title: 'Whole-Home Line Upgrade',
    category: 'Water Line Repair',
    clientName: 'Park Jiyeon',
    projectValue: '₩2,400,000',
    date: '20 Nov 2023',
    description:
      'Full replacement of the main water supply line from the street connection to all internal branch points. The original 1980s copper line had developed pinhole leaks in three locations, causing intermittent low pressure and water staining in two rooms.',
    description2:
      'The upgrade involved open-trench work in the front yard, new meter connection, and full interior branch replacement. All work was permitted and inspected. The homeowner saw immediate pressure improvement and received a 10-year workmanship guarantee upon completion.',
    galleryImages: ['/theme/images/projects/img-8.jpg', '/theme/images/projects/img-9.jpg'],
    workProcess: [
      { title: 'Leak Detection', desc: 'Non-invasive acoustic detection to locate all leak points before excavation.' },
      { title: 'Permitted Work', desc: 'All major line work is fully permitted and inspected by city officials.' },
      { title: 'Guaranteed Finish', desc: 'Written 10-year workmanship warranty provided on all line replacements.' },
    ],
    benefits: [
      'Restored full water pressure to every fixture in the home.',
      'Eliminated water staining and hidden moisture behind walls.',
      'New HDPE main line rated for 100+ years of service life.',
      'Permit and inspection records provided for future property sale.',
    ],
  },
  {
    slug: 'gas-appliance-installation',
    image: '/theme/images/projects/img-8.jpg',
    title: 'Gas Appliance Installation',
    category: 'Gas Line Services',
    clientName: 'Kim Daehyun',
    projectValue: '₩520,000',
    date: '08 Sep 2023',
    description:
      'Safe installation of a new gas range and dedicated dryer line in a newly renovated kitchen and utility room. A new branch line was run from the main gas meter with a dedicated shutoff valve at each appliance connection point.',
    description2:
      'All work was performed by a certified gas technician and included a full pressure test and leak-detection inspection before the gas was turned on. The client received a safety briefing and documentation of shutoff locations as part of the project handover.',
    galleryImages: ['/theme/images/projects/img-9.jpg', '/theme/images/projects/img-7.jpg'],
    workProcess: [
      { title: 'Certified Technician', desc: 'Only licensed gas technicians handle all connection and pressure work.' },
      { title: 'Leak Testing', desc: 'Every joint is tested with calibrated equipment before system activation.' },
      { title: 'Safety Handover', desc: 'Client receives full safety briefing and shutoff documentation at completion.' },
    ],
    benefits: [
      'Dedicated shutoff valves at each appliance for quick emergency isolation.',
      'Certified pressure test certificate provided after completion.',
      'Correct sizing prevents pressure drops when multiple appliances run.',
      'Compliant with current gas safety regulations for residential properties.',
    ],
  },
  {
    slug: 'after-remodel-deep-cleaning',
    image: '/theme/images/projects/img-9.jpg',
    title: 'After-Remodel Deep Cleaning',
    category: 'Cleaning',
    clientName: 'Yuna Choi',
    projectValue: '₩180,000',
    date: '14 Jul 2023',
    description:
      'Professional post-construction clean for a three-bedroom apartment following a six-week kitchen and bathroom remodel. Dust, construction debris, adhesive residue, and paint splatter were removed from all surfaces including fixtures, cabinetry, and flooring.',
    description2:
      'A five-person team completed the full clean in one day, using HEPA filtration vacuums, pH-neutral stone cleaners, and streak-free glass treatment. The client moved in the following morning with everything ready to use, including appliances and bathroom fittings.',
    galleryImages: ['/theme/images/projects/img-7.jpg', '/theme/images/projects/img-1.jpg'],
    workProcess: [
      { title: 'Full Assessment', desc: 'Pre-clean walkthrough to identify stubborn residues and delicate surfaces.' },
      { title: 'HEPA Equipment', desc: 'Hospital-grade HEPA vacuums capture fine construction dust from all surfaces.' },
      { title: 'Move-In Ready', desc: 'All appliances, fittings, and glass surfaces left spotless and functional.' },
    ],
    benefits: [
      'Removes fine construction dust that standard cleaning misses completely.',
      'Safe for new stone, tile, and hardwood surfaces without scratching.',
      'Single-day turnaround means minimal delay before moving in.',
      'Eco-friendly, low-VOC cleaning products used throughout the project.',
    ],
  },
  {
    slug: 'basement-utility-rebuild',
    image: '/theme/images/projects/img-7.jpg',
    title: 'Basement Utility Rebuild',
    category: 'Basement Plumbing',
    clientName: 'Lee Hyunwoo',
    projectValue: '₩1,750,000',
    date: '30 Apr 2023',
    description:
      'Full rebuild of basement utility area including floor drain installation, sump pump fitting, and rerouting of waste lines to accommodate a new laundry station. The project also addressed chronic seasonal flooding by installing a French drain around the perimeter.',
    description2:
      'Concrete cutting, drain installation, and pipe rerouting were completed in five days. A battery backup sump pump was added as a redundancy measure. The client has reported zero moisture issues through two subsequent rainy seasons since the project was completed.',
    galleryImages: ['/theme/images/projects/img-1.jpg', '/theme/images/projects/img-2.jpg'],
    workProcess: [
      { title: 'Moisture Mapping', desc: 'Thermal imaging used to locate all active moisture ingress points.' },
      { title: 'Expert Excavation', desc: 'Controlled concrete cutting with dust suppression throughout the work area.' },
      { title: 'Redundant Systems', desc: 'Primary and battery-backup sump pumps installed for year-round protection.' },
    ],
    benefits: [
      'Eliminates seasonal flooding that was damaging stored belongings.',
      'French drain system redirects groundwater away from the foundation.',
      'Battery backup ensures sump pump works even during power outages.',
      'New laundry station plumbing adds functional living space to the home.',
    ],
  },
];
