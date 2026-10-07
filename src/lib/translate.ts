import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const MODEL = 'claude-opus-5-5'

const TARGETS = { en: 'English', es: 'Spanish', zh: 'Simplified Chinese' } as const
export type TargetLocale = keyof typeof TARGETS

const SYSTEM_PROMPT = `You translate short pieces of French website copy for Capitello Group, a French holding company active in consulting, media, mobility and healthcare (its subsidiaries include Doxamed and Teledok). The texts are press-release titles, media-coverage titles and short press-release summaries shown on the corporate website.

Translate naturally, the way a native speaker would write for a corporate press page, keeping the meaning, tone and length of the French source. Keep company, brand, product and people names exactly as written (Capitello Group, Doxamed, Loxamed, Teledok, Mobiltest…), and keep any inline HTML tags, numbers and dates unchanged apart from normal date wording in the target language. Each field of the answer holds only the translation of the matching French text.`

const Translation = z.object({ title: z.string(), summary: z.string() })
const Translations = z.object({ en: Translation, es: Translation, zh: Translation })
export type PublicationTranslations = z.infer<typeof Translations>

/**
 * Traduit le titre (et le chapô) d'une publication en anglais, espagnol et
 * chinois. Renvoie `null` si la traduction est indisponible (pas de clé
 * ANTHROPIC_API_KEY, erreur ou refus de l'API) : le site affiche alors le
 * français, comme pour tout champ non traduit.
 */
export async function translatePublication(source: {
  title: string
  summary?: string | null
}): Promise<PublicationTranslations | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null

  const client = new Anthropic({ timeout: 30_000, maxRetries: 1 })
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      // Si le modèle décline la demande, l'API la rejoue sur le modèle de repli recommandé.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM_PROMPT,
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: z.toJSONSchema(Translations) },
      },
      messages: [
        {
          role: 'user',
          content: `Translate into ${Object.values(TARGETS).join(', ')} (keys ${Object.keys(TARGETS).join(', ')}). An empty summary stays an empty string.\n\n${JSON.stringify(
            { title: source.title, summary: source.summary || '' },
          )}`,
        },
      ],
    })
    if (response.stop_reason !== 'end_turn') {
      console.warn(`[traduction] réponse inexploitable (${response.stop_reason}) — le français reste affiché.`)
      return null
    }
    const text = response.content.find((block) => block.type === 'text')
    if (!text || text.type !== 'text') return null
    return Translations.parse(JSON.parse(text.text))
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('[traduction] clé ANTHROPIC_API_KEY refusée.')
    } else if (error instanceof Anthropic.RateLimitError) {
      console.warn('[traduction] quota atteint — le français reste affiché.')
    } else if (error instanceof Anthropic.APIError) {
      console.error(`[traduction] erreur API ${error.status} : ${error.message}`)
    } else {
      console.error('[traduction] échec de la traduction', error)
    }
    return null
  }
}
