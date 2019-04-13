# Using Optic with micro
Optic's documenting middleware for [micro](https://github.com/zeit/micro). This package supports APIs written in Javascript, Typescript, or ReasonML and can be used with the testing framework of your choice.  

## Usage
Install as a dev dependency
```bash
npm install @useoptic/document-node-http --save-dev
``` 
Before testing your `micro` service, wrap it in the documenting middleware. 
```javascript
import {withOptic} from '@useoptic/document-node-http/micro'

const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')

const microWithOptic = withOptic(micro);

test('my endpoint', async t => {
  const service = microWithOptic(async (req, res) => {
    micro.send(res, 200, {
      test: 'woot'
    })
  })

  const url = await listen(service)
  const body = await request(url)

  expect.deepEqual(JSON.parse(body).test, 'woot')
  service.close()
})

```   
