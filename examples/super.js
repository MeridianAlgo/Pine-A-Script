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
  time: 1770936464933,
  timenow: 1770936464933,
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

  pinescript.indicator("Machine Learning: Lorentzian Classification", "Lorentzian Classification", true, ({ precision: 4, max_labels_count: 500 }));
  function series_from(feature_string, _close, _high, _low, _hlc3, f_paramA, f_paramB) {
    switch (feature_string) {
      case "RSI":
        return ml.n_rsi(_close, f_paramA, f_paramB);
        break;
      case "WT":
        return ml.n_wt(_hlc3, f_paramA, f_paramB);
        break;
      case "CCI":
        return ml.n_cci(_close, f_paramA, f_paramB);
        break;
      case "ADX":
        return ml.n_adx(_high, _low, _close, f_paramA);
        break;
    }
  }
  function get_lorentzian_distance(i, featureCount, featureSeries, featureArrays) {
    switch (featureCount) {
      case 5:
        return ((((math.log((1 + pinescript.abs((featureSeries.f1 - pinescript.arrayGet(featureArrays.f1, i))))) + math.log((1 + pinescript.abs((featureSeries.f2 - pinescript.arrayGet(featureArrays.f2, i)))))) + math.log((1 + pinescript.abs((featureSeries.f3 - pinescript.arrayGet(featureArrays.f3, i)))))) + math.log((1 + pinescript.abs((featureSeries.f4 - pinescript.arrayGet(featureArrays.f4, i)))))) + math.log((1 + pinescript.abs((featureSeries.f5 - pinescript.arrayGet(featureArrays.f5, i))))));
        break;
      case 4:
        return (((math.log((1 + pinescript.abs((featureSeries.f1 - pinescript.arrayGet(featureArrays.f1, i))))) + math.log((1 + pinescript.abs((featureSeries.f2 - pinescript.arrayGet(featureArrays.f2, i)))))) + math.log((1 + pinescript.abs((featureSeries.f3 - pinescript.arrayGet(featureArrays.f3, i)))))) + math.log((1 + pinescript.abs((featureSeries.f4 - pinescript.arrayGet(featureArrays.f4, i))))));
        break;
      case 3:
        return ((math.log((1 + pinescript.abs((featureSeries.f1 - pinescript.arrayGet(featureArrays.f1, i))))) + math.log((1 + pinescript.abs((featureSeries.f2 - pinescript.arrayGet(featureArrays.f2, i)))))) + math.log((1 + pinescript.abs((featureSeries.f3 - pinescript.arrayGet(featureArrays.f3, i))))));
        break;
      case 2:
        return (math.log((1 + pinescript.abs((featureSeries.f1 - pinescript.arrayGet(featureArrays.f1, i))))) + math.log((1 + pinescript.abs((featureSeries.f2 - pinescript.arrayGet(featureArrays.f2, i))))));
        break;
    }
  }
  const settings = Settings.new(input.source(({ title: "Source", defval: close, group: "General Settings", tooltip: "Source of the input data" })), input.int(({ title: "Neighbors Count", defval: 8, group: "General Settings", minval: 1, maxval: 100, step: 1, tooltip: "Number of neighbors to consider" })), input.int(({ title: "Max Bars Back", defval: 2000, group: "General Settings" })), input.int(({ title: "Feature Count", defval: 5, group: "Feature Engineering", minval: 2, maxval: 5, tooltip: "Number of features to use for ML predictions." })), input.int(({ title: "Color Compression", defval: 1, group: "General Settings", minval: 1, maxval: 10, tooltip: "Compression factor for adjusting the intensity of the color scale." })), input.bool(({ title: "Show Default Exits", defval: false, group: "General Settings", tooltip: "Default exits occur exactly 4 bars after an entry signal. This corresponds to the predefined length of a trade during the model's training process.", inline: "exits" })), input.bool(({ title: "Use Dynamic Exits", defval: false, group: "General Settings", tooltip: "Dynamic exits attempt to let profits ride by dynamically adjusting the exit threshold based on kernel regression logic.", inline: "exits" })));
  showTradeStats = input.bool(true, "Show Trade Stats", ({ tooltip: "Displays the trade stats for a given configuration. Useful for optimizing the settings in the Feature Engineering section. This should NOT replace backtesting and should be used for calibration purposes only. Early Signal Flips represent instances where the model changes signals before 4 bars elapses; high values can indicate choppy (ranging) market conditions.", group: "General Settings" }));
  useWorstCase = input.bool(false, "Use Worst Case Estimates", ({ tooltip: "Whether to use the worst case scenario for backtesting. This option can be useful for creating a conservative estimate that is based on close prices only, thus avoiding the effects of intrabar repainting. This option assumes that the user does not enter when the signal first appears and instead waits for the bar to close as confirmation. On larger timeframes, this can mean entering after a large move has already occurred. Leaving this option disabled is generally better for those that use this indicator as a source of confluence and prefer estimates that demonstrate discretionary mid-bar entries. Leaving this option enabled may be more consistent with traditional backtesting results.", group: "General Settings" }));
  const filterSettings = FilterSettings.new(input.bool(({ title: "Use Volatility Filter", defval: true, tooltip: "Whether to use the volatility filter.", group: "Filters" })), input.bool(({ title: "Use Regime Filter", defval: true, group: "Filters", inline: "regime" })), input.bool(({ title: "Use ADX Filter", defval: false, group: "Filters", inline: "adx" })), input.float(({ title: "Threshold", defval: -0.1, minval: -10, maxval: 10, step: 0.1, tooltip: "Whether to use the trend detection filter. Threshold for detecting Trending/Ranging markets.", group: "Filters", inline: "regime" })), input.int(({ title: "Threshold", defval: 20, minval: 0, maxval: 100, step: 1, tooltip: "Whether to use the ADX filter. Threshold for detecting Trending/Ranging markets.", group: "Filters", inline: "adx" })));
  const filter = Filter.new(ml.filter_volatility(1, 10, filterSettings.useVolatilityFilter), ml.regime_filter(ohlc4, filterSettings.regimeThreshold, filterSettings.useRegimeFilter), ml.filter_adx(settings.source, 14, filterSettings.adxThreshold, filterSettings.useAdxFilter));
  f1_string = input.string(({ title: "Feature 1", options: ["RSI", "WT", "CCI", "ADX"], defval: "RSI", inline: "01", tooltip: "The first feature to use for ML predictions.", group: "Feature Engineering" }));
  f1_paramA = input.int(({ title: "Parameter A", tooltip: "The primary parameter of feature 1.", defval: 14, inline: "02", group: "Feature Engineering" }));
  f1_paramB = input.int(({ title: "Parameter B", tooltip: "The secondary parameter of feature 2 (if applicable).", defval: 1, inline: "02", group: "Feature Engineering" }));
  f2_string = input.string(({ title: "Feature 2", options: ["RSI", "WT", "CCI", "ADX"], defval: "WT", inline: "03", tooltip: "The second feature to use for ML predictions.", group: "Feature Engineering" }));
  f2_paramA = input.int(({ title: "Parameter A", tooltip: "The primary parameter of feature 2.", defval: 10, inline: "04", group: "Feature Engineering" }));
  f2_paramB = input.int(({ title: "Parameter B", tooltip: "The secondary parameter of feature 2 (if applicable).", defval: 11, inline: "04", group: "Feature Engineering" }));
  f3_string = input.string(({ title: "Feature 3", options: ["RSI", "WT", "CCI", "ADX"], defval: "CCI", inline: "05", tooltip: "The third feature to use for ML predictions.", group: "Feature Engineering" }));
  f3_paramA = input.int(({ title: "Parameter A", tooltip: "The primary parameter of feature 3.", defval: 20, inline: "06", group: "Feature Engineering" }));
  f3_paramB = input.int(({ title: "Parameter B", tooltip: "The secondary parameter of feature 3 (if applicable).", defval: 1, inline: "06", group: "Feature Engineering" }));
  f4_string = input.string(({ title: "Feature 4", options: ["RSI", "WT", "CCI", "ADX"], defval: "ADX", inline: "07", tooltip: "The fourth feature to use for ML predictions.", group: "Feature Engineering" }));
  f4_paramA = input.int(({ title: "Parameter A", tooltip: "The primary parameter of feature 4.", defval: 20, inline: "08", group: "Feature Engineering" }));
  f4_paramB = input.int(({ title: "Parameter B", tooltip: "The secondary parameter of feature 4 (if applicable).", defval: 2, inline: "08", group: "Feature Engineering" }));
  f5_string = input.string(({ title: "Feature 5", options: ["RSI", "WT", "CCI", "ADX"], defval: "RSI", inline: "09", tooltip: "The fifth feature to use for ML predictions.", group: "Feature Engineering" }));
  f5_paramA = input.int(({ title: "Parameter A", tooltip: "The primary parameter of feature 5.", defval: 9, inline: "10", group: "Feature Engineering" }));
  f5_paramB = input.int(({ title: "Parameter B", tooltip: "The secondary parameter of feature 5 (if applicable).", defval: 1, inline: "10", group: "Feature Engineering" }));
  featureSeries = FeatureSeries.new(series_from(f1_string, close, high, low, hlc3, f1_paramA, f1_paramB), series_from(f2_string, close, high, low, hlc3, f2_paramA, f2_paramB), series_from(f3_string, close, high, low, hlc3, f3_paramA, f3_paramB), series_from(f4_string, close, high, low, hlc3, f4_paramA, f4_paramB), series_from(f5_string, close, high, low, hlc3, f5_paramA, f5_paramB));
  const f1Array = pinescript.arrayNew();
  const f2Array = pinescript.arrayNew();
  const f3Array = pinescript.arrayNew();
  const f4Array = pinescript.arrayNew();
  const f5Array = pinescript.arrayNew();
  pinescript.arrayPush(f1Array, featureSeries.f1);
  pinescript.arrayPush(f2Array, featureSeries.f2);
  pinescript.arrayPush(f3Array, featureSeries.f3);
  pinescript.arrayPush(f4Array, featureSeries.f4);
  pinescript.arrayPush(f5Array, featureSeries.f5);
  featureArrays = FeatureArrays.new(f1Array, f2Array, f3Array, f4Array, f5Array);
  const direction = pinescript.labelNew(({ long: 1, short: -1, neutral: 0 }));
  maxBarsBackIndex = ((last_bar_index >= settings.maxBarsBack) ? (last_bar_index - settings.maxBarsBack) : 0);
  useEmaFilter = input.bool(({ title: "Use EMA Filter", defval: false, group: "Filters", inline: "ema" }));
  emaPeriod = input.int(({ title: "Period", defval: 200, minval: 1, step: 1, group: "Filters", inline: "ema", tooltip: "The period of the EMA used for the EMA Filter." }));
  isEmaUptrend = (useEmaFilter ? (close > pinescript.ema(close, emaPeriod)) : true);
  isEmaDowntrend = (useEmaFilter ? (close < pinescript.ema(close, emaPeriod)) : true);
  useSmaFilter = input.bool(({ title: "Use SMA Filter", defval: false, group: "Filters", inline: "sma" }));
  smaPeriod = input.int(({ title: "Period", defval: 200, minval: 1, step: 1, group: "Filters", inline: "sma", tooltip: "The period of the SMA used for the SMA Filter." }));
  isSmaUptrend = (useSmaFilter ? (close > pinescript.sma(close, smaPeriod)) : true);
  isSmaDowntrend = (useSmaFilter ? (close < pinescript.sma(close, smaPeriod)) : true);
  useKernelFilter = input.bool(true, "Trade with Kernel", ({ group: "Kernel Settings", inline: "kernel" }));
  showKernelEstimate = input.bool(true, "Show Kernel Estimate", ({ group: "Kernel Settings", inline: "kernel" }));
  useKernelSmoothing = input.bool(false, "Enhance Kernel Smoothing", ({ tooltip: "Uses a crossover based mechanism to smoothen kernel color changes. This often results in less color transitions overall and may result in more ML entry signals being generated.", inline: "1", group: "Kernel Settings" }));
  h = input.int(8, "Lookback Window", ({ minval: 3, tooltip: "The number of bars used for the estimation. This is a sliding value that represents the most recent historical bars. Recommended range: 3-50", group: "Kernel Settings", inline: "kernel" }));
  r = input.float(8, "Relative Weighting", ({ step: 0.25, tooltip: "Relative weighting of time frames. As this value approaches zero, the longer time frames will exert more influence on the estimation. As this value approaches infinity, the behavior of the Rational Quadratic Kernel will become identical to the Gaussian kernel. Recommended range: 0.25-25", group: "Kernel Settings", inline: "kernel" }));
  x = input.int(25, "Regression Level", ({ tooltip: "Bar index on which to start regression. Controls how tightly fit the kernel estimate is to the data. Smaller values are a tighter fit. Larger values are a looser fit. Recommended range: 2-25", group: "Kernel Settings", inline: "kernel" }));
  lag = input.int(2, "Lag", ({ tooltip: "Lag for crossover detection. Lower values result in earlier crossovers. Recommended range: 1-2", inline: "1", group: "Kernel Settings" }));
  showBarColors = input.bool(true, "Show Bar Colors", ({ tooltip: "Whether to show the bar colors.", group: "Display Settings" }));
  showBarPredictions = input.bool(({ defval: true, title: "Show Bar Prediction Values", tooltip: "Will show the ML model's evaluation of each bar as an integer.", group: "Display Settings" }));
  useAtrOffset = input.bool(({ defval: false, title: "Use ATR Offset", tooltip: "Will use the ATR offset instead of the bar prediction offset.", group: "Display Settings" }));
  barPredictionsOffset = input.float(0, "Bar Prediction Offset", ({ minval: 0, tooltip: "The offset of the bar predictions as a percentage from the bar high or close.", group: "Display Settings" }));
  src = settings.source;
  y_train_series = ((src[4] < src[0]) ? direction.short : ((src[4] > src[0]) ? direction.long : direction.neutral));
  const y_train_array = pinescript.arrayNew(0);
  const predictions = pinescript.arrayNew(0);
  const prediction = 0;
  const signal = direction.neutral;
  const distances = pinescript.arrayNew(0);
  pinescript.arrayPush(y_train_array, y_train_series);
  lastDistance = -1;
  pinescript.size = pinescript.min((settings.maxBarsBack - 1), (pinescript.arraySize(y_train_array) - 1));
  sizeLoop = pinescript.min((settings.maxBarsBack - 1), pinescript.size);
  if ((bar_index >= maxBarsBackIndex)) {
    {
      for (let i = 0; i <= sizeLoop; i++) {
        {
          d = get_lorentzian_distance(i, settings.featureCount, featureSeries, featureArrays);
          if (((d >= lastDistance) && (i % 4))) {
            {
              lastDistance = d;
              pinescript.arrayPush(distances, d);
              pinescript.arrayPush(predictions, pinescript.round(pinescript.arrayGet(y_train_array, i)));
              if ((pinescript.arraySize(predictions) > settings.neighborsCount)) {
                {
                  lastDistance = pinescript.arrayGet(distances, pinescript.round(((settings.neighborsCount * 3) / 4)));
                  pinescript.arrayShift(distances);
                  pinescript.arrayShift(predictions);
                }
              }
            }
          }
        }
      }
      prediction = pinescript.arraySum(predictions);
    }
  }
  filter_all = ((filter.volatility && filter.regime) && filter.adx);
  signal = (((prediction > 0) && filter_all) ? direction.long : (((prediction < 0) && filter_all) ? direction.short : pinescript.nz(signal[1])));
  const barsHeld = 0;
  barsHeld = (ta.change(signal) ? 0 : (barsHeld + 1));
  isHeldFourBars = (barsHeld === 4);
  isHeldLessThanFourBars = ((0 < barsHeld) && (barsHeld < 4));
  isDifferentSignalType = ta.change(signal);
  isEarlySignalFlip = (ta.change(signal) && ((ta.change(signal[1]) || ta.change(signal[2])) || ta.change(signal[3])));
  isBuySignal = (((signal === direction.long) && isEmaUptrend) && isSmaUptrend);
  isSellSignal = (((signal === direction.short) && isEmaDowntrend) && isSmaDowntrend);
  isLastSignalBuy = (((signal[4] === direction.long) && isEmaUptrend[4]) && isSmaUptrend[4]);
  isLastSignalSell = (((signal[4] === direction.short) && isEmaDowntrend[4]) && isSmaDowntrend[4]);
  isNewBuySignal = (isBuySignal && isDifferentSignalType);
  isNewSellSignal = (isSellSignal && isDifferentSignalType);
  c_green = pinescript.color.new(pinescript.color.hex("#009988"), 20);
  c_red = pinescript.color.new(pinescript.color.hex("#CC3311"), 20);
  transparent = pinescript.color.new(pinescript.color.hex("#000000"), 100);
  yhat1 = kernels.rationalQuadratic(settings.source, h, r, x);
  yhat2 = kernels.gaussian(settings.source, (h - lag), x);
  kernelEstimate = yhat1;
  const wasBearishRate = (yhat1[2] > yhat1[1]);
  const wasBullishRate = (yhat1[2] < yhat1[1]);
  const isBearishRate = (yhat1[1] > yhat1);
  const isBullishRate = (yhat1[1] < yhat1);
  isBearishChange = (isBearishRate && wasBullishRate);
  isBullishChange = (isBullishRate && wasBearishRate);
  const isBullishCrossAlert = pinescript.cross(yhat2, yhat1);
  const isBearishCrossAlert = pinescript.cross(yhat2, yhat1);
  const isBullishSmooth = (yhat2 >= yhat1);
  const isBearishSmooth = (yhat2 <= yhat1);
  const colorByCross = (isBullishSmooth ? c_green : c_red);
  const colorByRate = (isBullishRate ? c_green : c_red);
  const plotColor = (showKernelEstimate ? (useKernelSmoothing ? colorByCross : colorByRate) : transparent);
  pinescript.plot(kernelEstimate, ({ color: plotColor, linewidth: 2, title: "Kernel Regression Estimate" }));
  const alertBullish = (useKernelSmoothing ? isBullishCrossAlert : isBullishChange);
  const alertBearish = (useKernelSmoothing ? isBearishCrossAlert : isBearishChange);
  isBullish = (useKernelFilter ? (useKernelSmoothing ? isBullishSmooth : isBullishRate) : true);
  isBearish = (useKernelFilter ? (useKernelSmoothing ? isBearishSmooth : isBearishRate) : true);
  startLongTrade = (((isNewBuySignal && isBullish) && isEmaUptrend) && isSmaUptrend);
  startShortTrade = (((isNewSellSignal && isBearish) && isEmaDowntrend) && isSmaDowntrend);
  lastSignalWasBullish = (ta.barssince(startLongTrade) < ta.barssince(startShortTrade));
  lastSignalWasBearish = (ta.barssince(startShortTrade) < ta.barssince(startLongTrade));
  barsSinceRedEntry = ta.barssince(startShortTrade);
  barsSinceRedExit = ta.barssince(alertBullish);
  barsSinceGreenEntry = ta.barssince(startLongTrade);
  barsSinceGreenExit = ta.barssince(alertBearish);
  isValidShortExit = (barsSinceRedExit > barsSinceRedEntry);
  isValidLongExit = (barsSinceGreenExit > barsSinceGreenEntry);
  endLongTradeDynamic = (isBearishChange && isValidLongExit[1]);
  endShortTradeDynamic = (isBullishChange && isValidShortExit[1]);
  endLongTradeStrict = (((isHeldFourBars && isLastSignalBuy) || ((isHeldLessThanFourBars && isNewSellSignal) && isLastSignalBuy)) && startLongTrade[4]);
  endShortTradeStrict = (((isHeldFourBars && isLastSignalSell) || ((isHeldLessThanFourBars && isNewBuySignal) && isLastSignalSell)) && startShortTrade[4]);
  isDynamicExitValid = ((!useEmaFilter && !useSmaFilter) && !useKernelSmoothing);
  endLongTrade = ((settings.useDynamicExits && isDynamicExitValid) ? endLongTradeDynamic : endLongTradeStrict);
  endShortTrade = ((settings.useDynamicExits && isDynamicExitValid) ? endShortTradeDynamic : endShortTradeStrict);
  pinescript.plotshape((startLongTrade ? low : null), "Buy", pinescript.shape.labelup, pinescript.location.belowbar, ({ color: ml.color_green(prediction), size: pinescript.size.small, offset: 0 }));
  pinescript.plotshape((startShortTrade ? high : null), "Sell", pinescript.shape.labeldown, pinescript.location.abovebar, ml.color_red(-prediction), ({ size: pinescript.size.small, offset: 0 }));
  pinescript.plotshape(((endLongTrade && settings.showExits) ? high : null), "StopBuy", pinescript.shape.xcross, pinescript.location.absolute, ({ color: pinescript.color.hex("#3AFF17"), size: pinescript.size.tiny, offset: 0 }));
  pinescript.plotshape(((endShortTrade && settings.showExits) ? low : null), "StopSell", pinescript.shape.xcross, pinescript.location.absolute, ({ color: pinescript.color.hex("#FD1707"), size: pinescript.size.tiny, offset: 0 }));
  alertcondition(startLongTrade, ({ title: "Open Long ▲", message: "LDC Open Long ▲ | {{ticker}}@{{close}} | ({{interval}})" }));
  alertcondition(endLongTrade, ({ title: "Close Long ▲", message: "LDC Close Long ▲ | {{ticker}}@{{close}} | ({{interval}})" }));
  alertcondition(startShortTrade, ({ title: "Open Short ▼", message: "LDC Open Short  | {{ticker}}@{{close}} | ({{interval}})" }));
  alertcondition(endShortTrade, ({ title: "Close Short ▼", message: "LDC Close Short ▼ | {{ticker}}@{{close}} | ({{interval}})" }));
  alertcondition((startShortTrade || startLongTrade), ({ title: "Open Position ▲▼", message: "LDC Open Position ▲▼ | {{ticker}}@{{close}} | ({{interval}})" }));
  alertcondition((endShortTrade || endLongTrade), ({ title: "Close Position ▲▼", message: "LDC Close Position  ▲▼ | {{ticker}}@[{{close}}] | ({{interval}})" }));
  alertcondition(({ condition: alertBullish, title: "Kernel Bullish Color Change", message: "LDC Kernel Bullish ▲ | {{ticker}}@{{close}} | ({{interval}})" }));
  alertcondition(({ condition: alertBearish, title: "Kernel Bearish Color Change", message: "LDC Kernel Bearish ▼ | {{ticker}}@{{close}} | ({{interval}})" }));
  atrSpaced = (useAtrOffset ? ta.atr(1) : null);
  compressionFactor = (settings.neighborsCount / settings.colorCompression);
  c_pred = ((prediction > 0) ? color.from_gradient(prediction, 0, compressionFactor, pinescript.color.hex("#787b86"), pinescript.color.hex("#009988")) : ((prediction <= 0) ? color.from_gradient(prediction, -compressionFactor, 0, pinescript.color.hex("#CC3311"), pinescript.color.hex("#787b86")) : null));
  c_label = (showBarPredictions ? c_pred : null);
  c_bars = (showBarColors ? pinescript.color.new(c_pred, 50) : null);
  x_val = bar_index;
  y_val = (useAtrOffset ? ((prediction > 0) ? (high + atrSpaced) : (low - atrSpaced)) : ((prediction > 0) ? (high + ((hl2 * barPredictionsOffset) / 20)) : (low - ((hl2 * barPredictionsOffset) / 30))));
  pinescript.labelNew(x_val, y_val, pinescript.strToString(prediction), xloc.bar_index, yloc.price, pinescript.color.new(pinescript.color.white, 100), label.style_label_up, c_label, pinescript.size.normal, pinescript.text.align_left);
  barcolor((showBarColors ? pinescript.color.new(c_pred, 50) : null));
  backTestStream = ((startLongTrade) ? 1 : ((endLongTrade) ? 2 : ((startShortTrade) ? -1 : ((endShortTrade) ? -2 : null))));
  pinescript.plot(backTestStream, "Backtest Stream", ({ display: display.none }));
  [totalWins, totalLosses, totalEarlySignalFlips, totalTrades, tradeStatsHeader, winLossRatio, winRate] = ml.backtest(high, low, open, startLongTrade, endLongTrade, startShortTrade, endShortTrade, isEarlySignalFlip, maxBarsBackIndex, bar_index, settings.source, useWorstCase);
  function init_table() {
    c_transparent = pinescript.color.new(pinescript.color.black, 100);
    pinescript.table.new(pinescript.position.top_right, ({ columns: 2, rows: 7, frame_color: pinescript.color.new(pinescript.color.black, 100), frame_width: 1, border_width: 1, border_color: c_transparent }));
  }
  function update_table(tbl, tradeStatsHeader, totalTrades, totalWins, totalLosses, winLossRatio, winRate, stopLosses) {
    c_transparent = pinescript.color.new(pinescript.color.black, 100);
    pinescript.table.cell(tbl, 0, 0, tradeStatsHeader, ({ text_halign: pinescript.text.align_center, text_color: pinescript.color.gray, text_size: pinescript.size.normal }));
    pinescript.table.cell(tbl, 0, 1, "Winrate", ({ text_halign: pinescript.text.align_center, bgcolor: c_transparent, text_color: pinescript.color.gray, text_size: pinescript.size.normal }));
    pinescript.table.cell(tbl, 1, 1, pinescript.strToString((totalWins / totalTrades), "#.#%"), ({ text_halign: pinescript.text.align_center, bgcolor: c_transparent, text_color: pinescript.color.gray, text_size: pinescript.size.normal }));
    pinescript.table.cell(tbl, 0, 2, "Trades", ({ text_halign: pinescript.text.align_center, bgcolor: c_transparent, text_color: pinescript.color.gray, text_size: pinescript.size.normal }));
    pinescript.table.cell(tbl, 1, 2, (((((pinescript.strToString(totalTrades, "#") + " (") + pinescript.strToString(totalWins, "#")) + "|") + pinescript.strToString(totalLosses, "#")) + ")"), ({ text_halign: pinescript.text.align_center, bgcolor: c_transparent, text_color: pinescript.color.gray, text_size: pinescript.size.normal }));
    pinescript.table.cell(tbl, 0, 5, "WL Ratio", ({ text_halign: pinescript.text.align_center, bgcolor: c_transparent, text_color: pinescript.color.gray, text_size: pinescript.size.normal }));
    pinescript.table.cell(tbl, 1, 5, pinescript.strToString((totalWins / totalLosses), "0.00"), ({ text_halign: pinescript.text.align_center, bgcolor: c_transparent, text_color: pinescript.color.gray, text_size: pinescript.size.normal }));
    pinescript.table.cell(tbl, 0, 6, "Early Signal Flips", ({ text_halign: pinescript.text.align_center, bgcolor: c_transparent, text_color: pinescript.color.gray, text_size: pinescript.size.normal }));
    pinescript.table.cell(tbl, 1, 6, pinescript.strToString(totalEarlySignalFlips, "#"), ({ text_halign: pinescript.text.align_center, bgcolor: c_transparent, text_color: pinescript.color.gray, text_size: pinescript.size.normal }));
  }
  if (showTradeStats) {
    {
      const tbl = ml.init_table();
      if (barstate.islast) {
        {
          update_table(tbl, tradeStatsHeader, totalTrades, totalWins, totalLosses, winLossRatio, winRate, totalEarlySignalFlips);
        }
      }
    }
  }
}


// Export for use

export { main
};
