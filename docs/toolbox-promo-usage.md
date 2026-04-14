# Toolbox Promotion Card

A reusable component to promote the Toolbox project across your Quizzy application.

## Features

- 🎨 **Beautiful Design**: Gradient backgrounds, glass morphism effects, and smooth animations
- 📱 **Mobile Responsive**: Optimized for all screen sizes
- 🌓 **Dark/Light Mode**: Automatic theme detection and styling
- ⚡ **Performance**: Optimized with Framer Motion animations
- 🔗 **External Links**: Opens in new tab with proper security attributes

## Variants

The component comes in two variants:

### Default Variant
Full-featured promotional card with detailed information about Toolbox features.

```tsx
import { ToolboxPromoCard } from "@/components/common";

<ToolboxPromoCard variant="default" />
```

Best for:
- Home pages
- Landing pages
- Dedicated promotional sections

### Compact Variant
Smaller, space-efficient version perfect for overlays and constrained spaces.

```tsx
import { ToolboxPromoCard } from "@/components/common";

<ToolboxPromoCard variant="compact" />
```

Best for:
- Quiz results overlays
- Sidebar placements
- Mobile-first layouts

## Props

```tsx
interface ToolboxPromoCardProps {
  className?: string;    // Additional CSS classes
  variant?: "default" | "compact";  // Card style variant
}
```

## Usage Examples

### Basic Usage
```tsx
import ToolboxPromoCard from "@/components/common/toolbox-promo-card";

<ToolboxPromoCard />
```

### With Custom Styling
```tsx
<ToolboxPromoCard
  variant="default"
  className="max-w-4xl mx-auto my-8"
/>
```

### In Quiz Results
```tsx
<motion.div className="mt-6 max-w-2xl mx-auto">
  <ToolboxPromoCard variant="compact" />
</motion.div>
```

### Responsive Layout
```tsx
<div className="container mx-auto px-4 py-12">
  <ToolboxPromoCard variant="default" />
</div>
```

## Features Highlighted

The card showcases these key Toolbox features:
- 🛡️ **100% Private**: No data uploads or tracking
- ⚡ **Lightning Fast**: Client-side processing
- 📄 **PDF & Images**: Multiple file format support
- 🔒 **No Data Uploads**: Everything happens in-browser

## Customization

You can customize the card appearance through:
1. **Variant selection**: Choose between default and compact styles
2. **CSS classes**: Add custom styling via the `className` prop
3. **Theme integration**: Automatically adapts to your site's dark/light mode

## Performance Considerations

- Uses `useTheme` hook with mounted state to prevent hydration issues
- Optimized animations with Framer Motion
- Lazy loading support for better initial page load
- Efficient re-renders with proper memoization

## Accessibility

- Proper semantic HTML structure
- External link attributes (`target="_blank"`, `rel="noopener noreferrer"`)
- High contrast colors for readability
- Keyboard navigation support
- Screen reader friendly

## Future Enhancements

Potential improvements:
- Add more variants (banner, sidebar, etc.)
- Customizable feature list
- A/B testing support for click tracking
- Internationalization support
- Custom color schemes
