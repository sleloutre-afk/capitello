# Capitello — site institutionnel

Reprise à l'identique du site WordPress/Elementor www.capitello.fr en Next.js 15 / React 19,
avec un back-office Payload CMS pour les rubriques « Communiqués de presse » et « Dans les
médias » (même socle que le site Doxamed).

## Lancer le site

```bash
cp .env.example .env   # renseigner PAYLOAD_SECRET et DATABASE_URI (voir le fichier)
npm install
npm run seed           # première fois : importe les 126 publications reprises de WordPress
npm run import-library # première fois : range leurs fichiers dans la bibliothèque du BO
npm run dev
```

Le site tourne sur **http://localhost:3084**, le back-office sur **http://localhost:3084/BO**.

> La base SQLite locale doit être **hors du disque externe T7 Shield** (exFAT ne gère pas le
> verrouillage de fichier dont SQLite a besoin) — ex. `file:/Users/<vous>/.capitello-site/payload.db`.

## Organisation

| Dossier | Contenu |
| --- | --- |
| `src/app/(site)/[locale]` | Les 5 pages et les 3 pages légales. Le français est servi sans préfixe, les autres langues sous `/en`, `/es`, `/zh` (`src/middleware.ts`). |
| `src/components/sections` | Le contenu de chaque page, l'en-tête (variante accueil / pages intérieures) et le pied de page. Balisage et classes d'origine conservés : les styles s'y rattachent. |
| `src/i18n/dictionaries` | Tous les textes, par langue. La clé reprend l'identifiant du bloc (`e9445bbb` ↔ classe `elementor-element-9445bbb`). |
| `src/content/legal.ts` | Texte des trois pages légales (mentions légales, données personnelles, cookies), en français ; l'adresse du siège et l'hébergeur y sont définis une seule fois. Gabarit : `src/components/LegalPage.tsx`. |
| `src/i18n/ui.ts` | Titres d'onglet et libellés des listes de publications. |
| `src/styles/legacy` | Les feuilles de style du site d'origine, dans leur ordre de chargement. |
| `src/components/SiteBehaviors.tsx` | Le JavaScript du site : en-tête au défilement, menu burger, carrousels. |
| `src/collections`, `src/payload.config.ts` | Le back-office. |
| `public/wp-content` | Images et polices utilisées par les pages, aux mêmes adresses que sur l'ancien site. |
| `import-files` (hors git) | Visuels, PDF, vidéos et sons des publications d'origine : source de `npm run import-library`. Une fois importés, ils sont servis par la bibliothèque du BO ; leurs anciennes adresses `/wp-content/uploads/…` y sont redirigées (`src/app/wp-content/uploads/[...path]/route.ts`). |
| `media` (hors git) | Stockage local de la bibliothèque du BO (S3 en production). |
| `scripts/import` | Scripts qui ont servi à amorcer le projet depuis la copie de référence. À ne pas relancer : les fichiers générés sont désormais maintenus à la main. |
| `scripts/seed.ts` | Import des publications d'origine dans le BO, avec leurs traductions existantes (aucune traduction automatique). |
| `scripts/compare` | Contrôle de fidélité automatisé avec le site d'origine. |

`../reference/original-site` contient la copie de référence du site WordPress (HTML des 20
pages, export de l'API, tous les fichiers).

## Modifier un texte

Chercher le texte dans `src/i18n/dictionaries/fr.json` et le modifier, puis reporter la
traduction dans `en.json`, `es.json` et `zh.json` (même clé).

## Back-office

- **Accès** : `/BO`. Un contrôle anti-robots (captcha Cloudflare Turnstile, page `/bo-verify`)
  précède la page de connexion ; une fois passé, il reste valable 30 jours sur le navigateur.
  Il n'est actif que si les deux clés Turnstile sont renseignées.
- **Comptes** : un super administrateur crée le compte (nom, e-mail, rôle « Super
  administrateur » ou « Éditeur ») ; la personne reçoit un e-mail avec un lien à usage unique,
  valable 1 heure, pour définir son mot de passe. Le mot de passe saisi à la création est
  provisoire et remplacé. Passé le délai, « Mot de passe oublié » renvoie un lien.
- **Mot de passe** : au moins 10 caractères, dont une majuscule, un chiffre et un caractère
  spécial (`src/lib/validation.ts`, appliqué dans `src/middleware.ts`). Dix échecs de connexion
  verrouillent le compte 10 minutes.
- **E-mails** : envoyés via Resend (`RESEND_API_KEY`, expéditeur `EMAIL_FROM`). Sans clé, aucun
  e-mail ne part ; en local, le message et son lien s'affichent dans la console du serveur.
- **Tableau de bord** : deux blocs « Communiqués de presse » et « Dans les médias » (publier /
  voir tout) et la bibliothèque de fichiers (`src/components/admin/DashboardWidget.tsx`,
  habillage dans `src/app/(payload)/custom.scss`).
- **Bibliothèque** : tous les fichiers des publications (visuels, logos des médias, PDF, vidéos,
  sons), réutilisables d'une publication à l'autre.
- **Deux rubriques, deux formulaires** : un communiqué a une date, un titre, un chapô, un
  visuel, des étiquettes et son PDF ; une news a une date, un titre, le logo du média, la case
  « Vidéo » et un fichier (PDF, vidéo…) ou un lien externe. Brouillon ou publication immédiate.
- **Langues** : le titre et le chapô se saisissent en français. À l'enregistrement, les versions
  EN / ES / ZH encore vides sont traduites automatiquement (API Claude, variable
  `ANTHROPIC_API_KEY` ; modèle défini dans `src/lib/translate.ts`). Elles se relisent et se
  corrigent via le sélecteur de langue en haut du formulaire ; une traduction saisie à la main
  n'est jamais écrasée. Sans clé, le français est affiché dans toutes les langues.
- **Pied de page** : « Dernières publications » affiche les deux communiqués les plus récents
  dont la case correspondante est cochée.
- Une publication apparaît sur le site dès son enregistrement.

## Contrôle de fidélité

```bash
npm run dev                                   # dans un autre terminal (ou npm run build && npm start)
node scripts/compare/compare.mjs              # 5 pages × 4 tailles d'écran, en français
LOCALES=en,es,zh VIEWPORTS=desktop,mobile node scripts/compare/compare.mjs
node scripts/compare/interactions.mjs         # défilement, menu burger, langues, carrousel, filtres
```

`compare.mjs` compare position, taille, styles calculés et texte de chaque bloc entre
capitello.fr et le site local, et enregistre les captures côte à côte dans
`../reference/compare`. `interactions.mjs` rejoue les mêmes gestes sur les deux sites et compare
l'état obtenu. Tant que capitello.fr sert encore le site WordPress, ces deux scripts doivent
afficher 0 écart.

## Hébergement (Clever Cloud)

Même dispositif que le site Doxamed, sur le même compte : application Node `capitello` (zone
Paris, 1 instance S), add-on PostgreSQL `capitello-db`, add-on Cellar `capitello-media` (bucket
S3 `capitello-media`). L'application est décrite dans `.clever.json`.

```bash
clever deploy            # pousse la branche courante et déclenche le déploiement
clever logs              # journaux du build et de l'application
clever env               # variables d'environnement (voir .env.example)
```

- **Déploiement** : une fois les dépendances installées, `CC_POST_BUILD_HOOK` applique les
  migrations puis compile le site (`npx payload migrate && npm run build`).
- **Schéma de la base** : toute modification des collections demande une migration —
  `npx payload migrate:create <nom>` avec `DATABASE_URI` pointant sur une base PostgreSQL, puis
  versionner `src/migrations` ; elle est appliquée au déploiement suivant. Sur le disque
  externe, supprimer les fichiers `._*` de `src/migrations` avant de lancer `payload migrate`
  en local (ils ne sont pas dans le dépôt).
- **Contenus** : la base et le stockage de production ont été initialisés depuis ce poste avec
  `scripts/seed.ts` puis `scripts/import-library.ts` (variables de production, dossier
  `import-files`). Ces scripts sont idempotents.
- **Adresses** : l'adresse officielle est celle de `NEXT_PUBLIC_SITE_URL` (`https://capitello.fr`).
  `www.capitello.fr` et les domaines secondaires du groupe (capitello.com, .net, .info,
  capitellogroup.com, .fr, .net — à déclarer sur l'application avec `clever domain add`) y
  sont redirigés. Sous toute autre adresse — l'adresse technique
  `*.cleverapps.io` — le site reste consultable mais interdit son indexation (`robots.txt` et
  en-tête `X-Robots-Tag`), ce qui en fait une préproduction permanente.
- **DNS** (chez Nameshield) : 9 enregistrements A vers les adresses de Clever Cloud pour
  `capitello.fr`, CNAME `domain.par.clever-cloud.com.` pour `www`. Le certificat HTTPS est
  généré par Clever Cloud une fois le DNS en place.
