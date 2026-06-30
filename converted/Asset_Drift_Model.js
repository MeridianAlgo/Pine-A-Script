// Auto-generated JavaScript from PineScript source

// Do not edit by hand -- re-run the converter instead


// All the built-in PineScript functions that scripts depend on at runtime

const pinescript = {

  __scalar: function(v) {
    if (v === null || v === undefined) return v;
    if (typeof v === 'object' && typeof v.valueOf === 'function') {
      const s = v.valueOf();
      if (typeof s === 'number' || typeof s === 'boolean' || s === null) return s;
    }
    return v;
  },
  series: function(id, value) {
    const rt = this.__rt || (this.__rt = {});
    const store = rt.series || (rt.series = {});
    let buf = store[id];
    if (!buf) buf = store[id] = [];
    buf[this.__bar | 0] = this.__scalar(value);
    return buf;
  },
  hist: function(id, value, n) {
    const buf = this.series(id, value);
    const idx = (this.__bar | 0) - (n | 0);
    return idx >= 0 && idx < buf.length ? buf[idx] : null;
  },
  time: function(timeframe, session) {
    const t = globalThis.time;
    if (t && typeof t.valueOf === 'function') return t.valueOf();
    return Array.isArray(t) ? t[t.length - 1] : t;
  },
  sign: function(x) {
    if (x === null || x === undefined || (typeof x === 'number' && isNaN(x))) return null;
    return Math.sign(Number(x));
  },
  unpack: function(value, count) {
    if (Array.isArray(value)) return value;
    if (value != null && typeof value[Symbol.iterator] === 'function') return Array.from(value);
    return new Array(count || 0).fill(null);
  },
  __decArr: function(arr) {
    if (!Array.isArray(arr) || arr.__pineDecorated) return arr;
    const self = this;
    const def = (name, fn) => Object.defineProperty(arr, name, { value: fn, writable: true, configurable: true });
    Object.defineProperty(arr, '__pineDecorated', { value: true, configurable: true });
    def('get', (i) => (arr[i] === undefined ? null : arr[i]));
    def('set', (i, v) => { arr[i] = v; return v; });
    def('size', () => arr.length);
    def('clear', () => { arr.length = 0; });
    def('insert', (i, v) => { arr.splice(i, 0, v); });
    def('remove', (i) => arr.splice(i, 1)[0]);
    def('contains', (v) => arr.includes(v));
    def('indexof', (v) => arr.indexOf(v));
    def('lastindexof', (v) => arr.lastIndexOf(v));
    def('first', () => (arr.length ? arr[0] : null));
    def('last', () => (arr.length ? arr[arr.length - 1] : null));
    def('sum', () => arr.reduce((a, b) => a + b, 0));
    def('avg', () => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0));
    def('min', () => (arr.length ? Math.min(...arr) : null));
    def('max', () => (arr.length ? Math.max(...arr) : null));
    def('range', () => (arr.length ? Math.max(...arr) - Math.min(...arr) : null));
    // Statistical methods that route to the array.* built-ins (these names are not
    // native to JS arrays, so attaching them here is safe from recursion).
    def('median', () => self.arrayMedian(arr));
    def('mode', () => self.arrayMode(arr));
    def('stdev', () => self.arrayStdev(arr));
    def('variance', () => self.arrayVariance(arr));
    def('covariance', (other) => self.arrayCovariance(arr, other));
    def('percentile_linear_interpolation', (p) => self.arrayPercentileLinearInterpolation(arr, p));
    def('percentile_nearest_rank', (p) => self.arrayPercentileNearestRank(arr, p));
    def('abs', () => self.__decArr(self.arrayAbs(arr)));
    def('binary_search', (v) => self.arrayBinarySearch(arr, v));
    // Pine's array.sort takes an order string, not a comparator. Use the native
    // sort via .call so we don't recurse through this overridden method.
    def('sort', (order) => { Array.prototype.sort.call(arr, (a, b) => (order === 'descending' ? b - a : a - b)); return arr; });
    def('sort_indices', (order) => self.__decArr(arr.map((_, i) => i).sort((a, b) => (order === 'descending' ? arr[b] - arr[a] : arr[a] - arr[b]))));
    // join/slice/reverse/concat/includes/fill already exist natively on Array with
    // compatible semantics, so we deliberately leave them to the native methods.
    return arr;
  },
  __decMap: function(m) {
    if (!(m instanceof Map) || m.__pineDecorated) return m;
    const def = (name, fn) => Object.defineProperty(m, name, { value: fn, writable: true, configurable: true });
    Object.defineProperty(m, '__pineDecorated', { value: true, configurable: true });
    def('put', (k, v) => { m.set(k, v); return v; });
    def('contains', (k) => m.has(k));
    def('remove', (k) => m.delete(k));
    def('keys', () => Array.from(Map.prototype.keys.call(m)));
    def('values', () => Array.from(Map.prototype.values.call(m)));
    def('size_', () => m.size);
    return m;
  },
  __decMatrix: function(m) {
    if (!m || typeof m !== 'object' || m.__pineDecorated) return m;
    const self = this;
    const def = (name, fn) => Object.defineProperty(m, name, { value: fn, writable: true, configurable: true });
    Object.defineProperty(m, '__pineDecorated', { value: true, configurable: true });
    def('get', (r, c) => self.matrixGet(m, r, c));
    def('set', (r, c, v) => self.matrixSet(m, r, c, v));
    def('rows_', () => m.rows);
    def('columns', () => m.cols);
    def('fill', (v) => self.matrixFill(m, v));
    return m;
  },
  __decDraw: function(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const p = new Proxy(obj, {
      get(t, k) {
        if (k in t || typeof k === 'symbol') return t[k];
        return function() { return p; };
      },
    });
    return p;
  },
  alertcondition: function(condition, ...rest) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.alerts.push({ condition, args: rest });
    }
    return null;
  },
  barcolor: function(color) { return null; },
  plotchar: function(series, ...rest) {
    const rt = globalThis.__pineRuntime;
    if (!rt) return series;
    const bar = rt.__barIndex | 0;
    const ord = (rt.__shapeIdx = (rt.__shapeIdx | 0) + 1) - 1;
    let key = 'char_' + ord;
    for (const r of rest) {
      if (typeof r === 'string') { key = r; break; }
      if (r && typeof r === 'object' && r.title) { key = String(r.title); break; }
    }
    let s = rt.plotshapes[key];
    if (!s) s = rt.plotshapes[key] = { title: key, data: [] };
    s.data[bar] = this.__scalar(series);
    return series;
  },
  plotarrow: function(series, ...rest) {
    const rt = globalThis.__pineRuntime;
    if (!rt) return series;
    const bar = rt.__barIndex | 0;
    const ord = (rt.__plotIdx = (rt.__plotIdx | 0) + 1) - 1;
    const key = 'arrow_' + ord;
    let p = rt.plots[key];
    if (!p) p = rt.plots[key] = { title: key, data: [] };
    p.data[bar] = this.__scalar(series);
    return series;
  },
  bgcolor: function(color, title, editable, showLast) {
    return null;
  },
  fill: function(series1, series2, color, title, editable) {
    return null;
  },
  hline: function(_price, _title, _opts) {
    return null;
  },
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
  swma: function(series) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (series.length < 4) return null;
    const s = series.slice(-4);
    return (s[0] * 1 + s[1] * 2 + s[2] * 2 + s[3] * 1) / 6;
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
  supertrend: function(factor, atrPeriod, high, low, close) {
    if (!Array.isArray(high) || !Array.isArray(low) || !Array.isArray(close)) return [null, null];
    if (high.length < atrPeriod + 1) return [null, null];
    const atrVal = builtins.get('atr')(high, low, close, atrPeriod);
    if (atrVal === null) return [null, null];
    const lastIdx = close.length - 1;
    const hl2 = (high[lastIdx] + low[lastIdx]) / 2;
    const upperBand = hl2 + factor * atrVal;
    const lowerBand = hl2 - factor * atrVal;
    // Determine direction: 1 means downtrend (price below band), -1 means uptrend
    const direction = close[lastIdx] > upperBand ? -1 : close[lastIdx] < lowerBand ? 1 : -1;
    const supertrendValue = direction === -1 ? lowerBand : upperBand;
    return [supertrendValue, direction];
  },
  ta_supertrend: function(factor, atrPeriod) {
    const H = globalThis.high;
    const L = globalThis.low;
    const C = globalThis.close;
    return builtins.get('supertrend')(factor, atrPeriod, H, L, C);
  },
  dmi: function(diLength, adxSmoothing, high, low, close) {
    if (!Array.isArray(high) || !Array.isArray(low) || !Array.isArray(close)) return { plusDI: null, minusDI: null, adx: null };
    if (high.length < diLength + 1) return { plusDI: null, minusDI: null, adx: null };
    let plusDMSum = 0, minusDMSum = 0, trSum = 0;
    for (let i = 1; i <= diLength; i++) {
      const idx = high.length - 1 - diLength + i;
      const upMove = high[idx] - high[idx - 1];
      const downMove = low[idx - 1] - low[idx];
      plusDMSum += (upMove > downMove && upMove > 0) ? upMove : 0;
      minusDMSum += (downMove > upMove && downMove > 0) ? downMove : 0;
      const tr = Math.max(
        high[idx] - low[idx],
        Math.abs(high[idx] - close[idx - 1]),
        Math.abs(low[idx] - close[idx - 1])
      );
      trSum += tr;
    }
    const plusDI = trSum > 0 ? (plusDMSum / trSum) * 100 : 0;
    const minusDI = trSum > 0 ? (minusDMSum / trSum) * 100 : 0;
    const diSum = plusDI + minusDI;
    const dx = diSum > 0 ? Math.abs(plusDI - minusDI) / diSum * 100 : 0;
    return { plusDI, minusDI, adx: dx };
  },
  adx: function(diLength, adxSmoothing, high, low, close) {
    const result = builtins.get('dmi')(diLength, adxSmoothing, high, low, close);
    return result ? result.adx : null;
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
    // Supports both ta.cci(source, length) and ta.cci(high, low, close, length) signatures
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
  median: function(source, length) {
    if (!source || source.length < length) return null;
    const sorted = [...source.slice(-length)].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },
  ta_median: function(source, length) {
    return builtins.get('median')(source, length);
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
  todegrees: function(radians) {
    return radians * (180 / Math.PI);
  },
  toradians: function(degrees) {
    return degrees * (Math.PI / 180);
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
  crossover: function(series1, series2) {
    if (series1 === null || series1 === undefined) return false;
    if (series2 === null || series2 === undefined) return false;
    if (!Array.isArray(series1)) series1 = [series1];
    if (!Array.isArray(series2)) series2 = [series2];
    if (series1.length < 2 || series2.length < 2) return false;
    const i = series1.length - 1;
    return series1[i - 1] < series2[i - 1] && series1[i] >= series2[i];
  },
  crossunder: function(series1, series2) {
    if (series1 === null || series1 === undefined) return false;
    if (series2 === null || series2 === undefined) return false;
    if (!Array.isArray(series1)) series1 = [series1];
    if (!Array.isArray(series2)) series2 = [series2];
    if (series1.length < 2 || series2.length < 2) return false;
    const i = series1.length - 1;
    return series1[i - 1] > series2[i - 1] && series1[i] <= series2[i];
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
    const rt = globalThis.__pineRuntime;
    if (!rt) return series;
    const bar = rt.__barIndex | 0;
    const ord = (rt.__plotIdx = (rt.__plotIdx | 0) + 1) - 1;
    const key = (title && String(title)) || ('plot_' + ord);
    let p = rt.plots[key];
    if (!p) p = rt.plots[key] = { title: key, color, linewidth, data: [] };
    p.data[bar] = this.__scalar(series);
    return series;
  },
  lineNew: function(x1, y1, x2, y2, opts = {}) {
    return this.__decDraw({ x1, y1, x2, y2, opts, _type: 'line' });
  },
  lineDelete: function(l) {
    return null;
  },
  lineSetXY: function(line, point, x, y) {
    if (!line) return null;
    if (point === 0 || point === 'x1') { line.x1 = x; line.y1 = y; }
    else { line.x2 = x; line.y2 = y; }
    return line;
  },
  lineGetX: function(line, point) {
    if (!line) return null;
    return point === 0 || point === 'x1' ? line.x1 : line.x2;
  },
  lineGetY: function(line, point) {
    if (!line) return null;
    return point === 0 || point === 'y1' ? line.y1 : line.y2;
  },
  labelNew: function(x, y, text = '', opts = {}) {
    return this.__decDraw({ x, y, text, opts, _type: 'label' });
  },
  labelDelete: function(l) {
    return null;
  },
  labelSetText: function(label, text) {
    if (!label) return null;
    label.text = text;
    return label;
  },
  labelGetText: function(label) {
    if (!label) return '';
    return label.text || '';
  },
  boxNew: function(left, top, right, bottom, opts = {}) {
    return this.__decDraw({ left, top, right, bottom, opts, _type: 'box' });
  },
  boxDelete: function(box) {
    return null;
  },
  boxSetLeftTop: function(box, left, top) {
    if (!box) return null;
    box.left = left;
    box.top = top;
    return box;
  },
  boxSetRightBottom: function(box, right, bottom) {
    if (!box) return null;
    box.right = right;
    box.bottom = bottom;
    return box;
  },
  polylineNew: function(points, opts = {}) {
    return this.__decDraw({ points: points || [], opts, _type: 'polyline' });
  },
  polylineDelete: function(poly) {
    return null;
  },
  plotshape: function(condition, ...rest) {
    const rt = globalThis.__pineRuntime;
    if (!rt) return condition;
    const bar = rt.__barIndex | 0;
    const ord = (rt.__shapeIdx = (rt.__shapeIdx | 0) + 1) - 1;
    let key = 'shape_' + ord;
    for (const r of rest) {
      if (typeof r === 'string') { key = r; break; }
      if (r && typeof r === 'object' && r.title) { key = String(r.title); break; }
    }
    let s = rt.plotshapes[key];
    if (!s) s = rt.plotshapes[key] = { title: key, data: [] };
    s.data[bar] = !!this.__scalar(condition);
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
  plotbar: function(open, high, low, close, title, color, editable, showLast) {
    return { open, high, low, close };
  },
  plotcandle: function(open, high, low, close, title, color, wickColor, borderColor, editable, showLast) {
    return { open, high, low, close };
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
    return this.__decMap(new Map());
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
    return this.__decMatrix({ rows: r, cols: c, data });
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
  __jacobiEigen: function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    const n = m.rows ?? 0;
    if (n === 0 || n !== (m.cols ?? 0)) return null;
    // Work on a copy so the input matrix is untouched.
    const a = m.data.map(row => row.slice());
    const v = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
    for (let sweep = 0; sweep < 100; sweep++) {
      let off = 0;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] * a[p][q];
      if (off < 1e-20) break;
      for (let p = 0; p < n; p++) {
        for (let q = p + 1; q < n; q++) {
          if (Math.abs(a[p][q]) < 1e-18) continue;
          const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
          const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
          const cos = 1 / Math.sqrt(t * t + 1);
          const sin = t * cos;
          for (let k = 0; k < n; k++) {
            const akp = a[k][p], akq = a[k][q];
            a[k][p] = cos * akp - sin * akq;
            a[k][q] = sin * akp + cos * akq;
          }
          for (let k = 0; k < n; k++) {
            const apk = a[p][k], aqk = a[q][k];
            a[p][k] = cos * apk - sin * aqk;
            a[q][k] = sin * apk + cos * aqk;
          }
          for (let k = 0; k < n; k++) {
            const vkp = v[k][p], vkq = v[k][q];
            v[k][p] = cos * vkp - sin * vkq;
            v[k][q] = sin * vkp + cos * vkq;
          }
        }
      }
    }
    // Sort eigenpairs by eigenvalue, descending.
    const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => a[j][j] - a[i][i]);
    const values = order.map(i => a[i][i]);
    const vectors = Array.from({ length: n }, (_, r) => order.map(c => v[r][c]));
    return { values, vectors };
  },
  matrixEigenvalues: function(m) {
    const e = this.__jacobiEigen(m);
    return this.__decArr(e ? e.values : []);
  },
  matrixEigenvectors: function(m) {
    const e = this.__jacobiEigen(m);
    if (!e) return this.__decMatrix({ rows: 0, cols: 0, data: [] });
    return this.__decMatrix({ rows: e.vectors.length, cols: e.vectors.length, data: e.vectors });
  },
  requestSecurity: function(symbol, timeframe, expression) {
    return expression;
  },
  arrayNew: function(initialSize = 0, initialValue = 0) {
    return this.__decArr(Array(initialSize).fill(initialValue));
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
    if (!arr) return this.__decArr([]);
    const start = Number(startIndex) || 0;
    const end = endIndex === null || endIndex === undefined ? arr.length : Number(endIndex) || 0;
    return this.__decArr(arr.slice(start, end));
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
  arrayLastIndexOf: function(arr, value) {
    return arr ? arr.lastIndexOf(value) : -1;
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
  arrayStdev: function(arr) {
    if (!arr || arr.length === 0) return null;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  },
  arrayVariance: function(arr) {
    if (!arr || arr.length === 0) return null;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  },
  arrayCovariance: function(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length === 0 || arr1.length !== arr2.length) return null;
    const mean1 = arr1.reduce((a, b) => a + b, 0) / arr1.length;
    const mean2 = arr2.reduce((a, b) => a + b, 0) / arr2.length;
    let cov = 0;
    for (let i = 0; i < arr1.length; i++) {
      cov += (arr1[i] - mean1) * (arr2[i] - mean2);
    }
    return cov / arr1.length;
  },
  mode: function(arr) {
    if (!arr || arr.length === 0) return null;
    const counts = new Map();
    let maxCount = 0;
    let modeVal = arr[0];
    for (const val of arr) {
      const c = (counts.get(val) || 0) + 1;
      counts.set(val, c);
      if (c > maxCount) {
        maxCount = c;
        modeVal = val;
      }
    }
    return modeVal;
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
  strFormat: function(formatStr, ...args) {
    if (!formatStr) return '';
    return formatStr.replace(/\{(\d+)\}/g, (match, idx) => {
      const i = parseInt(idx, 10);
      return i < args.length ? String(args[i]) : match;
    });
  },
  input: function(defval, title, tooltip, inline, group) {
    return defval;
  },
  inputInt: function(defval = 0, title, minval, maxval, step, tooltip, inline, group) {
    return defval;
  },
  inputFloat: function(defval = 0.0, title, minval, maxval, step, tooltip, inline, group) {
    return defval;
  },
  inputBool: function(defval = false, title, tooltip, inline, group) {
    return defval;
  },
  inputString: function(defval = '', title, options, tooltip, inline, group) {
    return defval;
  },
  inputSource: function(defval = null, title, tooltip, inline, group) {
    return defval;
  },
  inputColor: function(defval = '#000000', title, tooltip, inline, group) {
    return defval;
  },
  inputTime: function(defval = 0, title, tooltip, inline, group) {
    return defval;
  },
  mathSign: function(value) {
    return Math.sign(value);
  },
  mathAvg: function(...args) {
    const valid = args.filter(v => v !== null && v !== undefined && !isNaN(v));
    return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  },
  mathSum: function(series, length) {
    if (!series || series.length < length) return null;
    return series.slice(-length).reduce((a, b) => a + b, 0);
  },
  mathRandom: function(min = 0, max = 1) {
    return min + Math.random() * (max - min);
  },
  mathTodegrees: function(radians) {
    return radians * (180 / Math.PI);
  },
  mathToradians: function(degrees) {
    return degrees * (Math.PI / 180);
  },
  colorT: function(color, transparency) {
    if (transparency !== undefined) {
      return { color, transparency };
    }
    if (color && typeof color === 'object' && 'transparency' in color) {
      return color.transparency;
    }
    return 0;
  },
  tableCellSetText: function(table, column, row, text) {
    return null;
  },
  tableCellSetBgcolor: function(table, column, row, bgcolor) {
    return null;
  },
  tableMergeCells: function(table, startColumn, startRow, endColumn, endRow) {
    return null;
  },
  tableDelete: function(table) {
    return null;
  },
  tableClear: function(table, startColumn, startRow, endColumn, endRow) {
    return null;
  },
  maxBarsBack: function(series, length) {
    return null;
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
  timenow: 1782783575854,
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
    // Handles both the boolean shorthand ta.tr(true) and explicit high/low/close arguments
    if (typeof high === 'boolean') {
      const H = globalThis.high;
      const L = globalThis.low;
      const C = globalThis.close;
      if (!Array.isArray(H) || !Array.isArray(L) || !Array.isArray(C) || C.length < 2) return null;
      const i = C.length - 1;
      const prevClose = C[i - 1];
      return Math.max(H[i] - L[i], Math.abs(H[i] - prevClose), Math.abs(L[i] - prevClose));
    }

    // When arrays are passed, compute true range from the last bar using the previous close
    if (Array.isArray(close)) {
      const prevClose = close[close.length - 2] || close[0];
      const currHigh = Array.isArray(high) ? high[high.length - 1] : high;
      const currLow = Array.isArray(low) ? low[low.length - 1] : low;
      const currClose = close[close.length - 1];
      return Math.max(currHigh - currLow, Math.abs(currHigh - prevClose), Math.abs(currLow - prevClose));
    }

    return Math.max(high - low, Math.abs(high - close), Math.abs(low - close));
  },
  arrayFirst: function(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[0];
  },
  arrayLast: function(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[arr.length - 1];
  },
  arrayJoin: function(arr, separator = ',') {
    if (!arr) return '';
    return arr.join(separator);
  },
  arrayConcat: function(arr1, arr2) {
    if (!arr1) return arr2 || [];
    if (!arr2) return arr1;
    return this.__decArr(arr1.concat(arr2));
  },
  arrayCopy: function(arr) {
    if (!arr) return this.__decArr([]);
    return this.__decArr([...arr]);
  },
  arrayBinarySearch: function(arr, value) {
    if (!arr || arr.length === 0) return -1;
    let lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid] === value) return mid;
      if (arr[mid] < value) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  },
  arrayRange: function(arr) {
    if (!arr || arr.length === 0) return 0;
    return Math.max(...arr) - Math.min(...arr);
  },
  arrayMedian: function(arr) {
    if (!arr || arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },
  arrayMode: function(arr) {
    if (!arr || arr.length === 0) return null;
    const freq = {};
    let maxCount = 0;
    let mode = arr[0];
    for (const v of arr) {
      freq[v] = (freq[v] || 0) + 1;
      if (freq[v] > maxCount) { maxCount = freq[v]; mode = v; }
    }
    return mode;
  },
  arrayPercentile: function(arr, percentile) {
    if (!arr || arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = (percentile / 100) * (sorted.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  },
  arrayPercentileLinearInterpolation: function(arr, percentile) {
    return builtins.get('arrayPercentile')(arr, percentile);
  },
  arrayPercentileNearestRank: function(arr, percentile) {
    if (!arr || arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)];
  },
  arrayAbs: function(arr) {
    if (!arr) return [];
    return arr.map(v => Math.abs(v));
  },
  arrayEvery: function(arr, callback) {
    if (!arr) return false;
    return arr.every(callback);
  },
  arraySome: function(arr, callback) {
    if (!arr) return false;
    return arr.some(callback);
  },
  requestFinancial: function() {
    return null;
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

  from: (...items) => pinescript.__decArr(items),

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


function __pineNS(real) {

  const base = real || {};

  return new Proxy(base, {

    get(target, key) {

      if (key in target) return target[key];

      if (typeof key === "symbol") return target[key];

      // Unknown member: usable as a value (null), a constant, or a no-op function.

      const noop = function() { return null; };

      noop.toString = () => "";

      return noop;

    }

  });

}

globalThis.ta = globalThis.ta || __pineNS({});

globalThis.math = globalThis.math || __pineNS({ pi: Math.PI, e: Math.E, phi: 1.618033988749895, rphi: 0.618033988749895 });

globalThis.chart = globalThis.chart || __pineNS({ point: __pineNS({}), bg_color: null, fg_color: null });

globalThis.line = globalThis.line || __pineNS({ style_solid: "solid", style_dashed: "dashed", style_dotted: "dotted" });

globalThis.box = globalThis.box || __pineNS({});

globalThis.color = globalThis.color || __pineNS(Object.assign(function(c) { return c; }, { new: function(c, t) { return c; }, rgb: function(r, g, b, t) { return "#rgb(" + [r, g, b].join(",") + ")"; }, from_gradient: function(v, lo, hi, c1, c2) { return c1; }, r: function() { return 0; }, g: function() { return 0; }, b: function() { return 0; }, t: function() { return 0; }, aqua: "#00BCD4", black: "#363A45", blue: "#2962FF", fuchsia: "#E040FB", gray: "#787B86", green: "#4CAF50", lime: "#00E676", maroon: "#880E4F", navy: "#311B92", olive: "#808000", orange: "#FF9800", purple: "#9C27B0", red: "#FF5252", silver: "#B2B5BE", teal: "#00897B", white: "#FFFFFF", yellow: "#FFEB3B" }));

globalThis.label = globalThis.label || __pineNS({ style_label_down: "label_down", style_label_up: "label_up", style_none: "none" });

globalThis.polyline = globalThis.polyline || __pineNS({});

globalThis.linefill = globalThis.linefill || __pineNS({});

globalThis.matrix = globalThis.matrix || __pineNS({});

globalThis.map = globalThis.map || __pineNS({});

globalThis.session = globalThis.session || __pineNS({ regular: "regular", extended: "extended" });

globalThis.ticker = globalThis.ticker || __pineNS({});

globalThis.dayofweek = globalThis.dayofweek || __pineNS(Object.assign(function(t) { return new Date(t != null ? t : (globalThis.time || 0)).getUTCDay() + 1; }, { sunday: 1, monday: 2, tuesday: 3, wednesday: 4, thursday: 5, friday: 6, saturday: 7 }));

globalThis.timeframe = __pineNS(Object.assign(globalThis.timeframe || {}, { period: (globalThis.timeframe && globalThis.timeframe.period) || "D", isintraday: false, isdaily: true, multiplier: 1 }));

globalThis.request = __pineNS(globalThis.request || {});

globalThis.input = __pineNS(globalThis.input || {});

globalThis.adjustment = globalThis.adjustment || __pineNS({});

globalThis.earnings = globalThis.earnings || __pineNS({});

globalThis.dividends = globalThis.dividends || __pineNS({});

globalThis.splits = globalThis.splits || __pineNS({});

globalThis.currency = globalThis.currency || __pineNS({});

globalThis.display = globalThis.display || __pineNS({ none: "none", all: "all", pane: "pane", data_window: "data_window", status_line: "status_line", price_scale: "price_scale" });

globalThis.format = globalThis.format || __pineNS({ price: "price", volume: "volume", percent: "percent", mintick: "mintick", inherit: "inherit" });

globalThis.scale = globalThis.scale || __pineNS({ left: "left", right: "right", none: "none" });

globalThis.font = globalThis.font || __pineNS({ family_default: "default", family_monospace: "monospace" });

globalThis.xloc = globalThis.xloc || __pineNS({ bar_index: "bar_index", bar_time: "bar_time" });

globalThis.yloc = globalThis.yloc || __pineNS({ price: "price", abovebar: "abovebar", belowbar: "belowbar" });

globalThis.extend = globalThis.extend || __pineNS({ none: "none", left: "left", right: "right", both: "both" });

globalThis.order = globalThis.order || __pineNS({ ascending: "ascending", descending: "descending" });

globalThis.alert = globalThis.alert || Object.assign(function() { return null; }, { freq_once_per_bar: "once_per_bar", freq_once_per_bar_close: "once_per_bar_close", freq_all: "all" });

globalThis.dayofmonth = globalThis.dayofmonth || function(t) { return new Date(t || 0).getUTCDate(); };

globalThis.plot = globalThis.plot || __pineNS({ style_line: "line", style_linebr: "linebr", style_stepline: "stepline", style_histogram: "histogram", style_cross: "cross", style_area: "area", style_areabr: "areabr", style_columns: "columns", style_circles: "circles" });

globalThis.int = globalThis.int || function(x) { return x == null ? null : Math.trunc(Number(x)); };

globalThis.float = globalThis.float || function(x) { return x == null ? null : Number(x); };

globalThis.bool = globalThis.bool || function(x) { return Boolean(x); };

globalThis.string = globalThis.string || function(x) { return x == null ? null : String(x); };

globalThis.str = globalThis.str || __pineNS({});

pinescript.math = globalThis.math;

pinescript.ta = globalThis.ta;

pinescript.str = globalThis.str;

pinescript.array = __pineNS(globalThis.array);


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

  new: function(position, columns, rows, opts) { return pinescript.__decDraw({ position, columns, rows, opts: opts || {}, cells: [] }); },

  cell: function(table, column, row, text, opts) {

    if (!table) return null;

    table.cells.push({ column, row, text, opts: opts || {} });

    return null;

  }

};


// Script input parameters and their defaults


// The transpiled script logic, called once per bar

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
  var HORIZON = 60;
  var SAMPLE_TOTAL = 756;
  var MIN_OBS_STRICT = 10;
  var MIN_OBS_ROBUST = 20;
  var T_CRIT_95 = 2;
  var T_CRIT_90 = 1.65;
  var MIN_DRIFT_ECON = 0.03;
  var MAX_DEV_SD = 1.5;
  var SIGN_Z_CRIT = 1.65;
  var ANN_FACTOR = (252 / HORIZON);
  var i_bgMode = pinescript.inputString("On", "Background", ({ options: ["Off", "On"], group: "Display", tooltip: "Background color based on drift classification" }));
  var i_bgInt = pinescript.inputInt(75, "BG Intensity", ({ minval: 70, maxval: 95, group: "Display", tooltip: "Transparency of background color" }));
  var i_barColor = pinescript.inputBool(true, "Bar Coloring", ({ group: "Display", tooltip: "Color bars based on drift direction" }));
  var i_showDash = pinescript.inputBool(true, "Dashboard", ({ group: "Dashboard", tooltip: "Show statistical details panel" }));
  var i_dashPos = pinescript.inputString("Top Right", "Position", ({ options: ["Top Right", "Top Left", "Bottom Right", "Bottom Left"], group: "Dashboard" }));
  var i_dashSize = pinescript.inputString("Small", "Size", ({ options: ["Tiny", "Small", "Normal"], group: "Dashboard", tooltip: "Text size of dashboard" }));
  var i_showWM = pinescript.inputBool(true, "Watermark", ({ group: "Watermark", tooltip: "Show ticker and classification summary" }));
  var i_wmPos = pinescript.inputString("Bottom Right", "Position", ({ options: ["Top Right", "Top Left", "Bottom Right", "Bottom Left"], group: "Watermark" }));
  var i_wmSize = pinescript.inputString("Normal", "Size", ({ options: ["Small", "Normal", "Large"], group: "Watermark", tooltip: "Text size of watermark" }));
  var i_dark = pinescript.inputBool(true, "Dark Mode", ({ group: "Style", tooltip: "Optimize colors for dark charts" }));
  var i_alerts = pinescript.inputBool(false, "Alerts", ({ group: "Alerts", tooltip: "Trigger alerts on classification changes" }));
  var cBull = (i_dark ? pinescript.color.hex("#22c55e") : pinescript.color.hex("#16a34a"));
  var cBear = (i_dark ? pinescript.color.hex("#ef4444") : pinescript.color.hex("#dc2626"));
  var cWeak = (i_dark ? pinescript.color.hex("#f59e0b") : pinescript.color.hex("#d97706"));
  var cNeut = (i_dark ? pinescript.color.hex("#737373") : pinescript.color.hex("#525252"));
  var cPrim = (i_dark ? pinescript.color.hex("#3b82f6") : pinescript.color.hex("#2563eb"));
  var cText = (i_dark ? pinescript.color.hex("#fafafa") : pinescript.color.hex("#0a0a0a"));
  var cTblBg = (i_dark ? pinescript.color.hex("#171717") : pinescript.color.hex("#f5f5f5"));
  var cHdrBg = (i_dark ? pinescript.color.hex("#262626") : pinescript.color.hex("#e5e5e5"));
  function f_pos(p) {
    return ((p === "Top Right") ? pinescript.position.top_right : ((p === "Top Left") ? pinescript.position.top_left : ((p === "Bottom Right") ? pinescript.position.bottom_right : pinescript.position.bottom_left)));
  }
  function f_size(s) {
    return ((s === "Tiny") ? pinescript.size.tiny : ((s === "Small") ? pinescript.size.small : ((s === "Normal") ? pinescript.size.normal : ((s === "Large") ? pinescript.size.large : pinescript.size.small))));
  }
  var dashSizeH = f_size(((i_dashSize === "Tiny") ? "Small" : i_dashSize));
  var dashSizeD = f_size(i_dashSize);
  var dashSizeF = f_size(((i_dashSize === "Normal") ? "Small" : "Tiny"));
  var wmSizeT = f_size(((i_wmSize === "Small") ? "Normal" : ((i_wmSize === "Normal") ? "Large" : "Large")));
  var wmSizeM = f_size(i_wmSize);
  var wmSizeS = f_size(((i_wmSize === "Large") ? "Small" : "Tiny"));
  function f_median(arr) {
    var n = pinescript.arraySize(arr);
    if ((n === 0)) {
      return 0;
    } else {
      var s = pinescript.arrayCopy(arr);
      pinescript.arraySort(s);
      var m = (n / 2);
      return (((n % 2) === 0) ? ((pinescript.arrayGet(s, (m - 1)) + pinescript.arrayGet(s, m)) / 2) : pinescript.arrayGet(s, m));
    }
  }
  function f_collectAllReturns(src, horizon, maxBars) {
    if (state.arr === undefined) state.arr = pinescript.arrayNew(0);
    pinescript.arrayClear(state.arr);
    var nPeriods = pinescript.floor((maxBars / horizon));
    for (let i = 0; i <= (nPeriods - 1); i++) {
      var recentBar = (i * horizon);
      var pastBar = ((i + 1) * horizon);
      if ((pastBar <= maxBars)) {
        var pRecent = pinescript.nz(pinescript.hist(0, src, recentBar), src);
        var pPast = pinescript.nz(pinescript.hist(1, src, pastBar), src);
        if (((pPast > 0) && (pRecent > 0))) {
          pinescript.arrayPush(state.arr, pinescript.log((pRecent / pPast)));
        }
      }
    }
    return state.arr;
  }
  function f_arrayStats(arr) {
    var n = pinescript.arraySize(state.arr);
    if ((n < 3)) {
      return [0, 0, 0, 0, 0];
    } else {
      var mean = pinescript.arrayAvg(state.arr);
      var med = f_median(state.arr);
      var sumSq = 0;
      var posCount = 0;
      for (let i = 0; i <= (n - 1); i++) {
        var v = pinescript.arrayGet(state.arr, i);
        sumSq += ((v - mean) * (v - mean));
        if ((v > 0)) {
          posCount += 1;
        }
      }
      var sd = pinescript.sqrt((sumSq / (n - 1)));
      return [mean, med, sd, n, posCount];
    }
  }
  function f_hacSE(arr, mean) {
    var n = pinescript.arraySize(state.arr);
    if ((n < 3)) {
      return 0;
    } else {
      var g0 = 0;
      for (let i = 0; i <= (n - 1); i++) {
        var d = (pinescript.arrayGet(state.arr, i) - mean);
        g0 += (d * d);
      }
      g0 = (g0 / n);
      var g1 = 0;
      for (let i = 1; i <= (n - 1); i++) {
        var di = (pinescript.arrayGet(state.arr, i) - mean);
        var dj = (pinescript.arrayGet(state.arr, (i - 1)) - mean);
        g1 += (di * dj);
      }
      g1 = (g1 / n);
      var hV = (g0 + g1);
      return pinescript.sqrt(pinescript.max((hV / n), 1e-14));
    }
  }
  function f_splitArray(arr, isFirstHalf) {
    var n = pinescript.arraySize(state.arr);
    if (state.result === undefined) state.result = pinescript.arrayNew(0);
    pinescript.arrayClear(state.result);
    if ((n < 2)) {
      return state.result;
    } else {
      var halfN = pinescript.floor((n / 2));
      if (isFirstHalf) {
        for (let i = 0; i <= (halfN - 1); i++) {
          pinescript.arrayPush(state.result, pinescript.arrayGet(state.arr, i));
        }
      } else {
        for (let i = halfN; i <= (n - 1); i++) {
          pinescript.arrayPush(state.result, pinescript.arrayGet(state.arr, i));
        }
      }
      return state.result;
    }
  }
  function f_vrTest(src, horizon, k, sampleBars) {
    var arr1 = f_collectAllReturns(src, horizon, sampleBars);
    var arrK = f_collectAllReturns(src, (horizon * k), sampleBars);
    var [m1, md1, sd1, n1, pc1] = pinescript.unpack(f_arrayStats(arr1), 5);
    var [mK, mdK, sdK, nK, pcK] = pinescript.unpack(f_arrayStats(arrK), 5);
    if ((((sd1 < 1e-10) || (n1 < MIN_OBS_STRICT)) || (nK < 3))) {
      return [1, 0, false];
    } else {
      var var1 = (sd1 * sd1);
      var varK = (sdK * sdK);
      var vr = (varK / (k * var1));
      var vrSE = pinescript.sqrt((((2 * ((2 * k) - 1)) * (k - 1)) / ((3 * k) * nK)));
      var zVR = ((vrSE > 1e-10) ? (pinescript.abs((vr - 1)) / vrSE) : 0);
      var vrSig = (zVR > T_CRIT_90);
      return [vr, zVR, vrSig];
    }
  }
  function f_mde(sd, n, tCrit) {
    return (((n < MIN_OBS_STRICT) || (sd <= 0)) ? null : (((sd / pinescript.sqrt(n)) * tCrit) * ANN_FACTOR));
  }
  function f_signTestZ(posCount, n) {
    return ((n < MIN_OBS_STRICT) ? 0 : ((float(posCount) - (float(n) / 2)) / pinescript.sqrt((float(n) / 4))));
  }
  var allReturns = f_collectAllReturns(close, HORIZON, SAMPLE_TOTAL);
  var [mF, mdF, sdF, nF, pcF] = pinescript.unpack(f_arrayStats(allReturns), 5);
  var seF = f_hacSE(allReturns, mF);
  var tF = ((seF > 1e-10) ? (mF / seF) : 0);
  var arr1 = f_splitArray(allReturns, true);
  var arr2 = f_splitArray(allReturns, false);
  var [m1, md1, sd1, n1, pc1] = pinescript.unpack(f_arrayStats(arr1), 5);
  var se1 = f_hacSE(arr1, m1);
  var t1 = ((se1 > 1e-10) ? (m1 / se1) : 0);
  var [m2, md2, sd2, n2, pc2] = pinescript.unpack(f_arrayStats(arr2), 5);
  var se2 = f_hacSE(arr2, m2);
  var t2 = ((se2 > 1e-10) ? (m2 / se2) : 0);
  var [vr, zVR, vrSig] = pinescript.unpack(f_vrTest(close, HORIZON, 5, SAMPLE_TOTAL), 3);
  var mde95 = f_mde(sdF, nF, T_CRIT_95);
  var annDrift = (mF * ANN_FACTOR);
  var zSign = f_signTestZ(pcF, nF);
  var hitRate = ((nF > 0) ? (float(pcF) / float(nF)) : 0.5);
  var inferenceAllowed = (((nF >= MIN_OBS_STRICT) && (n1 >= pinescript.floor((MIN_OBS_STRICT / 2)))) && (n2 >= pinescript.floor((MIN_OBS_STRICT / 2))));
  var isRobust = (nF >= MIN_OBS_ROBUST);
  var statSig = (inferenceAllowed && (pinescript.abs(tF) > T_CRIT_95));
  var econSig = (inferenceAllowed && (pinescript.abs(annDrift) >= MIN_DRIFT_ECON));
  var powerOK = (inferenceAllowed && (pinescript.na(mde95) ? false : (pinescript.abs(annDrift) >= mde95)));
  var medianSig = (inferenceAllowed && (pinescript.abs(zSign) > SIGN_Z_CRIT));
  var medianDir = ((zSign > 0) ? 1 : ((zSign < 0) ? -1 : 0));
  var meanDir = ((mF > 0) ? 1 : ((mF < 0) ? -1 : 0));
  var signTestOK = (inferenceAllowed && (!medianSig || (medianDir === meanDir)));
  var meanMedOK = (inferenceAllowed && ((((mF > 0) && (mdF > 0)) || ((mF < 0) && (mdF < 0))) || (pinescript.abs(mF) < 1e-10)));
  var sameSignMean = (((m1 > 0) && (m2 > 0)) || ((m1 < 0) && (m2 < 0)));
  var pooledSD = pinescript.sqrt((((sd1 * sd1) + (sd2 * sd2)) / 2));
  var levelDevSD = ((pooledSD > 1e-10) ? (pinescript.abs((m1 - m2)) / pooledSD) : 0);
  var levelOK = (levelDevSD <= MAX_DEV_SD);
  var sameSignT = ((((t1 > 0) && (t2 > 0)) && (tF > 0)) || (((t1 < 0) && (t2 < 0)) && (tF < 0)));
  var structOK = (((inferenceAllowed && sameSignMean) && levelOK) && sameSignT);
  var isMeanRev = ((vr < 1) && vrSig);
  var vrOK = (inferenceAllowed && !isMeanRev);
  var direction = ((mF > 0) ? 1 : ((mF < 0) ? -1 : 0));
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
  var strongEvidence = (state.classCode === 2);
  var weakEvidence = (state.classCode === 1);
  var classification = ((state.classCode === 2) ? (direction * 2) : ((state.classCode === 1) ? direction : 0));
  var evidenceStr = (strongEvidence ? "STRONG" : (weakEvidence ? "WEAK" : "NONE"));
  var biasStr = ((classification === 2) ? "Positive Drift" : ((classification === -2) ? "Negative Drift" : ((classification === 1) ? "Positive (weak)" : ((classification === -1) ? "Negative (weak)" : "No Drift"))));
  var regimeStr = (isMeanRev ? "Mean-Rev" : "Neutral");
  var bgClr = null;
  if ((i_bgMode === "On")) {
    bgClr = ((classification >= 2) ? cBull : ((classification <= -2) ? cBear : ((pinescript.abs(classification) === 1) ? cWeak : null)));
  }
  pinescript.bgcolor(((i_bgMode === "On") ? pinescript.color.new(bgClr, i_bgInt) : null));
  var cBarLong = pinescript.color.hex("#22c55e");
  var cBarShort = pinescript.color.hex("#ef4444");
  var cBarNeut = pinescript.color.hex("#a3a3a3");
  var barClr = null;
  if (i_barColor) {
    barClr = ((classification >= 2) ? cBarLong : ((classification <= -2) ? cBarShort : ((pinescript.abs(classification) === 1) ? ((direction > 0) ? cBarLong : cBarShort) : cBarNeut)));
  }
  pinescript.barcolor(barClr);
  if (state.wm === undefined) state.wm = pinescript.table.new(f_pos(i_wmPos), 1, 5, ({ bgcolor: pinescript.color.new(pinescript.color.black, 100) }));
  if ((i_showWM && barstate.islast)) {
    var evClr = (!inferenceAllowed ? cNeut : (strongEvidence ? cBull : (weakEvidence ? cWeak : cNeut)));
    var wmClr = pinescript.color.new((i_dark ? pinescript.color.white : pinescript.color.black), 30);
    pinescript.table.cell(state.wm, 0, 0, syminfo.ticker, ({ text_color: wmClr, text_size: wmSizeT, text_halign: pinescript.text.align_right }));
    pinescript.table.cell(state.wm, 0, 1, (((inferenceAllowed ? ("t=" + pinescript.strToString(tF, "#.##")) : ("n<" + pinescript.strToString(MIN_OBS_STRICT))) + " | n=") + pinescript.strToString(nF)), ({ text_color: wmClr, text_size: wmSizeS, text_halign: pinescript.text.align_right }));
    pinescript.table.cell(state.wm, 0, 2, (evidenceStr + ((state.classReason !== "") ? ((" (" + state.classReason) + ")") : "")), ({ text_color: evClr, text_size: wmSizeM, text_halign: pinescript.text.align_right }));
    pinescript.table.cell(state.wm, 0, 3, biasStr, ({ text_color: evClr, text_size: wmSizeM, text_halign: pinescript.text.align_right }));
    pinescript.table.cell(state.wm, 0, 4, (isRobust ? "" : "Heuristic (n<20)"), ({ text_color: pinescript.color.new(cWeak, 30), text_size: wmSizeS, text_halign: pinescript.text.align_right }));
  }
  if ((i_showDash && barstate.islast)) {
    if (state.d === undefined) state.d = pinescript.table.new(f_pos(i_dashPos), 2, 18, ({ border_width: 1, bgcolor: pinescript.color.new(cTblBg, 80) }));
    var hB = pinescript.color.new(cHdrBg, 20);
    evClr = (!inferenceAllowed ? cNeut : (strongEvidence ? cBull : (weakEvidence ? cWeak : cNeut)));
    pinescript.table.cell(state.d, 0, 0, "ADM", ({ text_color: cText, bgcolor: hB, text_size: dashSizeH }));
    pinescript.table.cell(state.d, 1, 0, "Retrospective", ({ text_color: pinescript.color.new(cText, 50), bgcolor: hB, text_size: dashSizeF }));
    pinescript.table.cell(state.d, 0, 1, "Classification", ({ text_color: cText, bgcolor: pinescript.color.new(evClr, 80), text_size: dashSizeH }));
    pinescript.table.cell(state.d, 1, 1, biasStr, ({ text_color: evClr, bgcolor: pinescript.color.new(evClr, 80), text_size: dashSizeH }));
    pinescript.table.cell(state.d, 0, 2, "Evidence", ({ text_color: cText, bgcolor: pinescript.color.new(evClr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 2, (evidenceStr + ((state.classReason !== "") ? ((" (" + state.classReason) + ")") : "")), ({ text_color: evClr, bgcolor: pinescript.color.new(evClr, 90), text_size: dashSizeD }));
    var infClr = (inferenceAllowed ? cBull : cBear);
    pinescript.table.cell(state.d, 0, 3, "Inference", ({ text_color: cText, bgcolor: pinescript.color.new(infClr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 3, (inferenceAllowed ? (isRobust ? "Allowed" : "Heuristic") : "Blocked"), ({ text_color: infClr, bgcolor: pinescript.color.new(infClr, 90), text_size: dashSizeD }));
    var tClr = (statSig ? cBull : cNeut);
    pinescript.table.cell(state.d, 0, 4, ("t(full) n=" + pinescript.strToString(nF)), ({ text_color: cText, bgcolor: pinescript.color.new(tClr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 4, (pinescript.strToString(tF, "#.##") + (statSig ? "**" : "")), ({ text_color: tClr, bgcolor: pinescript.color.new(tClr, 90), text_size: dashSizeD }));
    var t1Clr = ((t1 > 0) ? cBull : cBear);
    pinescript.table.cell(state.d, 0, 5, ("t(H1) n=" + pinescript.strToString(n1)), ({ text_color: cText, bgcolor: pinescript.color.new(t1Clr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 5, pinescript.strToString(t1, "#.##"), ({ text_color: t1Clr, bgcolor: pinescript.color.new(t1Clr, 90), text_size: dashSizeD }));
    var t2Clr = ((t2 > 0) ? cBull : cBear);
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
    var dClr = ((annDrift > 0) ? cBull : cBear);
    pinescript.table.cell(state.d, 0, 14, "Drift (ann.)", ({ text_color: cText, bgcolor: pinescript.color.new(dClr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 14, (pinescript.strToString((annDrift * 100), "#.#") + "%"), ({ text_color: dClr, bgcolor: pinescript.color.new(dClr, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 15, "Regime", ({ text_color: cText, bgcolor: pinescript.color.new(cPrim, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 1, 15, regimeStr, ({ text_color: cPrim, bgcolor: pinescript.color.new(cPrim, 90), text_size: dashSizeD }));
    pinescript.table.cell(state.d, 0, 16, ("H=" + pinescript.strToString(HORIZON)), ({ text_color: pinescript.color.new(cText, 50), bgcolor: pinescript.color.new(cNeut, 95), text_size: dashSizeF }));
    pinescript.table.cell(state.d, 1, 16, ("MinN=" + pinescript.strToString(MIN_OBS_STRICT)), ({ text_color: pinescript.color.new(cText, 50), bgcolor: pinescript.color.new(cNeut, 95), text_size: dashSizeF }));
    pinescript.table.cell(state.d, 0, 17, "**p<.05 *p<.10", ({ text_color: pinescript.color.new(cText, 50), bgcolor: pinescript.color.new(cNeut, 95), text_size: dashSizeF }));
    pinescript.table.cell(state.d, 1, 17, (isRobust ? "" : "Heuristic"), ({ text_color: pinescript.color.new(cWeak, 30), bgcolor: pinescript.color.new(cNeut, 95), text_size: dashSizeF }));
  }
  var changed = (classification !== pinescript.hist(2, classification, 1));
  if ((changed && i_alerts)) {
    pinescript.alert((((("ADM: " + biasStr) + " (") + evidenceStr) + ")"), alert.freq_once_per_bar);
  }
  pinescript.alertcondition((strongEvidence && (direction > 0)), "Positive Drift", "Positive Drift detected");
  pinescript.alertcondition((strongEvidence && (direction < 0)), "Negative Drift", "Negative Drift detected");
  pinescript.alertcondition(weakEvidence, "Weak", "Weak evidence");
  pinescript.alertcondition(!inferenceAllowed, "Blocked", "Inference blocked");
}



// The bar-by-bar engine: runs main() once per bar over the dataset.
function run(data, options = {}) {
  data = data || {};
  const inClose = (data.close || []).map(Number);
  const n = inClose.length;
  const inOpen = (data.open || inClose).map(Number);
  const inHigh = (data.high || inClose).map(Number);
  const inLow = (data.low || inClose).map(Number);
  const inVol = (data.volume || new Array(n).fill(0)).map(Number);
  const inTime = (data.time || inClose.map((_, i) => i)).map(Number);

  // Reset all persistent and per-run state so repeated runs are independent.
  globalThis.__pineState = {};
  globalThis.__pineRuntime = { plots: {}, plotshapes: {}, alerts: [], bars: n, inputs: options.inputs || {} };
  pinescript.__rt = {};
  pinescript.__bar = 0;

  // Growing OHLCV windows: each is a SeriesArray that gains one element per bar,
  // so window built-ins like sma and highest see history up to the current bar.
  const O = pinescript.asSeries([]), H = pinescript.asSeries([]), L = pinescript.asSeries([]);
  const C = pinescript.asSeries([]), V = pinescript.asSeries([]), T = pinescript.asSeries([]);
  const HL2 = pinescript.asSeries([]), HLC3 = pinescript.asSeries([]), OHLC4 = pinescript.asSeries([]);
  globalThis.open = O; globalThis.high = H; globalThis.low = L; globalThis.close = C;
  globalThis.volume = V; globalThis.time = T;
  globalThis.hl2 = HL2; globalThis.hlc3 = HLC3; globalThis.ohlc4 = OHLC4;
  globalThis.syminfo = globalThis.syminfo || { tickerid: 'SYNTHETIC', ticker: 'SYNTHETIC', mintick: 0.01 };

  const rt = globalThis.__pineRuntime;
  for (let i = 0; i < n; i++) {
    O.push(inOpen[i]); H.push(inHigh[i]); L.push(inLow[i]); C.push(inClose[i]); V.push(inVol[i]); T.push(inTime[i]);
    HL2.push((inHigh[i] + inLow[i]) / 2);
    HLC3.push((inHigh[i] + inLow[i] + inClose[i]) / 3);
    OHLC4.push((inOpen[i] + inHigh[i] + inLow[i] + inClose[i]) / 4);

    pinescript.__bar = i;
    rt.__barIndex = i;
    rt.__plotIdx = 0;
    rt.__shapeIdx = 0;
    globalThis.bar_index = i;
    globalThis.last_bar_index = n - 1;
    globalThis.time_tradingday = inTime[i];
    globalThis.time_close = inTime[i];
    globalThis.last_bar_time = inTime[n - 1];
    globalThis.timenow = inTime[n - 1];
    globalThis.barstate = {
      isfirst: i === 0, islast: i === n - 1, isrealtime: false, ishistory: true,
      isconfirmed: true, isnew: true, islastconfirmedhistory: i === n - 1,
    };

    main();
  }

  // Backfill skipped bars so every output series has exactly n entries.
  for (const k of Object.keys(rt.plots)) {
    const d = rt.plots[k].data;
    for (let i = 0; i < n; i++) if (d[i] === undefined) d[i] = null;
  }
  for (const k of Object.keys(rt.plotshapes)) {
    const d = rt.plotshapes[k].data;
    for (let i = 0; i < n; i++) if (d[i] === undefined) d[i] = false;
  }
  return rt;
}


export { main, run
};
