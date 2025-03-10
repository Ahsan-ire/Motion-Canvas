# Color Theme Documentation

This document outlines the color theme used in the Motion Canvas animations.

## Color Palette

The color palette is based on a soft, warm color scheme with various shades of red, pink, and brown:

| Color Name | Hex Code | Preview | Description |
|------------|----------|---------|-------------|
| Brown | `#705252` | ![#705252](https://via.placeholder.com/15/705252/000000?text=+) | Deep brown for accents and text |
| Red | `#cc5a5a` | ![#cc5a5a](https://via.placeholder.com/15/cc5a5a/000000?text=+) | Warm red for primary elements |
| Cream | `#f5e7e7` | ![#f5e7e7](https://via.placeholder.com/15/f5e7e7/000000?text=+) | Light cream for backgrounds |
| Salmon | `#e28989` | ![#e28989](https://via.placeholder.com/15/e28989/000000?text=+) | Salmon pink for secondary elements |
| Light Pink | `#f3bcbc` | ![#f3bcbc](https://via.placeholder.com/15/f3bcbc/000000?text=+) | Light pink for neutral elements |
| Very Light Pink | `#fadddd` | ![#fadddd](https://via.placeholder.com/15/fadddd/000000?text=+) | Very light pink for subtle elements |
| Off-White | `#fff9f9` | ![#fff9f9](https://via.placeholder.com/15/fff9f9/000000?text=+) | Off-white for backgrounds |
| White | `#ffffff` | ![#ffffff](https://via.placeholder.com/15/ffffff/000000?text=+) | Pure white |

## Semantic Color Assignments

The colors are semantically assigned for consistent usage across animations:

| Semantic Name | Hex Code | Description |
|---------------|----------|-------------|
| primary | `#cc5a5a` | Primary elements and emphasis |
| secondary | `#e28989` | Secondary elements |
| accent | `#705252` | Accents and highlights |
| neutral | `#f3bcbc` | Neutral elements |
| background | `#fff9f9` | Backgrounds |
| darkBackground | `#f5e7e7` | Darker backgrounds or containers |
| text | `#705252` | Main text |
| textSecondary | `#cc5a5a` | Secondary text |
| success | `#705252` | Success states |
| warning | `#e28989` | Warning states |
| error | `#cc5a5a` | Error states |

## Usage

The color theme is defined in `src/theme.ts` and can be imported into any scene file:

```typescript
import {colors} from '../theme';

// Use colors in your components
view.fill(colors.background);
view.add(<Rect fill={colors.primary} />);
```

## Dark Theme Variant

A dark theme variant is also available for scenes that require a darker background:

```typescript
import {darkColors} from '../theme';

// Use dark theme colors
view.fill(darkColors.background); // Brown background
```

The dark theme inverts some colors for better contrast while maintaining the same color palette. 