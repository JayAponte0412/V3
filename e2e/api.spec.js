import { test, expect } from '@playwright/test';


test('Api Get books', async ({ request }) => {
    const response = await request.get('http://localhost:3000/books');
    expect(response.status()).toBe(200);
});