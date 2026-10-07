/**
 * Contenu des trois pages légales (mentions légales, données personnelles,
 * cookies). Textes repris tels quels des PDF du site d'origine — seuls
 * l'adresse du siège et l'hébergeur ont été mis à jour (voir COMPANY et
 * HOST). En français uniquement, comme les PDF qu'ils remplacent.
 *
 * Mise en forme : `**gras**` et `[texte](lien)` dans les textes.
 */

/** Siège social, repris dans les trois pages. */
const COMPANY = {
  street: '351 Bureaux de la Colline',
  city: '92213 Saint-Cloud Cedex',
}

/** Hébergeur du site (mêmes mentions que sur le site Doxamed). */
const HOST =
  'Clever Cloud SAS, société par actions simplifiée au capital de 22 952 euros, immatriculée au Registre du Commerce et des Sociétés de Nantes sous le numéro 524 172 699, dont le siège social est situé 4 rue Voltaire, 44000 Nantes (France), téléphone : 02 85 52 07 69'

const CONTACT = '[contact@capitello.fr](mailto:contact@capitello.fr)'

export type LegalListItem =
  | string
  | {
      text: string
      /** Sous-liste à tirets. */
      sub?: string[]
      /** Paragraphes rattachés à l'élément (ex. description d'un droit). */
      paragraphs?: string[]
    }

export type LegalBlock =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul' | 'ol'; items: LegalListItem[] }

export type LegalDocument = {
  /** Chemin de la page, sans préfixe de langue. */
  path: string
  title: string
  blocks: LegalBlock[]
}

export const MENTIONS_LEGALES: LegalDocument = {
  path: '/mentions-legales',
  title: 'Mentions légales',
  blocks: [
    {
      type: 'p',
      text: `Le site Capitello.fr est édité par la Société Capitello Group SASU au capital de 500 euros immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 793 498 684, dont le siège social est situé ${COMPANY.street}, ${COMPANY.city}, représentée par son président Arnaud Molinié.`,
    },
    { type: 'p', text: `Contact : ${CONTACT}` },
    { type: 'p', text: '**Directeur de Publication : Arnaud Molinié**' },
    { type: 'p', text: '**Conception et réalisation du site :**' },
    { type: 'p', text: 'Agence BRIEF' },
    { type: 'p', text: `**L’hébergement du site est assuré par Clever Cloud**` },
    {
      type: 'p',
      text: `${HOST}. L’ensemble des serveurs et des données est situé en France.`,
    },
  ],
}

export const DONNEES_PERSONNELLES: LegalDocument = {
  path: '/donnees-personnelles',
  title: 'Politique de protection des données personnelles',
  blocks: [
    {
      type: 'h2',
      text: '1. Capitello Group s’engage à protéger votre vie privée et vos informations personnelles.',
    },
    {
      type: 'p',
      text: '**Capitello Group** s’engage à protéger votre vie privée et vos informations personnelles. Nous vous recommandons de la lire avant d’accéder au contenu numérique de **Capitello Group**. Cette Politique vous informe de nos pratiques en matière de traitement des données et de la façon dont vos informations personnelles sont collectées en ligne et utilisées par **Capitello Group.** Cette politique est facilement accessible depuis notre page d’accueil et en bas de chaque page du présent site internet. **Capitello Group** s’engage à protéger le droit à la vie privée et à la protection des données à caractère personnel, ainsi que le respect des lois nationales et internationales en matière de protection de ces données.',
    },
    {
      type: 'p',
      text: '**Capitello Group** s’engage à préserver la confidentialité de toute information personnelle et d’en limiter strictement la divulgation conformément aux lois nationales et aux règlementations en vigueur.',
    },
    {
      type: 'p',
      text: '**Capitello Group** a adopté cette Politique de protection des données à caractère personnel pour mettre en œuvre le Règlement Général 2016/679 (RGPD) entré en vigueur le 25 mai 2018, qui s’applique à toutes les entités de **Capitello Group** qui traitent des données à caractère personnel de résidents européens.',
    },
    {
      type: 'p',
      text: 'La présente Politique est applicable dans toutes nos filiales pour la collecte, le traitement, l’utilisation, la diffusion, le transfert et le stockage des données personnelles. Elle impose des règles communes à toutes nos filiales dans tous les pays où nous sommes implantés et vise à garantir un niveau élevé de protection des informations personnelles au sein de **Capitello Group** et de ses partenaires.',
    },

    { type: 'h2', text: '2. Quelle est la portée de cette Politique de protection des données ?' },
    {
      type: 'p',
      text: `**Capitello Group** est une SAS (SASU) au capital de 500,00 euros immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 793 498 684, dont le siège social est situé ${COMPANY.street}, ${COMPANY.city}, représentée par son Président Arnaud Molinié et, avec des entités juridiques, des processus opérationnels, des services de gestion et des systèmes techniques transnationaux. Cette Politique s’applique à tous les sites Web, les noms de domaine, les applications et les produits détenus par **Capitello Group** et par ses filiales (« les sites ou les services de **Capitello Group** »), à moins qu’une autre politique de protection des informations ou qu’une mention d’information spécifique à un programme, un produit ou un service ne soient publiées pour la compléter ou la remplacer. Cette Politique lie toutes les filiales détenues par **Capitello Group** et leurs employés.`,
    },

    { type: 'h2', text: '3. Comment traitons-nous vos données à caractère personnel ?' },
    {
      type: 'p',
      text: '**Capitello Group** respecte le droit de chaque individu, employé, candidat ou client d’avoir ses données à caractère personnel protégées. Les entités de **Capitello Group** observeront les principes suivants quand elles traiteront vos données à caractère personnel :',
    },
    {
      type: 'ol',
      items: [
        'Traiter vos informations personnelles de manière loyale, licite et de manière transparente.',
        'Collecter vos informations personnelles pour des finalités déterminées et légitimes, et ne pas les traiter ultérieurement de manière incompatible avec ces finalités.',
        'S’assurer que les informations personnelles collectées sont pertinentes et non excessives au regard des finalités pour lesquelles elles sont collectées et traitées. Les informations pourront être rendues anonymes lorsque cela sera possible et approprié, selon la nature des données et les risques associés aux utilisations prévues.',
        'Maintenir vos informations personnelles exactes, mises à jour si nécessaire. Nous prendrons des mesures raisonnables afin de rectifier ou de supprimer les données inexactes ou incomplètes.',
        'Les informations personnelles seront conservées pendant la durée nécessaire au regard des finalités pour lesquelles elles sont collectées et traitées.',
        'Le traitement des informations personnelles se fera dans le respect des droits des personnes.',
        'Des mesures techniques, physiques et organisationnelles sont prises pour sécuriser vos données et empêcher l’accès non autorisé, le traitement illicite et la perte, la destruction ou l’endommagement non autorisé ou accidentel d’informations personnelles.',
        {
          text: 'Traiter vos données à caractère personnel en respectant les obligations légales suivantes :',
          sub: [
            'Vous avez donné votre consentement sans ambiguïté ; ou',
            'Le traitement est nécessaire à l’exécution d’un contrat auquel vous êtes partie ou dans le but de prendre des mesures, si vous en faites la demande, avant de conclure un contrat ; ou',
            'Le traitement est nécessaire à la mise en conformité avec une obligation légale à laquelle **Capitello Group** est soumise ; ou',
            'Le traitement est nécessaire pour protéger vos intérêts vitaux ou les intérêts vitaux d’une autre personne physique ; ou',
            'Le traitement est nécessaire pour des motifs d’intérêts publics ou pour l’exercice d’une mission d’intérêt public attribuée à **Capitello Group** ; ou',
            'Le traitement est nécessaire à la sauvegarde des intérêts légitimes de **Capitello Group** ou d’une tierce partie sauf si vos intérêts ou vos droits et libertés fondamentaux priment sur de tels intérêts.',
          ],
        },
      ],
    },
    {
      type: 'p',
      text: 'Toutes les filiales de **Capitello Group** doivent veiller à ce que les principes ci-dessus soient respectés.',
    },

    { type: 'h2', text: '4. Pourquoi recueillons-nous et utilisons-nous des informations personnelles ?' },
    {
      type: 'p',
      text: 'L’objectif principal de cette collecte d’informations est de fournir, à nos clients et aux autres utilisateurs, des services de qualité supérieure et de proposer une expérience personnalisée, efficace et fluide lors de l’utilisation de notre contenu numérique. Par exemple, si vous prenez rendez-vous ou demandez des informations sur le site internet, nous utiliserons vos données à caractère personnel pour répondre à vos demandes. **Capitello Group** peut recueillir des informations personnelles pour effectuer différentes opérations, comme par exemple :',
    },
    {
      type: 'ul',
      items: [
        'les commandes de services, les activations et les inscriptions',
        'la création de profils ;',
        'les demandes d’informations ;',
        'Les abonnements aux lettres d’information',
        'les participations à des jeux ou concours ou participation à des sondages ;',
        'la gestion des candidatures.',
      ],
    },

    { type: 'h2', text: '5. Quels types d’informations personnelles sont collectées ?' },
    {
      type: 'p',
      text: '**Capitello Group** collecte et traite vos informations personnelles pour vous proposer un meilleur service et personnaliser votre expérience et votre interaction avec **Capitello Group.** Une telle collecte est réalisée avec votre consentement et après vous en avoir informé de manière appropriée en plus de la conservation de la trace de nos activités de traitement sous la responsabilité de chacune des entités.',
    },
    {
      type: 'p',
      text: 'Les informations personnelles (aussi appelées données personnelles) correspondent à toutes les informations concernant un individu identifié ou identifiable. Un individu identifiable est un individu qui peut être identifié, directement ou indirectement, notamment par référence à un identifiant ou à un ou plusieurs facteurs spécifiques, propres à son identité physique, physiologique, psychique, économique, culturelle ou sociale.',
    },
    {
      type: 'p',
      text: 'Cette Politique ne couvre pas les informations personnelles rendues anonymes, c’est-à-dire lorsque les individus ne sont plus identifiables ou ne peuvent être identifiables qu’en contrepartie de coûts et d’efforts disproportionnés. Si des données anonymes deviennent identifiables, ou si des pseudonymes sont utilisés et permettent l’identification d’individus, cette Politique a alors vocation à s’appliquer.',
    },
    {
      type: 'p',
      text: 'La décision de nous révéler des informations personnelles vous appartient, aussi, si vous choisissez de ne pas le faire, nous nous réservons le droit de ne pas vous enregistrer en tant qu’utilisateur ou de ne pas vous fournir de services. Le type d’informations personnelles que nous traitons à votre sujet peut comprendre :',
    },
    {
      type: 'ul',
      items: [
        'votre prénom, nom de famille, tranche d’âge, société, adresse e-mail, numéro de téléphone, adresse de facturation et adresse d’envoi ;',
        'des informations professionnelles, telles que type de client, fonction, période d’achat ;',
        'vos préférences, telles que des préférences en matière de produits et services, de contact, votre parcours scolaire et professionnel et vos centres d’intérêt professionnel (pour les candidats) ;',
        'votre identifiant et votre mot de passe d’utilisateur de capitello.net (si applicable) ;',
        'vos adresses IP.',
      ],
    },

    { type: 'h2', text: '6. Comment utilisons-nous ces informations ?' },
    {
      type: 'p',
      text: 'Nous recueillons et utilisons vos informations pour de nombreuses raisons, parmi lesquelles :',
    },
    {
      type: 'p',
      text: '**Navigation et Recherche :** Nous recueillons certaines informations personnelles lorsque vous consultez nos contenus numériques ou que vous cliquez sur des liens vers des produits et services. Nous recueillons ces informations pour améliorer votre expérience utilisateur dans le cadre de vos prochaines visites (la sélection du pays ou de la langue, par exemple), pour un fonctionnement plus efficace de nos sites, recueillir des données démographiques globales, pour analyser l’activité et les performances des sites et évaluer l’efficacité de nos publicités. Consultez également notre [Politique en matière de Cookies](/gestion-des-cookies) pour connaître notre utilisation des Cookies.',
    },
    {
      type: 'p',
      text: '**Gestion des commandes :** Nous collectons des informations personnelles quand vous achetez des produits ou des services. Ces informations sont recueillies pour livrer votre commande, recevoir le paiement et vous communiquer des informations concernant le statut de votre commande.',
    },
    {
      type: 'p',
      text: '**Assistance technique :** Nous pouvons collecter certaines informations quand vous demandez une assistance technique pour des services proposés par **Capitello Group**. Ces informations personnelles sont nécessaires pour identifier vos systèmes, comprendre la configuration des produits, étudier vos questions et fournir des solutions.',
    },
    {
      type: 'p',
      text: '**Enquêtes et sondages :** Nous recueillons des informations personnelles auprès de clients qui se portent volontaires pour participer à des enquêtes ou des sondages. Nous utilisons ces informations pour améliorer nos offres et nos services.',
    },
    {
      type: 'p',
      text: '**Activités de promotion :** Nous recueillons des informations personnelles auprès de vous lorsque vous vous inscrivez à un programme ou à une activité promotionnelle. Nous utilisons ces informations pour gérer le programme ou l’activité, vous envoyer des e-mails promotionnels, avertir les gagnants et rendre publique la liste des gagnants, conformément aux réglementations et lois applicables.',
    },
    {
      type: 'p',
      text: '**Newsletter et e-mails promotionnels :** Nous collectons vos informations personnelles quand vous demander à recevoir des newsletters, des e-mails promotionnels et d’autres informations. Nous utilisons ces informations pour vous fournir l’information que vous demandez.',
    },
    {
      type: 'p',
      text: '**Répondre à vos demandes d’information :** Si vous nous contactez, nous conservons des archives de votre correspondance ou de vos commentaires, y compris vos informations personnelles, dans un fichier qui vous est dédié. Nous utilisons ces informations afin de vous fournir un service personnalisé dans l’éventualité où vous nous contacteriez de nouveau.',
    },
    {
      type: 'p',
      text: 'Nous pouvons conserver vos informations pour une période raisonnable et limitée dans le but d’accomplir l’une des finalités exposées ci-dessus.',
    },

    { type: 'h2', text: '7. Comment utilisons-nous vos informations pour de la promotion ?' },
    {
      type: 'p',
      text: 'Nous (y compris des sociétés de notre groupe) et des tiers sélectionnés avec précaution pouvons utiliser les informations que nous collectons pour vous informer, par lettre, fax, téléphone, SMS et e-mails des promotions, des informations et les nouveaux produits qui sont selon nous susceptibles de vous intéresser.',
    },
    {
      type: 'p',
      text: 'Lorsque vous nous fournissez vos informations personnelles vous aurez le choix d’être contacté par le biais de ces méthodes pour ces finalités.',
    },
    {
      type: 'p',
      text: 'Vous pouvez à tout moment vous opposer au traitement de vos données pour des finalités de prospection commerciale.',
    },

    { type: 'h2', text: '8. Que faisons-nous de vos données personnelles ?' },
    {
      type: 'p',
      text: 'Si vous nous divulguez des informations personnelles, de manière directe ou au travers d’un revendeur ou d’un autre partenaire commercial, nous nous engageons à :',
    },
    {
      type: 'ul',
      items: [
        'ne pas vendre, ni louer vos informations personnelles à un tiers sans votre autorisation — à moins que vous y ayez consenti —, nous pouvons utiliser vos informations de contact pour vous communiquer des informations dont nous pensons que vous devez être informé ou que vous pourriez trouver utiles, comme (par exemple) des informations sur nos services ou des modifications de la Politique d’utilisation ;',
        'prendre des mesures commercialement raisonnables pour protéger les informations personnelles contre la perte, le traitement illicite et l’accès non autorisé, la divulgation, l’altération et la destruction ;',
        {
          text: 'ne pas utiliser ou révéler les informations excepté pour :',
          sub: [
            'si nécessaire, fournir des produits ou des services que vous avez commandés, comme (par exemple) en les fournissant à un transporteur pour livrer des produits que vous avez commandés ;',
            'd’autres manières que celles décrites dans la présente Politique ou auxquelles vous avez consenti ;',
            'de façon agrégée avec d’autres informations, de telle manière à ce que votre identité ne puisse être raisonnablement déterminée (par exemple la compilation de statistiques) ;',
            'comme l’exige la loi, par exemple, en réponse à une assignation ou un à une perquisition ;',
            'des auditeurs externes qui ont accepté de conserver la confidentialité des informations ;',
            'si nécessaire, renforcer les Conditions d’utilisation',
            'si nécessaire, protéger les droits, la sécurité ou la propriété de **Capitello Group**, de ses utilisateurs ou d’autres ; cela peut inclure (par exemple) de communiquer des informations à d’autres organismes ou autorités publiques à des fins d’indentification, de lutte contre la fraude et/ou de réduction des risques.',
          ],
        },
      ],
    },

    { type: 'h2', text: '9. Votre consentement' },
    {
      type: 'p',
      text: 'En nous fournissant vos informations personnelles et/ou en utilisant les sites internet et/ou en contractant avec nous, vous consentez au traitement de vos données personnelles **Capitello Group** pour les finalités exposées ci-dessus.',
    },
    {
      type: 'p',
      text: 'Vous consentez également au transfert de vos informations vers des pays ou juridictions qui n’offrent pas le même niveau de protection des données que l’Union Européenne, si nécessaire pour les finalités exposées ci-dessus. Si un tel transfert est opéré, nous vous fournirons des garanties pour vous assurer que vos informations sont dûment protégées. Si vous nous fournissez des informations relatives à une autre personne, vous confirmez qu’ils vous ont autorisé à agir en leur nom à procéder au traitement de leurs données personnelles incluant des données personnelles sensibles, et que vous les avez informés de notre identité et des finalités (comme décrites ci-dessus) pour lesquelles leurs données personnelles seront traitées. Nous ne traitons pas les données personnelles des mineurs de moins de 16 ans sans le consentement exprès de leurs parents ou de leurs représentant légaux.',
    },

    { type: 'h2', text: '10. Les sites Web tiers et les réseaux sociaux' },
    {
      type: 'p',
      text: 'Les sites ou services de **Capitello Group** sont susceptibles de fournir des liens vers des applications, produits, services ou sites Web tiers pour faciliter votre navigation et pour votre information. Si vous vous rendez sur ces liens, vous quittez le site de **Capitello Group**. **Capitello Group** ne contrôle pas ces sites tiers ni leurs pratiques en termes de confidentialité et de protection des données, qui peuvent être différentes des nôtres. Nous ne finançons ni ne représentons aucun de ces sites tiers et déclinons toute responsabilité quant à leur contenu et leur pratique en termes de protection des données personnelles. Les données personnelles que vous choisissez de nous fournir via ces sites ou qui sont recueillies par ces tiers ne sont pas couvertes par la Politique protection des données personnelle de **Capitello Group**. Nous vous encourageons à consulter la politique de confidentialité de tout site avec lequel vous interagissez avant de permettre le recueil et l’utilisation de vos informations personnelles. Nous fournissons également des liens vers des réseaux sociaux qui vous permettent de partager des informations avec vos propres réseaux sociaux et d’interagir avec **Capitello Group** sur divers réseaux sociaux. Lorsque vous utilisez ces liens, des informations à votre sujet peuvent être collectées ou partagées. Nous vous encourageons à consulter les politiques et paramètres de confidentialité des réseaux sociaux avec lesquels vous interagissez, afin de connaître les informations susceptibles d’être recueillies, utilisées ou partagées par ces sites.',
    },
    {
      type: 'p',
      text: 'Si vous postez, commentez, indiquez des intérêts ou partagez des informations personnelles, notamment des photographies, sur tout forum public, réseau social, blog ou tout forum similaire, sachez que toute information personnelle que vous postez peut être lue, vue, collectée ou utilisée par d’autres utilisateurs de ces forums et qu’elle peut être utilisée pour vous contacter, vous envoyez des messages non sollicités ou pour des finalités que ni vous ni **Capitello Group** ne contrôle. **Capitello Group** n’est pas responsable des informations personnelles que vous choisissez de poster sur ces forums.',
    },

    { type: 'h2', text: '11. Quels sont vos droits ?' },
    {
      type: 'ul',
      items: [
        {
          text: 'Droit d’accès',
          paragraphs: [
            'En tant que personne concernée, vous pouvez vous informer sur la nature des données personnelles stockées ou traitées vous concernant par toute entité de **Capitello Group**. Un accès à vos données personnelles vous sera fourni peu importe la localisation du traitement ou du stockage.',
            'Une entité de **Capitello Group** qui traite de telles données coopérera pour vous fournir ces accès, de manière directe ou par le biais d’une entité locale.',
          ],
        },
        {
          text: 'Droit de rectification',
          paragraphs: [
            'Si des informations personnelles sont inexactes ou incomplètes, vous pouvez demander à ce qu’elles soient modifiées.',
          ],
        },
        {
          text: 'Droit d’opposition.',
          paragraphs: [
            'Vous avez le droit de vous opposer à tout moment au traitement de vos données personnelles lorsque **Capitello Group** traite vos données pour des motifs qui lui sont d’intérêt légitime ou pour des motifs de marketing direct.',
          ],
        },
        {
          text: 'Droit à la suppression',
          paragraphs: [
            'Vous pouvez demander la suppression de vos données personnelles dans les cas prévus par la loi.',
          ],
        },
        {
          text: 'Droit de demander la limitation du traitement',
          paragraphs: [
            'Vous avez le droit de demander la limitation du traitement de vos données personnelles quand c’est autorisé par les lois et règlements applicables.',
          ],
        },
        {
          text: 'Droit à la portabilité',
          paragraphs: [
            'Si vous remplissez les conditions définies par les lois et règlements relatifs à la protection des données personnelles, vous avez le droit de recevoir un sous-ensemble de vos données personnelles et de les transférer de **Capitello Group** à un autre responsable de traitement.',
            'Vous pouvez également demander la transmission directe de vos informations personnelles de **Capitello Group** vers un autre responsable de traitement quand c’est techniquement réalisable.',
          ],
        },
        {
          text: 'Droit de déposer une plainte',
          paragraphs: ['Vous avez le droit de déposer une plainte devant les autorités de contrôle compétentes.'],
        },
      ],
    },
    {
      type: 'p',
      text: 'Toute demande d’accès, de rectification, de limitation, d’effacement, de restriction ou de portabilité de vos données personnelles, et toute question relative à cette politique de protection des données personnelles doit être envoyée à :',
    },
    { type: 'p', text: '**Capitello Group**' },
    { type: 'p', text: `${COMPANY.street} ; ${COMPANY.city}` },
    { type: 'p', text: `Ou par mail à l’adresse : ${CONTACT}` },

    { type: 'h2', text: '12. Changement dans cette politique de protection des données personnelles' },
    {
      type: 'p',
      text: '**Capitello Group** se réserve le droit de modifier cette politique si besoin, par exemple, pour se conformer à un changement de loi, de règlementation, des pratiques et procédures de **Capitello Group**, ou des exigences imposées par les autorités chargées de la protection des données personnelles.',
    },
    {
      type: 'p',
      text: 'Dans ce cas, **Capitello Group** informera ses candidats, clients et toute personne concernée de tout changement de cette politique. **Capitello Group** publiera tout changement sur les sites web internes et externes concernés.',
    },
    { type: 'p', text: 'Dernière mise à jour : 7 octobre 2026' },
  ],
}

export const COOKIES: LegalDocument = {
  path: '/gestion-des-cookies',
  title: 'Politique en matière de cookies',
  blocks: [
    {
      type: 'p',
      text: 'Certains cookies ou autres traceurs peuvent être installés sur votre matériel (ordinateur, tablette ou téléphone mobile) lorsque vous visitez notre site Internet : **www.capitello.fr**',
    },
    {
      type: 'p',
      text: 'La présente Politique en matière de Cookies contient des informations sur ce que sont les cookies, le type de cookies utilisés par **Capitello Group** sur le site **Capitello.fr** et les finalités de ces utilisations, ainsi que vos préférences en matière de cookies.',
    },
    {
      type: 'p',
      text: 'La présente Politique en matière de Cookies doit être consultée avec la [Politique en matière de protection des données personnelles](/donnees-personnelles).',
    },

    { type: 'h2', text: 'QUE DESIGNE-T-ON PAR “COOKIES” ET “AUTRES TRACEURS” ?' },
    {
      type: 'p',
      text: 'Les cookies sont de petits fichiers qui contiennent un nombre de données générées lorsque vous surfez sur un site internet et qui sont installés sur votre navigateur internet.',
    },
    {
      type: 'p',
      text: 'Les autres technologies de traçage, tels que les traceurs, pixels et gifs invisibles, fonctionnent de la même façon que les cookies. Les cookies et autres traceurs sont utilisés pour suivre votre activité sur le site internet et nous permettre (en tant que premier destinataire des cookies) ainsi que des tiers (pour les cookies tiers) de collecter des informations sur la manière dont vous utilisez le site internet et améliorer ainsi son fonctionnement et votre visite sur notre site internet.',
    },
    { type: 'p', text: 'Il existe deux types de cookies : les cookies de session et les cookies persistants.' },
    {
      type: 'ul',
      items: [
        'Les cookies de session sont temporaires et sont par conséquent automatiquement effacés de votre appareil à chaque fois que vous fermez votre navigateur;',
        'Les cookies persistants restent sur votre appareil pour une durée déterminée dans les cookies et sont activés à chaque fois que vous visitez le site depuis lequel ils ont été installés.',
      ],
    },

    { type: 'h2', text: 'QUEL TYPE DE COOKIES UTILISONS-NOUS ET POUR QUELLES FINALITES ?' },
    {
      type: 'p',
      text: 'Quand vous surfez sur notre site internet, nous utilisons les types de cookies suivants :',
    },
    { type: 'p', text: '**1. Des cookies strictement nécessaires**' },
    {
      type: 'p',
      text: 'Ces cookies sont nécessaires pour les opérations propres aux services qui sont fournis sur le site Internet.',
    },
    {
      type: 'p',
      text: 'Ils sont utilisés pour fournir les fonctionnalités basiques de notre site internet, telles que se souvenir des informations qui ont été insérées dans un formulaire, permettre votre accès à votre compte personnel.',
    },
    {
      type: 'p',
      text: 'Si vous empêchez l’installation de ces cookies, vous ne pourrez plus utiliser ces fonctionnalités et le site internet pourrait ne pas fonctionner de façon efficace.',
    },
    { type: 'p', text: '**2. Des cookies de performances**' },
    {
      type: 'p',
      text: 'Ces cookies sont utilisés pour collecter des données anonymes à des fins statistiques. Ils nous permettent de mesurer l’audience du site internet et d’analyser la façon dont les visiteurs surfent sur le site internet (nombre de visiteurs sur le site internet, nombre de visites par page, temps passé sur chaque page, localisation des clics, mesures d’efficacité des publicités…).',
    },
    {
      type: 'p',
      text: 'Ils sont également utilisés pour détecter des problèmes de navigation et toute autre difficulté.',
    },
    { type: 'p', text: 'Ces cookies nous aident à améliorer notre site internet et votre navigation.' },
    { type: 'p', text: '**3. Des cookies de personnalisation ou de fonctionnalité**' },
    {
      type: 'p',
      text: 'Ces cookies sont utilisés pour se souvenir de vos choix, de vos réglages et de vos préférences de contenu sur le site internet [comme vos mots de passe, votre langue, votre région, votre fuseau horaire, vos choix de personnalisation…] et vous offrir ainsi une expérience de navigation personnalisée en adaptant les contenus du site internet pour vous.',
    },
    {
      type: 'p',
      text: 'Si vous refusez ces cookies nous ne pourrons plus vous offrir certaines fonctionnalités et certaines pages du site internet pourraient ne pas fonctionner correctement.',
    },
    { type: 'p', text: '**4. Des cookies de tiers**' },
    { type: 'p', text: 'Dans certains cas, nous faisons appel à des tiers pour gérer nos cookies.' },
    {
      type: 'p',
      text: 'Des tiers peuvent également utiliser leurs propres cookies ou autres traceurs pour collecter des informations sur votre activité sur le site internet, en particulier pour vous fournir des publicités personnalisées sur leur propre site internet.',
    },
    {
      type: 'p',
      text: 'Des cookies de certains réseaux sociaux peuvent également être installés sur votre appareil pour vous permettre d’interagir sur les réseaux sociaux, tels que Facebook ou Twitter.',
    },
    {
      type: 'p',
      text: 'Nous ne sommes en aucun cas impliqués dans l’installation ou le fonctionnement de tels cookies tiers et nous n’avons pas d’accès ou de contrôle sur ces cookies. Ces cookies sont soumis à leurs propres politiques en matière de cookie, lesquelles sont accessibles sur chaque site internet des tiers concernés et que nous vous invitons à consulter.',
    },
    {
      type: 'p',
      text: 'Nous ne sommes par conséquent pas responsable des données collectées par ces cookies et ne pourrons vous fournir aucune autre information sur la nature des informations collectées par ces cookies tiers.',
    },

    { type: 'h2', text: 'VOS CHOIX EN MATIERE DE COOKIES' },
    {
      type: 'p',
      text: 'Vous avez différentes possibilités pour contrôler ou limiter comment les cookies peuvent être installés et utilisés par nous ou par des tiers :',
    },
    {
      type: 'ul',
      items: [
        'Vous pouvez décider de supprimer toute ou partie des cookies depuis votre appareil à partir de vos réglages de navigation;',
        'Vous pouvez décider d’empêcher l’installation de cookies sur votre appareil depuis vos préférences de navigation.',
      ],
    },
    {
      type: 'p',
      text: 'Pour en savoir plus sur comment gérer ou supprimer les cookies depuis votre navigateur, vous pouvez consulter les liens suivants, selon votre navigateur :',
    },
    { type: 'ul', items: ['Internet Explorer', 'Chrome', 'Safari', 'Mozilla Firefox', 'Opera'] },
    {
      type: 'p',
      text: 'Veuillez noter que si vous décidez de bloquer ou désactiver toute ou partie des cookies que nous utilisons, notre site internet pourrait ne pas fonctionner correctement, et vous pourriez ne pas être capable de bénéficier de tous les services et fonctionnalités fournis grâce à l’utilisation des cookies.',
    },
    {
      type: 'p',
      text: 'Si vous voulez en savoir plus sur les cookies et sur comment les gérer, vous pouvez également visiter les sites suivants : [www.youronlinechoices.eu](https://www.youronlinechoices.eu) et [www.allaboutcookies.org](https://www.allaboutcookies.org).',
    },

    { type: 'h2', text: 'CONTACTEZ-NOUS' },
    {
      type: 'p',
      text: 'Si vous avez des questions ou commentaires sur la présente politique en matière de cookies et la façon dont **Capitello Group** utilise des cookies et autres traceurs, vous pouvez nous contacter à :',
    },
    { type: 'p', text: '**Capitello Group**' },
    { type: 'p', text: `${COMPANY.street} ; ${COMPANY.city} ; France` },
    { type: 'p', text: `Ou nous envoyer un email à l’adresse suivante : ${CONTACT}` },
  ],
}

export const LEGAL_DOCUMENTS = [MENTIONS_LEGALES, DONNEES_PERSONNELLES, COOKIES]
