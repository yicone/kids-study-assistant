var util = require('util'),
    graphviz = require('graphviz');


// Add node (ID: Hello)
function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

function split(num, count = 2) {
    var a = [];
    while (num > 0) {
        const max = num - (count - a.length)
        var s = between(1, num);
        if (s > max) {
            continue
        }
        a.push(s);
        if (a.length == count - 1) {
            a.push(num - s)
            break
        }
        num -= s;
    }
    return a
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


// Create digraph G
var g = graphviz.graph("G");
g.set("ranksep", "0")
g.set("splines", "none")
g.set("nodesep", "0")

// TODO 研究三者的关系
g.set("bb", "0,0,842,595")  // pixel
g.set("page", "11.69,8.27")// inch
g.set("size", "140,100") // inch

g.setNodeAttribut("shape", "box")


function generate(cluster, clusterName, layer = 4) {
    var nodes = []
    function addNode(i, j, num) {
        // console.log(i, j, num)
        var node = cluster.addNode(`${clusterName}_${i}${j}`, { "label": num });
        nodes.push(node)
        // node.set("style", "filled");
        return node
    }

    for (var j = 1; j <= layer; j++) {
        addNode(layer, j, between(1, 9))
    }

    for (var i = layer - 1; i >= 1; i--) {
        for (var j = 1; j <= i; j++) {
            var childNode1 = cluster.getNode(`${clusterName}_${i + 1}${j}`)
            var childNode1Value = parseInt(childNode1.get('label'))
            var childNode2 = cluster.getNode(`${clusterName}_${i + 1}${j + 1}`)
            var childNode2Value = parseInt(childNode2.get('label'))
            var node = addNode(i, j, childNode1Value + childNode2Value)

            cluster.addEdge(node, childNode1)
            cluster.addEdge(node, childNode2)
        }
    }


    var indexes = get_random_indexes(nodes.length, nodes.length - layer)
    for (const index of indexes) {
        nodes[index].set("label", "?")
    }

    // Print the dot script

}

for (var i = 0; i < 10; i++) {
    var clusterName = `cluster${i}`
    var cluster = g.addCluster(clusterName)
    generate(cluster, clusterName)
}

console.log(g.to_dot());
g.setGraphVizPath( "/usr/local/bin" );
g.output( "ps2", "test01.ps" );