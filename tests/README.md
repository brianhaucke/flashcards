# E2E Tests for Spanish Flashcards App

This directory contains comprehensive end-to-end tests for the Spanish Flashcards application using Playwright.

## Test Structure

### Test Files

- **`homepage.spec.ts`** - Tests for the main homepage functionality
- **`study-mode.spec.ts`** - Tests for study mode and flashcard interactions
- **`redo-mode.spec.ts`** - Tests for redo mode functionality
- **`quiz-mode.spec.ts`** - Tests for quiz mode (both multiple choice and fill-in-the-blank)
- **`navigation.spec.ts`** - Tests for navigation between pages
- **`localStorage.spec.ts`** - Tests for localStorage persistence

### Test Coverage

#### ✅ Homepage Tests
- Main title and navigation buttons display
- Navigation to study mode, quiz mode, and statistics
- Dynamic "Redo Wrong Cards" button (appears when incorrect cards exist)
- Redo button navigation

#### ✅ Study Mode Tests
- Category selection page
- Study session interface
- Card flipping functionality
- Correct/incorrect answer handling
- Progress tracking
- Session completion with statistics
- Redo button appearance when there are incorrect answers
- Navigation controls

#### ✅ Redo Mode Tests
- Redo page interface
- Correct answer handling (removes card from redo list)
- Incorrect answer handling (keeps card in redo list)
- Session completion
- Clear all wrong cards functionality
- No wrong cards message when localStorage is empty
- Navigation from completion screen

#### ✅ Quiz Mode Tests
- Quiz selection page (category and quiz type selection)
- Multiple choice quiz functionality
- Fill-in-the-blank quiz functionality
- Correct/incorrect answer feedback
- Case-insensitive validation for fill-in-the-blank
- Quiz completion with statistics
- Navigation controls

#### ✅ Navigation Tests
- Complete study flow navigation
- Complete quiz flow navigation
- Direct URL navigation
- Invalid route handling
- Cross-page navigation

#### ✅ LocalStorage Tests
- Incorrect cards persistence across page reloads
- Data clearing on reset
- Card removal when answered correctly in redo
- Clear all functionality
- Corrupted data handling
- Cross-session persistence

## Running Tests

### Prerequisites
Make sure the development server is running:
```bash
npm run dev
```

### Test Commands

```bash
# Run all tests
npm run test

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test homepage.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium
```

### Test Configuration

The tests are configured in `playwright.config.ts`:
- **Base URL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Parallel execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Auto-start dev server**: Yes

## Test Data

The tests use the static flashcard data from `src/data/flashcards.ts`:
- **Animals**: el gato, el perro, el pájaro, el pez, el caballo
- **Food**: la manzana, el pan, la leche, el arroz, la carne
- **Verbs**: comer, beber, dormir, caminar, correr

## Key Test Scenarios

### 1. Complete Study Flow
1. Navigate to study mode
2. Select category
3. Study cards (mix of correct/incorrect answers)
4. Complete session
5. Use redo mode for incorrect cards
6. Clear all wrong cards

### 2. Complete Quiz Flow
1. Navigate to quiz mode
2. Select category and quiz type
3. Complete quiz with correct answers
4. View completion statistics
5. Start new quiz

### 3. Data Persistence
1. Study cards and mark some incorrect
2. Reload page
3. Verify redo button appears
4. Complete redo session
5. Verify data is cleared

### 4. Error Handling
1. Navigate to invalid routes
2. Handle corrupted localStorage
3. Test edge cases (empty data, etc.)

## Best Practices

- Tests are independent and can run in any order
- Each test cleans up after itself
- Tests use realistic user interactions
- Proper waiting for elements and transitions
- Clear test descriptions and organization
- Comprehensive coverage of user journeys

## Debugging

If tests fail:
1. Run with `--headed` to see the browser
2. Use `--debug` to step through tests
3. Check the HTML report in `playwright-report/`
4. Verify the dev server is running on port 5173
5. Check for console errors in the browser
