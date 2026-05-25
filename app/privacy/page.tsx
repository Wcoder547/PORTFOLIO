import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Waseem Akram",
  description: "Privacy policy for waseemmalikdev.eu.cc",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-16 px-6 lg:px-16">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <div className="mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] text-[#555] hover:text-white transition-colors duration-200 group"
          >
            <svg className="size-4 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to home
          </Link>
        </div>

        {/* Header */}
        <div className="pb-8 mb-12 border-b border-white/10">
          <h1 className="text-[clamp(36px,5vw,64px)] font-bold text-white leading-none tracking-[-0.03em] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[13px] text-[#444] font-mono">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-[15px] text-[#888] leading-[1.85] font-light">

          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-[-0.01em]">1. Overview</h2>
            <p>
              This privacy policy explains how Waseem Akram (&quot;I&quot;, &quot;me&quot;, &quot;my&quot;) collects, uses, and protects
              any information you provide when you use this website at waseemmalikdev.eu.cc.
            </p>
            <p>
              I am committed to ensuring your privacy is protected. This policy is effective as of January 2026
              and may be updated from time to time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-[-0.01em]">2. Information I Collect</h2>
            <p>I may collect the following information when you use the contact form or chatbot:</p>
            <ul className="space-y-2 pl-5 list-disc text-[#777]">
              <li>Your name and email address</li>
              <li>Project details or messages you submit</li>
              <li>General usage data (pages visited, time spent) via analytics</li>
            </ul>
            <p>
              I do not collect sensitive personal data such as payment information, government IDs,
              or health information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-[-0.01em]">3. How I Use Your Information</h2>
            <p>Information you provide is used solely to:</p>
            <ul className="space-y-2 pl-5 list-disc text-[#777]">
              <li>Respond to your enquiries or project requests</li>
              <li>Improve the website experience</li>
              <li>Understand how visitors use the site</li>
            </ul>
            <p>
              I will never sell, trade, or rent your personal information to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-[-0.01em]">4. Cookies</h2>
            <p>
              This website may use basic cookies to improve your browsing experience. These are small
              files stored on your device that help the site function correctly. You can choose to
              disable cookies through your browser settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-[-0.01em]">5. Third-Party Services</h2>
            <p>This website uses the following third-party services which may process your data:</p>
            <ul className="space-y-2 pl-5 list-disc text-[#777]">
              <li>
                <span className="text-[#aaa]">Vercel</span> — hosting and deployment
              </li>
              <li>
                <span className="text-[#aaa]">MongoDB Atlas</span> — database storage for contact form submissions
              </li>
              <li>
                <span className="text-[#aaa]">Cloudinary</span> — image hosting
              </li>
              <li>
                <span className="text-[#aaa]">Anthropic (Claude)</span> — AI chatbot responses
              </li>
            </ul>
            <p>
              Each of these services has their own privacy policies. I encourage you to review them.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-[-0.01em]">6. Data Security</h2>
            <p>
              I take reasonable precautions to protect your information. However, no method of
              transmission over the internet is 100% secure. I cannot guarantee absolute security
              of data transmitted to this site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-[-0.01em]">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="space-y-2 pl-5 list-disc text-[#777]">
              <li>Request access to the personal data I hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Opt out of any communications from me</li>
            </ul>
            <p>
              To exercise any of these rights, contact me at{" "}
              <a
                href="mailto:malikwaseemshzad@gmail.com"
                className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/70 transition-all"
              >
                malikwaseemshzad@gmail.com
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-[-0.01em]">8. Changes to This Policy</h2>
            <p>
              I may update this privacy policy from time to time. Any changes will be posted on
              this page with an updated revision date. Continued use of the site after changes
              constitutes your acceptance of the new policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-[-0.01em]">9. Contact</h2>
            <p>
              If you have any questions about this privacy policy, please contact me at{" "}
              <a
                href="mailto:malikwaseemshzad@gmail.com"
                className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/70 transition-all"
              >
                malikwaseemshzad@gmail.com
              </a>
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/8 flex items-center justify-between flex-wrap gap-4">
          <p className="text-[12px] text-[#333] font-mono">© 2026 Waseem Akram</p>
          <Link
            href="/terms"
            className="text-[12px] text-[#444] hover:text-white transition-colors duration-150"
          >
            Terms of Service →
          </Link>
        </div>

      </div>
    </main>
  );
}