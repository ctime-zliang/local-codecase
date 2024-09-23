function main1() {
	console.log(`%c=> 对单个二维平面坐标点使用矩阵变换`, 'color: #ff0000;')
	const pointMatrix = new Ven$Matrix(
		1,
		3,
		[
			/* ... */
			5, 6, 1,
			/* ... */
		]
	)
	console.log(`初始坐标 A: `, pointMatrix.toStringFormat())

	const tranlateCoordinateMatrix = Ven$Matrix3.createTranslateMatrix3ByCoordinate(5, 5)
	console.log(`平移矩阵(转置) T: `, tranlateCoordinateMatrix.toStringFormat())
	console.log(`平移矩阵 T^-1: `, tranlateCoordinateMatrix.transpose().toStringFormat())
	console.log(`平移坐标 A*T: `, pointMatrix.multiply(tranlateCoordinateMatrix).toStringFormat())

	console.log(`\n\n`)
}

function main2() {
	console.log(`%c=> 对二维平面坐标点组(矩阵)使用矩阵变换`, 'color: #ff0000;')
	const pointsMatrix = new Ven$Matrix3([1, 1, 1 /* ... */, 3, 1, 1 /* ... */, 1, 3, 1 /* ... */])
	console.log(`初始坐标 B: `, pointsMatrix.toStringFormat())

	const tranlateCoordinateMatrix = Ven$Matrix3.createTranslateMatrix3ByCoordinate(5, 5)
	console.log(`平移矩阵(转置) T: `, tranlateCoordinateMatrix.toStringFormat())
	console.log(`平移矩阵 T^-1: `, tranlateCoordinateMatrix.transpose().toStringFormat())
	console.log(`平移坐标 B*T: `, pointsMatrix.multiply3(tranlateCoordinateMatrix).toStringFormat())

	console.log(`\n\n`)
}

function main3() {
	console.log(`%c=> 对三维空间坐标点组(矩阵)使用矩阵变换`, 'color: #ff0000;')
	const pointsMatrix = new Ven$Matrix(2, 4, [15, 10, 5, 1 /* ... */, 30, 60, 20, 1 /* ... */])
	console.log(`初始坐标 C: `, pointsMatrix.toStringFormat())

	const tranlateCoordinateMatrix = Ven$Matrix4.createTranslateMatrix4ByCoordinate(10, 10, 5)
	console.log(`平移矩阵(转置) T: `, tranlateCoordinateMatrix.toStringFormat())
	console.log(`平移矩阵 T^-1: `, tranlateCoordinateMatrix.transpose().toStringFormat())
	console.log(`平移坐标 C*T: `, pointsMatrix.multiply(tranlateCoordinateMatrix).toStringFormat())

	console.log(`\n\n`)
}

main1()
main2()
main3()
