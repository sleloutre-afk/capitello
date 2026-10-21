import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Les dates des publications importées de WordPress avaient été enregistrées
 * en « heure de Paris écrite comme de l'UTC ». Le BO saisit désormais date et
 * heure (instant UTC réel) et le site affiche le jour de Paris : on convertit
 * ces dates importées en instants UTC réels. Seules les dates encore
 * identiques à la date d'origine (legacy_date) sont concernées ; le jour
 * affiché sur le site ne change pas.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of ['communiques', 'news']) {
    await db.execute(
      sql.raw(`
        UPDATE "${table}"
        SET "date" = ("date" AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Paris',
            "legacy_date" = ("legacy_date" AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Paris'
        WHERE "legacy_date" IS NOT NULL AND "date" = "legacy_date";
        UPDATE "_${table}_v"
        SET "version_date" = ("version_date" AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Paris',
            "version_legacy_date" = ("version_legacy_date" AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Paris'
        WHERE "version_legacy_date" IS NOT NULL AND "version_date" = "version_legacy_date";
      `),
    )
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of ['communiques', 'news']) {
    await db.execute(
      sql.raw(`
        UPDATE "${table}"
        SET "date" = ("date" AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'UTC',
            "legacy_date" = ("legacy_date" AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'UTC'
        WHERE "legacy_date" IS NOT NULL AND "date" = "legacy_date";
        UPDATE "_${table}_v"
        SET "version_date" = ("version_date" AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'UTC',
            "version_legacy_date" = ("version_legacy_date" AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'UTC'
        WHERE "version_legacy_date" IS NOT NULL AND "version_date" = "version_legacy_date";
      `),
    )
  }
}
