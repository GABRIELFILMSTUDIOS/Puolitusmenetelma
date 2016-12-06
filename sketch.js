var inputform;

// example showing what the result object will look like
var result = {
  values: [
    {
      a: 0,
      b: 0,
      ya: 0,
      yb: 0,
      c: 0,
      yc: 0,
    },
  ],
  notice: { // Or false if nothing special occured
    severity: "notice",  // note or error, error should stop execution
    msg: "Finnished before running out of steps"
  },
  stepsPerformed: 0,
  equation: "",
};

function setup() {
  noCanvas();
  inputform = document.getElementById("inputform");
  inputform.addEventListener("submit", function(e) {
    e.preventDefault();
    doPuolitusMenetelma();
  });
}

function doPuolitusMenetelma() {
  doSteps();
  createVisualOutput();
  return;
}

function doSteps() {
  var a = Number(select("#a").value());
  var b = Number(select("#b").value());
  var steps = Number(select("#steps").value());

  // Clearing all variables
  result = {
    values: [
      {
        a: a,
        b: b,
      },
    ],
    notice: false,
    stepsPerformed: 0,
    equation: select("#equation").value(),
  };

  for(var i = 0; i < steps; i++) {
    result.stepsPerformed++;
    var calculationa = result.equation.replace(/x/g, result.values[i].a);
    var calculationb = result.equation.replace(/x/g, result.values[i].b);
    var ya = eval(calculationa);
    result.values[i].ya = ya;
    var yb = eval(calculationb);
    result.values[i].yb = yb;

    if(Math.sign(ya) == Math.sign(yb)) {
      result.notice = {
        severity: "error",
        msg: "f(a) and f(b) must have different signs!"
      };
      break;
    }

    result.values[i].c = (result.values[i].a+result.values[i].b)/2;
    var calculationc = result.equation.replace(/x/g, result.values[i].c);
    var yc = eval(calculationc);
    result.values[i].yc = yc;

    if(i+1 != steps) {
      result.values[i+1] = {};
      if(Math.sign(result.values[i].ya) == Math.sign(result.values[i].yc)) {
        result.values[i+1].a = result.values[i].c;
        result.values[i+1].b = result.values[i].b;
      } else if(Math.sign(result.values[i].yb) == Math.sign(result.values[i].yc)) {
        result.values[i+1].a = result.values[i].a;
        result.values[i+1].b = result.values[i].c;
      } else {
        result.notice = {
            severity: "notice",
            msg: "Finnished before running out of steps"
        };
        break;
      }
    }
  }
}

function createVisualOutput() {
  var tableElem = select("#resulttable");
  tableElem.html('');

  if(result.notice) {
    var noticeP = select("#"+result.notice.severity);
    noticeP.html(result.notice.msg);
  }

  // Create Headers
  var headers = [];
  headers[0] = createElement("th", "a");
  headers[1] = createElement("th", "b");
  headers[2] = createElement("th", "f(a)");
  headers[3] = createElement("th", "f(b)");
  headers[4] = createElement("th", "c");
  headers[5] = createElement("th", "f(c)");
  var headerRow = createElement("tr");
  headerRow.parent(tableElem);
  for (var header of headers) {
    header.parent(headerRow);
  }

  // Loop over the result arrays to create the table
  for(var i = 0; i < result.stepsPerformed; i++) {
    var nextRow = createElement("tr");
    createElement("td", result.values[i].a).parent(nextRow);
    createElement("td", result.values[i].b).parent(nextRow);
    createElement("td", result.values[i].ya).parent(nextRow);
    createElement("td", result.values[i].yb).parent(nextRow);
    createElement("td", result.values[i].c).parent(nextRow);
    createElement("td", result.values[i].yc).parent(nextRow);
    nextRow.parent(tableElem);
  }
}

// result(\w+)s\[([\w\W]*?)\]
