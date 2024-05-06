document.addEventListener('DOMContentLoaded', function() {
    // Get reference to input file element
    var fileInput = document.getElementById('csvFileInput');
  
    // Add event listener for file selection
    fileInput.addEventListener('change', function(event) {
      var file = event.target.files[0];
      var reader = new FileReader();
  
      // Event listener for when file reading is complete
      reader.onload = function(e) {
        var csvData = e.target.result;
        var outputDiv = document.getElementById('output');
  
        // Parse CSV data
        var lines = csvData.split('\n');
        var html = '<table>';
        for (var i = 0; i < lines.length; i++) {
          var cells = lines[i].split(',');
          html += '<tr>';
          for (var j = 0; j < cells.length; j++) {
            html += '<td>' + cells[j] + '</td>';
          }
          html += '</tr>';
        }
        html += '</table>';
  
        // Display parsed data in output div
        outputDiv.innerHTML = html;
      };
  
      // Read file as text
      reader.readAsText(file);
    });
  });
  

  