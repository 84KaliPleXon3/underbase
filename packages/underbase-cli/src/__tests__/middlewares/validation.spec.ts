// tslint:disable:no-console
// tslint:disable:no-empty
import * as utils from '@underbase/utils';
import * as fs from 'fs-extra';
import 'jest-extended';
import * as validation from '../../middlewares/validators';

describe('UNIT - CLI/Middlewares', () => {
  let mockedExistsSync: any;
  let mockedLogger: any;
  let mockedExit: any;

  beforeEach(() => {
    mockedExistsSync = jest.spyOn(fs, 'existsSync');
    mockedLogger = jest.spyOn(utils.logger, 'info');
    mockedExit = jest.spyOn(utils, 'exit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Validation', () => {
    describe('checkNoArgPassed', () => {
      test('arguments were passed', async () => {
        mockedExit.mockImplementation(() => {
          return;
        });

        validation.checkNoArgPassed(
          {
            showHelp: () => {
              expect(1).toBe(0);
            },
          },
          {
            _: ['test'],
          },
        );

        expect(mockedExit).toHaveBeenCalledTimes(0);
      });

      test('no arguments were passed', async () => {
        mockedExit.mockImplementation(() => {
          return;
        });

        validation.checkNoArgPassed(
          {
            showHelp: () => {},
          },
          {
            _: [],
          },
        );

        expect(mockedExit).toHaveBeenCalledTimes(1);
      });
    });

    describe('checkMigrationDirExists', () => {
      test('migration directory exists', async () => {
        const config = { migrationsDir: './test' };

        mockedExistsSync.mockImplementation((path: string) => {
          expect(path).toBe(config.migrationsDir);

          return true;
        });

        validation.checkMigrationDirExists(config as any);

        expect(mockedExistsSync).toHaveBeenCalledTimes(1);
        expect(mockedLogger).toHaveBeenCalledTimes(0);
      });

      test('migration directory does not exists', async () => {
        const config = { migrationsDir: './test' };

        mockedExistsSync.mockImplementation((path: string) => {
          expect(path).toBe(config.migrationsDir);

          return false;
        });

        validation.checkMigrationDirExists(config as any);

        expect(mockedExistsSync).toHaveBeenCalledTimes(1);
      });
    });
  });
});
