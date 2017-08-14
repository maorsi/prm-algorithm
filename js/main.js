var c = document.getElementById("canvas"); // get canvas object
var ctx = c.getContext("2d"); // get canvas object as 2d

var c2 = document.getElementById("canvas2"); // get canvas2 object
var ctx2 = c2.getContext("2d"); // get canvas object as 2d

// var t0 = performance.now();

var dotsNumber = getRandomInt(25, 25);
var radios = 400;
var dots = [];
var rectangles = [];
var rectSize = getRandomInt(1, 10);
var i;
var canvasWidth = c.width;
var canvasHeight = c.height;
$('#x1').val(10);
$('#y1').val(10);
$('#x2').val(canvasWidth - 10);
$('#y2').val(canvasHeight - 10);

initCanvas(ctx, canvasWidth, canvasHeight);
initCanvas(ctx2, canvasWidth, canvasHeight);
drawSimpleDijkstraGraph();

/**
 * create + draw rectangles
 */
for (i = 0; i < rectSize; i ++) {
    var width = getRandomInt(10, 120);
    var height = getRandomInt(10, 120);
    var x = getRandomInt(0, canvasWidth - width);
    var y = getRandomInt(0, canvasHeight - height);
    rectangles[i] = {p: {x: x, y: y}, w: width, h: height};
    drawRect(ctx, rectangles[i]);
}

/**
 * generate dots
 */
for (i = 0; i < dotsNumber; i ++) {
    dots[i] = {
        x: getRandomInt(5, canvasWidth - 5),
        y: getRandomInt(5, canvasHeight - 5)
    };
}

/**
 * filter only to dots that are not inside rectangles
 */
dots = dots.filter(function (dot) {
    return ! isInAnyRectangle(dot, rectangles);
});

/**
 * draw lines
 */
drawLines(ctx, dots, dots, rectangles);

/**
 * draw dots
 */
for (i = 0; i < dots.length; i ++) {
    drawDot(ctx, dots, i);
}

/**
 * draw start & end dots
 */
$('#submit').on('click', function () {
    var x1 = parseInt($('#x1').val());
    var x2 = parseInt($('#x2').val());
    var y1 = parseInt($('#y1').val());
    var y2 = parseInt($('#y2').val());

    var extraDots = [
        {x: x1, y: y1},
        {x: x2, y: y2}
    ];
    var merge = $.merge(dots, extraDots);
    var preGraph = drawLines(ctx, merge, merge, rectangles);

    var d = new Dijkstras();
    d.setGraph(preGraph);
    var shortestPath = d.getPath((merge.length - 2).toString(), (merge.length - 1).toString());
    if (! shortestPath.length) {
        $('.add-points').hide();
        var data = '<div class="alert alert-danger">' +
            '<strong>Error!</strong> Path does not exist.' +
            '</div>';
        $('.status').show().prepend(data);
    }
    else {
        drawShortestPath(ctx, merge, shortestPath, (merge.length - 2));
        $('.add-points').hide();
        var data = '<div class="alert alert-success">' +
            '  <strong>Success!</strong> Path found.' +
            '</div>';
        $('.status').show().prepend(data);
    }
    /**
     * Re draw dots
     */
    for (i = 0; i < dots.length; i ++) {
        drawDot(ctx, dots, i);
    }
});

$('#restart').on('click', function () {
    location.reload();
});
// var t1 = performance.now();
// console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");