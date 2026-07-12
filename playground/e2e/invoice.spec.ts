import { test, expect } from '@playwright/test';

test('has title and can process valid invoice', async ({ page }) => {
  await page.goto('/');

  // Expect a title
  await expect(page).toHaveTitle(/GSTFlow/i);

  // Click the Raw JSON button to switch modes
  await page.getByRole('button', { name: 'Raw JSON' }).click();

  // Get the textarea
  const textarea = page.locator('.monaco-editor textarea').first();
  
  // A valid invoice
  const validInvoice = {
    "InvoiceNumber": "INV-2024-0042",
    "InvoiceDate": "2024-04-15",
    "Seller": {
      "Gstin": "27AABCU9603R1ZM",
      "StateCode": "27"
    },
    "Buyer": {
      "Gstin": "29GGGGG1314R9Z6",
      "StateCode": "29"
    },
    "Items": [
      {
        "Hsn": "998311",
        "TaxableValue": 85000.0,
        "GstRate": 18.0,
        "Tax": {
          "Igst": 15300.0,
          "Cgst": 0.0,
          "Sgst": 0.0
        }
      }
    ]
  };

  // Clear and fill the textarea
  await textarea.fill('');
  await textarea.fill(JSON.stringify(validInvoice, null, 2));

  // The output should be successful
  await expect(page.getByText('Ready to File')).toBeVisible({ timeout: 5000 });
});
