import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { type LegalSection } from '@/components/legal/LegalPage';

const description =
  'The terms that apply when you use the Elenor website, send an enquiry or ask to be notified — including product information, intellectual property and liability.';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description,
  alternates: { canonical: '/terms-and-conditions' },
  openGraph: { url: '/terms-and-conditions', title: 'Terms & Conditions | Elenor', description },
};

const sections: LegalSection[] = [
  {
    id: 'about',
    title: 'About these terms',
    body: (
      <p>
        These terms apply to your use of the Elenor website. By using the site you accept them. If you do not agree,
        please do not use the site. Our <Link href="/privacy-policy">Privacy Policy</Link> explains how we handle the
        information you share with us.
      </p>
    ),
  },
  {
    id: 'no-sales',
    title: 'No online sales',
    body: (
      <>
        <p>
          This website presents Elenor and its products. We do not list prices, take orders or accept payments here.
        </p>
        <p>
          Sending an enquiry or a notify-me request does not create an order or any obligation for either of us, and we
          cannot guarantee that a product will be available. If you later arrange to acquire a product from us, any terms
          for that will be agreed with you directly at the time.
        </p>
      </>
    ),
  },
  {
    id: 'product-information',
    title: 'Product information',
    body: (
      <>
        <p>
          Product descriptions, ingredient lists, directions and pack sizes on this site are taken from the product
          packaging at the time of publication. Formulations and packaging can change, so always read the label on the
          product itself, which takes precedence over this website. All products are for external use only.
        </p>
        <p>
          Photographs are illustrative and colours may appear differently on your screen. Pieces marked “Coming soon” are
          still in development: their names, descriptions and appearance may change, and we do not commit to a release
          date.
        </p>
      </>
    ),
  },
  {
    id: 'accuracy',
    title: 'Accuracy of the website',
    body: (
      <p>
        We take care to keep the site accurate and up to date, but its content is provided for general information and
        may contain errors or omissions. We may change, suspend or withdraw any part of the site without notice.
      </p>
    ),
  },
  {
    id: 'use',
    title: 'Using the site responsibly',
    body: (
      <>
        <p>When using the site, please do not:</p>
        <ul>
          <li>submit false, misleading or unlawful information, or information about another person without their permission;</li>
          <li>send spam, automated submissions or bulk messages through our forms;</li>
          <li>attempt to gain unauthorised access to the site, its administration area or the systems behind it;</li>
          <li>interfere with the site’s operation or security.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ip',
    title: 'Intellectual property',
    body: (
      <p>
        The Elenor name and logo, and the text, photography, video and design of this website, belong to Elenor or its
        licensors. You may view and share links to the site for personal, non-commercial purposes, but you may not copy,
        reproduce or reuse its content without our written permission.
      </p>
    ),
  },
  {
    id: 'links',
    title: 'Links to other services',
    body: (
      <p>
        The site may link to services we do not control, such as WhatsApp or Instagram. We are not responsible for their
        content or practices, and their own terms apply when you use them.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Liability',
    body: (
      <p>
        The website is provided on an “as is” basis. To the extent permitted by law, we are not liable for any loss
        arising from your use of, or inability to use, the website or from reliance on its content. Nothing in these terms
        limits or excludes any liability that cannot be limited or excluded by law.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: <p>We may update these terms from time to time. The date at the top of this page shows when they last changed.</p>,
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        Questions about these terms are welcome — please <Link href="/contact">write to us</Link>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      path="/terms-and-conditions"
      intro="The plain terms that apply when you browse the Elenor website, send us an enquiry or ask to be notified about new pieces."
      sections={sections}
    />
  );
}
