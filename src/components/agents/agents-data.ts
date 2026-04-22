export type AgentReview = {
  id: string;
  author: string;
  date: string;
  rating: number;
  message: string;
};

export type AgentCompletedProject = {
  id: string;
  title: string;
  location: string;
  option: 'STANDARD' | 'PREMIUM' | 'EMERGENCY';
  serviceSlug: string;
  summary: string;
};

export type AgentItem = {
  backendMemberId?: string;
  slug: string;
  image: string;
  name: string;
  role: string;
  position: string;
  specialty: string;
  practiceArea: string;
  location: string;
  experience: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  completedProjects: number;
  likes: number;
  followers: number;
  profileViews: number;
  personalExperience: string[];
  serviceSlugs: string[];
  reviews: AgentReview[];
  completedProjectsList: AgentCompletedProject[];
};

const review = (
  id: string,
  author: string,
  date: string,
  rating: number,
  message: string,
): AgentReview => ({ id, author, date, rating, message });

const project = (
  id: string,
  title: string,
  location: string,
  option: 'STANDARD' | 'PREMIUM' | 'EMERGENCY',
  serviceSlug: string,
  summary: string,
): AgentCompletedProject => ({ id, title, location, option, serviceSlug, summary });

export const agentItems: AgentItem[] = [
  {
    slug: 'henry-barton',
    image: '/theme/images/team/1.jpg',
    name: 'Henry Barton',
    role: 'Team Leader',
    position: 'Lead Response Technician',
    specialty: 'General plumbing',
    practiceArea: 'Emergency plumbing coordination',
    location: 'SEOUL',
    experience: '14 Years',
    address: 'Teheran-ro 418, Gangnam-gu, Seoul 06192',
    phone: '+82 10 2469 4411',
    email: 'henry.barton@nearhelp.kr',
    fax: '02 568 7411',
    completedProjects: 86,
    likes: 1320,
    followers: 468,
    profileViews: 44,
    personalExperience: [
      'Henry has led high-priority plumbing response work across apartment towers, mixed-use buildings, and private homes where fast diagnosis matters as much as technical repair quality. His work style is practical, calm under pressure, and focused on keeping homeowners informed before and after each major service decision.',
      'Over the years, he has specialized in burst pipe response, leak isolation, and coordination between inspection, repair, and follow-up clean-up. Clients tend to trust him for jobs that need both speed and clear communication, especially when a repair affects multiple rooms or shared building lines.',
    ],
    serviceSlugs: ['emergency-plumbing', 'water-heater-support', 'gas-line-services'],
    reviews: [
      review('henry-r1', 'Mina Choi', '3 days ago', 5, 'Henry made a stressful leak situation feel manageable. The explanation was calm, clear, and the repair team arrived exactly when promised.'),
      review('henry-r2', 'Daniel Yoo', '1 week ago', 5, 'Very strong on urgent jobs. The follow-up communication after the repair was better than what we usually get from local contractors.'),
    ],
    completedProjectsList: [
      project('henry-p1', 'Burst pipe response for duplex home', 'SEOUL', 'EMERGENCY', 'emergency-plumbing', 'Stabilized active leakage, isolated the damaged section, and coordinated same-day restoration planning.'),
      project('henry-p2', 'Boiler room safety and gas line review', 'INCHEON', 'PREMIUM', 'gas-line-services', 'Completed a multi-point inspection before reconnection and documented the upgrade path for the owner.'),
    ],
  },
  {
    slug: 'mattie-washington',
    image: '/theme/images/team/2.jpg',
    name: 'Mattie Washington',
    role: 'Junior Member',
    position: 'Kitchen Service Specialist',
    specialty: 'Kitchen repair',
    practiceArea: 'Sink, drain, and fixture support',
    location: 'BUSAN',
    experience: '12 Years',
    address: 'Centum Jungang-ro 97, Haeundae-gu, Busan 48058',
    phone: '+82 10 5687 4698',
    email: 'mattie.washington@nearhelp.kr',
    fax: '051 746 0987',
    completedProjects: 74,
    likes: 1188,
    followers: 402,
    profileViews: 32,
    personalExperience: [
      'Mattie focuses on kitchen-side repairs where homeowners need accurate scope review before a small issue turns into cabinet damage, odor problems, or recurring drainage trouble. He is known for explaining repair causes in simple terms and helping customers understand what needs immediate action versus what can be scheduled later.',
      'His recent work has included trap replacement, fixture resets, under-sink leak correction, and cleanup-friendly repair visits for busy households. That practical experience makes him a reliable fit for homes that want clear expectations, clean workmanship, and solid follow-through after the appointment is closed.',
    ],
    serviceSlugs: ['emergency-plumbing', 'water-heater-support', 'clean-up-services'],
    reviews: [
      review('mattie-r1', 'Yujin Park', '2 days ago', 5, 'Mattie helped us sort out a repeated kitchen drain issue that two earlier visits from another company had missed.'),
      review('mattie-r2', 'Noah Kim', '6 days ago', 4, 'The visit felt organized and practical. We appreciated the clean finish and the way the repair options were explained.'),
      review('mattie-r3', 'Eunji Han', '9 days ago', 5, 'Fast scheduling, respectful service, and no confusing upsell language. Exactly what we needed.'),
    ],
    completedProjectsList: [
      project('mattie-p1', 'Under-sink leak correction and reset', 'BUSAN', 'STANDARD', 'emergency-plumbing', 'Resolved recurring drain leakage and replaced aging fixture connectors without cabinet removal.'),
      project('mattie-p2', 'Hot water inconsistency review for apartment kitchen', 'BUSAN', 'PREMIUM', 'water-heater-support', 'Verified heater-side issue, coordinated next-step repair visit, and restored temporary stable usage.'),
      project('mattie-p3', 'Post-repair clean finish for open kitchen', 'INCHEON', 'STANDARD', 'clean-up-services', 'Completed a fast same-day cleanup plan after a multi-part plumbing visit in a lived-in family kitchen.'),
    ],
  },
  {
    slug: 'winifred-harmon',
    image: '/theme/images/team/3.jpg',
    name: 'Winifred Harmon',
    role: 'Team Leader',
    position: 'Gas Safety Coordinator',
    specialty: 'Gas line services',
    practiceArea: 'Inspection, compliance, and reconnection planning',
    location: 'INCHEON',
    experience: '13 Years',
    address: 'Songdo-dong 84, Yeonsu-gu, Incheon 21984',
    phone: '+82 10 2469 4422',
    email: 'winifred.harmon@nearhelp.kr',
    backendMemberId: '69be6869ee579c8abe719c6a',
    fax: '032 746 1102',
    completedProjects: 74,
    likes: 1210,
    followers: 397,
    profileViews: 29,
    personalExperience: [
      'Winifred works on gas-related service coordination where safety documentation, inspection timing, and careful communication are essential. He is often assigned when a household needs a measured approach to appliance hookup, line review, or leak-risk assessment with minimal disruption.',
      'His strength is combining field experience with disciplined safety habits, which helps homeowners feel more confident about approvals, preparation, and post-service checks. He also works closely with scheduling teams when a service requires staged visits rather than a single appointment window.',
    ],
    serviceSlugs: ['gas-line-services', 'electrical-repairs'],
    reviews: [
      review('winifred-r1', 'Hana Seo', '4 days ago', 5, 'Very reassuring throughout the whole process. We felt safer making decisions after the inspection report was explained.'),
      review('winifred-r2', 'Chris Moon', '1 week ago', 5, 'The line review was structured and easy to follow. Strong communication and no rushed recommendations.'),
    ],
    completedProjectsList: [
      project('winifred-p1', 'Gas appliance reconnection safety review', 'INCHEON', 'PREMIUM', 'gas-line-services', 'Confirmed installation readiness, completed safety checks, and signed off on a staged reconnection plan.'),
      project('winifred-p2', 'Mixed utility inspection before move-in', 'SEOUL', 'STANDARD', 'electrical-repairs', 'Coordinated electrical and gas safety review to reduce risk before final occupancy handover.'),
    ],
  },
  {
    slug: 'shelia-lawrence',
    image: '/theme/images/team/4.jpg',
    name: 'Shelia Lawrence',
    role: 'Senior Member',
    position: 'Bathroom Repair Consultant',
    specialty: 'Bathroom service',
    practiceArea: 'Fixtures, drainage, and moisture checks',
    location: 'DAEGU',
    experience: '11 Years',
    address: 'Dongdaegu-ro 305, Suseong-gu, Daegu 42117',
    phone: '+82 10 2469 4433',
    email: 'shelia.lawrence@nearhelp.kr',
    fax: '053 781 3305',
    completedProjects: 61,
    likes: 980,
    followers: 355,
    profileViews: 27,
    personalExperience: [
      'Shelia handles bathroom-side work where leaking fixtures, poor drainage, seal failure, or older fittings are affecting comfort and day-to-day use. Her service record is strongest on repair plans that need careful inspection before replacement decisions are made.',
      'She is especially effective with homeowners who want realistic guidance on whether a problem needs a full remodel scope or just a focused repair visit. That balance between practical repair judgment and customer communication is what keeps her ranking consistently high.',
    ],
    serviceSlugs: ['bathroom-remodeling', 'emergency-plumbing', 'clean-up-services'],
    reviews: [
      review('shelia-r1', 'Jisoo Lee', 'Yesterday', 5, 'Shelia gave us a realistic bathroom repair plan instead of pushing a full remodel we did not need right away.'),
      review('shelia-r2', 'Arthur Song', '5 days ago', 4, 'Excellent with inspection detail. We got better clarity on moisture risk and fixture replacement timing.'),
    ],
    completedProjectsList: [
      project('shelia-p1', 'Bathroom fixture leak stabilization', 'DAEGU', 'EMERGENCY', 'emergency-plumbing', 'Stopped active leakage and built a phased repair plan to avoid tile damage in a busy family home.'),
      project('shelia-p2', 'Guest bathroom refresh coordination', 'GYEONGJU', 'PREMIUM', 'bathroom-remodeling', 'Managed fixture upgrade scope, timeline expectations, and finishing handoff for a compact remodel.'),
    ],
  },
  {
    slug: 'elijah-foster',
    image: '/theme/images/team/1.jpg',
    name: 'Elijah Foster',
    role: 'Field Supervisor',
    position: 'Pressure & Line Diagnostics Lead',
    specialty: 'Water line diagnostics',
    practiceArea: 'Low pressure, hidden leaks, and basement line checks',
    location: 'DAEJON',
    experience: '10 Years',
    address: 'Dunsan-ro 129, Seo-gu, Daejeon 35241',
    phone: '+82 10 2469 4444',
    email: 'elijah.foster@nearhelp.kr',
    backendMemberId: '69be6894ee579c8abe719c70',
    fax: '042 602 4415',
    completedProjects: 58,
    likes: 940,
    followers: 338,
    profileViews: 25,
    personalExperience: [
      'Elijah is typically brought into jobs where standard fixture repair is not enough and the problem may be tied to pressure loss, routing issues, or older water line conditions. His inspections are structured, detail-heavy, and useful for customers who need confidence before approving deeper repair work.',
      'He also coordinates well with service teams that need to hand off from diagnosis to repair without losing notes or customer context. That makes him a strong choice when the issue seems larger than a quick one-visit fix.',
    ],
    serviceSlugs: ['water-heater-support', 'emergency-plumbing'],
    reviews: [
      review('elijah-r1', 'Minji Kwon', '3 days ago', 5, 'We booked Elijah after pressure problems kept coming back. His diagnosis was the first one that actually made sense.'),
      review('elijah-r2', 'Kevin Lim', '1 week ago', 5, 'Great for bigger plumbing questions where you need someone to separate urgent repair from long-term line work.'),
    ],
    completedProjectsList: [
      project('elijah-p1', 'Hidden line pressure-loss assessment', 'DAEJON', 'PREMIUM', 'water-heater-support', 'Identified the main source of inconsistent pressure and coordinated a staged repair recommendation.'),
      project('elijah-p2', 'Basement leak path diagnosis', 'JEONJU', 'STANDARD', 'emergency-plumbing', 'Tracked a concealed leak source and prevented unnecessary demolition by narrowing repair scope early.'),
    ],
  },
  {
    slug: 'grace-kim',
    image: '/theme/images/team/2.jpg',
    name: 'Grace Kim',
    role: 'Premium Installer',
    position: 'Water Heater Support Specialist',
    specialty: 'Water heater support',
    practiceArea: 'Recovery issues and heater replacement planning',
    location: 'GYEONGJU',
    experience: '9 Years',
    address: 'Wonhyo-ro 88, Gyeongju-si, Gyeongbuk 38151',
    phone: '+82 10 2469 4455',
    email: 'grace.kim@nearhelp.kr',
    fax: '054 740 2218',
    completedProjects: 52,
    likes: 905,
    followers: 322,
    profileViews: 24,
    personalExperience: [
      'Grace supports water heater-related service requests where timing, comfort, and system reliability matter to the homeowner more than anything else. She is often selected for jobs that need a cleaner explanation of replacement timing, safe next steps, and what kind of downtime to expect during service.',
      'Her experience includes performance checks, recovery troubleshooting, and coordination for replacement-ready visits. Customers usually rate her highly because the service feels organized from the first message through the final recommendation.',
    ],
    serviceSlugs: ['water-heater-support', 'clean-up-services'],
    reviews: [
      review('grace-r1', 'Jiwon Han', '2 days ago', 5, 'Grace was excellent at explaining what was wrong with our heater without making the visit feel overwhelming.'),
      review('grace-r2', 'Sora Min', '8 days ago', 4, 'The follow-up notes were useful and the replacement planning felt very transparent.'),
    ],
    completedProjectsList: [
      project('grace-p1', 'Family-home hot water recovery repair', 'GYEONGJU', 'STANDARD', 'water-heater-support', 'Restored stable hot water output after diagnosing a performance issue tied to aging heater components.'),
      project('grace-p2', 'Water heater replacement prep and finish cleanup', 'BUSAN', 'PREMIUM', 'clean-up-services', 'Coordinated prep, installation handoff, and same-day cleanup to reduce downtime for the household.'),
    ],
  },
  {
    slug: 'owen-park',
    image: '/theme/images/team/3.jpg',
    name: 'Owen Park',
    role: 'Gas Safety Specialist',
    position: 'Appliance Hookup Planner',
    specialty: 'Gas and appliance setup',
    practiceArea: 'Hookup readiness, access checks, and installation sequencing',
    location: 'GWANGJU',
    experience: '8 Years',
    address: 'Sangmu-daero 112, Seo-gu, Gwangju 61949',
    phone: '+82 10 2469 4466',
    email: 'owen.park@nearhelp.kr',
    backendMemberId: '69b991c87e39278900809345',
    fax: '062 604 7712',
    completedProjects: 49,
    likes: 860,
    followers: 301,
    profileViews: 22,
    personalExperience: [
      'Owen works on appliance-side service bookings where proper hookup planning and safety sequencing are just as important as the physical installation. He is a strong fit for homeowners who want a smoother process when moving from purchase to safe in-home setup.',
      'His service background includes pre-install inspections, line condition review, and support for staged appointments when additional checks are needed before final connection. That methodical approach is why customers often return to him for related follow-up work.',
    ],
    serviceSlugs: ['gas-line-services', 'electrical-repairs'],
    reviews: [
      review('owen-r1', 'Leo Choi', '4 days ago', 5, 'Owen handled our appliance hookup review carefully and made the whole process feel much less risky.'),
      review('owen-r2', 'Jina Ryu', '10 days ago', 4, 'Very methodical. We especially liked the readiness checklist before the final hookup appointment.'),
    ],
    completedProjectsList: [
      project('owen-p1', 'Gas range hookup readiness review', 'GWANGJU', 'STANDARD', 'gas-line-services', 'Verified line condition and ventilation details before final appliance connection for a renovated kitchen.'),
      project('owen-p2', 'Combined utility access safety check', 'BUSAN', 'PREMIUM', 'electrical-repairs', 'Worked with electrical review timing so the installation sequence stayed compliant and efficient.'),
    ],
  },
  {
    slug: 'amelia-stone',
    image: '/theme/images/team/4.jpg',
    name: 'Amelia Stone',
    role: 'Remodel Coordinator',
    position: 'Bathroom Planning Advisor',
    specialty: 'Bathroom remodeling',
    practiceArea: 'Layout guidance, fixture upgrades, and phased remodel planning',
    location: 'JEJU',
    experience: '9 Years',
    address: 'Nohyeong-ro 221, Jeju-si, Jeju 63082',
    phone: '+82 10 2469 4477',
    email: 'amelia.stone@nearhelp.kr',
    backendMemberId: '69be68afee579c8abe719c78',
    fax: '064 713 4208',
    completedProjects: 45,
    likes: 812,
    followers: 286,
    profileViews: 18,
    personalExperience: [
      'Amelia handles remodeling inquiries where homeowners need help comparing scope, sequencing, and the service tradeoffs between partial refresh work and full renovation. She has a practical style that helps customers understand what can be improved quickly and what requires more structured planning.',
      'Because she has worked across fixture changes, finishing coordination, and layout-sensitive updates, her appointments tend to be especially helpful during early planning. Many customers use her recommendations to move from an unclear idea to a realistic project scope they can schedule with confidence.',
    ],
    serviceSlugs: ['bathroom-remodeling', 'clean-up-services'],
    reviews: [
      review('amelia-r1', 'Sangho Lim', '3 days ago', 5, 'Amelia was great at narrowing down what we actually needed for our bathroom refresh instead of making the project feel too big.'),
      review('amelia-r2', 'Clara Hwang', '11 days ago', 5, 'The scope planning was thoughtful, and we could finally compare layout options with real tradeoffs.'),
    ],
    completedProjectsList: [
      project('amelia-p1', 'Primary bathroom planning and fixture upgrade', 'JEJU', 'PREMIUM', 'bathroom-remodeling', 'Turned an unclear remodel request into a phased project plan with realistic timing and finish priorities.'),
      project('amelia-p2', 'Post-remodel cleaning and handoff prep', 'SEOUL', 'STANDARD', 'clean-up-services', 'Coordinated the closeout checklist so the homeowner could use the bathroom immediately after final work.'),
    ],
  },
  {
    slug: 'lucas-bennett',
    image: '/theme/images/team/1.jpg',
    name: 'Lucas Bennett',
    role: 'Drainage Technician',
    position: 'Lower-Level Repair Specialist',
    specialty: 'Drainage and lower-level diagnostics',
    practiceArea: 'Basement drainage, moisture risk, and utility access prep',
    location: 'JEONJU',
    experience: '7 Years',
    address: 'Baekje-daero 341, Wansan-gu, Jeonju 54999',
    phone: '+82 10 2469 4488',
    email: 'lucas.bennett@nearhelp.kr',
    backendMemberId: '69be68a2ee579c8abe719c74',
    fax: '063 284 1183',
    completedProjects: 39,
    likes: 760,
    followers: 254,
    profileViews: 17,
    personalExperience: [
      'Lucas focuses on lower-level plumbing problems where drainage behavior, moisture risk, and older infrastructure can make a small issue feel unpredictable. He is often requested for basement-side work that needs a more careful first inspection before the repair plan is finalized.',
      'His field notes tend to be detailed and useful for homeowners deciding how urgent the issue really is. That makes him especially dependable on jobs where the customer wants a realistic assessment without unnecessary upselling.',
    ],
    serviceSlugs: ['emergency-plumbing', 'electrical-repairs', 'water-heater-support'],
    reviews: [
      review('lucas-r1', 'Minsu Jeon', '5 days ago', 4, 'Lucas was very practical about what needed urgent action and what could be scheduled later.'),
      review('lucas-r2', 'Grace Yoo', '12 days ago', 5, 'We appreciated the inspection notes. The job felt careful and well scoped from the start.'),
    ],
    completedProjectsList: [
      project('lucas-p1', 'Basement drainage troubleshooting visit', 'JEONJU', 'STANDARD', 'emergency-plumbing', 'Diagnosed repeated lower-level drainage issues and outlined the safest next repair sequence.'),
      project('lucas-p2', 'Utility room lighting and access fix before pipe work', 'DAEJON', 'PREMIUM', 'electrical-repairs', 'Improved work-area safety and visibility before deeper basement plumbing activity began.'),
    ],
  },
  {
    slug: 'chloe-rivera',
    image: '/theme/images/team/2.jpg',
    name: 'Chloe Rivera',
    role: 'Clean Finish Specialist',
    position: 'Post-Service Handoff Coordinator',
    specialty: 'Clean-up services',
    practiceArea: 'Post-repair cleanup, handoff quality, and final reset planning',
    location: 'SEOUL',
    experience: '6 Years',
    address: 'Mapo-daero 76, Mapo-gu, Seoul 04168',
    phone: '+82 10 2469 4499',
    email: 'chloe.rivera@nearhelp.kr',
    backendMemberId: '69be68cdee579c8abe719c7c',
    fax: '02 335 6621',
    completedProjects: 34,
    likes: 708,
    followers: 233,
    profileViews: 15,
    personalExperience: [
      'Chloe supports the finishing side of home service work, especially after repair visits, remodeling activity, or move-in prep where the final result needs to feel clean and ready rather than simply completed. She is valued for being organized, responsive, and detail-aware during the last stage of a service journey.',
      'Her experience makes her a strong partner when the homeowner cares about presentation, handoff quality, and making the space usable again without extra follow-up. That attention to final condition is what drives her strong feedback from repeat customers.',
    ],
    serviceSlugs: ['clean-up-services', 'bathroom-remodeling'],
    reviews: [
      review('chloe-r1', 'Ara Shin', '2 days ago', 5, 'Chloe’s cleanup plan made the house feel finished, not just repaired. That final step mattered a lot to us.'),
      review('chloe-r2', 'Dylan Park', '1 week ago', 4, 'Very strong on handoff quality and what still needed a quick reset before we could comfortably use the space again.'),
    ],
    completedProjectsList: [
      project('chloe-p1', 'Post-renovation full reset cleanup', 'SEOUL', 'PREMIUM', 'clean-up-services', 'Prepared a remodeled living area for move-in by coordinating dust control, surface reset, and finish checks.'),
      project('chloe-p2', 'Bathroom final clean and checklist handoff', 'INCHEON', 'STANDARD', 'bathroom-remodeling', 'Completed the final ready-to-use handoff after fixture and tile work were signed off.'),
    ],
  },
];

export const getAgentBySlug = (slug: string) => agentItems.find((item) => item.slug === slug);
