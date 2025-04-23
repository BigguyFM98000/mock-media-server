const fs = require('fs');
const path = require('path');

module.exports = {
  ensureDataFile(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf-8');  // Create with empty array
    } else {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (!content || content.trim() === '') {
        fs.writeFileSync(filePath, '[]', 'utf-8');  // Fix empty/corrupt file
      }
    }
  },

  readData(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content ? JSON.parse(content) : [];
    } catch (err) {
      console.error('Failed to read JSON:', err.message);
      return [];
    }
  },

  writeData(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write data:', err.message);
    }
  },

  addData(filePath, newItem) {
    const data = this.readData(filePath);
    data.push(newItem);
    this.writeData(filePath, data);
  }
};
