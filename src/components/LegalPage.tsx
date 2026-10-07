import type { ReactNode } from 'react'
import type { LegalBlock, LegalDocument, LegalListItem } from '@/content/legal'

/** Rend `**gras**` et `[texte](lien)` ; les liens internes reçoivent le préfixe de langue. */
function inline(text: string, l: (path: string) => string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    if (bold) return <strong key={i}>{bold[1]}</strong>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const [, label, href] = link
      if (href.startsWith('/')) return <a key={i} href={l(href)}>{label}</a>
      if (href.startsWith('mailto:')) return <a key={i} href={href}>{label}</a>
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      )
    }
    return part
  })
}

function ListItem({ item, l }: { item: LegalListItem; l: (path: string) => string }) {
  if (typeof item === 'string') return <li>{inline(item, l)}</li>
  return (
    <li>
      {inline(item.text, l)}
      {item.paragraphs?.map((paragraph, i) => <p key={i}>{inline(paragraph, l)}</p>)}
      {item.sub && (
        <ul className="legal-page__dashes">
          {item.sub.map((sub, i) => (
            <li key={i}>{inline(sub, l)}</li>
          ))}
        </ul>
      )}
    </li>
  )
}

function Block({ block, l }: { block: LegalBlock; l: (path: string) => string }) {
  if (block.type === 'h2') return <h2>{inline(block.text, l)}</h2>
  if (block.type === 'p') return <p>{inline(block.text, l)}</p>
  const List = block.type
  return (
    <List>
      {block.items.map((item, i) => (
        <ListItem key={i} item={item} l={l} />
      ))}
    </List>
  )
}

/**
 * Gabarit des pages légales : même titre que les pages « Communiqués de
 * presse » / « Dans les médias » (équerre + titre), puis le texte en une
 * colonne. Contenu dans src/content/legal.ts, styles dans src/styles/site.css.
 */
export function LegalPage({ document, l }: { document: LegalDocument; l: (path: string) => string }) {
  return (
    // Le texte est en français quelle que soit la langue du site.
    <main className="legal-page" lang="fr">
      <div className="legal-page__inner">
        <h1 className="page-custom-title">
          <img decoding="async" src="/wp-content/uploads/2025/02/border.svg" alt="" /> {document.title}
        </h1>
        <div className="legal-page__body">
          {document.blocks.map((block, i) => (
            <Block key={i} block={block} l={l} />
          ))}
        </div>
      </div>
    </main>
  )
}
