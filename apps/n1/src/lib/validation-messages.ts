export const VALIDATION_MESSAGES = {
  // Field-specific messages
  firstName: {
    required: "Jméno je povinné",
    minLength: "Jméno musí mít alespoň 2 znaky",
  },
  lastName: {
    required: "Příjmení je povinné",
    minLength: "Příjmení musí mít alespoň 2 znaky",
  },
  email: {
    required: "E-mail je povinný",
    invalid: "Zadejte platnou e-mailovou adresu",
  },
  password: {
    required: "Heslo je povinné",
    tooShort: "Heslo musí mít alespoň 8 znaků",
    invalid: "Heslo nesplňuje požadavky",
    mismatch: "Hesla se neshodují",
    match: "Hesla se shodují",
    confirmRequired: "Potvrzení hesla je povinné",
  },
  address: {
    required: "Adresa je povinná",
    minLength: "Adresa musí mít alespoň 3 znaky",
  },
  city: {
    required: "Město je povinné",
    minLength: "Město musí mít alespoň 2 znaky",
  },
  postalCode: {
    required: "PSČ je povinné",
    invalid: "PSČ musí být ve formátu 123 45",
  },
  country: {
    required: "Země je povinná",
  },
  phone: {
    invalid: "Telefon musí mít 9 číslic",
  },
  terms: {
    required: "Musíte souhlasit s podmínkami",
  },
} as const

export type ValidationMessageKey = keyof typeof VALIDATION_MESSAGES
