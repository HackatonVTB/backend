import { OperationObject } from 'openapi3-ts/oas31';
import { ApiMethodTypes, SWMethodParseParamsRequest } from './types';

export type SWMethodParseRequest = {
  controllerPath: string;
  methodPath: string;
  methodType: ApiMethodTypes;
  methodParams: SWMethodParseParamsRequest;
};

export type SWMethodParseResult = {
  tag: string;
  methodPath: string;
  methodType: ApiMethodTypes;
  method: OperationObject;
};
