const fs = require('fs');
const path = require('path');

// Point this to your images directory
const imageDir = path.join(__dirname, 'images');
const jsonFile = path.join(__dirname, 'projects.json');

// Read the folder
const files = fs.readdirSync(imageDir);

function projectAlreadyExists(projects, imagePath) {
  return projects.some(project => project.image.toLowerCase() === imagePath.toLowerCase());
}

function formatTitleFromFilename(file) {
  let title = file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  return title.replace(/\b\w/g, char => char.toUpperCase());
}

let projects = [];
if (fs.existsSync(jsonFile)) {
  try {
    projects = JSON.parse(fs.readFileSync(jsonFile, 'utf8')) || [];
  } catch (error) {
    console.error(`Error reading existing ${path.basename(jsonFile)}. Overwriting with a fresh list.`);
    projects = [];
  }
}

files
  .filter(file => file.match(/\.(jpg|jpeg|png|webp|gif)$/i))
  .forEach(file => {
    const image = `images/${file}`;
    if (!projectAlreadyExists(projects, image)) {
      projects.push({
        title: formatTitleFromFilename(file),
        image: image
      });
    }
  });

// Save it to a JSON file in your main folder
fs.writeFileSync(jsonFile, JSON.stringify(projects, null, 2));
console.log(`Success! Updated ${path.basename(jsonFile)} with ${projects.length} images.`);