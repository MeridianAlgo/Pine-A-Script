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
  alertcondition: function(condition, ...rest) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.alerts.push({ condition, args: rest });
    }
    return null;
  },
  barcolor: function(color) { return null; },
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
    return { x1, y1, x2, y2, opts, _type: 'line' };
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
    return { x, y, text, opts, _type: 'label' };
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
    return { left, top, right, bottom, opts, _type: 'box' };
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
    return { points: points || [], opts, _type: 'polyline' };
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
  timenow: 1781574528093,
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
    return arr1.concat(arr2);
  },
  arrayCopy: function(arr) {
    if (!arr) return [];
    return [...arr];
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

globalThis.label = globalThis.label || __pineNS({ style_label_down: "label_down", style_label_up: "label_up", style_none: "none" });

globalThis.polyline = globalThis.polyline || __pineNS({});

globalThis.linefill = globalThis.linefill || __pineNS({});

globalThis.matrix = globalThis.matrix || __pineNS({});

globalThis.map = globalThis.map || __pineNS({});

globalThis.session = globalThis.session || __pineNS({ regular: "regular", extended: "extended" });

globalThis.dayofweek = globalThis.dayofweek || __pineNS({ sunday: 1, monday: 2, tuesday: 3, wednesday: 4, thursday: 5, friday: 6, saturday: 7 });

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

globalThis.dayofweek = globalThis.dayofweek || __pineNS({ sunday: 1, monday: 2, tuesday: 3, wednesday: 4, thursday: 5, friday: 6, saturday: 7 });

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

  new: function(position, columns, rows, opts) { return { position, columns, rows, opts: opts || {}, cells: [] }; },

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
  // Study: Pro Pattern Al-Sat (High Winrate)
  // Options: {"overlay":true,"max_labels_count":500,"max_lines_count":500,"max_boxes_count":500}
  let showBullishPatterns = pinescript.inputBool(true, "Yükseliş Formasyonlarını Göster", ({ group: "Pattern Ayarları" }));
  let showBearishPatterns = pinescript.inputBool(true, "Düşüş Formasyonlarını Göster", ({ group: "Pattern Ayarları" }));
  let riskRewardRatio = pinescript.inputFloat(2, "Risk/Ödül Oranı", ({ minval: 0.5, maxval: 5, step: 0.1, group: "Risk Yönetimi" }));
  let stopLossATR = pinescript.inputFloat(1.5, "Stop Loss (ATR Çarpanı)", ({ minval: 0.5, maxval: 5, step: 0.1, group: "Risk Yönetimi" }));
  let showTable = pinescript.inputBool(true, "Sinyal Tablosunu Göster", ({ group: "Görünüm" }));
  let tablePosition = pinescript.inputString("top_right", "Tablo Pozisyonu", ({ options: ["top_right", "top_left", "bottom_right", "bottom_left"], group: "Görünüm" }));
  let showTradeResults = pinescript.inputBool(true, "İşlem Sonuçlarını Göster", ({ group: "Görünüm" }));
  let showExtendedLines = pinescript.inputBool(true, "Uzatılmış Çizgileri Göster", ({ group: "Görünüm" }));
  let useTrendFilter = pinescript.inputBool(true, "Trend Filtresi Kullan", ({ group: "🎯 Filtreler" }));
  let useVolumeFilter = pinescript.inputBool(true, "Volume Filtresi Kullan", ({ group: "🎯 Filtreler" }));
  let useRSIFilter = pinescript.inputBool(true, "RSI Filtresi Kullan", ({ group: "🎯 Filtreler" }));
  let useSupportResistance = pinescript.inputBool(true, "Destek/Direnç Filtresi", ({ group: "🎯 Filtreler" }));
  let useTimeFilter = pinescript.inputBool(true, "Zaman Filtresi Kullan", ({ group: "🎯 Filtreler" }));
  let emaFastLength = pinescript.inputInt(50, "Hızlı EMA", ({ minval: 10, group: "📈 Trend Filtresi" }));
  let emaSlowLength = pinescript.inputInt(200, "Yavaş EMA", ({ minval: 50, group: "📈 Trend Filtresi" }));
  let supertrendMultiplier = pinescript.inputFloat(3, "Supertrend Çarpanı", ({ minval: 1, maxval: 10, step: 0.5, group: "📈 Trend Filtresi" }));
  let supertrendPeriod = pinescript.inputInt(10, "Supertrend Periyodu", ({ minval: 5, group: "📈 Trend Filtresi" }));
  let adxThreshold = pinescript.inputInt(25, "ADX Minimum", ({ minval: 10, maxval: 50, group: "📈 Trend Filtresi" }));
  let volumeMultiplier = pinescript.inputFloat(1.5, "Volume Çarpanı", ({ minval: 1, maxval: 3, step: 0.1, group: "📊 Volume Filtresi" }));
  let volumePeriod = pinescript.inputInt(20, "Volume SMA Periyodu", ({ minval: 10, group: "📊 Volume Filtresi" }));
  let rsiPeriod = pinescript.inputInt(14, "RSI Periyodu", ({ minval: 5, group: "📉 RSI Filtresi" }));
  let rsiOverbought = pinescript.inputInt(70, "Aşırı Alım Seviyesi", ({ minval: 60, maxval: 90, group: "📉 RSI Filtresi" }));
  let rsiOversold = pinescript.inputInt(30, "Aşırı Satım Seviyesi", ({ minval: 10, maxval: 40, group: "📉 RSI Filtresi" }));
  let pivotLookback = pinescript.inputInt(10, "Pivot Lookback", ({ minval: 5, maxval: 50, group: "🎚️ Destek/Direnç" }));
  let srProximity = pinescript.inputFloat(0.5, "Seviye Yakınlığı (%)", ({ minval: 0.1, maxval: 2, step: 0.1, group: "🎚️ Destek/Direnç" }));
  let avoidFirstHour = pinescript.inputBool(true, "İlk 1 Saati Atla", ({ group: "⏰ Zaman Filtresi" }));
  let avoidLastHour = pinescript.inputBool(true, "Son 1 Saati Atla", ({ group: "⏰ Zaman Filtresi" }));
  let tradingStartHour = pinescript.inputInt(9, "İşlem Başlangıç Saati", ({ minval: 0, maxval: 23, group: "⏰ Zaman Filtresi" }));
  let tradingEndHour = pinescript.inputInt(17, "İşlem Bitiş Saati", ({ minval: 0, maxval: 23, group: "⏰ Zaman Filtresi" }));
  let atrValue = pinescript.atr(14);
  let emaFast = pinescript.ema(close, emaFastLength);
  let emaSlow = pinescript.ema(close, emaSlowLength);
  let uptrend = (emaFast > emaSlow);
  let downtrend = (emaFast < emaSlow);
  let [supertrendValue, supertrendDirection] = pinescript.unpack(pinescript.supertrend(supertrendMultiplier, supertrendPeriod), 2);
  let supertrendBullish = (supertrendDirection < 0);
  let supertrendBearish = (supertrendDirection > 0);
  let [diPlus, diMinus, adx] = pinescript.unpack(pinescript.dmi(14, 14), 3);
  let strongTrend = (adx > adxThreshold);
  let trendFilterBullish = ((uptrend && supertrendBullish) && strongTrend);
  let trendFilterBearish = ((downtrend && supertrendBearish) && strongTrend);
  let volumeSMA = pinescript.sma(volume, volumePeriod);
  let volumeFilter = (volume > (volumeSMA * volumeMultiplier));
  let rsi = pinescript.rsi(close, rsiPeriod);
  let rsiFilterBullish = (rsi < rsiOverbought);
  let rsiFilterBearish = (rsi > rsiOversold);
  let pivotHigh = ta.pivothigh(high, pivotLookback, pivotLookback);
  let pivotLow = ta.pivotlow(low, pivotLookback, pivotLookback);
  if (state.lastResistance === undefined) state.lastResistance = null;
  if (state.lastSupport === undefined) state.lastSupport = null;
  if (!pinescript.na(pivotHigh)) {
    state.lastResistance = pinescript.hist(0, high, pivotLookback);
  }
  if (!pinescript.na(pivotLow)) {
    state.lastSupport = pinescript.hist(1, low, pivotLookback);
  }
  let proximityPercent = (srProximity / 100);
  let nearSupport = (!pinescript.na(state.lastSupport) && ((pinescript.abs((close - state.lastSupport)) / state.lastSupport) < proximityPercent));
  let nearResistance = (!pinescript.na(state.lastResistance) && ((pinescript.abs((close - state.lastResistance)) / state.lastResistance) < proximityPercent));
  let srFilterBullish = nearSupport;
  let srFilterBearish = nearResistance;
  let currentHour = pinescript.hour(time);
  let currentMinute = pinescript.minute(time);
  let firstHourAvoid = (avoidFirstHour && (currentHour === tradingStartHour));
  let lastHourAvoid = (avoidLastHour && (currentHour === tradingEndHour));
  let inTradingHours = ((currentHour >= tradingStartHour) && (currentHour <= tradingEndHour));
  let timeFilter = ((inTradingHours && !firstHourAvoid) && !lastHourAvoid);
  let bullishEngulfing = ((((pinescript.hist(2, close, 1) < pinescript.hist(3, open, 1)) && (close > open)) && (open <= pinescript.hist(4, close, 1))) && (close >= pinescript.hist(5, open, 1)));
  let bearishEngulfing = ((((pinescript.hist(6, close, 1) > pinescript.hist(7, open, 1)) && (close < open)) && (open >= pinescript.hist(8, close, 1))) && (close <= pinescript.hist(9, open, 1)));
  let bodySize = pinescript.abs((close - open));
  let upperWick = (high - pinescript.max(close, open));
  let lowerWick = (pinescript.min(close, open) - low);
  let lowestLow = pinescript.lowest(pinescript.series(10, low), 10);
  let highestHigh = pinescript.highest(pinescript.series(11, high), 10);
  let isHammer = ((((lowerWick > (bodySize * 2)) && (upperWick < bodySize)) && (close > open)) && (low === lowestLow));
  let isShootingStar = ((((upperWick > (bodySize * 2)) && (lowerWick < bodySize)) && (close < open)) && (high === highestHigh));
  let avgBody2 = pinescript.abs((pinescript.hist(12, close, 2) - pinescript.hist(13, open, 2)));
  let isMorningStar = (pinescript.hist(14, close, 2)((pinescript.hist(15, open, 2) + pinescript.hist(16, close, 2))) / 2);
  let isEveningStar = ((((pinescript.hist(17, close, 2) > pinescript.hist(18, open, 2)) && (pinescript.abs((pinescript.hist(19, close, 1) - pinescript.hist(20, open, 1))) < (avgBody2 * 0.3))) && (close < open)) && (close < ((pinescript.hist(21, open, 2) + pinescript.hist(22, close, 2)) / 2)));
  let candleRange = (high - low);
  let avgRange = pinescript.sma((high - low), 14);
  let isDoji = ((pinescript.abs((close - open)) < (candleRange * 0.1)) && (candleRange > avgRange));
  let threeWhiteSoldiers = (((((((((pinescript.hist(23, close, 2) > pinescript.hist(24, open, 2)) && (pinescript.hist(25, close, 1) > pinescript.hist(26, open, 1))) && (close > open)) && (pinescript.hist(27, close, 1) > pinescript.hist(28, close, 2))) && (close > pinescript.hist(29, close, 1))) && (pinescript.hist(30, open, 1) > pinescript.hist(31, open, 2))) && (open > pinescript.hist(32, open, 1))) && (pinescript.hist(33, open, 1) < pinescript.hist(34, close, 2))) && (open < pinescript.hist(35, close, 1)));
  let threeBlackCrows = (((((((((pinescript.hist(36, close, 2) < pinescript.hist(37, open, 2)) && (pinescript.hist(38, close, 1) < pinescript.hist(39, open, 1))) && (close < open)) && (pinescript.hist(40, close, 1) < pinescript.hist(41, close, 2))) && (close < pinescript.hist(42, close, 1))) && (pinescript.hist(43, open, 1) < pinescript.hist(44, open, 2))) && (open < pinescript.hist(45, open, 1))) && (pinescript.hist(46, open, 1) > pinescript.hist(47, close, 2))) && (open > pinescript.hist(48, close, 1)));
  let piercingLine = ((((pinescript.hist(49, close, 1) < pinescript.hist(50, open, 1)) && (close > open)) && (pinescript.open((pinescript.hist(51, open, 1) + pinescript.hist(52, close, 1))) / 2)) && (close < pinescript.hist(53, open, 1)));
  let darkCloudCover = (((((pinescript.hist(54, close, 1) > pinescript.hist(55, open, 1)) && (close < open)) && (open > pinescript.hist(56, close, 1))) && (close < ((pinescript.hist(57, open, 1) + pinescript.hist(58, close, 1)) / 2))) && (close > pinescript.hist(59, open, 1)));
  let bullishPattern = (((((bullishEngulfing || isHammer) || isMorningStar) || threeWhiteSoldiers) || piercingLine) && showBullishPatterns);
  let bearishPattern = (((((bearishEngulfing || isShootingStar) || isEveningStar) || threeBlackCrows) || darkCloudCover) && showBearishPatterns);
  let bullishSignal = (((((bullishPattern && (!useTrendFilter || trendFilterBullish)) && (!useVolumeFilter || volumeFilter)) && (!useRSIFilter || rsiFilterBullish)) && (!useSupportResistance || srFilterBullish)) && (!useTimeFilter || timeFilter));
  let bearishSignal = (((((bearishPattern && (!useTrendFilter || trendFilterBearish)) && (!useVolumeFilter || volumeFilter)) && (!useRSIFilter || rsiFilterBearish)) && (!useSupportResistance || srFilterBearish)) && (!useTimeFilter || timeFilter));
  if (state.lastPattern === undefined) state.lastPattern = "Yok";
  if (state.lastEntry === undefined) state.lastEntry = null;
  if (state.lastStop === undefined) state.lastStop = null;
  if (state.lastTarget === undefined) state.lastTarget = null;
  if (state.lastSignalType === undefined) state.lastSignalType = "Bekleniyor";
  if (state.lastSignalColor === undefined) state.lastSignalColor = pinescript.color.gray;
  if (state.lastSignalIndex === undefined) state.lastSignalIndex = null;
  if (state.totalTrades === undefined) state.totalTrades = 0;
  if (state.winningTrades === undefined) state.winningTrades = 0;
  if (state.losingTrades === undefined) state.losingTrades = 0;
  if (state.totalProfit === undefined) state.totalProfit = 0;
  if (state.totalLoss === undefined) state.totalLoss = 0;
  if (state.tradeActive === undefined) state.tradeActive = false;
  if (state.activeTradeType === undefined) state.activeTradeType = "";
  if (state.totalSignalsBeforeFilter === undefined) state.totalSignalsBeforeFilter = 0;
  if (state.totalSignalsAfterFilter === undefined) state.totalSignalsAfterFilter = 0;
  if (state.activeEntryLine === undefined) state.activeEntryLine = null;
  if (state.activeStopLine === undefined) state.activeStopLine = null;
  if (state.activeTpLine === undefined) state.activeTpLine = null;
  if (state.activeEntryLabel === undefined) state.activeEntryLabel = null;
  if (state.activeStopLabel === undefined) state.activeStopLabel = null;
  if (state.activeTpLabel === undefined) state.activeTpLabel = null;
  let patternName = "";
  if ((bullishPattern || bearishPattern)) {
    state.totalSignalsBeforeFilter = 1;
  }
  if ((bullishSignal || bearishSignal)) {
    state.totalSignalsAfterFilter = 1;
  }
  if (bullishSignal) {
    patternName = (bullishEngulfing ? "Bullish Engulfing" : (isHammer ? "Hammer" : (isMorningStar ? "Morning Star" : (threeWhiteSoldiers ? "Three White Soldiers" : (piercingLine ? "Piercing Line" : "")))));
    state.lastPattern = patternName;
    state.lastEntry = close;
    state.lastStop = (low - (atrValue * stopLossATR));
    state.lastTarget = (state.lastEntry + ((state.lastEntry - state.lastStop) * riskRewardRatio));
    state.lastSignalType = "ALIŞ";
    state.lastSignalColor = pinescript.color.green;
    state.lastSignalIndex = bar_index;
    state.tradeActive = true;
    state.activeTradeType = "BUY";
  }
  if (bearishSignal) {
    patternName = (bearishEngulfing ? "Bearish Engulfing" : (isShootingStar ? "Shooting Star" : (isEveningStar ? "Evening Star" : (threeBlackCrows ? "Three Black Crows" : (darkCloudCover ? "Dark Cloud Cover" : "")))));
    state.lastPattern = patternName;
    state.lastEntry = close;
    state.lastStop = (high + (atrValue * stopLossATR));
    state.lastTarget = (state.lastEntry - ((state.lastStop - state.lastEntry) * riskRewardRatio));
    state.lastSignalType = "SATIŞ";
    state.lastSignalColor = pinescript.color.red;
    state.lastSignalIndex = bar_index;
    state.tradeActive = true;
    state.activeTradeType = "SELL";
  }
  if ((((state.tradeActive && !pinescript.na(state.lastEntry)) && !pinescript.na(state.lastStop)) && !pinescript.na(state.lastTarget))) {
    if ((state.activeTradeType === "BUY")) {
      if ((high >= state.lastTarget)) {
        state.totalTrades = 1;
        state.winningTrades = 1;
        let profit = (state.lastTarget - state.lastEntry);
        state.totalProfit = profit;
        state.tradeActive = false;
        if (showTradeResults) {
          pinescript.labelNew(bar_index, state.lastTarget, ("✓ TP HITn+" + pinescript.strToString(profit, "#.####")), ({ yloc: yloc.price, color: pinescript.color.new(pinescript.color.green, 0), textcolor: pinescript.color.white, style: label.style_label_down, size: pinescript.size.small }));
        }
      } else {
        if ((low <= state.lastStop)) {
          state.totalTrades = 1;
          state.losingTrades = 1;
          let loss = (state.lastEntry - state.lastStop);
          state.totalLoss = loss;
          state.tradeActive = false;
          if (showTradeResults) {
            pinescript.labelNew(bar_index, state.lastStop, ("✗ STOPn-" + pinescript.strToString(loss, "#.####")), ({ yloc: yloc.price, color: pinescript.color.new(pinescript.color.red, 0), textcolor: pinescript.color.white, style: label.style_label_up, size: pinescript.size.small }));
          }
        }
      }
    } else {
      if ((state.activeTradeType === "SELL")) {
        if ((low <= state.lastTarget)) {
          state.totalTrades = 1;
          state.winningTrades = 1;
          profit = (state.lastEntry - state.lastTarget);
          state.totalProfit = profit;
          state.tradeActive = false;
          if (showTradeResults) {
            pinescript.labelNew(bar_index, state.lastTarget, ("✓ TP HITn+" + pinescript.strToString(profit, "#.####")), ({ yloc: yloc.price, color: pinescript.color.new(pinescript.color.green, 0), textcolor: pinescript.color.white, style: label.style_label_up, size: pinescript.size.small }));
          }
        } else {
          if ((high >= state.lastStop)) {
            state.totalTrades = 1;
            state.losingTrades = 1;
            loss = (state.lastStop - state.lastEntry);
            state.totalLoss = loss;
            state.tradeActive = false;
            if (showTradeResults) {
              pinescript.labelNew(bar_index, state.lastStop, ("✗ STOPn-" + pinescript.strToString(loss, "#.####")), ({ yloc: yloc.price, color: pinescript.color.new(pinescript.color.red, 0), textcolor: pinescript.color.white, style: label.style_label_down, size: pinescript.size.small }));
            }
          }
        }
      }
    }
  }
  let winRate = ((state.totalTrades > 0) ? ((state.winningTrades / state.totalTrades) * 100) : 0);
  let profitLossRatio = ((state.totalLoss > 0) ? (state.totalProfit / state.totalLoss) : 0);
  let filterEfficiency = ((state.totalSignalsBeforeFilter > 0) ? (((state.totalSignalsBeforeFilter - state.totalSignalsAfterFilter) / state.totalSignalsBeforeFilter) * 100) : 0);
  pinescript.plotshape(bullishSignal, "Alış", pinescript.shape.triangleup, pinescript.location.belowbar, pinescript.color.green, ({ size: pinescript.size.small }));
  pinescript.plotshape(bearishSignal, "Satış", pinescript.shape.triangledown, pinescript.location.abovebar, pinescript.color.red, ({ size: pinescript.size.small }));
  pinescript.plot((useTrendFilter ? emaFast : null), "EMA Fast", pinescript.color.new(pinescript.color.blue, 0), ({ linewidth: 1 }));
  pinescript.plot((useTrendFilter ? emaSlow : null), "EMA Slow", pinescript.color.new(pinescript.color.red, 0), ({ linewidth: 2 }));
  pinescript.plot((useTrendFilter ? supertrendValue : null), "Supertrend", ({ color: ((supertrendDirection < 0) ? pinescript.color.green : pinescript.color.red), linewidth: 2 }));
  if (state.lineSL === undefined) state.lineSL = null;
  if (state.lineTP === undefined) state.lineTP = null;
  if ((bullishSignal || bearishSignal)) {
    pinescript.lineDelete(state.lineSL);
    pinescript.lineDelete(state.lineTP);
    if (showExtendedLines) {
      state.lineSL = pinescript.lineNew(state.lastSignalIndex, state.lastStop, bar_index, state.lastStop, ({ extend: extend.right, color: pinescript.color.new(pinescript.color.red, 40), width: 1, style: line.style_dashed }));
      state.lineTP = pinescript.lineNew(state.lastSignalIndex, state.lastTarget, bar_index, state.lastTarget, ({ extend: extend.right, color: pinescript.color.new(pinescript.color.green, 40), width: 1, style: line.style_dashed }));
    }
  }
  if (((bullishSignal || bearishSignal) && showExtendedLines)) {
    pinescript.lineDelete(state.activeEntryLine);
    pinescript.lineDelete(state.activeStopLine);
    pinescript.lineDelete(state.activeTpLine);
    pinescript.labelDelete(state.activeEntryLabel);
    pinescript.labelDelete(state.activeStopLabel);
    pinescript.labelDelete(state.activeTpLabel);
    state.activeEntryLine = pinescript.lineNew(state.lastSignalIndex, state.lastEntry, (bar_index + 50), state.lastEntry, ({ color: pinescript.color.new(pinescript.color.blue, 30), width: 2, style: line.style_solid }));
    state.activeStopLine = pinescript.lineNew(state.lastSignalIndex, state.lastStop, (bar_index + 50), state.lastStop, ({ color: pinescript.color.new(pinescript.color.red, 30), width: 2, style: line.style_dashed }));
    state.activeTpLine = pinescript.lineNew(state.lastSignalIndex, state.lastTarget, (bar_index + 50), state.lastTarget, ({ color: pinescript.color.new(pinescript.color.green, 30), width: 2, style: line.style_dashed }));
    state.activeEntryLabel = pinescript.labelNew((bar_index + 3), state.lastEntry, ("Giriş: " + pinescript.strToString(state.lastEntry, "#.####")), ({ yloc: yloc.price, color: pinescript.color.new(pinescript.color.blue, 70), textcolor: pinescript.color.white, style: label.style_label_left, size: pinescript.size.tiny }));
    state.activeStopLabel = pinescript.labelNew((bar_index + 3), state.lastStop, ("Stop: " + pinescript.strToString(state.lastStop, "#.####")), ({ yloc: yloc.price, color: pinescript.color.new(pinescript.color.red, 70), textcolor: pinescript.color.white, style: label.style_label_left, size: pinescript.size.tiny }));
    state.activeTpLabel = pinescript.labelNew((bar_index + 3), state.lastTarget, ("TP: " + pinescript.strToString(state.lastTarget, "#.####")), ({ yloc: yloc.price, color: pinescript.color.new(pinescript.color.green, 70), textcolor: pinescript.color.white, style: label.style_label_left, size: pinescript.size.tiny }));
  }
  if (state.lastLabel === undefined) state.lastLabel = null;
  if ((bullishSignal || bearishSignal)) {
    pinescript.labelDelete(state.lastLabel);
    let y_pos = (bullishSignal ? low : high);
    let label_style = (bullishSignal ? label.style_label_up : label.style_label_down);
    let label_color = (bullishSignal ? pinescript.color.new(pinescript.color.green, 70) : pinescript.color.new(pinescript.color.red, 70));
    let signal_text = (bullishSignal ? "ALIŞ" : "SATIŞ");
    state.lastLabel = pinescript.labelNew(state.lastSignalIndex, y_pos, ((((((((signal_text + "n") + state.lastPattern) + "nGiriş: ") + pinescript.strToString(state.lastEntry, "#.####")) + "nSL: ") + pinescript.strToString(state.lastStop, "#.####")) + "nTP: ") + pinescript.strToString(state.lastTarget, "#.####")), ({ yloc: (bullishSignal ? yloc.belowbar : yloc.abovebar), color: label_color, textcolor: pinescript.color.white, style: label_style, size: pinescript.size.small }));
  }
  if (showTable) {
    if (state.t === undefined) state.t = pinescript.table.new(((tablePosition === "top_right") ? pinescript.position.top_right : ((tablePosition === "top_left") ? pinescript.position.top_left : ((tablePosition === "bottom_right") ? pinescript.position.bottom_right : pinescript.position.bottom_left))), ({ columns: 3, rows: 16, bgcolor: pinescript.color.new(pinescript.color.black, 85), border_width: 1, border_color: pinescript.color.new(pinescript.color.blue, 60) }));
    pinescript.tableClear(state.t, 0, 0, 2, 15);
    pinescript.table.cell(state.t, 0, 0, "PRO SİSTEM - HIGH WINRATE", ({ text_color: pinescript.color.white, bgcolor: pinescript.color.new(pinescript.color.blue, 40), text_size: pinescript.size.normal }));
    pinescript.tableMergeCells(state.t, 0, 0, 2, 0);
    pinescript.table.cell(state.t, 0, 1, "Parametre", ({ text_color: pinescript.color.yellow, bgcolor: pinescript.color.new(pinescript.color.gray, 70) }));
    pinescript.table.cell(state.t, 1, 1, "Değer", ({ text_color: pinescript.color.yellow, bgcolor: pinescript.color.new(pinescript.color.gray, 70) }));
    pinescript.table.cell(state.t, 2, 1, "Durum", ({ text_color: pinescript.color.yellow, bgcolor: pinescript.color.new(pinescript.color.gray, 70) }));
    pinescript.table.cell(state.t, 0, 2, "Son Sinyal", ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 1, 2, state.lastSignalType, ({ text_color: state.lastSignalColor }));
    pinescript.table.cell(state.t, 2, 2, ((state.lastSignalType === "Bekleniyor") ? "○" : "●"), ({ text_color: state.lastSignalColor, text_size: pinescript.size.normal }));
    pinescript.table.cell(state.t, 0, 3, "Pattern", ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 1, 3, state.lastPattern, ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 2, 3, "");
    pinescript.table.cell(state.t, 0, 4, "Giriş", ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 1, 4, (pinescript.na(state.lastEntry) ? "-" : pinescript.strToString(state.lastEntry, "#.####")), ({ text_color: pinescript.color.aqua }));
    pinescript.table.cell(state.t, 2, 4, "");
    pinescript.table.cell(state.t, 0, 5, "Stop Loss", ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 1, 5, (pinescript.na(state.lastStop) ? "-" : pinescript.strToString(state.lastStop, "#.####")), ({ text_color: pinescript.color.red }));
    pinescript.table.cell(state.t, 2, 5, ((pinescript.na(state.lastEntry) || pinescript.na(state.lastStop)) ? "-" : pinescript.strToString(pinescript.abs((state.lastEntry - state.lastStop)), "#.####")), ({ text_color: pinescript.color.orange }));
    pinescript.table.cell(state.t, 0, 6, "Take Profit", ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 1, 6, (pinescript.na(state.lastTarget) ? "-" : pinescript.strToString(state.lastTarget, "#.####")), ({ text_color: pinescript.color.green }));
    pinescript.table.cell(state.t, 2, 6, ((pinescript.na(state.lastEntry) || pinescript.na(state.lastTarget)) ? "-" : pinescript.strToString(pinescript.abs((state.lastTarget - state.lastEntry)), "#.####")), ({ text_color: pinescript.color.lime }));
    pinescript.table.cell(state.t, 0, 7, "Risk/Ödül", ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 1, 7, ("1:" + pinescript.strToString(riskRewardRatio, "#.#")), ({ text_color: pinescript.color.yellow }));
    pinescript.table.cell(state.t, 2, 7, "");
    pinescript.table.cell(state.t, 0, 8, "━━━━━ PERFORMANS ━━━━━", ({ text_color: pinescript.color.aqua }));
    pinescript.tableMergeCells(state.t, 0, 8, 2, 8);
    pinescript.table.cell(state.t, 0, 9, "Toplam İşlem", ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 1, 9, pinescript.strToString(state.totalTrades), ({ text_color: pinescript.color.aqua }));
    pinescript.table.cell(state.t, 2, 9, "📊", ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 0, 10, "🎯 WINRATE", ({ text_color: pinescript.color.white, text_size: pinescript.size.normal }));
    let winRateColor = ((winRate >= 70) ? pinescript.color.new(pinescript.color.green, 0) : ((winRate >= 50) ? pinescript.color.orange : pinescript.color.red));
    pinescript.table.cell(state.t, 1, 10, (pinescript.strToString(winRate, "#.##") + "%"), ({ text_color: winRateColor, text_size: pinescript.size.normal }));
    pinescript.table.cell(state.t, 2, 10, (((pinescript.strToString(state.winningTrades) + "W/") + pinescript.strToString(state.losingTrades)) + "L"), ({ text_color: pinescript.color.orange, text_size: pinescript.size.tiny }));
    pinescript.table.cell(state.t, 0, 11, "Kar/Zarar Oranı", ({ text_color: pinescript.color.white }));
    let plRatioColor = ((profitLossRatio >= 2) ? pinescript.color.new(pinescript.color.green, 0) : ((profitLossRatio >= 1) ? pinescript.color.orange : pinescript.color.red));
    pinescript.table.cell(state.t, 1, 11, pinescript.strToString(profitLossRatio, "#.##"), ({ text_color: plRatioColor }));
    pinescript.table.cell(state.t, 2, 11, ((profitLossRatio >= 1) ? "✓" : "✗"), ({ text_color: plRatioColor }));
    pinescript.table.cell(state.t, 0, 12, "━━━━━ FİLTRELER ━━━━━", ({ text_color: pinescript.color.purple }));
    pinescript.tableMergeCells(state.t, 0, 12, 2, 12);
    pinescript.table.cell(state.t, 0, 13, "Ham Sinyal", ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 1, 13, pinescript.strToString(state.totalSignalsBeforeFilter), ({ text_color: pinescript.color.gray }));
    pinescript.table.cell(state.t, 2, 13, "📡", ({ text_color: pinescript.color.gray }));
    pinescript.table.cell(state.t, 0, 14, "Filtrelenmiş", ({ text_color: pinescript.color.white }));
    pinescript.table.cell(state.t, 1, 14, pinescript.strToString(state.totalSignalsAfterFilter), ({ text_color: pinescript.color.green }));
    pinescript.table.cell(state.t, 2, 14, "✓", ({ text_color: pinescript.color.green }));
    pinescript.table.cell(state.t, 0, 15, "Filtre Etkinliği", ({ text_color: pinescript.color.white }));
    let filterColor = ((filterEfficiency >= 60) ? pinescript.color.green : ((filterEfficiency >= 40) ? pinescript.color.orange : pinescript.color.red));
    pinescript.table.cell(state.t, 1, 15, (pinescript.strToString(filterEfficiency, "#.#") + "%"), ({ text_color: filterColor }));
    pinescript.table.cell(state.t, 2, 15, ((filterEfficiency >= 50) ? "🔥" : "⚡"), ({ text_color: filterColor }));
  }
  pinescript.alertcondition(bullishSignal, ({ title: "🟢 Filtrelenmiş Alış", message: "ALIŞ {{ticker}} - {{plot(\"Pattern\")}} | Giriş {{close}}" }));
  pinescript.alertcondition(bearishSignal, ({ title: "🔴 Filtrelenmiş Satış", message: "SATIŞ {{ticker}} - {{plot(\"Pattern\")}} | Giriş {{close}}" }));
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
