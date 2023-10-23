import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property } from "lit/decorators.js";

@customElement("file-list")
export class FileList extends LitElement {
  @property({ type: Object })
  files: [name: string, detail: { size: number }][] = [];

  static styles = css`
    .report {
      border-collapse: collapse;
      font-family: sans-serif;
    }

    .report tr:nth-child(odd) {
      background-color: #fff;
    }

    .report tr:nth-child(even) {
      background-color: #eee;
    }

    th,
    td {
      border: 1px solid black;
      padding: 4px;
    }
  `;

  render() {
    return html` <section>
      <h2>Files</h2>
      <table class="report">
        <thead>
          <tr>
            <th>Size</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          ${repeat(
            this.files,
            ([name, _d]) => name,
            ([name, { size }]) =>
              html`<tr>
                <td>${size}</td>
                <td>${name}</td>
              </tr>`
          )}
        </tbody>
      </table>
    </section>`;
  }
}
