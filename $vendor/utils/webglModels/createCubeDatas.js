/**
 * 通过经纬线方式生成方体原始顶点坐标数据 ORIGIN_POSITIONS
 * 读取预先定义的方体各顶点的实际编号, 从原始顶点坐标数据 ORIGIN_POSITIONS 中匹配实际的空间顶点坐标
 * 生成适用于 WebGL 渲染的顶点坐标数据 VERTEXT_POSITIONS
 *
 * - 生成方体原始顶点坐标数据 ORIGIN_POSITIONS
 * 		- 类比球体, 将方体水平方向的棱看做球体纬线圈, 将方体垂直方向的棱看做经线半圆
 * 		- 建立第 1 层循环, 遍历纬线圈个数, 计算顶点原始坐标 Y 轴分量的值 COORDINATE_Y
 * 		- 建立第 2 层循环, 遍历经线半圆个数, 计算顶点原始坐标 X 轴分量的值 COORDINATE_X 和 Z 轴分量的值 COORDINATE_Z
 * 		- 生成原始顶点坐标数据 ORIGIN_POSITIONS
 * 		- 此时, ORIGIN_POSITIONS 将包含 8 份顶点坐标数据
 * - 对方体顶点进行编号
 * 		- 将方体水平放置于某个水平平面 Z, 贴近平面 Z 的方体面记作 A0(底面)
 * 			4 --------- 5
 * 			  |       |
 * 			  |       |
 *            |       |
 * 			0 --------- 1
 * 		- 记底面左外顶点为 0, 底面右外顶点为 1, 底面右内顶点为 2, 底面左内顶点为 3
 * 		- 记顶面左外顶点为 4, 顶面右外顶点为 5, 顶面右内顶点为 6, 顶面左内顶点为 7
 * 			 v7----- v6
 * 		 	/|      /|
 * 		   v4------v5|
 * 		   | |     | |
 * 		   | |v3---|-|v2
 * 		   |/      |/
 * 	       v0------v1
 * - 定义方体六面的三角形顶点索引 CUBE_FACE_INDICES
 * 		- 由于采用 gl.drawArrays: gl.TRIANGLES 方式绘制, 需要将方体每个面拆分成三角形
 * 		- 以面 A0(底面) 为例, 按照正面三角形顶点顺序, 可将其拆分成 [0, 3, 2] 和 [0, 2, 1] 两组顶点索引
 * 		- 求前面(0-1-5-4)的顶点索引组成
 * 				- 将 A0(底面) 围绕 X 轴旋转到该面所在的方位, 按照 A0(底面) 的构建规则构建定点索引 [[4, 0, 1] 和 [4, 1, 5]
 * 		- 依次构建其他面的三角形顶点索引
 * 		- 即生成: 定义构成每个方体面的两个三角形的 2 * 3 = 6 份顶点坐标在原始顶点坐标数据 ORIGIN_POSITIONS 中的索引 CUBE_FACE_INDICES
 * 		- 此时, 每个方体面将包含 2 * 3 = 6 份顶点数据, 方体总体将由 6 * 6 = 36 份顶点坐标
 * - 生成绘制三角形顶点坐标数据 VERTEXT_POSITIONS
 * 		- 遍历方体六面的三角形顶点索引 CUBE_FACE_INDICES, 依据顶点索引, 读取 ORIGIN_POSITIONS
 * 		- 为顶点填充颜色数据
 * 		- 生成顶点坐标数据 VERTEXT_POSITIONS
 *
 * @description 生成方体顶点数据
 * @function createCubeDatas
 * @param {number} width 方体长度
 * @param {number} height 方体高度
 * @param {number} depth 方体纵深
 * @return {object}
 */
function createCubeDatas(width, height, depth, colorSetting = {}, offsetX = 0, offsetY = 0, offsetZ = 0) {
	const defaultColorSetting = {
		up: [255, 0, 0, 1], // 红色
		bottom: [0, 255, 0, 1], // 绿色
		front: [0, 0, 255, 1], // 蓝色
		back: [255, 255, 0, 1], // 黄色
		right: [0, 255, 255, 1], // 青色
		left: [255, 0, 255, 1], // 粉色
	}
	const iColorSetting = { ...defaultColorSetting, ...colorSetting }
	const CUBE_FACE_COLOR = Object.values(iColorSetting)
	/**
	 * 生成方体原始顶点坐标数据 originalPositions
	 * 		遍历纬线圈个数: 遍历经线半圆个数
	 */
	const halfX = width / 2
	const halfY = height / 2
	const halfZ = depth / 2
	const originalPositionsSequence = {}
	const originalPositions = []
	for (let i = 0; i < 2; i++) {
		/**
		 * 计算经线半圆的每个分割点在 Y 轴上的坐标
		 */
		const coordinateY = (i <= 0 ? -halfY : halfY) + offsetY
		for (let j = 0; j < 4; j++) {
			/**
			 * 计算纬线圆的每个分割点在 X 轴和 Z 轴上的坐标
			 */
			const coordinateX = (j === 0 || j === 3 ? -halfX : halfX) + offsetX
			const coordinateZ = (j <= 1 ? halfZ : -halfZ) + offsetZ
			originalPositions.push(coordinateX, coordinateY, coordinateZ)
			originalPositionsSequence[`${i * 4 + j}#:${i}-${j}`] = {
				x: coordinateX,
				y: coordinateY,
				z: coordinateZ,
				_arrIndexStart: originalPositions.length - 3,
			}
		}
	}
	/**
	 * 定义构成每个方体面的两个三角形的 2 * 3 = 6 份顶点坐标在原始顶点坐标数据 originalPositions 中的索引
	 */
	const CUBE_FACE_INDICES = [
		[0, 3, 2, 0, 2, 1], // 底面
		[7, 4, 5, 7, 5, 6], // 顶面
		/* ... */
		[4, 0, 1, 4, 1, 5], // 前面
		[3, 7, 6, 3, 6, 2], // 后面
		/* ... */
		[1, 2, 6, 1, 6, 5], // 右面
		[4, 7, 3, 4, 3, 0], // 左面
	]
	/**
	 * 遍历 6 个面: 遍历构成每个面的 2 * 3 = 6 份顶点索引
	 * 逐一生成 6 * 6 = 36 份顶点数据, 写入 vertexFeature
	 */
	const vertexFeatureSequence = {}
	const vertexFeature = []
	const vertexNormals = []
	const vertexCoordinate = []
	for (let i = 0; i < CUBE_FACE_INDICES.length; i++) {
		const faceIndices = CUBE_FACE_INDICES[i]
		// const color = ven$randomColor()
		const color = { r: CUBE_FACE_COLOR[i][0], g: CUBE_FACE_COLOR[i][1], b: CUBE_FACE_COLOR[i][2], a: CUBE_FACE_COLOR[i][3] }
		for (let j = 0; j < faceIndices.length; j++) {
			const pointIndex = faceIndices[j]
			/**
			 * 单个顶点的完整描述数据
			 */
			vertexFeature.push(originalPositions[pointIndex * 3], originalPositions[pointIndex * 3 + 1], originalPositions[pointIndex * 3 + 2])
			vertexFeature.push(color.r / 255, color.g / 255, color.b / 255, color.a)
			/* ... */
			vertexFeatureSequence[`${i * faceIndices.length + j}#:${i}-${parseInt((j + 0) / 3)}-${parseInt((j + 0) % 3)}`] = {
				x: originalPositions[pointIndex * 3],
				y: originalPositions[pointIndex * 3 + 1],
				z: originalPositions[pointIndex * 3 + 2],
				r: color.r / 255,
				g: color.g / 255,
				b: color.b / 255,
				a: color.a,
				_arrIndexStart: vertexFeature.length - 3,
			}
		}
		vertexCoordinate.push(0, 0, 0, 1, 1, 1)
		vertexCoordinate.push(0, 0, 1, 1, 1, 0)
	}
	// prettier-ignore
	const CUBE_NORMALS = [
		/**
		 * 底面
		 */
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		/**
		 * 顶面
		 */
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		/**
		 * 前面
		 */
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		/**
		 * 后面
		 */
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		/**
		 * 右面
		 */
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		/**
		 * 左面
		 */
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
	]
	for (let i = 0; i < CUBE_NORMALS.length; i++) {
		vertexNormals.push(CUBE_NORMALS[i])
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
	}
}
