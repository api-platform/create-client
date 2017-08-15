
# Troubleshooting
* The generator does not perform any authentication, so you must ensure that all referenced hydra paths for your API are accessible anonymously. If you are using [API Platform](https://api-platform.com) this will at least include:
  ```
  api_entrypoint                             ANY      ANY      ANY    /{index}.{_format}
  api_doc                                    ANY      ANY      ANY    /docs.{_format}
  api_jsonld_context                         ANY      ANY      ANY    /contexts/{shortName}.{_format}
  ```

* If you recieve `Error: The class http://www.w3.org/ns/hydra/core#ApiDocumentation doesn't exist.` you may have specified the documentation URL instead of the entrypoint. For example if you are using [API Platform](https://api-platform.com) and your documentation URL is at [https://demo.api-platform.com/docs] the entry point is likely at [https://demo.api-platform.com]. You can see an example of the expected response from an entrypoint in your browser by clicking visiting [https://demo.api-platform.com/index.jsonld].    

* If you receive `TypeError: Cannot read property '@type' of undefined` or `TypeError: Cannot read property '0' of undefined` check that the URL you specified is accessible and returns jsonld.  You can check from the command line you are using by running something like `curl https://demo.api-platform.com/`.

* If you receive a message like this:
  ```
  { Error
    at done (/usr/local/share/.config/yarn/global/node_modules/jsonld/js/jsonld.js:6851:19)
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)
  name: 'jsonld.InvalidUrl',
  message: 'Dereferencing a URL did not result in a JSON object. The response was valid JSON, but it was not a JSON object.',
  details:
   { code: 'invalid remote context',
     url: 'https://demo.api-platform.com/contexts/Entrypoint',
     cause: null } }
  ```

  Check access to the specified url, in this case `https://demo.api-platform.com/contexts/Entrypoint`, use curl to check access and the response `curl https://demo.api-platform.com/contexts/Entrypoint`. In the above case an "Access Denied" message in JSON format was being returned. 
  
  
## TODO
* Custom endpoints issue  
