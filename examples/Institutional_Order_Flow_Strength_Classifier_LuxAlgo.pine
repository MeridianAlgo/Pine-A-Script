// This work is licensed under a Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) https://creativecommons.org/licenses/by-nc-sa/4.0/
// © LuxAlgo
//@version=6
indicator("Institutional Order Flow Strength Classifier [LuxAlgo]", "LuxAlgo - Institutional Order Flow Strength Classifier", overlay = true, max_boxes_count = 100, max_labels_count = 100)

//---------------------------------------------------------------------------------------------------------------------}
// Constants & Inputs
//---------------------------------------------------------------------------------------------------------------------{
color BULL_COLOR = #089981
color BEAR_COLOR = #f23645
color TEXT_COLOR = chart.fg_color

string OB_GROUP   = "Order Block Settings"
int pivotLenInput = input.int(5, "Pivot Lookback", minval = 2, group = OB_GROUP)
int maxOBsInput   = input.int(5, "Max Unmitigated OBs", minval = 1, maxval = 50, group = OB_GROUP)

string VIS_GROUP   = "Visualization"
color bullColorInput = input.color(color.new(BULL_COLOR, 80), "Bullish OB Color", group = VIS_GROUP)
color bearColorInput = input.color(color.new(BEAR_COLOR, 80), "Bearish OB Color", group = VIS_GROUP)
bool hideOverlappedInput = input.bool(true, "Hide Overlapped Zones", group = VIS_GROUP)
bool showLabelsInput = input.bool(true, "Show Strength Labels", group = VIS_GROUP)
bool showStrongestInput = input.bool(true, "Show Strongest OB Plot", group = VIS_GROUP)
int bufferSizeInput = input.int(5, "Strongest OB Buffer Size", minval = 1, maxval = 100, group = VIS_GROUP)

//---------------------------------------------------------------------------------------------------------------------}
// Types & Methods
//---------------------------------------------------------------------------------------------------------------------{
type OrderBlock
    float top
    float bottom
    int   startTime
    float strength
    bool  isBullish
    box   boxId
    label labelId
    bool  mitigated

//---------------------------------------------------------------------------------------------------------------------}
// Functions
//---------------------------------------------------------------------------------------------------------------------{
// Calculate OB Strength using displacement and volume factors
calculateStrength(float obRange, float breakoutDist, float relVol) =>
    float dispFactor = math.min(breakoutDist / (obRange * 5), 1.0)
    float volFactor = math.min(relVol / 2.0, 1.0)
    float score = (dispFactor * 0.6 + volFactor * 0.4) * 100
    math.round(score, 1)

//---------------------------------------------------------------------------------------------------------------------}
// Main Logic
//---------------------------------------------------------------------------------------------------------------------{
var obArray = array.new<OrderBlock>()
float volSMA = ta.sma(volume, 20)

// Pivot Detection
float hi = ta.pivothigh(pivotLenInput, pivotLenInput)
float lo = ta.pivotlow(pivotLenInput, pivotLenInput)

var float lastHi = na
var float lastLo = na
var int lastHiIdx = na
var int lastLoIdx = na

if not na(hi)
    lastHi := hi
    lastHiIdx := bar_index - pivotLenInput
if not na(lo)
    lastLo := lo
    lastLoIdx := bar_index - pivotLenInput

// Market Structure Break (BOS) detection
bool bullBOS = ta.crossover(close, lastHi)
bool bearBOS = ta.crossunder(close, lastLo)

if bullBOS or bearBOS
    int searchLen = bar_index - (bullBOS ? lastHiIdx : lastLoIdx)
    float obTop = na
    float obBtm = na
    int obIdx = na
    float obVol = na
    
    if bullBOS
        float minLow = na
        for i = 1 to searchLen
            if close[i] < open[i]
                if na(minLow) or low[i] < minLow
                    minLow := low[i]
                    obTop := high[i]
                    obBtm := low[i]
                    obIdx := i
                    obVol := volume[i]
        lastHi := na 
    else
        float maxHigh = na
        for i = 1 to searchLen
            if close[i] > open[i]
                if na(maxHigh) or high[i] > maxHigh
                    maxHigh := high[i]
                    obTop := high[i]
                    obBtm := low[i]
                    obIdx := i
                    obVol := volume[i]
        lastLo := na
        
    if not na(obIdx)
        float obHeight = obTop - obBtm
        float breakoutDist = bullBOS ? (close - obTop) : (obBtm - close)
        float avgVol = volSMA[obIdx]
        float strength = calculateStrength(obHeight, breakoutDist, obVol / avgVol)
        
        OrderBlock newOB = OrderBlock.new(obTop, obBtm, time[obIdx], strength, bullBOS, na, na, false)
        array.unshift(obArray, newOB)

//---------------------------------------------------------------------------------------------------------------------}
// Mitigation, Strongest Tracking & Array Management
//---------------------------------------------------------------------------------------------------------------------{
// 1. Mitigation Check (Every Bar)
if array.size(obArray) > 0
    for i = 0 to array.size(obArray) - 1
        OrderBlock ob = array.get(obArray, i)
        if not ob.mitigated
            bool isMitigated = ob.isBullish ? low < ob.bottom : high > ob.top
            if isMitigated
                ob.mitigated := true

// 2. Strongest OB tracking within buffer
float strongestTop = na
float strongestBottom = na
float strongestAvgPrice = na
bool  strongestIsBullish = false
float maxStrength = -1.0

if array.size(obArray) > 0
    int checkedCount = 0
    for i = 0 to array.size(obArray) - 1
        OrderBlock ob = array.get(obArray, i)
        if not ob.mitigated
            if ob.strength > maxStrength
                maxStrength := ob.strength
                strongestTop := ob.top
                strongestBottom := ob.bottom
                strongestAvgPrice := (ob.top + ob.bottom) / 2
                strongestIsBullish := ob.isBullish
            
            checkedCount += 1
            if checkedCount >= bufferSizeInput
                break

// Plot strongest OB zone with directional color and clear cut on change
color plotCol = na(strongestAvgPrice) ? na : (strongestIsBullish ? bullColorInput : bearColorInput)
bool  hasChanged = strongestAvgPrice != strongestAvgPrice[1]

plotTop = plot(showStrongestInput ? strongestTop : na, "Strongest OB Top", color = hasChanged ? na : color.new(plotCol, 70))
plotBtm = plot(showStrongestInput ? strongestBottom : na, "Strongest OB Bottom", color = hasChanged ? na : color.new(plotCol, 70))
fill(plotTop, plotBtm, hasChanged ? na : color.new(plotCol, 90), "Strongest OB Zone Fill")

plot(showStrongestInput ? strongestAvgPrice : na, "Strongest OB Median", color = hasChanged ? na : color.new(plotCol, 40), linewidth = 2)

//---------------------------------------------------------------------------------------------------------------------}
// 3. Visual Management (Last Bar)
if barstate.islast
    int activeCount = 0
    var occupiedTops = array.new_float(0)
    var occupiedBtms = array.new_float(0)
    array.clear(occupiedTops)
    array.clear(occupiedBtms)
    
    if array.size(obArray) > 0
        for i = 0 to array.size(obArray) - 1
            OrderBlock ob = array.get(obArray, i)
            
            bool isOverlapped = false
            if not ob.mitigated and hideOverlappedInput and array.size(occupiedTops) > 0
                for j = 0 to array.size(occupiedTops) - 1
                    float otherTop = array.get(occupiedTops, j)
                    float otherBtm = array.get(occupiedBtms, j)
                    if (ob.top <= otherTop and ob.top >= otherBtm) or (ob.bottom <= otherTop and ob.bottom >= otherBtm) or (ob.top >= otherTop and ob.bottom <= otherBtm)
                        isOverlapped := true
                        break

            if not ob.mitigated and not isOverlapped and activeCount < maxOBsInput
                activeCount += 1
                array.push(occupiedTops, ob.top)
                array.push(occupiedBtms, ob.bottom)
                
                color obCol = ob.isBullish ? bullColorInput : bearColorInput
                color labelCol = ob.isBullish ? BULL_COLOR : BEAR_COLOR

                if na(ob.boxId)
                    ob.boxId := box.new(ob.startTime, ob.top, time, ob.bottom, bgcolor = obCol, border_color = obCol, border_style = line.style_dashed, xloc = xloc.bar_time)
                
                if showLabelsInput
                    if na(ob.labelId)
                        ob.labelId := label.new(time, (ob.top + ob.bottom) / 2, text = str.format("{0}%", ob.strength), style = label.style_label_left, textcolor = labelCol, color = #00000000, size = size.small, textalign = text.align_center, xloc = xloc.bar_time)
            else
                if not na(ob.boxId)
                    box.delete(ob.boxId)
                    ob.boxId := na
                if not na(ob.labelId)
                    label.delete(ob.labelId)
                    ob.labelId := na

// 4. Memory management (Every bar)
if array.size(obArray) > 100
    for i = array.size(obArray) - 1 to 0
        OrderBlock ob = array.get(obArray, i)
        if ob.mitigated and array.size(obArray) > 50
            array.remove(obArray, i)
        else if array.size(obArray) > 100
            array.pop(obArray)

//---------------------------------------------------------------------------------------------------------------------}
