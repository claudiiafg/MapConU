# MapConU

390 Project

## Requirements

Node.js: https://nodejs.org/en/

Ionic: `npm install -g ionic`

## Important commands

to install dependencies:
`npm install`

lauch app in browser:
`ionic serve`

build ios app (open ios platform directory in xCode):
`ionic cordova build ios`

build android app (open android platform directory in androidStudio):
`ionic cordova build android`

## API Key:

To make sure you can work on the project, you will need a valid Google API Key.

Once you have your key, navigate to src->environments

![Path to environments](https://i.ibb.co/w7T2MxH/Selection-003.png)

Create an env.ts file, and add this line of code: 

`export const APIKey = "YOUR-API-KEY";`
