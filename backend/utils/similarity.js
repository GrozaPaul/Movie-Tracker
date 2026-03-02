// returns value between 0 and 1, with 0 being completely different and 1 being identical
export const cosineSimilarity = (vectorA, vectorB) => {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must be the same length");
  }

  let prod = 0;
  let sumA = 0;
  let sumB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    prod += vectorA[i] * vectorB[i];
    sumA += vectorA[i] * vectorA[i];
    sumB += vectorB[i] * vectorB[i];
  }

  if (sumA === 0 || sumB === 0) return 0;

  return prod / (Math.sqrt(sumA) * Math.sqrt(sumB));
};
