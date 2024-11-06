import { throwErrorSimple } from 'core/utils/error';
import fs from 'fs';
import { glob } from 'glob';
import { lookup } from 'mime-types';
import { CONSTANTS, FileTypes } from './constants';

export interface FileData {
  id: string; //id - сгенеренный, в момент сохранения файда
  extension: string; //Расширение файла
  size: number; //Размер файла
  originalName: string; //Оригинальное название на компе, которое загрузили
  type: string; //Тип файла, берется из enum
}

export interface FileNameWithExtension {
  name: string;
  extension: string;
}

//Получение типа файла по его расширению
export function getFileTypeByNameOrExtension(fileNameOrExtension: string): FileTypes {
  const mimetype = lookup(fileNameOrExtension);
  if (mimetype === false) return FileTypes.DOCUMENT;

  //Это фотка/картинка
  if (mimetype.includes('image')) {
    return FileTypes.IMAGE;
  }

  //Это видео файл
  if (mimetype.includes('video')) {
    return FileTypes.VIDEO;
  }

  //Это аудионфайл
  if (mimetype.includes('audio')) {
    return FileTypes.AUDIO;
  }

  return FileTypes.DOCUMENT;
}

//Преобразование строки fileName1234.jpg -> { name: 'fileName1234', extension: 'jpg' }
export function getFileNameAndExtension(fileNameWithExtension: string): FileNameWithExtension {
  const fileGroups = CONSTANTS.FILE_SPLIT_BY_DOT_REGEXP.exec(fileNameWithExtension);

  if (!fileGroups || !fileGroups[1] || !fileGroups[2]) {
    throwErrorSimple('Некорректное имя файла. Формат: file_name.png');
  }

  return {
    name: fileGroups[1],
    extension: fileGroups[2].toLowerCase(),
  };
}

//---------------
//OLD
//---------------

//Метод для проверки и создания директорий
//Формат пути для директории - /asd/qwe/zxc
export function checkFolder(path: string) {
  fs.mkdirSync(process.cwd() + path, {
    recursive: true,
  });
}

//Удаление файла
export function deleteFile(fileName: string, params?: { folder?: string; extension?: string }) {
  let filePath = '';
  if (params?.folder) {
    filePath += '/' + params.folder + '/';
  } else {
    filePath += '/**/';
  }
  filePath += fileName;
  if (params?.extension) {
    filePath += '.' + params.extension;
  } else {
    filePath += '.*';
  }

  glob.sync(process.cwd() + `${CONSTANTS.MEDIA_FOLDER}${filePath}`).forEach((el) => {
    fs.unlinkSync(el);
  });
}