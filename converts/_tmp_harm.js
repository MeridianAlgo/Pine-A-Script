// PineScript to JavaScript Transpiled Code

// Generated automatically


// Built-in PineScript functions

const pinescript = {

  sma: function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    return slice.reduce((a, b) => a + b, 0) / length;
  },
  ema: function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < 1) return null;
    const alpha = 2 / (length + 1);
    let result = series[0];
    for (let i = 1; i < series.length; i++) {
      result = alpha * series[i] + (1 - alpha) * result;
    }
    return result;
  },
  wma: function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
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
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < 1) return null;
    const alpha = 1 / length;
    let result = series[0];
    for (let i = 1; i < series.length; i++) {
      result = alpha * series[i] + (1 - alpha) * result;
    }
    return result;
  },
  hma: function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < length) return null;
    const halfLength = Math.floor(length / 2);
    const wma1 = builtins.get('wma')(series, halfLength);
    const wma2 = builtins.get('wma')(series, length);
    const diff = wma2 - wma1;
    return builtins.get('wma')([diff, diff], Math.floor(Math.sqrt(length)));
  },
  alma: function(series, length, offset = 0.85, sigma = 6) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
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
    if (!Array.isArray(high) || !Array.isArray(low) || !Array.isArray(close)) return null;
    if (high.length < length + 1 || low.length < length + 1 || close.length < length + 1) return null;
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
    if (close === null || close === undefined) return null;
    if (!Array.isArray(close)) close = [close];
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
  roc: function(series, length = 9) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < length + 1) return null;
    const prev = series[series.length - 1 - length];
    const curr = series[series.length - 1];
    if (prev === 0 || prev === null || prev === undefined) return null;
    return ((curr - prev) / prev) * 100;
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
  cci: function(a, b, c, d) {
    // Pine signatures:
    // - ta.cci(source, length)
    // - ta.cci(high, low, close, length)
    let source;
    let length;
    if (Array.isArray(a) && typeof b === 'number' && c === undefined) {
      source = a;
      length = b;
    } else {
      const high = a;
      const low = b;
      const close = c;
      length = d ?? 20;
      if (!high || !low || !close) return null;
      if (!Array.isArray(high) || !Array.isArray(low) || !Array.isArray(close)) return null;
      source = high.map((h, i) => (h + low[i] + close[i]) / 3);
    }

    if (!source || source.length < length) return null;
    const sma = builtins.get('sma')(source, length);
    const slice = source.slice(-length);
    const meanDev = slice.reduce((sum, val) => sum + Math.abs(val - sma), 0) / length;
    if (meanDev === 0) return 0;
    return (source[source.length - 1] - sma) / (0.015 * meanDev);
  },
  change: function(series) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (series.length < 2) return null;
    return series[series.length - 1] - series[series.length - 2];
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
    if (series1 === null || series1 === undefined) return false;
    if (series2 === null || series2 === undefined) return false;
    if (!Array.isArray(series1)) series1 = [series1];
    if (!Array.isArray(series2)) series2 = [series2];
    if (series1.length < 2 || series2.length < 2) return false;
    const i = series1.length - 1;
    return (series1[i - 1] < series2[i - 1] && series1[i] >= series2[i]) ||
           (series1[i - 1] > series2[i - 1] && series1[i] <= series2[i]);
  },
  offset: function(series, offset) {
    if (!Array.isArray(series)) return null;
    const idx = series.length - 1 - offset;
    return idx >= 0 ? series[idx] : null;
  },
  valuewhen: function(condition, source, occurrence = 1) {
    if (condition === null || condition === undefined) return null;
    if (source === null || source === undefined) return null;
    if (!Array.isArray(condition)) condition = [condition];
    if (!Array.isArray(source)) source = [source];
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
    if (condition === null || condition === undefined) return null;
    if (!Array.isArray(condition)) {
      return condition ? 0 : null;
    }
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
  na: null,
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
  plot: function(value, ...rest) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.plots.push({ value, args: rest });
    }
    return value;
  },
  plotshape: function(condition, ...rest) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.plotshapes.push({ condition, args: rest });
    }
    return condition;
  },
  indicator: function(title, shorttitle, overlay, opts) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.indicator = { title, shorttitle, overlay, opts };
    }
    return null;
  },
  strategy: function(title, shorttitle, overlay, opts) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.strategy = { title, shorttitle, overlay, opts };
    }
    return null;
  },
  alertcondition: function(condition, ...rest) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.alerts.push({ condition, args: rest });
    }
    return null;
  },
  plotbar: function(open, high, low, close, title, color, editable, showLast) {
    return { open, high, low, close };
  },
  plotcandle: function(open, high, low, close, title, color, wickColor, borderColor, editable, showLast) {
    return { open, high, low, close };
  },
  hline: function(_price, _title, _opts) {
    return null;
  },
  labelNew: function(...args) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.labels = globalThis.__pineRuntime.labels || [];
      globalThis.__pineRuntime.labels.push({ args });
    }
    return { args };
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
  true: true,
  false: false,
  ticker: "AAPL",
  tickerid: "NASDAQ:AAPL",
  syminfo: function(type) {
    const info = { ticker: 'AAPL', tickerid: 'NASDAQ:AAPL', prefix: 'NASDAQ', root: 'AAPL', suffix: '' };
    return info[type] || '';
  },
  time: 1770941990085,
  timenow: 1770941990085,
  barstate: "LAST",
  dividends: {},
  splits: {},
  earnings: {},
  volume: 0,
  open: 0,
  high: 0,
  low: 0,
  close: 0,
  pivothigh: function(_leftBars, _rightBars) {
    return null;
  },
  pivotlow: function(_leftBars, _rightBars) {
    return null;
  },
  tr: function(high, low, close) {
    // Pine signature: ta.tr(true)
    if (typeof high === 'boolean') {
      const H = globalThis.high;
      const L = globalThis.low;
      const C = globalThis.close;
      if (!Array.isArray(H) || !Array.isArray(L) || !Array.isArray(C) || C.length < 2) return null;
      const i = C.length - 1;
      const prevClose = C[i - 1];
      return Math.max(H[i] - L[i], Math.abs(H[i] - prevClose), Math.abs(L[i] - prevClose));
    }

    // Fallback: treat inputs as scalars for current bar
    if (Array.isArray(close)) {
      const prevClose = close[close.length - 2] || close[0];
      const currHigh = Array.isArray(high) ? high[high.length - 1] : high;
      const currLow = Array.isArray(low) ? low[low.length - 1] : low;
      const currClose = close[close.length - 1];
      return Math.max(currHigh - currLow, Math.abs(currHigh - prevClose), Math.abs(currLow - prevClose));
    }

    return Math.max(high - low, Math.abs(high - close), Math.abs(low - close));
  },
};


const builtins = new Map(Object.entries(pinescript));


globalThis.__pineRuntime = globalThis.__pineRuntime || { plots: [], plotshapes: [], alerts: [] };

globalThis.pinescript = pinescript;


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

  from_gradient: function(value, min, max, color1, color2) {

    const c1 = color1 || { r: 0, g: 0, b: 0, a: 255 };

    const c2 = color2 || { r: 255, g: 255, b: 255, a: 255 };

    if (value === null || value === undefined || min === null || min === undefined || max === null || max === undefined) return c1;

    const denom = (max - min);

    const t = denom === 0 ? 0 : Math.max(0, Math.min(1, (value - min) / denom));

    const lerp = (a, b) => Math.round(a + (b - a) * t);

    return { r: lerp(c1.r ?? 0, c2.r ?? 0), g: lerp(c1.g ?? 0, c2.g ?? 0), b: lerp(c1.b ?? 0, c2.b ?? 0), a: lerp(c1.a ?? 255, c2.a ?? 255) };

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

  pinescript.indicator("Adaptive Harmonic Forecast [LuxAlgo]", "LuxAlgo - Adaptive Harmonic Forecast", ({ overlay: true, max_labels_count: 500, max_polylines_count: 100 }));
  const BULL_COLOR = pinescript.color.hex("#089981");
  const BEAR_COLOR = pinescript.color.hex("#f23645");
  let TINY = "Tiny";
  let SMALL = "Small";
  let NORMAL = "Normal";
  let LARGE = "Large";
  let HUGE = "Huge";
  const lenInput = input.int(100, "Fit Lookback (N)", ({ minval: 5, group: "Settings", tooltip: "Max Period is automatically set to this value." }));
  const extrapInput = input.int(50, "Extrapolation Bars", ({ minval: 1, group: "Settings" }));
  const numSinesInput = input.int(5, "Number of Sinusoids", ({ minval: 1, maxval: 10, group: "Settings" }));
  let group_auto = "Automatic Cycle Detection";
  const minPInput = input.int(10, "Min Period", ({ minval: 5, group: group_auto }));
  let group_visuals = "Visuals";
  const showMarkerInput = input.bool(true, "Show Reversal Dots", ({ group: group_visuals }));
  const markerSizeInput = input.string(LARGE, "Dot Size", ({ options: [TINY, SMALL, NORMAL, LARGE, HUGE], group: group_visuals }));
  const showTableInput = input.bool(true, "Show Detected Periods", ({ group: group_visuals }));
  let group_trend = "Trend Line";
  const showTrendInput = input.bool(true, "Show Trend Line", ({ group: group_trend }));
  const trendColorInput = input.color(pinescript.color.gray, "Trend Line Color", ({ group: group_trend }));
  let parsedSize = ((markerSizeInput === TINY) ? pinescript.size.tiny : ((markerSizeInput === SMALL) ? pinescript.size.small : ((markerSizeInput === NORMAL) ? pinescript.size.normal : ((markerSizeInput === LARGE) ? pinescript.size.large : ((markerSizeInput === HUGE) ? pinescript.size.huge : null)))));
  function get_dominant_periods(len, min_p, max_p, num_waves) {
    const sumX = 0;
    const sumY = 0;
    const sumXY = 0;
    const sumX2 = 0;
    for (let i = 0; i <= (len - 1); i++) {
      {
        const val = pinescript.offset(close, ((len - 1) - i));
        sumX += i;
        sumY += val;
        sumXY += (i * val);
        sumX2 += (i * i);
      }
    }
    const slope = (((len * sumXY) - (sumX * sumY)) / ((len * sumX2) - (sumX * sumX)));
    const intercept = ((sumY - (slope * sumX)) / len);
    const powers = pinescript.arrayNew();
    const periods = pinescript.arrayNew();
    for (let p = min_p; p <= max_p; p++) {
      {
        const sumS = 0;
        const sumC = 0;
        const w = ((2 * pinescript.math.pi) / p);
        for (let i = 0; i <= (len - 1); i++) {
          {
            const detrended_val = (pinescript.offset(close, ((len - 1) - i)) - ((slope * i) + intercept));
            sumS += (detrended_val * math.sin((w * i)));
            sumC += (detrended_val * math.cos((w * i)));
          }
        }
        const pwr = (pinescript.pow(sumS, 2) + pinescript.pow(sumC, 2));
        pinescript.arrayPush(powers, pwr);
        pinescript.arrayPush(periods, p);
      }
    }
    const peak_periods = pinescript.arrayNew();
    const peak_powers = pinescript.arrayNew();
    for (let i = 1; i <= (pinescript.arraySize(powers) - 2); i++) {
      {
        const curr = pinescript.arrayGet(powers, i);
        const prev = pinescript.arrayGet(powers, (i - 1));
        const next = pinescript.arrayGet(powers, (i + 1));
        if (((curr > prev) && (curr > next))) {
          {
            pinescript.arrayPush(peak_periods, pinescript.arrayGet(periods, i));
            pinescript.arrayPush(peak_powers, curr);
          }
        }
      }
    }
    const sorted_periods = pinescript.arrayNew();
    if ((pinescript.arraySize(peak_powers) > 0)) {
      {
        const count = pinescript.min(num_waves, pinescript.arraySize(peak_powers));
        for (let k = 1; k <= count; k++) {
          {
            const max_pwr = -1;
            const max_idx = -1;
            for (let m = 0; m <= (pinescript.arraySize(peak_powers) - 1); m++) {
              {
                const pwr = pinescript.arrayGet(peak_powers, m);
                if ((pwr > max_pwr)) {
                  {
                    max_pwr = pwr;
                    max_idx = m;
                  }
                }
              }
            }
            if ((max_idx !== -1)) {
              {
                pinescript.arrayPush(sorted_periods, float(pinescript.arrayGet(peak_periods, max_idx)));
                pinescript.arrayRemove(peak_powers, max_idx);
                pinescript.arrayRemove(peak_periods, max_idx);
              }
            }
          }
        }
      }
    }
    return sorted_periods;
  }
  function get_composite_fit(len, periods) {
    const num_waves = pinescript.arraySize(periods);
    const num_cols = ((num_waves * 2) + 2);
    const X = pinescript.matrixNew(len, num_cols);
    const Y = pinescript.matrixNew(len, 1);
    for (let i = 0; i <= (len - 1); i++) {
      {
        const val = pinescript.offset(close, ((len - 1) - i));
        pinescript.matrixSet(Y, i, 0, val);
        const t = float(i);
        for (let j = 0; j <= (num_waves - 1); j++) {
          {
            const w = ((2 * pinescript.math.pi) / pinescript.arrayGet(periods, j));
            pinescript.matrixSet(X, i, (j * 2), math.sin((w * t)));
            pinescript.matrixSet(X, i, ((j * 2) + 1), math.cos((w * t)));
          }
        }
        pinescript.matrixSet(X, i, (num_cols - 2), t);
        pinescript.matrixSet(X, i, (num_cols - 1), 1);
      }
    }
    const XT = pinescript.matrixTranspose(X);
    const XTX = pinescript.matrixMult(XT, X);
    const XTY = pinescript.matrixMult(XT, Y);
    const XTXi = pinescript.matrixInv(XTX);
    const Beta = null;
    if (!pinescript.na(XTXi)) {
      {
        Beta = pinescript.matrixMult(XTXi, XTY);
      }
    }
    return Beta;
  }
  function get_y_hat(t, Beta, periods) {
    const y_hat = 0;
    if (!pinescript.na(Beta)) {
      {
        const num_waves = pinescript.arraySize(periods);
        for (let j = 0; j <= (num_waves - 1); j++) {
          {
            const w = ((2 * pinescript.math.pi) / pinescript.arrayGet(periods, j));
            const a = pinescript.matrixGet(Beta, (j * 2), 0);
            const b = pinescript.matrixGet(Beta, ((j * 2) + 1), 0);
            y_hat += ((a * math.sin((w * t))) + (b * math.cos((w * t))));
          }
        }
        const rows = pinescript.matrixRows(Beta);
        y_hat += (pinescript.matrixGet(Beta, (rows - 2), 0) * t);
        y_hat += pinescript.matrixGet(Beta, (rows - 1), 0);
      }
    }
    return y_hat;
  }
  let _polyHist = null;
  let _polyTrend = null;
  let _polyTrendExt = null;
  let _forePolys = pinescript.arrayNew();
  let _revMarkers = array.new_label();
  let _infoTable = pinescript.table.new(pinescript.position.top_right, 2, 11, ({ bgcolor: pinescript.color.hex("#161616"), border_width: 1, frame_color: pinescript.color.hex("#2E2E2E") }));
  if (barstate.islast) {
    {
      const best_periods = get_dominant_periods(lenInput, minPInput, lenInput, numSinesInput);
      const Beta = get_composite_fit(lenInput, best_periods);
      if (!pinescript.na(Beta)) {
        {
          const base_idx = (bar_index - (lenInput - 1));
          const rows = pinescript.matrixRows(Beta);
          const slope = pinescript.matrixGet(Beta, (rows - 2), 0);
          const intercept = pinescript.matrixGet(Beta, (rows - 1), 0);
          const pointsHist = pinescript.arrayNew();
          const pointsTrend = pinescript.arrayNew();
          for (let i = 0; i <= (lenInput - 1); i++) {
            {
              const y_hat = get_y_hat(float(i), Beta, best_periods);
              pointsHist.push(chart.point.from_index((base_idx + i), y_hat));
              if (showTrendInput) {
                {
                  pointsTrend.push(chart.point.from_index((base_idx + i), ((slope * i) + intercept)));
                }
              }
            }
          }
          for (const p of _forePolys) {
            {
              p.delete();
            }
          }
          pinescript.arrayClear(_forePolys);
          const pointsTrendExt = pinescript.arrayNew();
          if (showTrendInput) {
            {
              pointsTrendExt.push(chart.point.from_index(bar_index, ((slope * (lenInput - 1)) + intercept)));
            }
          }
          const prev_y = get_y_hat(float((lenInput - 1)), Beta, best_periods);
          const segPoints = pinescript.arrayNew();
          segPoints.push(chart.point.from_index(bar_index, prev_y));
          const is_up = true;
          const is_up_set = false;
          for (let i = 1; i <= extrapInput; i++) {
            {
              const t_rel = float(((lenInput - 1) + i));
              const y = get_y_hat(t_rel, Beta, best_periods);
              const current_up = (y >= prev_y);
              if (showTrendInput) {
                {
                  pointsTrendExt.push(chart.point.from_index((bar_index + i), ((slope * t_rel) + intercept)));
                }
              }
              if (!is_up_set) {
                {
                  is_up = current_up;
                  is_up_set = true;
                }
              }
              if ((current_up !== is_up)) {
                {
                  pinescript.arrayPush(_forePolys, polyline.new(segPoints, ({ line_color: (is_up ? BULL_COLOR : BEAR_COLOR), line_width: 2, line_style: line.style_dotted })));
                  chart.point;
                  let last_pt = pinescript.arrayGet(segPoints, (pinescript.arraySize(segPoints) - 1));
                  pinescript.arrayClear(segPoints);
                  pinescript.arrayPush(segPoints, last_pt);
                  is_up = current_up;
                }
              }
              segPoints.push(chart.point.from_index((bar_index + i), y));
              prev_y = y;
            }
          }
          if ((pinescript.arraySize(segPoints) > 1)) {
            {
              pinescript.arrayPush(_forePolys, polyline.new(segPoints, ({ line_color: (is_up ? BULL_COLOR : BEAR_COLOR), line_width: 2, line_style: line.style_dotted })));
            }
          }
          _polyHist.delete();
          _polyTrend.delete();
          _polyTrendExt.delete();
          for (const l of _revMarkers) {
            {
              l.delete();
            }
          }
          pinescript.arrayClear(_revMarkers);
          _polyHist = polyline.new(pointsHist, ({ line_color: ((slope >= 0) ? BULL_COLOR : BEAR_COLOR), line_width: 2 }));
          if (showTrendInput) {
            {
              _polyTrend = polyline.new(pointsTrend, ({ line_color: trendColorInput, line_width: 1 }));
              _polyTrendExt = polyline.new(pointsTrendExt, ({ line_color: trendColorInput, line_width: 1, line_style: line.style_dotted }));
            }
          }
          if (showMarkerInput) {
            {
              for (let i = 1; i <= (extrapInput - 1); i++) {
                {
                  const t_rel = float(((lenInput - 1) + i));
                  const curr = get_y_hat(t_rel, Beta, best_periods);
                  const prev = get_y_hat((t_rel - 1), Beta, best_periods);
                  const next = get_y_hat((t_rel + 1), Beta, best_periods);
                  if ((((curr > prev) && (curr > next)) || ((curr < prev) && (curr < next)))) {
                    {
                      const mCol = ((curr > prev) ? BEAR_COLOR : BULL_COLOR);
                      pinescript.arrayPush(_revMarkers, pinescript.labelNew((bar_index + i), curr, "•", ({ color: pinescript.color.hex("#00000000"), textcolor: mCol, style: label.style_label_center, size: parsedSize })));
                    }
                  }
                }
              }
            }
          }
          if (showTableInput) {
            {
              pinescript.table.cell(_infoTable, 0, 0, "Detected Cycles", ({ text_color: pinescript.color.white, text_size: pinescript.size.small }));
              table.merge_cells(_infoTable, 0, 0, 1, 0);
              for (let i = 0; i <= (numSinesInput - 1); i++) {
                {
                  const p_str = ((i < pinescript.arraySize(best_periods)) ? pinescript.strToString(pinescript.arrayGet(best_periods, i), "#.#") : "-");
                  pinescript.table.cell(_infoTable, 0, (i + 1), ("Period " + pinescript.strToString((i + 1))), ({ text_color: pinescript.color.hex("#808080"), text_halign: pinescript.text.align_left }));
                  pinescript.table.cell(_infoTable, 1, (i + 1), p_str, ({ text_color: pinescript.color.white, text_halign: pinescript.text.align_right }));
                }
              }
            }
          }
        }
      }
    }
  }
}


// Export for use

export { main
};
