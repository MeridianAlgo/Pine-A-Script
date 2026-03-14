/**
 * PineScript Built-in Functions - JavaScript implementations
 * This module provides a comprehensive mapping of PineScript built-in functions
 * to their JavaScript equivalents, enabling converted scripts to run correctly.
 */

export const builtins = new Map([
  // Moving average calculations used for trend smoothing and noise reduction
  ['sma', function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    return slice.reduce((a, b) => a + b, 0) / length;
  }],

  ['ema', function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < 1) return null;
    const alpha = 2 / (length + 1);
    let result = series[0];
    for (let i = 1; i < series.length; i++) {
      result = alpha * series[i] + (1 - alpha) * result;
    }
    return result;
  }],

  ['wma', function(series, length) {
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
  }],

  ['vwma', function(close, volume, length) {
    if (!close || close.length < length) return null;
    let sum = 0;
    let volSum = 0;
    for (let i = length - 1; i >= 0; i--) {
      sum += close[close.length - 1 - i] * volume[volume.length - 1 - i];
      volSum += volume[volume.length - 1 - i];
    }
    return volSum > 0 ? sum / volSum : null;
  }],

  ['rma', function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < 1) return null;
    const alpha = 1 / length;
    let result = series[0];
    for (let i = 1; i < series.length; i++) {
      result = alpha * series[i] + (1 - alpha) * result;
    }
    return result;
  }],

  ['hma', function(series, length) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < length) return null;
    const halfLength = Math.floor(length / 2);
    const wma1 = builtins.get('wma')(series, halfLength);
    const wma2 = builtins.get('wma')(series, length);
    const diff = wma2 - wma1;
    return builtins.get('wma')([diff, diff], Math.floor(Math.sqrt(length)));
  }],

  ['alma', function(series, length, offset = 0.85, sigma = 6) {
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
  }],

  // Symmetrically Weighted Moving Average, which applies weights [1/6, 2/6, 2/6, 1/6] over four bars
  ['swma', function(series) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (series.length < 4) return null;
    const s = series.slice(-4);
    return (s[0] * 1 + s[1] * 2 + s[2] * 2 + s[3] * 1) / 6;
  }],

  // Volatility measurements like ATR and Bollinger Bands, used to gauge market uncertainty
  ['atr', function(high, low, close, length = 14) {
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
  }],

  ['bb', function(source, length, mult = 2) {
    if (!source || source.length < length) return null;
    const sma = builtins.get('sma')(source, length);
    const slice = source.slice(-length);
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / length;
    const stdDev = Math.sqrt(variance);
    return { middle: sma, upper: sma + mult * stdDev, lower: sma - mult * stdDev };
  }],

  ['kc', function(high, low, close, length = 20, mult = 2) {
    if (!high || high.length < length) return null;
    const typicalPrice = high.map((h, i) => (h + low[i] + close[i]) / 3);
    const sma = builtins.get('sma')(typicalPrice, length);
    const atr = builtins.get('atr')(high, low, close, length);
    return { middle: sma, upper: sma + mult * atr, lower: sma - mult * atr };
  }],

  // Supertrend indicator, a popular trend-following overlay based on ATR bands
  ['supertrend', function(factor, atrPeriod, high, low, close) {
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
  }],

  // Alias that mirrors the TradingView ta.supertrend signature
  ['ta_supertrend', function(factor, atrPeriod) {
    const H = globalThis.high;
    const L = globalThis.low;
    const C = globalThis.close;
    return builtins.get('supertrend')(factor, atrPeriod, H, L, C);
  }],

  // Directional Movement Index and Average Directional Index for measuring trend strength
  ['dmi', function(diLength, adxSmoothing, high, low, close) {
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
  }],

  ['adx', function(diLength, adxSmoothing, high, low, close) {
    const result = builtins.get('dmi')(diLength, adxSmoothing, high, low, close);
    return result ? result.adx : null;
  }],

  // Oscillator indicators that measure momentum and overbought/oversold conditions
  ['rsi', function(close, length = 14) {
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
  }],

  ['roc', function(series, length = 9) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (!series || series.length < length + 1) return null;
    const prev = series[series.length - 1 - length];
    const curr = series[series.length - 1];
    if (prev === 0 || prev === null || prev === undefined) return null;
    return ((curr - prev) / prev) * 100;
  }],

  ['percentrank', function(series, length = 100) {
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
  }],

  ['stoch', function(high, low, close, kLength = 14, dLength = 3, smoothK = 3) {
    if (!high || high.length < kLength) return null;
    const highestHigh = Math.max(...high.slice(-kLength));
    const lowestLow = Math.min(...low.slice(-kLength));
    const range = highestHigh - lowestLow;
    if (range === 0) return { k: 50, d: 50 };
    const rawK = ((close[close.length - 1] - lowestLow) / range) * 100;
    return { k: rawK, d: builtins.get('sma')([rawK], smoothK) };
  }],

  ['macd', function(close, fastLen = 12, slowLen = 26, signalLen = 9) {
    if (!close || close.length < slowLen + signalLen) return null;
    const fastEMA = builtins.get('ema')(close, fastLen);
    const slowEMA = builtins.get('ema')(close, slowLen);
    const macdLine = fastEMA - slowEMA;
    const signalLine = builtins.get('ema')([macdLine], signalLen);
    const histogram = macdLine - signalLine;
    return { macd: macdLine, signal: signalLine, histogram: histogram };
  }],

  ['cci', function(a, b, c, d) {
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
  }],

  ['change', function(series) {
    if (series === null || series === undefined) return null;
    if (!Array.isArray(series)) series = [series];
    if (series.length < 2) return null;
    return series[series.length - 1] - series[series.length - 2];
  }],

  ['mfi', function(high, low, close, volume, length = 14) {
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
  }],

  // Volume-based indicators that combine price movement with trading activity
  ['obv', function(close, volume) {
    if (!close || close.length < 2) return null;
    let result = 0;
    for (let i = 1; i < close.length; i++) {
      if (close[i] > close[i - 1]) result += volume[i];
      else if (close[i] < close[i - 1]) result -= volume[i];
    }
    return result;
  }],

  ['ad', function(high, low, close, volume) {
    if (!high || high.length < 1) return null;
    let result = 0;
    for (let i = 0; i < high.length; i++) {
      const mf = ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) * volume[i];
      result += mf;
    }
    return result;
  }],

  ['adosc', function(high, low, close, volume, fastLen = 3, slowLen = 10) {
    if (!high || high.length < slowLen) return null;
    const ad = builtins.get('ad')(high, low, close, volume);
    const fastEMA = builtins.get('ema')(ad, fastLen);
    const slowEMA = builtins.get('ema')(ad, slowLen);
    return fastEMA - slowEMA;
  }],

  ['cmf', function(high, low, close, volume, length = 20) {
    if (!high || high.length < length) return null;
    let sum = 0;
    let volSum = 0;
    for (let i = high.length - length; i < high.length; i++) {
      const mfv = ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) * volume[i];
      sum += mfv;
      volSum += volume[i];
    }
    return volSum > 0 ? sum / volSum : 0;
  }],

  ['vwap', function(high, low, close, volume) {
    if (!high || high.length < 1) return null;
    let priceVolSum = 0;
    let volSum = 0;
    for (let i = 0; i < high.length; i++) {
      const tp = (high[i] + low[i] + close[i]) / 3;
      priceVolSum += tp * volume[i];
      volSum += volume[i];
    }
    return volSum > 0 ? priceVolSum / volSum : null;
  }],

  // Statistical functions for regression, correlation, and distribution analysis
  ['linreg', function(source, length, offset = 0) {
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
  }],

  ['correlation', function(source1, source2, length) {
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
  }],

  ['variance', function(source, length) {
    if (!source || source.length < length) return null;
    const slice = source.slice(-length);
    const mean = slice.reduce((a, b) => a + b, 0) / length;
    return slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / length;
  }],

  ['stdev', function(source, length) {
    return Math.sqrt(builtins.get('variance')(source, length));
  }],

  // Median returns the middle value of the last N bars when sorted
  ['median', function(source, length) {
    if (!source || source.length < length) return null;
    const sorted = [...source.slice(-length)].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }],

  // Alias for ta.median in TradingView's namespaced API
  ['ta_median', function(source, length) {
    return builtins.get('median')(source, length);
  }],

  // Price combination helpers that produce typical or weighted close values
  ['hl2', function(high, low) {
    return high && low ? (high[high.length - 1] + low[low.length - 1]) / 2 : null;
  }],

  ['hlc3', function(high, low, close) {
    return high && low && close ? (high[high.length - 1] + low[low.length - 1] + close[close.length - 1]) / 3 : null;
  }],

  ['ohlc4', function(open, high, low, close) {
    return open && high && low && close ? (open[open.length - 1] + high[high.length - 1] + low[low.length - 1] + close[close.length - 1]) / 4 : null;
  }],

  // General-purpose utility functions for arithmetic, comparison, and rounding
  ['avg', function(...args) {
    return args.reduce((a, b) => a + b, 0) / args.length;
  }],

  ['max', function(...args) {
    return Math.max(...args.filter(v => v !== null && v !== undefined));
  }],

  ['min', function(...args) {
    return Math.min(...args.filter(v => v !== null && v !== undefined));
  }],

  ['abs', function(value) {
    return Math.abs(value);
  }],

  ['sqrt', function(value) {
    return Math.sqrt(value);
  }],

  ['pow', function(base, exp) {
    return Math.pow(base, exp);
  }],

  ['exp', function(value) {
    return Math.exp(value);
  }],

  ['log', function(value) {
    return Math.log(value);
  }],

  ['log10', function(value) {
    return Math.log10(value);
  }],

  ['sin', function(value) {
    return Math.sin(value);
  }],

  ['cos', function(value) {
    return Math.cos(value);
  }],

  ['tan', function(value) {
    return Math.tan(value);
  }],

  ['asin', function(value) {
    return Math.asin(value);
  }],

  ['acos', function(value) {
    return Math.acos(value);
  }],

  ['atan', function(value) {
    return Math.atan(value);
  }],

  ['floor', function(value) {
    return Math.floor(value);
  }],

  ['ceil', function(value) {
    return Math.ceil(value);
  }],

  ['round', function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }],

  ['cum', function(series) {
    if (!series) return null;
    return series.reduce((sum, val) => sum + val, 0);
  }],

  ['sum', function(series, length) {
    if (!series || series.length < length) return null;
    return series.slice(-length).reduce((a, b) => a + b, 0);
  }],

  ['highest', function(series, length) {
    if (!series || series.length < length) return null;
    return Math.max(...series.slice(-length));
  }],

  ['lowest', function(series, length) {
    if (!series || series.length < length) return null;
    return Math.min(...series.slice(-length));
  }],

  ['highestbars', function(series, length) {
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    const maxVal = Math.max(...slice);
    return length - 1 - slice.indexOf(maxVal);
  }],

  ['lowestbars', function(series, length) {
    if (!series || series.length < length) return null;
    const slice = series.slice(-length);
    const minVal = Math.min(...slice);
    return length - 1 - slice.indexOf(minVal);
  }],

  ['rising', function(series, length) {
    if (!series || series.length < length) return false;
    for (let i = series.length - length; i < series.length - 1; i++) {
      if (series[i] >= series[i + 1]) return false;
    }
    return true;
  }],

  ['falling', function(series, length) {
    if (!series || series.length < length) return false;
    for (let i = series.length - length; i < series.length - 1; i++) {
      if (series[i] <= series[i + 1]) return false;
    }
    return true;
  }],

  // Crossover and crossunder detect when two series cross each other in a specific direction
  ['cross', function(series1, series2) {
    if (series1 === null || series1 === undefined) return false;
    if (series2 === null || series2 === undefined) return false;
    if (!Array.isArray(series1)) series1 = [series1];
    if (!Array.isArray(series2)) series2 = [series2];
    if (series1.length < 2 || series2.length < 2) return false;
    const i = series1.length - 1;
    return (series1[i - 1] < series2[i - 1] && series1[i] >= series2[i]) ||
           (series1[i - 1] > series2[i - 1] && series1[i] <= series2[i]);
  }],

  // Returns true when series1 was below series2 on the previous bar and is now above or equal
  ['crossover', function(series1, series2) {
    if (series1 === null || series1 === undefined) return false;
    if (series2 === null || series2 === undefined) return false;
    if (!Array.isArray(series1)) series1 = [series1];
    if (!Array.isArray(series2)) series2 = [series2];
    if (series1.length < 2 || series2.length < 2) return false;
    const i = series1.length - 1;
    return series1[i - 1] < series2[i - 1] && series1[i] >= series2[i];
  }],

  // Returns true when series1 was above series2 on the previous bar and is now below or equal
  ['crossunder', function(series1, series2) {
    if (series1 === null || series1 === undefined) return false;
    if (series2 === null || series2 === undefined) return false;
    if (!Array.isArray(series1)) series1 = [series1];
    if (!Array.isArray(series2)) series2 = [series2];
    if (series1.length < 2 || series2.length < 2) return false;
    const i = series1.length - 1;
    return series1[i - 1] > series2[i - 1] && series1[i] <= series2[i];
  }],

  ['offset', function(series, offset) {
    if (!Array.isArray(series)) return null;
    const idx = series.length - 1 - offset;
    return idx >= 0 ? series[idx] : null;
  }],

  ['valuewhen', function(condition, source, occurrence = 1) {
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
  }],

  ['barssince', function(condition) {
    if (condition === null || condition === undefined) return null;
    if (!Array.isArray(condition)) {
      return condition ? 0 : null;
    }
    for (let i = condition.length - 1; i >= 0; i--) {
      if (condition[i]) return condition.length - 1 - i;
    }
    return null;
  }],

  // Time and date functions for extracting calendar components from timestamps
  ['year', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getFullYear();
  }],

  ['month', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getMonth() + 1;
  }],

  ['weekofyear', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay();
    d.setUTCDate(d.getUTCDate() + 4 - (dayNum || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }],

  ['dayofmonth', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getDate();
  }],

  ['hour', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getHours();
  }],

  ['minute', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getMinutes();
  }],

  ['second', function(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.getSeconds();
  }],

  ['timestamp', function(year, month, day, hour = 0, minute = 0, second = 0) {
    return Date.UTC(year, month - 1, day, hour, minute, second);
  }],

  // Type checking and null-coalescing helpers for handling missing or invalid values
  ['na', function(value) {
    return value === null || value === undefined || (typeof value === 'number' && isNaN(value));
  }],

  ['nz', function(value, replacement = 0) {
    return value === null || value === undefined || isNaN(value) ? replacement : value;
  }],

  ['isna', function(value) {
    return value === null || value === undefined || isNaN(value);
  }],

  ['isempty', function(value) {
    return value === null || value === undefined || value === '';
  }],

  ['fixnan', function(value, replacement = 0) {
    return builtins.get('nz')(value, replacement);
  }],

  // Plotting and visual output stubs that record drawing instructions for the runtime
  ['plot', function(series, title = '', color = null, linewidth = 1) {
    globalThis.__pineRuntime.plots.push({
      series,
      title,
      color,
      linewidth
    });
    return series;
  }],

  ['lineNew', function(x1, y1, x2, y2, opts = {}) {
    return { x1, y1, x2, y2, opts, _type: 'line' };
  }],

  ['lineDelete', function(l) {
    return null;
  }],

  // Functions to update or read individual coordinates on an existing line object
  ['lineSetXY', function(line, point, x, y) {
    if (!line) return null;
    if (point === 0 || point === 'x1') { line.x1 = x; line.y1 = y; }
    else { line.x2 = x; line.y2 = y; }
    return line;
  }],

  ['lineGetX', function(line, point) {
    if (!line) return null;
    return point === 0 || point === 'x1' ? line.x1 : line.x2;
  }],

  ['lineGetY', function(line, point) {
    if (!line) return null;
    return point === 0 || point === 'y1' ? line.y1 : line.y2;
  }],

  ['labelNew', function(x, y, text = '', opts = {}) {
    return { x, y, text, opts, _type: 'label' };
  }],

  ['labelDelete', function(l) {
    return null;
  }],

  // Update or retrieve the text content of a label object
  ['labelSetText', function(label, text) {
    if (!label) return null;
    label.text = text;
    return label;
  }],

  ['labelGetText', function(label) {
    if (!label) return '';
    return label.text || '';
  }],

  // Box drawing functions for creating rectangular shapes on the chart
  ['boxNew', function(left, top, right, bottom, opts = {}) {
    return { left, top, right, bottom, opts, _type: 'box' };
  }],

  ['boxDelete', function(box) {
    return null;
  }],

  ['boxSetLeftTop', function(box, left, top) {
    if (!box) return null;
    box.left = left;
    box.top = top;
    return box;
  }],

  ['boxSetRightBottom', function(box, right, bottom) {
    if (!box) return null;
    box.right = right;
    box.bottom = bottom;
    return box;
  }],

  // Polyline drawing functions for multi-point paths on the chart
  ['polylineNew', function(points, opts = {}) {
    return { points: points || [], opts, _type: 'polyline' };
  }],

  ['polylineDelete', function(poly) {
    return null;
  }],

  ['plotshape', function(condition, ...rest) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.plotshapes.push({ condition, args: rest });
    }
    return condition;
  }],

  ['indicator', function(title, shorttitle, overlay, opts) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.indicator = { title, shorttitle, overlay, opts };
    }
    return null;
  }],

  ['strategy', function(title, shorttitle, overlay, opts) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.strategy = { title, shorttitle, overlay, opts };
    }
    return null;
  }],

  ['alertcondition', function(condition, ...rest) {
    if (globalThis.__pineRuntime) {
      globalThis.__pineRuntime.alerts.push({ condition, args: rest });
    }
    return null;
  }],

  ['plotbar', function(open, high, low, close, title, color, editable, showLast) {
    return { open, high, low, close };
  }],

  ['plotcandle', function(open, high, low, close, title, color, wickColor, borderColor, editable, showLast) {
    return { open, high, low, close };
  }],

  ['hline', function(_price, _title, _opts) {
    return null;
  }],

  // Background color and fill stubs for visual styling of chart regions
  ['bgcolor', function(color, title, editable, showLast) {
    return null;
  }],

  ['fill', function(series1, series2, color, title, editable) {
    return null;
  }],

  // Alert functions for triggering notifications based on conditions
  ['alert', function(condition, message, frequency) {
    console.log('Alert:', condition ? message : 'Condition not met');
    return condition;
  }],

  // Strategy order management functions for backtesting trade entries, exits, and position sizing
  ['strategyEntry', function(id, direction, qty, limit, stop, ocaName, ocaType, comment) {
    console.log(`Strategy Entry: ${id} ${direction}`);
    return true;
  }],

  ['strategyExit', function(id, fromEntry, qty, limit, stop, ocaName, comment) {
    console.log(`Strategy Exit: ${id}`);
    return true;
  }],

  ['strategyOrder', function(id, direction, qty, limit, stop, ocaName, ocaType, comment) {
    console.log(`Strategy Order: ${id} ${direction}`);
    return true;
  }],

  ['strategyClose', function(id, comment, qty, percent, immediately) {
    console.log(`Strategy Close: ${id}`);
    return true;
  }],

  ['strategyLong', function() {
    return 'long';
  }],

  ['strategyShort', function() {
    return 'short';
  }],

  // Chart point constructors for positioning drawings by bar index or timestamp
  ['chartPointFromIndex', function(_index, _price) {
    return { index: _index ?? null, price: _price ?? null };
  }],

  ['chartPointNew', function(_time, _price) {
    return { time: _time ?? null, price: _price ?? null };
  }],

  // Map data structure functions for key-value storage within scripts
  ['mapNew', function() {
    return new Map();
  }],

  ['mapSize', function(m) {
    return m instanceof Map ? m.size : 0;
  }],

  ['mapGet', function(m, key, defval) {
    if (!(m instanceof Map)) return defval ?? null;
    if (!m.has(key)) return defval ?? null;
    return m.get(key);
  }],

  ['mapSet', function(m, key, value) {
    if (!(m instanceof Map)) return null;
    m.set(key, value);
    return value;
  }],

  ['mapRemove', function(m, key) {
    if (!(m instanceof Map)) return false;
    return m.delete(key);
  }],

  ['mapKeys', function(m) {
    if (!(m instanceof Map)) return [];
    return Array.from(m.keys());
  }],

  ['mapValues', function(m) {
    if (!(m instanceof Map)) return [];
    return Array.from(m.values());
  }],

  ['mapContains', function(m, key) {
    if (!(m instanceof Map)) return false;
    return m.has(key);
  }],

  // Matrix operations for linear algebra computations within scripts
  ['matrixNew', function(rows, cols, initialValue = 0) {
    const r = Math.max(0, rows ?? 0);
    const c = Math.max(0, cols ?? 0);
    const data = Array.from({ length: r }, () => Array.from({ length: c }, () => initialValue));
    return { rows: r, cols: c, data };
  }],

  ['matrixRows', function(m) {
    return m?.rows ?? 0;
  }],

  ['matrixCols', function(m) {
    return m?.cols ?? 0;
  }],

  ['matrixGet', function(m, row, col) {
    if (!m || !Array.isArray(m.data)) return null;
    return m.data?.[row]?.[col] ?? null;
  }],

  ['matrixSet', function(m, row, col, value) {
    if (!m || !Array.isArray(m.data)) return null;
    if (!Array.isArray(m.data[row])) return null;
    m.data[row][col] = value;
    return value;
  }],

  ['matrixFill', function(m, value) {
    if (!m || !Array.isArray(m.data)) return null;
    for (let r = 0; r < (m.rows ?? 0); r++) {
      for (let c = 0; c < (m.cols ?? 0); c++) {
        if (m.data[r]) m.data[r][c] = value;
      }
    }
    return m;
  }],

  ['matrixSum', function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    let s = 0;
    for (let r = 0; r < (m.rows ?? 0); r++) {
      for (let c = 0; c < (m.cols ?? 0); c++) {
        const v = m.data?.[r]?.[c];
        if (typeof v === 'number' && !Number.isNaN(v)) s += v;
      }
    }
    return s;
  }],

  ['matrixAvg', function(m) {
    if (!m || !Array.isArray(m.data)) return null;
    const n = (m.rows ?? 0) * (m.cols ?? 0);
    if (n === 0) return null;
    const s = builtins.get('matrixSum')(m);
    return (typeof s === 'number') ? (s / n) : null;
  }],

  ['matrixMin', function(m) {
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
  }],

  ['matrixMax', function(m) {
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
  }],

  ['matrixTranspose', function(m) {
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
  }],

  ['matrixMult', function(a, b) {
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
  }],

  ['matrixInv', function(m) {
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
  }],

  // External data request stub that passes through the expression in single-security mode
  ['requestSecurity', function(symbol, timeframe, expression) {
    return expression;
  }],

  // Array manipulation functions that mirror PineScript's array namespace
  ['arrayNew', function(initialSize = 0, initialValue = 0) {
    return Array(initialSize).fill(initialValue);
  }],

  ['arraySize', function(arr) {
    return arr ? arr.length : 0;
  }],

  ['arrayGet', function(arr, index) {
    return arr && arr[index] !== undefined ? arr[index] : null;
  }],

  ['arraySet', function(arr, index, value) {
    if (arr) arr[index] = value;
    return value;
  }],

  ['arrayPush', function(arr, value) {
    if (arr) arr.push(value);
    return value;
  }],

  ['arrayPop', function(arr) {
    return arr ? arr.pop() : null;
  }],

  ['arrayShift', function(arr) {
    return arr ? arr.shift() : null;
  }],

  ['arrayUnshift', function(arr, value) {
    if (arr) arr.unshift(value);
    return value;
  }],

  ['arrayClear', function(arr) {
    if (arr) arr.length = 0;
    return null;
  }],

  ['arrayInsert', function(arr, index, value) {
    if (!arr) return value;
    const i = Math.max(0, Math.min(arr.length, Number(index) || 0));
    arr.splice(i, 0, value);
    return value;
  }],

  ['arrayRemove', function(arr, index) {
    if (!arr) return null;
    const i = Number(index) || 0;
    if (i < 0 || i >= arr.length) return null;
    const removed = arr.splice(i, 1);
    return removed.length ? removed[0] : null;
  }],

  ['arrayFill', function(arr, value, startIndex = 0, endIndex = null) {
    if (!arr) return arr;
    const start = Number(startIndex) || 0;
    const end = endIndex === null || endIndex === undefined ? arr.length : Number(endIndex) || 0;
    arr.fill(value, start, end);
    return arr;
  }],

  ['arraySlice', function(arr, startIndex = 0, endIndex = null) {
    if (!arr) return [];
    const start = Number(startIndex) || 0;
    const end = endIndex === null || endIndex === undefined ? arr.length : Number(endIndex) || 0;
    return arr.slice(start, end);
  }],

  ['arraySort', function(arr, order = 'ascending') {
    if (arr) arr.sort((a, b) => order === 'ascending' ? a - b : b - a);
    return arr;
  }],

  ['arrayReverse', function(arr) {
    if (arr) arr.reverse();
    return arr;
  }],

  ['arrayContains', function(arr, value) {
    return arr ? arr.includes(value) : false;
  }],

  ['arrayIndexOf', function(arr, value) {
    return arr ? arr.indexOf(value) : -1;
  }],

  // Searches from the end of the array and returns the last index where the value is found
  ['arrayLastIndexOf', function(arr, value) {
    return arr ? arr.lastIndexOf(value) : -1;
  }],

  ['arraySum', function(arr) {
    return arr ? arr.reduce((a, b) => a + b, 0) : 0;
  }],

  ['arrayAvg', function(arr) {
    return arr && arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }],

  ['arrayMin', function(arr) {
    return arr && arr.length > 0 ? Math.min(...arr) : null;
  }],

  ['arrayMax', function(arr) {
    return arr && arr.length > 0 ? Math.max(...arr) : null;
  }],

  // Computes the standard deviation of all elements in the array
  ['arrayStdev', function(arr) {
    if (!arr || arr.length === 0) return null;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }],

  // Computes the variance of all elements in the array
  ['arrayVariance', function(arr) {
    if (!arr || arr.length === 0) return null;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  }],

  // Computes the covariance between two arrays of equal length
  ['arrayCovariance', function(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length === 0 || arr1.length !== arr2.length) return null;
    const mean1 = arr1.reduce((a, b) => a + b, 0) / arr1.length;
    const mean2 = arr2.reduce((a, b) => a + b, 0) / arr2.length;
    let cov = 0;
    for (let i = 0; i < arr1.length; i++) {
      cov += (arr1[i] - mean1) * (arr2[i] - mean2);
    }
    return cov / arr1.length;
  }],

  // Returns the most frequently occurring value in an array
  ['mode', function(arr) {
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
  }],

  // String manipulation functions for working with text values
  ['strLength', function(str) {
    return str ? str.length : 0;
  }],

  ['strSubstring', function(str, from, to) {
    return str ? str.substring(from, to) : '';
  }],

  ['strConcat', function(...args) {
    return args.join('');
  }],

  ['strContains', function(str, substring) {
    return str ? str.includes(substring) : false;
  }],

  ['strStartsWith', function(str, prefix) {
    return str ? str.startsWith(prefix) : false;
  }],

  ['strEndsWith', function(str, suffix) {
    return str ? str.endsWith(suffix) : false;
  }],

  ['strReplace', function(str, from, to) {
    return str ? str.replace(from, to) : '';
  }],

  ['strReplaceAll', function(str, from, to) {
    return str ? str.split(from).join(to) : '';
  }],

  ['strLower', function(str) {
    return str ? str.toLowerCase() : '';
  }],

  ['strUpper', function(str) {
    return str ? str.toUpperCase() : '';
  }],

  ['strToNumber', function(str) {
    return str ? parseFloat(str) : 0;
  }],

  ['strToString', function(value) {
    return String(value);
  }],

  ['strSplit', function(str, delimiter) {
    return str ? str.split(delimiter) : [];
  }],

  ['strMatch', function(str, regex) {
    const match = str.match(new RegExp(regex));
    return match ? match[0] : '';
  }],

  ['strPos', function(str, substring) {
    return str ? str.indexOf(substring) : -1;
  }],

  ['strRPos', function(str, substring) {
    return str ? str.lastIndexOf(substring) : -1;
  }],

  ['strRemove', function(str, from, to) {
    return str ? str.substring(0, from) + str.substring(to) : '';
  }],

  ['strReverse', function(str) {
    return str ? str.split('').reverse().join('') : '';
  }],

  // Formats a string by replacing placeholders like {0}, {1} with the corresponding arguments
  ['strFormat', function(formatStr, ...args) {
    if (!formatStr) return '';
    return formatStr.replace(/\{(\d+)\}/g, (match, idx) => {
      const i = parseInt(idx, 10);
      return i < args.length ? String(args[i]) : match;
    });
  }],

  // Input functions that provide default values when scripts are run outside TradingView
  ['input', function(defval, title, tooltip, inline, group) {
    return defval;
  }],

  ['inputInt', function(defval = 0, title, minval, maxval, step, tooltip, inline, group) {
    return defval;
  }],

  ['inputFloat', function(defval = 0.0, title, minval, maxval, step, tooltip, inline, group) {
    return defval;
  }],

  ['inputBool', function(defval = false, title, tooltip, inline, group) {
    return defval;
  }],

  ['inputString', function(defval = '', title, options, tooltip, inline, group) {
    return defval;
  }],

  ['inputSource', function(defval = null, title, tooltip, inline, group) {
    return defval;
  }],

  ['inputColor', function(defval = '#000000', title, tooltip, inline, group) {
    return defval;
  }],

  ['inputTime', function(defval = 0, title, tooltip, inline, group) {
    return defval;
  }],

  // Additional math functions that complement the basic arithmetic operations
  ['mathSign', function(value) {
    return Math.sign(value);
  }],

  // Variadic average that accepts any number of numeric arguments
  ['mathAvg', function(...args) {
    const valid = args.filter(v => v !== null && v !== undefined && !isNaN(v));
    return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  }],

  // Windowed sum over the last N elements of a series, similar to ta.sum in PineScript
  ['mathSum', function(series, length) {
    if (!series || series.length < length) return null;
    return series.slice(-length).reduce((a, b) => a + b, 0);
  }],

  // Returns a pseudo-random number between 0 (inclusive) and 1 (exclusive)
  ['mathRandom', function(min = 0, max = 1) {
    return min + Math.random() * (max - min);
  }],

  // Converts radians to degrees
  ['mathTodegrees', function(radians) {
    return radians * (180 / Math.PI);
  }],

  // Converts degrees to radians
  ['mathToradians', function(degrees) {
    return degrees * (Math.PI / 180);
  }],

  // Returns the transparency component of a color, or sets it if a value is provided
  ['colorT', function(color, transparency) {
    if (transparency !== undefined) {
      return { color, transparency };
    }
    if (color && typeof color === 'object' && 'transparency' in color) {
      return color.transparency;
    }
    return 0;
  }],

  // Table cell and management stubs for scripts that create tabular displays on the chart
  ['tableCellSetText', function(table, column, row, text) {
    return null;
  }],

  ['tableCellSetBgcolor', function(table, column, row, bgcolor) {
    return null;
  }],

  ['tableMergeCells', function(table, startColumn, startRow, endColumn, endRow) {
    return null;
  }],

  ['tableDelete', function(table) {
    return null;
  }],

  ['tableClear', function(table, startColumn, startRow, endColumn, endRow) {
    return null;
  }],

  // Stub that tells the runtime to allocate historical buffer depth; has no effect in JavaScript
  ['maxBarsBack', function(series, length) {
    return null;
  }],

  // Mathematical and market data constants
  ['pi', Math.PI],
  ['e', Math.E],
  ['true', true],
  ['false', false],
  ['ticker', 'AAPL'],
  ['tickerid', 'NASDAQ:AAPL'],
  ['syminfo', function(type) {
    const info = { ticker: 'AAPL', tickerid: 'NASDAQ:AAPL', prefix: 'NASDAQ', root: 'AAPL', suffix: '' };
    return info[type] || '';
  }],
  ['time', Date.now()],
  ['timenow', Date.now()],
  ['barstate', 'LAST'],
  ['dividends', {}],
  ['splits', {}],
  ['earnings', {}],
  ['volume', 0],
  ['open', 0],
  ['high', 0],
  ['low', 0],
  ['close', 0],
  ['pivothigh', function(_leftBars, _rightBars) {
    return null;
  }],
  ['pivotlow', function(_leftBars, _rightBars) {
    return null;
  }],
  ['tr', function(high, low, close) {
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
  }],

  ['arrayFirst', function(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[0];
  }],

  ['arrayLast', function(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[arr.length - 1];
  }],

  ['arrayJoin', function(arr, separator = ',') {
    if (!arr) return '';
    return arr.join(separator);
  }],

  ['arrayConcat', function(arr1, arr2) {
    if (!arr1) return arr2 || [];
    if (!arr2) return arr1;
    return arr1.concat(arr2);
  }],

  ['arrayCopy', function(arr) {
    if (!arr) return [];
    return [...arr];
  }],

  ['arrayBinarySearch', function(arr, value) {
    if (!arr || arr.length === 0) return -1;
    let lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid] === value) return mid;
      if (arr[mid] < value) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }],

  ['arrayRange', function(arr) {
    if (!arr || arr.length === 0) return 0;
    return Math.max(...arr) - Math.min(...arr);
  }],

  ['arrayMedian', function(arr) {
    if (!arr || arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }],

  ['arrayMode', function(arr) {
    if (!arr || arr.length === 0) return null;
    const freq = {};
    let maxCount = 0;
    let mode = arr[0];
    for (const v of arr) {
      freq[v] = (freq[v] || 0) + 1;
      if (freq[v] > maxCount) { maxCount = freq[v]; mode = v; }
    }
    return mode;
  }],

  ['arrayPercentile', function(arr, percentile) {
    if (!arr || arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = (percentile / 100) * (sorted.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  }],

  ['arrayPercentileLinearInterpolation', function(arr, percentile) {
    return builtins.get('arrayPercentile')(arr, percentile);
  }],

  ['arrayPercentileNearestRank', function(arr, percentile) {
    if (!arr || arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)];
  }],

  ['arrayAbs', function(arr) {
    if (!arr) return [];
    return arr.map(v => Math.abs(v));
  }],

  ['arrayEvery', function(arr, callback) {
    if (!arr) return false;
    return arr.every(callback);
  }],

  ['arraySome', function(arr, callback) {
    if (!arr) return false;
    return arr.some(callback);
  }],

  ['requestFinancial', function() {
    return null;
  }],
]);

export default builtins;
