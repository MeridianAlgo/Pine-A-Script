/**
 * PineScript Code Generator - Generates JavaScript code from AST
 */

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

    this.reservedNamespaces = new Set([
      'ta', 'math', 'array', 'str',
      'color', 'table', 'position', 'location', 'shape', 'size', 'text'
    ]);
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

      default:
        const methodName = `generate${node.type}`;
        if (typeof this[methodName] === 'function') {
          return this[methodName](node);
        }

        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  generateDestructuringAssignment(node) {
    const targets = node.targets || [];
    const lhs = `[${targets.join(', ')}]`;

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

  generateProgram(node) {
    this.write('// PineScript to JavaScript Transpiled Code\n');
    this.write('// Generated automatically\n\n');

    this.write('// Built-in PineScript functions\n');
    this.write('const pinescript = {\n');
    this.pushIndent();
    for (const [name, func] of builtins) {
      const funcStr = typeof func === 'function' ? func.toString() : JSON.stringify(func);
      this.writeln(`${name}: ${funcStr},`);
    }
    this.popIndent();
    this.write('};\n\n');

    // Some built-in implementations reference `builtins.get(...)`.
    // Create a local Map so these functions can resolve dependencies at runtime.
    this.write('const builtins = new Map(Object.entries(pinescript));\n\n');

    this.write('globalThis.__pineRuntime = globalThis.__pineRuntime || { plots: [], plotshapes: [], alerts: [] };\n');
    this.write('globalThis.pinescript = pinescript;\n\n');

    // Provide `input.timeframe()` for scripts that declare timeframe inputs.
    this.write('globalThis.input = globalThis.input || {};\n');
    this.write('globalThis.input.timeframe = globalThis.input.timeframe || ((defval) => defval);\n\n');

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

    this.write('globalThis.barmerge = globalThis.barmerge || {\n');
    this.write('  gaps_off: false,\n');
    this.write('  gaps_on: true,\n');
    this.write('  lookahead_off: false,\n');
    this.write('  lookahead_on: true,\n');
    this.write('};\n\n');

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

    this.write('pinescript.size = { small: "small", normal: "normal", large: "large" };\n');
    this.write('pinescript.shape = { triangleup: "triangleup", triangledown: "triangledown", circle: "circle", square: "square" };\n');
    this.write('pinescript.location = { belowbar: "belowbar", abovebar: "abovebar" };\n');
    this.write('pinescript.position = { top_right: "top_right", top_left: "top_left", bottom_right: "bottom_right", bottom_left: "bottom_left" };\n');
    this.write('pinescript.text = { align_center: "center" };\n\n');

    this.write('pinescript.table = {\n');
    this.write('  new: function(position, columns, rows, opts) { return { position, columns, rows, opts: opts || {}, cells: [] }; },\n');
    this.write('  cell: function(table, column, row, text, opts) {\n');
    this.write('    if (!table) return null;\n');
    this.write('    table.cells.push({ column, row, text, opts: opts || {} });\n');
    this.write('    return null;\n');
    this.write('  }\n');
    this.write('};\n\n');

    this.write('// Input parameters\n');
    for (const input of node.inputs || []) {
      this.writeln(`const ${input.name} = ${JSON.stringify(input.defaultValue)}; // ${input.inputType}`);
    }

    // Emit stubs for Pine `type` declarations so code like `Settings.new(...)` doesn't crash.
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

    this.write('\n// Main script logic\n');
    this.write('function main() {\n');
    this.pushIndent();

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

    this.popIndent();
    this.write('}\n\n');

    this.write('// Export for use\n');
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
    this.writeln(`const ${node.name} = ${JSON.stringify(node.defaultValue)};`);
  }

  generateVariableDeclaration(node) {
    const prefix = (node.isVarip || node.isVar || node.declaredType) ? 'let' : 'const';
    if (node.isVarip || node.isVar) {
      this.context.stateVars.add(node.name);
      this.context.variables.add(node.name);
      this.writeln(`if (state.${node.name} === undefined) state.${node.name} = ${this.generate(node.value)};`);
      return;
    }

    this.context.variables.add(node.name);
    this.writeln(`${prefix} ${node.name} = ${this.generate(node.value)};`);
  }

  generateAssignment(node) {
    // Pine allows implicit declaration on first assignment.
    if (node.target && node.target.type === 'Identifier') {
      const name = node.target.name;
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

  generateIfStatement(node) {
    this.writeln(`if (${this.generate(node.condition)}) {`);
    this.pushIndent();
    this.generate(node.thenBranch);
    this.popIndent();

    if (node.elseBranch) {
      this.writeln('} else {');
      this.pushIndent();
      this.generate(node.elseBranch);
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
    this.writeln(`for (const ${node.variable} of ${this.generate(node.iterable)}) {`);
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

  generateSwitchStatement(node) {
    this.writeln(`switch (${this.generate(node.expression)}) {`);
    this.pushIndent();

    for (const caseNode of node.cases) {
      if (caseNode.value === null) {
        this.writeln('default:');
      } else {
        this.writeln(`case ${this.generate(caseNode.value)}:`);
      }
      this.pushIndent();
      for (const stmt of caseNode.body) {
        this.generate(stmt);
      }
      this.writeln('break;');
      this.popIndent();
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

  generateFunctionDeclaration(node) {
    const params = (node.params || []).map(p => {
      if (typeof p === 'string') return p;
      if (p && typeof p === 'object') {
        if (p.defaultValue) return `${p.name} = ${this.generate(p.defaultValue)}`;
        return p.name;
      }
      return String(p);
    });
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
    this.writeln('{');
    this.pushIndent();
    for (const statement of node.statements) {
      this.generate(statement);
    }
    this.popIndent();
    this.writeln('}');
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

  generateIdentifier(node) {
    if (this.reservedNamespaces.has(node.name) && !this.context.variables.has(node.name)) {
      return `pinescript.${node.name}`;
    }
    if (this.context.stateVars.has(node.name)) {
      return `state.${node.name}`;
    }
    return node.name;
  }

  generateFunctionCall(node) {
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

  generateArrayAccess(node) {
    // Pine `x[n]` is historical series indexing, not JS array indexing.
    // For Pine arrays, the language uses `array.get(x, n)` instead.
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

  mapFunctionName(name) {
    const mapping = {
      'na': 'pinescript.na',
      'hline': 'pinescript.hline',
      'color.rgb': 'pinescript.color.rgb',
      'color.new': 'pinescript.color.new',
      'color.hex': 'pinescript.color.hex',
      'color.from_gradient': 'pinescript.color.from_gradient',
      'color.b': 'pinescript.color.b',

      'table.new': 'pinescript.table.new',
      'table.cell': 'pinescript.table.cell',

      'indicator': 'pinescript.indicator',
      'strategy': 'pinescript.strategy',

      'ta.sma': 'pinescript.sma',
      'ta.ema': 'pinescript.ema',
      'ta.wma': 'pinescript.wma',
      'ta.vwma': 'pinescript.vwma',
      'ta.rma': 'pinescript.rma',
      'ta.hma': 'pinescript.hma',
      'ta.linreg': 'pinescript.linreg',
      'ta.alma': 'pinescript.alma',
      'ta.lowest': 'pinescript.lowest',
      'ta.highest': 'pinescript.highest',
      'ta.crossover': 'pinescript.cross',
      'ta.crossunder': 'pinescript.cross',

      'math.round': 'pinescript.round',
      'math.pow': 'pinescript.pow',
      'math.sqrt': 'pinescript.sqrt',
      'math.abs': 'pinescript.abs',
      'math.max': 'pinescript.max',
      'math.min': 'pinescript.min',

      'array.set': 'pinescript.arraySet',
      'array.get': 'pinescript.arrayGet',
      'array.new_float': 'pinescript.arrayNew',
      'array.new_int': 'pinescript.arrayNew',
      'array.new_bool': 'pinescript.arrayNew',
      'array.new_string': 'pinescript.arrayNew',
      'array.new_label': 'pinescript.arrayNew',
      'array.new_line': 'pinescript.arrayNew',
      'array.new_box': 'pinescript.arrayNew',
      'array.new_polyline': 'pinescript.arrayNew',
      'array.max': 'pinescript.arrayMax',
      'array.min': 'pinescript.arrayMin',
      'array.indexof': 'pinescript.arrayIndexOf',

      'str.tostring': 'pinescript.strToString',
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
      'vwap': 'pinescript.vwap',
      'heikinashi': 'pinescript.heikinashi',
      'renko': 'pinescript.renko',
      'kagi': 'pinescript.kagi',
      'pointfigure': 'pinescript.pointfigure',
      'plot': 'pinescript.plot',
      'plotshape': 'pinescript.plotshape',
      'plotbar': 'pinescript.plotbar',
      'plotcandle': 'pinescript.plotcandle',
      'hline': 'pinescript.hline',
      'bgcolor': 'pinescript.bgcolor',
      'fill': 'pinescript.fill',
      'line.new': 'pinescript.lineNew',
      'line.delete': 'pinescript.lineDelete',
      'line.setxy': 'pinescript.lineSetXY',
      'line.getx': 'pinescript.lineGetX',
      'line.gety': 'pinescript.lineGetY',
      'label.new': 'pinescript.labelNew',
      'label.delete': 'pinescript.labelDelete',
      'label.settext': 'pinescript.labelSetText',
      'label.gettext': 'pinescript.labelGetText',
      'alert': 'pinescript.alert',
      'strategy.entry': 'pinescript.strategyEntry',
      'strategy.exit': 'pinescript.strategyExit',
      'strategy.order': 'pinescript.strategyOrder',
      'request.security': 'pinescript.requestSecurity',
      'year': 'pinescript.year',
      'month': 'pinescript.month',
      'weekofyear': 'pinescript.weekofyear',
      'dayofmonth': 'pinescript.dayofmonth',
      'hour': 'pinescript.hour',
      'minute': 'pinescript.minute',
      'second': 'pinescript.second',
      'timestamp': 'pinescript.timestamp',
      'ticker': 'pinescript.ticker',
      'tickerid': 'pinescript.tickerID',
      'syminfo': 'pinescript.syminfo',
      'time': 'pinescript.time',
      'timenow': 'pinescript.timenow',
      'barstate': 'pinescript.barstate',
      'dividends': 'pinescript.dividends',
      'splits': 'pinescript.splits',
      'earnings': 'pinescript.earnings',
      'volume': 'pinescript.volume',
      'open': 'pinescript.open',
      'high': 'pinescript.high',
      'low': 'pinescript.low',
      'close': 'pinescript.close',
      'hl2': 'pinescript.hl2',
      'hlc3': 'pinescript.hlc3',
      'ohlc4': 'pinescript.ohlc4',
      'ema': 'pinescript.ema',
      'sma': 'pinescript.sma',
      'rma': 'pinescript.rma',
      'wma': 'pinescript.wma',
      'vwma': 'pinescript.vwma',
      'cum': 'pinescript.cum',
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
      'alma': 'pinescript.alma',
      'hma': 'pinescript.hma',
      'vwap': 'pinescript.vwap',
      'vwma': 'pinescript.vwma',
      'wss': 'pinescript.wss',
      'tr': 'pinescript.tr',
      'atr': 'pinescript.atr',
      'rising': 'pinescript.rising',
      'falling': 'pinescript.falling',
      'cross': 'pinescript.cross',
      'offset': 'pinescript.offset',
      'highest': 'pinescript.highest',
      'lowest': 'pinescript.lowest',
      'highestbars': 'pinescript.highestbars',
      'lowestbars': 'pinescript.lowestbars',
      'sum': 'pinescript.sum',
      'cumsum': 'pinescript.cumsum',
      'pivot': 'pinescript.pivot',
      'pivothigh': 'pinescript.pivothigh',
      'pivotlow': 'pinescript.pivotlow',
      'ta': 'pinescript.ta',
      'valuewhen': 'pinescript.valuewhen',
      'barssince': 'pinescript.barssince',
      'barssince': 'pinescript.barssince',
      'updatetime': 'pinescript.updatetime',
      'isempty': 'pinescript.isempty',
      'isna': 'pinescript.isna',
      'nz': 'pinescript.nz',
      'fixnan': 'pinescript.fixnan',
      'max_bars_back': 'pinescript.maxBarsBack',
      'linreg': 'pinescript.linreg',
      'correlation': 'pinescript.correlation',
      'variance': 'pinescript.variance',
      'stdev': 'pinescript.stdev',
      'pseudorandom': 'pinescript.pseudorandom',
      'seed': 'pinescript.seed',
      'array.new': 'pinescript.arrayNew',
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
      'map.new': 'pinescript.mapNew',
      'map.size': 'pinescript.mapSize',
      'map.get': 'pinescript.mapGet',
      'map.set': 'pinescript.mapSet',
      'map.remove': 'pinescript.mapRemove',
      'map.keys': 'pinescript.mapKeys',
      'map.values': 'pinescript.mapValues',
      'map.contains': 'pinescript.mapContains',
      'str.length': 'pinescript.strLength',
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
      'str.substring': 'pinescript.strSubstring',
      'str.match': 'pinescript.strMatch',
      'str.pos': 'pinescript.strPos',
      'str.rpos': 'pinescript.strRPos',
      'str.remove': 'pinescript.strRemove',
      'str.reverse': 'pinescript.strReverse',
      'datetime': 'pinescript.datetime',
      'timestamp': 'pinescript.timestamp',
    };

    return mapping[name.toLowerCase()] || name;
  }

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
