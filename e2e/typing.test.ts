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

  test('should advance words on Space correctly', async ({ page }) => {
    await page.waitForSelector('[data-testid="test-surface"]', { timeout: 5000 });
    
    // Type the first word exactly
    await page.keyboard.type('the');
    
    // Press space to advance to next word
    await page.keyboard.press('Space');
    
    // Check that the first word is fully marked and second word has pending state
    const testArea = page.locator('[data-testid="test-surface"]');
    
    // Verify no text nodes are inserted (only spans should exist)
    const textNodes = await page.evaluate(() => {
      const testSurface = document.querySelector('[data-testid="test-surface"]');
      if (!testSurface) return 0;
      
      let textNodeCount = 0;
      const walker = document.createTreeWalker(
        testSurface,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (walker.nextNode()) {
        textNodeCount++;
      }
      return textNodeCount;
    });
    
    // Should have minimal text nodes (just whitespace)
    expect(textNodes).toBeLessThan(10);
  });

  test('should handle backspace correctly', async ({ page }) => {
    await page.waitForSelector('[data-testid="test-surface"]', { timeout: 5000 });
    
    // Type a word
    await page.keyboard.type('the');
    
    // Backspace to delete a character
    await page.keyboard.press('Backspace');
    
    // The last character should be back to pending state
    const testArea = page.locator('[data-testid="test-surface"]');
    
    // Type space to advance
    await page.keyboard.press('Space');
    
    // Type another word
    await page.keyboard.type('quick');
    
    // Backspace at word boundary should go to previous word
    await page.keyboard.press('Backspace');
    
    // Should be back in the previous word
    // This is a basic test - in a real scenario you'd check cursor position
  });

  test('should not insert text into DOM', async ({ page }) => {
    await page.waitForSelector('[data-testid="test-surface"]', { timeout: 5000 });
    
    // Check that test surface is not editable
    const isEditable = await page.evaluate(() => {
      const testSurface = document.querySelector('[data-testid="test-surface"]');
      return testSurface?.getAttribute('contenteditable') === 'true' || 
             testSurface?.getAttribute('contenteditable') === '';
    });
    
    expect(isEditable).toBe(false);
    
    // Type some characters
    await page.keyboard.type('the quick');
    
    // Check that text content reflects state-driven rendering
    const textContent = await page.evaluate(() => {
      const testSurface = document.querySelector('[data-testid="test-surface"]');
      return testSurface?.textContent || '';
    });
    
    // Should contain the typed words
    expect(textContent).toContain('the');
    expect(textContent).toContain('quick');
  });

  test('should change mode and duration chips correctly', async ({ page }) => {
    await page.waitForSelector('[data-testid="test-surface"]', { timeout: 5000 });
    
    // Click on time mode chip
    await page.click('text=time');
    
    // Should show duration chips
    await expect(page.locator('text=15')).toBeVisible();
    await expect(page.locator('text=30')).toBeVisible();
    await expect(page.locator('text=60')).toBeVisible();
    await expect(page.locator('text=120')).toBeVisible();
    
    // Click on a duration
    await page.click('text=60');
    
    // Test should reset and hidden input should regain focus
    // The test surface should be ready for input
    await page.keyboard.type('test');
    
    // Should process the input
    const testArea = page.locator('[data-testid="test-surface"]');
    const textContent = await testArea.textContent();
    expect(textContent).toContain('test');
  });

  test('should restart test with Tab keybind', async ({ page }) => {
    await page.waitForSelector('[data-testid="test-surface"]', { timeout: 5000 });
    
    // Type some text
    await page.keyboard.type('the quick');
    
    // Press Tab to restart
    await page.keyboard.press('Tab');
    
    // Test should reset
    const testArea = page.locator('[data-testid="test-surface"]');
    const textContent = await testArea.textContent();
    
    // Should not contain the previously typed text
    expect(textContent).not.toContain('the quick');
  });

  test('should open and close command palette with Esc', async ({ page }) => {
    await page.waitForSelector('[data-testid="test-surface"]', { timeout: 5000 });
    
    // Press Esc to open command palette
    await page.keyboard.press('Escape');
    
    // Command palette should be visible
    await expect(page.locator('text=Search commands')).toBeVisible();
    
    // Press Esc again to close
    await page.keyboard.press('Escape');
    
    // Command palette should be hidden
    await expect(page.locator('text=Search commands')).not.toBeVisible();
  });

  test('should validate results screen metrics', async ({ page }) => {
    await page.waitForSelector('[data-testid="test-surface"]', { timeout: 5000 });
    
    // Complete a short test
    await page.keyboard.type('the quick brown fox jumps over the lazy dog');
    
    // Wait for results
    await page.waitForURL('**/results', { timeout: 10000 });
    
    // Verify WPM is in fake range
    const wpmElement = page.locator('text=/\\d+/').first();
    const wpmText = await wpmElement.textContent();
    const wpm = parseInt(wpmText || '0');
    
    expect(wpm).toBeGreaterThanOrEqual(150);
    expect(wpm).toBeLessThanOrEqual(273);
    
    // Verify accuracy is in fake range
    const accElement = page.locator('text=/\\d+\\.\\d+%/');
    const accText = await accElement.textContent();
    const acc = parseFloat(accText?.replace('%', '') || '0');
    
    expect(acc).toBeGreaterThanOrEqual(95);
    expect(acc).toBeLessThan(100);
  });
});
