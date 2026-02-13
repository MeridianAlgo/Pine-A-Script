/**
 * PineScript Built-in Functions - JavaScript implementations
 */

export const builtins = new Map([
  // Moving Averages
  ['sma', function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    return slice.reduce((a, b) => a + b, 0) / length;
  }],

  ['ema', function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < 1) return null;
    const alpha = 2 / (length + 1);
    let result = series[0];
    for (let i = 1; i < series.length; i++) {
      result = alpha * series[i] + (1 - alpha) * result;
    }
    return result;
  }],

  ['wma', function(series, length) {
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
  }],

  ['vwma', function(close, volume, length) {
    if (!close || close.length < length) return null;
    let sum = 0;
    let volSum = 0;
    for (let i = length - 1; i >= 0; i--) {
      sum += close[close.length - 1 - i] * volume[volume.length - 1 - i];
      volSum += volume[volume.length - 1 - i];
    }
    return volSum > 0 ? sum / volSum : null;
  }],

  ['rma', function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < 1) return null;
    const alpha = 1 / length;
    let result = series[0];
    for (let i = 1; i < series.length; i++) {
      result = alpha * series[i] + (1 - alpha) * result;
    }
    return result;
  }],

  ['hma', function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < length) return null;
    const halfLength = Math.floor(length / 2);
    const wma1 = builtins.get('wma')(series, halfLength);
    const wma2 = builtins.get('wma')(series, length);
    const diff = wma2 - wma1;
    return builtins.get('wma')([diff, diff], Math.floor(Math.sqrt(length)));
  }],

  ['alma', function(series, length, offset = 0.85, sigma = 6) {
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
  }],

  // Volatility
  ['atr', function(high, low, close, length = 14) {
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
  }],

  ['bb', function(source, length, mult = 2) {
    if (!source || source.length < length) return null;
    const sma = builtins.get('sma')(source, length);
    const slice = source.slice(-length);
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / length;
    const stdDev = Math.sqrt(variance);
    return { middle: sma, upper: sma + mult * stdDev, lower: sma - mult * stdDev };
  }],

  ['kc', function(high, low, close, length = 20, mult = 2) {
    if (!high || high.length < length) return null;
    const typicalPrice = high.map((h, i) => (h + low[i] + close[i]) / 3);
    const sma = builtins.get('sma')(typicalPrice, length);
    const atr = builtins.get('atr')(high, low, close, length);
    return { middle: sma, upper: sma + mult * atr, lower: sma - mult * atr };
  }],

  // Oscillators
  ['rsi', function(close, length = 14) {
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
  }],

  ['roc', function(series, length = 9) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < length + 1) return null;
    const prev = series[series.length - 1 - length];
    const curr = series[series.length - 1];
    if (prev === 0 || prev === null || prev === undefined) return null;
    return ((curr - prev) / prev) * 100;
  }],

  ['percentrank', function(series, length = 100) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (series.length < 1) return null;
    const slice = series.slice(-length);
    const last = slice[slice.length - 1];
    const sorted = [...slice].sort((a, b) => a - b);
    let idx = sorted.findIndex(v => v >= last);
    if (idx < 0) idx = sorted.length - 1;
    if (sorted.length <= 1) return 0;
    return (idx / (sorted.length - 1)) * 100;
  }],

  ['stoch', function(high, low, close, kLength = 14, dLength = 3, smoothK = 3) {
    if (!high || high.length < kLength) return null;
    const highestHigh = Math.max(...high.slice(-kLength));
    const lowestLow = Math.min(...low.slice(-kLength));
    const range = highestHigh - lowestLow;
    if (range === 0) return { k: 50, d: 50 };
    const rawK = ((close[close.length - 1] - lowestLow) / range) * 100;
    return { k: rawK, d: builtins.get('sma')([rawK], smoothK) };
  }],

  ['macd', function(close, fastLen = 12, slowLen = 26, signalLen = 9) {
    if (!close || close.length < slowLen + signalLen) return null;
    const fastEMA = builtins.get('ema')(close, fastLen);
    const slowEMA = builtins.get('ema')(close, slowLen);
    const macdLine = fastEMA - slowEMA;
    const signalLine = builtins.get('ema')([macdLine], signalLen);
    const histogram = macdLine - signalLine;
    return { macd: macdLine, signal: signalLine, histogram: histogram };
  }],

  ['cci', function(a, b, c, d) {
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
  }],

  ['change', function(series) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (series.length < 2) return null;
    return series[series.length - 1] - series[series.length - 2];
  }],

  ['mfi', function(high, low, close, volume, length = 14) {
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
  }],

  // Volume
  ['obv', function(close, volume) {
    if (!close || close.length < 2) return null;
    let result = 0;
    for (let i = 1; i < close.length; i++) {
      if (close[i] > close[i - 1]) result += volume[i];
      else if (close[i] < close[i - 1]) result -= volume[i];
    }
    return result;
  }],

  ['ad', function(high, low, close, volume) {
    if (!high || high.length < 1) return null;
    let result = 0;
    for (let i = 0; i < high.length; i++) {
      const mf = ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) * volume[i];
      result += mf;
    }
    return result;
  }],

  ['adosc', function(high, low, close, volume, fastLen = 3, slowLen = 10) {
    if (!high || high.length < slowLen) return null;
    const ad = builtins.get('ad')(high, low, close, volume);
    const fastEMA = builtins.get('ema')(ad, fastLen);
    const slowEMA = builtins.get('ema')(ad, slowLen);
    return fastEMA - slowEMA;
  }],

  ['cmf', function(high, low, close, volume, length = 20) {
    if (!high || high.length < length) return null;
    let sum = 0;
    let volSum = 0;
    for (let i = high.length - length; i < high.length; i++) {
      const mfv = ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) * volume[i];
      sum += mfv;
      volSum += volume[i];
    }
    return volSum > 0 ? sum / volSum : 0;
  }],

  ['vwap', function(high, low, close, volume) {
    if (!high || high.length < 1) return null;
    let priceVolSum = 0;
    let volSum = 0;
    for (let i = 0; i < high.length; i++) {
      const tp = (high[i] + low[i] + close[i]) / 3;
      priceVolSum += tp * volume[i];
      volSum += volume[i];
    }
    return volSum > 0 ? priceVolSum / volSum : null;
  }],

  // Statistical
  ['linreg', function(source, length, offset = 0) {
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
  }],

  ['correlation', function(source1, source2, length) {
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
  }],

  ['variance', function(source, length) {
    if (!source || source.length < length) return null;
    const slice = source.slice(-length);
    const mean = slice.reduce((a, b) => a + b, 0) / length;
    return slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / length;
  }],

  ['stdev', function(source, length) {
    return Math.sqrt(builtins.get('variance')(source, length));
  }],

  // Price Functions
  ['hl2', function(high, low) {
    return high && low ? (high[high.length - 1] + low[low.length - 1]) / 2 : null;
  }],

  ['hlc3', function(high, low, close) {
    return high && low && close ? (high[high.length - 1] + low[low.length - 1] + close[close.length - 1]) / 3 : null;
  }],

  ['ohlc4', function(open, high, low, close) {
    return open && high && low && close ? (open[open.length - 1] + high[high.length - 1] + low[low.length - 1] + close[close.length - 1]) / 4 : null;
  }],

  // Utility Functions
  ['avg', function(...args) {
    return args.reduce((a, b) => a + b, 0) / args.length;
  }],

  ['max', function(...args) {
    return Math.max(...args.filter(v => v !== null && v !== undefined));
  }],

  ['min', function(...args) {
    return Math.min(...args.filter(v => v !== null && v !== undefined));
  }],

  ['abs', function(value) {
    return Math.abs(value);
  }],

  ['sqrt', function(value) {
    return Math.sqrt(value);
  }],

  ['pow', function(base, exp) {
    return Math.pow(base, exp);
  }],

  ['exp', function(value) {
    return Math.exp(value);
  }],

  ['log', function(value) {
    return Math.log(value);
  }],

  ['log10', function(value) {
    return Math.log10(value);
  }],

  ['sin', function(value) {
    return Math.sin(value);
  }],

  ['cos', function(value) {
    return Math.cos(value);
  }],

  ['tan', function(value) {
    return Math.tan(value);
  }],

  ['asin', function(value) {
    return Math.asin(value);
  }],

  ['acos', function(value) {
    return Math.acos(value);
  }],

  ['atan', function(value) {
    return Math.atan(value);
  }],

  ['floor', function(value) {
    return Math.floor(value);
  }],

  ['ceil', function(value) {
    return Math.ceil(value);
  }],

  ['round', function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }],

  ['cum', function(series) {
    if (!series) return null;
    return series.reduce((sum, val) => sum + val, 0);
  }],

  ['sum', function(series, length) {
    if (!series || series.length < length) return null;
    return series.slice(-length).reduce((a, b) => a + b, 0);
  }],

  ['highest', function(series, length) {
    if (!series || series.length < length) return null;
    return Math.max(...series.slice(-length));
  }],

  ['lowest', function(series, length) {
    if (!series || series.length < length) return null;
    return Math.min(...series.slice(-length));
  }],

  ['highestbars', function(series, length) {
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    const maxVal = Math.max(...slice);
    return length - 1 - slice.indexOf(maxVal);
  }],

  ['lowestbars', function(series, length) {
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    const minVal = Math.min(...slice);
    return length - 1 - slice.indexOf(minVal);
  }],

  ['rising', function(series, length) {
    if (!series || series.length < length) return false;
    for (let i = series.length - length; i < series.length - 1; i++) {
      if (series[i] >= series[i + 1]) return false;
    }
    return true;
  }],

  ['falling', function(series, length) {
    if (!series || series.length < length) return false;
    for (let i = series.length - length; i < series.length - 1; i++) {
      if (series[i] <= series[i + 1]) return false;
    }
    return true;
  }],

  ['cross', function(series1, series2) {
    if (series1 === null || series1 === undefined) return false;
    if (series2 === null || series2 === undefined) return false;
    if (!Array.isArray(series1)) series1 = [series1];
    if (!Array.isArray(series2)) series2 = [series2];
    if (series1.length < 2 || series2.length < 2) return false;
    const i = series1.length - 1;
    return (series1[i - 1] < series2[i - 1] && series1[i] >= series2[i]) ||
           (series1[i - 1] > series2[i - 1] && series1[i] <= series2[i]);
  }],

  ['offset', function(series, offset) {
    if (!Array.isArray(series)) return null;
    const idx = series.length - 1 - offset;
    return idx >= 0 ? series[idx] : null;
  }],

  ['valuewhen', function(condition, source, occurrence = 1) {
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
  }],

  ['barssince', function(condition) {
    if (condition === null || condition === undefined) return null;
    if (!Array.isArray(condition)) {
      return condition ? 0 : null;
    }
    for (let i = condition.length - 1; i >= 0; i--) {
      if (condition[i]) return condition.length - 1 - i;
    }
    return null;
  }],

  // Time Functions
  ['year', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getFullYear();
  }],

  ['month', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getMonth() + 1;
  }],

  ['weekofyear', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay();
    d.setUTCDate(d.getUTCDate() + 4 - (dayNum || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }],

  ['dayofmonth', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getDate();
  }],

  ['hour', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getHours();
  }],

  ['minute', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getMinutes();
  }],

  ['second', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getSeconds();
  }],

  ['timestamp', function(year, month, day, hour = 0, minute = 0, second = 0) {
    return Date.UTC(year, month - 1, day, hour, minute, second);
  }],

  // Type Conversion
  ['na', function(value) {
    return value === null || value === undefined || (typeof value === 'number' && isNaN(value));
  }],

  ['nz', function(value, replacement = 0) {
    return value === null || value === undefined || isNaN(value) ? replacement : value;
  }],

  ['isna', function(value) {
    return value === null || value === undefined || isNaN(value);
  }],

  ['isempty', function(value) {
    return value === null || value === undefined || value === '';
  }],

  ['fixnan', function(value, replacement = 0) {
    return builtins.get('nz')(value, replacement);
  }],

  // Plotting Functions (stub implementations)
  ['plot', function(value, ...rest) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.plots.push({ value, args: rest });
    }
    return value;
  }],

  ['plotshape', function(condition, ...rest) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.plotshapes.push({ condition, args: rest });
    }
    return condition;
  }],

  ['indicator', function(title, shorttitle, overlay, opts) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.indicator = { title, shorttitle, overlay, opts };
    }
    return null;
  }],

  ['strategy', function(title, shorttitle, overlay, opts) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.strategy = { title, shorttitle, overlay, opts };
    }
    return null;
  }],

  ['alertcondition', function(condition, ...rest) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.alerts.push({ condition, args: rest });
    }
    return null;
  }],

  ['plotbar', function(open, high, low, close, title, color, editable, showLast) {
    return { open, high, low, close };
  }],

  ['plotcandle', function(open, high, low, close, title, color, wickColor, borderColor, editable, showLast) {
    return { open, high, low, close };
  }],

  ['hline', function(_price, _title, _opts) {
    return null;
  }],

  // Drawing/annotation (stubs)
  ['labelNew', function(...args) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.labels = globalThis.__pineRuntime.labels || [];
      globalThis.__pineRuntime.labels.push({ args });
    }
    return { args };
  }],

  ['bgcolor', function(color, title, editable, showLast) {
    return null;
  }],

  ['fill', function(series1, series2, color, title, editable) {
    return null;
  }],

  // Alert Functions
  ['alert', function(condition, message, frequency) {
    console.log('Alert:', condition ? message : 'Condition not met');
    return condition;
  }],

  // Strategy Functions
  ['strategyEntry', function(id, direction, qty, limit, stop, ocaName, ocaType, comment) {
    console.log(`Strategy Entry: ${id} ${direction}`);
    return true;
  }],

  ['strategyExit', function(id, fromEntry, qty, limit, stop, ocaName, comment) {
    console.log(`Strategy Exit: ${id}`);
    return true;
  }],

  ['strategyOrder', function(id, direction, qty, limit, stop, ocaName, ocaType, comment) {
    console.log(`Strategy Order: ${id} ${direction}`);
    return true;
  }],

  ['strategyClose', function(id, comment, qty, percent, immediately) {
    console.log(`Strategy Close: ${id}`);
    return true;
  }],

  ['strategyLong', function() {
    return 'long';
  }],

  ['strategyShort', function() {
    return 'short';
  }],

  ['chartPointFromIndex', function(_index, _price) {
    return { index: _index ?? null, price: _price ?? null };
  }],

  ['chartPointNew', function(_time, _price) {
    return { time: _time ?? null, price: _price ?? null };
  }],

  ['mapNew', function() {
    return new Map();
  }],

  ['mapSize', function(m) {
    return m instanceof Map ? m.size : 0;
  }],

  ['mapGet', function(m, key, defval) {
    if (!(m instanceof Map)) return defval ?? null;
    if (!m.has(key)) return defval ?? null;
    return m.get(key);
  }],

  ['mapSet', function(m, key, value) {
    if (!(m instanceof Map)) return null;
    m.set(key, value);
    return value;
  }],

  ['mapRemove', function(m, key) {
    if (!(m instanceof Map)) return false;
    return m.delete(key);
  }],

  ['mapKeys', function(m) {
    if (!(m instanceof Map)) return [];
    return Array.from(m.keys());
  }],

  ['mapValues', function(m) {
    if (!(m instanceof Map)) return [];
    return Array.from(m.values());
  }],

  ['mapContains', function(m, key) {
    if (!(m instanceof Map)) return false;
    return m.has(key);
  }],

  ['matrixNew', function(rows, cols, initialValue = 0) {
    const r = Math.max(0, rows ?? 0);
    const c = Math.max(0, cols ?? 0);
    const data = Array.from({ length: r }, () => Array.from({ length: c }, () => initialValue));
    return { rows: r, cols: c, data };
  }],

  ['matrixRows', function(m) {
    return m?.rows ?? 0;
  }],

  ['matrixCols', function(m) {
    return m?.cols ?? 0;
  }],

  ['matrixGet', function(m, row, col) {
    if (!m || !Array.isArray(m.data)) return null;
    return m.data?.[row]?.[col] ?? null;
  }],

  ['matrixSet', function(m, row, col, value) {
    if (!m || !Array.isArray(m.data)) return null;
    if (!Array.isArray(m.data[row])) return null;
    m.data[row][col] = value;
    return value;
  }],

  ['matrixFill', function(m, value) {
    if (!m || !Array.isArray(m.data)) return null;
    for (let r = 0; r < (m.rows ?? 0); r++) {
      for (let c = 0; c < (m.cols ?? 0); c++) {
        if (m.data[r]) m.data[r][c] = value;
      }
    }
    return m;
  }],

  ['matrixSum', function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    let s = 0;
    for (let r = 0; r < (m.rows ?? 0); r++) {
      for (let c = 0; c < (m.cols ?? 0); c++) {
        const v = m.data?.[r]?.[c];
        if (typeof v === 'number' && !Number.isNaN(v)) s += v;
      }
    }
    return s;
  }],

  ['matrixAvg', function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    const n = (m.rows ?? 0) * (m.cols ?? 0);
    if (n === 0) return null;
    const s = builtins.get('matrixSum')(m);
    return (typeof s === 'number') ? (s / n) : null;
  }],

  ['matrixMin', function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    let out = null;
    for (let r = 0; r < (m.rows ?? 0); r++) {
      for (let c = 0; c < (m.cols ?? 0); c++) {
        const v = m.data?.[r]?.[c];
        if (typeof v !== 'number' || Number.isNaN(v)) continue;
        out = (out === null) ? v : Math.min(out, v);
      }
    }
    return out;
  }],

  ['matrixMax', function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    let out = null;
    for (let r = 0; r < (m.rows ?? 0); r++) {
      for (let c = 0; c < (m.cols ?? 0); c++) {
        const v = m.data?.[r]?.[c];
        if (typeof v !== 'number' || Number.isNaN(v)) continue;
        out = (out === null) ? v : Math.max(out, v);
      }
    }
    return out;
  }],

  ['matrixTranspose', function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    const r = m.rows ?? 0;
    const c = m.cols ?? 0;
    const out = builtins.get('matrixNew')(c, r, 0);
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        out.data[j][i] = m.data?.[i]?.[j] ?? 0;
      }
    }
    return out;
  }],

  ['matrixMult', function(a, b) {
    if (!a || !b || !Array.isArray(a.data) || !Array.isArray(b.data)) return null;
    const aRows = a.rows ?? 0;
    const aCols = a.cols ?? 0;
    const bRows = b.rows ?? 0;
    const bCols = b.cols ?? 0;
    if (aCols !== bRows) return null;
    const out = builtins.get('matrixNew')(aRows, bCols, 0);
    for (let i = 0; i < aRows; i++) {
      for (let j = 0; j < bCols; j++) {
        let s = 0;
        for (let k = 0; k < aCols; k++) {
          const av = a.data?.[i]?.[k] ?? 0;
          const bv = b.data?.[k]?.[j] ?? 0;
          s += av * bv;
        }
        out.data[i][j] = s;
      }
    }
    return out;
  }],

  ['matrixInv', function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    const r = m.rows ?? 0;
    const c = m.cols ?? 0;
    if (r !== c) return null;
    if (r === 2) {
      const a = m.data?.[0]?.[0] ?? 0;
      const b = m.data?.[0]?.[1] ?? 0;
      const d = m.data?.[1]?.[0] ?? 0;
      const e = m.data?.[1]?.[1] ?? 0;
      const det = (a * e) - (b * d);
      if (det === 0) return null;
      const out = builtins.get('matrixNew')(2, 2, 0);
      out.data[0][0] = e / det;
      out.data[0][1] = -b / det;
      out.data[1][0] = -d / det;
      out.data[1][1] = a / det;
      return out;
    }
    return null;
  }],

  // Security / Data Functions
  ['requestSecurity', function(symbol, timeframe, expression) {
    return expression;
  }],

  // Array Functions
  ['arrayNew', function(initialSize = 0, initialValue = 0) {
    return Array(initialSize).fill(initialValue);
  }],

  ['arraySize', function(arr) {
    return arr ? arr.length : 0;
  }],

  ['arrayGet', function(arr, index) {
    return arr && arr[index] !== undefined ? arr[index] : null;
  }],

  ['arraySet', function(arr, index, value) {
    if (arr) arr[index] = value;
    return value;
  }],

  ['arrayPush', function(arr, value) {
    if (arr) arr.push(value);
    return value;
  }],

  ['arrayPop', function(arr) {
    return arr ? arr.pop() : null;
  }],

  ['arrayShift', function(arr) {
    return arr ? arr.shift() : null;
  }],

  ['arrayUnshift', function(arr, value) {
    if (arr) arr.unshift(value);
    return value;
  }],

  ['arrayClear', function(arr) {
    if (arr) arr.length = 0;
    return null;
  }],

  ['arraySort', function(arr, order = 'ascending') {
    if (arr) arr.sort((a, b) => order === 'ascending' ? a - b : b - a);
    return arr;
  }],

  ['arrayReverse', function(arr) {
    if (arr) arr.reverse();
    return arr;
  }],

  ['arrayContains', function(arr, value) {
    return arr ? arr.includes(value) : false;
  }],

  ['arrayIndexOf', function(arr, value) {
    return arr ? arr.indexOf(value) : -1;
  }],

  ['arraySum', function(arr) {
    return arr ? arr.reduce((a, b) => a + b, 0) : 0;
  }],

  ['arrayAvg', function(arr) {
    return arr && arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }],

  ['arrayMin', function(arr) {
    return arr && arr.length > 0 ? Math.min(...arr) : null;
  }],

  ['arrayMax', function(arr) {
    return arr && arr.length > 0 ? Math.max(...arr) : null;
  }],

  // String Functions
  ['strLength', function(str) {
    return str ? str.length : 0;
  }],

  ['strSubstring', function(str, from, to) {
    return str ? str.substring(from, to) : '';
  }],

  ['strConcat', function(...args) {
    return args.join('');
  }],

  ['strContains', function(str, substring) {
    return str ? str.includes(substring) : false;
  }],

  ['strStartsWith', function(str, prefix) {
    return str ? str.startsWith(prefix) : false;
  }],

  ['strEndsWith', function(str, suffix) {
    return str ? str.endsWith(suffix) : false;
  }],

  ['strReplace', function(str, from, to) {
    return str ? str.replace(from, to) : '';
  }],

  ['strReplaceAll', function(str, from, to) {
    return str ? str.split(from).join(to) : '';
  }],

  ['strLower', function(str) {
    return str ? str.toLowerCase() : '';
  }],

  ['strUpper', function(str) {
    return str ? str.toUpperCase() : '';
  }],

  ['strToNumber', function(str) {
    return str ? parseFloat(str) : 0;
  }],

  ['strToString', function(value) {
    return String(value);
  }],

  ['strSplit', function(str, delimiter) {
    return str ? str.split(delimiter) : [];
  }],

  ['strMatch', function(str, regex) {
    const match = str.match(new RegExp(regex));
    return match ? match[0] : '';
  }],

  ['strPos', function(str, substring) {
    return str ? str.indexOf(substring) : -1;
  }],

  ['strRPos', function(str, substring) {
    return str ? str.lastIndexOf(substring) : -1;
  }],

  ['strRemove', function(str, from, to) {
    return str ? str.substring(0, from) + str.substring(to) : '';
  }],

  ['strReverse', function(str) {
    return str ? str.split('').reverse().join('') : '';
  }],

  // Math Constants
  ['pi', Math.PI],
  ['e', Math.E],
  ['true', true],
  ['false', false],
  ['ticker', 'AAPL'],
  ['tickerid', 'NASDAQ:AAPL'],
  ['syminfo', function(type) {
    const info = { ticker: 'AAPL', tickerid: 'NASDAQ:AAPL', prefix: 'NASDAQ', root: 'AAPL', suffix: '' };
    return info[type] || '';
  }],
  ['time', Date.now()],
  ['timenow', Date.now()],
  ['barstate', 'LAST'],
  ['dividends', {}],
  ['splits', {}],
  ['earnings', {}],
  ['volume', 0],
  ['open', 0],
  ['high', 0],
  ['low', 0],
  ['close', 0],
  ['pivothigh', function(_leftBars, _rightBars) {
    return null;
  }],
  ['pivotlow', function(_leftBars, _rightBars) {
    return null;
  }],
  ['tr', function(high, low, close) {
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
  }],
]);

export default builtins;
