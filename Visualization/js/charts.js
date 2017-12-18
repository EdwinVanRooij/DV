var diameter = 1250;

// var color = d3.scale.category20b(); //color category
// Original shaded
// var color = [ //
//     '#08181D', '#0B232B', '#02F2F39', '#123A47', '#163656',
//     '#195164', '#1D5D72', '#206880', '#24748E', '#277F9C',
//     '#3A8AA5', '#4E96AE', '#61A187', '#75ADC0', '#98B9C9',
//     '#9CC4D2', '#B0D0D8', '#C4DCE4', '#D7E7ED', '#EBF3F6']; //color category

// Version 2, i like it
// var color = [
//     '#e9f7fb', '#d4eff7', '#bee7f3', '#a9dfef', '#93d7eb',
//     '#7ecfe7', '#68c7e3', '#53bfdf', '#3db6db', '#28aed7',
//     '#249dc2', '#208cac', '#1d809f', '#1c7a97', '#186981',
//     '#14576c', '#104656', '#0c3441', '#08232b', '#D7E7ED']; //color category

var colorStaging = '#e9f7fb';
var color = [
    '#e9f7fb',
    '#d4eff7',
    '#bee7f3',
    '#a9dfef',
    '#93d7eb',
    '#7ecfe7',
    '#68c7e3',
    '#53bfdf',
    '#3db6db',
    '#28aed7',
    '#249dc2',
    '#208cac',
    '#1d809f',
    '#1c7a97',
    '#186981',
    '#14576c',
    '#104656',
    '#0c3441',
    '#08232b'];

color = color.reverse();

var svg = d3.select("#bubble-chart").select("svg");

var width = d3.select("#bubble-chart").select("svg").node().width.baseVal.value;
console.log(width);

var bubble = d3.layout.pack()
    .sort(null)
    .size([width, width]);


//update function
function changebubble(data) {
    var node = svg.selectAll(".node")
        .data(
            bubble.nodes(classes(data)).filter(function (d) {
                return !d.children;
            }),
            function (d) {
                return d.className
            } // key data based on className to keep object constancy
        );

    // capture the enter selection
    var nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    // Entering circles
    nodeEnter
        .append("circle")
        .style("fill", function (d, i) {
            return colorStaging;
        })
        .attr("r", 0)
        .transition().duration(2500)
        .attr("r", function (d) {
            return d.r;
        });

    // Repositioning circles
    node.select("circle")
        .transition().duration(1500)
        .attr("r", function (d) {
            return d.r;
        })
        .transition().delay(3000).duration(500)
        .style("fill", function (d, i) {
            return color[i];
        });
    // node.select("circle")
    //     .transition().duration(1500)
    //     .attr("r", function (d) {
    //         return d.r;
    //     })
    //     .style("fill", function (d, i) {
    //         return color[i];
    //     });

    node.transition()
        .duration(2500)
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    // Entering text
    nodeEnter
    // Pre transition
        .append("text")
        .attr('fill', 'white')
        .attr("opacity", 0)
        .text(function (d) {
            return d.className;
        })

        // During transition
        .transition().delay(3000).duration(750)

    // Post transition
        .attr("opacity", 1)
        .attr('transform', function (d) {
            return "translate(" + 0 + "," + 5 + ")";
        });

    // capture the enter selection
    var nodeExit = node.exit();

    console.log('Exiting: ' + nodeExit.size());
    console.log(nodeExit);

    nodeExit.select("circle")
        .transition().duration(750)
        .attr("r", 0)
        .remove();

    nodeExit.select("text")
        .transition().duration(500)
        .attr("opacity", 0)
        .remove();

    node.exit()
        .transition().duration(750)
        .remove();

    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) {
                recurse(node.name, child);
            });
            else classes.push({
                packageName: name,
                className: node.name,
                value: node.size
            });
        }

        recurse(null, root);
        return {
            children: classes
        };
    }

}

function updateBubbles(year) {
    d3.csv('data/' + year + "_100.csv", function (error, data) {

        data = data.slice(0, 15); // only use the first 20 records
        data = data.map(function (d) {
            return {name: capitalizeFirstLetter(d["word"]), size: d["frequency"]}
        });
        var formatted_data = {
            "children": data
        };
        changebubble(formatted_data)
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function initSlider() {
    d3.select('#slider').call(d3.slider()
        .axis(true).min(2008).max(2016).step(1)
        .on("slide", function (evt, value) {

            updateBubbles(value);
        })
    );
}

updateBubbles(2008);
initSlider();
