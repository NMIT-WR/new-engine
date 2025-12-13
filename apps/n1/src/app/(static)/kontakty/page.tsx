import { Heading } from '@/components/heading'
import { Button } from '@techsio/ui-kit/atoms/button'

export default function KontaktyPage() {
  return (
    <article className="space-y-600">
      <Heading>Kontakty</Heading>

      <div className="grid place-items-center text-center">
        <section className="space-y-600">
          <span>
            <span>email: </span>
            <a href="mailto:eshop@ndistribution.cz" className="underline">
              eshop@ndistribution.cz
            </a>
          </span>
          <h3 className="mt-800">Adresa pro výměnu zboží a reklamace</h3>
          <address className="space-y-400 text-fg-secondary not-italic">
            <div className="space-y-200">
              <p className="font-bold text-fg-primary text-lg">
                N Distribution s. r. o.
              </p>
              <p>Administrativní centrum Ticie</p>
              <p>Československého exilu 2062/8</p>
              <p>143 00 Praha 4 - Modřany</p>
              <p>Česká republika</p>
            </div>

            <div className="space-y-200">
              <p>
                <span className="font-medium">Telefon: </span>
                <a href="tel:+420244402795" className="hover:underline">
                  +420 244 402 795
                </a>
              </p>
            </div>

            <div className="space-y-200">
              <p>
                <span className="font-medium">E-shop: </span>
                <a
                  href="mailto:eshop@ndistribution.cz"
                  className="hover:underline"
                >
                  eshop@ndistribution.cz
                </a>
              </p>
              <p>
                <span className="font-medium">Reklamace: </span>
                <a
                  href="mailto:reklamace@ndistribution.cz"
                  className="hover:underline"
                >
                  reklamace@ndistribution.cz
                </a>
              </p>
              <p>
                <span className="font-medium">Kancelář: </span>
                <a
                  href="mailto:office@ndistribution.cz"
                  className="hover:underline"
                >
                  office@ndistribution.cz
                </a>
              </p>
            </div>

            <div className="space-y-200 pt-400">
              <p className="font-medium">Provozovna:</p>
              <p>Generála Šišky 1990/8</p>
              <p>143 00 Praha 4 - Modřany</p>
            </div>
          </address>
        </section>
      </div>

      <section className="space-y-600">
        <h2 className="font-semibold text-xl">Kontaktní formulář</h2>

        <form className="grid grid-cols-2 gap-400">
          <div className="space-y-200">
            <label htmlFor="name" className="block font-medium text-2xs">
              Jméno a příjmení
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full rounded-lg border px-400 py-300 focus:border-primary focus:outline-none"
            />

            <label htmlFor="phone" className="block font-medium text-2xs">
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full rounded-lg border px-400 py-300 focus:border-primary focus:outline-none"
            />

            <label htmlFor="email" className="block font-medium text-2xs">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded-lg border px-400 py-300 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-200">
            <label htmlFor="message" className="block font-medium text-2xs">
              Zpráva
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full resize-none rounded-lg border px-400 py-300 focus:border-primary focus:outline-none"
            />
            <Button type="submit" className="w-full">
              Odeslat
            </Button>
          </div>
        </form>
      </section>
    </article>
  )
}
