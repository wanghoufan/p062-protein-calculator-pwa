import { Palette } from './colors';

/**
 * 排版预设。Change B：颜色跟随主题，改为工厂函数由 useTheme() 派生。
 */
export function makeTypography(colors: Palette) {
  return {
    headerTitle: { fontSize: 23, fontWeight: '800' as const, color: colors.textPrimary },
    tagline: { fontSize: 15, fontWeight: '400' as const, color: colors.textSecondary },
    title: { fontSize: 23, fontWeight: '700' as const, color: colors.textPrimary },
    cardTitle: { fontSize: 23, fontWeight: '600' as const, color: colors.textPrimary },
    body: { fontSize: 19, fontWeight: '400' as const, color: colors.textPrimary },
    secondary: { fontSize: 15, fontWeight: '400' as const, color: colors.textSecondary },
    targetNumber: { fontSize: 52, fontWeight: '800' as const, color: colors.primary },
    summaryNumber: { fontSize: 28, fontWeight: '700' as const, color: colors.textPrimary },
  };
}

export type Typography = ReturnType<typeof makeTypography>;
