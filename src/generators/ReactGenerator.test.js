import Api from 'api-doc-parser/lib/Api';
import Resource from 'api-doc-parser/lib/Resource';
import Field from 'api-doc-parser/lib/Field';
import fs from 'fs';
import tmp from 'tmp';
import ReactGenerator from './ReactGenerator';


test('Generate a React app', () => {
  const generator = new ReactGenerator({hydraPrefix: 'hydra:', templateDirectory: `${__dirname}/../../templates`});
  const tmpobj = tmp.dirSync({unsafeCleanup: true});

  const fields = [new Field('bar', {
    id: 'http://schema.org/url',
    range: 'http://www.w3.org/2001/XMLSchema#string',
    reference: null,
    required: true,
    description: 'An URL'
  })];
  const resource = new Resource('abc', 'http://example.com/foos', {
    id: 'foo',
    title: 'Foo',
    readableFields: fields,
    writableFields: fields
  });
  const api = new Api('http://example.com', {
    entrypoint: 'http://example.com:8080',
    title: 'My API',
    resources: [resource]
  });
  generator.generate(api, resource, tmpobj.name);

  expect(fs.existsSync(tmpobj.name+'/actions/abc/create.js'), true);
  expect(fs.existsSync(tmpobj.name+'/actions/abc/delete.js'), true);
  expect(fs.existsSync(tmpobj.name+'/actions/abc/list.js'), true);
  expect(fs.existsSync(tmpobj.name+'/actions/abc/update.js'), true);

  expect(fs.existsSync(tmpobj.name+'/api/abcFetch.js'), true);

  expect(fs.existsSync(tmpobj.name+'/components/abc/Create.js'), true);
  expect(fs.existsSync(tmpobj.name+'/components/abc/Form.js'), true);
  expect(fs.existsSync(tmpobj.name+'/components/abc/List.js'), true);
  expect(fs.existsSync(tmpobj.name+'/components/abc/Update.js'), true);

  expect(fs.existsSync(tmpobj.name+'/reducers/abc/create.js'), true);
  expect(fs.existsSync(tmpobj.name+'/reducers/abc/delete.js'), true);
  expect(fs.existsSync(tmpobj.name+'/reducers/abc/index.js'), true);
  expect(fs.existsSync(tmpobj.name+'/reducers/abc/list.js'), true);
  expect(fs.existsSync(tmpobj.name+'/reducers/abc/update.js'), true);

  tmpobj.removeCallback();
});
