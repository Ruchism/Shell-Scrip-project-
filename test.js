// Sample CSV data (replace this with your actual CSV data)
const csvData = `URL,Description
https://example.com/data/ai, Example AI Overview - Test
https://example.com/data/ai/campus, Example AI Campus - Test
https://example.com/data/ai/courses, Example AI Courses 2023-2024
https://example.com/data/php/campus, PHP Institute India Campus Facilities - PHP
https://example.com/data/php/courses, PHP Institute India Courses & Fees - PHP
https://example.com/data/php/scholarships, PHP Institute India Scholarships - PHP
https://example.com/data/php/admission, PHP Institute India Admission Process - PHP
https://example.com/data/python, Python Institute - India overview - Python
https://example.com/data/python/campus, Python Institute - India Campus Facilities - Python
https://example.com/data/python/courses, Python Institute - India Courses & Fees - Python
https://example.com/data/python/scholarships, Python Institute - India Scholarships - Python
https://example.com/data/python/placement, Python Institute - India Results - Python
https://example.com/data/python/results, Python Institute - India Results - Python`;

// Parse CSV data into array of objects
const parseCSV = (csvString) => {
  const lines = csvString.trim().split('\n');
  const headers = lines.shift().split(',');
  // console.log(lines[0]);
  // console.log(headers);
  return lines.map(line => {
    const values = line.split(',');
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
const sanitize = (str) => str.replace(/\s+/g, ' ').trim();
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

  csvArray.forEach(row => {
    const url = sanitize(row.URL);
    const title = sanitize(row.Description);
    const prefix = extractPrefix(url);
    // console.log('________________');
    // console.log(url);
    // console.log(title);
    // console.log(prefix);
    // console.log('-------------------------');

    categories[prefix] = categories[prefix] || { prefix, overview: '', campus: '', courses_scholarships: '', placements: '', results: '' };
    // console.log(categories);
    // console.log("*************************");
    // console.log();

    // Assign title to corresponding category
    if (title.includes('Overview') || title.includes('overview') || url.includes('overview')) categories[prefix].overview += `${title} `;
    else if (title.includes('Campus') || url.includes('campus')) categories[prefix].campus += `${title}`;
    else if (title.includes('Courses') || url.includes('courses')||title.includes('Scholarships')) categories[prefix].courses_scholarships += `${title} `;
    else if (title.includes('Placement') || url.includes('placement') || url.includes('admission') || title.includes('Admission')) categories[prefix].placements += `${title} `;
    else if (title.includes('Results') || url.includes('results')) categories[prefix].results += `${title} `;
  });
  // console.log(categories); 
  // Convert object to array of objects
  return Object.values(categories);
};

// Generate output CSV string
const generateOutputCSV = (restructuredData) => {
  let outputCSV = 'URL, overview, campus, courses-scholarships, placements, results\n';
  restructuredData.forEach(category => {
    outputCSV += `${category.prefix},${category.overview},${category.campus},${category.courses_scholarships},${category.placements},${category.results}\n`;
  });
  return outputCSV;
};

// Main function to execute the restructuring process
const main = () => {
  const restructuredData = restructureCSV(csvData);
  const outputCSV = generateOutputCSV(restructuredData);
  console.log(outputCSV); // Output the result
//   saveFile(outputCSV, 'output.csv');
};

// Run the main function
main();
