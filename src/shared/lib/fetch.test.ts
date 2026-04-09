import http from 'node:http';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { HttpError, api, createFetcher } from './fetch';

let server: http.Server;
let baseUrl: string;
let lastRequest: { method: string; url: string; headers: http.IncomingHttpHeaders; body: string };

beforeAll(async () => {
  server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      lastRequest = {
        method: req.method ?? '',
        url: req.url ?? '',
        headers: req.headers,
        body,
      };

      const url = req.url ?? '';

      if (url.startsWith('/json')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: 1, name: 'Kim' }));
        return;
      }

      if (url.startsWith('/echo-body')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(body || '{}');
        return;
      }

      if (url.startsWith('/no-content')) {
        res.writeHead(204);
        res.end();
        return;
      }

      if (url.startsWith('/error-json')) {
        res.writeHead(400, 'Bad Request', { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'invalid' }));
        return;
      }

      if (url.startsWith('/error-text')) {
        res.writeHead(500, 'Internal Server Error');
        res.end('something went wrong');
        return;
      }

      if (url.startsWith('/error-empty')) {
        res.writeHead(502, 'Bad Gateway');
        res.end();
        return;
      }

      if (url.startsWith('/slow')) {
        setTimeout(() => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ done: true }));
        }, 3000);
        return;
      }

      res.writeHead(404);
      res.end();
    });
  });

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as { port: number };
      baseUrl = `http://127.0.0.1:${addr.port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

describe('HttpError', () => {
  it('속성이 올바르게 설정된다', () => {
    const error = new HttpError(404, 'Not Found', { message: 'missing' });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
    expect(error.status).toBe(404);
    expect(error.statusText).toBe('Not Found');
    expect(error.body).toEqual({ message: 'missing' });
    expect(error.name).toBe('HttpError');
    expect(error.message).toBe('HTTP 404 Not Found');
  });
});

describe('api', () => {
  describe('HTTP methods', () => {
    it.each(['get', 'post', 'put', 'patch', 'delete'] as const)(
      '%s — 올바른 method로 요청한다',
      async (method) => {
        await api[method](`${baseUrl}/json`);

        expect(lastRequest.method).toBe(method.toUpperCase());
      },
    );
  });

  describe('params', () => {
    it('쿼리스트링으로 변환된다', async () => {
      await api.get(`${baseUrl}/json`, { params: { page: '1', limit: '10' } });

      const params = new URLSearchParams(lastRequest.url.split('?')[1]);
      expect(params.get('page')).toBe('1');
      expect(params.get('limit')).toBe('10');
    });

    it('기존 쿼리스트링이 있으면 &로 연결된다', async () => {
      await api.get(`${baseUrl}/json?sort=name`, { params: { page: '1' } });

      expect(lastRequest.url).toContain('/json?sort=name&');
      expect(lastRequest.url).toContain('page=1');
    });
  });

  describe('응답 처리', () => {
    it('JSON 응답을 파싱하여 반환한다', async () => {
      const result = await api.get<{ id: number; name: string }>(`${baseUrl}/json`);

      expect(result).toEqual({ id: 1, name: 'Kim' });
    });

    it('204 응답 시 undefined를 반환한다', async () => {
      const result = await api.delete(`${baseUrl}/no-content`);

      expect(result).toBeUndefined();
    });

    it('에러 응답 시 HttpError를 throw한다', async () => {
      await expect(api.get(`${baseUrl}/error-json`)).rejects.toThrow(HttpError);
      await expect(api.get(`${baseUrl}/error-json`)).rejects.toMatchObject({
        status: 400,
      });
    });
  });

  describe('signal', () => {
    it('abort 시 요청이 취소된다', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(api.get(`${baseUrl}/slow`, { signal: controller.signal })).rejects.toThrow();
    });
  });
});

describe('body 직렬화', () => {
  it('body가 있으면 Content-Type과 JSON.stringify가 적용된다', async () => {
    await api.post(`${baseUrl}/echo-body`, { body: { name: 'Kim' } });

    expect(lastRequest.headers['content-type']).toBe('application/json');
    expect(lastRequest.body).toBe(JSON.stringify({ name: 'Kim' }));
  });

  it('body가 undefined이면 body 없이 전송된다', async () => {
    await api.post(`${baseUrl}/json`);

    expect(lastRequest.body).toBe('');
    expect(lastRequest.headers['content-type']).toBeUndefined();
  });

  it('body가 null이면 body 없이 전송된다', async () => {
    await api.post(`${baseUrl}/json`, { body: null });

    expect(lastRequest.body).toBe('');
  });

  it('사용자 headers로 Content-Type을 덮어쓸 수 있다', async () => {
    await api.post(`${baseUrl}/echo-body`, {
      body: { data: 'test' },
      headers: { 'Content-Type': 'text/plain' },
    });

    expect(lastRequest.headers['content-type']).toBe('text/plain');
  });
});

describe('에러 바디 파싱', () => {
  it('JSON 에러 응답을 파싱된 객체로 저장한다', async () => {
    try {
      await api.get(`${baseUrl}/error-json`);
    } catch (error) {
      expect((error as HttpError).body).toEqual({ error: 'invalid' });
    }
  });

  it('텍스트 에러 응답을 문자열로 저장한다', async () => {
    try {
      await api.get(`${baseUrl}/error-text`);
    } catch (error) {
      expect((error as HttpError).body).toBe('something went wrong');
    }
  });

  it('빈 응답이면 null로 저장한다', async () => {
    try {
      await api.get(`${baseUrl}/error-empty`);
    } catch (error) {
      expect((error as HttpError).body).toBeNull();
    }
  });
});

describe('createFetcher', () => {
  it('baseUrl이 경로 앞에 붙는다', async () => {
    const client = createFetcher({ baseUrl });

    await client.get('/json');

    expect(lastRequest.url).toBe('/json');
  });

  it('baseUrl 후행 슬래시와 path 선행 슬래시가 정규화된다', async () => {
    const client = createFetcher({ baseUrl: `${baseUrl}/` });

    await client.get('/json');

    expect(lastRequest.url).toBe('/json');
  });

  it('기본 headers가 매 요청에 포함된다', async () => {
    const client = createFetcher({
      baseUrl,
      headers: { 'X-Api-Key': 'secret123' },
    });

    await client.get('/json');

    expect(lastRequest.headers['x-api-key']).toBe('secret123');
  });

  it('onRequest 훅으로 init을 수정할 수 있다', async () => {
    const onRequest = vi.fn((_url: string, init: RequestInit) => ({
      ...init,
      headers: { ...(init.headers as Record<string, string>), 'X-Custom': 'value' },
    }));
    const client = createFetcher({ baseUrl, onRequest });

    await client.get('/json');

    expect(onRequest).toHaveBeenCalledOnce();
    expect(lastRequest.headers['x-custom']).toBe('value');
  });

  it('onResponseError 훅이 에러 시 호출되고 에러는 여전히 throw된다', async () => {
    const onResponseError = vi.fn();
    const client = createFetcher({ baseUrl, onResponseError });

    await expect(client.get('/error-json')).rejects.toThrow(HttpError);
    expect(onResponseError).toHaveBeenCalledWith(expect.any(HttpError));
    expect(onResponseError).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }));
  });
});
