import { test, expect } from '@playwright/test';

test.describe('Quiz Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quiz');
  });

  test('should display quiz selection page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '🧠 Quiz Mode' })).toBeVisible();
    await expect(page.getByText('Choose a category and quiz type to test your Spanish knowledge')).toBeVisible();
    
    // Check categories section
    await expect(page.getByText('1. Select Category')).toBeVisible();
    await expect(page.getByRole('button', { name: '🐾 Animals' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🍎 Food' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🏃 Verbs' })).toBeVisible();
    
    // Check quiz types section
    await expect(page.getByText('2. Select Quiz Type')).toBeVisible();
    await expect(page.getByText('Multiple Choice')).toBeVisible();
    await expect(page.getByText('Fill in the Blank')).toBeVisible();
    
    // Check buttons
    await expect(page.getByRole('button', { name: '🚀 Start Quiz' })).toBeDisabled();
    await expect(page.getByRole('button', { name: '← Back to Home' })).toBeVisible();
  });

  test('should enable start button when both category and quiz type are selected', async ({ page }) => {
    // Select category
    await page.getByRole('button', { name: '🐾 Animals' }).click();
    
    // Select quiz type
    await page.getByText('Multiple Choice').click();
    
    // Start button should be enabled
    await expect(page.getByRole('button', { name: '🚀 Start Quiz' })).toBeEnabled();
  });

  test('should navigate to multiple choice quiz when started', async ({ page }) => {
    await page.getByRole('button', { name: '🐾 Animals' }).click();
    await page.getByText('Multiple Choice').click();
    await page.getByRole('button', { name: '🚀 Start Quiz' }).click();
    
    await expect(page).toHaveURL('/quiz/animals?type=multiple-choice');
    await expect(page.getByRole('heading', { name: '🧠 Multiple Choice Quiz' })).toBeVisible();
  });

  test('should navigate to fill-in-the-blank quiz when started', async ({ page }) => {
    await page.getByRole('button', { name: '🐾 Animals' }).click();
    await page.getByText('Fill in the Blank').click();
    await page.getByRole('button', { name: '🚀 Start Quiz' }).click();
    
    await expect(page).toHaveURL('/quiz/animals?type=fill-blank');
    await expect(page.getByRole('heading', { name: '🧠 Fill in the Blank Quiz' })).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await page.getByRole('button', { name: '← Back to Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test.describe('Multiple Choice Quiz', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/quiz/animals?type=multiple-choice');
    });

    test('should display quiz interface', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '🧠 Multiple Choice Quiz' })).toBeVisible();
      await expect(page.getByText('Category: Animals')).toBeVisible();
      await expect(page.getByText('1 of 5')).toBeVisible(); // Progress
      
      // Check stats
      await expect(page.getByText('✅')).toBeVisible();
      await expect(page.getByText('❌')).toBeVisible();
      
      // Check question
      await expect(page.getByText('What does "el gato" mean?')).toBeVisible();
      
      // Check options (should be 4)
      const options = page.locator('button').filter({ hasText: /the (cat|dog|bird|fish|house|horse|cow|pig|sheep)/ });
      await expect(options).toHaveCount(4);
    });

    test('should handle correct answer', async ({ page }) => {
      // Click the correct answer
      await page.getByRole('button', { name: 'the cat' }).click();
      
      // Check feedback
      await expect(page.getByText('✅ Correct!')).toBeVisible();
      
      // Check next button appears
      await expect(page.getByRole('button', { name: 'Next Question' })).toBeVisible();
    });

    test('should handle incorrect answer', async ({ page }) => {
      // Click an incorrect answer
      await page.getByRole('button', { name: 'the dog' }).click();
      
      // Check feedback
      await expect(page.getByText('❌ Incorrect. The answer is: the cat')).toBeVisible();
      
      // Check next button appears
      await expect(page.getByRole('button', { name: 'Next Question' })).toBeVisible();
    });

    test('should complete quiz and show completion screen', async ({ page }) => {
      // Answer all questions correctly
      for (let i = 0; i < 5; i++) {
        // Find and click the correct answer (it's always the first option that matches the English translation)
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
        await page.waitForTimeout(300);
      }
      
      // Wait for completion screen to appear
      await page.waitForTimeout(1000);
      
      // Check completion screen
      await expect(page.getByRole('heading', { name: '🎉 Quiz Complete!' })).toBeVisible();
      await expect(page.getByText('Correct: 5')).toBeVisible();
      await expect(page.getByText('Incorrect: 0')).toBeVisible();
      await expect(page.getByText('Accuracy: 100%')).toBeVisible();
    });

    test('should navigate to new quiz from completion screen', async ({ page }) => {
      // Complete quiz quickly
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
      
      // Click new quiz
      await page.getByRole('button', { name: '🧠 New Quiz' }).click();
      await expect(page).toHaveURL('/quiz');
    });
  });

  test.describe('Fill-in-the-Blank Quiz', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/quiz/animals?type=fill-blank');
    });

    test('should display quiz interface', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '🧠 Fill in the Blank Quiz' })).toBeVisible();
      await expect(page.getByText('Category: Animals')).toBeVisible();
      await expect(page.getByText('1 of 5')).toBeVisible(); // Progress
      
      // Check stats
      await expect(page.getByText('✅')).toBeVisible();
      await expect(page.getByText('❌')).toBeVisible();
      
      // Check question
      await expect(page.getByText('What does "el gato" mean?')).toBeVisible();
      
      // Check input field
      await expect(page.getByPlaceholder('Type your answer here...')).toBeVisible();
      await expect(page.getByText('Press Enter to submit your answer')).toBeVisible();
    });

    test('should handle correct answer (case insensitive)', async ({ page }) => {
      // Type correct answer in different case
      await page.getByPlaceholder('Type your answer here...').fill('THE CAT');
      await page.getByRole('button', { name: 'Submit Answer' }).click();
      
      // Check feedback
      await expect(page.getByText('✅ Correct!')).toBeVisible();
      
      // Check next button appears
      await expect(page.getByRole('button', { name: 'Next Question' })).toBeVisible();
    });

    test('should handle correct answer with Enter key', async ({ page }) => {
      // Type correct answer and press Enter
      await page.getByPlaceholder('Type your answer here...').fill('the cat');
      await page.keyboard.press('Enter');
      
      // Check feedback
      await expect(page.getByText('✅ Correct!')).toBeVisible();
    });

    test('should handle incorrect answer', async ({ page }) => {
      // Type incorrect answer
      await page.getByPlaceholder('Type your answer here...').fill('the dog');
      await page.getByRole('button', { name: 'Submit Answer' }).click();
      
      // Check feedback
      await expect(page.getByText('❌ Incorrect. The answer is: the cat')).toBeVisible();
      
      // Check next button appears
      await expect(page.getByRole('button', { name: 'Next Question' })).toBeVisible();
    });

    test('should disable submit button when input is empty', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Submit Answer' })).toBeDisabled();
      
      // Type something
      await page.getByPlaceholder('Type your answer here...').fill('test');
      await expect(page.getByRole('button', { name: 'Submit Answer' })).toBeEnabled();
      
      // Clear input
      await page.getByPlaceholder('Type your answer here...').fill('');
      await expect(page.getByRole('button', { name: 'Submit Answer' })).toBeDisabled();
    });

    test('should complete quiz and show completion screen', async ({ page }) => {
      // Answer all questions correctly
      const answers = ['the cat', 'the dog', 'the bird', 'the fish', 'the horse'];
      
      for (let i = 0; i < 5; i++) {
        await page.getByPlaceholder('Type your answer here...').fill(answers[i]);
        await page.getByRole('button', { name: 'Submit Answer' }).click();
        
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
      
      // Check completion screen
      await expect(page.getByRole('heading', { name: '🎉 Quiz Complete!' })).toBeVisible();
      await expect(page.getByText('Correct: 5')).toBeVisible();
      await expect(page.getByText('Incorrect: 0')).toBeVisible();
      await expect(page.getByText('Accuracy: 100%')).toBeVisible();
    });
  });
});
