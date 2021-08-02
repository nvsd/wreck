import { request } from 'https';
import { IncomingHttpHeaders } from 'http';

import { makeHttpsOptions } from './utils';
import { Options } from './types';

interface Response<T> {
  statusCode?: number;
  body: T;
  headers: IncomingHttpHeaders;
}

interface MakeWreckParams extends Options {
  baseUrl: string;
  dev?: boolean;
}

const makeRequest = <R>(
  path: string,
  baseUrl: string,
  options?: Options
): Promise<Response<R>> => {
  if (options?.dev) {
    console.log('path', path);
    console.log(`baseUrl`, baseUrl);
    console.log(`options`, options);
  }
  return new Promise((resolve, reject) => {
    const urlOptions = makeHttpsOptions({ ...options, host: baseUrl, path });

    const req = request(urlOptions, (res) => {
      let body = '';

      res.on('data', (chunk) => (body += chunk.toString()));
      res.on('error', reject);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode <= 299) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(body),
          });
        } else {
          console.error(
            'Request failed. status: ' + res.statusCode + ', body: ' + body
          );
          reject({
            statusCode: res.statusCode,
            headers: res.headers,
            body: undefined,
          });
        }
      });
    });

    if (options?.payload) {
      req.write(options.payload);
    }
    req.on('error', reject);
    req.end();
  });
};

export const makeWreck = ({ baseUrl, ...rest }: MakeWreckParams) => {
  return {
    get: <T>(path: string, options?: Options) =>
      makeRequest<T>(path, baseUrl, { ...options, ...rest, method: 'GET' }),
    post: <T>(path: string, options?: Options) =>
      makeRequest<T>(path, baseUrl, { ...options, ...rest, method: 'POST' }),
  };
};

export type WreckInstance = ReturnType<typeof makeWreck>;
