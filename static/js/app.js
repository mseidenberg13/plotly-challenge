 function init() {
    
  var selector = d3.select("#selDataset");  
      d3.json("samples.json").then((data) => {
        var subjectNames = data.names;
        subjectNames.forEach((id) => {
          selector
          .append("option")
          .text(id)
          .property("value", id);
        });
      const initialSubject = subjectNames[0];
      plots(initialSubject);
      metaData(initialSubject);
    });
  }
  
  function plots(sample) {    
    d3.json("samples.json").then((data) => {
    var samples = data.samples;
    console.log(samples)
    var filteredArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = filteredArray[0];
    console.log("result", result)
    var sampleValues = result.sample_values;
    console.log(sampleValues)
    var otuIds = result.otu_ids;
    console.log(otuIds)
    var otuLabels = result.otu_labels;   
    // console.log(otuLabels)

//Bar plot
    var trace1 = {
      x: sampleValues.slice(0,10).reverse(),
      y: otuIds.slice(0,10).map(otuId => `OTU ${otuId}`).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      marker: {
        color: 'purple'},
      type: "bar",
      orientation: "h"
  };
  var data = [trace1];
  var layout = {
      title: "Top Ten OTU's for " + sample
  };
  Plotly.newPlot("bar", data, layout); 

  //Bubble plot
    var trace2 = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
        size: sampleValues,
        color: otuIds,
        }
    };
    var data = [trace2];
    var layout = {
        title: "Bacteria for Sample ID " + sample,
        showlegend: false,
    };
    Plotly.newPlot('bubble', data, layout); 
   
    });
  }

//Metadata chart
  function metaData(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        console.log(metadata)
        var filteredArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filteredArray[0];
        console.log(result)
        var metaChart = d3.select("#sample-metadata");
        metaChart.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaChart.append("h6").text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
        })

//Gauge chart    
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: result.wfreq,
        gauge: {
          axis: { range: [0, 9]}
        },
        title: '<b>Belly Button Washing Frequency</b><br> Scrubs per Week',
        type: "indicator",
        mode: "gauge+number"
      }
    ];  
    Plotly.newPlot("gauge", data);
    });
  }
  
  function optionChanged(newSubject) {
    plots(newSubject);
    metaData(newSubject);
  }
  
  init();