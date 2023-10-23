import { LitElement, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Agoric, Cosmos } from "./unbundle.ts";

@customElement("bundle-tx")
export class BundleTxInput extends LitElement {
  @property()
  bundleText = "";

  @query("input[name='txHash']")
  txHashInput?: HTMLInputElement;

  @query("input[name='node']")
  nodeInput?: HTMLInputElement;

  @property()
  errorMessage?: string;

  async exploreTx() {
    console.log("explore");
    const txHash = this.txHashInput?.value;
    const node = this.nodeInput?.value;
    if (!txHash || !node) return;
    this.errorMessage = undefined;
    try {
      const [m0] = await Cosmos.txMessages(txHash, node);
      const { bundleText } = await Agoric.getBundle(m0);
      this.bundleText = bundleText;
      const event = new Event("set-bundle", { bubbles: true, composed: true });
      this.dispatchEvent(event);
    } catch (err) {
      console.error("@@@err", err);
      this.errorMessage = (err as Error).message || "failed to find tx";
    }
  }

  render() {
    return html` <fieldset>
      <legend>Explore Transaction</legend>
      <label
        >txHash: <small><input name="txHash" /></small
      ></label>
      <small>of InstallBundle tx</small>
      <br />
      <label>node: <input name="node" value="devnet.api.agoric.net" /></label>
      <br />
      <button type="button" @click=${this.exploreTx}>Explore</button>
      <p class="error">${this.errorMessage}</p>
    </fieldset>`;
  }
}
