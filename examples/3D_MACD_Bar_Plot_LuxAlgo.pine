// This work is licensed under a Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) https://creativecommons.org/licenses/by-nc-sa/4.0/
// © LuxAlgo

//@version=6
indicator("3D MACD Bar Plot [LuxAlgo]", "LuxAlgo - 3D MACD Bar Plot", overlay = false, max_lines_count = 500, max_labels_count = 500, max_polylines_count = 100)

//---------------------------------------------------------------------------------------------------------------------}
// Constants
//---------------------------------------------------------------------------------------------------------------------{


//---------------------------------------------------------------------------------------------------------------------}
// Inputs
//---------------------------------------------------------------------------------------------------------------------{
string GRID_GRP = 'Grid Configuration'
fastMinInput    = input.int(5,   'Fast Min Length', minval = 2, group = GRID_GRP)
fastMaxInput    = input.int(25,  'Fast Max Length', minval = 2, group = GRID_GRP)
fastStepInput   = input.int(5,   'Fast Step',       minval = 1, group = GRID_GRP)

slowMinInput    = input.int(10,  'Slow Min Length', minval = 2, group = GRID_GRP)
slowMaxInput    = input.int(50,  'Slow Max Length', minval = 2, group = GRID_GRP)
slowStepInput   = input.int(10,  'Slow Step',       minval = 1, group = GRID_GRP)

string PROJ_GRP = '3D Projection Settings'
yOffsetInput    = input.float(0.0, 'Y Baseline Price',               group = PROJ_GRP)
scaleXInput     = input.float(3.0, 'X Spacing (bars)',               group = PROJ_GRP)
scaleZInput     = input.float(5.0, 'Z Height (Relative to Y Spacing)', group = PROJ_GRP)

string STYLE_GRP = 'Style'
bullColorInput   = input.color(#089981, 'Bullish Color', group = STYLE_GRP)
bearColorInput   = input.color(#f23645, 'Bearish Color', group = STYLE_GRP)
gridColorInput   = input.color(#808080, 'Grid Color',    group = STYLE_GRP)

//---------------------------------------------------------------------------------------------------------------------}
// Calculations
//---------------------------------------------------------------------------------------------------------------------{
var emaStates     = map.new<int, float>()
var uniqueLengths = array.new_int()

if bar_index == 0
    for f = fastMinInput to fastMaxInput by fastStepInput
        if not uniqueLengths.includes(f)
            uniqueLengths.push(f)
    for s = slowMinInput to slowMaxInput by slowStepInput
        if not uniqueLengths.includes(s)
            uniqueLengths.push(s)

for length in uniqueLengths
    float alpha   = 2.0 / (length + 1.0)
    float prevEma = emaStates.get(length)
    
    if na(prevEma)
        emaStates.put(length, close)
    else
        emaStates.put(length, close * alpha + prevEma * (1.0 - alpha))

//---------------------------------------------------------------------------------------------------------------------}
// Functions
//---------------------------------------------------------------------------------------------------------------------{
// Continuous snaking path for a grid (Rows then Columns)
generateGridPath(matrix<chart.point> pts, int rows, int cols) =>
    array<chart.point> path = array.new<chart.point>()
    // 1. Traverse Rows (Snaking)
    for r = 0 to rows - 1
        if r % 2 == 0
            for c = 0 to cols - 1
                path.push(pts.get(r, c))
        else
            for c = cols - 1 to 0
                path.push(pts.get(r, c))
    
    // 2. Traverse Columns (Snaking, starting from current corner)
    int currC = (rows - 1) % 2 == 0 ? cols - 1 : 0
    if currC == cols - 1
        for c = cols - 1 to 0
            int colIdx = cols - 1 - c
            if colIdx % 2 == 0
                for r = rows - 1 to 0
                    path.push(pts.get(r, c))
            else
                for r = 0 to rows - 1
                    path.push(pts.get(r, c))
    else
        for c = 0 to cols - 1
            if c % 2 == 0
                for r = rows - 1 to 0
                    path.push(pts.get(r, c))
            else
                for r = 0 to rows - 1
                    path.push(pts.get(r, c))
    path

//---------------------------------------------------------------------------------------------------------------------}
// Drawing Storage & Cleanup
//---------------------------------------------------------------------------------------------------------------------{
var linesArray     = array.new<line>()
var labelsArray    = array.new<label>()
var polylinesArray = array.new<polyline>()

if barstate.islast
    // 1. Cleanup old drawings
    while array.size(linesArray) > 0
        line.delete(array.pop(linesArray))
    while array.size(labelsArray) > 0
        label.delete(array.pop(labelsArray))
    while array.size(polylinesArray) > 0
        polyline.delete(array.pop(polylinesArray))

    // 2. Base coordinates
    float basePrice = yOffsetInput
    int   baseBar   = bar_index
    float yStep     = 1.0
    
    // 3. Normalization logic
    float macdMax = 0.0
    for f = fastMinInput to fastMaxInput by fastStepInput
        for s = slowMinInput to slowMaxInput by slowStepInput
            float val = math.abs(emaStates.get(f) - emaStates.get(s))
            if val > macdMax
                macdMax := val
    
    float zMultiplier = macdMax != 0 ? (scaleZInput * yStep) / macdMax : 1.0
    
    // 4. Grid dimensions and matrices
    int fCount = 0
    for f = fastMinInput to fastMaxInput by fastStepInput
        fCount += 1
    int sCount = 0
    for s = slowMinInput to slowMaxInput by slowStepInput
        sCount += 1
        
    int maxDepth = math.max(1, (fCount - 1) + (sCount - 1))
    
    matrix<chart.point> topPoints  = matrix.new<chart.point>(fCount, sCount)
    matrix<chart.point> basePoints = matrix.new<chart.point>(fCount, sCount)
    
    int i = 0
    for f = fastMinInput to fastMaxInput by fastStepInput
        int j = 0
        for s = slowMinInput to slowMaxInput by slowStepInput
            float fEma = emaStates.get(f)
            float sEma = emaStates.get(s)
            float macd = fEma - sEma
            
            float depthFactor = (i + j) / maxDepth
            float barTransp   = 10 + (depthFactor * 70)
            int   barWidth    = int(6 - (5 * depthFactor))

            int screenX  = baseBar + int((i - j) * scaleXInput)
            float screenYB = basePrice + (i + j) * yStep
            float screenYT = screenYB + macd * zMultiplier
            
            chart.point pBase = chart.point.from_index(screenX, screenYB)
            chart.point pTop  = chart.point.from_index(screenX, screenYT)
            
            topPoints.set(i, j, pTop)
            basePoints.set(i, j, pBase)
            
            color barCol = macd >= 0 ? bullColorInput : bearColorInput
            linesArray.push(line.new(pBase, pTop, color = color.new(barCol, barTransp), width = barWidth))
            if i == 0 and j == 0
                labelsArray.push(label.new(pBase, "Origin (F" + str.tostring(f) + ", S" + str.tostring(s) + ")", style = label.style_label_up, textcolor = chart.fg_color, color = #00000000, size = size.small))
            
            if j == 0 and i == fCount - 1
                labelsArray.push(label.new(pBase, "Fast Axis (F" + str.tostring(f) + ")", style = label.style_label_left, textcolor = chart.fg_color, color = #00000000, size = size.small))
            
            if i == 0 and j == sCount - 1
                labelsArray.push(label.new(pBase, "Slow Axis (S" + str.tostring(s) + ")", style = label.style_label_right, textcolor = chart.fg_color, color = #00000000, size = size.small))

            j += 1
        i += 1
        
    // 5. Draw Grid and Surface using Single Polylines
    array<chart.point> surfacePath = generateGridPath(topPoints, fCount, sCount)
    array<chart.point> gridPath    = generateGridPath(basePoints, fCount, sCount)

    polylinesArray.push(polyline.new(surfacePath, line_color = color.new(gridColorInput, 40)))
    polylinesArray.push(polyline.new(gridPath,    line_color = color.new(gridColorInput, 70)))

//---------------------------------------------------------------------------------------------------------------------}
