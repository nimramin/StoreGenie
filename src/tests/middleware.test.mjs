import { test, expect } from 'vitest';
import { middleware } from '../middleware';
import { NextRequest } from 'next/server';

test('middleware redirects new user to /welcome', async () => {
  const req = new NextRequest('http://localhost:3000/dashboard');
  const res = await middleware(req);
  expect(res.status).toBe(307);
  expect(res.headers.get('location')).toBe('http://localhost:3000/welcome');
});