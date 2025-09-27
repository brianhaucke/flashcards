import { test, expect } from '@playwright/test';

test.describe('Redo Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Set up incorrect cards in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      const incorrectCards = [
        { category: 'animals', spanish: 'el gato', english: 'the cat', quiz: { type: 'multiple-choice', options: [] } },
        { category: 'animals', spanish: 'el perro', english: 'the dog', quiz: { type: 'multiple-choice', options: [] } }
      ];
      localStorage.setItem('incorrectCards', JSON.stringify(incorrectCards));
    });

    await page.goto('/redo');
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
    await expect(page.getByText('el gato')).toBeVisible();
    
    // Flip the card
    await page.getByTestId('flashcard').click();
    await expect(page.getByText('the cat')).toBeVisible();
    
    // Click correct answer
    await page.getByRole('button', { name: '✅ I got it right' }).click();
    
    // Should move to the next card
    await expect(page.getByText('el perro')).toBeVisible();
  });

  test('should handle incorrect answer and keep card in redo list', async ({ page }) => {
    await expect(page.getByText('el gato')).toBeVisible();
    
    // Flip the card
    await page.getByTestId('flashcard').click();
    await expect(page.getByText('the cat')).toBeVisible();
    
    // Click incorrect answer
    await page.getByRole('button', { name: '❌ I got it wrong' }).click();
    
    // Should move to the next card
    await expect(page.getByText('el perro')).toBeVisible();
    
    // Go back and check if the first card is still there
    await page.goto('/redo');
    await expect(page.getByText('el gato')).toBeVisible();
  });

  test('should show continue redo button when cards remain', async ({ page }) => {
    await expect(page.getByText('el gato')).toBeVisible();
    
    // Answer first card incorrectly
    await page.getByTestId('flashcard').click();
    await page.getByRole('button', { name: '❌ I got it wrong' }).click();
    await page.waitForTimeout(400);
    
    // Should show "Continue Redo" on completion page
    await expect(page.getByRole('button', { name: '🔄 Continue Redo (1)' })).toBeVisible();
  });

  test('should show completion screen when all cards are answered', async ({ page }) => {
    // Answer both cards
    await page.getByTestId('flashcard').click();
    await page.getByRole('button', { name: '✅ I got it right' }).click();
    await page.waitForTimeout(600);
    
    await page.getByTestId('flashcard').click();
    await page.getByRole('button', { name: '✅ I got it right' }).click();
    await page.waitForTimeout(600);

    // Should show completion screen
    await expect(page.getByRole('heading', { name: '🎉 Redo Session Complete!' })).toBeVisible();
  });

  test('should navigate to study mode from completion screen', async ({ page }) => {
    // Complete the session
    for (let i = 0; i < 2; i++) {
      await page.getByTestId('flashcard').click();
      await page.getByRole('button', { name: '✅ I got it right' }).click();
    }
    
    // Navigate to study
    await page.getByRole('button', { name: '📚 Choose Another Category' }).click();
    await expect(page).toHaveURL('/study');
  });

  test('should navigate to home from completion screen', async ({ page }) => {
    // Complete the session
    for (let i = 0; i < 2; i++) {
      await page.getByTestId('flashcard').click();
      await page.getByRole('button', { name: '✅ I got it right' }).click();
    }
    
    // Navigate to home
    await page.getByRole('button', { name: '🏠 Back to Home' }).click();
    await expect(page).toHaveURL('/');
  });
});
