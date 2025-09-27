// A simple seeded pseudo-random number generator (PRNG) using the Mulberry32 algorithm.
function mulberry32(seed: number) {
  return function() {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed, 0x85459A6D);
    t = t ^ (t >>> 15);
    t = t | 0;
    t = Math.imul(t, 0x6C078965);
    t = t ^ (t >>> 15);
    t = t | 0;
    return (t >>> 0) / 0x100000000;
  }
}

// Fisher-Yates shuffle algorithm using a seeded PRNG
export function seededShuffle<T>(array: T[], seed?: number): T[] {
  const shuffled = [...array];
  const random = seed !== undefined ? mulberry32(seed) : () => Math.random();
  
  let currentIndex = shuffled.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
}
