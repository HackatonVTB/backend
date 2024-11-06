import { spawnSync } from 'child_process';
import { logError, logInfo } from 'core/utils/logger';
import { writeFileSync } from 'fs';
import { cwd, env } from 'process';

export function testBuild() {
  console.log('ENV =', env);
  console.log('CWD =', cwd());
  console.log('DIRNAME =', __dirname);
  const kk = spawnSync('bash', {
    encoding: 'utf-8',
    input: `ls -la`,
  });
  console.log('SYNC returns =', kk);
  const signsFolder = cwd();

  //Объявляем названия файлов
  const inFileName = new Date().toISOString().replace(/-/g, '_').replace('.', '_').replace('Z', '') + '.in.txt';

  const inFilePath = `${signsFolder}/${inFileName}`;

  //создание файла
  writeFileSync(`${inFilePath}`, 'asdadadadadasdada');

  // logger
  const logTestObj = {
    asd: 123,
    zxc: true,
    qwe: 'qqqqqqq',
    rty: {
      dfg: 456,
      cvb: false,
    },
    func1: (f: number) => {
      console.log('SomeNumber', f);
    },
  };
  const logTestArr = [1, 2, 3];

  logInfo('Info_1');

  console.log('Info_with_object.CONSOLE', logTestObj);
  logInfo('Info_with_object', logTestObj);

  console.log('Info_with_array.CONSOLE', logTestArr);
  logInfo('Info_with_array', logTestArr);

  // logError
  let aa: any = 0;
  try {
    aa = null;
    const throwResutl = aa.endsWith('test_1');
  } catch (err) {
    logError('Error_NULL_object', err, logTestObj);
    logError('Error_NULL_array', err, logTestArr);
  }

  // Circular
  const logCircularTestObj: any = {
    asd: 123,
    zxc: true,
    qwe: 'qqqqqqq',
    rty: {
      dfg: 456,
      cvb: false,
    },
  };
  logCircularTestObj['circ1'] = logCircularTestObj;

  logInfo('Info_with_circular', logCircularTestObj);
}
