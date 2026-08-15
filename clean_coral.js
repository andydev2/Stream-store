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
  
  // Replace leftover orange gradients
  content = content.replace(/linear-gradient\([^,]+,\s*var\(--primary\)\s*0%,\s*#FF8E53\s*100%\)/g, "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)");
  
  // Replace leftover red box shadows (rgba(255,107,107,0.x))
  content = content.replace(/rgba\(\s*255\s*,\s*107\s*,\s*107\s*,\s*([0-9.]+)\s*\)/g, "rgba(165, 226, 203, $1)");
  
  // Replace any standalone #FF8E53
  content = content.replace(/#FF8E53/g, "var(--secondary)");
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
