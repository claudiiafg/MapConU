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

to run unit test (need to be at root level of the project):
`npm test`

to run e2e/protractor test (need to be at root level of the project):
`npm run e2e`

## API Key:

To make sure you can work on the project, you will need a valid Google API Key.

Once you have your key, navigate to src->environments

![Path to environments](https://i.ibb.co/w7T2MxH/Selection-003.png)

Create an env.ts file, and add this line of code:

`export const APIKey = "YOUR-API-KEY";`


## Typedoc:

If you want to generate the current documentation for the application

`npx typedoc --out ./docs ./src`

Location of the generated documentation is: root_of_project/docs/index.html

See typedoc full documentation here: https://typedoc.org/guides/installation/
