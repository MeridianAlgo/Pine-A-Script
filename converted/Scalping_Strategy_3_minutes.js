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
  time: 1771040624756,
  timenow: 1771040624756,
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
  null;
  "v6_1_23";
  // Strategy: XXX
  // Options: {"shorttitle":"XXX ","overlay":true,"explicit_plot_zorder":true,"pyramiding":0,"default_qty_type":null,"default_qty_value":10,"calc_on_every_tick":false,"process_orders_on_close":true}
  let G_SCRIPT01 = ("■ " + "SAIYAN OCC");
  let res = input.timeframe("15", "TIMEFRAME", ({ group: "NON REPAINT" }));
  let useRes = input(true, "Use Alternate Signals");
  let intRes = input(8, "Multiplier for Alernate Signals");
  let basisType = input.string("ALMA", "MA Type: ", ({ options: ["TEMA", "HullMA", "ALMA"] }));
  let basisLen = input.int(2, "MA Period", ({ minval: 1 }));
  let offsetSigma = input.int(5, "Offset for LSMA / Sigma for ALMA", ({ minval: 0 }));
  let offsetALMA = input.float(0.85, "Offset for ALMA", ({ minval: 0, step: 0.01 }));
  let scolor = input(false, "Show coloured Bars to indicate Trend?");
  let delayOffset = input.int(0, "Delay Open/Close MA", ({ minval: 0, step: 1, tooltip: "Forces Non-Repainting" }));
  let tradeType = input.string("BOTH", "What trades should be taken : ", ({ options: ["LONG", "SHORT", "BOTH", "NONE"] }));
  let h = input(false, "Signals for Heikin Ashi Candles");
  let swing_length = input.int(10, "Swing High/Low Length", ({ group: "Settings", minval: 1, maxval: 50 }));
  let history_of_demand_to_keep = input.int(20, "History To Keep", ({ minval: 5, maxval: 50 }));
  let box_width = input.float(2.5, "Supply/Demand Box Width", ({ group: "Settings", minval: 1, maxval: 10, step: 0.5 }));
  let show_zigzag = input.bool(false, "Show Zig Zag", ({ group: "Visual Settings", inline: "1" }));
  let show_price_action_labels = input.bool(false, "Show Price Action Labels", ({ group: "Visual Settings", inline: "2" }));
  let supply_color = input.color(pinescript.color.hex("#00000000"), "Supply", ({ group: "Visual Settings", inline: "3" }));
  let supply_outline_color = input.color(pinescript.color.hex("#00000000"), "Outline", ({ group: "Visual Settings", inline: "3" }));
  let demand_color = input.color(pinescript.color.hex("#00000000"), "Demand", ({ group: "Visual Settings", inline: "4" }));
  let demand_outline_color = input.color(pinescript.color.hex("#00000000"), "Outline", ({ group: "Visual Settings", inline: "4" }));
  let bos_label_color = input.color(pinescript.color.hex("#00000000"), "BOS Label", ({ group: "Visual Settings", inline: "5" }));
  let poi_label_color = input.color(pinescript.color.hex("#00000000"), "POI Label", ({ group: "Visual Settings", inline: "7" }));
  let poi_border_color = input.color(pinescript.color.hex("#00000000"), "POI border", ({ group: "Visual Settings", inline: "7" }));
  let swing_type_color = input.color(pinescript.color.hex("#00000000"), "Price Action Label", ({ group: "Visual Settings", inline: "8" }));
  let zigzag_color = input.color(pinescript.color.hex("#00000000"), "Zig Zag", ({ group: "Visual Settings", inline: "9" }));
  function f_array_add_pop(array, new_value_to_add) {
    pinescript.arrayUnshift(pinescript.array, new_value_to_add);
    return pinescript.arrayPop(pinescript.array);
  }
  function f_sh_sl_labels(array, swing_type) {
    if (state.label_text === undefined) state.label_text = null;
    if ((swing_type === 1)) {
      {
        if ((pinescript.arrayGet(pinescript.array, 0) >= pinescript.arrayGet(pinescript.array, 1))) {
          {
            state.label_text = "HH";
          }
        } else {
          {
            state.label_text = "LH";
          }
        }
        pinescript.labelNew((bar_index - swing_length), pinescript.arrayGet(pinescript.array, 0), ({ text: state.label_text, style: label.style_label_down, textcolor: swing_type_color, color: swing_type_color, size: pinescript.size.tiny }));
      }
    } else {
      if ((swing_type === -1)) {
        {
          if ((pinescript.arrayGet(pinescript.array, 0) >= pinescript.arrayGet(pinescript.array, 1))) {
            {
              state.label_text = "HL";
            }
          } else {
            {
              state.label_text = "LL";
            }
          }
          pinescript.labelNew((bar_index - swing_length), pinescript.arrayGet(pinescript.array, 0), ({ text: state.label_text, style: label.style_label_up, textcolor: swing_type_color, color: swing_type_color, size: pinescript.size.tiny }));
        }
      }
    }
  }
  function f_check_overlapping(new_poi, box_array, atrValue) {
    let atr_threshold = (atrValue * 2);
    let okay_to_draw = true;
    for (let i = 0; i <= (pinescript.arraySize(box_array) - 1); i++) {
      {
        let top = box.get_top(pinescript.arrayGet(box_array, i));
        let bottom = box.get_bottom(pinescript.arrayGet(box_array, i));
        let poi = ((top + bottom) / 2);
        let upper_boundary = (poi + atr_threshold);
        let lower_boundary = (poi - atr_threshold);
        if (((new_poi >= lower_boundary) && (new_poi <= upper_boundary))) {
          {
            okay_to_draw = false;
            break;
          }
        } else {
          {
            okay_to_draw = true;
          }
        }
      }
    }
    return okay_to_draw;
  }
  function f_supply_demand(value_array, bn_array, box_array, label_array, box_type, atrValue) {
    let atr_buffer = (atrValue * (box_width / 10));
    let box_left = pinescript.arrayGet(bn_array, 0);
    let box_right = bar_index;
    if (state.box_top === undefined) state.box_top = 0;
    if (state.box_bottom === undefined) state.box_bottom = 0;
    if (state.poi === undefined) state.poi = 0;
    if ((box_type === 1)) {
      {
        state.box_top = pinescript.arrayGet(value_array, 0);
        state.box_bottom = (state.box_top - atr_buffer);
        state.poi = ((state.box_top + state.box_bottom) / 2);
      }
    } else {
      if ((box_type === -1)) {
        {
          state.box_bottom = pinescript.arrayGet(value_array, 0);
          state.box_top = (state.box_bottom + atr_buffer);
          state.poi = ((state.box_top + state.box_bottom) / 2);
        }
      }
    }
    okay_to_draw = f_check_overlapping(state.poi, box_array, atrValue);
    if (((box_type === 1) && okay_to_draw)) {
      {
        box.delete(pinescript.arrayGet(box_array, (pinescript.arraySize(box_array) - 1)));
        f_array_add_pop(box_array, box.new(({ left: box_left, top: state.box_top, right: box_right, bottom: state.box_bottom, border_color: supply_outline_color, bgcolor: supply_color, extend: extend.right, text: "SUPPLY", text_halign: pinescript.text.align_center, text_valign: pinescript.text.align_center, text_color: poi_label_color, text_size: pinescript.size.small, xloc: xloc.bar_index })));
        box.delete(pinescript.arrayGet(label_array, (pinescript.arraySize(label_array) - 1)));
        f_array_add_pop(label_array, box.new(({ left: box_left, top: state.poi, right: box_right, bottom: state.poi, border_color: poi_border_color, bgcolor: poi_border_color, extend: extend.right, text: "POI", text_halign: pinescript.text.align_left, text_valign: pinescript.text.align_center, text_color: poi_label_color, text_size: pinescript.size.small, xloc: xloc.bar_index })));
      }
    } else {
      if (((box_type === -1) && okay_to_draw)) {
        {
          box.delete(pinescript.arrayGet(box_array, (pinescript.arraySize(box_array) - 1)));
          f_array_add_pop(box_array, box.new(({ left: box_left, top: state.box_top, right: box_right, bottom: state.box_bottom, border_color: demand_outline_color, bgcolor: demand_color, extend: extend.right, text: "DEMAND", text_halign: pinescript.text.align_center, text_valign: pinescript.text.align_center, text_color: poi_label_color, text_size: pinescript.size.small, xloc: xloc.bar_index })));
          box.delete(pinescript.arrayGet(label_array, (pinescript.arraySize(label_array) - 1)));
          f_array_add_pop(label_array, box.new(({ left: box_left, top: state.poi, right: box_right, bottom: state.poi, border_color: poi_border_color, bgcolor: poi_border_color, extend: extend.right, text: "POI", text_halign: pinescript.text.align_left, text_valign: pinescript.text.align_center, text_color: poi_label_color, text_size: pinescript.size.small, xloc: xloc.bar_index })));
        }
      }
    }
  }
  function f_sd_to_bos(box_array, bos_array, label_array, zone_type) {
    if ((zone_type === 1)) {
      {
        for (let i = 0; i <= (pinescript.arraySize(box_array) - 1); i++) {
          {
            let level_to_break = box.get_top(pinescript.arrayGet(box_array, i));
            if ((close >= level_to_break)) {
              {
                let copied_box = box.copy(pinescript.arrayGet(box_array, i));
                f_array_add_pop(bos_array, copied_box);
                let mid = ((box.get_top(pinescript.arrayGet(box_array, i)) + box.get_bottom(pinescript.arrayGet(box_array, i))) / 2);
                box.set_top(pinescript.arrayGet(bos_array, 0), mid);
                box.set_bottom(pinescript.arrayGet(bos_array, 0), mid);
                box.set_extend(pinescript.arrayGet(bos_array, 0), extend.none);
                box.set_right(pinescript.arrayGet(bos_array, 0), bar_index);
                box.set_text(pinescript.arrayGet(bos_array, 0), "BOS");
                box.set_text_color(pinescript.arrayGet(bos_array, 0), bos_label_color);
                box.set_text_size(pinescript.arrayGet(bos_array, 0), pinescript.size.small);
                box.set_text_halign(pinescript.arrayGet(bos_array, 0), pinescript.text.align_center);
                box.set_text_valign(pinescript.arrayGet(bos_array, 0), pinescript.text.align_center);
                box.delete(pinescript.arrayGet(box_array, i));
                box.delete(pinescript.arrayGet(label_array, i));
              }
            }
          }
        }
      }
    }
    if ((zone_type === -1)) {
      {
        for (let i = 0; i <= (pinescript.arraySize(box_array) - 1); i++) {
          {
            level_to_break = box.get_bottom(pinescript.arrayGet(box_array, i));
            if ((close <= level_to_break)) {
              {
                copied_box = box.copy(pinescript.arrayGet(box_array, i));
                f_array_add_pop(bos_array, copied_box);
                mid = ((box.get_top(pinescript.arrayGet(box_array, i)) + box.get_bottom(pinescript.arrayGet(box_array, i))) / 2);
                box.set_top(pinescript.arrayGet(bos_array, 0), mid);
                box.set_bottom(pinescript.arrayGet(bos_array, 0), mid);
                box.set_extend(pinescript.arrayGet(bos_array, 0), extend.none);
                box.set_right(pinescript.arrayGet(bos_array, 0), bar_index);
                box.set_text(pinescript.arrayGet(bos_array, 0), "BOS");
                box.set_text_color(pinescript.arrayGet(bos_array, 0), bos_label_color);
                box.set_text_size(pinescript.arrayGet(bos_array, 0), pinescript.size.small);
                box.set_text_halign(pinescript.arrayGet(bos_array, 0), pinescript.text.align_center);
                box.set_text_valign(pinescript.arrayGet(bos_array, 0), pinescript.text.align_center);
                box.delete(pinescript.arrayGet(box_array, i));
                box.delete(pinescript.arrayGet(label_array, i));
              }
            }
          }
        }
      }
    }
  }
  function f_extend_box_endpoint(box_array) {
    for (let i = 0; i <= (pinescript.arraySize(box_array) - 1); i++) {
      {
        box.set_right(pinescript.arrayGet(box_array, i), (bar_index + 100));
      }
    }
  }
  let stratRes = (timeframe.ismonthly ? pinescript.strToString((timeframe.multiplier * intRes), "###M") : (timeframe.isweekly ? pinescript.strToString((timeframe.multiplier * intRes), "###W") : (timeframe.isdaily ? pinescript.strToString((timeframe.multiplier * intRes), "###D") : (timeframe.isintraday ? pinescript.strToString((timeframe.multiplier * intRes), "####") : "60"))));
  let src = (h ? pinescript.requestSecurity(ticker.heikinashi(syminfo.tickerid), timeframe.period, close, ({ lookahead: barmerge.lookahead_off })) : close);
  let atrValue = ta.atr(50);
  let swing_high = ta.pivothigh(high, swing_length, swing_length);
  let swing_low = ta.pivotlow(low, swing_length, swing_length);
  if (state.swing_high_values === undefined) state.swing_high_values = pinescript.arrayNew(5, 0);
  if (state.swing_low_values === undefined) state.swing_low_values = pinescript.arrayNew(5, 0);
  if (state.swing_high_bns === undefined) state.swing_high_bns = pinescript.arrayNew(5, 0);
  if (state.swing_low_bns === undefined) state.swing_low_bns = pinescript.arrayNew(5, 0);
  if (state.current_supply_box === undefined) state.current_supply_box = pinescript.arrayNew(history_of_demand_to_keep, null);
  if (state.current_demand_box === undefined) state.current_demand_box = pinescript.arrayNew(history_of_demand_to_keep, null);
  if (state.current_supply_poi === undefined) state.current_supply_poi = pinescript.arrayNew(history_of_demand_to_keep, null);
  if (state.current_demand_poi === undefined) state.current_demand_poi = pinescript.arrayNew(history_of_demand_to_keep, null);
  if (state.supply_bos === undefined) state.supply_bos = pinescript.arrayNew(5, null);
  if (state.demand_bos === undefined) state.demand_bos = pinescript.arrayNew(5, null);
  if (!pinescript.na(swing_high)) {
    {
      f_array_add_pop(state.swing_high_values, swing_high);
      f_array_add_pop(state.swing_high_bns, pinescript.offset(bar_index, swing_length));
      if (show_price_action_labels) {
        {
          f_sh_sl_labels(state.swing_high_values, 1);
        }
      }
      f_supply_demand(state.swing_high_values, state.swing_high_bns, state.current_supply_box, state.current_supply_poi, 1, atrValue);
    }
  } else {
    if (!pinescript.na(swing_low)) {
      {
        f_array_add_pop(state.swing_low_values, swing_low);
        f_array_add_pop(state.swing_low_bns, pinescript.offset(bar_index, swing_length));
        if (show_price_action_labels) {
          {
            f_sh_sl_labels(state.swing_low_values, -1);
          }
        }
        f_supply_demand(state.swing_low_values, state.swing_low_bns, state.current_demand_box, state.current_demand_poi, -1, atrValue);
      }
    }
  }
  f_sd_to_bos(state.current_supply_box, state.supply_bos, state.current_supply_poi, 1);
  f_sd_to_bos(state.current_demand_box, state.demand_bos, state.current_demand_poi, -1);
  f_extend_box_endpoint(state.current_supply_box);
  f_extend_box_endpoint(state.current_demand_box);
  let channelBal = input.bool(false, "Channel Balance", ({ group: "CHART" }));
  function lr_slope(_src, _len) {
    {
      let x = 0;
      let y = 0;
      let x2 = 0;
      let xy = 0;
    }
    for (let i = 0; i <= (_len - 1); i++) {
      {
        let val = pinescript.offset(_src, i);
        let per = (i + 1);
        x += per;
        y += val;
        x2 += (per * per);
        xy += (val * per);
      }
    }
    let _slp = (((_len * xy) - (x * y)) / ((_len * x2) - (x * x)));
    let _avg = (y / _len);
    let _int = ((_avg - ((_slp * x) / _len)) + _slp);
    return [_slp, _avg, _int];
  }
  function lr_dev(_src, _len, _slp, _avg, _int) {
    {
      let upDev = 0;
      let dnDev = 0;
    }
    val = _int;
    for (let j = 0; j <= (_len - 1); j++) {
      {
        let price = (pinescript.offset(high, j) - val);
        if ((price > upDev)) {
          {
            upDev = price;
          }
        }
        price = (val - pinescript.offset(low, j));
        if ((price > dnDev)) {
          {
            dnDev = price;
          }
        }
        price = pinescript.offset(_src, j);
        val += _slp;
      }
    }
    return [upDev, dnDev];
  }
  let [, upperKC1, lowerKC1] = ta.kc(close, 80, 10.5);
  let [, upperKC2, lowerKC2] = ta.kc(close, 80, 9.5);
  let [, upperKC3, lowerKC3] = ta.kc(close, 80, 8);
  let [, upperKC4, lowerKC4] = ta.kc(close, 80, 3);
  let barsL = 10;
  let barsR = 10;
  let pivotHigh = pinescript.fixnan(pinescript.offset(ta.pivothigh(barsL, barsR), 1));
  let pivotLow = pinescript.fixnan(pinescript.offset(ta.pivotlow(barsL, barsR), 1));
  {
    let source = close;
    let period = 150;
  }
  let [s, a, i] = lr_slope(source, period);
  [upDev, dnDev] = lr_dev(source, period, s, a, i);
  {
    let y1 = (low - (ta.atr(30) * 2));
    let y1B = (low - ta.atr(30));
  }
  {
    let y2 = (high + (ta.atr(30) * 2));
    let y2B = (high + ta.atr(30));
  }
  {
    let x1 = ((bar_index - period) + 1);
    let _y1 = (i + (s * (period - 1)));
    x2 = bar_index;
    let _y2 = i;
  }
  function get_line_style(style) {
    line.style_dotted;
    line.style_dashed;
    line.style_solid;
    let out = ((style === "???") ? undefined : ((style === "----") ? undefined : ((style === "    ") ? undefined : null)));
  }
  function get_coordinates(condition, top, btm, ob_val) {
    if (state.ob_top === undefined) state.ob_top = pinescript.arrayNew(0);
    if (state.ob_btm === undefined) state.ob_btm = pinescript.arrayNew(0);
    if (state.ob_avg === undefined) state.ob_avg = pinescript.arrayNew(0);
    if (state.ob_left === undefined) state.ob_left = pinescript.arrayNew(0);
    let ob = null;
    if (condition) {
      {
        let avg = math.avg(top, btm);
        pinescript.arrayUnshift(state.ob_top, top);
        pinescript.arrayUnshift(state.ob_btm, btm);
        pinescript.arrayUnshift(state.ob_avg, avg);
        ob = ob_val;
      }
    }
    return [state.ob_top, state.ob_btm, state.ob_avg, state.ob_left, ob];
  }
  function remove_mitigated(ob_top, ob_btm, ob_left, ob_avg, target, bull) {
    let mitigated = false;
    let target_array = (bull ? state.ob_btm : state.ob_top);
    for (const element of target_array) {
      {
        let idx = pinescript.arrayIndexOf(target_array, element);
        if ((bull ? (target < element) : (target > element))) {
          {
            mitigated = true;
            pinescript.arrayRemove(state.ob_top, idx);
            pinescript.arrayRemove(state.ob_btm, idx);
            pinescript.arrayRemove(state.ob_avg, idx);
            pinescript.arrayRemove(state.ob_left, idx);
          }
        }
      }
    }
    return mitigated;
  }
  function set_order_blocks(ob_top, ob_btm, ob_left, ob_avg, ext_last, bg_css, border_css, lvl_css) {
    if (state.ob_box === undefined) state.ob_box = pinescript.arrayNew(0);
    if (state.ob_lvl === undefined) state.ob_lvl = pinescript.arrayNew(0);
  }
  if (state.os === undefined) state.os = 0;
  if (state.target_bull === undefined) state.target_bull = 0;
  if (state.target_bear === undefined) state.target_bear = 0;
  function rp_security(_symbol, _res, _src) {
    return pinescript.requestSecurity(_symbol, _res, pinescript.offset(_src, (barstate.isrealtime ? 1 : 0)));
  }
  let htfHigh = rp_security(syminfo.tickerid, res, high);
  let htfLow = rp_security(syminfo.tickerid, res, low);
  function smoothrng(x, t, m) {
    let wper = ((t * 2) - 1);
    let avrng = pinescript.ema(pinescript.abs((x - pinescript.offset(x, 1))), t);
    let smoothrng = (pinescript.ema(avrng, wper) * m);
  }
  function rngfilt(x, r) {
    let rngfilt = x;
    rngfilt = ((x > pinescript.nz(pinescript.offset(rngfilt, 1))) ? (((x - r) < pinescript.nz(pinescript.offset(rngfilt, 1))) ? pinescript.nz(pinescript.offset(rngfilt, 1)) : (x - r)) : (((x + r) > pinescript.nz(pinescript.offset(rngfilt, 1))) ? pinescript.nz(pinescript.offset(rngfilt, 1)) : (x + r)));
  }
  function percWidth(len, perc) {
    return (((pinescript.highest(len) - pinescript.lowest(len)) * perc) / 100);
  }
  function securityNoRep(sym, res, src) {
    return pinescript.requestSecurity(sym, res, src, barmerge.gaps_off, barmerge.lookahead_on);
  }
  function swingPoints(prd) {
    let pivHi = ta.pivothigh(prd, prd);
    let pivLo = ta.pivotlow(prd, prd);
    let last_pivHi = ta.valuewhen(pivHi, pivHi, 1);
    let last_pivLo = ta.valuewhen(pivLo, pivLo, 1);
    let hh = ((pivHi && (pivHi > last_pivHi)) ? pivHi : null);
    let lh = ((pivHi && (pivHi < last_pivHi)) ? pivHi : null);
    let hl = ((pivLo && (pivLo > last_pivLo)) ? pivLo : null);
    let ll = ((pivLo && (pivLo < last_pivLo)) ? pivLo : null);
    return [hh, lh, hl, ll];
  }
  function f_chartTfInMinutes() {
    let _resInMinutes = (timeframe.multiplier * (timeframe.isseconds ? 1 : (timeframe.isminutes ? 1 : (timeframe.isdaily ? (60 * 24) : (timeframe.isweekly ? ((60 * 24) * 7) : (timeframe.ismonthly ? ((60 * 24) * 30.4375) : null))))));
  }
  function f_kc(src, len, sensitivity) {
    let basis = pinescript.sma(src, len);
    let span = ta.atr(len);
    return [(basis + (span * sensitivity)), (basis - (span * sensitivity))];
  }
  function wavetrend(src, chlLen, avgLen) {
    let esa = pinescript.ema(src, chlLen);
    let d = pinescript.ema(pinescript.abs((src - esa)), chlLen);
    let ci = ((src - esa) / (0.015 * d));
    let wt1 = pinescript.ema(ci, avgLen);
    let wt2 = pinescript.sma(wt1, 3);
    return [wt1, wt2];
  }
  function f_top_fractal(_src) {
    return ((((pinescript.offset(_src, 4) < pinescript.offset(_src, 2)) && (pinescript.offset(_src, 3) < pinescript.offset(_src, 2))) && (pinescript.offset(_src, 2) > pinescript.offset(_src, 1))) && (pinescript.offset(_src, 2) > pinescript.offset(_src, 0)));
  }
  function f_bot_fractal(_src) {
    return ((((pinescript.offset(_src, 4) > pinescript.offset(_src, 2)) && (pinescript.offset(_src, 3) > pinescript.offset(_src, 2))) && (pinescript.offset(_src, 2) < pinescript.offset(_src, 1))) && (pinescript.offset(_src, 2) < pinescript.offset(_src, 0)));
  }
  let top_fractal = f_top_fractal(src);
  let bot_fractal = f_bot_fractal(src);
  function f_fractalize(_src) {
    return (top_fractal ? 1 : (bot_fractal ? -1 : 0));
  }
  function f_findDivs(src, topLimit, botLimit) {
    let fractalTop = (((f_fractalize(src) > 0) && (pinescript.offset(src, 2) >= topLimit)) ? pinescript.offset(src, 2) : null);
    let fractalBot = (((f_fractalize(src) < 0) && (pinescript.offset(src, 2) <= botLimit)) ? pinescript.offset(src, 2) : null);
    let highPrev = pinescript.offset(ta.valuewhen(fractalTop, pinescript.offset(src, 2), 0), 2);
    let highPrice = pinescript.offset(ta.valuewhen(fractalTop, pinescript.offset(high, 2), 0), 2);
    let lowPrev = pinescript.offset(ta.valuewhen(fractalBot, pinescript.offset(src, 2), 0), 2);
    let lowPrice = pinescript.offset(ta.valuewhen(fractalBot, pinescript.offset(low, 2), 0), 2);
    let bearSignal = ((fractalTop && (pinescript.offset(high, 1) > highPrice)) && (pinescript.offset(src, 1) < highPrev));
    let bullSignal = ((fractalBot && (pinescript.offset(low, 1) < lowPrice)) && (pinescript.offset(src, 1) > lowPrev));
    return [bearSignal, bullSignal];
  }
  let enableSR = input(false, "SR On/Off", ({ group: "SR" }));
  let colorSup = input(pinescript.color.hex("#00000000"), "Support Color", ({ group: "SR" }));
  let colorRes = input(pinescript.color.hex("#00000000"), "Resistance Color", ({ group: "SR" }));
  let strengthSR = input.int(2, "S/R Strength", 1, ({ group: "SR" }));
  let lineStyle = input.string("Dotted", "Line Style", ["Solid", "Dotted", "Dashed"], ({ group: "SR" }));
  let lineWidth = input.int(2, "S/R Line Width", 1, ({ group: "SR" }));
  let useZones = input(true, "Zones On/Off", ({ group: "SR" }));
  let useHLZones = input(true, "High Low Zones On/Off", ({ group: "SR" }));
  let zoneWidth = input.int(2, "Zone Width %", 0, ({ tooltip: "it's calculated using % of the distance between highest/lowest in last 300 bars", group: "SR" }));
  let expandSR = input(true, "Expand SR");
  let rb = 10;
  let prd = 284;
  let ChannelW = 10;
  let label_loc = 55;
  let style = ((lineStyle === "Solid") ? line.style_solid : ((lineStyle === "Dotted") ? line.style_dotted : line.style_dashed));
  let ph = ta.pivothigh(rb, rb);
  let pl = ta.pivotlow(rb, rb);
  let sr_levels = pinescript.arrayNew(21, null);
  let prdhighest = pinescript.highest(prd);
  let prdlowest = pinescript.lowest(prd);
  let cwidth = percWidth(prd, ChannelW);
  let zonePerc = percWidth(300, zoneWidth);
  let aas = pinescript.arrayNew(41, true);
  {
    let u1 = 0;
    u1 = pinescript.nz(pinescript.offset(u1, 1));
  }
  {
    let d1 = 0;
    d1 = pinescript.nz(pinescript.offset(d1, 1));
  }
  {
    let highestph = 0;
    highestph = pinescript.offset(highestph, 1);
  }
  {
    let lowestpl = 0;
    lowestpl = pinescript.offset(lowestpl, 1);
  }
  if (state.sr_levs === undefined) state.sr_levs = pinescript.arrayNew(21, null);
  {
    let hlabel = null;
    pinescript.labelDelete(pinescript.offset(hlabel, 1));
  }
  {
    let llabel = null;
    pinescript.labelDelete(pinescript.offset(llabel, 1));
  }
  if (state.sr_lines === undefined) state.sr_lines = pinescript.arrayNew(21, null);
  if (state.sr_linesH === undefined) state.sr_linesH = pinescript.arrayNew(21, null);
  if (state.sr_linesL === undefined) state.sr_linesL = pinescript.arrayNew(21, null);
  if (state.sr_linesF === undefined) state.sr_linesF = array.new_linefill(21, null);
  if (state.sr_labels === undefined) state.sr_labels = pinescript.arrayNew(21, null);
  if ((ph || pl)) {
    {
      for (let x = 0; x <= (pinescript.arraySize(sr_levels) - 1); x++) {
        {
          pinescript.arraySet(sr_levels, x, null);
        }
      }
      highestph = prdlowest;
      lowestpl = prdhighest;
      let countpp = 0;
      for (let x = 0; x <= prd; x++) {
        {
          if (pinescript.na(pinescript.offset(close, x))) {
            {
              break;
            }
          }
          if ((!pinescript.na(pinescript.offset(ph, x)) || !pinescript.na(pinescript.offset(pl, x)))) {
            {
              highestph = pinescript.max(highestph, pinescript.nz(pinescript.offset(ph, x), prdlowest), pinescript.nz(pinescript.offset(pl, x), prdlowest));
              lowestpl = pinescript.min(lowestpl, pinescript.nz(pinescript.offset(ph, x), prdhighest), pinescript.nz(pinescript.offset(pl, x), prdhighest));
              countpp += 1;
              if ((countpp > 40)) {
                {
                  break;
                }
              }
              if (pinescript.arrayGet(aas, countpp)) {
                {
                  let upl = ((pinescript.offset(ph, x) ? pinescript.offset(high, (x + rb)) : pinescript.offset(low, (x + rb))) + cwidth);
                  let dnl = ((pinescript.offset(ph, x) ? pinescript.offset(high, (x + rb)) : pinescript.offset(low, (x + rb))) - cwidth);
                  u1 = ((countpp === 1) ? upl : u1);
                  d1 = ((countpp === 1) ? dnl : d1);
                  let tmp = pinescript.arrayNew(41, true);
                  let cnt = 0;
                  let tpoint = 0;
                  for (let xx = 0; xx <= prd; xx++) {
                    {
                      if (pinescript.na(pinescript.offset(close, xx))) {
                        {
                          break;
                        }
                      }
                      if ((!pinescript.na(pinescript.offset(ph, xx)) || !pinescript.na(pinescript.offset(pl, xx)))) {
                        {
                          let chg = false;
                          cnt += 1;
                          if ((cnt > 40)) {
                            {
                              break;
                            }
                          }
                          if (pinescript.arrayGet(aas, cnt)) {
                            {
                              if (!pinescript.na(pinescript.offset(ph, xx))) {
                                {
                                  if (((pinescript.offset(high, (xx + rb)) <= upl) && (pinescript.offset(high, (xx + rb)) >= dnl))) {
                                    {
                                      tpoint += 1;
                                      chg = true;
                                    }
                                  }
                                }
                              }
                              if (!pinescript.na(pinescript.offset(pl, xx))) {
                                {
                                  if (((pinescript.offset(low, (xx + rb)) <= upl) && (pinescript.offset(low, (xx + rb)) >= dnl))) {
                                    {
                                      tpoint += 1;
                                      chg = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                          if ((chg && (cnt < 41))) {
                            {
                              pinescript.arraySet(tmp, cnt, false);
                            }
                          }
                        }
                      }
                    }
                  }
                  if ((tpoint >= strengthSR)) {
                    {
                      for (let g = 0; g <= 40; g++) {
                        {
                          if (!pinescript.arrayGet(tmp, g)) {
                            {
                              pinescript.arraySet(aas, g, false);
                            }
                          }
                        }
                      }
                      if ((pinescript.offset(ph, x) && (countpp < 21))) {
                        {
                          pinescript.arraySet(sr_levels, countpp, pinescript.offset(high, (x + rb)));
                        }
                      }
                      if ((pinescript.offset(pl, x) && (countpp < 21))) {
                        {
                          pinescript.arraySet(sr_levels, countpp, pinescript.offset(low, (x + rb)));
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
    }
  }
  {
    if (state.highest_ === undefined) state.highest_ = null;
    pinescript.lineDelete(state.highest_);
  }
  {
    if (state.lowest_ === undefined) state.lowest_ = null;
    pinescript.lineDelete(state.lowest_);
  }
  {
    if (state.highest_fill1 === undefined) state.highest_fill1 = null;
    pinescript.lineDelete(state.highest_fill1);
  }
  {
    if (state.highest_fill2 === undefined) state.highest_fill2 = null;
    pinescript.lineDelete(state.highest_fill2);
  }
  {
    if (state.lowest_fill1 === undefined) state.lowest_fill1 = null;
    pinescript.lineDelete(state.lowest_fill1);
  }
  {
    if (state.lowest_fill2 === undefined) state.lowest_fill2 = null;
    pinescript.lineDelete(state.lowest_fill2);
  }
  let hi_col = ((close >= highestph) ? colorSup : colorRes);
  let lo_col = ((close >= lowestpl) ? colorSup : colorRes);
  if (enableSR) {
    {
      state.highest_ = pinescript.lineNew((bar_index - 311), highestph, bar_index, highestph, xloc.bar_index, (expandSR ? extend.both : extend.right), hi_col, style, lineWidth);
      state.lowest_ = pinescript.lineNew((bar_index - 311), lowestpl, bar_index, lowestpl, xloc.bar_index, (expandSR ? extend.both : extend.right), lo_col, style, lineWidth);
      if (useHLZones) {
        {
          state.highest_fill1 = pinescript.lineNew((bar_index - 311), (highestph + zonePerc), bar_index, (highestph + zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null);
          state.highest_fill2 = pinescript.lineNew((bar_index - 311), (highestph - zonePerc), bar_index, (highestph - zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null);
          state.lowest_fill1 = pinescript.lineNew((bar_index - 311), (lowestpl + zonePerc), bar_index, (lowestpl + zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null);
          state.lowest_fill2 = pinescript.lineNew((bar_index - 311), (lowestpl - zonePerc), bar_index, (lowestpl - zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null);
          linefill.new(state.highest_fill1, state.highest_fill2, hi_col);
          linefill.new(state.lowest_fill1, state.lowest_fill2, lo_col);
        }
      }
    }
  }
  if ((ph || pl)) {
    {
      for (let x = 0; x <= (pinescript.arraySize(state.sr_lines) - 1); x++) {
        {
          pinescript.arraySet(state.sr_levs, x, pinescript.arrayGet(sr_levels, x));
        }
      }
    }
  }
  for (let x = 0; x <= (pinescript.arraySize(state.sr_lines) - 1); x++) {
    {
      pinescript.lineDelete(pinescript.arrayGet(state.sr_lines, x));
      pinescript.lineDelete(pinescript.arrayGet(state.sr_linesH, x));
      pinescript.lineDelete(pinescript.arrayGet(state.sr_linesL, x));
      linefill.delete(pinescript.arrayGet(state.sr_linesF, x));
      if ((pinescript.arrayGet(state.sr_levs, x) && enableSR)) {
        {
          let line_col = ((close >= pinescript.arrayGet(state.sr_levs, x)) ? colorSup : colorRes);
          pinescript.arraySet(state.sr_lines, x, pinescript.lineNew((bar_index - 355), pinescript.arrayGet(state.sr_levs, x), bar_index, pinescript.arrayGet(state.sr_levs, x), xloc.bar_index, (expandSR ? extend.both : extend.right), line_col, style, lineWidth));
          if (useZones) {
            {
              pinescript.arraySet(state.sr_linesH, x, pinescript.lineNew((bar_index - 355), (pinescript.arrayGet(state.sr_levs, x) + zonePerc), bar_index, (pinescript.arrayGet(state.sr_levs, x) + zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null));
              pinescript.arraySet(state.sr_linesL, x, pinescript.lineNew((bar_index - 355), (pinescript.arrayGet(state.sr_levs, x) - zonePerc), bar_index, (pinescript.arrayGet(state.sr_levs, x) - zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null));
              pinescript.arraySet(state.sr_linesF, x, linefill.new(pinescript.arrayGet(state.sr_linesH, x), pinescript.arrayGet(state.sr_linesL, x), line_col));
            }
          }
        }
      }
    }
  }
  for (let x = 0; x <= (pinescript.arraySize(state.sr_labels) - 1); x++) {
    {
      pinescript.labelDelete(pinescript.arrayGet(state.sr_labels, x));
      if ((pinescript.arrayGet(state.sr_levs, x) && enableSR)) {
        {
          let lab_loc = ((close >= pinescript.arrayGet(state.sr_levs, x)) ? label.style_label_up : label.style_label_down);
          let lab_col = ((close >= pinescript.arrayGet(state.sr_levs, x)) ? colorSup : colorRes);
          pinescript.arraySet(state.sr_labels, x, pinescript.labelNew((bar_index + label_loc), pinescript.arrayGet(state.sr_levs, x), pinescript.strToString(math.round_to_mintick(pinescript.arrayGet(state.sr_levs, x))), ({ color: lab_col, textcolor: pinescript.color.hex("#000000"), style: lab_loc })));
        }
      }
    }
  }
  hlabel = (enableSR ? pinescript.labelNew(((bar_index + label_loc) + (pinescript.round(math.sign(label_loc)) * 20)), highestph, ("High Level : " + pinescript.strToString(highestph)), ({ color: hi_col, textcolor: pinescript.color.hex("#000000"), style: label.style_label_down })) : null);
  llabel = (enableSR ? pinescript.labelNew(((bar_index + label_loc) + (pinescript.round(math.sign(label_loc)) * 20)), lowestpl, ("Low  Level : " + pinescript.strToString(lowestpl)), ({ color: lo_col, textcolor: pinescript.color.hex("#000000"), style: label.style_label_up })) : null);
  let rsi = ta.rsi(close, 28);
  let rsiOb = ((rsi > 65) && (rsi > pinescript.ema(rsi, 10)));
  let rsiOs = ((rsi < 35) && (rsi < pinescript.ema(rsi, 10)));
  let dHigh = securityNoRep(syminfo.tickerid, "D", pinescript.offset(high, 1));
  let dLow = securityNoRep(syminfo.tickerid, "D", pinescript.offset(low, 1));
  let dClose = securityNoRep(syminfo.tickerid, "D", pinescript.offset(close, 1));
  let ema = pinescript.ema(close, 144);
  let emaBull = (close > ema);
  function equal_tf(res) {
    return ((pinescript.strToNumber(res) === f_chartTfInMinutes()) && !timeframe.isseconds);
  }
  function higher_tf(res) {
    return ((pinescript.strToNumber(res) > f_chartTfInMinutes()) || timeframe.isseconds);
  }
  function too_small_tf(res) {
    return ((timeframe.isweekly && (res === "1")) || (timeframe.ismonthly && (pinescript.strToNumber(res) < 10)));
  }
  function securityNoRep1(sym, res, src) {
    let bull_ = null;
    bull_ = (equal_tf(res) ? src : bull_);
    bull_ = (higher_tf(res) ? pinescript.requestSecurity(sym, res, src, barmerge.gaps_off, barmerge.lookahead_on) : bull_);
    let bull_array = request.security_lower_tf(syminfo.tickerid, (higher_tf(res) ? (pinescript.strToString(f_chartTfInMinutes()) + (timeframe.isseconds ? "S" : "")) : (too_small_tf(res) ? (timeframe.isweekly ? "3" : "10") : res)), src);
    if ((((pinescript.arraySize(bull_array) > 1) && !equal_tf(res)) && !higher_tf(res))) {
      {
        bull_ = pinescript.arrayPop(bull_array);
      }
    }
    pinescript.arrayClear(bull_array);
    return bull_;
  }
  function variant(type, src, len, offSig, offALMA) {
    let v1 = pinescript.sma(src, len);
    let v2 = pinescript.ema(src, len);
    let v3 = ((2 * v2) - pinescript.ema(v2, len));
    let v4 = ((3 * (v2 - pinescript.ema(v2, len))) + pinescript.ema(pinescript.ema(v2, len), len));
    let v5 = pinescript.wma(src, len);
    let v6 = pinescript.vwma(src, len);
    let v7 = 0;
    let sma_1 = pinescript.sma(src, len);
    v7 = (pinescript.na(pinescript.offset(v7, 1)) ? sma_1 : (((pinescript.offset(v7, 1) * (len - 1)) + src) / len));
    let v8 = pinescript.wma(((2 * pinescript.wma(src, (len / 2))) - pinescript.wma(src, len)), pinescript.round(pinescript.sqrt(len)));
    let v9 = pinescript.linreg(src, len, offSig);
    let v10 = pinescript.alma(src, len, offALMA, offSig);
    let v11 = pinescript.sma(v1, len);
    let a1 = math.exp(((-1.414 * 3.14159) / len));
    let b1 = ((2 * a1) * math.cos(((1.414 * 3.14159) / len)));
    let c2 = b1;
    let c3 = (-a1 * a1);
    let c1 = ((1 - c2) - c3);
    let v12 = 0;
    v12 = ((((c1 * (src + pinescript.nz(pinescript.offset(src, 1)))) / 2) + (c2 * pinescript.nz(pinescript.offset(v12, 1)))) + (c3 * pinescript.nz(pinescript.offset(v12, 2))));
    return ((type === "EMA") ? v2 : ((type === "DEMA") ? v3 : ((type === "TEMA") ? v4 : ((type === "WMA") ? v5 : ((type === "VWMA") ? v6 : ((type === "SMMA") ? v7 : ((type === "HullMA") ? v8 : ((type === "LSMA") ? v9 : ((type === "ALMA") ? v10 : ((type === "TMA") ? v11 : ((type === "SSMA") ? v12 : v1)))))))))));
  }
  function reso(exp, use, res) {
    let security_1 = pinescript.requestSecurity(syminfo.tickerid, res, exp, ({ gaps: barmerge.gaps_off, lookahead: barmerge.lookahead_on }));
    return (use ? security_1 : exp);
  }
  let closeSeries = variant(basisType, pinescript.offset(close, delayOffset), basisLen, offsetSigma, offsetALMA);
  let openSeries = variant(basisType, pinescript.offset(open, delayOffset), basisLen, offsetSigma, offsetALMA);
  let closeSeriesAlt = reso(closeSeries, useRes, stratRes);
  let openSeriesAlt = reso(openSeries, useRes, stratRes);
  let lxTrigger = false;
  let sxTrigger = false;
  let leTrigger = pinescript.cross(closeSeriesAlt, openSeriesAlt);
  let seTrigger = pinescript.cross(closeSeriesAlt, openSeriesAlt);
  let G_RISK = ("■ " + "Risk Management");
  let T_LVL = "(%) Exit Level";
  let T_QTY = "(%) Adjust trade exit volume";
  let T_MSG = "Paste JSON message for your bot";
  let O_LEMSG = "Long Entry";
  let O_LXMSGSL = "Long SL";
  let O_LXMSGTP1 = "Long TP1";
  let O_LXMSGTP2 = "Long TP2";
  let O_LXMSGTP3 = "Long TP3";
  let O_LXMSG = "Long Exit";
  let O_SEMSG = "Short Entry";
  let O_SXMSGSL = "Short SL";
  let O_SXMSGA = "Short TP1";
  let O_SXMSGB = "Short TP2";
  let O_SXMSGC = "Short TP3";
  let O_SXMSGX = "Short Exit";
  let i_lxLvlTP1 = input.float(1, "Level TP1", ({ group: G_RISK, tooltip: T_LVL }));
  let i_lxQtyTP1 = input.float(50, "Qty   TP1", ({ group: G_RISK, tooltip: T_QTY }));
  let i_lxLvlTP2 = input.float(1.5, "Level TP2", ({ group: G_RISK, tooltip: T_LVL }));
  let i_lxQtyTP2 = input.float(30, "Qty   TP2", ({ group: G_RISK, tooltip: T_QTY }));
  let i_lxLvlTP3 = input.float(2, "Level TP3", ({ group: G_RISK, tooltip: T_LVL }));
  let i_lxQtyTP3 = input.float(20, "Qty   TP3", ({ group: G_RISK, tooltip: T_QTY }));
  let i_lxLvlSL = input.float(0.5, "Stop Loss", ({ group: G_RISK, tooltip: T_LVL }));
  let i_sxLvlTP1 = i_lxLvlTP1;
  let i_sxQtyTP1 = i_lxQtyTP1;
  let i_sxLvlTP2 = i_lxLvlTP2;
  let i_sxQtyTP2 = i_lxQtyTP2;
  let i_sxLvlTP3 = i_lxLvlTP3;
  let i_sxQtyTP3 = i_lxQtyTP3;
  let i_sxLvlSL = i_lxLvlSL;
  let G_MSG = ("■ " + "Webhook Message");
  let i_leMsg = input.string(O_LEMSG, "Long Entry", ({ group: G_MSG, tooltip: T_MSG }));
  let i_lxMsgSL = input.string(O_LXMSGSL, "Long SL", ({ group: G_MSG, tooltip: T_MSG }));
  let i_lxMsgTP1 = input.string(O_LXMSGTP1, "Long TP1", ({ group: G_MSG, tooltip: T_MSG }));
  let i_lxMsgTP2 = input.string(O_LXMSGTP2, "Long TP2", ({ group: G_MSG, tooltip: T_MSG }));
  let i_lxMsgTP3 = input.string(O_LXMSGTP3, "Long TP3", ({ group: G_MSG, tooltip: T_MSG }));
  let i_lxMsg = input.string(O_LXMSG, "Long Exit", ({ group: G_MSG, tooltip: T_MSG }));
  let i_seMsg = input.string(O_SEMSG, "Short Entry", ({ group: G_MSG, tooltip: T_MSG }));
  let i_sxMsgSL = input.string(O_SXMSGSL, "Short SL", ({ group: G_MSG, tooltip: T_MSG }));
  let i_sxMsgTP1 = input.string(O_SXMSGA, "Short TP1", ({ group: G_MSG, tooltip: T_MSG }));
  let i_sxMsgTP2 = input.string(O_SXMSGB, "Short TP2", ({ group: G_MSG, tooltip: T_MSG }));
  let i_sxMsgTP3 = input.string(O_SXMSGC, "Short TP3", ({ group: G_MSG, tooltip: T_MSG }));
  let i_sxMsg = input.string(O_SXMSGX, "Short Exit", ({ group: G_MSG, tooltip: T_MSG }));
  let i_src = close;
  let G_DISPLAY = "Display";
  let i_alertOn = input.bool(true, "Alert Labels On/Off", ({ group: G_DISPLAY }));
  let i_barColOn = input.bool(true, "Bar Color On/Off", ({ group: G_DISPLAY }));
  function f_tp(_condition, _conditionValue, _leTrigger, _seTrigger, _src, _lxLvlTP, _sxLvlTP) {
    if (state._tpLine === undefined) state._tpLine = 0;
    let _topLvl = (_src + (_src * (_lxLvlTP / 100)));
    let _botLvl = (_src - (_src * (_sxLvlTP / 100)));
    state._tpLine = (((pinescript.offset(_condition, 1) !== _conditionValue) && _leTrigger) ? _topLvl : (((pinescript.offset(_condition, 1) !== -_conditionValue) && _seTrigger) ? _botLvl : pinescript.nz(pinescript.offset(state._tpLine, 1))));
    return [state._tpLine];
  }
  function f_cross(_scr1, _scr2, _over) {
    let _cross = (_over ? ((_scr1 > _scr2) && (pinescript.offset(_scr1, 1) < pinescript.offset(_scr2, 1))) : ((_scr1 < _scr2) && (pinescript.offset(_scr1, 1) > pinescript.offset(_scr2, 1))));
  }
  if (state.condition === undefined) state.condition = 0;
  if (state.slLine === undefined) state.slLine = 0;
  if (state.entryLine === undefined) state.entryLine = 0;
  state.entryLine = ((leTrigger && (pinescript.offset(state.condition, 1) <= 0)) ? close : ((seTrigger && (pinescript.offset(state.condition, 1) >= 0)) ? close : pinescript.nz(pinescript.offset(state.entryLine, 1))));
  let slTopLvl = (i_src + (i_src * (i_lxLvlSL / 100)));
  let slBotLvl = (i_src - (i_src * (i_sxLvlSL / 100)));
  state.slLine = (((pinescript.offset(state.condition, 1) <= 0) && leTrigger) ? slBotLvl : (((pinescript.offset(state.condition, 1) >= 0) && seTrigger) ? slTopLvl : pinescript.nz(pinescript.offset(state.slLine, 1))));
  let slLong = f_cross(low, state.slLine, false);
  let slShort = f_cross(high, state.slLine, true);
  let [tp3Line] = f_tp(state.condition, 1.2, leTrigger, seTrigger, i_src, i_lxLvlTP3, i_sxLvlTP3);
  let [tp2Line] = f_tp(state.condition, 1.1, leTrigger, seTrigger, i_src, i_lxLvlTP2, i_sxLvlTP2);
  let [tp1Line] = f_tp(state.condition, 1, leTrigger, seTrigger, i_src, i_lxLvlTP1, i_sxLvlTP1);
  let tp3Long = f_cross(high, tp3Line, true);
  let tp3Short = f_cross(low, tp3Line, false);
  let tp2Long = f_cross(high, tp2Line, true);
  let tp2Short = f_cross(low, tp2Line, false);
  let tp1Long = f_cross(high, tp1Line, true);
  let tp1Short = f_cross(low, tp1Line, false);
  state.condition = 0;
  state.condition = 0;
  state.condition = 0;
  state.condition = 0;
  state.condition = -1.1;
  state.condition = 1.1;
  state.condition = -1.2;
  state.condition = 1.2;
  state.condition = -1.3;
  state.condition = 1.3;
  state.condition = -1;
  state.condition = 1;
  (((leTrigger && (pinescript.offset(state.condition, 1) <= 0))) ? undefined : (((seTrigger && (pinescript.offset(state.condition, 1) >= 0))) ? undefined : (((tp3Long && (pinescript.offset(state.condition, 1) === 1.2))) ? undefined : (((tp3Short && (pinescript.offset(state.condition, 1) === -1.2))) ? undefined : (((tp2Long && (pinescript.offset(state.condition, 1) === 1.1))) ? undefined : (((tp2Short && (pinescript.offset(state.condition, 1) === -1.1))) ? undefined : (((tp1Long && (pinescript.offset(state.condition, 1) === 1))) ? undefined : (((tp1Short && (pinescript.offset(state.condition, 1) === -1))) ? undefined : (((slLong && (pinescript.offset(state.condition, 1) >= 1))) ? undefined : (((slShort && (pinescript.offset(state.condition, 1) <= -1))) ? undefined : (((lxTrigger && (pinescript.offset(state.condition, 1) >= 1))) ? undefined : (((sxTrigger && (pinescript.offset(state.condition, 1) <= -1))) ? undefined : null))))))))))));
  let longE = ((leTrigger && (pinescript.offset(state.condition, 1) <= 0)) && (state.condition === 1));
  let shortE = ((seTrigger && (pinescript.offset(state.condition, 1) >= 0)) && (state.condition === -1));
  let longX = ((lxTrigger && (pinescript.offset(state.condition, 1) >= 1)) && (state.condition === 0));
  let shortX = ((sxTrigger && (pinescript.offset(state.condition, 1) <= -1)) && (state.condition === 0));
  let longSL = ((slLong && (pinescript.offset(state.condition, 1) >= 1)) && (state.condition === 0));
  let shortSL = ((slShort && (pinescript.offset(state.condition, 1) <= -1)) && (state.condition === 0));
  let longTP3 = ((tp3Long && (pinescript.offset(state.condition, 1) === 1.2)) && (state.condition === 1.3));
  let shortTP3 = ((tp3Short && (pinescript.offset(state.condition, 1) === -1.2)) && (state.condition === -1.3));
  let longTP2 = ((tp2Long && (pinescript.offset(state.condition, 1) === 1.1)) && (state.condition === 1.2));
  let shortTP2 = ((tp2Short && (pinescript.offset(state.condition, 1) === -1.1)) && (state.condition === -1.2));
  let longTP1 = ((tp1Long && (pinescript.offset(state.condition, 1) === 1)) && (state.condition === 1.1));
  let shortTP1 = ((tp1Short && (pinescript.offset(state.condition, 1) === -1)) && (state.condition === -1.1));
  if ((((pinescript.strategy.position_size <= 0) && longE) && barstate.isconfirmed)) {
    {
      pinescript.strategyEntry("Long", pinescript.strategy.long, ({ alert_message: i_leMsg, comment: "LE" }));
    }
  }
  if (((pinescript.strategy.position_size > 0) && (state.condition === 1))) {
    {
      pinescript.strategyExit(({ id: "LXTP1", from_entry: "Long", qty_percent: i_lxQtyTP1, limit: tp1Line, stop: state.slLine, comment_profit: "LXTP1", comment_loss: "SL", alert_profit: i_lxMsgTP1, alert_loss: i_lxMsgSL }));
    }
  }
  if (((pinescript.strategy.position_size > 0) && (state.condition === 1.1))) {
    {
      pinescript.strategyExit(({ id: "LXTP2", from_entry: "Long", qty_percent: i_lxQtyTP2, limit: tp2Line, stop: state.slLine, comment_profit: "LXTP2", comment_loss: "SL", alert_profit: i_lxMsgTP2, alert_loss: i_lxMsgSL }));
    }
  }
  if (((pinescript.strategy.position_size > 0) && (state.condition === 1.2))) {
    {
      pinescript.strategyExit(({ id: "LXTP3", from_entry: "Long", qty_percent: i_lxQtyTP3, limit: tp3Line, stop: state.slLine, comment_profit: "LXTP3", comment_loss: "SL", alert_profit: i_lxMsgTP3, alert_loss: i_lxMsgSL }));
    }
  }
  if (longX) {
    {
      pinescript.strategyClose("Long", ({ alert_message: i_lxMsg, comment: "LX" }));
    }
  }
  if ((((pinescript.strategy.position_size >= 0) && shortE) && barstate.isconfirmed)) {
    {
      pinescript.strategyEntry("Short", pinescript.strategy.short, ({ alert_message: i_leMsg, comment: "SE" }));
    }
  }
  if (((pinescript.strategy.position_size < 0) && (state.condition === -1))) {
    {
      pinescript.strategyExit(({ id: "SXTP1", from_entry: "Short", qty_percent: i_sxQtyTP1, limit: tp1Line, stop: state.slLine, comment_profit: "SXTP1", comment_loss: "SL", alert_profit: i_sxMsgTP1, alert_loss: i_sxMsgSL }));
    }
  }
  if (((pinescript.strategy.position_size < 0) && (state.condition === -1.1))) {
    {
      pinescript.strategyExit(({ id: "SXTP2", from_entry: "Short", qty_percent: i_sxQtyTP2, limit: tp2Line, stop: state.slLine, comment_profit: "SXTP2", comment_loss: "SL", alert_profit: i_sxMsgTP2, alert_loss: i_sxMsgSL }));
    }
  }
  if (((pinescript.strategy.position_size < 0) && (state.condition === -1.2))) {
    {
      pinescript.strategyExit(({ id: "SXTP3", from_entry: "Short", qty_percent: i_sxQtyTP3, limit: tp3Line, stop: state.slLine, comment_profit: "SXTP3", comment_loss: "SL", alert_profit: i_sxMsgTP3, alert_loss: i_sxMsgSL }));
    }
  }
  if (shortX) {
    {
      pinescript.strategyClose("Short", ({ alert_message: i_sxMsg, comment: "SX" }));
    }
  }
  let c_tp = ((leTrigger || seTrigger) ? null : ((state.condition === 0) ? null : pinescript.color.green));
  let c_entry = ((leTrigger || seTrigger) ? null : ((state.condition === 0) ? null : pinescript.color.blue));
  let c_sl = ((leTrigger || seTrigger) ? null : ((state.condition === 0) ? null : pinescript.color.red));
  let p_tp1Line = pinescript.plot((((state.condition === 1) || (state.condition === -1)) ? tp1Line : null), ({ title: "TP Line 1", color: c_tp, linewidth: 1, style: plot.style_linebr }));
  let p_tp2Line = pinescript.plot((((((state.condition === 1) || (state.condition === -1)) || (state.condition === 1.1)) || (state.condition === -1.1)) ? tp2Line : null), ({ title: "TP Line 2", color: c_tp, linewidth: 1, style: plot.style_linebr }));
  let p_tp3Line = pinescript.plot((((((((state.condition === 1) || (state.condition === -1)) || (state.condition === 1.1)) || (state.condition === -1.1)) || (state.condition === 1.2)) || (state.condition === -1.2)) ? tp3Line : null), ({ title: "TP Line 3", color: c_tp, linewidth: 1, style: plot.style_linebr }));
  let p_entryLine = pinescript.plot((((state.condition >= 1) || (state.condition <= -1)) ? state.entryLine : null), ({ title: "Entry Line", color: c_entry, linewidth: 1, style: plot.style_linebr }));
  let p_slLine = pinescript.plot((((((((state.condition === 1) || (state.condition === -1)) || (state.condition === 1.1)) || (state.condition === -1.1)) || (state.condition === 1.2)) || (state.condition === -1.2)) ? state.slLine : null), ({ title: "SL Line", color: c_sl, linewidth: 1, style: plot.style_linebr }));
  pinescript.fill(p_tp3Line, p_entryLine, ({ color: ((leTrigger || seTrigger) ? null : pinescript.color.new(pinescript.color.green, 90)) }));
  pinescript.fill(p_entryLine, p_slLine, ({ color: ((leTrigger || seTrigger) ? null : pinescript.color.new(pinescript.color.red, 90)) }));
  pinescript.plotshape((i_alertOn && longE), ({ title: "Long", text: "Long", textcolor: pinescript.color.white, color: pinescript.color.green, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.belowbar }));
  pinescript.plotshape((i_alertOn && shortE), ({ title: "Short", text: "Short", textcolor: pinescript.color.white, color: pinescript.color.red, style: pinescript.shape.labeldown, size: pinescript.size.tiny, location: pinescript.location.abovebar }));
  pinescript.plotshape(((i_alertOn && (longX || shortX)) ? close : null), ({ title: "Close", text: "Close", textcolor: pinescript.color.white, color: pinescript.color.gray, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.absolute }));
  let l_tp = ((i_alertOn && (longTP1 || shortTP1)) ? close : null);
  pinescript.plotshape(l_tp, ({ title: "TP1 Cross", text: "TP1", textcolor: pinescript.color.white, color: pinescript.color.olive, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.absolute }));
  pinescript.plotshape(((i_alertOn && (longTP2 || shortTP2)) ? close : null), ({ title: "TP2 Cross", text: "TP2", textcolor: pinescript.color.white, color: pinescript.color.olive, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.absolute }));
  pinescript.plotshape(((i_alertOn && (longTP3 || shortTP3)) ? close : null), ({ title: "TP3 Cross", text: "TP3", textcolor: pinescript.color.white, color: pinescript.color.olive, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.absolute }));
  pinescript.plotshape(((i_alertOn && (longSL || shortSL)) ? close : null), ({ title: "SL Cross", text: "SL", textcolor: pinescript.color.white, color: pinescript.color.maroon, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.absolute }));
  pinescript.plot(null, ({ title: "─── <debug> ───", editable: false, display: display.data_window }));
  pinescript.plot(state.condition, ({ title: "condition", editable: false, display: display.data_window }));
  pinescript.plot((pinescript.strategy.position_size * 100), ({ title: ".position_size", editable: false, display: display.data_window }));
  function f_qDq(_array, _val) {
    pinescript.arrayPush(_array, _val);
    let _return = pinescript.arrayShift(_array);
    return _return;
  }
  if (state.a_slLine === undefined) state.a_slLine = pinescript.arrayNew(1);
  if (state.a_entryLine === undefined) state.a_entryLine = pinescript.arrayNew(1);
  if (state.a_tp3Line === undefined) state.a_tp3Line = pinescript.arrayNew(1);
  if (state.a_tp2Line === undefined) state.a_tp2Line = pinescript.arrayNew(1);
  if (state.a_tp1Line === undefined) state.a_tp1Line = pinescript.arrayNew(1);
  if (state.a_slLabel === undefined) state.a_slLabel = pinescript.arrayNew(1);
  if (state.a_tp3label === undefined) state.a_tp3label = pinescript.arrayNew(1);
  if (state.a_tp2label === undefined) state.a_tp2label = pinescript.arrayNew(1);
  if (state.a_tp1label === undefined) state.a_tp1label = pinescript.arrayNew(1);
  if (state.a_entryLabel === undefined) state.a_entryLabel = pinescript.arrayNew(1);
  let newEntry = (longE || shortE);
  let entryIndex = 1;
  entryIndex = (newEntry ? bar_index : pinescript.nz(pinescript.offset(entryIndex, 1)));
  let lasTrade = (bar_index >= entryIndex);
  let l_right = 10;
  pinescript.lineDelete(f_qDq(state.a_slLine, pinescript.lineNew(entryIndex, state.slLine, (last_bar_index + l_right), state.slLine, ({ style: line.style_solid, color: c_sl }))));
  pinescript.lineDelete(f_qDq(state.a_entryLine, pinescript.lineNew(entryIndex, state.entryLine, (last_bar_index + l_right), state.entryLine, ({ style: line.style_solid, color: pinescript.color.blue }))));
  pinescript.lineDelete(f_qDq(state.a_tp3Line, pinescript.lineNew(entryIndex, tp3Line, (last_bar_index + l_right), tp3Line, ({ style: line.style_solid, color: c_tp }))));
  pinescript.lineDelete(f_qDq(state.a_tp2Line, pinescript.lineNew(entryIndex, tp2Line, (last_bar_index + l_right), tp2Line, ({ style: line.style_solid, color: c_tp }))));
  pinescript.lineDelete(f_qDq(state.a_tp1Line, pinescript.lineNew(entryIndex, tp1Line, (last_bar_index + l_right), tp1Line, ({ style: line.style_solid, color: c_tp }))));
  pinescript.labelDelete(f_qDq(state.a_slLabel, pinescript.labelNew((last_bar_index + l_right), state.slLine, ("SL: " + pinescript.strToString(state.slLine, "##.###")), ({ style: label.style_label_left, textcolor: pinescript.color.white, color: c_sl }))));
  pinescript.labelDelete(f_qDq(state.a_entryLabel, pinescript.labelNew((last_bar_index + l_right), state.entryLine, ("Entry: " + pinescript.strToString(state.entryLine, "##.###")), ({ style: label.style_label_left, textcolor: pinescript.color.white, color: pinescript.color.blue }))));
  pinescript.labelDelete(f_qDq(state.a_tp3label, pinescript.labelNew((last_bar_index + l_right), tp3Line, ("TP3: " + pinescript.strToString(tp3Line, "##.###")), ({ style: label.style_label_left, textcolor: pinescript.color.white, color: c_tp }))));
  pinescript.labelDelete(f_qDq(state.a_tp2label, pinescript.labelNew((last_bar_index + l_right), tp2Line, ("TP2: " + pinescript.strToString(tp2Line, "##.###")), ({ style: label.style_label_left, textcolor: pinescript.color.white, color: c_tp }))));
  pinescript.labelDelete(f_qDq(state.a_tp1label, pinescript.labelNew((last_bar_index + l_right), tp1Line, ("TP1: " + pinescript.strToString(tp1Line, "##.###")), ({ style: label.style_label_left, textcolor: pinescript.color.white, color: c_tp }))));
  let c_barCol = ((close > open) ? pinescript.color.rgb(120, 9, 139) : pinescript.color.rgb(69, 155, 225));
  barcolor((i_barColOn ? c_barCol : null));
  if ((((longE || shortE) || longX) || shortX)) {
    {
      pinescript.alert(({ message: "Any Alert", freq: alert.freq_once_per_bar_close }));
    }
  }
  if (longE) {
    {
      pinescript.alert(({ message: "Long Entry", freq: alert.freq_once_per_bar_close }));
    }
  }
  if (shortE) {
    {
      pinescript.alert(({ message: "Short Entry", freq: alert.freq_once_per_bar_close }));
    }
  }
  if (longX) {
    {
      pinescript.alert(({ message: "Long Exit", freq: alert.freq_once_per_bar_close }));
    }
  }
  if (shortX) {
    {
      pinescript.alert(({ message: "Short Exit", freq: alert.freq_once_per_bar_close }));
    }
  }
}


// Export for use

export { main
};
