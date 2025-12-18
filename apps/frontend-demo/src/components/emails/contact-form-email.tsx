import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

interface ContactFormEmailProps {
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
}

export const ContactFormEmail = ({
  firstName,
  lastName,
  email,
  phone,
  subject,
  message,
}: ContactFormEmailProps) => {
  const previewText = `Nová zpráva od ${firstName} ${lastName}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="font-sans">
          <Container className="mx-auto my-1 flex w-layout-md flex-col rounded-lg bg-gray-50 p-8 shadow-lg">
            <Heading className="mb-8 text-center font-bold text-2xl text-email-fg-primary">
              Nová zpráva z kontaktního formuláře
            </Heading>
            <Section className="mb-1">
              <Text className="mb-0 font-semibold text-email-fg-secondary text-sm">
                Jméno:
              </Text>
              <Text className="m-0 text-email-fg-primary text-md">
                {firstName} {lastName}
              </Text>
            </Section>

            <Section className="mb-1">
              <Text className="mb-0 font-semibold text-email-fg-secondary text-sm">
                Email:
              </Text>
              <Link
                className="text-email-link underline"
                href={`mailto:${email}`}
              >
                {email}
              </Link>
            </Section>

            {phone && (
              <Section className="mb-1">
                <Text className="mb-0 font-semibold text-gray-600 text-sm">
                  Telefon:
                </Text>
                <Text className="m-0 text-gray-800 text-md">{phone}</Text>
              </Section>
            )}

            <Section className="mb-1">
              <Text className="mb-0 font-semibold text-gray-600 text-sm">
                Téma:
              </Text>
              <Text className="m-0 text-gray-800 text-md">
                {getSubjectLabel(subject)}
              </Text>
            </Section>

            <Hr className="my-6 border-gray-200" />

            <Section className="mb-6">
              <Text className="mb-2 font-semibold text-gray-600 text-sm">
                Zpráva:
              </Text>
              <Text className="m-0 whitespace-pre-wrap text-gray-800 text-md leading-relaxed">
                {message}
              </Text>
            </Section>

            <Hr className="my-6 border-gray-200" />

            <Text className="mt-8 text-center text-gray-500 text-xs">
              Tato zpráva byla odeslána prostřednictvím kontaktního formuláře na
              webu.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ContactFormEmail.PreviewProps = {
  firstName: "Jan",
  lastName: "Novák",
  email: "jan.novak@example.com",
  phone: "+420 123 456 789",
  subject: "general",
  message: "Dobrý den, rád bych se zeptal na dostupnost vašich produktů.",
} as ContactFormEmailProps

// Helper function to get subject label
function getSubjectLabel(subject: string): string {
  const subjects: Record<string, string> = {
    general: "Obecný dotaz",
    support: "Technická podpora",
    shipping: "Doprava a doručení",
    returns: "Vrácení zboží",
    other: "Jiné",
  }
  return subjects[subject] || subject
}
