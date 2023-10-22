import { LitElement, PropertyValues, html } from "lit";
import { Task } from "@lit/task";
import { customElement, property } from "lit/decorators.js";

import { Agoric } from "./unbundle.ts";
import { EndoBundle } from "./EndoBundle.ts";

@customElement("bundle-info")
export class BundleInfo extends LitElement {
  @property({ type: Number })
  public storagePrice = 0.002;

  @property()
  public bundleText?: string;

  @property({ type: Number, attribute: false })
  storedSize = 0;

  @property({ type: Number, attribute: false })
  storageCost = 0;

  @property({ type: Object, attribute: false })
  public bundle?: EndoBundle;

  @property({ attribute: false })
  public sha512?: string;

  @property({ type: Object, attribute: false })
  public entry?: undefined;

  async willUpdate(delta: PropertyValues<this>) {
    console.log("@@willUpdate", delta);
    if (!delta.has("bundleText")) return;
    const bundleText = this.bundleText;
    if (!bundleText) return;
    this.storedSize = bundleText.length;
    this.storageCost = this.storedSize * this.storagePrice;
    const bundle = JSON.parse(bundleText);
    if (!("moduleFormat" in bundle)) {
      console.error("no moduleFormat");
      return;
    }
    this.bundle = bundle;
    this.sha512 = bundle.endoZipBase64Sha512;
    const loader = await Agoric.getZipLoader(bundle);
    const cmap = loader.extractAsJSON("compartment-map.json");
    this.entry = cmap.entry;
  }

  render() {
    return html`<fieldset>
      <legend>Bundle Info</legend>
      <label
        >sha512:
        <small
          ><input
            name="sha512"
            size="128"
            readonly
            value=${this.sha512} /></small
      ></label>
      <br />
      <label
        >stored size:
        <input name="storedSize" readonly value=${this.storedSize || ""} />
        bytes</label
      >
      <br />
      <label
        >storage price:
        <input name="storagePrice" value=${this.storagePrice} readonly />
        IST/byte</label
      >
      <small><em>(TODO: fetch dynamically from chain)</em></small>
      <br />

      <label
        >storage cost:
        <input name="storageCost" readonly value=${this.storageCost || ""} />
        IST</label
      >
      <br />
      <label
        >entry:
        <input
          name="entry"
          readonly
          size="120"
          value=${JSON.stringify(this.entry)}
      /></label>
    </fieldset>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bundle-info": BundleInfo;
  }
}
