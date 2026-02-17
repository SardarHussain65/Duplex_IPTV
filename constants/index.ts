/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Constants Index (Barrel Export)
 * ─────────────────────────────────────────────────────────────
 *
 *  WHY A BARREL EXPORT (index.ts)?
 *  Instead of importing from multiple files like this:
 *    import { Colors }   from '@constants/colors';
 *    import { Spacing }  from '@constants/spacing';
 *    import { FontSize } from '@constants/typography';
 *
 *  You can import everything from ONE place:
 *    import { Colors, Spacing, FontSize } from '@constants';
 *
 *  This is the "barrel export" pattern — one file that
 *  re-exports everything from all the constant files.
 * ─────────────────────────────────────────────────────────────
 */

// Colors
export { colors as Colors } from './colors';

// Typography
export {
  FontFamily, FontSize, FontWeight, LetterSpacing, LineHeight, TextStyle
} from './typography';

// Spacing & Layout
export {
  Duration, Grid, Layout, SafeZone, Spacing, ZIndex
} from './spacing';

