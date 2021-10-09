require('dotenv').config()
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


const envOpts = (variableName, optName, defaultValue) => {
  if (process.env[variableName]) {
    return `--${optName} ${process.env[variableName]}`
  } else {
    if (defaultValue) {
      return `--${optName} ${defaultValue}`
    }
    return ''
  }
}

try {
  const command = `aws ecr get-login-password ${envOpts('AWS_PROFILE', 'profile')} ${envOpts('AWS_REGION', 'region', 'ap-south-1')} | docker login --username AWS --password-stdin ${repositoryHost}`
  cp.execSync(command, { stdio: 'inherit' })
} catch (error) {
  console.log('Error in getting credentials\n', error.message)
  process.exit(1)
}

try {
  const command = `docker push ${repositoryHost}/${repositoryImage}:${imageTag}`
  cp.execSync(command, { stdio: 'inherit' })
} catch (error) {
  console.log('Error in pushing image\n', error.message)
  process.exit(1)
}