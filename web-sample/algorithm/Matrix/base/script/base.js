function main1() {
	const matrix_1 = new Ven$Matrix3()
	const matrix_2 = new Ven$Matrix4()
	showMatrix(APP_CONTAINER_1, matrix_1.data, matrix_1.m, matrix_1.n, 'main1_matrix_1')
	showMatrix(APP_CONTAINER_1, matrix_2.data, matrix_2.m, matrix_2.n, 'main1_matrix_2')

	const matrix3_1 = new Ven$Matrix3([3, 5, 4, 2, 7, 6, 1, 9, 8])
	showMatrix(APP_CONTAINER_1, matrix3_1.data, matrix3_1.m, matrix3_1.n, 'main1_matrix3_1')
	console.log(`矩阵 matrix3_1: `, matrix3_1.toStringFormat())

	console.log(`\n\n`)
}

function main2() {
	const matrix_1 = new Ven$Matrix(2, 3, [1, 2, 3, 4, 5, 6])
	const matrix_2 = new Ven$Matrix(3, 2, [8, 5, 4, 2, 2, 6])
	showMatrix(APP_CONTAINER_2, matrix_1.data, matrix_1.m, matrix_1.n, 'main2_matrix_1')
	showMatrix(APP_CONTAINER_2, matrix_2.data, matrix_2.m, matrix_2.n, 'main2_matrix_2')
	const matrix_3 = matrix_1.multiply(matrix_2)
	console.log(`矩阵 main2_matrix_1 与矩阵 main2_matrix_2 相乘得矩阵 main2_matrix_3: `, matrix_3.toStringFormat())
	console.log(`矩阵 main2_matrix_3 的秩: `, matrix_3.getMatrixRank())
	console.log(`矩阵 main2_matrix_3 的逆矩阵:\n`, matrix_3.getInverseMatrix().toStringFormat())
}

main1()
main2()
