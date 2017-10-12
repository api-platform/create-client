import Api from '@api-platform/api-doc-parser/lib/Api';
import Resource from '@api-platform/api-doc-parser/lib/Resource';
import Field from '@api-platform/api-doc-parser/lib/Field';
import fs from 'fs';
import tmp from 'tmp';
import AdminOnRestGenerator from './AdminOnRestGenerator';


test('Generate a React app', () => {
  const generator = new AdminOnRestGenerator({hydraPrefix: 'hydra:', templateDirectory: `${__dirname}/../../templates`});
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

  expect(fs.existsSync(tmpobj.name+'/config/_entrypoint.js'), true);

  expect(fs.existsSync(tmpobj.name+'/components/abc/index.js'), true);

  tmpobj.removeCallback();
});
