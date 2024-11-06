import { CoreRequestCTX } from 'core/types-decorator';
import { logInfo } from 'core/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';

export function apiLogger(req: Request, _: Response, next: NextFunction) {
  if (req.url.includes('/swagger')) {
    next();
    return;
  }

  const tmp = req as CoreRequestCTX;

  tmp.logData = {
    reqId: nanoid(32),
    reqUrl: req.url,
    reqMethod: req.method,
  };

  if (req.body) {
    tmp.logData['reqBody'] = req.body;
  }

  if (req.query) {
    tmp.logData['reqQuery'] = req.query;
  }

  if (req.headers) {
    tmp.logData['reqHeaders'] = req.headers;
  }

  logInfo('REQ logger', tmp.logData);

  next();

  // let log = {
  //   url: req.url,
  //   method: req.method,
  //   headers: JSON.parse(JSON.stringify(req.headers)),
  //   body: req.body,
  //   query: req.query,
  // };

  // delete log.headers['x-real-ip'];
  // delete log.headers['x-forwarded-for'];

  // delete log.headers['x-forwarded-host'];
  // delete log.headers['x-forwarded-server'];

  // delete log.headers['x-client-proto'];
  // delete log.headers['connection'];
  // delete log.headers['sec-ch-ua'];
  // delete log.headers['dnt'];
  // delete log.headers['sec-ch-ua-mobile'];
  // delete log.headers['sec-ch-ua-platform'];
  // delete log.headers['origin'];
  // delete log.headers['sec-fetch-site'];
  // delete log.headers['sec-fetch-mode'];
  // delete log.headers['sec-fetch-dest'];
  // delete log.headers['referer'];
  // delete log.headers['accept-encoding'];
  // delete log.headers['accept-language'];
  // delete log.headers['if-none-match'];

  //Удалены
  //"x-real-ip": "79.139.218.214",
  //"x-forwarded-for": "79.139.218.214",
  //"x-forwarded-host": "dev.api.givtop.ru",
  //"x-forwarded-server": "dev.api.givtop.ru",

  //"x-client-host": "dev.api.givtop.ru",
  //"x-client-ip": "79.139.218.214",
  //"x-client-port": "2300",

  //"host": "dev.api.givtop.ru",
  //"accept": "application/json, text/plain, */*",
  //"x-access-token": "YwEliLNp403l1nf0Plu1ix-hPTE80ShzJOWUiHJsT_WTav5HruQuyGto9ZX6UanoiZA71DEVUgWgPU6za6-QiLh0-hE3dZcbl9VVZ-XX8umhsSV4C95doqFo4g3mKZn8",
  //"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",

  //MOBILE
  //"x-real-ip": "79.139.218.214",
  //"x-client-ip": "79.139.218.214",
  //"x-client-proto": "https",
  //"x-client-host": "api.givtop.ru",
  //"x-client-port": "1848",
  //"x-forwarded-host": "api.givtop.ru",
  //"x-forwarded-server": "api.givtop.ru",
  //"x-forwarded-for": "79.139.218.214",
  //"connection": "upgrade",
  //"host": "api.givtop.ru",
  //"accept": "application/json, text/plain, */*",
  //"x-access-token": "pQgIccuhGt8gIpy1XDxHXl0bA4aI0gYqbDTaLKeaHmvB67MO4AU0QPBIwZ1b0Fzh5jDYn3yurVjeneR-uUJFEmM3klY_426UwMLX0q8DQmbE1kogM8JMlvSQrAc7yOIr",
  //"origin": "https://givtop.ru",
  //"accept-encoding": "gzip, deflate, br",
  //"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/104.0.5112.99 Mobile/15E148 Safari/604.1",
  //"accept-language": "ru",
  //"referer": "https://givtop.ru/"

  // next();
}
