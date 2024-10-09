// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log(data)
    // get the metadata field;
    let metadata = data.metadata

    // Filter the metadata for the object with the desired sample number
    let filtered_metadata = metadata.filter(id => id.id==sample);

    // Use d3 to select the panel with id of `#sample-metadata`, Use `.html("") to clear any existing metadata
    let sample_metadata = d3.select('#sample-metadata').html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filtered_metadata[0]).forEach(([key,value]) => {
      sample_metadata.append("h6").text(`${key}: ${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_data = data.samples;

    // Filter the samples for the object with the desired sample number
    let filtered_sample = sample_data.filter(id => id.id==sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filtered_sample[0].otu_ids;
    let sample_values = filtered_sample[0].sample_values;
    let otu_labels = filtered_sample[0].otu_labels;

    // Build a Bubble Chart
    let bubble_chart_data = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };
    let bubble_chart_layout = {
      title: 'Bubble Chart',
      height: 600,
      width: 1000
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', [bubble_chart_data], bubble_chart_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_chart_data = {
      x: sample_values.reverse(),
      y: otu_ids.map(id => `OTU ${id}`).reverse(),
      text: otu_labels.reverse(),
      type: 'bar',
      orientation: 'h'
    };
    let bar_chart_layout = {
      title: 'Bar Chart',
      height: 500,
      width: 500            
    };  

    // Render the Bar Chart
    Plotly.newPlot('bar', [bar_chart_data], bar_chart_layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown_menu = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(function(id) {
      dropdown_menu.append('option').text(id).property('value', id);
    });

    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample)
    buildCharts(first_sample)
  });
}

// Function for event listener
function optionChanged(filtered_sample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(filtered_sample)
  buildMetadata(filtered_sample)
}

// Initialize the dashboard
init();
