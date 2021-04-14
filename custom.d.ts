// Necessary for .tsconfig to recognize SVGs
declare module '*.svg' {
  const content: any;
  export default content;
}
