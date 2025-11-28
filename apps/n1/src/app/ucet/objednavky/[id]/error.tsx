'use client'

import { Button } from '@techsio/ui-kit/atoms/button'
import { LinkButton } from '@techsio/ui-kit/atoms/link-button'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorOrder({ reset }: ErrorProps) {
  return (
    <div className="rounded border border-danger bg-danger-light p-600 text-center">
      <p className="mb-200 font-semibold text-danger">
        Chyba při načítání objednávky
      </p>
      <p className="mb-400 text-fg-secondary">
        Objednávka nebyla nalezena nebo k ní nemáte přístup
      </p>
      <div className="flex justify-center gap-200">
        <Button variant="secondary" theme="solid" onClick={reset}>
          Zkusit znovu
        </Button>
        <LinkButton
          variant="secondary"
          theme="borderless"
          as={Link}
          href="/ucet/profil"
        >
          Zpět na objednávky
        </LinkButton>
      </div>
    </div>
  )
}
