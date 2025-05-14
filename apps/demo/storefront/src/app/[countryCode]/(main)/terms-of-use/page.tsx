import { Metadata } from "next"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Learn about our terms of use",
}
export async function generateStaticParams() {
  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions.flatMap((r) =>
      r.countries
        ? r.countries
            .map((c) => c.iso_2)
            .filter(
              (value): value is string =>
                typeof value === "string" && Boolean(value)
            )
        : []
    )
  )

  const staticParams = countryCodes.map((countryCode) => ({
    countryCode,
  }))

  return staticParams
}

export default function TermsOfUsePage() {
  return (
    <Layout className="pt-30 pb-20 md:pt-47 md:pb-32">
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <h1 className="text-lg md:text-2xl mb-16 md:mb-25">
          Terms of Use for Sofa Society
        </h1>
      </LayoutColumn>
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 10, xl: 9 }}
        className="article"
      >
        <p>
          Welcome to Sofa Society. These Terms of Use govern your access to and
          use of our website, products, and services. By accessing or using our
          platform, you agree to be bound by these terms and conditions. If you
          do not agree with any part of these terms, please do not use our
          website.
        </p>
        <h2>1. Terms of Use:</h2>
        <p>
          All content and materials on our website, including text, graphics,
          logos, images, videos, and trademarks, are the property of Sofa
          Society or its licensors and are protected by intellectual property
          laws. You may not use, reproduce, modify, or distribute any of our
          content without our prior written permission.
        </p>
        <h2>2. Use of the Website:</h2>
        <ol>
          <li>
            Eligibility: You must be at least 16 years old to use our website.
            If you are under the age of 18, you should review these terms with a
            parent or guardian to ensure their understanding and agreement.
          </li>
          <li>
            User Account: Some features of our website may require you to create
            an account. You are responsible for maintaining the confidentiality
            of your account credentials and are solely responsible for any
            activity that occurs under your account.
          </li>
          <li>
            Prohibited Activities: You agree not to engage in any of the
            following activities:
            <ul>
              <li>Violating any applicable laws or regulations.</li>
              <li>
                Impersonating any person or entity or falsely representing your
                affiliation with any person or entity.
              </li>
              <li>
                Interfering with or disrupting the functionality of our website
                or servers.
              </li>
              <li>
                Uploading or transmitting any viruses, malware, or other
                malicious code.
              </li>
              <li>
                Collecting or harvesting any information from our website
                without our consent.
              </li>
            </ul>
          </li>
        </ol>
        <h2>3. Third-Party Links and Content:</h2>
        <p>
          Our website may contain links to third-party websites or display
          content from third parties. We do not endorse or control these
          third-party websites or content, and your use of them is at your own
          risk. We are not responsible for the accuracy, reliability, or
          legality of any third-party websites or content.
        </p>
        <h2>4. Disclaimer of Warranties:</h2>
        <p>
          Our website is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. We do not make any warranties, express or
          implied, regarding the operation, availability, or accuracy of our
          website or the content therein. Your use of our website is at your
          sole risk.
        </p>
        <h2>5. Limitation of Liability:</h2>
        <p>
          To the maximum extent permitted by law, Sofa Society and its
          affiliates, officers, directors, employees, and agents shall not be
          liable for any direct, indirect, incidental, consequential, or special
          damages arising out of or in connection with your use of our website,
          even if advised of the possibility of such damages.
        </p>
        <h2>6. Indemnification:</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Sofa Society and its
          affiliates, officers, directors, employees, and agents from and
          against any claims, liabilities, damages, losses, and expenses,
          including reasonable attorney&apos;s fees, arising out of or in
          connection with your use of our website or violation of these Terms of
          Use.
        </p>
        <h2>7. Modifications to the Terms:</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Sofa Society and its
          affiliates, officers, directors, employees, and agents from and
          against any claims, liabilities, damages, losses, and expenses,
          including reasonable attorney&apos;s fees, arising out of or in
          connection with your use of our website or violation of these Terms of
          Use.
        </p>
        <h2>8. Governing Law and Jurisdiction:</h2>
        <p>
          These Terms of Use shall be governed by and construed in accordance
          with the laws. Any disputes arising out of or in connection with these
          terms shall be subject to the exclusive jurisdiction of the courts.
        </p>
      </LayoutColumn>
    </Layout>
  )
}
