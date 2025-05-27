'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from 'ui/atoms/button'
import { FormInput } from 'ui/molecules/form-input'
import { FormCheckbox } from 'ui/molecules/form-checkbox'
import { Steps } from 'ui/molecules/steps'

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    newsletter: false,
    terms: false
  })

  const steps = [
    { label: 'Účet', description: 'Základní údaje' },
    { label: 'Osobní údaje', description: 'Jméno a kontakt' },
    { label: 'Dokončení', description: 'Souhlasy' }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Register:', formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Demo Shop
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-8">Vytvoření účtu</h1>
            
            {/* Steps indicator */}
            <div className="mb-8">
              <Steps steps={steps} currentStep={currentStep} />
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Account */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <FormInput
                    label="E-mail"
                    type="email"
                    placeholder="vas@email.cz"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    helperText="Použijte platnou e-mailovou adresu"
                  />

                  <FormInput
                    label="Heslo"
                    type="password"
                    placeholder="Zadejte heslo"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    helperText="Minimálně 8 znaků, alespoň jedno číslo a velké písmeno"
                  />

                  <FormInput
                    label="Potvrzení hesla"
                    type="password"
                    placeholder="Zadejte heslo znovu"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Hesla se neshodují' : ''}
                  />
                </div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                      label="Jméno"
                      type="text"
                      placeholder="Jan"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />

                    <FormInput
                      label="Příjmení"
                      type="text"
                      placeholder="Novák"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>

                  <FormInput
                    label="Telefon (nepovinné)"
                    type="tel"
                    placeholder="+420 123 456 789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    helperText="Pro rychlejší komunikaci ohledně objednávek"
                  />
                </div>
              )}

              {/* Step 3: Completion */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Shrnutí registrace</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">E-mail:</dt>
                        <dd className="font-medium">{formData.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Jméno:</dt>
                        <dd className="font-medium">{formData.firstName} {formData.lastName}</dd>
                      </div>
                      {formData.phone && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Telefon:</dt>
                          <dd className="font-medium">{formData.phone}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="space-y-4">
                    <FormCheckbox
                      label="Chci dostávat novinky a speciální nabídky e-mailem"
                      checked={formData.newsletter}
                      onChange={(checked) => setFormData({ ...formData, newsletter: checked })}
                    />

                    <FormCheckbox
                      label={
                        <span>
                          Souhlasím s{' '}
                          <Link href="/terms" className="text-blue-600 hover:underline">
                            obchodními podmínkami
                          </Link>
                          {' '}a{' '}
                          <Link href="/privacy" className="text-blue-600 hover:underline">
                            zásadami ochrany osobních údajů
                          </Link>
                        </span>
                      }
                      checked={formData.terms}
                      onChange={(checked) => setFormData({ ...formData, terms: checked })}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    theme="outlined"
                    onClick={handleBack}
                  >
                    Zpět
                  </Button>
                ) : (
                  <div></div>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    variant="primary"
                    theme="solid"
                    onClick={handleNext}
                  >
                    Pokračovat
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    theme="solid"
                    disabled={!formData.terms}
                  >
                    Vytvořit účet
                  </Button>
                )}
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Už máte účet?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:underline">
                Přihlaste se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}