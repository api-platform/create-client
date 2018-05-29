import Api from '@api-platform/api-doc-parser/lib/Api';
import Resource from '@api-platform/api-doc-parser/lib/Resource';
import Field from '@api-platform/api-doc-parser/lib/Field';
import fs from 'fs';
import tmp from 'tmp';
import TypescriptInterfaceGenerator from './TypescriptInterfaceGenerator';

test('Generate a typescript interface', () => {
  const generator = new TypescriptInterfaceGenerator({templateDirectory: `${__dirname}/../../templates`});
  const tmpobj = tmp.dirSync({unsafeCleanup: true});

  const resource = new Resource('abc', 'http://example.com/foos', {
    id: 'foo',
    title: 'Foo',
    readableFields: [new Field('bar', {
    id: 'http://schema.org/url',
    range: 'http://www.w3.org/2001/XMLSchema#string',
    reference: null,
    required: true,
    description: 'An URL'
  })],
    writableFields: [new Field('foo', {
    id: 'http://schema.org/url',
    range: 'http://www.w3.org/2001/XMLSchema#datetime',
    reference: null,
    required: true,
    description: 'An URL'
  }), new Field('foobar', {
    id: 'http://schema.org/url',
    range: undefined,
    reference: new Resource('foobar', 'http://example.com/FooBar', {title: 'FooBar'}),
    required: false
  })]
  });
  const api = new Api('http://example.com', {
    entrypoint: 'http://example.com:8080',
    title: 'My API',
    resources: [resource]
  });
  generator.generate(api, resource, tmpobj.name);

  expect(fs.existsSync(tmpobj.name+'/interfaces/foo.ts')).toBe(true);

  const res = `interface Foo {
  '@id'?: string;
  id: string;
  foo: any;
  foobar?: FooBar;
  readonly bar: string;
}
`
  expect(fs.readFileSync(tmpobj.name+'/interfaces/foo.ts').toString()).toEqual(res)

  tmpobj.removeCallback();
});
