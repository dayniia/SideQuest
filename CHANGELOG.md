# Changelog - SideQuest Web App

All notable changes and improvements are documented below.

## [1.2.0] - 2026-02-21

### Added
- **Multi-Select Quest Logging**: You can now select multiple categories at once and log them all in a single tap. The log button updates dynamically (e.g., "LOG 3 QUESTS!").
- **In-Modal Category Creation**: Added a "+ New" button directly inside the logging modal so you can create a new category without leaving the flow.
- **Category Deletion**: Categories can now be deleted from the main list via a trash icon on each category pill.

- **Android App (Capacitor)**: Integrated Capacitor to build SideQuest as a native Android app, with helper scripts (`mobile:sync`, `mobile:open`, `mobile:run`) added to `package.json`.
- **Automated APK Builds**: Added a GitHub Actions workflow (`.github/workflows/android_build.yml`) that automatically builds and publishes a new APK to the "Latest Mobile Build" GitHub Release on every push to `main`.
- **In-App APK Download Button**: Added a "Download Android App" button (smartphone icon) to the header for direct one-click APK downloads.
- **Custom Mobile Branding**: Created a custom SideQuest icon and splash screen for Android.

### Changed
- **Code Architecture**: Refactored the monolithic `App.tsx` into dedicated, reusable components: `Header.tsx`, `CategoryBar.tsx`, `CalendarGrid.tsx`, and `Modals.tsx`.
- **Category Migration**: Retired "Common Cold" and "Silly Google Search"; replaced with "Solo Date", "Learn Something New", and "Cook New Recipe". All existing calendar entries are migrated automatically.
- **Wrapped — Monthly**: Replaced "Entry #" labels with actual Month and Year for clarity. Redesigned highlights slide with a "message for your future self" theme.
- **Wrapped — Yearly**: Added unique annual-only stats: "Peak Month" (The Season of Chaos), a "Character Class" title based on activity level, and a dedicated yearly reflection message.
- **Empty State**: Updated the fallback message to: *"The quest log is silent... the next legendary chapter is still waiting to be written."*

### Fixed
- Restored visibility of "Monthly Wrapped", "Yearly Wrapped", and "Backup" button labels on mobile.
- Download APK button is hidden on mobile (not useful on the device itself).
- Reset category selection state when re-opening the log modal for a new day.
- Added a `disabled` state and placeholder to the log button to prevent empty submissions.

---

## [1.1.0] - 2026-02-18

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

## [1.0.0] - 2026-02-16

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
