# spdb-location-search
Application for searching a location with user defined properties. (Spatial Databases course project)

## Development
Set up backend and frontent with
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