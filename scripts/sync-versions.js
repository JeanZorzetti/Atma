#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function updatePackageVersion(packagePath, version) {
  try {
    const packageJsonPath = path.join(packagePath, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.version = version;
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`✅ Updated ${packagePath}/package.json to v${version}`);
    } else {
      console.log(`⚠️  Package.json not found in ${packagePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${packagePath}:`, error.message);
  }
}

function main() {
  try {
    // Read the root package.json version
    const rootPackagePath = path.join(__dirname, '..', 'package.json');
    const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
    const version = rootPackage.version;
    
    console.log(`🔄 Synchronizing all packages to version ${version}...`);
    
    // Update all subproject versions
    const subprojects = [
      'Backend',
      'admin'
    ];
    
    subprojects.forEach(subproject => {
      const subprojectPath = path.join(__dirname, '..', subproject);
      updatePackageVersion(subprojectPath, version);
    });
    
    console.log(`🎉 Version synchronization completed! All packages are now at v${version}`);
    
  } catch (error) {
    console.error('❌ Error during version synchronization:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { updatePackageVersion };