import { publicRuntimeConfig } from 'next.config';
import { COOKIES, getCookie } from './cookies';

export type RequestConfig = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, unknown>;
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

  getRequestConfig({ method, body, headers }: RequestConfig): RequestInit {
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

  async get(
    path: string,
    headers: Record<string, unknown> = {},
  ): Promise<Response> {
    return await fetch(
      this.getUrl(path),
      this.getRequestConfig({ method: 'GET', headers }),
    );
  }

  async post(path: string, data: Record<string, unknown>): Promise<Response> {
    return await fetch(
      this.getUrl(path),
      this.getRequestConfig({ method: 'POST', body: data }),
    );
  }

  async put(path: string, data: Record<string, unknown>): Promise<Response> {
    return await fetch(
      this.getUrl(path),
      this.getRequestConfig({ method: 'PUT', body: data }),
    );
  }

  async delete(path: string): Promise<Response> {
    return await fetch(
      this.getUrl(path),
      this.getRequestConfig({ method: 'DELETE' }),
    );
  }

  async patch(path: string, data: Record<string, unknown>): Promise<Response> {
    return await fetch(
      this.getUrl(path),
      this.getRequestConfig({ method: 'PATCH', body: data }),
    );
  }
}
