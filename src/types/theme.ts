export type ThemeId = 'cyan' | 'nitro' | 'toxic' | 'cyberpunk' | 'stealth';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  primary: string;
  secondary: string;
  glow: string;
  gradient: string;
  cardBorderGlow: string;
  badgeBg: string;
  accentText: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Cyan Pulse',
    primary: '#00f0ff',
    secondary: '#0077fe',
    glow: 'rgba(0, 240, 255, 0.45)',
    gradient: 'linear-gradient(135deg, #00f0ff 0%, #0077fe 100%)',
    cardBorderGlow: 'rgba(0, 240, 255, 0.25)',
    badgeBg: 'rgba(0, 240, 255, 0.12)',
    accentText: '#00f0ff',
  },
  nitro: {
    id: 'nitro',
    name: 'Nitro Red',
    primary: '#ff2a4b',
    secondary: '#ff7700',
    glow: 'rgba(255, 42, 75, 0.45)',
    gradient: 'linear-gradient(135deg, #ff2a4b 0%, #ff7700 100%)',
    cardBorderGlow: 'rgba(255, 42, 75, 0.25)',
    badgeBg: 'rgba(255, 42, 75, 0.12)',
    accentText: '#ff2a4b',
  },
  toxic: {
    id: 'toxic',
    name: 'Razer Green',
    primary: '#00ff66',
    secondary: '#059669',
    glow: 'rgba(0, 255, 102, 0.45)',
    gradient: 'linear-gradient(135deg, #00ff66 0%, #059669 100%)',
    cardBorderGlow: 'rgba(0, 255, 102, 0.25)',
    badgeBg: 'rgba(0, 255, 102, 0.12)',
    accentText: '#00ff66',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyber Purple',
    primary: '#d946ef',
    secondary: '#8b5cf6',
    glow: 'rgba(217, 70, 239, 0.45)',
    gradient: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
    cardBorderGlow: 'rgba(217, 70, 239, 0.25)',
    badgeBg: 'rgba(217, 70, 239, 0.12)',
    accentText: '#d946ef',
  },
  stealth: {
    id: 'stealth',
    name: 'Stealth Silver',
    primary: '#f3f4f6',
    secondary: '#9ca3af',
    glow: 'rgba(243, 244, 246, 0.35)',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)',
    cardBorderGlow: 'rgba(255, 255, 255, 0.2)',
    badgeBg: 'rgba(255, 255, 255, 0.1)',
    accentText: '#f3f4f6',
  },
};
