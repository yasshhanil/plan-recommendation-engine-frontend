# AGENTS.md — React Native Clean Code Practices

## Project Overview

This is a React Native (Expo) plan recommendation app using:
- **Expo SDK 54** with React 19
- **React Navigation** (Stack + Bottom Tabs)
- **Zustand** for state management
- **Tamagui** for UI primitives
- **React Query** for server state
- **Lucide React Native** for icons
- **Expo Linear Gradient / Blur** for visual effects
- **React Native Reanimated** for animations

---

## Folder Structure

```
src/
├── components/    # Reusable, presentation-only UI components
├── features/      # Feature-specific modules (screens + logic grouped)
├── hooks/         # Custom reusable hooks
├── navigation/    # Navigator definitions (Stack, Tab, etc.)
├── screens/       # Top-level screen components
├── services/      # API calls and external service integrations
├── store/         # Zustand stores
├── styles/        # Shared StyleSheet definitions
├── theme/         # Design tokens (colors, spacing, radius, fontSize)
├── utils/         # Pure utility functions and constants
```

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files (components/screens) | PascalCase | `HomeScreen.js`, `GradientCard.js` |
| Files (hooks) | camelCase with `use` prefix | `usePlanStore.js` |
| Files (utils/services) | camelCase | `dummyData.js`, `apiService.js` |
| Components | Named export, PascalCase | `export const HomeScreen = ...` |
| Hooks | Named export, camelCase | `export const usePlanStore = ...` |
| Constants | camelCase object with descriptive keys | `colors.mainBackground` |
| Style objects | camelCase | `commonStyles.container` |

---

## Code Formatting

1. **Indentation** — 2 spaces, no tabs.
2. **Max line length** — 100 characters. Break JSX props onto new lines when exceeded.
3. **Semicolons** — always.
4. **Trailing commas** — always (ES5 style: objects, arrays, function params).
5. **Quotes** — single quotes for JS strings, double quotes for JSX attributes.
6. **Blank lines** — one blank line between logical blocks (imports, functions, return sections). No multiple consecutive blank lines.
7. **JSX formatting:**
   - 1 prop per line when a component has 3+ props.
   - Self-close components with no children: `<Icon size={20} />`.
   - Closing `>` on same line as last prop for multi-line tags; `/>` on its own line for self-closing.
8. **Object/array formatting** — one property per line for 3+ entries; inline for 1–2.
9. **Arrow functions** — omit braces for single-expression returns in callbacks; use braces + explicit `return` for component bodies.
10. **No trailing whitespace**.

```javascript
// Good — multi-prop JSX
<TouchableOpacity
  onPress={handlePress}
  style={styles.card}
  activeOpacity={0.8}
>
  <Text style={styles.title}>{title}</Text>
</TouchableOpacity>

// Bad — all props crammed on one line exceeding 100 chars
<TouchableOpacity onPress={handlePress} style={styles.card} activeOpacity={0.8}><Text style={styles.title}>{title}</Text></TouchableOpacity>
```

---

## Component Guidelines

1. **Functional components only** — use arrow functions with named exports.
2. **No default exports** — always use named exports for better refactoring and IDE support.
3. **Props destructuring** — destructure props in the function signature.
4. **Keep components under 120 lines** — extract sub-components or hooks when exceeding this.
5. **Separate concerns** — screens handle layout/orchestration, components handle presentation.

```javascript
// Good
export const MyComponent = ({ title, onPress }) => {
  return (...);
};

// Bad
export default function MyComponent(props) {
  const title = props.title;
  return (...);
}
```

---

## Styling Rules

1. **Use the design token system** — never hardcode colors, spacing, radius, or font sizes.
   - Import from `../theme/constants` → `colors`, `spacing`, `radius`, `fontSize`.
2. **Prefer shared styles** — use `commonStyles` from `../styles/common.js` for reusable patterns.
3. **Inline styles only for one-off, dynamic values** — e.g., `{ flex: 1 }` or computed widths.
4. **StyleSheet.create for screen/component-specific styles** — define at the bottom of the file.
5. **No magic numbers** — use spacing/radius/fontSize tokens.

```javascript
// Good
import { colors, spacing, radius } from '../theme/constants';
import { commonStyles } from '../styles/common';

// Bad
style={{ backgroundColor: '#1C1E24', padding: 16, borderRadius: 24 }}
```

---

## State Management

1. **Zustand for global/app state** — keep stores small and focused (one per domain).
2. **React Query for server state** — caching, refetching, and sync with backend.
3. **Local state (`useState`) for ephemeral UI state** — modals, input values, toggles.
4. **No prop drilling beyond 2 levels** — use Zustand or context instead.
5. **Store actions are co-located** — define actions inside the `create()` call.

```javascript
// Store pattern
export const useMyStore = create((set, get) => ({
  data: null,
  setData: (data) => set({ data }),
  reset: () => set({ data: null }),
}));
```

---

## Navigation

1. **Centralize navigation config** in `src/navigation/AppNavigator.js`.
2. **Screen names are PascalCase strings** — `'PlanningFlow'`, `'Loading'`, `'GeneratedPlan'`.
3. **Pass minimal params** — prefer store/context over heavy navigation params.
4. **Hide headers globally** via `screenOptions={{ headerShown: false }}`.

---

## Performance Best Practices

1. **Memoize expensive computations** — use `useMemo` and `useCallback` where re-renders are costly.
2. **Avoid anonymous functions in render** for frequently re-rendered lists — extract handlers.
3. **Use `FlatList`** over `ScrollView` + `.map()` for lists > 10 items.
4. **Minimize re-renders** — keep Zustand selectors granular.
5. **Image optimization** — use `resizeMode` and consider caching strategies.

---

## Code Quality Rules

1. **No `console.log` in committed code** — use a logger utility or remove before commit.
2. **No unused imports or variables**.
3. **No `any` type** if using TypeScript — prefer explicit types.
4. **Early returns** — reduce nesting with guard clauses.
5. **Descriptive variable names** — `selectedMoods` over `sm`, `handleQuickGenerate` over `onPress1`.
6. **Array/object immutability** — always spread/copy, never mutate state directly.

---

## Import Order

Maintain consistent import ordering:

```javascript
// 1. React & React Native
import React from 'react';
import { View, Text } from 'react-native';

// 2. Third-party libraries
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';

// 3. Internal: theme, styles, store
import { colors, spacing } from '../theme/constants';
import { commonStyles } from '../styles/common';
import { usePlanStore } from '../store/usePlanStore';

// 4. Internal: components, utils
import { GradientCard } from '../components/GradientCard';
import { areaOptions } from '../utils/dummyData';
```

---

## File Template (Screen)

```javascript
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { colors, spacing } from '../theme/constants';
import { commonStyles } from '../styles/common';

export const ExampleScreen = ({ navigation }) => {
  return (
    <View style={commonStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={commonStyles.paddingXL}>
          {/* Screen content */}
        </View>
      </ScrollView>
    </View>
  );
};
```

---

## File Template (Component)

```javascript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize } from '../theme/constants';

export const ExampleCard = ({ title, subtitle, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.cardTitle,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.smallLabel,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
```

---

## Do's and Don'ts Summary

| Do | Don't |
|----|-------|
| Use design tokens everywhere | Hardcode colors/sizes |
| Named exports | Default exports |
| Extract reusable components | Copy-paste UI blocks |
| Keep screens thin (orchestration) | Put business logic in JSX |
| Use Zustand selectors | Subscribe to entire store |
| Destructure props | Access `props.x` repeatedly |
| Use `FlatList` for long lists | Use `.map()` inside `ScrollView` |
| Co-locate styles at file bottom | Scatter `StyleSheet.create` calls |
| Immutable state updates | Mutate arrays/objects directly |
