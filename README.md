# AFIP fiscal people

The library is designed to be the simplest way possible to download the afip register

## Basic usage
```js
getFiscalPeople('http://www.afip[...]mbreDenominacion.zip',
	{
		target: () => fs.createWriteStream(`out2.txt`)
	}
).on('error', err => { console.log('my error', err); });
```

#### using options.target (optional)
- Takes a `function` or a `Writable Stream`

## Streaming
You can stream any response to a file stream.

```js
const pipeableFiscalPeople = getFiscalPeople('http://www.afip[...]mbreDenominacion.zip')
  .on('error', err => { console.log('my error', err); });

pipeableFiscalPeople
  .pipe(something1())
  .pipe(something2())
```

## Stream to mongodb (WIP)
```js
getFiscalPeople('http://www.afip[...]mbreDenominacion.zip',
	{
		target: () => 'mongodb://127.0.0.1:27017'
	}
).on('error', err => { console.log('my error', err); });
```



#### The link of the register until 04/19/2019 is:
http://www.afip.gob.ar/genericos/cInscripcion/archivos/apellidoNombreDenominacion.zip
