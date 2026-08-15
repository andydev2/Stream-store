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

const replacements = [
  // Backgrounds
  { regex: /(backgroundColor|background):\s*['"](?:white|#ffffff)['"]/g, replacement: '$1: \'var(--card-bg)\'' },
  { regex: /(backgroundColor|background):\s*['"]#0f172a['"]/g, replacement: '$1: \'var(--card-bg)\'' },
  { regex: /(backgroundColor|background):\s*['"]#1e1e2f['"]/g, replacement: '$1: \'var(--card-bg)\'' },
  { regex: /(backgroundColor|background):\s*['"]#f8fafc['"]/g, replacement: '$1: \'var(--search-bg)\'' },
  
  // Text colors
  { regex: /color:\s*['"](?:black|#000|#111111|#1e1e2f|#1e293b|#e2e8f0)['"]/g, replacement: 'color: \'var(--text-main)\'' },
  { regex: /color:\s*['"](?:#475569|#64748b|#94a3b8)['"]/g, replacement: 'color: \'var(--text-muted)\'' },
  
  // Specific case for white text on primary buttons (should use the new contrast color or a variable)
  // Actually, I'll just change "color: 'white'" to "color: 'var(--background)'" or skip it if it's on primary.
  // We'll replace color: 'white' with color: 'var(--text-main)' ONLY if it's not a button? That's tricky.
  // Let's just do a manual replace for white text where needed, or leave it. In dark mode, text-main is white.
  // Actually, let's just replace `color: 'white'` with `color: 'var(--text-main)'` for general text, but for buttons it might be an issue.
  // Let's look for border colors
  { regex: /border(Top|Bottom|Left|Right)?:\s*['"]1px solid (?:#e2e8f0|rgba\(255,255,255,0\.05\)|rgba\(255,255,255,0\.1\))['"]/g, replacement: 'border$1: \'1px solid var(--border)\'' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
