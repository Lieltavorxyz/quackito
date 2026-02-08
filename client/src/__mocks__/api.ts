const mockDuck = { code: "test-duck", name: "Quackito", hunger: 80, happiness: 80, energy: 80 };

export async function createDuck() { return mockDuck; }
export async function getDuck() { return mockDuck; }
export async function interact() { return mockDuck; }
