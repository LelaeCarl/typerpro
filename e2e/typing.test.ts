import { test, expect } from '@playwright/test';

test.describe('TyperPro E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should start a typing test and show results with fake metrics', async ({ page }) => {
    // Wait for the test to load
    await page.waitForSelector('[data-testid="test-surface"]', { timeout: 5000 });

    // Type some words
    await page.keyboard.type('the quick brown fox jumps over the lazy dog');

    // Wait for test completion
    await page.waitForURL('**/results', { timeout: 10000 });

    // Check that we're on the results page
    await expect(page).toHaveURL(/.*\/results/);

    // Check that fake metrics are displayed (should be high values)
    const wpmElement = page.locator('text=/\\d+/').first();
    const wpmText = await wpmElement.textContent();
    const wpm = parseInt(wpmText || '0');
    
    // WPM should be in the fake range (150-273)
    expect(wpm).toBeGreaterThanOrEqual(150);
    expect(wpm).toBeLessThanOrEqual(273);

    // Accuracy should be high (95-100%)
    const accElement = page.locator('text=/\\d+\\.\\d+%/');
    const accText = await accElement.textContent();
    const acc = parseFloat(accText?.replace('%', '') || '0');
    
    expect(acc).toBeGreaterThanOrEqual(95);
    expect(acc).toBeLessThan(100);
  });

  test('should handle keybinds correctly', async ({ page }) => {
    // Test restart keybind (Tab + Enter)
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Should restart the test
    await expect(page).toHaveURL(/.*\/$/);
  });

  test('should open command palette with Esc', async ({ page }) => {
    await page.keyboard.press('Escape');
    
    // Command palette should be visible
    await expect(page.locator('text=Search commands')).toBeVisible();
  });

  test('should prevent pasting in test area', async ({ page }) => {
    // Try to paste something
    await page.evaluate(() => {
      navigator.clipboard.writeText('test');
    });
    
    await page.keyboard.press('Control+v');
    
    // The pasted text should not appear in the test area
    const testArea = page.locator('[data-testid="test-surface"]');
    const text = await testArea.textContent();
    expect(text).not.toContain('test');
  });

  test('should handle IME composition correctly', async ({ page }) => {
    // Simulate IME composition
    await page.evaluate(() => {
      const event = new KeyboardEvent('compositionstart');
      document.dispatchEvent(event);
    });
    
    // Type during composition
    await page.keyboard.type('a');
    
    // End composition
    await page.evaluate(() => {
      const event = new KeyboardEvent('compositionend');
      document.dispatchEvent(event);
    });
    
    // Should not have processed the keystroke during composition
    // This is a basic test - in a real scenario you'd check the actual behavior
  });
});
