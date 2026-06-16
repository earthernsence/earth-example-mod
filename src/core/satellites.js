import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";

export class Satellites {
  static get amount() {
    return player.planets.venus.satellites;
  }

  static set amount(value) {
    player.planets.venus.satellites = value;
  }

  static get purchasedSatellites() {
    return player.planets.venus.purchasedSatellites;
  }

  static set purchasedSatellites(value) { player.planets.venus.purchasedSatellites = value; }

  static get totalAmount() {
    return Satellites.purchasedSatellites + Satellites.freeSatellites;
  }

  static set totalAmount(value) {
    player.planets.venus.totalSatellites = value;
  }

  static get cost() {
    return Decimal.pow(2, Satellites.purchasedSatellites);
  }

  static get canAfford() {
    return Currency.planetPoints.value.gte(Satellites.cost);
  }

  static get assignedSatellites() {
    return player.planets.venus.assignedSatellites;
  }

  static set assignedSatellites(value) {
    player.planets.venus.assignedSatellites = value;
  }

  static get freeSatellites() {
    return Research.planets.venus.effects.research.effectOrDefault(0);
  }

  static purchase() {
    if (!Satellites.canAfford) return;

    Currency.planetPoints.value.subtract(Satellites.cost);
    Satellites.amount++;
    Satellites.purchasedSatellites++;
  }

  static get progressPerSatellite() {
    let base = 10;
    base /= (1 + Research.totalResearchLevel * Research.upgrades.satelliteImprovement3.effectOrDefault(0.1));
    base *= Research.upgrades.satelliteImprovement.effectOrDefault(1);
    base *= Research.upgrades.satelliteImprovement2.effectOrDefault(1);
    return base;
  }
}

class PlanetResearch extends GameMechanicState {
  get data() {
    return player.planets.venus.research[this.config.shortName];
  }

  get name() {
    return this.config.shortName;
  }

  get level() {
    return this.data.level;
  }

  set level(value) { this.data.level = value; }

  get currentProgress() {
    return this.progressPoints / this.goal;
  }

  get isUnlocked() {
    return this.data.unlocked;
  }

  set isUnlocked(value) { this.data.unlocked = value; }

  get satellites() {
    return this.data.satellites;
  }

  set satellites(value) {
    this.data.satellites = value;
  }

  get progressPoints() {
    return this.data.progressPoints;
  }

  set progressPoints(value) { this.data.progressPoints = value; }

  get goal() {
    return Math.pow(5, this.level + 2);
  }

  get additionalMultiplier() {
    return Research.upgrades[`${this.name}Mult`].effectOrDefault(1);
  }

  assignSatellite(add) {
    if (add) {
      if (Satellites.assignedSatellites === Satellites.totalAmount) {
        GameUI.notify.error("You can't assign more Satellites than you have, dummy!");
        return;
      }
      this.data.satellites++;
      Satellites.amount--;
      Satellites.assignedSatellites++;
    } else {
      if (this.satellites === 0) {
        GameUI.notify.error("You can't assign negative Satellites, dummy!");
        return;
      }
      this.data.satellites--;
      Satellites.amount++;
      Satellites.assignedSatellites--;
    }
  }

  get researchPointsPerLevel() {
    return Research.upgrades.moreResearchPoints.effectOrDefault(1);
  }

  levelUp() {
    if (this.progressPoints < this.goal) return;

    this.progressPoints -= this.goal;
    this.level++;

    // Venus research gives free Satellites, and we have to give them to ourselves somehow
    if (Satellites.totalAmount !== (Satellites.amount + Satellites.assignedSatellites)) {
      Satellites.amount = Satellites.totalAmount - Satellites.assignedSatellites;
    }

    Currency.researchPoints.add(this.researchPointsPerLevel);
  }

  get gainedPoints() {
    let gain = this.satellites * Satellites.progressPerSatellite;
    gain *= this.additionalMultiplier.toNumber();
    return gain;
  }

  get timeEstimate() {
    const currentGain = this.gainedPoints;
    const currentAmount = this.progressPoints;
    if (currentGain === 0) return null;
    return TimeSpan.fromSeconds(Decimal.sub(new Decimal(this.goal), currentAmount)
      .div(currentGain).toNumber()).toTimeEstimate();
  }

  tick(realDiff) {
    if (this.satellites === 0) return;
    const seconds = realDiff / 1000;
    this.progressPoints += this.gainedPoints * seconds;
    this.levelUp();
  }
}

const planets = mapGameDataToObject(
  GameDatabase.exploration.planets,
  config => new PlanetResearch(config)
);

class ResearchUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    this._planet = config.planet;
  }

  get planet() {
    return this._planet;
  }

  get currency() {
    return Currency.researchPoints;
  }

  get set() {
    return player.planets.venus.research[this.planet].upgrades;
  }

  get isAvailableForPurchase() {
    return this.config.checkRequirement?.() ?? true;
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    return super.purchase();
  }
}

export class PlanetResearchMultiplierState extends GameMechanicState {
  constructor(planet) {
    super({});
    this._planet = planet;
    this.cachedCost = new Lazy(() => this.costAfterCount(this.multipliers));
    this.cachedEffectValue = new Lazy(() => DC.D2.pow(this.multipliers));
  }

  get isAffordable() {
    return Currency.researchPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get multipliers() {
    return player.planets.venus.research[this.planet].multipliers;
  }

  set multipliers(value) {
    player.planets.venus.research[this.planet].multipliers = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  get planet() {
    return this._planet;
  }

  purchase() {
    if (!this.isAffordable) return false;
    Currency.researchPoints.subtract(this.cost);
    ++this.multipliers;
    return true;
  }

  reset() {
    this.multipliers = 0;
  }

  costAfterCount(count) {
    return DC.D5.pow(count);
  }
}

export const ResearchUpgrade = mapGameDataToObject(
  GameDatabase.exploration.research,
  config => new ResearchUpgradeState(config)
);

for (const planet of ["mars", "venus", "mercury", "jupiter", "saturn", "uranus", "neptune"]) {
  ResearchUpgrade[`${planet}Mult`] = new PlanetResearchMultiplierState(planet);
}

export const Research = {
  planets,
  upgrades: ResearchUpgrade,
  get totalResearchLevel() {
    return Research.planets.all.map(planet => (planet.isUnlocked ? planet.level : 0)).sum();
  },
  get unlocked() {
    return Satellites.totalAmount >= 1;
  },
  researchTick(realDiff) {
    if (!this.unlocked) return;

    for (const planet of Research.planets.all) planet.tick(realDiff);
  }
};