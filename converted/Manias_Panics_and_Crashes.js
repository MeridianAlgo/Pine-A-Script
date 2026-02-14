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
  time: 1771040624113,
  timenow: 1771040624113,
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
  // Study: Manias, Panics and Crashes
  // Options: {"shorttitle":"MPC","overlay":false,"max_labels_count":500}
  let color_green_bright = pinescript.color.hex("#00ff00");
  let color_green_soft = pinescript.color.hex("#26a69a");
  let color_yellow_bright = pinescript.color.hex("#ffd700");
  let color_orange_alert = pinescript.color.hex("#ff6b35");
  let color_red_danger = pinescript.color.hex("#ff1744");
  let color_purple_composite = pinescript.color.hex("#ab47bc");
  let color_gray_neutral = pinescript.color.hex("#78909c");
  let color_dark_bg = pinescript.color.hex("#1e1e1e");
  let display_mode = input.string("Smoothed All Lines", "Display Mode", ({ options: ["Smoothed All Lines", "Single Dominant Line", "Both"], group: "Display" }));
  let smooth_period = input.int(3, "Smoothing Period", ({ minval: 1, maxval: 20, group: "Display" }));
  let show_zones = input.bool(true, "Show Background Phase Zones", ({ group: "Display" }));
  let show_phase_labels = input.bool(true, "Show Phase Change Labels", ({ group: "Display" }));
  let show_historical_context = input.bool(true, "Show Historical Context", ({ group: "Display" }));
  let dashboard_position = input.string("Top Right", "Dashboard Position", ({ options: ["Top Left", "Top Center", "Top Right", "Middle Left", "Middle Right", "Bottom Left", "Bottom Right"], group: "Dashboard" }));
  let dashboard_size = input.string("Normal", "Dashboard Size", ({ options: ["Small", "Normal", "Large", "Extra Large"], group: "Dashboard" }));
  let show_components = input.bool(true, "Show Component Health Panel", ({ group: "Dashboard" }));
  let show_action_hints = input.bool(true, "Show Action Guidance", ({ group: "Dashboard" }));
  let mania_threshold = input.int(75, "Mania Alert Threshold", ({ minval: 0, maxval: 100, group: "Alert Thresholds" }));
  let panic_threshold = input.int(60, "Panic Alert Threshold", ({ minval: 0, maxval: 100, group: "Alert Thresholds" }));
  let crash_threshold = input.int(70, "Crash Alert Threshold", ({ minval: 0, maxval: 100, group: "Alert Thresholds" }));
  let ma_period = input.int(200, "Long-term MA Period", ({ minval: 50, maxval: 300, group: "Technical Parameters" }));
  let rsi_period = input.int(14, "RSI Period", ({ minval: 5, maxval: 30, group: "Technical Parameters" }));
  let vol_period = input.int(20, "Volume Average Period", ({ minval: 10, maxval: 50, group: "Technical Parameters" }));
  let show_credit = input.bool(true, "Include Credit Risk Indicators", ({ group: "Components" }));
  let show_breadth = input.bool(true, "Include Market Breadth", ({ group: "Components" }));
  let show_vix = input.bool(true, "Include VIX Analysis", ({ group: "Components" }));
  let vix = (show_vix ? pinescript.requestSecurity("TVC:VIX", timeframe.period, close) : null);
  let vix_5 = (show_vix ? pinescript.requestSecurity("TVC:VIX", timeframe.period, pinescript.offset(close, 5)) : null);
  let hyg = (show_credit ? pinescript.requestSecurity("AMEX:HYG", timeframe.period, close) : null);
  let lqd = (show_credit ? pinescript.requestSecurity("AMEX:LQD", timeframe.period, close) : null);
  let tlt = (show_credit ? pinescript.requestSecurity("NASDAQ:TLT", timeframe.period, close) : null);
  let xlf = (show_credit ? pinescript.requestSecurity("AMEX:XLF", timeframe.period, close) : null);
  let spy = (show_credit ? pinescript.requestSecurity("AMEX:SPY", timeframe.period, close) : null);
  let adv_dec = (show_breadth ? pinescript.requestSecurity("INDEX:ADDN", timeframe.period, close) : null);
  let hyg_lqd_ratio = (((show_credit && !pinescript.na(hyg)) && !pinescript.na(lqd)) ? (lqd / hyg) : null);
  let hyg_lqd_spread = hyg_lqd_ratio;
  let hyg_lqd_baseline = pinescript.sma(hyg_lqd_spread, 60);
  let hyg_lqd_stress = (((show_credit && !pinescript.na(hyg_lqd_spread)) && !pinescript.na(hyg_lqd_baseline)) ? (((hyg_lqd_spread - hyg_lqd_baseline) / hyg_lqd_baseline) * 100) : 0);
  let tlt_spy_ratio = (((show_credit && !pinescript.na(tlt)) && !pinescript.na(spy)) ? (tlt / spy) : null);
  let tlt_spy_baseline = pinescript.sma(tlt_spy_ratio, 60);
  let tlt_spy_flight = (((show_credit && !pinescript.na(tlt_spy_ratio)) && !pinescript.na(tlt_spy_baseline)) ? (((tlt_spy_ratio - tlt_spy_baseline) / tlt_spy_baseline) * 100) : 0);
  let xlf_spy_ratio = (((show_credit && !pinescript.na(xlf)) && !pinescript.na(spy)) ? (xlf / spy) : null);
  let xlf_spy_baseline = pinescript.sma(xlf_spy_ratio, 60);
  let xlf_spy_weakness = (((show_credit && !pinescript.na(xlf_spy_ratio)) && !pinescript.na(xlf_spy_baseline)) ? (((xlf_spy_baseline - xlf_spy_ratio) / xlf_spy_baseline) * 100) : 0);
  let credit_stress_raw = (show_credit ? (((hyg_lqd_stress * 0.4) + (tlt_spy_flight * 0.3)) + (xlf_spy_weakness * 0.3)) : 0);
  let credit_stress = pinescript.max(0, pinescript.min(100, (credit_stress_raw * 5)));
  let ma_long = pinescript.sma(close, ma_period);
  let price_deviation = (((close - ma_long) / ma_long) * 100);
  let rsi = ta.rsi(close, rsi_period);
  let rsi_overbought_days = ta.barssince((rsi < 70));
  let rsi_oversold = (rsi < 30);
  let roc = ta.roc(close, 20);
  let roc_ma = pinescript.sma(roc, 20);
  let roc_accelerating = (roc > roc_ma);
  let vol_avg = pinescript.sma(volume, vol_period);
  let vol_spike = (volume / vol_avg);
  let high_vol_down = ((vol_spike > 1.5) && (close < open));
  let [macd_line, signal_line, ] = ta.macd(close, 12, 26, 9);
  let macd_bearish = pinescript.cross(macd_line, signal_line);
  let vix_spike = (((show_vix && !pinescript.na(vix)) && !pinescript.na(vix_5)) ? ((vix > (vix_5 * 1.3)) || (vix > 25)) : false);
  let vix_extreme = ((show_vix && !pinescript.na(vix)) ? (vix > 40) : false);
  let vix_low = ((show_vix && !pinescript.na(vix)) ? (vix < 20) : false);
  let peak_20 = pinescript.highest(close, 20);
  let peak_60 = pinescript.highest(close, 60);
  let decline_20 = (((close - peak_20) / peak_20) * 100);
  let decline_60 = (((close - peak_60) / peak_60) * 100);
  let price_above_50ma = (close > pinescript.sma(close, 50));
  let breadth_proxy = (show_breadth ? (pinescript.sma((price_above_50ma ? 1 : 0), 20) * 100) : 50);
  let correlation_proxy = (pinescript.abs(ta.correlation(close, ma_long, 20)) * 100);
  let mania_price = ((price_deviation > 15) ? 25 : ((price_deviation > 10) ? 15 : 0));
  let mania_rsi = (((rsi > 70) && (rsi_overbought_days > 10)) ? 25 : ((rsi > 70) ? 15 : 0));
  let mania_breadth = ((breadth_proxy > 60) ? 20 : ((breadth_proxy > 50) ? 10 : 0));
  let mania_vix = (vix_low ? 15 : 0);
  let mania_momentum = ((roc_accelerating && (roc > 0)) ? 15 : 0);
  let mania_score_raw = ((((mania_price + mania_rsi) + mania_breadth) + mania_vix) + mania_momentum);
  let panic_decline = (((decline_20 < -5) && (decline_20 > -15)) ? 20 : 0);
  let panic_vix_spike = (vix_spike ? 20 : 0);
  let panic_volume = (high_vol_down ? 15 : 0);
  let panic_breadth = ((breadth_proxy < 40) ? 15 : 0);
  let panic_credit = ((credit_stress > 30) ? 15 : 0);
  let panic_momentum = (macd_bearish ? 15 : 0);
  let panic_score_raw = (((((panic_decline + panic_vix_spike) + panic_volume) + panic_breadth) + panic_credit) + panic_momentum);
  let crash_extreme_decline = ((decline_60 < -15) ? 25 : ((decline_60 < -10) ? 15 : 0));
  let crash_vix_extreme = (vix_extreme ? 20 : 0);
  let crash_volume_climax = (((vol_spike > 2) && (close < open)) ? 15 : 0);
  let crash_breadth_collapse = ((breadth_proxy < 20) ? 15 : 0);
  let crash_correlation = ((correlation_proxy > 80) ? 15 : 0);
  let crash_credit_freeze = ((credit_stress > 60) ? 10 : 0);
  let crash_score_raw = (((((crash_extreme_decline + crash_vix_extreme) + crash_volume_climax) + crash_breadth_collapse) + crash_correlation) + crash_credit_freeze);
  let mania_score = pinescript.sma(mania_score_raw, smooth_period);
  let panic_score = pinescript.sma(panic_score_raw, smooth_period);
  let crash_score = pinescript.sma(crash_score_raw, smooth_period);
  let composite_risk = pinescript.max(mania_score, pinescript.max(panic_score, crash_score));
  if (state.phase === undefined) state.phase = "NORMAL";
  if (state.phase_color === undefined) state.phase_color = color_green_soft;
  if (state.phase_start_bar === undefined) state.phase_start_bar = null;
  let new_phase = "NORMAL";
  if ((crash_score > crash_threshold)) {
    {
      new_phase = "CRASH";
    }
  } else {
    if ((panic_score > panic_threshold)) {
      {
        new_phase = "PANIC";
      }
    } else {
      if ((mania_score > mania_threshold)) {
        {
          new_phase = "MANIA";
        }
      }
    }
  }
  let phase_changed = (new_phase !== state.phase);
  if (phase_changed) {
    {
      state.phase = new_phase;
      state.phase_start_bar = bar_index;
    }
  }
  state.phase_color = ((state.phase === "CRASH") ? color_red_danger : ((state.phase === "PANIC") ? color_orange_alert : ((state.phase === "MANIA") ? color_yellow_bright : color_green_soft)));
  let days_in_phase = (!pinescript.na(state.phase_start_bar) ? ((bar_index - state.phase_start_bar) + 1) : 0);
  if (state.historical_context === undefined) state.historical_context = "";
  if (show_historical_context) {
    {
      if ((state.phase === "CRASH")) {
        {
          if ((crash_score > 90)) {
            {
              state.historical_context = "Similar to: 2008 Crisis Peak";
            }
          } else {
            if ((crash_score > 80)) {
              {
                state.historical_context = "Similar to: COVID-19 March 2020";
              }
            } else {
              {
                state.historical_context = "Similar to: Dec 2018 Selloff";
              }
            }
          }
        }
      } else {
        if ((state.phase === "PANIC")) {
          {
            if ((panic_score > 75)) {
              {
                state.historical_context = "Similar to: Pre-2020 Crash";
              }
            } else {
              {
                state.historical_context = "Similar to: Flash Crash";
              }
            }
          }
        } else {
          if ((state.phase === "MANIA")) {
            {
              if ((mania_score > 85)) {
                {
                  state.historical_context = "Similar to: Dot-Com Bubble 2000";
                }
              } else {
                {
                  state.historical_context = "Similar to: Pre-2008 Peak";
                }
              }
            }
          } else {
            {
              state.historical_context = "Normal Market Conditions";
            }
          }
        }
      }
    }
  }
  if (state.action_hint === undefined) state.action_hint = "";
  if (show_action_hints) {
    {
      if ((state.phase === "CRASH")) {
        {
          state.action_hint = "🆘 CAPITULATION - Prepare to Buy Quality";
        }
      } else {
        if ((state.phase === "PANIC")) {
          {
            state.action_hint = "⚠️ RAISE CASH - Avoid Buying Dips";
          }
        } else {
          if ((state.phase === "MANIA")) {
            {
              state.action_hint = "⚠️ REDUCE EXPOSURE - Take Profits";
            }
          } else {
            if ((composite_risk > 50)) {
              {
                state.action_hint = "⚡ ELEVATED RISK - Monitor Closely";
              }
            } else {
              {
                state.action_hint = "✅ NORMAL - Continue Regular Strategy";
              }
            }
          }
        }
      }
    }
  }
  let vix_status = ((show_vix && !pinescript.na(vix)) ? ((vix > 40) ? "🔴 EXTREME" : ((vix > 25) ? "🟠 HIGH" : ((vix < 20) ? "🟢 LOW" : "🟡 MODERATE"))) : "N/A");
  let credit_status = (show_credit ? ((credit_stress > 70) ? "🔴 FREEZE" : ((credit_stress > 40) ? "🟠 STRESS" : ((credit_stress > 20) ? "🟡 ELEVATED" : "🟢 NORMAL"))) : "N/A");
  let breadth_status = (show_breadth ? ((breadth_proxy < 20) ? "🔴 COLLAPSE" : ((breadth_proxy < 40) ? "🟠 WEAK" : ((breadth_proxy > 60) ? "🟢 STRONG" : "🟡 NEUTRAL"))) : "N/A");
  let momentum_status = ((rsi > 70) ? "🔴 OVERBOUGHT" : ((rsi < 30) ? "🟢 OVERSOLD" : ((roc > 5) ? "🟢 BULLISH" : ((roc < -5) ? "🔴 BEARISH" : "🟡 NEUTRAL"))));
  if (((show_phase_labels && phase_changed) && barstate.isconfirmed)) {
    {
      if ((state.phase !== "NORMAL")) {
        {
          let label_text = ((state.phase === "CRASH") ? "🔴 CRASH" : ((state.phase === "PANIC") ? "🟠 PANIC" : ((state.phase === "MANIA") ? "🟡 MANIA" : "")));
          let label_color = ((state.phase === "CRASH") ? pinescript.color.new(color_red_danger, 0) : ((state.phase === "PANIC") ? pinescript.color.new(color_orange_alert, 0) : ((state.phase === "MANIA") ? pinescript.color.new(color_yellow_bright, 0) : null)));
          if ((label_text !== "")) {
            {
              pinescript.labelNew(bar_index, composite_risk, label_text, ({ style: label.style_label_down, color: label_color, textcolor: pinescript.color.white, size: pinescript.size.large, textalign: pinescript.text.align_center }));
            }
          }
        }
      }
    }
  }
  let show_all_lines = ((display_mode === "Smoothed All Lines") || (display_mode === "Both"));
  let show_dominant_only = ((display_mode === "Single Dominant Line") || (display_mode === "Both"));
  pinescript.plot((show_all_lines ? mania_score : null), ({ title: "Mania Score", color: pinescript.color.new(color_yellow_bright, 0), linewidth: 2 }));
  pinescript.plot((show_all_lines ? panic_score : null), ({ title: "Panic Score", color: pinescript.color.new(color_orange_alert, 0), linewidth: 2 }));
  pinescript.plot((show_all_lines ? crash_score : null), ({ title: "Crash Score", color: pinescript.color.new(color_red_danger, 0), linewidth: 2 }));
  let dominant_color = ((state.phase === "CRASH") ? color_red_danger : ((state.phase === "PANIC") ? color_orange_alert : ((state.phase === "MANIA") ? color_yellow_bright : color_gray_neutral)));
  pinescript.plot((show_dominant_only ? composite_risk : null), ({ title: "Dominant Risk", color: pinescript.color.new(dominant_color, 0), linewidth: 4, style: plot.style_line }));
  let bg_color = (show_zones ? ((state.phase === "CRASH") ? pinescript.color.new(color_red_danger, 88) : ((state.phase === "PANIC") ? pinescript.color.new(color_orange_alert, 92) : ((state.phase === "MANIA") ? pinescript.color.new(color_yellow_bright, 94) : pinescript.color.new(color_green_soft, 96)))) : null);
  pinescript.bgcolor(bg_color, ({ title: "Phase Background" }));
  pinescript.hline(100, "Max", ({ color: pinescript.color.new(color_gray_neutral, 70), linestyle: hline.style_solid }));
  pinescript.hline(crash_threshold, "Crash Threshold", ({ color: pinescript.color.new(color_red_danger, 50), linestyle: hline.style_dashed, linewidth: 2 }));
  pinescript.hline(panic_threshold, "Panic Threshold", ({ color: pinescript.color.new(color_orange_alert, 50), linestyle: hline.style_dashed, linewidth: 2 }));
  pinescript.hline(mania_threshold, "Mania Threshold", ({ color: pinescript.color.new(color_yellow_bright, 50), linestyle: hline.style_dashed, linewidth: 2 }));
  pinescript.hline(0, "Min", ({ color: pinescript.color.new(color_gray_neutral, 70), linestyle: hline.style_solid }));
  let h100 = pinescript.hline(100, ({ color: pinescript.color.new(pinescript.color.gray, 100) }));
  let h85 = pinescript.hline(85, ({ color: pinescript.color.new(pinescript.color.gray, 100) }));
  let h60 = pinescript.hline(60, ({ color: pinescript.color.new(pinescript.color.gray, 100) }));
  let h30 = pinescript.hline(30, ({ color: pinescript.color.new(pinescript.color.gray, 100) }));
  let h0 = pinescript.hline(0, ({ color: pinescript.color.new(pinescript.color.gray, 100) }));
  pinescript.fill(h85, h100, ({ color: pinescript.color.new(color_red_danger, 92), title: "Extreme Risk" }));
  pinescript.fill(h60, h85, ({ color: pinescript.color.new(color_orange_alert, 92), title: "High Risk" }));
  pinescript.fill(h30, h60, ({ color: pinescript.color.new(color_yellow_bright, 95), title: "Elevated Risk" }));
  pinescript.fill(h0, h30, ({ color: pinescript.color.new(color_green_soft, 95), title: "Normal" }));
  if (state.h_position === undefined) state.h_position = pinescript.position.top_right;
  if ((dashboard_position === "Top Left")) {
    {
      state.h_position = pinescript.position.top_left;
    }
  } else {
    if ((dashboard_position === "Top Center")) {
      {
        state.h_position = pinescript.position.top_center;
      }
    } else {
      if ((dashboard_position === "Top Right")) {
        {
          state.h_position = pinescript.position.top_right;
        }
      } else {
        if ((dashboard_position === "Middle Left")) {
          {
            state.h_position = pinescript.position.middle_left;
          }
        } else {
          if ((dashboard_position === "Middle Right")) {
            {
              state.h_position = pinescript.position.middle_right;
            }
          } else {
            if ((dashboard_position === "Bottom Left")) {
              {
                state.h_position = pinescript.position.bottom_left;
              }
            } else {
              if ((dashboard_position === "Bottom Right")) {
                {
                  state.h_position = pinescript.position.bottom_right;
                }
              }
            }
          }
        }
      }
    }
  }
  if (state.text_size_header === undefined) state.text_size_header = pinescript.size.large;
  if (state.text_size_normal === undefined) state.text_size_normal = pinescript.size.normal;
  if (state.text_size_small === undefined) state.text_size_small = pinescript.size.small;
  if ((dashboard_size === "Small")) {
    {
      state.text_size_header = pinescript.size.normal;
      state.text_size_normal = pinescript.size.small;
      state.text_size_small = pinescript.size.tiny;
    }
  } else {
    if ((dashboard_size === "Large")) {
      {
        state.text_size_header = pinescript.size.large;
        state.text_size_normal = pinescript.size.normal;
        state.text_size_small = pinescript.size.small;
      }
    } else {
      if ((dashboard_size === "Extra Large")) {
        {
          state.text_size_header = pinescript.size.huge;
          state.text_size_normal = pinescript.size.large;
          state.text_size_small = pinescript.size.normal;
        }
      }
    }
  }
  let title_rows = 1;
  let base_rows = 4;
  let component_rows = (show_components ? 5 : 0);
  let total_rows = ((title_rows + base_rows) + component_rows);
  if (state.dashboard === undefined) state.dashboard = pinescript.table.new(state.h_position, 2, total_rows, ({ bgcolor: pinescript.color.new(color_dark_bg, 80), border_width: 3, border_color: state.phase_color }));
  if (barstate.islast) {
    {
      let row = 0;
      pinescript.table.cell(state.dashboard, 0, row, "", ({ bgcolor: pinescript.color.new(state.phase_color, 20) }));
      pinescript.table.cell(state.dashboard, 1, row, "🟡 Manias, 🟠 Panics and 🔴 Crashes", ({ text_color: pinescript.color.white, text_size: state.text_size_header, text_halign: pinescript.text.align_center, bgcolor: pinescript.color.new(state.phase_color, 20) }));
      row = (row + 1);
      pinescript.table.cell(state.dashboard, 0, row, "PHASE", ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_gray_neutral, 60) }));
      pinescript.table.cell(state.dashboard, 1, row, state.phase, ({ text_color: state.phase_color, text_size: state.text_size_header, bgcolor: pinescript.color.new(color_dark_bg, 50) }));
      row = (row + 1);
      let risk_display = (pinescript.strToString(pinescript.round(composite_risk)) + " / 100");
      let risk_label = ((composite_risk > 85) ? "🔴 EXTREME RISK" : ((composite_risk > 60) ? "🟠 HIGH RISK" : ((composite_risk > 30) ? "🟡 ELEVATED RISK" : "🟢 LOW RISK")));
      pinescript.table.cell(state.dashboard, 0, row, "RISK", ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_gray_neutral, 60) }));
      pinescript.table.cell(state.dashboard, 1, row, ((risk_display + "n") + risk_label), ({ text_color: state.phase_color, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 50) }));
      row = (row + 1);
      if (show_action_hints) {
        {
          pinescript.table.cell(state.dashboard, 0, row, "ACTION", ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_gray_neutral, 60) }));
          pinescript.table.cell(state.dashboard, 1, row, state.action_hint, ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 50) }));
          row = (row + 1);
        }
      }
      if (show_historical_context) {
        {
          pinescript.table.cell(state.dashboard, 0, row, "CONTEXT", ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_gray_neutral, 60) }));
          pinescript.table.cell(state.dashboard, 1, row, ((((state.historical_context + "nDay ") + pinescript.strToString(days_in_phase)) + " of ") + state.phase), ({ text_color: pinescript.color.gray, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 50) }));
          row = (row + 1);
        }
      }
      if (show_components) {
        {
          pinescript.table.cell(state.dashboard, 0, row, "COMPONENTS", ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_purple_composite, 40) }));
          pinescript.table.cell(state.dashboard, 1, row, "STATUS", ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_purple_composite, 40) }));
          row = (row + 1);
          let vix_value = ((show_vix && !pinescript.na(vix)) ? pinescript.strToString((pinescript.round((vix * 10)) / 10)) : "N/A");
          pinescript.table.cell(state.dashboard, 0, row, ("VIX (Fear): " + vix_value), ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 65) }));
          pinescript.table.cell(state.dashboard, 1, row, vix_status, ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 65) }));
          row = (row + 1);
          let credit_value = (show_credit ? pinescript.strToString(pinescript.round(credit_stress)) : "N/A");
          pinescript.table.cell(state.dashboard, 0, row, ("Credit (Bonds): " + credit_value), ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 65) }));
          pinescript.table.cell(state.dashboard, 1, row, credit_status, ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 65) }));
          row = (row + 1);
          let breadth_value = (show_breadth ? (pinescript.strToString(pinescript.round(breadth_proxy)) + "%") : "N/A");
          pinescript.table.cell(state.dashboard, 0, row, ("Breadth (Participation): " + breadth_value), ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 65) }));
          pinescript.table.cell(state.dashboard, 1, row, breadth_status, ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 65) }));
          row = (row + 1);
          let rsi_value = pinescript.strToString(pinescript.round(rsi));
          pinescript.table.cell(state.dashboard, 0, row, ("Momentum (RSI): " + rsi_value), ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 65) }));
          pinescript.table.cell(state.dashboard, 1, row, momentum_status, ({ text_color: pinescript.color.white, text_size: state.text_size_normal, bgcolor: pinescript.color.new(color_dark_bg, 65) }));
        }
      }
    }
  }
  let mania_alert = ((state.phase === "MANIA") && (pinescript.offset(state.phase, 1) !== "MANIA"));
  let panic_alert = ((state.phase === "PANIC") && (pinescript.offset(state.phase, 1) !== "PANIC"));
  let crash_alert = ((state.phase === "CRASH") && (pinescript.offset(state.phase, 1) !== "CRASH"));
  let breadth_collapse_alert = ((breadth_proxy < 30) && (pinescript.offset(breadth_proxy, 1) >= 30));
  let vix_spike_alert = ((((show_vix && !pinescript.na(vix)) && !pinescript.na(vix_5)) && (vix > (vix_5 * 1.3))) && (pinescript.offset(vix, 1) <= (pinescript.offset(vix_5, 1) * 1.3)));
  let credit_freeze_alert = ((credit_stress > 70) && (pinescript.offset(credit_stress, 1) <= 70));
  alertcondition(mania_alert, ({ title: "🟡 Mania Phase Detected", message: "🟡 MANIA PHASE: Elevated crash risk detected. Consider reducing exposure and taking profits." }));
  alertcondition(panic_alert, ({ title: "🟠 Panic Phase Detected", message: "🟠 PANIC PHASE: Severe market stress detected. Consider raising cash and avoiding buying dips." }));
  alertcondition(crash_alert, ({ title: "🔴 CRASH DETECTED", message: "🔴 CRASH PHASE: Capitulation event detected. Extreme risk - prepare to buy quality after capitulation." }));
  alertcondition(breadth_collapse_alert, ({ title: "⚠️ Breadth Collapse", message: "⚠️ Market breadth collapsed below 30% - participation deteriorating rapidly." }));
  alertcondition(vix_spike_alert, ({ title: "⚠️ VIX Spike", message: "⚠️ VIX spiked >30% in 5 days - fear increasing rapidly." }));
  alertcondition(credit_freeze_alert, ({ title: "⚠️ Credit Freeze", message: "⚠️ Credit stress extreme - potential liquidity crisis developing." }));
  plotchar(composite_risk, ({ title: "Composite Risk", char: "", location: pinescript.location.top, display: display.data_window }));
  plotchar(mania_score, ({ title: "Mania Score", char: "", location: pinescript.location.top, display: display.data_window }));
  plotchar(panic_score, ({ title: "Panic Score", char: "", location: pinescript.location.top, display: display.data_window }));
  plotchar(crash_score, ({ title: "Crash Score", char: "", location: pinescript.location.top, display: display.data_window }));
  plotchar((show_vix ? vix : null), ({ title: "VIX", char: "", location: pinescript.location.top, display: display.data_window }));
  plotchar(credit_stress, ({ title: "Credit Stress", char: "", location: pinescript.location.top, display: display.data_window }));
  plotchar(breadth_proxy, ({ title: "Breadth %", char: "", location: pinescript.location.top, display: display.data_window }));
}


// Export for use

export { main
};
