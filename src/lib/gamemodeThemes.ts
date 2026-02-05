export type GamemodeTheme = 'orange' | 'emerald' | 'purple';

export type ThemeClasses = {
  // Base colors
  bg: string;
  bgHover: string;
  bgLight: string;
  bgSubtle: string;
  text: string;
  textLight: string;
  textDark: string;
  border: string;
  borderSubtle: string;

  // Interactive states
  hover: string;
  hoverText: string;
  hoverBg: string;

  // Shadows & rings
  shadow: string;
  shadowSubtle: string;
  ring: string;

  // Gradients
  gradientLine: string;
  gradientOverlay: string;

  // Button variants
  buttonPrimary: string;
  buttonPrimaryHover: string;

  // Score display (when winning)
  scoreWinner: string;
  scoreLoser: string;

  // Points display
  pointsText: string;

  // Icon colors
  iconAccent: string;
  iconMuted: string;

  // Table/list styling
  rowHighlight: string;
  rowHover: string;
  headerBorder: string;
};

export const gamemodeThemes: Record<GamemodeTheme, ThemeClasses> = {
  orange: {
    // Base colors
    bg: 'bg-orange-500',
    bgHover: 'bg-orange-600',
    bgLight: 'bg-orange-500/10',
    bgSubtle: 'bg-orange-500/5',
    text: 'text-orange-500',
    textLight: 'text-orange-400',
    textDark: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/20',
    borderSubtle: 'border-orange-500/10',

    // Interactive states
    hover: 'hover:bg-orange-500/10',
    hoverText: 'hover:text-orange-500',
    hoverBg: 'hover:bg-orange-500/20',

    // Shadows & rings
    shadow: 'hover:shadow-orange-500/10',
    shadowSubtle: 'hover:shadow-orange-500/5',
    ring: 'ring-green-500/10',

    // Gradients
    gradientLine: 'bg-linear-to-r from-orange-400 via-orange-500 to-orange-500',
    gradientOverlay: 'bg-linear-to-br from-orange-500/5 via-transparent to-transparent',

    // Button variants
    buttonPrimary: 'bg-orange-500 text-white',
    buttonPrimaryHover: 'hover:bg-orange-600',

    // Score display
    scoreWinner: 'text-orange-500',
    scoreLoser: 'text-muted-foreground/50',

    // Points display
    pointsText: 'text-orange-500',

    // Icon colors
    iconAccent: 'text-orange-500',
    iconMuted: 'text-orange-500/70',

    // Table/list styling
    rowHighlight: 'bg-orange-500/5',
    rowHover: 'hover:bg-orange-500/5',
    headerBorder: 'border-orange-500/20',
  },
  emerald: {
    // Base colors
    bg: 'bg-emerald-500',
    bgHover: 'bg-emerald-600',
    bgLight: 'bg-emerald-500/10',
    bgSubtle: 'bg-emerald-500/5',
    text: 'text-emerald-500',
    textLight: 'text-emerald-400',
    textDark: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
    borderSubtle: 'border-emerald-500/10',

    // Interactive states
    hover: 'hover:bg-emerald-500/10',
    hoverText: 'hover:text-emerald-500',
    hoverBg: 'hover:bg-emerald-500/20',

    // Shadows & rings
    shadow: 'hover:shadow-emerald-500/10',
    shadowSubtle: 'hover:shadow-emerald-500/5',
    ring: 'ring-emerald-500/10',

    // Gradients
    gradientLine: 'bg-linear-to-r from-emerald-400 via-emerald-500 to-teal-500',
    gradientOverlay: 'bg-linear-to-br from-emerald-500/5 via-transparent to-transparent',

    // Button variants
    buttonPrimary: 'bg-emerald-500 text-white',
    buttonPrimaryHover: 'hover:bg-emerald-600',

    // Score display
    scoreWinner: 'text-emerald-500',
    scoreLoser: 'text-muted-foreground/50',

    // Points display
    pointsText: 'text-emerald-500',

    // Icon colors
    iconAccent: 'text-emerald-500',
    iconMuted: 'text-emerald-500/70',

    // Table/list styling
    rowHighlight: 'bg-emerald-500/5',
    rowHover: 'hover:bg-emerald-500/5',
    headerBorder: 'border-emerald-500/20',
  },
  purple: {
    // Base colors
    bg: 'bg-purple-500',
    bgHover: 'bg-purple-600',
    bgLight: 'bg-purple-500/10',
    bgSubtle: 'bg-purple-500/5',
    text: 'text-purple-500',
    textLight: 'text-purple-400',
    textDark: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/20',
    borderSubtle: 'border-purple-500/10',

    // Interactive states
    hover: 'hover:bg-purple-500/10',
    hoverText: 'hover:text-purple-500',
    hoverBg: 'hover:bg-purple-500/20',

    // Shadows & rings
    shadow: 'hover:shadow-purple-500/10',
    shadowSubtle: 'hover:shadow-purple-500/5',
    ring: 'ring-purple-500/10',

    // Gradients
    gradientLine: 'bg-linear-to-r from-purple-400 via-purple-500 to-violet-500',
    gradientOverlay: 'bg-linear-to-br from-purple-500/5 via-transparent to-transparent',

    // Button variants
    buttonPrimary: 'bg-purple-500 text-white',
    buttonPrimaryHover: 'hover:bg-purple-600',

    // Score display
    scoreWinner: 'text-purple-500',
    scoreLoser: 'text-muted-foreground/50',

    // Points display
    pointsText: 'text-purple-500',

    // Icon colors
    iconAccent: 'text-purple-500',
    iconMuted: 'text-purple-500/70',

    // Table/list styling
    rowHighlight: 'bg-purple-500/5',
    rowHover: 'hover:bg-purple-500/5',
    headerBorder: 'border-purple-500/20',
  },
};

// Convenience export for direct access to themes
export const predictorTheme = gamemodeThemes.orange;
export const fantasyTheme = gamemodeThemes.emerald;
export const boosterTheme = gamemodeThemes.purple;
