export const generateEmbedding = async (text) => {
  // TEMP: Fake embedding (for learning + free usage)
  // Replace with real embeddings API later
  const words = text.split(" ").slice(0, 50);

  return words.map((_, i) => Math.sin(i + text.length));
};
