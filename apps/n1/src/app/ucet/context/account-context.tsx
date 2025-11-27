import { type ReactNode, createContext, useContext, useState } from 'react'

interface AccountContextType {
  activeTab: 'profile' | 'addresses' | 'orders'
  setActiveTab: (tab: 'profile' | 'addresses' | 'orders') => void
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export const useAccountContext = () => {
  const context = useContext(AccountContext)
  if (!context) {
    throw new Error('useAccountContext must be used within AccountProvider')
  }
  return context
}

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'addresses' | 'orders'
  >('profile')

  const contextValue = {
    activeTab,
    setActiveTab,
  }

  return <AccountContext value={contextValue}>{children}</AccountContext>
}
