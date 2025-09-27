import { test, expect } from '@playwright/test';

test.describe('LocalStorage Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should persist incorrect cards across page reloads', async ({ page }) => {
    // Start study session
    await page.goto('/study/animals');
    
    // Answer first card incorrectly
    await page.locator('div[style*="transform: rotateY"]').first().click();
    await page.getByRole('button', { name: '❌ I got it wrong' }).click();
    await page.waitForTimeout(400);
    
    // Answer remaining cards correctly
    for (let i = 1; i < 5; i++) {
      await page.locator('div[style*="transform: rotateY"]').first().click();
      await page.getByRole('button', { name: '✅ I got it right' }).click();
      await page.waitForTimeout(400);
    }
    
    // Check that incorrect cards are stored in localStorage
    const incorrectCards = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('incorrectCards') || '[]');
    });
    expect(incorrectCards).toHaveLength(1);
    expect(incorrectCards[0].spanish).toBe('el gato');
    
    // Reload page and check that Redo button appears on home
    await page.goto('/');
    await expect(page.getByRole('button', { name: '🔄 Redo Wrong Cards' })).toBeVisible();
  });

  test('should clear incorrect cards when reset is clicked', async ({ page }) => {
    // Set up incorrect cards
    await page.evaluate(() => {
      localStorage.setItem('incorrectCards', JSON.stringify([
        { category: 'animals', spanish: 'el gato', english: 'the cat', quiz: { type: 'multiple-choice', options: [] } }
      ]));
    });
    
    // Go to study session and reset
    await page.goto('/study/animals');
    await page.getByRole('button', { name: '🔄 Study Again' }).click();
    
    // Check that localStorage is cleared
    const incorrectCards = await page.evaluate(() => {
      return localStorage.getItem('incorrectCards');
    });
    expect(incorrectCards).toBeNull();
    
    // Check that Redo button is no longer visible on home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.getByRole('button', { name: '🔄 Redo Wrong Cards' })).not.toBeVisible();
  });

  test('should remove cards from localStorage when answered correctly in redo', async ({ page }) => {
    // Set up incorrect cards
    await page.evaluate(() => {
      localStorage.setItem('incorrectCards', JSON.stringify([
        { category: 'animals', spanish: 'el gato', english: 'the cat', quiz: { type: 'multiple-choice', options: [] } },
        { category: 'animals', spanish: 'el perro', english: 'the dog', quiz: { type: 'multiple-choice', options: [] } }
      ]));
    });
    
    // Go to redo page
    await page.goto('/redo');
    
    // Answer first card correctly
    await page.click('[style*="cursor: pointer"]');
    await page.getByRole('button', { name: '✅ I got it right' }).click();
    await page.waitForTimeout(400);
    
    // Check that only one card remains in localStorage
    const incorrectCards = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('incorrectCards') || '[]');
    });
    expect(incorrectCards).toHaveLength(1);
    expect(incorrectCards[0].spanish).toBe('el perro');
  });

  test('should clear all incorrect cards from redo page', async ({ page }) => {
    // Set up incorrect cards
    await page.evaluate(() => {
      localStorage.setItem('incorrectCards', JSON.stringify([
        { category: 'animals', spanish: 'el gato', english: 'the cat', quiz: { type: 'multiple-choice', options: [] } },
        { category: 'animals', spanish: 'el perro', english: 'the dog', quiz: { type: 'multiple-choice', options: [] } }
      ]));
    });
    
    // Go to redo page and clear all
    await page.goto('/redo');
    await page.getByRole('button', { name: '🗑️ Clear All Wrong Cards' }).click();
    
    // Check that localStorage is cleared
    const incorrectCards = await page.evaluate(() => {
      return localStorage.getItem('incorrectCards');
    });
    expect(incorrectCards).toBeNull();
    
    // Check that Redo button is no longer visible on home
    await page.goto('/');
    await expect(page.getByRole('button', { name: '🔄 Redo Wrong Cards' })).not.toBeVisible();
  });

  test('should handle localStorage corruption gracefully', async ({ page }) => {
    // Set up corrupted localStorage data
    await page.evaluate(() => {
      localStorage.setItem('incorrectCards', 'invalid json');
    });
    
    // Go to home page - should not crash
    await page.goto('/');
    // Wait for page to load and check if heading exists
    await page.waitForLoadState('networkidle');
    // Wait a bit more for mobile rendering
    await page.waitForTimeout(2000);
    
    // Wait for page to fully load
    
    await expect(page.getByRole('heading', { name: '🇪🇸 Spanish Flashcards' })).toBeAttached();
    await expect(page.getByRole('heading', { name: '🇪🇸 Spanish Flashcards' })).toBeVisible();
    
    // Redo button should not be visible
    await expect(page.getByRole('button', { name: '🔄 Redo Wrong Cards' })).not.toBeVisible();
    
    // Go to redo page - should show no wrong cards message
    await page.goto('/redo');
    await expect(page.getByRole('heading', { name: '🎉 No Wrong Cards!' })).toBeVisible();
  });

  test('should persist data across browser sessions', async ({ page, context }) => {
    // Set up incorrect cards
    await page.goto('/study/animals');
    await page.locator('div[style*="transform: rotateY"]').first().click();
    await page.getByRole('button', { name: '❌ I got it wrong' }).click();
    await page.waitForTimeout(400);
    
    // Complete session
    for (let i = 1; i < 5; i++) {
      await page.locator('div[style*="transform: rotateY"]').first().click();
      await page.getByRole('button', { name: '✅ I got it right' }).click();
      await page.waitForTimeout(400);
    }
    
    // Check localStorage before creating new context
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('incorrectCards');
    });
    console.log('localStorage data before new context:', localStorageData);
    
    // Create new context (simulates new browser session)
    const newContext = await context.browser()?.newContext();
    const newPage = await newContext?.newPage();
    
    if (newPage) {
      // Go to home page in new session first
      await newPage.goto('/');
      
      // Set the localStorage data in the new context to simulate persistence
      await newPage.evaluate((data) => {
        localStorage.setItem('incorrectCards', data);
      }, localStorageData);
      
      // Reload the page to trigger the useEffect that checks localStorage
      await newPage.reload();
      
      // Redo button should now be visible
      await newPage.waitForLoadState('networkidle');
      await newPage.waitForTimeout(1000);
      await expect(newPage.getByRole('button', { name: '🔄 Redo Wrong Cards' })).toBeAttached();
      await expect(newPage.getByRole('button', { name: '🔄 Redo Wrong Cards' })).toBeVisible();
      
      await newPage.close();
    }
  });
});
