// This work is licensed under a Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) https://creativecommons.org/licenses/by-nc-sa/4.0/
// © LuxAlgo

//@version=6
indicator('Arbitrage Matrix [LuxAlgo]','LuxAlgo - Arbitrage Matrix', overlay = true)
//---------------------------------------------------------------------------------------------------------------------}
//CONSTANTS & STRINGS & INPUTS
//---------------------------------------------------------------------------------------------------------------------{
RED                     = #F23645
GREEN                   = #089981

AUTO                    = 'Auto'
CRYPTO_EXCHANGES        = 'Crypto Exchanges'
FX_BROKERS              = 'Forex Brokers'

TOP_RIGHT               = 'Top Right'
BOTTOM_RIGHT            = 'Bottom Right'
BOTTOM_LEFT             = 'Bottom Left'

TINY                    = 'Tiny'
SMALL                   = 'Small'
NORMAL                  = 'Normal'
LARGE                   = 'Large'
HUGE                    = 'Huge'

PRICE_LAST              = 'Last Price'
VOLUME_LAST             = 'Last Volume'
PRICE_AVG               = 'Avg Price'
VOLUME_AVG              = 'Avg Volume'

DASHBOARD_GROUP         = 'Dashboard'
STYLE_GROUP             = 'Style'
EXCHANGES_GROUP         = 'Crypto Exchanges'
BROKERS_GROUP           = 'Forex Brokers'

sourceTooltip           = 'Choose between crypto exchanges, forex brokers, or automatic selection based on the asset in the chart.'
averageLengthTooltip    = 'Select the length for the price and volume averages.'

dashboardDataTooltip    = 'Select the data to display.'
dashboardPositionTooltip= 'Select the dashboard location.'
dashboardSizeTooltip    = 'Select the dashboard size.'

bullishColorTooltip     = 'Select bullish color.'
bearishColorTooltip     = 'Select bearish color.'
backgroundTooltip       = 'Enable background gradient color.'

EM_SPACE                = ' '
EN_SPACE                = ' '
FOUR_PER_EM_SPACE       = ' '
SIX_PER_EM_SPACE        = ' '
HAIR_SPACE              = ' '

MS                      = EM_SPACE
NS                      = EN_SPACE
FS                      = FOUR_PER_EM_SPACE
SS                      = SIX_PER_EM_SPACE
HS                      = HAIR_SPACE

sourceInput             = input.string( AUTO,       'Sources',              tooltip = sourceTooltip,        options = [AUTO,CRYPTO_EXCHANGES,FX_BROKERS])
averageLengthInput      = input.int(    20,         'Average Length',       tooltip = averageLengthTooltip)

enableCRYPTOCOMInput    = input.bool(   true,       'CRYPTOCOM',            group = EXCHANGES_GROUP, inline = 'row1')
enableBINANCEInput      = input.bool(   true,       'BINANCE',              group = EXCHANGES_GROUP, inline = 'row1')
enableBYBITInput        = input.bool(   true,       'BYBIT',                group = EXCHANGES_GROUP, inline = 'row1')
enableWEBULLPAYInput    = input.bool(   true,       'WEBULLPAY'+FS+HS,      group = EXCHANGES_GROUP, inline = 'row2')
enableGEMINIInput       = input.bool(   true,       'GEMINI'+NS+FS,         group = EXCHANGES_GROUP, inline = 'row2')
enableCRYPTOInput       = input.bool(   true,       'CRYPTO',               group = EXCHANGES_GROUP, inline = 'row2')
enableBINANCEUSInput    = input.bool(   true,       'BINANCEUS'+FS+SS+HS,   group = EXCHANGES_GROUP, inline = 'row3')
enableKRAKENInput       = input.bool(   true,       'KRAKEN'+FS+HS,         group = EXCHANGES_GROUP, inline = 'row3')
enableBTSEInput         = input.bool(   true,       'BTSE',                 group = EXCHANGES_GROUP, inline = 'row3')
enableBITSTAMPInput     = input.bool(   true,       'BITSTAMP'+MS+SS,       group = EXCHANGES_GROUP, inline = 'row4')
enableKUCOINInput       = input.bool(   true,       'KUCOIN'+NS,            group = EXCHANGES_GROUP, inline = 'row4')
enableHTXInput          = input.bool(   true,       'HTX',                  group = EXCHANGES_GROUP, inline = 'row4')
enableCOINBASEInput     = input.bool(   true,       'COINBASE'+MS+HS,       group = EXCHANGES_GROUP, inline = 'row5')
enableBITGETInput       = input.bool(   true,       'BITGET'+NS+HS+HS,      group = EXCHANGES_GROUP, inline = 'row5')
enableGATEInput         = input.bool(   true,       'GATE',                 group = EXCHANGES_GROUP, inline = 'row5')
enableWHITEBITInput     = input.bool(   true,       'WHITEBIT'+MS+HS+HS,    group = EXCHANGES_GROUP, inline = 'row6')
enableCOINEXInput       = input.bool(   true,       'COINEX'+NS+HS,         group = EXCHANGES_GROUP, inline = 'row6')
enableMEXCInput         = input.bool(   true,       'MEXC',                 group = EXCHANGES_GROUP, inline = 'row6')
enableOKXInput          = input.bool(   true,       'OKX',                  group = EXCHANGES_GROUP, inline = 'row7')

enablePEPPERSTONEInput  = input.bool(   true,       'PEPPERSTONE',          group = BROKERS_GROUP, inline = 'row8')
enableEIGHTCAPInput     = input.bool(   true,       'EIGHTCAP'+FS+SS,       group = BROKERS_GROUP, inline = 'row8')
enableOANDAInput        = input.bool(   true,       'OANDA',                group = BROKERS_GROUP, inline = 'row8')
enableCMCMARKETSInput   = input.bool(   true,       'CMCMARKETS'+FS,        group = BROKERS_GROUP, inline = 'row9')
enableTICKMILLInput     = input.bool(   true,       'TICKMILL'+NS+FS+HS+HS, group = BROKERS_GROUP, inline = 'row9')
enableSAXOInput         = input.bool(   true,       'SAXO',                 group = BROKERS_GROUP, inline = 'row9')
enableCAPITALCOMInput   = input.bool(   true,       'CAPITALCOM'+NS+HS+HS,  group = BROKERS_GROUP, inline = 'row10')
enableFOREXCOMInput     = input.bool(   true,       'FOREXCOM',             group = BROKERS_GROUP, inline = 'row10')
enableIBKRInput         = input.bool(   true,       'IBKR',                 group = BROKERS_GROUP, inline = 'row10')
enableICMARKETSInput    = input.bool(   true,       'ICMARKETS'+MS+FS,      group = BROKERS_GROUP, inline = 'row11')
enableVANTAGEInput      = input.bool(   true,       'VANTAGE'+NS+SS+SS+HS,  group = BROKERS_GROUP, inline = 'row11')
enableFXInput           = input.bool(   true,       'FX',                   group = BROKERS_GROUP, inline = 'row11')
enableIGInput           = input.bool(   true,       'IG',                   group = BROKERS_GROUP, inline = 'row12')

dashboardDataInput      = input.string( PRICE_LAST, 'Data',                 group=DASHBOARD_GROUP, tooltip = dashboardDataTooltip, options = [PRICE_LAST, PRICE_AVG, VOLUME_LAST, VOLUME_AVG])
dashboardPositionInput  = input.string( TOP_RIGHT,  'Position',             group=DASHBOARD_GROUP, tooltip = dashboardPositionTooltip , options = [TOP_RIGHT,BOTTOM_RIGHT,BOTTOM_LEFT])
dashboardSizeInput      = input.string( SMALL,      'Size',                 group=DASHBOARD_GROUP, tooltip = dashboardSizeTooltip,      options = [TINY,SMALL,NORMAL,LARGE,HUGE])

bullishColorInput       = input.color(  GREEN,      'Bullish',              group = STYLE_GROUP, tooltip = bullishColorTooltip)
bearishColorInput       = input.color(  RED,        'Bearish',              group = STYLE_GROUP, tooltip = bearishColorTooltip)
backgroundInput         = input.bool(   true,       'Background Gradient',  group = STYLE_GROUP, tooltip = backgroundTooltip)

//---------------------------------------------------------------------------------------------------------------------}
//DATA STRUCTURES & VARIABLES
//---------------------------------------------------------------------------------------------------------------------{
type asset
    array<float> prices
    array<float> volumes

type data
    array<float> lastPrices
    array<float> lastVolumes
    array<float> avgPrices
    array<float> avgVolumes

var array<string> crypto    = array.new<string>()
var array<string> forex     = array.new<string>()

if barstate.isfirst
    if enableBITSTAMPInput
        crypto.push('BITSTAMP')
    if enableCOINBASEInput
        crypto.push('COINBASE')
    if enableCRYPTOInput
        crypto.push('CRYPTO')
    if enableBINANCEInput
        crypto.push('BINANCE')
    if enableKRAKENInput
        crypto.push('KRAKEN')
    if enableOKXInput
        crypto.push('OKX')
    if enableGEMINIInput
        crypto.push('GEMINI')
    if enableCRYPTOCOMInput
        crypto.push('CRYPTOCOM')
    if enableWEBULLPAYInput
        crypto.push('WEBULLPAY')
    if enableBINANCEUSInput
        crypto.push('BINANCEUS')
    if enableBTSEInput
        crypto.push('BTSE')
    if enableWHITEBITInput
        crypto.push('WHITEBIT')
    if enableBYBITInput
        crypto.push('BYBIT')
    if enableKUCOINInput
        crypto.push('KUCOIN')
    if enableMEXCInput
        crypto.push('MEXC')
    if enableBITGETInput
        crypto.push('BITGET')
    if enableCOINEXInput
        crypto.push('COINEX')
    if enableHTXInput
        crypto.push('HTX')
    if enableGATEInput
        crypto.push('GATE')
    if enableTICKMILLInput
        forex.push('TICKMILL')
    if enableFXInput
        forex.push('FX')
    if enableOANDAInput
        forex.push('OANDA')
    if enableFOREXCOMInput
        forex.push('FOREXCOM')
    if enablePEPPERSTONEInput
        forex.push('PEPPERSTONE')
    if enableCMCMARKETSInput
        forex.push('CMCMARKETS')
    if enableICMARKETSInput
        forex.push('ICMARKETS')
    if enableIBKRInput
        forex.push('IBKR')
    if enableIGInput
        forex.push('IG')
    if enableEIGHTCAPInput
        forex.push('EIGHTCAP')
    if enableSAXOInput
        forex.push('SAXO')
    if enableCAPITALCOMInput
        forex.push('CAPITALCOM')
    if enableVANTAGEInput
        forex.push('VANTAGE')

var array<string> exchanges = sourceInput == AUTO ? (syminfo.type == 'crypto' ? crypto : forex) : sourceInput == CRYPTO_EXCHANGES ? crypto : forex
var data currentData        = data.new(array.new<float>(),array.new<float>(),array.new<float>(),array.new<float>())
var array<asset> assets     = array.from(asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),
     asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),
     asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),
     asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()),asset.new(array.new<float>(),array.new<float>()))

var parsedDashboardPosition = switch dashboardPositionInput
    TOP_RIGHT       => position.top_right
    BOTTOM_RIGHT    => position.bottom_right
    BOTTOM_LEFT     => position.bottom_left

var parsedDashboardSize     = switch dashboardSizeInput
    TINY            => size.tiny
    SMALL           => size.small
    NORMAL          => size.normal
    LARGE           => size.large
    HUGE            => size.huge

//---------------------------------------------------------------------------------------------------------------------}
//USER-DEFINED FUNCTIONS
//---------------------------------------------------------------------------------------------------------------------{
clearData() =>
    currentData.lastPrices.clear()
    currentData.lastVolumes.clear()
    currentData.avgPrices.clear()
    currentData.avgVolumes.clear()

gatherData() =>
    string ticker = syminfo.ticker    
            
    for [index,eachExchange] in exchanges
        string tickerid = eachExchange+':'+ticker        
        [assetPrice,assetVolume] = request.security(tickerid,'',[close,volume], ignore_invalid_symbol = true, calc_bars_count = averageLengthInput)              
        
        if not na(assetPrice)            
            assets.get(index).prices.push(nz(assetPrice))
            if assets.get(index).prices.size() > averageLengthInput
                assets.get(index).prices.shift()            

        if not na(assetVolume)
            assets.get(index).volumes.push(nz(assetVolume))
            if assets.get(index).prices.size() > averageLengthInput            
                assets.get(index).volumes.shift()            

updateData() =>
    clearData()
    for eachAsset in assets
        if eachAsset.prices.size() != 0 
            currentData.lastPrices.push(eachAsset.prices.last())
            currentData.avgPrices.push(eachAsset.prices.avg())
        if eachAsset.volumes.size() != 0
            currentData.lastVolumes.push(eachAsset.volumes.last())
            currentData.avgVolumes.push(eachAsset.volumes.avg())          

cell(table t_able, int column, int row, string data, color = color.white, align = text.align_right, color background = na, string tooltip = '') => t_able.cell(column,row,data,text_color = color, text_size = parsedDashboardSize, text_halign = align, bgcolor = background, tooltip = tooltip)

checkData(int index) => dashboardDataInput == PRICE_LAST or dashboardDataInput == PRICE_AVG ? assets.get(index).prices.size() != 0 and assets.get(index).prices.avg() != 0 : assets.get(index).volumes.size() != 0 and assets.get(index).volumes.avg() != 0 

dashboardData(int column, int row) =>
    switch dashboardDataInput
        PRICE_LAST  => assets.get(row).prices.last()    - assets.get(column).prices.last()
        VOLUME_LAST => assets.get(row).volumes.last()   - assets.get(column).volumes.last()
        PRICE_AVG   => assets.get(row).prices.avg()     - assets.get(column).prices.avg()
        VOLUME_AVG  => assets.get(row).volumes.avg()    - assets.get(column).volumes.avg()

dashboardFormat() => dashboardDataInput == PRICE_LAST or dashboardDataInput == PRICE_AVG ? format.mintick : format.volume

extremeDataValue() =>
    switch dashboardDataInput
        PRICE_LAST  => currentData.lastPrices.range()
        VOLUME_LAST => currentData.lastVolumes.range()
        PRICE_AVG   => currentData.avgPrices.range()
        VOLUME_AVG  => currentData.avgVolumes.range()
    
drawDashboard() =>
    var table t_able    = table.new(parsedDashboardPosition,21,21
     , bgcolor          = #1e222d
     , border_color     = #373a46
     , border_width     = 1
     , frame_color      = #373a46
     , frame_width      = 1
     , force_overlay    = true)   
    
    cell(t_able,0,0,syminfo.ticker, color.new(color.white,20), align = text.align_center)
    t_able.cell_set_text_formatting(0,0,text.format_bold)
    
    for [row,rowExchange] in exchanges
        if checkData(row)    
            cell(t_able,0,row + 1,rowExchange, align = text.align_left)

            for [column,columnExchange] in exchanges
                if checkData(column)                                    
                    float delta = dashboardData(column,row)
                    float maxDelta = extremeDataValue()                    
                    color backgroundColor = backgroundInput ? color.from_gradient(math.abs(delta),0,maxDelta,color.new(delta > 0 ? bullishColorInput : bearishColorInput ,100),color.new(delta > 0 ? bullishColorInput : bearishColorInput ,70)) : na
                    color textColor = color.from_gradient(math.abs(delta),0,maxDelta,color.new(delta > 0 ? bullishColorInput : bearishColorInput ,50),color.new(delta > 0 ? bullishColorInput : bearishColorInput ,0))
                    cell(t_able,column + 1,0,columnExchange, align = text.align_center)                                        
                    cell(t_able,column + 1, row + 1,delta != 0 ? str.tostring(delta,dashboardFormat()) : '', align = text.align_center, color = textColor, background = backgroundColor, tooltip = rowExchange + ' vs '+columnExchange)

                    if math.abs(delta) == maxDelta
                        t_able.cell_set_bgcolor(column + 1, row + 1,delta > 0 ? bullishColorInput : bearishColorInput)
                        t_able.cell_set_text_formatting(column + 1, row + 1, text.format_bold)                        
                        t_able.cell_set_text_color(column + 1, row + 1,color.white)

//---------------------------------------------------------------------------------------------------------------------}
//MUTABLE VARIABLES & EXECUTION
//---------------------------------------------------------------------------------------------------------------------{
if barstate.isconfirmed
    gatherData()

if barstate.islastconfirmedhistory or (barstate.isrealtime and barstate.isconfirmed)
    updateData()

if barstate.islast    
    drawDashboard()

//---------------------------------------------------------------------------------------------------------------------}