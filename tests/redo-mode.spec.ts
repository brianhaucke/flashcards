import { test, expect } from '@playwright/test';

test.describe('Redo Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Set up incorrect cards in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('incorrectCards', JSON.stringify([
        { category: 'animals', spanish: 'el gato', english: 'the cat', quiz: { type: 'multiple-choice', options: [] } },
        { category: 'animals', spanish: 'el perro', english: 'the dog', quiz: { type: 'multiple-choice', options: [] } }
      ]));
    });
  });

  test('should navigate to redo page from home', async ({ page }) => {
    await page.reload(); // Reload to trigger useEffect
    await page.getByRole('button', { name: '🔄 Redo Wrong Cards' }).click();
    await expect(page).toHaveURL('/redo');
  });

  test('should display redo session interface', async ({ page }) => {
    await page.goto('/redo');
    
    await expect(page.getByRole('heading', { name: '🔄 Redo Wrong Cards' })).toBeVisible();
    await expect(page.getByText('1 of 2')).toBeVisible(); // Progress indicator
    
    // Check stats display
    await expect(page.getByText('✅')).toBeVisible();
    await expect(page.getByText('❌')).toBeVisible();
    
    // Check first incorrect card is displayed
    await expect(page.getByText('el gato')).toBeVisible();
    await expect(page.getByText('Click the card to flip and see the translation')).toBeVisible();
  });

  test('should handle correct answer and remove card from redo list', async ({ page }) => {
    await page.goto('/redo');
    
    // Flip the card
    await page.click('[style*="cursor: pointer"]');
    await expect(page.getByText('the cat')).toBeVisible();
    
    // Click correct answer
    await page.getByRole('button', { name: '✅ I got it right' }).click();
    
    // Should move to next card (only 1 remaining)
    await expect(page.getByText('1 of 1')).toBeVisible();
    await expect(page.getByText('el perro')).toBeVisible(); // Next Spanish word
  });

  test('should handle incorrect answer and keep card in redo list', async ({ page }) => {
    await page.goto('/redo');
    
    // Flip the card
    await page.click('[style*="cursor: pointer"]');
    await expect(page.getByText('the cat')).toBeVisible();
    
    // Click incorrect answer
    await page.getByRole('button', { name: '❌ I got it wrong' }).click();
    
    // Should move to next card
    await expect(page.getByText('2 of 2')).toBeVisible();
    await expect(page.getByText('el perro')).toBeVisible(); // Next Spanish word
  });

  test('should complete redo session and show completion screen', async ({ page }) => {
    await page.goto('/redo');
    
    // Click on the Spanish text to flip the card
    await page.locator('text=el gato').first().click();
    await page.waitForTimeout(1000);
    
    // Answer the card correctly
    await page.getByRole('button', { name: '✅ I got it right' }).click();
    await page.waitForTimeout(600);
    
    // Check completion screen
    await expect(page.getByRole('heading', { name: '🎉 Redo Session Complete!' })).toBeVisible();
    await expect(page.getByText('Correct: 1')).toBeVisible();
    await expect(page.getByText('Incorrect: 0')).toBeVisible();
    await expect(page.getByText('Remaining wrong cards: 1')).toBeVisible();
  });

  test('should show continue redo button when cards remain', async ({ page }) => {
    await page.goto('/redo');
    
    // Answer first card incorrectly
    await page.click('[style*="cursor: pointer"]');
    await page.getByRole('button', { name: '❌ I got it wrong' }).click();
    await page.waitForTimeout(400);
    
    // Answer second card correctly
    await page.click('[style*="cursor: pointer"]');
    await page.getByRole('button', { name: '✅ I got it right' }).click();
    await page.waitForTimeout(400);
    
    // Check completion screen shows continue option
    await expect(page.getByRole('button', { name: '🔄 Continue Redo' })).toBeVisible();
    await expect(page.getByText('Remaining wrong cards: 1')).toBeVisible();
  });

  test('should clear all wrong cards when clear button is clicked', async ({ page }) => {
    await page.goto('/redo');
    
    // Click clear all wrong cards button
    await page.getByRole('button', { name: '🗑️ Clear All Wrong Cards' }).click();
    
    // Should show no wrong cards message
    await expect(page.getByRole('heading', { name: '🎉 No Wrong Cards!' })).toBeVisible();
    await expect(page.getByText("You don't have any cards marked as incorrect. Great job!")).toBeVisible();
  });

  test('should show no wrong cards message when localStorage is empty', async ({ page }) => {
    // Clear localStorage
    await page.evaluate(() => {
      localStorage.removeItem('incorrectCards');
    });
    
    await page.goto('/redo');
    
    await expect(page.getByRole('heading', { name: '🎉 No Wrong Cards!' })).toBeVisible();
    await expect(page.getByText("You don't have any cards marked as incorrect. Great job!")).toBeVisible();
  });

  test('should navigate to study mode from completion screen', async ({ page }) => {
    await page.goto('/redo');
    
    // Complete the session
    for (let i = 0; i < 2; i++) {
      // Try different Spanish text options
      const spanishTexts = ['el gato', 'el perro'];
      let clicked = false;
      
      for (const text of spanishTexts) {
        const count = await page.locator(`text=${text}`).count();
        if (count > 0) {
          await page.locator(`text=${text}`).first().click();
          clicked = true;
          break;
        }
      }
      
      if (!clicked) {
        // Fall back to card selector
        await page.locator('div[style*="transform: rotateY"]').first().click();
      }
      
      await page.getByRole('button', { name: '✅ I got it right' }).click();
      await page.waitForTimeout(600);
    }
    
    // Wait for completion screen to appear
    await page.waitForTimeout(1000);
    
    // Click study new category
    await page.getByRole('button', { name: '📚 Study New Category' }).click();
    await expect(page).toHaveURL('/study');
  });

  test('should navigate to home from completion screen', async ({ page }) => {
    await page.goto('/redo');
    
    // Complete the session
    for (let i = 0; i < 2; i++) {
      // Try different Spanish text options
      const spanishTexts = ['el gato', 'el perro'];
      let clicked = false;
      
      for (const text of spanishTexts) {
        const count = await page.locator(`text=${text}`).count();
        if (count > 0) {
          await page.locator(`text=${text}`).first().click();
          clicked = true;
          break;
        }
      }
      
      if (!clicked) {
        // Fall back to card selector
        await page.locator('div[style*="transform: rotateY"]').first().click();
      }
      
      await page.getByRole('button', { name: '✅ I got it right' }).click();
      await page.waitForTimeout(600);
    }
    
    // Wait for completion screen to appear
    await page.waitForTimeout(1000);
    
    // Click back to home
    await page.getByRole('button', { name: '🏠 Back to Home' }).click();
    await expect(page).toHaveURL('/');
  });
});
