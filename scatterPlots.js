var getMeanGrade = function(entries)
{
    return d3.mean(entries,function(entry)
        {
            return entry.grade;
        })
}


var drawScatter = function(students,target,
              xScale,yScale,xProp,yProp)
{

    setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
    
    var circles = d3.select(target).select(".graph")
                    .selectAll("circle")
                    .data(students);
    circles.enter()
           .append("circle");
    circles.exit()
           .remove();
    d3.select(target).select(".graph")
    .selectAll("circle")
    .transition()
    .duration(1000)
    .attr("cx",function(student)
    {
        return xScale(getMeanGrade(student[xProp]));    
    })
    .attr("cy",function(student)
    {
        return yScale(getMeanGrade(student[yProp]));    
    })
    .attr("r",4);
}

var clearScatter = function(target)
{
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .remove();
}


var initAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .attr("id", "xAxis")
        .call(xAxis)
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .attr("id", "yAxis")
        .call(yAxis)
}


var initGraph = function(target,students)
{
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    

    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    
    
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([graph.height,0])
  
    
    
    initAxes(screen,margins,graph,target,xScale,yScale);
    
    initButtons(students,target, graph);
    
    setBanner("Click buttons to graphs");
    
    

}

var recreateScales = function(xArray, yArray, graph) {
    var xScale = d3.scaleLinear()
        .domain([0,xArray[0].max])
        .range([0,graph.width]);
           
    var yScale = d3.scaleLinear()
        .domain([0,yArray[0].max])
        .range([graph.height,0]);
    return {xScale: xScale, yScale: yScale};
}

var updateAxes = function(xScale, yScale) {
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    d3.select("#xAxis")
        .transition()
        .duration(1000)
        .call(xAxis)
    
    d3.select("#yAxis")
        .transition()
        .duration(1000)
        .call(yAxis)
}

var initButtons = function(students,target, graph)
{
    
    d3.select("#fvh")
    .on("click",function()
    {
        var scales = recreateScales(students[0].final, students[0].homework, graph);
        var xScale = scales.xScale;
        var yScale = scales.yScale;
        
        updateAxes(xScale, yScale)
        drawScatter(students,target,
              xScale,yScale,"final","homework");
    })
    
    d3.select("#hvq")
    .on("click",function()
    {
        var scales = recreateScales(students[0].homework, students[0].quizes, graph);
        var xScale = scales.xScale;
        var yScale = scales.yScale;
        
        updateAxes(xScale, yScale)
        drawScatter(students,target,
              xScale,yScale,"homework","quizes");
    })
    
    d3.select("#tvf")
    .on("click",function()
    {
        var scales = recreateScales(students[0].test, students[0].final, graph);
        var xScale = scales.xScale;
        var yScale = scales.yScale;
        
        updateAxes(xScale, yScale)
        drawScatter(students,target,
              xScale,yScale,"test","final");
    })
    
    d3.select("#tvq")
    .on("click",function()
    {
        var scales = recreateScales(students[0].test, students[0].quizes, graph);
        var xScale = scales.xScale;
        var yScale = scales.yScale;
        
        updateAxes(xScale, yScale)
        drawScatter(students,target,
              xScale,yScale,"test","quizes");
    })
    
    
    
}

var setBanner = function(msg)
{
    d3.select("#banner")
        .text(msg);
    
}



var penguinPromise = d3.json("classData.json");

penguinPromise.then(function(penguins)
{
    console.log("class data",penguins);
   initGraph("#scatter",penguins);
   
},
function(err)
{
   console.log("Error Loading data:",err);
});
