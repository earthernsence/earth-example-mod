<script>
import ModernSolarDimensionRow from "@/components/tabs/planets/mars/ModernSolarDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModernSolarDimensionsTab",
  components: {
    ModernSolarDimensionRow,
    PrimaryButton
  },
  data() {
    return {
      watts: new Decimal(0),
      wattsPerSecond: new Decimal(0),
      wattsChunkEffect: 0,
      wattsMemoryGainEffect: 0,
    };
  },
  methods: {
    update() {
      this.watts.copyFrom(Currency.watts);
      this.wattsPerSecond.copyFrom(SolarDimension(1).productionPerSecond);
      this.wattsChunkEffect = Math.max(Currency.watts.value.log10() / Decimal.log10(1000), 1);
      this.wattsMemoryGainEffect = getWattsEffect();
    },
    maxAll() {
      maxAllSolarDimensions();
    }
  }
};
</script>

<template>
  <div class="l-solar-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have gained
        <span class="c-solar-dim-description__accent">{{ format(watts, 2, 1) }}</span> Watts,
        which translates to a
        <span class="c-solar-dim-description__accent">{{ formatX(wattsMemoryGainEffect, 2, 1) }}</span>
        multiplier to Memory gain and a
        <span class="c-solar-dim-description__accent">{{ formatX(wattsChunkEffect, 2, 2) }}</span> multiplier to
        Memory Chunk gain.
      </p>
    </div>
    <div>You are getting {{ format(wattsPerSecond, 2, 0) }} Watts per second.</div>
    <div class="l-dimensions-container">
      <ModernSolarDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
  </div>
</template>

<style scoped>
.l-solar-dim-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);
}
.c-solar-dim-description__accent {
  font-size: 3.5rem;
  color: var(--color-earth);
}

.t-metro .c-solar-dim-description__accent,
.t-s8 .c-solar-dim-description__accent {
  text-shadow: 0 0 0.1rem rgba(0, 0, 0, 50%), -0.1rem 0.1rem 0.1rem black;
}

.t-dark .c-time-dim-description__accent,
.t-amoled .c-time-dim-description__accent,
.t-amoled-metro .c-time-dim-description__accent,
.t-s6 .c-time-dim-description__accent,
.t-s10 .c-time-dim-description__accent,
.t-s11 .c-time-dim-description__accent {
  color: var(--color-earth);
  text-shadow: 0 0 0.7rem var(--color-earth);
}
</style>