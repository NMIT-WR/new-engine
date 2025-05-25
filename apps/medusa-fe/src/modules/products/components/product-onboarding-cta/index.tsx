import { Button, Container, Text } from '@medusajs/ui'
import { cookies as nextCookies } from 'next/headers'

async function ProductOnboardingCta() {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get('_medusa_onboarding')?.value === 'true'

  if (!isOnboarding) {
    return null
  }

  return (
    <Container className="h-full w-full max-w-4xl bg-ui-bg-subtle p-8">
      <div className="center flex flex-col gap-y-4">
        <Text className="text-ui-fg-base text-xl">
          Your demo product was successfully created! 🎉
        </Text>
        <Text className="text-small-regular text-ui-fg-subtle">
          You can now continue setting up your store in the admin.
        </Text>
        <a href="http://localhost:7001/a/orders?onboarding_step=create_order_nextjs">
          <Button className="w-full">Continue setup in admin</Button>
        </a>
      </div>
    </Container>
  )
}

export default ProductOnboardingCta
