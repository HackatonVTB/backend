import { logError, logInfo } from 'core/utils/logger';
import { appCleanUp, appInit, appListen } from './app';

async function bootstrap() {
  await appInit();

  // do app specific cleaning before exiting
  process.on('exit', async () => {
    logInfo('Exit');
    await appCleanUp();
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', () => {
    logInfo('SIGINT - Ctrl-C...');
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', (error) => {
    logError('Uncaught Exception...', error);
    process.exit(99);
  });

  await appListen();
}

bootstrap();
