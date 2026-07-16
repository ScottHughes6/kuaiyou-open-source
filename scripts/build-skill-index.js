const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '../skills');
const OUTPUT_FILE = path.join(SKILLS_DIR, 'index.json');

function buildIndex() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('Skills directory not found:', SKILLS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(SKILLS_DIR);
  const index = [];

  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'index.json') {
      const filePath = path.join(SKILLS_DIR, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const skill = JSON.parse(content);
        
        // Extract essential metadata for the index
        if (skill.id && skill.name) {
          index.push({
            id: skill.id,
            name: skill.name,
            description: skill.description || '',
            executionMode: skill.executionMode || 'REACTIVE',
            file: file,
            updatedAt: fs.statSync(filePath).mtime
          });
        }
      } catch (err) {
        console.warn(`Failed to parse ${file}:`, err.message);
      }
    }
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ skills: index }, null, 2));
  console.log(`Successfully built index.json with ${index.length} skills.`);
}

buildIndex();
