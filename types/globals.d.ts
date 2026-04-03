// Allow CSS side-effect imports in TypeScript
declare module '*.css' {
  const content: Record<string, string>
  export default content
}
