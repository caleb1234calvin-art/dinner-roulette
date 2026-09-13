import fs from "node:fs";
import ts from "typescript";

const SOURCE = "src/lib/nightlife/search.ts";

// Read the list the server actually consumes; new runtime passes cannot silently
// escape validation because a second hard-coded audit list was left behind.
export function catalogImports(source) {
  const tree = ts.createSourceFile(SOURCE, source, ts.ScriptTarget.Latest, true);
  const imports = new Map();
  let initializer;
  for (const statement of tree.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const specifier = statement.moduleSpecifier.text;
      if (!/^\.\/casino-catalog(?:-pass-\d+)?$/.test(specifier)) continue;
      const bindings = statement.importClause?.namedBindings;
      if (!bindings || !ts.isNamedImports(bindings)) throw new Error("Catalog requires named imports");
      for (const entry of bindings.elements) {
        if (imports.has(entry.name.text)) throw new Error("Duplicate catalog import");
        imports.set(entry.name.text, {
          file: "src/lib/nightlife/" + specifier.slice(2) + ".ts",
          exportName: (entry.propertyName ?? entry.name).text,
        });
      }
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.name.text === "CASINO_PASSES") {
          if (initializer) throw new Error("Duplicate CASINO_PASSES declaration");
          initializer = declaration.initializer;
        }
      }
    }
  }
  while (initializer && (ts.isAsExpression(initializer) || ts.isSatisfiesExpression(initializer)
    || ts.isParenthesizedExpression(initializer))) initializer = initializer.expression;
  if (!initializer || !ts.isArrayLiteralExpression(initializer) || !initializer.elements.length) {
    throw new Error("CASINO_PASSES must be a nonempty static array");
  }
  const seen = new Set();
  const result = initializer.elements.map((entry, index) => {
    if (!ts.isIdentifier(entry) || !imports.has(entry.text)) throw new Error("Unresolved catalog in CASINO_PASSES");
    const item = imports.get(entry.text);
    if (seen.has(item.file)) throw new Error("Duplicate catalog in CASINO_PASSES");
    seen.add(item.file);
    const pass = item.file.match(/-pass-(\d+)\.ts$/)?.[1] ?? "1";
    if (Number(pass) !== index + 1) throw new Error("Catalog passes must be complete and chronological");
    return item;
  });
  if (imports.size !== result.length) throw new Error("Imported catalog is not registered in CASINO_PASSES");
  return result;
}

export async function loadCasinoCatalogs({ read = (path) => fs.readFileSync(path, "utf8") } = {}) {
  const catalogs = catalogImports(read(SOURCE));
  const records = [];
  for (const { file, exportName } of catalogs) {
    const { outputText } = ts.transpileModule(read(file), {
      fileName: file,
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    });
    const catalog = await import("data:text/javascript;base64," + Buffer.from(outputText).toString("base64"));
    const places = catalog[exportName];
    if (!Array.isArray(places) || places.length === 0) throw new Error(file + ": missing or empty " + exportName);
    records.push(...places.map((place) => ({ ...place, file })));
  }
  return { records, catalogs };
}
