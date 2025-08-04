/**
 * Auth-related constants and configurations
 */

export const AUTH_ERRORS = {
  INVALID_EMAIL: 'Zadejte prosím platnou e-mailovou adresu',
  INVALID_CREDENTIALS: 'Neplatný e-mail nebo heslo',
  USER_NOT_FOUND: 'S tímto e-mailem nebyl nalezen žádný účet',
  USER_EXISTS: 'Účet s tímto e-mailem již existuje',
  PASSWORD_REQUIRED: 'Zadejte prosím své heslo',
  PASSWORD_MISMATCH: 'Hesla se neshodují',
  TERMS_REQUIRED: 'Musíte přijmout obchodní podmínky',
  GENERIC_ERROR: 'Došlo k chybě. Zkuste to prosím znovu.',
} as const

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: {
    title: 'Vítejte zpět!',
    description: 'Úspěšně jste se přihlásili.',
  },
  REGISTER_SUCCESS: {
    title: 'Účet vytvořen!',
    description: 'Byli jste automaticky přihlášeni.',
  },
  LOGOUT_SUCCESS: {
    title: 'Odhlášeno',
    description: 'Úspěšně jste se odhlásili.',
  },
  LOGIN_ERROR: {
    title: 'Přihlášení se nezdařilo',
  },
  REGISTER_ERROR: {
    title: 'Registrace se nezdařila',
  },
  UPDATE_SUCCESS: {
    title: 'Profil aktualizován',
    description: 'Váš profil byl úspěšně aktualizován.',
  },
  UPDATE_ERROR: {
    title: 'Aktualizace se nezdařila',
  },
} as const

export const AUTH_FORM_CONFIG = {
  EMAIL_PLACEHOLDER: 'uzivatel@email.cz',
  EMAIL_HELP_TEXT: 'Použijte platný formát e-mailu (např. uzivatel@email.cz)',
  PASSWORD_PLACEHOLDER: '••••••••',
  PASSWORD_HELP_TEXT: 'Alespoň 8 znaků včetně velkých a malých písmen a čísel',
} as const
