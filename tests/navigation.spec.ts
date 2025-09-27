import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between all main pages', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '🇪🇸 Spanish Flashcards' })).toBeVisible();
    
    // Navigate to study mode
    await page.getByRole('button', { name: '📚 Study Mode' }).click();
    await expect(page).toHaveURL('/study');
    await expect(page.getByRole('heading', { name: '📚 Choose a Category' })).toBeVisible();
    
    // Navigate back to home
    await page.getByRole('button', { name: '← Back to Home' }).click();
    await expect(page).toHaveURL('/');
    
    // Navigate to quiz mode
    await page.getByRole('button', { name: '🧠 Quiz Mode' }).click();
    await expect(page).toHaveURL('/quiz');
    await expect(page.getByRole('heading', { name: '🧠 Quiz Mode' })).toBeVisible();
    
    // Navigate back to home
    await page.getByRole('button', { name: '← Back to Home' }).click();
    await expect(page).toHaveURL('/');
    
    // Navigate to stats
    await page.getByRole('button', { name: '📊 Statistics' }).click();
    await expect(page).toHaveURL('/stats');
    await expect(page.getByText('Statistics - Coming Soon')).toBeVisible();
  });

  test('should navigate through complete study flow', async ({ page }) => {
    // Start at home
    await page.goto('/');
    
    // Go to study mode
    await page.getByRole('button', { name: '📚 Study Mode' }).click();
    
    // Select animals category
    await page.getByRole('button', { name: '🐾 Animals' }).click();
    
    // Study a few cards
    await page.locator('div[style*="transform: rotateY"]').first().click();
    await page.getByRole('button', { name: '✅ I got it right' }).click();
    await page.waitForTimeout(600);
    
    await page.locator('div[style*="transform: rotateY"]').first().click();
    await page.getByRole('button', { name: '❌ I got it wrong' }).click();
    await page.waitForTimeout(600);
    
    // Complete the session
    for (let i = 2; i < 5; i++) {
      await page.locator('div[style*="transform: rotateY"]').first().click();
      await page.getByRole('button', { name: '✅ I got it right' }).click();
      await page.waitForTimeout(600);
    }
    
    // Wait for completion screen to appear
    await page.waitForTimeout(1000);
    
    // Should show completion screen with redo option
    await expect(page.getByRole('heading', { name: '🎉 Study Session Complete!' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🔄 Redo Wrong Cards (1)' })).toBeVisible();
    
    // Navigate to redo
    await page.getByRole('button', { name: '🔄 Redo Wrong Cards (1)' }).click();
    await expect(page).toHaveURL('/redo');
    await expect(page.getByRole('heading', { name: '🔄 Redo Wrong Cards' })).toBeVisible();
    
    // Complete redo session
    await page.locator('[style*="cursor: pointer"]').first().click();
    await page.getByRole('button', { name: '✅ I got it right' }).click();
    await page.waitForTimeout(400);
    
    // Should show completion screen
    await expect(page.getByRole('heading', { name: '🎉 Redo Session Complete!' })).toBeVisible();
    
    // Navigate back to home
    await page.getByRole('button', { name: '🏠 Back to Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate through complete quiz flow', async ({ page }) => {
    // Start at home
    await page.goto('/');
    
    // Go to quiz mode
    await page.getByRole('button', { name: '🧠 Quiz Mode' }).click();
    
    // Select category and quiz type
    await page.getByRole('button', { name: '🐾 Animals' }).click();
    await page.getByText('Multiple Choice').click();
    await page.getByRole('button', { name: '🚀 Start Quiz' }).click();
    
    // Complete quiz
    for (let i = 0; i < 5; i++) {
      const correctAnswer = await page.locator('button').filter({ hasText: /the (cat|dog|bird|fish|horse|house|cow|pig|sheep)/ }).first().textContent();
      await page.getByRole('button', { name: correctAnswer! }).click();
      // Handle both "Next Question" and "Finish Quiz" buttons
      const nextButton = page.getByRole('button', { name: 'Next Question' });
      const finishButton = page.getByRole('button', { name: 'Finish Quiz' });
      
      if (await nextButton.isVisible()) {
        await nextButton.click();
      } else if (await finishButton.isVisible()) {
        await finishButton.click();
      }
      await page.waitForTimeout(100);
    }
    
    // Should show completion screen
    await expect(page.getByRole('heading', { name: '🎉 Quiz Complete!' })).toBeVisible();
    
    // Navigate to new quiz
    await page.getByRole('button', { name: '🧠 New Quiz' }).click();
    await expect(page).toHaveURL('/quiz');
    
    // Navigate back to home
    await page.getByRole('button', { name: '← Back to Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Test direct navigation to study session
    await page.goto('/study/animals');
    await expect(page.getByRole('heading', { name: '📚 Studying: Animals' })).toBeVisible();
    
    // Test direct navigation to quiz
    await page.goto('/quiz/animals?type=multiple-choice');
    await expect(page.getByRole('heading', { name: '🧠 Multiple Choice Quiz' })).toBeVisible();
    
    // Test direct navigation to redo
    await page.evaluate(() => {
      localStorage.setItem('incorrectCards', JSON.stringify([
        { category: 'animals', spanish: 'el gato', english: 'the cat', quiz: { type: 'multiple-choice', options: [] } }
      ]));
    });
    await page.goto('/redo');
    await expect(page.getByRole('heading', { name: '🔄 Redo Wrong Cards' })).toBeVisible();
  });

  test('should handle invalid routes gracefully', async ({ page }) => {
    // Test non-existent category
    await page.goto('/study/invalid');
    await expect(page.getByText('Category not found')).toBeVisible();
    
    // Test non-existent quiz category
    await page.goto('/quiz/invalid?type=multiple-choice');
    await expect(page.getByText('Category not found')).toBeVisible();
  });
});
