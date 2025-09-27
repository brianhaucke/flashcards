import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main title and navigation buttons', async ({ page }) => {
    // Check main title
    await expect(page.getByRole('heading', { name: '🇪🇸 Spanish Flashcards' })).toBeVisible();
    
    // Check subtitle
    await expect(page.getByText('Learn Spanish vocabulary with interactive flashcards and quizzes')).toBeVisible();
    
    // Check navigation buttons
    await expect(page.getByRole('button', { name: '📚 Study Mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🧠 Quiz Mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: '📊 Statistics' })).toBeVisible();
  });

  test('should navigate to study mode when Study Mode button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: '📚 Study Mode' }).click();
    await expect(page).toHaveURL('/study');
    await expect(page.getByRole('heading', { name: '📚 Choose a Category' })).toBeVisible();
  });

  test('should navigate to quiz mode when Quiz Mode button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: '🧠 Quiz Mode' }).click();
    await expect(page).toHaveURL('/quiz');
    await expect(page.getByRole('heading', { name: '🧠 Quiz Mode' })).toBeVisible();
  });

  test('should navigate to statistics when Statistics button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '📊 Statistics' }).click();
    await expect(page).toHaveURL('/stats');
    await expect(page.getByRole('heading', { name: '📊 Statistics' })).toBeVisible();
  });

  test('should not show Redo Wrong Cards button initially', async ({ page }) => {
    await expect(page.getByRole('button', { name: '🔄 Redo Wrong Cards' })).not.toBeVisible();
  });

  test('should show Redo Wrong Cards button when incorrect cards exist', async ({ page }) => {
    // Simulate having incorrect cards in localStorage
    await page.evaluate(() => {
      localStorage.setItem('incorrectCards', JSON.stringify([
        { category: 'animals', spanish: 'el gato', english: 'the cat', quiz: { type: 'multiple-choice', options: [] } }
      ]));
    });
    
    // Reload page to trigger useEffect
    await page.reload();
    
    await expect(page.getByRole('button', { name: '🔄 Redo Wrong Cards' })).toBeVisible();
  });

  test('should navigate to redo page when Redo Wrong Cards button is clicked', async ({ page }) => {
    // Set up incorrect cards
    await page.evaluate(() => {
      localStorage.setItem('incorrectCards', JSON.stringify([
        { category: 'animals', spanish: 'el gato', english: 'the cat', quiz: { type: 'multiple-choice', options: [] } }
      ]));
    });
    
    await page.reload();
    await page.getByRole('button', { name: '🔄 Redo Wrong Cards' }).click();
    
    await expect(page).toHaveURL('/redo');
    await expect(page.getByRole('heading', { name: '🔄 Redo Wrong Cards' })).toBeVisible();
  });
});
