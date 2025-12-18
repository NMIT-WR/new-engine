export const addressValidators = {
  first_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return "Jméno je povinné"
      }
      if (value.length < 2) {
        return "Jméno musí mít alespoň 2 znaky"
      }
      return
    },
  },
  last_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return "Příjmení je povinné"
      }
      if (value.length < 2) {
        return "Příjmení musí mít alespoň 2 znaky"
      }
      return
    },
  },
  address_1: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return "Adresa je povinná"
      }
      if (value.length < 3) {
        return "Adresa musí mít alespoň 3 znaky"
      }
      return
    },
  },
  city: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return "Město je povinné"
      }
      if (value.length < 2) {
        return "Město musí mít alespoň 2 znaky"
      }
      return
    },
  },
  postal_code: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return "PSČ je povinné"
      }
      if (!/^\d{3}\s\d{2}$/.test(value)) {
        return "PSČ musí být ve formátu 123 45"
      }
      return
    },
  },
  country_code: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return "Země je povinná"
      }
      return
    },
  },
  phone: {
    onChange: ({ value }: { value: string | undefined }) => {
      if (!value) {
        return
      }
      if (!/^(\+420\s)?\d{3}\s\d{3}\s\d{3}$|^$/.test(value)) {
        return "Telefon musí mít 9 číslic"
      }
      return
    },
  },
  company: {},
  address_2: {},
  province: {},
} as const

export const emailValidator = {
  onChange: ({ value }: { value: string }) => {
    if (!value?.trim()) {
      return "E-mail je povinný"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Zadejte platnou e-mailovou adresu"
    }
    return
  },
} as const

export const PASSWORD_REQUIREMENTS = [
  {
    id: "min-length",
    label: "Alespoň 8 znaků",
    test: (pwd: string) => pwd.length >= 8,
  },
  {
    id: "has-number",
    label: "Alespoň 1 číslice",
    test: (pwd: string) => /\d/.test(pwd),
  },
] as const

export const isPasswordValid = (password: string): boolean =>
  PASSWORD_REQUIREMENTS.every((req) => req.test(password))

export const registerValidators = {
  first_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return "Jméno je povinné"
      }
      return
    },
  },
  last_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return "Příjmení je povinné"
      }
      return
    },
  },
  email: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return "E-mail je povinný"
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Zadejte platnou e-mailovou adresu"
      }
      return
    },
  },
  password: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return "Heslo je povinné"
      }
      if (!isPasswordValid(value)) {
        return "Heslo nesplňuje požadavky"
      }
      return
    },
  },
  acceptTerms: {
    onChange: ({ value }: { value: boolean }) => {
      if (!value) {
        return "Musíte souhlasit s podmínkami"
      }
      return
    },
  },
} as const
