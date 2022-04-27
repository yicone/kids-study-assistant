var node_echarts = require('node-echarts');


function _between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

function gen_sequence(count = 4, max = 20) {
    var sequence = []
    for (var i = 0; i < count; i++) {

        while (!sequence[i]) {
            var newNum = _between(1, max)
            if (!sequence.includes(newNum) && sequence.every(num => Math.abs(num - newNum) != 1)) {
                sequence[i] = newNum
                break;
            }
        }
    }
    return sequence.sort((a, b) => a - b)
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
            type: 'graph',
            // layout: 'force',
            xAxisIndex: serieIndex,
            yAxisIndex: serieIndex,
            coordinateSystem: 'cartesian2d',
            symbolSize: 15,
            showSymbol: false,
            showAllSymbol: false,
            itemStyle: {
                color: '#000'
            },
            label: {
                show: true
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [2, 10],
            data: sequence.map(num => {
                return {
                    name: `${num}`,
                    value: [num, 0]
                }
            }),
            links: [
                {
                    source: `${sequence[0]}`,
                    target: `${sequence[2]}`
                },
                {
                    source: `${sequence[3]}`,
                    target: `${sequence[1]}`
                }
            ],
            lineStyle: {
                color: '#00000',
                curveness: 0.2
            }
        }
        yield serie
    } // end for
}

function gen(graphCount = 20) {
    var width = 280;
    var height = 100;
    var xAxisData = [...Array(21).keys()]
    var range = [...Array(graphCount).keys()]
    var echart_options = {
        backgroundColor: '#fff',

        // TODO：HARDCODE
        grid: range.map(i => {
            var rowIndex = Math.floor(i / 2)
            if (i % 2 === 1) {
                return { right: '7%', top: `${7 * (rowIndex + 1)}%`, width, height }
            }
            return { left: '7%', top: `${7 * (rowIndex + 1)}%`, width, height }
        }),
        xAxis: range.map(i => {
            return {
                gridIndex: i,
                type: 'category',
                boundaryGap: false,
                data: xAxisData
            }
        }),
        yAxis: range.map(i => {
            return {
                gridIndex: i, show: false,
                // data: [0]
            }
        }),
        series: Array.from(build_series(count = graphCount))
    };
    console.log(echart_options.grid)

    var config = {
        width: 794,
        height: 1123,
        option: echart_options,
        path: 'graph.png', // TODO：HARDCODE
        enableAutoDispose: true
    }

    node_echarts(config)
}

gen()