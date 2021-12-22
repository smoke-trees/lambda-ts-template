require('dotenv').config()
const package = require('../function.json')
const cp = require('child_process')
const path = require('path')

const projectPath = path.resolve(__dirname, '..')
console.log(projectPath)

const { repositoryHost,
  repositoryImage,
  imageTag = 'latest',
  functionName
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

const skeleton = {
  "FunctionName": functionName,
  "ImageUri": `${repositoryHost}/${repositoryImage}:${imageTag}`,
  "Publish": true,
  "DryRun": false
}

try {
  const command = `aws lambda ${envOpts('AWS_PROFILE', 'profile')} ${envOpts('AWS_REGION', 'region', 'ap-south-1')} update-function-code --cli-input-json '${JSON.stringify(skeleton)}'`
  cp.execSync(command, { stdio: 'inherit' })
} catch (error) {
  console.log('Error in getting credentials\n', error.message)
  process.exit(1)
}
