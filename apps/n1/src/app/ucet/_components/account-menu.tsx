import { useLogout } from '@/hooks/use-logout'
import { useAuthToast } from '@/hooks/use-toast'
import { ACCOUNT_TABS, type AccountTab, resolveTab } from '@/lib/account-tabs'
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
  const ACCOUNT_BASE_PATH = '/ucet/profil'
  const tabLabels: Record<AccountTab, string> = {
    profile: 'Osobní údaje',
    addresses: 'Adresy',
    orders: 'Objednávky',
  }

  return (
    <nav className="flex flex-col space-y-50">
      {ACCOUNT_TABS.map((tab) => (
        <LinkButton
          key={tab}
          as={Link}
          className="justify-start data-[selected=true]:bg-surface data-[selected=true]:text-fg-primary"
          data-selected={activeTab === tab}
          href={`${ACCOUNT_BASE_PATH}?tab=${tab}`}
          size="sm"
          theme="borderless"
          variant="secondary"
        >
          {tabLabels[tab]}
        </LinkButton>
      ))}
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
