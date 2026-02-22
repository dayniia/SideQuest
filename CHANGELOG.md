# Changelog - SideQuest Web App

All notable changes and improvements are documented below.

## [1.2.0] - 2026-02-21

### Added
- **Full Mobile Responsiveness**: Implemented a comprehensive mobile-first strategy across the entire application.
- **Adaptive Header**: Redesigned the header to collapse gracefully on small screens, hiding button text and stacking the logo/title for better one-handed use.
- **Responsive "Wrapped" Experience**: Optimized the slide-show mode with dynamic font sizing and auto-scaling icons for mobile devices.

### Changed
- **CSS Architecture**: Replaced rigid inline styles with a more flexible, class-based CSS system in `index.css`.
- **UI Scaling for Mobile**: Reduced calendar grid spacing and date font sizes on smaller viewports to prevent overflow.
- **Icon Sizing**: Implemented platform-aware icon sizing in the Wrapped component.

### Improved
- **Category Visualization**: Enhanced the category list layout to wrap naturally on smaller screens.
- **Event Indicators**: Scaled the event "dots" and reduced their count in the calendar view for clarity on mobile.

### Fixed
- Fixed JSX nesting and closing tag errors in `App.tsx` during layout refactoring.

## [1.1.0] - 2026-02-16

### Added
- **New Visual Identity**: Created a custom "SideQuest" icon featuring a playful compass and scroll.
- **Header Branding**: Integrated the new logo into the app header with a light purple background and neo-brutalist styling (thick borders & hard shadows).
- **Monthly Wrapped**: Added a specialized "Wrapped" summary for individual months, allowing users to see their progress more frequently.
- **FBI Agent Highlight**: A new quirky slide in the Wrapped experience that pulls a random funny note from your logs.
- **Navigation Controls**: Added Month-to-Month navigation (Previous/Next) in the main view.

### Changed
- **Calendar Overhaul**: Refactored the core visualization from a yearly "GitHub-style" grid to a standard **Monthly Calendar** layout for better accessibility and easier logging.
- **UI Scaling**: Reduced the overall footprint of the UI elements (logo, fonts, padding, and gaps) to create a more compact and mobile-friendly experience.
- **Wrapped Slides**: Replaced older stats (Peak Hour, Quiet Streak) with more personality-driven ones like "Main Character Energy" (Peak Day of Week) and "The Incident" (Top Category).
- **Favicon Sync**: Updated the browser tab favicon to match the new light purple SideQuest logo.

### Improved
- **Neo-Brutalist Aesthetic**: Refined all cards, buttons, and grid squares to use a consistent "High-Contrast" design language with 2px borders and 3px shadows.
- **Tooltip Logic**: Enhanced the hover state for calendar days to provide more detailed side-quest summaries.
- **Mobile Accessibility**: Optimized the layout for common screen sizes by reducing the maximum container width to 850px.
- **Code Health**: Cleaned up unused imports (`getDay`, `idx`, etc.) and resolved JSX nesting errors for better performance.

### Fixed
- Fixed JSX closing tag errors introduced during the calendar transition.
- Resolved type mismatch issues in the `Wrapped` component when handling optional month filters.
