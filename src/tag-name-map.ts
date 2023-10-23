import { BundleExplorer } from "./bundle-explorer.ts";
import { BundleFileInput } from "./bundle-file-input.ts";
import { BundleInfo } from "./bundle-info.ts";
import { BundleTxInput } from "./bundle-tx-input.ts";
import { FileList } from "./file-list.ts";

declare global {
  interface HTMLElementTagNameMap {
    "bundle-explorer": BundleExplorer;
    "bundle-file": BundleFileInput;
    "bundle-tx": BundleTxInput;
    "bundle-info": BundleInfo;
    "file-list": FileList;
  }
}
