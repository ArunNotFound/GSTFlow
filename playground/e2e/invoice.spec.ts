import { test, expect } from '@playwright/test';

test('has title and can process valid invoice', async ({ page }) => {
  await page.goto('/');

  // The title should contain GSTFlow
  await expect(page).toHaveTitle(/GSTFlow/);

  // Click the Govt JSON Playground button to switch modes
  await page.getByRole('button', { name: 'Govt JSON Playground' }).click();

  // The default sample is already "Valid B2B Invoice"
  // The output should be successful
  await expect(page.getByText('No issue found in the supported checks')).toBeVisible({ timeout: 5000 });
});
