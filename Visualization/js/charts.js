var diameter = 1000;
var color = d3.scale.category20b(); //color category
var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(10);

var svg = d3.select("#bubble-chart").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

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
            return (i);
        })
        .attr("r", 0)
        .transition().duration(1500)
        .attr("r", function (d) {
            return d.r;
        });

    console.log('Entering: ' + nodeEnter.size());

    // Repositioning circles
    node.select("circle")
        .transition().duration(1500)
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d, i) {
            return color(i);
        });

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
        .transition().delay(2500).duration(750)

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

//        node.exit()
//            .style("background", "red")
//            .transition()
//            .style("opacity", 0)
//            .remove();

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

function updateBubbles(yearInUnix) {
    var d = new Date(yearInUnix * 1000 + moment('1970-01-01', "YYYY MM DD").unix());
    var year = d.getFullYear() + 1;

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
    var minDateUnix = moment('2008-01-01', "YYYY MM DD").unix();
    var maxDateUnix = moment('2016-01-01', "YYYY MM DD").unix();

    var secondsInYear = 365.25 * 24 * 60 * 60; // 31557600

    d3.select('#slider').call(d3.slider()
        .axis(true).min(minDateUnix).max(maxDateUnix).step(secondsInYear)
        .on("slide", function (evt, value) {

            updateBubbles(value);
        })
    );
}

var start = moment('2008-01-01', "YYYY MM DD").unix();
updateBubbles(start);
initSlider();
