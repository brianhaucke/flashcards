import { test, expect } from '@playwright/test';

test.describe('Study Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/study');
  });

  test('should display category selection page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '📚 Choose a Category' })).toBeVisible();
    await expect(page.getByText('Select a category to study Spanish vocabulary')).toBeVisible();
    
    // Check all categories are displayed
    await expect(page.getByRole('button', { name: '🐾 Animals' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🍎 Food' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🏃 Verbs' })).toBeVisible();
    
    // Check back button
    await expect(page.getByRole('button', { name: '← Back to Home' })).toBeVisible();
  });

  test('should navigate to study session when category is selected', async ({ page }) => {
    await page.getByRole('button', { name: '🐾 Animals' }).click();
    await expect(page).toHaveURL('/study/animals');
    await expect(page.getByRole('heading', { name: '📚 Studying: Animals' })).toBeVisible();
  });

  test('should navigate back to home when back button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: '← Back to Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test.describe('Study Session', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/study/animals');
    });

    test('should display study session interface', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '📚 Studying: Animals' })).toBeVisible();
      await expect(page.getByText('1 of 5')).toBeVisible(); // Progress indicator
      
      // Check stats display
      await expect(page.getByText('✅')).toBeVisible();
      await expect(page.getByText('❌')).toBeVisible();
      
      // Check flashcard is displayed
      await expect(page.getByText('el gato')).toBeVisible(); // Spanish word
      await expect(page.getByText('Click the card to flip and see the translation')).toBeVisible();
    });

    test('should flip card when clicked', async ({ page }) => {
      // Click the card to flip it
      await page.click('[style*="cursor: pointer"]');
      
      // Check that English translation is shown
      await expect(page.getByText('the cat')).toBeVisible();
      
      // Check that answer buttons appear
      await expect(page.getByRole('button', { name: '✅ I got it right' })).toBeVisible();
      await expect(page.getByRole('button', { name: '❌ I got it wrong' })).toBeVisible();
    });

    test('should handle correct answer', async ({ page }) => {
      // Flip the card
      await page.click('[style*="cursor: pointer"]');
      await expect(page.getByText('the cat')).toBeVisible();
      
      // Click correct answer
      await page.getByRole('button', { name: '✅ I got it right' }).click();
      
      // Should move to next card
      await expect(page.getByText('2 of 5')).toBeVisible();
      await expect(page.getByText('el perro')).toBeVisible(); // Next Spanish word
    });

    test('should handle incorrect answer', async ({ page }) => {
      // Flip the card
      await page.click('[style*="cursor: pointer"]');
      await expect(page.getByText('the cat')).toBeVisible();
      
      // Click incorrect answer
      await page.getByRole('button', { name: '❌ I got it wrong' }).click();
      
      // Should move to next card
      await expect(page.getByText('2 of 5')).toBeVisible();
      await expect(page.getByText('el perro')).toBeVisible(); // Next Spanish word
    });

    test('should complete study session and show completion screen', async ({ page }) => {
    // Go through all cards quickly
    for (let i = 0; i < 5; i++) {
      await page.locator('[style*="cursor: pointer"]').first().click();
      await page.getByRole('button', { name: '✅ I got it right' }).click();
      await page.waitForTimeout(400); // Wait for transition
    }
      
      // Check completion screen
      await expect(page.getByRole('heading', { name: '🎉 Study Session Complete!' })).toBeVisible();
      await expect(page.getByText('Correct: 5')).toBeVisible();
      await expect(page.getByText('Incorrect: 0')).toBeVisible();
      await expect(page.getByText('Accuracy: 100%')).toBeVisible();
    });

    test('should show redo button when there are incorrect answers', async ({ page }) => {
    // Answer first card incorrectly
    await page.locator('[style*="cursor: pointer"]').first().click();
    await page.getByRole('button', { name: '❌ I got it wrong' }).click();
    await page.waitForTimeout(400);
    
    // Answer remaining cards correctly
    for (let i = 1; i < 5; i++) {
      await page.locator('[style*="cursor: pointer"]').first().click();
      await page.getByRole('button', { name: '✅ I got it right' }).click();
      await page.waitForTimeout(400);
    }
      
      // Check completion screen shows redo option
      await expect(page.getByRole('button', { name: '🔄 Redo Wrong Cards (1)' })).toBeVisible();
    });

    test('should navigate back to categories', async ({ page }) => {
      await page.getByRole('button', { name: '← Back to Categories' }).click();
      await expect(page).toHaveURL('/study');
    });

    test('should navigate to home', async ({ page }) => {
      await page.getByRole('button', { name: '🏠 Home' }).click();
      await expect(page).toHaveURL('/');
    });
  });
});
