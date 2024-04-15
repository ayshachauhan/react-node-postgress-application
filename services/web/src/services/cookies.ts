import Cookies from 'js-cookie';

export enum COOKIES {
  ACCESS_TOKEN = 'access_token',
}

/**
 * @summary Get Cookie value by key
 * @param key {{COOKIES}}
 */
export const getCookie = (key: COOKIES): string | undefined => Cookies.get(key);

/**
 * Set cookie key value
 * @param key {{COOKIES}}
 * @param value value to set for cookie
 */
export const setCookie = (key: COOKIES, value: string): string | undefined =>
  Cookies.set(key, value);
