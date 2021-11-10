# EcoSwap Frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/7bebf1a3-be7b-4165-afd1-446256acd5e3/deploy-status)](https://app.netlify.com/sites/pancake-prod/deploys)

This project contains the main features of the pancake application.

If you want to contribute, please refer to the [contributing guidelines](./CONTRIBUTING.md) of this project.

## Steps to run the project

- You will require two more projects in order to run this project they are as follows
  - ecoswap-toolkit
  - ecoswap-sdk
- Keep all three Projects (i.e. ecoswap-frontend, ecoswap-sdk and ecoswap-toolkit) in same folder
- Rename the exchange-frontend folder name to ecoswap-frontend
- Run yarn install in ecoswap-sdk, ecoswap-toolkit > packages > pancake-ui-kit and in ecoswap-frontend
- Once yarn installation is finished in all the three projects run yarn build in ecoswap-sdk and in ecoswap-toolkit > packages > pancake-ui-kit
- Once the builds are finished you can run the ecoswap-frontend using yarn start

## Documentation

- [Info](doc/Info.md)
- [Cypress tests](doc/Cypress.md)
