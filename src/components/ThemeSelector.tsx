import React from 'react';
import { THEMES, ThemeId } from '../types/theme';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelectTheme }) => {
  return (
    <div className="theme-selector-container">
      {(Object.keys(THEMES) as ThemeId[]).map((id) => {
        const theme = THEMES[id];
        const isActive = currentTheme === id;
        return (
          <button
            key={id}
            onClick={() => onSelectTheme(id)}
            className={`theme-pill-btn ${isActive ? 'active' : ''}`}
            title={`Switch to ${theme.name}`}
            style={{
              borderColor: isActive ? theme.primary : 'transparent',
            }}
          >
            <span
              className="theme-dot"
              style={{
                backgroundColor: theme.primary,
                boxShadow: isActive ? `0 0 8px ${theme.primary}` : 'none',
              }}
            />
            <span className="theme-name-label">{theme.name}</span>
          </button>
        );
      })}
    </div>
  );
};
