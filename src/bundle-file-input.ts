import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { bundleContext } from "./ctx/bundle-ctx.js";
import { ContextProvider } from "@lit/context";

@customElement("bundle-file")
export class BundleFileInput extends LitElement {
  @property()
  bundleText = "";

  async _onChange(ev: Event) {
    const elt = ev.target as HTMLInputElement;
    const [file] = elt.files || [];

    if (file) {
      const text = await file.text();
      console.log("File:", text.length, text.slice(0, 80));
      this.bundleText = text;
      const event = new Event("set-bundle", { bubbles: true, composed: true });
      this.dispatchEvent(event);
    }
  }

  render() {
    return html`
    <fieldset>
        <legend>Explore File</legend>
        <label title="endoZipBase64 in .json format">File:
         <input type="file" name="bundleFile" @change=${this._onChange} /></small></label>
    </fieldset>`;
  }
}
