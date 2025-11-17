/**
 * Centralizované error a success zprávy pro autentikaci
 * Příprava na budoucí i18n
 */

export const AUTH_MESSAGES = {
  // Login
  LOGIN_FAILED: 'Přihlášení se nezdařilo',
  LOGIN_SUCCESS: 'Úspěšně přihlášen',
  INVALID_CREDENTIALS: 'Nesprávný email nebo heslo',

  // Registration
  REGISTER_FAILED: 'Registrace se nezdařila',
  REGISTER_SUCCESS: 'Registrace proběhla úspěšně',
  EMAIL_EXISTS: 'Email již existuje. Zkuste se přihlásit.',
  MULTI_STEP_NOT_SUPPORTED:
    'Multi-step authentication is not supported in the current implementation',

  // Validation
  EMAIL_REQUIRED: 'Zadejte platnou e-mailovou adresu',
  PASSWORD_REQUIRED: 'Zadejte heslo',
  PASSWORD_TOO_SHORT: 'Heslo musí mít alespoň 8 znaků',
  PASSWORD_MUST_HAVE_NUMBER: 'Heslo musí obsahovat alespoň 1 číslici',
  PASSWORDS_DONT_MATCH: 'Hesla se neshodují',
  PASSWORDS_MATCH: 'Hesla se shodují',
  FIRST_NAME_REQUIRED: 'Vyplňte prosím jméno',
  LAST_NAME_REQUIRED: 'Vyplňte prosím příjmení',
  TERMS_REQUIRED: 'Musíte souhlasit s podmínkami',

  // Password requirements
  PASSWORD_REQUIREMENT_LENGTH: 'Alespoň 8 znaků',
  PASSWORD_REQUIREMENT_NUMBER: 'Alespoň 1 číslice',
  PASSWORD_ALL_REQUIREMENTS_MET: 'Heslo splňuje všechny požadavky',
  PASSWORD_REQUIREMENTS_TITLE: 'Požadavky na heslo:',

  // Logout
  LOGOUT_SUCCESS: 'Odhlášení proběhlo úspěšně',
  LOGOUT_FAILED: 'Odhlášení se nezdařilo',

  // Customer
  CUSTOMER_FETCH_FAILED: 'Nepodařilo se načíst údaje zákazníka',
  CUSTOMER_UPDATE_SUCCESS: 'Údaje zákazníka byly aktualizovány',
  CUSTOMER_UPDATE_FAILED: 'Nepodařilo se aktualizovat údaje zákazníka',

  // Generic
  UNAUTHORIZED: 'Nejste přihlášeni',
  SERVER_ERROR: 'Došlo k chybě serveru',
  NETWORK_ERROR: 'Chyba připojení k serveru',
} as const

export type AuthMessageKey = keyof typeof AUTH_MESSAGES
