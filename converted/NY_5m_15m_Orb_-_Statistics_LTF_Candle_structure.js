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
  time: 1771040624291,
  timenow: 1771040624291,
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

const LTFCandles = { new: function(bodies, wicks_high, wicks_low, opens, highs, lows, closes) { return { bodies: bodies, wicks_high: wicks_high, wicks_low: wicks_low, opens: opens, highs: highs, lows: lows, closes: closes }; } };

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
  // Study: 
  // Options: {"title":"NY Opening Range (Enhanced with LTF)","shorttitle":"NY ORB","overlay":true,"max_lines_count":500,"max_labels_count":500,"max_boxes_count":500,"max_bars_back":5000}
  if (state.g_5MIN === undefined) state.g_5MIN = "━━━━━━━━━ 5-MINUTE ORB ━━━━━━━━━";
  let show_5min = input.bool(true, "Show 5-Minute ORB", ({ group: state.g_5MIN }));
  let bullish_color_5m = input.color(pinescript.color.rgb(0, 255, 149), "Bullish Color", ({ inline: "5mc", group: state.g_5MIN }));
  let bearish_color_5m = input.color(pinescript.color.rgb(195, 0, 255), "Bearish Color", ({ inline: "5mc", group: state.g_5MIN }));
  let bullish_fill_5m = input.color(pinescript.color.rgb(0, 255, 149, 85), "Bullish Fill", ({ inline: "5mf", group: state.g_5MIN }));
  let bearish_fill_5m = input.color(pinescript.color.rgb(195, 0, 255, 85), "Bearish Fill", ({ inline: "5mf", group: state.g_5MIN }));
  let boxStyle_5m = input.string("Solid", "Range Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "5box", group: state.g_5MIN }));
  let borderWidth_5m = input.int(1, "Width", 1, 10, ({ inline: "5box", group: state.g_5MIN }));
  let show_midLine_5m = input.bool(true, "Show Midline", ({ inline: "5mid", group: state.g_5MIN }));
  let lineStyle_5m = input.string("Dashed", "Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "5mid", group: state.g_5MIN }));
  let lineWidth_5m = input.int(1, "Width", 1, 10, ({ inline: "5mid", group: state.g_5MIN }));
  let show_extensions_5m = input.bool(true, "Show Median Extensions", ({ inline: "5ext", group: state.g_5MIN }));
  let ext_line_style_5m = input.string("Dotted", "Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "5ext", group: state.g_5MIN }));
  let ext_line_width_5m = input.int(1, "Width", ({ minval: 1, maxval: 5, inline: "5ext", group: state.g_5MIN }));
  let show_ext_labels_5m = input.bool(true, "Show Extension Labels", ({ group: state.g_5MIN }));
  let show_ltf_5m = input.bool(true, "Show LTF Candles", ({ group: state.g_5MIN }));
  let ltf_5m_count = input.int(5, "  └─ Number of Candles", ({ minval: 1, maxval: 20, group: state.g_5MIN }));
  let ltf_offset_5m = input.int(5, "  └─ Offset (bars from right)", ({ minval: 1, maxval: 100, group: state.g_5MIN }));
  let ltf_spacing_5m = input.int(3, "  └─ Candle Spacing", ({ minval: 1, maxval: 5, group: state.g_5MIN }));
  let ltf_width_5m = input.int(2, "  └─ Candle Width", ({ minval: 1, maxval: 5, group: state.g_5MIN }));
  let ltf_bull_color_5m = input.color(pinescript.color.rgb(0, 255, 149, 60), "  └─ LTF Bullish Color", ({ group: state.g_5MIN }));
  let ltf_bear_color_5m = input.color(pinescript.color.rgb(195, 0, 255, 60), "  └─ LTF Bearish Color", ({ group: state.g_5MIN }));
  let show_ltf_range_5m = input.bool(true, "  └─ Show LTF High/Low Lines", ({ group: state.g_5MIN }));
  let ltf_range_style_5m = input.string("Dotted", "  └─ LTF Range Style", ({ options: ["Solid", "Dashed", "Dotted"], group: state.g_5MIN }));
  let ltf_range_width_5m = input.int(1, "  └─ LTF Range Width", ({ minval: 1, maxval: 5, group: state.g_5MIN }));
  let ltf_range_color_5m = input.color(pinescript.color.rgb(0, 255, 149, 50), "  └─ LTF Range Color", ({ group: state.g_5MIN }));
  if (state.g_15MIN === undefined) state.g_15MIN = "━━━━━━━━━ 15-MINUTE ORB ━━━━━━━━━";
  let show_15min = input.bool(true, "Show 15-Minute ORB", ({ group: state.g_15MIN }));
  let bullish_color_15m = input.color(pinescript.color.rgb(33, 150, 243), "Bullish Color", ({ inline: "15mc", group: state.g_15MIN }));
  let bearish_color_15m = input.color(pinescript.color.rgb(255, 152, 0), "Bearish Color", ({ inline: "15mc", group: state.g_15MIN }));
  let bullish_fill_15m = input.color(pinescript.color.rgb(33, 150, 243, 85), "Bullish Fill", ({ inline: "15mf", group: state.g_15MIN }));
  let bearish_fill_15m = input.color(pinescript.color.rgb(255, 152, 0, 85), "Bearish Fill", ({ inline: "15mf", group: state.g_15MIN }));
  let boxStyle_15m = input.string("Solid", "Range Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "15box", group: state.g_15MIN }));
  let borderWidth_15m = input.int(1, "Width", 1, 10, ({ inline: "15box", group: state.g_15MIN }));
  let show_midLine_15m = input.bool(true, "Show Midline", ({ inline: "15mid", group: state.g_15MIN }));
  let lineStyle_15m = input.string("Dashed", "Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "15mid", group: state.g_15MIN }));
  let lineWidth_15m = input.int(1, "Width", 1, 10, ({ inline: "15mid", group: state.g_15MIN }));
  let show_extensions_15m = input.bool(true, "Show Median Extensions", ({ inline: "15ext", group: state.g_15MIN }));
  let ext_line_style_15m = input.string("Dotted", "Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "15ext", group: state.g_15MIN }));
  let ext_line_width_15m = input.int(1, "Width", ({ minval: 1, maxval: 5, inline: "15ext", group: state.g_15MIN }));
  let show_ext_labels_15m = input.bool(true, "Show Extension Labels", ({ group: state.g_15MIN }));
  let show_ltf_15m = input.bool(true, "Show LTF Candles", ({ group: state.g_15MIN }));
  let ltf_15m_count = input.int(15, "  └─ Number of Candles", ({ minval: 1, maxval: 20, group: state.g_15MIN }));
  let ltf_offset_15m = input.int(35, "  └─ Offset (bars from right)", ({ minval: 1, maxval: 100, group: state.g_15MIN }));
  let ltf_spacing_15m = input.int(3, "  └─ Candle Spacing", ({ minval: 1, maxval: 5, group: state.g_15MIN }));
  let ltf_width_15m = input.int(2, "  └─ Candle Width", ({ minval: 1, maxval: 5, group: state.g_15MIN }));
  let ltf_bull_color_15m = input.color(pinescript.color.rgb(0, 255, 149, 60), "  └─ LTF Bullish Color", ({ group: state.g_15MIN }));
  let ltf_bear_color_15m = input.color(pinescript.color.rgb(195, 0, 255, 60), "  └─ LTF Bearish Color", ({ group: state.g_15MIN }));
  let show_ltf_range_15m = input.bool(true, "  └─ Show LTF High/Low Lines", ({ group: state.g_15MIN }));
  let ltf_range_style_15m = input.string("Dotted", "  └─ LTF Range Style", ({ options: ["Solid", "Dashed", "Dotted"], group: state.g_15MIN }));
  let ltf_range_width_15m = input.int(1, "  └─ LTF Range Width", ({ minval: 1, maxval: 5, group: state.g_15MIN }));
  let ltf_range_color_15m = input.color(pinescript.color.rgb(33, 150, 243, 50), "  └─ LTF Range Color", ({ group: state.g_15MIN }));
  if (state.g_LABELS === undefined) state.g_LABELS = "Labels & Display";
  let showL = input.bool(true, "Show High/Low/Mid Labels", ({ inline: "Labels", group: state.g_LABELS }));
  let showP = input.bool(false, "Show Prices", ({ inline: "Labels", group: state.g_LABELS }));
  let pos = input.string("Left", "Position", ({ options: ["Left", "Right"], group: state.g_LABELS }));
  if (state.g_TABLE === undefined) state.g_TABLE = "Statistics Table";
  let show_stats_table = input.bool(true, "Show Statistics Table", ({ group: state.g_TABLE }));
  let stats_table_pos = input.string("Top Right", "Table Position", ({ options: ["Bottom Center", "Bottom Left", "Bottom Right", "Middle Center", "Middle Left", "Middle Right", "Top Center", "Top Left", "Top Right"], group: state.g_TABLE }));
  let stats_table_size = input.string("Small", "Table Size", ({ options: ["Auto", "Tiny", "Small", "Normal", "Large", "Huge"], group: state.g_TABLE }));
  function get_style(style) {
    line.style_dotted;
    line.style_dashed;
    line.style_solid;
    return ((style === "Solid") ? undefined : ((style === "Dashed") ? undefined : ((style === "Dotted") ? undefined : null)));
  }
  function get_label_size(size) {
    pinescript.size.huge;
    pinescript.size.large;
    pinescript.size.normal;
    pinescript.size.small;
    pinescript.size.tiny;
    return ((pinescript.size === "Tiny") ? undefined : ((pinescript.size === "Small") ? undefined : ((pinescript.size === "Normal") ? undefined : ((pinescript.size === "Large") ? undefined : ((pinescript.size === "Huge") ? undefined : null)))));
  }
  function get_table_position(pos) {
    pinescript.position.top_right;
    pinescript.position.top_left;
    pinescript.position.top_center;
    pinescript.position.middle_right;
    pinescript.position.middle_left;
    pinescript.position.middle_center;
    pinescript.position.bottom_right;
    pinescript.position.bottom_left;
    pinescript.position.bottom_center;
    return ((pos === "Bottom Center") ? undefined : ((pos === "Bottom Left") ? undefined : ((pos === "Bottom Right") ? undefined : ((pos === "Middle Center") ? undefined : ((pos === "Middle Left") ? undefined : ((pos === "Middle Right") ? undefined : ((pos === "Top Center") ? undefined : ((pos === "Top Left") ? undefined : ((pos === "Top Right") ? undefined : null)))))))));
  }
  function get_table_text_size(size) {
    pinescript.size.huge;
    pinescript.size.large;
    pinescript.size.normal;
    pinescript.size.small;
    pinescript.size.tiny;
    pinescript.size.auto;
    return ((pinescript.size === "Auto") ? undefined : ((pinescript.size === "Tiny") ? undefined : ((pinescript.size === "Small") ? undefined : ((pinescript.size === "Normal") ? undefined : ((pinescript.size === "Large") ? undefined : ((pinescript.size === "Huge") ? undefined : null))))));
  }
  let MEDIAN_EXT_5M_HIGH = 0.411;
  let MEDIAN_EXT_5M_LOW = 0.45;
  let MEDIAN_EXT_15M_HIGH = 0.38;
  let MEDIAN_EXT_15M_LOW = 0.415;
  let tz = "America/New_York";
  if (state.or5_high === undefined) state.or5_high = null;
  if (state.or5_low === undefined) state.or5_low = null;
  if (state.or5_mid === undefined) state.or5_mid = null;
  if (state.or5_open === undefined) state.or5_open = null;
  if (state.or5_close === undefined) state.or5_close = null;
  if (state.or5_start_bar === undefined) state.or5_start_bar = null;
  if (state.or5_end_bar === undefined) state.or5_end_bar = null;
  if (state.or5_captured === undefined) state.or5_captured = false;
  if (state.or5_extreme_first === undefined) state.or5_extreme_first = "none";
  if (state.or5_top_line === undefined) state.or5_top_line = null;
  if (state.or5_bot_line === undefined) state.or5_bot_line = null;
  if (state.or5_mid_line === undefined) state.or5_mid_line = null;
  if (state.or5_fill === undefined) state.or5_fill = null;
  if (state.or5_high_label === undefined) state.or5_high_label = null;
  if (state.or5_low_label === undefined) state.or5_low_label = null;
  if (state.or5_mid_label === undefined) state.or5_mid_label = null;
  if (state.or5_ext_high === undefined) state.or5_ext_high = null;
  if (state.or5_ext_low === undefined) state.or5_ext_low = null;
  if (state.or5_ext_high_label === undefined) state.or5_ext_high_label = null;
  if (state.or5_ext_low_label === undefined) state.or5_ext_low_label = null;
  if (state.or5_ltf_opens_frozen === undefined) state.or5_ltf_opens_frozen = pinescript.arrayNew();
  if (state.or5_ltf_highs_frozen === undefined) state.or5_ltf_highs_frozen = pinescript.arrayNew();
  if (state.or5_ltf_lows_frozen === undefined) state.or5_ltf_lows_frozen = pinescript.arrayNew();
  if (state.or5_ltf_closes_frozen === undefined) state.or5_ltf_closes_frozen = pinescript.arrayNew();
  if (state.or5_ltf_frozen === undefined) state.or5_ltf_frozen = false;
  if (state.ltf5 === undefined) state.ltf5 = LTFCandles.new(pinescript.arrayNew(), pinescript.arrayNew(), pinescript.arrayNew(), pinescript.arrayNew(), pinescript.arrayNew(), pinescript.arrayNew(), pinescript.arrayNew());
  if (state.or5_ltf_high_line === undefined) state.or5_ltf_high_line = null;
  if (state.or5_ltf_low_line === undefined) state.or5_ltf_low_line = null;
  if (state.or15_high === undefined) state.or15_high = null;
  if (state.or15_low === undefined) state.or15_low = null;
  if (state.or15_mid === undefined) state.or15_mid = null;
  if (state.or15_open === undefined) state.or15_open = null;
  if (state.or15_close === undefined) state.or15_close = null;
  if (state.or15_start_bar === undefined) state.or15_start_bar = null;
  if (state.or15_end_bar === undefined) state.or15_end_bar = null;
  if (state.or15_captured === undefined) state.or15_captured = false;
  if (state.or15_extreme_first === undefined) state.or15_extreme_first = "none";
  if (state.or15_top_line === undefined) state.or15_top_line = null;
  if (state.or15_bot_line === undefined) state.or15_bot_line = null;
  if (state.or15_mid_line === undefined) state.or15_mid_line = null;
  if (state.or15_fill === undefined) state.or15_fill = null;
  if (state.or15_high_label === undefined) state.or15_high_label = null;
  if (state.or15_low_label === undefined) state.or15_low_label = null;
  if (state.or15_mid_label === undefined) state.or15_mid_label = null;
  if (state.or15_ext_high === undefined) state.or15_ext_high = null;
  if (state.or15_ext_low === undefined) state.or15_ext_low = null;
  if (state.or15_ext_high_label === undefined) state.or15_ext_high_label = null;
  if (state.or15_ext_low_label === undefined) state.or15_ext_low_label = null;
  if (state.or15_ltf_opens_frozen === undefined) state.or15_ltf_opens_frozen = pinescript.arrayNew();
  if (state.or15_ltf_highs_frozen === undefined) state.or15_ltf_highs_frozen = pinescript.arrayNew();
  if (state.or15_ltf_lows_frozen === undefined) state.or15_ltf_lows_frozen = pinescript.arrayNew();
  if (state.or15_ltf_closes_frozen === undefined) state.or15_ltf_closes_frozen = pinescript.arrayNew();
  if (state.or15_ltf_frozen === undefined) state.or15_ltf_frozen = false;
  if (state.ltf15 === undefined) state.ltf15 = LTFCandles.new(pinescript.arrayNew(), pinescript.arrayNew(), pinescript.arrayNew(), pinescript.arrayNew(), pinescript.arrayNew(), pinescript.arrayNew(), pinescript.arrayNew());
  if (state.or15_ltf_high_line === undefined) state.or15_ltf_high_line = null;
  if (state.or15_ltf_low_line === undefined) state.or15_ltf_low_line = null;
  if (state.or5_high_broken === undefined) state.or5_high_broken = false;
  if (state.or5_low_broken === undefined) state.or5_low_broken = false;
  if (state.or15_high_broken === undefined) state.or15_high_broken = false;
  if (state.or15_low_broken === undefined) state.or15_low_broken = false;
  if (state.or5_mid_retested === undefined) state.or5_mid_retested = false;
  if (state.or15_mid_retested === undefined) state.or15_mid_retested = false;
  if (state.or5_ext_high_reached === undefined) state.or5_ext_high_reached = false;
  if (state.or5_ext_low_reached === undefined) state.or5_ext_low_reached = false;
  if (state.or15_ext_high_reached === undefined) state.or15_ext_high_reached = false;
  if (state.or15_ext_low_reached === undefined) state.or15_ext_low_reached = false;
  if (state.ib_high === undefined) state.ib_high = null;
  if (state.ib_low === undefined) state.ib_low = null;
  if (state.ib_open === undefined) state.ib_open = null;
  if (state.ib_close === undefined) state.ib_close = null;
  if (state.ib_captured === undefined) state.ib_captured = false;
  if (state.ib_is_bullish === undefined) state.ib_is_bullish = false;
  let is_5m_session = !pinescript.na(pinescript.time(timeframe.period, "0930-0935", tz));
  let is_5m_start = (is_5m_session && !pinescript.offset(is_5m_session, 1));
  let is_5m_end = (pinescript.offset(is_5m_session, 1) && !is_5m_session);
  let is_15m_session = !pinescript.na(pinescript.time(timeframe.period, "0930-0945", tz));
  let is_15m_start = (is_15m_session && !pinescript.offset(is_15m_session, 1));
  let is_15m_end = (pinescript.offset(is_15m_session, 1) && !is_15m_session);
  let is_ib_session = !pinescript.na(pinescript.time(timeframe.period, "0930-1030", tz));
  let is_ib_start = (is_ib_session && !pinescript.offset(is_ib_session, 1));
  let is_ib_end = (pinescript.offset(is_ib_session, 1) && !is_ib_session);
  let is_ny_session = !pinescript.na(pinescript.time(timeframe.period, "0930-1600", tz));
  let is_ny_session_end = (pinescript.offset(is_ny_session, 1) && !is_ny_session);
  let [H5, L5, M5, O5, C5] = pinescript.requestSecurity(ticker.standard(syminfo.tickerid), "5", [high, low, hl2, open, close], ({ lookahead: barmerge.lookahead_on }));
  let [H15, L15, M15, O15, C15] = pinescript.requestSecurity(ticker.standard(syminfo.tickerid), "15", [high, low, hl2, open, close], ({ lookahead: barmerge.lookahead_on }));
  let [H60, L60, O60, C60] = pinescript.requestSecurity(ticker.standard(syminfo.tickerid), "60", [high, low, open, close], ({ lookahead: barmerge.lookahead_on }));
  let [high_1m, low_1m, open_1m, close_1m] = request.security_lower_tf(ticker.standard(syminfo.tickerid), "1", [high, low, open, close]);
  let _style = ((pos === "Left") ? label.style_label_right : label.style_label_left);
  if (((is_ib_start && !pinescript.na(H60)) && !pinescript.na(L60))) {
    {
      state.ib_high = H60;
      state.ib_low = L60;
      state.ib_open = O60;
      state.ib_close = C60;
      state.ib_captured = false;
    }
  }
  if (((is_ib_end && !pinescript.na(state.ib_high)) && !pinescript.na(state.ib_low))) {
    {
      state.ib_is_bullish = (state.ib_close >= state.ib_open);
      state.ib_captured = true;
    }
  }
  function draw_ltf_candles(ltf, o_array, h_array, l_array, c_array, bull_color, bear_color, offset_from_right, max_candles, spacing, width) {
    if ((pinescript.arraySize(o_array) > 0)) {
      {
        while ((pinescript.arraySize(ltf.bodies) > 0)) {
          {
            box.delete(ltf.bodies.shift());
          }
        }
        while ((pinescript.arraySize(ltf.wicks_high) > 0)) {
          {
            pinescript.lineDelete(ltf.wicks_high.shift());
          }
        }
        while ((pinescript.arraySize(ltf.wicks_low) > 0)) {
          {
            pinescript.lineDelete(ltf.wicks_low.shift());
          }
        }
        ltf.highs.clear();
        ltf.lows.clear();
        let start_index = pinescript.max(0, (pinescript.arraySize(o_array) - max_candles));
        let num_candles = (pinescript.arraySize(o_array) - start_index);
        for (let i = start_index; i <= (pinescript.arraySize(o_array) - 1); i++) {
          {
            let o = pinescript.arrayGet(o_array, i);
            let h = pinescript.arrayGet(h_array, i);
            let l = pinescript.arrayGet(l_array, i);
            let c = pinescript.arrayGet(c_array, i);
            let is_bull = (c >= o);
            let candle_color = (is_bull ? bull_color : bear_color);
            let candle_index = (i - start_index);
            let x_start = ((bar_index + offset_from_right) + (candle_index * spacing));
            let x_end = (x_start + width);
            let x_mid = pinescript.round((x_start + (width / 2)));
            let body_top = pinescript.max(o, c);
            let body_bottom = pinescript.min(o, c);
            ltf.bodies.push(box.new(x_start, body_top, x_end, body_bottom, ({ border_color: candle_color, bgcolor: candle_color, border_width: 1 })));
            ltf.wicks_high.push(pinescript.lineNew(x_mid, body_top, x_mid, h, ({ color: candle_color, width: 1 })));
            ltf.wicks_low.push(pinescript.lineNew(x_mid, body_bottom, x_mid, l, ({ color: candle_color, width: 1 })));
            ltf.highs.push(h);
            ltf.lows.push(l);
          }
        }
        let ltf_start_x = (bar_index + offset_from_right);
        let ltf_end_x = (((bar_index + offset_from_right) + (num_candles * spacing)) + width);
        [ltf_start_x, ltf_end_x];
      }
    }
  }
  if (show_5min) {
    {
      if (is_5m_start) {
        {
          pinescript.lineDelete(state.or5_top_line);
          pinescript.lineDelete(state.or5_bot_line);
          pinescript.lineDelete(state.or5_mid_line);
          linefill.delete(state.or5_fill);
          pinescript.labelDelete(state.or5_high_label);
          pinescript.labelDelete(state.or5_low_label);
          pinescript.labelDelete(state.or5_mid_label);
          pinescript.lineDelete(state.or5_ext_high);
          pinescript.lineDelete(state.or5_ext_low);
          pinescript.labelDelete(state.or5_ext_high_label);
          pinescript.labelDelete(state.or5_ext_low_label);
          pinescript.lineDelete(state.or5_ltf_high_line);
          pinescript.lineDelete(state.or5_ltf_low_line);
          state.or5_start_bar = bar_index;
          state.or5_captured = false;
          state.or5_high_broken = false;
          state.or5_low_broken = false;
          state.or5_extreme_first = "none";
          state.or5_mid_retested = false;
          state.or5_ltf_frozen = false;
          state.or5_ext_high_reached = false;
          state.or5_ext_low_reached = false;
          or5_ltf_opens_frozen.clear();
          or5_ltf_highs_frozen.clear();
          or5_ltf_lows_frozen.clear();
          or5_ltf_closes_frozen.clear();
          state.or5_top_line = null;
          state.or5_bot_line = null;
          state.or5_mid_line = null;
          state.or5_fill = null;
          state.or5_high_label = null;
          state.or5_low_label = null;
          state.or5_mid_label = null;
          state.or5_ext_high = null;
          state.or5_ext_low = null;
          state.or5_ext_high_label = null;
          state.or5_ext_low_label = null;
        }
      }
      if (((is_5m_session && !pinescript.na(H5)) && !pinescript.na(L5))) {
        {
          state.or5_high = H5;
          state.or5_low = L5;
          state.or5_mid = M5;
          state.or5_open = O5;
          state.or5_close = C5;
        }
      }
      if (is_5m_end) {
        {
          state.or5_end_bar = bar_index;
          state.or5_captured = true;
        }
      }
      if ((((is_5m_session && !state.or5_ltf_frozen) && !pinescript.na(open_1m)) && (pinescript.arraySize(open_1m) > 0))) {
        {
          for (let i = 0; i <= (pinescript.arraySize(open_1m) - 1); i++) {
            {
              or5_ltf_opens_frozen.push(pinescript.arrayGet(open_1m, i));
              or5_ltf_highs_frozen.push(pinescript.arrayGet(high_1m, i));
              or5_ltf_lows_frozen.push(pinescript.arrayGet(low_1m, i));
              or5_ltf_closes_frozen.push(pinescript.arrayGet(close_1m, i));
            }
          }
        }
      }
      if ((is_5m_end && !state.or5_ltf_frozen)) {
        {
          state.or5_ltf_frozen = true;
          if (((state.or5_extreme_first === "none") && (pinescript.arraySize(state.or5_ltf_highs_frozen) > 0))) {
            {
              for (let i = 0; i <= (pinescript.arraySize(state.or5_ltf_highs_frozen) - 1); i++) {
                {
                  let h_1m = pinescript.arrayGet(state.or5_ltf_highs_frozen, i);
                  let l_1m = pinescript.arrayGet(state.or5_ltf_lows_frozen, i);
                  if ((h_1m >= state.or5_high)) {
                    {
                      state.or5_extreme_first = "high";
                      break;
                    }
                  } else {
                    if ((l_1m <= state.or5_low)) {
                      {
                        state.or5_extreme_first = "low";
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if ((state.or5_captured && !state.or5_mid_retested)) {
        {
          if (((((high >= state.or5_mid) && (low <= state.or5_mid)) || ((pinescript.offset(close, 1) < state.or5_mid) && (close >= state.or5_mid))) || ((pinescript.offset(close, 1) > state.or5_mid) && (close <= state.or5_mid)))) {
            {
              state.or5_mid_retested = true;
            }
          }
        }
      }
      if ((((state.or5_captured && !pinescript.na(state.or5_high)) && !pinescript.na(state.or5_low)) && pinescript.na(state.or5_top_line))) {
        {
          let is_bullish = (state.or5_close >= state.or5_open);
          let _color = (is_bullish ? bullish_color_5m : bearish_color_5m);
          let _fillcolor = (is_bullish ? bullish_fill_5m : bearish_fill_5m);
          state.or5_top_line = pinescript.lineNew(state.or5_start_bar, state.or5_high, bar_index, state.or5_high, ({ color: _color, style: get_style(boxStyle_5m), width: borderWidth_5m }));
          state.or5_bot_line = pinescript.lineNew(state.or5_start_bar, state.or5_low, bar_index, state.or5_low, ({ color: _color, style: get_style(boxStyle_5m), width: borderWidth_5m }));
          state.or5_fill = linefill.new(state.or5_top_line, state.or5_bot_line, _fillcolor);
          if (show_midLine_5m) {
            {
              state.or5_mid_line = pinescript.lineNew(state.or5_start_bar, state.or5_mid, bar_index, state.or5_mid, ({ color: _color, style: get_style(lineStyle_5m), width: lineWidth_5m }));
            }
          }
          if (show_extensions_5m) {
            {
              let ext_high_price = (state.or5_high * (1 + (MEDIAN_EXT_5M_HIGH / 100)));
              let ext_low_price = (state.or5_low * (1 - (MEDIAN_EXT_5M_LOW / 100)));
              state.or5_ext_high = pinescript.lineNew(state.or5_start_bar, ext_high_price, bar_index, ext_high_price, ({ color: _color, style: get_style(ext_line_style_5m), width: ext_line_width_5m }));
              state.or5_ext_low = pinescript.lineNew(state.or5_start_bar, ext_low_price, bar_index, ext_low_price, ({ color: _color, style: get_style(ext_line_style_5m), width: ext_line_width_5m }));
            }
          }
          let x = ((pos === "Left") ? state.or5_start_bar : bar_index);
          if (showL) {
            {
              state.or5_high_label = pinescript.labelNew(x, state.or5_high, ("5m High" + (showP ? ((" (" + pinescript.strToString(state.or5_high, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
              state.or5_low_label = pinescript.labelNew(x, state.or5_low, ("5m Low" + (showP ? ((" (" + pinescript.strToString(state.or5_low, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
              if (show_midLine_5m) {
                {
                  state.or5_mid_label = pinescript.labelNew(x, state.or5_mid, ("5m Mid" + (showP ? ((" (" + pinescript.strToString(state.or5_mid, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
                }
              }
            }
          }
          if ((show_extensions_5m && show_ext_labels_5m)) {
            {
              ext_high_price = (state.or5_high * (1 + (MEDIAN_EXT_5M_HIGH / 100)));
              ext_low_price = (state.or5_low * (1 - (MEDIAN_EXT_5M_LOW / 100)));
              state.or5_ext_high_label = pinescript.labelNew(x, ext_high_price, "Med Ext +0.41%", ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Small") }));
              state.or5_ext_low_label = pinescript.labelNew(x, ext_low_price, "Med Ext -0.45%", ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Small") }));
            }
          }
        }
      }
      if (((((state.or5_captured && show_ltf_5m) && state.or5_ltf_frozen) && (pinescript.arraySize(state.or5_ltf_opens_frozen) > 0)) && is_ny_session)) {
        {
          [ltf_start_x, ltf_end_x] = draw_ltf_candles(state.ltf5, state.or5_ltf_opens_frozen, state.or5_ltf_highs_frozen, state.or5_ltf_lows_frozen, state.or5_ltf_closes_frozen, ltf_bull_color_5m, ltf_bear_color_5m, ltf_offset_5m, ltf_5m_count, ltf_spacing_5m, ltf_width_5m);
          if ((show_ltf_range_5m && (pinescript.arraySize(state.ltf5.highs) > 0))) {
            {
              pinescript.lineDelete(state.or5_ltf_high_line);
              pinescript.lineDelete(state.or5_ltf_low_line);
              let ltf_high = pinescript.arrayMax(state.ltf5.highs);
              let ltf_low = pinescript.arrayMin(state.ltf5.lows);
              state.or5_ltf_high_line = pinescript.lineNew(ltf_start_x, ltf_high, ltf_end_x, ltf_high, ({ color: ltf_range_color_5m, style: get_style(ltf_range_style_5m), width: ltf_range_width_5m }));
              state.or5_ltf_low_line = pinescript.lineNew(ltf_start_x, ltf_low, ltf_end_x, ltf_low, ({ color: ltf_range_color_5m, style: get_style(ltf_range_style_5m), width: ltf_range_width_5m }));
            }
          }
        }
      }
      if (((state.or5_captured && !pinescript.na(state.or5_top_line)) && is_ny_session)) {
        {
          state.or5_end_bar = bar_index;
          if (!pinescript.na(state.or5_top_line)) {
            {
              line.set_x2(state.or5_top_line, bar_index);
            }
          }
          if (!pinescript.na(state.or5_bot_line)) {
            {
              line.set_x2(state.or5_bot_line, bar_index);
            }
          }
          if ((!pinescript.na(state.or5_mid_line) && show_midLine_5m)) {
            {
              line.set_x2(state.or5_mid_line, bar_index);
            }
          }
          if ((!pinescript.na(state.or5_ext_high) && show_extensions_5m)) {
            {
              line.set_x2(state.or5_ext_high, bar_index);
            }
          }
          if ((!pinescript.na(state.or5_ext_low) && show_extensions_5m)) {
            {
              line.set_x2(state.or5_ext_low, bar_index);
            }
          }
          if ((showL && (pos === "Right"))) {
            {
              if (!pinescript.na(state.or5_high_label)) {
                {
                  label.set_x(state.or5_high_label, bar_index);
                }
              }
              if (!pinescript.na(state.or5_low_label)) {
                {
                  label.set_x(state.or5_low_label, bar_index);
                }
              }
              if ((!pinescript.na(state.or5_mid_label) && show_midLine_5m)) {
                {
                  label.set_x(state.or5_mid_label, bar_index);
                }
              }
            }
          }
          if (((show_extensions_5m && show_ext_labels_5m) && (pos === "Right"))) {
            {
              if (!pinescript.na(state.or5_ext_high_label)) {
                {
                  label.set_x(state.or5_ext_high_label, bar_index);
                }
              }
              if (!pinescript.na(state.or5_ext_low_label)) {
                {
                  label.set_x(state.or5_ext_low_label, bar_index);
                }
              }
            }
          }
          if (!is_5m_session) {
            {
              if ((!state.or5_high_broken && (high > state.or5_high))) {
                {
                  state.or5_high_broken = true;
                }
              }
              if ((!state.or5_low_broken && (low < state.or5_low))) {
                {
                  state.or5_low_broken = true;
                }
              }
              if (show_extensions_5m) {
                {
                  ext_high_price = (state.or5_high * (1 + (MEDIAN_EXT_5M_HIGH / 100)));
                  ext_low_price = (state.or5_low * (1 - (MEDIAN_EXT_5M_LOW / 100)));
                  if ((!state.or5_ext_high_reached && (high > ext_high_price))) {
                    {
                      state.or5_ext_high_reached = true;
                    }
                  }
                  if ((!state.or5_ext_low_reached && (low < ext_low_price))) {
                    {
                      state.or5_ext_low_reached = true;
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
  if (show_15min) {
    {
      if (is_15m_start) {
        {
          pinescript.lineDelete(state.or15_top_line);
          pinescript.lineDelete(state.or15_bot_line);
          pinescript.lineDelete(state.or15_mid_line);
          linefill.delete(state.or15_fill);
          pinescript.labelDelete(state.or15_high_label);
          pinescript.labelDelete(state.or15_low_label);
          pinescript.labelDelete(state.or15_mid_label);
          pinescript.lineDelete(state.or15_ext_high);
          pinescript.lineDelete(state.or15_ext_low);
          pinescript.labelDelete(state.or15_ext_high_label);
          pinescript.labelDelete(state.or15_ext_low_label);
          pinescript.lineDelete(state.or15_ltf_high_line);
          pinescript.lineDelete(state.or15_ltf_low_line);
          state.or15_start_bar = bar_index;
          state.or15_captured = false;
          state.or15_high_broken = false;
          state.or15_low_broken = false;
          state.or15_extreme_first = "none";
          state.or15_mid_retested = false;
          state.or15_ltf_frozen = false;
          state.or15_ext_high_reached = false;
          state.or15_ext_low_reached = false;
          or15_ltf_opens_frozen.clear();
          or15_ltf_highs_frozen.clear();
          or15_ltf_lows_frozen.clear();
          or15_ltf_closes_frozen.clear();
          state.or15_top_line = null;
          state.or15_bot_line = null;
          state.or15_mid_line = null;
          state.or15_fill = null;
          state.or15_high_label = null;
          state.or15_low_label = null;
          state.or15_mid_label = null;
          state.or15_ext_high = null;
          state.or15_ext_low = null;
          state.or15_ext_high_label = null;
          state.or15_ext_low_label = null;
        }
      }
      if (((is_15m_session && !pinescript.na(H15)) && !pinescript.na(L15))) {
        {
          state.or15_high = H15;
          state.or15_low = L15;
          state.or15_mid = M15;
          state.or15_open = O15;
          state.or15_close = C15;
        }
      }
      if (is_15m_end) {
        {
          state.or15_end_bar = bar_index;
          state.or15_captured = true;
        }
      }
      if ((((is_15m_session && !state.or15_ltf_frozen) && !pinescript.na(open_1m)) && (pinescript.arraySize(open_1m) > 0))) {
        {
          for (let i = 0; i <= (pinescript.arraySize(open_1m) - 1); i++) {
            {
              or15_ltf_opens_frozen.push(pinescript.arrayGet(open_1m, i));
              or15_ltf_highs_frozen.push(pinescript.arrayGet(high_1m, i));
              or15_ltf_lows_frozen.push(pinescript.arrayGet(low_1m, i));
              or15_ltf_closes_frozen.push(pinescript.arrayGet(close_1m, i));
            }
          }
        }
      }
      if ((is_15m_end && !state.or15_ltf_frozen)) {
        {
          state.or15_ltf_frozen = true;
          if (((state.or15_extreme_first === "none") && (pinescript.arraySize(state.or15_ltf_highs_frozen) > 0))) {
            {
              for (let i = 0; i <= (pinescript.arraySize(state.or15_ltf_highs_frozen) - 1); i++) {
                {
                  h_1m = pinescript.arrayGet(state.or15_ltf_highs_frozen, i);
                  l_1m = pinescript.arrayGet(state.or15_ltf_lows_frozen, i);
                  if ((h_1m >= state.or15_high)) {
                    {
                      state.or15_extreme_first = "high";
                      break;
                    }
                  } else {
                    if ((l_1m <= state.or15_low)) {
                      {
                        state.or15_extreme_first = "low";
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if ((state.or15_captured && !state.or15_mid_retested)) {
        {
          if (((((high >= state.or15_mid) && (low <= state.or15_mid)) || ((pinescript.offset(close, 1) < state.or15_mid) && (close >= state.or15_mid))) || ((pinescript.offset(close, 1) > state.or15_mid) && (close <= state.or15_mid)))) {
            {
              state.or15_mid_retested = true;
            }
          }
        }
      }
      if ((((state.or15_captured && !pinescript.na(state.or15_high)) && !pinescript.na(state.or15_low)) && pinescript.na(state.or15_top_line))) {
        {
          is_bullish = (state.or15_close >= state.or15_open);
          _color = (is_bullish ? bullish_color_15m : bearish_color_15m);
          _fillcolor = (is_bullish ? bullish_fill_15m : bearish_fill_15m);
          state.or15_top_line = pinescript.lineNew(state.or15_start_bar, state.or15_high, bar_index, state.or15_high, ({ color: _color, style: get_style(boxStyle_15m), width: borderWidth_15m }));
          state.or15_bot_line = pinescript.lineNew(state.or15_start_bar, state.or15_low, bar_index, state.or15_low, ({ color: _color, style: get_style(boxStyle_15m), width: borderWidth_15m }));
          state.or15_fill = linefill.new(state.or15_top_line, state.or15_bot_line, _fillcolor);
          if (show_midLine_15m) {
            {
              state.or15_mid_line = pinescript.lineNew(state.or15_start_bar, state.or15_mid, bar_index, state.or15_mid, ({ color: _color, style: get_style(lineStyle_15m), width: lineWidth_15m }));
            }
          }
          if (show_extensions_15m) {
            {
              ext_high_price = (state.or15_high * (1 + (MEDIAN_EXT_15M_HIGH / 100)));
              ext_low_price = (state.or15_low * (1 - (MEDIAN_EXT_15M_LOW / 100)));
              state.or15_ext_high = pinescript.lineNew(state.or15_start_bar, ext_high_price, bar_index, ext_high_price, ({ color: _color, style: get_style(ext_line_style_15m), width: ext_line_width_15m }));
              state.or15_ext_low = pinescript.lineNew(state.or15_start_bar, ext_low_price, bar_index, ext_low_price, ({ color: _color, style: get_style(ext_line_style_15m), width: ext_line_width_15m }));
            }
          }
          x = ((pos === "Left") ? state.or15_start_bar : bar_index);
          if (showL) {
            {
              state.or15_high_label = pinescript.labelNew(x, state.or15_high, ("15m High" + (showP ? ((" (" + pinescript.strToString(state.or15_high, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
              state.or15_low_label = pinescript.labelNew(x, state.or15_low, ("15m Low" + (showP ? ((" (" + pinescript.strToString(state.or15_low, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
              if (show_midLine_15m) {
                {
                  state.or15_mid_label = pinescript.labelNew(x, state.or15_mid, ("15m Mid" + (showP ? ((" (" + pinescript.strToString(state.or15_mid, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
                }
              }
            }
          }
          if ((show_extensions_15m && show_ext_labels_15m)) {
            {
              ext_high_price = (state.or15_high * (1 + (MEDIAN_EXT_15M_HIGH / 100)));
              ext_low_price = (state.or15_low * (1 - (MEDIAN_EXT_15M_LOW / 100)));
              state.or15_ext_high_label = pinescript.labelNew(x, ext_high_price, "Med Ext +0.38%", ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Small") }));
              state.or15_ext_low_label = pinescript.labelNew(x, ext_low_price, "Med Ext -0.42%", ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Small") }));
            }
          }
        }
      }
      if (((((state.or15_captured && show_ltf_15m) && state.or15_ltf_frozen) && (pinescript.arraySize(state.or15_ltf_opens_frozen) > 0)) && is_ny_session)) {
        {
          [ltf_start_x, ltf_end_x] = draw_ltf_candles(state.ltf15, state.or15_ltf_opens_frozen, state.or15_ltf_highs_frozen, state.or15_ltf_lows_frozen, state.or15_ltf_closes_frozen, ltf_bull_color_15m, ltf_bear_color_15m, ltf_offset_15m, ltf_15m_count, ltf_spacing_15m, ltf_width_15m);
          if ((show_ltf_range_15m && (pinescript.arraySize(state.ltf15.highs) > 0))) {
            {
              pinescript.lineDelete(state.or15_ltf_high_line);
              pinescript.lineDelete(state.or15_ltf_low_line);
              ltf_high = pinescript.arrayMax(state.ltf15.highs);
              ltf_low = pinescript.arrayMin(state.ltf15.lows);
              state.or15_ltf_high_line = pinescript.lineNew(ltf_start_x, ltf_high, ltf_end_x, ltf_high, ({ color: ltf_range_color_15m, style: get_style(ltf_range_style_15m), width: ltf_range_width_15m }));
              state.or15_ltf_low_line = pinescript.lineNew(ltf_start_x, ltf_low, ltf_end_x, ltf_low, ({ color: ltf_range_color_15m, style: get_style(ltf_range_style_15m), width: ltf_range_width_15m }));
            }
          }
        }
      }
      if (((state.or15_captured && !pinescript.na(state.or15_top_line)) && is_ny_session)) {
        {
          state.or15_end_bar = bar_index;
          if (!pinescript.na(state.or15_top_line)) {
            {
              line.set_x2(state.or15_top_line, bar_index);
            }
          }
          if (!pinescript.na(state.or15_bot_line)) {
            {
              line.set_x2(state.or15_bot_line, bar_index);
            }
          }
          if ((!pinescript.na(state.or15_mid_line) && show_midLine_15m)) {
            {
              line.set_x2(state.or15_mid_line, bar_index);
            }
          }
          if ((!pinescript.na(state.or15_ext_high) && show_extensions_15m)) {
            {
              line.set_x2(state.or15_ext_high, bar_index);
            }
          }
          if ((!pinescript.na(state.or15_ext_low) && show_extensions_15m)) {
            {
              line.set_x2(state.or15_ext_low, bar_index);
            }
          }
          if ((showL && (pos === "Right"))) {
            {
              if (!pinescript.na(state.or15_high_label)) {
                {
                  label.set_x(state.or15_high_label, bar_index);
                }
              }
              if (!pinescript.na(state.or15_low_label)) {
                {
                  label.set_x(state.or15_low_label, bar_index);
                }
              }
              if ((!pinescript.na(state.or15_mid_label) && show_midLine_15m)) {
                {
                  label.set_x(state.or15_mid_label, bar_index);
                }
              }
            }
          }
          if (((show_extensions_15m && show_ext_labels_15m) && (pos === "Right"))) {
            {
              if (!pinescript.na(state.or15_ext_high_label)) {
                {
                  label.set_x(state.or15_ext_high_label, bar_index);
                }
              }
              if (!pinescript.na(state.or15_ext_low_label)) {
                {
                  label.set_x(state.or15_ext_low_label, bar_index);
                }
              }
            }
          }
          if (!is_15m_session) {
            {
              if ((!state.or15_high_broken && (high > state.or15_high))) {
                {
                  state.or15_high_broken = true;
                }
              }
              if ((!state.or15_low_broken && (low < state.or15_low))) {
                {
                  state.or15_low_broken = true;
                }
              }
              if (show_extensions_15m) {
                {
                  ext_high_price = (state.or15_high * (1 + (MEDIAN_EXT_15M_HIGH / 100)));
                  ext_low_price = (state.or15_low * (1 - (MEDIAN_EXT_15M_LOW / 100)));
                  if ((!state.or15_ext_high_reached && (high > ext_high_price))) {
                    {
                      state.or15_ext_high_reached = true;
                    }
                  }
                  if ((!state.or15_ext_low_reached && (low < ext_low_price))) {
                    {
                      state.or15_ext_low_reached = true;
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
  if ((show_stats_table && (state.or5_captured || state.or15_captured))) {
    {
      if (state.stats_table === undefined) state.stats_table = null;
      table.delete(pinescript.offset(state.stats_table, 1));
      let table_pos = get_table_position(stats_table_pos);
      let table_size = get_table_text_size(stats_table_size);
      let header_bg = pinescript.color.rgb(64, 64, 64);
      let header_text = pinescript.color.white;
      let cell_bg = pinescript.color.white;
      let cell_text = pinescript.color.rgb(64, 64, 64);
      let pending_bg = pinescript.color.rgb(255, 235, 59);
      let pending_text = pinescript.color.rgb(64, 64, 64);
      let validated_bg = pinescript.color.rgb(0, 150, 136);
      let validated_text = pinescript.color.white;
      state.stats_table = pinescript.table.new(table_pos, 3, 35, ({ border_width: 1, border_color: pinescript.color.rgb(64, 64, 64), bgcolor: cell_bg }));
      let session_ended = (is_ny_session_end || !is_ny_session);
      let row = 0;
      pinescript.table.cell(state.stats_table, 0, row, "━━━ ORB STATISTICS ━━━", ({ bgcolor: header_bg, text_color: header_text, text_size: table_size, text_font_family: font.family_monospace }));
      table.merge_cells(state.stats_table, 0, row, 2, row);
      row = (row + 1);
      if ((show_5min && state.or5_captured)) {
        {
          let is_bull_5m = (state.or5_close >= state.or5_open);
          let extreme_5m = state.or5_extreme_first;
          pinescript.table.cell(state.stats_table, 0, row, "━━━ 5-MIN ORB ━━━", ({ bgcolor: header_bg, text_color: header_text, text_size: table_size, text_font_family: font.family_monospace }));
          table.merge_cells(state.stats_table, 0, row, 2, row);
          row = (row + 1);
          pinescript.table.cell(state.stats_table, 0, row, "Direction", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          let dir_text = (is_bull_5m ? "Bullish" : "Bearish");
          let dir_color = (is_bull_5m ? bullish_color_5m : bearish_color_5m);
          pinescript.table.cell(state.stats_table, 1, row, dir_text, ({ bgcolor: cell_bg, text_color: dir_color, text_size: table_size, text_font_family: font.family_monospace }));
          pinescript.table.cell(state.stats_table, 2, row, "Validated", ({ bgcolor: validated_bg, text_color: validated_text, text_size: table_size, text_font_family: font.family_monospace }));
          row = (row + 1);
          pinescript.table.cell(state.stats_table, 0, row, "Extreme First", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          let extreme_text = ((extreme_5m === "high") ? "High First" : ((extreme_5m === "low") ? "Low First" : "Unknown"));
          pinescript.table.cell(state.stats_table, 1, row, extreme_text, ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          let extreme_validated = (extreme_5m !== "none");
          let status_bg = (extreme_validated ? validated_bg : pending_bg);
          let status_text = (extreme_validated ? validated_text : pending_text);
          let status_symbol = (extreme_validated ? "Validated" : "Pending");
          pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
          row = (row + 1);
          pinescript.table.cell(state.stats_table, 0, row, "Extension ↑", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          pinescript.table.cell(state.stats_table, 1, row, "84.9%", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          let ext_up_validated = state.or5_ext_high_reached;
          status_bg = (ext_up_validated ? validated_bg : pending_bg);
          status_text = (ext_up_validated ? validated_text : pending_text);
          status_symbol = (ext_up_validated ? "Validated" : "Pending");
          pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
          row = (row + 1);
          pinescript.table.cell(state.stats_table, 0, row, "Extension ↓", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          pinescript.table.cell(state.stats_table, 1, row, "81.0%", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          let ext_down_validated = state.or5_ext_low_reached;
          status_bg = (ext_down_validated ? validated_bg : pending_bg);
          status_text = (ext_down_validated ? validated_text : pending_text);
          status_symbol = (ext_down_validated ? "Validated" : "Pending");
          pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
          row = (row + 1);
          if ((extreme_5m !== "none")) {
            {
              let retest_prob = 0;
              if ((is_bull_5m && (extreme_5m === "high"))) {
                {
                  retest_prob = 88.4;
                }
              } else {
                if ((is_bull_5m && (extreme_5m === "low"))) {
                  {
                    retest_prob = 81.8;
                  }
                } else {
                  if ((!is_bull_5m && (extreme_5m === "high"))) {
                    {
                      retest_prob = 82.7;
                    }
                  } else {
                    if ((!is_bull_5m && (extreme_5m === "low"))) {
                      {
                        retest_prob = 85.6;
                      }
                    }
                  }
                }
              }
              pinescript.table.cell(state.stats_table, 0, row, "Midpoint Retest", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              pinescript.table.cell(state.stats_table, 1, row, (pinescript.strToString(retest_prob, "#.#") + "%"), ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              status_bg = (state.or5_mid_retested ? validated_bg : pending_bg);
              status_text = (state.or5_mid_retested ? validated_text : pending_text);
              status_symbol = (state.or5_mid_retested ? "Validated" : "Pending");
              pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
              row = (row + 1);
            }
          }
          if ((extreme_5m !== "none")) {
            {
              let ib_prob = 0;
              let ib_dir = "";
              if ((is_bull_5m && (extreme_5m === "low"))) {
                {
                  ib_prob = 68.7;
                  ib_dir = "Bullish";
                }
              } else {
                if ((is_bull_5m && (extreme_5m === "high"))) {
                  {
                    ib_prob = 61.6;
                    ib_dir = "Bullish";
                  }
                } else {
                  if ((!is_bull_5m && (extreme_5m === "high"))) {
                    {
                      ib_prob = 64.8;
                      ib_dir = "Bearish";
                    }
                  } else {
                    if ((!is_bull_5m && (extreme_5m === "low"))) {
                      {
                        ib_prob = 58.6;
                        ib_dir = "Bearish";
                      }
                    }
                  }
                }
              }
              pinescript.table.cell(state.stats_table, 0, row, "IB Prediction", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              pinescript.table.cell(state.stats_table, 1, row, (((ib_dir + " ") + pinescript.strToString(ib_prob, "#.#")) + "%"), ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              status_bg = (state.ib_captured ? validated_bg : pending_bg);
              status_text = (state.ib_captured ? validated_text : pending_text);
              status_symbol = (state.ib_captured ? "Validated" : "Pending");
              pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
              row = (row + 1);
            }
          }
          if ((extreme_5m !== "none")) {
            {
              let break_prob = 0;
              let break_dir = "";
              if ((is_bull_5m && (extreme_5m === "low"))) {
                {
                  break_prob = 79.9;
                  break_dir = "High";
                }
              } else {
                if ((is_bull_5m && (extreme_5m === "high"))) {
                  {
                    break_prob = 66.3;
                    break_dir = "High";
                  }
                } else {
                  if ((!is_bull_5m && (extreme_5m === "high"))) {
                    {
                      break_prob = 74.6;
                      break_dir = "Low";
                    }
                  } else {
                    if ((!is_bull_5m && (extreme_5m === "low"))) {
                      {
                        break_prob = 67.4;
                        break_dir = "Low";
                      }
                    }
                  }
                }
              }
              pinescript.table.cell(state.stats_table, 0, row, "Next Break", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              pinescript.table.cell(state.stats_table, 1, row, (((break_dir + " ") + pinescript.strToString(break_prob, "#.#")) + "%"), ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              let break_validated = (state.or5_high_broken || state.or5_low_broken);
              status_bg = (break_validated ? validated_bg : pending_bg);
              status_text = (break_validated ? validated_text : pending_text);
              status_symbol = (break_validated ? "Validated" : "Pending");
              pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
              row = (row + 1);
            }
          }
          if ((state.or5_high_broken || state.or5_low_broken)) {
            {
              let close_prob = 0;
              let close_dir = "";
              if ((is_bull_5m && state.or5_high_broken)) {
                {
                  close_prob = 67.1;
                  close_dir = "Bullish";
                }
              } else {
                if ((is_bull_5m && state.or5_low_broken)) {
                  {
                    close_prob = 53.2;
                    close_dir = "Bullish";
                  }
                } else {
                  if ((!is_bull_5m && state.or5_high_broken)) {
                    {
                      close_prob = 60.8;
                      close_dir = "Bullish";
                    }
                  } else {
                    if ((!is_bull_5m && state.or5_low_broken)) {
                      {
                        close_prob = 60.5;
                        close_dir = "Bearish";
                      }
                    }
                  }
                }
              }
              pinescript.table.cell(state.stats_table, 0, row, "Session Close", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              pinescript.table.cell(state.stats_table, 1, row, (((close_dir + " ") + pinescript.strToString(close_prob, "#.#")) + "%"), ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              status_bg = (session_ended ? validated_bg : pending_bg);
              status_text = (session_ended ? validated_text : pending_text);
              status_symbol = (session_ended ? "Validated" : "Pending");
              pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
              row = (row + 1);
            }
          }
          pinescript.table.cell(state.stats_table, 0, row, "", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size }));
          table.merge_cells(state.stats_table, 0, row, 2, row);
          row = (row + 1);
        }
      }
      if ((show_15min && state.or15_captured)) {
        {
          let is_bull_15m = (state.or15_close >= state.or15_open);
          let extreme_15m = state.or15_extreme_first;
          pinescript.table.cell(state.stats_table, 0, row, "━━━ 15-MIN ORB ━━━", ({ bgcolor: header_bg, text_color: header_text, text_size: table_size, text_font_family: font.family_monospace }));
          table.merge_cells(state.stats_table, 0, row, 2, row);
          row = (row + 1);
          pinescript.table.cell(state.stats_table, 0, row, "Direction", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          dir_text = (is_bull_15m ? "Bullish" : "Bearish");
          dir_color = (is_bull_15m ? bullish_color_15m : bearish_color_15m);
          pinescript.table.cell(state.stats_table, 1, row, dir_text, ({ bgcolor: cell_bg, text_color: dir_color, text_size: table_size, text_font_family: font.family_monospace }));
          pinescript.table.cell(state.stats_table, 2, row, "Validated", ({ bgcolor: validated_bg, text_color: validated_text, text_size: table_size, text_font_family: font.family_monospace }));
          row = (row + 1);
          pinescript.table.cell(state.stats_table, 0, row, "Extreme First", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          extreme_text = ((extreme_15m === "high") ? "High First" : ((extreme_15m === "low") ? "Low First" : "Unknown"));
          pinescript.table.cell(state.stats_table, 1, row, extreme_text, ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          extreme_validated = (extreme_15m !== "none");
          status_bg = (extreme_validated ? validated_bg : pending_bg);
          status_text = (extreme_validated ? validated_text : pending_text);
          status_symbol = (extreme_validated ? "Validated" : "Pending");
          pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
          row = (row + 1);
          pinescript.table.cell(state.stats_table, 0, row, "Extension ↑", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          pinescript.table.cell(state.stats_table, 1, row, "77.2%", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          ext_up_validated = state.or15_ext_high_reached;
          status_bg = (ext_up_validated ? validated_bg : pending_bg);
          status_text = (ext_up_validated ? validated_text : pending_text);
          status_symbol = (ext_up_validated ? "Validated" : "Pending");
          pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
          row = (row + 1);
          pinescript.table.cell(state.stats_table, 0, row, "Extension ↓", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          pinescript.table.cell(state.stats_table, 1, row, "73.5%", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
          ext_down_validated = state.or15_ext_low_reached;
          status_bg = (ext_down_validated ? validated_bg : pending_bg);
          status_text = (ext_down_validated ? validated_text : pending_text);
          status_symbol = (ext_down_validated ? "Validated" : "Pending");
          pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
          row = (row + 1);
          if ((extreme_15m !== "none")) {
            {
              retest_prob = 0;
              if ((is_bull_15m && (extreme_15m === "high"))) {
                {
                  retest_prob = 80.8;
                }
              } else {
                if ((is_bull_15m && (extreme_15m === "low"))) {
                  {
                    retest_prob = 71.4;
                  }
                } else {
                  if ((!is_bull_15m && (extreme_15m === "high"))) {
                    {
                      retest_prob = 72.8;
                    }
                  } else {
                    if ((!is_bull_15m && (extreme_15m === "low"))) {
                      {
                        retest_prob = 83.8;
                      }
                    }
                  }
                }
              }
              pinescript.table.cell(state.stats_table, 0, row, "Midpoint Retest", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              pinescript.table.cell(state.stats_table, 1, row, (pinescript.strToString(retest_prob, "#.#") + "%"), ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              status_bg = (state.or15_mid_retested ? validated_bg : pending_bg);
              status_text = (state.or15_mid_retested ? validated_text : pending_text);
              status_symbol = (state.or15_mid_retested ? "Validated" : "Pending");
              pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
              row = (row + 1);
            }
          }
          if ((extreme_15m !== "none")) {
            {
              ib_prob = 0;
              ib_dir = "";
              if ((is_bull_15m && (extreme_15m === "low"))) {
                {
                  ib_prob = 74;
                  ib_dir = "Bullish";
                }
              } else {
                if ((is_bull_15m && (extreme_15m === "high"))) {
                  {
                    ib_prob = 59.6;
                    ib_dir = "Bullish";
                  }
                } else {
                  if ((!is_bull_15m && (extreme_15m === "high"))) {
                    {
                      ib_prob = 73.2;
                      ib_dir = "Bearish";
                    }
                  } else {
                    if ((!is_bull_15m && (extreme_15m === "low"))) {
                      {
                        ib_prob = 50.3;
                        ib_dir = "Bearish";
                      }
                    }
                  }
                }
              }
              pinescript.table.cell(state.stats_table, 0, row, "IB Prediction", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              pinescript.table.cell(state.stats_table, 1, row, (((ib_dir + " ") + pinescript.strToString(ib_prob, "#.#")) + "%"), ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              status_bg = (state.ib_captured ? validated_bg : pending_bg);
              status_text = (state.ib_captured ? validated_text : pending_text);
              status_symbol = (state.ib_captured ? "Validated" : "Pending");
              pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
              row = (row + 1);
            }
          }
          if ((extreme_15m !== "none")) {
            {
              break_prob = 0;
              break_dir = "";
              if ((is_bull_15m && (extreme_15m === "low"))) {
                {
                  break_prob = 75.3;
                  break_dir = "High";
                }
              } else {
                if ((is_bull_15m && (extreme_15m === "high"))) {
                  {
                    break_prob = 59.6;
                    break_dir = "High";
                  }
                } else {
                  if ((!is_bull_15m && (extreme_15m === "high"))) {
                    {
                      break_prob = 74.4;
                      break_dir = "Low";
                    }
                  } else {
                    if ((!is_bull_15m && (extreme_15m === "low"))) {
                      {
                        break_prob = 61.8;
                        break_dir = "Low";
                      }
                    }
                  }
                }
              }
              pinescript.table.cell(state.stats_table, 0, row, "Next Break", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              pinescript.table.cell(state.stats_table, 1, row, (((break_dir + " ") + pinescript.strToString(break_prob, "#.#")) + "%"), ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              break_validated = (state.or15_high_broken || state.or15_low_broken);
              status_bg = (break_validated ? validated_bg : pending_bg);
              status_text = (break_validated ? validated_text : pending_text);
              status_symbol = (break_validated ? "Validated" : "Pending");
              pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
              row = (row + 1);
            }
          }
          if ((state.or15_high_broken || state.or15_low_broken)) {
            {
              close_prob = 0;
              close_dir = "";
              if ((is_bull_15m && state.or15_high_broken)) {
                {
                  close_prob = 74.3;
                  close_dir = "Bullish";
                }
              } else {
                if ((is_bull_15m && state.or15_low_broken)) {
                  {
                    close_prob = 49.7;
                    close_dir = "Bullish";
                  }
                } else {
                  if ((!is_bull_15m && state.or15_high_broken)) {
                    {
                      close_prob = 57;
                      close_dir = "Bullish";
                    }
                  } else {
                    if ((!is_bull_15m && state.or15_low_broken)) {
                      {
                        close_prob = 66;
                        close_dir = "Bearish";
                      }
                    }
                  }
                }
              }
              pinescript.table.cell(state.stats_table, 0, row, "Session Close", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              pinescript.table.cell(state.stats_table, 1, row, (((close_dir + " ") + pinescript.strToString(close_prob, "#.#")) + "%"), ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
              status_bg = (session_ended ? validated_bg : pending_bg);
              status_text = (session_ended ? validated_text : pending_text);
              status_symbol = (session_ended ? "Validated" : "Pending");
              pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
              row = (row + 1);
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
