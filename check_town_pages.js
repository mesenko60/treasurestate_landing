const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const townsDir = path.join(__dirname, 'montana-towns');
const excludeFiles = ['index.html'];

// Get all HTML files in the directory
const files = fs.readdirSync(townsDir)
  .filter(file => file.endsWith('.html') && !excludeFiles.includes(file));

console.log(`Found ${files.length} town files to check...\n`);

// Track issues
const issues = [];
const goodPages = [];

files.forEach(file => {
  const filePath = path.join(townsDir, file);
  const townName = file.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  let content = '';
  
  try {
    content = fs.readFileSync(filePath, 'utf8');
    let hasIssues = false;
    const townIssues = [];
    
    // Check 1: Hero section has correct town name
    if (!content.includes(`<h1>${townName}, Montana</h1>`)) {
      townIssues.push(`❌ Hero section missing or has incorrect town name format (expected "${townName}, Montana")`);
      hasIssues = true;
    }
    
    // Check 2: Content starts with Quick Facts
    if (!content.includes('<h1>Quick Facts</h1>')) {
      townIssues.push('❌ Content section does not start with "Quick Facts" heading');
      hasIssues = true;
    }
    
    // Check 3: No duplicate town names in content
    const duplicateTownName = new RegExp(`<h1[^>]*>${townName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}, Montana<\\/h1>\\s*<h1>`, 'i');
    if (duplicateTownName.test(content)) {
      townIssues.push('❌ Duplicate town name found in content section');
      hasIssues = true;
    }
    
    // Check 4: Required includes are present
    const requiredIncludes = [
      'site-menu',
      'site-hero',
      'coming-soon',
      'site-footer'
    ];
    
    requiredIncludes.forEach(id => {
      if (!content.includes(`id="${id}"`)) {
        townIssues.push(`❌ Missing required include: ${id}`);
        hasIssues = true;
      }
    });
    
    // Check 5: Required scripts are present
    const requiredScripts = [
      'adsbygoogle',
      'gtag',
      'script.js'
    ];
    
    requiredScripts.forEach(script => {
      if (!content.includes(script)) {
        townIssues.push(`❌ Missing required script: ${script}`);
        hasIssues = true;
      }
    });
    
    // Check 6: Hero image has proper alt text
    if (!content.includes(`alt="${townName}, Montana - Scenic View"`)) {
      townIssues.push('❌ Hero image missing or has incorrect alt text');
      hasIssues = true;
    }
    
    // Check 7: Proper meta description
    const metaDescriptionRegex = /<meta[^>]*name=["']description["'][^>]*>/i;
    if (!metaDescriptionRegex.test(content)) {
      townIssues.push('❌ Missing meta description');
      hasIssues = true;
    }
    
    // Check 8: Proper viewport meta tag
    if (!content.includes('name="viewport"')) {
      townIssues.push('❌ Missing viewport meta tag');
      hasIssues = true;
    }
    
    // Check 9: Proper charset meta tag
    if (!content.includes('<meta charset="utf-8"')) {
      townIssues.push('❌ Missing charset meta tag');
      hasIssues = true;
    }
    
    if (hasIssues) {
      issues.push({
        file,
        issues: townIssues
      });
    } else {
      goodPages.push(file);
    }
    
  } catch (error) {
    console.error(`❌ Error checking ${file}:`, error.message);
  }
});

// Print report
console.log('\n=== TOWN PAGE COMPLIANCE REPORT ===\n');

if (issues.length > 0) {
  console.log(`❌ Found ${issues.length} pages with issues:\n`);
  
  issues.forEach(({file, issues}) => {
    console.log(`📄 ${file}:`);
    issues.forEach(issue => console.log(`  ${issue}`));
    console.log('');
  });
  
  console.log('\n✅ Pages with no issues:');
  goodPages.forEach(file => console.log(`  - ${file}`));
  
  console.log('\n💡 Run the following command to fix the issues:');
  console.log('   node update_town_hero_scripts.js');
  
} else {
  console.log('✅ All town pages are compliant with the required standards!');
}

console.log('\n=== END OF REPORT ===\n');
