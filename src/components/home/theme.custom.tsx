// theme.ts
import { DefaultTheme } from "styled-components";

interface CustomTheme extends DefaultTheme {
  spacing: (factor: number) => string;
  transitions: {
    easing: {
      sharp: string;
      easeOut: string;
    };
    duration: {
      leavingScreen: string;
      enteringScreen: string;
    };
  };
  // ... other properties
}

const theme: CustomTheme = {
  spacing: (factor) => `${factor * 8}px`,
  transitions: {
    easing: {
      sharp: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    },
    duration: {
      leavingScreen: "225ms",
      enteringScreen: "195ms",
    },
  },
  // ... other properties
};

export default CustomTheme;
