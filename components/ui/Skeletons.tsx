import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Skeleton } from './Skeleton';
import { xdHeight, xdWidth, scale } from '@/constants/scaling';
import { Spacing, Colors } from '@/constants';

interface SkeletonGridProps {
  rows?: number;
  columns?: number;
  width?: number;
  height?: number;
  spacing?: number;
  style?: ViewStyle;
}

export const PosterCardSkeleton: React.FC<{ width?: number; height?: number; style?: ViewStyle }> = ({
  width = xdWidth(160),
  height = xdHeight(240),
  style,
}) => (
  <View style={[styles.posterContainer, { width }, style]}>
    <Skeleton width={width} height={height} borderRadius={12} />
    <View style={styles.posterInfo}>
      <Skeleton width="80%" height={scale(14)} borderRadius={4} style={{ marginBottom: 4 }} />
      <Skeleton width="50%" height={scale(12)} borderRadius={4} />
    </View>
  </View>
);

export const BackdropCardSkeleton: React.FC<{ width?: number; height?: number; style?: ViewStyle }> = ({
  width = xdWidth(200),
  height = xdHeight(110),
  style,
}) => (
  <View style={[styles.backdropContainer, { width }, style]}>
    <Skeleton width={width} height={height} borderRadius={12} />
    <View style={styles.backdropInfo}>
      <Skeleton width="50%" height={scale(14)} borderRadius={4} />
      <Skeleton width="40%" height={scale(12)} borderRadius={4} />
    </View>
  </View>
);

export const CategoryButtonSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <Skeleton
    width={xdWidth(100)}
    height={xdHeight(40)}
    borderRadius={20}
    style={[{ marginRight: xdWidth(8) }, style]}
  />
);

export const HeroSkeleton: React.FC = () => (
  <View style={styles.heroContainer}>
    <Skeleton width="100%" height={xdHeight(280)} borderRadius={0} />
    <View style={styles.heroOverlay}>
      <Skeleton width="30%" height={scale(14)} borderRadius={4} style={{ marginBottom: 12 }} />
      <Skeleton width="60%" height={scale(32)} borderRadius={8} style={{ marginBottom: 16 }} />
      <Skeleton width="80%" height={scale(14)} borderRadius={4} style={{ marginBottom: 8 }} />
      <Skeleton width="75%" height={scale(14)} borderRadius={4} style={{ marginBottom: 24 }} />
      <View style={{ flexDirection: 'row' }}>
        <Skeleton width={xdWidth(120)} height={xdHeight(45)} borderRadius={8} style={{ marginRight: 16 }} />
        <Skeleton width={xdWidth(120)} height={xdHeight(45)} borderRadius={8} />
      </View>
    </View>
  </View>
);

export const PosterGridSkeleton: React.FC<SkeletonGridProps> = ({
  rows = 2,
  columns = 6,
  width = xdWidth(160),
  height = xdHeight(240),
  style,
}) => (
  <View style={[styles.grid, style]}>
    {Array.from({ length: rows * columns }).map((_, i) => (
      <PosterCardSkeleton key={i} width={width} height={height} style={styles.gridItem} />
    ))}
  </View>
);

export const BackdropGridSkeleton: React.FC<SkeletonGridSkeletonProps> = ({
  rows = 2,
  columns = 5,
  width = xdWidth(160),
  height = xdHeight(90),
  style,
}) => (
  <View style={[styles.grid, style]}>
    {Array.from({ length: rows * columns }).map((_, i) => (
      <BackdropCardSkeleton key={i} width={width} height={height} style={styles.gridItemBackdrop} />
    ))}
  </View>
);

export const PlaylistCardSkeleton: React.FC = () => (
  <View style={styles.playlistCard}>
    <Skeleton width={scale(40)} height={scale(40)} borderRadius={8} style={{ marginRight: 12 }} />
    <View style={{ flex: 1 }}>
      <Skeleton width="60%" height={scale(16)} borderRadius={4} style={{ marginBottom: 4 }} />
      <Skeleton width="40%" height={scale(12)} borderRadius={4} />
    </View>
  </View>
);

export const HistoryCardSkeleton: React.FC = () => (
  <View style={styles.historyCard}>
    <Skeleton width={xdWidth(140)} height={xdHeight(80)} borderRadius={8} style={{ marginRight: xdWidth(16) }} />
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Skeleton width="70%" height={scale(16)} borderRadius={4} style={{ marginBottom: xdHeight(8) }} />
      <Skeleton width="40%" height={scale(12)} borderRadius={4} />
    </View>
  </View>
);

export const HistoryGridSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <View style={styles.grid}>
    {Array.from({ length: rows * 2 }).map((_, i) => (
      <View key={i} style={{ width: '48%', marginBottom: xdHeight(20) }}>
        <HistoryCardSkeleton />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  posterContainer: {
    marginBottom: Spacing.md,
  },
  posterInfo: {
    marginTop: Spacing.xs,
  },
  backdropContainer: {
    marginBottom: Spacing.xxs,
    padding: 4,
  },
  backdropInfo: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroContainer: {
    height: xdHeight(280),
    marginBottom: xdHeight(24),
    position: 'relative',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: xdWidth(40),
    paddingTop: xdHeight(50),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: xdHeight(24),
  },
  gridItemBackdrop: {
    marginBottom: xdHeight(16),
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(12),
    backgroundColor: Colors.dark[10],
    borderWidth: 1.5,
    borderColor: Colors.dark[8],
    marginBottom: scale(12),
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    borderRadius: scale(12),
    backgroundColor: Colors.dark[10],
    borderWidth: 1.5,
    borderColor: Colors.dark[8],
  },
});
