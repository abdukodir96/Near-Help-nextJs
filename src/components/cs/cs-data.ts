export type CsTab = 'notice' | 'faq';

export type CsNoticeItem = {
  number: number | 'event';
  title: string;
  date: string;
  featured?: boolean;
};

export type CsFaqCategoryKey = 'booking' | 'payment' | 'customers' | 'agents' | 'membership' | 'community' | 'other';

export type CsFaqItem = {
  question: string;
  answer: string;
};

const faq = (question: string, answer: string): CsFaqItem => ({ question, answer });

export const csNoticeItems: CsNoticeItem[] = [
  {
    number: 'event',
    title: 'Register your account and receive a first-booking discount for selected services',
    date: '01.03.2026',
    featured: true,
  },
  {
    number: 2,
    title: 'Emergency bookings are now available 24/7 in Seoul and Busan',
    date: '31.03.2026',
  },
  {
    number: 3,
    title: 'Water heater support coverage has expanded to Incheon and Daegu',
    date: '09.04.2026',
  },
  {
    number: 4,
    title: 'Community posting policy has been updated for review and recommendation boards',
    date: '14.04.2026',
  },
  {
    number: 5,
    title: 'Premium remodeling consultations now include clearer scope and price guidance',
    date: '18.04.2026',
  },
];

export const csFaqCategories: Array<{ key: CsFaqCategoryKey; label: string }> = [
  { key: 'booking', label: 'Booking' },
  { key: 'payment', label: 'Payment' },
  { key: 'customers', label: 'For Customers' },
  { key: 'agents', label: 'For Agents' },
  { key: 'membership', label: 'Membership' },
  { key: 'community', label: 'Community' },
  { key: 'other', label: 'Other' },
];

export const csFaqItems: Record<CsFaqCategoryKey, CsFaqItem[]> = {
  booking: [
    faq(
      'How do I book a service through NearHelp?',
      'Choose your service category, select the service option that matches your urgency, describe the issue, and submit the booking form. After that, the admin team can review the request and assign an appointment window.',
    ),
    faq(
      'What is the difference between Standard, Premium, and Emergency options?',
      'Standard is for flexible jobs, Premium is for customers who want a more detailed service flow and planning support, and Emergency is for issues that cannot wait such as active leaks, urgent drainage trouble, or safety-related failures.',
    ),
    faq(
      'Can I choose a specific agent before submitting a booking?',
      'Yes. If you already know which agent you want, you can review that agent profile first and then continue the booking with that agent in mind. Final assignment can still depend on schedule, location, and service fit.',
    ),
    faq(
      'How quickly can I get a same-day appointment?',
      'Response time depends on your location, the service option you selected, and current demand. Emergency requests are prioritized, while Standard and Premium bookings are confirmed according to available slots.',
    ),
    faq(
      'Can I edit or cancel my booking request later?',
      'Yes. Once account-side booking management is fully connected, you will be able to review and update requests from My Page. Until then, the CS team can help you change or cancel a submitted booking.',
    ),
    faq(
      'What details should I include when describing my issue?',
      'Try to mention the room, the visible symptom, how long the issue has been happening, and whether the situation feels urgent. Clear details help the team route the booking faster and more accurately.',
    ),
    faq(
      'Can I book a service for a future date instead of as soon as possible?',
      'Yes. Standard and Premium requests can be planned ahead if your job is not urgent. Emergency bookings are handled first when the issue affects safety, water damage risk, or essential home use.',
    ),
    faq(
      'What happens after I submit a booking form?',
      'The request is reviewed, matched to the right service flow, and then routed toward appointment confirmation. In the next backend-connected stage, users will also see clearer status updates inside My Page.',
    ),
    faq(
      'Can I request multiple service needs in one booking?',
      'Yes, but it depends on how closely related the issues are. If the problems involve different scopes or require different specialists, the team may split them into separate appointments for clarity.',
    ),
    faq(
      'Will I be notified if the appointment time changes?',
      'Yes. Time changes should be surfaced through future notification flows and account history. Until that integration is fully connected, CS can still help communicate schedule updates directly.',
    ),
  ],
  payment: [
    faq(
      'When is the final price confirmed?',
      'The final amount is confirmed after the issue scope, urgency, and visit requirements are reviewed. This helps avoid unrealistic quotes before an agent checks the actual condition of the job.',
    ),
    faq(
      'Can Premium or Emergency service cost more than Standard?',
      'Yes. Premium and Emergency options may include faster response, more detailed coordination, or higher service urgency, so pricing can differ from Standard bookings.',
    ),
    faq(
      'Will I receive a payment receipt?',
      'Yes. Receipt and booking history support will be exposed more clearly through account pages once the payment module is fully connected to the frontend.',
    ),
    faq(
      'Do you support refunds for canceled bookings?',
      'Refund handling depends on the booking stage and whether an on-site visit has already been scheduled or completed. The CS team can review each case and explain the next step.',
    ),
    faq(
      'Which payment methods will be supported on the platform?',
      'The final payment flow can support multiple methods once backend payment integration is completed. The UI is already being shaped to accommodate clear billing history, receipts, and booking-linked payment states.',
    ),
    faq(
      'Do I pay before the visit or after the service is reviewed?',
      'That depends on the service workflow. Some jobs can be priced only after the scope is reviewed, especially when hidden damage, urgency, or material requirements affect the final amount.',
    ),
    faq(
      'Are price estimates free before I confirm the job?',
      'Basic guidance can be shared before a visit, but exact pricing may still depend on the final issue review. This avoids misleading numbers that change once the real condition is inspected.',
    ),
    faq(
      'Can the final price change after the inspection?',
      'Yes, if the actual issue turns out to be broader than the initial description. In those cases, the team should explain why the scope changed before the next step is approved.',
    ),
    faq(
      'Is there a cancellation fee if I change my mind?',
      'Possible cancellation fees depend on how far the booking has progressed, whether an agent has been assigned, and whether the service requires immediate dispatch or reserved planning time.',
    ),
    faq(
      'Where can I check my previous invoices later?',
      'Invoice and payment history are planned to appear in My Page so users can review past transactions, receipts, and appointment-linked billing details in one place.',
    ),
  ],
  customers: [
    faq(
      'How do I compare service quality before booking?',
      'You can review agent rankings, completed projects, customer reviews, and community posts. Those areas are designed to help homeowners make decisions with more context than a simple listing page.',
    ),
    faq(
      'Can I upload photos of the issue?',
      'That attachment flow can be added during the final booking API integration. The current UI is already structured so visual issue details can be included in the next stage.',
    ),
    faq(
      'What if I do not know which service category fits my problem?',
      'Use the service list, check service details, or contact CS. If you describe the issue clearly, the team can still guide you toward the right category before the appointment is confirmed.',
    ),
    faq(
      'Can I follow agents and contact them later?',
      'Yes. Agent profiles support follow actions so users can keep track of specialists they trust and revisit their pages more easily later.',
    ),
    faq(
      'How can I tell whether an agent is a good fit for my job?',
      'Look at the agent role, practice area, completed projects, customer reviews, and the services listed on the profile. Those details help users compare specialists before they commit.',
    ),
    faq(
      'Will the platform show how urgent my issue really is?',
      'The service option and issue description already help with that direction. As the booking flow evolves, urgency guidance can become clearer so users understand whether Standard or Emergency is more suitable.',
    ),
    faq(
      'Can I save or favorite services for later review?',
      'Yes. The broader account structure already includes favorites and recent activity sections, and those flows can be connected more fully as backend endpoints are finalized.',
    ),
    faq(
      'Do you support customers who are booking for the first time?',
      'Yes. The platform is being shaped so new users can learn through service descriptions, CS guidance, community examples, and agent detail pages before sending a request.',
    ),
    faq(
      'Can I book on behalf of a family member or another property owner?',
      'Yes, but the request should clearly explain who will be on-site, what property is affected, and how the assigned specialist should coordinate communication for the appointment.',
    ),
    faq(
      'What should I do if I am not satisfied after the service visit?',
      'You should use the review flow, contact CS, and provide clear details about the issue. That makes it easier to re-check the case and decide whether follow-up support is needed.',
    ),
  ],
  agents: [
    faq(
      'How can a specialist join as a NearHelp agent?',
      'Agent onboarding is reviewed through the admin and verification workflow. Service background, location coverage, and specialization all matter before a profile is published publicly.',
    ),
    faq(
      'How are top agents ranked on the platform?',
      'Ranking starts from completed projects, then uses signals such as likes and follower count. This keeps performance history important while still reflecting community trust and engagement.',
    ),
    faq(
      'Can agents manage their services and availability later?',
      'Yes. The platform structure already includes My Page and admin flows, and the next backend-connected stage will expose fuller service and schedule management for approved agents.',
    ),
    faq(
      'What happens when a customer follows an agent?',
      'Following helps users return to the same specialist profile later. It can also support future notification and engagement features around services, reviews, and community activity.',
    ),
    faq(
      'Can agents receive reviews directly from completed bookings?',
      'Yes. That is the intended direction so feedback can stay connected to real appointments instead of floating as unrelated public reactions.',
    ),
    faq(
      'How are agent profiles ordered on the agents page?',
      'Agent ranking is prepared around completed jobs, likes, and followers. This gives performance, trust, and engagement all a role in how specialists are surfaced.',
    ),
    faq(
      'Can agents showcase completed projects on their detail page?',
      'Yes. Agent detail pages are already structured for completed project cards, and those can later be sourced from the backend instead of local showcase data.',
    ),
    faq(
      'Will agents be able to respond to customer reviews?',
      'That can be added in later stages. The current UI already supports nested comments and replies in some places, so the interaction pattern is compatible with future agent review responses.',
    ),
    faq(
      'Can an agent specialize in more than one service category?',
      'Yes. Many specialists can cover overlapping areas such as emergency plumbing, water heater support, clean-up service, or remodeling-related coordination.',
    ),
    faq(
      'How do agents gain more visibility on NearHelp?',
      'The strongest signals come from completed work quality, better community trust, stronger reviews, and more users choosing to follow that specialist over time.',
    ),
  ],
  membership: [
    faq(
      'Do I need an account to book a service?',
      'An account is strongly recommended because it allows booking history, notifications, comments, follows, and future payment tracking to stay attached to one user profile.',
    ),
    faq(
      'What extra features do logged-in users get?',
      'Logged-in users can like content, follow agents, write community posts, comment, reply, and submit reviews. Some actions are intentionally blocked for guests so activity stays tied to real accounts.',
    ),
    faq(
      'Can I manage my followers, favorites, and bookings in one place?',
      'Yes. My Page has already been structured for that direction, and the remaining backend integrations will complete those connected account views.',
    ),
    faq(
      'Can I update my profile information later?',
      'Yes. Account settings should support profile detail changes, notification preferences, and history management as those sections become fully connected to backend user flows.',
    ),
    faq(
      'Why are some actions blocked unless I log in first?',
      'Features like liking, commenting, replying, and following are tied to authenticated users so the platform can keep engagement more reliable and easier to moderate.',
    ),
    faq(
      'Will I see my recent activity after logging in?',
      'Yes. The account area is already structured around recent interactions, saved content, and booking-linked history that can become more visible over time.',
    ),
    faq(
      'Can I sign up with the same email I use for booking updates?',
      'Yes. In fact, using the same email helps keep account actions, booking confirmations, and future notifications in one consistent profile.',
    ),
    faq(
      'What happens if I forget my password?',
      'Password recovery and login support can be handled through the authentication flow. As that area matures, users will have clearer self-service recovery options.',
    ),
    faq(
      'Can I use NearHelp without completing my full profile?',
      'Basic browsing is possible, but a more complete profile becomes useful when you want to track bookings, engage with posts, leave reviews, or manage your agent follows.',
    ),
    faq(
      'Will membership include more personalized features later?',
      'Yes. The platform structure already leaves room for deeper recommendations, booking history tools, notification tracking, and more account-based personalization.',
    ),
  ],
  community: [
    faq(
      'What is the purpose of the community board?',
      'The community area is for sharing repair experiences, asking service questions, posting recommendations, and helping other homeowners make better booking choices.',
    ),
    faq(
      'Can I like posts, write comments, and reply to discussions?',
      'Yes, but those actions require login. This keeps activity tied to registered users and makes moderation more reliable as the board grows.',
    ),
    faq(
      'Are there rules for what can be posted?',
      'Yes. Off-topic, abusive, misleading, or spam-style content can be limited once moderation tools are connected from the admin side.',
    ),
    faq(
      'Can community posts link back to agents?',
      'Yes. Author blocks and service-related content can direct users toward agent profiles and detail pages where more trust signals are available.',
    ),
    faq(
      'Can I open a post and discuss it in more detail?',
      'Yes. Community cards already route toward detail pages where users can read the full content, comment, reply, and interact more deeply with the discussion.',
    ),
    faq(
      'Will community posts show real likes and view counts later?',
      'Yes. The UI is already prepared for that behavior, and future backend integration can connect those counts to persistent post activity.',
    ),
    faq(
      'Can I write recommendation posts about a good agent experience?',
      'Yes. Recommendation-style content is one of the strongest community use cases because it helps new users compare real service outcomes before they book.',
    ),
    faq(
      'What kind of comments are most useful on community posts?',
      'The most helpful comments explain what service was booked, what went well or badly, how urgent the issue was, and whether the result matched expectations.',
    ),
    faq(
      'Can moderators remove harmful or misleading content later?',
      'Yes. The admin structure already anticipates moderation flows so the board can stay useful, practical, and safer as the amount of content increases.',
    ),
    faq(
      'Will community activity affect trust in services and agents?',
      'Yes. Community activity can act as an extra trust layer because it gives context to agent rankings, service choices, and booking confidence beyond simple listings.',
    ),
  ],
  other: [
    faq(
      'Which cities are currently covered by NearHelp services?',
      'Current frontend examples already include Seoul, Busan, Incheon, Daegu, Daejeon, Gwangju, Suwon, Ulsan, Goyang, and nearby locations prepared for filtering and routing logic.',
    ),
    faq(
      'How do I contact support if I still need help?',
      'You can use the CS center, booking flow, or future support channels connected through notices, FAQ updates, and account-based support messages.',
    ),
    faq(
      'Will NearHelp support more service categories later?',
      'Yes. The structure is ready to grow with more categories, richer service options, and more detailed backend-driven filtering over time.',
    ),
    faq(
      'Can the platform support other home services beyond plumbing?',
      'Yes. The architecture is flexible enough to expand into related home service categories once the product and backend models are ready for a wider scope.',
    ),
    faq(
      'Will the language and locale options grow later?',
      'Yes. The app already includes localization structure, so more translation coverage and region-specific wording can be added in future updates.',
    ),
    faq(
      'Can NearHelp help with both urgent repairs and planned projects?',
      'Yes. That balance is part of the platform direction, since some users need immediate help while others need more careful planning, comparison, and agent selection.',
    ),
    faq(
      'Why do some areas still use showcase data instead of backend data?',
      'Because the frontend is being developed in phases. Some screens already follow the final layout and interaction logic even before every API flow is fully connected.',
    ),
    faq(
      'Will alerts and notifications become more advanced later?',
      'Yes. The current structure already uses alert patterns for login-required actions, and that can grow into richer appointment, payment, and engagement notifications.',
    ),
    faq(
      'Can NearHelp become a full marketplace instead of just a booking page?',
      'Yes. The current design already points in that direction with agents, services, reviews, community content, follows, and account-based workflows.',
    ),
    faq(
      'Where should I look first if I am completely new to the platform?',
      'Start with the home page, services list, agent profiles, and CS center. Those areas together give the clearest overview of what the platform can do and how bookings are meant to flow.',
    ),
  ],
};
