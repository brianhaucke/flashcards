import { test, expect } from '@playwright/test';

// PRIORITY 1 TESTS - Must run every time, highly reliable
// These test core functionality that should always work

test.describe('Priority 1 - Core Functionality', () => {
  test('should display homepage correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading
    await expect(page.getByRole('heading', { name: '🇪🇸 Spanish Flashcards' })).toBeVisible();
    
    // Check description
    await expect(page.getByText('Learn Spanish vocabulary with interactive flashcards and quizzes')).toBeVisible();
    
    // Check main navigation buttons
    await expect(page.getByRole('button', { name: '📚 Study Mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🧠 Quiz Mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: '📊 Statistics' })).toBeVisible();
  });

  test('should navigate to study mode', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '📚 Study Mode' }).click();
    await expect(page).toHaveURL('/study');
    await expect(page.getByRole('heading', { name: '📚 Choose a Category' })).toBeVisible();
  });

  test('should navigate to quiz mode', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '🧠 Quiz Mode' }).click();
    await expect(page).toHaveURL('/quiz');
    await expect(page.getByRole('heading', { name: '🧠 Quiz Mode' })).toBeVisible();
  });

  test('should display category selection in study mode', async ({ page }) => {
    await page.goto('/study');
    
    // Check categories are displayed
    await expect(page.getByRole('button', { name: '🐾 Animals' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🍎 Food' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🏃 Verbs' })).toBeVisible();
  });

  test('should start study session with animals', async ({ page }) => {
    await page.goto('/study');
    await page.getByRole('button', { name: '🐾 Animals' }).click();
    await expect(page).toHaveURL('/study/animals');
    
    // Check study session interface
    await expect(page.getByRole('heading', { name: '📚 Studying: Animals' })).toBeVisible();
    await expect(page.getByText('1 of 5')).toBeVisible();
    
    // Check stats display
    await expect(page.getByText('✅')).toBeVisible();
    await expect(page.getByText('❌')).toBeVisible();
  });

  test('should display quiz selection page', async ({ page }) => {
    await page.goto('/quiz');
    
    // Check categories are displayed
    await expect(page.getByRole('button', { name: '🐾 Animals' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🍎 Food' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🏃 Verbs' })).toBeVisible();
  });

  test('should start multiple choice quiz', async ({ page }) => {
    await page.goto('/quiz');
    await page.getByRole('button', { name: '🐾 Animals' }).click();
    await page.getByText('Multiple Choice').click();
    await page.getByRole('button', { name: '🚀 Start Quiz' }).click();
    
    // Check quiz interface
    await expect(page.getByRole('heading', { name: '🧠 Multiple Choice Quiz' })).toBeVisible();
    await expect(page.getByText('Category: Animals')).toBeVisible();
    await expect(page.getByText('1 of 5')).toBeVisible();
  });

  test('should handle basic card interaction', async ({ page }) => {
    await page.goto('/study/animals');
    
    // Click on card to flip it
    await page.getByTestId('flashcard-card').click();
    
    // Check that answer buttons appear
    await expect(page.getByRole('button', { name: '✅ I got it right' })).toBeVisible();
    await expect(page.getByRole('button', { name: '❌ I got it wrong' })).toBeVisible();
  });

  test('should handle basic quiz interaction', async ({ page }) => {
    await page.goto('/quiz');
    await page.getByRole('button', { name: '🐾 Animals' }).click();
    await page.getByText('Multiple Choice').click();
    await page.getByRole('button', { name: '🚀 Start Quiz' }).click();
    
    // Click on a quiz option
    const options = page.locator('button').filter({ hasText: /the (cat|dog|bird|fish|horse|house|cow|pig|sheep)/ });
    await expect(options).toHaveCount(4);
    await options.first().click();
  });

  test('should persist basic localStorage data', async ({ page }) => {
    // Set up some incorrect cards
    await page.goto('/study/animals');
    await page.getByTestId('flashcard-card').click();
    await page.getByRole('button', { name: '❌ I got it wrong' }).click();
    
    // Wait for the next card to appear before proceeding
    await expect(page.getByText('2 of 5')).toBeVisible();
    
    // Complete session
    for (let i = 2; i <= 5; i++) {
      await page.getByTestId('flashcard-card').click();
      await page.getByRole('button', { name: '✅ I got it right' }).click();
      if (i < 5) {
        await expect(page.getByText(`${i + 1} of 5`)).toBeVisible();
      }
    }

    // On completion screen, the "Redo" button should be visible
    await expect(page.getByRole('button', { name: '🔄 Redo Wrong Cards (1)' })).toBeVisible();
    
    // Check that redo button appears on home
    await page.goto('/');
    await expect(page.getByRole('button', { name: '🔄 Redo Wrong Cards' })).toBeVisible();
  });
});
