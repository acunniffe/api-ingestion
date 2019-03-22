# Optic for Express JS
Optic's documenting middleware for Express JS. This package supports APIs written in Javascript, Typescript, or ReasonML and can be used with the testing framework of your choice.  

## Usage
Install as a dev dependency
```bash
npm install @useoptic/document-express --save-dev
``` 
Before testing your Express App, wrap it in the documenting middleware. 
```javascript
import withOptic from '@useoptic/document-express'
//Express App used in Production
import {app} from '../server.js'

//Using Optic to document the API as your tests run
const appWithOptic = withOptic(app) 

//Example Test
it('can get a list of users', (done) => {
    request(appWithOptic)
       .get('/users')
       .expect(200, done)  
})

```
Consider wrapping the Express App within a shared test fixture so it's easier to integrate Optic with all of your tests.   


## Next Steps
Once you've setup the documenting middleware, [review the Optic docs](https://docs.useoptic.com/#/setup/project-setup) to finish setting up Optic for your API 
