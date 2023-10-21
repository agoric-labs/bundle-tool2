import { LitElement, PropertyValues, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";

import { bundleContext } from "./ctx/bundle-ctx.ts";
import { Agoric } from "./unbundle.js";

type EndoBundle = {
  moduleFormat: string;
  endoZipBase64: string;
  endoZipBase64Sha512: string;
};

@customElement("my-element")
export class MyElement extends LitElement {
  @property({ type: Number })
  storagePrice = 0.002;

  @consume({ context: bundleContext })
  @property({ attribute: false })
  public bundleText?: string;

  @property({ type: Number, attribute: false })
  storedSize = 0;

  @property({ type: Number, attribute: false })
  storageFee = 0;

  @property({ type: Object, attribute: false })
  public bundle?: EndoBundle;

  @property({ attribute: false })
  public sha512?: string;

  @property({ type: Object, attribute: false })
  public entry?: undefined;

  async willUpdate(delta: PropertyValues<this>) {
    if (!delta.has("bundleText")) return;
    const bundleText: string = delta.get("bundleText")!;
    this.storedSize = bundleText.length;
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
            value="${this.sha512}" /></small
      ></label>
      <br />
      <label
        >stored size:
        <input name="storedSize" readonly value="${this.storedSize || ""}" />
        bytes</label
      >
      <br />
      <label
        >storage price:
        <input name="storagePrice" value="${this.storagePrice}" readonly />
        IST/byte</label
      >
      <small><em>(TODO: fetch dynamically from chain)</em></small>
      <br />

      <label
        >storage cost:
        <input name="storageFee" readonly value="${this.storageFee || ""}" />
        IST</label
      >
      <br />
    </fieldset>`;
  }
}
