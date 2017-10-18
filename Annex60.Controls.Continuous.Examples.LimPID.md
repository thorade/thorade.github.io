# OpenModelica simulation example
## Annex60.Controls.Continuous.Examples.LimPID

```yaml script=scriptloader
- lib/tinytimer.js
```

<style media="screen" type="text/css">
label {font-weight:normal; size: 0.9em}
</style>
<br/>
<br/>

<div id="status" style="text-align:center"><span id="statustext">
Simulation loading</span>. &nbsp Time: <span id="statustimer"> </span></div>

<br/>

<div class = "row">
<div class = "col-md-4">

<br/>
<br/>
<br/>
<br/>

```yaml jquery=dform
class : form-horizontal
col1class : col-sm-7
col2class : col-sm-5
html:
  - name: stopTime
    type: number
    bs3caption: Stop time, sec
    value: 1.0
  - name: intervals
    type: number
    bs3caption: Output intervals
    value: 500
  - name: tolerance
    type: number
    bs3caption: Tolerance
    value: 1e-06
```

```js
if (typeof(isRunning) == "undefined") isRunning = false

if (typeof(timer) != "undefined") {clearInterval(timer.interval); timer = null};

$("#statustext").html('Simulation running')
$("#statustimer").html("");
$('#statustimer').tinyTimer({ from: Date.now() });

timer = $("#statustimer").data("tinyTimer")

// Start the simulation!
basename = "Annex60.Controls.Continuous.Examples.LimPID"

if (typeof(wworker) != "undefined" && isRunning) wworker.terminate();
if (typeof(wworker) == "undefined" || isRunning) {
  wworker = new Worker(basename + ".js");
  isRunning = true
  wworker.addEventListener('error', function(event) {
  });
  // read the csv file with the simulation results
  wworker.addEventListener("message", function(e) {
    var data = e.data;
    if (data.preloaded) {
      preloadComplete = true;
      wworker.postMessage({basename: basename, override: {stopTime: stopTime, tolerance: tolerance, stepSize: +stopTime / intervals}});
      return;
    }
    $("#statustext").html(e.data.status)
    timer.stop();
    isRunning = false
    x = $.csv.toArrays(e.data.csv, {onParseValue: $.csv.hooks.castToScalar})

    // `header` has the column names. The first is the time, and the rest
    // of the columns are the variables.
    header = x.slice(0,1)[0]

    // Select graph variables with a select box based on the header values
    if (typeof(graphvar) == "undefined") graphvar = header[1];
    if (typeof(graphvarX) == "undefined") graphvarX = header[0];

    var jsonform = {
      html: {
        type: "select",
        bs3caption: "Plot variable",
        name: "graphvar",
        selectvalue: graphvar,
        choices: header
    }};
    var jsonformX = {
      html: {
        type: "select",
        bs3caption: "",
        name: "graphvarX",
        selectvalue: graphvarX,
        choices: header
    }};
    updatefun = function (evt) {
        calculate_forms();
        $("#plotdiv").calculate();
    }


    $("#yaxisform").html("");
    $("#yaxisform").dform(jsonform);
    $("#yaxisform").change(updatefun);
    $("#xaxisform").html("");
    $("#xaxisform").dform(jsonformX);
    $("#xaxisform").change(updatefun);
    $("#plotdiv").calculate();

}, false);
}
wworker.postMessage({basename: basename, preload: true})
```

</div>

<div class = "col-md-1">
</div>


<div class = "col-md-7">

<!-- Nav tabs -->
<ul class="nav nav-tabs" id="mytab">
  <li class="active"><a href="#model" data-toggle="tab">Model</a></li>
  <li><a href="#results" data-toggle="tab">Results</a></li>
</ul>

<!-- Tab panes -->
<div class="tab-content">
  <!-- Model pane -->
  <div class="tab-pane active" id="model">

<img src="Annex60.Controls.Continuous.Examples.LimPID.svg" style="width:100%; background-color:#ffffff; border:2px solid gray" />

  </div>

  <!-- Results pane -->
  <div class="tab-pane" id="results">

</br>

<div id="yaxisform" style="width:15em; position:relative"> </div>

```js id=plotdiv
if (typeof(header) != "undefined") {
    $("#mytab a:last").tab("show"); // Select last tab
    yidx = header.indexOf(graphvar);
    xidx = header.indexOf(graphvarX);
    // pick out the column to plot
    series = x.slice(1).map(function(x) {return [x[xidx], x[yidx]];});
    plot([series]);
}
```

<div id="xaxisform" class="center-block" style="text-align:center; width:15em; position:relative"> </div>


  </div>
</div>

</div>
</div>


## Comments

This simulation model is from a [Modelica](http://modelica.org) model.
Modelica is a language for simulating electrical, thermal, and
mechanical, systems. [OpenModelica](http://openmodelica.org) was used
to compile this model to C. Then, [Emscripten](http://emscripten.org/)
was used to compile the C code to JavaScript.

For more information on compiling OpenModelica to JavaScript, see
[here](https://github.com/tshort/openmodelica-javascript).

The user interface was created in
[mdpad](http://tshort.github.io/mdpad/). See
[Annex60.Controls.Continuous.Examples.LimPID.md](Annex60.Controls.Continuous.Examples.LimPID.md) for the Markdown code
for this page.
