export const mars = {
  id: 0,
  shortName: "mars",
  legalName: "Mars, the Bringer of War",
  adjective: "Martian",
  effects: {
    research: () => Math.clampMin(1, Math.pow(5, Research.planets.mars.level)),
  }
};