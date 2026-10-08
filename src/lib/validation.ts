/**
 * Règle de mot de passe du back-office : au moins 10 caractères, dont une
 * majuscule, un chiffre et un caractère spécial.
 *
 * Payload hache le mot de passe avant tout hook de collection : la règle
 * ne peut pas se brancher dans la configuration des comptes. Elle est
 * appliquée un cran plus haut, sur la requête elle-même (voir
 * src/middleware.ts), avant qu'elle n'atteigne Payload.
 */
const MIN_PASSWORD_LENGTH = 10

/** Renvoie le message d'erreur, ou `null` si le mot de passe respecte la règle. */
export function passwordStrengthError(value: string): string | null {
  const isValid =
    value.length >= MIN_PASSWORD_LENGTH && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)
  if (isValid) return null

  // Un seul message, court : l'infobulle d'erreur de Payload tronque au-delà
  // d'une soixantaine de caractères.
  return `${MIN_PASSWORD_LENGTH}+ caractères, 1 majuscule, 1 chiffre, 1 spécial.`
}
