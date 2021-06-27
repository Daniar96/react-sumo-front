# CentreGEO SUMO Client

This is the module 4 project for UTwente TCS CentreGEO SUMO Team 1.
This application visualises the output of simulations run by CentreGEO SUMO.
The frontend is built using React and a custom router. The backend is built using Java Servlets and Jersey.

## Building and running

### Frontend

The frontend is located in `src/frontend`.

To start a development server for the frontend, you first need to install all dependencies using `yarn`:

```bash
yarn
```

Then you can execute the `start` NPM script:

```bash
yarn start
```

A browser should automatically open to the right page.

#### To build for production

Navigate to `src/frontend/sylvereye` folder
```bash
yarn link
```

Then navigate to `src/frontend/`
```bash
yarn link react-sylvereye
yarn build
```

The contents of the resulting `build` folder can then be copied over to
`src/backend/src/main/webapp` to be served by the backend

#### Environment variables

`.env.development` contains variables for running the fronend as a standalone
application for debugging and development purposes.
`.env.production` contains variables to properly function in a production
environment.

### Backend

The backend is located in `src/backend`.

For the backend, boot up your favorite Java IDE and perform the normal sequence of actions in order to boot up a Java servlet application.

### Links

Trello: <https://trello.com/b/sd8qOHBi/2021-m4-project-centrogeo-sumo-team-17>

Production Server: <https://centrogeo-sumo.paas.hosted-by-previder.com>
