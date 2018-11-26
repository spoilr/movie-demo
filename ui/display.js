function display(file_name) {

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  // var simulation = d3.forceSimulation()
  //     .force("link", d3.forceLink().id(function(d) { return d.id; }))
  //     .force("charge", d3.forceManyBody())
  //     .force("center", d3.forceCenter(width / 2, height / 2));

  var simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-250))
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(60))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2));

  d3.json(file_name, function(error, graph) {
    if (error) throw error;

    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line");

    var node = svg.append("g")
        .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter().append("g")
      
    var actors = node
        .filter(function(d) { return d.colour == "yellow" })
        .append("circle")
        .attr("r", 6)
        .attr("fill", function(d) { return d.colour; })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var genres = node
        .filter(function(d) { return d.colour == "blue" })
        .append("path")
        .attr("d", d3.symbol().type(d3.symbolSquare))
        .attr("fill", function(d) { return d.colour; })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var directors = node
        .filter(function(d) { return d.colour == "green" })
        .append("path")
        .attr("d", d3.symbol().type(d3.symbolDiamond))
        .attr("fill", function(d) { return d.colour; })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var movies = node
        .filter(function(d) { return d.colour == "red" })
        .append("path")
        .attr("d", d3.symbol().size(function(d) {  
            if (d.rank == "1") { return 500; }
            else if  (d.rank == "2") { return 300; }
            else if  (d.rank == "3") { return 200; }
            else if  (d.rank == "4") { return 150; }
            else { return 100; }
          }).type(d3.symbolStar))
        .attr("fill", function(d) { 
          if (d.rank == "0") {return "black"}
          else { return d.colour; }
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var labels = node.append("text")
        .text(function(d) {
          // return d.id;
        })
        .attr('x', 6)
        .attr('y', 3);

    node.append("title")
        .text(function(d) { return d.id; });


    node.on('mouseover', function(d){
          d3.select(this)
          .select("text")
          .text(function(d) { return d.id; }).style("font-weight", "bold");
        })
        // .on('mouseout', function(d){
        //   d3.select(this)
        //   .select("text")
        //   .text(function(d) { });
        // });  

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          })
    }
  });

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}