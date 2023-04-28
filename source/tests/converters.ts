import { describe, should } from 'micro-should'
import { addressBigintToHex, addressHexToBigint, bigintToBytes, bytesToBigint } from '../converters.js'
import { assertEqual } from './utils.js'

describe('bytesToBigint', () => {
	[
		{ name: 'empty', expected: 0n, input: new Uint8Array() },
		{ name: '0x0', expected: 0n, input: new Uint8Array([0x00]) },
		{ name: '0x0000', expected: 0n, input: new Uint8Array([0x00, 0x00]) },
		{ name: '0x1', expected: 0x1n, input: new Uint8Array([0x01]) },
		{ name: '0xff', expected: 0xffn, input: new Uint8Array([0xff]) },
		{ name: '0x100', expected: 0x100n, input: new Uint8Array([0x1, 0x00]) },
		{ name: '0x1ff', expected: 0x1ffn, input: new Uint8Array([0x1, 0xff]) },
		{ name: '0xffffffffffffffffffffffffffffffffffffffff', expected: 0xffffffffffffffffffffffffffffffffffffffffn, input: new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]) },
		{ name: '0x10000000000000000000000000000000000000000', expected: 0x10000000000000000000000000000000000000000n, input: new Uint8Array([0x1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) },
		{ name: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn, input: new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]) },
		{ name: '0x10000000000000000000000000000000000000000000000000000000000000000', expected: 0x10000000000000000000000000000000000000000000000000000000000000000n, input: new Uint8Array([0x1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) },
	].forEach(x => should(x.name, () => {
		const actual = bytesToBigint(x.input)
		assertEqual(x.expected, actual)
	}))
})

describe('bigintToBytes', () => {
	([
		{ name: 'empty', expected: new Uint8Array(), input: [ 0n, 0 ] },
		{ name: '0x0', expected: new Uint8Array([0x00]), input: [ 0n, 1 ] },
		{ name: '0x0000', expected: new Uint8Array([0x00, 0x00]), input: [ 0n, 2 ] },
		{ name: '0x1', expected: new Uint8Array([0x01]), input: [ 0x1n, 1 ] },
		{ name: '0xff', expected: new Uint8Array([0xff]), input: [ 0xffn, 1 ] },
		{ name: '0x100', expected: new Uint8Array([0x1, 0x00]), input: [ 0x100n, 2 ] },
		{ name: '0x1ff', expected: new Uint8Array([0x1, 0xff]), input: [ 0x1ffn, 2 ] },
		{ name: '0xffffffffffffffffffffffffffffffffffffffff', expected: new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]), input: [ 0xffffffffffffffffffffffffffffffffffffffffn, 20 ] },
		{ name: '0x10000000000000000000000000000000000000000', expected: new Uint8Array([0x1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), input: [ 0x10000000000000000000000000000000000000000n, 21 ] },
		{ name: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', expected: new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]), input: [ 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn, 32 ] },
		{ name: '0x10000000000000000000000000000000000000000000000000000000000000000', expected: new Uint8Array([0x1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), input: [ 0x10000000000000000000000000000000000000000000000000000000000000000n, 33 ] },
		{ name: 'without length specified, even nibbles', expected: new Uint8Array([0xff]), input: [0xffn] },
		{ name: 'without length specified, odd nibbles', expected: new Uint8Array([0x0]), input: [0x0n] },
		{ name: 'without length specified, long even nibbles', expected: new Uint8Array([0x1, 0x00]), input: [0x100n] },
		{ name: 'without length specified, long odd nibbles', expected: new Uint8Array([0xff, 0xff]), input: [0xffffn] },
	] as const).forEach(x => should(x.name, () => {
		const input: Readonly<Parameters<typeof bigintToBytes>> = x.input
		const actual = bigintToBytes(...input)
		assertEqual(x.expected, actual)
	}))
})

describe('addressBigintToHex', () => {
	([
		{ name: 'Zero', expected: '0x0000000000000000000000000000000000000000', input: 0n },
		{ name: 'checksummed Fs', expected: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF', input: 0xffffffffffffffffffffffffffffffffffffffffn },
	] as const).forEach(x => should(x.name, () => {
		const actual = addressBigintToHex(x.input)
		assertEqual(x.expected, actual)
	}))
})

describe('addressHexToBigint', () => {
	([
		{ name: 'Zero', expected: 0n, input: '0x0000000000000000000000000000000000000000' },
		{ name: 'checksummed Fs', expected: 0xffffffffffffffffffffffffffffffffffffffffn, input: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF' },
		{ name: 'unchecked Fs', expected: 0xffffffffffffffffffffffffffffffffffffffffn, input: '0xffffffffffffffffffffffffffffffffffffffff' },
	] as const).forEach(x => should(x.name, () => {
		const actual = addressHexToBigint(x.input)
		assertEqual(x.expected, actual)
	}))
})
