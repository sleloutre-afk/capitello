import * as migration_20261007_170406_initial_schema from './20261007_170406_initial_schema';
import * as migration_20261021_130000_dates_heure_de_paris from './20261021_130000_dates_heure_de_paris';

export const migrations = [
  {
    up: migration_20261007_170406_initial_schema.up,
    down: migration_20261007_170406_initial_schema.down,
    name: '20261007_170406_initial_schema'
  },
  {
    up: migration_20261021_130000_dates_heure_de_paris.up,
    down: migration_20261021_130000_dates_heure_de_paris.down,
    name: '20261021_130000_dates_heure_de_paris'
  },
];
