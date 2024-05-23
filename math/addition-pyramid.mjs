var node_echarts = require('node-echarts');

var LAYERS = {
  1: [1],
  2: [2, 3],
  3: [4, 5, 6],
  4: [7, 8, 9, 10]
};
var LAYERS2 = {
  1: [9],
  2: [7, 8],
  3: [4, 5, 6],
  4: [0, 1, 2, 3]
};

function getKeyByValue(object, value) {
  var key = Object.keys(object).find((key) => object[key].includes(value));
  var valueIndexInSameKey = object[key].indexOf(value);
  return {
    key,
    valueIndexInSameKey
  };
}

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

function get_count(layer = 4) {
  var n = 0
  for (let index = layer; index > 0; index--) {
    n += index
  }
  return n
}

function gen_sequence(layer = 4) {
  var sequence = []
  var count = get_count(layer)
  for (var i = 0; i < count; i++) {
    var count_in_layer = getKeyByValue(LAYERS2, i).key
    // console.log('i, layer', i, count_in_layer)
    if (i < layer) {
      sequence[i] = between(1, 9)
    } else {
      sequence[i] = sequence[i - count_in_layer - 1] + sequence[i - count_in_layer]
    }
  }
  return sequence.reverse()
}

var echart_options = {
  backgroundColor: '#fff',
  xAxisIndex: { type: 'category' },
  yAxisIndex: { type: 'category' },
  series: Array.from(build_series(count = 21))
};

var config = {
  width: 794,
  height: 1123,
  option: echart_options,
  path: 'output/addition-pyramid.png',
  enableAutoDispose: true
}

function build_group(serieIndex, layer, valueIndexInSameKey, num) {
  var width = 50;
  var height = 30;

  var colIndex = serieIndex % 3
  var rowIndex = Math.floor(serieIndex / 3)
  var seriesLeftOffset = colIndex * (width * 4 + 20);
  var seriesTopOffset = rowIndex * (height * 4 + 20);
  var x = 100 -
    ((layer - 1) * width) / 2 + valueIndexInSameKey * width +
    seriesLeftOffset
  var y = height * layer + seriesTopOffset

  return {
    type: 'group',
    bounding: 'all',
    width: width,
    height: height,
    children: [
      {
        type: 'rect',
        shape: {
          width: width,
          height: height,
          x: x,
          y: y
        },
        style: {
          stroke: '#000',
          fill: '#fff'
        }
      },
      {
        type: 'text',

        style: {
          stroke: '#000',
          fill: '#000',
          text: num,
          fontFamily: 'monospace',
          textAlign: 'center',
          textVerticalAlign: 'middle',
          x: x + width / 2,
          y: y + height / 2
        }
      }
    ]
  }
}

function get_random_indexes(length, count) {
  var indexes = []
  while (indexes.length < count) {
    var index = Math.floor(Math.random() * length)
    if (!indexes.includes(index)) {
      indexes.push(index)
    }
  }
  return indexes
}

function* build_series(count = 3) {
  for (let serieIndex = 0; serieIndex < count; serieIndex++) {
    var sequence = gen_sequence(layer = 4)
    console.log('sequence ' + serieIndex, sequence)
    var needShowIndexes = get_random_indexes(sequence.length, out_count = 4)
    // console.log('needShowIndexes1', needShowIndexes)

    var renderItem = (function (needShowIndexes) {
      return function (params, api) {
        var num = api.value(0);
        var i = params.dataIndex;
        // console.log('needShowIndexes2', needShowIndexes)
        // 隐藏指定格子中的文字
        num = (needShowIndexes.includes(i)) ? num : ''

        var { key, valueIndexInSameKey } = getKeyByValue(LAYERS, i + 1);
        var layer = key;

        var group = build_group(serieIndex, layer, valueIndexInSameKey, num)
        return group;
      }
    })

    var serie = {
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: renderItem(needShowIndexes),
      data: sequence
    }
    yield serie
  } // end for

}

node_echarts(config)