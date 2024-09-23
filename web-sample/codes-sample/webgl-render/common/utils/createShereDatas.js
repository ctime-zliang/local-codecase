/**
 * 通过经纬线方式生成球体原始顶点(经纬线交叉点)坐标数据 ORIGIN_POSITIONS
 * 按规律生成球体各顶点(经纬线交叉点)的实际编号, 从原始顶点(经纬线交叉点)坐标数据 ORIGIN_POSITIONS 中匹配实际的空间顶点(经纬线交叉点)坐标
 * 生成适用于 WebGL 渲染的顶点(经纬线交叉点)坐标数据 VERTEXT_POSITIONS
 *
 * - 生成球体原始顶点坐标数据 ORIGIN_POSITIONS
 *      - 建立第 1 层循环, 遍历纬线圈个数, 计算顶点原始坐标 Y 轴分量的值 COORDINATE_Y
 *      - 建立第 2 层循环, 遍历经线半圆个数, 计算顶点原始坐标 X 轴分量的值 COORDINATE_X 和 Z 轴分量的值 COORDINATE_Z
 *      - 生成原始顶点坐标数据 ORIGIN_POSITIONS
 *      - 此时, ORIGIN_POSITIONS 将包含 MERIDIAN_COUNT * LATITUDE_COUNT 份顶点坐标数据
 * - 获取球体各顶点(经纬线交叉点)的实际编号, 并生成绘制三角形顶点坐标数据 VERTEXT_POSITIONS
 *      - 通过经纬线分割的球体, 对于南北两极, 分割出的图形为球面三角形, 对于中间部分, 分割出的图形为球面矩形
 *      - 建立第 1 层循环, 遍历纬线圈个数, 记作 i
 *      - 建立第 2 层循环, 遍历经线半圆个数, 记作 j
 *      - 获取北极各三角形的各顶点的实际编号
 *          - 定义北极点 N 的纬线圈(半径为 0)为 m0 号纬线圈(往南各纬线圈编号依次为 m1, m2, m3...), 定义各经线半圆的编号依次为 l0, l1, l2...
 *          - 可得 N 与 l0 构成的三角形的各顶点编号为 m0-l0, m1-l0, m1-l1
 *          - 可得 N 与 l1 构成的三角形的各顶点编号为 m0-l1, m1-l1, m1-l2
 *          - 可得 N 与 l2 构成的三角形的各顶点编号为 m0-l2, m1-l2, m1-l3
 *          - 可得 N 与 l(last) 构成的三角形的各顶点编号为 m0-l(last), m1-l(last), m1-l0
 *      - 按照与北极点各三角形编号的构建规律构建南极点各三角形的各顶点编号
 *      - 拆分中间部分的各球面矩形为两个球面三角形, 编号顺序保持 WebGL 正面三角形顺序
 *              0 --------- 3
 *                |       |
 *                |       |
 *                |       |
 *              1 --------- 2
 *              三角形 A: 0-1-2
 *              三角形 B: 0-2-3
 *          - 可得由 m1 & m2 & l0 & l1 构成的球面矩形所对应的两个三角形顶点为
 *              - 三角形 A 的各顶点编号为 m1-l0, m2-l0, m2-l1
 *              - 三角形 B 的各顶点编号为 m1-l0, m2-l1, m1-l1
 *          - 可得由 m1 & m2 & l1 & l2 构成的球面矩形所对应的两个三角形顶点为
 *              - 三角形 A 的各顶点编号为 m1-l1, m2-l1, m2-l2
 *              - 三角形 B 的各顶点编号为 m1-l1, m2-l2, m1-l2
 *          - 可得由 m1 & m2 & l2 & l3 构成的球面矩形所对应的两个三角形顶点为
 *              - 三角形 A 的各顶点编号为 m1-l2, m2-l2, m2-l3
 *              - 三角形 B 的各顶点编号为 m1-l2, m2-l3, m1-l3
 *          - 可得由 m1 & m2 & l(last) & l0 构成的球面矩形所对应的两个三角形顶点为
 *              - 三角形 A 的各顶点编号为 m1-l(last), m2-l(last), m2-l0
 *              - 三角形 B 的各顶点编号为 m1-l(last), m2-l(last), m1-l0
 *      - 通过 m(i) 与 l(j) 的编号规则, 计算出任意顶点(经纬线交叉点)对应的坐标组合起始数值在 ORIGIN_POSITIONS 中的索引位置
 *      - 为顶点填充颜色数据
 *      - 生成顶点坐标数据 VERTEXT_POSITIONS
 *
 * @description 生成球体顶点数据
 * @function CreateModelDatas
 * @param {number} radius 球体半径
 * @param {number} meridianCount 球体经线半圆个数
 * @param {number} latitudeCount 球体纬线圆个数(包含两个极点)
 * @return {object}
 */
function createShereDatas(radius, meridianCount = 4, latitudeCount = 4, colorSetting = {}, offsetX = 0, offsetY = 0, offsetZ = 0) {
	const defaultColorSetting = {
		redRange: [50, 200],
		greenRange: [50, 200],
		blueRange: [50, 200],
		alphaRange: [1, 1],
	}
	const iColorSetting = { ...defaultColorSetting, ...colorSetting }
	const calcStartIndex = (i, j, jLen) => {
		return i * jLen * 3 + j * 3
	}
	const meridianCountNum = Math.max(2, meridianCount)
	const latitudeCountNum = Math.max(3, latitudeCount)
	/**
	 * divideCountsMeridian
	 * 		球体经线半圆被分割出的份数: latitudeCount - 1
	 * divideCountsLatitude
	 * 		球体纬线圈被分割出的份数: meridianCount
	 */
	const divideCountsMeridian = latitudeCountNum - 1
	const divideCountsLatitude = meridianCountNum
	/**
	 * 生成球体原始顶点坐标数据 originalPositions
	 * 		遍历纬线圈个数: 遍历经线半圆个数
	 */
	/**
	 * 将经线半圆分割后, 每份对应的弧度
	 */
	const radianEachDivideCountMeridian = Math.PI / divideCountsMeridian
	/**
	 * 将纬线圈分割后, 每份对应的弧度
	 */
	const radianEachDivideCountLatitude = (Math.PI * 2) / divideCountsLatitude
	const originalPositionsSequence = {}
	const originalPositions = []
	const originalNormals = []
	/**
	 * 记球心为 O, 并以 O 为原点, Z 轴向后, Y 轴向上, X 轴向右, 建立 OXYZ 三位坐标轴
	 * 记经纬线任意交叉点为 P(ij), 记球体南北极连线 L(NS)
	 * 记球心与经纬线任意交叉点 P(ij) 的连线为 L(ij)
	 */
	for (let i = 0; i < latitudeCountNum; i++) {
		/**
		 * 计算经线半圆的每个分割点在 Y 轴上的坐标
		 *      由于纬线圈所在的平面始终垂直于 L(NS), 因此 L(ij) 在 L(NS) 上的投影线段 L(ij-Y) 的终点坐标即为 COORDINATE_Y
		 *      由于 L(ij) 的长度为球体半径 RADIUS, L(ij) 与 Y 轴正向的夹角即为 RADIAN_EACH_DIVIDE_COUNT_MERIDIAN * i
		 *      即可求 L(ij-Y) 的长度为 LENG{L(ij-Y)} = Math.cos(RADIAN_EACH_DIVIDE_COUNT_MERIDIAN * i), 也即 COORDINATE_Y 的值
		 */
		const tmpY = Math.cos(radianEachDivideCountMeridian * i)
		const coordinateY = Ven$Math.calcAbsoluteValue(radius * tmpY) + offsetY
		for (let j = 0; j < meridianCountNum; j++) {
			/**
			 * 计算纬线圈的每个分割点在 Z 轴上的坐标
			 *      记 L(ij) 在 YOZ 平面上的投影线段为 L(ij-XOZ)
			 *      由于 L(ij) 的长度为球体半径 RADIUS, L(ij) 与 Y 轴正向的夹角即为 RADIAN_EACH_DIVIDE_COUNT_MERIDIAN * i
			 *      即可求 L(ij-XOZ) 的长度为 LENG{L(ij-XOZ)} = RADIUS * Math.sin(RADIAN_EACH_DIVIDE_COUNT_MERIDIAN * i)
			 *      由于 L(ij-XOZ) 与 Z 轴负向的夹角为 RADIAN_EACH_DIVIDE_COUNT_LATITUDE * j
			 *      记 L(ij-XOZ) 在 Z 轴上的投影为 L(ij-XOZ-Z)
			 *      即可求得 L(ij-XOZ-Z) 的长度为 LENG{L(ij-XOZ-Z)} = LENG{L(ij-XOZ)} * Math.cos(RADIAN_EACH_DIVIDE_COUNT_LATITUDE * j), 也即 COORDINATE_Z 的值
			 *      由于上述中的 L(ij-XOZ-Z) 此时在 Z 轴负向上, 需要对 COORDINATE_Z 取反
			 */
			/**
			 * 计算纬线圈的每个分割点在 X 轴上的坐标
			 *      类似同上
			 */
			const tmpX = Math.sin(radianEachDivideCountMeridian * i) * Math.sin(radianEachDivideCountLatitude * j)
			const tmpZ = Math.sin(radianEachDivideCountMeridian * i) * Math.cos(radianEachDivideCountLatitude * j)
			const coordinateX = Ven$Math.calcAbsoluteValue(radius * tmpX) + offsetX
			const coordinateZ = Ven$Math.calcAbsoluteValue(radius * tmpZ) + offsetZ
			originalPositions.push(coordinateX, coordinateY, coordinateZ)
			originalNormals.push(tmpX, tmpY, tmpZ)
			originalPositionsSequence[`${i * 4 + j}#:${i}-${j}`] = {
				x: coordinateX,
				y: coordinateY,
				z: coordinateZ,
				_arrIndexStart: originalPositions.length - 3,
			}
		}
	}
	const vertexFeatureSequence = {}
	const vertexFeature = []
	const vertexNormals = []
	const vertexCoordinate = []
	for (let i = 0; i < latitudeCountNum; i++) {
		for (let j = 0; j < meridianCountNum; j++) {
			if (i === 0) {
				const color = ven$randomRangeColor(
					[...iColorSetting.redRange],
					[...iColorSetting.greenRange],
					[...iColorSetting.blueRange],
					[...iColorSetting.alphaRange]
				)
				const xi = i
				const xj = j
				const yi = i + 1
				const yj = j
				const zi = i + 1
				const zj = j + 1 >= meridianCountNum ? 0 : j + 1
				const startX = calcStartIndex(xi, xj, meridianCountNum)
				vertexFeature.push(originalPositions[startX], originalPositions[startX + 1], originalPositions[startX + 2])
				vertexFeature.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				vertexNormals.push(originalPositions[startX], originalPositions[startX + 1], originalPositions[startX + 2])
				const startY = calcStartIndex(yi, yj, meridianCountNum)
				vertexFeature.push(originalPositions[startY], originalPositions[startY + 1], originalPositions[startY + 2])
				vertexFeature.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				vertexNormals.push(originalPositions[startY], originalPositions[startY + 1], originalPositions[startY + 2])
				const startZ = calcStartIndex(zi, zj, meridianCountNum)
				vertexFeature.push(originalPositions[startZ], originalPositions[startZ + 1], originalPositions[startZ + 2])
				vertexFeature.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				vertexNormals.push(originalPositions[startZ], originalPositions[startZ + 1], originalPositions[startZ + 2])
				continue
			}
			if (i === latitudeCountNum - 1) {
				const color = ven$randomRangeColor(
					[...iColorSetting.redRange],
					[...iColorSetting.greenRange],
					[...iColorSetting.blueRange],
					[...iColorSetting.alphaRange]
				)
				const xi = i - 1
				const xj = j
				const yi = i
				const yj = j
				const zi = i - 1
				const zj = j + 1 >= meridianCountNum ? 0 : j + 1
				const startX = calcStartIndex(xi, xj, meridianCountNum)
				vertexFeature.push(originalPositions[startX], originalPositions[startX + 1], originalPositions[startX + 2])
				vertexFeature.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				vertexNormals.push(originalPositions[startX], originalPositions[startX + 1], originalPositions[startX + 2])
				const startY = calcStartIndex(yi, yj, meridianCountNum)
				vertexFeature.push(originalPositions[startY], originalPositions[startY + 1], originalPositions[startY + 2])
				vertexFeature.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				vertexNormals.push(originalPositions[startY], originalPositions[startY + 1], originalPositions[startY + 2])
				const startZ = calcStartIndex(zi, zj, meridianCountNum)
				vertexFeature.push(originalPositions[startZ], originalPositions[startZ + 1], originalPositions[startZ + 2])
				vertexFeature.push(color.r / 255, color.g / 255, color.b / 255, color.a)
				vertexNormals.push(originalPositions[startZ], originalPositions[startZ + 1], originalPositions[startZ + 2])
				continue
			}
			const colorA = ven$randomRangeColor(
				[...iColorSetting.redRange],
				[...iColorSetting.greenRange],
				[...iColorSetting.blueRange],
				[...iColorSetting.alphaRange]
			)
			const axi = i
			const axj = j
			const ayi = i + 1
			const ayj = j
			const azi = i + 1
			const azj = j + 1 >= meridianCountNum ? 0 : j + 1
			const aStartX = calcStartIndex(axi, axj, meridianCountNum)
			vertexFeature.push(originalPositions[aStartX], originalPositions[aStartX + 1], originalPositions[aStartX + 2])
			vertexFeature.push(colorA.r / 255, colorA.g / 255, colorA.b / 255, colorA.a)
			vertexNormals.push(originalPositions[aStartX], originalPositions[aStartX + 1], originalPositions[aStartX + 2])
			const aStartY = calcStartIndex(ayi, ayj, meridianCountNum)
			vertexFeature.push(originalPositions[aStartY], originalPositions[aStartY + 1], originalPositions[aStartY + 2])
			vertexFeature.push(colorA.r / 255, colorA.g / 255, colorA.b / 255, colorA.a)
			vertexNormals.push(originalPositions[aStartY], originalPositions[aStartY + 1], originalPositions[aStartY + 2])
			const aStartZ = calcStartIndex(azi, azj, meridianCountNum)
			vertexFeature.push(originalPositions[aStartZ], originalPositions[aStartZ + 1], originalPositions[aStartZ + 2])
			vertexFeature.push(colorA.r / 255, colorA.g / 255, colorA.b / 255, colorA.a)
			vertexNormals.push(originalPositions[aStartZ], originalPositions[aStartZ + 1], originalPositions[aStartZ + 2])
			const colorB = ven$randomRangeColor(
				[...iColorSetting.redRange],
				[...iColorSetting.greenRange],
				[...iColorSetting.blueRange],
				[...iColorSetting.alphaRange]
			)
			const bxi = i
			const bxj = j
			const byi = i + 1
			const byj = j + 1 >= meridianCountNum ? 0 : j + 1
			const bzi = i
			const bzj = j + 1 >= meridianCountNum ? 0 : j + 1
			const bStartX = calcStartIndex(bxi, bxj, meridianCountNum)
			vertexFeature.push(originalPositions[bStartX], originalPositions[bStartX + 1], originalPositions[bStartX + 2])
			vertexFeature.push(colorB.r / 255, colorB.g / 255, colorB.b / 255, colorB.a)
			vertexNormals.push(originalPositions[bStartX], originalPositions[bStartX + 1], originalPositions[bStartX + 2])
			const bStartY = calcStartIndex(byi, byj, meridianCountNum)
			vertexFeature.push(originalPositions[bStartY], originalPositions[bStartY + 1], originalPositions[bStartY + 2])
			vertexFeature.push(colorB.r / 255, colorB.g / 255, colorB.b / 255, colorB.a)
			vertexNormals.push(originalPositions[bStartY], originalPositions[bStartY + 1], originalPositions[bStartY + 2])
			const bStartZ = calcStartIndex(bzi, bzj, meridianCountNum)
			vertexFeature.push(originalPositions[bStartZ], originalPositions[bStartZ + 1], originalPositions[bStartZ + 2])
			vertexFeature.push(colorB.r / 255, colorB.g / 255, colorB.b / 255, colorB.a)
			vertexNormals.push(originalPositions[bStartZ], originalPositions[bStartZ + 1], originalPositions[bStartZ + 2])
		}
	}
	return {
		vertexFeature: new Float32Array(vertexFeature),
		vertexFeatureSequence,
		vertexNormals: new Float32Array(vertexNormals),
		vertexCoordinate: new Float32Array(vertexCoordinate),
		originCenter: {
			x: offsetX,
			y: offsetY,
			z: offsetZ,
		},
		originalPositions,
		originalPositionsSequence,
		originalNormals: new Float32Array(originalNormals),
	}
}
