# Credence Design System Guide

## Overview
The `design.json` file contains the complete design system extracted from the Credence landing page, ensuring consistent styling across all pages of your application.

## Structure

### 1. **Colors**
- **Primary**: Forest green (`#1E3A2F`) - Main brand color
- **Secondary**: Emerald shades - Accent colors for success, highlights
- **Neutral**: Background (`#FAFAF7`), grays, and white
- **Semantic**: Selection, success, warning, error states
- **Opacity**: Glass effects and overlays

### 2. **Typography**
- **Font Family**: Apple system fonts (SF Pro Display)
- **Font Sizes**: From 9px (xs) to 96px (8xl)
- **Font Weights**: Light (300) to Black (900)
- **Letter Spacing**: Tighter to widest

### 3. **Spacing**
- **Scale**: 0px to 128px in consistent increments
- **Container Max Widths**: sm (640px) to 7xl (1600px)

### 4. **Border Radius**
- **Card**: 32px
- **Button**: 20px
- **Badge**: Full (9999px)
- **Range**: 0px to 32px

### 5. **Shadows**
- Standard shadows (sm to 2xl)
- Emerald-tinted shadows for brand consistency

### 6. **Components**

#### Navigation
```jsx
// Floating glassmorphic nav
position: fixed
top: 24px
background: rgba(255, 255, 255, 0.4)
backdrop-blur: 24px
border-radius: full
```

#### Buttons
- **Primary**: Dark forest green with shadow
- **Secondary**: White with border
- **Icon**: Circular, 32px

#### Cards
- **Default**: White with subtle border
- **Dark**: Forest green background
- **Glass**: Translucent with blur
- **Glass Dark**: Dark translucent with emerald border

#### Badges
- **Default**: Light emerald background
- **Success**: Green with opacity

### 7. **Effects**
- **Glassmorphism**: Translucent backgrounds with blur
- **Background Glow**: Subtle emerald glow
- **Text Gradient**: Forest to emerald gradient

## Usage Examples

### Using Colors
```jsx
// Primary button
className="bg-[#1E3A2F] text-white"

// Emerald accent
className="text-emerald-400"

// Background
className="bg-[#FAFAF7]"
```

### Using Typography
```jsx
// Hero heading
className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.9]"

// Body text
className="text-lg text-gray-500 leading-relaxed"

// Small label
className="text-[11px] font-bold uppercase tracking-widest"
```

### Using Components

#### Navigation Bar
```jsx
<nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-14 
                bg-white/40 backdrop-blur-xl border border-[#CFE3D8]/30 
                rounded-full flex items-center justify-between px-8 z-50">
  {/* Content */}
</nav>
```

#### Primary Button
```jsx
<button className="bg-[#1E3A2F] text-white px-8 py-4 rounded-2xl 
                   font-bold text-sm shadow-2xl active:scale-95 
                   transition-all">
  Launch Demo
</button>
```

#### Glass Card
```jsx
<div className="bg-white/10 backdrop-blur-2xl border border-white/20 
                rounded-2xl p-4 shadow-2xl">
  {/* Content */}
</div>
```

#### Badge
```jsx
<span className="inline-block px-4 py-1.5 text-[11px] font-bold 
                 tracking-widest uppercase bg-[#E6EFEA] text-[#1E3A2F] 
                 rounded-full border border-[#CFE3D8]">
  Label
</span>
```

## Design Principles

1. **Clean & Minimal**: Generous whitespace, subtle elements
2. **Apple-Inspired**: Smooth spacing, elegant typography
3. **Glassmorphism**: Depth through translucent layers
4. **Emerald Accent**: Consistent use of emerald green
5. **Typography-First**: Clear hierarchy with bold headings
6. **Consistent Radius**: 32px for cards, 20px for buttons
7. **Subtle Shadows**: Minimal use, prefer borders

## Accessibility Guidelines

- ✅ Maintain WCAG AA contrast ratios
- ✅ Interactive elements minimum 44x44px
- ✅ Clear focus states
- ✅ Semantic HTML
- ✅ Keyboard navigation support

## Integration with Tailwind

The design system is fully compatible with Tailwind CSS. You can:

1. **Use directly**: Apply classes as shown in examples
2. **Extend Tailwind**: Add custom values to `tailwind.config.js`
3. **Create utilities**: Build custom utility classes

### Example Tailwind Extension
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        forest: '#1E3A2F',
        'emerald-custom': {
          50: '#E6EFEA',
          100: '#CFE3D8',
        }
      },
      borderRadius: {
        'card': '32px',
        'button': '20px',
      }
    }
  }
}
```

## Quick Reference

| Element | Class Pattern |
|---------|---------------|
| Hero Heading | `text-6xl md:text-8xl font-extrabold tracking-tight` |
| Section Heading | `text-3xl font-bold` |
| Body Text | `text-lg text-gray-500 leading-relaxed` |
| Primary Button | `bg-[#1E3A2F] text-white px-8 py-4 rounded-2xl` |
| Card | `bg-white border border-[#CFE3D8] rounded-[32px] p-10` |
| Badge | `px-4 py-1.5 text-[11px] font-bold uppercase rounded-full` |
| Glass Effect | `bg-white/40 backdrop-blur-xl border border-[#CFE3D8]/30` |

## Next Steps

1. Use this design system for all new pages
2. Create reusable components based on these patterns
3. Maintain consistency across the application
4. Update `design.json` when adding new patterns
