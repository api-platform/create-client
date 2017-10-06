import Api from '@api-platform/api-doc-parser/lib/Api';
import Resource from '@api-platform/api-doc-parser/lib/Resource';
import Field from '@api-platform/api-doc-parser/lib/Field';
import fs from 'fs';
import tmp from 'tmp';
import VueGenerator from './VueGenerator';

test('Generate a Vue app', () => {
  const generator = new VueGenerator({hydraPrefix: 'hydra:', templateDirectory: `${__dirname}/../../templates`});
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

  expect(fs.existsSync(tmpobj.name+'/components/abc/Create.vue'), true);
  expect(fs.existsSync(tmpobj.name+'/components/abc/Form.vue'), true);
  expect(fs.existsSync(tmpobj.name+'/components/abc/List.vue'), true);
  expect(fs.existsSync(tmpobj.name+'/components/abc/Show.vue'), true);
  expect(fs.existsSync(tmpobj.name+'/components/abc/Update.vue'), true);

  expect(fs.existsSync(tmpobj.name+'/config/_entrypoint.js'), true);

  expect(fs.existsSync(tmpobj.name+'/error/SubmissionError.js'), true);

  expect(fs.existsSync(tmpobj.name+'/store/modules/abc/create.js'), true);
  expect(fs.existsSync(tmpobj.name+'/store/modules/abc/delete.js'), true);
  expect(fs.existsSync(tmpobj.name+'/store/modules/abc/index.js'), true);
  expect(fs.existsSync(tmpobj.name+'/store/modules/abc/list.js'), true);
  expect(fs.existsSync(tmpobj.name+'/store/modules/abc/mutation-types.js'), true);
  expect(fs.existsSync(tmpobj.name+'/store/modules/abc/show.js'), true);
  expect(fs.existsSync(tmpobj.name+'/store/modules/abc/update.js'), true);

  expect(fs.existsSync(tmpobj.name+'/utils/fetch.js'), true);

  tmpobj.removeCallback();
});
