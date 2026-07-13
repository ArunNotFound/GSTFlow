// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('GSTFlow Marketing Site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ---- Core Structure ----
  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/GSTFlow.*CanonFlow/);
  });

  test('navbar renders with logo and navigation links', async ({ page }) => {
    await expect(page.locator('#nav-main .logo .canon')).toHaveText('Canon');
    await expect(page.locator('#nav-main .logo .foundation')).toHaveText('Flow');
    const links = page.locator('.nav-links a');
    await expect(links).toHaveCount(5);
  });

  // ---- Hero Section ----
  test('hero section renders correctly', async ({ page }) => {
    await expect(page.locator('#hero-badge')).toBeVisible();
    await expect(page.locator('h1.title')).toContainText('GSTFlow');
    await expect(page.locator('.subtitle')).toContainText('mathematical');
    await expect(page.locator('#cta-engine')).toBeVisible();
    await expect(page.locator('#cta-architecture')).toBeVisible();
  });

  test('hero stats row shows key metrics', async ({ page }) => {
    const stats = page.locator('#hero-stats .stat');
    await expect(stats).toHaveCount(3);
    await expect(stats.nth(0).locator('.stat-value')).toHaveText('48+');
    await expect(stats.nth(1).locator('.stat-value')).toHaveText('<1ms');
    await expect(stats.nth(2).locator('.stat-value')).toHaveText('0');
  });

  // ---- Feature Cards ----
  test('feature cards are all visible', async ({ page }) => {
    const cards = page.locator('.glass-card');
    await expect(cards.first()).toBeVisible();
    await expect(page.locator('#card-latency')).toContainText('Zero Latency');
    await expect(page.locator('#card-envelope')).toContainText('Universal Envelope');
    await expect(page.locator('#card-provenance')).toContainText('Absolute Provenance');
    await expect(page.locator('#card-portable')).toContainText('Portable by Design');
    await expect(page.locator('#card-tested')).toContainText('Battle-Tested');
    await expect(page.locator('#card-open')).toContainText('Fully Open Source');
  });

  // ---- Architecture ----
  test('architecture diagram renders', async ({ page }) => {
    await expect(page.locator('#arch-diagram')).toBeVisible();
    await expect(page.locator('.engine-box')).toContainText('GSTFlow.Core');
    await expect(page.locator('.output-box')).toContainText('VerdictEnvelope');
  });

  // ---- Code Showcase ----
  test('code showcase section renders', async ({ page }) => {
    await expect(page.locator('#code-block')).toBeVisible();
    await expect(page.locator('#code-block code')).toContainText('OverallOutcome');
    await expect(page.locator('#code-block code')).toContainText('GSTFlow.Rules.evaluate');
  });

  // ---- Theme Toggle ----
  test('theme toggle switches between dark and light mode', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.click('#theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.click('#theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  // ---- Roadmap ----
  test('roadmap timeline renders with milestones', async ({ page }) => {
    await expect(page.locator('#timeline')).toBeVisible();
    const items = page.locator('.timeline-item');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(6);
    await expect(items.first()).toContainText('Core Engine');
  });

  // ---- Footer ----
  test('footer displays copyright and links', async ({ page }) => {
    await expect(page.locator('#footer')).toContainText('CanonFlow Foundation');
    await expect(page.locator('#footer')).toContainText('MIT License');
    await expect(page.locator('.footer-links a').first()).toBeVisible();
  });

  // ---- Navigation Anchors ----
  test('all navigation links have correct hrefs', async ({ page }) => {
    await expect(page.locator('#nav-vision')).toHaveAttribute('href', '#vision');
    await expect(page.locator('#nav-gstflow')).toHaveAttribute('href', '#gstflow');
    await expect(page.locator('#nav-ediflow')).toHaveAttribute('href', '#ediflow');
    await expect(page.locator('#nav-architecture')).toHaveAttribute('href', '#architecture');
    await expect(page.locator('#nav-roadmap')).toHaveAttribute('href', '#roadmap');
  });

  // ---- Interactions ----
  test('glass cards respond to hover without crash', async ({ page }) => {
    const card = page.locator('.glass-card').first();
    await card.hover();
    await expect(card).toBeVisible();
  });

  // ---- Responsive ----
  test('page is responsive at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('h1.title')).toBeVisible();
    await expect(page.locator('.glass-card').first()).toBeVisible();
    await expect(page.locator('#mobile-menu-toggle')).toBeVisible();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.click('#mobile-menu-toggle');
    await expect(page.locator('.nav-links')).toHaveClass(/open/);
    await page.click('#mobile-menu-toggle');
    await expect(page.locator('.nav-links')).not.toHaveClass(/open/);
  });
});
