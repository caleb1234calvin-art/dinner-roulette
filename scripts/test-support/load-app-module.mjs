import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
const requirePackage = createRequire(import.meta.url);

// Executes the actual application validators, handlers and normalization graph.
// Only the TanStack RPC transport is replaced; browser/RPC tests are separate.
export function appModuleLoader() {
  const modules = new Map();
  const transport = {
    createServerFn() {
      let validate = (value) => value;
      return {
        validator(fn) {
          validate = fn;
          return this;
        },
        handler(fn) {
          return async ({ data }) => fn({ data: validate(data) });
        },
      };
    },
  };
  function load(file) {
    file = resolve(file);
    if (modules.has(file)) return modules.get(file).exports;
    const module = { exports: {} };
    modules.set(file, module);
    const source = readFileSync(file, "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    });
    const require = (specifier) => {
      if (specifier === "@tanstack/react-start") return transport;
      if (!specifier.startsWith(".") && !specifier.startsWith("@/"))
        return requirePackage(specifier);
      const base = specifier.startsWith("@/")
        ? resolve("src", specifier.slice(2))
        : resolve(dirname(file), specifier);
      const path = [base, base + ".ts", base + ".tsx", base + ".js", base + ".mjs"].find(
        existsSync,
      );
      if (!path) throw new Error(`Cannot resolve ${specifier} from ${file}`);
      return load(path);
    };
    new Function("require", "module", "exports", outputText)(require, module, module.exports);
    return module.exports;
  }
  return load;
}
