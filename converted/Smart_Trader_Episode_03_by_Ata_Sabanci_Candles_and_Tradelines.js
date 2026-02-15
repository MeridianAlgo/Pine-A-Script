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
  time: 1771178052949,
  timenow: 1771178052949,
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

const BlockAnalytics = { new: function(valid, totalBuy, totalSell, delta, blockHeight, blockArea, avgUpperPin, avgLowerPin, avgBody, newOpen, newHigh, newLow, newClose, startIdx, endIdx, centerIdx, boxBottom, trendType, trendLocked) { return { valid: valid, totalBuy: totalBuy, totalSell: totalSell, delta: delta, blockHeight: blockHeight, blockArea: blockArea, avgUpperPin: avgUpperPin, avgLowerPin: avgLowerPin, avgBody: avgBody, newOpen: newOpen, newHigh: newHigh, newLow: newLow, newClose: newClose, startIdx: startIdx, endIdx: endIdx, centerIdx: centerIdx, boxBottom: boxBottom, trendType: trendType, trendLocked: trendLocked }; } };
const BoxCore = { new: function(valid, sumBuy, sumSell, delta, pocPrice, pocOff, pocVol, maxBuyVal, maxBuyOff, maxBuyHigh, maxSellVal, maxSellOff, maxSellLow, minBuyVal, minBuyOff, minBuyHigh, minSellVal, minSellOff, minSellLow) { return { valid: valid, sumBuy: sumBuy, sumSell: sumSell, delta: delta, pocPrice: pocPrice, pocOff: pocOff, pocVol: pocVol, maxBuyVal: maxBuyVal, maxBuyOff: maxBuyOff, maxBuyHigh: maxBuyHigh, maxSellVal: maxSellVal, maxSellOff: maxSellOff, maxSellLow: maxSellLow, minBuyVal: minBuyVal, minBuyOff: minBuyOff, minBuyHigh: minBuyHigh, minSellVal: minSellVal, minSellOff: minSellOff, minSellLow: minSellLow }; } };
const TrendChannel = { new: function(channelType, startBlock, endBlock, angleDeg, upperX1, upperX2, lowerX1, lowerX2, upperY1, upperY2, lowerY1, lowerY2, upperLine, lowerLine) { return { channelType: channelType, startBlock: startBlock, endBlock: endBlock, angleDeg: angleDeg, upperX1: upperX1, upperX2: upperX2, lowerX1: lowerX1, lowerX2: lowerX2, upperY1: upperY1, upperY2: upperY2, lowerY1: lowerY1, lowerY2: lowerY2, upperLine: upperLine, lowerLine: lowerLine }; } };
const CurrentBarAnalysis = { new: function(barRange, bodySize, upperWick, lowerWick, bodyRatio, upperWickRatio, lowerWickRatio, pattern, patternBias, isBullishBar, rangeVsATR, rangeStatus, volumeVsAvg, volumeStatus, buyVol, sellVol, delta, pressureStatus) { return { barRange: barRange, bodySize: bodySize, upperWick: upperWick, lowerWick: lowerWick, bodyRatio: bodyRatio, upperWickRatio: upperWickRatio, lowerWickRatio: lowerWickRatio, pattern: pattern, patternBias: patternBias, isBullishBar: isBullishBar, rangeVsATR: rangeVsATR, rangeStatus: rangeStatus, volumeVsAvg: volumeVsAvg, volumeStatus: volumeStatus, buyVol: buyVol, sellVol: sellVol, delta: delta, pressureStatus: pressureStatus }; } };
const CompositeAnalysis = { new: function(compRange, compBodySize, compUpperWick, compLowerWick, compBodyRatio, compositePattern, compositeBias, blockRelation, blockRelationBias) { return { compRange: compRange, compBodySize: compBodySize, compUpperWick: compUpperWick, compLowerWick: compLowerWick, compBodyRatio: compBodyRatio, compositePattern: compositePattern, compositeBias: compositeBias, blockRelation: blockRelation, blockRelationBias: blockRelationBias }; } };
const TrendContext = { new: function(currentType, currentBlocks, currentLabel, prevType, prevLabel, transition, trendChanges, qualityScore, confidenceLevel, strengthRating) { return { currentType: currentType, currentBlocks: currentBlocks, currentLabel: currentLabel, prevType: prevType, prevLabel: prevLabel, transition: transition, trendChanges: trendChanges, qualityScore: qualityScore, confidenceLevel: confidenceLevel, strengthRating: strengthRating }; } };
const NarrativeData = { new: function(trendType, strengthLabel, qualityScore, blockRange, transitionType, pricePattern, channelStatus, upperAngle, lowerAngle, blockPatternDesc, hasDivergence, dominance, trendDeltaPct, volumeMomentum, barPattern, barPatternBias, barRangeStatus, barVolumeStatus, barDelta, barPressure, bodyTrend, upperPinChgPct, lowerPinChgPct, pinSignal, compositeForm, channelPositionPct, positionZone, resistanceLevel1, resistanceSource1, resistanceLevel2, resistanceSource2, supportLevel1, supportSource1, supportLevel2, supportSource2, trendAssessment, contradictionCount, warnings) { return { trendType: trendType, strengthLabel: strengthLabel, qualityScore: qualityScore, blockRange: blockRange, transitionType: transitionType, pricePattern: pricePattern, channelStatus: channelStatus, upperAngle: upperAngle, lowerAngle: lowerAngle, blockPatternDesc: blockPatternDesc, hasDivergence: hasDivergence, dominance: dominance, trendDeltaPct: trendDeltaPct, volumeMomentum: volumeMomentum, barPattern: barPattern, barPatternBias: barPatternBias, barRangeStatus: barRangeStatus, barVolumeStatus: barVolumeStatus, barDelta: barDelta, barPressure: barPressure, bodyTrend: bodyTrend, upperPinChgPct: upperPinChgPct, lowerPinChgPct: lowerPinChgPct, pinSignal: pinSignal, compositeForm: compositeForm, channelPositionPct: channelPositionPct, positionZone: positionZone, resistanceLevel1: resistanceLevel1, resistanceSource1: resistanceSource1, resistanceLevel2: resistanceLevel2, resistanceSource2: resistanceSource2, supportLevel1: supportLevel1, supportSource1: supportSource1, supportLevel2: supportLevel2, supportSource2: supportSource2, trendAssessment: trendAssessment, contradictionCount: contradictionCount, warnings: warnings }; } };
const DisplayedLevels = { new: function(hasPOCUp, pocUp, pocUpBox, hasPOCDn, pocDn, pocDnBox, hasCoreUp, coreUp, coreUpType, coreUpBox, hasCoreDn, coreDn, coreDnType, coreDnBox) { return { hasPOCUp: hasPOCUp, pocUp: pocUp, pocUpBox: pocUpBox, hasPOCDn: hasPOCDn, pocDn: pocDn, pocDnBox: pocDnBox, hasCoreUp: hasCoreUp, coreUp: coreUp, coreUpType: coreUpType, coreUpBox: coreUpBox, hasCoreDn: hasCoreDn, coreDn: coreDn, coreDnType: coreDnType, coreDnBox: coreDnBox }; } };

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
  // Study: Smart Trader, Episode 03, by Ata Sabancı | Candles and Tradelines
  // Options: {"shorttitle":"ST-EP03","overlay":true,"max_bars_back":5000,"max_labels_count":500,"max_boxes_count":500,"max_lines_count":500}
  let G_MAIN = "═══ Main Settings ═══";
  let i_window = input.int(100, "Window Bars", ({ minval: 1, group: G_MAIN }));
  let i_groups = input.int(20, "Group Count", ({ minval: 1, group: G_MAIN }));
  let i_calcBasis = input.string("Closed (bar[1])", "Calculation Basis", ({ options: ["Closed (bar[1])", "Current (bar[0])"], group: G_MAIN }));
  let baseOff = ((i_calcBasis === "Current (bar[0])") ? 0 : 1);
  let i_showGroupNums = input.bool(true, "Show Group Numbers", ({ group: G_MAIN }));
  let i_showGroupBoxes = input.bool(true, "Show Group Boxes", ({ group: G_MAIN }));
  let i_boxColor = input.color(pinescript.color.gray, "Box Color", ({ group: G_MAIN }));
  let i_boxTransp = input.int(85, "Box Transparency", ({ minval: 0, maxval: 100, group: G_MAIN }));
  let i_globalTextSizeStr = input.string("Small", "Global Text Size", ({ options: ["Tiny", "Small", "Normal", "Large"], group: G_MAIN, tooltip: "Applies to ALL text elements on chart: labels, dashboard, trend lines, etc." }));
  let GLOBAL_TEXT_SIZE = ((i_globalTextSizeStr === "Tiny") ? pinescript.size.tiny : ((i_globalTextSizeStr === "Normal") ? pinescript.size.normal : ((i_globalTextSizeStr === "Large") ? pinescript.size.large : pinescript.size.small)));
  let G_ANALYTICS = "═══ Block Analytics ═══";
  let i_showCompositeCandle = input.bool(false, "Show Composite Candle", ({ group: G_ANALYTICS, tooltip: "Displays a ghost-like composite candle at the center of each block representing aggregated OHLC." }));
  let i_compositeCandleTransp = input.int(50, "Composite Candle Transparency", ({ minval: 50, maxval: 95, group: G_ANALYTICS, tooltip: "Transparency level for the ghost-like composite candle (higher = more transparent)." }));
  let i_dimOriginalCandles = input.bool(true, "Dim Original Candles", ({ group: G_ANALYTICS, tooltip: "When composite candles are shown, dims the original chart candles to make composites stand out." }));
  let i_originalCandleDimLevel = input.int(95, "Original Candle Dim Level", ({ minval: 50, maxval: 95, group: G_ANALYTICS, tooltip: "Transparency level for dimmed original candles (higher = more transparent/faded)." }));
  let groupSize = pinescript.max(1, int(pinescript.round((float(i_window) / i_groups))));
  let effWindow = (groupSize * i_groups);
  let _dimBullish = pinescript.color.new(pinescript.color.rgb(34, 197, 94), i_originalCandleDimLevel);
  let _dimBearish = pinescript.color.new(pinescript.color.rgb(239, 68, 68), i_originalCandleDimLevel);
  let _dimNeutral = pinescript.color.new(pinescript.color.rgb(120, 120, 120), i_originalCandleDimLevel);
  let _originalCandleColor = ((close > open) ? _dimBullish : ((close < open) ? _dimBearish : _dimNeutral));
  barcolor(((i_showCompositeCandle && i_dimOriginalCandles) ? _originalCandleColor : null));
  function clear(_this) {
    if (!pinescript.na(_this.upperLine)) {
      pinescript.lineDelete(_this.upperLine);
    }
    if (!pinescript.na(_this.lowerLine)) {
      pinescript.lineDelete(_this.lowerLine);
    }
  }
  function init(_this) {
    _this.warnings = pinescript.arrayNew();
    return _this;
  }
  function syncFromCore(_this, pocUpP, pocUpBox, pocDnP, pocDnBox, coreUpP, coreUpType, coreUpBox, coreDnP, coreDnType, coreDnBox) {
    _this.hasPOCUp = false;
    _this.pocUp = null;
    _this.pocUpBox = null;
    _this.hasPOCDn = false;
    _this.pocDn = null;
    _this.pocDnBox = null;
    _this.hasCoreUp = false;
    _this.coreUp = null;
    _this.coreUpType = null;
    _this.coreUpBox = null;
    _this.hasCoreDn = false;
    _this.coreDn = null;
    _this.coreDnType = null;
    _this.coreDnBox = null;
    if (!pinescript.na(pocUpP)) {
      _this.hasPOCUp = true;
      _this.pocUp = pocUpP;
      _this.pocUpBox = pocUpBox;
    }
    if (!pinescript.na(pocDnP)) {
      _this.hasPOCDn = true;
      _this.pocDn = pocDnP;
      _this.pocDnBox = pocDnBox;
    }
    if (!pinescript.na(coreUpP)) {
      _this.hasCoreUp = true;
      _this.coreUp = coreUpP;
      _this.coreUpType = coreUpType;
      _this.coreUpBox = coreUpBox;
    }
    if (!pinescript.na(coreDnP)) {
      _this.hasCoreDn = true;
      _this.coreDn = coreDnP;
      _this.coreDnType = coreDnType;
      _this.coreDnBox = coreDnBox;
    }
    return _this;
  }
  if (state.lblNums === undefined) state.lblNums = pinescript.arrayNew();
  if (state.grpBoxes === undefined) state.grpBoxes = pinescript.arrayNew();
  if (state.analyticsData === undefined) state.analyticsData = pinescript.arrayNew();
  if (state.compositeBodies === undefined) state.compositeBodies = pinescript.arrayNew();
  if (state.compositeUpperWicks === undefined) state.compositeUpperWicks = pinescript.arrayNew();
  if (state.compositeLowerWicks === undefined) state.compositeLowerWicks = pinescript.arrayNew();
  if (state.coreBoxes === undefined) state.coreBoxes = pinescript.arrayNew();
  if (state.trendChannels === undefined) state.trendChannels = pinescript.arrayNew();
  if (state.lblTrendResist === undefined) state.lblTrendResist = null;
  if (state.lblTrendSupport === undefined) state.lblTrendSupport = null;
  if (state.g_currentBar === undefined) state.g_currentBar = CurrentBarAnalysis.new();
  if (state.g_composite === undefined) state.g_composite = CompositeAnalysis.new();
  if (state.g_trendContext === undefined) state.g_trendContext = TrendContext.new();
  if (state.g_narrative === undefined) state.g_narrative = NarrativeData.new();
  if (state.g_pocUpP === undefined) state.g_pocUpP = null;
  if (state.g_pocDnP === undefined) state.g_pocDnP = null;
  if (state.g_levels === undefined) state.g_levels = DisplayedLevels.new();
  if (state.g_binPocPrice === undefined) state.g_binPocPrice = pinescript.arrayNew();
  if (state.g_binPocOff === undefined) state.g_binPocOff = pinescript.arrayNew();
  if (state.g_binPocVol === undefined) state.g_binPocVol = pinescript.arrayNew();
  function f_ensureLabelCount(n) {
    while ((pinescript.arraySize(state.lblNums) < n)) {
      pinescript.arrayPush(state.lblNums, pinescript.labelNew(bar_index, high, "", ({ style: label.style_label_down, size: GLOBAL_TEXT_SIZE, textcolor: pinescript.color.white, color: pinescript.color.new(pinescript.color.black, 70) })));
    }
    while ((pinescript.arraySize(state.lblNums) > n)) {
      pinescript.labelDelete(pinescript.arrayPop(state.lblNums));
    }
    if ((pinescript.arraySize(state.lblNums) > 0)) {
      for (let j = 0; j <= (pinescript.arraySize(state.lblNums) - 1); j++) {
        label.set_size(pinescript.arrayGet(state.lblNums, j), GLOBAL_TEXT_SIZE);
      }
    }
  }
  function f_ensureBoxCount(n) {
    while ((pinescript.arraySize(state.grpBoxes) < n)) {
      pinescript.arrayPush(state.grpBoxes, box.new(bar_index, high, bar_index, low, ({ bgcolor: pinescript.color.new(i_boxColor, i_boxTransp), border_color: pinescript.color.new(pinescript.color.black, 100), border_width: 0 })));
    }
    while ((pinescript.arraySize(state.grpBoxes) > n)) {
      box.delete(pinescript.arrayPop(state.grpBoxes));
    }
  }
  function f_analyticsEmpty() {
    return BlockAnalytics.new(false, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, false);
  }
  function f_ensureAnalyticsDataCount(n) {
    while ((pinescript.arraySize(state.analyticsData) < n)) {
      pinescript.arrayPush(state.analyticsData, f_analyticsEmpty());
    }
    while ((pinescript.arraySize(state.analyticsData) > n)) {
      pinescript.arrayPop(state.analyticsData);
    }
  }
  function f_ensureCompositeBodyCount(n) {
    while ((pinescript.arraySize(state.compositeBodies) < n)) {
      pinescript.arrayPush(state.compositeBodies, box.new(bar_index, high, bar_index, low, ({ bgcolor: pinescript.color.new(pinescript.color.gray, 75), border_color: pinescript.color.new(pinescript.color.gray, 60), border_width: 1 })));
    }
    while ((pinescript.arraySize(state.compositeBodies) > n)) {
      box.delete(pinescript.arrayPop(state.compositeBodies));
    }
  }
  function f_ensureCompositeUpperWickCount(n) {
    while ((pinescript.arraySize(state.compositeUpperWicks) < n)) {
      pinescript.arrayPush(state.compositeUpperWicks, pinescript.lineNew(bar_index, high, bar_index, high, ({ color: pinescript.color.new(pinescript.color.gray, 70), width: 1 })));
    }
    while ((pinescript.arraySize(state.compositeUpperWicks) > n)) {
      pinescript.lineDelete(pinescript.arrayPop(state.compositeUpperWicks));
    }
  }
  function f_ensureCompositeLowerWickCount(n) {
    while ((pinescript.arraySize(state.compositeLowerWicks) < n)) {
      pinescript.arrayPush(state.compositeLowerWicks, pinescript.lineNew(bar_index, low, bar_index, low, ({ color: pinescript.color.new(pinescript.color.gray, 70), width: 1 })));
    }
    while ((pinescript.arraySize(state.compositeLowerWicks) > n)) {
      pinescript.lineDelete(pinescript.arrayPop(state.compositeLowerWicks));
    }
  }
  function f_coreEmpty() {
    return BoxCore.new(false, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  }
  function f_ensureCoreCount(n) {
    while ((pinescript.arraySize(state.coreBoxes) < n)) {
      pinescript.arrayPush(state.coreBoxes, f_coreEmpty());
    }
    while ((pinescript.arraySize(state.coreBoxes) > n)) {
      pinescript.arrayPop(state.coreBoxes);
    }
  }
  let DIR_UP = 1;
  let DIR_DOWN = -1;
  let DIR_RANGE = 0;
  let G_NARRATIVE = "═══ Market Narrative ═══";
  let i_narrativeEnable = input.bool(true, "Enable Market Narrative", ({ group: G_NARRATIVE, tooltip: "Displays -generated market analysis based on calculated data. Educational purposes only." }));
  let i_narrativeLang = input.string("English", "Narrative Language", ({ options: ["English", "Türkçe", "हिन्दी", "العربية"], group: G_NARRATIVE, tooltip: "Select language for market narrative output." }));
  let i_narrativeShowDisclaimer = input.bool(true, "Show Educational Disclaimer", ({ group: G_NARRATIVE, tooltip: "Display legal disclaimer: Not investment advice, educational purposes only." }));
  function f_L(en, tr, hi, ar) {
    return ((i_narrativeLang === "Türkçe") ? tr : ((i_narrativeLang === "हिन्दी") ? hi : ((i_narrativeLang === "العربية") ? ar : en)));
  }
  function f_trendTypeStr(t) {
    return ((t === DIR_UP) ? f_L("UPTREND", "YÜKSELİŞ TRENDİ", "तेजी का रुझान", "اتجاه صاعد") : ((t === DIR_DOWN) ? f_L("DOWNTREND", "DÜŞÜŞ TRENDİ", "मंदी का रुझान", "اتجاه هابط") : f_L("RANGE", "YATAY SEYİR", "दायरा", "نطاق عرضي")));
  }
  function f_strengthStr(angle) {
    return ((pinescript.abs(angle) > 45) ? f_L("VERY STRONG", "ÇOK GÜÇLÜ", "बहुत मजबूत", "قوي جداً") : ((pinescript.abs(angle) > 30) ? f_L("STRONG", "GÜÇLÜ", "मजबूत", "قوي") : ((pinescript.abs(angle) > 15) ? f_L("MODERATE", "ORTA", "मध्यम", "متوسط") : f_L("WEAK", "ZAYIF", "कमजोर", "ضعيف"))));
  }
  function f_confidenceStr(q) {
    return ((q >= 80) ? f_L("HIGH", "YÜKSEK", "उच्च", "مرتفع") : ((q >= 60) ? f_L("MEDIUM", "ORTA", "मध्यम", "متوسط") : f_L("LOW", "DÜŞÜK", "निम्न", "منخفض")));
  }
  function f_channelStatusStr(upperA, lowerA) {
    let diff = (pinescript.abs(upperA) - pinescript.abs(lowerA));
    return ((diff > 3) ? f_L("EXPANDING", "GENİŞLEYEN", "विस्तारित", "متوسع") : ((diff < -3) ? f_L("CONTRACTING", "DARALAN", "संकुचित", "متقلص") : f_L("PARALLEL", "PARALEL", "समानांतर", "متوازي")));
  }
  function f_dominanceStr(delta) {
    return ((delta > 0) ? f_L("BUYERS", "ALICILAR", "खरीदार", "المشترون") : ((delta < 0) ? f_L("SELLERS", "SATICILAR", "विक्रेता", "البائعون") : f_L("BALANCED", "DENGELİ", "संतुलित", "متوازن")));
  }
  function f_positionZoneStr(pos) {
    return ((pos > 66.67) ? f_L("UPPER ZONE", "ÜST BÖLGE", "ऊपरी क्षेत्र", "المنطقة العليا") : ((pos < 33.33) ? f_L("LOWER ZONE", "ALT BÖLGE", "निचला क्षेत्र", "المنطقة السفلى") : f_L("MIDDLE ZONE", "ORTA BÖLGE", "मध्य क्षेत्र", "المنطقة الوسطى")));
  }
  function f_bodyStatusStr(s) {
    return ((s === "EXPANDING") ? f_L("EXPANDING", "GENİŞLEYEN", "विस्तारित", "متوسع") : ((s === "CONTRACTING") ? f_L("CONTRACTING", "DARALAN", "संकुचित", "متقلص") : f_L("STABLE", "STABLE", "स्थिर", "مستقر")));
  }
  function f_volMomentumStr(s) {
    return (pinescript.strContains(s, "INCREASING") ? f_L("INCREASING", "ARTIYOR", "बढ़ रहा है", "متزايد") : f_L("DECREASING", "AZALIYOR", "घट रहा है", "متناقص"));
  }
  function f_candlePatternStr(p) {
    return ((p === "DOJI") ? f_L("DOJI", "DOJI", "डोजी", "دوجي") : ((p === "SPINNING_TOP") ? f_L("SPINNING TOP", "TOPAÇ", "स्पिनिंग टॉप", "قمة دوّارة") : ((p === "MARUBOZU") ? f_L("MARUBOZU", "MARUBOZU", "मारूबोज़ू", "ماروبوزو") : ((p === "HAMMER") ? f_L("HAMMER", "ÇEKİÇ", "हैमर", "مطرقة") : ((p === "INV_HAMMER") ? f_L("INVERTED HAMMER", "TERS ÇEKİÇ", "उल्टा हैमर", "مطرقة مقلوبة") : ((p === "DRAGONFLY") ? f_L("DRAGONFLY DOJI", "YUSUFÇUK DOJI", "ड्रैगनफ्लाई डोजी", "دوجي اليعسوب") : ((p === "GRAVESTONE") ? f_L("GRAVESTONE DOJI", "MEZAR TAŞI DOJI", "ग्रेवस्टोन डोजी", "دوجي شاهد القبر") : ((p === "LONG_UPPER") ? f_L("LONG UPPER WICK", "UZUN ÜST FİTİL", "लंबी ऊपरी बत्ती", "فتيل علوي طويل") : ((p === "LONG_LOWER") ? f_L("LONG LOWER WICK", "UZUN ALT FİTİL", "लंबी निचली बत्ती", "فتيل سفلي طويل") : f_L("STANDARD", "STANDART", "मानक", "قياسي"))))))))));
  }
  function f_patternBiasStr(b) {
    return ((b === "BULLISH") ? f_L("BULLISH", "BOĞA", "तेजी", "صعودي") : ((b === "BEARISH") ? f_L("BEARISH", "AYI", "मंदी", "هبوطي") : f_L("NEUTRAL", "NÖTR", "तटस्थ", "محايد")));
  }
  function f_rangeStatusStr(s) {
    return ((s === "WIDE") ? f_L("WIDE RANGE", "GENİŞ ARALIK", "विस्तृत रेंज", "نطاق واسع") : ((s === "NARROW") ? f_L("NARROW RANGE", "DAR ARALIK", "संकीर्ण रेंज", "نطاق ضيق") : f_L("NORMAL RANGE", "NORMAL ARALIK", "सामान्य रेंज", "نطاق طبيعي")));
  }
  function f_pressureStr(s) {
    return ((s === "BUYING") ? f_L("Buying pressure", "Alım baskısı", "खरीद दबाव", "ضغط شرائي") : ((s === "SELLING") ? f_L("Selling pressure", "Satış baskısı", "बिक्री दबाव", "ضغط بيعي") : f_L("Balanced pressure", "Dengeli baskı", "संतुलित दबाव", "ضغط متوازن")));
  }
  function f_transitionStr(t) {
    return ((t === "REVERSAL_TO_UP") ? f_L("Reversal from downtrend", "Düşüşten dönüş", "गिरावट से पलटाव", "انعكاس من الاتجاه الهابط") : ((t === "REVERSAL_TO_DOWN") ? f_L("Reversal from uptrend", "Yükselişten dönüş", "तेजी से पलटाव", "انعكاس من الاتجاه الصاعد") : ((t === "CONTINUATION") ? f_L("Trend continuation", "Trend devamı", "रुझान जारी", "استمرار الاتجاه") : f_L("New trend forming", "Yeni trend oluşuyor", "नया रुझान बन रहा है", "تشكّل اتجاه جديد"))));
  }
  function f_blockRelationStr(r) {
    return ((r === "ENGULFING") ? f_L("Engulfing pattern", "Yutan formasyonu", "इंगल्फिंग पैटर्न", "نموذج ابتلاعي") : ((r === "INSIDE") ? f_L("Inside bar pattern", "İç bar formasyonu", "इनसाइड बार पैटर्न", "نموذج الشمعة الداخلية") : ((r === "OUTSIDE") ? f_L("Outside bar pattern", "Dış bar formasyonu", "आउटसाइड बार पैटर्न", "نموذج الشمعة الخارجية") : f_L("Normal structure", "Normal yapı", "सामान्य संरचना", "هيكل طبيعي"))));
  }
  function f_sectionHeader(n) {
    return ((n === 1) ? f_L("TREND ANALYSIS", "TREND ANALİZİ", "रुझान विश्लेषण", "تحليل الاتجاه") : ((n === 2) ? f_L("PRICE STRUCTURE", "FİYAT YAPISI", "मूल्य संरचना", "هيكل السعر") : ((n === 3) ? f_L("VOLUME ANALYSIS", "HACİM ANALİZİ", "वॉल्यूम विश्लेषण", "تحليل الحجم") : ((n === 4) ? f_L("CURRENT BAR", "GÜNCEL BAR", "वर्तमान बार", "الشمعة الحالية") : ((n === 5) ? f_L("MOMENTUM", "MOMENTUM", "गति", "الزخم") : ((n === 6) ? f_L("CHANNEL POSITION", "KANAL POZİSYONU", "चैनल स्थिति", "موقع القناة") : ((n === 7) ? f_L("KEY LEVELS", "KRİTİK SEVİYELER", "महत्वपूर्ण स्तर", "المستويات الرئيسية") : ((n === 8) ? f_L("ASSESSMENT", "DEĞERLENDİRME", "मूल्यांकन", "التقييم") : f_L("DISCLAIMER", "YASAL UYARI", "अस्वीकरण", "إخلاء المسؤولية")))))))));
  }
  function f_phrase(key) {
    return ((key === "DIVERGENCE") ? f_L("Divergence detected", "Uyumsuzluk tespit edildi", "विचलन पाया गया", "تم رصد تباين") : ((key === "NO_DIVERGENCE") ? f_L("No divergence", "Uyumsuzluk yok", "कोई विचलन नहीं", "لا يوجد تباين") : ((key === "RESISTANCE") ? f_L("Resistance", "Direnç", "प्रतिरोध", "مقاومة") : ((key === "SUPPORT") ? f_L("Support", "Destek", "समर्थन", "دعم") : ((key === "UPPER_CHANNEL") ? f_L("Upper channel", "Üst kanal", "ऊपरी चैनल", "القناة العليا") : ((key === "LOWER_CHANNEL") ? f_L("Lower channel", "Alt kanal", "निचला चैनल", "القناة السفلى") : ((key === "HH_HL") ? f_L("Higher Highs / Higher Lows", "Yükselen Tepeler / Yükselen Dipler", "उच्च ऊंचाई / उच्च निम्न", "قمم أعلى / قيعان أعلى") : ((key === "LH_LL") ? f_L("Lower Highs / Lower Lows", "Alçalan Tepeler / Alçalan Dipler", "निम्न ऊंचाई / निम्न निम्न", "قمم أدنى / قيعان أدنى") : ((key === "DISCLAIMER_TEXT") ? f_L("⚠️ IMPORTANT: This analysis is for educational purposes only and does not constitute investment advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions.", "⚠️ ÖNEMLİ: Bu analiz sadece eğitim amaçlıdır ve yatırım tavsiyesi teşkil etmez. Yatırım kararları vermeden önce her zaman kendi araştırmanızı yapın ve kalifiye bir finansal danışmana danışın.", "⚠️ महत्वपूर्ण: यह विश्लेषण केवल शैक्षिक उद्देश्यों के लिए है और निवेश सलाह नहीं है। निवेश निर्णय लेने से पहले हमेशा अपना शोध करें और योग्य वित्तीय सलाहकार से परामर्श करें।", "⚠️ هام: هذا التحليل لأغراض تعليمية فقط ولا يُشكّل نصيحة استثمارية. قم دائماً بإجراء بحثك الخاص واستشر مستشاراً مالياً مؤهلاً قبل اتخاذ قرارات الاستثمار.") : ((key === "CONTRADICTIONS") ? f_L("Contradictions", "Çelişkiler", "विरोधाभास", "تناقضات") : ((key === "WARNING") ? f_L("Warning", "Uyarı", "चेतावनी", "تحذير") : ((key === "QUALITY") ? f_L("Quality", "Kalite", "गुणवत्ता", "الجودة") : ((key === "BLOCKS") ? f_L("Blocks", "Bloklar", "ब्लॉक", "الكتل") : "")))))))))))));
  }
  function f_dashVolumeEngine() {
    return f_L("VOLUME ENGINE", "HACİM MOTORU", "वॉल्यूम इंजन", "محرك الحجم");
  }
  function f_dashEngine() {
    return f_L("Engine:", "Motor:", "इंजन:", "المحرك:");
  }
  function f_dashData() {
    return f_L("Data:", "Veri:", "डेटा:", "البيانات:");
  }
  function f_dashBar() {
    return f_L("bar", "bar", "बार", "شمعة");
  }
  function f_dashCurrentCandle() {
    return f_L("CURRENT CANDLE • VOLUMETRIC", "MEVCUT MUM • HACİMSEL", "वर्तमान कैंडल • वॉल्यूमेट्रिक", "الشمعة الحالية • حجمي");
  }
  function f_dashClosedCandle() {
    return f_L("CLOSED CANDLE • VOLUMETRIC", "KAPALI MUM • HACİMSEL", "बंद कैंडल • वॉल्यूमेट्रिक", "الشمعة المغلقة • حجمي");
  }
  function f_dashGeometric() {
    return f_L("(Geometric)", "(Geometrik)", "(ज्यामितीय)", "(هندسي)");
  }
  function f_dashIntrabar() {
    return f_L("(Intrabar • LTF:", "(Intrabar • LTF:", "(इंट्राबार • LTF:", "(داخل الشمعة • LTF:");
  }
  function f_dashBuy() {
    return f_L("▲ Buy", "▲ Alım", "▲ खरीद", "▲ شراء");
  }
  function f_dashSell() {
    return f_L("▼ Sell", "▼ Satış", "▼ बिक्री", "▼ بيع");
  }
  function f_dashTotal() {
    return f_L("◆ Total", "◆ Toplam", "◆ कुल", "◆ الإجمالي");
  }
  function f_dashDelta() {
    return f_L("Delta", "Delta", "डेल्टा", "الدلتا");
  }
  function f_dashTrendVolumetrics() {
    return f_L("TREND VOLUMETRICS", "TREND HACİMSEL", "रुझान वॉल्यूमेट्रिक", "حجم الاتجاه");
  }
  function f_dashType() {
    return f_L("Type", "Tür", "प्रकार", "النوع");
  }
  function f_dashUptrend() {
    return f_L("UPTREND", "YÜKSELİŞ", "तेजी", "صاعد");
  }
  function f_dashDowntrend() {
    return f_L("DOWNTREND", "DÜŞÜŞ", "मंदी", "هابط");
  }
  function f_dashRange() {
    return f_L("RANGE", "YATAY", "दायरा", "عرضي");
  }
  function f_dashPressureMomentum() {
    return f_L("PRESSURE & MOMENTUM", "BASKI & MOMENTUM", "दबाव और गति", "الضغط والزخم");
  }
  function f_dashSellers() {
    return f_L("▲ Sellers", "▲ Satıcılar", "▲ विक्रेता", "▲ البائعون");
  }
  function f_dashBuyers() {
    return f_L("▼ Buyers", "▼ Alıcılar", "▼ खरीदार", "▼ المشترون");
  }
  function f_dashBodyAVG() {
    return f_L("Body AVG", "Gövde ORT", "बॉडी औसत", "متوسط الجسم");
  }
  function f_dashTrend() {
    return f_L("Trend", "Trend", "रुझान", "الاتجاه");
  }
  function f_dashExpanding() {
    return f_L("EXPANDING", "GENİŞLEYEN", "विस्तारित", "متوسع");
  }
  function f_dashContracting() {
    return f_L("CONTRACTING", "DARALAN", "संकुचित", "متقلص");
  }
  function f_dashStable() {
    return f_L("STABLE", "STABLE", "स्थिर", "مستقر");
  }
  function f_dashTrendChannelBoundaries() {
    return f_L("TREND CHANNEL BOUNDARIES", "TREND KANAL SINIRLARI", "रुझान चैनल सीमाएं", "حدود قناة الاتجاه");
  }
  function f_dashUpperChannel() {
    return f_L("▲ Upper Channel @", "▲ Üst Kanal @", "▲ ऊपरी चैनल @", "▲ القناة العليا @");
  }
  function f_dashLowerChannel() {
    return f_L("▼ Lower Channel @", "▼ Alt Kanal @", "▼ निचला चैनल @", "▼ القناة السفلى @");
  }
  function f_dashNeutral() {
    return f_L("NEUTRAL", "NÖTR", "तटस्थ", "محايد");
  }
  function f_dashOverbought() {
    return f_L("OVERBOUGHT", "AŞIRI ALIM", "अधिक खरीद", "تشبّع شرائي");
  }
  function f_dashOversold() {
    return f_L("OVERSOLD", "AŞIRI SATIM", "अधिक बिक्री", "تشبّع بيعي");
  }
  function f_dashTrendIntelligence() {
    return f_L("TREND INTELLIGENCE", "TREND ZEKASI", "रुझान बुद्धि", "ذكاء الاتجاه");
  }
  function f_dashHigh() {
    return f_L("HIGH", "YÜKSEK", "उच्च", "مرتفع");
  }
  function f_dashMedium() {
    return f_L("MEDIUM", "ORTA", "मध्यम", "متوسط");
  }
  function f_dashLow() {
    return f_L("LOW", "DÜŞÜK", "निम्न", "منخفض");
  }
  function f_dashVeryStrong() {
    return f_L("VERY STRONG", "ÇOK GÜÇLÜ", "बहुत मजबूत", "قوي جداً");
  }
  function f_dashStrong() {
    return f_L("STRONG", "GÜÇLÜ", "मजबूत", "قوي");
  }
  function f_dashModerate() {
    return f_L("MODERATE", "ORTA", "मध्यम", "متوسط");
  }
  function f_dashWeak() {
    return f_L("WEAK", "ZAYIF", "कमजोर", "ضعيف");
  }
  function f_dashIncreasing() {
    return f_L("INCREASING ▲", "ARTIYOR ▲", "बढ़ रहा है ▲", "متزايد ▲");
  }
  function f_dashDecreasing() {
    return f_L("DECREASING ▼", "AZALIYOR ▼", "घट रहा है ▼", "متناقص ▼");
  }
  function f_dashTooltipEngine() {
    return f_L("Real-time volume calculation engine", "Gerçek zamanlı hacim hesaplama motoru", "वास्तविक समय वॉल्यूम गणना इंजन", "محرك حساب الحجم في الوقت الفعلي");
  }
  function f_dashTooltipMethod() {
    return f_L("Intrabar: precise LTF data | Geometric: approximation", "Intrabar: kesin LTF verisi | Geometrik: yaklaşık", "इंट्राबार: सटीक LTF डेटा | ज्यामितीय: अनुमान", "داخل الشمعة: بيانات LTF دقيقة | هندسي: تقريبي");
  }
  function f_dashTooltipData() {
    return f_L("Available historical bars", "Mevcut geçmiş barlar", "उपलब्ध ऐतिहासिक बार", "الشموع التاريخية المتاحة");
  }
  function f_dashTooltipScannable() {
    return f_L("Total scannable bars with valid volume data", "Geçerli hacim verisi olan toplam taranabilir barlar", "मान्य वॉल्यूम डेटा वाले कुल स्कैन करने योग्य बार", "إجمالي الشموع القابلة للمسح ببيانات حجم صالحة");
  }
  function f_dashTooltipBuy() {
    return f_L("Buying volume (aggressive buyers)", "Alım hacmi (agresif alıcılar)", "खरीद वॉल्यूम (आक्रामक खरीदार)", "حجم الشراء (مشترون عدوانيون)");
  }
  function f_dashTooltipSell() {
    return f_L("Selling volume (aggressive sellers)", "Satış hacmi (agresif satıcılar)", "बिक्री वॉल्यूम (आक्रामक विक्रेता)", "حجم البيع (بائعون عدوانيون)");
  }
  function f_dashTooltipTotal() {
    return f_L("Total volume (buy + sell)", "Toplam hacim (alım + satış)", "कुल वॉल्यूम (खरीद + बिक्री)", "الحجم الإجمالي (شراء + بيع)");
  }
  function f_dashTooltipDelta() {
    return f_L("Net delta (buy - sell)", "Net delta (alım - satış)", "शुद्ध डेल्टा (खरीद - बिक्री)", "صافي الدلتا (شراء - بيع)");
  }
  function f_dashTooltipTrendVolume() {
    return f_L("Aggregated volume data across latest active trend", "En son aktif trend boyunca toplanan hacim verisi", "नवीनतम सक्रिय रुझान में एकत्रित वॉल्यूम डेटा", "بيانات الحجم المجمّعة عبر أحدث اتجاه نشط");
  }
  function f_dashTooltipTrendBuy() {
    return f_L("Total buy volume across trend blocks", "Trend blokları boyunca toplam alım hacmi", "रुझान ब्लॉकों में कुल खरीद वॉल्यूम", "إجمالي حجم الشراء عبر كتل الاتجاه");
  }
  function f_dashTooltipTrendSell() {
    return f_L("Total sell volume across trend blocks", "Trend blokları boyunca toplam satış hacmi", "रुझान ब्लॉकों में कुल बिक्री वॉल्यूम", "إجمالي حجم البيع عبر كتل الاتجاه");
  }
  function f_dashTooltipTrendDelta() {
    return f_L("Net delta with percentage", "Yüzde ile net delta", "प्रतिशत के साथ शुद्ध डेल्टा", "صافي الدلتا مع النسبة المئوية");
  }
  function f_dashTooltipType() {
    return f_L("Trend direction classification", "Trend yönü sınıflandırması", "रुझान दिशा वर्गीकरण", "تصنيف اتجاه الترند");
  }
  function f_dashTooltipPressure() {
    return f_L("Pin rejection pressure and volume momentum analysis", "Pin reddetme baskısı ve hacim momentum analizi", "पिन अस्वीकृति दबाव और वॉल्यूम गति विश्लेषण", "تحليل ضغط رفض الفتيل وزخم الحجم");
  }
  function f_dashTooltipSellersPin() {
    return f_L("Average upper pin (seller rejection)", "Ortalama üst pin (satıcı reddi)", "औसत ऊपरी पिन (विक्रेता अस्वीकृति)", "متوسط الفتيل العلوي (رفض البائعين)");
  }
  function f_dashTooltipBuyersPin() {
    return f_L("Average lower pin (buyer rejection)", "Ortalama alt pin (alıcı reddi)", "औसत निचली पिन (खरीदार अस्वीकृति)", "متوسط الفتيل السفلي (رفض المشترين)");
  }
  function f_dashTooltipBodyAVG() {
    return f_L("Average candle body size", "Ortalama mum gövdesi boyutu", "औसत कैंडल बॉडी आकार", "متوسط حجم جسم الشمعة");
  }
  function f_dashTooltipBodyTrend() {
    return f_L("Body expansion status", "Gövde genişleme durumu", "बॉडी विस्तार स्थिति", "حالة توسّع الجسم");
  }
  function f_dashTooltipChannelBounds() {
    return f_L("Upper/Lower trend-channel boundaries (display-aligned)", "Üst/Alt trend-kanal sınırları (görüntüye hizalı)", "ऊपरी/निचली रुझान-चैनल सीमाएं (प्रदर्शन-संरेखित)", "الحدود العليا/السفلى لقناة الاتجاه (محاذاة العرض)");
  }
  function f_dashTooltipUpper() {
    return f_L("Upper channel boundary | Δ vs current price", "Üst kanal sınırı | Mevcut fiyat karşısında Δ", "ऊपरी चैनल सीमा | वर्तमान मूल्य बनाम Δ", "حد القناة العليا | Δ مقابل السعر الحالي");
  }
  function f_dashTooltipLower() {
    return f_L("Lower channel boundary | Δ vs current price", "Alt kanal sınırı | Mevcut fiyat karşısında Δ", "निचली चैनल सीमा | वर्तमान मूल्य बनाम Δ", "حد القناة السفلى | Δ مقابل السعر الحالي");
  }
  function f_dashTooltipWidth() {
    return f_L("Channel width (upper - lower)", "Kanal genişliği (üst - alt)", "चैनल चौड़ाई (ऊपरी - निचली)", "عرض القناة (العليا - السفلى)");
  }
  function f_dashTooltipPosition() {
    return f_L("Price position within channel (0%=lower, 100%=upper)", "Kanal içinde fiyat pozisyonu (0%=alt, 100%=üst)", "चैनल के भीतर मूल्य स्थिति (0%=निचला, 100%=ऊपरी)", "موقع السعر داخل القناة (0%=السفلى، 100%=العليا)");
  }
  function f_dashTooltipRR() {
    return f_L("Risk/Reward ratio (distance to upper : distance to lower)", "Risk/Ödül oranı (üste mesafe : alta mesafe)", "जोखिम/इनाम अनुपात (ऊपर की दूरी : नीचे की दूरी)", "نسبة المخاطرة/العائد (المسافة للعليا : المسافة للسفلى)");
  }
  function f_dashTooltipStatus() {
    return f_L("Position status within channel", "Kanal içinde pozisyon durumu", "चैनल के भीतर स्थिति स्थिति", "حالة الموقع داخل القناة");
  }
  function f_dashTooltipQuality(q, c) {
    return f_L((((("Trend quality: Score: " + pinescript.strToString(q, "#")) + "/100 | Angle(15) + Delta(10) + Volume(10) + Body(10) + Pins(8) - Conflicts(") + pinescript.strToString(c)) + ")"), (((("Trend kalitesi: Puan: " + pinescript.strToString(q, "#")) + "/100 | Açı(15) + Delta(10) + Hacim(10) + Gövde(10) + Pinler(8) - Çatışmalar(") + pinescript.strToString(c)) + ")"), (((("रुझान गुणवत्ता: स्कोर: " + pinescript.strToString(q, "#")) + "/100 | कोण(15) + डेल्टा(10) + वॉल्यूम(10) + बॉडी(10) + पिन(8) - संघर्ष(") + pinescript.strToString(c)) + ")"), (((("جودة الاتجاه: النقاط: " + pinescript.strToString(q, "#")) + "/100 | الزاوية(15) + الدلتا(10) + الحجم(10) + الجسم(10) + الفتيل(8) - التناقضات(") + pinescript.strToString(c)) + ")"));
  }
  function f_dashTooltipConfidence() {
    return f_L("Confidence level based on quality score", "Kalite puanına dayalı güven seviyesi", "गुणवत्ता स्कोर के आधार पर विश्वास स्तर", "مستوى الثقة بناءً على نقاط الجودة");
  }
  function f_dashTooltipStrength() {
    return f_L("Trend strength based on angle steepness", "Açı dikliğine dayalı trend gücü", "कोण तीव्रता के आधार पर रुझान शक्ति", "قوة الاتجاه بناءً على حدّة الزاوية");
  }
  function f_dashTooltipVolMomentum() {
    return f_L("Volume momentum direction across blocks", "Bloklar boyunca hacim momentum yönü", "ब्लॉकों में वॉल्यूम गति दिशा", "اتجاه زخم الحجم عبر الكتل");
  }
  function f_isHigherPosition(a, b) {
    if ((!a.valid || !b.valid)) {
      DIR_RANGE;
    } else {
      let midA = ((a.newHigh + a.newLow) / 2);
      let midB = ((b.newHigh + b.newLow) / 2);
      ((midA > midB) ? DIR_UP : ((midA < midB) ? DIR_DOWN : DIR_RANGE));
    }
  }
  function f_yangZhangVolatility(period) {
    let sumOvSq = 0;
    let sumOv = 0;
    let sumClSq = 0;
    let sumCl = 0;
    let sumRS = 0;
    let n = pinescript.max(2, period);
    for (let i = 0; i <= (n - 1); i++) {
      let ov = math.log((pinescript.offset(open, i) / pinescript.offset(close, (i + 1))));
      sumOv += ov;
      sumOvSq += (ov * ov);
      let cl = math.log((pinescript.offset(close, i) / pinescript.offset(open, i)));
      sumCl += cl;
      sumClSq += (cl * cl);
      let logHO = math.log((pinescript.offset(high, i) / pinescript.offset(open, i)));
      let logHC = math.log((pinescript.offset(high, i) / pinescript.offset(close, i)));
      let logLO = math.log((pinescript.offset(low, i) / pinescript.offset(open, i)));
      let logLC = math.log((pinescript.offset(low, i) / pinescript.offset(close, i)));
      sumRS += ((logHO * logHC) + (logLO * logLC));
    }
    let nm1 = float((n - 1));
    let varOv = ((sumOvSq / nm1) - ((sumOv * sumOv) / (float(n) * nm1)));
    let varCl = ((sumClSq / nm1) - ((sumCl * sumCl) / (float(n) * nm1)));
    let varRS = (sumRS / float(n));
    let k = (0.34 / (1.34 + (float((n + 1)) / float((n - 1)))));
    let varYZ = ((varOv + (k * varCl)) + ((1 - k) * varRS));
    let sigma = pinescript.sqrt(pinescript.max(0, varYZ));
    return (sigma * close);
  }
  function f_calcChannelAngle(priceChange, barSpan, yzVolPrice) {
    if (((barSpan === 0) || (yzVolPrice <= 0))) {
      0;
    } else {
      let expectedMove = (yzVolPrice * pinescript.sqrt(float(barSpan)));
      let normalizedChange = ((expectedMove > 0) ? (priceChange / expectedMove) : 0);
      math.todegrees(math.atan(normalizedChange));
    }
  }
  function f_clearAllChannels() {
    let n = pinescript.arraySize(state.trendChannels);
    if ((n > 0)) {
      for (let i = 0; i <= (n - 1); i++) {
        let ch = pinescript.arrayGet(state.trendChannels, i);
        clear(ch);
      }
    }
    return clear(pinescript.array, state.trendChannels);
  }
  function f_lockBlockTrend(blockIdx, trendType) {
    if ((blockIdx < pinescript.arraySize(state.analyticsData))) {
      let blk = pinescript.arrayGet(state.analyticsData, blockIdx);
      if (!blk.trendLocked) {
        blk.trendType = trendType;
        blk.trendLocked = true;
        pinescript.arraySet(state.analyticsData, blockIdx, blk);
      }
    }
  }
  function f_findSegmentExtremes(segStart, segEnd) {
    let highestHigh = null;
    let lowestHigh = null;
    let highestLow = null;
    let lowestLow = null;
    let highestHighIdx = null;
    let lowestHighIdx = null;
    let highestLowIdx = null;
    let lowestLowIdx = null;
    for (let i = segStart; i <= segEnd; i++) {
      if ((i < pinescript.arraySize(state.analyticsData))) {
        let blk = pinescript.arrayGet(state.analyticsData, i);
        if (blk.valid) {
          if ((pinescript.na(highestHigh) || (blk.newHigh > highestHigh))) {
            highestHigh = blk.newHigh;
            highestHighIdx = blk.centerIdx;
          }
          if ((pinescript.na(lowestHigh) || (blk.newHigh < lowestHigh))) {
            lowestHigh = blk.newHigh;
            lowestHighIdx = blk.centerIdx;
          }
          if ((pinescript.na(highestLow) || (blk.newLow > highestLow))) {
            highestLow = blk.newLow;
            highestLowIdx = blk.centerIdx;
          }
          if ((pinescript.na(lowestLow) || (blk.newLow < lowestLow))) {
            lowestLow = blk.newLow;
            lowestLowIdx = blk.centerIdx;
          }
        }
      }
    }
    return [highestHigh, lowestHigh, highestLow, lowestLow, highestHighIdx, lowestHighIdx, highestLowIdx, lowestLowIdx];
  }
  function f_detectTrendChannels(rangeThreshold, yzVol) {
    let numBlocks = pinescript.arraySize(state.analyticsData);
    if ((numBlocks < 2)) {
      false;
    } else {
      let i = 0;
      while ((i < (numBlocks - 1))) {
        let newerBlk = pinescript.arrayGet(state.analyticsData, i);
        let olderBlk = pinescript.arrayGet(state.analyticsData, (i + 1));
        let dir = 0;
        if (newerBlk.trendLocked) {
          dir = newerBlk.trendType;
        } else {
          dir = f_isHigherPosition(newerBlk, olderBlk);
        }
        if ((dir === DIR_RANGE)) {
          f_lockBlockTrend(i, DIR_RANGE);
          i += 1;
          continue;
        }
        let segStart = i;
        let segEnd = (i + 1);
        f_lockBlockTrend(segStart, dir);
        while ((segEnd < (numBlocks - 1))) {
          let blkNewer = pinescript.arrayGet(state.analyticsData, segEnd);
          let blkOlder = pinescript.arrayGet(state.analyticsData, (segEnd + 1));
          let nextDir = 0;
          if (blkNewer.trendLocked) {
            nextDir = blkNewer.trendType;
          } else {
            nextDir = f_isHigherPosition(blkNewer, blkOlder);
          }
          if (((nextDir === dir) || (blkOlder.trendLocked && (blkOlder.trendType === dir)))) {
            f_lockBlockTrend(segEnd, dir);
            segEnd += 1;
          } else {
            f_lockBlockTrend(segEnd, nextDir);
            break;
          }
        }
        f_lockBlockTrend(segEnd, dir);
        let [highestHigh, lowestHigh, highestLow, lowestLow, hhIdx, lhIdx, hlIdx, llIdx] = f_findSegmentExtremes(segStart, segEnd);
        if ((((!pinescript.na(highestHigh) && !pinescript.na(lowestHigh)) && !pinescript.na(highestLow)) && !pinescript.na(lowestLow))) {
          let blkOldest = pinescript.arrayGet(state.analyticsData, segEnd);
          let blkNewest = pinescript.arrayGet(state.analyticsData, segStart);
          let segmentX1 = blkOldest.centerIdx;
          let segmentX2 = blkNewest.centerIdx;
          let upperSlope = null;
          let lowerSlope = null;
          let upperY1 = null;
          let upperY2 = null;
          let lowerY1 = null;
          let lowerY2 = null;
          if ((dir === DIR_DOWN)) {
            let upperSpan = (lhIdx - hhIdx);
            let lowerSpan = (llIdx - hlIdx);
            upperSlope = ((upperSpan !== 0) ? ((lowestHigh - highestHigh) / upperSpan) : 0);
            lowerSlope = ((lowerSpan !== 0) ? ((lowestLow - highestLow) / lowerSpan) : 0);
            upperY1 = (highestHigh + (upperSlope * (segmentX1 - hhIdx)));
            upperY2 = (highestHigh + (upperSlope * (segmentX2 - hhIdx)));
            lowerY1 = (highestLow + (lowerSlope * (segmentX1 - hlIdx)));
            lowerY2 = (highestLow + (lowerSlope * (segmentX2 - hlIdx)));
          } else {
            if ((dir === DIR_UP)) {
              let upperSpan = (hhIdx - lhIdx);
              let lowerSpan = (hlIdx - llIdx);
              upperSlope = ((upperSpan !== 0) ? ((highestHigh - lowestHigh) / upperSpan) : 0);
              lowerSlope = ((lowerSpan !== 0) ? ((highestLow - lowestLow) / lowerSpan) : 0);
              upperY1 = (lowestHigh + (upperSlope * (segmentX1 - lhIdx)));
              upperY2 = (lowestHigh + (upperSlope * (segmentX2 - lhIdx)));
              lowerY1 = (lowestLow + (lowerSlope * (segmentX1 - llIdx)));
              lowerY2 = (lowestLow + (lowerSlope * (segmentX2 - llIdx)));
            } else {
              upperSlope = 0;
              lowerSlope = 0;
              upperY1 = blkOldest.newHigh;
              upperY2 = blkNewest.newHigh;
              lowerY1 = blkOldest.newLow;
              lowerY2 = blkNewest.newLow;
            }
          }
          let midY1 = ((upperY1 + lowerY1) / 2);
          let midY2 = ((upperY2 + lowerY2) / 2);
          let priceChange = (midY2 - midY1);
          let segmentSpan = pinescript.abs((segmentX2 - segmentX1));
          let angleDeg = f_calcChannelAngle(priceChange, segmentSpan, yzVol);
          let upperX1 = segmentX1;
          let upperX2 = segmentX2;
          let lowerX1 = segmentX1;
          let lowerX2 = segmentX2;
          let finalType = dir;
          if ((pinescript.abs(angleDeg) <= rangeThreshold)) {
            finalType = 0;
          }
          let channel = TrendChannel.new(finalType, (segStart + 1), (segEnd + 1), angleDeg, upperX1, upperX2, lowerX1, lowerX2, upperY1, upperY2, lowerY1, lowerY2, null, null);
          pinescript.arrayPush(state.trendChannels, channel);
        }
        i = (segEnd + 1);
      }
      true;
    }
  }
  function f_drawAllChannels(projLen, upCol, dnCol, rangeCol, lineWidth, lineStyle, showRange) {
    let lstyle = ((lineStyle === "solid") ? line.style_solid : ((lineStyle === "dashed") ? line.style_dashed : line.style_dotted));
    let n = pinescript.arraySize(state.trendChannels);
    if ((n > 0)) {
      for (let i = 0; i <= (n - 1); i++) {
        let ch = pinescript.arrayGet(state.trendChannels, i);
        if (((ch.channelType === DIR_RANGE) && !showRange)) {
          continue;
        }
        let chCol = ((ch.channelType === DIR_UP) ? upCol : ((ch.channelType === DIR_DOWN) ? dnCol : rangeCol));
        let currentProjLen = ((i === 0) ? projLen : 0);
        let upperBarSpan = (ch.upperX2 - ch.upperX1);
        let lowerBarSpan = (ch.lowerX2 - ch.lowerX1);
        let upperSlope = ((upperBarSpan > 0) ? ((ch.upperY2 - ch.upperY1) / upperBarSpan) : 0);
        let lowerSlope = ((lowerBarSpan > 0) ? ((ch.lowerY2 - ch.lowerY1) / lowerBarSpan) : 0);
        let upperX2Proj = (ch.upperX2 + currentProjLen);
        let lowerX2Proj = (ch.lowerX2 + currentProjLen);
        let upperY2Proj = (ch.upperY2 + (upperSlope * currentProjLen));
        let lowerY2Proj = (ch.lowerY2 + (lowerSlope * currentProjLen));
        let upperLn = pinescript.lineNew(ch.upperX1, ch.upperY1, upperX2Proj, upperY2Proj, ({ xloc: xloc.bar_index, extend: extend.none, color: chCol, width: lineWidth, style: lstyle }));
        let lowerLn = pinescript.lineNew(ch.lowerX1, ch.lowerY1, lowerX2Proj, lowerY2Proj, ({ xloc: xloc.bar_index, extend: extend.none, color: chCol, width: lineWidth, style: lstyle }));
        ch.upperLine = upperLn;
        ch.lowerLine = lowerLn;
        pinescript.arraySet(state.trendChannels, i, ch);
      }
    }
  }
  let G_VOL = "═══ Volume Engine ═══";
  let G_DASH = "═══ Smart Dashboard ═══";
  let i_calcMethod = input.string("Geometry (Approx)", "Calculation Method", ({ options: ["Geometry (Approx)", "Intrabar (Precise)"], group: G_VOL }));
  let i_useCustomLTF = input.bool(true, "Use custom lower timeframe", ({ group: G_VOL }));
  let i_customLTF = input.timeframe("15S", "Lower timeframe (LTF)", ({ group: G_VOL }));
  let i_globalPeriodBoxes = input.int(5, "Global Period (Boxes)", ({ minval: 1, maxval: 200, group: G_VOL }));
  let i_showDash = input.bool(true, "Show Dashboard", ({ group: G_DASH }));
  let i_dashPos = input.string(pinescript.position.top_right, "Position", ({ options: [pinescript.position.top_right, pinescript.position.bottom_right, pinescript.position.bottom_left], group: G_DASH }));
  let G_TREND = "═══ Multi-Segment Trend ═══";
  let i_trendEnable = input.bool(true, "Enable Trend Detection", ({ group: G_TREND, tooltip: "Multi-segment trend system using ghost candle HH/HL/LH/LL pattern detection." }));
  let i_rangeAngleThreshold = input.float(10, "Range Angle Threshold (°)", ({ minval: 1, maxval: 45, step: 1, group: G_TREND, tooltip: "Lines with angle ≤ this value are classified as RANGE." }));
  let i_trendMinBlocks = input.int(2, "Minimum Blocks per Segment", ({ minval: 2, maxval: 10, group: G_TREND, tooltip: "Minimum blocks required to draw a segment line." }));
  let i_showRangeSegments = input.bool(true, "Show Range Segments", ({ group: G_TREND, tooltip: "Draw lines for range/sideways segments." }));
  let i_trendUpColor = input.color(pinescript.color.rgb(34, 197, 94), "Uptrend Line Color", ({ group: G_TREND, tooltip: "Color for uptrend support lines (green)." }));
  let i_trendDnColor = input.color(pinescript.color.rgb(239, 68, 68), "Downtrend Line Color", ({ group: G_TREND, tooltip: "Color for downtrend resistance lines (red)." }));
  let i_trendRangeColor = input.color(pinescript.color.rgb(148, 163, 184), "Range Line Color", ({ group: G_TREND, tooltip: "Color for range/sideways lines (gray)." }));
  let i_trendLineWidth = input.int(2, "Trend Line Width", ({ minval: 1, maxval: 5, group: G_TREND }));
  let i_trendLineStyle = input.string("solid", "Trend Line Style", ({ options: ["solid", "dashed", "dotted"], group: G_TREND }));
  let i_trendProject = input.bool(true, "Project to Future", ({ group: G_TREND, tooltip: "Extend trend lines into the future by one block width." }));
  let G_CORE = "═══ Core Calculation ═══";
  let i_coreEnable = input.bool(true, "Enable Core Calculation", ({ group: G_CORE }));
  let i_coreDrawLines = input.bool(true, "Draw Core Lines", ({ group: G_CORE }));
  let i_coreProjectFwd = input.bool(true, "Offset / Projection (to Future)", ({ group: G_CORE }));
  let i_coreNearestOnly = input.bool(true, "Nearest Only (1 Up / 1 Down)", ({ group: G_CORE }));
  let i_coreShowMax = input.bool(true, "Include MAX Buy/Sell Levels", ({ group: G_CORE }));
  let i_coreShowMin = input.bool(true, "Include MIN Buy/Sell Levels", ({ group: G_CORE }));
  let i_pocEnable = input.bool(true, "Enable POC", ({ group: G_CORE }));
  let i_pocShowNearest = input.bool(true, "Show POC Nearest Up/Down", ({ group: G_CORE }));
  let i_pocBinProfile = input.bool(true, "POC: Volume Profile Bins (All Plans)", ({ group: G_CORE, tooltip: "True Volume Profile POC — available on ALL TradingView plans (Free, Plus, Premium, Ultimate).nnHow it works: Divides each block's price range into equal bins, distributes each bar's volume proportionally across the bins its range overlaps, and selects the bin with the highest accumulated volume as the Point of Control.nnThis is significantly more accurate than the default single-bar method (which simply uses the average price of the highest-volume bar). When ON, POC reflects the actual high-volume price zone across all bars in the block.nnWhen OFF, the original single-bar method is used as fallback.nnNote: A future update will add native TradingView Footprint POC via request.footprint(), which provides tick-level precision but requires a Premium or Ultimate plan." }));
  let i_pocBinCount = input.int(25, "POC Bin Resolution", ({ minval: 10, maxval: 100, group: G_CORE, tooltip: "Number of equal price bins used to build the Volume Profile within each block.nnHigher values = finer price resolution = more precise POC, but heavier computation.nLower values = coarser resolution = faster, but POC may be less precise.nnRecommended ranges:n• 10–15: Fast, suitable for high-timeframe or low-volatility instruments.n• 20–30: Good balance for most instruments and timeframes (default: 25).n• 50–100: High precision for scalping or tick-level analysis on lower timeframes.nnThis setting has no effect when 'POC: Volume Profile Bins' is OFF." }));
  let i_coreLineWidth = input.int(1, "Line Width", ({ minval: 1, maxval: 4, group: G_CORE }));
  let _coreBuyCol = pinescript.color.rgb(59, 130, 246);
  let _coreSellCol = pinescript.color.rgb(244, 63, 94);
  let _pocCol = pinescript.color.rgb(234, 179, 8);
  let _pocColDim = pinescript.color.new(_pocCol, 25);
  if (state.lnCoreUp === undefined) state.lnCoreUp = null;
  if (state.lnCoreDn === undefined) state.lnCoreDn = null;
  if (state.lnPOCUp === undefined) state.lnPOCUp = null;
  if (state.lnPOCDn === undefined) state.lnPOCDn = null;
  if (state.lblCoreUp === undefined) state.lblCoreUp = null;
  if (state.lblCoreDn === undefined) state.lblCoreDn = null;
  if (state.lblPOCUp === undefined) state.lblPOCUp = null;
  if (state.lblPOCDn === undefined) state.lblPOCDn = null;
  let _T_MAX_BUY = 0;
  let _T_MAX_SELL = 1;
  let _T_MIN_BUY = 2;
  let _T_MIN_SELL = 3;
  let _T_POC = 10;
  if (state._consSrc === undefined) state._consSrc = pinescript.arrayNew();
  if (state._consType === undefined) state._consType = pinescript.arrayNew();
  if (state._consPrice === undefined) state._consPrice = pinescript.arrayNew();
  let _CONS_MAX = 260;
  function f_isConsumed(src, typ, prc) {
    let tol = (syminfo.mintick * 0.5);
    let hit = false;
    let n = pinescript.arraySize(state._consSrc);
    if ((n > 0)) {
      for (let i = 0; i <= (n - 1); i++) {
        if ((((pinescript.arrayGet(state._consSrc, i) === src) && (pinescript.arrayGet(state._consType, i) === typ)) && (pinescript.abs((pinescript.arrayGet(state._consPrice, i) - prc)) <= tol))) {
          hit = true;
        }
      }
    }
    return hit;
  }
  function f_markConsumed(src, typ, prc) {
    pinescript.arrayPush(state._consSrc, src);
    pinescript.arrayPush(state._consType, typ);
    pinescript.arrayPush(state._consPrice, prc);
    while ((pinescript.arraySize(state._consSrc) > _CONS_MAX)) {
      pinescript.arrayShift(state._consSrc);
      pinescript.arrayShift(state._consType);
      pinescript.arrayShift(state._consPrice);
    }
  }
  function f_pruneConsumed(minSrc) {
    while (((pinescript.arraySize(state._consSrc) > 0) && (pinescript.arrayGet(state._consSrc, 0) < minSrc))) {
      pinescript.arrayShift(state._consSrc);
      pinescript.arrayShift(state._consType);
      pinescript.arrayShift(state._consPrice);
    }
  }
  function f_ensureLine(l, col, st) {
    let out = l;
    if (pinescript.na(out)) {
      out = pinescript.lineNew(bar_index, close, bar_index, close, ({ xloc: xloc.bar_index, extend: extend.none, color: col, style: st, width: i_coreLineWidth }));
    } else {
      line.set_width(out, i_coreLineWidth);
      line.set_style(out, st);
      line.set_color(out, col);
    }
    return out;
  }
  function f_hideLine(l, x, y) {
    if (!pinescript.na(l)) {
      line.set_xy1(l, x, y);
      line.set_xy2(l, x, y);
      line.set_color(l, pinescript.color.new(pinescript.color.gray, 100));
    }
  }
  function f_setHLine(l, x1, x2, y, col) {
    if (!pinescript.na(l)) {
      line.set_xy1(l, x1, y);
      line.set_xy2(l, x2, y);
      line.set_color(l, col);
      line.set_width(l, i_coreLineWidth);
    }
  }
  function f_typeName(typ) {
    return ((typ === _T_MAX_BUY) ? "MAX BUY" : ((typ === _T_MAX_SELL) ? "MAX SELL" : ((typ === _T_MIN_BUY) ? "MIN BUY" : ((typ === _T_MIN_SELL) ? "MIN SELL" : "LEVEL"))));
  }
  function f_ensureLabel(lb, col) {
    let out = lb;
    if (pinescript.na(out)) {
      out = pinescript.labelNew(bar_index, close, "", ({ style: label.style_label_left, size: GLOBAL_TEXT_SIZE, textcolor: col, color: pinescript.color.new(pinescript.color.black, 85) }));
    } else {
      label.set_size(out, GLOBAL_TEXT_SIZE);
    }
    return out;
  }
  function f_hideLabel(lb) {
    if (!pinescript.na(lb)) {
      label.set_text(lb, "");
      label.set_xy(lb, bar_index, close);
      label.set_textcolor(lb, pinescript.color.new(pinescript.color.gray, 100));
    }
  }
  function f_setLineLabel(lb, x, y, txt, col) {
    if (!pinescript.na(lb)) {
      label.set_xy(lb, x, y);
      label.set_text(lb, txt);
      label.set_textcolor(lb, col);
      label.set_style(lb, label.style_label_left);
      label.set_size(lb, GLOBAL_TEXT_SIZE);
    }
  }
  function f_pickNearestExt(refP) {
    let upP = null;
    let upDist = null;
    let upSrc = null;
    let upTyp = null;
    let upBox = null;
    let dnP = null;
    let dnDist = null;
    let dnSrc = null;
    let dnTyp = null;
    let dnBox = null;
    for (let gi = 0; gi <= (i_groups - 1); gi++) {
      let bc = pinescript.arrayGet(state.coreBoxes, gi);
      if (bc.valid) {
        if (i_coreShowMax) {
          let p1 = bc.maxBuyHigh;
          let s1 = (bar_index - bc.maxBuyOff);
          if ((!pinescript.na(p1) && !f_isConsumed(s1, _T_MAX_BUY, p1))) {
            if ((p1 > refP)) {
              let d1 = (p1 - refP);
              if ((pinescript.na(upDist) || (d1 < upDist))) {
                upDist = d1;
                upP = p1;
                upSrc = s1;
                upTyp = _T_MAX_BUY;
                upBox = (gi + 1);
              }
            }
            if ((p1 < refP)) {
              let d1d = (refP - p1);
              if ((pinescript.na(dnDist) || (d1d < dnDist))) {
                dnDist = d1d;
                dnP = p1;
                dnSrc = s1;
                dnTyp = _T_MAX_BUY;
                dnBox = (gi + 1);
              }
            }
          }
          let p2 = bc.maxSellLow;
          let s2 = (bar_index - bc.maxSellOff);
          if ((!pinescript.na(p2) && !f_isConsumed(s2, _T_MAX_SELL, p2))) {
            if ((p2 > refP)) {
              let d2 = (p2 - refP);
              if ((pinescript.na(upDist) || (d2 < upDist))) {
                upDist = d2;
                upP = p2;
                upSrc = s2;
                upTyp = _T_MAX_SELL;
                upBox = (gi + 1);
              }
            }
            if ((p2 < refP)) {
              let d2d = (refP - p2);
              if ((pinescript.na(dnDist) || (d2d < dnDist))) {
                dnDist = d2d;
                dnP = p2;
                dnSrc = s2;
                dnTyp = _T_MAX_SELL;
                dnBox = (gi + 1);
              }
            }
          }
        }
        if (i_coreShowMin) {
          let p3 = bc.minBuyHigh;
          let s3 = (bar_index - bc.minBuyOff);
          if ((!pinescript.na(p3) && !f_isConsumed(s3, _T_MIN_BUY, p3))) {
            if ((p3 > refP)) {
              let d3 = (p3 - refP);
              if ((pinescript.na(upDist) || (d3 < upDist))) {
                upDist = d3;
                upP = p3;
                upSrc = s3;
                upTyp = _T_MIN_BUY;
                upBox = (gi + 1);
              }
            }
            if ((p3 < refP)) {
              let d3d = (refP - p3);
              if ((pinescript.na(dnDist) || (d3d < dnDist))) {
                dnDist = d3d;
                dnP = p3;
                dnSrc = s3;
                dnTyp = _T_MIN_BUY;
                dnBox = (gi + 1);
              }
            }
          }
          let p4 = bc.minSellLow;
          let s4 = (bar_index - bc.minSellOff);
          if ((!pinescript.na(p4) && !f_isConsumed(s4, _T_MIN_SELL, p4))) {
            if ((p4 > refP)) {
              let d4 = (p4 - refP);
              if ((pinescript.na(upDist) || (d4 < upDist))) {
                upDist = d4;
                upP = p4;
                upSrc = s4;
                upTyp = _T_MIN_SELL;
                upBox = (gi + 1);
              }
            }
            if ((p4 < refP)) {
              let d4d = (refP - p4);
              if ((pinescript.na(dnDist) || (d4d < dnDist))) {
                dnDist = d4d;
                dnP = p4;
                dnSrc = s4;
                dnTyp = _T_MIN_SELL;
                dnBox = (gi + 1);
              }
            }
          }
        }
      }
    }
    return [upP, upSrc, upTyp, upBox, dnP, dnSrc, dnTyp, dnBox];
  }
  function f_pickNearestPOC(refP) {
    let upP = null;
    let upSrc = null;
    let upDist = null;
    let upBox = null;
    let dnP = null;
    let dnSrc = null;
    let dnDist = null;
    let dnBox = null;
    for (let gi = 0; gi <= (i_groups - 1); gi++) {
      let bc = pinescript.arrayGet(state.coreBoxes, gi);
      if (bc.valid) {
        let p = bc.pocPrice;
        let src = (bar_index - bc.pocOff);
        if ((!pinescript.na(p) && !f_isConsumed(src, _T_POC, p))) {
          if ((p > refP)) {
            let d = (p - refP);
            if ((pinescript.na(upDist) || (d < upDist))) {
              upDist = d;
              upP = p;
              upSrc = src;
              upBox = (gi + 1);
            }
          }
          if ((p < refP)) {
            let d2 = (refP - p);
            if ((pinescript.na(dnDist) || (d2 < dnDist))) {
              dnDist = d2;
              dnP = p;
              dnSrc = src;
              dnBox = (gi + 1);
            }
          }
        }
      }
    }
    return [upP, upSrc, upBox, dnP, dnSrc, dnBox];
  }
  function f_classifyCandlePattern(bodyR, upperR, lowerR, isBull) {
    let pattern = "STANDARD";
    let bias = "NEUTRAL";
    if ((bodyR < 10)) {
      if (((lowerR > 65) && (upperR < 15))) {
        pattern = "DRAGONFLY";
        bias = "BULLISH";
      } else {
        if (((upperR > 65) && (lowerR < 15))) {
          pattern = "GRAVESTONE";
          bias = "BEARISH";
        } else {
          pattern = "DOJI";
          bias = "NEUTRAL";
        }
      }
    } else {
      if (((bodyR < 35) && (pinescript.abs((upperR - lowerR)) < 20))) {
        pattern = "SPINNING_TOP";
        bias = "NEUTRAL";
      } else {
        if ((bodyR > 80)) {
          pattern = "MARUBOZU";
          bias = (isBull ? "BULLISH" : "BEARISH");
        } else {
          if ((bodyR < 40)) {
            if (((lowerR > 55) && (upperR < 20))) {
              pattern = "HAMMER";
              bias = "BULLISH";
            } else {
              if (((upperR > 55) && (lowerR < 20))) {
                pattern = "INV_HAMMER";
                bias = (isBull ? "BULLISH" : "BEARISH");
              } else {
                if ((upperR > 45)) {
                  pattern = "LONG_UPPER";
                  bias = "BEARISH";
                } else {
                  if ((lowerR > 45)) {
                    pattern = "LONG_LOWER";
                    bias = "BULLISH";
                  }
                }
              }
            }
          } else {
            pattern = "STANDARD";
            bias = (isBull ? "BULLISH" : "BEARISH");
          }
        }
      }
    }
    return [pattern, bias];
  }
  function f_calcRangeStatus(barRange, atr) {
    let ratio = ((atr > 0) ? (barRange / atr) : 1);
    let status = ((ratio > 1.5) ? "WIDE" : ((ratio < 0.6) ? "NARROW" : "NORMAL"));
    return [ratio, status];
  }
  function f_calcVolumeStatus(vol, period, offset) {
    let sumVol = 0;
    let count = 0;
    for (let i = offset; i <= ((offset + period) - 1); i++) {
      let v = pinescript.offset(volume, i);
      if (!pinescript.na(v)) {
        sumVol += v;
        count += 1;
      }
    }
    let avgVol = ((count > 0) ? (sumVol / count) : null);
    let ratio = ((!pinescript.na(avgVol) && (avgVol > 0)) ? (vol / avgVol) : 1);
    let status = ((ratio > 2) ? "SPIKE" : ((ratio < 0.5) ? "LOW" : "NORMAL"));
    return [ratio, status];
  }
  function f_calcPressureStatus(buyVol, sellVol) {
    let total = (buyVol + sellVol);
    if ((total === 0)) {
      "BALANCED";
    } else {
      let buyPct = ((buyVol / total) * 100);
      ((buyPct > 55) ? "BUYING" : ((buyPct < 45) ? "SELLING" : "BALANCED"));
    }
  }
  function f_analyzeCurrentBar(offset, atr, buyV, sellV) {
    let h = pinescript.offset(high, offset);
    let l = pinescript.offset(low, offset);
    let o = pinescript.offset(open, offset);
    let c = pinescript.offset(close, offset);
    let v = pinescript.offset(volume, offset);
    let barRange = (h - l);
    let bodySize = pinescript.abs((c - o));
    let upperWick = (h - pinescript.max(o, c));
    let lowerWick = (pinescript.min(o, c) - l);
    let bodyR = ((barRange > 0) ? ((bodySize / barRange) * 100) : 0);
    let upperR = ((barRange > 0) ? ((upperWick / barRange) * 100) : 0);
    let lowerR = ((barRange > 0) ? ((lowerWick / barRange) * 100) : 0);
    let isBull = (c > o);
    let [pattern, patternBias] = f_classifyCandlePattern(bodyR, upperR, lowerR, isBull);
    let [rangeRatio, rangeStatus] = f_calcRangeStatus(barRange, atr);
    let [volRatio, volStatus] = f_calcVolumeStatus(v, 20, offset);
    let delta = (buyV - sellV);
    let pressure = f_calcPressureStatus(buyV, sellV);
    return CurrentBarAnalysis.new(barRange, bodySize, upperWick, lowerWick, bodyR, upperR, lowerR, pattern, patternBias, isBull, rangeRatio, rangeStatus, volRatio, volStatus, buyV, sellV, delta, pressure);
  }
  function f_analyzeComposite(blk1, blk2) {
    let result = CompositeAnalysis.new();
    if (blk1.valid) {
      let cRange = (blk1.newHigh - blk1.newLow);
      let cBody = pinescript.abs((blk1.newClose - blk1.newOpen));
      let cUpper = (blk1.newHigh - pinescript.max(blk1.newOpen, blk1.newClose));
      let cLower = (pinescript.min(blk1.newOpen, blk1.newClose) - blk1.newLow);
      let cBodyR = ((cRange > 0) ? ((cBody / cRange) * 100) : 0);
      let cUpperR = ((cRange > 0) ? ((cUpper / cRange) * 100) : 0);
      let cLowerR = ((cRange > 0) ? ((cLower / cRange) * 100) : 0);
      let isBull = (blk1.newClose > blk1.newOpen);
      [pattern, bias] = f_classifyCandlePattern(cBodyR, cUpperR, cLowerR, isBull);
      result.compRange = cRange;
      result.compBodySize = cBody;
      result.compUpperWick = cUpper;
      result.compLowerWick = cLower;
      result.compBodyRatio = cBodyR;
      result.compositePattern = pattern;
      result.compositeBias = bias;
      if (blk2.valid) {
        let b1High = blk1.newHigh;
        let b1Low = blk1.newLow;
        let b2High = blk2.newHigh;
        let b2Low = blk2.newLow;
        let b1Body = pinescript.abs((blk1.newClose - blk1.newOpen));
        let b2Body = pinescript.abs((blk2.newClose - blk2.newOpen));
        if (((b1High <= b2High) && (b1Low >= b2Low))) {
          result.blockRelation = "INSIDE";
          result.blockRelationBias = "NEUTRAL";
        } else {
          if (((b1High > b2High) && (b1Low < b2Low))) {
            result.blockRelation = "OUTSIDE";
            result.blockRelationBias = (isBull ? "BULLISH" : "BEARISH");
          } else {
            if ((b1Body > (b2Body * 1.3))) {
              result.blockRelation = "ENGULFING";
              result.blockRelationBias = (isBull ? "BULLISH" : "BEARISH");
            } else {
              result.blockRelation = "NORMAL";
              result.blockRelationBias = "NEUTRAL";
            }
          }
        }
      } else {
        result.blockRelation = "NORMAL";
        result.blockRelationBias = "NEUTRAL";
      }
    }
    return result;
  }
  function f_analyzeTrendContext(channels, quality) {
    let result = TrendContext.new();
    let numChannels = pinescript.arraySize(channels);
    if ((numChannels > 0)) {
      let current = pinescript.arrayGet(channels, 0);
      result.currentType = current.channelType;
      result.currentBlocks = ((current.endBlock - current.startBlock) + 1);
      result.currentLabel = ((current.channelType === DIR_UP) ? "UPTREND" : ((current.channelType === DIR_DOWN) ? "DOWNTREND" : "RANGE"));
      if ((numChannels > 1)) {
        let prev = pinescript.arrayGet(channels, 1);
        result.prevType = prev.channelType;
        result.prevLabel = ((prev.channelType === DIR_UP) ? "UPTREND" : ((prev.channelType === DIR_DOWN) ? "DOWNTREND" : "RANGE"));
        if ((result.prevType !== result.currentType)) {
          if ((result.currentType === DIR_UP)) {
            result.transition = "REVERSAL_TO_UP";
          } else {
            if ((result.currentType === DIR_DOWN)) {
              result.transition = "REVERSAL_TO_DOWN";
            } else {
              result.transition = "NEW_TREND";
            }
          }
        } else {
          result.transition = "CONTINUATION";
        }
      } else {
        result.prevType = null;
        result.prevLabel = "";
        result.transition = "NEW_TREND";
      }
      result.trendChanges = 0;
      if ((numChannels > 1)) {
        for (let i = 0; i <= (numChannels - 2); i++) {
          let ch1 = pinescript.arrayGet(channels, i);
          let ch2 = pinescript.arrayGet(channels, (i + 1));
          if ((ch1.channelType !== ch2.channelType)) {
            result.trendChanges += 1;
          }
        }
      }
    } else {
      result.currentType = DIR_RANGE;
      result.currentLabel = "RANGE";
      result.transition = "NEW_TREND";
      result.trendChanges = 0;
    }
    result.qualityScore = quality;
    result.confidenceLevel = ((quality >= 80) ? "HIGH" : ((quality >= 60) ? "MEDIUM" : "LOW"));
    if ((numChannels > 0)) {
      let ch = pinescript.arrayGet(channels, 0);
      result.strengthRating = ((pinescript.abs(ch.angleDeg) > 45) ? "VERY_STRONG" : ((pinescript.abs(ch.angleDeg) > 30) ? "STRONG" : ((pinescript.abs(ch.angleDeg) > 15) ? "MODERATE" : "WEAK")));
    } else {
      result.strengthRating = "WEAK";
    }
    return result;
  }
  function f_checkProximity(price, level, threshold) {
    if (pinescript.na(level)) {
      [false, 0];
    } else {
      let dist = pinescript.abs((price - level));
      let pct = ((price !== 0) ? ((dist / price) * 100) : 0);
      let isNear = (pct <= threshold);
      [isNear, pct];
    }
  }
  function f_connect(key) {
    return ((key === "CURRENT_CANDLE") ? f_L("The current candle presents", "Mevcut mum", "वर्तमान कैंडल", "الشمعة الحالية تُظهر") : ((key === "WITH_RANGE") ? f_L("with", "ile", "के साथ", "مع") : ((key === "SHOWING") ? f_L("showing", "gösteriyor", "दिखा रहा है", "تُظهر") : ((key === "BROADER_CONTEXT") ? f_L("In the broader timeframe, the market is in", "Daha geniş zaman diliminde piyasa", "व्यापक समय सीमा में बाजार", "في الإطار الزمني الأوسع، السوق في") : ((key === "WITH_STRENGTH") ? f_L("with", "ile", "के साथ", "بقوة") : ((key === "AND_QUALITY") ? f_L("and quality", "ve kalite", "और गुणवत्ता", "وجودة") : ((key === "STRUCTURE_SHOWS") ? f_L("The price structure shows", "Fiyat yapısı gösteriyor", "मूल्य संरचना दिखाती है", "هيكل السعر يُظهر") : ((key === "CURRENT_BLOCK") ? f_L("The current block", "Mevcut blok", "वर्तमान ब्लॉक", "الكتلة الحالية") : ((key === "PREVIOUS_BLOCK") ? f_L("the previous block", "önceki bloğu", "पिछले ब्लॉक को", "الكتلة السابقة") : ((key === "WHICH_INDICATES") ? f_L("which indicates", "bu da gösterir", "जो संकेत देता है", "مما يُشير إلى") : ((key === "HOWEVER") ? f_L("However", "Ancak", "हालांकि", "ومع ذلك") : ((key === "IMPORTANT_CONTRADICTION") ? f_L("an important contradiction exists", "önemli bir çelişki var", "एक महत्वपूर्ण विरोधाभास है", "يوجد تناقض مهم") : ((key === "WHILE_PRICE") ? f_L("while price moves", "fiyat hareket ederken", "जबकि मूल्य चलता है", "بينما يتحرك السعر") : ((key === "VOLUME_SHOWS") ? f_L("volume shows", "hacim gösteriyor", "वॉल्यूम दिखाता है", "الحجم يُظهر") : ((key === "DOMINANCE_WITH") ? f_L("dominance with", "hakimiyet ile", "के साथ प्रभुत्व", "هيمنة بنسبة") : ((key === "THIS_DIVERGENCE") ? f_L("This divergence between price direction and volume flow indicates", "Fiyat yönü ile hacim akışı arasındaki bu uyumsuzluk gösterir", "मूल्य दिशा और वॉल्यूम प्रवाह के बीच यह विचलन संकेत देता है", "هذا التباين بين اتجاه السعر وتدفق الحجم يُشير إلى") : ((key === "CONFIRMS_TREND") ? f_L("Volume also confirms this trend", "Hacim de bu trendi doğruluyor", "वॉल्यूम भी इस रुझान की पुष्टि करता है", "الحجم يؤكد هذا الاتجاه أيضاً") : ((key === "VOLUME_MOMENTUM") ? f_L("Volume momentum is", "Hacim momentumu", "वॉल्यूम गति", "زخم الحجم") : ((key === "INDICATING") ? f_L("indicating", "gösteriyor", "संकेत दे रहा है", "مما يُشير إلى") : ((key === "CANDLE_BODIES") ? f_L("Candle bodies are", "Mum gövdeleri", "कैंडल बॉडी", "أجسام الشموع") : ((key === "UPPER_WICKS") ? f_L("Upper wicks have", "Üst fitiller", "ऊपरी बत्तियां", "الفتائل العلوية") : ((key === "BY_PERCENT") ? f_L("by", "ile", "द्वारा", "بنسبة") : ((key === "INDICATING_PRESSURE") ? f_L("indicating", "göstererek", "संकेत करते हुए", "مما يدل على") : ((key === "SELL_PRESSURE_ABOVE") ? f_L("selling pressure at higher levels", "üst seviyelerde satış baskısı", "उच्च स्तर पर बिक्री दबाव", "ضغط بيعي عند المستويات العليا") : ((key === "LOWER_WICKS") ? f_L("Lower wicks have", "Alt fitiller", "निचली बत्तियां", "الفتائل السفلية") : ((key === "BUY_SUPPORT") ? f_L("buying support strengthening", "alım desteği güçleniyor", "खरीद समर्थन मजबूत हो रहा", "تعزّز دعم الشراء") : ((key === "PRICE_POSITION") ? f_L("Price is positioned in", "Fiyat konumlanmış", "मूल्य स्थित है", "السعر يتموضع في") : ((key === "OF_CHANNEL") ? f_L("of the channel", "kanalın", "चैनल का", "من القناة") : ((key === "KEY_NOTE") ? f_L("Important note", "Önemli not", "महत्वपूर्ण नोट", "ملاحظة مهمة") : ((key === "NEAR_RESISTANCE") ? f_L("Price has approached the upper channel at", "Fiyat üst kanal sınırına yaklaştı", "मूल्य ऊपरी चैनल सीमा के करीब पहुंच गया है", "السعر اقترب من حد القناة العليا عند") : ((key === "NEAR_SUPPORT") ? f_L("Price has approached the lower channel at", "Fiyat alt kanal sınırına yaklaştı", "मूल्य निचली चैनल सीमा के करीब पहुंच गया है", "السعر اقترب من حد القناة السفلى عند") : ((key === "DISTANCE") ? f_L("distance", "mesafe", "दूरी", "المسافة") : ((key === "POC_LEVEL") ? f_L("Price is near POC level at", "Fiyat POC seviyesine yakın", "मूल्य POC स्तर के पास है", "السعر قريب من مستوى POC عند") : ((key === "HIGH_VOLUME_AREA") ? f_L("which typically has high trading volume", "ki genellikle yüksek işlem hacmi vardır", "जिसमें आमतौर पर उच्च ट्रेडिंग वॉल्यूम होता है", "والتي عادةً تشهد حجم تداول مرتفع") : ((key === "DISTANCE_TO_LEVELS") ? f_L("Distance to upper channel", "Üst kanala mesafe", "ऊपरी चैनल की दूरी", "المسافة إلى القناة العليا") : ((key === "TO_SUPPORT") ? f_L("to lower channel", "alt kanala", "निचले चैनल तक", "إلى القناة السفلى") : ((key === "OVERALL") ? f_L("Overall", "Genel olarak", "कुल मिलाकर", "بشكل عام") : ((key === "DESPITE") ? f_L("despite", "rağmen", "के बावजूद", "على الرغم من") : ((key === "CONTRADICTIONS") ? f_L("technical contradictions", "teknik çelişkiler", "तकनीकी विरोधाभास", "تناقضات فنية") : ((key === "PATTERN_MAINTAINS") ? f_L("the overall pattern maintains", "genel yapı koruyor", "समग्र पैटर्न बनाए रखता है", "النمط العام يحافظ على") : ((key === "UPTREND_CHAR") ? f_L("uptrend characteristics", "yükseliş özelliklerini", "तेजी की विशेषताएं", "خصائص الاتجاه الصاعد") : ((key === "DOWNTREND_CHAR") ? f_L("downtrend characteristics", "düşüş özelliklerini", "मंदी की विशेषताएं", "خصائص الاتجاه الهابط") : ((key === "CONSOLIDATION") ? f_L("a consolidation phase", "konsolidasyon fazında", "एक समेकन चरण में", "مرحلة تجميع") : ((key === "THESE_CONTRADICTIONS") ? f_L("but these contradictions suggest potential change in market behavior", "ancak bu çelişkiler piyasa davranışında potansiyel değişim gösteriyor", "लेकिन ये विरोधाभास बाजार व्यवहार में संभावित परिवर्तन का सुझाव देते हैं", "لكن هذه التناقضات تُشير إلى تغيّر محتمل في سلوك السوق") : ((key === "ALL_ALIGNED") ? f_L("all technical and volume indicators are aligned confirming", "tüm teknik ve hacim göstergeleri uyumlu ve doğruluyor", "सभी तकनीकी और वॉल्यूम संकेतक संरेखित हैं और पुष्टि करते हैं", "جميع المؤشرات الفنية والحجمية متوافقة وتؤكد") : ((key === "NO_CLEAR_DIR") ? f_L("and has not yet selected a clear direction", "ve henüz net bir yön seçmedi", "और अभी तक स्पष्ट दिशा नहीं चुनी है", "ولم يختر اتجاهاً واضحاً بعد") : ""))))))))))))))))))))))))))))))))))))))))))))));
  }
  function f_patternDesc(pattern) {
    return ((pattern === "DOJI") ? f_L("a doji indicating market indecision and uncertainty", "belirsizlik ve kararsızlığı gösteren bir doji", "एक डोजी जो बाजार में अनिश्चितता दर्शाता है", "دوجي يُشير إلى تردد السوق وعدم اليقين") : ((pattern === "HAMMER") ? f_L("a hammer suggesting rejection at lower levels and potential bullish reversal", "alt seviyelerde reddedilme ve potansiyel yükseliş dönüşünü gösteren bir çekiç", "एक हैमर जो निचले स्तर पर अस्वीकृति और संभावित तेजी उलटफेर का सुझाव देता है", "مطرقة تُشير إلى رفض عند المستويات الدنيا واحتمال انعكاس صعودي") : ((pattern === "INV_HAMMER") ? f_L("an inverted hammer", "ters çekiç", "एक उल्टा हैमर", "مطرقة مقلوبة") : ((pattern === "DRAGONFLY") ? f_L("a dragonfly doji showing strong rejection at lows and buying pressure", "güçlü alış baskısı ve dipte reddedilme gösteren yusufçuk doji", "एक ड्रैगनफ्लाई डोजी जो निम्न स्तर पर मजबूत अस्वीकृति दिखाता है", "دوجي اليعسوب يُظهر رفضاً قوياً عند القيعان وضغطاً شرائياً") : ((pattern === "GRAVESTONE") ? f_L("a gravestone doji showing strong rejection at highs and selling pressure", "güçlü satış baskısı ve tepede reddedilme gösteren mezar taşı doji", "एक ग्रेवस्टोन डोजी जो उच्च स्तर पर मजबूत अस्वीकृति दिखाता है", "دوجي شاهد القبر يُظهر رفضاً قوياً عند القمم وضغطاً بيعياً") : ((pattern === "MARUBOZU") ? f_L("a marubozu with large body and small wicks indicating one-sided market power", "tek taraflı piyasa gücünü gösteren büyük gövdeli ve küçük fitilli marubozu", "एक मारूबोज़ू जो एकतरफा बाजार शक्ति दर्शाता है", "ماروبوزو بجسم كبير وفتائل صغيرة يدل على قوة سوقية أحادية الاتجاه") : ((pattern === "LONG_UPPER") ? f_L("a candle with long upper wick indicating selling pressure and rejection at higher levels", "satış baskısı ve üst seviyelerde reddedilmeyi gösteren uzun üst fitilli mum", "एक कैंडल जो बिक्री दबाव दिखाती है", "شمعة بفتيل علوي طويل تدل على ضغط بيعي ورفض عند المستويات العليا") : ((pattern === "LONG_LOWER") ? f_L("a candle with long lower wick indicating buying pressure and rejection at lower levels", "alım baskısı ve alt seviyelerde reddedilmeyi gösteren uzun alt fitilli mum", "एक कैंडल जो खरीद दबाव दिखाती है", "شمعة بفتيل سفلي طويل تدل على ضغط شرائي ورفض عند المستويات الدنيا") : ((pattern === "SPINNING_TOP") ? f_L("a spinning top with small body and long wicks indicating imbalance between buyers and sellers", "alıcı ve satıcılar arasındaki dengesizliği gösteren küçük gövdeli topaç", "एक स्पिनिंग टॉप जो खरीदारों और विक्रेताओं के बीच असंतुलन दिखाता है", "قمة دوّارة بجسم صغير وفتائل طويلة تدل على اختلال التوازن بين المشترين والبائعين") : f_L("a standard candle", "standart bir mum", "एक मानक कैंडल", "شمعة قياسية"))))))))));
  }
  function f_blockRelDesc(relation, bias) {
    return ((relation === "ENGULFING") ? f_L("completely encompasses the previous block, indicating increased power in current direction", "önceki bloğu tamamen kapsar ve mevcut yöndeki gücün arttığını gösterir", "पिछले ब्लॉक को पूरी तरह घेरता है, वर्तमान दिशा में बढ़ी शक्ति का संकेत देता है", "تبتلع الكتلة السابقة بالكامل، مما يدل على تزايد القوة في الاتجاه الحالي") : ((relation === "INSIDE") ? f_L("is completely within the previous block range, indicating reduced volatility and potential accumulation", "tamamen önceki blok aralığında ve azalan oynaklık gösterir", "पिछले ब्लॉक के दायरे में है, कम अस्थिरता का संकेत देता है", "تقع بالكامل ضمن نطاق الكتلة السابقة، مما يدل على انخفاض التذبذب واحتمال التجميع") : ((relation === "OUTSIDE") ? f_L("exceeds the previous block range, indicating increased volatility and market strength", "önceki blok aralığını aşar ve artan oynaklık gösterir", "पिछले ब्लॉक की सीमा से अधिक है, बढ़ी अस्थिरता का संकेत देता है", "تتجاوز نطاق الكتلة السابقة، مما يدل على تزايد التذبذب وقوة السوق") : "")));
  }
  function f_wrapNarrative(txt, maxWords, maxChars) {
    let lines = pinescript.arrayNew();
    let words = pinescript.strSplit(txt, " ");
    let n = pinescript.arraySize(words);
    if ((n > 0)) {
      let line = "";
      let wcnt = 0;
      for (let i = 0; i <= (n - 1); i++) {
        let w = pinescript.arrayGet(words, i);
        if ((pinescript.strLength(w) === 0)) {
          continue;
        }
        let cand = ((wcnt === 0) ? w : ((line + " ") + w));
        let overflow = ((wcnt >= maxWords) || (pinescript.strLength(cand) > maxChars));
        if ((overflow && (wcnt > 0))) {
          pinescript.arrayPush(lines, line);
          line = w;
          wcnt = 1;
        } else {
          line = cand;
          wcnt += 1;
        }
      }
      if ((wcnt > 0)) {
        pinescript.arrayPush(lines, line);
      }
    }
    return lines;
  }
  function f_buildProfessionalNarrativeParts(cBar, comp, ctx, ch, trendBuy, trendSell, trendDelta, trendDeltaPct, bodyStatus, upperPinChg, lowerPinChg, volMom, channelPos, posStatus, resistPrice, supportPrice, lvls, contradictions, hasDivergence) {
    let narrative = "";
    let currentPrice = pinescript.offset(close, baseOff);
    narrative += (((f_connect("CURRENT_CANDLE") + " ") + f_patternDesc(cBar.pattern)) + " ");
    narrative += (((f_connect("WITH_RANGE") + " ") + f_rangeStatusStr(cBar.rangeStatus)) + ". ");
    if ((cBar.pressureStatus === "BUYING")) {
      narrative += ((((((f_connect("SHOWING") + " ") + f_pressureStr("BUYING")) + " (") + ((cBar.delta > 0) ? "+" : "")) + pinescript.strToString(cBar.delta, format.volume)) + "). ");
    } else {
      if ((cBar.pressureStatus === "SELLING")) {
        narrative += (((((f_connect("SHOWING") + " ") + f_pressureStr("SELLING")) + " (") + pinescript.strToString(cBar.delta, format.volume)) + "). ");
      } else {
        narrative += (((f_connect("SHOWING") + " ") + f_pressureStr("BALANCED")) + ". ");
      }
    }
    narrative += (((f_connect("BROADER_CONTEXT") + " ") + f_trendTypeStr(ctx.currentType)) + " ");
    narrative += (((f_connect("WITH_STRENGTH") + " ") + f_strengthStr(ch.angleDeg)) + " ");
    narrative += (((((f_connect("AND_QUALITY") + " ") + f_confidenceStr(ctx.qualityScore)) + " (") + pinescript.strToString(ctx.qualityScore, "#")) + "/100). ");
    narrative += (f_connect("STRUCTURE_SHOWS") + " ");
    if ((ctx.currentType === DIR_UP)) {
      narrative += (f_phrase("HH_HL") + ". ");
    } else {
      if ((ctx.currentType === DIR_DOWN)) {
        narrative += (f_phrase("LH_LL") + ". ");
      } else {
        narrative += (f_L("mixed pattern with no clear direction", "net yön olmayan karışık yapı", "कोई स्पष्ट दिशा नहीं के साथ मिश्रित पैटर्न", "نمط مختلط بدون اتجاه واضح") + ". ");
      }
    }
    if (((comp.blockRelation !== "NORMAL") && (comp.blockRelation !== ""))) {
      narrative += (((f_connect("CURRENT_BLOCK") + " ") + f_blockRelDesc(comp.blockRelation, comp.blockRelationBias)) + ". ");
    }
    let part1 = narrative;
    narrative = "";
    if (hasDivergence) {
      narrative += (((f_connect("HOWEVER") + ", ") + f_connect("IMPORTANT_CONTRADICTION")) + ": ");
      narrative += (f_connect("WHILE_PRICE") + " ");
      if ((ctx.currentType === DIR_UP)) {
        narrative += (f_L("upward", "yukarı", "ऊपर", "صعوداً") + ", ");
      } else {
        if ((ctx.currentType === DIR_DOWN)) {
          narrative += (f_L("downward", "aşağı", "नीचे", "هبوطاً") + ", ");
        }
      }
      narrative += (f_connect("VOLUME_SHOWS") + " ");
      if ((trendDelta < 0)) {
        narrative += (((((f_L("selling", "satış", "बिक्री", "بيع") + " ") + f_connect("DOMINANCE_WITH")) + " ") + pinescript.strToString(pinescript.abs(trendDeltaPct), "#.##")) + "%. ");
        narrative += (((f_connect("THIS_DIVERGENCE") + " ") + f_L("sellers are active despite price rise", "satıcılar fiyat artışına rağmen aktif", "विक्रेता मूल्य वृद्धि के बावजूद सक्रिय हैं", "البائعون نشطون رغم ارتفاع السعر")) + ". ");
      } else {
        narrative += (((((f_L("buying", "alım", "खरीद", "شراء") + " ") + f_connect("DOMINANCE_WITH")) + " ") + pinescript.strToString(trendDeltaPct, "#.##")) + "%. ");
        narrative += (((f_connect("THIS_DIVERGENCE") + " ") + f_L("buyers are accumulating despite price decline", "alıcılar fiyat düşüşüne rağmen toplanıyor", "खरीदार मूल्य गिरावट के बावजूद संचय कर रहे हैं", "المشترون يُجمّعون رغم انخفاض السعر")) + ". ");
      }
    } else {
      narrative += (f_connect("CONFIRMS_TREND") + ", ");
      if ((trendDelta > 0)) {
        narrative += (((((f_L("buyers", "alıcılar", "खरीदार", "المشترون") + " ") + f_connect("DOMINANCE_WITH")) + " ") + pinescript.strToString(trendDeltaPct, "#.##")) + "%. ");
      } else {
        if ((trendDelta < 0)) {
          narrative += (((((f_L("sellers", "satıcılar", "विक्रेता", "البائعون") + " ") + f_connect("DOMINANCE_WITH")) + " ") + pinescript.strToString(pinescript.abs(trendDeltaPct), "#.##")) + "%. ");
        } else {
          narrative += (f_L("balanced with no dominant side", "dengeli hakimiyet yok", "कोई प्रभावी पक्ष नहीं", "متوازن بدون طرف مهيمن") + ". ");
        }
      }
    }
    narrative += (((((f_connect("VOLUME_MOMENTUM") + " ") + f_volMomentumStr(volMom)) + ", ") + f_connect("INDICATING")) + " ");
    if ((pinescript.strPos(volMom, "INCREASING") >= 0)) {
      narrative += (f_L("increased market participation", "artan piyasa katılımı", "बढ़ती बाजार भागीदारी", "تزايد المشاركة في السوق") + ". ");
    } else {
      narrative += (f_L("decreased market participation", "azalan piyasa katılımı", "घटती बाजार भागीदारी", "تراجع المشاركة في السوق") + ". ");
    }
    let part2 = narrative;
    narrative = "";
    narrative += ((f_connect("CANDLE_BODIES") + " ") + f_bodyStatusStr(bodyStatus));
    if ((bodyStatus === "EXPANDING")) {
      narrative += ((((", " + f_connect("INDICATING")) + " ") + f_L("increasing power and momentum", "artan güç ve momentum", "बढ़ती शक्ति और गति", "تزايد القوة والزخم")) + ". ");
    } else {
      if ((bodyStatus === "CONTRACTING")) {
        narrative += ((", " + f_L("which may indicate weakening trend strength", "bu trend gücünün zayıflamasını gösterebilir", "जो रुझान की कमजोरी का संकेत हो सकता है", "مما قد يُشير إلى ضعف قوة الاتجاه")) + ". ");
      } else {
        narrative += ". ";
      }
    }
    if (((pinescript.abs(upperPinChg) > 15) || (pinescript.abs(lowerPinChg) > 15))) {
      if ((upperPinChg > 15)) {
        narrative += (((((((((((f_connect("UPPER_WICKS") + " ") + f_L("increased", "arttı", "बढ़ा है", "ازدادت")) + " ") + f_connect("BY_PERCENT")) + " ") + pinescript.strToString(upperPinChg, "#.##")) + "%, ") + f_connect("INDICATING_PRESSURE")) + " ") + f_connect("SELL_PRESSURE_ABOVE")) + ". ");
      }
      if ((lowerPinChg > 15)) {
        narrative += (((((((((((f_connect("LOWER_WICKS") + " ") + f_L("increased", "arttı", "बढ़ा है", "ازدادت")) + " ") + f_connect("BY_PERCENT")) + " ") + pinescript.strToString(lowerPinChg, "#.##")) + "%, ") + f_connect("INDICATING_PRESSURE")) + " ") + f_connect("BUY_SUPPORT")) + ". ");
      }
      if ((lowerPinChg < -15)) {
        narrative += (((((((((f_connect("LOWER_WICKS") + " ") + f_L("decreased", "azaldı", "घटा है", "انخفضت")) + " ") + f_connect("BY_PERCENT")) + " ") + pinescript.strToString(pinescript.abs(lowerPinChg), "#.##")) + "%, ") + f_L("which may indicate weakening support", "bu desteğin zayıflamasını gösterebilir", "जो समर्थन कमजोर होने का संकेत हो सकता है", "مما قد يُشير إلى ضعف الدعم")) + ". ");
      }
    }
    if (!pinescript.na(channelPos)) {
      narrative += (((((((f_connect("PRICE_POSITION") + " ") + f_positionZoneStr(channelPos)) + " (") + pinescript.strToString(channelPos, "#.##")) + "% ") + f_connect("OF_CHANNEL")) + ")");
      if ((posStatus === "OVERBOUGHT")) {
        narrative += ((" " + f_L("in overbought zone", "aşırı alım bölgesinde", "अधिक खरीद क्षेत्र में", "في منطقة التشبّع الشرائي")) + ". ");
      } else {
        if ((posStatus === "OVERSOLD")) {
          narrative += ((" " + f_L("in oversold zone", "aşırı satım bölgesinde", "अधिक बिक्री क्षेत्र में", "في منطقة التشبّع البيعي")) + ". ");
        } else {
          narrative += ". ";
        }
      }
    }
    let part3 = narrative;
    narrative = "";
    let pocUpLevel = (lvls.hasPOCUp ? lvls.pocUp : null);
    let pocDnLevel = (lvls.hasPOCDn ? lvls.pocDn : null);
    let coreUpLevel = (lvls.hasCoreUp ? lvls.coreUp : null);
    let coreDnLevel = (lvls.hasCoreDn ? lvls.coreDn : null);
    let [nearResist, resistPct] = f_checkProximity(currentPrice, resistPrice, 2);
    let [nearSupport, supportPct] = f_checkProximity(currentPrice, supportPrice, 2);
    let [nearPOCUp, pocUpPct] = f_checkProximity(currentPrice, pocUpLevel, 1.5);
    let [nearPOCDn, pocDnPct] = f_checkProximity(currentPrice, pocDnLevel, 1.5);
    let [nearCoreUp, coreUpPct] = f_checkProximity(currentPrice, coreUpLevel, 1);
    let [nearCoreDn, coreDnPct] = f_checkProximity(currentPrice, coreDnLevel, 1);
    let hasKeyEvent = (((((nearResist || nearSupport) || nearPOCUp) || nearPOCDn) || nearCoreUp) || nearCoreDn);
    if (hasKeyEvent) {
      narrative += (f_connect("KEY_NOTE") + ": ");
      if (nearResist) {
        narrative += (((((((f_connect("NEAR_RESISTANCE") + " ") + pinescript.strToString(resistPrice, format.mintick)) + " (") + f_connect("DISTANCE")) + " ") + pinescript.strToString(resistPct, "#.##")) + "%). ");
      }
      if (nearSupport) {
        narrative += (((((((f_connect("NEAR_SUPPORT") + " ") + pinescript.strToString(supportPrice, format.mintick)) + " (") + f_connect("DISTANCE")) + " ") + pinescript.strToString(supportPct, "#.##")) + "%). ");
      }
      if (nearPOCUp) {
        narrative += (((((((((f_connect("POC_LEVEL") + " ") + pinescript.strToString(pocUpLevel, format.mintick)) + " (") + f_connect("DISTANCE")) + " ") + pinescript.strToString(pocUpPct, "#.##")) + "%), ") + f_connect("HIGH_VOLUME_AREA")) + ". ");
      }
      if (nearPOCDn) {
        narrative += (((((((((f_connect("POC_LEVEL") + " ") + pinescript.strToString(pocDnLevel, format.mintick)) + " (") + f_connect("DISTANCE")) + " ") + pinescript.strToString(pocDnPct, "#.##")) + "%), ") + f_connect("HIGH_VOLUME_AREA")) + ". ");
      }
      if (nearCoreUp) {
        narrative += ((((((((((f_L("Price is near ", "Fiyat şu seviyeye yakın: ", "मूल्य इसके पास है: ", "السعر قريب من ") + f_typeName(lvls.coreUpType)) + " | Box ") + pinescript.strToString(lvls.coreUpBox)) + " @ ") + pinescript.strToString(coreUpLevel, format.mintick)) + " (") + f_connect("DISTANCE")) + " ") + pinescript.strToString(coreUpPct, "#.##")) + "%). ");
      }
      if (nearCoreDn) {
        narrative += ((((((((((f_L("Price is near ", "Fiyat şu seviyeye yakın: ", "मूल्य इसके पास है: ", "السعر قريب من ") + f_typeName(lvls.coreDnType)) + " | Box ") + pinescript.strToString(lvls.coreDnBox)) + " @ ") + pinescript.strToString(coreDnLevel, format.mintick)) + " (") + f_connect("DISTANCE")) + " ") + pinescript.strToString(coreDnPct, "#.##")) + "%). ");
      }
    } else {
      if ((!pinescript.na(resistPrice) && !pinescript.na(supportPrice))) {
        let resistDist = (resistPrice - currentPrice);
        let supportDist = (currentPrice - supportPrice);
        narrative += (((((((f_connect("DISTANCE_TO_LEVELS") + " ") + pinescript.strToString(resistDist, "#.##")) + ", ") + f_connect("TO_SUPPORT")) + " ") + pinescript.strToString(supportDist, "#.##")) + ". ");
      }
      if ((!pinescript.na(pocUpLevel) || !pinescript.na(pocDnLevel))) {
        let dUp = (!pinescript.na(pocUpLevel) ? pinescript.abs((currentPrice - pocUpLevel)) : null);
        let dDn = (!pinescript.na(pocDnLevel) ? pinescript.abs((currentPrice - pocDnLevel)) : null);
        let nearestPOC = (pinescript.na(dUp) ? pocDnLevel : (pinescript.na(dDn) ? pocUpLevel : ((dUp <= dDn) ? pocUpLevel : pocDnLevel)));
        let [, pocPct] = f_checkProximity(currentPrice, nearestPOC, 100);
        narrative += ((((f_L(" Nearest POC: ", " En yakın POC: ", " निकटतम POC: ", " أقرب POC: ") + pinescript.strToString(nearestPOC, format.mintick)) + " (") + pinescript.strToString(pocPct, "#.##")) + "%). ");
      }
      if ((!pinescript.na(coreUpLevel) || !pinescript.na(coreDnLevel))) {
        let cdUp = (!pinescript.na(coreUpLevel) ? pinescript.abs((currentPrice - coreUpLevel)) : null);
        let cdDn = (!pinescript.na(coreDnLevel) ? pinescript.abs((currentPrice - coreDnLevel)) : null);
        let nearestCore = (pinescript.na(cdUp) ? coreDnLevel : (pinescript.na(cdDn) ? coreUpLevel : ((cdUp <= cdDn) ? coreUpLevel : coreDnLevel)));
        let [, corePct] = f_checkProximity(currentPrice, nearestCore, 100);
        narrative += ((((f_L(" Nearest core level: ", " En yakın çekirdek seviye: ", " निकटतम कोर स्तर: ", " أقرب مستوى جوهري: ") + pinescript.strToString(nearestCore, format.mintick)) + " (") + pinescript.strToString(corePct, "#.##")) + "%). ");
      }
    }
    let part4 = narrative;
    narrative = "";
    narrative += (f_connect("OVERALL") + ", ");
    if (((contradictions > 0) || hasDivergence)) {
      narrative += (((((((f_connect("DESPITE") + " ") + pinescript.strToString(contradictions)) + " ") + f_connect("CONTRADICTIONS")) + ", ") + f_connect("PATTERN_MAINTAINS")) + " ");
      if ((ctx.currentType === DIR_UP)) {
        narrative += f_connect("UPTREND_CHAR");
      } else {
        if ((ctx.currentType === DIR_DOWN)) {
          narrative += f_connect("DOWNTREND_CHAR");
        } else {
          narrative += f_connect("CONSOLIDATION");
        }
      }
      narrative += ((", " + f_connect("THESE_CONTRADICTIONS")) + ".");
    } else {
      narrative += (f_connect("ALL_ALIGNED") + " ");
      if ((ctx.currentType === DIR_UP)) {
        narrative += (f_connect("UPTREND_CHAR") + ".");
      } else {
        if ((ctx.currentType === DIR_DOWN)) {
          narrative += (f_connect("DOWNTREND_CHAR") + ".");
        } else {
          narrative += (((f_connect("CONSOLIDATION") + " ") + f_connect("NO_CLEAR_DIR")) + ".");
        }
      }
    }
    let part5 = narrative;
    let parts = pinescript.arrayNew();
    pinescript.arrayPush(parts, part1);
    pinescript.arrayPush(parts, part2);
    pinescript.arrayPush(parts, part3);
    pinescript.arrayPush(parts, part4);
    pinescript.arrayPush(parts, part5);
    return parts;
  }
  function f_resolveLTF(useCustom, customTF) {
    return (useCustom ? customTF : (timeframe.isseconds ? "1S" : (timeframe.isintraday ? "1" : (timeframe.isdaily ? "5" : "60"))));
  }
  function f_ltfVol(ltf) {
    let [u, d, dl] = tvta.requestUpAndDownVolume(ltf);
    return [pinescript.abs(u), pinescript.abs(d), dl];
  }
  function f_geoVol() {
    let r = (high - low);
    let b = null;
    let s = null;
    if (pinescript.na(volume)) {
      b = null;
      s = null;
    } else {
      if ((r === 0)) {
        b = (volume * 0.5);
        s = (volume * 0.5);
      } else {
        b = (volume * ((close - low) / r));
        s = (volume * ((high - close) / r));
      }
    }
    return [b, s, (b - s)];
  }
  if (state.vBuy === undefined) state.vBuy = null;
  if (state.vSell === undefined) state.vSell = null;
  if (state.vDel === undefined) state.vDel = null;
  let ltf = f_resolveLTF(i_useCustomLTF, i_customLTF);
  if ((i_calcMethod === "Intrabar (Precise)")) {
    let [b1, s1, d1] = f_ltfVol(ltf);
    state.vBuy = b1;
    state.vSell = s1;
    state.vDel = d1;
  } else {
    let [b2, s2, d2] = f_geoVol();
    state.vBuy = b2;
    state.vSell = s2;
    state.vDel = d2;
  }
  function f_binProfilePOC(startOff, endOff, numBins) {
    let blockHigh = null;
    let blockLow = null;
    for (let k = startOff; k <= endOff; k++) {
      let h = pinescript.offset(high, k);
      let l = pinescript.offset(low, k);
      if ((pinescript.na(blockHigh) || (h > blockHigh))) {
        blockHigh = h;
      }
      if ((pinescript.na(blockLow) || (l < blockLow))) {
        blockLow = l;
      }
    }
    let resultPrice = null;
    let resultOff = null;
    let resultVol = 0;
    if (((!pinescript.na(blockHigh) && !pinescript.na(blockLow)) && (blockHigh > blockLow))) {
      let binSize = ((blockHigh - blockLow) / numBins);
      let binVol = pinescript.arrayNew(numBins, 0);
      for (let k = startOff; k <= endOff; k++) {
        let barH = pinescript.offset(high, k);
        let barL = pinescript.offset(low, k);
        let barTotalVol = (pinescript.nz(pinescript.offset(state.vBuy, k), 0) + pinescript.nz(pinescript.offset(state.vSell, k), 0));
        if (((barTotalVol > 0) && (barH > barL))) {
          let firstBin = pinescript.max(0, int(math.floor(((barL - blockLow) / binSize))));
          let lastBin = pinescript.min((numBins - 1), int(math.floor((((barH - blockLow) - (syminfo.mintick * 0.01)) / binSize))));
          lastBin = pinescript.max(firstBin, lastBin);
          let barRange = (barH - barL);
          for (let b = firstBin; b <= lastBin; b++) {
            let bLow = (blockLow + (b * binSize));
            let bHigh = (bLow + binSize);
            let overlap = (pinescript.min(barH, bHigh) - pinescript.max(barL, bLow));
            let proportion = ((barRange > 0) ? pinescript.max(0, (overlap / barRange)) : 0);
            pinescript.arraySet(binVol, b, (pinescript.arrayGet(binVol, b) + (barTotalVol * proportion)));
          }
        }
      }
      let maxVol = 0;
      let maxBin = 0;
      for (let b = 0; b <= (numBins - 1); b++) {
        let bv = pinescript.arrayGet(binVol, b);
        if ((bv > maxVol)) {
          maxVol = bv;
          maxBin = b;
        }
      }
      resultPrice = (blockLow + ((maxBin + 0.5) * binSize));
      resultVol = maxVol;
      let minDist = null;
      for (let k = startOff; k <= endOff; k++) {
        let dist = pinescript.abs((pinescript.offset(hlc3, k) - resultPrice));
        if ((pinescript.na(minDist) || (dist < minDist))) {
          minDist = dist;
          resultOff = k;
        }
      }
    }
    return [resultPrice, resultOff, resultVol];
  }
  let globalAvgRange = ta.atr(20);
  let globalYZVol = f_yangZhangVolatility(20);
  let histBarsDash = pinescript.max(0, ((bar_index - baseOff) + 1));
  histBarsDash = pinescript.min(histBarsDash, 5000);
  let scannableBars = 0;
  if ((i_calcMethod === "Intrabar (Precise)")) {
    let probe = pinescript.min(histBarsDash, effWindow);
    for (let off = baseOff; off <= ((baseOff + probe) - 1); off++) {
      let ok = ((!pinescript.na(pinescript.offset(state.vBuy, off)) && !pinescript.na(pinescript.offset(state.vSell, off))) && !pinescript.na(pinescript.offset(state.vDel, off)));
      if (ok) {
        scannableBars += 1;
      } else {
        break;
      }
    }
  } else {
    scannableBars = pinescript.min(histBarsDash, effWindow);
  }
  if (state.lastAnalyticsBar === undefined) state.lastAnalyticsBar = -1;
  if (barstate.islast) {
    let maxOff = ((baseOff + effWindow) - 1);
    let enoughHistory = (bar_index >= maxOff);
    let isNewBarForAnalytics = (bar_index !== state.lastAnalyticsBar);
    let shouldRebuildAnalytics = ((baseOff === 0) || isNewBarForAnalytics);
    if (shouldRebuildAnalytics) {
      state.lastAnalyticsBar = bar_index;
    }
    if (!enoughHistory) {
      f_ensureLabelCount(0);
      f_ensureBoxCount(0);
    } else {
      if (i_showGroupNums) {
        f_ensureLabelCount(i_groups);
        for (let gi = 0; gi <= (i_groups - 1); gi++) {
          let endOff = ((baseOff + ((gi + 1) * groupSize)) - 1);
          let lb = pinescript.arrayGet(state.lblNums, gi);
          label.set_xy(lb, (bar_index - endOff), pinescript.offset(high, endOff));
          label.set_text(lb, pinescript.strToString((gi + 1)));
        }
      } else {
        f_ensureLabelCount(0);
      }
      if (i_showGroupBoxes) {
        f_ensureBoxCount(i_groups);
        f_ensureAnalyticsDataCount(i_groups);
        if (i_showCompositeCandle) {
          f_ensureCompositeBodyCount(i_groups);
          f_ensureCompositeUpperWickCount(i_groups);
          f_ensureCompositeLowerWickCount(i_groups);
        } else {
          f_ensureCompositeBodyCount(0);
          f_ensureCompositeUpperWickCount(0);
          f_ensureCompositeLowerWickCount(0);
        }
        let bullishCol = pinescript.color.rgb(34, 197, 94);
        let bearishCol = pinescript.color.rgb(239, 68, 68);
        let neutralCol = pinescript.color.rgb(156, 163, 175);
        for (let gi = 0; gi <= (i_groups - 1); gi++) {
          if (!shouldRebuildAnalytics) {
            let startOff = (baseOff + (gi * groupSize));
            let endOff = ((baseOff + ((gi + 1) * groupSize)) - 1);
            let xRight = (bar_index - startOff);
            let xLeft = (bar_index - endOff);
            let bx = pinescript.arrayGet(state.grpBoxes, gi);
            box.set_lefttop(bx, xLeft, pinescript.offset(high, endOff));
            box.set_rightbottom(bx, xRight, pinescript.offset(low, startOff));
            continue;
          }
          let startOff = (baseOff + (gi * groupSize));
          let endOff = ((baseOff + ((gi + 1) * groupSize)) - 1);
          let top = null;
          let bot = null;
          let sumBuyBlock = 0;
          let sumSellBlock = 0;
          let sumUpperPin = 0;
          let sumLowerPin = 0;
          let sumBody = 0;
          let compOpen = null;
          let compHigh = null;
          let compLow = null;
          let compClose = null;
          for (let k = startOff; k <= endOff; k++) {
            let h = pinescript.offset(high, k);
            let l = pinescript.offset(low, k);
            let o = pinescript.offset(open, k);
            let c = pinescript.offset(close, k);
            if ((pinescript.na(top) || (h > top))) {
              top = h;
            }
            if ((pinescript.na(bot) || (l < bot))) {
              bot = l;
            }
            let bVol = pinescript.offset(state.vBuy, k);
            let sVol = pinescript.offset(state.vSell, k);
            if ((!pinescript.na(bVol) && !pinescript.na(sVol))) {
              sumBuyBlock += bVol;
              sumSellBlock += sVol;
            }
            sumUpperPin += (h - pinescript.max(o, c));
            sumLowerPin += (pinescript.min(o, c) - l);
            sumBody += pinescript.abs((c - o));
            if ((k === endOff)) {
              compOpen = o;
            }
            if ((k === startOff)) {
              compClose = c;
            }
            if ((pinescript.na(compHigh) || (h > compHigh))) {
              compHigh = h;
            }
            if ((pinescript.na(compLow) || (l < compLow))) {
              compLow = l;
            }
          }
          let xRight = (bar_index - startOff);
          let xLeft = (bar_index - endOff);
          let xCenter = int(pinescript.round(((xLeft + xRight) / 2)));
          let bx = pinescript.arrayGet(state.grpBoxes, gi);
          box.set_lefttop(bx, xLeft, top);
          box.set_rightbottom(bx, xRight, bot);
          box.set_bgcolor(bx, pinescript.color.new(i_boxColor, i_boxTransp));
          box.set_border_color(bx, pinescript.color.new(pinescript.color.black, 100));
          box.set_border_width(bx, 0);
          let n = groupSize;
          let blockDelta = (sumBuyBlock - sumSellBlock);
          let blockHeight = (top - bot);
          let blockArea = (blockHeight * n);
          let ba = BlockAnalytics.new(true, sumBuyBlock, sumSellBlock, blockDelta, blockHeight, blockArea, ((n > 0) ? (sumUpperPin / n) : null), ((n > 0) ? (sumLowerPin / n) : null), ((n > 0) ? (sumBody / n) : null), compOpen, compHigh, compLow, compClose, xLeft, xRight, xCenter, bot);
          pinescript.arraySet(state.analyticsData, gi, ba);
          if (((((i_showCompositeCandle && !pinescript.na(compOpen)) && !pinescript.na(compHigh)) && !pinescript.na(compLow)) && !pinescript.na(compClose))) {
            let candleCol = ((blockDelta > 0) ? bullishCol : ((blockDelta < 0) ? bearishCol : neutralCol));
            let wickCol = pinescript.color.new(candleCol, (i_compositeCandleTransp - 15));
            let bodyCol = pinescript.color.new(candleCol, i_compositeCandleTransp);
            let borderCol = pinescript.color.new(candleCol, (i_compositeCandleTransp - 25));
            let bodyTop = pinescript.max(compOpen, compClose);
            let bodyBot = pinescript.min(compOpen, compClose);
            let bodyLeft = (xCenter - 1);
            let bodyRight = (xCenter + 1);
            let bodyBox = pinescript.arrayGet(state.compositeBodies, gi);
            box.set_lefttop(bodyBox, bodyLeft, bodyTop);
            box.set_rightbottom(bodyBox, bodyRight, bodyBot);
            box.set_bgcolor(bodyBox, bodyCol);
            box.set_border_color(bodyBox, borderCol);
            box.set_border_width(bodyBox, 1);
            let upperWick = pinescript.arrayGet(state.compositeUpperWicks, gi);
            line.set_xy1(upperWick, xCenter, bodyTop);
            line.set_xy2(upperWick, xCenter, compHigh);
            line.set_color(upperWick, wickCol);
            line.set_width(upperWick, 1);
            let lowerWick = pinescript.arrayGet(state.compositeLowerWicks, gi);
            line.set_xy1(lowerWick, xCenter, bodyBot);
            line.set_xy2(lowerWick, xCenter, compLow);
            line.set_color(lowerWick, wickCol);
            line.set_width(lowerWick, 1);
          }
        }
      } else {
        f_ensureBoxCount(0);
        f_ensureAnalyticsDataCount(0);
        f_ensureCompositeBodyCount(0);
        f_ensureCompositeUpperWickCount(0);
        f_ensureCompositeLowerWickCount(0);
      }
    }
    while ((pinescript.arraySize(state.g_binPocPrice) < i_groups)) {
      pinescript.arrayPush(state.g_binPocPrice, null);
      pinescript.arrayPush(state.g_binPocOff, null);
      pinescript.arrayPush(state.g_binPocVol, null);
    }
    while ((pinescript.arraySize(state.g_binPocPrice) > i_groups)) {
      pinescript.arrayPop(state.g_binPocPrice);
      pinescript.arrayPop(state.g_binPocOff);
      pinescript.arrayPop(state.g_binPocVol);
    }
    for (let _gi = 0; _gi <= (i_groups - 1); _gi++) {
      let _sOff = (baseOff + (_gi * groupSize));
      let _eOff = ((baseOff + ((_gi + 1) * groupSize)) - 1);
      let _blockHigh = null;
      let _blockLow = null;
      for (let k = _sOff; k <= _eOff; k++) {
        let _h = pinescript.offset(high, k);
        let _l = pinescript.offset(low, k);
        if ((pinescript.na(_blockHigh) || (_h > _blockHigh))) {
          _blockHigh = _h;
        }
        if ((pinescript.na(_blockLow) || (_l < _blockLow))) {
          _blockLow = _l;
        }
      }
      let _bp = null;
      let _bo = null;
      let _bv = 0;
      if (((!pinescript.na(_blockHigh) && !pinescript.na(_blockLow)) && (_blockHigh > _blockLow))) {
        let _binSize = ((_blockHigh - _blockLow) / i_pocBinCount);
        let _binVol = pinescript.arrayNew(i_pocBinCount, 0);
        for (let k = _sOff; k <= _eOff; k++) {
          let _barH = pinescript.offset(high, k);
          let _barL = pinescript.offset(low, k);
          let _barTotalVol = (pinescript.nz(pinescript.offset(state.vBuy, k), 0) + pinescript.nz(pinescript.offset(state.vSell, k), 0));
          if (((_barTotalVol > 0) && (_barH > _barL))) {
            let _firstBin = pinescript.max(0, int(math.floor(((_barL - _blockLow) / _binSize))));
            let _lastBin = pinescript.min((i_pocBinCount - 1), int(math.floor((((_barH - _blockLow) - (syminfo.mintick * 0.01)) / _binSize))));
            _lastBin = pinescript.max(_firstBin, _lastBin);
            let _barRange = (_barH - _barL);
            for (let b = _firstBin; b <= _lastBin; b++) {
              let _bLow = (_blockLow + (b * _binSize));
              let _bHigh = (_bLow + _binSize);
              let _overlap = (pinescript.min(_barH, _bHigh) - pinescript.max(_barL, _bLow));
              let _proportion = ((_barRange > 0) ? pinescript.max(0, (_overlap / _barRange)) : 0);
              pinescript.arraySet(_binVol, b, (pinescript.arrayGet(_binVol, b) + (_barTotalVol * _proportion)));
            }
          }
        }
        let _maxVol = 0;
        let _maxBin = 0;
        for (let b = 0; b <= (i_pocBinCount - 1); b++) {
          let _bvol = pinescript.arrayGet(_binVol, b);
          if ((_bvol > _maxVol)) {
            _maxVol = _bvol;
            _maxBin = b;
          }
        }
        _bp = (_blockLow + ((_maxBin + 0.5) * _binSize));
        _bv = _maxVol;
        let _minDist = null;
        for (let k = _sOff; k <= _eOff; k++) {
          let _dist = pinescript.abs((pinescript.offset(hlc3, k) - _bp));
          if ((pinescript.na(_minDist) || (_dist < _minDist))) {
            _minDist = _dist;
            _bo = k;
          }
        }
      }
      pinescript.arraySet(state.g_binPocPrice, _gi, _bp);
      pinescript.arraySet(state.g_binPocOff, _gi, pinescript.nz(_bo, 0));
      pinescript.arraySet(state.g_binPocVol, _gi, pinescript.nz(_bv, 0));
    }
  }
  if (barstate.islast) {
    let enoughHistoryCore = (bar_index >= ((baseOff + effWindow) - 1));
    let refX = (bar_index - baseOff);
    let projLen = (i_coreProjectFwd ? groupSize : 0);
    let x2 = (refX + projLen);
    let refPrice = pinescript.offset(close, baseOff);
    let hiBasis = pinescript.offset(high, baseOff);
    let loBasis = pinescript.offset(low, baseOff);
    let minKeepSrc = (bar_index - ((effWindow + groupSize) + 25));
    f_pruneConsumed(minKeepSrc);
    state.lnCoreUp = f_ensureLine(state.lnCoreUp, _coreBuyCol, line.style_solid);
    state.lnCoreDn = f_ensureLine(state.lnCoreDn, _coreSellCol, line.style_solid);
    state.lnPOCUp = f_ensureLine(state.lnPOCUp, _pocCol, line.style_dashed);
    state.lnPOCDn = f_ensureLine(state.lnPOCDn, _pocColDim, line.style_dashed);
    if (!enoughHistoryCore) {
      f_ensureCoreCount(0);
      f_hideLine(state.lnCoreUp, refX, refPrice);
      f_hideLine(state.lnCoreDn, refX, refPrice);
      f_hideLine(state.lnPOCUp, refX, refPrice);
      f_hideLine(state.lnPOCDn, refX, refPrice);
      state.g_levels = syncFromCore(state.g_levels, null, null, null, null, null, null, null, null, null, null);
      state.g_pocUpP = null;
      state.g_pocDnP = null;
    } else {
      f_ensureCoreCount(i_groups);
      let validBarsCore = ((i_calcMethod === "Intrabar (Precise)") ? scannableBars : pinescript.min(histBarsDash, effWindow));
      let validGroupsCore = ((groupSize > 0) ? int(math.floor((float(validBarsCore) / groupSize))) : 0);
      validGroupsCore = pinescript.min(validGroupsCore, i_groups);
      if (!i_coreEnable) {
        for (let gi = 0; gi <= (i_groups - 1); gi++) {
          pinescript.arraySet(state.coreBoxes, gi, f_coreEmpty());
        }
      } else {
        for (let gi = 0; gi <= (i_groups - 1); gi++) {
          let gActive = (gi < validGroupsCore);
          let startOff = (baseOff + (gi * groupSize));
          let endOff = ((baseOff + ((gi + 1) * groupSize)) - 1);
          let _bpP = pinescript.arrayGet(state.g_binPocPrice, gi);
          let _bpOff = pinescript.arrayGet(state.g_binPocOff, gi);
          let _bpV = pinescript.arrayGet(state.g_binPocVol, gi);
          if (!gActive) {
            pinescript.arraySet(state.coreBoxes, gi, f_coreEmpty());
          } else {
            let gValid = true;
            let sumB = 0;
            let sumS = 0;
            let maxB = -1;
            let maxBOff = null;
            let minB = null;
            let minBOff = null;
            let maxS = -1;
            let maxSOff = null;
            let minS = null;
            let minSOff = null;
            let pocV = -1;
            let pocOff = null;
            for (let k = startOff; k <= endOff; k++) {
              let b = pinescript.offset(state.vBuy, k);
              let s = pinescript.offset(state.vSell, k);
              if ((pinescript.na(b) || pinescript.na(s))) {
                gValid = false;
              } else {
                sumB += b;
                sumS += s;
                if ((b > maxB)) {
                  maxB = b;
                  maxBOff = k;
                }
                if ((pinescript.na(minB) || (b < minB))) {
                  minB = b;
                  minBOff = k;
                }
                if ((s > maxS)) {
                  maxS = s;
                  maxSOff = k;
                }
                if ((pinescript.na(minS) || (s < minS))) {
                  minS = s;
                  minSOff = k;
                }
                let tv = (b + s);
                if ((tv > pocV)) {
                  pocV = tv;
                  pocOff = k;
                }
              }
            }
            if ((((((!gValid || pinescript.na(maxBOff)) || pinescript.na(maxSOff)) || pinescript.na(minBOff)) || pinescript.na(minSOff)) || pinescript.na(pocOff))) {
              pinescript.arraySet(state.coreBoxes, gi, f_coreEmpty());
            } else {
              let finalPocPrice = pinescript.offset(hlc3, pocOff);
              let finalPocOff = pocOff;
              let finalPocVol = pocV;
              if ((i_pocBinProfile && !pinescript.na(_bpP))) {
                finalPocPrice = _bpP;
                finalPocOff = pinescript.nz(_bpOff, pocOff);
                finalPocVol = _bpV;
              }
              let bc = BoxCore.new(true, sumB, sumS, (sumB - sumS), finalPocPrice, finalPocOff, finalPocVol, maxB, maxBOff, pinescript.offset(high, maxBOff), maxS, maxSOff, pinescript.offset(low, maxSOff), minB, minBOff, pinescript.offset(high, minBOff), minS, minSOff, pinescript.offset(low, minSOff));
              pinescript.arraySet(state.coreBoxes, gi, bc);
            }
          }
        }
      }
      let showCoreNearest = ((i_coreDrawLines && i_coreNearestOnly) && (i_coreShowMax || i_coreShowMin));
      let extUpP = null;
      let extUpSrc = null;
      let extUpTyp = null;
      let extUpBox = null;
      let extDnP = null;
      let extDnSrc = null;
      let extDnTyp = null;
      let extDnBox = null;
      if ((showCoreNearest && i_coreEnable)) {
        let [_eUpP, _eUpSrc, _eUpTyp, _eUpBox, _eDnP, _eDnSrc, _eDnTyp, _eDnBox] = f_pickNearestExt(refPrice);
        extUpP = _eUpP;
        extUpSrc = _eUpSrc;
        extUpTyp = _eUpTyp;
        extUpBox = _eUpBox;
        extDnP = _eDnP;
        extDnSrc = _eDnSrc;
        extDnTyp = _eDnTyp;
        extDnBox = _eDnBox;
      }
      let showPOCNearest = ((i_pocEnable && i_pocShowNearest) && i_coreEnable);
      let pocUpP = null;
      let pocUpSrc = null;
      let pocUpBox = null;
      let pocDnP = null;
      let pocDnSrc = null;
      let pocDnBox = null;
      if (showPOCNearest) {
        let [_pUpP, _pUpSrc, _pUpBox, _pDnP, _pDnSrc, _pDnBox] = f_pickNearestPOC(refPrice);
        pocUpP = _pUpP;
        pocUpSrc = _pUpSrc;
        pocUpBox = _pUpBox;
        pocDnP = _pDnP;
        pocDnSrc = _pDnSrc;
        pocDnBox = _pDnBox;
      } else {
        pocUpP = null;
        pocUpSrc = null;
        pocUpBox = null;
        pocDnP = null;
        pocDnSrc = null;
        pocDnBox = null;
      }
      for (let pass = 0; pass <= 1; pass++) {
        let changed = false;
        if ((((showCoreNearest && !pinescript.na(extUpP)) && (loBasis <= extUpP)) && (extUpP <= hiBasis))) {
          f_markConsumed(extUpSrc, extUpTyp, extUpP);
          (changed = true);
        }
        if ((((showCoreNearest && !pinescript.na(extDnP)) && (loBasis <= extDnP)) && (extDnP <= hiBasis))) {
          f_markConsumed(extDnSrc, extDnTyp, extDnP);
          (changed = true);
        }
        if ((((showPOCNearest && !pinescript.na(pocUpP)) && (loBasis <= pocUpP)) && (pocUpP <= hiBasis))) {
          f_markConsumed(pocUpSrc, _T_POC, pocUpP);
          (changed = true);
        }
        if ((((showPOCNearest && !pinescript.na(pocDnP)) && (loBasis <= pocDnP)) && (pocDnP <= hiBasis))) {
          f_markConsumed(pocDnSrc, _T_POC, pocDnP);
          (changed = true);
        }
        if (changed) {
          if (showCoreNearest) {
            let [_extUpP, _extUpSrc, _extUpTyp, _extUpBox, _extDnP, _extDnSrc, _extDnTyp, _extDnBox] = f_pickNearestExt(refPrice);
            extUpP = _extUpP;
            extUpSrc = _extUpSrc;
            extUpTyp = _extUpTyp;
            extUpBox = _extUpBox;
            extDnP = _extDnP;
            extDnSrc = _extDnSrc;
            extDnTyp = _extDnTyp;
            extDnBox = _extDnBox;
          }
          if (showPOCNearest) {
            let [_pocUpP, _pocUpSrc, _pocUpBox, _pocDnP, _pocDnSrc, _pocDnBox] = f_pickNearestPOC(refPrice);
            pocUpP = _pocUpP;
            pocUpSrc = _pocUpSrc;
            pocUpBox = _pocUpBox;
            pocDnP = _pocDnP;
            pocDnSrc = _pocDnSrc;
            pocDnBox = _pocDnBox;
          }
        }
      }
      state.g_levels = syncFromCore(state.g_levels, pocUpP, pocUpBox, pocDnP, pocDnBox, extUpP, extUpTyp, extUpBox, extDnP, extDnTyp, extDnBox);
      state.g_pocUpP = (state.g_levels.hasPOCUp ? state.g_levels.pocUp : null);
      state.g_pocDnP = (state.g_levels.hasPOCDn ? state.g_levels.pocDn : null);
      state.lblCoreUp = f_ensureLabel(state.lblCoreUp, _coreBuyCol);
      state.lblCoreDn = f_ensureLabel(state.lblCoreDn, _coreSellCol);
      state.lblPOCUp = f_ensureLabel(state.lblPOCUp, _pocCol);
      state.lblPOCDn = f_ensureLabel(state.lblPOCDn, _pocColDim);
      if ((showCoreNearest && !pinescript.na(extUpP))) {
        f_setHLine(state.lnCoreUp, extUpSrc, x2, extUpP, _coreBuyCol);
        f_setLineLabel(state.lblCoreUp, x2, extUpP, ((((f_typeName(extUpTyp) + " | Box ") + pinescript.strToString(extUpBox)) + " | ") + pinescript.strToString(extUpP, format.mintick)), _coreBuyCol);
      } else {
        f_hideLine(state.lnCoreUp, refX, refPrice);
        f_hideLabel(state.lblCoreUp);
      }
      if ((showCoreNearest && !pinescript.na(extDnP))) {
        f_setHLine(state.lnCoreDn, extDnSrc, x2, extDnP, _coreSellCol);
        f_setLineLabel(state.lblCoreDn, x2, extDnP, ((((f_typeName(extDnTyp) + " | Box ") + pinescript.strToString(extDnBox)) + " | ") + pinescript.strToString(extDnP, format.mintick)), _coreSellCol);
      } else {
        f_hideLine(state.lnCoreDn, refX, refPrice);
        f_hideLabel(state.lblCoreDn);
      }
      if ((showPOCNearest && !pinescript.na(pocUpP))) {
        f_setHLine(state.lnPOCUp, pocUpSrc, x2, pocUpP, _pocCol);
        f_setLineLabel(state.lblPOCUp, x2, pocUpP, ((("POC | Box " + pinescript.strToString(pocUpBox)) + " | ") + pinescript.strToString(pocUpP, format.mintick)), _pocCol);
      } else {
        f_hideLine(state.lnPOCUp, refX, refPrice);
        f_hideLabel(state.lblPOCUp);
      }
      if ((showPOCNearest && !pinescript.na(pocDnP))) {
        f_setHLine(state.lnPOCDn, pocDnSrc, x2, pocDnP, _pocColDim);
        f_setLineLabel(state.lblPOCDn, x2, pocDnP, ((("POC | Box " + pinescript.strToString(pocDnBox)) + " | ") + pinescript.strToString(pocDnP, format.mintick)), _pocColDim);
      } else {
        f_hideLine(state.lnPOCDn, refX, refPrice);
        f_hideLabel(state.lblPOCDn);
      }
    }
  }
  if (state.lastTrendCalcBar === undefined) state.lastTrendCalcBar = -1;
  if (barstate.islast) {
    let isNewBar = (bar_index !== state.lastTrendCalcBar);
    let shouldUpdateTrends = ((baseOff === 0) || isNewBar);
    if (shouldUpdateTrends) {
      f_clearAllChannels();
      state.lastTrendCalcBar = bar_index;
      if ((i_trendEnable && (pinescript.arraySize(state.analyticsData) >= i_trendMinBlocks))) {
        f_detectTrendChannels(i_rangeAngleThreshold, globalYZVol);
        let projLen = (i_trendProject ? (groupSize + 2) : 0);
        f_drawAllChannels(projLen, i_trendUpColor, i_trendDnColor, i_trendRangeColor, i_trendLineWidth, i_trendLineStyle, i_showRangeSegments);
        if ((pinescript.arraySize(state.trendChannels) > 0)) {
          let latestCh = pinescript.arrayGet(state.trendChannels, 0);
          let upperBarSpan = (latestCh.upperX2 - latestCh.upperX1);
          let lowerBarSpan = (latestCh.lowerX2 - latestCh.lowerX1);
          let upperSlope = ((upperBarSpan > 0) ? ((latestCh.upperY2 - latestCh.upperY1) / upperBarSpan) : 0);
          let lowerSlope = ((lowerBarSpan > 0) ? ((latestCh.lowerY2 - latestCh.lowerY1) / lowerBarSpan) : 0);
          let upperX2Proj = (latestCh.upperX2 + projLen);
          let lowerX2Proj = (latestCh.lowerX2 + projLen);
          let upperY2Proj = (latestCh.upperY2 + (upperSlope * projLen));
          let lowerY2Proj = (latestCh.lowerY2 + (lowerSlope * projLen));
          let upperAngleDeg = (((upperBarSpan > 0) && (globalYZVol > 0)) ? math.todegrees(math.atan(((upperSlope * pinescript.sqrt(float(upperBarSpan))) / globalYZVol))) : 0);
          let lowerAngleDeg = (((lowerBarSpan > 0) && (globalYZVol > 0)) ? math.todegrees(math.atan(((lowerSlope * pinescript.sqrt(float(lowerBarSpan))) / globalYZVol))) : 0);
          let currentPrice = pinescript.offset(close, baseOff);
          let resistDiff = (upperY2Proj - currentPrice);
          let supportDiff = (currentPrice - lowerY2Proj);
          let resistPct = ((currentPrice !== 0) ? ((resistDiff / currentPrice) * 100) : 0);
          let supportPct = ((currentPrice !== 0) ? ((supportDiff / currentPrice) * 100) : 0);
          let chCol = ((latestCh.channelType === DIR_UP) ? i_trendUpColor : ((latestCh.channelType === DIR_DOWN) ? i_trendDnColor : i_trendRangeColor));
          let blockRange = ((("Blk " + pinescript.strToString(latestCh.startBlock)) + "-") + pinescript.strToString(latestCh.endBlock));
          let upperText = (((((((((("▲ Upper | " + blockRange) + " | ") + pinescript.strToString(upperY2Proj, format.mintick)) + " (+") + pinescript.strToString(resistDiff, "#.##")) + " | +") + pinescript.strToString(resistPct, "#.##")) + "%) | ") + pinescript.strToString(upperAngleDeg, "#.#")) + "°");
          let lowerText = (((((((((("▼ Lower | " + blockRange) + " | ") + pinescript.strToString(lowerY2Proj, format.mintick)) + " (-") + pinescript.strToString(supportDiff, "#.##")) + " | -") + pinescript.strToString(supportPct, "#.##")) + "%) | ") + pinescript.strToString(lowerAngleDeg, "#.#")) + "°");
          if (pinescript.na(state.lblTrendResist)) {
            state.lblTrendResist = pinescript.labelNew(upperX2Proj, upperY2Proj, upperText, ({ style: label.style_label_left, size: GLOBAL_TEXT_SIZE, textcolor: chCol, color: pinescript.color.new(pinescript.color.black, 85), tooltip: "Upper channel line: Block range | Price | Distance | Angle" }));
          } else {
            label.set_xy(state.lblTrendResist, upperX2Proj, upperY2Proj);
            label.set_text(state.lblTrendResist, upperText);
            label.set_textcolor(state.lblTrendResist, chCol);
            label.set_size(state.lblTrendResist, GLOBAL_TEXT_SIZE);
            label.set_tooltip(state.lblTrendResist, "Upper channel line: Block range | Price | Distance | Angle");
          }
          if (pinescript.na(state.lblTrendSupport)) {
            state.lblTrendSupport = pinescript.labelNew(lowerX2Proj, lowerY2Proj, lowerText, ({ style: label.style_label_left, size: GLOBAL_TEXT_SIZE, textcolor: chCol, color: pinescript.color.new(pinescript.color.black, 85), tooltip: "Lower channel line: Block range | Price | Distance | Angle" }));
          } else {
            label.set_xy(state.lblTrendSupport, lowerX2Proj, lowerY2Proj);
            label.set_text(state.lblTrendSupport, lowerText);
            label.set_textcolor(state.lblTrendSupport, chCol);
            label.set_size(state.lblTrendSupport, GLOBAL_TEXT_SIZE);
            label.set_tooltip(state.lblTrendSupport, "Lower channel line: Block range | Price | Distance | Angle");
          }
        } else {
          if (!pinescript.na(state.lblTrendResist)) {
            label.set_xy(state.lblTrendResist, bar_index, close);
            label.set_text(state.lblTrendResist, "");
            label.set_textcolor(state.lblTrendResist, pinescript.color.new(pinescript.color.gray, 100));
          }
          if (!pinescript.na(state.lblTrendSupport)) {
            label.set_xy(state.lblTrendSupport, bar_index, close);
            label.set_text(state.lblTrendSupport, "");
            label.set_textcolor(state.lblTrendSupport, pinescript.color.new(pinescript.color.gray, 100));
          }
        }
      }
    }
  }
  let maxBoxesByHist = ((groupSize > 0) ? int(math.floor((float(pinescript.min(histBarsDash, effWindow)) / groupSize))) : 0);
  let maxBoxesByScan = ((groupSize > 0) ? int(math.floor((float(scannableBars) / groupSize))) : 0);
  let maxBoxesAllowedDash = pinescript.max(0, pinescript.min(i_groups, maxBoxesByHist));
  if ((i_calcMethod === "Intrabar (Precise)")) {
    maxBoxesAllowedDash = pinescript.min(maxBoxesAllowedDash, maxBoxesByScan);
  }
  let boxesEff = pinescript.max(0, pinescript.min(i_globalPeriodBoxes, maxBoxesAllowedDash));
  let globalPeriodBars = (boxesEff * groupSize);
  function f_fmtVol(v) {
    return (pinescript.na(v) ? "-" : pinescript.strToString(v, format.volume));
  }
  function f_fmtPrice(v) {
    return (pinescript.na(v) ? "-" : pinescript.strToString(v, format.mintick));
  }
  if (state.dashT === undefined) state.dashT = null;
  let DASH_COLS = 4;
  let DASH_ROWS = 50;
  if (i_showDash) {
    if (pinescript.na(state.dashT)) {
      state.dashT = pinescript.table.new(i_dashPos, DASH_COLS, DASH_ROWS, ({ frame_color: pinescript.color.new(pinescript.color.white, 85), frame_width: 1, border_color: pinescript.color.new(pinescript.color.white, 92), border_width: 1 }));
    }
  } else {
    if (!pinescript.na(state.dashT)) {
      clear(pinescript.table, state.dashT, 0, 0, (DASH_COLS - 1), (DASH_ROWS - 1));
      state.dashT = null;
    }
  }
  if (((i_showDash && !pinescript.na(state.dashT)) && barstate.islast)) {
    clear(pinescript.table, state.dashT, 0, 0, (DASH_COLS - 1), (DASH_ROWS - 1));
    let latestTrend = ((pinescript.arraySize(state.trendChannels) > 0) ? pinescript.arrayGet(state.trendChannels, 0) : null);
    let trendValid = (!pinescript.na(latestTrend) && i_trendEnable);
    let trendBuy = 0;
    let trendSell = 0;
    let sumUpperPin = 0;
    let sumLowerPin = 0;
    let sumBody = 0;
    let firstBlockUpperPin = null;
    let lastBlockUpperPin = null;
    let firstBlockLowerPin = null;
    let lastBlockLowerPin = null;
    let firstBlockBody = null;
    let lastBlockBody = null;
    let firstBlockVol = null;
    let lastBlockVol = null;
    let firstBlockDelta = null;
    let lastBlockDelta = null;
    let trendBlocks = 0;
    if (trendValid) {
      let trendStart = (latestTrend.startBlock - 1);
      let trendEnd = (latestTrend.endBlock - 1);
      trendBlocks = ((trendEnd - trendStart) + 1);
      for (let i = trendStart; i <= trendEnd; i++) {
        if ((i < pinescript.arraySize(state.analyticsData))) {
          let ba = pinescript.arrayGet(state.analyticsData, i);
          if (ba.valid) {
            trendBuy += ba.totalBuy;
            trendSell += ba.totalSell;
            sumUpperPin += ba.avgUpperPin;
            sumLowerPin += ba.avgLowerPin;
            sumBody += ba.avgBody;
            if ((i === trendEnd)) {
              firstBlockUpperPin = ba.avgUpperPin;
              firstBlockLowerPin = ba.avgLowerPin;
              firstBlockBody = ba.avgBody;
              firstBlockVol = (ba.totalBuy + ba.totalSell);
              firstBlockDelta = ba.delta;
            }
            if ((i === trendStart)) {
              lastBlockUpperPin = ba.avgUpperPin;
              lastBlockLowerPin = ba.avgLowerPin;
              lastBlockBody = ba.avgBody;
              lastBlockVol = (ba.totalBuy + ba.totalSell);
              lastBlockDelta = ba.delta;
            }
          }
        }
      }
    }
    let trendDelta = (trendBuy - trendSell);
    let trendDeltaPct = (((trendBuy + trendSell) > 0) ? ((trendDelta / (trendBuy + trendSell)) * 100) : 0);
    let avgUpperPin = ((trendBlocks > 0) ? (sumUpperPin / trendBlocks) : null);
    let avgLowerPin = ((trendBlocks > 0) ? (sumLowerPin / trendBlocks) : null);
    let avgBody = ((trendBlocks > 0) ? (sumBody / trendBlocks) : null);
    let upperPinChg = (((!pinescript.na(firstBlockUpperPin) && !pinescript.na(lastBlockUpperPin)) && (firstBlockUpperPin !== 0)) ? (((lastBlockUpperPin - firstBlockUpperPin) / firstBlockUpperPin) * 100) : 0);
    let lowerPinChg = (((!pinescript.na(firstBlockLowerPin) && !pinescript.na(lastBlockLowerPin)) && (firstBlockLowerPin !== 0)) ? (((lastBlockLowerPin - firstBlockLowerPin) / firstBlockLowerPin) * 100) : 0);
    let bodyStatus = ((!pinescript.na(firstBlockBody) && !pinescript.na(lastBlockBody)) ? ((lastBlockBody > firstBlockBody) ? "EXPANDING" : ((lastBlockBody < firstBlockBody) ? "CONTRACTING" : "STABLE")) : "-");
    let volMom = ((!pinescript.na(firstBlockVol) && !pinescript.na(lastBlockVol)) ? ((lastBlockVol > firstBlockVol) ? "INCREASING ▲" : "DECREASING ▼") : "-");
    let deltaDir = ((!pinescript.na(firstBlockDelta) && !pinescript.na(lastBlockDelta)) ? ((lastBlockDelta > firstBlockDelta) ? "POSITIVE ▲" : "NEGATIVE ▼") : "-");
    let pinRatio = (((!pinescript.na(avgUpperPin) && !pinescript.na(avgLowerPin)) && (avgLowerPin !== 0)) ? (avgUpperPin / avgLowerPin) : 1);
    let control = ((trendDelta > 0) ? "BUYERS" : ((trendDelta < 0) ? "SELLERS" : "BALANCED"));
    let currentPrice = pinescript.offset(close, baseOff);
    let projLenCh = ((trendValid && i_trendProject) ? (groupSize + 2) : 0);
    let upperChPrice = null;
    let lowerChPrice = null;
    if (trendValid) {
      let upperSpanCh = (latestTrend.upperX2 - latestTrend.upperX1);
      let lowerSpanCh = (latestTrend.lowerX2 - latestTrend.lowerX1);
      let upperSlopeCh = ((upperSpanCh !== 0) ? ((latestTrend.upperY2 - latestTrend.upperY1) / upperSpanCh) : 0);
      let lowerSlopeCh = ((lowerSpanCh !== 0) ? ((latestTrend.lowerY2 - latestTrend.lowerY1) / lowerSpanCh) : 0);
      upperChPrice = (latestTrend.upperY2 + (upperSlopeCh * projLenCh));
      lowerChPrice = (latestTrend.lowerY2 + (lowerSlopeCh * projLenCh));
    }
    let resistPrice = upperChPrice;
    let supportPrice = lowerChPrice;
    let resistDiff = (!pinescript.na(resistPrice) ? (resistPrice - currentPrice) : null);
    let supportDiff = (!pinescript.na(supportPrice) ? (currentPrice - supportPrice) : null);
    let resistPct = ((!pinescript.na(resistDiff) && (currentPrice !== 0)) ? ((resistDiff / currentPrice) * 100) : null);
    let supportPct = ((!pinescript.na(supportDiff) && (currentPrice !== 0)) ? ((supportDiff / currentPrice) * 100) : null);
    let channelWidth = ((!pinescript.na(resistPrice) && !pinescript.na(supportPrice)) ? (resistPrice - supportPrice) : null);
    let rrRatio = (((!pinescript.na(resistDiff) && !pinescript.na(supportDiff)) && (supportDiff !== 0)) ? (resistDiff / supportDiff) : null);
    let channelPos = ((!pinescript.na(channelWidth) && (channelWidth !== 0)) ? (((currentPrice - supportPrice) / channelWidth) * 100) : null);
    let posStatus = (!pinescript.na(channelPos) ? ((channelPos > 70) ? "OVERBOUGHT" : ((channelPos < 30) ? "OVERSOLD" : "NEUTRAL")) : "-");
    let quality = 50;
    let contradictions = 0;
    if (trendValid) {
      let absAngle = pinescript.abs(latestTrend.angleDeg);
      let angleRange = (45 - i_rangeAngleThreshold);
      let angleScore = ((angleRange > 0) ? (15 * pinescript.max(0, pinescript.min(1, ((absAngle - i_rangeAngleThreshold) / angleRange)))) : 0);
      quality += angleScore;
      let totalPairs = 0;
      let consistentPairs = 0;
      for (let i = (latestTrend.startBlock - 1); i <= (latestTrend.endBlock - 1); i++) {
        if (((i < pinescript.arraySize(state.analyticsData)) && ((i + 1) < pinescript.arraySize(state.analyticsData)))) {
          let d1 = pinescript.arrayGet(state.analyticsData, i).delta;
          let d2 = pinescript.arrayGet(state.analyticsData, (i + 1)).delta;
          if ((!pinescript.na(d1) && !pinescript.na(d2))) {
            totalPairs += 1;
            if ((math.sign(d1) === math.sign(d2))) {
              consistentPairs += 1;
            }
          }
        }
      }
      let deltaConsistent = ((totalPairs > 0) && (consistentPairs === totalPairs));
      let deltaRatio = ((totalPairs > 0) ? (float(consistentPairs) / float(totalPairs)) : 0);
      quality += (10 * deltaRatio);
      if (((!pinescript.na(firstBlockVol) && !pinescript.na(lastBlockVol)) && (firstBlockVol > 0))) {
        let volGrowth = ((lastBlockVol - firstBlockVol) / firstBlockVol);
        let volScore = (10 * pinescript.max(0, pinescript.min(1, (volGrowth / 0.5))));
        quality += volScore;
      }
      if (((!pinescript.na(firstBlockBody) && !pinescript.na(lastBlockBody)) && (firstBlockBody > 0))) {
        let bodyGrowth = ((lastBlockBody - firstBlockBody) / firstBlockBody);
        let bodyScore = (10 * pinescript.max(0, pinescript.min(1, (bodyGrowth / 0.5))));
        quality += bodyScore;
      }
      let pinTotal = (pinescript.nz(avgUpperPin, 0) + pinescript.nz(avgLowerPin, 0));
      let pinScore = 0;
      if ((pinTotal > 0)) {
        if ((latestTrend.channelType === DIR_UP)) {
          pinScore = (8 * pinescript.max(0, pinescript.min(1, (((pinescript.nz(avgLowerPin, 0) / pinTotal) - 0.5) / 0.3))));
        } else {
          if ((latestTrend.channelType === DIR_DOWN)) {
            pinScore = (8 * pinescript.max(0, pinescript.min(1, (((pinescript.nz(avgUpperPin, 0) / pinTotal) - 0.5) / 0.3))));
          }
        }
      }
      let pinAligned = (pinScore > 4);
      quality += pinScore;
      if ((((latestTrend.channelType === DIR_UP) && (trendDelta < 0)) || ((latestTrend.channelType === DIR_DOWN) && (trendDelta > 0)))) {
        contradictions += 1;
      }
      if (((((latestTrend.channelType === DIR_UP) && !pinescript.na(firstBlockVol)) && !pinescript.na(lastBlockVol)) && (lastBlockVol < firstBlockVol))) {
        contradictions += 1;
      }
      quality -= (contradictions * 5);
      if (((deltaConsistent && pinAligned) && (contradictions === 0))) {
        quality += 5;
      }
    }
    quality = pinescript.max(0, pinescript.min(100, quality));
    let confidenceLevel = ((quality >= 80) ? "HIGH" : ((quality >= 60) ? "MEDIUM" : "LOW"));
    let strengthRating = (trendValid ? ((pinescript.abs(latestTrend.angleDeg) > 45) ? "VERY STRONG" : ((pinescript.abs(latestTrend.angleDeg) > 30) ? "STRONG" : ((pinescript.abs(latestTrend.angleDeg) > 15) ? "MODERATE" : "WEAK"))) : "-");
    let trendPrimaryCol = (trendValid ? ((latestTrend.channelType === DIR_UP) ? pinescript.color.rgb(16, 185, 129) : ((latestTrend.channelType === DIR_DOWN) ? pinescript.color.rgb(239, 68, 68) : pinescript.color.rgb(100, 116, 139))) : pinescript.color.rgb(100, 116, 139));
    let trendAccentCol = (trendValid ? ((latestTrend.channelType === DIR_UP) ? pinescript.color.rgb(52, 211, 153) : ((latestTrend.channelType === DIR_DOWN) ? pinescript.color.rgb(248, 113, 113) : pinescript.color.rgb(148, 163, 184))) : pinescript.color.rgb(148, 163, 184));
    let qualityCol = ((quality >= 80) ? pinescript.color.rgb(34, 197, 94) : ((quality >= 60) ? pinescript.color.rgb(234, 179, 8) : pinescript.color.rgb(239, 68, 68)));
    let hdrBg = pinescript.color.new(pinescript.color.rgb(30, 41, 59), 5);
    let rowBg1 = pinescript.color.new(pinescript.color.rgb(51, 65, 85), 15);
    let rowBg2 = pinescript.color.new(pinescript.color.rgb(71, 85, 105), 20);
    let txtHdr = pinescript.color.rgb(248, 250, 252);
    let txtLbl = pinescript.color.rgb(148, 163, 184);
    let txtVal = pinescript.color.rgb(226, 232, 240);
    let posCol = pinescript.color.rgb(34, 197, 94);
    let negCol = pinescript.color.rgb(239, 68, 68);
    let accentCol = pinescript.color.rgb(59, 130, 246);
    let cBuy = pinescript.offset(state.vBuy, baseOff);
    let cSell = pinescript.offset(state.vSell, baseOff);
    let cTot = (cBuy + cSell);
    let cDel = (cBuy - cSell);
    let delCol = (pinescript.na(cDel) ? txtVal : ((cDel >= 0) ? posCol : negCol));
    let _alignL = ((i_narrativeLang === "العربية") ? pinescript.text.align_right : pinescript.text.align_left);
    let basisTitle = ((baseOff === 0) ? f_L("CURRENT", "MEVCUT", "वर्तमान", "الحالية") : f_L("CLOSED", "KAPALI", "बंद", "المغلقة"));
    let engTxt = ((i_calcMethod === "Intrabar (Precise)") ? (((f_dashIntrabar() + " ") + ltf) + ")") : f_dashGeometric());
    table.merge_cells(state.dashT, 0, 0, 3, 0);
    pinescript.table.cell(state.dashT, 0, 0, f_dashVolumeEngine(), ({ text_color: txtHdr, bgcolor: hdrBg, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipEngine() }));
    pinescript.table.cell(state.dashT, 0, 1, f_dashEngine(), ({ text_color: txtLbl, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_right, tooltip: f_L("Volume calculation method", "Hacim hesaplama yöntemi", "वॉल्यूम गणना विधि", "طريقة حساب الحجم") }));
    pinescript.table.cell(state.dashT, 1, 1, engTxt, ({ text_color: accentCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: _alignL, tooltip: f_dashTooltipMethod() }));
    pinescript.table.cell(state.dashT, 2, 1, f_dashData(), ({ text_color: txtLbl, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_right, tooltip: f_dashTooltipData() }));
    pinescript.table.cell(state.dashT, 3, 1, ((pinescript.strToString(scannableBars) + " ") + f_dashBar()), ({ text_color: txtVal, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: _alignL, tooltip: f_dashTooltipScannable() }));
    table.merge_cells(state.dashT, 0, 2, 3, 2);
    let candleHeader = ((baseOff === 0) ? f_dashCurrentCandle() : f_dashClosedCandle());
    let candleTooltip = ((f_L("Most recent ", "En son ", "सबसे हाल का ", "أحدث ") + ((baseOff === 0) ? f_L("live", "canlı", "लाइव", "مباشرة") : f_L("closed", "kapalı", "बंद", "مغلقة"))) + f_L(" candle analysis", " mum analizi", " कैंडल विश्लेषण", " تحليل الشمعة"));
    pinescript.table.cell(state.dashT, 0, 2, candleHeader, ({ text_color: txtHdr, bgcolor: hdrBg, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: candleTooltip }));
    pinescript.table.cell(state.dashT, 0, 3, f_dashBuy(), ({ text_color: posCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_right, tooltip: f_dashTooltipBuy() }));
    pinescript.table.cell(state.dashT, 1, 3, f_fmtVol(cBuy), ({ text_color: posCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: _alignL }));
    pinescript.table.cell(state.dashT, 2, 3, f_dashSell(), ({ text_color: negCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_right, tooltip: f_dashTooltipSell() }));
    pinescript.table.cell(state.dashT, 3, 3, f_fmtVol(cSell), ({ text_color: negCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: _alignL }));
    pinescript.table.cell(state.dashT, 0, 4, f_dashTotal(), ({ text_color: txtLbl, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_right, tooltip: f_dashTooltipTotal() }));
    pinescript.table.cell(state.dashT, 1, 4, f_fmtVol(cTot), ({ text_color: txtVal, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: _alignL }));
    let deltaIcon = (pinescript.na(cDel) ? "●" : ((cDel >= 0) ? "▲" : "▼"));
    let deltaSign = (pinescript.na(cDel) ? "" : ((cDel > 0) ? "+" : ""));
    pinescript.table.cell(state.dashT, 2, 4, ((deltaIcon + " ") + f_dashDelta()), ({ text_color: delCol, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_right, tooltip: f_dashTooltipDelta() }));
    pinescript.table.cell(state.dashT, 3, 4, (deltaSign + f_fmtVol(cDel)), ({ text_color: delCol, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: _alignL }));
    table.merge_cells(state.dashT, 0, 5, 3, 5);
    let trendTitle = (trendValid ? ((((((f_dashTrendVolumetrics() + " • ") + f_L("Blk", "Blk", "ब्लॉक", "كتلة")) + " ") + pinescript.strToString(latestTrend.startBlock)) + "-") + pinescript.strToString(latestTrend.endBlock)) : (f_dashTrendVolumetrics() + " • N/A"));
    pinescript.table.cell(state.dashT, 0, 5, trendTitle, ({ text_color: txtHdr, bgcolor: hdrBg, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipTrendVolume() }));
    pinescript.table.cell(state.dashT, 0, 6, f_dashBuy(), ({ text_color: posCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipTrendBuy() }));
    pinescript.table.cell(state.dashT, 1, 6, f_dashSell(), ({ text_color: negCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipTrendSell() }));
    pinescript.table.cell(state.dashT, 2, 6, ("◆ " + f_dashDelta()), ({ text_color: ((trendDelta >= 0) ? posCol : negCol), bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipTrendDelta() }));
    pinescript.table.cell(state.dashT, 3, 6, f_dashType(), ({ text_color: txtLbl, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipType() }));
    pinescript.table.cell(state.dashT, 0, 7, f_fmtVol(trendBuy), ({ text_color: posCol, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center }));
    pinescript.table.cell(state.dashT, 1, 7, f_fmtVol(trendSell), ({ text_color: negCol, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center }));
    let trendDeltaStr = ((((((trendDelta > 0) ? "+" : "") + f_fmtVol(trendDelta)) + " (") + pinescript.strToString(trendDeltaPct, "#.##")) + "%)");
    pinescript.table.cell(state.dashT, 2, 7, trendDeltaStr, ({ text_color: ((trendDelta >= 0) ? posCol : negCol), bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center }));
    let trendTypeName = (trendValid ? ((latestTrend.channelType === DIR_UP) ? f_dashUptrend() : ((latestTrend.channelType === DIR_DOWN) ? f_dashDowntrend() : f_dashRange())) : "-");
    pinescript.table.cell(state.dashT, 3, 7, trendTypeName, ({ text_color: trendPrimaryCol, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center }));
    table.merge_cells(state.dashT, 0, 8, 3, 8);
    pinescript.table.cell(state.dashT, 0, 8, f_dashPressureMomentum(), ({ text_color: txtHdr, bgcolor: hdrBg, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipPressure() }));
    let upperPinChgStr = (pinescript.strToString(upperPinChg, "#.##") + "%");
    let lowerPinChgStr = (pinescript.strToString(lowerPinChg, "#.##") + "%");
    pinescript.table.cell(state.dashT, 0, 9, f_dashSellers(), ({ text_color: negCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipSellersPin() }));
    pinescript.table.cell(state.dashT, 1, 9, f_dashBuyers(), ({ text_color: posCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipBuyersPin() }));
    pinescript.table.cell(state.dashT, 2, 9, f_dashBodyAVG(), ({ text_color: txtLbl, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipBodyAVG() }));
    pinescript.table.cell(state.dashT, 3, 9, f_dashTrend(), ({ text_color: txtLbl, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipBodyTrend() }));
    pinescript.table.cell(state.dashT, 0, 10, (((f_fmtPrice(avgUpperPin) + " (") + upperPinChgStr) + ")"), ({ text_color: negCol, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center }));
    pinescript.table.cell(state.dashT, 1, 10, (((f_fmtPrice(avgLowerPin) + " (") + lowerPinChgStr) + ")"), ({ text_color: posCol, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center }));
    pinescript.table.cell(state.dashT, 2, 10, f_fmtPrice(avgBody), ({ text_color: txtVal, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center }));
    let bodyStatusLoc = ((bodyStatus === "EXPANDING") ? f_dashExpanding() : ((bodyStatus === "CONTRACTING") ? f_dashContracting() : f_dashStable()));
    let bodyStatusCol = ((bodyStatus === "EXPANDING") ? posCol : ((bodyStatus === "CONTRACTING") ? negCol : txtLbl));
    pinescript.table.cell(state.dashT, 3, 10, bodyStatusLoc, ({ text_color: bodyStatusCol, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center }));
    table.merge_cells(state.dashT, 0, 11, 3, 11);
    pinescript.table.cell(state.dashT, 0, 11, f_dashTrendChannelBoundaries(), ({ text_color: txtHdr, bgcolor: hdrBg, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipChannelBounds() }));
    let upDiffSign = ((!pinescript.na(resistDiff) && (resistDiff > 0)) ? "+" : "");
    let upPctSign = ((!pinescript.na(resistPct) && (resistPct > 0)) ? "+" : "");
    let upperStr = (trendValid ? (((((((((f_dashUpperChannel() + " ") + f_fmtPrice(resistPrice)) + " (Δ ") + upDiffSign) + pinescript.strToString(resistDiff, "#.##")) + " | ") + upPctSign) + pinescript.strToString(resistPct, "#.##")) + "%)") : "-");
    let lowerStr = (trendValid ? (((((((f_dashLowerChannel() + " ") + f_fmtPrice(supportPrice)) + " (Δ -") + pinescript.strToString(supportDiff, "#.##")) + " | -") + pinescript.strToString(supportPct, "#.##")) + "%)") : "-");
    table.merge_cells(state.dashT, 0, 12, 1, 12);
    pinescript.table.cell(state.dashT, 0, 12, upperStr, ({ text_color: txtVal, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipUpper() }));
    table.merge_cells(state.dashT, 2, 12, 3, 12);
    pinescript.table.cell(state.dashT, 2, 12, lowerStr, ({ text_color: txtVal, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipLower() }));
    let widthStr = (trendValid ? f_fmtPrice(channelWidth) : "-");
    let posStr = (!pinescript.na(channelPos) ? (pinescript.strToString(channelPos, "#.##") + "%") : "-");
    let rrStr = (!pinescript.na(rrRatio) ? ("1:" + pinescript.strToString(rrRatio, "#.##")) : "-");
    let posStatusLoc = ((posStatus === "OVERBOUGHT") ? f_dashOverbought() : ((posStatus === "OVERSOLD") ? f_dashOversold() : f_dashNeutral()));
    let statusCol = ((posStatus === "OVERBOUGHT") ? negCol : ((posStatus === "OVERSOLD") ? posCol : txtLbl));
    pinescript.table.cell(state.dashT, 0, 13, widthStr, ({ text_color: accentCol, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipWidth() }));
    pinescript.table.cell(state.dashT, 1, 13, posStr, ({ text_color: txtVal, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipPosition() }));
    pinescript.table.cell(state.dashT, 2, 13, rrStr, ({ text_color: txtVal, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipRR() }));
    pinescript.table.cell(state.dashT, 3, 13, posStatusLoc, ({ text_color: statusCol, bgcolor: rowBg2, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipStatus() }));
    table.merge_cells(state.dashT, 0, 14, 3, 14);
    pinescript.table.cell(state.dashT, 0, 14, f_dashTrendIntelligence(), ({ text_color: txtHdr, bgcolor: hdrBg, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipQuality(quality, contradictions) }));
    let qualityStr = (pinescript.strToString(quality, "#") + "/100");
    let confidenceLoc = ((confidenceLevel === "HIGH") ? f_dashHigh() : ((confidenceLevel === "MEDIUM") ? f_dashMedium() : f_dashLow()));
    let strengthLoc = ((strengthRating === "VERY STRONG") ? f_dashVeryStrong() : ((strengthRating === "STRONG") ? f_dashStrong() : ((strengthRating === "MODERATE") ? f_dashModerate() : ((strengthRating === "WEAK") ? f_dashWeak() : "-"))));
    let volMomLoc = ((pinescript.strPos(volMom, "INCREASING") >= 0) ? f_dashIncreasing() : f_dashDecreasing());
    pinescript.table.cell(state.dashT, 0, 15, qualityStr, ({ text_color: qualityCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipQuality(quality, contradictions) }));
    pinescript.table.cell(state.dashT, 1, 15, confidenceLoc, ({ text_color: qualityCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipConfidence() }));
    pinescript.table.cell(state.dashT, 2, 15, strengthLoc, ({ text_color: trendAccentCol, bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipStrength() }));
    pinescript.table.cell(state.dashT, 3, 15, volMomLoc, ({ text_color: ((pinescript.strPos(volMom, "INCREASING") >= 0) ? posCol : negCol), bgcolor: rowBg1, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center, tooltip: f_dashTooltipVolMomentum() }));
    if ((i_narrativeEnable && trendValid)) {
      state.g_currentBar = f_analyzeCurrentBar(baseOff, globalAvgRange, cBuy, cSell);
      let blk1 = ((pinescript.arraySize(state.analyticsData) > 0) ? pinescript.arrayGet(state.analyticsData, 0) : f_analyticsEmpty());
      let blk2 = ((pinescript.arraySize(state.analyticsData) > 1) ? pinescript.arrayGet(state.analyticsData, 1) : f_analyticsEmpty());
      state.g_composite = f_analyzeComposite(blk1, blk2);
      state.g_trendContext = f_analyzeTrendContext(state.trendChannels, quality);
      let hasDivergence = (((latestTrend.channelType === DIR_UP) && (trendDelta < 0)) || ((latestTrend.channelType === DIR_DOWN) && (trendDelta > 0)));
      let narrativeParts = f_buildProfessionalNarrativeParts(state.g_currentBar, state.g_composite, state.g_trendContext, latestTrend, trendBuy, trendSell, trendDelta, trendDeltaPct, bodyStatus, upperPinChg, lowerPinChg, volMom, channelPos, posStatus, resistPrice, supportPrice, state.g_levels, contradictions, hasDivergence);
      let narrHdrBg = pinescript.color.new(pinescript.color.rgb(15, 23, 42), 5);
      let narrRowBg = pinescript.color.new(pinescript.color.rgb(30, 41, 59), 10);
      let narrTxtHdr = pinescript.color.rgb(234, 179, 8);
      let narrTxtMain = pinescript.color.rgb(248, 250, 252);
      let narrTxtSub = pinescript.color.rgb(148, 163, 184);
      let narrHeader = f_L("Market Analysis", "Piyasa Analizi", "बाजार विश्लेषण", "تحليل السوق");
      let textAlign = _alignL;
      table.merge_cells(state.dashT, 0, 16, 3, 16);
      pinescript.table.cell(state.dashT, 0, 16, narrHeader, ({ text_color: narrTxtHdr, bgcolor: narrHdrBg, text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center }));
      let wordsPerLine = 18;
      let maxCharsPerLine = 90;
      let firstNarrRow = 17;
      let narrLines = pinescript.arrayNew();
      let partsCount = pinescript.min(5, pinescript.arraySize(narrativeParts));
      if ((partsCount > 0)) {
        for (let pi = 0; pi <= (partsCount - 1); pi++) {
          let wrapped = f_wrapNarrative(pinescript.arrayGet(narrativeParts, pi), wordsPerLine, maxCharsPerLine);
          let wn = pinescript.arraySize(wrapped);
          if ((wn > 0)) {
            for (let wi = 0; wi <= (wn - 1); wi++) {
              pinescript.arrayPush(narrLines, pinescript.arrayGet(wrapped, wi));
            }
          }
        }
      }
      let totalLines = pinescript.arraySize(narrLines);
      let narrativeRowsNeeded = pinescript.min(totalLines, ((DASH_ROWS - firstNarrRow) - (i_narrativeShowDisclaimer ? 3 : 0)));
      if ((narrativeRowsNeeded > 0)) {
        for (let r = 0; r <= (narrativeRowsNeeded - 1); r++) {
          let row = (firstNarrRow + r);
          table.merge_cells(state.dashT, 0, row, 3, row);
          let txt = pinescript.arrayGet(narrLines, r);
          if (((r === (narrativeRowsNeeded - 1)) && (totalLines > narrativeRowsNeeded))) {
            txt += " …";
          }
          pinescript.table.cell(state.dashT, 0, row, txt, ({ text_color: narrTxtMain, bgcolor: narrRowBg, text_size: GLOBAL_TEXT_SIZE, text_halign: textAlign }));
        }
      }
      if (i_narrativeShowDisclaimer) {
        let disclaimerStartRow = (firstNarrRow + narrativeRowsNeeded);
        let disclaimerLine1 = f_L("⚠️ IMPORTANT: This analysis is for educational purposes only", "⚠️ ÖNEMLİ: Bu analiz sadece eğitim amaçlıdır", "⚠️ महत्वपूर्ण: यह विश्लेषण केवल शैक्षिक उद्देश्यों के लिए है", "⚠️ هام: هذا التحليل لأغراض تعليمية فقط");
        let disclaimerLine2 = f_L("and does not constitute investment advice. Always conduct your own research", "ve yatırım tavsiyesi teşkil etmez. Her zaman kendi araştırmanızı yapın", "और निवेश सलाह नहीं है। हमेशा अपना शोध करें", "ولا يُشكّل نصيحة استثمارية. قم دائماً بإجراء بحثك الخاص");
        let disclaimerLine3 = f_L("and consult with a qualified financial advisor before making investment decisions.", "ve yatırım kararları vermeden önce kalifiye bir finansal danışmana danışın.", "और निवेश निर्णय लेने से पहले योग्य वित्तीय सलाहकार से परामर्श करें।", "واستشر مستشاراً مالياً مؤهلاً قبل اتخاذ قرارات الاستثمار.");
        for (let disclaimerLineNum = 0; disclaimerLineNum <= 2; disclaimerLineNum++) {
          let row = (disclaimerStartRow + disclaimerLineNum);
          table.merge_cells(state.dashT, 0, row, 3, row);
          let lineText = ((disclaimerLineNum === 0) ? disclaimerLine1 : ((disclaimerLineNum === 1) ? disclaimerLine2 : disclaimerLine3));
          pinescript.table.cell(state.dashT, 0, row, lineText, ({ text_color: narrTxtSub, bgcolor: pinescript.color.new(pinescript.color.rgb(30, 30, 30), 10), text_size: GLOBAL_TEXT_SIZE, text_halign: pinescript.text.align_center }));
        }
      }
    }
  }
}


// Export for use

export { main
};
