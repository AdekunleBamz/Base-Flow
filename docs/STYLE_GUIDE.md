# Style Guide

## TypeScript

### Naming Conventions
- PascalCase for components and types
- camelCase for variables and functions
- UPPER_SNAKE_CASE for constants

### Type Definitions
```typescript
// Prefer interfaces for objects
interface User {
  id: string;
  name: string;
}

// Use type for unions and complex types
type Status = 'idle' | 'loading' | 'success' | 'error';
```

## React Components

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export function Component({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>{title}</div>;
}
```

### Hooks
- Use custom hooks for reusable logic
- Prefix with 'use'
- Keep hooks pure and focused

## CSS/Tailwind

### Class Order
1. Layout (flex, grid, display)
2. Positioning (absolute, relative)
3. Box model (width, height, margin, padding)
4. Typography
5. Visual (colors, borders)
6. Misc (transitions, transforms)

### Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints
- Test on multiple devices

## Best Practices

- Keep functions small and focused
- Use meaningful variable names
- Comment complex logic
- Avoid deep nesting
- DRY (Don't Repeat Yourself)
