import { useLogout } from '@/hooks/use-logout'
import { Button } from '@techsio/ui-kit/atoms/button'
import { useRouter } from 'next/navigation'
import { useAccountContext } from '../context/account-context'

export const AccountMenu = () => {
  const router = useRouter()
  const { activeTab, setActiveTab } = useAccountContext()
  const logoutMutation = useLogout({
    onSuccess: () => router.push('/prihlaseni'),
  })

  const handleTabClick = (tab: 'profile' | 'addresses' | 'orders') => {
    setActiveTab(tab)
    router.push(`/ucet/profil`)
  }
  return (
    <nav className="flex flex-col space-y-50">
      <Button
        theme="unstyled"
        className="justify-start py-100"
        size="current"
        onClick={() => handleTabClick('profile')}
      >
        <span
          className="font-medium hover:underline data-[selected=true]:underline"
          data-selected={activeTab === 'profile'}
        >
          Osobní údaje
        </span>
      </Button>
      <Button
        theme="unstyled"
        className="justify-start py-100"
        size="current"
        onClick={() => handleTabClick('addresses')}
      >
        <span
          className="font-medium hover:underline data-[selected=true]:underline"
          data-selected={activeTab === 'addresses'}
        >
          Adresy
        </span>
      </Button>
      <Button
        theme="unstyled"
        className="justify-start py-100"
        size="current"
        onClick={() => handleTabClick('orders')}
      >
        <span
          className="font-medium hover:underline data-[selected=true]:underline"
          data-selected={activeTab === 'orders'}
        >
          Objednávky
        </span>
      </Button>
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
