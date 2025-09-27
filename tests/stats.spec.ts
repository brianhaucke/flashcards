import { test, expect } from '@playwright/test';

test.describe('Statistics Tracking', () => {
  // Clear stats before each test to ensure a clean slate
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display empty state on stats page initially', async ({ page }) => {
    await page.goto('/stats');
    await expect(page.getByRole('heading', { name: '📊 Statistics' })).toBeVisible();
    await expect(page.getByText('No stats yet.')).toBeVisible();
    await expect(page.getByText('Total Studied')).toBeVisible();
    await expect(page.getByText('0', { exact: true })).toHaveCount(3); // Studied, Correct, Incorrect
  });

  test('should update stats after a study session', async ({ page }) => {
    // Complete a study session with 1 incorrect, 4 correct
    await page.goto('/study/animals');
    
    // Card 1: Incorrect
    await page.getByTestId('flashcard-card').click();
    await page.getByRole('button', { name: '❌ I got it wrong' }).click();
    await expect(page.getByText('2 of 5')).toBeVisible();

    // Cards 2-5: Correct
    for (let i = 2; i <= 5; i++) {
      await page.getByTestId('flashcard-card').click();
      await page.getByRole('button', { name: '✅ I got it right' }).click();
      if (i < 5) {
        await expect(page.getByText(`${i + 1} of 5`)).toBeVisible();
      }
    }
    
    // Navigate to stats page and check
    await page.goto('/stats');
    
    await expect(page.getByRole('heading', { name: 'Animals' })).toBeVisible();
    await expect(page.getByText('Studied: 5')).toBeVisible();
    await expect(page.getByText('Correct: 4')).toBeVisible();
    await expect(page.getByText('Incorrect: 1')).toBeVisible();
    await expect(page.getByText('Accuracy: 80%')).toBeVisible();

    // Check summary stats
    await expect(page.getByText('Total Studied').locator('..')).toContainText('5');
    await expect(page.getByText('Total Correct').locator('..')).toContainText('4');
    await expect(page.getByText('Total Incorrect').locator('..')).toContainText('1');
    await expect(page.getByText('Overall Accuracy').locator('..')).toContainText('80%');
  });

  test('should update stats after a quiz session', async ({ page }) => {
    await page.goto('/quiz/food?type=multiple-choice');
    
    // Answer all 5 questions correctly
    for (let i = 0; i < 5; i++) {
        const card = page.locator('.quiz-card');
        const question = await card.locator('h2').innerText();
        // This is a bit of a hack since we don't know the answer, but we can find it
        // In a real scenario, you might have a data mapping or a more robust way to get answers
        const correctOption = page.getByTestId(`correct-option-${question}`);
        await correctOption.click();
        await page.getByRole('button', { name: 'Next' }).click();
    }
    
    // On completion screen, navigate to stats
    await expect(page.getByRole('heading', { name: '🎉 Quiz Complete!' })).toBeVisible();
    await page.goto('/stats');

    await expect(page.getByRole('heading', { name: 'Food' })).toBeVisible();
    await expect(page.getByText('Studied: 5')).toBeVisible();
    await expect(page.getByText('Correct: 5')).toBeVisible();
    await expect(page.getByText('Incorrect: 0')).toBeVisible();
    await expect(page.getByText('Accuracy: 100%')).toBeVisible();
  });

  test('should reset stats correctly', async ({ page }) => {
    // First, add some stats
    await page.goto('/study/verbs');
    await page.getByTestId('flashcard-card').click();
    await page.getByRole('button', { name: '✅ I got it right' }).click();
    
    // Go to stats page and verify they are there
    await page.goto('/stats');
    await expect(page.getByRole('heading', { name: 'Verbs' })).toBeVisible();

    // Reset stats
    await page.getByRole('button', { name: 'Reset All Stats' }).click();

    // Verify stats are gone
    await expect(page.getByRole('heading', { name: 'Verbs' })).not.toBeVisible();
    await expect(page.getByText('No stats yet.')).toBeVisible();
  });
});
