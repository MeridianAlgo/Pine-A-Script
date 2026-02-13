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
  time: 1770936396501,
  timenow: 1770936396501,
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


pinescript.color = {

  hex: function(s) {

    if (typeof s !== "string" || s[0] !== "#") return { r: 0, g: 0, b: 0, a: 255 };

    const hex = s.slice(1);

    const hasAlpha = hex.length === 8;

    const r = parseInt(hex.slice(0, 2), 16) || 0;

    const g = parseInt(hex.slice(2, 4), 16) || 0;

    const b = parseInt(hex.slice(4, 6), 16) || 0;

    const a = hasAlpha ? (parseInt(hex.slice(6, 8), 16) || 255) : 255;

    return { r, g, b, a };

  },

  rgb: function(r, g, b, a) { return { r, g, b, a: a ?? 255 }; },

  new: function(c, transp) { return { ...(c || {}), transp: transp ?? 0 }; },

  r: function(c) { return c?.r ?? 0; },

  g: function(c) { return c?.g ?? 0; },

  b: function(c) { return c?.b ?? 0; },

  red: { r: 255, g: 0, b: 0, a: 255 },

  green: { r: 0, g: 255, b: 0, a: 255 },

  blue: { r: 0, g: 0, b: 255, a: 255 },

  gray: { r: 128, g: 128, b: 128, a: 255 },

};


pinescript.size = { small: "small", normal: "normal", large: "large" };

pinescript.shape = { triangleup: "triangleup", triangledown: "triangledown", circle: "circle", square: "square" };

pinescript.location = { belowbar: "belowbar", abovebar: "abovebar" };

pinescript.position = { top_right: "top_right", top_left: "top_left", bottom_right: "bottom_right", bottom_left: "bottom_left" };

pinescript.text = { align_center: "center" };


pinescript.table = {

  new: function(position, columns, rows, opts) { return { position, columns, rows, opts: opts || {}, cells: [] }; },

  cell: function(table, column, row, text, opts) {

    if (!table) return null;

    table.cells.push({ column, row, text, opts: opts || {} });

    return null;

  }

};


// Input parameters


// Main script logic

function main() {

  pinescript.indicator("Machine Learning: kNN-based Strategy", "ML-kNN", true, ({ max_labels_count: 300, format: format.price, precision: 2, timeframe: "", timeframe_gaps: true }));
  const startdate = pinescript.timestamp("01 Jan 2000 00:00:00 GMT+10");
  const stopdate = pinescript.timestamp("31 Dec 2025 23:45:00 GMT+10");
  StartDate = input.time(startdate, "Start Date");
  StopDate = input.time(stopdate, "Stop Date");
  Indicator = input.string("All", "Indicator", ["RSI", "ROC", "CCI", "Volume", "All"]);
  ShortWinow = input.int(14, "Short Period [1..n]", 1);
  LongWindow = input.int(28, "Long Period [2..n]", 2);
  BaseK = input.int(252, "Base No. of Neighbours (K) [5..n]", 5);
  Filter = input.bool(false, "Volatility Filter");
  Bars = input.int(300, "Bar Threshold [2..5000]", 2, 5000);
  const BUY = 1;
  const SELL = -1;
  const CLEAR = 0;
  const k = math.floor(pinescript.sqrt(BaseK));
  const feature1 = pinescript.arrayNew(0);
  const feature2 = pinescript.arrayNew(0);
  const directions = pinescript.arrayNew(0);
  const predictions = pinescript.arrayNew(0);
  const prediction = 0;
  const bars = pinescript.arrayNew(1, 0);
  const signal = CLEAR;
  function minimax(x, p, min, max) {
    const hi = pinescript.highest(x, p);
    const lo = pinescript.lowest(x, p);
    ((((max - min) * (x - lo)) / (hi - lo)) + min);
  }
  function cAqua(g) {
    ((g > 9) ? pinescript.color.hex("#0080FFff") : ((g > 8) ? pinescript.color.hex("#0080FFe5") : ((g > 7) ? pinescript.color.hex("#0080FFcc") : ((g > 6) ? pinescript.color.hex("#0080FFb2") : ((g > 5) ? pinescript.color.hex("#0080FF99") : ((g > 4) ? pinescript.color.hex("#0080FF7f") : ((g > 3) ? pinescript.color.hex("#0080FF66") : ((g > 2) ? pinescript.color.hex("#0080FF4c") : ((g > 1) ? pinescript.color.hex("#0080FF33") : pinescript.color.hex("#00C0FF19"))))))))));
    return undefined;
  }
  function cPink(g) {
    ((g > 9) ? pinescript.color.hex("#FF0080ff") : ((g > 8) ? pinescript.color.hex("#FF0080e5") : ((g > 7) ? pinescript.color.hex("#FF0080cc") : ((g > 6) ? pinescript.color.hex("#FF0080b2") : ((g > 5) ? pinescript.color.hex("#FF008099") : ((g > 4) ? pinescript.color.hex("#FF00807f") : ((g > 3) ? pinescript.color.hex("#FF008066") : ((g > 2) ? pinescript.color.hex("#FF00804c") : ((g > 1) ? pinescript.color.hex("#FF008033") : pinescript.color.hex("#FF008019"))))))))));
    return undefined;
  }
  function inside_window(start, stop) {
    (((time >= start) && (time <= stop)) ? true : false);
  }
  const window = inside_window(StartDate, StopDate);
  const rs = ta.rsi(close, LongWindow);
  const rf = ta.rsi(close, ShortWinow);
  const cs = ta.cci(close, LongWindow);
  const cf = ta.cci(close, ShortWinow);
  const os = ta.roc(close, LongWindow);
  const of = ta.roc(close, ShortWinow);
  const vs = minimax(volume, LongWindow, 0, 99);
  const vf = minimax(volume, ShortWinow, 0, 99);
  const f1 = ((Indicator === "RSI") ? rs : ((Indicator === "CCI") ? cs : ((Indicator === "ROC") ? os : ((Indicator === "Volume") ? vs : math.avg(rs, cs, os, vs)))));
  const f2 = ((Indicator === "RSI") ? rf : ((Indicator === "CCI") ? cf : ((Indicator === "ROC") ? of : ((Indicator === "Volume") ? vf : math.avg(rf, cf, of, vf)))));
  const class_label = int(math.sign((close[1] - close[0])));
  if (window) {
    {
      pinescript.arrayPush(feature1, f1);
      pinescript.arrayPush(feature2, f2);
      pinescript.arrayPush(directions, class_label);
    }
  }
  const size = pinescript.arraySize(directions);
  const maxdist = -999;
  for (let i = 0; i <= (size - 1); i++) {
    {
      const d = pinescript.sqrt((pinescript.pow((f1 - pinescript.arrayGet(feature1, i)), 2) + pinescript.pow((f2 - pinescript.arrayGet(feature2, i)), 2)));
      if ((d > maxdist)) {
        {
          maxdist = d;
          if ((pinescript.arraySize(predictions) >= k)) {
            {
              pinescript.arrayShift(predictions);
            }
          }
          pinescript.arrayPush(predictions, pinescript.arrayGet(directions, i));
        }
      }
    }
  }
  prediction = pinescript.arraySum(predictions);
  const filter = (Filter ? (ta.atr(10) > ta.atr(40)) : true);
  const long = ((prediction > 0) && filter);
  const short = ((prediction < 0) && filter);
  const clear = !(long && short);
  if ((pinescript.arrayGet(bars, 0) === Bars)) {
    {
      signal = CLEAR;
      pinescript.arraySet(bars, 0, 0);
    }
  } else {
    {
      pinescript.arraySet(bars, 0, (pinescript.arrayGet(bars, 0) + 1));
    }
  }
  signal = (long ? BUY : (short ? SELL : (clear ? CLEAR : pinescript.nz(signal[1]))));
  const changed = ta.change(signal);
  const startLongTrade = (changed && (signal === BUY));
  const startShortTrade = (changed && (signal === SELL));
  const clear_condition = (changed && (signal === CLEAR));
  const maxpos = pinescript.highest(high, 10);
  const minpos = pinescript.lowest(low, 10);
  pinescript.plotshape((startLongTrade ? minpos : null), "Buy", pinescript.shape.labelup, pinescript.location.belowbar, cAqua(int((prediction * 5))), ({ size: size.small }));
  pinescript.plotshape((startShortTrade ? maxpos : null), "Sell", pinescript.shape.labeldown, pinescript.location.abovebar, cPink(int((-prediction * 5))), ({ size: size.small }));
  pinescript.plot((clear_condition ? close : null), "ClearPos", pinescript.color.yellow, 4, plot.style_cross);
  alertcondition(startLongTrade, "Buy", "Go long!");
  alertcondition(startShortTrade, "Sell", "Go short!");
}


// Export for use

export { main
};
