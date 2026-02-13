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
  na: null,
  true: true,
  false: false,
  ticker: "AAPL",
  tickerid: "NASDAQ:AAPL",
  syminfo: function(type) {
    const info = { ticker: 'AAPL', tickerid: 'NASDAQ:AAPL', prefix: 'NASDAQ', root: 'AAPL', suffix: '' };
    return info[type] || '';
  },
  time: 1770941747401,
  timenow: 1770941747401,
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

  pinescript.indicator("ZenAlgo – ABC", ({ overlay: true, max_lines_count: 500, max_labels_count: 500, max_boxes_count: 200, max_bars_back: 5000 }));
  let bullC = pinescript.color.rgb(63, 192, 220);
  let bearC = pinescript.color.rgb(97, 15, 220);
  let useManual = input.bool(false, "Use Manual Anchors?");
  let timeX = input.time(pinescript.timestamp("2025-01-01 02:00"), "X: Time", ({ confirm: false }));
  let timeA = input.time(pinescript.timestamp("2025-01-01 12:00"), "A: Time", ({ confirm: false }));
  let timeB = input.time(pinescript.timestamp("2025-01-01 23:59"), "B: Time", ({ confirm: false }));
  let Xi_m = null;
  let X_m = null;
  let X_high_m = null;
  let X_low_m = null;
  let Ai_m = null;
  let A_m = null;
  let A_high_m = null;
  let A_low_m = null;
  let Bi_m = null;
  let B_m = null;
  let B_high_m = null;
  let B_low_m = null;
  let adjustedXA = false;
  let adjustedB = false;
  if (useManual) {
    {
      if ((null(Xi_m) && (time >= timeX))) {
        {
          Xi_m = bar_index;
          X_m = close;
          X_high_m = high;
          X_low_m = low;
          adjustedXA = false;
        }
      }
      if ((null(Ai_m) && (time >= timeA))) {
        {
          Ai_m = bar_index;
          A_m = close;
          A_high_m = high;
          A_low_m = low;
          adjustedXA = false;
        }
      }
      if ((null(Bi_m) && (time >= timeB))) {
        {
          Bi_m = bar_index;
          B_m = close;
          B_high_m = high;
          B_low_m = low;
          adjustedB = false;
        }
      }
      if (((!null(X_m) && !null(A_m)) && !adjustedXA)) {
        {
          adjustedXA = true;
          if ((A_m > X_m)) {
            {
              X_m = X_low_m;
              A_m = A_high_m;
            }
          } else {
            {
              X_m = X_high_m;
              A_m = A_low_m;
            }
          }
        }
      }
      if (((!null(B_m) && adjustedXA) && !adjustedB)) {
        {
          adjustedB = true;
          if ((A_m > X_m)) {
            {
              B_m = B_low_m;
            }
          } else {
            {
              B_m = B_high_m;
            }
          }
        }
      }
    }
  }
  let leftBars = 6;
  let rightBars = 3;
  let X = null;
  let A = null;
  let B = null;
  let Xi = null;
  let Ai = null;
  let Bi = null;
  let lastType = 0;
  let minBarsForPivot = (leftBars + rightBars);
  let ph = ta.pivothigh(leftBars, rightBars);
  if ((((bar_index >= minBarsForPivot) && !null(ph)) && (lastType !== 1))) {
    {
      X = A;
      Xi = Ai;
      A = B;
      Ai = Bi;
      B = ph;
      Bi = (bar_index - rightBars);
      lastType = 1;
    }
  }
  let pl = ta.pivotlow(leftBars, rightBars);
  if ((((bar_index >= minBarsForPivot) && !null(pl)) && (lastType !== -1))) {
    {
      X = A;
      Xi = Ai;
      A = B;
      Ai = Bi;
      B = pl;
      Bi = (bar_index - rightBars);
      lastType = -1;
    }
  }
  function getXAB() {
    const _X = null;
    const _A = null;
    const _B = null;
    const _Xi = null;
    const _Ai = null;
    const _Bi = null;
    if (useManual) {
      {
        if (((null(Xi_m) || null(Ai_m)) || null(Bi_m))) {
          {
            _X = X;
            _A = A;
            _B = B;
            _Xi = Xi;
            _Ai = Ai;
            _Bi = Bi;
          }
        } else {
          {
            _X = X_m;
            _A = A_m;
            _B = B_m;
            _Xi = Xi_m;
            _Ai = Ai_m;
            _Bi = Bi_m;
          }
        }
      }
    } else {
      {
        _X = X;
        _A = A;
        _B = B;
        _Xi = Xi;
        _Ai = Ai;
        _Bi = Bi;
      }
    }
    return [_X, _A, _B, _Xi, _Ai, _Bi];
  }
  let [Xuse, Ause, Buse, Xidx, Aidx, Bidx] = getXAB();
  let haveAll = ((!null(Xuse) && !null(Ause)) && !null(Buse));
  let isBull = (haveAll && (Ause > Xuse));
  let baseLen = (haveAll ? pinescript.abs((Ause - Xuse)) : null);
  function projY(level) {
    (isBull ? (Buse + ((Ause - Xuse) * level)) : (Buse - ((Xuse - Ause) * level)));
    return undefined;
  }
  let showLabelsAsNames = input.bool(true, "Show Names (TP1/Target) instead of numeric", ({ group: "Display" }));
  let extendRightBars = input.int(5, "Extend to Right (bars)", ({ group: "Display" }));
  let showGoldenPocket = input.bool(true, "Show Golden Pocket (0.618–0.65)", ({ group: "Zones" }));
  let showTargetZone = input.bool(true, "Show C Zone (1.0–1.272)", ({ group: "Zones" }));
  let showBeyond = input.bool(true, "Show Extended Levels (1.618–3.618)", ({ group: "Zones" }));
  let show0 = input.bool(true, "Show 0.0", ({ inline: "fib0", group: "Fib Levels" }));
  let fib0 = input.float(0, "", ({ inline: "fib0", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col0 = input.color(pinescript.color.new(pinescript.color.white, 30), "", ({ inline: "fib0", group: "Fib Levels" }));
  let show146 = input.bool(true, "Show 0.146", ({ inline: "fib146", group: "Fib Levels" }));
  let fib146 = input.float(0.146, "", ({ inline: "fib146", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col146 = input.color(pinescript.color.new(bullC, 30), "", ({ inline: "fib146", group: "Fib Levels" }));
  let show236 = input.bool(true, "Show 0.236", ({ inline: "fib236", group: "Fib Levels" }));
  let fib236 = input.float(0.236, "", ({ inline: "fib236", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col236 = input.color(pinescript.color.new(bullC, 20), "", ({ inline: "fib236", group: "Fib Levels" }));
  let show382 = input.bool(true, "Show 0.382", ({ inline: "fib382", group: "Fib Levels" }));
  let fib382 = input.float(0.382, "", ({ inline: "fib382", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col382 = input.color(pinescript.color.new(bullC, 15), "", ({ inline: "fib382", group: "Fib Levels" }));
  let show5 = input.bool(true, "Show 0.5", ({ inline: "fib5", group: "Fib Levels" }));
  let fib5 = input.float(0.5, "", ({ inline: "fib5", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col5 = input.color(pinescript.color.new(bullC, 15), "", ({ inline: "fib5", group: "Fib Levels" }));
  let show618 = input.bool(true, "Show 0.618", ({ inline: "fib618", group: "Fib Levels" }));
  let fib618 = input.float(0.618, "", ({ inline: "fib618", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col618 = input.color(pinescript.color.new(pinescript.color.yellow, 20), "", ({ inline: "fib618", group: "Fib Levels" }));
  let show65 = input.bool(true, "Show 0.65", ({ inline: "fib65", group: "Fib Levels" }));
  let fib65 = input.float(0.65, "", ({ inline: "fib65", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col65 = input.color(pinescript.color.new(pinescript.color.yellow, 20), "", ({ inline: "fib65", group: "Fib Levels" }));
  let show786 = input.bool(true, "Show 0.786", ({ inline: "fib786", group: "Fib Levels" }));
  let fib786 = input.float(0.786, "", ({ inline: "fib786", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col786 = input.color(pinescript.color.new(bullC, 25), "", ({ inline: "fib786", group: "Fib Levels" }));
  let show1 = input.bool(true, "Show 1.0", ({ inline: "fib1", group: "Fib Levels" }));
  let fib1 = input.float(1, "", ({ inline: "fib1", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col1 = input.color(pinescript.color.new(pinescript.color.white, 30), "", ({ inline: "fib1", group: "Fib Levels" }));
  let show1272 = input.bool(true, "Show 1.272", ({ inline: "fib1272", group: "Fib Levels" }));
  let fib1272 = input.float(1.272, "", ({ inline: "fib1272", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col1272 = input.color(pinescript.color.new(bullC, 0), "", ({ inline: "fib1272", group: "Fib Levels" }));
  let show1618 = input.bool(true, "Show 1.618", ({ inline: "fib1618", group: "Fib Levels" }));
  let fib1618 = input.float(1.618, "", ({ inline: "fib1618", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col1618 = input.color(pinescript.color.new(bullC, 0), "", ({ inline: "fib1618", group: "Fib Levels" }));
  let show2 = input.bool(true, "Show 2.0", ({ inline: "fib2", group: "Fib Levels" }));
  let fib2 = input.float(2, "", ({ inline: "fib2", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col2 = input.color(pinescript.color.new(bullC, 10), "", ({ inline: "fib2", group: "Fib Levels" }));
  let show2618 = input.bool(true, "Show 2.618", ({ inline: "fib2618", group: "Fib Levels" }));
  let fib2618 = input.float(2.618, "", ({ inline: "fib2618", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col2618 = input.color(pinescript.color.new(bullC, 15), "", ({ inline: "fib2618", group: "Fib Levels" }));
  let show3618 = input.bool(true, "Show 3.618", ({ inline: "fib3618", group: "Fib Levels" }));
  let fib3618 = input.float(3.618, "", ({ inline: "fib3618", minval: 0, step: 0.001, group: "Fib Levels" }));
  let col3618 = input.color(pinescript.color.new(bullC, 20), "", ({ inline: "fib3618", group: "Fib Levels" }));
  let names = array.from("BASE", "ENTRY", "TP1", "TP2", "TP3", "TP4", "", "TP5", "Target", "TP6", "Continual", "x2", "x2.618", "x3.618");
  let fibLines = array.new_line();
  let fibLabs = array.new_label();
  let fibBoxes = array.new_box();
  function clrAll() {
    if ((pinescript.arraySize(fibLines) > 0)) {
      {
        for (let i = 0; i <= (pinescript.arraySize(fibLines) - 1); i++) {
          {
            pinescript.lineDelete(pinescript.arrayGet(fibLines, i));
          }
        }
      }
    }
    if ((pinescript.arraySize(fibLabs) > 0)) {
      {
        for (let i = 0; i <= (pinescript.arraySize(fibLabs) - 1); i++) {
          {
            pinescript.labelDelete(pinescript.arrayGet(fibLabs, i));
          }
        }
      }
    }
    if ((pinescript.arraySize(fibBoxes) > 0)) {
      {
        for (let i = 0; i <= (pinescript.arraySize(fibBoxes) - 1); i++) {
          {
            box.delete(pinescript.arrayGet(fibBoxes, i));
          }
        }
      }
    }
    pinescript.arrayClear(fibLines);
    pinescript.arrayClear(fibLabs);
    return pinescript.arrayClear(fibBoxes);
  }
  function drawLine(x1, y, x2, col) {
    return pinescript.arrayPush(fibLines, pinescript.lineNew(x1, y, x2, y, ({ color: pinescript.color.new(col, 75), width: 1 })));
  }
  function drawLabel(x, y, txt, col, style) {
    return pinescript.arrayPush(fibLabs, pinescript.labelNew(x, y, ({ text: txt, textcolor: col, color: pinescript.color.hex("#00000000"), style: style, size: pinescript.size.small })));
  }
  function drawBox(x1, top, x2, bottom, col, trans = 95) {
    return pinescript.arrayPush(fibBoxes, box.new(x1, top, x2, bottom, ({ xloc: xloc.bar_index, bgcolor: pinescript.color.new(col, trans), border_color: pinescript.color.new(col, 100) })));
  }
  if (((barstate.islast && haveAll) && !null(baseLen))) {
    {
      clrAll();
      let colMain = (isBull ? bullC : bearC);
      pinescript.lineNew(Xidx, Xuse, Aidx, Ause, ({ color: pinescript.color.new(colMain, 40), style: line.style_dashed }));
      pinescript.lineNew(Aidx, Ause, Bidx, Buse, ({ color: pinescript.color.new(colMain, 40), style: line.style_dashed }));
      let labelStyleX = (isBull ? label.style_label_up : label.style_label_down);
      let labelStyleA = (isBull ? label.style_label_down : label.style_label_up);
      let labelStyleB = (isBull ? label.style_label_up : label.style_label_down);
      drawLabel(Xidx, Xuse, "X", colMain, labelStyleX);
      drawLabel(Aidx, Ause, "A", colMain, labelStyleA);
      drawLabel(Bidx, Buse, "B", colMain, labelStyleB);
      let lvls = array.from(fib0, fib146, fib236, fib382, fib5, fib618, fib65, fib786, fib1, fib1272, fib1618, fib2, fib2618, fib3618);
      let cols = array.from(col0, col146, col236, col382, col5, col618, col65, col786, col1, col1272, col1618, col2, col2618, col3618);
      let shows = array.from(show0, show146, show236, show382, show5, show618, show65, show786, show1, show1272, show1618, show2, show2618, show3618);
      for (let i = 0; i <= (pinescript.arraySize(lvls) - 1); i++) {
        {
          if (pinescript.arrayGet(shows, i)) {
            {
              let lv = pinescript.arrayGet(lvls, i);
              let colNow = pinescript.arrayGet(cols, i);
              let nameNow = pinescript.arrayGet(names, i);
              let y = projY(lv);
              let x1 = Bidx;
              let x2 = (bar_index + extendRightBars);
              drawLine(x1, y, x2, colNow);
              const txt = "";
              if (showLabelsAsNames) {
                {
                  txt = (((nameNow + " (") + pinescript.strToString(lv)) + ")");
                }
              } else {
                {
                  txt = (((pinescript.strToString(lv) + " (") + pinescript.strToString(y)) + ")");
                }
              }
              drawLabel(x2, y, txt, colNow, label.style_label_left);
            }
          }
        }
      }
      if (showGoldenPocket) {
        {
          let y1 = projY(fib618);
          let y2 = projY(fib65);
          x1 = Bidx;
          x2 = (bar_index + extendRightBars);
          drawBox(x1, pinescript.max(y1, y2), x2, pinescript.min(y1, y2), pinescript.color.rgb(253, 255, 122), 95);
        }
      }
      if (showTargetZone) {
        {
          y1 = projY(fib1);
          y2 = projY(fib1272);
          x1 = Bidx;
          x2 = (bar_index + extendRightBars);
          drawBox(x1, pinescript.max(y1, y2), x2, pinescript.min(y1, y2), colMain, 80);
        }
      }
      if (showBeyond) {
        {
          let y3 = projY(fib1618);
          let y4 = projY(fib3618);
          x1 = Bidx;
          x2 = (bar_index + extendRightBars);
          drawBox(x1, pinescript.max(y3, y4), x2, pinescript.min(y3, y4), colMain, 80);
        }
      }
    }
  }
}


// Export for use

export { main
};
