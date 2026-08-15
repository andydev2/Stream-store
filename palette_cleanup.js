const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Replace old dark navy/blue text and backgrounds with the new Dark Teal (#1C5F5C)
  content = content.replace(/#1e1e2f/g, "#1C5F5C");
  content = content.replace(/#0f172a/g, "#1C5F5C");
  content = content.replace(/#111111/g, "#1C5F5C");
  
  // Replace old pastel greens/blues with the new ones if they were hardcoded anywhere
  content = content.replace(/#A5E2CB/g, "#3ED5CC");
  content = content.replace(/#B8E2EA/g, "#8AE3CD");
  content = content.replace(/#D1EBE7/g, "#D3F2ED");
  
  // Replace box shadows that were using the old pastel green
  content = content.replace(/rgba\(165,\s*226,\s*203/g, "rgba(62, 213, 204");
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
