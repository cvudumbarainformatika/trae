#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get staged .vue files
const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM "*.vue"')
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

if (stagedFiles.length === 0) {
  process.exit(0);
}

// Load component reference
const componentRefPath = path.join(__dirname, '../docs/component-reference.md');
let componentRefContent = '';
try {
  componentRefContent = fs.readFileSync(componentRefPath, 'utf8');
} catch (err) {
  console.warn('Component reference file not found. Skipping check.');
  process.exit(0);
}

// Extract base component names
const baseComponentRegex = /`(Base\w+)`/g;
const baseComponents = [];
let match;
while ((match = baseComponentRegex.exec(componentRefContent)) !== null) {
  if (!baseComponents.includes(match[1])) {
    baseComponents.push(match[1]);
  }
}

// Check each staged file
let hasWarnings = false;
for (const file of stagedFiles) {
  // Skip files in the components/ui directory
  if (file.includes('components/ui/') || file.includes('components/base/')) {
    continue;
  }

  const content = fs.readFileSync(file, 'utf8');
  
  // Check if file contains any base component
  const usesBaseComponents = baseComponents.some(comp => 
    content.includes(`<${comp}`) || content.includes(`import ${comp}`)
  );
  
  // If not using any base components, show a warning
  if (!usesBaseComponents && content.includes('<template>')) {
    console.warn(`\x1b[33mWarning: ${file} might not be using any base components.\x1b[0m`);
    console.warn('Consider checking docs/component-reference.md for available components.');
    hasWarnings = true;
  }
}

if (hasWarnings) {
  console.log('\nYou can continue with the commit, but please review the warnings above.');
  // Exit with 0 to allow the commit to proceed
  process.exit(0);
}