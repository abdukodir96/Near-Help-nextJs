'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { EnvelopeSimple, MapPin, PhoneCall } from 'phosphor-react';
import Swal from 'sweetalert2';
import styles from './contact-page.module.scss';

const contactCards = [
  {
    title: 'Address',
    lines: ['서울시 강북구 번동 471-63반지'],
    icon: MapPin,
  },
  {
    title: 'Email Us',
    lines: ['support@nearhelp.kr', 'bookings@nearhelp.kr'],
    icon: EnvelopeSimple,
  },
  {
    title: 'Call Now',
    lines: ['+82 10 4867 2909', '+82 10 2469 4424'],
    icon: PhoneCall,
  },
] as const;

const serviceOptions = [
  'Emergency plumbing',
  'Gas line services',
  'Water heater support',
  'Bathroom remodeling',
  'Electrical repairs',
  'Clean-up services',
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  '서울시 강북구 번동 471-63반지',
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const service = form.service.trim();
    const message = form.message.trim();

    if (!name || !email || !phone || !service || !message) {
      void Swal.fire({
        icon: 'warning',
        title: 'Complete the form',
        text: 'Please fill in your name, email, phone, service, and message before sending.',
        confirmButtonColor: '#0052da',
      });
      return;
    }

    if (!emailPattern.test(email)) {
      void Swal.fire({
        icon: 'error',
        title: 'Invalid email',
        text: 'Please enter a valid email address so we can reply to you.',
        confirmButtonColor: '#0052da',
      });
      return;
    }

    void Swal.fire({
      icon: 'success',
      title: 'Message sent',
      text: 'Your support request has been sent successfully. We will contact you soon.',
      confirmButtonColor: '#0052da',
    });

    setForm({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    });
  };

  return (
    <main className={styles.page}>
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.infoCardGrid}>
            {contactCards.map(({ title, lines, icon: Icon }) => (
              <article key={title} className={styles.infoCard}>
                <span className={styles.infoIcon}>
                  <Icon size={28} weight="duotone" />
                </span>
                <h2>{title}</h2>
                <div className={styles.infoLines}>
                  {lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className={styles.formIntro}>
            <h1>Have Any Question?</h1>
            <p>
              Share your booking question, service issue, or support request and our
              team will get back to you as quickly as possible.
            </p>
          </div>

          <div className={styles.formCardWrap}>
            <form className={styles.formCard} onSubmit={handleSubmit}>
              <div className={styles.inputGrid}>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your phone"
                />
                <select name="service" value={form.service} onChange={handleChange}>
                  <option value="">Choose a Service</option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                rows={7}
              />

              <div className={styles.submitWrap}>
                <button type="submit">Submit Now</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className={styles.mapSection} aria-label="NearHelp location map">
        <iframe
          title="NearHelp location"
          src={mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={styles.mapFrame}
        />
      </section>
    </main>
  );
};
