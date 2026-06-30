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
  timenow: 1782783576913,
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

const LTFCandles = { new: function(bodies, wicks_high, wicks_low, opens, highs, lows, closes) { return { bodies: bodies, wicks_high: wicks_high, wicks_low: wicks_low, opens: opens, highs: highs, lows: lows, closes: closes }; } };

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
  // Study: 
  // Options: {"title":"NY Opening Range (Enhanced with LTF)","shorttitle":"NY ORB","overlay":true,"max_lines_count":500,"max_labels_count":500,"max_boxes_count":500,"max_bars_back":5000}
  if (state.g_5MIN === undefined) state.g_5MIN = "━━━━━━━━━ 5-MINUTE ORB ━━━━━━━━━";
  var show_5min = pinescript.inputBool(true, "Show 5-Minute ORB", ({ group: state.g_5MIN }));
  var bullish_color_5m = pinescript.inputColor(pinescript.color.rgb(0, 255, 149), "Bullish Color", ({ inline: "5mc", group: state.g_5MIN }));
  var bearish_color_5m = pinescript.inputColor(pinescript.color.rgb(195, 0, 255), "Bearish Color", ({ inline: "5mc", group: state.g_5MIN }));
  var bullish_fill_5m = pinescript.inputColor(pinescript.color.rgb(0, 255, 149, 85), "Bullish Fill", ({ inline: "5mf", group: state.g_5MIN }));
  var bearish_fill_5m = pinescript.inputColor(pinescript.color.rgb(195, 0, 255, 85), "Bearish Fill", ({ inline: "5mf", group: state.g_5MIN }));
  var boxStyle_5m = pinescript.inputString("Solid", "Range Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "5box", group: state.g_5MIN }));
  var borderWidth_5m = pinescript.inputInt(1, "Width", 1, 10, ({ inline: "5box", group: state.g_5MIN }));
  var show_midLine_5m = pinescript.inputBool(true, "Show Midline", ({ inline: "5mid", group: state.g_5MIN }));
  var lineStyle_5m = pinescript.inputString("Dashed", "Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "5mid", group: state.g_5MIN }));
  var lineWidth_5m = pinescript.inputInt(1, "Width", 1, 10, ({ inline: "5mid", group: state.g_5MIN }));
  var show_extensions_5m = pinescript.inputBool(true, "Show Median Extensions", ({ inline: "5ext", group: state.g_5MIN }));
  var ext_line_style_5m = pinescript.inputString("Dotted", "Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "5ext", group: state.g_5MIN }));
  var ext_line_width_5m = pinescript.inputInt(1, "Width", ({ minval: 1, maxval: 5, inline: "5ext", group: state.g_5MIN }));
  var show_ext_labels_5m = pinescript.inputBool(true, "Show Extension Labels", ({ group: state.g_5MIN }));
  var show_ltf_5m = pinescript.inputBool(true, "Show LTF Candles", ({ group: state.g_5MIN }));
  var ltf_5m_count = pinescript.inputInt(5, "  └─ Number of Candles", ({ minval: 1, maxval: 20, group: state.g_5MIN }));
  var ltf_offset_5m = pinescript.inputInt(5, "  └─ Offset (bars from right)", ({ minval: 1, maxval: 100, group: state.g_5MIN }));
  var ltf_spacing_5m = pinescript.inputInt(3, "  └─ Candle Spacing", ({ minval: 1, maxval: 5, group: state.g_5MIN }));
  var ltf_width_5m = pinescript.inputInt(2, "  └─ Candle Width", ({ minval: 1, maxval: 5, group: state.g_5MIN }));
  var ltf_bull_color_5m = pinescript.inputColor(pinescript.color.rgb(0, 255, 149, 60), "  └─ LTF Bullish Color", ({ group: state.g_5MIN }));
  var ltf_bear_color_5m = pinescript.inputColor(pinescript.color.rgb(195, 0, 255, 60), "  └─ LTF Bearish Color", ({ group: state.g_5MIN }));
  var show_ltf_range_5m = pinescript.inputBool(true, "  └─ Show LTF High/Low Lines", ({ group: state.g_5MIN }));
  var ltf_range_style_5m = pinescript.inputString("Dotted", "  └─ LTF Range Style", ({ options: ["Solid", "Dashed", "Dotted"], group: state.g_5MIN }));
  var ltf_range_width_5m = pinescript.inputInt(1, "  └─ LTF Range Width", ({ minval: 1, maxval: 5, group: state.g_5MIN }));
  var ltf_range_color_5m = pinescript.inputColor(pinescript.color.rgb(0, 255, 149, 50), "  └─ LTF Range Color", ({ group: state.g_5MIN }));
  if (state.g_15MIN === undefined) state.g_15MIN = "━━━━━━━━━ 15-MINUTE ORB ━━━━━━━━━";
  var show_15min = pinescript.inputBool(true, "Show 15-Minute ORB", ({ group: state.g_15MIN }));
  var bullish_color_15m = pinescript.inputColor(pinescript.color.rgb(33, 150, 243), "Bullish Color", ({ inline: "15mc", group: state.g_15MIN }));
  var bearish_color_15m = pinescript.inputColor(pinescript.color.rgb(255, 152, 0), "Bearish Color", ({ inline: "15mc", group: state.g_15MIN }));
  var bullish_fill_15m = pinescript.inputColor(pinescript.color.rgb(33, 150, 243, 85), "Bullish Fill", ({ inline: "15mf", group: state.g_15MIN }));
  var bearish_fill_15m = pinescript.inputColor(pinescript.color.rgb(255, 152, 0, 85), "Bearish Fill", ({ inline: "15mf", group: state.g_15MIN }));
  var boxStyle_15m = pinescript.inputString("Solid", "Range Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "15box", group: state.g_15MIN }));
  var borderWidth_15m = pinescript.inputInt(1, "Width", 1, 10, ({ inline: "15box", group: state.g_15MIN }));
  var show_midLine_15m = pinescript.inputBool(true, "Show Midline", ({ inline: "15mid", group: state.g_15MIN }));
  var lineStyle_15m = pinescript.inputString("Dashed", "Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "15mid", group: state.g_15MIN }));
  var lineWidth_15m = pinescript.inputInt(1, "Width", 1, 10, ({ inline: "15mid", group: state.g_15MIN }));
  var show_extensions_15m = pinescript.inputBool(true, "Show Median Extensions", ({ inline: "15ext", group: state.g_15MIN }));
  var ext_line_style_15m = pinescript.inputString("Dotted", "Style", ({ options: ["Solid", "Dashed", "Dotted"], inline: "15ext", group: state.g_15MIN }));
  var ext_line_width_15m = pinescript.inputInt(1, "Width", ({ minval: 1, maxval: 5, inline: "15ext", group: state.g_15MIN }));
  var show_ext_labels_15m = pinescript.inputBool(true, "Show Extension Labels", ({ group: state.g_15MIN }));
  var show_ltf_15m = pinescript.inputBool(true, "Show LTF Candles", ({ group: state.g_15MIN }));
  var ltf_15m_count = pinescript.inputInt(15, "  └─ Number of Candles", ({ minval: 1, maxval: 20, group: state.g_15MIN }));
  var ltf_offset_15m = pinescript.inputInt(35, "  └─ Offset (bars from right)", ({ minval: 1, maxval: 100, group: state.g_15MIN }));
  var ltf_spacing_15m = pinescript.inputInt(3, "  └─ Candle Spacing", ({ minval: 1, maxval: 5, group: state.g_15MIN }));
  var ltf_width_15m = pinescript.inputInt(2, "  └─ Candle Width", ({ minval: 1, maxval: 5, group: state.g_15MIN }));
  var ltf_bull_color_15m = pinescript.inputColor(pinescript.color.rgb(0, 255, 149, 60), "  └─ LTF Bullish Color", ({ group: state.g_15MIN }));
  var ltf_bear_color_15m = pinescript.inputColor(pinescript.color.rgb(195, 0, 255, 60), "  └─ LTF Bearish Color", ({ group: state.g_15MIN }));
  var show_ltf_range_15m = pinescript.inputBool(true, "  └─ Show LTF High/Low Lines", ({ group: state.g_15MIN }));
  var ltf_range_style_15m = pinescript.inputString("Dotted", "  └─ LTF Range Style", ({ options: ["Solid", "Dashed", "Dotted"], group: state.g_15MIN }));
  var ltf_range_width_15m = pinescript.inputInt(1, "  └─ LTF Range Width", ({ minval: 1, maxval: 5, group: state.g_15MIN }));
  var ltf_range_color_15m = pinescript.inputColor(pinescript.color.rgb(33, 150, 243, 50), "  └─ LTF Range Color", ({ group: state.g_15MIN }));
  if (state.g_LABELS === undefined) state.g_LABELS = "Labels & Display";
  var showL = pinescript.inputBool(true, "Show High/Low/Mid Labels", ({ inline: "Labels", group: state.g_LABELS }));
  var showP = pinescript.inputBool(false, "Show Prices", ({ inline: "Labels", group: state.g_LABELS }));
  var pos = pinescript.inputString("Left", "Position", ({ options: ["Left", "Right"], group: state.g_LABELS }));
  if (state.g_TABLE === undefined) state.g_TABLE = "Statistics Table";
  var show_stats_table = pinescript.inputBool(true, "Show Statistics Table", ({ group: state.g_TABLE }));
  var stats_table_pos = pinescript.inputString("Top Right", "Table Position", ({ options: ["Bottom Center", "Bottom Left", "Bottom Right", "Middle Center", "Middle Left", "Middle Right", "Top Center", "Top Left", "Top Right"], group: state.g_TABLE }));
  var stats_table_size = pinescript.inputString("Small", "Table Size", ({ options: ["Auto", "Tiny", "Small", "Normal", "Large", "Huge"], group: state.g_TABLE }));
  function get_style(style) {
    switch (style) {
      case "Solid":
      {
        line.style_solid;
        break;
      }
      case "Dashed":
      {
        line.style_dashed;
        break;
      }
      case "Dotted":
      {
        line.style_dotted;
        break;
      }
    }
  }
  function get_label_size(size) {
    switch (pinescript.size) {
      case "Tiny":
      {
        pinescript.size.tiny;
        break;
      }
      case "Small":
      {
        pinescript.size.small;
        break;
      }
      case "Normal":
      {
        pinescript.size.normal;
        break;
      }
      case "Large":
      {
        pinescript.size.large;
        break;
      }
      case "Huge":
      {
        pinescript.size.huge;
        break;
      }
    }
  }
  function get_table_position(pos) {
    switch (pos) {
      case "Bottom Center":
      {
        pinescript.position.bottom_center;
        break;
      }
      case "Bottom Left":
      {
        pinescript.position.bottom_left;
        break;
      }
      case "Bottom Right":
      {
        pinescript.position.bottom_right;
        break;
      }
      case "Middle Center":
      {
        pinescript.position.middle_center;
        break;
      }
      case "Middle Left":
      {
        pinescript.position.middle_left;
        break;
      }
      case "Middle Right":
      {
        pinescript.position.middle_right;
        break;
      }
      case "Top Center":
      {
        pinescript.position.top_center;
        break;
      }
      case "Top Left":
      {
        pinescript.position.top_left;
        break;
      }
      case "Top Right":
      {
        pinescript.position.top_right;
        break;
      }
    }
  }
  function get_table_text_size(size) {
    switch (pinescript.size) {
      case "Auto":
      {
        pinescript.size.auto;
        break;
      }
      case "Tiny":
      {
        pinescript.size.tiny;
        break;
      }
      case "Small":
      {
        pinescript.size.small;
        break;
      }
      case "Normal":
      {
        pinescript.size.normal;
        break;
      }
      case "Large":
      {
        pinescript.size.large;
        break;
      }
      case "Huge":
      {
        pinescript.size.huge;
        break;
      }
    }
  }
  var MEDIAN_EXT_5M_HIGH = 0.411;
  var MEDIAN_EXT_5M_LOW = 0.45;
  var MEDIAN_EXT_15M_HIGH = 0.38;
  var MEDIAN_EXT_15M_LOW = 0.415;
  var tz = "America/New_York";
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
  var is_5m_session = !pinescript.na(pinescript.time(timeframe.period, "0930-0935", tz));
  var is_5m_start = (is_5m_session && !pinescript.hist(0, is_5m_session, 1));
  var is_5m_end = (pinescript.hist(1, is_5m_session, 1) && !is_5m_session);
  var is_15m_session = !pinescript.na(pinescript.time(timeframe.period, "0930-0945", tz));
  var is_15m_start = (is_15m_session && !pinescript.hist(2, is_15m_session, 1));
  var is_15m_end = (pinescript.hist(3, is_15m_session, 1) && !is_15m_session);
  var is_ib_session = !pinescript.na(pinescript.time(timeframe.period, "0930-1030", tz));
  var is_ib_start = (is_ib_session && !pinescript.hist(4, is_ib_session, 1));
  var is_ib_end = (pinescript.hist(5, is_ib_session, 1) && !is_ib_session);
  var is_ny_session = !pinescript.na(pinescript.time(timeframe.period, "0930-1600", tz));
  var is_ny_session_end = (pinescript.hist(6, is_ny_session, 1) && !is_ny_session);
  var [H5, L5, M5, O5, C5] = pinescript.unpack(pinescript.requestSecurity(ticker.standard(syminfo.tickerid), "5", [high, low, hl2, open, close], ({ lookahead: barmerge.lookahead_on })), 5);
  var [H15, L15, M15, O15, C15] = pinescript.unpack(pinescript.requestSecurity(ticker.standard(syminfo.tickerid), "15", [high, low, hl2, open, close], ({ lookahead: barmerge.lookahead_on })), 5);
  var [H60, L60, O60, C60] = pinescript.unpack(pinescript.requestSecurity(ticker.standard(syminfo.tickerid), "60", [high, low, open, close], ({ lookahead: barmerge.lookahead_on })), 4);
  var [high_1m, low_1m, open_1m, close_1m] = pinescript.unpack(request.security_lower_tf(ticker.standard(syminfo.tickerid), "1", [high, low, open, close]), 4);
  var _style = ((pos === "Left") ? label.style_label_right : label.style_label_left);
  if (((is_ib_start && !pinescript.na(H60)) && !pinescript.na(L60))) {
    state.ib_high = H60;
    state.ib_low = L60;
    state.ib_open = O60;
    state.ib_close = C60;
    state.ib_captured = false;
  }
  if (((is_ib_end && !pinescript.na(state.ib_high)) && !pinescript.na(state.ib_low))) {
    state.ib_is_bullish = (state.ib_close >= state.ib_open);
    state.ib_captured = true;
  }
  function draw_ltf_candles(ltf, o_array, h_array, l_array, c_array, bull_color, bear_color, offset_from_right, max_candles, spacing, width) {
    if ((pinescript.arraySize(o_array) > 0)) {
      while ((pinescript.arraySize(ltf.bodies) > 0)) {
        pinescript.boxDelete(ltf.bodies.shift());
      }
      while ((pinescript.arraySize(ltf.wicks_high) > 0)) {
        pinescript.lineDelete(ltf.wicks_high.shift());
      }
      while ((pinescript.arraySize(ltf.wicks_low) > 0)) {
        pinescript.lineDelete(ltf.wicks_low.shift());
      }
      ltf.highs.clear();
      ltf.lows.clear();
      var start_index = pinescript.max(0, (pinescript.arraySize(o_array) - max_candles));
      var num_candles = (pinescript.arraySize(o_array) - start_index);
      for (let i = start_index; i <= (pinescript.arraySize(o_array) - 1); i++) {
        var o = pinescript.arrayGet(o_array, i);
        var h = pinescript.arrayGet(h_array, i);
        var l = pinescript.arrayGet(l_array, i);
        var c = pinescript.arrayGet(c_array, i);
        var is_bull = (c >= o);
        var candle_color = (is_bull ? bull_color : bear_color);
        var candle_index = (i - start_index);
        var x_start = ((bar_index + offset_from_right) + (candle_index * spacing));
        var x_end = (x_start + width);
        var x_mid = pinescript.round((x_start + (width / 2)));
        var body_top = pinescript.max(o, c);
        var body_bottom = pinescript.min(o, c);
        ltf.bodies.push(pinescript.boxNew(x_start, body_top, x_end, body_bottom, ({ border_color: candle_color, bgcolor: candle_color, border_width: 1 })));
        ltf.wicks_high.push(pinescript.lineNew(x_mid, body_top, x_mid, h, ({ color: candle_color, width: 1 })));
        ltf.wicks_low.push(pinescript.lineNew(x_mid, body_bottom, x_mid, l, ({ color: candle_color, width: 1 })));
        ltf.highs.push(h);
        ltf.lows.push(l);
      }
      var ltf_start_x = (bar_index + offset_from_right);
      var ltf_end_x = (((bar_index + offset_from_right) + (num_candles * spacing)) + width);
      return [ltf_start_x, ltf_end_x];
    } else {
      return null;
    }
  }
  if (show_5min) {
    if (is_5m_start) {
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
      state.or5_ltf_opens_frozen.clear();
      state.or5_ltf_highs_frozen.clear();
      state.or5_ltf_lows_frozen.clear();
      state.or5_ltf_closes_frozen.clear();
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
    if (((is_5m_session && !pinescript.na(H5)) && !pinescript.na(L5))) {
      state.or5_high = H5;
      state.or5_low = L5;
      state.or5_mid = M5;
      state.or5_open = O5;
      state.or5_close = C5;
    }
    if (is_5m_end) {
      state.or5_end_bar = bar_index;
      state.or5_captured = true;
    }
    if ((((is_5m_session && !state.or5_ltf_frozen) && !pinescript.na(open_1m)) && (pinescript.arraySize(open_1m) > 0))) {
      for (let i = 0; i <= (pinescript.arraySize(open_1m) - 1); i++) {
        state.or5_ltf_opens_frozen.push(pinescript.arrayGet(open_1m, i));
        state.or5_ltf_highs_frozen.push(pinescript.arrayGet(high_1m, i));
        state.or5_ltf_lows_frozen.push(pinescript.arrayGet(low_1m, i));
        state.or5_ltf_closes_frozen.push(pinescript.arrayGet(close_1m, i));
      }
    }
    if ((is_5m_end && !state.or5_ltf_frozen)) {
      state.or5_ltf_frozen = true;
      if (((state.or5_extreme_first === "none") && (pinescript.arraySize(state.or5_ltf_highs_frozen) > 0))) {
        for (let i = 0; i <= (pinescript.arraySize(state.or5_ltf_highs_frozen) - 1); i++) {
          var h_1m = pinescript.arrayGet(state.or5_ltf_highs_frozen, i);
          var l_1m = pinescript.arrayGet(state.or5_ltf_lows_frozen, i);
          if ((h_1m >= state.or5_high)) {
            state.or5_extreme_first = "high";
            break;
          } else {
            if ((l_1m <= state.or5_low)) {
              state.or5_extreme_first = "low";
              break;
            }
          }
        }
      }
    }
    if ((state.or5_captured && !state.or5_mid_retested)) {
      if (((((high >= state.or5_mid) && (low <= state.or5_mid)) || ((pinescript.hist(7, close, 1) < state.or5_mid) && (close >= state.or5_mid))) || ((pinescript.hist(8, close, 1) > state.or5_mid) && (close <= state.or5_mid)))) {
        state.or5_mid_retested = true;
      }
    }
    if ((((state.or5_captured && !pinescript.na(state.or5_high)) && !pinescript.na(state.or5_low)) && pinescript.na(state.or5_top_line))) {
      var is_bullish = (state.or5_close >= state.or5_open);
      var _color = (is_bullish ? bullish_color_5m : bearish_color_5m);
      var _fillcolor = (is_bullish ? bullish_fill_5m : bearish_fill_5m);
      state.or5_top_line = pinescript.lineNew(state.or5_start_bar, state.or5_high, bar_index, state.or5_high, ({ color: _color, style: get_style(boxStyle_5m), width: borderWidth_5m }));
      state.or5_bot_line = pinescript.lineNew(state.or5_start_bar, state.or5_low, bar_index, state.or5_low, ({ color: _color, style: get_style(boxStyle_5m), width: borderWidth_5m }));
      state.or5_fill = linefill.new(state.or5_top_line, state.or5_bot_line, _fillcolor);
      if (show_midLine_5m) {
        state.or5_mid_line = pinescript.lineNew(state.or5_start_bar, state.or5_mid, bar_index, state.or5_mid, ({ color: _color, style: get_style(lineStyle_5m), width: lineWidth_5m }));
      }
      if (show_extensions_5m) {
        var ext_high_price = (state.or5_high * (1 + (MEDIAN_EXT_5M_HIGH / 100)));
        var ext_low_price = (state.or5_low * (1 - (MEDIAN_EXT_5M_LOW / 100)));
        state.or5_ext_high = pinescript.lineNew(state.or5_start_bar, ext_high_price, bar_index, ext_high_price, ({ color: _color, style: get_style(ext_line_style_5m), width: ext_line_width_5m }));
        state.or5_ext_low = pinescript.lineNew(state.or5_start_bar, ext_low_price, bar_index, ext_low_price, ({ color: _color, style: get_style(ext_line_style_5m), width: ext_line_width_5m }));
      }
      var x = ((pos === "Left") ? state.or5_start_bar : bar_index);
      if (showL) {
        state.or5_high_label = pinescript.labelNew(x, state.or5_high, ("5m High" + (showP ? ((" (" + pinescript.strToString(state.or5_high, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
        state.or5_low_label = pinescript.labelNew(x, state.or5_low, ("5m Low" + (showP ? ((" (" + pinescript.strToString(state.or5_low, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
        if (show_midLine_5m) {
          state.or5_mid_label = pinescript.labelNew(x, state.or5_mid, ("5m Mid" + (showP ? ((" (" + pinescript.strToString(state.or5_mid, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
        }
      }
      if ((show_extensions_5m && show_ext_labels_5m)) {
        ext_high_price = (state.or5_high * (1 + (MEDIAN_EXT_5M_HIGH / 100)));
        ext_low_price = (state.or5_low * (1 - (MEDIAN_EXT_5M_LOW / 100)));
        state.or5_ext_high_label = pinescript.labelNew(x, ext_high_price, "Med Ext +0.41%", ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Small") }));
        state.or5_ext_low_label = pinescript.labelNew(x, ext_low_price, "Med Ext -0.45%", ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Small") }));
      }
    }
    if (((((state.or5_captured && show_ltf_5m) && state.or5_ltf_frozen) && (pinescript.arraySize(state.or5_ltf_opens_frozen) > 0)) && is_ny_session)) {
      var [ltf_start_x, ltf_end_x] = pinescript.unpack(draw_ltf_candles(state.ltf5, state.or5_ltf_opens_frozen, state.or5_ltf_highs_frozen, state.or5_ltf_lows_frozen, state.or5_ltf_closes_frozen, ltf_bull_color_5m, ltf_bear_color_5m, ltf_offset_5m, ltf_5m_count, ltf_spacing_5m, ltf_width_5m), 2);
      if ((show_ltf_range_5m && (pinescript.arraySize(state.ltf5.highs) > 0))) {
        pinescript.lineDelete(state.or5_ltf_high_line);
        pinescript.lineDelete(state.or5_ltf_low_line);
        var ltf_high = pinescript.arrayMax(state.ltf5.highs);
        var ltf_low = pinescript.arrayMin(state.ltf5.lows);
        state.or5_ltf_high_line = pinescript.lineNew(ltf_start_x, ltf_high, ltf_end_x, ltf_high, ({ color: ltf_range_color_5m, style: get_style(ltf_range_style_5m), width: ltf_range_width_5m }));
        state.or5_ltf_low_line = pinescript.lineNew(ltf_start_x, ltf_low, ltf_end_x, ltf_low, ({ color: ltf_range_color_5m, style: get_style(ltf_range_style_5m), width: ltf_range_width_5m }));
      }
    }
    if (((state.or5_captured && !pinescript.na(state.or5_top_line)) && is_ny_session)) {
      state.or5_end_bar = bar_index;
      if (!pinescript.na(state.or5_top_line)) {
        line.set_x2(state.or5_top_line, bar_index);
      }
      if (!pinescript.na(state.or5_bot_line)) {
        line.set_x2(state.or5_bot_line, bar_index);
      }
      if ((!pinescript.na(state.or5_mid_line) && show_midLine_5m)) {
        line.set_x2(state.or5_mid_line, bar_index);
      }
      if ((!pinescript.na(state.or5_ext_high) && show_extensions_5m)) {
        line.set_x2(state.or5_ext_high, bar_index);
      }
      if ((!pinescript.na(state.or5_ext_low) && show_extensions_5m)) {
        line.set_x2(state.or5_ext_low, bar_index);
      }
      if ((showL && (pos === "Right"))) {
        if (!pinescript.na(state.or5_high_label)) {
          label.set_x(state.or5_high_label, bar_index);
        }
        if (!pinescript.na(state.or5_low_label)) {
          label.set_x(state.or5_low_label, bar_index);
        }
        if ((!pinescript.na(state.or5_mid_label) && show_midLine_5m)) {
          label.set_x(state.or5_mid_label, bar_index);
        }
      }
      if (((show_extensions_5m && show_ext_labels_5m) && (pos === "Right"))) {
        if (!pinescript.na(state.or5_ext_high_label)) {
          label.set_x(state.or5_ext_high_label, bar_index);
        }
        if (!pinescript.na(state.or5_ext_low_label)) {
          label.set_x(state.or5_ext_low_label, bar_index);
        }
      }
      if (!is_5m_session) {
        if ((!state.or5_high_broken && (high > state.or5_high))) {
          state.or5_high_broken = true;
        }
        if ((!state.or5_low_broken && (low < state.or5_low))) {
          state.or5_low_broken = true;
        }
        if (show_extensions_5m) {
          ext_high_price = (state.or5_high * (1 + (MEDIAN_EXT_5M_HIGH / 100)));
          ext_low_price = (state.or5_low * (1 - (MEDIAN_EXT_5M_LOW / 100)));
          if ((!state.or5_ext_high_reached && (high > ext_high_price))) {
            state.or5_ext_high_reached = true;
          }
          if ((!state.or5_ext_low_reached && (low < ext_low_price))) {
            state.or5_ext_low_reached = true;
          }
        }
      }
    }
  }
  if (show_15min) {
    if (is_15m_start) {
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
      state.or15_ltf_opens_frozen.clear();
      state.or15_ltf_highs_frozen.clear();
      state.or15_ltf_lows_frozen.clear();
      state.or15_ltf_closes_frozen.clear();
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
    if (((is_15m_session && !pinescript.na(H15)) && !pinescript.na(L15))) {
      state.or15_high = H15;
      state.or15_low = L15;
      state.or15_mid = M15;
      state.or15_open = O15;
      state.or15_close = C15;
    }
    if (is_15m_end) {
      state.or15_end_bar = bar_index;
      state.or15_captured = true;
    }
    if ((((is_15m_session && !state.or15_ltf_frozen) && !pinescript.na(open_1m)) && (pinescript.arraySize(open_1m) > 0))) {
      for (let i = 0; i <= (pinescript.arraySize(open_1m) - 1); i++) {
        state.or15_ltf_opens_frozen.push(pinescript.arrayGet(open_1m, i));
        state.or15_ltf_highs_frozen.push(pinescript.arrayGet(high_1m, i));
        state.or15_ltf_lows_frozen.push(pinescript.arrayGet(low_1m, i));
        state.or15_ltf_closes_frozen.push(pinescript.arrayGet(close_1m, i));
      }
    }
    if ((is_15m_end && !state.or15_ltf_frozen)) {
      state.or15_ltf_frozen = true;
      if (((state.or15_extreme_first === "none") && (pinescript.arraySize(state.or15_ltf_highs_frozen) > 0))) {
        for (let i = 0; i <= (pinescript.arraySize(state.or15_ltf_highs_frozen) - 1); i++) {
          h_1m = pinescript.arrayGet(state.or15_ltf_highs_frozen, i);
          l_1m = pinescript.arrayGet(state.or15_ltf_lows_frozen, i);
          if ((h_1m >= state.or15_high)) {
            state.or15_extreme_first = "high";
            break;
          } else {
            if ((l_1m <= state.or15_low)) {
              state.or15_extreme_first = "low";
              break;
            }
          }
        }
      }
    }
    if ((state.or15_captured && !state.or15_mid_retested)) {
      if (((((high >= state.or15_mid) && (low <= state.or15_mid)) || ((pinescript.hist(9, close, 1) < state.or15_mid) && (close >= state.or15_mid))) || ((pinescript.hist(10, close, 1) > state.or15_mid) && (close <= state.or15_mid)))) {
        state.or15_mid_retested = true;
      }
    }
    if ((((state.or15_captured && !pinescript.na(state.or15_high)) && !pinescript.na(state.or15_low)) && pinescript.na(state.or15_top_line))) {
      is_bullish = (state.or15_close >= state.or15_open);
      _color = (is_bullish ? bullish_color_15m : bearish_color_15m);
      _fillcolor = (is_bullish ? bullish_fill_15m : bearish_fill_15m);
      state.or15_top_line = pinescript.lineNew(state.or15_start_bar, state.or15_high, bar_index, state.or15_high, ({ color: _color, style: get_style(boxStyle_15m), width: borderWidth_15m }));
      state.or15_bot_line = pinescript.lineNew(state.or15_start_bar, state.or15_low, bar_index, state.or15_low, ({ color: _color, style: get_style(boxStyle_15m), width: borderWidth_15m }));
      state.or15_fill = linefill.new(state.or15_top_line, state.or15_bot_line, _fillcolor);
      if (show_midLine_15m) {
        state.or15_mid_line = pinescript.lineNew(state.or15_start_bar, state.or15_mid, bar_index, state.or15_mid, ({ color: _color, style: get_style(lineStyle_15m), width: lineWidth_15m }));
      }
      if (show_extensions_15m) {
        ext_high_price = (state.or15_high * (1 + (MEDIAN_EXT_15M_HIGH / 100)));
        ext_low_price = (state.or15_low * (1 - (MEDIAN_EXT_15M_LOW / 100)));
        state.or15_ext_high = pinescript.lineNew(state.or15_start_bar, ext_high_price, bar_index, ext_high_price, ({ color: _color, style: get_style(ext_line_style_15m), width: ext_line_width_15m }));
        state.or15_ext_low = pinescript.lineNew(state.or15_start_bar, ext_low_price, bar_index, ext_low_price, ({ color: _color, style: get_style(ext_line_style_15m), width: ext_line_width_15m }));
      }
      x = ((pos === "Left") ? state.or15_start_bar : bar_index);
      if (showL) {
        state.or15_high_label = pinescript.labelNew(x, state.or15_high, ("15m High" + (showP ? ((" (" + pinescript.strToString(state.or15_high, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
        state.or15_low_label = pinescript.labelNew(x, state.or15_low, ("15m Low" + (showP ? ((" (" + pinescript.strToString(state.or15_low, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
        if (show_midLine_15m) {
          state.or15_mid_label = pinescript.labelNew(x, state.or15_mid, ("15m Mid" + (showP ? ((" (" + pinescript.strToString(state.or15_mid, format.mintick)) + ")") : "")), ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Normal") }));
        }
      }
      if ((show_extensions_15m && show_ext_labels_15m)) {
        ext_high_price = (state.or15_high * (1 + (MEDIAN_EXT_15M_HIGH / 100)));
        ext_low_price = (state.or15_low * (1 - (MEDIAN_EXT_15M_LOW / 100)));
        state.or15_ext_high_label = pinescript.labelNew(x, ext_high_price, "Med Ext +0.38%", ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Small") }));
        state.or15_ext_low_label = pinescript.labelNew(x, ext_low_price, "Med Ext -0.42%", ({ style: _style, color: pinescript.color.new(_color, 100), textcolor: _color, size: get_label_size("Small") }));
      }
    }
    if (((((state.or15_captured && show_ltf_15m) && state.or15_ltf_frozen) && (pinescript.arraySize(state.or15_ltf_opens_frozen) > 0)) && is_ny_session)) {
      [ltf_start_x, ltf_end_x] = pinescript.unpack(draw_ltf_candles(state.ltf15, state.or15_ltf_opens_frozen, state.or15_ltf_highs_frozen, state.or15_ltf_lows_frozen, state.or15_ltf_closes_frozen, ltf_bull_color_15m, ltf_bear_color_15m, ltf_offset_15m, ltf_15m_count, ltf_spacing_15m, ltf_width_15m), 2);
      if ((show_ltf_range_15m && (pinescript.arraySize(state.ltf15.highs) > 0))) {
        pinescript.lineDelete(state.or15_ltf_high_line);
        pinescript.lineDelete(state.or15_ltf_low_line);
        ltf_high = pinescript.arrayMax(state.ltf15.highs);
        ltf_low = pinescript.arrayMin(state.ltf15.lows);
        state.or15_ltf_high_line = pinescript.lineNew(ltf_start_x, ltf_high, ltf_end_x, ltf_high, ({ color: ltf_range_color_15m, style: get_style(ltf_range_style_15m), width: ltf_range_width_15m }));
        state.or15_ltf_low_line = pinescript.lineNew(ltf_start_x, ltf_low, ltf_end_x, ltf_low, ({ color: ltf_range_color_15m, style: get_style(ltf_range_style_15m), width: ltf_range_width_15m }));
      }
    }
    if (((state.or15_captured && !pinescript.na(state.or15_top_line)) && is_ny_session)) {
      state.or15_end_bar = bar_index;
      if (!pinescript.na(state.or15_top_line)) {
        line.set_x2(state.or15_top_line, bar_index);
      }
      if (!pinescript.na(state.or15_bot_line)) {
        line.set_x2(state.or15_bot_line, bar_index);
      }
      if ((!pinescript.na(state.or15_mid_line) && show_midLine_15m)) {
        line.set_x2(state.or15_mid_line, bar_index);
      }
      if ((!pinescript.na(state.or15_ext_high) && show_extensions_15m)) {
        line.set_x2(state.or15_ext_high, bar_index);
      }
      if ((!pinescript.na(state.or15_ext_low) && show_extensions_15m)) {
        line.set_x2(state.or15_ext_low, bar_index);
      }
      if ((showL && (pos === "Right"))) {
        if (!pinescript.na(state.or15_high_label)) {
          label.set_x(state.or15_high_label, bar_index);
        }
        if (!pinescript.na(state.or15_low_label)) {
          label.set_x(state.or15_low_label, bar_index);
        }
        if ((!pinescript.na(state.or15_mid_label) && show_midLine_15m)) {
          label.set_x(state.or15_mid_label, bar_index);
        }
      }
      if (((show_extensions_15m && show_ext_labels_15m) && (pos === "Right"))) {
        if (!pinescript.na(state.or15_ext_high_label)) {
          label.set_x(state.or15_ext_high_label, bar_index);
        }
        if (!pinescript.na(state.or15_ext_low_label)) {
          label.set_x(state.or15_ext_low_label, bar_index);
        }
      }
      if (!is_15m_session) {
        if ((!state.or15_high_broken && (high > state.or15_high))) {
          state.or15_high_broken = true;
        }
        if ((!state.or15_low_broken && (low < state.or15_low))) {
          state.or15_low_broken = true;
        }
        if (show_extensions_15m) {
          ext_high_price = (state.or15_high * (1 + (MEDIAN_EXT_15M_HIGH / 100)));
          ext_low_price = (state.or15_low * (1 - (MEDIAN_EXT_15M_LOW / 100)));
          if ((!state.or15_ext_high_reached && (high > ext_high_price))) {
            state.or15_ext_high_reached = true;
          }
          if ((!state.or15_ext_low_reached && (low < ext_low_price))) {
            state.or15_ext_low_reached = true;
          }
        }
      }
    }
  }
  if ((show_stats_table && (state.or5_captured || state.or15_captured))) {
    if (state.stats_table === undefined) state.stats_table = null;
    pinescript.tableDelete(pinescript.hist(11, state.stats_table, 1));
    var table_pos = get_table_position(stats_table_pos);
    var table_size = get_table_text_size(stats_table_size);
    var header_bg = pinescript.color.rgb(64, 64, 64);
    var header_text = pinescript.color.white;
    var cell_bg = pinescript.color.white;
    var cell_text = pinescript.color.rgb(64, 64, 64);
    var pending_bg = pinescript.color.rgb(255, 235, 59);
    var pending_text = pinescript.color.rgb(64, 64, 64);
    var validated_bg = pinescript.color.rgb(0, 150, 136);
    var validated_text = pinescript.color.white;
    state.stats_table = pinescript.table.new(table_pos, 3, 35, ({ border_width: 1, border_color: pinescript.color.rgb(64, 64, 64), bgcolor: cell_bg }));
    var session_ended = (is_ny_session_end || !is_ny_session);
    var row = 0;
    pinescript.table.cell(state.stats_table, 0, row, "━━━ ORB STATISTICS ━━━", ({ bgcolor: header_bg, text_color: header_text, text_size: table_size, text_font_family: font.family_monospace }));
    pinescript.tableMergeCells(state.stats_table, 0, row, 2, row);
    row = (row + 1);
    if ((show_5min && state.or5_captured)) {
      var is_bull_5m = (state.or5_close >= state.or5_open);
      var extreme_5m = state.or5_extreme_first;
      pinescript.table.cell(state.stats_table, 0, row, "━━━ 5-MIN ORB ━━━", ({ bgcolor: header_bg, text_color: header_text, text_size: table_size, text_font_family: font.family_monospace }));
      pinescript.tableMergeCells(state.stats_table, 0, row, 2, row);
      row = (row + 1);
      pinescript.table.cell(state.stats_table, 0, row, "Direction", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
      var dir_text = (is_bull_5m ? "Bullish" : "Bearish");
      var dir_color = (is_bull_5m ? bullish_color_5m : bearish_color_5m);
      pinescript.table.cell(state.stats_table, 1, row, dir_text, ({ bgcolor: cell_bg, text_color: dir_color, text_size: table_size, text_font_family: font.family_monospace }));
      pinescript.table.cell(state.stats_table, 2, row, "Validated", ({ bgcolor: validated_bg, text_color: validated_text, text_size: table_size, text_font_family: font.family_monospace }));
      row = (row + 1);
      pinescript.table.cell(state.stats_table, 0, row, "Extreme First", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
      var extreme_text = ((extreme_5m === "high") ? "High First" : ((extreme_5m === "low") ? "Low First" : "Unknown"));
      pinescript.table.cell(state.stats_table, 1, row, extreme_text, ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
      var extreme_validated = (extreme_5m !== "none");
      var status_bg = (extreme_validated ? validated_bg : pending_bg);
      var status_text = (extreme_validated ? validated_text : pending_text);
      var status_symbol = (extreme_validated ? "Validated" : "Pending");
      pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
      row = (row + 1);
      pinescript.table.cell(state.stats_table, 0, row, "Extension ↑", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
      pinescript.table.cell(state.stats_table, 1, row, "84.9%", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
      var ext_up_validated = state.or5_ext_high_reached;
      status_bg = (ext_up_validated ? validated_bg : pending_bg);
      status_text = (ext_up_validated ? validated_text : pending_text);
      status_symbol = (ext_up_validated ? "Validated" : "Pending");
      pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
      row = (row + 1);
      pinescript.table.cell(state.stats_table, 0, row, "Extension ↓", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
      pinescript.table.cell(state.stats_table, 1, row, "81.0%", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
      var ext_down_validated = state.or5_ext_low_reached;
      status_bg = (ext_down_validated ? validated_bg : pending_bg);
      status_text = (ext_down_validated ? validated_text : pending_text);
      status_symbol = (ext_down_validated ? "Validated" : "Pending");
      pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
      row = (row + 1);
      if ((extreme_5m !== "none")) {
        var retest_prob = 0;
        if ((is_bull_5m && (extreme_5m === "high"))) {
          retest_prob = 88.4;
        } else {
          if ((is_bull_5m && (extreme_5m === "low"))) {
            retest_prob = 81.8;
          } else {
            if ((!is_bull_5m && (extreme_5m === "high"))) {
              retest_prob = 82.7;
            } else {
              if ((!is_bull_5m && (extreme_5m === "low"))) {
                retest_prob = 85.6;
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
      if ((extreme_5m !== "none")) {
        var ib_prob = 0;
        var ib_dir = "";
        if ((is_bull_5m && (extreme_5m === "low"))) {
          ib_prob = 68.7;
          ib_dir = "Bullish";
        } else {
          if ((is_bull_5m && (extreme_5m === "high"))) {
            ib_prob = 61.6;
            ib_dir = "Bullish";
          } else {
            if ((!is_bull_5m && (extreme_5m === "high"))) {
              ib_prob = 64.8;
              ib_dir = "Bearish";
            } else {
              if ((!is_bull_5m && (extreme_5m === "low"))) {
                ib_prob = 58.6;
                ib_dir = "Bearish";
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
      if ((extreme_5m !== "none")) {
        var break_prob = 0;
        var break_dir = "";
        if ((is_bull_5m && (extreme_5m === "low"))) {
          break_prob = 79.9;
          break_dir = "High";
        } else {
          if ((is_bull_5m && (extreme_5m === "high"))) {
            break_prob = 66.3;
            break_dir = "High";
          } else {
            if ((!is_bull_5m && (extreme_5m === "high"))) {
              break_prob = 74.6;
              break_dir = "Low";
            } else {
              if ((!is_bull_5m && (extreme_5m === "low"))) {
                break_prob = 67.4;
                break_dir = "Low";
              }
            }
          }
        }
        pinescript.table.cell(state.stats_table, 0, row, "Next Break", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
        pinescript.table.cell(state.stats_table, 1, row, (((break_dir + " ") + pinescript.strToString(break_prob, "#.#")) + "%"), ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size, text_font_family: font.family_monospace }));
        var break_validated = (state.or5_high_broken || state.or5_low_broken);
        status_bg = (break_validated ? validated_bg : pending_bg);
        status_text = (break_validated ? validated_text : pending_text);
        status_symbol = (break_validated ? "Validated" : "Pending");
        pinescript.table.cell(state.stats_table, 2, row, status_symbol, ({ bgcolor: status_bg, text_color: status_text, text_size: table_size, text_font_family: font.family_monospace }));
        row = (row + 1);
      }
      if ((state.or5_high_broken || state.or5_low_broken)) {
        var close_prob = 0;
        var close_dir = "";
        if ((is_bull_5m && state.or5_high_broken)) {
          close_prob = 67.1;
          close_dir = "Bullish";
        } else {
          if ((is_bull_5m && state.or5_low_broken)) {
            close_prob = 53.2;
            close_dir = "Bullish";
          } else {
            if ((!is_bull_5m && state.or5_high_broken)) {
              close_prob = 60.8;
              close_dir = "Bullish";
            } else {
              if ((!is_bull_5m && state.or5_low_broken)) {
                close_prob = 60.5;
                close_dir = "Bearish";
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
      pinescript.table.cell(state.stats_table, 0, row, "", ({ bgcolor: cell_bg, text_color: cell_text, text_size: table_size }));
      pinescript.tableMergeCells(state.stats_table, 0, row, 2, row);
      row = (row + 1);
    }
    if ((show_15min && state.or15_captured)) {
      var is_bull_15m = (state.or15_close >= state.or15_open);
      var extreme_15m = state.or15_extreme_first;
      pinescript.table.cell(state.stats_table, 0, row, "━━━ 15-MIN ORB ━━━", ({ bgcolor: header_bg, text_color: header_text, text_size: table_size, text_font_family: font.family_monospace }));
      pinescript.tableMergeCells(state.stats_table, 0, row, 2, row);
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
        retest_prob = 0;
        if ((is_bull_15m && (extreme_15m === "high"))) {
          retest_prob = 80.8;
        } else {
          if ((is_bull_15m && (extreme_15m === "low"))) {
            retest_prob = 71.4;
          } else {
            if ((!is_bull_15m && (extreme_15m === "high"))) {
              retest_prob = 72.8;
            } else {
              if ((!is_bull_15m && (extreme_15m === "low"))) {
                retest_prob = 83.8;
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
      if ((extreme_15m !== "none")) {
        ib_prob = 0;
        ib_dir = "";
        if ((is_bull_15m && (extreme_15m === "low"))) {
          ib_prob = 74;
          ib_dir = "Bullish";
        } else {
          if ((is_bull_15m && (extreme_15m === "high"))) {
            ib_prob = 59.6;
            ib_dir = "Bullish";
          } else {
            if ((!is_bull_15m && (extreme_15m === "high"))) {
              ib_prob = 73.2;
              ib_dir = "Bearish";
            } else {
              if ((!is_bull_15m && (extreme_15m === "low"))) {
                ib_prob = 50.3;
                ib_dir = "Bearish";
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
      if ((extreme_15m !== "none")) {
        break_prob = 0;
        break_dir = "";
        if ((is_bull_15m && (extreme_15m === "low"))) {
          break_prob = 75.3;
          break_dir = "High";
        } else {
          if ((is_bull_15m && (extreme_15m === "high"))) {
            break_prob = 59.6;
            break_dir = "High";
          } else {
            if ((!is_bull_15m && (extreme_15m === "high"))) {
              break_prob = 74.4;
              break_dir = "Low";
            } else {
              if ((!is_bull_15m && (extreme_15m === "low"))) {
                break_prob = 61.8;
                break_dir = "Low";
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
      if ((state.or15_high_broken || state.or15_low_broken)) {
        close_prob = 0;
        close_dir = "";
        if ((is_bull_15m && state.or15_high_broken)) {
          close_prob = 74.3;
          close_dir = "Bullish";
        } else {
          if ((is_bull_15m && state.or15_low_broken)) {
            close_prob = 49.7;
            close_dir = "Bullish";
          } else {
            if ((!is_bull_15m && state.or15_high_broken)) {
              close_prob = 57;
              close_dir = "Bullish";
            } else {
              if ((!is_bull_15m && state.or15_low_broken)) {
                close_prob = 66;
                close_dir = "Bearish";
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
