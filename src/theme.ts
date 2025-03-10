// Theme file with color palette based on the provided image

export const colors = {
  // Primary colors from the image
  brown: '#705252',
  red: '#cc5a5a',
  cream: '#f5e7e7',
  salmon: '#e28989',
  lightPink: '#f3bcbc',
  veryLightPink: '#fadddd',
  offWhite: '#fff9f9',
  white: '#ffffff',
  
  // Semantic color assignments
  primary: '#cc5a5a',      // Red - for primary elements and emphasis
  secondary: '#e28989',    // Salmon - for secondary elements
  accent: '#705252',       // Brown - for accents and highlights
  neutral: '#f3bcbc',      // Light pink - for neutral elements
  background: '#fff9f9',   // Off-white - for backgrounds
  darkBackground: '#f5e7e7', // Cream - for darker backgrounds or containers
  text: '#705252',         // Brown - for main text
  textSecondary: '#cc5a5a', // Red - for secondary text
  success: '#705252',      // Brown - for success states
  warning: '#e28989',      // Salmon - for warning states
  error: '#cc5a5a',        // Red - for error states
  
  // Additional properties for backward compatibility
  darkAccent: '#e28989',   // Salmon - for dark accents (previously used in legislativeGap)
  lightAccent: '#f3bcbc',  // Light pink - for light accents (previously used in legislativeGap)
};

// Export a dark theme variant that inverts some colors for better contrast
export const darkColors = {
  ...colors,
  background: '#705252',   // Brown - for dark mode background
  darkBackground: '#cc5a5a', // Red - for darker containers in dark mode
  text: '#fff9f9',         // Off-white - for main text in dark mode
  textSecondary: '#fadddd', // Very light pink - for secondary text in dark mode
}; 