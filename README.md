<img align="left" src="https://github.com/adamnapieralski/locations-search/blob/main/frontend/src/public/favicon.ico" title="locations-search" alt="locations-search" width="50" height="50">

# locations-search
Application for searching locations with user defined criteria. (Spatial Databases course project)

#### Built with
- Django
- React
- Webpack & Babel
- Docker & docker-compose

## Installation
Clone this repo to the desired location:
```
git clone https://github.com/adamnapieralski/locations-search.git
```
## Development
App has been prepared for easy development with docker-compose. You can set up backend and frontend with
```
docker-compose up
```
Visit http://localhost:8000 to access the application. Backend server will be reachable on http://localhost:9000.

## Testing
Application's e2e and integration tests are contained in `e2e/` directory.

Install tests required modules with `npm install` there.

To open interactive Cypress GUI console run
```
npm run cy:open
```
To run all tests, run:
```
npm run cy:run
```
or to run them headlessly in the console
```
npm run cy:run:headless
```
With 'run' commands, videos and screenshots from tests executions will be save locally for further analysis.

## Authors
- **Łukasz Kostrzewa** - [kost13](https://github.com/kost13)
- **Adam Napieralski** - [adamnapieralski](https://github.com/adamnapieralski)
