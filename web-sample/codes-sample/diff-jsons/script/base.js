let _old = {
	a: 'i am unchanged',
	b: 'i am deleted',
	e: {
		a: 1,
		b: false,
		c: null,
	},
	f: [
		1,
		{
			a: 'same',
			b: [
				{
					a: 'same',
				},
				{
					d: 'delete',
				},
			],
		},
	],
	g: new Date('2017.11.25'),
	h: 'i am updated',
	i: [{ name: '', cache: [1] }],
	j: [{ name: '', cache: { a: 1 } }],
	k: [{ name: '', cache: [1] }],
	l: [{ name: '', cache: [] }],
}
let _new = {
	a: 'i am unchanged',
	c: 'i am created',
	e: {
		a: '1',
		b: '',
		d: 'created',
	},
	f: [
		{
			a: 'same',
			b: [
				{
					a: 'same',
				},
				{
					c: 'create',
				},
			],
		},
		1,
	],
	g: new Date('2017.11.25'),
	h: 'i am updated really',
	i: [{ name: '', cache: { a: 1 } }],
	j: [{ name: '', cache: [] }],
	k: [{ name: '', cache: [] }],
	l: [{ name: '', cache: {} }],
}
let res = Ven$JsonDiff.exec(_old, _new)
let res2 = Ven$JsonDiff.exec2(_old, _new)

// output
console.log(_old)
console.log(_new)
console.log(res)
console.log(res2)
