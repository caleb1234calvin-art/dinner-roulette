// Execute actual TypeScript modules in Node tests without a second implementation.
// Only the server-function framework is replaced, to expose validate/execute.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

export function createTsTestLoader() {
  const cache = new Map();
  const nativeRequire = createRequire(import.meta.url);
  function load(file, extra = "") {
    file = path.resolve(file);
    if (!fs.existsSync(file)) file += ".ts";
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const source = fs.readFileSync(file, "utf8") + extra;
    const { outputText } = ts.transpileModule(source, {
      fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    });
    const require = (specifier) => {
      if (specifier === "@tanstack/react-start") return {
        createServerFn: () => ({ validator(validate) { return { handler(execute) { return { validate, execute }; } }; } }),
      };
      if (specifier.startsWith("@/")) return load(path.resolve("src", specifier.slice(2)));
      if (specifier.startsWith(".")) return load(path.resolve(path.dirname(file), specifier));
      return nativeRequire(specifier);
    };
    vm.runInThisContext("(function(require,module,exports){\n" + outputText + "\n})", { filename: file })(require, module, module.exports);
    return module.exports;
  }
  return load;
}
