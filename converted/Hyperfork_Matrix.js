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
  time: 1771178051501,
  timenow: 1771178051501,
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
  // Study: Hyperfork Matrix
  // Options: {"overlay":true,"max_lines_count":500,"max_labels_count":500}
  let MAX_BAR_EXTENSION = 500;
  let group_pivots = "1. Pivot Points";
  let start_pivot_type = input.string("Auto", ({ title: "Starting Pivot Type", options: ["Auto", "Low", "High"], group: group_pivots, tooltip: "Auto: detect pattern from prices | Low: force Low-High-Low | High: force High-Low-High" }));
  let pivotA_time = input.time(({ title: "Pivot A Time", defval: 0, group: group_pivots, tooltip: "Select the timestamp for the starting pivot (A, the anchor point)", confirm: true }));
  let pivotB_time = input.time(({ title: "Pivot B Time", defval: 0, group: group_pivots, tooltip: "Select the timestamp for Pivot B (the first swing point after A)", confirm: true }));
  let pivotC_time = input.time(({ title: "Pivot C Time", defval: 0, group: group_pivots, tooltip: "Select the timestamp for Pivot C (the second swing point after B)", confirm: true }));
  let show_pivot_labels = input.bool(true, ({ title: "Show Pivot Labels", group: group_pivots, tooltip: "Show A, B, C labels at pivot points" }));
  let labelColorH = input.color(pinescript.color.lime, "High Pivot Color", ({ group: group_pivots, inline: "pivot_colors" }));
  let labelColorL = input.color(pinescript.color.red, "Low Pivot Color", ({ group: group_pivots, inline: "pivot_colors" }));
  let pivot_label_size = input.string("Normal", ({ title: "Size", options: ["Tiny", "Small", "Normal", "Large"], group: group_pivots, tooltip: "Text size for pivot labels" }));
  let group_pitchfork = "2. Pitchfork Settings";
  let use_log = input.bool(false, ({ title: "Logarithmic Scale", group: group_pitchfork, tooltip: "Enable to support logarithmic chart scaling. Calculations will be performed in log space for proper line rendering on log charts." }));
  let pitchfork_type = input.string(({ title: "Pitchfork Type", defval: "Original", options: ["Original", "Schiff", "Modified Schiff"], group: group_pitchfork, tooltip: "Original: anchor at A | Schiff: anchor shifted 50% Y toward B | Modified Schiff: anchor shifted 50% X+Y toward B" }));
  let extra_levels = input.int(({ title: "Extra Parallel Levels", defval: 0, minval: 0, group: group_pitchfork, tooltip: "Number of additional parallel lines outside the main pitchfork" }));
  let line_color = input.color(pinescript.color.lime, ({ title: "Pitchfork Color", group: group_pitchfork, inline: "pitchfork", tooltip: "Color for the pitchfork lines (median and parallels)" }));
  let line_width = input.int(1, ({ title: "Width", minval: 1, group: group_pitchfork, inline: "pitchfork", tooltip: "Width for the pitchfork lines" }));
  let line_style = input.string("Solid", ({ title: "Style", options: ["Solid", "Dashed", "Dotted"], group: group_pitchfork, inline: "pitchfork", tooltip: "Style for the pitchfork lines" }));
  let extend_dir = input.string(({ title: "Extend Direction", defval: "Right", options: ["Right", "Both"], group: group_pitchfork, tooltip: "Direction to extend the pitchfork lines: Right, or Both" }));
  let enable_price_range = input.bool(true, ({ title: "Enable Price Range Filter", group: group_pitchfork, tooltip: "When enabled, extra parallels outside the price range are hidden." }));
  let price_range_min = input.float(0, ({ title: "Price Range Min", minval: 0, group: group_pitchfork, tooltip: "Minimum price for pitchfork elements. Extra parallels below this will be removed." }));
  let price_range_max = input.float(1000000, ({ title: "Price Range Max", minval: 0, group: group_pitchfork, tooltip: "Maximum price for pitchfork elements. Extra parallels above this will be removed." }));
  let group_action_reaction = "3. Action / Reaction Lines";
  let draw_type = input.string("Both", ({ title: "Draw Action/Reaction Lines", options: ["None", "Action Only", "Reaction Only", "Both"], group: group_action_reaction, tooltip: "Choose which lines to draw: None, Action Only, Reaction Only, or Both" }));
  let forward_count = input.int(({ title: "Forward Lines Offset", defval: 0, group: group_action_reaction, tooltip: "Offset from auto-extend. 0 = to current bar. Positive adds more, negative removes." }));
  let backward_count = input.int(({ title: "Backward Lines Count", defval: 0, minval: 0, group: group_action_reaction, tooltip: "Number of lines backward from the median" }));
  let action_color = input.color(pinescript.color.aqua, ({ title: "Action Lines Color", group: group_action_reaction, inline: "action", tooltip: "Color for the action transversal lines" }));
  let action_width = input.int(1, ({ title: "Width", minval: 1, group: group_action_reaction, inline: "action", tooltip: "Width for the action transversal lines" }));
  let action_style = input.string("Dotted", ({ title: "Style", options: ["Solid", "Dashed", "Dotted"], group: group_action_reaction, inline: "action", tooltip: "Style for the action transversal lines" }));
  let reaction_color = input.color(pinescript.color.hex("#ff8c69"), ({ title: "Reaction Lines Color", group: group_action_reaction, inline: "reaction", tooltip: "Color for the reaction transversal lines" }));
  let reaction_width = input.int(1, ({ title: "Width", minval: 1, group: group_action_reaction, inline: "reaction", tooltip: "Width for the reaction transversal lines" }));
  let reaction_style = input.string("Dotted", ({ title: "Style", options: ["Solid", "Dashed", "Dotted"], group: group_action_reaction, inline: "reaction", tooltip: "Style for the reaction transversal lines" }));
  let group_lattice = "4. Lattice";
  let draw_lattice = input.bool(false, ({ title: "Draw Lattice", group: group_lattice, tooltip: "Enable drawing of horizontal and vertical lattice lines based on pivots and intersections" }));
  let lattice_pivot = input.string("A", ({ title: "Select Pivot for Horizontal", options: ["A", "B", "C"], group: group_lattice, tooltip: "Choose which pivot's horizontal line to plot" }));
  let lattice_source = input.string("Pitchfork & Parallels", ({ title: "Intersection Source", options: ["Pitchfork & Parallels", "Action Lines", "Reaction Lines", "Action & Reaction"], group: group_lattice, tooltip: "Choose the source for intersections: Pitchfork & parallels, Action lines, Reaction lines, or both Action & Reaction" }));
  let lattice_color = input.color(pinescript.color.white, ({ title: "Lattice Color", group: group_lattice, inline: "lattice", tooltip: "Color for the lattice lines (horizontals and verticals)" }));
  let lattice_width = input.int(1, ({ title: "Width", minval: 1, group: group_lattice, inline: "lattice", tooltip: "Width for the lattice lines" }));
  let lattice_style = input.string("Dotted", ({ title: "Style", options: ["Solid", "Dashed", "Dotted"], group: group_lattice, inline: "lattice", tooltip: "Style for the lattice lines" }));
  line.style_dotted;
  line.style_dashed;
  line.style_solid;
  let pitch_style = ((line_style === "Solid") ? undefined : ((line_style === "Dashed") ? undefined : ((line_style === "Dotted") ? undefined : null)));
  line.style_dotted;
  line.style_dashed;
  line.style_solid;
  let reaction_line_style = ((reaction_style === "Solid") ? undefined : ((reaction_style === "Dashed") ? undefined : ((reaction_style === "Dotted") ? undefined : null)));
  line.style_dotted;
  line.style_dashed;
  line.style_solid;
  let action_line_style = ((action_style === "Solid") ? undefined : ((action_style === "Dashed") ? undefined : ((action_style === "Dotted") ? undefined : null)));
  line.style_dotted;
  line.style_dashed;
  line.style_solid;
  let lattice_line_style = ((lattice_style === "Solid") ? undefined : ((lattice_style === "Dashed") ? undefined : ((lattice_style === "Dotted") ? undefined : null)));
  pinescript.size.large;
  pinescript.size.normal;
  pinescript.size.small;
  pinescript.size.tiny;
  let label_size = ((pivot_label_size === "Tiny") ? undefined : ((pivot_label_size === "Small") ? undefined : ((pivot_label_size === "Normal") ? undefined : ((pivot_label_size === "Large") ? undefined : null))));
  let pivotA_x = ta.valuewhen((time === pivotA_time), bar_index, 0);
  let pivotB_x = ta.valuewhen((time === pivotB_time), bar_index, 0);
  let pivotC_x = ta.valuewhen((time === pivotC_time), bar_index, 0);
  let rawA_high = ta.valuewhen((time === pivotA_time), high, 0);
  let rawA_low = ta.valuewhen((time === pivotA_time), low, 0);
  let rawB_high = ta.valuewhen((time === pivotB_time), high, 0);
  let rawB_low = ta.valuewhen((time === pivotB_time), low, 0);
  let rawC_high = ta.valuewhen((time === pivotC_time), high, 0);
  let rawC_low = ta.valuewhen((time === pivotC_time), low, 0);
  let pivotA_type = null;
  let pivotB_type = null;
  let pivotC_type = null;
  if ((start_pivot_type === "Auto")) {
    let lhl_strength = ((rawB_high - rawA_low) + (rawB_high - rawC_low));
    let hlh_strength = ((rawA_high - rawB_low) + (rawC_high - rawB_low));
    if ((lhl_strength >= hlh_strength)) {
      pivotA_type = "Low";
      pivotB_type = "High";
      pivotC_type = "Low";
    } else {
      pivotA_type = "High";
      pivotB_type = "Low";
      pivotC_type = "High";
    }
  } else {
    pivotA_type = start_pivot_type;
    pivotB_type = ((start_pivot_type === "Low") ? "High" : "Low");
    pivotC_type = start_pivot_type;
  }
  let pivotA_raw = ((pivotA_type === "High") ? rawA_high : rawA_low);
  let pivotB_raw = ((pivotB_type === "High") ? rawB_high : rawB_low);
  let pivotC_raw = ((pivotC_type === "High") ? rawC_high : rawC_low);
  let pivotA_y = (use_log ? math.log(pivotA_raw) : pivotA_raw);
  let pivotB_y = (use_log ? math.log(pivotB_raw) : pivotB_raw);
  let pivotC_y = (use_log ? math.log(pivotC_raw) : pivotC_raw);
  let mid_x = ((pivotB_x + pivotC_x) / 2);
  let mid_y = ((pivotB_y + pivotC_y) / 2);
  let anchor_x = null;
  let anchor_y = null;
  switch (pitchfork_type) {
    case "Original":
    {
      anchor_x = pivotA_x;
      anchor_y = pivotA_y;
      break;
    }
    case "Schiff":
    {
      anchor_x = pivotA_x;
      anchor_y = (pivotA_y + (0.5 * (pivotB_y - pivotA_y)));
      break;
    }
    case "Modified Schiff":
    {
      anchor_x = (pivotA_x + (0.5 * (pivotB_x - pivotA_x)));
      anchor_y = (pivotA_y + (0.5 * (pivotB_y - pivotA_y)));
      break;
    }
  }
  let slope_ml = ((mid_x !== anchor_x) ? ((mid_y - anchor_y) / (mid_x - anchor_x)) : null);
  let slope_trans = ((pivotC_x !== pivotB_x) ? ((pivotC_y - pivotB_y) / (pivotC_x - pivotB_x)) : null);
  let slope_action = ((pivotB_x !== pivotA_x) ? ((pivotB_y - pivotA_y) / (pivotB_x - pivotA_x)) : null);
  let upper_x = pivotB_x;
  let upper_y = pivotB_y;
  let lower_x = pivotC_x;
  let lower_y = pivotC_y;
  if ((pivotB_y < pivotC_y)) {
    upper_x = pivotC_x;
    upper_y = pivotC_y;
    lower_x = pivotB_x;
    lower_y = pivotB_y;
  }
  function f_intersect_x(s1, px1, py1, s2, px2, py2) {
    return ((s1 === s2) ? null : ((((py2 - py1) + (s1 * px1)) - (s2 * px2)) / (s1 - s2)));
  }
  function f_line_y_at_bar(start_x, start_y, slope, bar_idx) {
    return (start_y + (slope * (bar_idx - start_x)));
  }
  function f_price_crossed_line(prev_price, curr_price, prev_line_y, curr_line_y) {
    return ((((!pinescript.na(prev_price) && !pinescript.na(curr_price)) && !pinescript.na(prev_line_y)) && !pinescript.na(curr_line_y)) && (((prev_price < prev_line_y) && (curr_price >= curr_line_y)) || ((prev_price > prev_line_y) && (curr_price <= curr_line_y))));
  }
  function f_draw_line(start_x, start_y, col, wid, st, min_x, max_x, all_min_x) {
    let x1 = null;
    let y1 = null;
    let x2 = null;
    let y2 = null;
    switch (extend_dir) {
      case "Right":
      {
        x1 = start_x;
        y1 = start_y;
        x2 = max_x;
        y2 = (start_y + (slope_ml * (x2 - x1)));
        let draw_y1 = (use_log ? math.exp(y1) : y1);
        let draw_y2 = (use_log ? math.exp(y2) : y2);
        pinescript.lineNew(int(pinescript.round(x1)), draw_y1, int(pinescript.round(x2)), draw_y2, ({ extend: extend.right, color: col, width: wid, style: st }));
        break;
      }
      case "Both":
      {
        x1 = pinescript.max(min_x, all_min_x);
        y1 = (start_y + (slope_ml * (x1 - start_x)));
        x2 = max_x;
        y2 = (start_y + (slope_ml * (x2 - start_x)));
        let draw_y1 = (use_log ? math.exp(y1) : y1);
        let draw_y2 = (use_log ? math.exp(y2) : y2);
        pinescript.lineNew(int(pinescript.round(x1)), draw_y1, int(pinescript.round(x2)), draw_y2, ({ extend: extend.both, color: col, width: wid, style: st }));
        break;
      }
    }
  }
  function f_draw_tine(px, py, col, wid, st, min_x, max_x, all_min_x, slope_t) {
    let int_x = f_intersect_x(slope_t, pivotB_x, pivotB_y, slope_ml, px, py);
    let int_y = (pinescript.na(int_x) ? null : ((slope_t * (int_x - pivotB_x)) + pivotB_y));
    if (!pinescript.na(int_x)) {
      let draw_x = int_x;
      let draw_y = int_y;
      if ((int_x < 0)) {
        draw_x = 0;
        draw_y = (py + (slope_ml * (draw_x - px)));
      }
      f_draw_line(draw_x, draw_y, col, wid, st, min_x, max_x, all_min_x);
    }
  }
  if (state.drawn === undefined) state.drawn = false;
  let max_x = (last_bar_index + MAX_BAR_EXTENSION);
  let min_x = 0;
  let all_min_x = pinescript.min(anchor_x, pinescript.min(pivotB_x, pivotC_x));
  let all_max_x = pinescript.max(anchor_x, pinescript.max(pivotB_x, pivotC_x));
  if (state.effective_extra_upper === undefined) state.effective_extra_upper = 0;
  if (state.effective_extra_lower === undefined) state.effective_extra_lower = 0;
  if (((!state.drawn && !pinescript.na(anchor_x)) && !pinescript.na(slope_ml))) {
    state.drawn = true;
    if (show_pivot_labels) {
      let style_A = ((pivotA_type === "Low") ? label.style_label_up : label.style_label_down);
      let style_B = ((pivotB_type === "Low") ? label.style_label_up : label.style_label_down);
      let style_C = ((pivotC_type === "Low") ? label.style_label_up : label.style_label_down);
      let color_A = ((pivotA_type === "High") ? labelColorH : labelColorL);
      let color_B = ((pivotB_type === "High") ? labelColorH : labelColorL);
      let color_C = ((pivotC_type === "High") ? labelColorH : labelColorL);
      let y_A = (use_log ? math.exp(pivotA_y) : pivotA_y);
      let y_B = (use_log ? math.exp(pivotB_y) : pivotB_y);
      let y_C = (use_log ? math.exp(pivotC_y) : pivotC_y);
      pinescript.labelNew(int(pivotA_x), y_A, "A", ({ style: style_A, color: pinescript.color.new(color_A, 100), textcolor: color_A, size: label_size, text_font_family: font.family_monospace }));
      pinescript.labelNew(int(pivotB_x), y_B, "B", ({ style: style_B, color: pinescript.color.new(color_B, 100), textcolor: color_B, size: label_size, text_font_family: font.family_monospace }));
      pinescript.labelNew(int(pivotC_x), y_C, "C", ({ style: style_C, color: pinescript.color.new(color_C, 100), textcolor: color_C, size: label_size, text_font_family: font.family_monospace }));
    }
    f_draw_line(anchor_x, anchor_y, line_color, line_width, pitch_style, min_x, max_x, all_min_x);
    let median_y_upper = (anchor_y + (slope_ml * (upper_x - anchor_x)));
    let offset_up = (upper_y - median_y_upper);
    let median_y_lower = (anchor_y + (slope_ml * (lower_x - anchor_x)));
    let offset_lo = (lower_y - median_y_lower);
    if (enable_price_range) {
      let range_min_y = (use_log ? math.log(pinescript.max(price_range_min, 0.0001)) : price_range_min);
      let range_max_y = (use_log ? math.log(price_range_max) : price_range_max);
      state.effective_extra_upper = extra_levels;
      if (((offset_up !== 0) && (extra_levels > 0))) {
        if ((offset_up > 0)) {
          let max_levels = int(math.floor(((range_max_y - upper_y) / offset_up)));
          state.effective_extra_upper = pinescript.max(0, pinescript.min(extra_levels, max_levels));
        } else {
          let max_levels = int(math.floor(((upper_y - range_min_y) / pinescript.abs(offset_up))));
          state.effective_extra_upper = pinescript.max(0, pinescript.min(extra_levels, max_levels));
        }
      }
      state.effective_extra_lower = extra_levels;
      if (((offset_lo !== 0) && (extra_levels > 0))) {
        if ((offset_lo < 0)) {
          let max_levels = int(math.floor(((lower_y - range_min_y) / pinescript.abs(offset_lo))));
          state.effective_extra_lower = pinescript.max(0, pinescript.min(extra_levels, max_levels));
        } else {
          let max_levels = int(math.floor(((range_max_y - lower_y) / offset_lo)));
          state.effective_extra_lower = pinescript.max(0, pinescript.min(extra_levels, max_levels));
        }
      }
    } else {
      state.effective_extra_upper = extra_levels;
      state.effective_extra_lower = extra_levels;
    }
    if (!pinescript.na(slope_trans)) {
      f_draw_tine(upper_x, upper_y, line_color, line_width, pitch_style, min_x, max_x, all_min_x, slope_trans);
      f_draw_tine(lower_x, lower_y, line_color, line_width, pitch_style, min_x, max_x, all_min_x, slope_trans);
    }
    if (!pinescript.na(slope_trans)) {
      if ((state.effective_extra_upper > 0)) {
        for (let i = 1; i <= state.effective_extra_upper; i++) {
          let extra_up_y = (upper_y + (float(i) * offset_up));
          f_draw_tine(upper_x, extra_up_y, line_color, line_width, pitch_style, min_x, max_x, all_min_x, slope_trans);
        }
      }
      if ((state.effective_extra_lower > 0)) {
        for (let i = 1; i <= state.effective_extra_lower; i++) {
          let extra_lo_y = (lower_y + (float(i) * offset_lo));
          f_draw_tine(lower_x, extra_lo_y, line_color, line_width, pitch_style, min_x, max_x, all_min_x, slope_trans);
        }
      }
    }
    let pitch_x = pinescript.arrayNew();
    let pitch_y = pinescript.arrayNew();
    pitch_x.push(anchor_x);
    pitch_y.push(anchor_y);
    let upper_start_x = f_intersect_x(slope_trans, pivotB_x, pivotB_y, slope_ml, upper_x, upper_y);
    let upper_start_y = (pinescript.na(upper_start_x) ? null : ((slope_trans * (upper_start_x - pivotB_x)) + pivotB_y));
    pitch_x.push(upper_start_x);
    pitch_y.push(upper_start_y);
    let lower_start_x = f_intersect_x(slope_trans, pivotB_x, pivotB_y, slope_ml, lower_x, lower_y);
    let lower_start_y = (pinescript.na(lower_start_x) ? null : ((slope_trans * (lower_start_x - pivotB_x)) + pivotB_y));
    pitch_x.push(lower_start_x);
    pitch_y.push(lower_start_y);
    if ((state.effective_extra_upper > 0)) {
      for (let i = 1; i <= state.effective_extra_upper; i++) {
        let extra_up_y = (upper_y + (float(i) * offset_up));
        let ex_start_x = f_intersect_x(slope_trans, pivotB_x, pivotB_y, slope_ml, upper_x, extra_up_y);
        let ex_start_y = (pinescript.na(ex_start_x) ? null : ((slope_trans * (ex_start_x - pivotB_x)) + pivotB_y));
        pitch_x.push(ex_start_x);
        pitch_y.push(ex_start_y);
      }
    }
    if ((state.effective_extra_lower > 0)) {
      for (let i = 1; i <= state.effective_extra_lower; i++) {
        let extra_lo_y = (lower_y + (float(i) * offset_lo));
        let ex_lo_start_x = f_intersect_x(slope_trans, pivotB_x, pivotB_y, slope_ml, lower_x, extra_lo_y);
        let ex_lo_start_y = (pinescript.na(ex_lo_start_x) ? null : ((slope_trans * (ex_lo_start_x - pivotB_x)) + pivotB_y));
        pitch_x.push(ex_lo_start_x);
        pitch_y.push(ex_lo_start_y);
      }
    }
    let eff_upper_y = (upper_y + (state.effective_extra_upper * offset_up));
    let outer_upper_start_x = f_intersect_x(slope_trans, pivotB_x, pivotB_y, slope_ml, upper_x, eff_upper_y);
    let outer_upper_start_y = (pinescript.na(outer_upper_start_x) ? null : ((slope_trans * (outer_upper_start_x - pivotB_x)) + pivotB_y));
    let eff_lower_y = (lower_y + (state.effective_extra_lower * offset_lo));
    let outer_lower_start_x = f_intersect_x(slope_trans, pivotB_x, pivotB_y, slope_ml, lower_x, eff_lower_y);
    let outer_lower_start_y = (pinescript.na(outer_lower_start_x) ? null : ((slope_trans * (outer_lower_start_x - pivotB_x)) + pivotB_y));
    let prop_x = pinescript.arrayNew();
    let prop_y = pinescript.arrayNew();
    let handle_dx = (mid_x - anchor_x);
    let handle_dy = (mid_y - anchor_y);
    let handle_len = pinescript.sqrt((pinescript.pow(handle_dx, 2) + pinescript.pow(handle_dy, 2)));
    let auto_forward_count = 0;
    if ((handle_dx !== 0)) {
      let bars_to_current = (last_bar_index - anchor_x);
      auto_forward_count = int(math.ceil(pinescript.abs((bars_to_current / handle_dx))));
      auto_forward_count = pinescript.max(1, auto_forward_count);
    }
    let effective_forward_count = pinescript.max(1, (auto_forward_count + forward_count));
    if ((handle_len > 0)) {
      let ux = (handle_dx / handle_len);
      let uy = (handle_dy / handle_len);
      if ((backward_count > 0)) {
        for (let i = 0; i <= backward_count; i++) {
          let k = -i;
          let p_dx = ((float(k) * handle_len) * ux);
          let p_dy = ((float(k) * handle_len) * uy);
          let p_x = (anchor_x + p_dx);
          let p_y = (anchor_y + p_dy);
          prop_x.push(p_x);
          prop_y.push(p_y);
        }
      }
      for (let i = 1; i <= effective_forward_count; i++) {
        let k = i;
        let p_dx = ((float(k) * handle_len) * ux);
        let p_dy = ((float(k) * handle_len) * uy);
        let p_x = (anchor_x + p_dx);
        let p_y = (anchor_y + p_dy);
        prop_x.push(p_x);
        prop_y.push(p_y);
      }
    }
    if (((draw_type !== "None") && (handle_len > 0))) {
      for (let i = 0; i <= (pinescript.arraySize(prop_x) - 1); i++) {
        let p_x = pinescript.arrayGet(prop_x, i);
        let p_y = pinescript.arrayGet(prop_y, i);
        if ((((draw_type === "Reaction Only") || (draw_type === "Both")) && !pinescript.na(slope_trans))) {
          let upper_ix = f_intersect_x(slope_trans, p_x, p_y, slope_ml, upper_x, eff_upper_y);
          let upper_iy = (pinescript.na(upper_ix) ? null : ((slope_trans * (upper_ix - p_x)) + p_y));
          let lower_ix = f_intersect_x(slope_trans, p_x, p_y, slope_ml, lower_x, eff_lower_y);
          let lower_iy = (pinescript.na(lower_ix) ? null : ((slope_trans * (lower_ix - p_x)) + p_y));
          if (!pinescript.na(upper_ix)) {
            upper_ix = pinescript.max(min_x, pinescript.min(max_x, upper_ix));
            upper_iy = ((slope_trans * (upper_ix - p_x)) + p_y);
          }
          if (!pinescript.na(lower_ix)) {
            lower_ix = pinescript.max(min_x, pinescript.min(max_x, lower_ix));
            lower_iy = ((slope_trans * (lower_ix - p_x)) + p_y);
          }
          if (((!pinescript.na(upper_ix) && !pinescript.na(lower_ix)) && (upper_ix !== lower_ix))) {
            let draw_upper_iy = (use_log ? math.exp(upper_iy) : upper_iy);
            let draw_lower_iy = (use_log ? math.exp(lower_iy) : lower_iy);
            pinescript.lineNew(int(pinescript.round(upper_ix)), draw_upper_iy, int(pinescript.round(lower_ix)), draw_lower_iy, ({ extend: extend.none, color: reaction_color, width: reaction_width, style: reaction_line_style }));
          }
        }
        if ((((draw_type === "Action Only") || (draw_type === "Both")) && !pinescript.na(slope_action))) {
          upper_ix = f_intersect_x(slope_action, p_x, p_y, slope_ml, upper_x, eff_upper_y);
          upper_iy = (pinescript.na(upper_ix) ? null : ((slope_action * (upper_ix - p_x)) + p_y));
          lower_ix = f_intersect_x(slope_action, p_x, p_y, slope_ml, lower_x, eff_lower_y);
          lower_iy = (pinescript.na(lower_ix) ? null : ((slope_action * (lower_ix - p_x)) + p_y));
          if (!pinescript.na(upper_ix)) {
            upper_ix = pinescript.max(min_x, pinescript.min(max_x, upper_ix));
            upper_iy = ((slope_action * (upper_ix - p_x)) + p_y);
          }
          if (!pinescript.na(lower_ix)) {
            lower_ix = pinescript.max(min_x, pinescript.min(max_x, lower_ix));
            lower_iy = ((slope_action * (lower_ix - p_x)) + p_y);
          }
          if (((!pinescript.na(upper_ix) && !pinescript.na(lower_ix)) && (upper_ix !== lower_ix))) {
            let draw_upper_iy = (use_log ? math.exp(upper_iy) : upper_iy);
            let draw_lower_iy = (use_log ? math.exp(lower_iy) : lower_iy);
            pinescript.lineNew(int(pinescript.round(upper_ix)), draw_upper_iy, int(pinescript.round(lower_ix)), draw_lower_iy, ({ extend: extend.none, color: action_color, width: action_width, style: action_line_style }));
          }
        }
      }
    }
    if (draw_lattice) {
      let horiz_y = null;
      let pivot_x = null;
      switch (lattice_pivot) {
        case "A":
        {
          horiz_y = pivotA_y;
          pivot_x = pivotA_x;
          break;
        }
        case "B":
        {
          horiz_y = pivotB_y;
          pivot_x = pivotB_x;
          break;
        }
        case "C":
        {
          horiz_y = pivotC_y;
          pivot_x = pivotC_x;
          break;
        }
      }
      let all_inter_xs = pinescript.arrayNew();
      let inter_xs = pinescript.arrayNew();
      if ((lattice_source === "Pitchfork & Parallels")) {
        for (let p = 0; p <= (pinescript.arraySize(pitch_x) - 1); p++) {
          let sx = pinescript.arrayGet(pitch_x, p);
          let sy = pinescript.arrayGet(pitch_y, p);
          if ((slope_ml !== 0)) {
            let ix = (sx + ((horiz_y - sy) / slope_ml));
            if (!pinescript.na(ix)) {
              pinescript.arrayPush(inter_xs, ix);
            }
          }
        }
      }
      if (((lattice_source === "Reaction Lines") || (lattice_source === "Action & Reaction"))) {
        for (let r = 0; r <= (pinescript.arraySize(prop_x) - 1); r++) {
          let px = pinescript.arrayGet(prop_x, r);
          let py = pinescript.arrayGet(prop_y, r);
          if ((slope_trans !== 0)) {
            let ix = (px + ((horiz_y - py) / slope_trans));
            if (!pinescript.na(ix)) {
              pinescript.arrayPush(inter_xs, ix);
            }
          }
        }
      }
      if (((lattice_source === "Action Lines") || (lattice_source === "Action & Reaction"))) {
        for (let r = 0; r <= (pinescript.arraySize(prop_x) - 1); r++) {
          let px = pinescript.arrayGet(prop_x, r);
          let py = pinescript.arrayGet(prop_y, r);
          if ((slope_action !== 0)) {
            let ix = (px + ((horiz_y - py) / slope_action));
            if (!pinescript.na(ix)) {
              pinescript.arrayPush(inter_xs, ix);
            }
          }
        }
      }
      if ((pinescript.arraySize(inter_xs) > 0)) {
        let filtered_inter_xs = pinescript.arrayNew();
        for (let f = 0; f <= (pinescript.arraySize(inter_xs) - 1); f++) {
          let f_ix = pinescript.arrayGet(inter_xs, f);
          if (((f_ix >= 0) && (f_ix <= max_x))) {
            pinescript.arrayPush(filtered_inter_xs, f_ix);
          }
        }
        if ((pinescript.arraySize(filtered_inter_xs) > 0)) {
          let max_inter = pinescript.arrayMax(filtered_inter_xs);
          let min_inter = pinescript.arrayMin(filtered_inter_xs);
          let lat_median_y_upper = (anchor_y + (slope_ml * (upper_x - anchor_x)));
          let lat_offset_up = (upper_y - lat_median_y_upper);
          let lat_median_y_lower = (anchor_y + (slope_ml * (lower_x - anchor_x)));
          let lat_offset_lo = (lower_y - lat_median_y_lower);
          let lat_eff_upper_y = (upper_y + (state.effective_extra_upper * lat_offset_up));
          let lat_eff_lower_y = (lower_y + (state.effective_extra_lower * lat_offset_lo));
          if ((!pinescript.na(slope_ml) && (slope_ml !== 0))) {
            let upper_bound_x = (upper_x + ((horiz_y - lat_eff_upper_y) / slope_ml));
            let lower_bound_x = (lower_x + ((horiz_y - lat_eff_lower_y) / slope_ml));
            let envelope_max_x = null;
            if (((upper_bound_x >= pivot_x) && (lower_bound_x >= pivot_x))) {
              envelope_max_x = pinescript.min(upper_bound_x, lower_bound_x);
            } else {
              if ((upper_bound_x >= pivot_x)) {
                envelope_max_x = upper_bound_x;
              } else {
                if ((lower_bound_x >= pivot_x)) {
                  envelope_max_x = lower_bound_x;
                } else {
                  envelope_max_x = pivot_x;
                }
              }
            }
            let draw_max_x = max_inter;
            if (!pinescript.na(envelope_max_x)) {
              draw_max_x = pinescript.min(max_inter, envelope_max_x);
            }
            let horiz_start_x = pivot_x;
            if (((int(pinescript.round(draw_max_x)) <= (last_bar_index + MAX_BAR_EXTENSION)) && (int(pinescript.round(horiz_start_x)) <= (last_bar_index + MAX_BAR_EXTENSION)))) {
              let draw_horiz_y = (use_log ? math.exp(horiz_y) : horiz_y);
              pinescript.lineNew(int(pinescript.round(horiz_start_x)), draw_horiz_y, int(pinescript.round(draw_max_x)), draw_horiz_y, ({ color: lattice_color, width: lattice_width, style: lattice_line_style }));
            }
          }
        }
        for (let ii = 0; ii <= (pinescript.arraySize(inter_xs) - 1); ii++) {
          pinescript.arrayPush(all_inter_xs, pinescript.arrayGet(inter_xs, ii));
        }
      }
      if ((pinescript.arraySize(all_inter_xs) > 0)) {
        pinescript.arraySort(all_inter_xs);
        let unique_xs = pinescript.arrayNew();
        let last = pinescript.arrayGet(all_inter_xs, 0);
        pinescript.arrayPush(unique_xs, last);
        for (let uu = 1; uu <= (pinescript.arraySize(all_inter_xs) - 1); uu++) {
          let curr = pinescript.arrayGet(all_inter_xs, uu);
          if ((curr !== last)) {
            pinescript.arrayPush(unique_xs, curr);
            last = curr;
          }
        }
        for (let vv = 0; vv <= (pinescript.arraySize(unique_xs) - 1); vv++) {
          let v_x = pinescript.arrayGet(unique_xs, vv);
          if ((((v_x >= pivot_x) && (v_x >= min_x)) && (v_x <= max_x))) {
            if ((!pinescript.na(outer_upper_start_x) && !pinescript.na(outer_lower_start_x))) {
              let y_max = (outer_upper_start_y + (slope_ml * (v_x - outer_upper_start_x)));
              let y_min = (outer_lower_start_y + (slope_ml * (v_x - outer_lower_start_x)));
              let top = pinescript.max(y_min, y_max);
              let bot = pinescript.min(y_min, y_max);
              let draw_top = (use_log ? math.exp(top) : top);
              let draw_bot = (use_log ? math.exp(bot) : bot);
              pinescript.lineNew(int(pinescript.round(v_x)), draw_bot, int(pinescript.round(v_x)), draw_top, ({ color: lattice_color, width: lattice_width, style: lattice_line_style }));
            }
          }
        }
      }
    }
  }
  let price_y = (use_log ? math.log(close) : close);
  let prev_price_y = (use_log ? math.log(pinescript.offset(close, 1)) : pinescript.offset(close, 1));
  let median_y_at_upper = (anchor_y + (slope_ml * (upper_x - anchor_x)));
  let alert_offset_up = (upper_y - median_y_at_upper);
  let median_y_at_lower = (anchor_y + (slope_ml * (lower_x - anchor_x)));
  let alert_offset_lo = (lower_y - median_y_at_lower);
  let crossed_pitchfork = false;
  let crossed_action = false;
  let crossed_reaction = false;
  let crossed_lattice_h = false;
  if (((!pinescript.na(anchor_x) && !pinescript.na(slope_ml)) && (bar_index > pivotC_x))) {
    let ml_y_curr = f_line_y_at_bar(anchor_x, anchor_y, slope_ml, bar_index);
    let ml_y_prev = f_line_y_at_bar(anchor_x, anchor_y, slope_ml, (bar_index - 1));
    if (f_price_crossed_line(prev_price_y, price_y, ml_y_prev, ml_y_curr)) {
      crossed_pitchfork = true;
    }
    let up_y_curr = f_line_y_at_bar(upper_x, upper_y, slope_ml, bar_index);
    let up_y_prev = f_line_y_at_bar(upper_x, upper_y, slope_ml, (bar_index - 1));
    if (f_price_crossed_line(prev_price_y, price_y, up_y_prev, up_y_curr)) {
      crossed_pitchfork = true;
    }
    let lo_y_curr = f_line_y_at_bar(lower_x, lower_y, slope_ml, bar_index);
    let lo_y_prev = f_line_y_at_bar(lower_x, lower_y, slope_ml, (bar_index - 1));
    if (f_price_crossed_line(prev_price_y, price_y, lo_y_prev, lo_y_curr)) {
      crossed_pitchfork = true;
    }
    if ((state.effective_extra_upper > 0)) {
      for (let i = 1; i <= state.effective_extra_upper; i++) {
        let extra_up_ref_y = (upper_y + (float(i) * alert_offset_up));
        let ex_up_y_curr = f_line_y_at_bar(upper_x, extra_up_ref_y, slope_ml, bar_index);
        let ex_up_y_prev = f_line_y_at_bar(upper_x, extra_up_ref_y, slope_ml, (bar_index - 1));
        if (f_price_crossed_line(prev_price_y, price_y, ex_up_y_prev, ex_up_y_curr)) {
          crossed_pitchfork = true;
        }
      }
    }
    if ((state.effective_extra_lower > 0)) {
      for (let i = 1; i <= state.effective_extra_lower; i++) {
        let extra_lo_ref_y = (lower_y + (float(i) * alert_offset_lo));
        let ex_lo_y_curr = f_line_y_at_bar(lower_x, extra_lo_ref_y, slope_ml, bar_index);
        let ex_lo_y_prev = f_line_y_at_bar(lower_x, extra_lo_ref_y, slope_ml, (bar_index - 1));
        if (f_price_crossed_line(prev_price_y, price_y, ex_lo_y_prev, ex_lo_y_curr)) {
          crossed_pitchfork = true;
        }
      }
    }
    let alert_handle_dx = (mid_x - anchor_x);
    let alert_handle_dy = (mid_y - anchor_y);
    let alert_handle_len = pinescript.sqrt((pinescript.pow(alert_handle_dx, 2) + pinescript.pow(alert_handle_dy, 2)));
    let auto_alert_forward = 0;
    if ((alert_handle_dx !== 0)) {
      let alert_bars_to_current = (last_bar_index - anchor_x);
      auto_alert_forward = int(math.ceil(pinescript.abs((alert_bars_to_current / alert_handle_dx))));
      auto_alert_forward = pinescript.max(1, auto_alert_forward);
    }
    let alert_effective_forward = pinescript.max(1, (auto_alert_forward + forward_count));
    if (((alert_handle_len > 0) && (draw_type !== "None"))) {
      let alert_ux = (alert_handle_dx / alert_handle_len);
      let alert_uy = (alert_handle_dy / alert_handle_len);
      let eff_up_y = (upper_y + (state.effective_extra_upper * alert_offset_up));
      let eff_lo_y = (lower_y + (state.effective_extra_lower * alert_offset_lo));
      if ((backward_count > 0)) {
        for (let i = 0; i <= backward_count; i++) {
          let k = -i;
          let p_x = (anchor_x + ((float(k) * alert_handle_len) * alert_ux));
          let p_y = (anchor_y + ((float(k) * alert_handle_len) * alert_uy));
          if ((((draw_type === "Reaction Only") || (draw_type === "Both")) && !pinescript.na(slope_trans))) {
            let rx_upper = f_intersect_x(slope_trans, p_x, p_y, slope_ml, upper_x, eff_up_y);
            let rx_lower = f_intersect_x(slope_trans, p_x, p_y, slope_ml, lower_x, eff_lo_y);
            if ((!pinescript.na(rx_upper) && !pinescript.na(rx_lower))) {
              let seg_min_x = pinescript.min(rx_upper, rx_lower);
              let seg_max_x = pinescript.max(rx_upper, rx_lower);
              if (((bar_index >= seg_min_x) && (bar_index <= seg_max_x))) {
                let ry_curr = (p_y + (slope_trans * (bar_index - p_x)));
                let ry_prev = (p_y + (slope_trans * ((bar_index - 1) - p_x)));
                if (f_price_crossed_line(prev_price_y, price_y, ry_prev, ry_curr)) {
                  crossed_reaction = true;
                }
              }
            }
          }
          if ((((draw_type === "Action Only") || (draw_type === "Both")) && !pinescript.na(slope_action))) {
            let ax_upper = f_intersect_x(slope_action, p_x, p_y, slope_ml, upper_x, eff_up_y);
            let ax_lower = f_intersect_x(slope_action, p_x, p_y, slope_ml, lower_x, eff_lo_y);
            if ((!pinescript.na(ax_upper) && !pinescript.na(ax_lower))) {
              let seg_min_x = pinescript.min(ax_upper, ax_lower);
              let seg_max_x = pinescript.max(ax_upper, ax_lower);
              if (((bar_index >= seg_min_x) && (bar_index <= seg_max_x))) {
                let ay_curr = (p_y + (slope_action * (bar_index - p_x)));
                let ay_prev = (p_y + (slope_action * ((bar_index - 1) - p_x)));
                if (f_price_crossed_line(prev_price_y, price_y, ay_prev, ay_curr)) {
                  crossed_action = true;
                }
              }
            }
          }
        }
      }
      for (let i = 1; i <= alert_effective_forward; i++) {
        let k = i;
        let p_x = (anchor_x + ((float(k) * alert_handle_len) * alert_ux));
        let p_y = (anchor_y + ((float(k) * alert_handle_len) * alert_uy));
        if ((((draw_type === "Reaction Only") || (draw_type === "Both")) && !pinescript.na(slope_trans))) {
          let rx_upper = f_intersect_x(slope_trans, p_x, p_y, slope_ml, upper_x, eff_up_y);
          let rx_lower = f_intersect_x(slope_trans, p_x, p_y, slope_ml, lower_x, eff_lo_y);
          if ((!pinescript.na(rx_upper) && !pinescript.na(rx_lower))) {
            let seg_min_x = pinescript.min(rx_upper, rx_lower);
            let seg_max_x = pinescript.max(rx_upper, rx_lower);
            if (((bar_index >= seg_min_x) && (bar_index <= seg_max_x))) {
              let ry_curr = (p_y + (slope_trans * (bar_index - p_x)));
              let ry_prev = (p_y + (slope_trans * ((bar_index - 1) - p_x)));
              if (f_price_crossed_line(prev_price_y, price_y, ry_prev, ry_curr)) {
                crossed_reaction = true;
              }
            }
          }
        }
        if ((((draw_type === "Action Only") || (draw_type === "Both")) && !pinescript.na(slope_action))) {
          let ax_upper = f_intersect_x(slope_action, p_x, p_y, slope_ml, upper_x, eff_up_y);
          let ax_lower = f_intersect_x(slope_action, p_x, p_y, slope_ml, lower_x, eff_lo_y);
          if ((!pinescript.na(ax_upper) && !pinescript.na(ax_lower))) {
            let seg_min_x = pinescript.min(ax_upper, ax_lower);
            let seg_max_x = pinescript.max(ax_upper, ax_lower);
            if (((bar_index >= seg_min_x) && (bar_index <= seg_max_x))) {
              let ay_curr = (p_y + (slope_action * (bar_index - p_x)));
              let ay_prev = (p_y + (slope_action * ((bar_index - 1) - p_x)));
              if (f_price_crossed_line(prev_price_y, price_y, ay_prev, ay_curr)) {
                crossed_action = true;
              }
            }
          }
        }
      }
    }
    if (draw_lattice) {
      pivotC_y;
      pivotB_y;
      pivotA_y;
      let lattice_horiz_y = ((lattice_pivot === "A") ? undefined : ((lattice_pivot === "B") ? undefined : ((lattice_pivot === "C") ? undefined : null)));
      if (!pinescript.na(lattice_horiz_y)) {
        if (f_price_crossed_line(prev_price_y, price_y, lattice_horiz_y, lattice_horiz_y)) {
          crossed_lattice_h = true;
        }
      }
    }
  }
  alertcondition(crossed_pitchfork, ({ title: "Pitchfork Line Crossing", message: "Price crossed a pitchfork line (median or parallel)" }));
  alertcondition(crossed_action, ({ title: "Action Line Crossing", message: "Price crossed an action line" }));
  alertcondition(crossed_reaction, ({ title: "Reaction Line Crossing", message: "Price crossed a reaction line" }));
  alertcondition(crossed_lattice_h, ({ title: "Lattice Horizontal Crossing", message: "Price crossed lattice horizontal" }));
  alertcondition((((crossed_pitchfork || crossed_action) || crossed_reaction) || crossed_lattice_h), ({ title: "Any Line Crossing", message: "Price crossed a pitchfork, action, reaction, or lattice line" }));
}


// Export for use

export { main
};
