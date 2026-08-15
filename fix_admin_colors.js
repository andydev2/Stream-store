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

const files = walkSync('./src/components');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Forms and admin components
  content = content.replace(/background:\s*['"]#fff['"]/g, "background: 'var(--card-bg)'");
  content = content.replace(/backgroundColor:\s*['"]#fff['"]/g, "backgroundColor: 'var(--card-bg)'");
  content = content.replace(/color:\s*['"]#111['"]/g, "color: 'var(--text-main)'");
  content = content.replace(/color:\s*['"]#666['"]/g, "color: 'var(--text-muted)'");
  content = content.replace(/border:\s*['"]1px solid #ccc['"]/g, "border: '1px solid var(--border)'");
  content = content.replace(/border:\s*['"]1px dashed #ccc['"]/g, "border: '1px dashed var(--border)'");
  content = content.replace(/background:\s*['"]#f9fafb['"]/g, "background: 'var(--search-bg)'");
  
  // DashboardClient metric cards background #fff
  content = content.replace(/background:\s*['"]white['"]/g, "background: 'var(--card-bg)'");
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
