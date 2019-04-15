'use strict';

const fs = require('fs');
const split = require('split2');
const request = require('request');
const unzip = require('unzipper');
const { Transform, PassThrough } = require('stream');

function mapToObject(chunk) {
	const _substr = data => ({ from, length }) => data.substr(from, length);
	const dataSubstr = _substr(chunk.toString());
	return {
		_id: dataSubstr({ from: 0, length: 11 }),
		denomination: dataSubstr({ from: 11, length: 30 }),
		income_tax: dataSubstr({ from: 41, length: 2 }),
		iva: dataSubstr({ from: 43, length: 2 }),
		monotributo: dataSubstr({ from: 45, length: 2 }),
		soc: dataSubstr({ from: 47, length: 1 }),
		employer: dataSubstr({ from: 48, length: 1 }),
		activity: dataSubstr({ from: 50, length: 2 })
	};
}

function getFiscalPeople(file, options = {}) {
	const transformData = new Transform({
		writableObjectMode: true,
		objectMode: true,
		transform(chunk, encoding, callback) {
			this.push(JSON.stringify(mapToObject(chunk)));
			callback();
		}
	});

	const handleData = (stream, response, options) => chunk => {
		response.pause();

		// zip file signature
		const buffer = new Buffer.from([0x50, 0x4b, 0x03, 0x04]);

		if(chunk.slice(0, 4).compare(buffer) !== 0) {
			return response.destroy(
				new Error('invalid file')
			);
		}

		response.unshift(chunk);

		response.pipe(stream);

		const processStream = stream
			.pipe(unzip.ParseOne())
			.pipe(split())
			.pipe(transformData);

		if(options.target && typeof options.target === 'function')
			processStream.pipe(options.target());

		if(
			options.target &&
      typeof options.target === 'string' &&
      options.target.startsWith('mongodb')
		)

			console.log(typeof options.target);

		return processStream;
	};

	const stream = new PassThrough();

	request(file)
		.on('error', err => stream.emit('error', err))
		.on('response', response => {
			response.on('error', err => stream.emit('error', err));
			response.once('data', handleData(stream, response, options));
		});

	return stream;

}

// usage
getFiscalPeople('http://www.afip.gob.ar/genericos/cInscripcion/archivos/apellidoNombreDenominacion.zip',
	{
		target: () => fs.createWriteStream(`out2.txt`)
	}
).on('error', err => { console.log('my error', err); });
