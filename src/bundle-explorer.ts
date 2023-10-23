import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("bundle-explorer")
export class BundleExplorer extends LitElement {
  @property({ attribute: false })
  bundleText?: string;

  constructor() {
    super();
    this.addEventListener("set-bundle", (ev) => {
      const bundleText = (ev.target as any)?.bundleText; // TODO: type
      console.log("set-bundle", ev, bundleText.slice(0, 60));
      this.bundleText = bundleText;
    });
  }
  render() {
    console.log("explorer render", this?.bundleText?.slice(0, 60));
    return html`
      <slot></slot>
      <br />
      <bundle-info bundleText=${this.bundleText}></bundle-info>
    `;
  }
}
