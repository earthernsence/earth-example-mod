<script>
// So what if there were 7 teresa bars
import PlusMinusButton from "@/components/PlusMinusButton";

export default {
  name: "ResearchBar",
  components: { PlusMinusButton },
  props: {
    planet: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // This is a decimal up to 1
      currentProgress: 0,
      // Our currentProgress transformed into a CSS-usable value
      percentage: "",
      level: 0,
      satellites: 0,
      progressPerSecond: 0,
      isGenerating: false,
      timeEstimate: ""
    };
  },
  computed: {
    research() {
      return Research.planets[this.planet];
    },
    classObject() {
      return {
        "c-research-bar-active": this.isGenerating
      };
    }
  },
  methods: {
    update() {
      this.currentProgress = this.research.currentProgress;
      this.percentage = `${(this.currentProgress * 100).toFixed(2)}%`;
      this.level = this.research.level;
      this.satellites = this.research.satellites;
      this.progressPerSecond = this.research.gainedPoints;
      this.isGenerating = this.satellites > 0;
      this.timeEstimate = this.research.timeEstimate;
      this.adjective = Planets[this.planet].adjective;
    },
    handleClick(add) {
      this.research.assignSatellite(add);
    },
    getEffect() {
      switch (this.planet) {
        case "mars":
          return `${formatX(this.research.effects.research.effectValue, 2, 2)} 
          to Solar Dimensions based on Mars Research levels`;
        case "venus":
          return `Gain a free Satellite every 3 levels. 
          Currently ${quantifyInt("free Satellite", this.research.effects.research.effectValue)}`;
        case "mercury":
          return `Boost Dark Matter Dimensions DM multiplier based on game speed and Mercury Research levels.
          Currently ${formatX(this.research.effects.research.effectValue, 2, 2)}`;
        case "jupiter":
          return "Avoiding errors";
        default:
          throw "Unknown planet in ResearchBar";
      }
    },
    handleBarClick() {
      Modal.research.show({ planet: this.planet });
    },
    tooltip() {
      if (this.progressPerSecond === 0) return `Assign a Satellite to ${this.planet.capitalize()} to gain progress`;
      return `Gaining ${format(this.progressPerSecond, 2, 2)} progress/sec in ${this.adjective} Research\n
      Levels up in ${this.timeEstimate}`;
    }
  }
};
</script>

<template>
  <div class="c-research-container">
    <div
      class="c-research-bar"
      :ach-tooltip="tooltip()"
      @click="handleBarClick"
    >
      <div
        v-if="isGenerating"
        :class="classObject"
      />
      <div
        class="c-research-bar-inner"
        :style="{ height: percentage }"
      >
        <div class="c-research-bar-label">
          {{ formatPercents(currentProgress, 2) }} to level {{ formatInt(level + 1) }}
        </div>
      </div>
    </div>
    <div class="c-button-container">
      <PlusMinusButton
        class="c-plus-minus-button"
        type="plus"
        @click="handleClick(true)"
      />
      <PlusMinusButton
        class="c-plus-minus-button"
        type="minus"
        @click="handleClick(false)"
      />
    </div>
    <div class="c-planet-label">
      {{ planet.capitalize() }}
    </div>
    <div class="c-satellite-amount-label">
      {{ quantifyInt("Satellite", satellites) }}
    </div>
    <div class="c-satellite-amount-label">
      Level {{ level }}
      <span :ach-tooltip="getEffect()"><i class="fas fa-question-circle" /></span>
    </div>
  </div>
</template>

<style scoped>
.c-research-container {
  display: flex;
  flex-direction: column;
  width: 15rem;
  height: 60rem;
  position: relative;
  align-items: center;
  border: 0.25rem solid white;
  border-radius: var(--var-border-radius, 0.4rem);
  margin: auto;
}

.c-button-container {
  display: flex;
  flex-direction: row;
  width: 10rem;
  height: 1.5rem;
  justify-content: space-between;
  align-items: center;
  margin: auto;
}

.c-plus-minus-button {
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  background-color: var(--color-background);
  border: 0.1rem solid var(--color-earth);
  border-radius: var(--var-border-radius, 50%);
  transition-duration: 0.2s;
  cursor: pointer;
}

.c-plus-minus-button:hover {
  background-color: var(--color-earth);
}

.c-research-bar {
  width: 13rem;
  height: 50rem;
  position: relative;
  background: #37a4ba55;
  border: 0.1rem solid var(--color-earth);
  border-radius: var(--var-border-radius, 0.4rem);
  margin: auto
}

.c-research-bar-active {
  width: 100%;
  position: absolute;
  z-index: 1;
  opacity: 0.3;
  background: var(--color-background);
  animation: a-research-bar-filling-sweep infinite 2s linear;
}

.c-research-bar:hover {
  cursor: pointer;
}

.c-research-bar-inner {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background: var(--color-earth);
}

.c-research-bar-label {
  width: 100%;
  position: absolute;
  bottom: 0;
  font-weight: bold;
  color: black;
}

.c-planet-label {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-earth);
}

.c-current-satellites-label {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

@keyframes a-research-bar-filling-sweep {
  0% {
    height: 0;
    bottom: 0;
  }

  10% {
    height: 2rem;
    bottom: 0;
  }

  90% {
    height: 2rem;
    bottom: calc(100% - 2rem)
  }

  100% {
    height: 0;
    bottom: 100%
  }
}
</style>