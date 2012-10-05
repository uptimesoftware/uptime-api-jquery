// -- (c) 2012 uptime software inc.
// -- extension of D3 examples for up.time dashboards

    // -- let's return a colour based on the status of a particular element
    function status_colourmap( status ) {
        if ( status.toUpperCase() === "OK" ) {
            return "green";
        } else if ( status.toUpperCase() === "WARN" ) {
            return "yellow";
        } else if ( status.toUpperCase() === "CRIT" ) {
            return "red";
        } else if ( status.toUpperCase() === "MAINT") {
            return "blue";
        } else {
            return "gray";
        }
    }

    // -- this callback function is triggered when a circle is clicked on in the 'dashboard' chart
    function update_status() {
        d3.select(this).style("fill", function(d) {
            $("#node_information").html("Name: <b>" + d.name + "</b>, status: " + element_status[d.id].status + ", typeOS: <b>" + gAllElements[d.id].typeOs + "</b>, # monitors:" + gAllElements[d.id].monitors.length );
            return status_colourmap( element_status[d.id].status ) }
        );
    }

    function d3_dendrogram( div_id, json ) {
        var width = 960,
            height = 2200;

        var cluster = d3.layout.cluster()
            .size([height, width - 160]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var vis = d3.select(div_id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(40, 0)");

        var nodes = cluster.nodes(json);

        var link = vis.selectAll("path.link")
            .data(cluster.links(nodes))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

        var node = vis.selectAll("g.node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

        node.append("circle")
            .attr("r", 4.5).style("fill", function(d) { return status_colourmap( d.status ) })
            .on("click", update_status );

        node.append("text")
            .attr("dx", function(d) { return d.children ? -8 : 8; })
            .attr("dy", 3)
            .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .text(function(d) { return d.name; });

    }

    function d3_nodetree( div_id, json ) {
        var radius = 960 / 2;

        var tree = d3.layout.tree()
            .size([360, radius - 120])
            .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

        var diagonal = d3.svg.diagonal.radial()
            .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

        var vis = d3.select(div_id).append("svg")
            .attr("width", radius * 2)
            .attr("height", radius * 2 - 150)
            .append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")");

        var nodes = tree.nodes(json);

        var link = vis.selectAll("path.link")
            .data(tree.links(nodes))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

        var node = vis.selectAll("g.node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

        node.append("circle")
            .attr("r", 4.5).style("fill", function(d) { return status_colourmap( d.status ) });

        node.append("text")
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
            .text(function(d) { return d.name; });

    }

    function d3_layouttree( div_id, json ) {
        var m = [20, 120, 20, 120],
            w = 1280 - m[1] - m[3],
            h = 2000 - m[0] - m[2],
            i = 0,
            root;

        var tree = d3.layout.tree()
            .size([h, w]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var vis = d3.select(div_id).append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        root = json;
        root.x0 = h / 2;
        root.y0 = 0;

        function toggleAll(d) {
            if (d.children) {
                d.children.forEach(toggleAll);
                toggle(d);
            }
        }

        // Initialize the display to show a few nodes.
        root.children.forEach(toggleAll);

        update(root);

        function update(source) {
            var duration = d3.event && d3.event.altKey ? 5000 : 500;

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse();

            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 180; });

            // Update the nodes…
            var node = vis.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("svg:g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .on("click", function(d) { toggle(d); update(d); });

            nodeEnter.append("svg:circle")
                .attr("r", 1e-6)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeEnter.append("svg:text")
                .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .text(function(d) { return d.name; })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("circle")
                .attr("r", 4.5).style("fill", function(d) { return status_colourmap( d.status ) });
            // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            var link = vis.selectAll("path.link")
                .data(tree.links(nodes), function(d) { return d.target.id; });

            // Enter any new links at the parent's previous position.
            link.enter().insert("svg:path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                })
                .transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        // Toggle children.
        function toggle(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
        }
    }

    function d3_flarecircle( div_id, json ) {
        var w = 1280,
            h = 800,
            r = 720,
            x = d3.scale.linear().range([0, r]),
            y = d3.scale.linear().range([0, r]),
            node,
            root;

        var pack = d3.layout.pack()
            .size([r, r])
            .value(function(d) { return d.outage_duration; })

        var vis = d3.select(div_id).insert("svg:svg", "h2")
            .attr("width", w)
            .attr("height", h)
            .append("svg:g")
            .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

        node = root = json;

        var nodes = pack.nodes(root);

        vis.selectAll("circle")
            .data(nodes)
            .enter().append("svg:circle")
            .attr("class", function(d) { return d.children ? "parent" : "child"; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) { return status_colourmap( d.status ) })
            .on("click", function(d) { return zoom(node == d ? root : d); });

        vis.selectAll("text")
            .data(nodes)
            .enter().append("svg:text")
            .attr("class", function(d) { return d.children ? "parent" : "child"; })
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
            .text(function(d) { return d.name; });

        d3.select(window).on("click", function() { zoom(root); });

        function zoom(d, i) {
            var k = r / d.r / 2;
            x.domain([d.x - d.r, d.x + d.r]);
            y.domain([d.y - d.r, d.y + d.r]);

            var t = vis.transition()
                .duration(d3.event.altKey ? 7500 : 750);

            t.selectAll("circle")
                .attr("cx", function(d) { return x(d.x); })
                .attr("cy", function(d) { return y(d.y); })
                .attr("r", function(d) { return k * d.r; });

            t.selectAll("text")
                .attr("x", function(d) { return x(d.x); })
                .attr("y", function(d) { return y(d.y); })
                .style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });

            node = d;
            d3.event.stopPropagation();
        }
    }

    function d3_forcedirected( div_id, json ) {

        var w = 1280,
            h = 800,
            node,
            link,
            root;

        var force = d3.layout.force()
            .on("tick", tick)
            .charge(function(d) { return d._children ? -d.outage_duration / 100 : -30; })
            .linkDistance(function(d) { return d.target._children ? 80 : 30; })
            .size([w, h - 160]);

        var vis = d3.select(div_id).append("svg:svg")
            .attr("width", w)
            .attr("height", h);

        root = json;
        root.fixed = true;
        root.x = w / 2;
        root.y = h / 2 - 80;
        update();

        function update() {
            var nodes = flatten(root),
                links = d3.layout.tree().links(nodes);

            // Restart the force layout.
            force
                .nodes(nodes)
                .links(links)
                .start();

            // Update the links…
            link = vis.selectAll("line.link")
                .data(links, function(d) { return d.target.id; });

            // Enter any new links.
            link.enter().insert("svg:line", ".node")
                .attr("class", "link")
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            // Exit any old links.
            link.exit().remove();

            // Update the nodes…
            node = vis.selectAll("circle.node")
                .data(nodes, function(d) { return d.id; })
                .style("fill", function(d) { return status_colourmap( d.status ) });

            node.transition()
                .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size) / 10; });

            // Enter any new nodes.
            node.enter().append("svg:circle")
                .attr("class", "node")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size) / 10; })
                .style("fill", function(d) { return status_colourmap( d.status ) })
                .on("click", click)
                .call(force.drag);

            // Exit any old nodes.
            node.exit().remove();
        }

        function tick() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        // Color leaf nodes orange, and packages white or blue.
        function color(d) {
            return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
        }

        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update();
        }

        // Returns a list of all nodes under the root.
        function flatten(root) {
            var nodes = [], i = 0;

            function recurse(node) {
                if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
                if (!node.id) node.id = ++i;
                nodes.push(node);
                return node.size;
            }

            root.size = recurse(root);
            return nodes;
        }

    }

