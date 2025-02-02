import { test, expect } from '@playwright/test';


test('See Book List', async ({ page }) => {
    await page.goto('http://127.0.0.1:5501/index.html');
    await page.locator("#readers-container > button:nth-child(2)").click();
    await page.close();
}); 

