const package = require('../package.json')
const cp = require('child_process')
const path = require('path')

const projectPath = path.resolve(__dirname, '..')
console.log(projectPath)

const { repositoryHost,
  repositoryImage,
  imageTag = 'latest'
} = package

if (!repositoryHost) {
  console.log('Repository host not found')
  process.exit(1)
}

if (!repositoryImage) {
  console.log('Repository Image not found')
  process.exit(1)
}

try {
  cp.execSync('npm run compile', { stdio: 'inherit' })
  console.log('Successfully Compiled')
} catch (error) {
  console.log('Error in compiling', error.message)
  process.exit(1)
}

try {
  cp.execSync(`docker build -t ${repositoryHost}/${repositoryImage}:${imageTag} ${projectPath}`, { stdio: 'inherit' })
  console.log(`Successfully built image ${repositoryHost}/${repositoryImage}:${imageTag}`)
} catch (error) {
  console.log('Error in building image\n', error.message)
  process.exit(1)
}
