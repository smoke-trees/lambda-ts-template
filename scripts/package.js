const package = require('../package.json')
const cp = require('child_process')
const path = require('path')
const JSZip = require('jszip')
const fs = require('fs')

const projectPath = path.resolve(__dirname, '..')
console.log(projectPath)


const {
  imageTag = 'latest',
  functionName
} = package


try {
  cp.execSync('npm run compile', { stdio: 'inherit' })
  console.log('Successfully Compiled')
} catch (error) {
  console.log('Error in compiling', error.message)
  process.exit(1)
}

console.log('Copy package.json')

try {
  cp.execSync('cp package.json dist', { stdio: 'inherit' })
  cp.execSync('cp package-lock.json dist', { stdio: 'inherit' })
  console.log('Successfully copied')
} catch (error) {
  console.log('Error in compiling', error.message)
  process.exit(1)
}

console.log('install dependency')
try {
  cp.execSync('cd dist && npm ci --only=production', { stdio: 'inherit' })
  console.log('Successfully installed')
} catch (error) {
  console.log('Error in installing', error.message)
  process.exit(1)
}

console.log('Create zip')
try {
  cp.execSync(`cd dist && zip -r ../${functionName}-${imageTag}.zip *`, { stdio: 'inherit' })
  console.log('Successfully created zip')
} catch (error) {
  console.log('Error in creating zip', error.message)
  process.exit(1)
}

const fileName = `${functionName}-${imageTag}.zip`

const skeleton = {
  "FunctionName": functionName,
  ZipFile: fs.readFileSync(fileName),
  "Publish": true,
  "DryRun": false
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

console.log("Updating lambda")

try {
  const command = `aws lambda ${envOpts('AWS_PROFILE', 'profile')} ${envOpts('AWS_REGION', 'region', 'ap-south-1')} update-function-code --function-name '${functionName}' --zip-file 'fileb://${fileName}'`
  cp.execSync(command, { stdio: 'inherit' })
  console.log("Updating lambda updated")
} catch (error) {
  console.log('Error in updating lambda\n', error.message)
  process.exit(1)
}




