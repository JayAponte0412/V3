import { test, expect } from '@playwright/test';
const jayLibrary = 'http://127.0.0.1:5501/index.html';
const home = 'http://localhost:3000/books'
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


test('See Book List', async ({ page }) => {
    await page.goto(jayLibrary);
    await page.locator("#readers-container > button:nth-child(2)").click();
    await page.close();
}); 

test('negative test, book search', async ({ page }) => {
    await page.goto(jayLibrary);
    await page.locator("#readers-container > button:nth-child(3)").click();
    await expect(page.getByText('Books Available')).toBeVisible();
    await page.locator('#searchBox').fill('Jay');
    await page.locator('#mybtn').click();
    await expect(page.getByText('NO BOOK FOUND')).toBeVisible();
    await page.close();
});

test('Validate reviews', async ({ page }) => {
    await page.goto(jayLibrary);
    await page.locator("#readers-container > button:nth-child(1)").click();
    await page.locator('#books-container > div:nth-child(3) > a').click();
    await expect(page.locator('#reviews-container > div:nth-child(1)')).toBeVisible();
    await page.close();
});

test('negative validation reviews', async ({ page }) => {
    await page.goto(jayLibrary);
    await page.locator("#readers-container > button:nth-child(1)").click();
    await page.locator('#books-container > div:nth-child(4) > a').click();
    await page.locator('#reviews-container > div:nth-child(1)');
    await expect(page.locator('#reviews-container > div:nth-child(1)')).toHaveCount(0);
});


//artifact

test("Artifact", async ({ request }) => {
  const response = await request.get(`${home}`, {
    ignoreHTTPSErrors: true,
  });
  expect(response.status()).toBe(200);

  // Retrieve the last 2 books
  const responseBody = await response.json();
  const reversedBooks = [...responseBody].reverse();
  const twoBooks = reversedBooks.slice(0, 2);
  console.log("books:", twoBooks);

  // Create artifact directory
  const artifactDir = path.resolve(__dirname, "artifact");
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  // Save data to JSON file
  const artifactPath = path.resolve(artifactDir, "twoBooks.json");
  fs.writeFileSync(artifactPath, JSON.stringify(twoBooks, null, 2));

  console.log(`Last 2 books saved to ${artifactPath}`);
});
