// Function to grab values from the response JSON object to build bar and bubble graphs.
function Graphs(sampleId) {
    d3.json("data/samples.json").then((otuData) => {
        console.log(otuData);
        var array = otuData.samples.filter(s => s.id == sampleId);
        var sample = array[0];
        var otu_ids = sample.otu_ids;
        var otu_labels = sample.otu_labels;
        var sample_values = sample.sample_values;
        
        // Trace for horizontal bar graph. 
        // Slice the top 10 OTUs and use reverse method to accommodate Plotly's ascending default.
        var trace1 = {
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var data1 = [trace1];

        var layout1 = {
            title: "Top 10 OTUs found in Each Test Subject",
            xaxis: {title: "Number of OTUs"},
        };
        
        // Render horizontal bar plot
        Plotly.newPlot("bar", data1, layout1);

        // Trace for bubble graph
        var trace2 = {
            x: otu_ids,
            y: sample_values, 
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Portland"
            },
            type: "scatter"
        };

        var data2 = [trace2];

        var layout2 = {
            title: "Microbes in Test Subject",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Number of OTUs"},
            showlegend: false
        };

        // Render bubble plot
        Plotly.newPlot("bubble", data2, layout2);
    });
};

// BONUS //
function Gauge(sampleId) {
    d3.json("data/samples.json").then((otuData) => {
        var wash = otuData.metadata.filter(w => w.id == sampleId);
        var washArray = wash[0];
        var wfreq = washArray.wfreq;

        //Trace for gauge
        var trace3 = {
            type: "indicator",
            mode: "gauge+number",
            value: wfreq,
            title: {text: "Belly Button Washing Frequency", font: {size: 20}},
            gauge: {
                axis: {range: [0, 9], tickwidth: 2, tickcolor: "black"},
                bar: {color: "#FA8072"},
                bgcolor: "red",
                borderwidth: 2,
                bordercolor: "black",
                steps: [
                  {range: [0, 1], color: "#A2D9CE"},
                  {range: [1, 2], color: "#76D7C4"},
                  {range: [2, 3], color: "#17A589"},
                  {range: [3, 4], color: "#45B39D"},
                  {range: [4, 5], color: "#138D75"},
                  {range: [5, 6], color: "#0E6655"},
                  {range: [6, 7], color: "#0B5345"},
                  {range: [7, 8], color: "#154360"},
                  {range: [8, 9], color: "#2471A3"}
                ],
                threshold: {
                  line: {color: "red", width: 4},
                  thickness: 0.75,
                  value: wfreq
                }
            }
        };
        
        var data3 = [trace3];

        var layout3 = {
            width: 550,
            height: 350,
            margin: {t: 25, b:25},
            paper_bgcolor: "white",
            font: {color: "auto", family: "Arial"}
        };
        
        // Render gauge chart
        Plotly.newPlot("gauge", data3, layout3);
    });
};

// Filter demographic info
function demographData(sampleId) {
    d3.json("data/samples.json").then((otuData) => {
        var demoArray = otuData.metadata.filter(m => m.id == sampleId);
        var result = demoArray[0];
        d3.select("#sample-metadata").html("");
        // Grab all key, values in metadata to display
        Object.entries(result).forEach(([key, value]) => {
            var display = `${key}: ${value}`;
            var panel = d3.select("#sample-metadata")
            panel.append("p").text(display);
        });
    });
};

//Function to filter data on dashboard when Test Subject ID dropdown is selected
function optionChanged(sampleId) {
    Graphs(sampleId);
    demographData(sampleId);
    Gauge(sampleId);    
};

// Initialize the page with default graphs and demographics info
function init() {
    var selection = d3.select("#selDataset");
    d3.json("data/samples.json").then((otuData) => {
        var names = otuData.names;
        names.forEach((sampleId) => {
            selection.append("option")
                .text(sampleId)
                .property("value", sampleId);
        });
        var sampleId = names[0];
        Graphs(sampleId);
        demographData(sampleId);
        Gauge(sampleId)
    });
};

init();