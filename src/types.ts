import { RequestOptions } from 'https';

export interface Options extends Exclude<RequestOptions, 'path'> {
  params?: { [key: string]: string | number | boolean | undefined | null };
  dev?: boolean;
  payload?: Record<string, any>;
}
