export const CONSTANTS = {
  LOCAL_URL: `http://localhost`, //Адрес локалХост
  SWAGGER_UI_DIST_PATH: `swagger-ui-dist`, //маска для swagger docs
  SWAGGER_DOCS: `/swagger/docs`, //маска для swagger docs
  SWAGGER_JSON: `/swagger/json`, //маска для swagger SHEMA (get-json)
  MEDIA_FOLDER: `/media`, //Папка, где хранятся все документы

  HEADER_ACCESS_TOKEN: 'accessToken', //Название заголовка для - accessToken
  FILE_SPLIT_BY_DOT_REGEXP: /(.+)\.(.+)/,
};

export enum FileTypes {
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}
