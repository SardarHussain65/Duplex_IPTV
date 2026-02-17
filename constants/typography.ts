/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Typography System
 *  Based on Duplex IPTV Figma Design
 * ─────────────────────────────────────────────────────────────
 *
 *  WHY THESE FONT SIZES?
 *  TV screens are viewed from ~2-3 meters away (the "10-foot UI").
 *  The minimum readable font size on a TV is 24px at 1080p.
 *  We use a scale that's roughly 1.5x larger than mobile sizes.
 *
 *  WHY INTER/ROBOTO?
 *  Duplex IPTV uses clean, geometric sans-serif fonts.
 *  These are highly legible at distance and available as system fonts.
 *  Inter is the primary font — Roboto as fallback for Android TV.
 * ─────────────────────────────────────────────────────────────
 */

import { Platform } from 'react-native';

// ─── FONT FAMILIES ───────────────────────────────────────────────────────────
// Platform.select picks the right font per OS.
// Android TV uses system Roboto, Apple TV uses SF Pro (system default).
// We define custom fonts for brand consistency when loaded.

export const FontFamily = {
  // Regular weight — body text, descriptions
  regular: Platform.select({
    android: 'Roboto',
    ios:     'System',
    default: 'System',
  }),

  // Medium weight — labels, nav items, card titles
  medium: Platform.select({
    android: 'Roboto-Medium',
    ios:     'System',
    default: 'System',
  }),

  // Semi Bold — section headings, channel names
  semiBold: Platform.select({
    android: 'Roboto-Bold',
    ios:     'System',
    default: 'System',
  }),

  // Bold — screen titles, hero text, featured content
  bold: Platform.select({
    android: 'Roboto-Bold',
    ios:     'System',
    default: 'System',
  }),

  // Mono — channel numbers, time codes, technical info
  mono: Platform.select({
    android: 'RobotoMono-Regular',
    ios:     'Courier New',
    default: 'monospace',
  }),
} as const;


// ─── FONT WEIGHTS ────────────────────────────────────────────────────────────
export const FontWeight = {
  light:    '300' as const,
  regular:  '400' as const,
  medium:   '500' as const,
  semiBold: '600' as const,
  bold:     '700' as const,
  heavy:    '900' as const,
} as const;


// ─── FONT SIZES ──────────────────────────────────────────────────────────────
// Scale designed for TV (1080p screen, viewed from ~2.5m distance).
// Rule of thumb: TV font sizes = mobile sizes × 1.5

export const FontSize = {
  // Extra small — legal text, tiny metadata
  // Use very sparingly on TV — hard to read from distance
  xs:    18,

  // Small — timestamps, episode numbers, secondary metadata
  sm:    20,

  // Base — body text, list descriptions, subtitles
  base:  22,

  // Medium — card titles, nav labels, form inputs
  md:    26,

  // Large — section headings, channel names in list
  lg:    30,

  // Extra Large — screen titles, hero content titles
  xl:    36,

  // 2XL — Featured hero titles, big splash text
  '2xl': 44,

  // 3XL — Splash screen, very large display text
  '3xl': 56,

  // 4XL — Channel number overlay on player (big and bold)
  '4xl': 72,

  // Display — Clock on home screen, major numbers
  display: 88,
} as const;


// ─── LINE HEIGHTS ────────────────────────────────────────────────────────────
// Line height = font size × multiplier
// Tighter for headings, looser for body text (improves TV readability)

export const LineHeight = {
  tight:   1.1,   // Headings, display text
  snug:    1.25,  // Card titles, nav items
  normal:  1.4,   // Body text, descriptions
  relaxed: 1.6,   // Long-form text (settings, info pages)
  loose:   2.0,   // Very open, spaced-out text
} as const;


// ─── LETTER SPACING ──────────────────────────────────────────────────────────
// Slightly wider spacing improves readability on TV screens
export const LetterSpacing = {
  tight:   -0.5,  // Tight for large display text
  normal:   0,    // Default
  wide:     0.5,  // Labels, badges
  wider:    1.0,  // ALL CAPS labels (LIVE, HD)
  widest:   2.0,  // Tracking for headers
} as const;


// ─── SEMANTIC TEXT STYLES ────────────────────────────────────────────────────
// Pre-built text configurations.
// Use these directly in your StyleSheet instead of mixing
// FontSize/FontWeight manually each time.
//
// Usage:
//   import { TextStyle } from '@constants/typography';
//   style={TextStyle.screenTitle}

export const TextStyle = {

  // Screen-level titles (e.g., "Live TV", "My Favorites")
  screenTitle: {
    fontSize:      FontSize.xl,
    fontWeight:    FontWeight.bold,
    lineHeight:    FontSize.xl * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },

  // Hero banner title (large featured content)
  heroTitle: {
    fontSize:      FontSize['2xl'],
    fontWeight:    FontWeight.bold,
    lineHeight:    FontSize['2xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },

  // Section heading (e.g., "Trending Now", "Sports Channels")
  sectionTitle: {
    fontSize:      FontSize.lg,
    fontWeight:    FontWeight.semiBold,
    lineHeight:    FontSize.lg * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
  },

  // Card title — channel name, movie title
  cardTitle: {
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.semiBold,
    lineHeight:    FontSize.md * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
  },

  // Card subtitle — genre, duration, episode
  cardSubtitle: {
    fontSize:      FontSize.sm,
    fontWeight:    FontWeight.regular,
    lineHeight:    FontSize.sm * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },

  // Body text — descriptions, synopses
  body: {
    fontSize:      FontSize.base,
    fontWeight:    FontWeight.regular,
    lineHeight:    FontSize.base * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },

  // Caption — timestamps, metadata, EPG times
  caption: {
    fontSize:      FontSize.sm,
    fontWeight:    FontWeight.regular,
    lineHeight:    FontSize.sm * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
  },

  // Navigation label — sidebar items
  navLabel: {
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.medium,
    lineHeight:    FontSize.md * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
  },

  // Button text — action buttons
  button: {
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.semiBold,
    lineHeight:    FontSize.md * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
  },

  // Badge text — LIVE, HD, NEW
  badge: {
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.bold,
    lineHeight:    FontSize.xs * LineHeight.tight,
    letterSpacing: LetterSpacing.wider,
  },

  // Channel number in player (big overlay)
  channelNumber: {
    fontSize:      FontSize['4xl'],
    fontWeight:    FontWeight.bold,
    lineHeight:    FontSize['4xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
    fontFamily:    FontFamily.mono,
  },

  // Clock display on home screen
  clockDisplay: {
    fontSize:      FontSize.display,
    fontWeight:    FontWeight.light,
    lineHeight:    FontSize.display * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
    fontFamily:    FontFamily.mono,
  },

  // Player time code (current time / total duration)
  timeCode: {
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.medium,
    lineHeight:    FontSize.md * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
    fontFamily:    FontFamily.mono,
  },

  // EPG programme title
  epgTitle: {
    fontSize:      FontSize.base,
    fontWeight:    FontWeight.medium,
    lineHeight:    FontSize.base * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
  },

  // EPG time label
  epgTime: {
    fontSize:      FontSize.sm,
    fontWeight:    FontWeight.regular,
    lineHeight:    FontSize.sm * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
    fontFamily:    FontFamily.mono,
  },

  // Input field text
  input: {
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.regular,
    lineHeight:    FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },

  // Input placeholder
  inputPlaceholder: {
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.regular,
    lineHeight:    FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },

  // Settings label
  settingsLabel: {
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.medium,
    lineHeight:    FontSize.md * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
  },

  // Settings value / description
  settingsValue: {
    fontSize:      FontSize.base,
    fontWeight:    FontWeight.regular,
    lineHeight:    FontSize.base * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },

} as const;


// Default export
export default {
  FontFamily,
  FontWeight,
  FontSize,
  LineHeight,
  LetterSpacing,
  TextStyle,
};
