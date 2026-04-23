declare module 'maath/random/dist/maath-random.esm' {
  export const inSphere: (array: Float32Array, options: { radius: number }) => Float32Array;
  // Fallback signature for all other exports to prevent further type errors
  const random: any;
  export default random;
}
