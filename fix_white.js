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
      if (file.endsWith('.tsx')) {
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
  
  // If background is var(--primary), change text color to #0f172a
  content = content.replace(/background:\s*['"]var\(--primary\)['"],\s*color:\s*['"]white['"]/g, "background: 'var(--primary)', color: '#0f172a'");
  
  // Fix button in ReviewSection.tsx that got messed up: background: 'var(--card-bg)', color: 'white'
  content = content.replace(/background:\s*['"]var\(--card-bg\)['"],\s*color:\s*['"]white['"]/g, "background: 'var(--primary)', color: '#0f172a'");
  
  // Same for backgroundColor
  content = content.replace(/backgroundColor:\s*['"]var\(--primary\)['"],\s*color:\s*['"]white['"]/g, "backgroundColor: 'var(--primary)', color: '#0f172a'");

  // Fix other instances of primary button text color
  content = content.replace(/color:\s*['"]white['"](,\s*background:\s*['"]var\(--primary\)['"])/g, "color: '#0f172a'$1");
  
  // Fix Add to Cart button in ProductCard
  content = content.replace(/color:\s*['"]white['"],\s*border:\s*['"]none['"],\s*padding:\s*['"]1rem['"],\s*borderRadius:\s*['"]16px['"]/g, "color: '#0f172a', border: 'none', padding: '1rem', borderRadius: '16px'");
  
  // Fix Cart item counts and badges
  content = content.replace(/background:\s*['"]var\(--primary\)['"],\s*color:\s*['"]white['"]/g, "background: 'var(--primary)', color: '#0f172a'");

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
