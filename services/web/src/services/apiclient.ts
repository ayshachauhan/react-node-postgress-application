import { publicRuntimeConfig } from 'next.config';
import { COOKIES, getCookie } from './cookies';

export type RequestConfig<T> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: T;
  headers?: Record<string, unknown>;
};

export class ApiService {
  getUrl(path: string): string {
    const { API_BASE_URL } = publicRuntimeConfig;
    return `${API_BASE_URL}${path}`;
  }

  getToken(): string | undefined {
    return getCookie(COOKIES.ACCESS_TOKEN);
  }

  getRequestConfig<T>({
    method,
    body,
    headers,
  }: RequestConfig<T>): RequestInit {
    const requestConfig: RequestInit = {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    const token = this.getToken();
    if (token) {
      requestConfig.headers!['Authorization'] = `Bearer ${token}`;
    }
    return requestConfig;
  }

  async get<T>(path: string, data?: T): Promise<Response> {
    return await fetch(
      this.getUrl(path),
      this.getRequestConfig({ method: 'GET', body: data }),
    );
  }

  async post<T>(path: string, data: T): Promise<Response> {
    return await fetch(
      this.getUrl(path),
      this.getRequestConfig<T>({ method: 'POST', body: data }),
    );
  }

  async put(path: string, data: Record<string, unknown>): Promise<Response> {
    return await fetch(
      this.getUrl(path),
      this.getRequestConfig({ method: 'PUT', body: data }),
    );
  }

  async delete<T>(path: string, data: T | null): Promise<Response> {
    return await fetch(
      this.getUrl(path),
      this.getRequestConfig({ method: 'DELETE', body: data }),
    );
  }

  async patch<T>(
    path: string,
    data: T,
    headers?: Record<string, string>,
  ): Promise<Response> {
    return await fetch(
      this.getUrl(path),
      this.getRequestConfig<T>({
        method: 'PATCH',
        body: data,
        headers: headers ?? {},
      }),
    );
  }
}
