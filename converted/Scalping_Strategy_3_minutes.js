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
  timenow: 1782783577498,
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
  null;
  "v6_1_23";
  // Strategy: XXX
  // Options: {"shorttitle":"XXX ","overlay":true,"explicit_plot_zorder":true,"pyramiding":0,"default_qty_type":null,"default_qty_value":10,"calc_on_every_tick":false,"process_orders_on_close":true}
  var G_SCRIPT01 = ("■ " + "SAIYAN OCC");
  var res = input.timeframe("15", "TIMEFRAME", ({ group: "NON REPAINT" }));
  var useRes = pinescript.input(true, "Use Alternate Signals");
  var intRes = pinescript.input(8, "Multiplier for Alernate Signals");
  var basisType = pinescript.inputString("ALMA", "MA Type: ", ({ options: ["TEMA", "HullMA", "ALMA"] }));
  var basisLen = pinescript.inputInt(2, "MA Period", ({ minval: 1 }));
  var offsetSigma = pinescript.inputInt(5, "Offset for LSMA / Sigma for ALMA", ({ minval: 0 }));
  var offsetALMA = pinescript.inputFloat(0.85, "Offset for ALMA", ({ minval: 0, step: 0.01 }));
  var scolor = pinescript.input(false, "Show coloured Bars to indicate Trend?");
  var delayOffset = pinescript.inputInt(0, "Delay Open/Close MA", ({ minval: 0, step: 1, tooltip: "Forces Non-Repainting" }));
  var tradeType = pinescript.inputString("BOTH", "What trades should be taken : ", ({ options: ["LONG", "SHORT", "BOTH", "NONE"] }));
  var h = pinescript.input(false, "Signals for Heikin Ashi Candles");
  var swing_length = pinescript.inputInt(10, "Swing High/Low Length", ({ group: "Settings", minval: 1, maxval: 50 }));
  var history_of_demand_to_keep = pinescript.inputInt(20, "History To Keep", ({ minval: 5, maxval: 50 }));
  var box_width = pinescript.inputFloat(2.5, "Supply/Demand Box Width", ({ group: "Settings", minval: 1, maxval: 10, step: 0.5 }));
  var show_zigzag = pinescript.inputBool(false, "Show Zig Zag", ({ group: "Visual Settings", inline: "1" }));
  var show_price_action_labels = pinescript.inputBool(false, "Show Price Action Labels", ({ group: "Visual Settings", inline: "2" }));
  var supply_color = pinescript.inputColor(pinescript.color.hex("#00000000"), "Supply", ({ group: "Visual Settings", inline: "3" }));
  var supply_outline_color = pinescript.inputColor(pinescript.color.hex("#00000000"), "Outline", ({ group: "Visual Settings", inline: "3" }));
  var demand_color = pinescript.inputColor(pinescript.color.hex("#00000000"), "Demand", ({ group: "Visual Settings", inline: "4" }));
  var demand_outline_color = pinescript.inputColor(pinescript.color.hex("#00000000"), "Outline", ({ group: "Visual Settings", inline: "4" }));
  var bos_label_color = pinescript.inputColor(pinescript.color.hex("#00000000"), "BOS Label", ({ group: "Visual Settings", inline: "5" }));
  var poi_label_color = pinescript.inputColor(pinescript.color.hex("#00000000"), "POI Label", ({ group: "Visual Settings", inline: "7" }));
  var poi_border_color = pinescript.inputColor(pinescript.color.hex("#00000000"), "POI border", ({ group: "Visual Settings", inline: "7" }));
  var swing_type_color = pinescript.inputColor(pinescript.color.hex("#00000000"), "Price Action Label", ({ group: "Visual Settings", inline: "8" }));
  var zigzag_color = pinescript.inputColor(pinescript.color.hex("#00000000"), "Zig Zag", ({ group: "Visual Settings", inline: "9" }));
  function f_array_add_pop(array, new_value_to_add) {
    pinescript.arrayUnshift(pinescript.array, new_value_to_add);
    return pinescript.arrayPop(pinescript.array);
  }
  function f_sh_sl_labels(array, swing_type) {
    if (state.label_text === undefined) state.label_text = null;
    if ((swing_type === 1)) {
      if ((pinescript.arrayGet(pinescript.array, 0) >= pinescript.arrayGet(pinescript.array, 1))) {
        state.label_text = "HH";
      } else {
        state.label_text = "LH";
      }
      return pinescript.labelNew((bar_index - swing_length), pinescript.arrayGet(pinescript.array, 0), ({ text: state.label_text, style: label.style_label_down, textcolor: swing_type_color, color: swing_type_color, size: pinescript.size.tiny }));
    } else {
      if ((swing_type === -1)) {
        if ((pinescript.arrayGet(pinescript.array, 0) >= pinescript.arrayGet(pinescript.array, 1))) {
          state.label_text = "HL";
        } else {
          state.label_text = "LL";
        }
        return pinescript.labelNew((bar_index - swing_length), pinescript.arrayGet(pinescript.array, 0), ({ text: state.label_text, style: label.style_label_up, textcolor: swing_type_color, color: swing_type_color, size: pinescript.size.tiny }));
      } else {
        return null;
      }
    }
  }
  function f_check_overlapping(new_poi, box_array, atrValue) {
    var atr_threshold = (atrValue * 2);
    var okay_to_draw = true;
    for (let i = 0; i <= (pinescript.arraySize(box_array) - 1); i++) {
      var top = box.get_top(pinescript.arrayGet(box_array, i));
      var bottom = box.get_bottom(pinescript.arrayGet(box_array, i));
      var poi = ((top + bottom) / 2);
      var upper_boundary = (poi + atr_threshold);
      var lower_boundary = (poi - atr_threshold);
      if (((new_poi >= lower_boundary) && (new_poi <= upper_boundary))) {
        okay_to_draw = false;
        break;
      } else {
        okay_to_draw = true;
      }
    }
    return okay_to_draw;
  }
  function f_supply_demand(value_array, bn_array, box_array, label_array, box_type, atrValue) {
    var atr_buffer = (atrValue * (box_width / 10));
    var box_left = pinescript.arrayGet(bn_array, 0);
    var box_right = bar_index;
    if (state.box_top === undefined) state.box_top = 0;
    if (state.box_bottom === undefined) state.box_bottom = 0;
    if (state.poi === undefined) state.poi = 0;
    if ((box_type === 1)) {
      state.box_top = pinescript.arrayGet(value_array, 0);
      state.box_bottom = (state.box_top - atr_buffer);
      state.poi = ((state.box_top + state.box_bottom) / 2);
    } else {
      if ((box_type === -1)) {
        state.box_bottom = pinescript.arrayGet(value_array, 0);
        state.box_top = (state.box_bottom + atr_buffer);
        state.poi = ((state.box_top + state.box_bottom) / 2);
      }
    }
    var okay_to_draw = f_check_overlapping(state.poi, box_array, atrValue);
    if (((box_type === 1) && okay_to_draw)) {
      pinescript.boxDelete(pinescript.arrayGet(box_array, (pinescript.arraySize(box_array) - 1)));
      f_array_add_pop(box_array, pinescript.boxNew(({ left: box_left, top: state.box_top, right: box_right, bottom: state.box_bottom, border_color: supply_outline_color, bgcolor: supply_color, extend: extend.right, text: "SUPPLY", text_halign: pinescript.text.align_center, text_valign: pinescript.text.align_center, text_color: poi_label_color, text_size: pinescript.size.small, xloc: xloc.bar_index })));
      pinescript.boxDelete(pinescript.arrayGet(label_array, (pinescript.arraySize(label_array) - 1)));
      return f_array_add_pop(label_array, pinescript.boxNew(({ left: box_left, top: state.poi, right: box_right, bottom: state.poi, border_color: poi_border_color, bgcolor: poi_border_color, extend: extend.right, text: "POI", text_halign: pinescript.text.align_left, text_valign: pinescript.text.align_center, text_color: poi_label_color, text_size: pinescript.size.small, xloc: xloc.bar_index })));
    } else {
      if (((box_type === -1) && okay_to_draw)) {
        pinescript.boxDelete(pinescript.arrayGet(box_array, (pinescript.arraySize(box_array) - 1)));
        f_array_add_pop(box_array, pinescript.boxNew(({ left: box_left, top: state.box_top, right: box_right, bottom: state.box_bottom, border_color: demand_outline_color, bgcolor: demand_color, extend: extend.right, text: "DEMAND", text_halign: pinescript.text.align_center, text_valign: pinescript.text.align_center, text_color: poi_label_color, text_size: pinescript.size.small, xloc: xloc.bar_index })));
        pinescript.boxDelete(pinescript.arrayGet(label_array, (pinescript.arraySize(label_array) - 1)));
        return f_array_add_pop(label_array, pinescript.boxNew(({ left: box_left, top: state.poi, right: box_right, bottom: state.poi, border_color: poi_border_color, bgcolor: poi_border_color, extend: extend.right, text: "POI", text_halign: pinescript.text.align_left, text_valign: pinescript.text.align_center, text_color: poi_label_color, text_size: pinescript.size.small, xloc: xloc.bar_index })));
      } else {
        return null;
      }
    }
  }
  function f_sd_to_bos(box_array, bos_array, label_array, zone_type) {
    if ((zone_type === 1)) {
      for (let i = 0; i <= (pinescript.arraySize(box_array) - 1); i++) {
        var level_to_break = box.get_top(pinescript.arrayGet(box_array, i));
        if ((close >= level_to_break)) {
          var copied_box = box.copy(pinescript.arrayGet(box_array, i));
          f_array_add_pop(bos_array, copied_box);
          var mid = ((box.get_top(pinescript.arrayGet(box_array, i)) + box.get_bottom(pinescript.arrayGet(box_array, i))) / 2);
          box.set_top(pinescript.arrayGet(bos_array, 0), mid);
          box.set_bottom(pinescript.arrayGet(bos_array, 0), mid);
          box.set_extend(pinescript.arrayGet(bos_array, 0), extend.none);
          box.set_right(pinescript.arrayGet(bos_array, 0), bar_index);
          box.set_text(pinescript.arrayGet(bos_array, 0), "BOS");
          box.set_text_color(pinescript.arrayGet(bos_array, 0), bos_label_color);
          box.set_text_size(pinescript.arrayGet(bos_array, 0), pinescript.size.small);
          box.set_text_halign(pinescript.arrayGet(bos_array, 0), pinescript.text.align_center);
          box.set_text_valign(pinescript.arrayGet(bos_array, 0), pinescript.text.align_center);
          pinescript.boxDelete(pinescript.arrayGet(box_array, i));
          pinescript.boxDelete(pinescript.arrayGet(label_array, i));
        }
      }
    }
    if ((zone_type === -1)) {
      for (let i = 0; i <= (pinescript.arraySize(box_array) - 1); i++) {
        level_to_break = box.get_bottom(pinescript.arrayGet(box_array, i));
        if ((close <= level_to_break)) {
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
          pinescript.boxDelete(pinescript.arrayGet(box_array, i));
          pinescript.boxDelete(pinescript.arrayGet(label_array, i));
        }
      }
    } else {
      return null;
    }
  }
  function f_extend_box_endpoint(box_array) {
    for (let i = 0; i <= (pinescript.arraySize(box_array) - 1); i++) {
      box.set_right(pinescript.arrayGet(box_array, i), (bar_index + 100));
    }
  }
  var stratRes = (timeframe.ismonthly ? pinescript.strToString((timeframe.multiplier * intRes), "###M") : (timeframe.isweekly ? pinescript.strToString((timeframe.multiplier * intRes), "###W") : (timeframe.isdaily ? pinescript.strToString((timeframe.multiplier * intRes), "###D") : (timeframe.isintraday ? pinescript.strToString((timeframe.multiplier * intRes), "####") : "60"))));
  var src = (h ? pinescript.requestSecurity(ticker.heikinashi(syminfo.tickerid), timeframe.period, close, ({ lookahead: barmerge.lookahead_off })) : close);
  var atrValue = pinescript.atr(50);
  var swing_high = pinescript.ta.pivothigh(high, swing_length, swing_length);
  var swing_low = pinescript.ta.pivotlow(low, swing_length, swing_length);
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
    f_array_add_pop(state.swing_high_values, swing_high);
    f_array_add_pop(state.swing_high_bns, pinescript.hist(0, bar_index, swing_length));
    if (show_price_action_labels) {
      f_sh_sl_labels(state.swing_high_values, 1);
    }
    f_supply_demand(state.swing_high_values, state.swing_high_bns, state.current_supply_box, state.current_supply_poi, 1, atrValue);
  } else {
    if (!pinescript.na(swing_low)) {
      f_array_add_pop(state.swing_low_values, swing_low);
      f_array_add_pop(state.swing_low_bns, pinescript.hist(1, bar_index, swing_length));
      if (show_price_action_labels) {
        f_sh_sl_labels(state.swing_low_values, -1);
      }
      f_supply_demand(state.swing_low_values, state.swing_low_bns, state.current_demand_box, state.current_demand_poi, -1, atrValue);
    }
  }
  f_sd_to_bos(state.current_supply_box, state.supply_bos, state.current_supply_poi, 1);
  f_sd_to_bos(state.current_demand_box, state.demand_bos, state.current_demand_poi, -1);
  f_extend_box_endpoint(state.current_supply_box);
  f_extend_box_endpoint(state.current_demand_box);
  var channelBal = pinescript.inputBool(false, "Channel Balance", ({ group: "CHART" }));
  function lr_slope(_src, _len) {
    var x = 0;
    var y = 0;
    var x2 = 0;
    var xy = 0;
    for (let i = 0; i <= (_len - 1); i++) {
      var val = pinescript.hist(2, _src, i);
      var per = (i + 1);
      x += per;
      y += val;
      x2 += (per * per);
      xy += (val * per);
    }
    var _slp = (((_len * xy) - (x * y)) / ((_len * x2) - (x * x)));
    var _avg = (y / _len);
    var _int = ((_avg - ((_slp * x) / _len)) + _slp);
    return [_slp, _avg, _int];
  }
  function lr_dev(_src, _len, _slp, _avg, _int) {
    var upDev = 0;
    var dnDev = 0;
    var val = _int;
    for (let j = 0; j <= (_len - 1); j++) {
      var price = (pinescript.hist(3, high, j) - val);
      if ((price > upDev)) {
        upDev = price;
      }
      price = (val - pinescript.hist(4, low, j));
      if ((price > dnDev)) {
        dnDev = price;
      }
      price = pinescript.hist(5, _src, j);
      val += _slp;
    }
    return [upDev, dnDev];
  }
  var [, upperKC1, lowerKC1] = pinescript.unpack(pinescript.kc(close, 80, 10.5), 3);
  var [, upperKC2, lowerKC2] = pinescript.unpack(pinescript.kc(close, 80, 9.5), 3);
  var [, upperKC3, lowerKC3] = pinescript.unpack(pinescript.kc(close, 80, 8), 3);
  var [, upperKC4, lowerKC4] = pinescript.unpack(pinescript.kc(close, 80, 3), 3);
  var barsL = 10;
  var barsR = 10;
  var pivotHigh = pinescript.fixnan(pinescript.hist(6, pinescript.ta.pivothigh(barsL, barsR), 1));
  var pivotLow = pinescript.fixnan(pinescript.hist(7, pinescript.ta.pivotlow(barsL, barsR), 1));
  var source = close;
  var period = 150;
  var [s, a, i] = pinescript.unpack(lr_slope(source, period), 3);
  var [upDev, dnDev] = pinescript.unpack(lr_dev(source, period, s, a, i), 2);
  var y1 = (low - (pinescript.atr(30) * 2));
  var y1B = (low - pinescript.atr(30));
  var y2 = (high + (pinescript.atr(30) * 2));
  var y2B = (high + pinescript.atr(30));
  var x1 = ((bar_index - period) + 1);
  var _y1 = (i + (s * (period - 1)));
  var x2 = bar_index;
  var _y2 = i;
  function get_line_style(style) {
    line.style_dotted;
    line.style_dashed;
    line.style_solid;
    var out = ((style === "???") ? undefined : ((style === "----") ? undefined : ((style === "    ") ? undefined : null)));
  }
  function get_coordinates(condition, top, btm, ob_val) {
    if (state.ob_top === undefined) state.ob_top = pinescript.arrayNew(0);
    if (state.ob_btm === undefined) state.ob_btm = pinescript.arrayNew(0);
    if (state.ob_avg === undefined) state.ob_avg = pinescript.arrayNew(0);
    if (state.ob_left === undefined) state.ob_left = pinescript.arrayNew(0);
    var ob = null;
    if (condition) {
      var avg = pinescript.avg(top, btm);
      pinescript.arrayUnshift(state.ob_top, top);
      pinescript.arrayUnshift(state.ob_btm, btm);
      pinescript.arrayUnshift(state.ob_avg, avg);
      ob = ob_val;
    }
    return [state.ob_top, state.ob_btm, state.ob_avg, state.ob_left, ob];
  }
  function remove_mitigated(ob_top, ob_btm, ob_left, ob_avg, target, bull) {
    var mitigated = false;
    var target_array = (bull ? state.ob_btm : state.ob_top);
    for (const element of (target_array ?? [])) {
      var idx = pinescript.arrayIndexOf(target_array, element);
      if ((bull ? (target < element) : (target > element))) {
        mitigated = true;
        pinescript.arrayRemove(state.ob_top, idx);
        pinescript.arrayRemove(state.ob_btm, idx);
        pinescript.arrayRemove(state.ob_avg, idx);
        pinescript.arrayRemove(state.ob_left, idx);
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
    return pinescript.requestSecurity(_symbol, _res, pinescript.hist(8, _src, (barstate.isrealtime ? 1 : 0)));
  }
  var htfHigh = rp_security(syminfo.tickerid, res, high);
  var htfLow = rp_security(syminfo.tickerid, res, low);
  function smoothrng(x, t, m) {
    var wper = ((t * 2) - 1);
    var avrng = pinescript.ema(pinescript.series(10, pinescript.abs((x - pinescript.hist(9, x, 1)))), t);
    var smoothrng = (pinescript.ema(pinescript.series(11, avrng), wper) * m);
  }
  function rngfilt(x, r) {
    var rngfilt = x;
    rngfilt = ((x > pinescript.nz(pinescript.hist(12, rngfilt, 1))) ? (((x - r) < pinescript.nz(pinescript.hist(13, rngfilt, 1))) ? pinescript.nz(pinescript.hist(14, rngfilt, 1)) : (x - r)) : (((x + r) > pinescript.nz(pinescript.hist(15, rngfilt, 1))) ? pinescript.nz(pinescript.hist(16, rngfilt, 1)) : (x + r)));
  }
  function percWidth(len, perc) {
    return (((pinescript.highest(pinescript.series(17, len)) - pinescript.lowest(pinescript.series(18, len))) * perc) / 100);
  }
  function securityNoRep(sym, res, src) {
    return pinescript.requestSecurity(sym, res, src, barmerge.gaps_off, barmerge.lookahead_on);
  }
  function swingPoints(prd) {
    var pivHi = pinescript.ta.pivothigh(prd, prd);
    var pivLo = pinescript.ta.pivotlow(prd, prd);
    var last_pivHi = pinescript.valuewhen(pinescript.series(19, pivHi), pinescript.series(20, pivHi), 1);
    var last_pivLo = pinescript.valuewhen(pinescript.series(21, pivLo), pinescript.series(22, pivLo), 1);
    var hh = ((pivHi && (pivHi > last_pivHi)) ? pivHi : null);
    var lh = ((pivHi && (pivHi < last_pivHi)) ? pivHi : null);
    var hl = ((pivLo && (pivLo > last_pivLo)) ? pivLo : null);
    var ll = ((pivLo && (pivLo < last_pivLo)) ? pivLo : null);
    return [hh, lh, hl, ll];
  }
  function f_chartTfInMinutes() {
    var _resInMinutes = (timeframe.multiplier * (timeframe.isseconds ? 1 : (timeframe.isminutes ? 1 : (timeframe.isdaily ? (60 * 24) : (timeframe.isweekly ? ((60 * 24) * 7) : (timeframe.ismonthly ? ((60 * 24) * 30.4375) : null))))));
  }
  function f_kc(src, len, sensitivity) {
    var basis = pinescript.sma(pinescript.series(23, src), len);
    var span = pinescript.atr(len);
    return [(basis + (span * sensitivity)), (basis - (span * sensitivity))];
  }
  function wavetrend(src, chlLen, avgLen) {
    var esa = pinescript.ema(pinescript.series(24, src), chlLen);
    var d = pinescript.ema(pinescript.series(25, pinescript.abs((src - esa))), chlLen);
    var ci = ((src - esa) / (0.015 * d));
    var wt1 = pinescript.ema(pinescript.series(26, ci), avgLen);
    var wt2 = pinescript.sma(pinescript.series(27, wt1), 3);
    return [wt1, wt2];
  }
  function f_top_fractal(_src) {
    return ((((pinescript.hist(28, _src, 4) < pinescript.hist(29, _src, 2)) && (pinescript.hist(30, _src, 3) < pinescript.hist(31, _src, 2))) && (pinescript.hist(32, _src, 2) > pinescript.hist(33, _src, 1))) && (pinescript.hist(34, _src, 2) > pinescript.hist(35, _src, 0)));
  }
  function f_bot_fractal(_src) {
    return ((((pinescript.hist(36, _src, 4) > pinescript.hist(37, _src, 2)) && (pinescript.hist(38, _src, 3) > pinescript.hist(39, _src, 2))) && (pinescript.hist(40, _src, 2) < pinescript.hist(41, _src, 1))) && (pinescript.hist(42, _src, 2) < pinescript.hist(43, _src, 0)));
  }
  var top_fractal = f_top_fractal(src);
  var bot_fractal = f_bot_fractal(src);
  function f_fractalize(_src) {
    return (top_fractal ? 1 : (bot_fractal ? -1 : 0));
  }
  function f_findDivs(src, topLimit, botLimit) {
    var fractalTop = (((f_fractalize(src) > 0) && (pinescript.hist(44, src, 2) >= topLimit)) ? pinescript.hist(45, src, 2) : null);
    var fractalBot = (((f_fractalize(src) < 0) && (pinescript.hist(46, src, 2) <= botLimit)) ? pinescript.hist(47, src, 2) : null);
    var highPrev = pinescript.hist(48, pinescript.valuewhen(pinescript.series(50, fractalTop), pinescript.series(51, pinescript.hist(49, src, 2)), 0), 2);
    var highPrice = pinescript.hist(52, pinescript.valuewhen(pinescript.series(54, fractalTop), pinescript.series(55, pinescript.hist(53, high, 2)), 0), 2);
    var lowPrev = pinescript.hist(56, pinescript.valuewhen(pinescript.series(58, fractalBot), pinescript.series(59, pinescript.hist(57, src, 2)), 0), 2);
    var lowPrice = pinescript.hist(60, pinescript.valuewhen(pinescript.series(62, fractalBot), pinescript.series(63, pinescript.hist(61, low, 2)), 0), 2);
    var bearSignal = ((fractalTop && (pinescript.hist(64, high, 1) > highPrice)) && (pinescript.hist(65, src, 1) < highPrev));
    var bullSignal = ((fractalBot && (pinescript.hist(66, low, 1) < lowPrice)) && (pinescript.hist(67, src, 1) > lowPrev));
    return [bearSignal, bullSignal];
  }
  var enableSR = pinescript.input(false, "SR On/Off", ({ group: "SR" }));
  var colorSup = pinescript.input(pinescript.color.hex("#00000000"), "Support Color", ({ group: "SR" }));
  var colorRes = pinescript.input(pinescript.color.hex("#00000000"), "Resistance Color", ({ group: "SR" }));
  var strengthSR = pinescript.inputInt(2, "S/R Strength", 1, ({ group: "SR" }));
  var lineStyle = pinescript.inputString("Dotted", "Line Style", ["Solid", "Dotted", "Dashed"], ({ group: "SR" }));
  var lineWidth = pinescript.inputInt(2, "S/R Line Width", 1, ({ group: "SR" }));
  var useZones = pinescript.input(true, "Zones On/Off", ({ group: "SR" }));
  var useHLZones = pinescript.input(true, "High Low Zones On/Off", ({ group: "SR" }));
  var zoneWidth = pinescript.inputInt(2, "Zone Width %", 0, ({ tooltip: "it's calculated using % of the distance between highest/lowest in last 300 bars", group: "SR" }));
  var expandSR = pinescript.input(true, "Expand SR");
  var rb = 10;
  var prd = 284;
  var ChannelW = 10;
  var label_loc = 55;
  var style = ((lineStyle === "Solid") ? line.style_solid : ((lineStyle === "Dotted") ? line.style_dotted : line.style_dashed));
  var ph = pinescript.ta.pivothigh(rb, rb);
  var pl = pinescript.ta.pivotlow(rb, rb);
  var sr_levels = pinescript.arrayNew(21, null);
  var prdhighest = pinescript.highest(pinescript.series(68, prd));
  var prdlowest = pinescript.lowest(pinescript.series(69, prd));
  var cwidth = percWidth(prd, ChannelW);
  var zonePerc = percWidth(300, zoneWidth);
  var aas = pinescript.arrayNew(41, true);
  var u1 = 0;
  u1 = pinescript.nz(pinescript.hist(70, u1, 1));
  var d1 = 0;
  d1 = pinescript.nz(pinescript.hist(71, d1, 1));
  var highestph = 0;
  highestph = pinescript.hist(72, highestph, 1);
  var lowestpl = 0;
  lowestpl = pinescript.hist(73, lowestpl, 1);
  if (state.sr_levs === undefined) state.sr_levs = pinescript.arrayNew(21, null);
  var hlabel = null;
  pinescript.labelDelete(pinescript.hist(74, hlabel, 1));
  var llabel = null;
  pinescript.labelDelete(pinescript.hist(75, llabel, 1));
  if (state.sr_lines === undefined) state.sr_lines = pinescript.arrayNew(21, null);
  if (state.sr_linesH === undefined) state.sr_linesH = pinescript.arrayNew(21, null);
  if (state.sr_linesL === undefined) state.sr_linesL = pinescript.arrayNew(21, null);
  if (state.sr_linesF === undefined) state.sr_linesF = pinescript.arrayNew(21, null);
  if (state.sr_labels === undefined) state.sr_labels = pinescript.arrayNew(21, null);
  if ((ph || pl)) {
    for (let x = 0; x <= (pinescript.arraySize(sr_levels) - 1); x++) {
      pinescript.arraySet(sr_levels, x, null);
    }
    highestph = prdlowest;
    lowestpl = prdhighest;
    var countpp = 0;
    for (let x = 0; x <= prd; x++) {
      if (pinescript.na(pinescript.hist(76, close, x))) {
        break;
      }
      if ((!pinescript.na(pinescript.hist(77, ph, x)) || !pinescript.na(pinescript.hist(78, pl, x)))) {
        highestph = pinescript.max(highestph, pinescript.nz(pinescript.hist(79, ph, x), prdlowest), pinescript.nz(pinescript.hist(80, pl, x), prdlowest));
        lowestpl = pinescript.min(lowestpl, pinescript.nz(pinescript.hist(81, ph, x), prdhighest), pinescript.nz(pinescript.hist(82, pl, x), prdhighest));
        countpp += 1;
        if ((countpp > 40)) {
          break;
        }
        if (pinescript.arrayGet(aas, countpp)) {
          var upl = ((pinescript.hist(83, ph, x) ? pinescript.hist(84, high, (x + rb)) : pinescript.hist(85, low, (x + rb))) + cwidth);
          var dnl = ((pinescript.hist(86, ph, x) ? pinescript.hist(87, high, (x + rb)) : pinescript.hist(88, low, (x + rb))) - cwidth);
          u1 = ((countpp === 1) ? upl : u1);
          d1 = ((countpp === 1) ? dnl : d1);
          var tmp = pinescript.arrayNew(41, true);
          var cnt = 0;
          var tpoint = 0;
          for (let xx = 0; xx <= prd; xx++) {
            if (pinescript.na(pinescript.hist(89, close, xx))) {
              break;
            }
            if ((!pinescript.na(pinescript.hist(90, ph, xx)) || !pinescript.na(pinescript.hist(91, pl, xx)))) {
              var chg = false;
              cnt += 1;
              if ((cnt > 40)) {
                break;
              }
              if (pinescript.arrayGet(aas, cnt)) {
                if (!pinescript.na(pinescript.hist(92, ph, xx))) {
                  if (((pinescript.hist(93, high, (xx + rb)) <= upl) && (pinescript.hist(94, high, (xx + rb)) >= dnl))) {
                    tpoint += 1;
                    chg = true;
                  }
                }
                if (!pinescript.na(pinescript.hist(95, pl, xx))) {
                  if (((pinescript.hist(96, low, (xx + rb)) <= upl) && (pinescript.hist(97, low, (xx + rb)) >= dnl))) {
                    tpoint += 1;
                    chg = true;
                  }
                }
              }
              if ((chg && (cnt < 41))) {
                pinescript.arraySet(tmp, cnt, false);
              }
            }
          }
          if ((tpoint >= strengthSR)) {
            for (let g = 0; g <= 40; g++) {
              if (!pinescript.arrayGet(tmp, g)) {
                pinescript.arraySet(aas, g, false);
              }
            }
            if ((pinescript.hist(98, ph, x) && (countpp < 21))) {
              pinescript.arraySet(sr_levels, countpp, pinescript.hist(99, high, (x + rb)));
            }
            if ((pinescript.hist(100, pl, x) && (countpp < 21))) {
              pinescript.arraySet(sr_levels, countpp, pinescript.hist(101, low, (x + rb)));
            }
          }
        }
      }
    }
  }
  if (state.highest_ === undefined) state.highest_ = null;
  pinescript.lineDelete(state.highest_);
  if (state.lowest_ === undefined) state.lowest_ = null;
  pinescript.lineDelete(state.lowest_);
  if (state.highest_fill1 === undefined) state.highest_fill1 = null;
  pinescript.lineDelete(state.highest_fill1);
  if (state.highest_fill2 === undefined) state.highest_fill2 = null;
  pinescript.lineDelete(state.highest_fill2);
  if (state.lowest_fill1 === undefined) state.lowest_fill1 = null;
  pinescript.lineDelete(state.lowest_fill1);
  if (state.lowest_fill2 === undefined) state.lowest_fill2 = null;
  pinescript.lineDelete(state.lowest_fill2);
  var hi_col = ((close >= highestph) ? colorSup : colorRes);
  var lo_col = ((close >= lowestpl) ? colorSup : colorRes);
  if (enableSR) {
    state.highest_ = pinescript.lineNew((bar_index - 311), highestph, bar_index, highestph, xloc.bar_index, (expandSR ? extend.both : extend.right), hi_col, style, lineWidth);
    state.lowest_ = pinescript.lineNew((bar_index - 311), lowestpl, bar_index, lowestpl, xloc.bar_index, (expandSR ? extend.both : extend.right), lo_col, style, lineWidth);
    if (useHLZones) {
      state.highest_fill1 = pinescript.lineNew((bar_index - 311), (highestph + zonePerc), bar_index, (highestph + zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null);
      state.highest_fill2 = pinescript.lineNew((bar_index - 311), (highestph - zonePerc), bar_index, (highestph - zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null);
      state.lowest_fill1 = pinescript.lineNew((bar_index - 311), (lowestpl + zonePerc), bar_index, (lowestpl + zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null);
      state.lowest_fill2 = pinescript.lineNew((bar_index - 311), (lowestpl - zonePerc), bar_index, (lowestpl - zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null);
      linefill.new(state.highest_fill1, state.highest_fill2, hi_col);
      linefill.new(state.lowest_fill1, state.lowest_fill2, lo_col);
    }
  }
  if ((ph || pl)) {
    for (let x = 0; x <= (pinescript.arraySize(state.sr_lines) - 1); x++) {
      pinescript.arraySet(state.sr_levs, x, pinescript.arrayGet(sr_levels, x));
    }
  }
  for (let x = 0; x <= (pinescript.arraySize(state.sr_lines) - 1); x++) {
    pinescript.lineDelete(pinescript.arrayGet(state.sr_lines, x));
    pinescript.lineDelete(pinescript.arrayGet(state.sr_linesH, x));
    pinescript.lineDelete(pinescript.arrayGet(state.sr_linesL, x));
    linefill.delete(pinescript.arrayGet(state.sr_linesF, x));
    if ((pinescript.arrayGet(state.sr_levs, x) && enableSR)) {
      var line_col = ((close >= pinescript.arrayGet(state.sr_levs, x)) ? colorSup : colorRes);
      pinescript.arraySet(state.sr_lines, x, pinescript.lineNew((bar_index - 355), pinescript.arrayGet(state.sr_levs, x), bar_index, pinescript.arrayGet(state.sr_levs, x), xloc.bar_index, (expandSR ? extend.both : extend.right), line_col, style, lineWidth));
      if (useZones) {
        pinescript.arraySet(state.sr_linesH, x, pinescript.lineNew((bar_index - 355), (pinescript.arrayGet(state.sr_levs, x) + zonePerc), bar_index, (pinescript.arrayGet(state.sr_levs, x) + zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null));
        pinescript.arraySet(state.sr_linesL, x, pinescript.lineNew((bar_index - 355), (pinescript.arrayGet(state.sr_levs, x) - zonePerc), bar_index, (pinescript.arrayGet(state.sr_levs, x) - zonePerc), xloc.bar_index, (expandSR ? extend.both : extend.right), null));
        pinescript.arraySet(state.sr_linesF, x, linefill.new(pinescript.arrayGet(state.sr_linesH, x), pinescript.arrayGet(state.sr_linesL, x), line_col));
      }
    }
  }
  for (let x = 0; x <= (pinescript.arraySize(state.sr_labels) - 1); x++) {
    pinescript.labelDelete(pinescript.arrayGet(state.sr_labels, x));
    if ((pinescript.arrayGet(state.sr_levs, x) && enableSR)) {
      var lab_loc = ((close >= pinescript.arrayGet(state.sr_levs, x)) ? label.style_label_up : label.style_label_down);
      var lab_col = ((close >= pinescript.arrayGet(state.sr_levs, x)) ? colorSup : colorRes);
      pinescript.arraySet(state.sr_labels, x, pinescript.labelNew((bar_index + label_loc), pinescript.arrayGet(state.sr_levs, x), pinescript.strToString(pinescript.math.round_to_mintick(pinescript.arrayGet(state.sr_levs, x))), ({ color: lab_col, textcolor: pinescript.color.hex("#000000"), style: lab_loc })));
    }
  }
  hlabel = (enableSR ? pinescript.labelNew(((bar_index + label_loc) + (pinescript.round(pinescript.sign(label_loc)) * 20)), highestph, ("High Level : " + pinescript.strToString(highestph)), ({ color: hi_col, textcolor: pinescript.color.hex("#000000"), style: label.style_label_down })) : null);
  llabel = (enableSR ? pinescript.labelNew(((bar_index + label_loc) + (pinescript.round(pinescript.sign(label_loc)) * 20)), lowestpl, ("Low  Level : " + pinescript.strToString(lowestpl)), ({ color: lo_col, textcolor: pinescript.color.hex("#000000"), style: label.style_label_up })) : null);
  var rsi = pinescript.rsi(pinescript.series(102, close), 28);
  var rsiOb = ((rsi > 65) && (rsi > pinescript.ema(pinescript.series(103, rsi), 10)));
  var rsiOs = ((rsi < 35) && (rsi < pinescript.ema(pinescript.series(104, rsi), 10)));
  var dHigh = securityNoRep(syminfo.tickerid, "D", pinescript.hist(105, high, 1));
  var dLow = securityNoRep(syminfo.tickerid, "D", pinescript.hist(106, low, 1));
  var dClose = securityNoRep(syminfo.tickerid, "D", pinescript.hist(107, close, 1));
  var ema = pinescript.ema(pinescript.series(108, close), 144);
  var emaBull = (close > ema);
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
    var bull_ = null;
    bull_ = (equal_tf(res) ? src : bull_);
    bull_ = (higher_tf(res) ? pinescript.requestSecurity(sym, res, src, barmerge.gaps_off, barmerge.lookahead_on) : bull_);
    var bull_array = request.security_lower_tf(syminfo.tickerid, (higher_tf(res) ? (pinescript.strToString(f_chartTfInMinutes()) + (timeframe.isseconds ? "S" : "")) : (too_small_tf(res) ? (timeframe.isweekly ? "3" : "10") : res)), src);
    if ((((pinescript.arraySize(bull_array) > 1) && !equal_tf(res)) && !higher_tf(res))) {
      bull_ = pinescript.arrayPop(bull_array);
    }
    pinescript.arrayClear(bull_array);
    return bull_;
  }
  function variant(type, src, len, offSig, offALMA) {
    var v1 = pinescript.sma(pinescript.series(109, src), len);
    var v2 = pinescript.ema(pinescript.series(110, src), len);
    var v3 = ((2 * v2) - pinescript.ema(pinescript.series(111, v2), len));
    var v4 = ((3 * (v2 - pinescript.ema(pinescript.series(112, v2), len))) + pinescript.ema(pinescript.series(114, pinescript.ema(pinescript.series(113, v2), len)), len));
    var v5 = pinescript.wma(pinescript.series(115, src), len);
    var v6 = pinescript.vwma(src, len);
    var v7 = 0;
    var sma_1 = pinescript.sma(pinescript.series(116, src), len);
    v7 = (pinescript.na(pinescript.hist(117, v7, 1)) ? sma_1 : (((pinescript.hist(118, v7, 1) * (len - 1)) + src) / len));
    var v8 = pinescript.wma(pinescript.series(121, ((2 * pinescript.wma(pinescript.series(119, src), (len / 2))) - pinescript.wma(pinescript.series(120, src), len))), pinescript.round(pinescript.sqrt(len)));
    var v9 = pinescript.linreg(pinescript.series(122, src), len, offSig);
    var v10 = pinescript.alma(pinescript.series(123, src), len, offALMA, offSig);
    var v11 = pinescript.sma(pinescript.series(124, v1), len);
    var a1 = pinescript.exp(((-1.414 * 3.14159) / len));
    var b1 = ((2 * a1) * pinescript.cos(((1.414 * 3.14159) / len)));
    var c2 = b1;
    var c3 = (-a1 * a1);
    var c1 = ((1 - c2) - c3);
    var v12 = 0;
    v12 = ((((c1 * (src + pinescript.nz(pinescript.hist(125, src, 1)))) / 2) + (c2 * pinescript.nz(pinescript.hist(126, v12, 1)))) + (c3 * pinescript.nz(pinescript.hist(127, v12, 2))));
    return ((type === "EMA") ? v2 : ((type === "DEMA") ? v3 : ((type === "TEMA") ? v4 : ((type === "WMA") ? v5 : ((type === "VWMA") ? v6 : ((type === "SMMA") ? v7 : ((type === "HullMA") ? v8 : ((type === "LSMA") ? v9 : ((type === "ALMA") ? v10 : ((type === "TMA") ? v11 : ((type === "SSMA") ? v12 : v1)))))))))));
  }
  function reso(exp, use, res) {
    var security_1 = pinescript.requestSecurity(syminfo.tickerid, res, exp, ({ gaps: barmerge.gaps_off, lookahead: barmerge.lookahead_on }));
    return (use ? security_1 : exp);
  }
  var closeSeries = variant(basisType, pinescript.hist(128, close, delayOffset), basisLen, offsetSigma, offsetALMA);
  var openSeries = variant(basisType, pinescript.hist(129, open, delayOffset), basisLen, offsetSigma, offsetALMA);
  var closeSeriesAlt = reso(closeSeries, useRes, stratRes);
  var openSeriesAlt = reso(openSeries, useRes, stratRes);
  var lxTrigger = false;
  var sxTrigger = false;
  var leTrigger = pinescript.crossover(pinescript.series(130, closeSeriesAlt), pinescript.series(131, openSeriesAlt));
  var seTrigger = pinescript.crossunder(pinescript.series(132, closeSeriesAlt), pinescript.series(133, openSeriesAlt));
  var G_RISK = ("■ " + "Risk Management");
  var T_LVL = "(%) Exit Level";
  var T_QTY = "(%) Adjust trade exit volume";
  var T_MSG = "Paste JSON message for your bot";
  var O_LEMSG = "Long Entry";
  var O_LXMSGSL = "Long SL";
  var O_LXMSGTP1 = "Long TP1";
  var O_LXMSGTP2 = "Long TP2";
  var O_LXMSGTP3 = "Long TP3";
  var O_LXMSG = "Long Exit";
  var O_SEMSG = "Short Entry";
  var O_SXMSGSL = "Short SL";
  var O_SXMSGA = "Short TP1";
  var O_SXMSGB = "Short TP2";
  var O_SXMSGC = "Short TP3";
  var O_SXMSGX = "Short Exit";
  var i_lxLvlTP1 = pinescript.inputFloat(1, "Level TP1", ({ group: G_RISK, tooltip: T_LVL }));
  var i_lxQtyTP1 = pinescript.inputFloat(50, "Qty   TP1", ({ group: G_RISK, tooltip: T_QTY }));
  var i_lxLvlTP2 = pinescript.inputFloat(1.5, "Level TP2", ({ group: G_RISK, tooltip: T_LVL }));
  var i_lxQtyTP2 = pinescript.inputFloat(30, "Qty   TP2", ({ group: G_RISK, tooltip: T_QTY }));
  var i_lxLvlTP3 = pinescript.inputFloat(2, "Level TP3", ({ group: G_RISK, tooltip: T_LVL }));
  var i_lxQtyTP3 = pinescript.inputFloat(20, "Qty   TP3", ({ group: G_RISK, tooltip: T_QTY }));
  var i_lxLvlSL = pinescript.inputFloat(0.5, "Stop Loss", ({ group: G_RISK, tooltip: T_LVL }));
  var i_sxLvlTP1 = i_lxLvlTP1;
  var i_sxQtyTP1 = i_lxQtyTP1;
  var i_sxLvlTP2 = i_lxLvlTP2;
  var i_sxQtyTP2 = i_lxQtyTP2;
  var i_sxLvlTP3 = i_lxLvlTP3;
  var i_sxQtyTP3 = i_lxQtyTP3;
  var i_sxLvlSL = i_lxLvlSL;
  var G_MSG = ("■ " + "Webhook Message");
  var i_leMsg = pinescript.inputString(O_LEMSG, "Long Entry", ({ group: G_MSG, tooltip: T_MSG }));
  var i_lxMsgSL = pinescript.inputString(O_LXMSGSL, "Long SL", ({ group: G_MSG, tooltip: T_MSG }));
  var i_lxMsgTP1 = pinescript.inputString(O_LXMSGTP1, "Long TP1", ({ group: G_MSG, tooltip: T_MSG }));
  var i_lxMsgTP2 = pinescript.inputString(O_LXMSGTP2, "Long TP2", ({ group: G_MSG, tooltip: T_MSG }));
  var i_lxMsgTP3 = pinescript.inputString(O_LXMSGTP3, "Long TP3", ({ group: G_MSG, tooltip: T_MSG }));
  var i_lxMsg = pinescript.inputString(O_LXMSG, "Long Exit", ({ group: G_MSG, tooltip: T_MSG }));
  var i_seMsg = pinescript.inputString(O_SEMSG, "Short Entry", ({ group: G_MSG, tooltip: T_MSG }));
  var i_sxMsgSL = pinescript.inputString(O_SXMSGSL, "Short SL", ({ group: G_MSG, tooltip: T_MSG }));
  var i_sxMsgTP1 = pinescript.inputString(O_SXMSGA, "Short TP1", ({ group: G_MSG, tooltip: T_MSG }));
  var i_sxMsgTP2 = pinescript.inputString(O_SXMSGB, "Short TP2", ({ group: G_MSG, tooltip: T_MSG }));
  var i_sxMsgTP3 = pinescript.inputString(O_SXMSGC, "Short TP3", ({ group: G_MSG, tooltip: T_MSG }));
  var i_sxMsg = pinescript.inputString(O_SXMSGX, "Short Exit", ({ group: G_MSG, tooltip: T_MSG }));
  var i_src = close;
  var G_DISPLAY = "Display";
  var i_alertOn = pinescript.inputBool(true, "Alert Labels On/Off", ({ group: G_DISPLAY }));
  var i_barColOn = pinescript.inputBool(true, "Bar Color On/Off", ({ group: G_DISPLAY }));
  function f_tp(_condition, _conditionValue, _leTrigger, _seTrigger, _src, _lxLvlTP, _sxLvlTP) {
    if (state._tpLine === undefined) state._tpLine = 0;
    var _topLvl = (_src + (_src * (_lxLvlTP / 100)));
    var _botLvl = (_src - (_src * (_sxLvlTP / 100)));
    state._tpLine = (((pinescript.hist(134, _condition, 1) !== _conditionValue) && _leTrigger) ? _topLvl : (((pinescript.hist(135, _condition, 1) !== -_conditionValue) && _seTrigger) ? _botLvl : pinescript.nz(pinescript.hist(136, state._tpLine, 1))));
    return [state._tpLine];
  }
  function f_cross(_scr1, _scr2, _over) {
    var _cross = (_over ? ((_scr1 > _scr2) && (pinescript.hist(137, _scr1, 1) < pinescript.hist(138, _scr2, 1))) : ((_scr1 < _scr2) && (pinescript.hist(139, _scr1, 1) > pinescript.hist(140, _scr2, 1))));
  }
  if (state.condition === undefined) state.condition = 0;
  if (state.slLine === undefined) state.slLine = 0;
  if (state.entryLine === undefined) state.entryLine = 0;
  state.entryLine = ((leTrigger && (pinescript.hist(141, state.condition, 1) <= 0)) ? close : ((seTrigger && (pinescript.hist(142, state.condition, 1) >= 0)) ? close : pinescript.nz(pinescript.hist(143, state.entryLine, 1))));
  var slTopLvl = (i_src + (i_src * (i_lxLvlSL / 100)));
  var slBotLvl = (i_src - (i_src * (i_sxLvlSL / 100)));
  state.slLine = (((pinescript.hist(144, state.condition, 1) <= 0) && leTrigger) ? slBotLvl : (((pinescript.hist(145, state.condition, 1) >= 0) && seTrigger) ? slTopLvl : pinescript.nz(pinescript.hist(146, state.slLine, 1))));
  var slLong = f_cross(low, state.slLine, false);
  var slShort = f_cross(high, state.slLine, true);
  var [tp3Line] = pinescript.unpack(f_tp(state.condition, 1.2, leTrigger, seTrigger, i_src, i_lxLvlTP3, i_sxLvlTP3), 1);
  var [tp2Line] = pinescript.unpack(f_tp(state.condition, 1.1, leTrigger, seTrigger, i_src, i_lxLvlTP2, i_sxLvlTP2), 1);
  var [tp1Line] = pinescript.unpack(f_tp(state.condition, 1, leTrigger, seTrigger, i_src, i_lxLvlTP1, i_sxLvlTP1), 1);
  var tp3Long = f_cross(high, tp3Line, true);
  var tp3Short = f_cross(low, tp3Line, false);
  var tp2Long = f_cross(high, tp2Line, true);
  var tp2Short = f_cross(low, tp2Line, false);
  var tp1Long = f_cross(high, tp1Line, true);
  var tp1Short = f_cross(low, tp1Line, false);
  if ((leTrigger && (pinescript.hist(147, state.condition, 1) <= 0))) {
    state.condition = 1;
  }
  else if ((seTrigger && (pinescript.hist(148, state.condition, 1) >= 0))) {
    state.condition = -1;
  }
  else if ((tp3Long && (pinescript.hist(149, state.condition, 1) === 1.2))) {
    state.condition = 1.3;
  }
  else if ((tp3Short && (pinescript.hist(150, state.condition, 1) === -1.2))) {
    state.condition = -1.3;
  }
  else if ((tp2Long && (pinescript.hist(151, state.condition, 1) === 1.1))) {
    state.condition = 1.2;
  }
  else if ((tp2Short && (pinescript.hist(152, state.condition, 1) === -1.1))) {
    state.condition = -1.2;
  }
  else if ((tp1Long && (pinescript.hist(153, state.condition, 1) === 1))) {
    state.condition = 1.1;
  }
  else if ((tp1Short && (pinescript.hist(154, state.condition, 1) === -1))) {
    state.condition = -1.1;
  }
  else if ((slLong && (pinescript.hist(155, state.condition, 1) >= 1))) {
    state.condition = 0;
  }
  else if ((slShort && (pinescript.hist(156, state.condition, 1) <= -1))) {
    state.condition = 0;
  }
  else if ((lxTrigger && (pinescript.hist(157, state.condition, 1) >= 1))) {
    state.condition = 0;
  }
  else if ((sxTrigger && (pinescript.hist(158, state.condition, 1) <= -1))) {
    state.condition = 0;
  }
  var longE = ((leTrigger && (pinescript.hist(159, state.condition, 1) <= 0)) && (state.condition === 1));
  var shortE = ((seTrigger && (pinescript.hist(160, state.condition, 1) >= 0)) && (state.condition === -1));
  var longX = ((lxTrigger && (pinescript.hist(161, state.condition, 1) >= 1)) && (state.condition === 0));
  var shortX = ((sxTrigger && (pinescript.hist(162, state.condition, 1) <= -1)) && (state.condition === 0));
  var longSL = ((slLong && (pinescript.hist(163, state.condition, 1) >= 1)) && (state.condition === 0));
  var shortSL = ((slShort && (pinescript.hist(164, state.condition, 1) <= -1)) && (state.condition === 0));
  var longTP3 = ((tp3Long && (pinescript.hist(165, state.condition, 1) === 1.2)) && (state.condition === 1.3));
  var shortTP3 = ((tp3Short && (pinescript.hist(166, state.condition, 1) === -1.2)) && (state.condition === -1.3));
  var longTP2 = ((tp2Long && (pinescript.hist(167, state.condition, 1) === 1.1)) && (state.condition === 1.2));
  var shortTP2 = ((tp2Short && (pinescript.hist(168, state.condition, 1) === -1.1)) && (state.condition === -1.2));
  var longTP1 = ((tp1Long && (pinescript.hist(169, state.condition, 1) === 1)) && (state.condition === 1.1));
  var shortTP1 = ((tp1Short && (pinescript.hist(170, state.condition, 1) === -1)) && (state.condition === -1.1));
  if ((((pinescript.strategy.position_size <= 0) && longE) && barstate.isconfirmed)) {
    pinescript.strategyEntry("Long", pinescript.strategy.long, ({ alert_message: i_leMsg, comment: "LE" }));
  }
  if (((pinescript.strategy.position_size > 0) && (state.condition === 1))) {
    pinescript.strategyExit(({ id: "LXTP1", from_entry: "Long", qty_percent: i_lxQtyTP1, limit: tp1Line, stop: state.slLine, comment_profit: "LXTP1", comment_loss: "SL", alert_profit: i_lxMsgTP1, alert_loss: i_lxMsgSL }));
  }
  if (((pinescript.strategy.position_size > 0) && (state.condition === 1.1))) {
    pinescript.strategyExit(({ id: "LXTP2", from_entry: "Long", qty_percent: i_lxQtyTP2, limit: tp2Line, stop: state.slLine, comment_profit: "LXTP2", comment_loss: "SL", alert_profit: i_lxMsgTP2, alert_loss: i_lxMsgSL }));
  }
  if (((pinescript.strategy.position_size > 0) && (state.condition === 1.2))) {
    pinescript.strategyExit(({ id: "LXTP3", from_entry: "Long", qty_percent: i_lxQtyTP3, limit: tp3Line, stop: state.slLine, comment_profit: "LXTP3", comment_loss: "SL", alert_profit: i_lxMsgTP3, alert_loss: i_lxMsgSL }));
  }
  if (longX) {
    pinescript.strategyClose("Long", ({ alert_message: i_lxMsg, comment: "LX" }));
  }
  if ((((pinescript.strategy.position_size >= 0) && shortE) && barstate.isconfirmed)) {
    pinescript.strategyEntry("Short", pinescript.strategy.short, ({ alert_message: i_leMsg, comment: "SE" }));
  }
  if (((pinescript.strategy.position_size < 0) && (state.condition === -1))) {
    pinescript.strategyExit(({ id: "SXTP1", from_entry: "Short", qty_percent: i_sxQtyTP1, limit: tp1Line, stop: state.slLine, comment_profit: "SXTP1", comment_loss: "SL", alert_profit: i_sxMsgTP1, alert_loss: i_sxMsgSL }));
  }
  if (((pinescript.strategy.position_size < 0) && (state.condition === -1.1))) {
    pinescript.strategyExit(({ id: "SXTP2", from_entry: "Short", qty_percent: i_sxQtyTP2, limit: tp2Line, stop: state.slLine, comment_profit: "SXTP2", comment_loss: "SL", alert_profit: i_sxMsgTP2, alert_loss: i_sxMsgSL }));
  }
  if (((pinescript.strategy.position_size < 0) && (state.condition === -1.2))) {
    pinescript.strategyExit(({ id: "SXTP3", from_entry: "Short", qty_percent: i_sxQtyTP3, limit: tp3Line, stop: state.slLine, comment_profit: "SXTP3", comment_loss: "SL", alert_profit: i_sxMsgTP3, alert_loss: i_sxMsgSL }));
  }
  if (shortX) {
    pinescript.strategyClose("Short", ({ alert_message: i_sxMsg, comment: "SX" }));
  }
  var c_tp = ((leTrigger || seTrigger) ? null : ((state.condition === 0) ? null : pinescript.color.green));
  var c_entry = ((leTrigger || seTrigger) ? null : ((state.condition === 0) ? null : pinescript.color.blue));
  var c_sl = ((leTrigger || seTrigger) ? null : ((state.condition === 0) ? null : pinescript.color.red));
  var p_tp1Line = pinescript.plot((((state.condition === 1) || (state.condition === -1)) ? tp1Line : null), ({ title: "TP Line 1", color: c_tp, linewidth: 1, style: plot.style_linebr }));
  var p_tp2Line = pinescript.plot((((((state.condition === 1) || (state.condition === -1)) || (state.condition === 1.1)) || (state.condition === -1.1)) ? tp2Line : null), ({ title: "TP Line 2", color: c_tp, linewidth: 1, style: plot.style_linebr }));
  var p_tp3Line = pinescript.plot((((((((state.condition === 1) || (state.condition === -1)) || (state.condition === 1.1)) || (state.condition === -1.1)) || (state.condition === 1.2)) || (state.condition === -1.2)) ? tp3Line : null), ({ title: "TP Line 3", color: c_tp, linewidth: 1, style: plot.style_linebr }));
  var p_entryLine = pinescript.plot((((state.condition >= 1) || (state.condition <= -1)) ? state.entryLine : null), ({ title: "Entry Line", color: c_entry, linewidth: 1, style: plot.style_linebr }));
  var p_slLine = pinescript.plot((((((((state.condition === 1) || (state.condition === -1)) || (state.condition === 1.1)) || (state.condition === -1.1)) || (state.condition === 1.2)) || (state.condition === -1.2)) ? state.slLine : null), ({ title: "SL Line", color: c_sl, linewidth: 1, style: plot.style_linebr }));
  pinescript.fill(p_tp3Line, p_entryLine, ({ color: ((leTrigger || seTrigger) ? null : pinescript.color.new(pinescript.color.green, 90)) }));
  pinescript.fill(p_entryLine, p_slLine, ({ color: ((leTrigger || seTrigger) ? null : pinescript.color.new(pinescript.color.red, 90)) }));
  pinescript.plotshape((i_alertOn && longE), ({ title: "Long", text: "Long", textcolor: pinescript.color.white, color: pinescript.color.green, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.belowbar }));
  pinescript.plotshape((i_alertOn && shortE), ({ title: "Short", text: "Short", textcolor: pinescript.color.white, color: pinescript.color.red, style: pinescript.shape.labeldown, size: pinescript.size.tiny, location: pinescript.location.abovebar }));
  pinescript.plotshape(((i_alertOn && (longX || shortX)) ? close : null), ({ title: "Close", text: "Close", textcolor: pinescript.color.white, color: pinescript.color.gray, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.absolute }));
  var l_tp = ((i_alertOn && (longTP1 || shortTP1)) ? close : null);
  pinescript.plotshape(l_tp, ({ title: "TP1 Cross", text: "TP1", textcolor: pinescript.color.white, color: pinescript.color.olive, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.absolute }));
  pinescript.plotshape(((i_alertOn && (longTP2 || shortTP2)) ? close : null), ({ title: "TP2 Cross", text: "TP2", textcolor: pinescript.color.white, color: pinescript.color.olive, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.absolute }));
  pinescript.plotshape(((i_alertOn && (longTP3 || shortTP3)) ? close : null), ({ title: "TP3 Cross", text: "TP3", textcolor: pinescript.color.white, color: pinescript.color.olive, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.absolute }));
  pinescript.plotshape(((i_alertOn && (longSL || shortSL)) ? close : null), ({ title: "SL Cross", text: "SL", textcolor: pinescript.color.white, color: pinescript.color.maroon, style: pinescript.shape.labelup, size: pinescript.size.tiny, location: pinescript.location.absolute }));
  pinescript.plot(null, ({ title: "─── <debug> ───", editable: false, display: display.data_window }));
  pinescript.plot(state.condition, ({ title: "condition", editable: false, display: display.data_window }));
  pinescript.plot((pinescript.strategy.position_size * 100), ({ title: ".position_size", editable: false, display: display.data_window }));
  function f_qDq(_array, _val) {
    pinescript.arrayPush(_array, _val);
    var _return = pinescript.arrayShift(_array);
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
  var newEntry = (longE || shortE);
  var entryIndex = 1;
  entryIndex = (newEntry ? bar_index : pinescript.nz(pinescript.hist(171, entryIndex, 1)));
  var lasTrade = (bar_index >= entryIndex);
  var l_right = 10;
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
  var c_barCol = ((close > open) ? pinescript.color.rgb(120, 9, 139) : pinescript.color.rgb(69, 155, 225));
  pinescript.barcolor((i_barColOn ? c_barCol : null));
  if ((((longE || shortE) || longX) || shortX)) {
    pinescript.alert(({ message: "Any Alert", freq: alert.freq_once_per_bar_close }));
  }
  if (longE) {
    pinescript.alert(({ message: "Long Entry", freq: alert.freq_once_per_bar_close }));
  }
  if (shortE) {
    pinescript.alert(({ message: "Short Entry", freq: alert.freq_once_per_bar_close }));
  }
  if (longX) {
    pinescript.alert(({ message: "Long Exit", freq: alert.freq_once_per_bar_close }));
  }
  if (shortX) {
    pinescript.alert(({ message: "Short Exit", freq: alert.freq_once_per_bar_close }));
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
