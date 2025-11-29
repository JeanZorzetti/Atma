function readPackage(pkg) {
  // Aprovar build do canvas automaticamente
  if (pkg.name === 'canvas') {
    pkg.scripts = pkg.scripts || {}
    pkg.allowBuild = true
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
