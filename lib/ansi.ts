/**
 * A 24-bit RGB color definition.
 */
interface Color { r: number | null, g: number | null, b: number | null };

/**
 * A text style definition.
 */
interface Style { bold: boolean | null, italic: boolean | null, underline: boolean | null };

/**
 * Used by parseColorInput() as a lookup table for official web colors.
 */
const WebColors: { [index: string]: Color } = {
  aliceblue: { r: 0xf0, g: 0xf8, b: 0xff },
  antiquewhite: { r: 0xfa, g: 0xeb, b: 0xd7 },
  aqua: { r: 0, g: 0xff, b: 0xff },
  aquamarine: { r: 0x7f, g: 0xff, b: 0xd4 },
  azure: { r: 0xf0, g: 0xff, b: 0xff },
  beige: { r: 0xf5, g: 0xf5, b: 0xdc },
  bisque: { r: 0xff, g: 0xe4, b: 0xc4 },
  black: { r: 0, g: 0, b: 0 },
  blanchedalmond: { r: 0xff, g: 0xeb, b: 0xcd },
  blue: { r: 0, g: 0, b: 0xff },
  blueviolet: { r: 0x8a, g: 0x2b, b: 0xe2 },
  brown: { r: 0xa5, g: 0x2a, b: 0x2a },
  burlywood: { r: 0xde, g: 0xb8, b: 0x87 },
  cadetblue: { r: 0x5f, g: 0x9e, b: 0xa0 },
  chartreuse: { r: 0x7f, g: 0xff, b: 0 },
  chocolate: { r: 0xd2, g: 0x69, b: 0x1e },
  coral: { r: 0xff, g: 0x7f, b: 0x50 },
  cornflowerblue: { r: 0x64, g: 0x95, b: 0xed },
  cornsilk: { r: 0xff, g: 0xf8, b: 0xdc },
  crimson: { r: 0xdc, g: 0x14, b: 0x3c },
  cyan: { r: 0, g: 0xff, b: 0xff },
  darkblue: { r: 0, g: 0, b: 0x8b },
  darkcyan: { r: 0, g: 0x8b, b: 0x8b },
  darkgoldenrod: { r: 0xb8, g: 0x86, b: 0x0b },
  darkgray: { r: 0xa9, g: 0xa9, b: 0xa9 },
  darkgrey: { r: 0xa9, g: 0xa9, b: 0xa9 },
  darkgreen: { r: 0, g: 0x64, b: 0 },
  darkkhaki: { r: 0xbd, g: 0xb7, b: 0x6b },
  darkmagenta: { r: 0x8b, g: 0, b: 0x8b },
  darkolivegreen: { r: 0x55, g: 0x6b, b: 0x2f },
  darkorange: { r: 0xff, g: 0x8c, b: 0 },
  darkorchid: { r: 0x99, g: 0x32, b: 0xcc },
  darkred: { r: 0x8b, g: 0, b: 0 },
  darksalmon: { r: 0xe9, g: 0x96, b: 0x7a },
  darkseagreen: { r: 0x8f, g: 0xbc, b: 0x8f },
  darkslateblue: { r: 0x48, g: 0x3d, b: 0x8b },
  darkslategray: { r: 0x2f, g: 0x4f, b: 0x4f },
  darkslategrey: { r: 0x2f, g: 0x4f, b: 0x4f },
  darkturquoise: { r: 0, g: 0xce, b: 0xd1 },
  darkviolet: { r: 0x94, g: 0, b: 0xd3 },
  deeppink: { r: 0xff, g: 0x14, b: 0x93 },
  deepskyblue: { r: 0, g: 0xbf, b: 0xff },
  dimgray: { r: 0x69, g: 0x69, b: 0x69 },
  dimgrey: { r: 0x69, g: 0x69, b: 0x69 },
  dodgerblue: { r: 0x1e, g: 0x90, b: 0xff },
  firebrick: { r: 0xb2, g: 0x22, b: 0x22 },
  floralwhite: { r: 0xff, g: 0xfa, b: 0xf0 },
  forestgreen: { r: 0x22, g: 0x8b, b: 0x22 },
  fuchsia: { r: 0xff, g: 0, b: 0xff },
  gainsboro: { r: 0xdc, g: 0xdc, b: 0xdc },
  ghostwhite: { r: 0xf8, g: 0xf8, b: 0xff },
  gold: { r: 0xff, g: 0xd7, b: 0 },
  goldenrod: { r: 0xda, g: 0xa5, b: 0x20 },
  gray: { r: 0x80, g: 0x80, b: 0x80 },
  grey: { r: 0x80, g: 0x80, b: 0x80 },
  green: { r: 0, g: 0x80, b: 0 },
  greenyellow: { r: 0xad, g: 0xff, b: 0x2f },
  honeydew: { r: 0xf0, g: 0xff, b: 0xf0 },
  hotpink: { r: 0xff, g: 0x69, b: 0xb4 },
  indianred: { r: 0xcd, g: 0x5c, b: 0x5c },
  indigo: { r: 0x4b, g: 0, b: 0x82 },
  ivory: { r: 0xff, g: 0xff, b: 0xf0 },
  khaki: { r: 0xf0, g: 0xe6, b: 0x8c },
  lavender: { r: 0xe6, g: 0xe6, b: 0xfa },
  lavenderblush: { r: 0xff, g: 0xf0, b: 0xf5 },
  lawngreen: { r: 0x7c, g: 0xfc, b: 0 },
  lemonchiffon: { r: 0xff, g: 0xfa, b: 0xcd },
  lightblue: { r: 0xad, g: 0xd8, b: 0xe6 },
  lightcoral: { r: 0xf0, g: 0x80, b: 0x80 },
  lightcyan: { r: 0xe0, g: 0xff, b: 0xff },
  lightgoldenrodyellow: { r: 0xfa, g: 0xfa, b: 0xd2 },
  lightgray: { r: 0xd3, g: 0xd3, b: 0xd3 },
  lightgrey: { r: 0xd3, g: 0xd3, b: 0xd3 },
  lightgreen: { r: 0x90, g: 0xee, b: 0x90 },
  lightpink: { r: 0xff, g: 0xb6, b: 0xc1 },
  lightsalmon: { r: 0xff, g: 0xa0, b: 0x7a },
  lightseagreen: { r: 0x20, g: 0xb2, b: 0xaa },
  lightskyblue: { r: 0x87, g: 0xce, b: 0xfa },
  lightslategray: { r: 0x77, g: 0x88, b: 0x99 },
  lightslategrey: { r: 0x77, g: 0x88, b: 0x99 },
  lightsteelblue: { r: 0xb0, g: 0xc4, b: 0xde },
  lightyellow: { r: 0xff, g: 0xff, b: 0xe0 },
  lime: { r: 0, g: 0xff, b: 0 },
  limegreen: { r: 0x32, g: 0xcd, b: 0x32 },
  linen: { r: 0xfa, g: 0xf0, b: 0xe6 },
  magenta: { r: 0xff, g: 0, b: 0xff },
  maroon: { r: 0x80, g: 0, b: 0 },
  mediumaquamarine: { r: 0x66, g: 0xcd, b: 0xaa },
  mediumblue: { r: 0, g: 0, b: 0xcd },
  mediumorchid: { r: 0xba, g: 0x55, b: 0xd3 },
  mediumpurple: { r: 0x93, g: 0x70, b: 0xdb },
  mediumseagreen: { r: 0x3c, g: 0xb3, b: 0x71 },
  mediumslateblue: { r: 0x7b, g: 0x68, b: 0xee },
  mediumspringgreen: { r: 0, g: 0xfa, b: 0x9a },
  mediumturquoise: { r: 0x48, g: 0xd1, b: 0xcc },
  mediumvioletred: { r: 0xc7, g: 0x15, b: 0x85 },
  midnightblue: { r: 0x19, g: 0x19, b: 0x70 },
  mintcream: { r: 0xf5, g: 0xff, b: 0xfa },
  mistyrose: { r: 0xff, g: 0xe4, b: 0xe1 },
  moccasin: { r: 0xff, g: 0xe4, b: 0xb5 },
  navajowhite: { r: 0xff, g: 0xde, b: 0xad },
  navy: { r: 0, g: 0, b: 0x80 },
  oldlace: { r: 0xfd, g: 0xf5, b: 0xe6 },
  olive: { r: 0x80, g: 0x80, b: 0 },
  olivedrab: { r: 0x6b, g: 0x8e, b: 0x23 },
  orange: { r: 0xff, g: 0xa5, b: 0 },
  orangered: { r: 0xff, g: 0x45, b: 0 },
  orchid: { r: 0xda, g: 0x70, b: 0xd6 },
  palegoldenrod: { r: 0xee, g: 0xe8, b: 0xaa },
  palegreen: { r: 0x98, g: 0xfb, b: 0x98 },
  paleturquoise: { r: 0xaf, g: 0xee, b: 0xee },
  palevioletred: { r: 0xdb, g: 0x70, b: 0x93 },
  papayawhip: { r: 0xff, g: 0xef, b: 0xd5 },
  peachpuff: { r: 0xff, g: 0xda, b: 0xb9 },
  peru: { r: 0xcd, g: 0x85, b: 0x3f },
  pink: { r: 0xff, g: 0xc0, b: 0xcb },
  plum: { r: 0xdd, g: 0xa0, b: 0xdd },
  powderblue: { r: 0xb0, g: 0xe0, b: 0xe6 },
  purple: { r: 0x80, g: 0, b: 0x80 },
  rebeccapurple: { r: 0x66, g: 0x33, b: 0x99 },
  red: { r: 0xff, g: 0, b: 0 },
  rosybrown: { r: 0xbc, g: 0x8f, b: 0x8f },
  royalblue: { r: 0x41, g: 0x69, b: 0xe1 },
  saddlebrown: { r: 0x8b, g: 0x45, b: 0x13 },
  salmon: { r: 0xfa, g: 0x80, b: 0x72 },
  sandybrown: { r: 0xf4, g: 0xa4, b: 0x60 },
  seagreen: { r: 0x2e, g: 0x8b, b: 0x57 },
  seashell: { r: 0xff, g: 0xf5, b: 0xee },
  sienna: { r: 0xa0, g: 0x52, b: 0x2d },
  silver: { r: 0xc0, g: 0xc0, b: 0xc0 },
  skyblue: { r: 0x87, g: 0xce, b: 0xeb },
  slateblue: { r: 0x6a, g: 0x5a, b: 0xcd },
  slategray: { r: 0x70, g: 0x80, b: 0x90 },
  slategrey: { r: 0x70, g: 0x80, b: 0x90 },
  snow: { r: 0xff, g: 0xfa, b: 0xfa },
  springgreen: { r: 0, g: 0xff, b: 0x7f },
  steelblue: { r: 0x46, g: 0x82, b: 0xb4 },
  tan: { r: 0xd2, g: 0xb4, b: 0x8c },
  teal: { r: 0, g: 0x80, b: 0x80 },
  thistle: { r: 0xd8, g: 0xbf, b: 0xd8 },
  tomato: { r: 0xff, g: 0x63, b: 0x47 },
  turquoise: { r: 0x40, g: 0xe0, b: 0xd0 },
  violet: { r: 0xee, g: 0x82, b: 0xee },
  wheat: { r: 0xf5, g: 0xde, b: 0xb3 },
  white: { r: 0xff, g: 0xff, b: 0xff },
  whitesmoke: { r: 0xf5, g: 0xf5, b: 0xf5 },
  yellow: { r: 0xff, g: 0xff, b: 0 },
  yellowgreen: { r: 0x9a, g: 0xcd, b: 0x32 },
};

/**
 * Converts HSL to RGB
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Luminance (0-100)
 * @returns A 24-bit RGB color object.
 */
const hsl2rgb = (h: number, s: number, l: number): Color => {
  // Normalize values to 0-1
  s /= 100;
  l /= 100;

  const k = (n: number): number => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number): number => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4))
  };
};

/**
 * Centers a string within a given length.
 * @param str String to center.
 * @param maxLen Length to center within.
 * @returns Centered string.
 */
const center = (str: string, maxLen: number): string => (
  str.padStart(Math.ceil((str.length + maxLen) / 2)).padEnd(maxLen)
);

/**
 * Creates a Color object from the supplied argument.
 * @param input Data to parse.
 * @returns A 24-bit Color object.
 */
const parseColorInput = (input: any): Color => {
  // 8-bit input mask
  const mask = (num: number): number => num & 0xFF;

  // Default error message
  let errMessage = `Unusable Data! ***\n${center(JSON.stringify(input), 14)}`;

  if (input === undefined || input === null) {
    return { r: null, g: null, b: null };
  }
  switch (typeof input) {
    case "string":
      if (input[0] === '#') {
        // Process as a hex string
        if (input.length === 4) {
          return {
            r: parseInt(input[1], 16) * 0x11,
            g: parseInt(input[2], 16) * 0x11,
            b: parseInt(input[3], 16) * 0x11,
          };
        } else if (input.length === 7) {
          return {
            r: parseInt(input.substring(1, 3), 16),
            g: parseInt(input.substring(3, 5), 16),
            b: parseInt(input.substring(5, 7), 16),
          };
        }
        // Unusable
        errMessage = `Bad Format ***\n` +
          `    "${input}"\n\n` +
          `- Valid formatting -\n` +
          `3 digit short form:\n` +
          `     "#RGB"\n` +
          `6 digit long form:\n` +
          `    "#RRGGBB"\n\n` +
          `Hex code must start with '#'\n`;
      } else {
        // Process as a web color name
        const color = WebColors[input.toLowerCase()];
        if (color) {
          return color;
        }
        errMessage = `Not a WebColor ***\n` +
          center(`"${input}"`, 22);
      }
      break;
    case "object":
      if (input.r !== undefined) {
        if (input.r === null) {
          return { r: null, g: null, b: null };
        } else if (
          typeof input.r === "number" &&
          typeof input.g === "number" &&
          typeof input.b === "number"
        ) {
          // Process as a Color object
          return {
            r: mask(input.r),
            g: mask(input.g),
            b: mask(input.b),
          };
        }
      } else if (typeof input[0] === "number") {
        if (
          input.length > 2 &&
          typeof input[1] === "number" &&
          typeof input[2] === "number"
        ) {
          // Process as an RGB number array
          return {
            r: mask(input[0]),
            g: mask(input[1]),
            b: mask(input[2]),
          };
        }
        // Bad array
        errMessage = `Bad Number Array ***\n` +
          center(`${JSON.stringify(input)}`, 23);
        break;
      }
      errMessage = `Bad Color Object ***\n` +
        `${center(JSON.stringify(input), 23)}\n\n` +
        ` - Valid Color Object -\n` +
        `{ r: number, g: number, b: number }`;
    // Fall through
    default:
    // Can't do anything with the data as provided
  }
  // Throw data error
  throw new Error(`\n\n*** ${errMessage}\n`);
};

/**
 * Creates a Style object from the supplied argument.
 * @param input Data to parse.
 * @returns A Style object.
 */
const parseStyleInput = (input: any): Style => {
  // Default error message
  let errMessage = `Unusable Data! ***\n${center(JSON.stringify(input), 14)}`;

  if (input === undefined || input === null) {
    return { bold: null, italic: null, underline: null };
  }

  switch (typeof input) {
    case "string":
      // Process as an string list
      const list = input.toLowerCase();
      if (
        list.includes("bold") ||
        list.includes("italic") ||
        list.includes("underline")
      ) {
        return {
          bold: list.includes("bold"),
          italic: list.includes("italic"),
          underline: list.includes("underline"),
        };
      }
      errMessage = `Bad String List ***\n` +
        `${center(JSON.stringify(input), 23)}`;
      break;
    case "object":
      if (input.bold !== undefined) {
        if (input.bold === null) {
          return { bold: null, italic: null, underline: null };
        } else if (
          typeof input.bold === "boolean" &&
          typeof input.italic === "boolean" &&
          typeof input.underline === "boolean"
        ) {
          // Process as a Style object
          return {
            bold: input.bold,
            italic: input.italic,
            underline: input.underline,
          };
        }
      } else if (typeof input[0] === "boolean") {
        if (
          input.length > 2 &&
          typeof input[1] === "boolean" &&
          typeof input[2] === "boolean"
        ) {
          // Process as a boolean array
          return {
            bold: input[0],
            italic: input[1],
            underline: input[2],
          };
        }
        // Bad list
        errMessage = `Bad Boolean Array ***\n` +
          center(`${JSON.stringify(input)}`, 15);
        break;
      }
      errMessage = `Bad Style Object ***\n` +
        `${center(JSON.stringify(input), 24)}\n\n` +
        ` - Valid Style Object -\n` +
        `{ bold: boolean, italic: boolean, underline: boolean }`;
    // Fall through
    default:
  }
  // Throw data error
  throw new Error(`\n\n*** ${errMessage}\n`);
};

/**
 * Creates a zero padded number string.
 * @param num Number to pad.
 * @returns A number string, zero padded to 3 characters.
 */
const pad = (num: number): string => (num ?? 0).toString().padStart(3, '0');

/**
 * Creates an ansi escape sequence out of the supplied argument(s).
 * @param textcolor Foreground color.
 * @param background Background color.
 * @param style Bold, italic, and/or underline.
 * @returns An ansi escape string, zero padded to 41 characters.
 */
export function ansiEsc(
  textcolor: any = { r: null, g: null, b: null },
  background: any = { r: null, g: null, b: null },
  style: any = { bold: false, italic: false, underline: false },
): string {
  const text = parseColorInput(textcolor);
  const back = parseColorInput(background);
  const sty = parseStyleInput(style);

  return `\x1b[` + // escape sequence initiator
    // style
    `${sty.bold ? 1 : 0};` +
    `${sty.italic ? 3 : 0};` +
    `${sty.underline ? 4 : 0};` +
    // textcolor
    `${text.r === null ? "00;0;000;000;000"
      : "38;2;" +
      `${pad(text.r!)};` +
      `${pad(text.g!)};` +
      `${pad(text.b!)}`};` +
    // background
    `${back.r === null ? "00;0;000;000;000"
      : "48;2;" +
      `${pad(back.r!)};` +
      `${pad(back.g!)};` +
      `${pad(back.b!)}`}` +
    'm'; // sequence terminator
}

/**
 * Creates an ansi escape sequence from the supplied argument.
 * @param textcolor Foreground color.
 * @returns An ansi escape string, zero padded to 19 characters.
 */
export function color(textcolor: any = { r: null, g: null, b: null }): string {
  const text = parseColorInput(textcolor);

  return `\x1b[` + // escape sequence initiator
    // textcolor
    `${text.r === null ? "00;0;000;000;000" :
      "38;2;" +
      `${pad(text.r!)};` +
      `${pad(text.g!)};` +
      `${pad(text.b!)}`}` +
    'm'; // sequence terminator
}
