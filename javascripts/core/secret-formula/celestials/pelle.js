import { GameDatabase } from "../game-database.js";

GameDatabase.celestials.pelle = (function() {
  const rebuyable = props => {

    props.formatEffect = () => props._formatEffect(player.celestials.pelle.rebuyables[props.id]);
    props.cost = () => props._cost(player.celestials.pelle.rebuyables[props.id]);
    props.effect = () => props._effect(player.celestials.pelle.rebuyables[props.id]);
    props.formatCost = c => format(c, 2);

    return props;
  };
  return {
    rebuyables: {
      antimatterDimensionMult: rebuyable({
        id: "antimatterDimensionMult",
        description: `Gain a multiplier to Antimatter Dimensions`,
        _cost: x => Decimal.pow(10, x).times(100),
        _effect: x => Pelle.antimatterDimensionMult(x),
        _formatEffect: x => `${formatX(Pelle.antimatterDimensionMult(x), 2)} ➜ ` +
          `${formatX(Pelle.antimatterDimensionMult(x + 1), 2)}`
      }),
      timeSpeedMult: rebuyable({
        id: "timeSpeedMult",
        description: `Gain a multiplier to time speed`,
        _cost: x => Decimal.pow(20, x).times(1e5),
        _effect: x => Decimal.pow(1.3, x),
        _formatEffect: x => `${formatX(Decimal.pow(1.3, x), 2, 2)} ➜ ` +
          `${formatX(Decimal.pow(1.3, x + 1), 2, 2)}`
      }),
      glyphLevels: rebuyable({
        id: "glyphLevels",
        description: `Increase the glyph level allowed in Pelle`,
        _cost: x => Decimal.pow(30, x).times(1e15),
        _effect: x => Math.floor(((3 * (x + 1)) - 2) ** 1.6),
        _formatEffect: x => `${format(Math.floor(((3 * (x + 1)) - 2) ** 1.6), 2)} ➜ ` +
          `${format(Math.floor(((3 * (x + 2)) - 2) ** 1.6), 2)}`
      }),
      infConversion: rebuyable({
        id: "infConversion",
        description: `Increase infinity power conversion rate`,
        _cost: x => Decimal.pow(40, x).times(1e18),
        _effect: x => (x * 3.5) ** 0.37,
        _formatEffect: x => `+${format((x * 3.5) ** 0.37, 2, 2)} ➜ ` +
          `+${format(((x + 1) * 3.5) ** 0.37, 2, 2)}`
      }),
      galaxyPower: rebuyable({
        id: "galaxyPower",
        description: `Multiply galaxy power`,
        _cost: x => Decimal.pow(50, x).times(1e30),
        _effect: x => 1 + x / 10,
        _formatEffect: x => `${formatX(1 + x / 10, 2, 2)} ➜ ` +
          `${formatX(1 + (x + 1) / 10, 2, 2)}`
      }),
    },
    upgrades: {
      antimatterDimAutobuyers1: {
        id: 1,
        description: "Gain back autobuyers for Antimatter Dimensions 1-4",
        cost: 1e5,
        formatCost: c => format(c, 2),
      },
      dimBoostAutobuyer: {
        id: 2,
        description: "Gain back autobuyer for Dimension Boosts",
        cost: 5e5,
        formatCost: c => format(c, 2),
      },
      keepAutobuyers: {
        id: 3,
        description: "Keep your autobuyer upgrades on Armageddon",
        cost: 5e6,
        formatCost: c => format(c, 2),
      },
      antimatterDimAutobuyers2: {
        id: 4,
        description: "Gain back autobuyers for Antimatter Dimensions 5-8",
        cost: 2.5e7,
        formatCost: c => format(c, 2),
      },
      galaxyAutobuyer: {
        id: 5,
        description: "Gain back autobuyer for Antimatter Galaxies",
        cost: 1e8,
        formatCost: c => format(c, 2),
      },
      tickspeedAutobuyer: {
        id: 6,
        description: "Gain back autobuyer for Tickspeed",
        cost: 1e9,
        formatCost: c => format(c, 2),
      },
      keepInfinityUpgrades: {
        id: 7,
        description: "Keep Infinity Upgrades on Armageddon",
        cost: 1e10,
        formatCost: c => format(c, 2),
      },
      keepBreakInfinityUpgrades: {
        id: 8,
        description: "Keep Break Infinity Upgrades on Armageddon",
        cost: 1e12,
        formatCost: c => format(c, 2),
      },
      IDAutobuyers: {
        id: 9,
        description: "Gain Back Infinity Dimension Autobuyers",
        cost: 1e14,
        formatCost: c => format(c, 2),
      },
      keepInfinityChallenges: {
        id: 10,
        description: "You keep your Infinity Challenge completions through Armageddons",
        cost: 1e15,
        formatCost: c => format(c, 2),
      },
      replicantiAutobuyers: {
        id: 11,
        description: "Gain back Replicanti autobuyers",
        cost: 1e17,
        formatCost: c => format(c, 2),
      },
      replicantiGalaxyNoReset: {
        id: 12,
        description: "Replicanti Galaxies don't reset on Infinity",
        cost: 1e19,
        formatCost: c => format(c, 2),
      },
    },
    strikes: {
      infinity: {
        id: 1,
        requirementDescription: "Reach Infinity",
        penaltyDescription: "Antimatter Dimensions are raised to power of 0.5",
        rewardDescription: "Unlock Famine",
        rift: () => PelleRifts.famine
      },
      powerGalaxies: {
        id: 2,
        requirementDescription: "Power-up Galaxies",
        penaltyDescription: "Infinity Dimensions are raised to power of 0.5",
        rewardDescription: "Unlock Pestilence",
        rift: () => PelleRifts.pestilence
      },
      eternity: {
        id: 3,
        requirementDescription: "Reach Eternity",
        penaltyDescription: "Time Dimensions are raised to power of 0.5",
        rewardDescription: "Unlock Chaos",
        rift: () => PelleRifts.chaos
      }
    },
    rifts: {
      famine: {
        id: 1,
        key: "famine",
        name: "Famine",
        description: "When active, spends 3% of your IP per second to increase Famine.",
        effectDescription: x => `Multiplies Infinity Point gain by ${formatX(x, 2, 2)}`,
        strike: () => PelleStrikes.infinity,
        percentage: totalFill => Math.log10(totalFill.plus(1).log10() * 10 + 1) ** 2.5 / 100,
        percentageToFill: percentage => Decimal.pow(10,
          Decimal.pow(10, (percentage * 100) ** (1 / 2.5)).div(10).minus(0.1)
        ).minus(1),
        effect: totalFill => totalFill.plus(1).pow(0.33),
        currency: () => Currency.infinityPoints,
        milestones: [
          {
            requirement: 0.04,
            description: "You can equip a single basic glyph with decreased level and rarity"
          },
          {
            requirement: 0.06,
            description: "Make replicanti and its upgrades 1e130x cheaper, and it's uncapped"
          },
          {
            requirement: 1,
            description: "You can code IE11 compliant code"
          },
        ]
      },
      pestilence: {
        id: 2,
        key: "pestilence",
        name: "Pestilence",
        description: "When active, spends 3% of your replicanti per second to increase Pestilence.",
        effectDescription: x => `You gain replicanti ${formatX(x, 2, 2)} faster`,
        strike: () => PelleStrikes.powerGalaxies,
        // 0 - 1
        percentage: totalFill => totalFill.plus(1).log10() * 0.05 / 100,
        // 0 - 1
        percentageToFill: percentage => Decimal.pow(10, 20 * percentage * 100).minus(1),
        effect: totalFill => Decimal.sqrt(totalFill.plus(1).log10() + 1),
        currency: () => Currency.replicanti,
        milestones: [
          {
            requirement: 0.2,
            description: "First rebuyable upgrade also powers the first Infinity Dimension",
            effect: () => {
              const x = player.celestials.pelle.rebuyables.antimatterDimensionMult;
              return Decimal.pow(1e50, x - 9);
            },
            formatEffect: x => formatX(x, 2)
          },
          {
            requirement: 0.6,
            description: "When replicanti amount exceeds 1e1300, your galaxies are 10% more effective"
          },
          {
            requirement: 1,
            description: "Increase max Replicanti Galaxies based on total Rift milestones",
            effect: () => {
              const x = PelleRifts.totalMilestones();
              return x ** 2 - 2 * x;
            },
            formatEffect: x => `+${format(x, 2)}`
          },
        ]
      },
      chaos: {
        id: 3,
        key: "chaos",
        name: "Chaos",
        description: "When active, spends 3% of your Pestilence per second to increase Chaos.",
        effectDescription: x => `You gain more of something i guess`,
        strike: () => PelleStrikes.eternity,
        percentage: totalFill => totalFill.plus(1).log10() * 0.05 / 100,
        percentageToFill: percentage => Decimal.pow(10, 20 * percentage * 100).minus(1),
        effect: totalFill => Decimal.sqrt(totalFill.plus(1).log10() + 1),
        currency: () => null,
        milestones: [
          {
            requirement: 0.420,
            description: "420 blaze it"
          },
          {
            requirement: 0.666,
            description: "hail satan 666"
          },
          {
            requirement: 0.69,
            description: "nice",
          },
        ]
      }
    }
  };
}());