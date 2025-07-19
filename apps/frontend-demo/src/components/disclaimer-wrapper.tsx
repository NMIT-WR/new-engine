'use client'

import { useEffect, useState } from 'react'
import { Disclaimer } from './disclaimer'
import { Button } from '@ui/atoms/button'

export function DisclaimerWrapper() {
  const [dismissed, setDismissed] = useState<boolean | null>(null)

  useEffect(() => {
      const hasCookie = document.cookie.includes('disclaimerDismissed=true')
      setDismissed(hasCookie)
    }, [])

  const handleDismiss = () => {
    document.cookie = 'disclaimerDismissed=true; path=/; max-age=864000; SameSite=Strict' // 1 year
    setDismissed(true)
  }

  if (dismissed || dismissed === null) {
    return null
  }

  return (
    <Disclaimer hideIcon variant="default" size="sm" className="fixed z-50 w-full">
      <article className='flex flex-col gap-2'>
        <h2 className='font-bold text-md'>Demo aplikace</h2>
        <p>
          Aplikace slouží jenom jako ukázka možností nové platformy. Všechny
          objednávky a transakce jsou fiktivní a nemají žádnou reálnou hodnotu.
        </p>
        <Button onClick={handleDismiss} variant='primary' theme='light' size='sm' className='w-fit'>Beru na vědomí</Button>
      </article>
    </Disclaimer>
  )
}
