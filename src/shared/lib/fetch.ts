export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
  ) {
    super(`HTTP ${status} ${statusText}`);
    this.name = 'HttpError';
  }
}

type RequestOptions = Omit<RequestInit, 'method' | 'body'> & {
  params?: Record<string, string>;
  signal?: AbortSignal;
};

type MutationOptions = RequestOptions & {
  body?: unknown;
};

interface FetcherConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  onRequest?: (url: string, init: RequestInit) => RequestInit;
  onResponseError?: (error: HttpError) => void;
}

async function parseErrorBody(response: Response): Promise<unknown> {
  const text = await response.text().catch(() => null);
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, await parseErrorBody(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function buildUrl(base: string, path: string, params?: Record<string, string>): string {
  const url = base ? `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}` : path;

  if (!params) {
    return url;
  }

  const searchParams = new URLSearchParams(params);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${searchParams.toString()}`;
}

function buildInit(
  method: string,
  defaultHeaders: Record<string, string>,
  options: MutationOptions = {},
): RequestInit {
  const { params: _, body, ...rest } = options;

  const hasBody = body !== undefined && body !== null;

  const headers: HeadersInit = {
    ...defaultHeaders,
    ...(hasBody && { 'Content-Type': 'application/json' }),
    ...(rest.headers as Record<string, string>),
  };

  return {
    method,
    ...rest,
    headers,
    ...(hasBody && { body: JSON.stringify(body) }),
  };
}

export function createFetcher(config: FetcherConfig = {}) {
  const { baseUrl = '', headers: defaultHeaders = {}, onRequest, onResponseError } = config;

  async function send<T>(url: string, init: RequestInit): Promise<T> {
    const finalInit = onRequest ? onRequest(url, init) : init;
    try {
      return await request<T>(url, finalInit);
    } catch (error) {
      if (onResponseError && error instanceof HttpError) {
        onResponseError(error);
      }
      throw error;
    }
  }

  return {
    get<T>(url: string, options?: RequestOptions): Promise<T> {
      return send<T>(
        buildUrl(baseUrl, url, options?.params),
        buildInit('GET', defaultHeaders, options),
      );
    },

    post<T>(url: string, options?: MutationOptions): Promise<T> {
      return send<T>(
        buildUrl(baseUrl, url, options?.params),
        buildInit('POST', defaultHeaders, options),
      );
    },

    put<T>(url: string, options?: MutationOptions): Promise<T> {
      return send<T>(
        buildUrl(baseUrl, url, options?.params),
        buildInit('PUT', defaultHeaders, options),
      );
    },

    patch<T>(url: string, options?: MutationOptions): Promise<T> {
      return send<T>(
        buildUrl(baseUrl, url, options?.params),
        buildInit('PATCH', defaultHeaders, options),
      );
    },

    delete<T>(url: string, options?: RequestOptions): Promise<T> {
      return send<T>(
        buildUrl(baseUrl, url, options?.params),
        buildInit('DELETE', defaultHeaders, options),
      );
    },
  };
}

export const api = createFetcher();
