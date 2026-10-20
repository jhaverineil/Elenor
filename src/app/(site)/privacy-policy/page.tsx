import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { type LegalSection } from '@/components/legal/LegalPage';
import { SITE } from '@/data/site';

const description = 'How Elenor collects, uses and protects the information you share through this website.';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description,
  alternates: { canonical: '/privacy-policy' },
  openGraph: { url: '/privacy-policy', title: 'Privacy Policy | Elenor', description },
};

// This policy describes what the site actually does. Update it whenever a form,
// integration, analytics tool or cookie is added or removed.
const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <p>
        This website is operated by Elenor (“we”, “us”). We are responsible for the personal information you share
        with us through it. You can reach us at any time through our <Link href="/contact?topic=privacy">contact form</Link>{' '}
        by choosing “Privacy request”.
      </p>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'Information we collect',
    body: (
      <>
        <p>We only collect information that you choose to send us:</p>
        <ul>
          <li>
            <strong>Enquiries</strong> — your name, email address, phone number (optional), the topic you select, your
            message and, if you came from a product page, the product you asked about.
          </li>
          <li>
            <strong>Notify me requests</strong> — your name, email address, phone number (optional), an optional note,
            and the piece you would like to hear about.
          </li>
          <li>
            <strong>Letters from Elenor</strong> — your email address.
          </li>
        </ul>
        <p>
          When you visit, our hosting provider processes the technical information any website receives — such as your IP
          address, browser type and the pages requested — in order to deliver the site and keep it secure. When you send a
          form, your IP address is also used briefly to limit repeated submissions; it is not stored with your message.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How we use it',
    body: (
      <ul>
        <li>To reply to your enquiry and continue the conversation you started.</li>
        <li>To tell you once when a piece you asked about becomes available.</li>
        <li>To send Letters from Elenor, no more than once a month, if you subscribed.</li>
        <li>To protect the website and its forms from spam and abuse.</li>
      </ul>
    ),
  },
  {
    id: 'not-do',
    title: 'What we do not do',
    body: (
      <p>
        We do not sell or rent your information, we do not use it for advertising, and we do not take payments on this
        website. We do not add you to the newsletter unless you subscribe to it.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies, analytics and storage',
    body: (
      <>
        <p>
          The public website does not set cookies and does not use analytics, advertising or tracking tools. Our fonts,
          images and videos are served from our own website rather than third-party networks.
        </p>
        <p>
          The private studio administration area uses your browser&rsquo;s local storage to keep authorised staff signed
          in. It is not used for visitors.
        </p>
      </>
    ),
  },
  {
    id: 'third-parties',
    title: 'Service providers and third parties',
    body: (
      <>
        <p>We rely on a small number of providers who process information on our behalf:</p>
        <ul>
          <li>
            <strong>Supabase</strong> — stores the enquiries, notify-me requests and newsletter sign-ups you send.
          </li>
          <li>
            <strong>Netlify</strong> — hosts and delivers this website.
          </li>
          <li>
            <strong>Our email provider</strong> — a copy of each enquiry, notify-me request and sign-up is emailed to
            the studio inbox so a member of the team can reply to you.
          </li>
          <li>
            <strong>Email automation</strong> — when enabled, a copy of a new submission is also forwarded to an
            automation service that alerts our team.
          </li>
        </ul>
        <p>
          If you choose to message us on WhatsApp ({SITE.whatsappDisplay}) or follow a link to Instagram, your
          conversation and use of those services are governed by their own privacy policies.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    body: (
      <p>
        We keep enquiries and notify-me requests for as long as we need them to respond and to keep a record of our
        correspondence with you, and newsletter sign-ups until you ask to be removed. You can ask us to delete your
        information at any time and we will do so unless we are required to keep it.
      </p>
    ),
  },
  {
    id: 'security',
    title: 'How we protect it',
    body: (
      <p>
        The website is served over an encrypted (HTTPS) connection. Submissions are stored with our database provider and
        can only be viewed by authorised staff through a password-protected administration area, where passwords are
        stored as one-way hashes. No method of transmission or storage is completely secure, but we work to protect your
        information and limit access to it.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your choices and rights',
    body: (
      <>
        <p>
          You can ask us for a copy of the information we hold about you, ask us to correct or delete it, or withdraw
          from the newsletter at any time. Depending on where you live, you may have further rights under data protection
          law, including the right to complain to your local data protection authority.
        </p>
        <p>
          To make a request, use the <Link href="/contact?topic=privacy">contact form</Link> and choose “Privacy
          request”. We will reply {SITE.responseTime} and may need to confirm your identity before acting on it.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        If we change how we handle information — for example by adding a new form or service — we will update this page
        and the date at the top.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      path="/privacy-policy"
      intro="We collect as little as we can, use it only to reply to you, and never sell it. This page sets out exactly what happens to the information you share with us."
      sections={sections}
    />
  );
}
