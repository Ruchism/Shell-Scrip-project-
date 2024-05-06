document.addEventListener("DOMContentLoaded", function () {
  // Get reference to input file element
  var fileInput = document.getElementById("csvFileInput");
  
  // Add event listener for file selection
  fileInput.addEventListener("change", function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    
    // Event listener for when file reading is complete
    reader.onload = function (e) {
      var csvData = e.target.result;
      // console.log(csvData);
      var outputDiv = document.getElementById("output");
      // Sample CSV data (replace this with your actual CSV data)

      // Parse CSV data into array of objects
      const parseCSV = (csvString) => {
        const lines = csvString.trim().split("\n");
        const headers = lines.shift().split(",");
        // console.log(lines[0]);
        // console.log(headers);
        return lines.map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            // console.log("===============");
            // console.log(obj[header.trim()]);
            // console.log(index);
            // console.log(values[index].trim());
            // console.log(obj);
            return obj;
          }, {});
        });
      };

      // Sanitize URL and title
      const sanitize = (str) => str.replace(/\s+/g, " ").trim();
      // Extract common prefix from URL
      const extractPrefix = (url) => {
        const match = url.match(/^(https?:\/\/[^/]+\/[^/]+\/[^/]+)/);
        return match ? match[1] : url;
      };

      // Group URLs by common prefixes and consolidate titles
      const restructureCSV = (csvData) => {
        const csvArray = parseCSV(csvData);
        const categories = {};
        // console.log(csvArray);

        csvArray.forEach((row) => {
          const url = sanitize(row.URL);
          const title = sanitize(row.Description);
          const prefix = extractPrefix(url);
          // console.log('________________');
          // console.log(url);
          // console.log(title);
          // console.log(prefix);
          // console.log('-------------------------');

          categories[prefix] = categories[prefix] || {
            prefix,
            overview: "",
            campus: "",
            courses_scholarships: "",
            placements: "",
            results: "",
          };
          // console.log(categories);
          // console.log("*************************");
          // console.log();

          // Assign title to corresponding category
          if (
            title.includes("Overview") ||
            title.includes("overview") ||
            url.includes("overview")
          )
            categories[prefix].overview += `${title} `;
          else if (title.includes("Campus") || url.includes("campus"))
            categories[prefix].campus += `${title}`;
          else if (
            title.includes("Courses") ||
            url.includes("courses") ||
            title.includes("Scholarships")
          )
            categories[prefix].courses_scholarships += `${title} `;
          else if (
            title.includes("Placement") ||
            url.includes("placement") ||
            url.includes("admission") ||
            title.includes("Admission")
          )
            categories[prefix].placements += `${title} `;
          else if (title.includes("Results") || url.includes("results"))
            categories[prefix].results += `${title} `;
        });
        // console.log(categories);
        // Convert object to array of objects
        return Object.values(categories);
      };

      // Generate output CSV string
      const generateOutputCSV = (restructuredData) => {
        let outputCSV =
          "URL, overview, campus, courses-scholarships, placements, results\n";
        restructuredData.forEach((category) => {
          outputCSV += `${category.prefix},${category.overview},${category.campus},${category.courses_scholarships},${category.placements},${category.results}\n`;
        });
        return outputCSV;
      };

      // Main function to execute the restructuring process
      const main = () => {
        const restructuredData = restructureCSV(csvData);
        const outputCSV = generateOutputCSV(restructuredData);
        // Output the result
        console.log(outputCSV);
        // outputDiv.innerHTML = outputCSV;
        var lines = outputCSV.split("\n");
        console.log(lines.length);
        console.log(lines);
        var html = "<table>";
        for (var i = 0; i < lines.length; i++) {
          var cells = lines[i].split(",");
          html += "<tr>";
          for (var j = 0; j < cells.length; j++) {
            html += "<td>" + cells[j] + "</td>";
          }
          html += "</tr>";
        }
        html += "</table>";
        // Display parsed data in output div
        outputDiv.innerHTML = html;
        // outputDiv.innerHTML = outputCSV;  

        function saveCSV() {
          const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(outputCSV);
          const link = document.createElement("a");
          link.setAttribute("href", csvContent);
          link.setAttribute("download", "data.csv");
          link.style.display = "none";
          document.body.appendChild(link);

          link.click();

          document.body.removeChild(link);
      }
        
          saveCSV();
      };

      // Run the main function
      main();

      // Parse CSV data
      
    };

    // Read file as text
    reader.readAsText(file);
  });
});
