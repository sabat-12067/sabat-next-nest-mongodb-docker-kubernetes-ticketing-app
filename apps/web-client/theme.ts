import { MantineColorsTuple, createTheme } from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#f3edff',
  '#e0d7fa',
  '#beabf0',
  '#9a7ce6',
  '#7c56de',
  '#683dd9',
  '#5f2fd8',
  '#4f23c0',
  '#451eac',
  '#3a1899',
];

export const theme = createTheme({
  colors: {
    myColor,
  },
});
