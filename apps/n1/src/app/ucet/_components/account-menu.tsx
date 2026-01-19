import { useLogout } from '@/hooks/use-logout'
import { useAuthToast } from '@/hooks/use-toast'
import { resolveTab } from '@/lib/account-tabs'
import { Button } from '@techsio/ui-kit/atoms/button'
import { LinkButton } from '@techsio/ui-kit/atoms/link-button'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const AccountMenu = () => {
  const router = useRouter()
  const toast = useAuthToast()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = resolveTab(searchParams.get('tab'), pathname)
  const logoutMutation = useLogout({
    onSuccess: () => {
      toast.logoutSuccess()
      router.push('/prihlaseni')
    },
    onError: () => {
      toast.logoutError()
    },
  })

  return (
    <nav className="flex flex-col space-y-50">
      <LinkButton
        as={Link}
        className="justify-start data-[selected=true]:bg-surface data-[selected=true]:text-fg-primary"
        data-selected={activeTab === 'profile'}
        href="/ucet/profil?tab=profile"
        size="sm"
        theme="borderless"
        variant="secondary"
      >
        Osobní údaje
      </LinkButton>
      <LinkButton
        as={Link}
        className="justify-start data-[selected=true]:bg-surface data-[selected=true]:text-fg-primary"
        data-selected={activeTab === 'addresses'}
        href="/ucet/profil?tab=addresses"
        size="sm"
        theme="borderless"
        variant="secondary"
      >
        Adresy
      </LinkButton>
      <LinkButton
        as={Link}
        className="justify-start data-[selected=true]:bg-surface data-[selected=true]:text-fg-primary"
        data-selected={activeTab === 'orders'}
        href="/ucet/profil?tab=orders"
        size="sm"
        theme="borderless"
        variant="secondary"
      >
        Objednávky
      </LinkButton>
      <Button
        className="justify-start"
        size="sm"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        <span className="font-medium hover:underline">
          {logoutMutation.isPending ? 'Odhlašuji...' : 'Odhlásit se'}
        </span>
      </Button>
    </nav>
  )
}
