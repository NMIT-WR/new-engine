import { Metadata } from "next"
import { StoreRegion } from "@medusajs/types"
import { Layout, LayoutColumn } from "@/components/Layout"
import { listRegions } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Cookie Policy",
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

export default function CookiePolicyPage() {
  return (
    <Layout className="pt-30 pb-20 md:pt-47 md:pb-32">
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <h1 className="text-lg md:text-2xl mb-16 md:mb-25">
          Cookie Policy for Sofa Society
        </h1>
      </LayoutColumn>
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 10, xl: 9 }}
        className="article"
      >
        <p>
          This Cookie Policy explains how Sofa Society uses cookies and similar
          technologies on our website. By using our website, you consent to the
          use of cookies as described in this policy.
        </p>
        <h2>1. What Are Cookies:</h2>
        <p>
          Cookies are small text files that are placed on your computer or
          device when you visit a website. They are widely used to make websites
          work more efficiently and provide a better browsing experience.
          Cookies also enable website owners to collect certain information
          about visitors.
        </p>
        <h2>2. Types of Cookies We Use:</h2>
        <p>We use the following types of cookies on our website:</p>
        <ul>
          <li>
            Essential Cookies: These cookies are necessary for the operation of
            our website and enable you to navigate and use its features. They
            are typically set in response to your actions, such as setting your
            privacy preferences, logging in, or filling out forms.
          </li>
          <li>
            Analytics and Performance Cookies: These cookies help us understand
            how visitors interact with our website by collecting information
            such as the number of visitors, pages visited, and sources of
            traffic. This data helps us improve our website&apos;s performance
            and usability.
          </li>
          <li>
            Functionality Cookies: These cookies allow our website to remember
            choices you make (such as language preferences) and provide enhanced
            features. They may also be used to provide personalized content
            based on your browsing history.
          </li>
          <li>
            Advertising and Targeting Cookies: These cookies are used to deliver
            advertisements that are relevant to your interests. They may also be
            used to limit the number of times you see an advertisement and
            measure the effectiveness of advertising campaigns.
          </li>
        </ul>
        <h2>3. Third-Party Cookies:</h2>
        <p>
          We may allow third-party service providers, such as analytics and
          advertising companies, to place cookies on our website. These third
          parties may collect information about your online activities over time
          and across different websites.
        </p>
        <h2>4. Cookie Management:</h2>
        <p>
          You can manage and control cookies through your browser settings. Most
          web browsers allow you to block or delete cookies. However, please
          note that blocking or deleting certain cookies may impact the
          functionality and user experience of our website.
        </p>
        <p>
          For more information on how to manage cookies, you can visit the help
          or settings section of your browser.
        </p>
        <h2>5. Updates to the Cookie Policy:</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes
          in our use of cookies or for other operational, legal, or regulatory
          reasons. We will notify you of any material changes by posting a
          prominent notice on our website.
        </p>
        <h2>6. Contact Us:</h2>
        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or how we handle your personal information, please
          contact us at:
        </p>
        <p>
          Email: privacy@sofasociety.com
          <br />
          Address: Skärgårdsvägen 12, 124 55 Stockholm
        </p>
      </LayoutColumn>
    </Layout>
  )
}
