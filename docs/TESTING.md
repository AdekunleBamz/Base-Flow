# Testing Guide

## Unit Testing

### Setup
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Running Tests
```bash
npm test
npm run test:watch
npm run test:coverage
```

### Writing Tests
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Integration Testing

### API Testing
Test API routes with mock data and assertions.

### Component Integration
Test component interactions and state management.

## E2E Testing

### Playwright Setup
```bash
npm install --save-dev @playwright/test
```

### Writing E2E Tests
```typescript
import { test, expect } from '@playwright/test';

test('swap flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="amount-input"]', '1');
  await page.click('[data-testid="swap-button"]');
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
});
```

## Best Practices

- Write tests as you code
- Aim for high coverage
- Test edge cases
- Mock external dependencies
- Keep tests fast and isolated
