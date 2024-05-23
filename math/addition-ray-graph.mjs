var node_echarts = require('node-echarts');

/**
 * returns a random number between min and max.
 * @param {number} min 
 * @param {number} max 
 * @returns {int}
 */
function _between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

/**
 * It generates a sequence of numbers that are not repeated and not adjacent.
 */
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

/**
 * 
 */
function* build_series({ seriesCount, sequenceCount, isContinues, mix } = { seriesCount: 3, sequenceCount: 4, isContinues: false, mix: false }) {
    console.log('build_series', arguments)
    for (let serieIndex = 0; serieIndex < seriesCount; serieIndex++) {
        var sequence = gen_sequence(count = sequenceCount)
        const links = [
            {
                source: `${sequence[0]}`,
                target: `${sequence[isContinues ? 1 : 2]}`
            },
            {
                source: `${sequence[isContinues ? 1 : 3]}`,
                target: `${sequence[isContinues ? 2 : 1]}`
            }
        ]

        const yes = Math.round(Math.random() * 1)
        if (mix && yes) {
            links[0].target = `${sequence[2]}`
            links[1].source = `${sequence[2]}`
            links[1].target = `${sequence[1]}`
        }

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
            links: links,
            lineStyle: {
                color: '#00000',
                curveness: 0.2
            }
        }
        yield serie
    } // end for
}

/**
 * 
 * @param {*} param0 
 */
function gen({ seriesCount, sequenceCount, isContinues, mix } = { graphCount: 20, isContinues: false }) {
    console.log('gen', arguments)
    const series = build_series({ seriesCount, sequenceCount, isContinues, mix })
    var width = 280;
    var height = 100;
    var xAxisData = [...Array(21).keys()]
    var range = [...Array(seriesCount).keys()]
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
        series: Array.from(series)
    };
    console.log(echart_options.grid)

    var config = {
        width: 794,
        height: 1123,
        option: echart_options,
        path: 'output/addition-ray-graph.png', // TODO：HARDCODE
        enableAutoDispose: true
    }

    node_echarts(config)
}

gen({ seriesCount: 20, sequenceCount: 3, isContinues: true, mix: true })