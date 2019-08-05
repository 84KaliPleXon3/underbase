// tslint:disable:no-console
// tslint:disable:no-empty

import { Promise as BlueBirdPromise } from 'bluebird';
import { Db, MongoClient } from 'mongodb';
import { Migration } from '../index';

let dbClient: Db;
const collectionName = '_migration';
const dbURL = process.env.DBURL || 'mongodb://localhost:27017/underbase_test';

describe('INTEGRATION - Migration', () => {
  let migrator: Migration;
  let migrationsList: any[];
  let configObject: any;

  beforeAll(async () => {
    try {
      const client = await MongoClient.connect(dbURL, {
        useNewUrlParser: true,
      });

      dbClient = client.db();

      configObject = {
        logs: true,
        logIfLatest: true,
        collectionName,
        db: dbURL,
        logger: {
          info: () => {},
          error: () => {},
          warn: () => {},
          success: () => {},
          log: () => {},
        },
      };

      migrator = new Migration(configObject);
      await migrator.config();

      migrationsList = [];
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  beforeEach(() => {
    migrationsList = [];

    migrationsList.push({
      version: 0,
      up: () => {},
    });

    migrationsList.push({
      version: 1,
      describe: 'Version 1',
      up: () => {
        return 'done';
      },
      down: () => {
        return 'done';
      },
    });

    migrator.add(migrationsList[1]);

    migrationsList.push({
      version: 2.0,
      describe: 'Version 2',
      up: () => {
        return 'done';
      },
      down: () => {
        return 'done';
      },
    });

    migrator.add(migrationsList[2]);
  });

  afterEach(async () => {
    await migrator.reset();
  });

  describe('#migrateTo', () => {
    test('1 from 0, should migrate to v1', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
      await migrator.migrateTo(1.0);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(1);
    });

    test('2 from 0, should migrate to v2', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
      await migrator.migrateTo(2);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);
    });

    test(`'latest' from 0, should migrate to v2`, async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
      await migrator.migrateTo('latest');
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);
    });

    test('from 2 to 1, should migrate to v1', async () => {
      await migrator.migrateTo('2');
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);

      await migrator.migrateTo(1);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(1);
    });

    test('from 2 to 0, should migrate to v0', async () => {
      await migrator.migrateTo('2');
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);

      await migrator.migrateTo(0);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
    });

    test('rerun 0 to 0, should migrate to v0', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);

      await migrator.migrateTo('0,rerun');
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
    });

    describe('With async(async/await and Promise) up() & down()', () => {
      beforeEach(() => {
        migrator.add({
          version: 3.0,
          describe: 'Version 3.',
          up: async () => {
            return 'done';
          },
          down: async () => {
            return 'done';
          },
        });

        migrator.add({
          version: 4,
          describe: 'Version 4',
          up: BlueBirdPromise.method(() => {
            return 'done';
          }),
          down: BlueBirdPromise.method(() => {
            return 'done';
          }),
        });
      });

      test('from 0 to 3, should migrate to v3', async () => {
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(0);
        await migrator.migrateTo(3.0);
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(3);
      });

      test('from 0 to 4, should migrate to v4', async () => {
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(0);
        await migrator.migrateTo('4.0');
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
      });
    });

    describe('On Error', () => {
      beforeEach(() => {
        migrator.add({
          version: 3,
          describe: 'Version 3.',
          up: async () => {},
          down: async () => {},
        });

        migrator.add({
          version: 4,
          describe: 'Version 4.',
          up: async () => {},
          down: async () => {
            throw new Error('Something went wrong');
          },
        });

        migrator.add({
          version: 5,
          describe: 'Version 5.',
          up: async () => {
            throw new Error('Something went wrong');
          },
          down: async () => {},
        });
      });

      test('from 0 to 5, should stop migration at v4 due to error from v4 to v5', async () => {
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(0);
        try {
          await migrator.migrateTo(5);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
      });

      test('from 4 to 3, should stop migration at 4 due to error from v4 to v3', async () => {
        await migrator.migrateTo(4);
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
        try {
          await migrator.migrateTo(3);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
      });
    });
  });

  describe('#isLocked', () => {
    test(`should be unlocked`, async () => {
      const locked = await migrator.isLocked();
      expect(locked).toBe(false);
    });

    test(`should be locked`, async () => {
      await dbClient.collection(collectionName).updateOne(
        {
          _id: 'control',
        },
        {
          $set: {
            version: 1,
            locked: true,
          },
        },
        {
          upsert: true,
        },
      );

      const locked = await migrator.isLocked();

      expect(locked).toBe(true);
    });
  });

  describe('#getConfig', () => {
    test('should return config objet', () => {
      const config = migrator.getConfig();

      expect(config).toMatchObject(configObject);
    });
  });

  describe('#getMigrations', () => {
    test('should return migrations array', () => {
      const migrations = migrator.getMigrations();

      migrations.forEach(m => {
        expect(m).toHaveProperty('version');
        expect(m).toHaveProperty('up');

        if (m.version !== 0) {
          expect(m).toHaveProperty('describe');
          expect(m).toHaveProperty('down');
        }
      });
    });
  });
});
