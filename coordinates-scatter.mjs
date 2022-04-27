var node_echarts = require('node-echarts');


function _between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

function gen_sequence(count = 4, x = 5, y = 5) {
    var sequence = []
    for (var i = 0; i < count; i++) {
        if (!sequence[i]) {
            sequence[i] = [_between(1, x - 1), _between(1, y - 1)]
        }
    }
    return sequence
}

const arr = ['rect', 'triangle', 'diamond', 'circle'];
function getSymbol(value, params) {
    console.log(value, params.dataIndex)
    return arr[params.dataIndex];
}

function* build_series(seriesCount = 3) {
    for (let serieIndex = 0; serieIndex < seriesCount; serieIndex++) {
        var sequence = gen_sequence(count = 4)
        console.log('sequence ' + serieIndex, sequence)

        var serie = {
            type: 'scatter',
            xAxisIndex: serieIndex,
            yAxisIndex: serieIndex,
            symbolSize: 20,
            symbol: getSymbol,
            data: sequence
        }
        yield serie
    } // end for
}

function gen() {
    var width = 280;
    var height = 280;
    var echart_options = {
        backgroundColor: '#fff',
        // TODO：HARDCODE
        grid: [
            { left: '7%', top: '7%', width, height },
            { right: '7%', top: '7%', width, height },
            { left: '7%', bottom: 'middle', width, height },
            { right: '7%', bottom: 'middle', width, height },
            { left: '7%', bottom: '7%', width, height },
            { right: '7%', bottom: '7%', width, height }
        ],
        xAxis: [
            { gridIndex: 0, min: 0, max: 5 },
            { gridIndex: 1, min: 0, max: 5 },
            { gridIndex: 2, min: 0, max: 5 },
            { gridIndex: 3, min: 0, max: 5 },
            { gridIndex: 4, min: 0, max: 5 },
            { gridIndex: 5, min: 0, max: 5 },
        ],
        yAxis: [
            { gridIndex: 0, min: 0, max: 5 },
            { gridIndex: 1, min: 0, max: 5 },
            { gridIndex: 2, min: 0, max: 5 },
            { gridIndex: 3, min: 0, max: 5 },
            { gridIndex: 4, min: 0, max: 5 },
            { gridIndex: 5, min: 0, max: 5 },
        ],
        series: Array.from(build_series(count = 6))
    };

    var config = {
        width: 794,
        height: 1123,
        option: echart_options,
        path: 'output/coordinates-scatter.png', // TODO：HARDCODE
        enableAutoDispose: true
    }

    node_echarts(config)
}

gen()