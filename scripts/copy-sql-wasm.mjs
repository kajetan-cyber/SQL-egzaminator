import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const source = require.resolve("sql.js/dist/sql-wasm.wasm");
const targetDir = join(root, "public");
const target = join(targetDir, "sql-wasm.wasm");

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);
