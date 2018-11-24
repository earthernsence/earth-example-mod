Vue.component('infinity-dim-row', {
  props: {
    tier: Number
  },
  data: function() {
    return {
      isUnlocked: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: 0,
      hasRateOfChange: false,
      rateOfChange: new Decimal(0),
      isAutobuyerUnlocked: false,
      cost: new Decimal(0),
      isAvailableForPuchase: false,
      isCapped: false,
      capIP: new Decimal(0),
      autobuyers: player.infDimBuyers,
      isEC8Running: false
    };
  },
  computed: {
    name: function() {
      return DISPLAY_NAMES[this.tier];
    },
    rateOfChangeDisplay: function() {
      return this.hasRateOfChange ?
        ` (+${this.shorten(this.rateOfChange)}%/s)` :
        String.empty;
    },
    costDisplay: function() {
      return this.isCapped ? "Capped!" : `Cost: ${this.shortenCosts(this.cost)} IP`;
    },
    hardcapPurchases: function() {
      return this.shortenCosts(HARDCAP_ID_PURCHASES);
    },
    capTooltip: function() {
      return this.isCapped ?
        `Limited to ${this.hardcapPurchases} upgrades (${this.shortenCosts(this.capIP)} IP)`:
        undefined;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = InfinityDimension(tier);
      this.isUnlocked = dimension.isUnlocked;
      if (!this.isUnlocked) return;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      this.bought = dimension.bought;
      this.hasRateOfChange = dimension.hasRateOfChange;
      if (this.hasRateOfChange) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAutobuyerUnlocked = dimension.isAutobuyerUnlocked;
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPuchase = dimension.isAvailableForPuchase;
      this.isCapped = dimension.isCapped;
      if (this.isCapped) {
        this.capIP.copyFrom(dimension.hardcapIPAmount);
      }
      this.isEC8Running = EternityChallenge(8).isRunning;
    },
    buyManyInfinityDimension: function() {
      buyManyInfinityDimension(this.tier);
    }
  },
  template:
    `<div v-show="isUnlocked" class="c-infinity-dim-row">
      <div
        class="c-infinity-dim-row__label c-infinity-dim-row__name"
      >{{name}} Infinity Dimension x{{shortenMoney(multiplier)}}</div>
      <div
        class="c-infinity-dim-row__label c-infinity-dim-row__label--growable"
      >{{shortenDimensions(amount)}} ({{bought}}){{rateOfChangeDisplay}}</div>
      <primary-button-on-off
        v-if="isAutobuyerUnlocked && !isEC8Running"
        v-model="autobuyers[tier - 1]"
        class="o-primary-btn--id-autobuyer c-infinity-dim-row__button"
        text="Auto:"
      />
      <primary-button
        v-tooltip="capTooltip"
        :enabled="isAvailableForPuchase"
        class="o-primary-btn--buy-id c-infinity-dim-row__button"
        @click="buyManyInfinityDimension"
      >{{costDisplay}}</primary-button>
    </div>`,
});