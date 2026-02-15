// This work is licensed under a Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) https://creativecommons.org/licenses/by-nc-sa/4.0/
// © LuxAlgo

//@version=6
indicator("Volume Surprise [LuxAlgo]", "LuxAlgo - Volume Surprise", overlay = false, format = format.volume)
//---------------------------------------------------------------------------------------------------------------------}
// Settings
//---------------------------------------------------------------------------------------------------------------------{
length = input.int(50,
  minval = 1)

smooth = input.int(1,
  minval = 1)

// Periods
autoFormat = input(true, 'Auto Selection',
  group = 'Periods',
  tooltip = 'Automatically choose a practical combination of periods based on the chart timeframe')

considerMinutes = input(true, 'Minutes',
  group = 'Periods')

considerHours = input(true, 'Hours',
  group = 'Periods')

considerDays = input(false, 'Days',
   inline = 'day',
   group = 'Periods')

daysOptions = input.string('Day of Week', '',
  options = ['Day of Week', 'Day of Month', 'Day of Year'],
  inline = 'day',
  group = 'Periods')

considerMonths = input(false, 'Months',
  group = 'Periods')

considerQuarters = input(false, 'Quarters',
  group = 'Periods')

// Summary
summaryMethod = input.string('Mean', 'Method',
  options = ['Mean', 'Percentile'],
  group = 'Summary')

percentile = input(50,
  active = summaryMethod == 'Percentile',
  group = 'Summary')

// Forecast
showForecast = input(true, 'Show Forecast',
  group = 'Forecast')

forecastWindow = input.int(50, 'Forecast Window',
  minval = 1,
  maxval = 499,
  group = 'Forecast')

forecastStyleColor = input(#2962ff, 'Style',
  inline = 'forecast_style',
  group = 'Forecast')

forecastStyleLine = input.string('Dotted', '',
  options = ['Solid', 'Dashed', 'Dotted'],
  inline = 'forecast_style',
  group = 'Forecast')

//---------------------------------------------------------------------------------------------------------------------}
// Types
//---------------------------------------------------------------------------------------------------------------------{
type vector
    array<float> v

//---------------------------------------------------------------------------------------------------------------------}
// Methods
//---------------------------------------------------------------------------------------------------------------------{
method getSummary(map<string, vector> id, key) =>
    summary = switch summaryMethod
        'Mean' => id.get(key).v.avg()
        'Percentile' => id.get(key).v.percentile_linear_interpolation(percentile)

//---------------------------------------------------------------------------------------------------------------------}
// Calculations
//---------------------------------------------------------------------------------------------------------------------{
if barstate.isfirst and autoFormat
    if timeframe.isseconds
        considerMinutes := true, considerHours := true, considerDays := false, considerMonths := false, considerQuarters := false
    else if timeframe.isminutes and timeframe.in_seconds(timeframe.period) >= 3600
        considerMinutes := false, considerHours := true, considerDays := true, considerMonths := false, considerQuarters := false
    else if timeframe.isminutes
        considerMinutes := true, considerHours := true, considerDays := false, considerMonths := false, considerQuarters := false
    else
        considerMinutes := false, considerHours := false, considerDays := false, considerMonths := true, considerQuarters := true

// custom datetime format
var format =
  str.format('{0}{1}{2}{3}{4}ss',
  considerQuarters ? str.tostring(math.ceil(month / 3)) : '',
  considerMonths ? 'MM:' : '',
  considerDays ? (daysOptions == 'Day of Week' ? 'EEE:' : daysOptions == 'Day of Month' ? 'dd:' : 'DDD:') : '',
  considerHours ? 'hh:' : '',
  considerMinutes ? 'mm:' : ''
  )

var data = map.new<string, vector>()

vol = ta.sma(volume, smooth)
key = str.format_time(time, format)

// Add new vector to map if key is not found
if not data.keys().includes(key)
    data.put(key, vector.new(array.new<float>(0)))

summary = data.getSummary(key)

data.get(key).v.push(vol)

// Trim vector
if data.get(key).v.size() > length
    data.get(key).v.shift()

//---------------------------------------------------------------------------------------------------------------------}
//Forecast
//---------------------------------------------------------------------------------------------------------------------{
var forecastStyle = switch forecastStyleLine
    'Solid' => line.style_solid
    'Dashed' => line.style_dashed
    'Dotted' => line.style_dotted

if showForecast and barstate.islast
    forecastCoordinates = array.new<chart.point>(0)
    forecastCoordinates.push(chart.point.from_time(time, summary))

    for i = 1 to forecastWindow
        t = time(timeframe.period, bars_back = -i)
        forecastKey = str.format_time(t, format)

        // Forecasted value
        if data.keys().includes(forecastKey)
            forecastValue = data.getSummary(forecastKey)
            forecastCoordinates.push(chart.point.from_time(t, forecastValue))
        else
            forecastCoordinates.push(chart.point.from_time(t, na))
    
    polyline.delete(polyline.new(forecastCoordinates, xloc = xloc.bar_time, line_style = forecastStyle, line_color = forecastStyleColor)[1])

//---------------------------------------------------------------------------------------------------------------------}
//Plot
//---------------------------------------------------------------------------------------------------------------------{
css = vol > summary ? color.new(#089981, 50) : color.new(#f23645, 50)

plotVolume = plot(vol, 'Volume', color = color.gray)
plotEv = plot(summary, 'Expected Volume', color = color.orange, linestyle = plot.linestyle_dotted)

plot(vol - summary, 'Difference',
  style = plot.style_columns,
  color = css)

//---------------------------------------------------------------------------------------------------------------------}