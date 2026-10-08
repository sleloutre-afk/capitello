import { Resend } from 'resend'
import type { PayloadEmailAdapter } from 'payload'

/** Expéditeur des e-mails du BO ; le domaine doit être vérifié dans le compte Resend. */
const FROM = process.env.EMAIL_FROM || 'Capitello Group <noreply@capitello.fr>'

/**
 * Envoie les e-mails système de Payload (invitation d'un nouveau compte,
 * mot de passe oublié — voir src/collections/Users.ts) via Resend.
 * Sans RESEND_API_KEY, rien n'est envoyé : en développement, le message
 * est écrit dans la console pour pouvoir suivre le lien à la main.
 */
export const resendEmailAdapter: PayloadEmailAdapter = () => {
  const [, name, address] = FROM.match(/^(.*?)\s*<(.+)>$/) || [null, 'Capitello Group', FROM]
  return {
    name: 'resend',
    defaultFromAddress: address as string,
    defaultFromName: name as string,
    sendEmail: async (message) => {
      const to = Array.isArray(message.to)
        ? message.to.map((t) => (typeof t === 'string' ? t : t.address))
        : typeof message.to === 'string'
          ? message.to
          : message.to?.address
      if (!to) {
        console.warn('[payload-email] Destinataire manquant — e-mail non envoyé.')
        return
      }
      const html = typeof message.html === 'string' ? message.html : undefined
      const text = typeof message.text === 'string' ? message.text : undefined

      if (!process.env.RESEND_API_KEY) {
        console.warn('[payload-email] RESEND_API_KEY manquante — e-mail non envoyé.')
        if (process.env.NODE_ENV !== 'production') {
          console.info(`[payload-email] (dev) À : ${to}\nObjet : ${message.subject}\n${html ?? text ?? ''}`)
        }
        return
      }

      const resend = new Resend(process.env.RESEND_API_KEY)
      const { data, error } = await resend.emails.send({
        from: FROM,
        to,
        subject: message.subject ?? '',
        ...(html ? { html } : { text: text ?? '' }),
      })
      if (error) console.error('[payload-email] Échec d’envoi Resend', error)
      else console.info('[payload-email] Envoyé via Resend, id', data?.id)
    },
  }
}
