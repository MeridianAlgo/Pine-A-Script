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
  percentrank: function(series, length = 100) {
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
  na: function(value) {
    return value === null || value === undefined || (typeof value === 'number' && isNaN(value));
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
  plot: function(series, title = '', color = null, linewidth = 1) {
    globalThis.__pineRuntime.plots.push({
      series,
      title,
      color,
      linewidth
    });
    return series;
  },
  lineNew: function(x1, y1, x2, y2, opts = {}) {
    return { x1, y1, x2, y2, opts, _type: 'line' };
  },
  lineDelete: function(l) {
    return null;
  },
  labelNew: function(...args) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.labels = globalThis.__pineRuntime.labels || [];
      globalThis.__pineRuntime.labels.push({ args });
    }
    return { args };
  },
  labelDelete: function(l) {
    return null;
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
  strategyClose: function(id, comment, qty, percent, immediately) {
    console.log(`Strategy Close: ${id}`);
    return true;
  },
  strategyLong: function() {
    return 'long';
  },
  strategyShort: function() {
    return 'short';
  },
  chartPointFromIndex: function(_index, _price) {
    return { index: _index ?? null, price: _price ?? null };
  },
  chartPointNew: function(_time, _price) {
    return { time: _time ?? null, price: _price ?? null };
  },
  mapNew: function() {
    return new Map();
  },
  mapSize: function(m) {
    return m instanceof Map ? m.size : 0;
  },
  mapGet: function(m, key, defval) {
    if (!(m instanceof Map)) return defval ?? null;
    if (!m.has(key)) return defval ?? null;
    return m.get(key);
  },
  mapSet: function(m, key, value) {
    if (!(m instanceof Map)) return null;
    m.set(key, value);
    return value;
  },
  mapRemove: function(m, key) {
    if (!(m instanceof Map)) return false;
    return m.delete(key);
  },
  mapKeys: function(m) {
    if (!(m instanceof Map)) return [];
    return Array.from(m.keys());
  },
  mapValues: function(m) {
    if (!(m instanceof Map)) return [];
    return Array.from(m.values());
  },
  mapContains: function(m, key) {
    if (!(m instanceof Map)) return false;
    return m.has(key);
  },
  matrixNew: function(rows, cols, initialValue = 0) {
    const r = Math.max(0, rows ?? 0);
    const c = Math.max(0, cols ?? 0);
    const data = Array.from({ length: r }, () => Array.from({ length: c }, () => initialValue));
    return { rows: r, cols: c, data };
  },
  matrixRows: function(m) {
    return m?.rows ?? 0;
  },
  matrixCols: function(m) {
    return m?.cols ?? 0;
  },
  matrixGet: function(m, row, col) {
    if (!m || !Array.isArray(m.data)) return null;
    return m.data?.[row]?.[col] ?? null;
  },
  matrixSet: function(m, row, col, value) {
    if (!m || !Array.isArray(m.data)) return null;
    if (!Array.isArray(m.data[row])) return null;
    m.data[row][col] = value;
    return value;
  },
  matrixFill: function(m, value) {
    if (!m || !Array.isArray(m.data)) return null;
    for (let r = 0; r < (m.rows ?? 0); r++) {
      for (let c = 0; c < (m.cols ?? 0); c++) {
        if (m.data[r]) m.data[r][c] = value;
      }
    }
    return m;
  },
  matrixSum: function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    let s = 0;
    for (let r = 0; r < (m.rows ?? 0); r++) {
      for (let c = 0; c < (m.cols ?? 0); c++) {
        const v = m.data?.[r]?.[c];
        if (typeof v === 'number' && !Number.isNaN(v)) s += v;
      }
    }
    return s;
  },
  matrixAvg: function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    const n = (m.rows ?? 0) * (m.cols ?? 0);
    if (n === 0) return null;
    const s = builtins.get('matrixSum')(m);
    return (typeof s === 'number') ? (s / n) : null;
  },
  matrixMin: function(m) {
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
  },
  matrixMax: function(m) {
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
  },
  matrixTranspose: function(m) {
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
  },
  matrixMult: function(a, b) {
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
  },
  matrixInv: function(m) {
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
  arrayInsert: function(arr, index, value) {
    if (!arr) return value;
    const i = Math.max(0, Math.min(arr.length, Number(index) || 0));
    arr.splice(i, 0, value);
    return value;
  },
  arrayRemove: function(arr, index) {
    if (!arr) return null;
    const i = Number(index) || 0;
    if (i < 0 || i >= arr.length) return null;
    const removed = arr.splice(i, 1);
    return removed.length ? removed[0] : null;
  },
  arrayFill: function(arr, value, startIndex = 0, endIndex = null) {
    if (!arr) return arr;
    const start = Number(startIndex) || 0;
    const end = endIndex === null || endIndex === undefined ? arr.length : Number(endIndex) || 0;
    arr.fill(value, start, end);
    return arr;
  },
  arraySlice: function(arr, startIndex = 0, endIndex = null) {
    if (!arr) return [];
    const start = Number(startIndex) || 0;
    const end = endIndex === null || endIndex === undefined ? arr.length : Number(endIndex) || 0;
    return arr.slice(start, end);
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
  time: 1771178050970,
  timenow: 1771178050970,
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


pinescript.strategy.long = pinescript.strategyLong();

pinescript.strategy.short = pinescript.strategyShort();


globalThis.input = globalThis.input || {};

globalThis.input.timeframe = globalThis.input.timeframe || ((defval) => defval);


globalThis.array = globalThis.array || {

  from: (...items) => items,

  size: (arr) => pinescript.arraySize(arr),

  get: (arr, i) => pinescript.arrayGet(arr, i),

  set: (arr, i, v) => pinescript.arraySet(arr, i, v),

  push: (arr, v) => pinescript.arrayPush(arr, v),

  pop: (arr) => pinescript.arrayPop(arr),

  unshift: (arr, v) => pinescript.arrayUnshift(arr, v),

  shift: (arr) => pinescript.arrayShift(arr),

  clear: (arr) => pinescript.arrayClear(arr),

  remove: (arr, i) => pinescript.arrayRemove(arr, i),

};


globalThis.hline = globalThis.hline || { style_dotted: "style_dotted", style_solid: "style_solid" };


class SeriesArray extends Array {

  valueOf() { return this.length ? this[this.length - 1] : NaN; }

  toString() { return String(this.valueOf()); }

}

pinescript.asSeries = function(v) {

  if (v === null || v === undefined) return v;

  if (v instanceof SeriesArray) return v;

  if (Array.isArray(v)) return Object.setPrototypeOf(v, SeriesArray.prototype);

  return v;

};


globalThis.timeframe = globalThis.timeframe || { period: "D" };

pinescript._parseTimeframeMs = function(tf) {

  if (tf === null || tf === undefined) return null;

  const s = String(tf).trim().toUpperCase();

  if (/^\d+$/.test(s)) return parseInt(s, 10) * 60 * 1000;

  if (s.endsWith("S")) return parseInt(s.slice(0, -1), 10) * 1000;

  if (s.endsWith("H")) return parseInt(s.slice(0, -1), 10) * 60 * 60 * 1000;

  if (s === "D") return 24 * 60 * 60 * 1000;

  if (s === "W") return 7 * 24 * 60 * 60 * 1000;

  if (s === "M") return 30 * 24 * 60 * 60 * 1000;

  return null;

};


pinescript.requestSecurity = function(symbol, tf, series, opts) {

  const timeSeries = globalThis.time;

  if (!Array.isArray(timeSeries) || !Array.isArray(series)) return series;

  const ms = pinescript._parseTimeframeMs(tf);

  if (!ms) return series;

  const lookahead = opts?.lookahead ?? false;

  const gaps = opts?.gaps ?? false;

  const out = [];

  let bucket = null;

  let bucketVal = null;

  for (let i = 0; i < timeSeries.length; i++) {

    const t = timeSeries[i];

    const b = Math.floor(t / ms);

    if (bucket === null) { bucket = b; bucketVal = series[i]; }

    if (b !== bucket) { bucket = b; bucketVal = series[i]; } else { bucketVal = series[i]; }

    if (lookahead) out.push(bucketVal); else out.push(gaps ? null : bucketVal);

  }

  return pinescript.asSeries(out);

};


globalThis.request = globalThis.request || {

  security: function(symbol, tf, series, opts) { return pinescript.requestSecurity(symbol, tf, series, opts); },

  financial: function() { return null; }

};


globalThis.barmerge = globalThis.barmerge || {

  gaps_off: false,

  gaps_on: true,

  lookahead_off: false,

  lookahead_on: true,

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

  globalThis.__pineState = globalThis.__pineState || {};
  const state = globalThis.__pineState["main"] = globalThis.__pineState["main"] || {};
  open = pinescript.asSeries(globalThis.open);
  high = pinescript.asSeries(globalThis.high);
  low = pinescript.asSeries(globalThis.low);
  close = pinescript.asSeries(globalThis.close);
  volume = pinescript.asSeries(globalThis.volume);
  time = pinescript.asSeries(globalThis.time);
  null;
  // Study: Asset Drift Model
  // Options: {"shorttitle":"ADM","overlay":false,"max_bars_back":800}
  let HORIZON = 60;
  let SAMPLE_TOTAL = 756;
  let MIN_OBS_STRICT = 10;
  let MIN_OBS_ROBUST = 20;
  let T_CRIT_95 = 2;
  let T_CRIT_90 = 1.65;
  let MIN_DRIFT_ECON = 0.03;
  let MAX_DEV_SD = 1.5;
  let SIGN_Z_CRIT = 1.65;
  let ANN_FACTOR = (252 / HORIZON);
  let i_bgMode = input.string("On", "Background", ({ options: ["Off", "On"], group: "Display", tooltip: "Background color based on drift classification" }));
  let i_bgInt = input.int(75, "BG Intensity", ({ minval: 70, maxval: 95, group: "Display", tooltip: "Transparency of background color" }));
  let i_barColor = input.bool(true, "Bar Coloring", ({ group: "Display", tooltip: "Color bars based on drift direction" }));
  let i_showDash = input.bool(true, "Dashboard", ({ group: "Dashboard", tooltip: "Show statistical details panel" }));
  let i_dashPos = input.string("Top Right", "Position", ({ options: ["Top Right", "Top Left", "Bottom Right", "Bottom Left"], group: "Dashboard" }));
  let i_dashSize = input.string("Small", "Size", ({ options: ["Tiny", "Small", "Normal"], group: "Dashboard", tooltip: "Text size of dashboard" }));
  let i_showWM = input.bool(true, "Watermark", ({ group: "Watermark", tooltip: "Show ticker and classification summary" }));
  let i_wmPos = input.string("Bottom Right", "Position", ({ options: ["Top Right", "Top Left", "Bottom Right", "Bottom Left"], group: "Watermark" }));
  let i_wmSize = input.string("Normal", "Size", ({ options: ["Small", "Normal", "Large"], group: "Watermark", tooltip: "Text size of watermark" }));
  let i_dark = input.bool(true, "Dark Mode", ({ group: "Style", tooltip: "Optimize colors for dark charts" }));
  let i_alerts = input.bool(false, "Alerts", ({ group: "Alerts", tooltip: "Trigger alerts on classification changes" }));
  let cBull = (i_dark ? pinescript.color.hex("#22c55e") : pinescript.color.hex("#16a34a"));
  let cBear = (i_dark ? pinescript.color.hex("#ef4444") : pinescript.color.hex("#dc2626"));
  let cWeak = (i_dark ? pinescript.color.hex("#f59e0b") : pinescript.color.hex("#d97706"));
  let cNeut = (i_dark ? pinescript.color.hex("#737373") : pinescript.color.hex("#525252"));
  let cPrim = (i_dark ? pinescript.color.hex("#3b82f6") : pinescript.color.hex("#2563eb"));
  let cText = (i_dark ? pinescript.color.hex("#fafafa") : pinescript.color.hex("#0a0a0a"));
  let cTblBg = (i_dark ? pinescript.color.hex("#171717") : pinescript.color.hex("#f5f5f5"));
  let cHdrBg = (i_dark ? pinescript.color.hex("#262626") : pinescript.color.hex("#e5e5e5"));
  function f_pos(p) {
    return ((p === "Top Right") ? pinescript.position.top_right : ((p === "Top Left") ? pinescript.position.top_left : ((p === "Bottom Right") ? pinescript.position.bottom_right : pinescript.position.bottom_left)));
  }
  function f_size(s) {
    return ((s === "Tiny") ? pinescript.size.tiny : ((s === "Small") ? pinescript.size.small : ((s === "Normal") ? pinescript.size.normal : ((s === "Large") ? pinescript.size.large : pinescript.size.small))));
  }
  let dashSizeH = f_size(((i_dashSize === "Tiny") ? "Small" : i_dashSize));
  let dashSizeD = f_size(i_dashSize);
  let dashSizeF = f_size(((i_dashSize === "Normal") ? "Small" : "Tiny"));
  let wmSizeT = f_size(((i_wmSize === "Small") ? "Normal" : ((i_wmSize === "Normal") ? "Large" : "Large")));
  let wmSizeM = f_size(i_wmSize);
  let wmSizeS = f_size(((i_wmSize === "Large") ? "Small" : "Tiny"));
  function f_median(arr) {
    let n = pinescript.arraySize(arr);
    if ((n === 0)) {
      0;
    } else {
      let s = array.copy(arr);
      pinescript.arraySort(s);
      let m = (n / 2);
      (((n % 2) === 0) ? ((pinescript.arrayGet(s, (m - 1)) + pinescript.arrayGet(s, m)) / 2) : pinescript.arrayGet(s, m));
    }
  }
  function f_collectAllReturns(src, horizon, maxBars) {
    if (state.arr === undefined) state.arr = pinescript.arrayNew(0);
    pinescript.arrayClear(state.arr);
    let nPeriods = math.floor((maxBars / horizon));
    for (let i = 0; i <= (nPeriods - 1); i++) {
      let recentBar = (i * horizon);
      let pastBar = ((i + 1) * horizon);
      if ((pastBar <= maxBars)) {
        let pRecent = pinescript.nz(pinescript.offset(src, recentBar), src);
        let pPast = pinescript.nz(pinescript.offset(src, pastBar), src);
        if (((pPast > 0) && (pRecent > 0))) {
          pinescript.arrayPush(state.arr, math.log((pRecent / pPast)));
        }
      }
    }
    return state.arr;
  }
  function f_arrayStats(arr) {
    n = pinescript.arraySize(state.arr);
    if ((n < 3)) {
      [0, 0, 0, 0, 0];
    } else {
      let mean = pinescript.arrayAvg(state.arr);
      let med = f_median(state.arr);
      let sumSq = 0;
      let posCount = 0;
      for (let i = 0; i <= (n - 1); i++) {
        let v = pinescript.arrayGet(state.arr, i);
        sumSq += ((v - mean) * (v - mean));
        if ((v > 0)) {
          posCount += 1;
        }
      }
      let sd = pinescript.sqrt((sumSq / (n - 1)));
      [mean, med, sd, n, posCount];
    }
  }
  function f_hacSE(arr, mean) {
    n = pinescript.arraySize(state.arr);
    if ((n < 3)) {
      0;
    } else {
      let g0 = 0;
      for (let i = 0; i <= (n - 1); i++) {
        let d = (pinescript.arrayGet(state.arr, i) - mean);
        g0 += (d * d);
      }
      g0 = (g0 / n);
      let g1 = 0;
      for (let i = 1; i <= (n - 1); i++) {
        let di = (pinescript.arrayGet(state.arr, i) - mean);
        let dj = (pinescript.arrayGet(state.arr, (i - 1)) - mean);
        g1 += (di * dj);
      }
      g1 = (g1 / n);
      let hV = (g0 + g1);
      pinescript.sqrt(pinescript.max((hV / n), 1e-14));
    }
  }
  function f_splitArray(arr, isFirstHalf) {
    n = pinescript.arraySize(state.arr);
    if (state.result === undefined) state.result = pinescript.arrayNew(0);
    pinescript.arrayClear(state.result);
    if ((n < 2)) {
      state.result;
    } else {
      let halfN = math.floor((n / 2));
      if (isFirstHalf) {
        for (let i = 0; i <= (halfN - 1); i++) {
          pinescript.arrayPush(state.result, pinescript.arrayGet(state.arr, i));
        }
      } else {
        for (let i = halfN; i <= (n - 1); i++) {
          pinescript.arrayPush(state.result, pinescript.arrayGet(state.arr, i));
        }
      }
      state.result;
    }
  }
  function f_vrTest(src, horizon, k, sampleBars) {
    let arr1 = f_collectAllReturns(src, horizon, sampleBars);
    let arrK = f_collectAllReturns(src, (horizon * k), sampleBars);
    let [m1, md1, sd1, n1, pc1] = f_arrayStats(arr1);
    let [mK, mdK, sdK, nK, pcK] = f_arrayStats(arrK);
    if ((((sd1 < 1e-10) || (n1 < MIN_OBS_STRICT)) || (nK < 3))) {
      [1, 0, false];
    } else {
      let var1 = (sd1 * sd1);
      let varK = (sdK * sdK);
      let vr = (varK / (k * var1));
      let vrSE = pinescript.sqrt((((2 * ((2 * k) - 1)) * (k - 1)) / ((3 * k) * nK)));
      let zVR = ((vrSE > 1e-10) ? (pinescript.abs((vr - 1)) / vrSE) : 0);
      let vrSig = (zVR > T_CRIT_90);
      [vr, zVR, vrSig];
    }
  }
  function f_mde(sd, n, tCrit) {
    return (((n < MIN_OBS_STRICT) || (sd <= 0)) ? null : (((sd / pinescript.sqrt(n)) * tCrit) * ANN_FACTOR));
  }
  function f_signTestZ(posCount, n) {
    return ((n < MIN_OBS_STRICT) ? 0 : ((float(posCount) - (float(n) / 2)) / pinescript.sqrt((float(n) / 4))));
  }
  let allReturns = f_collectAllReturns(close, HORIZON, SAMPLE_TOTAL);
  let [mF, mdF, sdF, nF, pcF] = f_arrayStats(allReturns);
  let seF = f_hacSE(allReturns, mF);
  let tF = ((seF > 1e-10) ? (mF / seF) : 0);
  arr1 = f_splitArray(allReturns, true);
  let arr2 = f_splitArray(allReturns, false);
  [m1, md1, sd1, n1, pc1] = f_arrayStats(arr1);
  let se1 = f_hacSE(arr1, m1);
  let t1 = ((se1 > 1e-10) ? (m1 / se1) : 0);
  let [m2, md2, sd2, n2, pc2] = f_arrayStats(arr2);
  let se2 = f_hacSE(arr2, m2);
  let t2 = ((se2 > 1e-10) ? (m2 / se2) : 0);
  [vr, zVR, vrSig] = f_vrTest(close, HORIZON, 5, SAMPLE_TOTAL);
  let mde95 = f_mde(sdF, nF, T_CRIT_95);
  let annDrift = (mF * ANN_FACTOR);
  let zSign = f_signTestZ(pcF, nF);
  let hitRate = ((nF > 0) ? (float(pcF) / float(nF)) : 0.5);
  let inferenceAllowed = (((nF >= MIN_OBS_STRICT) && (n1 >= math.floor((MIN_OBS_STRICT / 2)))) && (n2 >= math.floor((MIN_OBS_STRICT / 2))));
  let isRobust = (nF >= MIN_OBS_ROBUST);
  let statSig = (inferenceAllowed && (pinescript.abs(tF) > T_CRIT_95));
  let econSig = (inferenceAllowed && (pinescript.abs(annDrift) >= MIN_DRIFT_ECON));
  let powerOK = (inferenceAllowed && (pinescript.na(mde95) ? false : (pinescript.abs(annDrift) >= mde95)));
  let medianSig = (inferenceAllowed && (pinescript.abs(zSign) > SIGN_Z_CRIT));
  let medianDir = ((zSign > 0) ? 1 : ((zSign < 0) ? -1 : 0));
  let meanDir = ((mF > 0) ? 1 : ((mF < 0) ? -1 : 0));
  let signTestOK = (inferenceAllowed && (!medianSig || (medianDir === meanDir)));
  let meanMedOK = (inferenceAllowed && ((((mF > 0) && (mdF > 0)) || ((mF < 0) && (mdF < 0))) || (pinescript.abs(mF) < 1e-10)));
  let sameSignMean = (((m1 > 0) && (m2 > 0)) || ((m1 < 0) && (m2 < 0)));
  let pooledSD = pinescript.sqrt((((sd1 * sd1) + (sd2 * sd2)) / 2));
  let levelDevSD = ((pooledSD > 1e-10) ? (pinescript.abs((m1 - m2)) / pooledSD) : 0);
  let levelOK = (levelDevSD <= MAX_DEV_SD);
  let sameSignT = ((((t1 > 0) && (t2 > 0)) && (tF > 0)) || (((t1 < 0) && (t2 < 0)) && (tF < 0)));
  let structOK = (((inferenceAllowed && sameSignMean) && levelOK) && sameSignT);
  let isMeanRev = ((vr < 1) && vrSig);
  let vrOK = (inferenceAllowed && !isMeanRev);
  let direction = ((mF > 0) ? 1 : ((mF < 0) ? -1 : 0));
  if (state.classReason === undefined) state.classReason = "";
  if (state.classCode === undefined) state.classCode = 0;
  if (!inferenceAllowed) {
    state.classCode = 0;
    state.classReason = ("n<" + pinescript.strToString(MIN_OBS_STRICT));
  } else {
    if (!powerOK) {
      state.classCode = 0;
      state.classReason = "power";
    } else {
      if (!statSig) {
        state.classCode = 0;
        state.classReason = ("t<" + pinescript.strToString(T_CRIT_95, "#.#"));
      } else {
        if (!signTestOK) {
          state.classCode = 0;
          state.classReason = "signtest";
        } else {
          if (!meanMedOK) {
            state.classCode = 0;
            state.classReason = "median";
          } else {
            if (!structOK) {
              state.classCode = 0;
              state.classReason = (!sameSignMean ? "sign(m)" : (!sameSignT ? "sign(t)" : "level"));
            } else {
              if (!vrOK) {
                state.classCode = 0;
                state.classReason = "mean-rev";
              } else {
                if (!econSig) {
                  state.classCode = 1;
                  state.classReason = (("<" + pinescript.strToString((MIN_DRIFT_ECON * 100), "#")) + "%");
                } else {
                  state.classCode = 2;
                  state.classReason = "";
                }
              }
            }
          }
        }
      }
    }
  }
  let strongEvidence = (state.classCode === 2);
  let weakEvidence = (state.classCode === 1);
  let classification = ((state.classCode === 2) ? (direction * 2) : ((state.classCode === 1) ? direction : 0));
  let evidenceStr = (strongEvidence ? "STRONG" : (weakEvidence ? "WEAK" : "NONE"));
  let biasStr = ((classification === 2) ? "Positive Drift" : ((classification === -2) ? "Negative Drift" : ((classification === 1) ? "Positive (weak)" : ((classification === -1) ? "Negative (weak)" : "No Drift"))));
  let regimeStr = (isMeanRev ? "Mean-Rev" : "Neutral");
  let bgClr = null;
  if ((i_bgMode === "On")) {
    bgClr = ((classification >= 2) ? cBull : ((classification <= -2) ? cBear : ((pinescript.abs(classification) === 1) ? cWeak : null)));
  }
  pinescript.bgcolor(((i_bgMode === "On") ? pinescript.color.new(bgClr, i_bgInt) : null));
  let cBarLong = pinescript.color.hex("#22c55e");
  let cBarShort = pinescript.color.hex("#ef4444");
  let cBarNeut = pinescript.color.hex("#a3a3a3");
  let barClr = null;
  if (i_barColor) {
    barClr = ((classification >= 2) ? cBarLong : ((classification <= -2) ? cBarShort : ((pinescript.abs(classification) === 1) ? ((direction > 0) ? cBarLong : cBarShort) : cBarNeut)));
  }
  barcolor(barClr);
  if (state.wm === undefined) state.wm = pinescript.table.new(f_pos(i_wmPos), 1, 5, ({ bgcolor: pinescript.color.new(pinescript.color.black, 100) }));
  if ((i_showWM && barstate.islast)) {
    let evClr = (!inferenceAllowed ? cNeut : (strongEvidence ? cBull : (weakEvidence ? cWeak : cNeut)));
    let wmClr = pinescript.color.new((i_dark ? pinescript.color.white : pinescript.color.black), 30);
    pinescript.table.cell(state.wm, 0, 0, syminfo.ticker, ({ text_color: wmClr, text_size: wmSizeT, text_halign: pinescript.text.align_right }));
    pinescript.table.cell(state.wm, 0, 1, (((inferenceAllowed ? ("t=" + pinescript.strToString(tF, "#.##")) : ("n<" + pinescript.strToString(MIN_OBS_STRICT))) + " | n=") + pinescript.strToString(nF)), ({ text_color: wmClr, text_size: wmSizeS, text_halign: pinescript.text.align_right }));
    pinescript.table.cell(state.wm, 0, 2, (evidenceStr + ((state.classReason !== "") ? ((" (" + state.classReason) + ")") : "")), ({ text_color: evClr, text_size: wmSizeM, text_halign: pinescript.text.align_right }));
    pinescript.table.cell(state.wm, 0, 3, biasStr, ({ text_color: evClr, text_size: wmSizeM, text_halign: pinescript.text.align_right }));
    pinescript.table.cell(state.wm, 0, 4, (isRobust ? "" : "Heuristic (n<20)"), ({ text_color: pinescript.color.new(cWeak, 30), text_size: wmSizeS, text_halign: pinescript.text.align_right }));
  }
  if ((i_showDash && barstate.islast)) {
    if (state.d === undefined) state.d = pinescript.table.new(f_pos(i_dashPos), 2, 18, ({ border_width: 1, bgcolor: pinescript.color.new(cTblBg, 80) }));
    let hB = pinescript.color.new(cHdrBg, 20);
    evClr = (!inferenceAllowed ? cNeut : (strongEvidence ? cBull : (weakEvidence ? cWeak : cNeut)));
    pinescript.table.cell(state.d, 0, 0, "ADM", ({ text_color: cText, bgcolor: hB, text_size: dashSizeH }));
    pinescript.table.cell(state.d, 1, 0, "Retrospective", ({ text_color: pinescript.color.new(cText, 50), bgcolor: hB, text_size: dashSizeF }));
    pinescript.table.cell(state.d, 0, 1, "Classification", ({ text_color: cText, bgcolor: pinescript.color.new(evClr, 80), text_size: dashSizeH }));
    pinescript.table.cell(state.d, 1, 1, biasStr, ({ text_color: evClr, bgcolor: pinescript.color.new(evClr, 80), text_size: dashSizeH }));
    pinescript.table.cell(state.d, 0, 2, "Evidence", ({ text_color: cText, bgcolor: pinescript.color.new(evClr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 2, (evidenceStr + ((state.classReason !== "") ? ((" (" + state.classReason) + ")") : "")), ({ text_color: evClr, bgcolor: pinescript.color.new(evClr, 90), text_size: dashSizeD }));
    let infClr = (inferenceAllowed ? cBull : cBear);
    pinescript.table.cell(state.d, 0, 3, "Inference", ({ text_color: cText, bgcolor: pinescript.color.new(infClr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 3, (inferenceAllowed ? (isRobust ? "Allowed" : "Heuristic") : "Blocked"), ({ text_color: infClr, bgcolor: pinescript.color.new(infClr, 90), text_size: dashSizeD }));
    let tClr = (statSig ? cBull : cNeut);
    pinescript.table.cell(state.d, 0, 4, ("t(full) n=" + pinescript.strToString(nF)), ({ text_color: cText, bgcolor: pinescript.color.new(tClr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 4, (pinescript.strToString(tF, "#.##") + (statSig ? "**" : "")), ({ text_color: tClr, bgcolor: pinescript.color.new(tClr, 90), text_size: dashSizeD }));
    let t1Clr = ((t1 > 0) ? cBull : cBear);
    pinescript.table.cell(state.d, 0, 5, ("t(H1) n=" + pinescript.strToString(n1)), ({ text_color: cText, bgcolor: pinescript.color.new(t1Clr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 5, pinescript.strToString(t1, "#.##"), ({ text_color: t1Clr, bgcolor: pinescript.color.new(t1Clr, 90), text_size: dashSizeD }));
    let t2Clr = ((t2 > 0) ? cBull : cBear);
    pinescript.table.cell(state.d, 0, 6, ("t(H2) n=" + pinescript.strToString(n2)), ({ text_color: cText, bgcolor: pinescript.color.new(t2Clr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 6, pinescript.strToString(t2, "#.##"), ({ text_color: t2Clr, bgcolor: pinescript.color.new(t2Clr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 7, "Power", ({ text_color: cText, bgcolor: pinescript.color.new((powerOK ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 7, (powerOK ? "OK" : ("MDE:" + (pinescript.na(mde95) ? "N/A" : (pinescript.strToString((mde95 * 100), "#") + "%")))), ({ text_color: (powerOK ? cBull : cBear), bgcolor: pinescript.color.new((powerOK ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 8, "Sign Test", ({ text_color: cText, bgcolor: pinescript.color.new((signTestOK ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 8, (("z=" + pinescript.strToString(zSign, "#.#")) + (medianSig ? "*" : "")), ({ text_color: (signTestOK ? cBull : cBear), bgcolor: pinescript.color.new((signTestOK ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 9, "Mean=Median", ({ text_color: cText, bgcolor: pinescript.color.new((meanMedOK ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 9, (meanMedOK ? "Yes" : "No"), ({ text_color: (meanMedOK ? cBull : cBear), bgcolor: pinescript.color.new((meanMedOK ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 10, "Struct(m)", ({ text_color: cText, bgcolor: pinescript.color.new(((sameSignMean && levelOK) ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 10, ((((sameSignMean ? "+" : "-") + " lv:") + pinescript.strToString(levelDevSD, "#.#")) + "sd"), ({ text_color: ((sameSignMean && levelOK) ? cBull : cBear), bgcolor: pinescript.color.new(((sameSignMean && levelOK) ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 11, "Struct(t)", ({ text_color: cText, bgcolor: pinescript.color.new((sameSignT ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 11, (sameSignT ? "Consistent" : "Conflict"), ({ text_color: (sameSignT ? cBull : cBear), bgcolor: pinescript.color.new((sameSignT ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 12, "VR Test", ({ text_color: cText, bgcolor: pinescript.color.new((vrOK ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 12, (((pinescript.strToString(vr, "#.##") + " z=") + pinescript.strToString(zVR, "#.#")) + (vrSig ? "*" : "")), ({ text_color: (vrOK ? cBull : cBear), bgcolor: pinescript.color.new((vrOK ? cBull : cBear), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 13, "Econ. Sig.", ({ text_color: cText, bgcolor: pinescript.color.new((econSig ? cBull : cWeak), 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 13, (econSig ? "Yes" : (("<" + pinescript.strToString((MIN_DRIFT_ECON * 100), "#")) + "%")), ({ text_color: (econSig ? cBull : cWeak), bgcolor: pinescript.color.new((econSig ? cBull : cWeak), 90), text_size: dashSizeD }));
    let dClr = ((annDrift > 0) ? cBull : cBear);
    pinescript.table.cell(state.d, 0, 14, "Drift (ann.)", ({ text_color: cText, bgcolor: pinescript.color.new(dClr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 14, (pinescript.strToString((annDrift * 100), "#.#") + "%"), ({ text_color: dClr, bgcolor: pinescript.color.new(dClr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 15, "Regime", ({ text_color: cText, bgcolor: pinescript.color.new(cPrim, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 15, regimeStr, ({ text_color: cPrim, bgcolor: pinescript.color.new(cPrim, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 16, ("H=" + pinescript.strToString(HORIZON)), ({ text_color: pinescript.color.new(cText, 50), bgcolor: pinescript.color.new(cNeut, 95), text_size: dashSizeF }));
    pinescript.table.cell(state.d, 1, 16, ("MinN=" + pinescript.strToString(MIN_OBS_STRICT)), ({ text_color: pinescript.color.new(cText, 50), bgcolor: pinescript.color.new(cNeut, 95), text_size: dashSizeF }));
    pinescript.table.cell(state.d, 0, 17, "**p<.05 *p<.10", ({ text_color: pinescript.color.new(cText, 50), bgcolor: pinescript.color.new(cNeut, 95), text_size: dashSizeF }));
    pinescript.table.cell(state.d, 1, 17, (isRobust ? "" : "Heuristic"), ({ text_color: pinescript.color.new(cWeak, 30), bgcolor: pinescript.color.new(cNeut, 95), text_size: dashSizeF }));
  }
  let changed = (classification !== pinescript.offset(classification, 1));
  if ((changed && i_alerts)) {
    pinescript.alert((((("ADM: " + biasStr) + " (") + evidenceStr) + ")"), alert.freq_once_per_bar);
  }
  alertcondition((strongEvidence && (direction > 0)), "Positive Drift", "Positive Drift detected");
  alertcondition((strongEvidence && (direction < 0)), "Negative Drift", "Negative Drift detected");
  alertcondition(weakEvidence, "Weak", "Weak evidence");
  alertcondition(!inferenceAllowed, "Blocked", "Inference blocked");
}


// Export for use

export { main
};
