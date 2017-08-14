function initCanvas(canvas, canvasWidth, canvasHeight) {
    canvas.beginPath();
    canvas.rect(0, 0, canvasWidth, canvasHeight);
    canvas.fillStyle = "white";
    canvas.fill();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i ++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
}

function calcDistance(p1, p2) {
    var a = p1.x - p2.x;
    var b = p1.y - p2.y;

    return Math.sqrt(a * a + b * b);
}

function drawDot(canvas, dots, i) {
    canvas.beginPath();
    canvas.arc(dots[i].x, dots[i].y, 3, 0, 2 * Math.PI);
    canvas.lineWidth = 4;
    canvas.strokeStyle = '#000000';
    canvas.stroke();
    canvas.fillStyle = getRandomColor();
    canvas.fill();
}

function drawLine(canvas, a, b, color, lineWidth) {
    canvas.lineWidth = lineWidth;
    canvas.beginPath();
    canvas.moveTo(a.x, a.y);
    canvas.lineTo(b.x, b.y);
    canvas.strokeStyle = color;
    canvas.stroke();
}

function drawRect(canvas, rect) {
    canvas.beginPath();
    canvas.lineWidth = 1;
    canvas.rect(rect.p.x, rect.p.y, rect.w, rect.h);
    canvas.fillStyle = '#dcdcdc';
    canvas.fill();
}

function calcAngle(p1, p2) {
    var x = p1.x - p2.x;
    var y = p1.y - p2.y;

    return (y / x);
}

function calcRectAngle1(rect) {
    var p1 = rect.p;
    var x = rect.p.x + rect.w;
    var y = rect.p.y + rect.h;
    var p2 = {x: x, y: y};

    return calcAngle(p1, p2);
}

function calcRectAngle2(rect) {
    var x1 = rect.p.x;
    var y1 = rect.p.y + rect.h;
    var p1 = {x: x1, y: y1};

    var x2 = rect.p.x + rect.w;
    var y2 = rect.p.y;
    var p2 = {x: x2, y: y2};

    return calcAngle(p1, p2);
}

function getEquation(m, p) {
    //y -y1= m*(x-x1)
    return {m: m, n: (m * p.x * (- 1) + p.y)};
}

function getLinesIntersection(line1, line2) {
    // y = ax + c
    // y = bx + d
    var x = (line2.n - line1.n) / (line1.m - line2.m);
    var y = line1.m * x + line1.n;
    if (y < 0) {
        y *= - 1;
        x *= - 1;
    }

    return {x: x, y: y};
}

function isInAnyRectangle(dot, recs) {
    for (var i = 0; i < recs.length; i ++) {
        if (recs[i].p.x <= dot.x && (recs[i].p.x + recs[i].w) >= dot.x) {
            if (( recs[i].p.y + recs[i].h ) >= dot.y && recs[i].p.y <= dot.y) {
                return true;
            }
        }
    }

    return false;
}

function isLineCrossRectangle(p1, p2, rectangle) {
    var m1 = calcAngle(p1, p2);
    var m2 = calcRectAngle1(rectangle);
    var m3 = calcRectAngle2(rectangle);
    var l1 = getEquation(m1, p1);
    var l2 = getEquation(m2, rectangle.p);
    var l3 = getEquation(m3, {x: rectangle.p.x, y: rectangle.p.y + rectangle.h});
    var px = getLinesIntersection(l1, l2);
    var py = getLinesIntersection(l1, l3);

    return isInAnyRectangle(px, rectangles) || isInAnyRectangle(py, rectangles);
}

function drawLines(canvas, dots, temp, rectangles) {
    var dist;
    var nodes = [];

    for (i = 0; i < dots.length; i ++) {
        var nodeNeighbors = [];
        for (var j = 0; j < temp.length; j ++) {

            if (i !== j) {
                var flag = false;
                for (var k = 0; k < rectangles.length; k ++) {
                    if (dots[i].x <= rectangles[k].p.x && temp[j].x <= rectangles[k].p.x ||
                        dots[i].x >= rectangles[k].p.x + rectangles[k].w && temp[j].x >= rectangles[k].p.x + rectangles[k].w ||
                        dots[i].y <= rectangles[k].p.y && temp[j].y <= rectangles[k].p.y ||
                        dots[i].y >= rectangles[k].p.y + rectangles[k].h && temp[j].y >= rectangles[k].p.y + rectangles[k].h) {
                        continue;
                    }

                    if (isLineCrossRectangle(dots[i], temp[j], rectangles[k])) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    continue;
                }
                dist = calcDistance(dots[i], temp[j]);
                if (dist <= radios) {
                    drawLine(canvas, dots[i], temp[j], '#4e4e4e', 1);
                    nodeNeighbors.push(
                        [
                            j.toString(),
                            dist
                        ]
                    );
                }
            }
        }
        nodes.push(
            [
                i.toString(),
                nodeNeighbors
            ]
        );
    }

    return nodes;
}

function drawShortestPath(canvas, dots, path, startNode) {
    var currentNode = startNode;
    for (var i = 0; i < path.length; i ++) {
        drawLine(canvas, dots[currentNode], dots[parseInt(path[i])], 'red', 2);
        currentNode = parseInt(path[i]);
    }
}

function drawSimpleDijkstraGraph() {
    var preGeneratedGraph = drawLines(ctx2, preGeneratedDots, preGeneratedDots, []);
    var g = new Dijkstras();
    g.setGraph(preGeneratedGraph);
    var shortestPath2 = g.getPath((preGeneratedDots.length - 2).toString(), (preGeneratedDots.length - 1).toString());
    drawShortestPath(ctx2, preGeneratedDots, shortestPath2, (preGeneratedDots.length - 2));
    for (var i = 0; i < preGeneratedDots.length; i ++) {
        drawDot(ctx2, preGeneratedDots, i);
    }
}