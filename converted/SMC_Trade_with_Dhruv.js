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
  time: 1771040741189,
  timenow: 1771040741189,
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

const alerts = { new: function(internalBullishBOS, internalBearishBOS, internalBullishCHoCH, internalBearishCHoCH, swingBullishBOS, swingBearishBOS, swingBullishCHoCH, swingBearishCHoCH, internalBullishOrderBlock, internalBearishOrderBlock, swingBullishOrderBlock, swingBearishOrderBlock, equalHighs, equalLows, bullishFairValueGap, bearishFairValueGap) { return { internalBullishBOS: internalBullishBOS, internalBearishBOS: internalBearishBOS, internalBullishCHoCH: internalBullishCHoCH, internalBearishCHoCH: internalBearishCHoCH, swingBullishBOS: swingBullishBOS, swingBearishBOS: swingBearishBOS, swingBullishCHoCH: swingBullishCHoCH, swingBearishCHoCH: swingBearishCHoCH, internalBullishOrderBlock: internalBullishOrderBlock, internalBearishOrderBlock: internalBearishOrderBlock, swingBullishOrderBlock: swingBullishOrderBlock, swingBearishOrderBlock: swingBearishOrderBlock, equalHighs: equalHighs, equalLows: equalLows, bullishFairValueGap: bullishFairValueGap, bearishFairValueGap: bearishFairValueGap }; } };
const trailingExtremes = { new: function(top, bottom, barTime, barIndex, lastTopTime, lastBottomTime) { return { top: top, bottom: bottom, barTime: barTime, barIndex: barIndex, lastTopTime: lastTopTime, lastBottomTime: lastBottomTime }; } };
const fairValueGap = { new: function(top, bottom, bias, topBox, bottomBox) { return { top: top, bottom: bottom, bias: bias, topBox: topBox, bottomBox: bottomBox }; } };
const trend = { new: function(bias) { return { bias: bias }; } };
const equalDisplay = { new: function(l_ine, l_abel) { return { l_ine: l_ine, l_abel: l_abel }; } };
const pivot = { new: function(currentLevel, lastLevel, crossed, barTime, barIndex) { return { currentLevel: currentLevel, lastLevel: lastLevel, crossed: crossed, barTime: barTime, barIndex: barIndex }; } };
const orderBlock = { new: function(barHigh, barLow, barTime, bias) { return { barHigh: barHigh, barLow: barLow, barTime: barTime, bias: bias }; } };

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
  // Study: SMC [Trade with Dhruv]
  // Options: {"overlay":true,"max_labels_count":500,"max_lines_count":500,"max_boxes_count":500}
  let BULLISH_LEG = 1;
  let BEARISH_LEG = 0;
  let BULLISH = 1;
  let BEARISH = -1;
  let GREEN = pinescript.color.hex("#089981");
  let RED = pinescript.color.hex("#F23645");
  let BLUE = pinescript.color.rgb(33, 243, 219);
  let GRAY = pinescript.color.hex("#878b94");
  let MONO_BULLISH = pinescript.color.rgb(255, 255, 255);
  let MONO_BEARISH = pinescript.color.rgb(255, 255, 255);
  let HISTORICAL = "Historical";
  let PRESENT = "Present";
  let COLORED = "Colored";
  let MONOCHROME = "Monochrome";
  let ALL = "All";
  let BOS = "BOS";
  let CHOCH = "CHoCH";
  let TINY = pinescript.size.tiny;
  let SMALL = pinescript.size.small;
  let NORMAL = pinescript.size.normal;
  let ATR = "Atr";
  let RANGE = "Cumulative Mean Range";
  let CLOSE = "Close";
  let HIGHLOW = "High/Low";
  let SOLID = "⎯⎯⎯";
  let DASHED = "----";
  let DOTTED = "····";
  let SMART_GROUP = "Smart Money Concepts";
  let INTERNAL_GROUP = "Real Time Internal Structure";
  let SWING_GROUP = "Real Time Swing Structure";
  let BLOCKS_GROUP = "Order Blocks";
  let EQUAL_GROUP = "EQH/EQL";
  let GAPS_GROUP = "Fair Value Gaps";
  let LEVELS_GROUP = "Highs & Lows MTF";
  let ZONES_GROUP = "Premium & Discount Zones";
  let modeTooltip = "Allows to display historical Structure or only the recent ones";
  let styleTooltip = "Indicator color theme";
  let showTrendTooltip = "Display additional candles with a color reflecting the current trend detected by structure";
  let showInternalsTooltip = "Display internal market structure";
  let internalFilterConfluenceTooltip = "Filter non significant internal structure breakouts";
  let showStructureTooltip = "Display swing market Structure";
  let showSwingsTooltip = "Display swing point as labels on the chart";
  let showHighLowSwingsTooltip = "Highlight most recent strong and weak high/low points on the chart";
  let showInternalOrderBlocksTooltip = "Display internal order blocks on the chartnnNumber of internal order blocks to display on the chart";
  let showSwingOrderBlocksTooltip = "Display swing order blocks on the chartnnNumber of internal swing blocks to display on the chart";
  let orderBlockFilterTooltip = "Method used to filter out volatile order blocks nnIt is recommended to use the cumulative mean range method when a low amount of data is available";
  let orderBlockMitigationTooltip = "Select what values to use for order block mitigation";
  let showEqualHighsLowsTooltip = "Display equal highs and equal lows on the chart";
  let equalHighsLowsLengthTooltip = "Number of bars used to confirm equal highs and equal lows";
  let equalHighsLowsThresholdTooltip = "Sensitivity threshold in a range (0, 1) used for the detection of equal highs & lowsnnLower values will return fewer but more pertinent results";
  let showFairValueGapsTooltip = "Display fair values gaps on the chart";
  let fairValueGapsThresholdTooltip = "Filter out non significant fair value gaps";
  let fairValueGapsTimeframeTooltip = "Fair value gaps timeframe";
  let fairValueGapsExtendTooltip = "Determine how many bars to extend the Fair Value Gap boxes on chart";
  let showPremiumDiscountZonesTooltip = "Display premium, discount, and equilibrium zones on chart";
  let modeInput = input.string(HISTORICAL, "Mode", ({ group: SMART_GROUP, tooltip: modeTooltip, options: [HISTORICAL, PRESENT] }));
  let styleInput = input.string(COLORED, "Style", ({ group: SMART_GROUP, tooltip: styleTooltip, options: [COLORED, MONOCHROME] }));
  let showTrendInput = input(false, "Color Candles", ({ group: SMART_GROUP, tooltip: showTrendTooltip }));
  let showInternalsInput = input(true, "Show Internal Structure", ({ group: INTERNAL_GROUP, tooltip: showInternalsTooltip }));
  let showInternalBullInput = input.string(ALL, "Bullish Structure", ({ group: INTERNAL_GROUP, inline: "ibull", options: [ALL, BOS, CHOCH] }));
  let internalBullColorInput = input(GREEN, "", ({ group: INTERNAL_GROUP, inline: "ibull" }));
  let showInternalBearInput = input.string(ALL, "Bearish Structure", ({ group: INTERNAL_GROUP, inline: "ibear", options: [ALL, BOS, CHOCH] }));
  let internalBearColorInput = input(RED, "", ({ group: INTERNAL_GROUP, inline: "ibear" }));
  let internalFilterConfluenceInput = input(false, "Confluence Filter", ({ group: INTERNAL_GROUP, tooltip: internalFilterConfluenceTooltip }));
  let internalStructureSize = input.string(TINY, "Internal Label Size", ({ group: INTERNAL_GROUP, options: [TINY, SMALL, NORMAL] }));
  let showStructureInput = input(true, "Show Swing Structure", ({ group: SWING_GROUP, tooltip: showStructureTooltip }));
  let showSwingBullInput = input.string(ALL, "Bullish Structure", ({ group: SWING_GROUP, inline: "bull", options: [ALL, BOS, CHOCH] }));
  let swingBullColorInput = input(GREEN, "", ({ group: SWING_GROUP, inline: "bull" }));
  let showSwingBearInput = input.string(ALL, "Bearish Structure", ({ group: SWING_GROUP, inline: "bear", options: [ALL, BOS, CHOCH] }));
  let swingBearColorInput = input(RED, "", ({ group: SWING_GROUP, inline: "bear" }));
  let swingStructureSize = input.string(SMALL, "Swing Label Size", ({ group: SWING_GROUP, options: [TINY, SMALL, NORMAL] }));
  let showSwingsInput = input(false, "Show Swings Points", ({ group: SWING_GROUP, tooltip: showSwingsTooltip, inline: "swings" }));
  let swingsLengthInput = input.int(50, "", ({ group: SWING_GROUP, minval: 10, inline: "swings" }));
  let showHighLowSwingsInput = input(true, "Show Strong/Weak High/Low", ({ group: SWING_GROUP, tooltip: showHighLowSwingsTooltip }));
  let showInternalOrderBlocksInput = input(true, "Internal Order Blocks", ({ group: BLOCKS_GROUP, tooltip: showInternalOrderBlocksTooltip, inline: "iob" }));
  let internalOrderBlocksSizeInput = input.int(5, "", ({ group: BLOCKS_GROUP, minval: 1, maxval: 20, inline: "iob" }));
  let showSwingOrderBlocksInput = input(false, "Swing Order Blocks", ({ group: BLOCKS_GROUP, tooltip: showSwingOrderBlocksTooltip, inline: "ob" }));
  let swingOrderBlocksSizeInput = input.int(5, "", ({ group: BLOCKS_GROUP, minval: 1, maxval: 20, inline: "ob" }));
  let orderBlockFilterInput = input.string("Atr", "Order Block Filter", ({ group: BLOCKS_GROUP, tooltip: orderBlockFilterTooltip, options: [ATR, RANGE] }));
  let orderBlockMitigationInput = input.string(HIGHLOW, "Order Block Mitigation", ({ group: BLOCKS_GROUP, tooltip: orderBlockMitigationTooltip, options: [CLOSE, HIGHLOW] }));
  let internalBullishOrderBlockColor = input.color(pinescript.color.rgb(49, 245, 186, 80), "Internal Bullish OB", ({ group: BLOCKS_GROUP }));
  let internalBearishOrderBlockColor = input.color(pinescript.color.new(pinescript.color.hex("#f77c80"), 80), "Internal Bearish OB", ({ group: BLOCKS_GROUP }));
  let swingBullishOrderBlockColor = input.color(pinescript.color.new(pinescript.color.hex("#1848cc"), 80), "Bullish OB", ({ group: BLOCKS_GROUP }));
  let swingBearishOrderBlockColor = input.color(pinescript.color.new(pinescript.color.hex("#b22833"), 80), "Bearish OB", ({ group: BLOCKS_GROUP }));
  let showEqualHighsLowsInput = input(true, "Equal High/Low", ({ group: EQUAL_GROUP, tooltip: showEqualHighsLowsTooltip }));
  let equalHighsLowsLengthInput = input.int(3, "Bars Confirmation", ({ group: EQUAL_GROUP, tooltip: equalHighsLowsLengthTooltip, minval: 1 }));
  let equalHighsLowsThresholdInput = input.float(0.1, "Threshold", ({ group: EQUAL_GROUP, tooltip: equalHighsLowsThresholdTooltip, minval: 0, maxval: 0.5, step: 0.1 }));
  let equalHighsLowsSizeInput = input.string(TINY, "Label Size", ({ group: EQUAL_GROUP, options: [TINY, SMALL, NORMAL] }));
  let showFairValueGapsInput = input(false, "Fair Value Gaps", ({ group: GAPS_GROUP, tooltip: showFairValueGapsTooltip }));
  let fairValueGapsThresholdInput = input(true, "Auto Threshold", ({ group: GAPS_GROUP, tooltip: fairValueGapsThresholdTooltip }));
  let fairValueGapsTimeframeInput = input.timeframe("", "Timeframe", ({ group: GAPS_GROUP, tooltip: fairValueGapsTimeframeTooltip }));
  let fairValueGapsBullColorInput = input.color(pinescript.color.new(pinescript.color.hex("#00ff68"), 70), "Bullish FVG", ({ group: GAPS_GROUP }));
  let fairValueGapsBearColorInput = input.color(pinescript.color.new(pinescript.color.hex("#ff0008"), 70), "Bearish FVG", ({ group: GAPS_GROUP }));
  let fairValueGapsExtendInput = input.int(1, "Extend FVG", ({ group: GAPS_GROUP, tooltip: fairValueGapsExtendTooltip, minval: 0 }));
  let showDailyLevelsInput = input(false, "Daily", ({ group: LEVELS_GROUP, inline: "daily" }));
  let dailyLevelsStyleInput = input.string(SOLID, "", ({ group: LEVELS_GROUP, inline: "daily", options: [SOLID, DASHED, DOTTED] }));
  let dailyLevelsColorInput = input(BLUE, "", ({ group: LEVELS_GROUP, inline: "daily" }));
  let showWeeklyLevelsInput = input(false, "Weekly", ({ group: LEVELS_GROUP, inline: "weekly" }));
  let weeklyLevelsStyleInput = input.string(SOLID, "", ({ group: LEVELS_GROUP, inline: "weekly", options: [SOLID, DASHED, DOTTED] }));
  let weeklyLevelsColorInput = input(BLUE, "", ({ group: LEVELS_GROUP, inline: "weekly" }));
  let showMonthlyLevelsInput = input(false, "Monthly", ({ group: LEVELS_GROUP, inline: "monthly" }));
  let monthlyLevelsStyleInput = input.string(SOLID, "", ({ group: LEVELS_GROUP, inline: "monthly", options: [SOLID, DASHED, DOTTED] }));
  let monthlyLevelsColorInput = input(BLUE, "", ({ group: LEVELS_GROUP, inline: "monthly" }));
  let showPremiumDiscountZonesInput = input(false, "Premium/Discount Zones", ({ group: ZONES_GROUP, tooltip: showPremiumDiscountZonesTooltip }));
  let premiumZoneColorInput = input.color(RED, "Premium Zone", ({ group: ZONES_GROUP }));
  let equilibriumZoneColorInput = input.color(GRAY, "Equilibrium Zone", ({ group: ZONES_GROUP }));
  let discountZoneColorInput = input.color(GREEN, "Discount Zone", ({ group: ZONES_GROUP }));
  if (state.swingHigh === undefined) state.swingHigh = pivot.new(null, null, false);
  if (state.swingLow === undefined) state.swingLow = pivot.new(null, null, false);
  if (state.internalHigh === undefined) state.internalHigh = pivot.new(null, null, false);
  if (state.internalLow === undefined) state.internalLow = pivot.new(null, null, false);
  if (state.equalHigh === undefined) state.equalHigh = pivot.new(null, null, false);
  if (state.equalLow === undefined) state.equalLow = pivot.new(null, null, false);
  if (state.swingTrend === undefined) state.swingTrend = trend.new(0);
  if (state.internalTrend === undefined) state.internalTrend = trend.new(0);
  if (state.equalHighDisplay === undefined) state.equalHighDisplay = equalDisplay.new();
  if (state.equalLowDisplay === undefined) state.equalLowDisplay = equalDisplay.new();
  if (state.fairValueGaps === undefined) state.fairValueGaps = pinescript.arrayNew();
  if (state.parsedHighs === undefined) state.parsedHighs = pinescript.arrayNew();
  if (state.parsedLows === undefined) state.parsedLows = pinescript.arrayNew();
  if (state.highs === undefined) state.highs = pinescript.arrayNew();
  if (state.lows === undefined) state.lows = pinescript.arrayNew();
  if (state.times === undefined) state.times = pinescript.arrayNew();
  if (state.trailing === undefined) state.trailing = trailingExtremes.new();
  if (state.swingOrderBlocks === undefined) state.swingOrderBlocks = pinescript.arrayNew();
  if (state.internalOrderBlocks === undefined) state.internalOrderBlocks = pinescript.arrayNew();
  if (state.swingOrderBlocksBoxes === undefined) state.swingOrderBlocksBoxes = pinescript.arrayNew();
  if (state.internalOrderBlocksBoxes === undefined) state.internalOrderBlocksBoxes = pinescript.arrayNew();
  if (state.swingBullishColor === undefined) state.swingBullishColor = ((styleInput === MONOCHROME) ? MONO_BULLISH : swingBullColorInput);
  if (state.swingBearishColor === undefined) state.swingBearishColor = ((styleInput === MONOCHROME) ? MONO_BEARISH : swingBearColorInput);
  if (state.fairValueGapBullishColor === undefined) state.fairValueGapBullishColor = ((styleInput === MONOCHROME) ? pinescript.color.new(MONO_BULLISH, 70) : fairValueGapsBullColorInput);
  if (state.fairValueGapBearishColor === undefined) state.fairValueGapBearishColor = ((styleInput === MONOCHROME) ? pinescript.color.new(MONO_BEARISH, 70) : fairValueGapsBearColorInput);
  if (state.premiumZoneColor === undefined) state.premiumZoneColor = ((styleInput === MONOCHROME) ? MONO_BEARISH : premiumZoneColorInput);
  if (state.discountZoneColor === undefined) state.discountZoneColor = ((styleInput === MONOCHROME) ? MONO_BULLISH : discountZoneColorInput);
  if (state.currentBarIndex === undefined) state.currentBarIndex = bar_index;
  if (state.lastBarIndex === undefined) state.lastBarIndex = bar_index;
  let currentAlerts = alerts.new();
  if (state.initialTime === undefined) state.initialTime = time;
  if (barstate.isfirst) {
    {
      if (showSwingOrderBlocksInput) {
        {
          for (let index = 1; index <= swingOrderBlocksSizeInput; index++) {
            {
              swingOrderBlocksBoxes.push(box.new(null, null, null, null, ({ xloc: xloc.bar_time, extend: extend.right })));
            }
          }
        }
      }
      if (showInternalOrderBlocksInput) {
        {
          for (let index = 1; index <= internalOrderBlocksSizeInput; index++) {
            {
              internalOrderBlocksBoxes.push(box.new(null, null, null, null, ({ xloc: xloc.bar_time, extend: extend.right })));
            }
          }
        }
      }
    }
  }
  let bearishOrderBlockMitigationSource = ((orderBlockMitigationInput === CLOSE) ? close : high);
  let bullishOrderBlockMitigationSource = ((orderBlockMitigationInput === CLOSE) ? close : low);
  let atrMeasure = ta.atr(200);
  let volatilityMeasure = ((orderBlockFilterInput === ATR) ? atrMeasure : (ta.cum(pinescript.ta.tr) / bar_index));
  let highVolatilityBar = ((high - low) >= (2 * volatilityMeasure));
  let parsedHigh = (highVolatilityBar ? low : high);
  let parsedLow = (highVolatilityBar ? high : low);
  parsedHighs.push(parsedHigh);
  parsedLows.push(parsedLow);
  highs.push(high);
  lows.push(low);
  times.push(time);
  function leg(size) {
    if (state.leg === undefined) state.leg = 0;
    let newLegHigh = (pinescript.offset(high, pinescript.size) > pinescript.highest(pinescript.size));
    let newLegLow = (pinescript.offset(low, pinescript.size) < pinescript.lowest(pinescript.size));
    if (newLegHigh) {
      {
        state.leg = BEARISH_LEG;
      }
    } else {
      if (newLegLow) {
        {
          state.leg = BULLISH_LEG;
        }
      }
    }
    return state.leg;
  }
  function startOfNewLeg(leg) {
    return (ta.change(state.leg) !== 0);
  }
  function startOfBearishLeg(leg) {
    return (ta.change(state.leg) === -1);
  }
  function startOfBullishLeg(leg) {
    return (ta.change(state.leg) === 1);
  }
  function drawLabel(labelTime, labelPrice, tag, labelColor, labelStyle) {
    if (state.l_abel === undefined) state.l_abel = null;
    if ((modeInput === PRESENT)) {
      {
        l_abel.delete();
      }
    }
    state.l_abel = pinescript.labelNew(pinescript.chartPointNew(labelTime, null, labelPrice), tag, xloc.bar_time, ({ color: color(null), textcolor: labelColor, style: labelStyle, size: pinescript.size.small }));
  }
  function drawEqualHighLow(p_ivot, level, size, equalHigh) {
    let e_qualDisplay = (state.equalHigh ? state.equalHighDisplay : state.equalLowDisplay);
    let tag = "EQL";
    let equalColor = state.swingBullishColor;
    let labelStyle = label.style_label_up;
    if (state.equalHigh) {
      {
        tag = "EQH";
        equalColor = state.swingBearishColor;
        labelStyle = label.style_label_down;
      }
    }
    if ((modeInput === PRESENT)) {
      {
        pinescript.lineDelete(e_qualDisplay.l_ine);
        pinescript.labelDelete(e_qualDisplay.l_abel);
      }
    }
    e_qualDisplay.l_ine = pinescript.lineNew(pinescript.chartPointNew(p_ivot.barTime, null, p_ivot.currentLevel), pinescript.chartPointNew(pinescript.offset(time, pinescript.size), null, level), ({ xloc: xloc.bar_time, color: equalColor, style: line.style_dotted }));
    let labelPosition = pinescript.round((0.5 * ((p_ivot.barIndex + bar_index) - pinescript.size)));
    e_qualDisplay.l_abel = pinescript.labelNew(pinescript.chartPointNew(null, labelPosition, level), tag, xloc.bar_index, ({ color: color(null), textcolor: equalColor, style: labelStyle, size: equalHighsLowsSizeInput }));
  }
  function getCurrentStructure(size, equalHighLow = false, internal = false) {
    let currentLeg = leg(pinescript.size);
    let newPivot = startOfNewLeg(currentLeg);
    let pivotLow = startOfBullishLeg(currentLeg);
    let pivotHigh = startOfBearishLeg(currentLeg);
    if (newPivot) {
      {
        if (pivotLow) {
          {
            let p_ivot = (equalHighLow ? state.equalLow : (internal ? state.internalLow : state.swingLow));
            if ((equalHighLow && (pinescript.abs((p_ivot.currentLevel - pinescript.offset(low, pinescript.size))) < (equalHighsLowsThresholdInput * atrMeasure)))) {
              {
                drawEqualHighLow(p_ivot, pinescript.offset(low, pinescript.size), pinescript.size, false);
              }
            }
            p_ivot.lastLevel = p_ivot.currentLevel;
            p_ivot.currentLevel = pinescript.offset(low, pinescript.size);
            p_ivot.crossed = false;
            p_ivot.barTime = pinescript.offset(time, pinescript.size);
            p_ivot.barIndex = pinescript.offset(bar_index, pinescript.size);
            if ((!equalHighLow && !internal)) {
              {
                state.trailing.bottom = p_ivot.currentLevel;
                state.trailing.barTime = p_ivot.barTime;
                state.trailing.barIndex = p_ivot.barIndex;
                state.trailing.lastBottomTime = p_ivot.barTime;
              }
            }
            if (((showSwingsInput && !internal) && !equalHighLow)) {
              {
                drawLabel(pinescript.offset(time, pinescript.size), p_ivot.currentLevel, ((p_ivot.currentLevel < p_ivot.lastLevel) ? "LL" : "HL"), state.swingBullishColor, label.style_label_up);
              }
            }
          }
        } else {
          {
            let p_ivot = (equalHighLow ? state.equalHigh : (internal ? state.internalHigh : state.swingHigh));
            if ((equalHighLow && (pinescript.abs((p_ivot.currentLevel - pinescript.offset(high, pinescript.size))) < (equalHighsLowsThresholdInput * atrMeasure)))) {
              {
                drawEqualHighLow(p_ivot, pinescript.offset(high, pinescript.size), pinescript.size, true);
              }
            }
            p_ivot.lastLevel = p_ivot.currentLevel;
            p_ivot.currentLevel = pinescript.offset(high, pinescript.size);
            p_ivot.crossed = false;
            p_ivot.barTime = pinescript.offset(time, pinescript.size);
            p_ivot.barIndex = pinescript.offset(bar_index, pinescript.size);
            if ((!equalHighLow && !internal)) {
              {
                state.trailing.top = p_ivot.currentLevel;
                state.trailing.barTime = p_ivot.barTime;
                state.trailing.barIndex = p_ivot.barIndex;
                state.trailing.lastTopTime = p_ivot.barTime;
              }
            }
            if (((showSwingsInput && !internal) && !equalHighLow)) {
              {
                drawLabel(pinescript.offset(time, pinescript.size), p_ivot.currentLevel, ((p_ivot.currentLevel > p_ivot.lastLevel) ? "HH" : "LH"), state.swingBearishColor, label.style_label_down);
              }
            }
          }
        }
      }
    }
  }
  function drawStructure(p_ivot, tag, structureColor, lineStyle, labelStyle, labelSize) {
    if (state.l_ine === undefined) state.l_ine = pinescript.lineNew(null, null, null, null, ({ xloc: xloc.bar_time }));
    if (state.l_abel === undefined) state.l_abel = pinescript.labelNew(null, null);
    if ((modeInput === PRESENT)) {
      {
        l_ine.delete();
        l_abel.delete();
      }
    }
    state.l_ine = pinescript.lineNew(pinescript.chartPointNew(p_ivot.barTime, null, p_ivot.currentLevel), pinescript.chartPointNew(time, null, p_ivot.currentLevel), xloc.bar_time, ({ color: structureColor, style: lineStyle }));
    state.l_abel = pinescript.labelNew(pinescript.chartPointNew(null, pinescript.round((0.5 * (p_ivot.barIndex + bar_index))), p_ivot.currentLevel), tag, xloc.bar_index, ({ color: color(null), textcolor: structureColor, style: labelStyle, size: labelSize }));
  }
  function deleteOrderBlocks(internal = false) {
    let orderBlocks = (internal ? state.internalOrderBlocks : state.swingOrderBlocks);
    for (const [index, eachOrderBlock] of orderBlocks) {
      {
        let crossedOderBlock = false;
        if (((bearishOrderBlockMitigationSource > eachOrderBlock.barHigh) && (eachOrderBlock.bias === BEARISH))) {
          {
            crossedOderBlock = true;
            if (internal) {
              {
                currentAlerts.internalBearishOrderBlock = true;
              }
            } else {
              {
                currentAlerts.swingBearishOrderBlock = true;
              }
            }
          }
        } else {
          if (((bullishOrderBlockMitigationSource < eachOrderBlock.barLow) && (eachOrderBlock.bias === BULLISH))) {
            {
              crossedOderBlock = true;
              if (internal) {
                {
                  currentAlerts.internalBullishOrderBlock = true;
                }
              } else {
                {
                  currentAlerts.swingBullishOrderBlock = true;
                }
              }
            }
          }
        }
        if (crossedOderBlock) {
          {
            orderBlocks.remove(index);
          }
        }
      }
    }
  }
  function storeOrdeBlock(p_ivot, internal = false, bias) {
    if (((!internal && showSwingOrderBlocksInput) || (internal && showInternalOrderBlocksInput))) {
      {
        let a_rray = null;
        let parsedIndex = null;
        if ((bias === BEARISH)) {
          {
            a_rray = parsedHighs.slice(p_ivot.barIndex, bar_index);
            parsedIndex = (p_ivot.barIndex + a_rray.indexof(a_rray.max()));
          }
        } else {
          {
            a_rray = parsedLows.slice(p_ivot.barIndex, bar_index);
            parsedIndex = (p_ivot.barIndex + a_rray.indexof(a_rray.min()));
          }
        }
        let o_rderBlock = orderBlock.new(parsedHighs.get(parsedIndex), parsedLows.get(parsedIndex), times.get(parsedIndex), bias);
        let orderBlocks = (internal ? state.internalOrderBlocks : state.swingOrderBlocks);
        if ((orderBlocks.size() >= 100)) {
          {
            orderBlocks.pop();
          }
        }
        orderBlocks.unshift(o_rderBlock);
      }
    }
  }
  function drawOrderBlocks(internal = false) {
    let orderBlocks = (internal ? state.internalOrderBlocks : state.swingOrderBlocks);
    let orderBlocksSize = orderBlocks.size();
    if ((orderBlocksSize > 0)) {
      {
        let maxOrderBlocks = (internal ? internalOrderBlocksSizeInput : swingOrderBlocksSizeInput);
        let parsedOrdeBlocks = orderBlocks.slice(0, pinescript.min(maxOrderBlocks, orderBlocksSize));
        let b_oxes = (internal ? state.internalOrderBlocksBoxes : state.swingOrderBlocksBoxes);
        for (const [index, eachOrderBlock] of parsedOrdeBlocks) {
          {
            let orderBlockColor = ((styleInput === MONOCHROME) ? ((eachOrderBlock.bias === BEARISH) ? pinescript.color.new(MONO_BEARISH, 80) : pinescript.color.new(MONO_BULLISH, 80)) : (internal ? ((eachOrderBlock.bias === BEARISH) ? internalBearishOrderBlockColor : internalBullishOrderBlockColor) : ((eachOrderBlock.bias === BEARISH) ? swingBearishOrderBlockColor : swingBullishOrderBlockColor)));
            let b_ox = b_oxes.get(index);
            b_ox.set_top_left_point(pinescript.chartPointNew(eachOrderBlock.barTime, null, eachOrderBlock.barHigh));
            b_ox.set_bottom_right_point(pinescript.chartPointNew(last_bar_time, null, eachOrderBlock.barLow));
            b_ox.set_border_color((internal ? null : orderBlockColor));
            b_ox.set_bgcolor(orderBlockColor);
          }
        }
      }
    }
  }
  function displayStructure(internal = false) {
    if (state.bullishBar === undefined) state.bullishBar = true;
    if (state.bearishBar === undefined) state.bearishBar = true;
    if (internalFilterConfluenceInput) {
      {
        state.bullishBar = ((high - pinescript.max(close, open)) > pinescript.min(close, (open - low)));
        state.bearishBar = ((high - pinescript.max(close, open)) < pinescript.min(close, (open - low)));
      }
    }
    let p_ivot = (internal ? state.internalHigh : state.swingHigh);
    let t_rend = (internal ? state.internalTrend : state.swingTrend);
    let lineStyle = (internal ? line.style_dashed : line.style_solid);
    let labelSize = (internal ? internalStructureSize : swingStructureSize);
    let extraCondition = (internal ? ((state.internalHigh.currentLevel !== state.swingHigh.currentLevel) && state.bullishBar) : true);
    let bullishColor = ((styleInput === MONOCHROME) ? MONO_BULLISH : (internal ? internalBullColorInput : swingBullColorInput));
    if (((pinescript.cross(close, p_ivot.currentLevel) && !p_ivot.crossed) && extraCondition)) {
      {
        let tag = ((t_rend.bias === BEARISH) ? CHOCH : BOS);
        if (internal) {
          {
            currentAlerts.internalBullishCHoCH = (tag === CHOCH);
            currentAlerts.internalBullishBOS = (tag === BOS);
          }
        } else {
          {
            currentAlerts.swingBullishCHoCH = (tag === CHOCH);
            currentAlerts.swingBullishBOS = (tag === BOS);
          }
        }
        p_ivot.crossed = true;
        t_rend.bias = BULLISH;
        let displayCondition = (internal ? (showInternalsInput && (((showInternalBullInput === ALL) || ((showInternalBullInput === BOS) && (tag !== CHOCH))) || ((showInternalBullInput === CHOCH) && (tag === CHOCH)))) : (showStructureInput && (((showSwingBullInput === ALL) || ((showSwingBullInput === BOS) && (tag !== CHOCH))) || ((showSwingBullInput === CHOCH) && (tag === CHOCH)))));
        if (displayCondition) {
          {
            drawStructure(p_ivot, tag, bullishColor, lineStyle, label.style_label_down, labelSize);
          }
        }
        if (((internal && showInternalOrderBlocksInput) || (!internal && showSwingOrderBlocksInput))) {
          {
            storeOrdeBlock(p_ivot, internal, BULLISH);
          }
        }
      }
    }
    p_ivot = (internal ? state.internalLow : state.swingLow);
    extraCondition = (internal ? ((state.internalLow.currentLevel !== state.swingLow.currentLevel) && state.bearishBar) : true);
    let bearishColor = ((styleInput === MONOCHROME) ? MONO_BEARISH : (internal ? internalBearColorInput : swingBearColorInput));
    if (((pinescript.cross(close, p_ivot.currentLevel) && !p_ivot.crossed) && extraCondition)) {
      {
        let tag = ((t_rend.bias === BULLISH) ? CHOCH : BOS);
        if (internal) {
          {
            currentAlerts.internalBearishCHoCH = (tag === CHOCH);
            currentAlerts.internalBearishBOS = (tag === BOS);
          }
        } else {
          {
            currentAlerts.swingBearishCHoCH = (tag === CHOCH);
            currentAlerts.swingBearishBOS = (tag === BOS);
          }
        }
        p_ivot.crossed = true;
        t_rend.bias = BEARISH;
        displayCondition = (internal ? (showInternalsInput && (((showInternalBearInput === ALL) || ((showInternalBearInput === BOS) && (tag !== CHOCH))) || ((showInternalBearInput === CHOCH) && (tag === CHOCH)))) : (showStructureInput && (((showSwingBearInput === ALL) || ((showSwingBearInput === BOS) && (tag !== CHOCH))) || ((showSwingBearInput === CHOCH) && (tag === CHOCH)))));
        if (displayCondition) {
          {
            drawStructure(p_ivot, tag, bearishColor, lineStyle, label.style_label_up, labelSize);
          }
        }
        if (((internal && showInternalOrderBlocksInput) || (!internal && showSwingOrderBlocksInput))) {
          {
            storeOrdeBlock(p_ivot, internal, BEARISH);
          }
        }
      }
    }
  }
  function fairValueGapBox(leftTime, rightTime, topPrice, bottomPrice, boxColor) {
    return box.new(pinescript.chartPointNew(leftTime, null, topPrice), pinescript.chartPointNew((rightTime + (fairValueGapsExtendInput * (time - pinescript.offset(time, 1)))), null, bottomPrice), ({ xloc: xloc.bar_time, border_color: boxColor, bgcolor: boxColor }));
  }
  function deleteFairValueGaps() {
    for (const [index, eachFairValueGap] of state.fairValueGaps) {
      {
        if ((((low < eachFairValueGap.bottom) && (eachFairValueGap.bias === BULLISH)) || ((high > eachFairValueGap.top) && (eachFairValueGap.bias === BEARISH)))) {
          {
            eachFairValueGap.topBox.delete();
            eachFairValueGap.bottomBox.delete();
            fairValueGaps.remove(index);
          }
        }
      }
    }
  }
  function drawFairValueGaps() {
    let [lastClose, lastOpen, lastTime, currentHigh, currentLow, currentTime, last2High, last2Low] = pinescript.requestSecurity(syminfo.tickerid, fairValueGapsTimeframeInput, [pinescript.offset(close, 1), pinescript.offset(open, 1), pinescript.offset(time, 1), pinescript.offset(high, 0), pinescript.offset(low, 0), pinescript.offset(time, 0), pinescript.offset(high, 2), pinescript.offset(low, 2)], ({ lookahead: barmerge.lookahead_on }));
    let barDeltaPercent = ((lastClose - lastOpen) / (lastOpen * 100));
    let newTimeframe = timeframe.change(fairValueGapsTimeframeInput);
    let threshold = (fairValueGapsThresholdInput ? ((ta.cum(pinescript.abs((newTimeframe ? barDeltaPercent : 0))) / bar_index) * 2) : 0);
    let bullishFairValueGap = ((((currentLow > last2High) && (lastClose > last2High)) && (barDeltaPercent > threshold)) && newTimeframe);
    let bearishFairValueGap = ((((currentHigh < last2Low) && (lastClose < last2Low)) && (-barDeltaPercent > threshold)) && newTimeframe);
    if (bullishFairValueGap) {
      {
        currentAlerts.bullishFairValueGap = true;
        fairValueGaps.unshift(fairValueGap.new(currentLow, last2High, BULLISH, fairValueGapBox(lastTime, currentTime, currentLow, math.avg(currentLow, last2High), state.fairValueGapBullishColor), fairValueGapBox(lastTime, currentTime, math.avg(currentLow, last2High), last2High, state.fairValueGapBullishColor)));
      }
    }
    if (bearishFairValueGap) {
      {
        currentAlerts.bearishFairValueGap = true;
        fairValueGaps.unshift(fairValueGap.new(currentHigh, last2Low, BEARISH, fairValueGapBox(lastTime, currentTime, currentHigh, math.avg(currentHigh, last2Low), state.fairValueGapBearishColor), fairValueGapBox(lastTime, currentTime, math.avg(currentHigh, last2Low), last2Low, state.fairValueGapBearishColor)));
      }
    }
  }
  function getStyle(style) {
    line.style_dotted;
    line.style_dashed;
    line.style_solid;
    return ((style === SOLID) ? undefined : ((style === DASHED) ? undefined : ((style === DOTTED) ? undefined : null)));
  }
  function drawLevels(timeframe, sameTimeframe, style, levelColor) {
    let [topLevel, bottomLevel, leftTime, rightTime] = pinescript.requestSecurity(syminfo.tickerid, timeframe, [pinescript.offset(high, 1), pinescript.offset(low, 1), pinescript.offset(time, 1), time], ({ lookahead: barmerge.lookahead_on }));
    let parsedTop = (sameTimeframe ? high : topLevel);
    let parsedBottom = (sameTimeframe ? low : bottomLevel);
    let parsedLeftTime = (sameTimeframe ? time : leftTime);
    let parsedRightTime = (sameTimeframe ? time : rightTime);
    let parsedTopTime = time;
    let parsedBottomTime = time;
    if (!sameTimeframe) {
      {
        let leftIndex = times.binary_search_rightmost(parsedLeftTime);
        let rightIndex = times.binary_search_rightmost(parsedRightTime);
        let timeArray = times.slice(leftIndex, rightIndex);
        let topArray = highs.slice(leftIndex, rightIndex);
        let bottomArray = lows.slice(leftIndex, rightIndex);
        parsedTopTime = ((timeArray.size() > 0) ? timeArray.get(topArray.indexof(topArray.max())) : state.initialTime);
        parsedBottomTime = ((timeArray.size() > 0) ? timeArray.get(bottomArray.indexof(bottomArray.min())) : state.initialTime);
      }
    }
    if (state.topLine === undefined) state.topLine = pinescript.lineNew(null, null, null, null, ({ xloc: xloc.bar_time, color: levelColor, style: getStyle(style) }));
    if (state.bottomLine === undefined) state.bottomLine = pinescript.lineNew(null, null, null, null, ({ xloc: xloc.bar_time, color: levelColor, style: getStyle(style) }));
    if (state.topLabel === undefined) state.topLabel = pinescript.labelNew(null, null, ({ xloc: xloc.bar_time, text: str.format("P{0}H", timeframe), color: color(null), textcolor: levelColor, size: pinescript.size.small, style: label.style_label_left }));
    if (state.bottomLabel === undefined) state.bottomLabel = pinescript.labelNew(null, null, ({ xloc: xloc.bar_time, text: str.format("P{0}L", timeframe), color: color(null), textcolor: levelColor, size: pinescript.size.small, style: label.style_label_left }));
    topLine.set_first_point(pinescript.chartPointNew(parsedTopTime, null, parsedTop));
    topLine.set_second_point(pinescript.chartPointNew((last_bar_time + (20 * (time - pinescript.offset(time, 1)))), null, parsedTop));
    topLabel.set_point(pinescript.chartPointNew((last_bar_time + (20 * (time - pinescript.offset(time, 1)))), null, parsedTop));
    bottomLine.set_first_point(pinescript.chartPointNew(parsedBottomTime, null, parsedBottom));
    bottomLine.set_second_point(pinescript.chartPointNew((last_bar_time + (20 * (time - pinescript.offset(time, 1)))), null, parsedBottom));
    return bottomLabel.set_point(pinescript.chartPointNew((last_bar_time + (20 * (time - pinescript.offset(time, 1)))), null, parsedBottom));
  }
  function higherTimeframe(timeframe) {
    return (timeframe.in_seconds() > timeframe.in_seconds(timeframe));
  }
  function updateTrailingExtremes() {
    state.trailing.top = pinescript.max(high, state.trailing.top);
    state.trailing.lastTopTime = ((state.trailing.top === high) ? time : state.trailing.lastTopTime);
    state.trailing.bottom = pinescript.min(low, state.trailing.bottom);
    state.trailing.lastBottomTime = ((state.trailing.bottom === low) ? time : state.trailing.lastBottomTime);
  }
  function drawHighLowSwings() {
    if (state.topLine === undefined) state.topLine = pinescript.lineNew(null, null, null, null, ({ color: state.swingBearishColor, xloc: xloc.bar_time }));
    if (state.bottomLine === undefined) state.bottomLine = pinescript.lineNew(null, null, null, null, ({ color: state.swingBullishColor, xloc: xloc.bar_time }));
    if (state.topLabel === undefined) state.topLabel = pinescript.labelNew(null, null, ({ color: color(null), textcolor: state.swingBearishColor, xloc: xloc.bar_time, style: label.style_label_down, size: pinescript.size.tiny }));
    if (state.bottomLabel === undefined) state.bottomLabel = pinescript.labelNew(null, null, ({ color: color(null), textcolor: state.swingBullishColor, xloc: xloc.bar_time, style: label.style_label_up, size: pinescript.size.tiny }));
    let rightTimeBar = (last_bar_time + (20 * (time - pinescript.offset(time, 1))));
    topLine.set_first_point(pinescript.chartPointNew(state.trailing.lastTopTime, null, state.trailing.top));
    topLine.set_second_point(pinescript.chartPointNew(rightTimeBar, null, state.trailing.top));
    topLabel.set_point(pinescript.chartPointNew(rightTimeBar, null, state.trailing.top));
    topLabel.set_text(((state.swingTrend.bias === BEARISH) ? "Strong High" : "Weak High"));
    bottomLine.set_first_point(pinescript.chartPointNew(state.trailing.lastBottomTime, null, state.trailing.bottom));
    bottomLine.set_second_point(pinescript.chartPointNew(rightTimeBar, null, state.trailing.bottom));
    bottomLabel.set_point(pinescript.chartPointNew(rightTimeBar, null, state.trailing.bottom));
    return bottomLabel.set_text(((state.swingTrend.bias === BULLISH) ? "Strong Low" : "Weak Low"));
  }
  function drawZone(labelLevel, labelIndex, top, bottom, tag, zoneColor, style) {
    if (state.l_abel === undefined) state.l_abel = pinescript.labelNew(null, null, ({ text: tag, color: color(null), textcolor: zoneColor, style: style, size: pinescript.size.small }));
    if (state.b_ox === undefined) state.b_ox = box.new(null, null, null, null, ({ bgcolor: pinescript.color.new(zoneColor, 80), border_color: color(null), xloc: xloc.bar_time }));
    b_ox.set_top_left_point(pinescript.chartPointNew(state.trailing.barTime, null, top));
    b_ox.set_bottom_right_point(pinescript.chartPointNew(last_bar_time, null, bottom));
    return l_abel.set_point(pinescript.chartPointNew(null, labelIndex, labelLevel));
  }
  function drawPremiumDiscountZones() {
    drawZone(state.trailing.top, pinescript.round((0.5 * (state.trailing.barIndex + last_bar_index))), state.trailing.top, ((0.95 * state.trailing.top) + (0.05 * state.trailing.bottom)), "Premium", state.premiumZoneColor, label.style_label_down);
    let equilibriumLevel = math.avg(state.trailing.top, state.trailing.bottom);
    drawZone(equilibriumLevel, last_bar_index, ((0.525 * state.trailing.top) + (0.475 * state.trailing.bottom)), ((0.525 * state.trailing.bottom) + (0.475 * state.trailing.top)), "Equilibrium", equilibriumZoneColorInput, label.style_label_left);
    return drawZone(state.trailing.bottom, pinescript.round((0.5 * (state.trailing.barIndex + last_bar_index))), ((0.95 * state.trailing.bottom) + (0.05 * state.trailing.top)), state.trailing.bottom, "Discount", state.discountZoneColor, label.style_label_up);
  }
  let parsedOpen = (showTrendInput ? open : null);
  let candleColor = ((state.internalTrend.bias === BULLISH) ? state.swingBullishColor : state.swingBearishColor);
  pinescript.plotcandle(parsedOpen, high, low, close, ({ color: candleColor, wickcolor: candleColor, bordercolor: candleColor }));
  if ((showHighLowSwingsInput || showPremiumDiscountZonesInput)) {
    {
      updateTrailingExtremes();
      if (showHighLowSwingsInput) {
        {
          drawHighLowSwings();
        }
      }
      if (showPremiumDiscountZonesInput) {
        {
          drawPremiumDiscountZones();
        }
      }
    }
  }
  if (showFairValueGapsInput) {
    {
      deleteFairValueGaps();
    }
  }
  getCurrentStructure(swingsLengthInput, false);
  getCurrentStructure(5, false, true);
  if (showEqualHighsLowsInput) {
    {
      getCurrentStructure(equalHighsLowsLengthInput, true);
    }
  }
  if (((showInternalsInput || showInternalOrderBlocksInput) || showTrendInput)) {
    {
      displayStructure(true);
    }
  }
  if (((showStructureInput || showSwingOrderBlocksInput) || showHighLowSwingsInput)) {
    {
      displayStructure();
    }
  }
  if (showInternalOrderBlocksInput) {
    {
      deleteOrderBlocks(true);
    }
  }
  if (showSwingOrderBlocksInput) {
    {
      deleteOrderBlocks();
    }
  }
  if (showFairValueGapsInput) {
    {
      drawFairValueGaps();
    }
  }
  if ((barstate.islastconfirmedhistory || barstate.islast)) {
    {
      if (showInternalOrderBlocksInput) {
        {
          drawOrderBlocks(true);
        }
      }
      if (showSwingOrderBlocksInput) {
        {
          drawOrderBlocks();
        }
      }
    }
  }
  state.lastBarIndex = state.currentBarIndex;
  state.currentBarIndex = bar_index;
  let newBar = (state.currentBarIndex !== state.lastBarIndex);
  if ((barstate.islastconfirmedhistory || (barstate.isrealtime && newBar))) {
    {
      if ((showDailyLevelsInput && !higherTimeframe("D"))) {
        {
          drawLevels("D", timeframe.isdaily, dailyLevelsStyleInput, dailyLevelsColorInput);
        }
      }
      if ((showWeeklyLevelsInput && !higherTimeframe("W"))) {
        {
          drawLevels("W", timeframe.isweekly, weeklyLevelsStyleInput, weeklyLevelsColorInput);
        }
      }
      if ((showMonthlyLevelsInput && !higherTimeframe("M"))) {
        {
          drawLevels("M", timeframe.ismonthly, monthlyLevelsStyleInput, monthlyLevelsColorInput);
        }
      }
    }
  }
  alertcondition(currentAlerts.internalBullishBOS, "Internal Bullish BOS", "Internal Bullish BOS formed");
  alertcondition(currentAlerts.internalBullishCHoCH, "Internal Bullish CHoCH", "Internal Bullish CHoCH formed");
  alertcondition(currentAlerts.internalBearishBOS, "Internal Bearish BOS", "Internal Bearish BOS formed");
  alertcondition(currentAlerts.internalBearishCHoCH, "Internal Bearish CHoCH", "Internal Bearish CHoCH formed");
  alertcondition(currentAlerts.swingBullishBOS, "Bullish BOS", "Internal Bullish BOS formed");
  alertcondition(currentAlerts.swingBullishCHoCH, "Bullish CHoCH", "Internal Bullish CHoCH formed");
  alertcondition(currentAlerts.swingBearishBOS, "Bearish BOS", "Bearish BOS formed");
  alertcondition(currentAlerts.swingBearishCHoCH, "Bearish CHoCH", "Bearish CHoCH formed");
  alertcondition(currentAlerts.internalBullishOrderBlock, "Bullish Internal OB Breakout", "Price broke bullish internal OB");
  alertcondition(currentAlerts.internalBearishOrderBlock, "Bearish Internal OB Breakout", "Price broke bearish internal OB");
  alertcondition(currentAlerts.swingBullishOrderBlock, "Bullish Swing OB Breakout", "Price broke bullish swing OB");
  alertcondition(currentAlerts.swingBearishOrderBlock, "Bearish Swing OB Breakout", "Price broke bearish swing OB");
  alertcondition(currentAlerts.equalHighs, "Equal Highs", "Equal highs detected");
  alertcondition(currentAlerts.equalLows, "Equal Lows", "Equal lows detected");
  alertcondition(currentAlerts.bullishFairValueGap, "Bullish FVG", "Bullish FVG formed");
  alertcondition(currentAlerts.bearishFairValueGap, "Bearish FVG", "Bearish FVG formed");
}


// Export for use

export { main
};
