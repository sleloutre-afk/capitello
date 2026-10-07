import * as migration_._20261007_170406_initial_schema from './._20261007_170406_initial_schema';
import * as migration_20261007_170406_initial_schema from './20261007_170406_initial_schema';

export const migrations = [
  {
    up: migration_._20261007_170406_initial_schema.up,
    down: migration_._20261007_170406_initial_schema.down,
    name: '._20261007_170406_initial_schema',
  },
  {
    up: migration_20261007_170406_initial_schema.up,
    down: migration_20261007_170406_initial_schema.down,
    name: '20261007_170406_initial_schema'
  },
];
