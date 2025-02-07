import { test, expect } from '@playwright/test';
import { error } from 'console';
const jayLibrary = 'http://127.0.0.1:5501/index.html';
const home = 'http://127.0.0.1:5501/home.html'
const booksApi = 'http://localhost:3000/books'
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//positive UI test
test('Validate reviews', async ({ page }) => {
    await page.goto(jayLibrary);
    await page.locator("#readers-container > button:nth-child(1)").click();
    await page.locator('#books-container > div:nth-child(3) > a').click();
    await expect(page.locator('#reviews-container > div:nth-child(1)')).toBeVisible();
    await page.close();
});

//API test 
test('Api Get books', async ({ request }) => {
    const response = await request.get('http://localhost:3000/books');
    expect(response.status()).toBe(200);
});

//negative test 1
test('Validate USER button alert', async ({ page }) => {
  await page.goto(jayLibrary);
  page.on('dialog', async dialog => {
    expect(dialog.message()).toBe('Incorrect user');
    await dialog.dismiss();
  });

  await page.click('button:has-text("USER")');
  await page.close();
});


//negative test 2
test('negative validation reviews', async ({ page }) => {
    await page.goto(jayLibrary);
    await page.locator("#readers-container > button:nth-child(1)").click();
    await page.locator('#books-container > div:nth-child(4) > a').click();
    await page.locator('#reviews-container > div:nth-child(1)');
    await expect(page.locator('#reviews-container > div:nth-child(1)')).toHaveCount(0);
    await page.close();
});

//negative test 3
test('validate error popup', async ({ page }) => {
  await page.goto(home);

  await page.locator('#books-container > div:nth-child(2) > a').click();
  await page.locator('#add-review > button').waitFor({ state: 'visible' });
  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toBe('Please fill in all fields.');
    await dialog.accept();
  });
  await page.locator('#add-review > button').click();
  await page.close();
});

//negative test 4
test('Search for invalid Book', async ({ page }) => {
  await page.goto(jayLibrary);
  await page.locator("#readers-container > button:nth-child(1)").click();
  await page.locator('#searchBox').fill('Rich Dad');
  await page.locator('#mybtn').click();
  //validate error 'no book found'
  await expect(page.locator('#no-book-message')).toHaveCSS('display', 'block');
  await page.close();
});


//artifact
test("Artifact", async ({ request }) => {
  const response = await request.get(`${booksApi}`, {
    ignoreHTTPSErrors: true,
  });
  expect(response.status()).toBe(200);

  // Retrieve and reverse the last 2 books
  const responseBody = await response.json();
  const reversedBooks = [...responseBody].reverse();
  const twoBooks = reversedBooks.slice(0, 2);
  console.log("books:", twoBooks);
  // Create artifact directory to store the data
  const artifactDir = path.resolve(__dirname, "artifact");
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }
  // Save the data to JSON file
  const artifactPath = path.resolve(artifactDir, "twoBooks.json");
  fs.writeFileSync(artifactPath, JSON.stringify(twoBooks, null, 2));
});


//Broken endPoint test
test("Broken API Endpoint", async ({ request }) => {
  const response = await request.get("http://localhost:3000/broken-endpoint", {
    ignoreHTTPSErrors: true,
  });
  expect(response.status()).toBe(200); 
});
