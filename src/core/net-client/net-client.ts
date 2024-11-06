import axios from 'axios';
import { logError } from 'core/utils/logger';
import { INetRequestConfig, INetRequestHeaders, INetRequestType, INetResponse, INetResult } from './net-client-types';
import { handleAxiosError, handleAxiosSuccess } from './net-client-utils';

export class NetClient {
  private targetHost = '';
  private axiosInstance = axios.create();
  private headersGetter?: (requestConfig: INetRequestConfig) => Promise<INetRequestHeaders>;
  private configModifier?: (requestConfig: INetRequestConfig) => Promise<INetRequestConfig>;
  private onRequestError?: (requestConfig: INetRequestConfig, err: any) => Promise<boolean>;
  private onRequestLogger?: (config: INetRequestConfig) => void;
  private onResponseLogger?: (requestConfig: INetRequestConfig, response: INetResponse) => void;
  private onErrorLogger?: (requestConfig: INetRequestConfig, err: any) => void;

  //Options
  setHost(host: string) {
    this.targetHost = host;
    return this;
  }

  setOnRequestError(onRequesError: (error: any) => Promise<boolean>) {
    this.onRequestError = onRequesError;
    return this;
  }

  setHeadersGetter(headersGetter: (requestConfig: INetRequestConfig) => Promise<INetRequestHeaders>) {
    this.headersGetter = headersGetter;
    return this;
  }

  setConfigModifier(configModifier: (requestConfig: INetRequestConfig) => Promise<INetRequestConfig>) {
    this.configModifier = configModifier;
    return this;
  }

  //Logging
  setRequestLogger(onRequestLogger: (requestConfig: INetRequestConfig) => void) {
    this.onRequestLogger = onRequestLogger;
    return this;
  }
  setResponseLogger(onResponseLogger: (requestConfig: INetRequestConfig, response: INetResponse) => void) {
    this.onResponseLogger = onResponseLogger;
    return this;
  }
  setErrorLogger(onErrorLogger: (requestConfig: INetRequestConfig, err: any) => void) {
    this.onErrorLogger = onErrorLogger;
    return this;
  }

  //Methods
  async get<RESPONSE_TYPE = any, REQUEST_TYPE = any>(requestConfig: INetRequestConfig<REQUEST_TYPE>) {
    requestConfig.method = INetRequestType.GET;
    return await this.makeRequest<RESPONSE_TYPE, REQUEST_TYPE>(requestConfig);
  }

  async post<RESPONSE_TYPE = any, REQUEST_TYPE = any>(requestConfig: INetRequestConfig<REQUEST_TYPE>) {
    requestConfig.method = INetRequestType.POST;
    return await this.makeRequest<RESPONSE_TYPE, REQUEST_TYPE>(requestConfig);
  }

  async put<RESPONSE_TYPE = any, REQUEST_TYPE = any>(requestConfig: INetRequestConfig<REQUEST_TYPE>) {
    requestConfig.method = INetRequestType.PUT;
    return await this.makeRequest<RESPONSE_TYPE, REQUEST_TYPE>(requestConfig);
  }

  async patch<RESPONSE_TYPE = any, REQUEST_TYPE = any>(requestConfig: INetRequestConfig<REQUEST_TYPE>) {
    requestConfig.method = INetRequestType.PATCH;
    return await this.makeRequest<RESPONSE_TYPE, REQUEST_TYPE>(requestConfig);
  }

  async delete<RESPONSE_TYPE = any, REQUEST_TYPE = any>(requestConfig: INetRequestConfig<REQUEST_TYPE>) {
    requestConfig.method = INetRequestType.DELETE;
    return await this.makeRequest<RESPONSE_TYPE, REQUEST_TYPE>(requestConfig);
  }

  //Main-request
  async makeRequest<RESPONSE_TYPE = any, REQUEST_TYPE = any>(
    requestConfig: INetRequestConfig<REQUEST_TYPE>
  ): Promise<INetResult<RESPONSE_TYPE, REQUEST_TYPE>> {
    let targetUrl = `${this.targetHost}`;

    if (requestConfig.url) {
      targetUrl += requestConfig.url;
    }
    requestConfig.url = targetUrl;

    let headersFromGetter: INetRequestHeaders = {};
    if (this.headersGetter) {
      try {
        headersFromGetter = await this.headersGetter(requestConfig);
      } catch (error) {
        logError('HeadersGetter ERROR', error);
      }
    }
    requestConfig.headers = {
      ...headersFromGetter,
      ...requestConfig.headers,
    };

    let configFinal: INetRequestConfig<REQUEST_TYPE> = {
      ...requestConfig,
    };

    if (this.configModifier) {
      try {
        configFinal = await this.configModifier(configFinal);
      } catch (error) {
        logError('configModifier ERROR', error);
      }
    }

    if (this.onRequestLogger) {
      this.onRequestLogger(requestConfig);
    }

    try {
      const response = await this.axiosInstance.request<
        RESPONSE_TYPE,
        INetResponse<RESPONSE_TYPE, REQUEST_TYPE>,
        REQUEST_TYPE
      >(configFinal);

      if (this.onResponseLogger) {
        this.onResponseLogger(configFinal, response);
      }

      return handleAxiosSuccess<RESPONSE_TYPE, REQUEST_TYPE>(configFinal, response);
    } catch (error: any) {
      if (this.onErrorLogger) {
        this.onErrorLogger(configFinal, error);
      }
      if (this.onRequestError) {
        const needToRepeatRequest = await this.onRequestError(configFinal, error)
          .then((val) => val)
          .catch((_) => false);

        if (needToRepeatRequest) {
          return await this.makeRequest(requestConfig);
        }
      }

      return handleAxiosError(configFinal, error);
    }
  }
}
