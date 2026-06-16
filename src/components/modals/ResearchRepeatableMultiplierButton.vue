<script>
export default {
  name: "ResearchRepeatableMultiplierButton",
  props: {
    planet: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      multiplier: new Decimal(),
      cost: new Decimal(),
      isAffordable: false,
      adjective: "",
    };
  },
  computed: {
    upgrade() {
      return ResearchUpgrade[`${this.planet}Mult`];
    },
    classObject() {
      return {
        "o-research-upgrade-btn--multiplier": true,
        "o-research-upgrade-btn--available": this.isAffordable,
        "o-research-upgrade-btn--unavailable": !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;

      this.multiplier.copyFrom(upgrade.effectValue);
      this.cost.copyFrom(upgrade.cost);
      this.isAffordable = upgrade.isAffordable;
      this.adjective = Planets[this.planet].adjective;
    },
    purchase() {
      this.upgrade.purchase();
    }
  }
};
</script>

<template>
  <div class="l-spoon-btn-group l-margin-top">
    <button
      :class="classObject"
      @click="purchase"
    >
      <div>
        Multiply {{ adjective }} Research gain by {{ formatX(2) }}
        <br>
        Currently: {{ formatX(multiplier, 2, 0) }}
      </div>
      <br>
      Cost: {{ quantify("Research Point", cost, 2, 0) }}
    </button>
  </div>
</template>

<style scoped>
.l-margin-top {
  margin-top: 0.55rem;
}

.o-research-upgrade-btn--multiplier {
  width: 19rem;
  height: 9rem;
  font-family: Typewriter, serif;
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-text);
  background: var(--color-background);
  border: 0.1rem solid;
  border-color: var(--color-earth);
  border-radius: var(--var-border-radius, 0.4rem);
  transition-duration: 0.2s;
}

.o-research-upgrade-btn--multiplier.o-research-upgrade-btn--unavailable {
  color: var(--color-text);
  background-color: dimgrey;
  cursor: default;
}

.o-research-upgrade-btn--multiplier.o-research-upgrade-btn--unavailable:hover {
  color: var(--color-text);
  background-color: var(--color-bad);
  cursor: default;
}

.o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available {
  color: white;
  border-color: var(--color-earth);
}

.o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available:hover {
  color: black;
  background-color: var(--color-earth);
  cursor: pointer;
}

.t-dark .o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available,
.t-s6 .o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available,
.t-s10 .o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available {
  background-color: #36393e;
}

.t-dark .o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available:hover,
.t-s6 .o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available:hover,
.t-s10 .o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available:hover {
  color: white;
}

.s-base--metro .o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available {
  color: white;
  border-color: var(--color-earth);
}

.s-base--metro .o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available:hover {
  color: black;
  background-color: var(--color-earth);
  border-color: black;
}

.t-s1 .o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available {
  color: #d72621;
  background-color: black;
  border-color: #dbd242;
}

.t-s1 .o-research-upgrade-btn--multiplier.o-research-upgrade-btn--available:hover {
  color: black;
  background-color: white;
}
</style>