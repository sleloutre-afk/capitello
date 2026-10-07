import { revalidatePath } from 'next/cache'

/**
 * Les listes « Communiqués de presse » / « Dans les médias » et le pied de
 * page (« Dernières publications ») dépendent du contenu du BO : après
 * chaque modification, tout le site public est régénéré à la prochaine
 * visite. Silencieux hors contexte Next (script d'import, CLI Payload).
 */
export function revalidateSite() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // appelé hors d'une requête Next (ex. scripts/seed.ts) — rien à invalider
  }
}
