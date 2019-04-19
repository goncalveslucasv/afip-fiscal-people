# AFIP fiscal people

## Basic usage
```js
getFiscalPeople('http://www.afip.gob.ar/genericos/cInscripcion/archivos/apellidoNombreDenominacion.zip',
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
