// Converts a PineScript AST into runnable JavaScript with all the necessary runtime scaffolding.

import { builtins } from './builtins.js';

class CodeGenerator {
  constructor() {
    this.output = [];
    this.level = 0;
    this.context = {
      variables: new Set(),
      inputs: [],
      inStrategy: false,
      stateVars: new Set()
    };
    this.indent = '  ';
    this.functions = new Map();

    this.methodFunctions = new Set();
    this.localRenameStack = [];

    this.functionLocalDeclStack = [];

    this.renameMap = new Map();

    this.reservedNamespaces = new Set([
      'ta', 'math', 'array', 'str',
      'color', 'table', 'position', 'location', 'shape', 'size', 'text',
      'strategy',
      'state'
    ]);
  }

  // Renames user-declared variables that collide with reserved Pine namespaces
  // (like "ta" or "strategy") so they don't shadow the runtime objects.
  getSafeName(name) {
    if (this.reservedNamespaces.has(name)) {
      const existing = this.renameMap.get(name);
      if (existing) return existing;
      let i = 1;
      let candidate = `${name}_${i}`;
      while (this.context.variables.has(candidate) || this.reservedNamespaces.has(candidate)) {
        i++;
        candidate = `${name}_${i}`;
      }
      this.renameMap.set(name, candidate);
      return candidate;
    }
    return name;
  }

  indentStr() {
    return this.indent.repeat(this.level);
  }

  write(text) {
    this.output.push(text);
  }

  writeln(text = '') {
    this.output.push(this.indentStr() + text);
  }

  pushIndent() {
    this.level++;
  }

  popIndent() {
    this.level--;
  }

  // Main dispatch: walks each AST node and calls the appropriate generator method.
  generate(node) {
    if (!node) return '';

    switch (node.type) {
      case 'StudyDeclaration':
        return this.generateStudyDeclaration(node);

      case 'ForStatement':
        return this.generateForStatement(node);

      case 'ForInStatement':
        return this.generateForInStatement(node);

      case 'ImportDeclaration':
        return;

      case 'TypeDeclaration':
        return;

      case 'MultiDeclaration':
        for (const decl of node.declarations) {
          this.generate(decl);
        }
        return;

      case 'SwitchExpression':
        return this.generateSwitchExpression(node);

      case 'DestructuringAssignment':
        return this.generateDestructuringAssignment(node);

      case 'AssignmentExpression':
        return this.generateAssignmentExpression(node);

      default:
        const methodName = `generate${node.type}`;
        if (typeof this[methodName] === 'function') {
          return this[methodName](node);
        }

        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  // Handles Pine's tuple unpacking syntax, e.g. [a, b] = someFunction().
  // Underscores are treated as placeholders for values the script doesn't need.
  generateDestructuringAssignment(node) {
    const targets = (node.targets || []).filter(t => t !== '_');
    const lhs = `[${(node.targets || []).map(t => t === '_' ? '' : t).join(', ')}]`;

    const needsDeclaration = targets.some(t => !this.context.variables.has(t) && !this.reservedNamespaces.has(t));
    if (needsDeclaration) {
      for (const t of targets) {
        if (!this.reservedNamespaces.has(t)) this.context.variables.add(t);
      }
      this.writeln(`let ${lhs} = ${this.generate(node.value)};`);
      return;
    }

    this.writeln(`${lhs} = ${this.generate(node.value)};`);
  }

  // Pine's switch-as-expression becomes a chain of ternary operators in JavaScript,
  // since JS switch statements can't be used as values.
  generateSwitchExpression(node) {
    const subject = node.subject ? this.generate(node.subject) : null;
    let expr = 'null';
    for (let i = node.cases.length - 1; i >= 0; i--) {
      const c = node.cases[i];
      if (c.matchExpr === null) {
        expr = this.generate(c.valueExpr);
      } else {
        const cond = subject ? `(${subject} === ${this.generate(c.matchExpr)})` : `(${this.generate(c.matchExpr)})`;
        const val = this.generate(c.valueExpr);
        expr = `(${cond} ? ${val} : ${expr})`;
      }
    }
    return expr;
  }

  // Emits the entire JavaScript program: runtime helpers, built-in function table,
  // global shims for Pine namespaces, and the user's script wrapped in a main() function.
  generateProgram(node) {
    this.write('// Auto-generated JavaScript from PineScript source\n');
    this.write('// Do not edit by hand -- re-run the converter instead\n\n');

    this.write('// All the built-in PineScript functions that scripts depend on at runtime\n');
    this.write('const pinescript = {\n');
    this.pushIndent();
    for (const [name, func] of builtins) {
      const funcStr = typeof func === 'function' ? func.toString() : JSON.stringify(func);
      this.writeln(`${name}: ${funcStr},`);
    }
    this.popIndent();
    this.write('};\n\n');

    // Some built-in implementations reference `builtins.get(...)` internally.
    // This Map lets those functions resolve their dependencies at runtime.
    this.write('const builtins = new Map(Object.entries(pinescript));\n\n');

    this.write('globalThis.__pineRuntime = globalThis.__pineRuntime || { plots: [], plotshapes: [], alerts: [] };\n');
    this.write('globalThis.pinescript = pinescript;\n\n');

    this.write('pinescript.strategy.long = pinescript.strategyLong();\n');
    this.write('pinescript.strategy.short = pinescript.strategyShort();\n\n');

    // Scripts that call input.timeframe() need this shim so it resolves
    // even when we're not running inside a full charting environment.
    this.write('globalThis.input = globalThis.input || {};\n');
    this.write('globalThis.input.timeframe = globalThis.input.timeframe || ((defval) => defval);\n\n');

    // Shim for Pine's array namespace -- delegates to the pinescript runtime functions.
    this.write('globalThis.array = globalThis.array || {\n');
    this.write('  from: (...items) => items,\n');
    this.write('  size: (arr) => pinescript.arraySize(arr),\n');
    this.write('  get: (arr, i) => pinescript.arrayGet(arr, i),\n');
    this.write('  set: (arr, i, v) => pinescript.arraySet(arr, i, v),\n');
    this.write('  push: (arr, v) => pinescript.arrayPush(arr, v),\n');
    this.write('  pop: (arr) => pinescript.arrayPop(arr),\n');
    this.write('  unshift: (arr, v) => pinescript.arrayUnshift(arr, v),\n');
    this.write('  shift: (arr) => pinescript.arrayShift(arr),\n');
    this.write('  clear: (arr) => pinescript.arrayClear(arr),\n');
    this.write('  remove: (arr, i) => pinescript.arrayRemove(arr, i),\n');
    this.write('};\n\n');

    this.write('globalThis.hline = globalThis.hline || { style_dotted: "style_dotted", style_solid: "style_solid" };\n\n');

    // SeriesArray lets Pine series values participate in arithmetic via valueOf(),
    // so expressions like `close + 1` work naturally in the generated JS.
    this.write('class SeriesArray extends Array {\n');
    this.write('  valueOf() { return this.length ? this[this.length - 1] : NaN; }\n');
    this.write('  toString() { return String(this.valueOf()); }\n');
    this.write('}\n');
    this.write('pinescript.asSeries = function(v) {\n');
    this.write('  if (v === null || v === undefined) return v;\n');
    this.write('  if (v instanceof SeriesArray) return v;\n');
    this.write('  if (Array.isArray(v)) return Object.setPrototypeOf(v, SeriesArray.prototype);\n');
    this.write('  return v;\n');
    this.write('};\n\n');

    this.write('globalThis.timeframe = globalThis.timeframe || { period: "D" };\n');

    // Parses Pine timeframe strings ("5", "60", "D", "W", etc.) into milliseconds
    // so that request.security can bucket bars into higher-timeframe groups.
    this.write('pinescript._parseTimeframeMs = function(tf) {\n');
    this.write('  if (tf === null || tf === undefined) return null;\n');
    this.write('  const s = String(tf).trim().toUpperCase();\n');
    this.write('  if (/^\\d+$/.test(s)) return parseInt(s, 10) * 60 * 1000;\n');
    this.write('  if (s.endsWith("S")) return parseInt(s.slice(0, -1), 10) * 1000;\n');
    this.write('  if (s.endsWith("H")) return parseInt(s.slice(0, -1), 10) * 60 * 60 * 1000;\n');
    this.write('  if (s === "D") return 24 * 60 * 60 * 1000;\n');
    this.write('  if (s === "W") return 7 * 24 * 60 * 60 * 1000;\n');
    this.write('  if (s === "M") return 30 * 24 * 60 * 60 * 1000;\n');
    this.write('  return null;\n');
    this.write('};\n\n');

    // Simulates Pine's request.security() by re-sampling a series into
    // higher-timeframe buckets based on the bar timestamps.
    this.write('pinescript.requestSecurity = function(symbol, tf, series, opts) {\n');
    this.write('  const timeSeries = globalThis.time;\n');
    this.write('  if (!Array.isArray(timeSeries) || !Array.isArray(series)) return series;\n');
    this.write('  const ms = pinescript._parseTimeframeMs(tf);\n');
    this.write('  if (!ms) return series;\n');
    this.write('  const lookahead = opts?.lookahead ?? false;\n');
    this.write('  const gaps = opts?.gaps ?? false;\n');
    this.write('  const out = [];\n');
    this.write('  let bucket = null;\n');
    this.write('  let bucketVal = null;\n');
    this.write('  for (let i = 0; i < timeSeries.length; i++) {\n');
    this.write('    const t = timeSeries[i];\n');
    this.write('    const b = Math.floor(t / ms);\n');
    this.write('    if (bucket === null) { bucket = b; bucketVal = series[i]; }\n');
    this.write('    if (b !== bucket) { bucket = b; bucketVal = series[i]; } else { bucketVal = series[i]; }\n');
    this.write('    if (lookahead) out.push(bucketVal); else out.push(gaps ? null : bucketVal);\n');
    this.write('  }\n');
    this.write('  return pinescript.asSeries(out);\n');
    this.write('};\n\n');

    this.write('globalThis.request = globalThis.request || {\n');
    this.write('  security: function(symbol, tf, series, opts) { return pinescript.requestSecurity(symbol, tf, series, opts); },\n');
    this.write('  financial: function() { return null; }\n');
    this.write('};\n\n');

    // Constants that Pine scripts use when calling request.security with
    // gap-filling or lookahead options.
    this.write('globalThis.barmerge = globalThis.barmerge || {\n');
    this.write('  gaps_off: false,\n');
    this.write('  gaps_on: true,\n');
    this.write('  lookahead_off: false,\n');
    this.write('  lookahead_on: true,\n');
    this.write('};\n\n');

    // Minimal color namespace -- provides hex parsing, gradient interpolation,
    // rgb construction, and a handful of named color constants.
    this.write('pinescript.color = {\n');
    this.write('  hex: function(s) {\n');
    this.write('    if (typeof s !== "string" || s[0] !== "#") return { r: 0, g: 0, b: 0, a: 255 };\n');
    this.write('    const hex = s.slice(1);\n');
    this.write('    const hasAlpha = hex.length === 8;\n');
    this.write('    const r = parseInt(hex.slice(0, 2), 16) || 0;\n');
    this.write('    const g = parseInt(hex.slice(2, 4), 16) || 0;\n');
    this.write('    const b = parseInt(hex.slice(4, 6), 16) || 0;\n');
    this.write('    const a = hasAlpha ? (parseInt(hex.slice(6, 8), 16) || 255) : 255;\n');
    this.write('    return { r, g, b, a };\n');
    this.write('  },\n');
    this.write('  from_gradient: function(value, min, max, color1, color2) {\n');
    this.write('    const c1 = color1 || { r: 0, g: 0, b: 0, a: 255 };\n');
    this.write('    const c2 = color2 || { r: 255, g: 255, b: 255, a: 255 };\n');
    this.write('    if (value === null || value === undefined || min === null || min === undefined || max === null || max === undefined) return c1;\n');
    this.write('    const denom = (max - min);\n');
    this.write('    const t = denom === 0 ? 0 : Math.max(0, Math.min(1, (value - min) / denom));\n');
    this.write('    const lerp = (a, b) => Math.round(a + (b - a) * t);\n');
    this.write('    return { r: lerp(c1.r ?? 0, c2.r ?? 0), g: lerp(c1.g ?? 0, c2.g ?? 0), b: lerp(c1.b ?? 0, c2.b ?? 0), a: lerp(c1.a ?? 255, c2.a ?? 255) };\n');
    this.write('  },\n');
    this.write('  rgb: function(r, g, b, a) { return { r, g, b, a: a ?? 255 }; },\n');
    this.write('  new: function(c, transp) { return { ...(c || {}), transp: transp ?? 0 }; },\n');
    this.write('  r: function(c) { return c?.r ?? 0; },\n');
    this.write('  g: function(c) { return c?.g ?? 0; },\n');
    this.write('  b: function(c) { return c?.b ?? 0; },\n');
    this.write('  red: { r: 255, g: 0, b: 0, a: 255 },\n');
    this.write('  green: { r: 0, g: 255, b: 0, a: 255 },\n');
    this.write('  blue: { r: 0, g: 0, b: 255, a: 255 },\n');
    this.write('  gray: { r: 128, g: 128, b: 128, a: 255 },\n');
    this.write('};\n\n');

    // Shape, size, location, and position constants that Pine plotting functions expect.
    this.write('pinescript.size = { small: "small", normal: "normal", large: "large" };\n');
    this.write('pinescript.shape = { triangleup: "triangleup", triangledown: "triangledown", circle: "circle", square: "square" };\n');
    this.write('pinescript.location = { belowbar: "belowbar", abovebar: "abovebar" };\n');
    this.write('pinescript.position = { top_right: "top_right", top_left: "top_left", bottom_right: "bottom_right", bottom_left: "bottom_left" };\n');
    this.write('pinescript.text = { align_center: "center" };\n\n');

    // Table namespace -- enough to let scripts create tables and populate cells
    // without crashing, even though we don't render them visually.
    this.write('pinescript.table = {\n');
    this.write('  new: function(position, columns, rows, opts) { return { position, columns, rows, opts: opts || {}, cells: [] }; },\n');
    this.write('  cell: function(table, column, row, text, opts) {\n');
    this.write('    if (!table) return null;\n');
    this.write('    table.cells.push({ column, row, text, opts: opts || {} });\n');
    this.write('    return null;\n');
    this.write('  }\n');
    this.write('};\n\n');

    // Declare each input parameter as a constant with its default value.
    this.write('// Script input parameters and their defaults\n');
    for (const input of node.inputs || []) {
      this.writeln(`const ${input.name} = ${JSON.stringify(input.defaultValue)}; // ${input.inputType}`);
    }

    // Emit constructor stubs for user-defined Pine types so that
    // calls like MyType.new(field1, field2) produce plain JS objects.
    for (const stmt of node.body || []) {
      if (stmt && stmt.type === 'TypeDeclaration') {
        const typeName = stmt.name;
        const fieldNames = (stmt.fields || []).map(f => f.fieldName);
        const argsList = fieldNames.join(', ');
        const objBody = fieldNames.map(n => `${n}: ${n}`).join(', ');
        this.writeln(`const ${typeName} = { new: function(${argsList}) { return { ${objBody} }; } };`);
        this.context.variables.add(typeName);
      }
    }

    // Wrap the user's script body in a main() function that sets up
    // per-bar state and wraps OHLCV globals as series arrays.
    this.write('\n// The transpiled script logic, called once per bar\n');
    this.write('function main() {\n');
    this.pushIndent();

    this.functionLocalDeclStack.push(new Set());

    this.writeln('globalThis.__pineState = globalThis.__pineState || {};');
    this.writeln('const state = globalThis.__pineState["main"] = globalThis.__pineState["main"] || {};');

    this.writeln('open = pinescript.asSeries(globalThis.open);');
    this.writeln('high = pinescript.asSeries(globalThis.high);');
    this.writeln('low = pinescript.asSeries(globalThis.low);');
    this.writeln('close = pinescript.asSeries(globalThis.close);');
    this.writeln('volume = pinescript.asSeries(globalThis.volume);');
    this.writeln('time = pinescript.asSeries(globalThis.time);');

    for (const statement of node.body) {
      this.generate(statement);
    }

    this.functionLocalDeclStack.pop();

    this.popIndent();
    this.write('}\n\n');

    // Export the main entry point along with any input parameters
    // so the host environment can inspect and override them.
    this.write('export { main');
    for (const input of node.inputs || []) {
      this.write(`, ${input.name}`);
    }
    this.write('};\n');

    return this.output.join('\n');
  }

  generateInputDeclaration(node) {
    this.context.inputs.push(node);
    this.writeln(`// Input: ${node.name} (${node.inputType})`);
    this.writeln(`const ${this.getSafeName(node.name)} = ${JSON.stringify(node.defaultValue)};`);
  }

  generateTypedDeclarationStatement(node) {
    const type = node.dataType;
    const name = this.getSafeName(node.name);
    const value = node.value;
    const alreadyDeclared = this.markLocalDeclared(name);
    const declPrefix = alreadyDeclared ? '' : 'let ';
    if (value) {
      this.writeln(`${declPrefix}${name} = ${this.generate(value)};`);
    } else {
      // Use a sensible zero-value based on the Pine type annotation.
      const defaultValue = this.getDefaultValueForType(type);
      this.writeln(`${declPrefix}${name} = ${defaultValue};`);
    }
  }

  generateVariableDeclaration(node) {
    const name = this.getSafeName(node.name);
    const prefix = (node.isVarip || node.isVar || node.declaredType) ? 'let' : 'const';
    if (node.isVar || node.isVarip) {
      // var/varip declarations persist across bars, so we store them in the state object
      // and only initialize on the very first bar.
      this.context.stateVars.add(name);
      this.writeln(`if (state.${name} === undefined) state.${name} = ${this.generate(node.value)};`);
      return;
    }

    this.context.variables.add(name);
    this.writeln(`${prefix} ${name} = ${this.generate(node.value)};`);
  }

  generateAssignment(node) {
    // Pine lets you assign to a variable without declaring it first.
    // We detect the first assignment and emit a `let` declaration automatically.
    if (node.target && node.target.type === 'Identifier') {
      const name = this.getSafeName(node.target.name);
      if (this.context.stateVars.has(name)) {
        this.writeln(`state.${name} = ${this.generate(node.value)};`);
        return;
      }
      if (!this.context.variables.has(name) && !this.reservedNamespaces.has(name)) {
        this.context.variables.add(name);
        this.writeln(`let ${name} = ${this.generate(node.value)};`);
        return;
      }
    }

    let targetCode = this.generate(node.target);

    if (node.operator === '=' || node.operator === ':=') {
      this.writeln(`${targetCode} = ${this.generate(node.value)};`);
    } else {
      const op = node.operator.replace('=', '');
      this.writeln(`${targetCode} ${op}= ${this.generate(node.value)};`);
    }
  }

  // Inline assignment expression -- Pine's := inside an expression context.
  generateAssignmentExpression(node) {
    const op = node.operator === ':=' ? '=' : node.operator;
    return `(${this.generate(node.target)} ${op} ${this.generate(node.value)})`;
  }

  generateIfStatement(node) {
    this.writeln(`if (${this.generate(node.condition)}) {`);
    this.pushIndent();
    if (node.thenBranch && node.thenBranch.type === 'Block') {
      for (const statement of node.thenBranch.statements) {
        this.generate(statement);
      }
    } else {
      this.generate(node.thenBranch);
    }
    this.popIndent();

    if (node.elseBranch) {
      this.writeln('} else {');
      this.pushIndent();
      if (node.elseBranch.type === 'Block') {
        for (const statement of node.elseBranch.statements) {
          this.generate(statement);
        }
      } else {
        this.generate(node.elseBranch);
      }
      this.popIndent();
    }

    this.writeln('}');
  }

  generateForStatement(node) {
    this.writeln(`for (let ${node.variable} = ${this.generate(node.start)}; ${node.variable} <= ${this.generate(node.end)}; ${node.variable}++) {`);
    this.pushIndent();
    this.generate(node.body);
    this.popIndent();
    this.writeln('}');
  }

  generateForInStatement(node) {
    const variable = Array.isArray(node.variable) ? `[${node.variable.join(', ')}]` : node.variable;
    this.writeln(`for (const ${variable} of ${this.generate(node.iterable)}) {`);
    this.pushIndent();
    this.generate(node.body);
    this.popIndent();
    this.writeln('}');
  }

  generateWhileStatement(node) {
    this.writeln(`while (${this.generate(node.condition)}) {`);
    this.pushIndent();
    this.generate(node.body);
    this.popIndent();
    this.writeln('}');
  }

  // Pine's switch statement. When there is no subject expression, each case
  // is really a boolean guard, so we emit an if/else-if chain instead.
  generateSwitchStatement(node) {
    if (node.expression == null) {
      let first = true;
      for (const caseNode of node.cases) {
        if (caseNode.value === null) {
          this.writeln('else {');
        } else if (first) {
          this.writeln(`if (${this.generate(caseNode.value)}) {`);
        } else {
          this.writeln(`else if (${this.generate(caseNode.value)}) {`);
        }
        this.pushIndent();
        for (const stmt of caseNode.body) {
          this.generate(stmt);
        }
        this.popIndent();
        this.writeln('}');
        first = false;
      }
      return;
    }

    this.writeln(`switch (${this.generate(node.expression)}) {`);
    this.pushIndent();

    for (const caseNode of node.cases) {
      if (caseNode.value === null) {
        this.writeln('default:');
      } else {
        this.writeln(`case ${this.generate(caseNode.value)}:`);
      }
      // Each case body gets its own block so that let/const declarations
      // in different cases don't collide with each other.
      this.writeln('{');
      this.pushIndent();
      for (const stmt of caseNode.body) {
        this.generate(stmt);
      }
      this.writeln('break;');
      this.popIndent();
      this.writeln('}');
    }

    this.popIndent();
    this.writeln('}');
  }

  generateBreakStatement() {
    this.writeln('break;');
  }

  generateContinueStatement() {
    this.writeln('continue;');
  }

  generateReturnStatement(node) {
    this.writeln(`return ${this.generate(node.value)};`);
  }

  generateStudyDeclaration(node) {
    this.context.inStrategy = node.isStrategy;
    this.writeln(`// ${node.isStrategy ? 'Strategy' : 'Study'}: ${node.title}`);
    this.writeln(`// Options: ${JSON.stringify(node.options)}`);
  }

  // Transpiles a Pine function declaration into a plain JS function.
  // If the function is a Pine method, we rewrite `this` to `_this` to
  // avoid clashing with JavaScript's own `this` keyword.
  generateFunctionDeclaration(node) {
    if (node.isMethod) {
      this.methodFunctions.add(node.name);
    }

    const localRename = new Map();
    const params = (node.params || []).map(p => {
      if (typeof p === 'string') return p;
      if (p && typeof p === 'object') {
        let paramName = p.name;
        if (node.isMethod && paramName === 'this') {
          paramName = '_this';
          localRename.set('this', '_this');
        }
        if (p.defaultValue) return `${paramName} = ${this.generate(p.defaultValue)}`;
        return paramName;
      }
      return String(p);
    });

    this.localRenameStack.push(localRename);
    this.functionLocalDeclStack.push(new Set());
    this.writeln(`function ${node.name}(${params.join(', ')}) {`);
    this.pushIndent();

    if (node.body && node.body.type === 'Block') {
      const stmts = node.body.statements || [];
      for (let i = 0; i < stmts.length; i++) {
        const statement = stmts[i];
        const isLast = i === stmts.length - 1;
        if (isLast && statement && statement.type === 'ExpressionStatement') {
          this.writeln(`return ${this.generate(statement.expression)};`);
        } else {
          this.generate(statement);
        }
      }
    } else {
      this.writeln(`return ${this.generate(node.body)};`);
    }

    this.popIndent();
    this.writeln('}');
  }

  generateBlock(node) {
    const isTopLevel = this.indentLevel === 0;
    if (isTopLevel) {
      this.writeln('{');
      this.pushIndent();
    }
    for (const statement of node.statements) {
      this.generate(statement);
    }
    if (isTopLevel) {
      this.popIndent();
      this.writeln('}');
    }
  }

  generateExpressionStatement(node) {
    if (node.expression && node.expression.type === 'SequenceExpression') {
      for (const expr of node.expression.expressions || []) {
        this.writeln(`${this.generate(expr)};`);
      }
      return;
    }
    this.writeln(`${this.generate(node.expression)};`);
  }

  generateSequenceExpression(node) {
    return `(${(node.expressions || []).map(e => this.generate(e)).join(', ')})`;
  }

  generateBinaryExpression(node) {
    const left = this.generate(node.left);
    const right = this.generate(node.right);
    const op = this.mapOperator(node.operator);
    return `(${left} ${op} ${right})`;
  }

  generateUnaryExpression(node) {
    const operand = this.generate(node.operand);
    if (node.operator === 'not') {
      return `!${operand}`;
    }
    return `${node.operator}${operand}`;
  }

  generateTernaryExpression(node) {
    const condition = this.generate(node.condition);
    const trueExpr = this.generate(node.trueExpr);
    const falseExpr = this.generate(node.falseExpr);
    return `(${condition} ? ${trueExpr} : ${falseExpr})`;
  }

  generateLiteral(node) {
    if (node.dataType === 'string') {
      return JSON.stringify(node.value);
    }
    if (node.dataType === 'color_hex') {
      return `pinescript.color.hex(${JSON.stringify(node.value)})`;
    }
    if (node.dataType === 'na') {
      return 'null';
    }
    return String(node.value);
  }

  // Resolves an identifier to its JavaScript equivalent, taking into account
  // local renames, reserved-namespace guards, and persistent state variables.
  generateIdentifier(node) {
    if (this.localRenameStack.length > 0) {
      const top = this.localRenameStack[this.localRenameStack.length - 1];
      const renamed = top?.get(node.name);
      if (renamed) return renamed;
    }
    if (this.renameMap.has(node.name)) {
      return this.renameMap.get(node.name);
    }
    if (this.reservedNamespaces.has(node.name) && !this.context.variables.has(node.name)) {
      return `pinescript.${node.name}`;
    }
    if (this.context.stateVars.has(node.name)) {
      return `state.${node.name}`;
    }
    return node.name;
  }

  // Generates a function call. Pine methods (declared with `method`) are rewritten
  // from obj.methodName(args) to methodName(obj, args) so the receiver is passed explicitly.
  generateFunctionCall(node) {
    if (node.callee && node.callee.type === 'PropertyAccess') {
      const prop = node.callee.property;
      if (this.methodFunctions.has(prop)) {
        const recv = this.generate(node.callee.object);
        const args = (node.arguments || []).map(arg => {
          if (arg && arg.type === 'NamedArgument') return this.generate(arg.value);
          return this.generate(arg);
        });
        return `${prop}(${[recv, ...args].join(', ')})`;
      }
    }
    const calleeName = this.getCalleeName(node.callee);

    const positionalArgs = [];
    const namedArgs = [];
    for (const arg of node.arguments) {
      if (arg && arg.type === 'NamedArgument') {
        namedArgs.push(arg);
      } else {
        positionalArgs.push(arg);
      }
    }

    const args = positionalArgs.map(arg => this.generate(arg));
    if (namedArgs.length > 0) {
      const opts = namedArgs
        .map(na => `${na.name}: ${this.generate(na.value)}`)
        .join(', ');
      args.push(`({ ${opts} })`);
    }

    return `${calleeName}(${args.join(', ')})`;
  }

  // Pine's `x[n]` is historical series look-back, not array indexing.
  // We translate it to a runtime helper that handles the offset safely.
  generateArrayAccess(node) {
    return `pinescript.offset(${this.generate(node.array)}, ${this.generate(node.index)})`;
  }

  generatePropertyAccess(node) {
    return `${this.generate(node.object)}.${node.property}`;
  }

  generateArrayLiteral(node) {
    const elements = node.elements.map(el => this.generate(el)).join(', ');
    return `[${elements}]`;
  }

  generateObjectLiteral(node) {
    const props = node.properties.map(prop => `${prop.key}: ${this.generate(prop.value)}`).join(', ');
    return `{${props}}`;
  }

  getCalleeName(node) {
    if (node.type === 'Identifier') {
      return this.mapFunctionName(node.name);
    }
    if (node.type === 'PropertyAccess') {
      const fullName = this.flattenPropertyAccess(node);
      if (fullName) return this.mapFunctionName(fullName);
    }
    return this.generate(node);
  }

  flattenPropertyAccess(node) {
    const parts = [];
    let cur = node;
    while (cur && cur.type === 'PropertyAccess') {
      parts.unshift(cur.property);
      cur = cur.object;
    }
    if (cur && cur.type === 'Identifier') {
      parts.unshift(cur.name);
      return parts.join('.');
    }
    return null;
  }

  // Maps a PineScript function name (like "ta.sma" or "math.abs") to its
  // JavaScript runtime equivalent (like "pinescript.sma" or "pinescript.abs").
  // The lookup is case-insensitive so that both "str.tostring" and "str.toString"
  // resolve correctly, but we also check the original casing first to allow
  // case-sensitive overrides when needed.
  mapFunctionName(name) {
    const mapping = {
      // Core utilities
      'na': 'pinescript.na',
      'nz': 'pinescript.nz',
      'fixnan': 'pinescript.fixnan',
      'isna': 'pinescript.isna',
      'isempty': 'pinescript.isempty',
      'max_bars_back': 'pinescript.maxBarsBack',

      // Color functions
      'color.rgb': 'pinescript.color.rgb',
      'color.new': 'pinescript.color.new',
      'color.hex': 'pinescript.color.hex',
      'color.from_gradient': 'pinescript.color.from_gradient',
      'color.b': 'pinescript.color.b',
      'color.t': 'pinescript.colorT',

      // Table functions
      'table.new': 'pinescript.table.new',
      'table.cell': 'pinescript.table.cell',
      'table.delete': 'pinescript.tableDelete',
      'table.clear': 'pinescript.tableClear',
      'table.cell_set_text': 'pinescript.tableCellSetText',
      'table.cell_set_bgcolor': 'pinescript.tableCellSetBgcolor',
      'table.merge_cells': 'pinescript.tableMergeCells',

      // Script declaration
      'indicator': 'pinescript.indicator',
      'strategy': 'pinescript.strategy',
      'hline': 'pinescript.hline',

      // Technical analysis -- moving averages and regression
      'ta.sma': 'pinescript.sma',
      'ta.ema': 'pinescript.ema',
      'ta.wma': 'pinescript.wma',
      'ta.vwma': 'pinescript.vwma',
      'ta.rma': 'pinescript.rma',
      'ta.hma': 'pinescript.hma',
      'ta.swma': 'pinescript.swma',
      'ta.linreg': 'pinescript.linreg',
      'ta.alma': 'pinescript.alma',

      // Technical analysis -- extremes and crossing
      'ta.lowest': 'pinescript.lowest',
      'ta.highest': 'pinescript.highest',
      'ta.crossover': 'pinescript.crossover',
      'ta.crossunder': 'pinescript.crossunder',
      'ta.change': 'pinescript.change',
      'ta.valuewhen': 'pinescript.valuewhen',
      'ta.barssince': 'pinescript.barssince',
      'ta.cum': 'pinescript.cum',
      'ta.median': 'pinescript.median',

      // Technical analysis -- volatility and momentum indicators
      'ta.supertrend': 'pinescript.supertrend',
      'ta.dmi': 'pinescript.dmi',
      'ta.adx': 'pinescript.adx',
      'ta.bb': 'pinescript.bb',
      'ta.kc': 'pinescript.kc',
      'ta.macd': 'pinescript.macd',
      'ta.rsi': 'pinescript.rsi',
      'ta.stoch': 'pinescript.stoch',
      'ta.cci': 'pinescript.cci',
      'ta.mfi': 'pinescript.mfi',
      'ta.obv': 'pinescript.obv',
      'ta.roc': 'pinescript.roc',
      'ta.percentrank': 'pinescript.percentrank',
      'ta.tr': 'pinescript.tr',
      'ta.atr': 'pinescript.atr',

      // Math namespace
      'math.round': 'pinescript.round',
      'math.pow': 'pinescript.pow',
      'math.sqrt': 'pinescript.sqrt',
      'math.abs': 'pinescript.abs',
      'math.max': 'pinescript.max',
      'math.min': 'pinescript.min',
      'math.sign': 'pinescript.sign',
      'math.avg': 'pinescript.avg',
      'math.sum': 'pinescript.sum',
      'math.random': 'pinescript.random',
      'math.log': 'pinescript.log',
      'math.log10': 'pinescript.log10',
      'math.exp': 'pinescript.exp',
      'math.floor': 'pinescript.floor',
      'math.ceil': 'pinescript.ceil',
      'math.sin': 'pinescript.sin',
      'math.cos': 'pinescript.cos',
      'math.tan': 'pinescript.tan',
      'math.asin': 'pinescript.asin',
      'math.acos': 'pinescript.acos',
      'math.atan': 'pinescript.atan',
      'math.todegrees': 'pinescript.todegrees',
      'math.toradians': 'pinescript.toradians',

      // Input functions
      'input': 'pinescript.input',
      'input.int': 'pinescript.inputInt',
      'input.float': 'pinescript.inputFloat',
      'input.bool': 'pinescript.inputBool',
      'input.string': 'pinescript.inputString',
      'input.source': 'pinescript.inputSource',
      'input.color': 'pinescript.inputColor',
      'input.time': 'pinescript.inputTime',

      // Array namespace
      'array.new': 'pinescript.arrayNew',
      'array.new_float': 'pinescript.arrayNew',
      'array.new_int': 'pinescript.arrayNew',
      'array.new_bool': 'pinescript.arrayNew',
      'array.new_string': 'pinescript.arrayNew',
      'array.new_label': 'pinescript.arrayNew',
      'array.new_line': 'pinescript.arrayNew',
      'array.new_box': 'pinescript.arrayNew',
      'array.new_polyline': 'pinescript.arrayNew',
      'array.size': 'pinescript.arraySize',
      'array.get': 'pinescript.arrayGet',
      'array.set': 'pinescript.arraySet',
      'array.push': 'pinescript.arrayPush',
      'array.pop': 'pinescript.arrayPop',
      'array.shift': 'pinescript.arrayShift',
      'array.unshift': 'pinescript.arrayUnshift',
      'array.insert': 'pinescript.arrayInsert',
      'array.remove': 'pinescript.arrayRemove',
      'array.clear': 'pinescript.arrayClear',
      'array.fill': 'pinescript.arrayFill',
      'array.sort': 'pinescript.arraySort',
      'array.reverse': 'pinescript.arrayReverse',
      'array.slice': 'pinescript.arraySlice',
      'array.contains': 'pinescript.arrayContains',
      'array.indexof': 'pinescript.arrayIndexOf',
      'array.lastindexof': 'pinescript.arrayLastIndexOf',
      'array.sum': 'pinescript.arraySum',
      'array.avg': 'pinescript.arrayAvg',
      'array.min': 'pinescript.arrayMin',
      'array.max': 'pinescript.arrayMax',
      'array.stdev': 'pinescript.arrayStdev',
      'array.variance': 'pinescript.arrayVariance',
      'array.covariance': 'pinescript.arrayCovariance',
      'array.first': 'pinescript.arrayFirst',
      'array.last': 'pinescript.arrayLast',
      'array.join': 'pinescript.arrayJoin',
      'array.concat': 'pinescript.arrayConcat',
      'array.copy': 'pinescript.arrayCopy',
      'array.binary_search': 'pinescript.arrayBinarySearch',
      'array.range': 'pinescript.arrayRange',
      'array.median': 'pinescript.arrayMedian',
      'array.mode': 'pinescript.arrayMode',
      'array.percentile_linear_interpolation': 'pinescript.arrayPercentileLinearInterpolation',
      'array.percentile_nearest_rank': 'pinescript.arrayPercentileNearestRank',
      'array.abs': 'pinescript.arrayAbs',
      'array.every': 'pinescript.arrayEvery',
      'array.some': 'pinescript.arraySome',

      // String namespace
      'str.length': 'pinescript.strLength',
      'str.len': 'pinescript.strLength',
      'str.substring': 'pinescript.strSubstring',
      'str.concat': 'pinescript.strConcat',
      'str.contains': 'pinescript.strContains',
      'str.startswith': 'pinescript.strStartsWith',
      'str.endswith': 'pinescript.strEndsWith',
      'str.replace': 'pinescript.strReplace',
      'str.replaceall': 'pinescript.strReplaceAll',
      'str.lower': 'pinescript.strLower',
      'str.upper': 'pinescript.strUpper',
      'str.tonumber': 'pinescript.strToNumber',
      'str.tostring': 'pinescript.strToString',
      'str.split': 'pinescript.strSplit',
      'str.match': 'pinescript.strMatch',
      'str.pos': 'pinescript.strPos',
      'str.rpos': 'pinescript.strRPos',
      'str.remove': 'pinescript.strRemove',
      'str.reverse': 'pinescript.strReverse',
      'str.format': 'pinescript.strFormat',

      // Matrix namespace
      'matrix.new': 'pinescript.matrixNew',
      'matrix.rows': 'pinescript.matrixRows',
      'matrix.cols': 'pinescript.matrixCols',
      'matrix.get': 'pinescript.matrixGet',
      'matrix.set': 'pinescript.matrixSet',
      'matrix.fill': 'pinescript.matrixFill',
      'matrix.sum': 'pinescript.matrixSum',
      'matrix.avg': 'pinescript.matrixAvg',
      'matrix.min': 'pinescript.matrixMin',
      'matrix.max': 'pinescript.matrixMax',
      'matrix.transpose': 'pinescript.matrixTranspose',
      'matrix.mult': 'pinescript.matrixMult',
      'matrix.inv': 'pinescript.matrixInv',

      // Map namespace
      'map.new': 'pinescript.mapNew',
      'map.size': 'pinescript.mapSize',
      'map.get': 'pinescript.mapGet',
      'map.set': 'pinescript.mapSet',
      'map.remove': 'pinescript.mapRemove',
      'map.keys': 'pinescript.mapKeys',
      'map.values': 'pinescript.mapValues',
      'map.contains': 'pinescript.mapContains',

      // Drawing -- lines, labels, boxes, polylines
      'line.new': 'pinescript.lineNew',
      'line.delete': 'pinescript.lineDelete',
      'line.setxy': 'pinescript.lineSetXY',
      'line.set_xy1': 'pinescript.lineSetXY',
      'line.set_xy2': 'pinescript.lineSetXY',
      'line.getx': 'pinescript.lineGetX',
      'line.gety': 'pinescript.lineGetY',
      'label.new': 'pinescript.labelNew',
      'label.delete': 'pinescript.labelDelete',
      'label.settext': 'pinescript.labelSetText',
      'label.set_text': 'pinescript.labelSetText',
      'label.gettext': 'pinescript.labelGetText',
      'label.get_text': 'pinescript.labelGetText',
      'box.new': 'pinescript.boxNew',
      'box.delete': 'pinescript.boxDelete',
      'polyline.new': 'pinescript.polylineNew',
      'polyline.delete': 'pinescript.polylineDelete',

      // Chart points
      'chart.point.from_index': 'pinescript.chartPointFromIndex',
      'chart.point.new': 'pinescript.chartPointNew',

      // Data requests
      'request.security': 'pinescript.requestSecurity',
      'request.financial': 'pinescript.requestFinancial',

      // Plotting and visual output
      'plot': 'pinescript.plot',
      'plotshape': 'pinescript.plotshape',
      'plotbar': 'pinescript.plotbar',
      'plotcandle': 'pinescript.plotcandle',
      'bgcolor': 'pinescript.bgcolor',
      'fill': 'pinescript.fill',
      'alert': 'pinescript.alert',

      // Strategy order functions
      'strategy.entry': 'pinescript.strategyEntry',
      'strategy.close': 'pinescript.strategyClose',
      'strategy.exit': 'pinescript.strategyExit',
      'strategy.order': 'pinescript.strategyOrder',
      'strategy.long': 'pinescript.strategyLong',
      'strategy.short': 'pinescript.strategyShort',

      // Date and time functions
      'year': 'pinescript.year',
      'month': 'pinescript.month',
      'weekofyear': 'pinescript.weekofyear',
      'dayofmonth': 'pinescript.dayofmonth',
      'hour': 'pinescript.hour',
      'minute': 'pinescript.minute',
      'second': 'pinescript.second',
      'timestamp': 'pinescript.timestamp',
      'datetime': 'pinescript.datetime',

      // Symbol and session info
      'ticker': 'pinescript.ticker',
      'tickerid': 'pinescript.tickerID',
      'syminfo': 'pinescript.syminfo',
      'time': 'pinescript.time',
      'timenow': 'pinescript.timenow',
      'barstate': 'pinescript.barstate',
      'dividends': 'pinescript.dividends',
      'splits': 'pinescript.splits',
      'earnings': 'pinescript.earnings',

      // Price series
      'volume': 'pinescript.volume',
      'open': 'pinescript.open',
      'high': 'pinescript.high',
      'low': 'pinescript.low',
      'close': 'pinescript.close',
      'hl2': 'pinescript.hl2',
      'hlc3': 'pinescript.hlc3',
      'ohlc4': 'pinescript.ohlc4',

      // Bare (non-namespaced) function names for backward compatibility
      // with older PineScript versions that didn't require the ta./math. prefix.
      'sma': 'pinescript.sma',
      'ema': 'pinescript.ema',
      'wma': 'pinescript.wma',
      'vwma': 'pinescript.vwma',
      'rma': 'pinescript.rma',
      'wvwma': 'pinescript.wvwma',
      'stoch': 'pinescript.stoch',
      'stochk': 'pinescript.stochk',
      'stochd': 'pinescript.stochd',
      'bb': 'pinescript.bb',
      'bbands': 'pinescript.bbands',
      'kc': 'pinescript.kc',
      'kcbands': 'pinescript.kcbands',
      'atr': 'pinescript.atr',
      'rsi': 'pinescript.rsi',
      'macd': 'pinescript.macd',
      'cci': 'pinescript.cci',
      'mfi': 'pinescript.mfi',
      'obv': 'pinescript.obv',
      'ad': 'pinescript.ad',
      'adosc': 'pinescript.adosc',
      'cmf': 'pinescript.cmf',
      'vwap': 'pinescript.vwap',
      'heikinashi': 'pinescript.heikinashi',
      'renko': 'pinescript.renko',
      'kagi': 'pinescript.kagi',
      'pointfigure': 'pinescript.pointfigure',
      'alma': 'pinescript.alma',
      'hma': 'pinescript.hma',
      'wss': 'pinescript.wss',
      'tr': 'pinescript.tr',
      'rising': 'pinescript.rising',
      'falling': 'pinescript.falling',
      'cross': 'pinescript.cross',
      'crossover': 'pinescript.crossover',
      'crossunder': 'pinescript.crossunder',
      'offset': 'pinescript.offset',
      'highest': 'pinescript.highest',
      'lowest': 'pinescript.lowest',
      'highestbars': 'pinescript.highestbars',
      'lowestbars': 'pinescript.lowestbars',
      'sum': 'pinescript.sum',
      'cumsum': 'pinescript.cumsum',
      'cum': 'pinescript.cum',
      'pivot': 'pinescript.pivot',
      'pivothigh': 'pinescript.pivothigh',
      'pivotlow': 'pinescript.pivotlow',
      'ta': 'pinescript.ta',
      'valuewhen': 'pinescript.valuewhen',
      'barssince': 'pinescript.barssince',
      'updatetime': 'pinescript.updatetime',
      'max': 'pinescript.max',
      'min': 'pinescript.min',
      'abs': 'pinescript.abs',
      'sqrt': 'pinescript.sqrt',
      'log': 'pinescript.log',
      'log10': 'pinescript.log10',
      'pow': 'pinescript.pow',
      'exp': 'pinescript.exp',
      'sin': 'pinescript.sin',
      'cos': 'pinescript.cos',
      'tan': 'pinescript.tan',
      'asin': 'pinescript.asin',
      'acos': 'pinescript.acos',
      'atan': 'pinescript.atan',
      'floor': 'pinescript.floor',
      'ceil': 'pinescript.ceil',
      'round': 'pinescript.round',
      'avg': 'pinescript.avg',
      'linreg': 'pinescript.linreg',
      'correlation': 'pinescript.correlation',
      'variance': 'pinescript.variance',
      'stdev': 'pinescript.stdev',
      'pseudorandom': 'pinescript.pseudorandom',
      'seed': 'pinescript.seed',
    };

    // Try the original name first (preserves case-sensitive matches like
    // "chart.point.from_index"), then fall back to lowercase for functions
    // where Pine scripts mix casing (e.g. "str.toString" vs "str.tostring").
    return mapping[name] || mapping[name.toLowerCase()] || name;
  }

  // Translates Pine logical and comparison operators to their JavaScript equivalents.
  mapOperator(operator) {
    const mapping = {
      'and': '&&',
      'or': '||',
      'not': '!',
      '==': '===',
      '!=': '!==',
      '<=': '<=',
      '>=': '>=',
      '<': '<',
      '>': '>',
      '+': '+',
      '-': '-',
      '*': '*',
      '/': '/',
      '%': '%'
    };
    return mapping[operator] || operator;
  }
}

export { CodeGenerator };
