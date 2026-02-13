// PineScript to JavaScript Transpiled Code

// Generated automatically


// Built-in PineScript functions

const pinescript = {

  sma: function(series, length) {
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    return slice.reduce((a, b) => a + b, 0) / length;
  },
  ema: function(series, length) {
    if (!series || series.length < 1) return null;
    const alpha = 2 / (length + 1);
    let result = series[0];
    for (let i = 1; i < series.length; i++) {
      result = alpha * series[i] + (1 - alpha) * result;
    }
    return result;
  },
  wma: function(series, length) {
    if (!series || series.length < length) return null;
    let sum = 0;
    let weightSum = 0;
    const slice = series.slice(-length);
    for (let i = 0; i < length; i++) {
      const weight = length - i;
      sum += slice[i] * weight;
      weightSum += weight;
    }
    return sum / weightSum;
  },
  vwma: function(close, volume, length) {
    if (!close || close.length < length) return null;
    let sum = 0;
    let volSum = 0;
    for (let i = length - 1; i >= 0; i--) {
      sum += close[close.length - 1 - i] * volume[volume.length - 1 - i];
      volSum += volume[volume.length - 1 - i];
    }
    return volSum > 0 ? sum / volSum : null;
  },
  rma: function(series, length) {
    if (!series || series.length < 1) return null;
    const alpha = 1 / length;
    let result = series[0];
    for (let i = 1; i < series.length; i++) {
      result = alpha * series[i] + (1 - alpha) * result;
    }
    return result;
  },
  hma: function(series, length) {
    if (!series || series.length < length) return null;
    const halfLength = Math.floor(length / 2);
    const wma1 = builtins.get('wma')(series, halfLength);
    const wma2 = builtins.get('wma')(series, length);
    const diff = wma2 - wma1;
    return builtins.get('wma')([diff, diff], Math.floor(Math.sqrt(length)));
  },
  alma: function(series, length, offset = 0.85, sigma = 6) {
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    let sum = 0;
    let weightSum = 0;
    for (let i = 0; i < length; i++) {
      const weight = Math.exp(-Math.pow(i - offset * (length - 1), 2) / (2 * Math.pow(sigma, 2)));
      sum += slice[i] * weight;
      weightSum += weight;
    }
    return weightSum > 0 ? sum / weightSum : null;
  },
  atr: function(high, low, close, length = 14) {
    if (!high || high.length < length + 1) return null;
    let sum = 0;
    for (let i = 1; i <= length; i++) {
      const prevClose = close[close.length - i - 1];
      const tr = Math.max(
        high[high.length - i] - low[low.length - i],
        Math.abs(high[high.length - i] - prevClose),
        Math.abs(low[low.length - i] - prevClose)
      );
      sum += tr;
    }
    return sum / length;
  },
  bb: function(source, length, mult = 2) {
    if (!source || source.length < length) return null;
    const sma = builtins.get('sma')(source, length);
    const slice = source.slice(-length);
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / length;
    const stdDev = Math.sqrt(variance);
    return { middle: sma, upper: sma + mult * stdDev, lower: sma - mult * stdDev };
  },
  kc: function(high, low, close, length = 20, mult = 2) {
    if (!high || high.length < length) return null;
    const typicalPrice = high.map((h, i) => (h + low[i] + close[i]) / 3);
    const sma = builtins.get('sma')(typicalPrice, length);
    const atr = builtins.get('atr')(high, low, close, length);
    return { middle: sma, upper: sma + mult * atr, lower: sma - mult * atr };
  },
  rsi: function(close, length = 14) {
    if (!close || close.length < length + 1) return null;
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= length; i++) {
      const change = close[close.length - i] - close[close.length - i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    const avgGain = gains / length;
    const avgLoss = losses / length;
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  },
  stoch: function(high, low, close, kLength = 14, dLength = 3, smoothK = 3) {
    if (!high || high.length < kLength) return null;
    const highestHigh = Math.max(...high.slice(-kLength));
    const lowestLow = Math.min(...low.slice(-kLength));
    const range = highestHigh - lowestLow;
    if (range === 0) return { k: 50, d: 50 };
    const rawK = ((close[close.length - 1] - lowestLow) / range) * 100;
    return { k: rawK, d: builtins.get('sma')([rawK], smoothK) };
  },
  macd: function(close, fastLen = 12, slowLen = 26, signalLen = 9) {
    if (!close || close.length < slowLen + signalLen) return null;
    const fastEMA = builtins.get('ema')(close, fastLen);
    const slowEMA = builtins.get('ema')(close, slowLen);
    const macdLine = fastEMA - slowEMA;
    const signalLine = builtins.get('ema')([macdLine], signalLen);
    const histogram = macdLine - signalLine;
    return { macd: macdLine, signal: signalLine, histogram: histogram };
  },
  cci: function(high, low, close, length = 20) {
    if (!high || high.length < length) return null;
    const typicalPrice = high.map((h, i) => (h + low[i] + close[i]) / 3);
    const sma = builtins.get('sma')(typicalPrice, length);
    const slice = typicalPrice.slice(-length);
    const meanDev = slice.reduce((sum, val) => sum + Math.abs(val - sma), 0) / length;
    if (meanDev === 0) return 0;
    return (typicalPrice[typicalPrice.length - 1] - sma) / (0.015 * meanDev);
  },
  mfi: function(high, low, close, volume, length = 14) {
    if (!high || high.length < length + 1) return null;
    let posSum = 0;
    let negSum = 0;
    for (let i = 1; i <= length; i++) {
      const tp = (high[high.length - i] + low[low.length - i] + close[close.length - i]) / 3;
      const prevTp = (high[high.length - i - 1] + low[low.length - i - 1] + close[close.length - i - 1]) / 3;
      const flow = tp * volume[volume.length - i];
      if (tp > prevTp) posSum += flow;
      else if (tp < prevTp) negSum += flow;
    }
    if (negSum === 0) return 100;
    const ratio = posSum / negSum;
    return 100 - (100 / (1 + ratio));
  },
  obv: function(close, volume) {
    if (!close || close.length < 2) return null;
    let result = 0;
    for (let i = 1; i < close.length; i++) {
      if (close[i] > close[i - 1]) result += volume[i];
      else if (close[i] < close[i - 1]) result -= volume[i];
    }
    return result;
  },
  ad: function(high, low, close, volume) {
    if (!high || high.length < 1) return null;
    let result = 0;
    for (let i = 0; i < high.length; i++) {
      const mf = ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) * volume[i];
      result += mf;
    }
    return result;
  },
  adosc: function(high, low, close, volume, fastLen = 3, slowLen = 10) {
    if (!high || high.length < slowLen) return null;
    const ad = builtins.get('ad')(high, low, close, volume);
    const fastEMA = builtins.get('ema')(ad, fastLen);
    const slowEMA = builtins.get('ema')(ad, slowLen);
    return fastEMA - slowEMA;
  },
  cmf: function(high, low, close, volume, length = 20) {
    if (!high || high.length < length) return null;
    let sum = 0;
    let volSum = 0;
    for (let i = high.length - length; i < high.length; i++) {
      const mfv = ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) * volume[i];
      sum += mfv;
      volSum += volume[i];
    }
    return volSum > 0 ? sum / volSum : 0;
  },
  vwap: function(high, low, close, volume) {
    if (!high || high.length < 1) return null;
    let priceVolSum = 0;
    let volSum = 0;
    for (let i = 0; i < high.length; i++) {
      const tp = (high[i] + low[i] + close[i]) / 3;
      priceVolSum += tp * volume[i];
      volSum += volume[i];
    }
    return volSum > 0 ? priceVolSum / volSum : null;
  },
  linreg: function(source, length, offset = 0) {
    if (!source || source.length < length) return null;
    const slice = source.slice(-length - offset).slice(offset);
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < length; i++) {
      sumX += i;
      sumY += slice[i];
      sumXY += i * slice[i];
      sumXX += i * i;
    }
    const slope = (length * sumXY - sumX * sumY) / (length * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / length;
    return intercept + slope * (length - 1);
  },
  correlation: function(source1, source2, length) {
    if (!source1 || source1.length < length) return null;
    const slice1 = source1.slice(-length);
    const slice2 = source2.slice(-length);
    const mean1 = slice1.reduce((a, b) => a + b, 0) / length;
    const mean2 = slice2.reduce((a, b) => a + b, 0) / length;
    let num = 0, den1 = 0, den2 = 0;
    for (let i = 0; i < length; i++) {
      const dx = slice1[i] - mean1;
      const dy = slice2[i] - mean2;
      num += dx * dy;
      den1 += dx * dx;
      den2 += dy * dy;
    }
    const den = Math.sqrt(den1 * den2);
    return den > 0 ? num / den : 0;
  },
  variance: function(source, length) {
    if (!source || source.length < length) return null;
    const slice = source.slice(-length);
    const mean = slice.reduce((a, b) => a + b, 0) / length;
    return slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / length;
  },
  stdev: function(source, length) {
    return Math.sqrt(builtins.get('variance')(source, length));
  },
  hl2: function(high, low) {
    return high && low ? (high[high.length - 1] + low[low.length - 1]) / 2 : null;
  },
  hlc3: function(high, low, close) {
    return high && low && close ? (high[high.length - 1] + low[low.length - 1] + close[close.length - 1]) / 3 : null;
  },
  ohlc4: function(open, high, low, close) {
    return open && high && low && close ? (open[open.length - 1] + high[high.length - 1] + low[low.length - 1] + close[close.length - 1]) / 4 : null;
  },
  avg: function(...args) {
    return args.reduce((a, b) => a + b, 0) / args.length;
  },
  max: function(...args) {
    return Math.max(...args.filter(v => v !== null && v !== undefined));
  },
  min: function(...args) {
    return Math.min(...args.filter(v => v !== null && v !== undefined));
  },
  abs: function(value) {
    return Math.abs(value);
  },
  sqrt: function(value) {
    return Math.sqrt(value);
  },
  pow: function(base, exp) {
    return Math.pow(base, exp);
  },
  exp: function(value) {
    return Math.exp(value);
  },
  log: function(value) {
    return Math.log(value);
  },
  log10: function(value) {
    return Math.log10(value);
  },
  sin: function(value) {
    return Math.sin(value);
  },
  cos: function(value) {
    return Math.cos(value);
  },
  tan: function(value) {
    return Math.tan(value);
  },
  asin: function(value) {
    return Math.asin(value);
  },
  acos: function(value) {
    return Math.acos(value);
  },
  atan: function(value) {
    return Math.atan(value);
  },
  floor: function(value) {
    return Math.floor(value);
  },
  ceil: function(value) {
    return Math.ceil(value);
  },
  round: function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  },
  cum: function(series) {
    if (!series) return null;
    return series.reduce((sum, val) => sum + val, 0);
  },
  sum: function(series, length) {
    if (!series || series.length < length) return null;
    return series.slice(-length).reduce((a, b) => a + b, 0);
  },
  highest: function(series, length) {
    if (!series || series.length < length) return null;
    return Math.max(...series.slice(-length));
  },
  lowest: function(series, length) {
    if (!series || series.length < length) return null;
    return Math.min(...series.slice(-length));
  },
  highestbars: function(series, length) {
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    const maxVal = Math.max(...slice);
    return length - 1 - slice.indexOf(maxVal);
  },
  lowestbars: function(series, length) {
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    const minVal = Math.min(...slice);
    return length - 1 - slice.indexOf(minVal);
  },
  rising: function(series, length) {
    if (!series || series.length < length) return false;
    for (let i = series.length - length; i < series.length - 1; i++) {
      if (series[i] >= series[i + 1]) return false;
    }
    return true;
  },
  falling: function(series, length) {
    if (!series || series.length < length) return false;
    for (let i = series.length - length; i < series.length - 1; i++) {
      if (series[i] <= series[i + 1]) return false;
    }
    return true;
  },
  cross: function(series1, series2) {
    if (!series1 || !series2 || series1.length < 2 || series2.length < 2) return false;
    const i = series1.length - 1;
    return (series1[i - 1] < series2[i - 1] && series1[i] >= series2[i]) ||
           (series1[i - 1] > series2[i - 1] && series1[i] <= series2[i]);
  },
  offset: function(series, offset) {
    if (!series) return null;
    const idx = series.length - 1 - offset;
    return idx >= 0 ? series[idx] : null;
  },
  valuewhen: function(condition, source, occurrence = 1) {
    if (!condition || !source) return null;
    let count = 0;
    for (let i = condition.length - 1; i >= 0; i--) {
      if (condition[i]) {
        count++;
        if (count === occurrence) return source[i];
      }
    }
    return null;
  },
  barssince: function(condition) {
    if (!condition) return null;
    for (let i = condition.length - 1; i >= 0; i--) {
      if (condition[i]) return condition.length - 1 - i;
    }
    return null;
  },
  year: function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getFullYear();
  },
  month: function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getMonth() + 1;
  },
  weekofyear: function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay();
    d.setUTCDate(d.getUTCDate() + 4 - (dayNum || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  },
  dayofmonth: function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getDate();
  },
  hour: function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getHours();
  },
  minute: function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getMinutes();
  },
  second: function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getSeconds();
  },
  timestamp: function(year, month, day, hour = 0, minute = 0, second = 0) {
    return Date.UTC(year, month - 1, day, hour, minute, second);
  },
  nz: function(value, replacement = 0) {
    return value === null || value === undefined || isNaN(value) ? replacement : value;
  },
  isna: function(value) {
    return value === null || value === undefined || isNaN(value);
  },
  isempty: function(value) {
    return value === null || value === undefined || value === '';
  },
  fixnan: function(value, replacement = 0) {
    return builtins.get('nz')(value, replacement);
  },
  plot: function(value, title, color, linewidth) {
    return value;
  },
  plotshape: function(condition, style, location, color, text, editable, showLast) {
    return condition;
  },
  plotbar: function(open, high, low, close, title, color, editable, showLast) {
    return { open, high, low, close };
  },
  plotcandle: function(open, high, low, close, title, color, wickColor, borderColor, editable, showLast) {
    return { open, high, low, close };
  },
  bgcolor: function(color, title, editable, showLast) {
    return null;
  },
  fill: function(series1, series2, color, title, editable) {
    return null;
  },
  alert: function(condition, message, frequency) {
    console.log('Alert:', condition ? message : 'Condition not met');
    return condition;
  },
  strategyEntry: function(id, direction, qty, limit, stop, ocaName, ocaType, comment) {
    console.log(`Strategy Entry: ${id} ${direction}`);
    return true;
  },
  strategyExit: function(id, fromEntry, qty, limit, stop, ocaName, comment) {
    console.log(`Strategy Exit: ${id}`);
    return true;
  },
  strategyOrder: function(id, direction, qty, limit, stop, ocaName, ocaType, comment) {
    console.log(`Strategy Order: ${id} ${direction}`);
    return true;
  },
  requestSecurity: function(symbol, timeframe, expression) {
    return expression;
  },
  arrayNew: function(initialSize = 0, initialValue = 0) {
    return Array(initialSize).fill(initialValue);
  },
  arraySize: function(arr) {
    return arr ? arr.length : 0;
  },
  arrayGet: function(arr, index) {
    return arr && arr[index] !== undefined ? arr[index] : null;
  },
  arraySet: function(arr, index, value) {
    if (arr) arr[index] = value;
    return value;
  },
  arrayPush: function(arr, value) {
    if (arr) arr.push(value);
    return value;
  },
  arrayPop: function(arr) {
    return arr ? arr.pop() : null;
  },
  arrayShift: function(arr) {
    return arr ? arr.shift() : null;
  },
  arrayUnshift: function(arr, value) {
    if (arr) arr.unshift(value);
    return value;
  },
  arrayClear: function(arr) {
    if (arr) arr.length = 0;
    return null;
  },
  arraySort: function(arr, order = 'ascending') {
    if (arr) arr.sort((a, b) => order === 'ascending' ? a - b : b - a);
    return arr;
  },
  arrayReverse: function(arr) {
    if (arr) arr.reverse();
    return arr;
  },
  arrayContains: function(arr, value) {
    return arr ? arr.includes(value) : false;
  },
  arrayIndexOf: function(arr, value) {
    return arr ? arr.indexOf(value) : -1;
  },
  arraySum: function(arr) {
    return arr ? arr.reduce((a, b) => a + b, 0) : 0;
  },
  arrayAvg: function(arr) {
    return arr && arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  },
  arrayMin: function(arr) {
    return arr && arr.length > 0 ? Math.min(...arr) : null;
  },
  arrayMax: function(arr) {
    return arr && arr.length > 0 ? Math.max(...arr) : null;
  },
  strLength: function(str) {
    return str ? str.length : 0;
  },
  strSubstring: function(str, from, to) {
    return str ? str.substring(from, to) : '';
  },
  strConcat: function(...args) {
    return args.join('');
  },
  strContains: function(str, substring) {
    return str ? str.includes(substring) : false;
  },
  strStartsWith: function(str, prefix) {
    return str ? str.startsWith(prefix) : false;
  },
  strEndsWith: function(str, suffix) {
    return str ? str.endsWith(suffix) : false;
  },
  strReplace: function(str, from, to) {
    return str ? str.replace(from, to) : '';
  },
  strReplaceAll: function(str, from, to) {
    return str ? str.split(from).join(to) : '';
  },
  strLower: function(str) {
    return str ? str.toLowerCase() : '';
  },
  strUpper: function(str) {
    return str ? str.toUpperCase() : '';
  },
  strToNumber: function(str) {
    return str ? parseFloat(str) : 0;
  },
  strToString: function(value) {
    return String(value);
  },
  strSplit: function(str, delimiter) {
    return str ? str.split(delimiter) : [];
  },
  strMatch: function(str, regex) {
    const match = str.match(new RegExp(regex));
    return match ? match[0] : '';
  },
  strPos: function(str, substring) {
    return str ? str.indexOf(substring) : -1;
  },
  strRPos: function(str, substring) {
    return str ? str.lastIndexOf(substring) : -1;
  },
  strRemove: function(str, from, to) {
    return str ? str.substring(0, from) + str.substring(to) : '';
  },
  strReverse: function(str) {
    return str ? str.split('').reverse().join('') : '';
  },
  pi: 3.141592653589793,
  e: 2.718281828459045,
  na: null,
  true: true,
  false: false,
  ticker: "AAPL",
  tickerid: "NASDAQ:AAPL",
  syminfo: function(type) {
    const info = { ticker: 'AAPL', tickerid: 'NASDAQ:AAPL', prefix: 'NASDAQ', root: 'AAPL', suffix: '' };
    return info[type] || '';
  },
  time: 1770934874103,
  timenow: 1770934874103,
  barstate: "LAST",
  dividends: {},
  splits: {},
  earnings: {},
  volume: 0,
  open: 0,
  high: 0,
  low: 0,
  close: 0,
  tr: function(high, low, close) {
    const prevClose = close[close.length - 2] || close[0];
    return Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
  },
};


// Input parameters


// Main script logic

function main() {

  indicator("Quantum MA with Consolidation Zones [Q-Meridian]", ({ shorttitle: "Quantum MA [Q-Meridian]", overlay: true, max_bars_back: 1100 }));
  group_ma = "⚙️ MA Settings";
  group_visual = "🎨 Visual Settings";
  group_color = "🌌 Color Settings - Main Chart";
  group_signals = "📈 Signal Settings";
  group_table = "📊 Table Settings";
  base_length = input.int(20, "Base MA Length", ({ minval: 5, maxval: 100, group: group_ma, tooltip: "Length of the base moving average used for optimization." }));
  eval_period = input.int(20, "Evaluation Period", ({ minval: 10, maxval: 50, group: group_ma, tooltip: "Number of bars to evaluate MA performance for optimization." }));
  src = input.source(close, "Price Source", ({ group: group_ma }));
  alma_offset = input.float(0.85, "ALMA Offset", ({ minval: 0, maxval: 1, step: 0.05, group: group_ma }));
  alma_sigma = input.float(6, "ALMA Sigma", ({ minval: 1, maxval: 10, group: group_ma }));
  show_ma_line = input.bool(true, "Show MA Line", ({ group: group_ma, tooltip: "Toggle visibility of the optimized moving average line on the chart." }));
  show_cloud = input.bool(false, "Show Cloud", ({ group: group_ma, tooltip: "Toggle visibility of the cloud between price and MA." }));
  signal_style = input.string("Triangle", "Signal Shape", ({ options: ["Triangle", "Circle", "Square"], group: group_signals, tooltip: "Shape for buy/sell signals." }));
  signal_size = input.string("Small", "Signal Size", ({ options: ["Small", "Normal", "Large"], group: group_signals, tooltip: "Size of signal shapes." }));
  show_signals = input.bool(true, "Show Buy/Sell Signals", ({ group: group_signals, tooltip: "Toggle visibility of buy/sell signals on the chart." }));
  ma_linewidth = input.int(3, "MA Line Width", ({ minval: 1, maxval: 10, group: group_visual, tooltip: "Width of the moving average line on the chart." }));
  show_optimal_info = input.bool(true, "Show Optimal MA Info", ({ group: group_visual }));
  fixed_color = input.color(color.rgb(0, 180, 140, 90), "Fixed Color", ({ group: group_color, tooltip: "Color used when gradient is disabled." }));
  gradient_start_color = input.color(color.rgb(32, 64, 160), "Gradient Start (Bearish)", ({ group: group_color }));
  gradient_middle_color = input.color(color.rgb(144, 10, 199), "Gradient Middle", ({ group: group_color }));
  gradient_end_color = input.color(color.rgb(128, 192, 255), "Gradient End (Bullish)", ({ group: group_color }));
  cloud_bull_color = input.color(color.rgb(0, 180, 141, 64), "Cloud Bullish", ({ group: group_color }));
  cloud_bear_color = input.color(color.rgb(240, 80, 80, 64), "Cloud Bearish", ({ group: group_color }));
  use_gradient = input.bool(true, "Use Gradient Color", ({ group: group_color, tooltip: "Toggle between gradient coloring and fixed color for the MA line." }));
  table_position = input.string("Top Right", "Table Position", ({ options: ["Top Right", "Top Left", "Bottom Right", "Bottom Left"], group: group_table }));
  table_size = input.string("Normal", "Table Size", ({ options: ["Small", "Normal", "Large"], group: group_table }));
  table_transparency = input.int(10, "Table Transparency", ({ minval: 0, maxval: 100, group: group_table }));
  table_bg_color = input.color(color.rgb(15, 15, 23, 85), "Table Background", ({ group: group_table }));
  table_border_color = input.color(color.rgb(30, 30, 45, 85), "Table Border", ({ group: group_table }));
  table_header_bg = input.color(color.rgb(25, 25, 35, 95), "Header Background", ({ group: group_table }));
  table_header_text = input.color(color.rgb(240, 240, 240), "Header Text", ({ group: group_table }));
  table_label_text = input.color(color.rgb(180, 180, 200), "Label Text", ({ group: group_table }));
  table_value_text = input.color(color.rgb(255, 255, 255), "Value Text", ({ group: group_table }));
  show_table = input.bool(true, "Show Information Table", ({ group: group_table }));
  show_performance = input.bool(true, "Show Performance Metrics", ({ group: group_table }));
  function ma(src, len, type) {
    switch (type) {
      case "SMA":
        return pinescript.sma(src, len);
        break;
      case "Hull":
        return pinescript.hma(src, len);
        break;
      case "EMA":
        return pinescript.ema(src, len);
        break;
      case "WMA":
        return pinescript.wma(src, len);
        break;
      case "RMA":
        return pinescript.rma(src, len);
        break;
      case "LINREG":
        return pinescript.linreg(src, len, 0);
        break;
      case "ALMA":
        return pinescript.alma(src, len, alma_offset, alma_sigma);
        break;
      case "VWMA":
        return pinescript.vwma(src, len);
        break;
      default:
        return pinescript.sma(src, len);
        break;
    }
  }
  short_length = pinescript.round((base_length * 0.5));
  mid_length = base_length;
  long_length = pinescript.round((base_length * 2));
  sma_short = ma(src, short_length, "SMA");
  ema_short = ma(src, short_length, "EMA");
  wma_short = ma(src, short_length, "WMA");
  hma_short = ma(src, short_length, "Hull");
  vwma_short = ma(src, short_length, "VWMA");
  alma_short = ma(src, short_length, "ALMA");
  rma_short = ma(src, short_length, "RMA");
  linreg_short = ma(src, short_length, "LINREG");
  sma_mid = ma(src, mid_length, "SMA");
  ema_mid = ma(src, mid_length, "EMA");
  wma_mid = ma(src, mid_length, "WMA");
  hma_mid = ma(src, mid_length, "Hull");
  vwma_mid = ma(src, mid_length, "VWMA");
  alma_mid = ma(src, mid_length, "ALMA");
  rma_mid = ma(src, mid_length, "RMA");
  linreg_mid = ma(src, mid_length, "LINREG");
  sma_long = ma(src, long_length, "SMA");
  ema_long = ma(src, long_length, "EMA");
  wma_long = ma(src, long_length, "WMA");
  hma_long = ma(src, long_length, "Hull");
  vwma_long = ma(src, long_length, "VWMA");
  alma_long = ma(src, long_length, "ALMA");
  rma_long = ma(src, long_length, "RMA");
  linreg_long = ma(src, long_length, "LINREG");
  function score_ma(ma_line, length) {
    const score = 0;
    for (let i = 1; i <= eval_period; i++) {
      {
        long_signal = pinescript.cross(src[i], ma_line[i]);
        short_signal = pinescript.cross(src[i], ma_line[i]);
        profit = (long_signal ? (src[(i - 1)] - src[i]) : (short_signal ? (src[i] - src[(i - 1)]) : 0));
        score := (score + profit);
      }
    }
    (score / length);
  }
  final_scores = pinescript.arrayNew(24);
  pinescript.arraySet(final_scores, 0, score_ma(sma_short, short_length));
  pinescript.arraySet(final_scores, 1, score_ma(ema_short, short_length));
  pinescript.arraySet(final_scores, 2, score_ma(wma_short, short_length));
  pinescript.arraySet(final_scores, 3, score_ma(hma_short, short_length));
  pinescript.arraySet(final_scores, 4, score_ma(vwma_short, short_length));
  pinescript.arraySet(final_scores, 5, score_ma(alma_short, short_length));
  pinescript.arraySet(final_scores, 6, score_ma(rma_short, short_length));
  pinescript.arraySet(final_scores, 7, score_ma(linreg_short, short_length));
  pinescript.arraySet(final_scores, 8, score_ma(sma_mid, mid_length));
  pinescript.arraySet(final_scores, 9, score_ma(ema_mid, mid_length));
  pinescript.arraySet(final_scores, 10, score_ma(wma_mid, mid_length));
  pinescript.arraySet(final_scores, 11, score_ma(hma_mid, mid_length));
  pinescript.arraySet(final_scores, 12, score_ma(vwma_mid, mid_length));
  pinescript.arraySet(final_scores, 13, score_ma(alma_mid, mid_length));
  pinescript.arraySet(final_scores, 14, score_ma(rma_mid, mid_length));
  pinescript.arraySet(final_scores, 15, score_ma(linreg_mid, mid_length));
  pinescript.arraySet(final_scores, 16, score_ma(sma_long, long_length));
  pinescript.arraySet(final_scores, 17, score_ma(ema_long, long_length));
  pinescript.arraySet(final_scores, 18, score_ma(wma_long, long_length));
  pinescript.arraySet(final_scores, 19, score_ma(hma_long, long_length));
  pinescript.arraySet(final_scores, 20, score_ma(vwma_long, long_length));
  pinescript.arraySet(final_scores, 21, score_ma(alma_long, long_length));
  pinescript.arraySet(final_scores, 22, score_ma(rma_long, long_length));
  pinescript.arraySet(final_scores, 23, score_ma(linreg_long, long_length));
  best_idx = pinescript.arrayIndexOf(final_scores, pinescript.arrayMax(final_scores));
  const best_ma_type = "EMA";
  const best_length = mid_length;
  const best_ma = ema_mid;
  if ((best_idx === 0)) {
    {
      best_ma_type := "SMA";
      best_length := short_length;
      best_ma := sma_short;
    }
  } else {
    if ((best_idx === 1)) {
      {
        best_ma_type := "EMA";
        best_length := short_length;
        best_ma := ema_short;
      }
    } else {
      if ((best_idx === 2)) {
        {
          best_ma_type := "WMA";
          best_length := short_length;
          best_ma := wma_short;
        }
      } else {
        if ((best_idx === 3)) {
          {
            best_ma_type := "HMA";
            best_length := short_length;
            best_ma := hma_short;
          }
        } else {
          if ((best_idx === 4)) {
            {
              best_ma_type := "VWMA";
              best_length := short_length;
              best_ma := vwma_short;
            }
          } else {
            if ((best_idx === 5)) {
              {
                best_ma_type := "ALMA";
                best_length := short_length;
                best_ma := alma_short;
              }
            } else {
              if ((best_idx === 6)) {
                {
                  best_ma_type := "RMA";
                  best_length := short_length;
                  best_ma := rma_short;
                }
              } else {
                if ((best_idx === 7)) {
                  {
                    best_ma_type := "LINREG";
                    best_length := short_length;
                    best_ma := linreg_short;
                  }
                } else {
                  if ((best_idx === 8)) {
                    {
                      best_ma_type := "SMA";
                      best_length := mid_length;
                      best_ma := sma_mid;
                    }
                  } else {
                    if ((best_idx === 9)) {
                      {
                        best_ma_type := "EMA";
                        best_length := mid_length;
                        best_ma := ema_mid;
                      }
                    } else {
                      if ((best_idx === 10)) {
                        {
                          best_ma_type := "WMA";
                          best_length := mid_length;
                          best_ma := wma_mid;
                        }
                      } else {
                        if ((best_idx === 11)) {
                          {
                            best_ma_type := "HMA";
                            best_length := mid_length;
                            best_ma := hma_mid;
                          }
                        } else {
                          if ((best_idx === 12)) {
                            {
                              best_ma_type := "VWMA";
                              best_length := mid_length;
                              best_ma := vwma_mid;
                            }
                          } else {
                            if ((best_idx === 13)) {
                              {
                                best_ma_type := "ALMA";
                                best_length := mid_length;
                                best_ma := alma_mid;
                              }
                            } else {
                              if ((best_idx === 14)) {
                                {
                                  best_ma_type := "RMA";
                                  best_length := mid_length;
                                  best_ma := rma_mid;
                                }
                              } else {
                                if ((best_idx === 15)) {
                                  {
                                    best_ma_type := "LINREG";
                                    best_length := mid_length;
                                    best_ma := linreg_mid;
                                  }
                                } else {
                                  if ((best_idx === 16)) {
                                    {
                                      best_ma_type := "SMA";
                                      best_length := long_length;
                                      best_ma := sma_long;
                                    }
                                  } else {
                                    if ((best_idx === 17)) {
                                      {
                                        best_ma_type := "EMA";
                                        best_length := long_length;
                                        best_ma := ema_long;
                                      }
                                    } else {
                                      if ((best_idx === 18)) {
                                        {
                                          best_ma_type := "WMA";
                                          best_length := long_length;
                                          best_ma := wma_long;
                                        }
                                      } else {
                                        if ((best_idx === 19)) {
                                          {
                                            best_ma_type := "HMA";
                                            best_length := long_length;
                                            best_ma := hma_long;
                                          }
                                        } else {
                                          if ((best_idx === 20)) {
                                            {
                                              best_ma_type := "VWMA";
                                              best_length := long_length;
                                              best_ma := vwma_long;
                                            }
                                          } else {
                                            if ((best_idx === 21)) {
                                              {
                                                best_ma_type := "ALMA";
                                                best_length := long_length;
                                                best_ma := alma_long;
                                              }
                                            } else {
                                              if ((best_idx === 22)) {
                                                {
                                                  best_ma_type := "RMA";
                                                  best_length := long_length;
                                                  best_ma := rma_long;
                                                }
                                              } else {
                                                if ((best_idx === 23)) {
                                                  {
                                                    best_ma_type := "LINREG";
                                                    best_length := long_length;
                                                    best_ma := linreg_long;
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  buy_signal = pinescript.cross(src, best_ma);
  sell_signal = pinescript.cross(src, best_ma);
  const signal_status = "Neutral";
  if (buy_signal) {
    {
      signal_status := "Buy";
    }
  } else {
    if (sell_signal) {
      {
        signal_status := "Sell";
      }
    }
  }
  function r_squared(src, ma, length) {
    y_mean = pinescript.sma(src, length);
    y_pred_mean = pinescript.sma(ma, length);
    ss_tot = 0;
    ss_res = 0;
    for (let i = 0; i <= (length - 1); i++) {
      {
        ss_tot := (ss_tot + pinescript.pow((src[i] - y_mean), 2));
        ss_res := (ss_res + pinescript.pow((src[i] - ma[i]), 2));
      }
    }
    (1 - (ss_res / ((ss_tot === 0) ? 1 : ss_tot)));
  }
  r_squared_val = r_squared(src, best_ma, eval_period);
  trend_direction = ((src > best_ma) ? "Bullish" : ((src < best_ma) ? "Bearish" : "Neutral"));
  const ma_color = fixed_color;
  if (use_gradient) {
    {
      normalized_price = ((src - pinescript.lowest(src, 50)) / (pinescript.highest(src, 50) - pinescript.lowest(src, 50)));
      weight = ((normalized_price < 0.5) ? (normalized_price * 2) : ((normalized_price - 0.5) * 2));
      start_color = ((normalized_price < 0.5) ? gradient_start_color : gradient_middle_color);
      end_color = ((normalized_price < 0.5) ? gradient_middle_color : gradient_end_color);
      ma_color := color.rgb(((color.r(start_color) * (1 - weight)) + (color.r(end_color) * weight)), ((color.g(start_color) * (1 - weight)) + (color.g(end_color) * weight)), ((color.b(start_color) * (1 - weight)) + (color.b(end_color) * weight)));
    }
  } else {
    {
      ma_color := fixed_color;
    }
  }
  plot_ma = pinescript.plot((show_ma_line ? best_ma : null), "Optimal MA", ({ color: ma_color, linewidth: ma_linewidth }));
  price_plot = pinescript.plot((show_cloud ? src : null), "Price", ({ color: color.new(color.gray, 100) }));
  pinescript.fill(price_plot, plot_ma, ({ color: ((src > best_ma) ? cloud_bull_color : cloud_bear_color) }));
  plot_size = ((signal_size === "Small") ? size.small : ((signal_size === "Large") ? size.large : size.normal));
  pinescript.plotshape(((show_signals && buy_signal) ? best_ma : null), "Buy Signal", ({ style: ((signal_style === "Triangle") ? shape.triangleup : ((signal_style === "Circle") ? shape.circle : shape.square)), location: location.belowbar, color: color.green, size: size.normal }));
  pinescript.plotshape(((show_signals && sell_signal) ? best_ma : null), "Sell Signal", ({ style: ((signal_style === "Triangle") ? shape.triangledown : ((signal_style === "Circle") ? shape.circle : shape.square)), location: location.abovebar, color: color.red, size: size.normal }));
  if ((show_optimal_info && show_table)) {
    {
      font_size = ((table_size === "Small") ? size.small : ((table_size === "Large") ? size.large : size.normal));
      const prev_price = 0;
      price_change = (((src - prev_price) / prev_price) * 100);
      prev_price := src;
      const table_pos = position.top_right;
      if ((table_position === "Top Left")) {
        {
          table_pos := position.top_left;
        }
      } else {
        if ((table_position === "Bottom Right")) {
          {
            table_pos := position.bottom_right;
          }
        } else {
          if ((table_position === "Bottom Left")) {
            {
              table_pos := position.bottom_left;
            }
          }
        }
      }
      const info_table = table.new(table_pos, 2, (show_performance ? 8 : 7), ({ border_color: table_border_color, border_width: 1, bgcolor: color.new(table_bg_color, table_transparency) }));
      table.cell(info_table, 0, 0, "⚛ Quantum MA", ({ text_color: table_header_text, text_size: font_size, bgcolor: table_header_bg, text_halign: text.align_center }));
      table.cell(info_table, 1, 0, "Analysis", ({ text_color: table_header_text, text_size: font_size, bgcolor: table_header_bg, text_halign: text.align_center }));
      table.cell(info_table, 0, 1, "🌊 MA Type", ({ text_color: table_label_text, text_size: font_size }));
      table.cell(info_table, 1, 1, best_ma_type, ({ text_color: table_value_text, text_size: font_size, bgcolor: color.new(color.rgb(40, 40, 60, 90), 0) }));
      table.cell(info_table, 0, 2, "📏 Length", ({ text_color: table_label_text, text_size: font_size }));
      table.cell(info_table, 1, 2, pinescript.strToString(best_length), ({ text_color: table_value_text, text_size: font_size, bgcolor: color.new(color.rgb(35, 35, 50, 90), 0) }));
      table.cell(info_table, 0, 3, "🎯 Score", ({ text_color: table_label_text, text_size: font_size }));
      score_val = pinescript.arrayMax(final_scores);
      score_color = ((score_val > 0) ? color.rgb(100, 255, 100) : ((score_val < 0) ? color.rgb(255, 100, 100) : color.rgb(200, 200, 200)));
      table.cell(info_table, 1, 3, pinescript.strToString(score_val, "#.####"), ({ text_color: score_color, text_size: font_size, bgcolor: color.new(color.rgb(40, 40, 60, 90), 0) }));
      table.cell(info_table, 0, 4, "📈 Trend", ({ text_color: table_label_text, text_size: font_size }));
      trend_color = ((trend_direction === "Bullish") ? color.rgb(76, 175, 80) : ((trend_direction === "Bearish") ? color.rgb(239, 83, 80) : color.rgb(255, 235, 59)));
      table.cell(info_table, 1, 4, trend_direction, ({ text_color: trend_color, text_size: font_size, bgcolor: color.new(color.rgb(35, 35, 50, 90), 0) }));
      table.cell(info_table, 0, 5, "📊 R²", ({ text_color: table_label_text, text_size: font_size }));
      r2_color = ((r_squared_val > 0.7) ? color.rgb(76, 175, 80) : ((r_squared_val > 0.4) ? color.rgb(255, 193, 7) : color.rgb(239, 83, 80)));
      table.cell(info_table, 1, 5, pinescript.strToString(r_squared_val, "#.####"), ({ text_color: r2_color, text_size: font_size, bgcolor: color.new(color.rgb(40, 40, 60, 90), 0) }));
      table.cell(info_table, 0, 6, "🚦 Signal", ({ text_color: table_label_text, text_size: font_size }));
      signal_icon = ((signal_status === "Buy") ? "🔼 " : ((signal_status === "Sell") ? "🔽 " : "◼ "));
      signal_color = ((signal_status === "Buy") ? color.rgb(76, 175, 80) : ((signal_status === "Sell") ? color.rgb(239, 83, 80) : color.rgb(158, 158, 158)));
      table.cell(info_table, 1, 6, (signal_icon + signal_status), ({ text_color: signal_color, text_size: font_size, bgcolor: color.new(color.rgb(35, 35, 50, 90), 0) }));
      if (show_performance) {
        {
          table.cell(info_table, 0, 7, "💹 Change", ({ text_color: table_label_text, text_size: font_size }));
          change_color = ((price_change > 0) ? color.rgb(76, 175, 80) : ((price_change < 0) ? color.rgb(239, 83, 80) : color.rgb(158, 158, 158)));
          change_icon = ((price_change > 0) ? "△ " : ((price_change < 0) ? "▽ " : "○ "));
          table.cell(info_table, 1, 7, ((change_icon + pinescript.strToString(price_change, "#.##")) + "%"), ({ text_color: change_color, text_size: font_size, bgcolor: color.new(color.rgb(40, 40, 60, 90), 0) }));
        }
      }
    }
  }
}


// Export for use

export { main
};
