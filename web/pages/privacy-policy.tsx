import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://treasurestate.com/privacy-policy/" />
        <title>Privacy Policy - Treasure State</title>
        <meta name="description" content="Privacy policy for treasurestate.com. Learn how we collect, use, and protect your information, including our use of affiliate programs and cookies." />
        <meta property="og:title" content="Privacy Policy - Treasure State" />
        <meta property="og:url" content="https://treasurestate.com/privacy-policy/" />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <Header />
      <Hero
        title="Privacy Policy"
        subtitle="How we handle your information"
        image="/images/hero-image.jpg"
        alt="Montana landscape"
        small
      />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 20px' }}>
        <section>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            <strong>Last updated:</strong> April 2026
          </p>

          <h2>Introduction</h2>
          <p>
            Welcome to treasurestate.com ("we," "our," or "us"). We respect your privacy and are committed 
            to protecting your personal information. This Privacy Policy explains how we collect, use, and 
            safeguard your information when you visit our website.
          </p>

          <h2>Information We Collect</h2>
          <h3>Information You Provide</h3>
          <p>
            We may collect information you voluntarily provide, such as when you contact us via email or 
            submit feedback. This may include your name, email address, and the content of your message.
          </p>

          <h3>Automatically Collected Information</h3>
          <p>
            When you visit our website, we may automatically collect certain information, including:
          </p>
          <ul>
            <li>Your IP address and general location</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website or source</li>
          </ul>

          <h2>Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience and analyze 
            site traffic. You can control cookies through your browser settings.
          </p>

          <h3>Types of Cookies We Use</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
            <li><strong>Affiliate Cookies:</strong> Used by our affiliate partners to track referrals (see Affiliate Programs section below)</li>
          </ul>

          <h2>Affiliate Programs and Disclosures</h2>
          <p>
            treasurestate.com participates in affiliate marketing programs, which means we may earn 
            commissions on purchases made through links on our site. This comes at no additional cost to you.
          </p>

          <h3>Amazon Associates Program</h3>
          <p>
            <strong>treasurestate.com is a participant in the Amazon Services LLC Associates Program</strong>, 
            an affiliate advertising program designed to provide a means for sites to earn advertising fees 
            by advertising and linking to Amazon.com.
          </p>
          <p>
            As an Amazon Associate, we earn from qualifying purchases. When you click on Amazon product 
            links on our site, a cookie may be placed on your browser to track any qualifying purchases 
            you make on Amazon within a specified time period.
          </p>
          <p>
            Amazon's privacy practices are governed by Amazon's own Privacy Notice, which you can review 
            at <a href="https://www.amazon.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978' }}>amazon.com/privacy</a>.
          </p>

          <h3>Travel Affiliate Programs</h3>
          <p>
            We also participate in affiliate programs with travel booking platforms including VRBO and Expedia. 
            When you click on lodging links and make a booking, we may earn a commission. These partners may 
            place cookies on your browser to track referrals.
          </p>

          <h3>First-Party Store</h3>
          <p>
            Our merchandise store at shop.treasurestate.com is operated through Shopify. Purchases made 
            through our store are subject to Shopify's privacy practices in addition to this policy.
          </p>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and improve our website content</li>
            <li>Respond to your inquiries</li>
            <li>Analyze site usage and trends</li>
            <li>Ensure site security and prevent fraud</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>
            Our website may contain links to third-party websites, including affiliate partners, social media 
            platforms, and other resources. We are not responsible for the privacy practices of these external 
            sites. We encourage you to review their privacy policies.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement reasonable security measures to protect your information. However, no method of 
            transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our website is not directed at children under 13. We do not knowingly collect personal 
            information from children under 13. If you believe we have inadvertently collected such 
            information, please contact us.
          </p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have rights to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt out of certain data processing activities</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with 
            an updated "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us at 
            the email address provided on our website.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
