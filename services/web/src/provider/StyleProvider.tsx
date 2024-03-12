'use client';

import { Client as Styletron } from 'styletron-engine-monolithic';
import { Provider as StyleProvider } from 'styletron-react';
import { createLightTheme } from 'baseui/themes';
import { BaseProvider, Theme } from 'baseui';
import { DeepPartial } from 'baseui/styles';

const styleEngine = new Styletron();

const typographyKeys: string[] = [
  'font100',
  'font150',
  'font200',
  'font250',
  'font300',
  'font350',
  'font400',
  'font450',
  'font550',
  'font650',
  'font750',
  'font850',
  'font950',
  'font1050',
  'font1150',
  'font1250',
  'font1350',
  'font1450',
  'ParagraphXSmall',
  'ParagraphSmall',
  'ParagraphMedium',
  'ParagraphLarge',
  'LabelXSmall',
  'LabelSmall',
  'LabelMedium',
  'LabelLarge',
  'HeadingXSmall',
  'HeadingSmall',
  'HeadingMedium',
  'HeadingLarge',
  'HeadingXLarge',
  'HeadingXXLarge',
  'DisplayXSmall',
  'DisplaySmall',
  'DisplayMedium',
  'DisplayLarge',
  'MonoParagraphXSmall',
  'MonoParagraphSmall',
  'MonoParagraphMedium',
  'MonoParagraphLarge',
  'MonoLabelXSmall',
  'MonoLabelSmall',
  'MonoLabelMedium',
  'MonoLabelLarge',
  'MonoHeadingXSmall',
  'MonoHeadingSmall',
  'MonoHeadingMedium',
  'MonoHeadingLarge',
  'MonoHeadingXLarge',
  'MonoHeadingXXLarge',
  'MonoDisplayXSmall',
  'MonoDisplaySmall',
  'MonoDisplayMedium',
  'MonoDisplayLarge',
];

export default function StyleProviderProvider({ font: interFont, children }) {
  const themeOverrides: DeepPartial<Theme> = {
    typography: Object.fromEntries(
      typographyKeys.map((fontType) => [fontType, interFont.style.fontFamily]),
    ),
  };
  const theme = createLightTheme(themeOverrides);

  return (
    <>
      <StyleProvider value={styleEngine}>
        <BaseProvider theme={theme}>{children}</BaseProvider>
      </StyleProvider>
    </>
  );
}
