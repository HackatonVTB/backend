import { AxiosResponse } from 'axios';
import { logError, logInfo, logWarn } from 'core/utils/logger';
import { INetRequestConfig, INetResponse, INetResult } from './net-client-types';

export function handleAxiosSuccess<RESPONSE_TYPE = any, REQUEST_TYPE = any>(
  requestConfig: INetRequestConfig<REQUEST_TYPE>,
  response: AxiosResponse<RESPONSE_TYPE, REQUEST_TYPE>
): INetResult<RESPONSE_TYPE, REQUEST_TYPE> {
  return {
    isSuccess: true,
    status: response.status,
    statusText: response.statusText,
    responseHeaders: response.headers,
    requestConfig: requestConfig,
    data: response.data,
  };
}

//обработчик ошибок
export function handleAxiosError<RESPONSE_TYPE = any, REQUEST_TYPE = any>(
  requestConfig: INetRequestConfig<REQUEST_TYPE>,
  error: any
): INetResult<RESPONSE_TYPE, REQUEST_TYPE> {
  const result: INetResult = {
    isSuccess: false,
    status: 500,
    statusText: 'Произошла неизвестная ошибка',
    message: 'Произошла неизвестная ошибка',
    errorData: null,
    requestConfig: requestConfig,
  };

  if (typeof error.message === 'string') {
    result.message = error.message;
  }
  if (typeof error.code === 'string') {
    result.statusText = error.code;
  }

  //Если там в ошибке нихрена нет -> сразу отдаем данные об этом
  if (error.response) {
    //Достаем код
    if (typeof error.response.status === 'number') {
      result.status = error.response.status;
    }
    //Достаем text для кода
    if (typeof error.response.statusText === 'string') {
      result.statusText = error.response.statusText;
    }
    //Достаем сообщение
    if (error.response.data) {
      //Если есть ошибка - то кладем ее целиком в ErrorData
      result.errorData = error.response.data;

      //Если в ошибке есть сообщение
      if (typeof error.response.data.message === 'string') {
        result.message = error.response.data.message;
      }
    }
  }

  return result;
}

export function printAxiosRequestLog(requestConfig: INetRequestConfig) {
  logInfo('NetClient REQUEST', {
    method: requestConfig.method,
    url: requestConfig.url,
    headers: requestConfig.headers,
    query: requestConfig.params,
    body: requestConfig.data ? JSON.stringify(requestConfig.data, null, 2) : '',
  });
}

export function printAxiosResponseLog(requestConfig: INetRequestConfig, iNetResponse: INetResponse) {
  logInfo('NetClient RESPONSE', {
    method: requestConfig.method,
    url: requestConfig.url,
    request: {
      headers: requestConfig.headers,
      query: requestConfig.params,
      body: requestConfig.data ? JSON.stringify(requestConfig.data, null, 2) : '',
    },
    response: {
      status: iNetResponse.status,
      statusText: iNetResponse.statusText,
      headers: iNetResponse.headers,
      body: iNetResponse.data ? JSON.stringify(iNetResponse.data, null, 2) : '',
    },
  });
}

export function printAxiosErrorLog(requestConfig: INetRequestConfig, error: any) {
  const logData = {
    method: requestConfig.method,
    url: requestConfig.url,
    headers: requestConfig.headers,
    query: requestConfig.params,
    body: requestConfig.data ? JSON.stringify(requestConfig.data, null, 2) : '',
  };

  if (error.isAxiosError) {
    //Если там в ошибке нихрена нет -> сразу отдаем данные об этом
    if (error.response) {
      logWarn('NetClient ERROR (AXIOS, RESPONSE)', {
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        req: logData,
      });
    } else {
      if (error.code) {
        logWarn('NetClient ERROR (AXIOS, NO_RESPONSE, CODE)', {
          status: 500,
          statusText: error.code,
          message: error.message,
          req: logData,
        });
      } else {
        logError('NetClient ERROR (AXIOS, NO_RESPONSE, NO_CODE)', error, {
          req: logData,
        });
      }
    }
  } else {
    logError('NetClient ERROR (NO AXIOS)', error, {
      req: logData,
    });
  }
}
