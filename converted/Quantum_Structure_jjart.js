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
  timenow: 1782784152981,
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
  // Study: Quantum Structure | jjart
  // Options: {"overlay":true,"max_boxes_count":500,"max_lines_count":500,"max_labels_count":500}
  var current_tf_minutes = (timeframe.in_seconds() / 60);
  var is_ltf_15 = (current_tf_minutes <= 15);
  var input_htf = input.timeframe("60", "Base Higher Timeframe (Auto-adjusts)", ({ group: "Multi-Timeframe" }));
  var resolved_htf = ((current_tf_minutes >= 240) ? "D" : ((current_tf_minutes >= 60) ? "240" : input_htf));
  var profile = pinescript.inputString("Scalping", "Auto Profile", ({ options: ["Scalping", "Intraday", "Swing"], group: "Core Settings", tooltip: "Scalping - my default. Intraday = longer trades. Swing = slower, cleaner structure - multi day trades." }));
  function get_profiled_swing_length() {
    if ((profile === "Scalping")) {
      if ((current_tf_minutes <= 5)) {
        4;
      }
      else if ((current_tf_minutes <= 15)) {
        5;
      }
      else if ((current_tf_minutes <= 30)) {
        8;
      }
      else if ((current_tf_minutes <= 60)) {
        5;
      }
      else if ((current_tf_minutes <= 240)) {
        3;
      }
      else {
        2;
      }
    } else {
      if ((profile === "Swing")) {
        if ((current_tf_minutes <= 5)) {
          4;
        }
        else if ((current_tf_minutes <= 15)) {
          5;
        }
        else if ((current_tf_minutes <= 30)) {
          17;
        }
        else if ((current_tf_minutes <= 60)) {
          10;
        }
        else if ((current_tf_minutes <= 240)) {
          7;
        }
        else {
          4;
        }
      } else {
        if ((current_tf_minutes <= 5)) {
          4;
        }
        else if ((current_tf_minutes <= 15)) {
          5;
        }
        else if ((current_tf_minutes <= 30)) {
          12;
        }
        else if ((current_tf_minutes <= 60)) {
          7;
        }
        else if ((current_tf_minutes <= 240)) {
          5;
        }
        else {
          3;
        }
      }
    }
  }
  function get_profiled_consolidation_bars() {
    if ((profile === "Scalping")) {
      if ((current_tf_minutes <= 5)) {
        35;
      }
      else if ((current_tf_minutes <= 15)) {
        21;
      }
      else if ((current_tf_minutes <= 30)) {
        13;
      }
      else if ((current_tf_minutes <= 60)) {
        8;
      }
      else if ((current_tf_minutes <= 240)) {
        6;
      }
      else {
        3;
      }
    } else {
      if ((profile === "Swing")) {
        if ((current_tf_minutes <= 5)) {
          70;
        }
        else if ((current_tf_minutes <= 15)) {
          42;
        }
        else if ((current_tf_minutes <= 30)) {
          25;
        }
        else if ((current_tf_minutes <= 60)) {
          17;
        }
        else if ((current_tf_minutes <= 240)) {
          11;
        }
        else {
          7;
        }
      } else {
        if ((current_tf_minutes <= 5)) {
          50;
        }
        else if ((current_tf_minutes <= 15)) {
          30;
        }
        else if ((current_tf_minutes <= 30)) {
          18;
        }
        else if ((current_tf_minutes <= 60)) {
          12;
        }
        else if ((current_tf_minutes <= 240)) {
          8;
        }
        else {
          5;
        }
      }
    }
  }
  function f_tfPretty(tf) {
    switch (tf) {
      case "1":
      {
        "1m";
        break;
      }
      case "3":
      {
        "3m";
        break;
      }
      case "5":
      {
        "5m";
        break;
      }
      case "15":
      {
        "15m";
        break;
      }
      case "30":
      {
        "30m";
        break;
      }
      case "45":
      {
        "45m";
        break;
      }
      case "60":
      {
        "1H";
        break;
      }
      case "120":
      {
        "2H";
        break;
      }
      case "180":
      {
        "3H";
        break;
      }
      case "240":
      {
        "4H";
        break;
      }
      case "D":
      {
        "1D";
        break;
      }
      case "W":
      {
        "1W";
        break;
      }
      case "M":
      {
        "1M";
        break;
      }
      default:
      {
        tf;
        break;
      }
    }
  }
  var use_htf = pinescript.inputBool(false, "Show Higher Timeframe Support/Resistance Boxes", ({ group: "Multi-Timeframe" }));
  var align_entries_with_htf = pinescript.inputBool(false, "Filter Entries by HTF Direction", ({ group: "Multi-Timeframe", tooltip: "When enabled, continuation entries only count as valid if they align with the HTF ICC direction." }));
  var use_manual_settings = pinescript.inputBool(false, "Use Manual Timeframe Settings", ({ group: "Core Settings", tooltip: "Override Auto Profile --when checked, uses the manual Swing Length / Consolidation Bars (adjust below) instead of the Auto Profile values." }));
  var manual_swing_length = pinescript.inputInt(7, "Manual Swing Length", ({ minval: 3, maxval: 50, group: "Core Settings" }));
  var manual_consolidation_bars = pinescript.inputInt(20, "Manual Consolidation Bars", ({ minval: 3, maxval: 100, group: "Core Settings" }));
  var consol_wiggle_pct = pinescript.inputFloat(0.2, "Consolidation Wiggle (%)", ({ minval: 0, maxval: 5, group: "Core Settings", tooltip: "Extra % wiggle around last swing high/low for consolidation detection" }));
  var swing_length = (use_manual_settings ? manual_swing_length : get_profiled_swing_length());
  var consolidation_bars = (use_manual_settings ? manual_consolidation_bars : get_profiled_consolidation_bars());
  function get_profiled_wiggle_pct() {
    if ((profile === "Entry")) {
      return 0.4;
    } else {
      if ((profile === "Scalping")) {
        return 0.3;
      } else {
        if ((profile === "Intraday")) {
          return 0.2;
        } else {
          if ((profile === "Swing")) {
            return 0.1;
          } else {
            return 0.2;
          }
        }
      }
    }
  }
  var wiggle_pct = (use_manual_settings ? consol_wiggle_pct : get_profiled_wiggle_pct());
  var show_tp_sl = pinescript.inputBool(true, "Show TP/SL Lines", ({ group: "Risk Management", tooltip: "TP/SL lines preview live intrabar and may change until the bar closes. After a confirmed continuation entry, the TP/SL levels are frozen for a short window." }));
  var use_structure_stop = pinescript.inputBool(true, "Use Structure Based Stop and Take Profit", ({ group: "Risk Management", tooltip: "If true, SL is below last swing low for longs and above last swing high for shorts. If false or unavailable, ATR-based stop is used." }));
  var structure_sl_factor = pinescript.inputFloat(1, " - Structure SL Tightness", ({ minval: 0.1, maxval: 1, step: 0.05, group: "Risk Management", tooltip: "1.0 = SL at swing high/low. 0.5 = halfway between entry and swing. Smaller = tighter structure stop." }));
  var max_structure_atr_mult = pinescript.inputFloat(2, " - Max Structure SL (ATR)", ({ minval: 0.1, maxval: 10, step: 0.1, group: "Risk Management", tooltip: "Caps the structure-based SL so it is never farther than this many ATRs away from the entry price." }));
  var sl_atr_mult = pinescript.inputFloat(1, "ATR SL Multiple", ({ minval: 0.1, step: 0.1, group: "Risk Management", tooltip: "Only in effect if Structure Based is unchecked above - stop loss and take profit based on multiples of the current Average True Range (ATR)" }));
  var tp1_r_mult = pinescript.inputFloat(1, " - ATR Take Profit 1 (R)", ({ minval: 0.1, step: 0.1, group: "Risk Management" }));
  var tp2_r_mult = pinescript.inputFloat(2, " - ATR Take Profit 2 (R)", ({ minval: 0.1, step: 0.1, group: "Risk Management" }));
  var show_reversal_entries = pinescript.inputBool(false, "Show Reversal Entries", ({ group: "Display", tooltip: "Show counter-trend reversal entries (⚠BUY / ⚠SELL) when price breaks out of correction range in opposite direction. - Flag display only, does not show TP/SL lines or change overall structure until it confirms itself." }));
  var MAX_HIST_ZONES = 10;
  var show_indication_labels = true;
  var show_zones = true;
  var num_historical_zones = pinescript.inputInt(5, "Number of Historical S/R Zones", ({ minval: 0, maxval: MAX_HIST_ZONES, group: "Display", tooltip: "Number of additional historical zones in addition to the current zone" }));
  var show_signals = true;
  var show_phase_background = pinescript.inputBool(true, "Show Phase Background", ({ group: "Display", tooltip: "Toggle ICC phase background shading (bull-green, bear-red, neutral-grey, entry-white) on or off." }));
  var phase_bg_transparency = pinescript.inputInt(90, "Phase Background Transparency", ({ minval: 80, maxval: 99, group: "Display", tooltip: "Transparency of background zone colors, set to 99 for no background shading" }));
  var auto_hide_phase_bg = (current_tf_minutes <= 15);
  var alert_freq_opt = pinescript.inputString("Once Per Bar Close", "Alert Frequency", ({ options: ["Every Tick", "Once Per Bar", "Once Per Bar Close"], group: "Alerts", tooltip: "Controls how often ICC entry alerts can fire." }));
  var alert_tz = pinescript.inputString("America/Chicago", "Alert Timezone", ({ options: ["America/Chicago", "America/New_York", "Etc/UTC", "Exchange"], group: "Alerts" }));
  function f_pad2(v) {
    return pinescript.strFormat("{0,number,00}", v);
  }
  function f_ts(ts) {
    var tz = ((alert_tz === "Exchange") ? syminfo.timezone : alert_tz);
    return ((((((((((pinescript.strToString(pinescript.year(ts, tz)) + "-") + f_pad2(pinescript.month(ts, tz))) + "-") + f_pad2(pinescript.dayofmonth(ts, tz))) + " ") + f_pad2(pinescript.hour(ts, tz))) + ":") + f_pad2(pinescript.minute(ts, tz))) + ":") + f_pad2(pinescript.second(ts, tz)));
  }
  var htf_bullish_color = pinescript.inputColor(pinescript.color.new(pinescript.color.blue, 0), "HTF Bullish Color", ({ group: "Multi-Timeframe" }));
  var htf_bearish_color = pinescript.inputColor(pinescript.color.new(pinescript.color.purple, 0), "HTF Bearish Color", ({ group: "Multi-Timeframe" }));
  var zone_transparency = 75;
  var bullish_color = pinescript.color.new(pinescript.color.green, 0);
  var bearish_color = pinescript.color.new(pinescript.color.red, 0);
  var zone_bull_color = pinescript.color.new(pinescript.color.green, zone_transparency);
  var zone_bear_color = pinescript.color.new(pinescript.color.red, zone_transparency);
  var cont_bg_tan = pinescript.color.new(pinescript.color.rgb(243, 212, 164), phase_bg_transparency);
  var swing_high = pinescript.ta.pivothigh(high, swing_length, swing_length);
  var swing_low = pinescript.ta.pivotlow(low, swing_length, swing_length);
  var atr_value = pinescript.atr(14);
  var atr_percent = (atr_value / close);
  function get_zone_buffer(price) {
    var base_buffer = (price * 0.0003);
    return (base_buffer * (1 + (atr_percent * 10)));
  }
  if (state.last_swing_high === undefined) state.last_swing_high = null;
  if (state.last_swing_low === undefined) state.last_swing_low = null;
  if (state.prev_swing_high === undefined) state.prev_swing_high = null;
  if (state.prev_swing_low === undefined) state.prev_swing_low = null;
  if (state.prev_bullish_indication === undefined) state.prev_bullish_indication = null;
  if (state.prev_bearish_indication === undefined) state.prev_bearish_indication = null;
  if (state.last_high_bar === undefined) state.last_high_bar = null;
  if (state.last_low_bar === undefined) state.last_low_bar = null;
  if (state.bars_since_last_structure === undefined) state.bars_since_last_structure = 0;
  if (state.bars_in_correction === undefined) state.bars_in_correction = 0;
  if (state.bars_in_continuation === undefined) state.bars_in_continuation = 0;
  if (state.correction_range_high === undefined) state.correction_range_high = null;
  if (state.correction_range_low === undefined) state.correction_range_low = null;
  if (state.market_structure === undefined) state.market_structure = "no_setup";
  if (state.no_setup_label === undefined) state.no_setup_label = "No Setup";
  if (state.last_trend_dir === undefined) state.last_trend_dir = null;
  if (state.indication_detected === undefined) state.indication_detected = false;
  if (state.indication_level === undefined) state.indication_level = null;
  if (state.indication_type === undefined) state.indication_type = null;
  if (state.correction_phase === undefined) state.correction_phase = false;
  if (state.last_entry_type === undefined) state.last_entry_type = null;
  if (state.prev_profile === undefined) state.prev_profile = profile;
  var profile_changed = (profile !== state.prev_profile);
  if (profile_changed) {
    state.prev_profile = profile;
    state.correction_phase = false;
    state.correction_range_high = null;
    state.correction_range_low = null;
    state.bars_in_correction = 0;
    state.bars_in_continuation = 0;
    state.indication_detected = false;
    state.market_structure = "no_setup";
  }
  if (state.last_entry_price === undefined) state.last_entry_price = null;
  if (state.last_stop_loss === undefined) state.last_stop_loss = null;
  if (state.last_tp1_price === undefined) state.last_tp1_price = null;
  if (state.last_tp2_price === undefined) state.last_tp2_price = null;
  if (state.sl_line === undefined) state.sl_line = null;
  if (state.tp1_line === undefined) state.tp1_line = null;
  if (state.tp2_line === undefined) state.tp2_line = null;
  if (state.sl_label === undefined) state.sl_label = null;
  if (state.tp1_label === undefined) state.tp1_label = null;
  if (state.tp2_label === undefined) state.tp2_label = null;
  if (state.entry_line === undefined) state.entry_line = null;
  if (state.entry_label === undefined) state.entry_label = null;
  if (state.cont_active === undefined) state.cont_active = false;
  if (!pinescript.na(swing_high)) {
    state.prev_swing_high = state.last_swing_high;
    state.last_swing_high = swing_high;
    state.last_high_bar = (bar_index - swing_length);
    state.bars_since_last_structure = 0;
  } else {
    state.bars_since_last_structure = 1;
  }
  if (!pinescript.na(swing_low)) {
    state.prev_swing_low = state.last_swing_low;
    state.last_swing_low = swing_low;
    state.last_low_bar = (bar_index - swing_length);
    state.bars_since_last_structure = 0;
  }
  var higher_high = ((!pinescript.na(state.prev_swing_high) && !pinescript.na(swing_high)) && (swing_high > state.prev_swing_high));
  var lower_low = ((!pinescript.na(state.prev_swing_low) && !pinescript.na(swing_low)) && (swing_low < state.prev_swing_low));
  var lower_high = ((!pinescript.na(state.prev_swing_high) && !pinescript.na(swing_high)) && (swing_high < state.prev_swing_high));
  var higher_low = ((!pinescript.na(state.prev_swing_low) && !pinescript.na(swing_low)) && (swing_low > state.prev_swing_low));
  var bullish_indication = (!pinescript.na(swing_high) && higher_high);
  var bearish_indication = (!pinescript.na(swing_low) && lower_low);
  var in_consolidation = (((state.bars_since_last_structure >= consolidation_bars) && !pinescript.na(state.last_swing_high)) && !pinescript.na(state.last_swing_low));
  var upper_band = (pinescript.na(state.last_swing_high) ? null : (state.last_swing_high * (1 + (wiggle_pct / 100))));
  var lower_band = (pinescript.na(state.last_swing_low) ? null : (state.last_swing_low * (1 - (wiggle_pct / 100))));
  var price_in_range = (((!pinescript.na(upper_band) && !pinescript.na(lower_band)) && (close <= upper_band)) && (close >= lower_band));
  var is_consolidating = (in_consolidation && price_in_range);
  if (bullish_indication) {
    state.prev_bullish_indication = state.last_swing_high;
    state.indication_detected = true;
    state.indication_level = state.last_swing_high;
    state.indication_type = "bullish";
    state.correction_phase = false;
    state.market_structure = "bullish_indication";
    state.bars_in_correction = 0;
    state.correction_range_high = null;
    state.correction_range_low = null;
    state.last_entry_type = null;
    state.last_trend_dir = "bullish";
    state.no_setup_label = "No Setup";
  }
  if (bearish_indication) {
    state.prev_bearish_indication = state.last_swing_low;
    state.indication_detected = true;
    state.indication_level = state.last_swing_low;
    state.indication_type = "bearish";
    state.correction_phase = false;
    state.market_structure = "bearish_indication";
    state.bars_in_correction = 0;
    state.correction_range_high = null;
    state.correction_range_low = null;
    state.last_entry_type = null;
    state.last_trend_dir = "bearish";
    state.no_setup_label = "No Setup";
  }
  if ((state.correction_phase && (state.indication_type === "bearish"))) {
    if ((!pinescript.na(state.prev_bullish_indication) && (close > state.prev_bullish_indication))) {
      state.indication_detected = false;
      state.correction_phase = false;
      state.market_structure = "no_setup";
      state.no_setup_label = "Breaking Structure";
      state.bars_in_correction = 0;
      state.correction_range_high = null;
      state.correction_range_low = null;
    } else {
      if (((!pinescript.na(swing_high) && !pinescript.na(state.prev_bullish_indication)) && (swing_high > state.prev_bullish_indication))) {
        state.prev_bullish_indication = state.last_swing_high;
        state.indication_detected = true;
        state.indication_level = state.last_swing_high;
        state.indication_type = "bullish";
        state.correction_phase = false;
        state.market_structure = "bullish_indication";
        state.bars_in_correction = 0;
        state.correction_range_high = null;
        state.correction_range_low = null;
      }
    }
  }
  if ((state.correction_phase && (state.indication_type === "bullish"))) {
    if ((!pinescript.na(state.prev_bearish_indication) && (close < state.prev_bearish_indication))) {
      state.indication_detected = false;
      state.correction_phase = false;
      state.market_structure = "no_setup";
      state.no_setup_label = "Breaking Structure";
      state.bars_in_correction = 0;
      state.correction_range_high = null;
      state.correction_range_low = null;
    } else {
      if (((!pinescript.na(swing_low) && !pinescript.na(state.prev_bearish_indication)) && (swing_low < state.prev_bearish_indication))) {
        state.prev_bearish_indication = state.last_swing_low;
        state.indication_detected = true;
        state.indication_level = state.last_swing_low;
        state.indication_type = "bearish";
        state.correction_phase = false;
        state.market_structure = "bearish_indication";
        state.bars_in_correction = 0;
        state.correction_range_high = null;
        state.correction_range_low = null;
      }
    }
  }
  if ((is_consolidating && !state.indication_detected)) {
    state.market_structure = "consolidation";
    state.indication_detected = false;
    state.correction_phase = false;
    state.indication_level = null;
    state.indication_type = null;
    state.last_entry_type = null;
  }
  var neutral_consolidation = (state.market_structure === "consolidation");
  var live_buf = pinescript.max((syminfo.mintick * 2), (atr_value * 0.05));
  var idle_state = ((!state.indication_detected && !state.correction_phase) && !state.cont_active);
  var break_struct_live = (idle_state && ((((state.last_trend_dir === "bullish") && !pinescript.na(state.last_swing_low)) && (close < (state.last_swing_low - live_buf))) || (((state.last_trend_dir === "bearish") && !pinescript.na(state.last_swing_high)) && (close > (state.last_swing_high + live_buf)))));
  var trend_drift_live = (((idle_state && !break_struct_live) && (((state.last_trend_dir === "bullish") && !pinescript.na(state.last_swing_high)) && (close > (state.last_swing_high + live_buf)))) || (((state.last_trend_dir === "bearish") && !pinescript.na(state.last_swing_low)) && (close < (state.last_swing_low - live_buf))));
  var phase_display_override = null;
  if (break_struct_live) {
    phase_display_override = "Breaking Structure (Live)";
  } else {
    if (trend_drift_live) {
      phase_display_override = ((state.last_trend_dir === "bullish") ? "Trend Drift (Live Bull)" : "Trend Drift (Live Bear)");
    }
  }
  var in_no_setup_state = (((!state.indication_detected && !state.correction_phase) && !neutral_consolidation) && !state.cont_active);
  if (in_no_setup_state) {
    if (((!pinescript.na(swing_high) && higher_high) && (state.last_trend_dir === "bullish"))) {
      state.no_setup_label = "Trend Drift (Bull)";
    }
    if (((!pinescript.na(swing_low) && lower_low) && (state.last_trend_dir === "bearish"))) {
      state.no_setup_label = "Trend Drift (Bear)";
    }
  }
  if ((state.market_structure !== "no_setup")) {
    state.no_setup_label = "No Setup";
  }
  if ((state.indication_detected && !state.correction_phase)) {
    if (((state.indication_type === "bullish") && (close < state.indication_level))) {
      state.correction_phase = true;
      state.market_structure = "bullish_correction";
      state.bars_in_correction = 0;
      state.correction_range_high = state.last_swing_high;
      state.correction_range_low = state.last_swing_low;
    }
    if (((state.indication_type === "bearish") && (close > state.indication_level))) {
      state.correction_phase = true;
      state.market_structure = "bearish_correction";
      state.bars_in_correction = 0;
      state.correction_range_high = state.last_swing_high;
      state.correction_range_low = state.last_swing_low;
    }
  }
  if (state.correction_phase) {
    if ((!pinescript.na(state.last_swing_high) && !pinescript.na(state.last_swing_low))) {
      state.correction_range_high = state.last_swing_high;
      state.correction_range_low = state.last_swing_low;
    }
    state.bars_in_correction = 1;
    state.bars_in_continuation = 0;
  } else {
    if (state.cont_active) {
      state.bars_in_continuation = 1;
      state.bars_in_correction = 0;
    } else {
      state.bars_in_correction = 0;
      state.bars_in_continuation = 0;
    }
  }
  if (state.left_correction_box === undefined) state.left_correction_box = false;
  if (!state.correction_phase) {
    state.left_correction_box = false;
  } else {
    if ((!pinescript.na(state.correction_range_high) && !pinescript.na(state.correction_range_low))) {
      if (((high > state.correction_range_high) || (low < state.correction_range_low))) {
        state.left_correction_box = true;
      }
    }
  }
  var correction_consolidation = ((((state.correction_phase && !state.left_correction_box) && (state.bars_in_correction >= consolidation_bars)) && !pinescript.na(state.correction_range_high)) && !pinescript.na(state.correction_range_low));
  var bullish_entry_traditional = ((((state.indication_detected && state.correction_phase) && (state.indication_type === "bullish")) && (close > state.indication_level)) && (pinescript.hist(0, close, 1) <= state.indication_level));
  var bearish_entry_traditional = ((((state.indication_detected && state.correction_phase) && (state.indication_type === "bearish")) && (close < state.indication_level)) && (pinescript.hist(1, close, 1) >= state.indication_level));
  var bullish_entry_breakout = (((((state.indication_detected && state.correction_phase) && (state.indication_type === "bullish")) && !pinescript.na(state.correction_range_high)) && (close > state.correction_range_high)) && (pinescript.hist(2, close, 1) <= state.correction_range_high));
  var bearish_entry_breakout = (((((state.indication_detected && state.correction_phase) && (state.indication_type === "bearish")) && !pinescript.na(state.correction_range_low)) && (close < state.correction_range_low)) && (pinescript.hist(3, close, 1) >= state.correction_range_low));
  var bullish_entry_reversal = (((((state.indication_detected && state.correction_phase) && (state.indication_type === "bearish")) && !pinescript.na(state.correction_range_high)) && (close > state.correction_range_high)) && (pinescript.hist(4, close, 1) <= state.correction_range_high));
  var bearish_entry_reversal = (((((state.indication_detected && state.correction_phase) && (state.indication_type === "bullish")) && !pinescript.na(state.correction_range_low)) && (close < state.correction_range_low)) && (pinescript.hist(5, close, 1) >= state.correction_range_low));
  var bullish_entry_cont = (bullish_entry_traditional || bullish_entry_breakout);
  var bearish_entry_cont = (bearish_entry_traditional || bearish_entry_breakout);
  var [htf_indication_level_entry, htf_indication_type_entry] = pinescript.unpack(pinescript.requestSecurity(syminfo.tickerid, resolved_htf, [state.indication_level, state.indication_type], ({ lookahead: barmerge.lookahead_off })), 2);
  var htf_bullish = (htf_indication_type_entry === "bullish");
  var htf_bearish = (htf_indication_type_entry === "bearish");
  var htf_ok_bull = (!align_entries_with_htf || htf_bullish);
  var htf_ok_bear = (!align_entries_with_htf || htf_bearish);
  var bullish_entry_cont_allowed = (bullish_entry_cont && htf_ok_bull);
  var bearish_entry_cont_allowed = (bearish_entry_cont && htf_ok_bear);
  if (state.last_cont_entry_bar === undefined) state.last_cont_entry_bar = null;
  var tp_visible_bars = 2;
  var bull_cont_fire = (bullish_entry_cont_allowed && show_signals);
  var bear_cont_fire = (bearish_entry_cont_allowed && show_signals);
  var any_entry_candidate = (bull_cont_fire || bear_cont_fire);
  function f_calc_preview_tpsl(_dir) {
    var _entry = close;
    var _sl = null;
    var _tp1 = null;
    var _tp2 = null;
    if (use_structure_stop) {
      if (((_dir === "bullish") && !pinescript.na(state.last_swing_low))) {
        var raw_dist = pinescript.abs((_entry - state.last_swing_low));
        var struct_dist = (raw_dist * structure_sl_factor);
        var max_dist = (atr_value * max_structure_atr_mult);
        var final_dist = pinescript.min(struct_dist, max_dist);
        _sl = (_entry - final_dist);
      } else {
        if (((_dir === "bearish") && !pinescript.na(state.last_swing_high))) {
          raw_dist = pinescript.abs((state.last_swing_high - _entry));
          struct_dist = (raw_dist * structure_sl_factor);
          max_dist = (atr_value * max_structure_atr_mult);
          final_dist = pinescript.min(struct_dist, max_dist);
          _sl = (_entry + final_dist);
        }
      }
    }
    if (pinescript.na(_sl)) {
      _sl = ((_dir === "bullish") ? (_entry - (atr_value * sl_atr_mult)) : (_entry + (atr_value * sl_atr_mult)));
    }
    var _risk = pinescript.abs((_entry - _sl));
    if ((_dir === "bullish")) {
      _tp1 = (_entry + (_risk * tp1_r_mult));
      _tp2 = (_entry + (_risk * tp2_r_mult));
    } else {
      _tp1 = (_entry - (_risk * tp1_r_mult));
      _tp2 = (_entry - (_risk * tp2_r_mult));
    }
    return [_entry, _sl, _tp1, _tp2];
  }
  if (state.preview_active === undefined) state.preview_active = false;
  if (any_entry_candidate) {
    var cand_dir = (bull_cont_fire ? "bullish" : "bearish");
    var [p_entry, p_sl, p_tp1, p_tp2] = pinescript.unpack(f_calc_preview_tpsl(cand_dir), 4);
    state.last_entry_price = p_entry;
    state.last_stop_loss = p_sl;
    state.last_tp1_price = p_tp1;
    state.last_tp2_price = p_tp2;
    if (show_tp_sl) {
      if (!state.preview_active) {
        if (!pinescript.na(state.entry_line)) {
          pinescript.lineDelete(state.entry_line);
        }
        if (!pinescript.na(state.sl_line)) {
          pinescript.lineDelete(state.sl_line);
        }
        if (!pinescript.na(state.tp1_line)) {
          pinescript.lineDelete(state.tp1_line);
        }
        if (!pinescript.na(state.tp2_line)) {
          pinescript.lineDelete(state.tp2_line);
        }
        if (!pinescript.na(state.entry_label)) {
          pinescript.labelDelete(state.entry_label);
        }
        if (!pinescript.na(state.sl_label)) {
          pinescript.labelDelete(state.sl_label);
        }
        if (!pinescript.na(state.tp1_label)) {
          pinescript.labelDelete(state.tp1_label);
        }
        if (!pinescript.na(state.tp2_label)) {
          pinescript.labelDelete(state.tp2_label);
        }
        state.entry_line = pinescript.lineNew(bar_index, state.last_entry_price, (bar_index + 50), state.last_entry_price, ({ color: pinescript.color.new(pinescript.color.blue, 0), width: 2 }));
        state.entry_label = pinescript.labelNew((bar_index + 50), state.last_entry_price, "ENTRY", ({ style: label.style_label_right, textcolor: pinescript.color.white, color: pinescript.color.new(pinescript.color.blue, 70), size: pinescript.size.small }));
        state.sl_line = pinescript.lineNew(bar_index, state.last_stop_loss, (bar_index + 50), state.last_stop_loss, ({ color: pinescript.color.new(pinescript.color.red, 0), width: 2, style: line.style_dashed }));
        state.sl_label = pinescript.labelNew((bar_index + 50), state.last_stop_loss, "SL", ({ style: label.style_label_right, textcolor: pinescript.color.white, color: pinescript.color.new(pinescript.color.red, 80), size: pinescript.size.small }));
        state.tp1_line = pinescript.lineNew(bar_index, state.last_tp1_price, (bar_index + 50), state.last_tp1_price, ({ color: pinescript.color.new(pinescript.color.green, 0), width: 2, style: line.style_dashed }));
        state.tp1_label = pinescript.labelNew((bar_index + 50), state.last_tp1_price, "TP1", ({ style: label.style_label_right, textcolor: pinescript.color.black, color: pinescript.color.new(pinescript.color.green, 70), size: pinescript.size.small }));
        state.tp2_line = pinescript.lineNew(bar_index, state.last_tp2_price, (bar_index + 50), state.last_tp2_price, ({ color: pinescript.color.new(pinescript.color.green, 0), width: 2, style: line.style_dotted }));
        state.tp2_label = pinescript.labelNew((bar_index + 50), state.last_tp2_price, "TP2", ({ style: label.style_label_right, textcolor: pinescript.color.black, color: pinescript.color.new(pinescript.color.green, 85), size: pinescript.size.small }));
        state.preview_active = true;
      }
      line.set_x1(state.entry_line, bar_index);
      line.set_x2(state.entry_line, (bar_index + 50));
      line.set_y1(state.entry_line, state.last_entry_price);
      line.set_y2(state.entry_line, state.last_entry_price);
      label.set_x(state.entry_label, (bar_index + 50));
      label.set_y(state.entry_label, state.last_entry_price);
      line.set_x1(state.sl_line, bar_index);
      line.set_x2(state.sl_line, (bar_index + 50));
      line.set_y1(state.sl_line, state.last_stop_loss);
      line.set_y2(state.sl_line, state.last_stop_loss);
      label.set_x(state.sl_label, (bar_index + 50));
      label.set_y(state.sl_label, state.last_stop_loss);
      line.set_x1(state.tp1_line, bar_index);
      line.set_x2(state.tp1_line, (bar_index + 50));
      line.set_y1(state.tp1_line, state.last_tp1_price);
      line.set_y2(state.tp1_line, state.last_tp1_price);
      label.set_x(state.tp1_label, (bar_index + 50));
      label.set_y(state.tp1_label, state.last_tp1_price);
      line.set_x1(state.tp2_line, bar_index);
      line.set_x2(state.tp2_line, (bar_index + 50));
      line.set_y1(state.tp2_line, state.last_tp2_price);
      line.set_y2(state.tp2_line, state.last_tp2_price);
      label.set_x(state.tp2_label, (bar_index + 50));
      label.set_y(state.tp2_label, state.last_tp2_price);
    }
  } else {
    if (state.preview_active) {
      if (!pinescript.na(state.entry_line)) {
        pinescript.lineDelete(state.entry_line);
        state.entry_line = null;
      }
      if (!pinescript.na(state.sl_line)) {
        pinescript.lineDelete(state.sl_line);
        state.sl_line = null;
      }
      if (!pinescript.na(state.tp1_line)) {
        pinescript.lineDelete(state.tp1_line);
        state.tp1_line = null;
      }
      if (!pinescript.na(state.tp2_line)) {
        pinescript.lineDelete(state.tp2_line);
        state.tp2_line = null;
      }
      if (!pinescript.na(state.entry_label)) {
        pinescript.labelDelete(state.entry_label);
        state.entry_label = null;
      }
      if (!pinescript.na(state.sl_label)) {
        pinescript.labelDelete(state.sl_label);
        state.sl_label = null;
      }
      if (!pinescript.na(state.tp1_label)) {
        pinescript.labelDelete(state.tp1_label);
        state.tp1_label = null;
      }
      if (!pinescript.na(state.tp2_label)) {
        pinescript.labelDelete(state.tp2_label);
        state.tp2_label = null;
      }
      state.preview_active = false;
    }
  }
  var any_entry_confirmed = ((bull_cont_fire || bear_cont_fire) && barstate.isconfirmed);
  if (any_entry_confirmed) {
    state.indication_detected = false;
    state.correction_phase = false;
    state.cont_active = true;
    state.last_cont_entry_bar = bar_index;
    state.last_entry_type = (bull_cont_fire ? "bullish" : "bearish");
    state.last_trend_dir = state.last_entry_type;
    state.no_setup_label = "No Setup";
    state.bars_in_correction = 0;
    state.bars_in_continuation = 0;
    state.correction_range_high = null;
    state.correction_range_low = null;
    state.preview_active = false;
  }
  if ((state.cont_active && !pinescript.na(state.last_entry_type))) {
    var exit_now = false;
    if ((state.last_entry_type === "bullish")) {
      var hit_sl = (!pinescript.na(state.last_stop_loss) && (low <= state.last_stop_loss));
      var hit_tp2 = (!pinescript.na(state.last_tp2_price) && (high >= state.last_tp2_price));
      if (((bearish_indication || hit_sl) || hit_tp2)) {
        exit_now = true;
      }
    } else {
      if ((state.last_entry_type === "bearish")) {
        hit_sl = (!pinescript.na(state.last_stop_loss) && (high >= state.last_stop_loss));
        hit_tp2 = (!pinescript.na(state.last_tp2_price) && (low <= state.last_tp2_price));
        if (((bullish_indication || hit_sl) || hit_tp2)) {
          exit_now = true;
        }
      }
    }
    if (exit_now) {
      state.cont_active = false;
      state.last_entry_type = null;
    }
  }
  var tp_window_active = ((show_tp_sl && !pinescript.na(state.last_cont_entry_bar)) && ((bar_index - state.last_cont_entry_bar) <= tp_visible_bars));
  if (tp_window_active) {
    if (!pinescript.na(state.entry_line)) {
      line.set_x1(state.entry_line, bar_index);
      line.set_x2(state.entry_line, (bar_index + 50));
      line.set_y1(state.entry_line, state.last_entry_price);
      line.set_y2(state.entry_line, state.last_entry_price);
      if (!pinescript.na(state.entry_label)) {
        label.set_x(state.entry_label, (bar_index + 50));
        label.set_y(state.entry_label, state.last_entry_price);
      }
    }
    if (!pinescript.na(state.sl_line)) {
      line.set_x1(state.sl_line, bar_index);
      line.set_x2(state.sl_line, (bar_index + 50));
      line.set_y1(state.sl_line, state.last_stop_loss);
      line.set_y2(state.sl_line, state.last_stop_loss);
      if (!pinescript.na(state.sl_label)) {
        label.set_x(state.sl_label, (bar_index + 50));
        label.set_y(state.sl_label, state.last_stop_loss);
      }
    }
    if (!pinescript.na(state.tp1_line)) {
      line.set_x1(state.tp1_line, bar_index);
      line.set_x2(state.tp1_line, (bar_index + 50));
      line.set_y1(state.tp1_line, state.last_tp1_price);
      line.set_y2(state.tp1_line, state.last_tp1_price);
      if (!pinescript.na(state.tp1_label)) {
        label.set_x(state.tp1_label, (bar_index + 50));
        label.set_y(state.tp1_label, state.last_tp1_price);
      }
    }
    if (!pinescript.na(state.tp2_line)) {
      line.set_x1(state.tp2_line, bar_index);
      line.set_x2(state.tp2_line, (bar_index + 50));
      line.set_y1(state.tp2_line, state.last_tp2_price);
      line.set_y2(state.tp2_line, state.last_tp2_price);
      if (!pinescript.na(state.tp2_label)) {
        label.set_x(state.tp2_label, (bar_index + 50));
        label.set_y(state.tp2_label, state.last_tp2_price);
      }
    }
  } else {
    if (!state.preview_active) {
      if (!pinescript.na(state.entry_line)) {
        pinescript.lineDelete(state.entry_line);
        state.entry_line = null;
      }
      if (!pinescript.na(state.sl_line)) {
        pinescript.lineDelete(state.sl_line);
        state.sl_line = null;
      }
      if (!pinescript.na(state.tp1_line)) {
        pinescript.lineDelete(state.tp1_line);
        state.tp1_line = null;
      }
      if (!pinescript.na(state.tp2_line)) {
        pinescript.lineDelete(state.tp2_line);
        state.tp2_line = null;
      }
      if (!pinescript.na(state.entry_label)) {
        pinescript.labelDelete(state.entry_label);
        state.entry_label = null;
      }
      if (!pinescript.na(state.sl_label)) {
        pinescript.labelDelete(state.sl_label);
        state.sl_label = null;
      }
      if (!pinescript.na(state.tp1_label)) {
        pinescript.labelDelete(state.tp1_label);
        state.tp1_label = null;
      }
      if (!pinescript.na(state.tp2_label)) {
        pinescript.labelDelete(state.tp2_label);
        state.tp2_label = null;
      }
      state.last_cont_entry_bar = null;
    }
  }
  var waiting_for_bullish_entry = (((state.indication_detected && state.correction_phase) && (state.indication_type === "bullish")) && (close <= state.indication_level));
  var waiting_for_bearish_entry = (((state.indication_detected && state.correction_phase) && (state.indication_type === "bearish")) && (close >= state.indication_level));
  pinescript.plotchar(((!is_ltf_15 && waiting_for_bullish_entry) && show_signals), ({ title: "Waiting Bullish", char: "↑", location: pinescript.location.belowbar, color: pinescript.color.new(pinescript.color.green, 50), size: pinescript.size.tiny }));
  pinescript.plotchar(((!is_ltf_15 && waiting_for_bearish_entry) && show_signals), ({ title: "Waiting Bearish", char: "↓", location: pinescript.location.abovebar, color: pinescript.color.new(pinescript.color.red, 50), size: pinescript.size.tiny }));
  pinescript.plotshape(swing_high, ({ title: "Swing High", location: pinescript.location.abovebar, color: bearish_color, style: pinescript.shape.triangledown, size: pinescript.size.small, offset: -swing_length }));
  pinescript.plotshape(swing_low, ({ title: "Swing Low", location: pinescript.location.belowbar, color: bullish_color, style: pinescript.shape.triangleup, size: pinescript.size.small, offset: -swing_length }));
  if ((bullish_indication && show_indication_labels)) {
    pinescript.labelNew(state.last_high_bar, state.last_swing_high, "IND", ({ style: label.style_label_down, textcolor: pinescript.color.white, color: bullish_color, size: pinescript.size.small }));
  }
  if ((bearish_indication && show_indication_labels)) {
    pinescript.labelNew(state.last_low_bar, state.last_swing_low, "IND", ({ style: label.style_label_up, textcolor: pinescript.color.white, color: bearish_color, size: pinescript.size.small }));
  }
  var ZN = (MAX_HIST_ZONES + 1);
  if (state.resistance_boxes === undefined) state.resistance_boxes = pinescript.arrayNew(ZN);
  if (state.resistance_levels === undefined) state.resistance_levels = pinescript.arrayNew(ZN, null);
  if (state.resistance_start_bars === undefined) state.resistance_start_bars = pinescript.arrayNew(ZN, null);
  if (state.resistance_hist_lines === undefined) state.resistance_hist_lines = pinescript.arrayNew(ZN);
  if (state.support_boxes === undefined) state.support_boxes = pinescript.arrayNew(ZN);
  if (state.support_levels === undefined) state.support_levels = pinescript.arrayNew(ZN, null);
  if (state.support_start_bars === undefined) state.support_start_bars = pinescript.arrayNew(ZN, null);
  if (state.support_hist_lines === undefined) state.support_hist_lines = pinescript.arrayNew(ZN);
  if (state.consolidation_box === undefined) state.consolidation_box = null;
  if (state.last_zone_edge_entry === undefined) state.last_zone_edge_entry = null;
  if (state.last_zone_edge_entry_bar === undefined) state.last_zone_edge_entry_bar = null;
  function f_hist_x2(start_i, start_prev) {
    var baseLen = pinescript.max(1, (start_prev - start_i));
    var extBars = int(pinescript.round((baseLen * 0.15)));
    return (start_prev + extBars);
  }
  function f_delete_box(b) {
    if (!pinescript.na(b)) {
      return pinescript.boxDelete(b);
    } else {
      return null;
    }
  }
  function shift_resistance_zones() {
    var last = (pinescript.arraySize(state.resistance_boxes) - 1);
    var old_box = pinescript.arrayGet(state.resistance_boxes, last);
    f_delete_box(old_box);
    var old_ln = pinescript.arrayGet(state.resistance_hist_lines, last);
    if (!pinescript.na(old_ln)) {
      pinescript.lineDelete(old_ln);
      pinescript.arraySet(state.resistance_hist_lines, last, null);
    }
    for (let i = last; i <= 1; i++) {
      pinescript.arraySet(state.resistance_boxes, i, pinescript.arrayGet(state.resistance_boxes, (i - 1)));
      pinescript.arraySet(state.resistance_levels, i, pinescript.arrayGet(state.resistance_levels, (i - 1)));
      pinescript.arraySet(state.resistance_start_bars, i, pinescript.arrayGet(state.resistance_start_bars, (i - 1)));
      pinescript.arraySet(state.resistance_hist_lines, i, pinescript.arrayGet(state.resistance_hist_lines, (i - 1)));
    }
    return pinescript.arraySet(state.resistance_hist_lines, 0, null);
  }
  function shift_support_zones() {
    var last = (pinescript.arraySize(state.support_boxes) - 1);
    var old_box = pinescript.arrayGet(state.support_boxes, last);
    f_delete_box(old_box);
    var old_ln = pinescript.arrayGet(state.support_hist_lines, last);
    if (!pinescript.na(old_ln)) {
      pinescript.lineDelete(old_ln);
      pinescript.arraySet(state.support_hist_lines, last, null);
    }
    for (let i = last; i <= 1; i++) {
      pinescript.arraySet(state.support_boxes, i, pinescript.arrayGet(state.support_boxes, (i - 1)));
      pinescript.arraySet(state.support_levels, i, pinescript.arrayGet(state.support_levels, (i - 1)));
      pinescript.arraySet(state.support_start_bars, i, pinescript.arrayGet(state.support_start_bars, (i - 1)));
      pinescript.arraySet(state.support_hist_lines, i, pinescript.arrayGet(state.support_hist_lines, (i - 1)));
    }
    return pinescript.arraySet(state.support_hist_lines, 0, null);
  }
  if ((show_zones && !pinescript.na(swing_high))) {
    shift_resistance_zones();
    var zone_buffer = get_zone_buffer(swing_high);
    var new_box = pinescript.boxNew((bar_index - swing_length), (swing_high + zone_buffer), bar_index, (swing_high - zone_buffer), ({ bgcolor: zone_bear_color, border_color: bearish_color, border_width: 2 }));
    var ln0 = pinescript.arrayGet(state.resistance_hist_lines, 0);
    if (!pinescript.na(ln0)) {
      pinescript.lineDelete(ln0);
      pinescript.arraySet(state.resistance_hist_lines, 0, null);
    }
    pinescript.arraySet(state.resistance_boxes, 0, new_box);
    pinescript.arraySet(state.resistance_levels, 0, swing_high);
    pinescript.arraySet(state.resistance_start_bars, 0, (bar_index - swing_length));
    state.last_zone_edge_entry = null;
    state.last_zone_edge_entry_bar = null;
  }
  if ((show_zones && !pinescript.na(swing_low))) {
    shift_support_zones();
    zone_buffer = get_zone_buffer(swing_low);
    new_box = pinescript.boxNew((bar_index - swing_length), (swing_low + zone_buffer), bar_index, (swing_low - zone_buffer), ({ bgcolor: zone_bull_color, border_color: bullish_color, border_width: 2 }));
    ln0 = pinescript.arrayGet(state.support_hist_lines, 0);
    if (!pinescript.na(ln0)) {
      pinescript.lineDelete(ln0);
      pinescript.arraySet(state.support_hist_lines, 0, null);
    }
    pinescript.arraySet(state.support_boxes, 0, new_box);
    pinescript.arraySet(state.support_levels, 0, swing_low);
    pinescript.arraySet(state.support_start_bars, 0, (bar_index - swing_length));
    state.last_zone_edge_entry = null;
    state.last_zone_edge_entry_bar = null;
  }
  if (show_zones) {
    var res0 = pinescript.arrayGet(state.resistance_boxes, 0);
    if (!pinescript.na(res0)) {
      box.set_right(res0, bar_index);
      box.set_bgcolor(res0, zone_bear_color);
      box.set_border_color(res0, bearish_color);
      box.set_border_width(res0, 2);
    }
    var sup0 = pinescript.arrayGet(state.support_boxes, 0);
    if (!pinescript.na(sup0)) {
      box.set_right(sup0, bar_index);
      box.set_bgcolor(sup0, zone_bull_color);
      box.set_border_color(sup0, bullish_color);
      box.set_border_width(sup0, 2);
    }
    var last = (pinescript.arraySize(state.resistance_levels) - 1);
    var maxHist = pinescript.min(num_historical_zones, last);
    for (let i = 1; i <= last; i++) {
      var r_lvl = pinescript.arrayGet(state.resistance_levels, i);
      var r_x1 = pinescript.arrayGet(state.resistance_start_bars, i);
      var r_rep = pinescript.arrayGet(state.resistance_start_bars, (i - 1));
      var r_box = pinescript.arrayGet(state.resistance_boxes, i);
      if (!pinescript.na(r_box)) {
        pinescript.boxDelete(r_box);
        pinescript.arraySet(state.resistance_boxes, i, null);
      }
      var r_ln = pinescript.arrayGet(state.resistance_hist_lines, i);
      var r_ok = ((((i <= maxHist) && !pinescript.na(r_lvl)) && !pinescript.na(r_x1)) && !pinescript.na(r_rep));
      if (r_ok) {
        var r_x2 = f_hist_x2(r_x1, r_rep);
        if (pinescript.na(r_ln)) {
          r_ln = pinescript.lineNew(r_x1, r_lvl, r_x2, r_lvl, ({ color: bearish_color, width: 4, style: line.style_dotted }));
          pinescript.arraySet(state.resistance_hist_lines, i, r_ln);
        } else {
          line.set_x1(r_ln, r_x1);
          line.set_x2(r_ln, r_x2);
          line.set_y1(r_ln, r_lvl);
          line.set_y2(r_ln, r_lvl);
          line.set_color(r_ln, bearish_color);
          line.set_style(r_ln, line.style_dotted);
          line.set_width(r_ln, 4);
        }
      } else {
        if (!pinescript.na(r_ln)) {
          pinescript.lineDelete(r_ln);
          pinescript.arraySet(state.resistance_hist_lines, i, null);
        }
      }
      var s_lvl = pinescript.arrayGet(state.support_levels, i);
      var s_x1 = pinescript.arrayGet(state.support_start_bars, i);
      var s_rep = pinescript.arrayGet(state.support_start_bars, (i - 1));
      var s_box = pinescript.arrayGet(state.support_boxes, i);
      if (!pinescript.na(s_box)) {
        pinescript.boxDelete(s_box);
        pinescript.arraySet(state.support_boxes, i, null);
      }
      var s_ln = pinescript.arrayGet(state.support_hist_lines, i);
      var s_ok = ((((i <= maxHist) && !pinescript.na(s_lvl)) && !pinescript.na(s_x1)) && !pinescript.na(s_rep));
      if (s_ok) {
        var s_x2 = f_hist_x2(s_x1, s_rep);
        if (pinescript.na(s_ln)) {
          s_ln = pinescript.lineNew(s_x1, s_lvl, s_x2, s_lvl, ({ color: bullish_color, width: 4, style: line.style_dotted }));
          pinescript.arraySet(state.support_hist_lines, i, s_ln);
        } else {
          line.set_x1(s_ln, s_x1);
          line.set_x2(s_ln, s_x2);
          line.set_y1(s_ln, s_lvl);
          line.set_y2(s_ln, s_lvl);
          line.set_color(s_ln, bullish_color);
          line.set_style(s_ln, line.style_dotted);
          line.set_width(s_ln, 4);
        }
      } else {
        if (!pinescript.na(s_ln)) {
          pinescript.lineDelete(s_ln);
          pinescript.arraySet(state.support_hist_lines, i, null);
        }
      }
    }
  } else {
    last = (pinescript.arraySize(state.resistance_boxes) - 1);
    for (let i = 0; i <= last; i++) {
      var b = pinescript.arrayGet(state.resistance_boxes, i);
      if (!pinescript.na(b)) {
        pinescript.boxDelete(b);
        pinescript.arraySet(state.resistance_boxes, i, null);
      }
      var l = pinescript.arrayGet(state.resistance_hist_lines, i);
      if (!pinescript.na(l)) {
        pinescript.lineDelete(l);
        pinescript.arraySet(state.resistance_hist_lines, i, null);
      }
      var b2 = pinescript.arrayGet(state.support_boxes, i);
      if (!pinescript.na(b2)) {
        pinescript.boxDelete(b2);
        pinescript.arraySet(state.support_boxes, i, null);
      }
      var l2 = pinescript.arrayGet(state.support_hist_lines, i);
      if (!pinescript.na(l2)) {
        pinescript.lineDelete(l2);
        pinescript.arraySet(state.support_hist_lines, i, null);
      }
    }
  }
  var is_consolidating_overlay = correction_consolidation;
  if ((is_consolidating_overlay && show_zones)) {
    if (pinescript.na(state.consolidation_box)) {
      state.consolidation_box = pinescript.boxNew((bar_index - state.bars_in_correction), state.correction_range_high, bar_index, state.correction_range_low, ({ bgcolor: pinescript.color.new(pinescript.color.gray, 70), border_color: pinescript.color.new(pinescript.color.gray, 20), border_width: 2, border_style: line.style_dashed }));
    } else {
      box.set_right(state.consolidation_box, bar_index);
      box.set_top(state.consolidation_box, state.correction_range_high);
      box.set_bottom(state.consolidation_box, state.correction_range_low);
    }
  } else {
    if (!pinescript.na(state.consolidation_box)) {
      pinescript.boxDelete(state.consolidation_box);
      state.consolidation_box = null;
    }
  }
  var _res0 = pinescript.arrayGet(state.resistance_boxes, 0);
  var _sup0 = pinescript.arrayGet(state.support_boxes, 0);
  var res_top = (!pinescript.na(_res0) ? box.get_top(_res0) : null);
  var sup_bot = (!pinescript.na(_sup0) ? box.get_bottom(_sup0) : null);
  var bull_entry_zone_edge = (((barstate.isconfirmed && !pinescript.na(res_top)) && (close > res_top)) && (pinescript.hist(6, close, 1) <= res_top));
  var bear_entry_zone_edge = (((barstate.isconfirmed && !pinescript.na(sup_bot)) && (close < sup_bot)) && (pinescript.hist(7, close, 1) >= sup_bot));
  if (bull_entry_zone_edge) {
    state.last_zone_edge_entry = "BULL";
    state.last_zone_edge_entry_bar = bar_index;
  }
  if (bear_entry_zone_edge) {
    state.last_zone_edge_entry = "BEAR";
    state.last_zone_edge_entry_bar = bar_index;
  }
  var [htf_indication_level, htf_indication_type, htf_market_structure, htf_last_swing_high, htf_last_swing_low] = pinescript.unpack(pinescript.requestSecurity(syminfo.tickerid, resolved_htf, [state.indication_level, state.indication_type, state.market_structure, state.last_swing_high, state.last_swing_low], ({ lookahead: barmerge.lookahead_off })), 5);
  if (state.htf_bias_label === undefined) state.htf_bias_label = null;
  var show_htf_bias = (((use_htf && show_zones) && !pinescript.na(htf_indication_level)) && !pinescript.na(htf_indication_type));
  if (show_htf_bias) {
    var htf_y = htf_indication_level;
    var bias_txt = ((htf_indication_type === "bullish") ? "HTF Bull" : ((htf_indication_type === "bearish") ? "HTF Bear" : ""));
    if ((bias_txt === "")) {
      if (!pinescript.na(state.htf_bias_label)) {
        pinescript.labelDelete(state.htf_bias_label);
        state.htf_bias_label = null;
      }
    } else {
      var bias_bg = ((htf_indication_type === "bullish") ? pinescript.color.new(htf_bullish_color, 75) : pinescript.color.new(htf_bearish_color, 75));
      var bias_txt_col = pinescript.color.white;
      var x_off = 15;
      if (pinescript.na(state.htf_bias_label)) {
        state.htf_bias_label = pinescript.labelNew((bar_index + x_off), htf_y, bias_txt, ({ style: label.style_label_left, textcolor: bias_txt_col, color: bias_bg, size: pinescript.size.small }));
      } else {
        label.set_x(state.htf_bias_label, (bar_index + x_off));
        label.set_y(state.htf_bias_label, htf_y);
        pinescript.labelSetText(state.htf_bias_label, bias_txt);
        label.set_color(state.htf_bias_label, bias_bg);
        label.set_textcolor(state.htf_bias_label, bias_txt_col);
      }
    }
  } else {
    if (!pinescript.na(state.htf_bias_label)) {
      pinescript.labelDelete(state.htf_bias_label);
      state.htf_bias_label = null;
    }
  }
  if (state.htf_resistance_box === undefined) state.htf_resistance_box = null;
  if (state.htf_support_box === undefined) state.htf_support_box = null;
  if (((use_htf && show_zones) && !pinescript.na(htf_last_swing_high))) {
    zone_buffer = get_zone_buffer(htf_last_swing_high);
    if (pinescript.na(state.htf_resistance_box)) {
      state.htf_resistance_box = pinescript.boxNew((bar_index - 25), (htf_last_swing_high + zone_buffer), bar_index, (htf_last_swing_high - zone_buffer), ({ bgcolor: pinescript.color.new(htf_bearish_color, 90), border_color: htf_bearish_color, border_width: 2, border_style: line.style_dashed }));
    } else {
      box.set_left(state.htf_resistance_box, (bar_index - 25));
      box.set_right(state.htf_resistance_box, bar_index);
      box.set_top(state.htf_resistance_box, (htf_last_swing_high + zone_buffer));
      box.set_bottom(state.htf_resistance_box, (htf_last_swing_high - zone_buffer));
    }
  }
  if (((use_htf && show_zones) && !pinescript.na(htf_last_swing_low))) {
    zone_buffer = get_zone_buffer(htf_last_swing_low);
    if (pinescript.na(state.htf_support_box)) {
      state.htf_support_box = pinescript.boxNew((bar_index - 25), (htf_last_swing_low + zone_buffer), bar_index, (htf_last_swing_low - zone_buffer), ({ bgcolor: pinescript.color.new(htf_bullish_color, 90), border_color: htf_bullish_color, border_width: 2, border_style: line.style_dashed }));
    } else {
      box.set_left(state.htf_support_box, (bar_index - 25));
      box.set_right(state.htf_support_box, bar_index);
      box.set_top(state.htf_support_box, (htf_last_swing_low + zone_buffer));
      box.set_bottom(state.htf_support_box, (htf_last_swing_low - zone_buffer));
    }
  }
  if ((!use_htf || !show_zones)) {
    if (!pinescript.na(state.htf_resistance_box)) {
      pinescript.boxDelete(state.htf_resistance_box);
      state.htf_resistance_box = null;
    }
    if (!pinescript.na(state.htf_support_box)) {
      pinescript.boxDelete(state.htf_support_box);
      state.htf_support_box = null;
    }
    if (!pinescript.na(state.htf_bias_label)) {
      pinescript.labelDelete(state.htf_bias_label);
      state.htf_bias_label = null;
    }
  }
  var cur_support = ((pinescript.arraySize(state.support_levels) > 0) ? pinescript.arrayGet(state.support_levels, 0) : null);
  var cur_resistance = ((pinescript.arraySize(state.resistance_levels) > 0) ? pinescript.arrayGet(state.resistance_levels, 0) : null);
  var sup_break = (!pinescript.na(pinescript.hist(8, cur_support, 1)) ? pinescript.hist(9, cur_support, 1) : cur_support);
  var res_break = (!pinescript.na(pinescript.hist(10, cur_resistance, 1)) ? pinescript.hist(11, cur_resistance, 1) : cur_resistance);
  var ltf_bear_entry = (((barstate.isconfirmed && !pinescript.na(sup_break)) && (close < sup_break)) && (pinescript.hist(12, close, 1) >= sup_break));
  var ltf_bull_entry = (((barstate.isconfirmed && !pinescript.na(res_break)) && (close > res_break)) && (pinescript.hist(13, close, 1) <= res_break));
  var bullish_cont_raw = (show_signals && (is_ltf_15 ? ltf_bull_entry : bullish_entry_cont_allowed));
  var bearish_cont_raw = (show_signals && (is_ltf_15 ? ltf_bear_entry : bearish_entry_cont_allowed));
  var bullish_reversal_vis = (((!is_ltf_15 && bullish_entry_reversal) && show_signals) && show_reversal_entries);
  var bearish_reversal_vis = (((!is_ltf_15 && bearish_entry_reversal) && show_signals) && show_reversal_entries);
  var use_htf_filter_for_color = (align_entries_with_htf && !is_ltf_15);
  var bullish_light_vis = (bullish_cont_raw && !use_htf_filter_for_color);
  var bearish_light_vis = (bearish_cont_raw && !use_htf_filter_for_color);
  var bullish_dark_vis = ((bullish_cont_raw && use_htf_filter_for_color) && htf_bullish);
  var bearish_dark_vis = ((bearish_cont_raw && use_htf_filter_for_color) && htf_bearish);
  pinescript.plotshape((bullish_light_vis && is_ltf_15), ({ title: "Bullish Entry (Normal) LTF", location: pinescript.location.belowbar, color: pinescript.color.new(pinescript.color.green, 40), style: pinescript.shape.labelup, size: pinescript.size.small, text: "ENTRY", textcolor: pinescript.color.white }));
  pinescript.plotshape((bullish_light_vis && !is_ltf_15), ({ title: "Bullish Entry (Normal)", location: pinescript.location.belowbar, color: pinescript.color.new(pinescript.color.green, 40), style: pinescript.shape.labelup, size: pinescript.size.small, text: "BUY", textcolor: pinescript.color.white }));
  pinescript.plotshape((bullish_dark_vis && is_ltf_15), ({ title: "Bullish Entry (HTF Aligned) LTF", location: pinescript.location.belowbar, color: pinescript.color.new(pinescript.color.green, 0), style: pinescript.shape.labelup, size: pinescript.size.small, text: "ENTRY+", textcolor: pinescript.color.white }));
  pinescript.plotshape((bullish_dark_vis && !is_ltf_15), ({ title: "Bullish Entry (HTF Aligned)", location: pinescript.location.belowbar, color: pinescript.color.new(pinescript.color.green, 0), style: pinescript.shape.labelup, size: pinescript.size.small, text: "BUY+", textcolor: pinescript.color.white }));
  pinescript.plotshape((bearish_light_vis && is_ltf_15), ({ title: "Bearish Entry (Normal) LTF", location: pinescript.location.abovebar, color: pinescript.color.new(pinescript.color.red, 40), style: pinescript.shape.labeldown, size: pinescript.size.small, text: "ENTRY", textcolor: pinescript.color.white }));
  pinescript.plotshape((bearish_light_vis && !is_ltf_15), ({ title: "Bearish Entry (Normal)", location: pinescript.location.abovebar, color: pinescript.color.new(pinescript.color.red, 40), style: pinescript.shape.labeldown, size: pinescript.size.small, text: "SELL", textcolor: pinescript.color.white }));
  pinescript.plotshape((bearish_dark_vis && is_ltf_15), ({ title: "Bearish Entry (HTF Aligned) LTF", location: pinescript.location.abovebar, color: pinescript.color.new(pinescript.color.red, 0), style: pinescript.shape.labeldown, size: pinescript.size.small, text: "ENTRY+", textcolor: pinescript.color.white }));
  pinescript.plotshape((bearish_dark_vis && !is_ltf_15), ({ title: "Bearish Entry (HTF Aligned)", location: pinescript.location.abovebar, color: pinescript.color.new(pinescript.color.red, 0), style: pinescript.shape.labeldown, size: pinescript.size.small, text: "SELL+", textcolor: pinescript.color.white }));
  pinescript.plotshape(bullish_reversal_vis, ({ title: "Bullish Entry (Reversal)", location: pinescript.location.belowbar, color: pinescript.color.new(pinescript.color.yellow, 0), style: pinescript.shape.labelup, size: pinescript.size.small, text: "⚠BUY", textcolor: pinescript.color.black }));
  pinescript.plotshape(bearish_reversal_vis, ({ title: "Bearish Entry (Reversal)", location: pinescript.location.abovebar, color: pinescript.color.new(pinescript.color.yellow, 0), style: pinescript.shape.labeldown, size: pinescript.size.small, text: "⚠SELL", textcolor: pinescript.color.black }));
  var any_bullish_flag_vis = ((bullish_light_vis || bullish_dark_vis) || bullish_reversal_vis);
  var any_bearish_flag_vis = ((bearish_light_vis || bearish_dark_vis) || bearish_reversal_vis);
  if (state.last_visible_bull_flag_bar === undefined) state.last_visible_bull_flag_bar = null;
  if (state.last_visible_bear_flag_bar === undefined) state.last_visible_bear_flag_bar = null;
  if (any_bullish_flag_vis) {
    state.last_visible_bull_flag_bar = bar_index;
  }
  if (any_bearish_flag_vis) {
    state.last_visible_bear_flag_bar = bar_index;
  }
  null;
  pinescript.color.new(pinescript.color.gray, pinescript.min((phase_bg_transparency + 2), 99));
  pinescript.color.new(pinescript.color.gray, pinescript.min((phase_bg_transparency + 2), 99));
  pinescript.color.new(pinescript.color.red, pinescript.min((phase_bg_transparency + 3), 99));
  pinescript.color.new(pinescript.color.red, phase_bg_transparency);
  pinescript.color.new(pinescript.color.green, pinescript.min((phase_bg_transparency + 3), 99));
  pinescript.color.new(pinescript.color.green, phase_bg_transparency);
  var struct_bg_color = ((state.market_structure === "bullish_indication") ? undefined : ((state.market_structure === "bullish_correction") ? undefined : ((state.market_structure === "bearish_indication") ? undefined : ((state.market_structure === "bearish_correction") ? undefined : ((state.market_structure === "consolidation") ? undefined : ((state.market_structure === "no_setup") ? undefined : undefined))))));
  var cont_bg_bar = (bullish_entry_cont_allowed || bearish_entry_cont_allowed);
  var phase_bg_allowed = (show_phase_background && !auto_hide_phase_bg);
  var bgcolor_color = (phase_bg_allowed ? (cont_bg_bar ? cont_bg_tan : struct_bg_color) : null);
  pinescript.bgcolor(bgcolor_color, ({ title: "Market Structure Phase" }));
  var table_pos_in = pinescript.inputString(({ defval: "Top Right", title: "Info Table Position", options: ["Top Right", "Top Left", "Bottom Right", "Bottom Left", "Middle Right", "Middle Left", "Top Center", "Bottom Center"], group: "Info Table" }));
  var table_pos = ((table_pos_in === "Top Right") ? pinescript.position.top_right : ((table_pos_in === "Top Left") ? pinescript.position.top_left : ((table_pos_in === "Bottom Right") ? pinescript.position.bottom_right : ((table_pos_in === "Bottom Left") ? pinescript.position.bottom_left : ((table_pos_in === "Middle Right") ? pinescript.position.middle_right : ((table_pos_in === "Middle Left") ? pinescript.position.middle_left : ((table_pos_in === "Top Center") ? pinescript.position.top_center : pinescript.position.bottom_center)))))));
  var bg = chart.bg_color;
  var lum = (((pinescript.color.r(bg) + pinescript.color.g(bg)) + pinescript.color.b(bg)) / 3);
  var is_dark = (lum < 128);
  var T_TABLE_BG = (is_dark ? pinescript.color.new(pinescript.color.black, 85) : pinescript.color.new(pinescript.color.white, 90));
  var T_HDR_BG = (is_dark ? pinescript.color.new(pinescript.color.gray, 80) : pinescript.color.new(pinescript.color.gray, 70));
  var T_VAL_BG = (is_dark ? pinescript.color.new(pinescript.color.black, 70) : pinescript.color.new(pinescript.color.white, 10));
  var T_ENTRY_BG = (is_dark ? pinescript.color.new(pinescript.color.black, 85) : pinescript.color.new(pinescript.color.white, 100));
  var T_TEXT = (is_dark ? pinescript.color.white : pinescript.color.black);
  var T_NEUTRAL_BG = (is_dark ? pinescript.color.new(pinescript.color.gray, 80) : pinescript.color.new(pinescript.color.gray, 85));
  var T_BULL_BG = (is_dark ? pinescript.color.new(pinescript.color.green, 65) : pinescript.color.new(pinescript.color.green, 70));
  var T_BEAR_BG = (is_dark ? pinescript.color.new(pinescript.color.red, 65) : pinescript.color.new(pinescript.color.red, 70));
  var T_WARN_BG = (is_dark ? pinescript.color.new(pinescript.color.orange, 55) : pinescript.color.new(pinescript.color.orange, 65));
  function f_phase_bg(_is_bull, _is_bear) {
    return (_is_bull ? T_BULL_BG : (_is_bear ? T_BEAR_BG : T_NEUTRAL_BG));
  }
  if (state.info_table === undefined) state.info_table = null;
  if (state._last_pos_in === undefined) state._last_pos_in = null;
  if (barstate.islast) {
    var pos_changed = (pinescript.na(state._last_pos_in) || (state._last_pos_in !== table_pos_in));
    state._last_pos_in = table_pos_in;
    if ((pinescript.na(state.info_table) || pos_changed)) {
      state.info_table = pinescript.table.new(table_pos, 2, 19, ({ bgcolor: T_TABLE_BG, border_width: 1 }));
    }
    var is_bullish_phase = pinescript.strContains(state.market_structure, "bullish");
    var is_bearish_phase = pinescript.strContains(state.market_structure, "bearish");
    var phase_color = f_phase_bg(is_bullish_phase, is_bearish_phase);
    if (is_ltf_15) {
      pinescript.table.cell(state.info_table, 0, 0, "ICC Phase:", ({ text_color: T_TEXT, bgcolor: T_ENTRY_BG }));
      pinescript.table.cell(state.info_table, 1, 0, "ICC ENTRY MODE", ({ text_color: T_TEXT, bgcolor: T_ENTRY_BG }));
    } else {
      pinescript.table.cell(state.info_table, 0, 0, "ICC Phase:", ({ text_color: T_TEXT, bgcolor: T_HDR_BG }));
      state.market_structure;
      "Neutral Range";
      "Bearish Correction";
      "Bearish Indication";
      "Bullish Correction";
      "Bullish Indication";
      state.no_setup_label;
      var struct_phase_display = ((state.market_structure === "no_setup") ? undefined : ((state.market_structure === "bullish_indication") ? undefined : ((state.market_structure === "bullish_correction") ? undefined : ((state.market_structure === "bearish_indication") ? undefined : ((state.market_structure === "bearish_correction") ? undefined : ((state.market_structure === "consolidation") ? undefined : undefined))))));
      var phase_display_final = (!pinescript.na(phase_display_override) ? phase_display_override : struct_phase_display);
      var phase_bg_final = (!pinescript.na(phase_display_override) ? T_WARN_BG : phase_color);
      pinescript.table.cell(state.info_table, 1, 0, phase_display_final, ({ text_color: T_TEXT, bgcolor: phase_bg_final }));
    }
    if (is_ltf_15) {
      pinescript.table.cell(state.info_table, 0, 1, "Indication Level:", ({ text_color: T_TEXT, bgcolor: T_ENTRY_BG }));
      pinescript.table.cell(state.info_table, 1, 1, "N/A", ({ text_color: T_TEXT, bgcolor: T_ENTRY_BG }));
    } else {
      pinescript.table.cell(state.info_table, 0, 1, "Indication Level:", ({ text_color: T_TEXT, bgcolor: T_HDR_BG }));
      var indication_color = (pinescript.na(state.indication_type) ? T_NEUTRAL_BG : ((state.indication_type === "bullish") ? T_BULL_BG : T_BEAR_BG));
      pinescript.table.cell(state.info_table, 1, 1, (pinescript.na(state.indication_level) ? "None" : pinescript.strToString(state.indication_level, "#.####")), ({ text_color: T_TEXT, bgcolor: indication_color }));
    }
    pinescript.table.cell(state.info_table, 0, 2, "Last Swing High:", ({ text_color: T_TEXT, bgcolor: T_HDR_BG }));
    pinescript.table.cell(state.info_table, 1, 2, pinescript.strToString(state.last_swing_high, "#.####"), ({ text_color: T_TEXT, bgcolor: T_VAL_BG }));
    pinescript.table.cell(state.info_table, 0, 3, "Last Swing Low:", ({ text_color: T_TEXT, bgcolor: T_HDR_BG }));
    pinescript.table.cell(state.info_table, 1, 3, pinescript.strToString(state.last_swing_low, "#.####"), ({ text_color: T_TEXT, bgcolor: T_VAL_BG }));
    pinescript.table.cell(state.info_table, 0, 4, "Swing Length:", ({ text_color: T_TEXT, bgcolor: T_HDR_BG }));
    pinescript.table.cell(state.info_table, 1, 4, pinescript.strToString(swing_length), ({ text_color: T_TEXT, bgcolor: T_VAL_BG }));
    pinescript.table.cell(state.info_table, 0, 5, "Last Signal:", ({ text_color: T_TEXT, bgcolor: T_HDR_BG }));
    if (is_ltf_15) {
      var ztxt = (pinescript.na(state.last_zone_edge_entry) ? "N/A" : ((state.last_zone_edge_entry === "BULL") ? "BULL ENTRY" : "BEAR ENTRY"));
      var zbg = (pinescript.na(state.last_zone_edge_entry) ? T_NEUTRAL_BG : ((state.last_zone_edge_entry === "BULL") ? T_BULL_BG : T_BEAR_BG));
      pinescript.table.cell(state.info_table, 1, 5, ztxt, ({ text_color: T_TEXT, bgcolor: zbg }));
    } else {
      var last_sig_bull = (!pinescript.na(state.last_visible_bull_flag_bar) && (pinescript.na(state.last_visible_bear_flag_bar) || (state.last_visible_bull_flag_bar > state.last_visible_bear_flag_bar)));
      var last_sig_bear = (!pinescript.na(state.last_visible_bear_flag_bar) && (pinescript.na(state.last_visible_bull_flag_bar) || (state.last_visible_bull_flag_bar > state.last_visible_bull_flag_bar)));
      var last_signal_text = (last_sig_bull ? "Bullish (BUY)" : (last_sig_bear ? "Bearish (SELL)" : "None"));
      var last_signal_bg = (last_sig_bull ? T_BULL_BG : (last_sig_bear ? T_BEAR_BG : T_NEUTRAL_BG));
      pinescript.table.cell(state.info_table, 1, 5, last_signal_text, ({ text_color: T_TEXT, bgcolor: last_signal_bg }));
    }
    var htfPretty = f_tfPretty(resolved_htf);
    var htfPhaseHeader = (("HTF Phase (" + htfPretty) + "):");
    pinescript.table.cell(state.info_table, 0, 6, htfPhaseHeader, ({ text_color: T_TEXT, bgcolor: T_HDR_BG }));
    (pinescript.na(htf_market_structure) ? "None" : htf_market_structure);
    "Neutral Range";
    "Bearish Correction";
    "Bearish Indication";
    "Bullish Correction";
    "Bullish Indication";
    "No Setup";
    var htf_phase_display = ((htf_market_structure === "no_setup") ? undefined : ((htf_market_structure === "bullish_indication") ? undefined : ((htf_market_structure === "bullish_correction") ? undefined : ((htf_market_structure === "bearish_indication") ? undefined : ((htf_market_structure === "bearish_correction") ? undefined : ((htf_market_structure === "consolidation") ? undefined : undefined))))));
    var htf_is_bull = (!pinescript.na(htf_market_structure) && pinescript.strContains(htf_market_structure, "bullish"));
    var htf_is_bear = (!pinescript.na(htf_market_structure) && pinescript.strContains(htf_market_structure, "bearish"));
    var htf_phase_bg = f_phase_bg(htf_is_bull, htf_is_bear);
    pinescript.table.cell(state.info_table, 1, 6, htf_phase_display, ({ text_color: T_TEXT, bgcolor: htf_phase_bg }));
  }
  if (state.alert_trigger_price === undefined) state.alert_trigger_price = null;
  if (state.alert_bar_time === undefined) state.alert_bar_time = null;
  if (state.prev_entry_fire === undefined) state.prev_entry_fire = false;
  var entry_alert_fire = (any_bullish_flag_vis || any_bearish_flag_vis);
  if ((pinescript.na(state.alert_bar_time) || (time !== state.alert_bar_time))) {
    state.alert_bar_time = time;
    state.alert_trigger_price = null;
    state.prev_entry_fire = false;
  }
  var fire_edge = (entry_alert_fire && !state.prev_entry_fire);
  if ((fire_edge && pinescript.na(state.alert_trigger_price))) {
    state.alert_trigger_price = close;
  }
  state.prev_entry_fire = entry_alert_fire;
  var entry_dir = (bullish_dark_vis ? (is_ltf_15 ? "BULL ENTRY+" : "BUY+") : (bullish_light_vis ? (is_ltf_15 ? "BULL ENTRY" : "BUY") : (bullish_reversal_vis ? "⚠BUY" : (bearish_dark_vis ? (is_ltf_15 ? "BEAR ENTRY+" : "SELL+") : (bearish_light_vis ? (is_ltf_15 ? "BEAR ENTRY" : "SELL") : (bearish_reversal_vis ? "⚠SELL" : "NONE"))))));
  var alert_freq = alert.freq_once_per_bar;
  if ((alert_freq_opt === "Every Tick")) {
    alert_freq = alert.freq_all;
  } else {
    if ((alert_freq_opt === "Once Per Bar")) {
      alert_freq = alert.freq_once_per_bar;
    } else {
      alert_freq = alert.freq_once_per_bar_close;
    }
  }
  var is_close_mode = (alert_freq_opt === "Once Per Bar Close");
  var do_alert = (is_close_mode ? (entry_alert_fire && barstate.isconfirmed) : fire_edge);
  if (do_alert) {
    var ts = (is_close_mode ? time_close : (barstate.isrealtime ? timenow : time));
    var px = (is_close_mode ? close : state.alert_trigger_price);
    var time_txt = f_ts(ts);
    var price_txt = pinescript.strToString(px, format.mintick);
    var msg = ((((("ICC " + entry_dir) + " @ ") + price_txt) + " ") + time_txt);
    pinescript.alert(msg, alert_freq);
  }
  if (state.prev_correction_phase === undefined) state.prev_correction_phase = false;
  var entered_correction = (state.correction_phase && !state.prev_correction_phase);
  state.prev_correction_phase = state.correction_phase;
  pinescript.alertcondition(entered_correction, ({ title: "ICC Phase: Entered Correction", message: "ICC ENTERED CORRECTION | {{ticker}} {{interval}} | Close={{close}}" }));
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
