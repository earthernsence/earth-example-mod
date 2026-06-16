<script>
export default {
  name: "ModernSidebarCurrency",
  data() {
    return {
      AM: new Decimal(0),
      IP: new Decimal(0),
      EP: new Decimal(0),
      RM: new Decimal(0),
      PP: new Decimal(0),
      IM: 0,
      RS: new Decimal(0),
      machineStr: "",
      showIP: false,
      showEP: false,
      showRM: false,
      showRS: false,
    };
  },
  computed: {
    resourceDB: () => GameDatabase.sidebarResources,
    numDBEntries() {
      return this.resourceDB.length;
    },
    resource() {
      // With "default" sorting, return the latest unlocked resource - otherwise, return the specified one
      return this.sidebarID === 0
        ? this.resourceDB.filter(e => e.isAvailable()).sort((a, b) => b.id - a.id)[0]
        : this.resourceDB.find(e => e.id === this.sidebarID);
    },
    displayValue() {
      // RM + iM seems to cause strange, undesirable linebreaks
      return this.resource.formatValue(this.resourceValue).replace(" + ", "+");
    }
  },
  methods: {
    update() {
      this.AM.copyFrom(Currency.antimatter);
      this.IP.copyFrom(Currency.infinityPoints.value.floor());
      this.EP.copyFrom(Currency.eternityPoints.value.floor());
      this.RM.copyFrom(Currency.realityMachines.value.floor());
      this.PP.copyFrom(Currency.planetPoints.value.floor());
      this.IM = Currency.imaginaryMachines.value;
      this.RS.copyFrom(Currency.realityShards);
      this.machineStr = formatMachines(this.RM, this.IM);
      this.showIP = PlayerProgress.infinityUnlocked();
      this.showEP = PlayerProgress.eternityUnlocked();
      this.showRM = PlayerProgress.realityUnlocked();
      this.showPP = PlayerProgress.planetsUnlocked();
      this.showRS = Pelle.isDoomed;
    }
  },
};
</script>

<template>
  <div class="c-sidebar-resource">
    <template v-if="showRS">
      <h2 class="o-sidebar-currency--pelle">
        {{ format(RS, 2) }}
      </h2>
      <div class="c-sidebar-resource__information">
        <span class="c-sidebar-resource__name">{{ pluralize("Reality Shard", RS) }}</span>
      </div>
    </template>
    <template v-else-if="showPP">
      <h2 class="o-sidebar-currency--planets">
        {{ format(PP, 2) }}
      </h2>
      <div class="c-sidebar-resource__information">
        <span class="c-sidebar-resource__name">{{ pluralize("Planet Point", PP) }}</span>
      </div>
    </template>
    <template v-else-if="showRM">
      <template v-if="IM === 0">
        <h2 class="o-sidebar-currency--reality">
          {{ format(RM, 2) }}
        </h2>
        <div class="c-sidebar-resource__information">
          <span class="c-sidebar-resource__name">{{ pluralize("Reality Machine", RM) }}</span>
        </div>
      </template>
      <template v-else>
        <h3 class="o-sidebar-currency--reality">
          {{ machineStr }}
        </h3>
        <div class="c-sidebar-resource__information">
          <span class="c-sidebar-resource__name">Machines</span>
        </div>
      </template>
    </template>
    <template v-else-if="showEP">
      <h2 class="o-sidebar-currency--eternity">
        {{ format(EP, 2) }}
      </h2>
      <div class="c-sidebar-resource__information">
        <span class="c-sidebar-resource__name">{{ pluralize("Eternity Point", EP) }}</span>
      </div>
    </template>
    <template v-else-if="showIP">
      <h2 class="o-sidebar-currency--infinity">
        {{ format(IP, 2) }}
      </h2>
      <div class="c-sidebar-resource__information">
        <span class="c-sidebar-resource__name">{{ pluralize("Infinity Point", IP) }}</span>
      </div>
    </template>
    <template v-else>
      <h2 class="o-sidebar-currency--antimatter">
        {{ format(AM, 2, 1) }}
      </h2>
      <div class="c-sidebar-resource__information">
        <span class="c-sidebar-resource__name">Antimatter</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.c-sidebar-resource {
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  height: 7rem;
  justify-content: center;
  align-items: center;
  background-color: var(--color-base);
  border-right: 0.1rem solid var(--color-accent);
  border-bottom: 0.1rem solid var(--color-accent);
  padding: 1rem;
  user-select: none;
}

.c-sidebar-resource-default {
  border-width: 0.3rem;
}

.c-sidebar-resource:last-child {
  border-bottom-right-radius: var(--var-border-radius, 0.5rem);
}

.c-sidebar-resource h2 {
  z-index: 1;
  font-size: 1.9rem;
  margin: 0;
}

.t-dark .c-sidebar-resource h2,
.t-dark-metro .c-sidebar-resource h2 {
  text-shadow: 0 0 0.1rem rgba(0, 0, 0, 50%), -0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 80%);
}

.c-sidebar-resource__information {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 1.5rem;
  color: var(--color-text);
}

.c-sidebar-resource__name {
  font-size: 1.2rem;
}

.o-sidebar-currency--antimatter {
  color: black;
}

.t-normal .o-sidebar-currency--antimatter {
  color: var(--color-accent);
}

.t-dark .o-sidebar-currency--antimatter,
.t-amoled .o-sidebar-currency--antimatter,
.t-s6 .o-sidebar-currency--antimatter,
.t-s10 .o-sidebar-currency--antimatter {
  animation: a-game-header__antimatter--glow 25s infinite;
}

.t-s11 .o-sidebar-currency--antimatter {
  animation: a-game-header__antimatter--glow-blob 25s infinite;
}

.t-dark-metro .o-sidebar-currency--antimatter,
.t-amoled-metro .o-sidebar-currency--antimatter {
  color: #e0e0e0;
}

.o-sidebar-currency--infinity {
  color: var(--color-infinity);
}

.o-sidebar-currency--replicanti {
  /* Taken from glyph-types.js */
  color: #03a9f4;
}

.o-sidebar-currency--eternity {
  color: var(--color-eternity);
}

.o-sidebar-currency--dilation {
  color: var(--color-dilation);
}

.o-sidebar-currency--reality {
  color: var(--color-reality);
}

.o-sidebar-currency--effarig {
  color: var(--color-effarig--base);
}

.o-sidebar-currency--laitela {
  color: var(--color-laitela--base);
  text-shadow: 0.1rem 0.1rem 0.1rem var(--color-laitela--accent);
}

.o-sidebar-currency--pelle {
  color: var(--color-pelle--base);
}
</style>
