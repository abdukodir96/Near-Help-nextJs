"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  HeartStraight,
  MapPinLine,
  Play,
  Quotes,
  Star,
  Trophy,
  UsersThree,
  Wrench,
} from "phosphor-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./landing-page.module.scss";

const featureItems = [
  {
    icon: "/theme/images/icon/calendar.svg",
    title: "Book Online",
    active: false,
  },
  {
    icon: "/theme/images/icon/express-delivery.svg",
    title: "We Arrive",
    active: true,
  },
  {
    icon: "/theme/images/icon/prototype.svg",
    title: "Solve Problem",
    active: false,
  },
] as const;

const serviceItems = [
  {
    image: "/theme/images/service/1.jpg",
    title: "Emergency plumbing",
    description:
      "Rapid help for burst pipes, heavy leaks, blocked drains, and urgent water damage risks.",
  },
  {
    image: "/theme/images/service/2.jpg",
    title: "Water heater support",
    description:
      "Diagnostics, repair, installation guidance, and hot water recovery for homes and apartments.",
  },
  {
    image: "/theme/images/service/3.jpg",
    title: "Gas line services",
    description:
      "Safe gas appliance hookup, leak inspection, valve replacement, and certified line work.",
  },
  {
    image: "/theme/images/service/4.jpg",
    title: "Electrical repairs",
    description:
      "Fix outlets, switches, lighting, breaker issues, and urgent electrical faults with trusted pros.",
  },
  {
    image: "/theme/images/service/5.jpg",
    title: "Bathroom remodeling",
    description:
      "From fixtures to tiling and layout upgrades, plan full bathroom refresh projects with specialists.",
  },
  {
    image: "/theme/images/service/6.jpg",
    title: "Clean-up services",
    description:
      "Post-repair, move-in, and post-renovation cleaning support to leave every space fresh and ready.",
  },
] as const;

const statItems = [
  {
    icon: <Buildings size={52} weight="duotone" />,
    value: "200",
    label: "Running Project",
  },
  {
    icon: <UsersThree size={52} weight="duotone" />,
    value: "85+",
    label: "Team Member",
  },
  {
    icon: <Star size={52} weight="duotone" />,
    value: "39K",
    label: "Happy Clients",
  },
  {
    icon: <Wrench size={52} weight="duotone" />,
    value: "45",
    label: "Award-winning",
  },
] as const;

const projectItems = [
  {
    image: "/theme/images/projects/img-1.jpg",
    title: "Luxury bathroom refresh",
    category: "Remodeling",
  },
  {
    image: "/theme/images/projects/img-2.jpg",
    title: "Kitchen pipe rerouting",
    category: "Plumbing",
  },
  {
    image: "/theme/images/projects/img-3.jpg",
    title: "Whole-home line upgrade",
    category: "Water line repair",
  },
  {
    image: "/theme/images/projects/img-8.jpg",
    title: "Gas appliance installation",
    category: "Gas line services",
  },
  {
    image: "/theme/images/projects/img-9.jpg",
    title: "After-remodel deep cleaning",
    category: "Cleaning",
  },
  {
    image: "/theme/images/projects/img-7.jpg",
    title: "Basement utility rebuild",
    category: "Basement plumbing",
  },
] as const;

const agentItems = [
  {
    image: "/theme/images/team/1.jpg",
    name: "Henry Barton",
    role: "Team Leader",
    completedProjects: 86,
    likes: 1320,
    followers: 468,
  },
  {
    image: "/theme/images/team/2.jpg",
    name: "Mattie Washington",
    role: "Junior Member",
    completedProjects: 74,
    likes: 1188,
    followers: 402,
  },
  {
    image: "/theme/images/team/3.jpg",
    name: "Winifred Harmon",
    role: "Team Leader",
    completedProjects: 74,
    likes: 1210,
    followers: 397,
  },
  {
    image: "/theme/images/team/4.jpg",
    name: "Shelia Lawrence",
    role: "Senior Member",
    completedProjects: 61,
    likes: 980,
    followers: 355,
  },
  {
    image: "/theme/images/team/1.jpg",
    name: "Elijah Foster",
    role: "Field Supervisor",
    completedProjects: 58,
    likes: 940,
    followers: 338,
  },
  {
    image: "/theme/images/team/2.jpg",
    name: "Grace Kim",
    role: "Premium Installer",
    completedProjects: 52,
    likes: 905,
    followers: 322,
  },
  {
    image: "/theme/images/team/3.jpg",
    name: "Owen Park",
    role: "Gas Safety Specialist",
    completedProjects: 49,
    likes: 860,
    followers: 301,
  },
  {
    image: "/theme/images/team/4.jpg",
    name: "Amelia Stone",
    role: "Remodel Coordinator",
    completedProjects: 45,
    likes: 812,
    followers: 286,
  },
  {
    image: "/theme/images/team/1.jpg",
    name: "Lucas Bennett",
    role: "Drainage Technician",
    completedProjects: 39,
    likes: 760,
    followers: 254,
  },
  {
    image: "/theme/images/team/2.jpg",
    name: "Chloe Rivera",
    role: "Clean Finish Expert",
    completedProjects: 34,
    likes: 708,
    followers: 233,
  },
] as const;

const rankedAgentItems = [...agentItems]
  .map((item) => ({
    ...item,
    points: item.completedProjects,
  }))
  .sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.likes !== a.likes) return b.likes - a.likes;
    return b.followers - a.followers;
  })
  .map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const testimonialItems = [
  {
    quote:
      "NearHelp made it easy to compare real pros. We booked same-day service and the work quality was excellent.",
    name: "Hannah Seo",
    role: "Apartment owner",
    image: "/theme/images/testimonial/img-1.jpg",
  },
  {
    quote:
      "The platform saved us during an emergency leak. Messaging, booking, and updates all felt smooth and trustworthy.",
    name: "Minho Choi",
    role: "Property manager",
    image: "/theme/images/testimonial/img-2.jpg",
  },
  {
    quote:
      "I liked how clear the pricing guidance and reviews were. It felt much easier than calling random contractors.",
    name: "Sora Lim",
    role: "Homeowner",
    image: "/theme/images/testimonial/img-3.jpg",
  },
] as const;

const blogItems = [
  {
    image: "/theme/images/blog/img-1.jpg",
    date: "March 12, 2026",
    title: "How to choose the right plumber for an urgent repair",
    category: "Guide",
  },
  {
    image: "/theme/images/blog/img-2.jpg",
    date: "March 21, 2026",
    title: "What to expect before a bathroom remodel starts",
    category: "Remodeling",
  },
  {
    image: "/theme/images/blog/img-3.jpg",
    date: "March 27, 2026",
    title: "Post-renovation cleaning checklist for busy homeowners",
    category: "Cleaning",
  },
] as const;

const workItems = [
  {
    title: "Commercial Plumbing",
    icon: <Buildings size={38} weight="duotone" />,
    href: "/services",
    accent: false,
  },
  {
    title: "Residential Plumbing",
    icon: <MapPinLine size={38} weight="duotone" />,
    href: "/services",
    accent: true,
  },
] as const;

export const LandingPage = () => {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src="/theme/images/slider/slide-1.jpg"
            alt="Plumbing background"
            fill
            priority
            className={styles.heroBgImage}
          />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.heroEyebrow}>:: Highly Trained Staff</span>
            <h1 className={styles.heroTitle}>
              Ready
              <br />
              For <span>Help</span>
              <br />
              You.
            </h1>
            <p className={styles.heroDescription}>
              NearHelp connects homeowners with trusted specialists for
              plumbing, gas, electricity, remodeling, and clean-up work across
              Seoul.
            </p>
            <div className={styles.heroActions}>
              <Link
                prefetch={false}
                href="#booking"
                className={styles.primaryButton}
              >
                BOOK ONLINE
              </Link>
              <button
                type="button"
                className={styles.playButton}
                aria-label="Play intro video"
              >
                <Play size={24} weight="fill" />
              </button>
            </div>
          </div>

          <div className={styles.heroImageWrap}>
            <Image
              src="/theme/images/slider/right-img.png"
              alt="NearHelp specialist"
              width={780}
              height={880}
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresPanel}>
            <div className={styles.featuresGrid}>
              {featureItems.map((item, index) => (
                <div key={item.title} className={styles.featureStep}>
                  <div
                    className={`${styles.featureCard} ${item.active ? styles.featureCardActive : ""}`.trim()}
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={82}
                      height={82}
                      className={styles.featureIcon}
                    />
                    <h3>{item.title}</h3>
                  </div>
                  {index < featureItems.length - 1 && (
                    <span className={styles.featureArrow} aria-hidden="true">
                      <Image
                        src="/branding/step-arrow.png"
                        alt=""
                        width={75}
                        height={33}
                        className={styles.featureArrowImage}
                      />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.workSection}>
        <div className={styles.container}>
          <div className={styles.workGrid}>
            {workItems.map((item) => (
              <Link
                key={item.title}
                prefetch={false}
                href={item.href}
                className={`${styles.workCard} ${item.accent ? styles.workCardAccent : ""}`.trim()}
              >
                <span className={styles.workIcon}>{item.icon}</span>
                <span className={styles.workTitle}>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.serviceSection}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <span>Featured services</span>
            <h2>
              Everything NearHelp offers for urgent repairs, installations,
              upgrades, and finishing work.
            </h2>
          </div>
          <div className={styles.serviceGrid}>
            {serviceItems.map((item) => (
              <article key={item.title} className={styles.serviceCard}>
                <div className={styles.serviceImageWrap}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={520}
                    height={360}
                    className={styles.serviceImage}
                  />
                </div>
                <div className={styles.serviceBody}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link
                    prefetch={false}
                    href="/services"
                    className={styles.inlineLink}
                  >
                    View details <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.factsSection}>
        <div className={styles.container}>
          <div className={styles.factsLayout}>
            <div className={styles.factsCopy}>
              <h2>We Are Always Different From Other Services.</h2>
              <div className={styles.reviewBadge}>
                <strong>89K</strong>
                <div className={styles.reviewMeta}>
                  <div className={styles.stars}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        weight={index < 4 ? "fill" : "regular"}
                      />
                    ))}
                  </div>
                  <span>Customer Review</span>
                </div>
              </div>
            </div>
            <div className={styles.statsGrid}>
              {statItems.map((item) => (
                <div key={item.label} className={styles.statItem}>
                  <div className={styles.statIcon}>{item.icon}</div>
                  <div>
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.projectsSection}>
        <div className={styles.container}>
          <div className={styles.sectionIntroCenter}>
            <span>Latest projects</span>
            <h2>Recent work completed by our top-rated home service agents.</h2>
          </div>
          <div className={styles.projectGrid}>
            {projectItems.map((item) => (
              <article key={item.title} className={styles.projectCard}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={480}
                  height={420}
                  className={styles.projectImage}
                />
                <div className={styles.projectOverlay}>
                  <p>{item.category}</p>
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.projectsButtonWrap}>
            <Link prefetch={false} href="/services" className={styles.primaryCta}>
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionIntroCenter}>
            <span>Top master agents</span>
            <h2>Dedicated Member</h2>
            <p className={styles.sectionDescription}>
              Ranking is calculated from completed projects with 1 point for
              every finished job, then ordered by likes and follower count.
            </p>
          </div>
          <div className={styles.teamSliderWrap}>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={26}
              slidesPerView={1}
              loop
              speed={900}
              autoplay={{ delay: 3200, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className={styles.teamSlider}
            >
              {rankedAgentItems.map((item) => (
                <SwiperSlide key={item.name} className={styles.teamSlide}>
                  <article className={styles.teamCard}>
                    <div className={styles.teamRankBadge}>
                      <Trophy size={16} weight="fill" />
                      <span>#{item.rank}</span>
                    </div>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={420}
                      height={420}
                      className={styles.teamImage}
                    />
                    <div className={styles.teamBody}>
                      <h3>{item.name}</h3>
                      <span>{item.role}</span>
                      <div className={styles.teamMetrics}>
                        <div className={styles.teamMetric}>
                          <Trophy size={18} weight="duotone" />
                          <div>
                            <strong>{item.points}</strong>
                            <small>Points</small>
                          </div>
                        </div>
                        <div className={styles.teamMetric}>
                          <HeartStraight size={18} weight="duotone" />
                          <div>
                            <strong>{formatCompactNumber(item.likes)}</strong>
                            <small>Likes</small>
                          </div>
                        </div>
                        <div className={styles.teamMetric}>
                          <UsersThree size={18} weight="duotone" />
                          <div>
                            <strong>{formatCompactNumber(item.followers)}</strong>
                            <small>Followers</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className={styles.contactSection} id="booking">
        <div className={styles.contactMedia}>
          <Image
            src="/theme/images/contact.png"
            alt="Online booking"
            fill
            className={styles.contactImage}
          />
          <button
            type="button"
            className={styles.videoButton}
            aria-label="Play booking intro"
          >
            <Play size={30} weight="fill" />
          </button>
        </div>
        <div className={styles.container}>
          <div className={styles.contactLayout}>
            <div className={styles.contactFormCard}>
              <span>Online booking form</span>
              <h2>Book a trusted service visit in minutes.</h2>
              <form className={styles.contactForm}>
                <div className={styles.formGrid}>
                  <input type="text" placeholder="Your full name" />
                  <input type="tel" placeholder="Phone number" />
                  <select defaultValue="">
                    <option value="" disabled>
                      Service category
                    </option>
                    <option>Plumbing</option>
                    <option>Gas line services</option>
                    <option>Electricity services</option>
                    <option>Cleaning</option>
                  </select>
                  <select defaultValue="">
                    <option value="" disabled>
                      Service option
                    </option>
                    <option>Standard</option>
                    <option>Premium</option>
                    <option>Emergency</option>
                  </select>
                </div>
                <textarea
                  rows={5}
                  placeholder="Describe the issue you need help with"
                />
                <button type="submit" className={styles.primaryButton}>
                  GET FREE QUOTE
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.testimonialSection}>
        <div className={styles.container}>
          <div className={styles.testimonialLayout}>
            <div className={styles.testimonialIntro}>
              <span>Testimonials</span>
              <h2>
                Customers come back because the experience feels fast, clear,
                and reliable.
              </h2>
              <p>
                NearHelp combines real reviews, direct messaging, and smooth
                booking so users can choose with confidence instead of guessing.
              </p>
            </div>
            <div className={styles.testimonialGrid}>
              {testimonialItems.map((item) => (
                <article key={item.name} className={styles.testimonialCard}>
                  <div className={styles.testimonialQuote}>
                    <Quotes size={40} weight="fill" />
                    <p>{item.quote}</p>
                  </div>
                  <div className={styles.testimonialAuthor}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={70}
                      height={70}
                      className={styles.authorImage}
                    />
                    <div>
                      <h3>{item.name}</h3>
                      <span>{item.role}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.blogSection}>
        <div className={styles.container}>
          <div className={styles.sectionIntroCenter}>
            <span>Community updates</span>
            <h2>
              Helpful articles, practical tips, and project stories from the
              NearHelp network.
            </h2>
          </div>
          <div className={styles.blogGrid}>
            {blogItems.map((item) => (
              <article key={item.title} className={styles.blogCard}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={480}
                  height={300}
                  className={styles.blogImage}
                />
                <div className={styles.blogBody}>
                  <p className={styles.blogMeta}>
                    <span>{item.date}</span>
                    <span>{item.category}</span>
                  </p>
                  <h3>{item.title}</h3>
                  <Link
                    prefetch={false}
                    href="/community"
                    className={styles.inlineLink}
                  >
                    Read more <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
