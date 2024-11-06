import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosRequestHeaders,
  RawAxiosResponseHeaders,
} from 'axios';

export type INetResult<RESPONSE_TYPE = any, REQUEST_TYPE = any> = {
  isSuccess: boolean;
  status: number;
  statusText: string;
  message?: string;
  responseHeaders?: INetResponseHeaders;
  requestConfig: INetRequestConfig<REQUEST_TYPE>;
  data?: RESPONSE_TYPE;
  errorData?: any;
};

export enum INetRequestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type INetRequestConfig<REQUEST_TYPE = any> = AxiosRequestConfig<REQUEST_TYPE>;
export type INetResponse<RESPONSE_TYPE = any, REQUEST_TYPE = any> = AxiosResponse<RESPONSE_TYPE, REQUEST_TYPE>;
export type INetRequestHeaders = RawAxiosRequestHeaders;
export type INetResponseHeaders = RawAxiosResponseHeaders | AxiosResponseHeaders;

//Дефолтные заголовки для отправки файлов на сервер
export const MEDIA_HEADERS = {
  'Content-Type': 'multipart/form-data',
};

export const OCTET_STREAM_HEADERS = {
  'Content-Type': 'application/octet-stream',
};
