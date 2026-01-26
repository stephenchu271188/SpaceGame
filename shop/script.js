function toCamelCase(string) {
  return string.replace(/-([a-z])/g, (string) => string[1].toUpperCase());
}

// -----------------------------------------------------------------------------

const XguiBarTemplate = document.createElement("template");
XguiBarTemplate.innerHTML = `
<style>
  :host {

    /* CONFIGURATION - BEGIN ------------------------------------------------ */
    --skew-left: skew( 30deg, 0deg );
    --skew-right: scaleX(-1) skew( 30deg, 0deg );
    --bar-color: var( --hud-color );
    --border-radius: var( --default-border-radius, 0.4rem );
    --border-width: 0.075rem;
    --border-radius-inner: calc( var( --border-radius ) - var( --border-width ) );
    --drop-shadow-size: 0.15rem;
    --element-gap: 1rem;
    --transition-duration: 0.3s;
    /* CONFIGURATION - END -------------------------------------------------- */

    align-items: center;
    box-sizing: border-box;
    display: flex;
    grid-gap: var( --element-gap );
    font-family: sans-serif;
    user-select: none;
  }

  :host([origin=left]) {
    --origin: var( --skew-left );
  }
  :host([origin=left]) .name {
    margin-right: var( --element-gap );
  }
  :host([origin=left]) .value {
    margin-left: var( --element-gap );
  }

  :host([origin=right]) {
    --origin: var( --skew-right );
    flex-direction: row-reverse;
    text-align: right;
  }
  :host([origin=right]) .name {
    margin-left: var( --element-gap );
  }
  :host([origin=right]) .value {
    margin-right: var( --element-gap );
  }

  .host {
    color: rgb( var( --bar-color ) );
    display: contents;
  }

  .name {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .bar {
    border: var( --border-width ) solid rgba( var( --bar-color ), var( --hud-opacity-primary ) );
    border-radius: var( --border-radius );
    display: flex;
    filter: drop-shadow( 0 0 var( --drop-shadow-size ) rgba( var( --bar-color ), var( --hud-opacity-primary ) ) );
    flex-grow: 1;
    height: 1rem;
    overflow: hidden;
    transform: var( --origin );
    transition: border var( --transition-duration ) linear,
                filter var( --transition-duration ) linear;
  }
  .bar::after,
  .bar::before {
    content: '';
  }
  .bar::after {
    background-color: rgba( var( --bar-color ), var( --hud-opacity-secondary ) );
    border-radius: var( --border-radius-inner );
    box-shadow: calc( var( --border-radius ) * -1 ) 0 0 rgba( var( --bar-color ), var( --hud-opacity-primary ) );
    flex-grow: 1;
    transition: box-shadow var( --transition-duration ) linear;
  }
  .bar::before {
    background-color: rgba( var( --bar-color ), var( --hud-opacity-primary ) );
    border-radius: var( --border-radius-inner ) 0 0 var( --border-radius-inner );
    max-width: 100%;
    transition: background-color var( --transition-duration ) linear,
                width var( --transition-duration ) linear;
    width: calc( 100% / var( --max-value, 100 ) * var( --value, 0 ) );
  }
  .value {
    transition: color var( --transition-duration ) linear;
    width: calc( var( --value-width-in-ch ) * 1ch );
  }

  @media screen and ( max-width: 600px ) {
    .name {
      display: none;
    }
  }
</style>

<span class="host">
  <div class="name"></div>
  <div class="bar"></div>
  <div class="value"></div>
</span>
`;

class XguiBar extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(XguiBarTemplate.content.cloneNode(true));

    this.$ = (selector) => this._shadowRoot.querySelector(selector);
    this.$host = this.$(".host");
    this.$name = this.$(".name");
    this.$value = this.$(".value");

    this.default = {
      maxValue: 100,
      thresholdAbsoluteValues: false,
      value: 0
    };
    this.thresholdContainer = new Map();
    this.$host.style.setProperty(
      "--value-width-in-ch",
      this.default.maxValue.length
    );
  }

  static get observedAttributes() {
    return [
      "name",
      "max-value",
      "thresholds",
      "threshold-absolute-values",
      "value"
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[toCamelCase(name)] = newValue;
    this.$host.style.setProperty(`--${name}`, newValue);

    if (this.value && this.parseThresholds(this.thresholds)) {
      this.setBarColorWithThresholds();
    }

    if (name == "max-value") {
      this.$host.style.setProperty("--value-width-in-ch", this.maxValue.length);
    }

    if (name == "name") {
      this.$name.innerText = newValue;
    }

    if (name == "value") {
      this.$value.innerText = newValue;
    }
  }

  parseThresholds(thresholdsString) {
    this.thresholdContainer.clear();
    if (!thresholdsString) {
      return false;
    }
    let steps = thresholdsString.split("|");

    steps.forEach((step, index) => {
      let [threshold, color] = step.split(":");
      if (Number.isInteger(Number.parseFloat(threshold || 0))) {
        this.thresholdContainer.set(threshold, color);
      }
    });

    return true;
  }

  setBarColorWithThresholds() {
    let maxValue = this.maxValue || this.default.maxValue,
      value = this.value || this.default.value,
      thresholdAbsoluteValues =
        this.hasAttribute("threshold-absolute-values") ||
        this.default.thresholdAbsoluteValues,
      highestMatchingThreshold;

    this.thresholdContainer.forEach((color, threshold) => {
      let t = Number.parseFloat(threshold),
        v = Number.parseFloat(value);
      if (v >= (thresholdAbsoluteValues ? t : (maxValue / 100) * t)) {
        highestMatchingThreshold = threshold;
      }
    });
    highestMatchingThreshold &&
      this.$host.style.setProperty(
        `--bar-color`,
        this.thresholdContainer.get(highestMatchingThreshold)
      );
  }

  setValue(value) {
    let calculatedNewValue =
      Number.parseFloat(this.value) + Number.parseFloat(value);
    let newValue = Math.max(0, Math.min(calculatedNewValue, this.maxValue));
    this.setAttribute("value", newValue);
    return newValue == calculatedNewValue;
  }
}

// -----------------------------------------------------------------------------

const XguiButtonTemplate = document.createElement("template");
XguiButtonTemplate.innerHTML = `
<style>
  :host {
    align-items: center;
    background-color: rgba( var( --hud-color ), var( --hud-opacity-secondary ) );
    border: 0.1rem solid rgb( var( --hud-color ) );
    border-radius: var( --default-border-radius );
    color: rgb( var( --hud-color ) );
    cursor: pointer;
    display: grid;
    grid-gap: 0.25rem;
    grid-template-columns: auto max-content;
    font-size: 1rem;
    margin: 0.5rem;
    outline: none;
    text-align: center;
    transition: all var( --default-animation-duration ) ease;
    user-select: none;
  }
  :host( :hover ) {
    background-color: rgb( var( --hud-color ) );
    color: black;
  }
  :host( :active ) {
    filter: brightness( 0.5 );
    transition: all var( --default-animation-duration ) ease;
  }

  .host {
    display: contents;
  }

  .name {
    margin: 0.5rem 0 0 1rem;
  }

  .effects {
    color: white;
    display: grid;
    font-size: 0.6rem;
    grid-auto-flow: column;
    grid-gap: 0.25rem;
    grid-row: 2;
    margin: 0 0 0.5rem 1rem;
    text-transform: uppercase;
    transition: all var( --default-animation-duration ) ease;
    word-spacing: 0.5rem;
  }
  .effects :empty {
    display: none;
  }
  :host( :hover ) .effects {
    color: black;
  }

  .item-count {
    align-items: center;
    background-color: black;
    border-radius: var( --default-border-radius );
    color: rgb( var( --hud-color ) );
    display: flex;
    grid-row: span 2;
    height: 100%;
    justify-content: center;
    margin: 0 0 0 0.5rem;
    width: 4ch;
  }
</style>
<span class="host">
  <div class="name"></div>
  <div class="effects">
    <div class="effect-self"></div>
    <div class="requirement-self"></div>
  </div>
  <div class="item-count">&#x221E;</div>
</span>
`;

class XguiButton extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(XguiButtonTemplate.content.cloneNode(true));

    this.$ = (selector) => this._shadowRoot.querySelector(selector);
    this.$host = this.$(".host");
    this.$itemCount = this.$(".item-count");
    this.$name = this.$(".name");
    this.$effectsSelf = this.$(".effect-self");
    this.$requirementSelf = this.$(".requirement-self");
  }

  static get observedAttributes() {
    return ["display-name", "effect-self", "item-count", "requirement-self"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[toCamelCase(name)] = newValue;
    this.$host.style.setProperty(`--${name}`, newValue);

    if (name == "display-name") {
      this.$name.innerText = newValue;
    }

    if (name == "effect-self") {
      this.$effectsSelf.innerText = newValue;
      this.effectsSelf = this.parseEffects(newValue);
    }

    if (name == "item-count") {
      this.$itemCount.innerText = newValue;
    }

    if (name == "requirement-self") {
      this.$requirementSelf.innerText = newValue;
      this.requirementSelf = this.parseEffects(newValue);
    }
  }

  connectedCallback() {
    this.addEventListener("click", this.requestStatChange);
  }

  parseEffects(effectsString) {
    let effects = new Map();
    effectsString.split("|").forEach((effect) => {
      let [key, value] = effect.split(":");
      effects.set(key, value);
    });
    return effects;
  }

  requestStatChange() {
    if (this.itemCount !== undefined) {
      if (this.itemCount == 0) {
        console.log(`Not enough items of <${this.displayName}>`);
        return;
      }
      this.setAttribute("item-count", this.itemCount - 1);
    }

    if (this.requirementSelf !== undefined) {
      let requirementsMet = 0;
      this.requirementSelf.forEach((value, id) => {
        let target = document.getElementById(id);
        if (Number.parseFloat(target.value) + Number.parseFloat(value) >= 0) {
          requirementsMet++;
        }
      });
      if (requirementsMet != this.requirementSelf.size) {
        console.log(`Requirements not met for <${this.displayName}>`);
        return;
      }
      this.requirementSelf.forEach((value, id) => {
        let target = document.getElementById(id);
        target.setValue(Number.parseFloat(value));
      });
    }

    if (this.effectsSelf !== undefined) {
      this.effectsSelf.forEach((value, id) => {
        let target = document.getElementById(id);
        target.setValue(Number.parseFloat(value));
      });
    }
  }
}

// -----------------------------------------------------------------------------

window.customElements.define("xgui-bar", XguiBar);
window.customElements.define("xgui-button", XguiButton);