/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Spacing & Dimensions System
 *  Based on Duplex IPTV Figma Design
 * ─────────────────────────────────────────────────────────────
 *
 *  WHY AN 8-POINT GRID?
 *  All spacing is based on multiples of 8.
 *  This creates visual harmony — everything lines up on a grid.
 *  TV screens are large, so we use bigger spacing than mobile.
 *  8px base unit × scale = consistent, professional layouts.
 *
 *  TV-SPECIFIC SPACING RULES:
 *  - Minimum touch/focus target: 48×48px (but bigger is better on TV)
 *  - Safe zone padding from screen edge: minimum 48px
 *  - Sidebar width: 280px (collapsed: 80px)
 *  - Card spacing in grids: at least 16px gap
 * ─────────────────────────────────────────────────────────────
 */

// ─── BASE UNIT ────────────────────────────────────────────────────────────────
// Every spacing value is a multiple of this base unit.
// Changing this single value scales the ENTIRE app's spacing.
const BASE = 8;

// ─── SPACING SCALE ────────────────────────────────────────────────────────────
// Named sizes follow t-shirt sizing for intuitive use.
// "Spacing.md" is more readable than "Spacing[24]" in your components.

export const Spacing = {
  // Micro-spacing — between icon and text, badge padding
  none:   0,           // 0px
  xxs:    BASE * 0.5,  // 4px
  xs:     BASE * 1,    // 8px
  sm:     BASE * 1.5,  // 12px
  md:     BASE * 2,    // 16px
  lg:     BASE * 3,    // 24px
  xl:     BASE * 4,    // 32px
  '2xl':  BASE * 5,    // 40px
  '3xl':  BASE * 6,    // 48px
  '4xl':  BASE * 8,    // 64px
  '5xl':  BASE * 10,   // 80px
  '6xl':  BASE * 12,   // 96px
  '7xl':  BASE * 16,   // 128px
  '8xl':  BASE * 20,   // 160px
} as const;


// ─── SCREEN SAFE ZONES ───────────────────────────────────────────────────────
// TV screens have overscan zones — content too close to edges gets cut off.
// These values define the minimum safe padding from each screen edge.
// Based on TV UI guidelines from Apple (tvOS HIG) and Google (Android TV).

export const SafeZone = {
  // Minimum padding from screen edges (prevents overscan clipping)
  horizontal:  Spacing['3xl'],   // 48px from left/right edge
  vertical:    Spacing['3xl'],   // 48px from top/bottom edge

  // Content area padding (inside the safe zone)
  contentH:    Spacing['2xl'],   // 40px horizontal content padding
  contentV:    Spacing.xl,       // 32px vertical content padding
} as const;


// ─── LAYOUT DIMENSIONS ───────────────────────────────────────────────────────
// Fixed pixel dimensions for key layout elements.
// Based on the Duplex IPTV Figma design system.

export const Layout = {
  // ── SIDEBAR ────────────────────────────────────────────────────────────
  // The left navigation rail.
  sidebar: {
    widthExpanded:  280,   // Full sidebar (with labels)
    widthCollapsed:  80,   // Icon-only collapsed sidebar
    itemHeight:      64,   // Height of each nav item
    iconSize:        28,   // Nav icon size
    logoHeight:      48,   // App logo height in sidebar
    topPadding:      48,   // Space above first nav item
  },

  // ── HEADER ─────────────────────────────────────────────────────────────
  header: {
    height:          72,   // Top header bar height
    iconSize:        28,   // Header icon size
  },

  // ── CARDS ──────────────────────────────────────────────────────────────
  // Different card sizes for different contexts.
  card: {
    // Channel card in list view
    channelItem: {
      height:    80,
      logoSize:  52,
    },
    // Channel card in grid view
    channelGrid: {
      width:     200,
      height:    130,
      logoSize:  80,
    },
    // VOD movie card (poster format)
    movie: {
      width:     180,
      height:    270,   // 2:3 aspect ratio (poster)
    },
    // Series card
    series: {
      width:     240,
      height:    135,   // 16:9 aspect ratio
    },
    // Featured / hero card
    hero: {
      height:    400,
    },
    // Continue watching card
    continueWatching: {
      width:     300,
      height:    170,
    },
    // EPG channel row height
    epgChannel: {
      height:    72,
      logoSize:  44,
    },
  },

  // ── FOCUS TARGET ───────────────────────────────────────────────────────
  // Minimum focusable element sizes for TV remote navigation.
  // Smaller than this and users can't tell what's focused.
  focus: {
    minWidth:   48,
    minHeight:  48,
  },

  // ── PLAYER ─────────────────────────────────────────────────────────────
  player: {
    controlsHeight:   100,   // Height of bottom controls bar
    seekBarHeight:      6,   // Height of the seek bar track
    seekThumbSize:     20,   // Diameter of seek bar thumb
    volumeBarWidth:   160,   // Width of volume bar
    channelOverlayW:  320,   // Width of channel info overlay
    channelOverlayH:  100,   // Height of channel info overlay
  },

  // ── EPG ────────────────────────────────────────────────────────────────
  epg: {
    channelColWidth:  240,   // Fixed left column for channel names
    timeHeaderHeight:  48,   // Height of timeline header row
    cellMinWidth:     120,   // Minimum cell width (30-min programme)
    pixelsPerMinute:    4,   // 1 minute = 4px wide in the timeline
    rowHeight:         72,   // Same as card.epgChannel.height
  },

  // ── MODAL ──────────────────────────────────────────────────────────────
  modal: {
    maxWidth:   700,
    maxHeight:  500,
    padding:    Spacing.xl,
  },

  // ── BORDER RADIUS ──────────────────────────────────────────────────────
  // Rounded corners in the Duplex IPTV design.
  // TV UIs use moderate rounding — not too sharp, not too round.
  radius: {
    none:   0,
    xs:     4,
    sm:     8,
    md:     12,
    lg:     16,
    xl:     20,
    '2xl':  24,
    full:   9999,    // Fully circular (badges, avatars)
  },

  // ── ICON SIZES ─────────────────────────────────────────────────────────
  icon: {
    xs:   16,
    sm:   20,
    md:   24,
    lg:   28,
    xl:   32,
    '2xl':40,
    '3xl':48,
  },

  // ── BORDER WIDTHS ──────────────────────────────────────────────────────
  border: {
    thin:   1,
    normal: 2,
    thick:  3,    // Used for focus rings
    heavy:  4,
  },

  // ── SHADOWS ────────────────────────────────────────────────────────────
  // Elevation levels for depth on TV screens
  shadow: {
    sm: {
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius:  4,
      elevation:     4,
    },
    md: {
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius:  8,
      elevation:     8,
    },
    lg: {
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius:  16,
      elevation:     16,
    },
    focus: {
      // Blue glow shadow for focused elements
      shadowColor:   '#1976D2',
      shadowOffset:  { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius:  12,
      elevation:     20,
    },
  },

} as const;


// ─── GRID SYSTEM ─────────────────────────────────────────────────────────────
// Defines column counts for different screen sections.
// These match the Duplex IPTV Figma grid layouts.

export const Grid = {
  // Number of columns in grid views
  channels:   5,   // Live TV channel grid
  movies:     6,   // VOD movie grid
  series:     5,   // Series grid
  search:     6,   // Search results grid

  // Gap between grid items
  gap:        Spacing.md,   // 16px between cards
  rowGap:     Spacing.lg,   // 24px between rows
} as const;


// ─── Z-INDEX SCALE ───────────────────────────────────────────────────────────
// Controls layering. Higher number = on top.
// Named layers prevent z-index conflicts ("z-index wars").

export const ZIndex = {
  base:       0,      // Normal content
  raised:     10,     // Slightly elevated (cards on hover)
  dropdown:   100,    // Dropdown menus
  sidebar:    200,    // Navigation sidebar
  header:     300,    // Top header
  modal:      400,    // Modal dialogs
  overlay:    500,    // Screen overlays
  toast:      600,    // Toast notifications
  player:     700,    // Full-screen player
  playerHUD:  800,    // Player controls (on top of player)
  loading:    900,    // Global loading spinner
} as const;


// ─── ANIMATION DURATIONS ─────────────────────────────────────────────────────
// Consistent animation timing across the app.
// TV animations should be slightly slower than mobile (users sit further away).

export const Duration = {
  instant:   0,     // No animation
  fast:      150,   // Micro-interactions (icon changes)
  normal:    250,   // Standard transitions (focus changes)
  slow:      400,   // Screen transitions, modals
  verySlow:  600,   // Hero animations, splash screen
  epic:      1000,  // Full-page animated transitions
} as const;


// Default export
export default {
  Spacing,
  SafeZone,
  Layout,
  Grid,
  ZIndex,
  Duration,
};
