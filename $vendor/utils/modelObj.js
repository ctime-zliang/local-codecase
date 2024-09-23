;(function () {
	'use strict'

	const STRING_TAG_T = `\t`
	const STRING_TAG_BLANK = ` `
	const STRING_TAG_LEFT_BRACKETS = `(`
	const STRING_TAG_RIGHT_BRACKETS = `)`
	const STRING_TAG_QUOT = `"`

	/****************************************************************************************************/
	/****************************************************************************************************/

	/**
	 * 获取两个相邻分隔符之间的内容字符串的长度
	 */
	function getContentWordLength(str, start) {
		let idx = 0
		for (idx = start; idx < str.length; idx++) {
			const c = str.charAt(idx)
			if (
				c === STRING_TAG_T ||
				c === STRING_TAG_BLANK ||
				c === STRING_TAG_LEFT_BRACKETS ||
				c === STRING_TAG_RIGHT_BRACKETS ||
				c === STRING_TAG_QUOT
			) {
				break
			}
		}
		return idx - start
	}

	/**
	 * 计算三个坐标点组成的平面的法向量
	 */
	function calcNormal(p0, p1, p2) {
		const v0 = []
		const v1 = []
		for (let i = 0; i < 3; i++) {
			v0[i] = p0[i] - p1[i]
			v1[i] = p2[i] - p1[i]
		}
		const c = []
		c[0] = v0[1] * v1[2] - v0[2] * v1[1]
		c[1] = v0[2] * v1[0] - v0[0] * v1[2]
		c[2] = v0[0] * v1[1] - v0[1] * v1[0]
		const v = new Vector3(c[0], c[1], c[2])
		v.normalize()
		return [v.x, v.y, v.z]
	}

	/****************************************************************************************************/
	/****************************************************************************************************/

	class Vector3 {
		constructor(x = 0, y = 0, z = 0) {
			this._x = x
			this._y = y
			this._z = z
		}

		get x() {
			return this._x
		}
		set x(value) {
			this._x = value
		}

		get y() {
			return this._y
		}
		set y(value) {
			this._y = value
		}

		get z() {
			return this._z
		}
		set z(value) {
			this._z = value
		}

		get length() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
		}

		normalize() {
			if (this.x === 0 && this.y === 0 && this.z === 0) {
				return new Vector3(0, 0, 0)
			}
			const sx = this.x / this.length
			const sy = this.y / this.length
			const sz = this.z / this.length
			return new Vector3(sx, sy, sz)
		}
	}

	class StringParser {
		constructor(str) {
			this._str = str
			this._index = 0
		}

		get str() {
			return this._str
		}
		set str(value) {
			this._str = value
		}

		get index() {
			return this._index
		}
		set index(value) {
			this._index = value
		}

		reset(str) {
			this._str = str
			this._index = 0
		}

		skipToNextWord() {
			this._skipDelimiters()
			const len = getContentWordLength(this.str, this.index)
			this.index += len + 1
		}

		getWord() {
			this._skipDelimiters()
			const len = getContentWordLength(this.str, this.index)
			if (len === 0) {
				return null
			}
			const word = this.str.substr(this.index, len)
			this.index += len + 1
			return word
		}

		getIntTranslatedWord() {
			return parseInt(this.getWord())
		}

		getFloatTranslatedWord() {
			return parseFloat(this.getWord())
		}

		_skipDelimiters() {
			let idx = this.index
			for (; idx < this.str.length; idx++) {
				const c = this.str.charAt(idx)
				if (
					c === STRING_TAG_T ||
					c === STRING_TAG_BLANK ||
					c === STRING_TAG_LEFT_BRACKETS ||
					c === STRING_TAG_RIGHT_BRACKETS ||
					c === STRING_TAG_QUOT
				) {
					continue
				}
				break
			}
			this.index = idx
		}
	}

	class DrawingInfo {
		constructor(vertices, normals, colors, indices) {
			this._vertices = vertices
			this._normals = normals
			this._colors = colors
			this._indices = indices
		}

		get vertices() {
			return this._vertices
		}
		set vertices(value) {
			this._vertices = value
		}

		get normals() {
			return this._normals
		}
		set normals(value) {
			this._normals = value
		}

		get colors() {
			return this._colors
		}
		set colors(value) {
			this._colors = value
		}

		get indices() {
			return this._indices
		}
		set indices(value) {
			this._indices = value
		}
	}

	class OBJObject {
		constructor(name) {
			this._name = name
			this._faces = []
			this._numIndices = 0
		}

		get name() {
			return this._name
		}
		set name(value) {
			this._name = value
		}

		get faces() {
			return this._faces
		}
		set faces(value) {
			this._faces = value
		}

		get numIndices() {
			return this._numIndices
		}
		set numIndices(value) {
			this._numIndices = value
		}

		addFace(face) {
			this.faces.push(face)
			this.numIndices += face.numIndices
		}
	}

	class Color {
		constructor(r, g, b, a) {
			this._r = r
			this._g = g
			this._b = b
			this._a = a
		}

		get r() {
			return this._r
		}
		set r(value) {
			this._r = value
		}

		get g() {
			return this._g
		}
		set g(value) {
			this._g = value
		}

		get b() {
			return this._b
		}
		set b(value) {
			this._b = value
		}

		get a() {
			return this._a
		}
		set a(value) {
			this._a = value
		}
	}

	class Normal {
		constructor(x, y, z) {
			this._x = x
			this._y = y
			this._z = z
		}

		get x() {
			return this._x
		}
		set x(value) {
			this._x = value
		}

		get y() {
			return this._y
		}
		set y(value) {
			this._y = value
		}

		get z() {
			return this._z
		}
		set z(value) {
			this._z = value
		}
	}

	class Vertex {
		constructor(x, y, z) {
			this._x = x
			this._y = y
			this._z = z
		}

		get x() {
			return this._x
		}
		set x(value) {
			this._x = value
		}

		get y() {
			return this._y
		}
		set y(value) {
			this._y = value
		}

		get z() {
			return this._z
		}
		set z(value) {
			this._z = value
		}
	}

	class Face {
		constructor(materialName) {
			this._materialName = materialName
			if (materialName === null) {
				this._materialName = ''
			}
			this._vIndices = []
			this._nIndices = []
			this._normal = null
			this._numIndices = 0
		}

		get materialName() {
			return this._materialName
		}
		set materialName(value) {
			this._materialName = value
		}

		get vIndices() {
			return this._vIndices
		}
		set vIndices(value) {
			this._vIndices = value
		}

		get nIndices() {
			return this._nIndices
		}
		set nIndices(value) {
			this._nIndices = value
		}

		get normal() {
			return this._normal
		}
		set normal(value) {
			this._normal = value
		}

		get numIndices() {
			return this._numIndices
		}
		set numIndices(value) {
			this._numIndices = value
		}
	}

	class Material {
		constructor(name, r, g, b, a) {
			this._name = name
			this._color = new Color(r, g, b, a)
		}

		get name() {
			return this._name
		}
		set name(value) {
			this._name = value
		}

		get color() {
			return this._color
		}
		set color(value) {
			this._color = value
		}
	}

	class MTLDoc {
		constructor() {
			this._complete = false
			this._materials = []
		}

		get complete() {
			return this._complete
		}
		set complete(value) {
			this._complete = value
		}

		get materials() {
			return this._materials
		}
		set materials(value) {
			this._materials = value
		}

		parseNewMTL(sp) {
			return sp.getWord()
		}

		parseRGB(sp, name) {
			const r = sp.getFloatTranslatedWord()
			const g = sp.getFloatTranslatedWord()
			const b = sp.getFloatTranslatedWord()
			return new Material(name, r, g, b, 1)
		}
	}

	class OBJDoc {
		constructor(objFilePath) {
			this._objFilePath = objFilePath
			this._mtls = []
			this._objects = []
			this._vertices = []
			this._normals = []
		}

		get objFilePath() {
			return this._objFilePath
		}
		set objFilePath(value) {
			this._objFilePath = value
		}

		get mtls() {
			return this._mtls
		}
		set mtls(value) {
			this._mtls = value
		}

		get objects() {
			return this._objects
		}
		set objects(value) {
			this._objects = value
		}

		get vertices() {
			return this._vertices
		}
		set vertices(value) {
			this._vertices = value
		}

		get normals() {
			return this._normals
		}
		set normals(value) {
			this._normals = value
		}

		parse(fileString, scale, reverse) {
			const self = this
			const lines = fileString.split('\n')
			lines.push(null)
			const sp = new StringParser()
			let index = 0
			let currentObject = null
			let currentMaterialName = ''
			let line = undefined
			while ((line = lines[index++]) != null) {
				sp.reset(line)
				const command = sp.getWord()
				if (command === null) {
					continue
				}
				switch (command) {
					case '#': {
						continue
					}
					/**
					 * 解析模型材质
					 * 		加载材质文件
					 */
					case 'mtllib': {
						const path = this._parseMtllib(sp, this.objFilePath)
						const mtl = new MTLDoc()
						this.mtls.push(mtl)
						const xhr = new XMLHttpRequest()
						xhr.onreadystatechange = function () {
							if (xhr.readyState === 4) {
								if (xhr.status != 404) {
									self._readMTLFile(xhr.responseText, mtl)
								} else {
									mtl.complete = true
								}
							}
						}
						xhr.open('GET', path, true)
						xhr.send()
						continue
					}
					/**
					 * 解析模型名称
					 */
					case 'o':
					case 'g': {
						const object = this._parseObjectName(sp)
						this.objects.push(object)
						currentObject = object
						continue
					}
					/**
					 * 解析模型顶点
					 */
					case 'v': {
						const vertex = this._parseVertex(sp, scale)
						this.vertices.push(vertex)
						continue
					}
					case 'vn': {
						const normal = this._parseNormal(sp)
						this.normals.push(normal)
						continue
					}
					/**
					 * 解析使用材质标记信息
					 */
					case 'usemtl': {
						currentMaterialName = this._parseUseMTL(sp)
						continue
					}
					/**
					 * 解析模型表面
					 */
					case 'f': {
						const face = this._parseFace(sp, currentMaterialName, this.vertices, reverse)
						currentObject.addFace(face)
						continue
					}
				}
			}
			return true
		}

		getDrawingInfo() {
			/**
			 * 计算顶点索引的总个数
			 */
			let numIndices = 0
			for (let i = 0; i < this.objects.length; i++) {
				numIndices += this.objects[i].numIndices
			}
			const vertices = new Array(numIndices * 3)
			const normals = new Array(numIndices * 3)
			const colors = new Array(numIndices * 4)
			const indices = new Array(numIndices)
			/**
			 * 遍历模型个数 this.objects
			 * 		遍历每个模型的所有表面
			 * 			遍历每个表面的所有顶点
			 * 				- 尝试通过当前表面绑定的材质名称从材质列表中匹配颜色数据
			 * 				- 解析并填充顶点/法线/颜色/索引
			 */
			let indexIndices = 0
			for (let i = 0; i < this.objects.length; i++) {
				const object = this.objects[i]
				for (let j = 0; j < object.faces.length; j++) {
					const face = object.faces[j]
					const color = this._findColor(face.materialName)
					for (let k = 0; k < face.vIndices.length; k++) {
						indices[indexIndices] = indexIndices
						const vertex = this.vertices[face.vIndices[k]]
						vertices[indexIndices * 3 + 0] = vertex.x
						vertices[indexIndices * 3 + 1] = vertex.y
						vertices[indexIndices * 3 + 2] = vertex.z
						colors[indexIndices * 4 + 0] = color.r
						colors[indexIndices * 4 + 1] = color.g
						colors[indexIndices * 4 + 2] = color.b
						colors[indexIndices * 4 + 3] = color.a
						let nIdx = face.nIndices[k]
						if (nIdx >= 0) {
							let normal = this.normals[nIdx]
							normals[indexIndices * 3 + 0] = normal.x
							normals[indexIndices * 3 + 1] = normal.y
							normals[indexIndices * 3 + 2] = normal.z
						} else {
							normals[indexIndices * 3 + 0] = face.normal.x
							normals[indexIndices * 3 + 1] = face.normal.y
							normals[indexIndices * 3 + 2] = face.normal.z
						}
						indexIndices++
					}
				}
			}
			return new DrawingInfo(new Float32Array(vertices), new Float32Array(normals), new Float32Array(colors), new Uint16Array(indices))
		}

		_readMTLFile(fileString, mtl) {
			let lines = fileString.split('\n')
			lines.push(null)
			let index = 0
			let line = undefined
			let name = ''
			let sp = new StringParser()
			while ((line = lines[index++]) != null) {
				sp.reset(line)
				let command = sp.getWord()
				if (command === null) {
					continue
				}
				switch (command) {
					case '#': {
						continue
					}
					case 'newmtl': {
						name = mtl.parseNewMTL(sp)
						continue
					}
					case 'Kd': {
						if (name === '') {
							continue
						}
						let material = mtl.parseRGB(sp, name)
						mtl.materials.push(material)
						name = ''
						continue
					}
				}
			}
			mtl.complete = true
		}

		_parseMtllib(sp, objFilePath) {
			const idx = objFilePath.lastIndexOf('/')
			let dirPath = ''
			if (idx > 0) {
				dirPath = objFilePath.substr(0, idx + 1)
			}
			return dirPath + sp.getWord()
		}

		_parseObjectName(sp) {
			return new OBJObject(sp.getWord())
		}

		_parseVertex(sp, scale) {
			const x = sp.getFloatTranslatedWord() * scale
			const y = sp.getFloatTranslatedWord() * scale
			const z = sp.getFloatTranslatedWord() * scale
			return new Vertex(x, y, z)
		}

		_parseNormal(sp) {
			const x = sp.getFloatTranslatedWord()
			const y = sp.getFloatTranslatedWord()
			const z = sp.getFloatTranslatedWord()
			return new Normal(x, y, z)
		}

		_parseUseMTL(sp) {
			return sp.getWord()
		}

		_parseFace(sp, materialName, vertices, reverse) {
			const face = new Face(materialName)
			/**
			 * 逐面解析并缓存各面所对应的顶点的索引
			 */
			for (;;) {
				const word = sp.getWord()
				if (word === null) {
					break
				}
				const subWords = word.split('/')
				if (subWords.length >= 1) {
					let vi = parseInt(subWords[0]) - 1
					face.vIndices.push(vi)
				}
				if (subWords.length >= 3) {
					const ni = parseInt(subWords[2]) - 1
					face.nIndices.push(ni)
				} else {
					face.nIndices.push(-1)
				}
			}
			const v0 = [vertices[face.vIndices[0]].x, vertices[face.vIndices[0]].y, vertices[face.vIndices[0]].z]
			const v1 = [vertices[face.vIndices[1]].x, vertices[face.vIndices[1]].y, vertices[face.vIndices[1]].z]
			const v2 = [vertices[face.vIndices[2]].x, vertices[face.vIndices[2]].y, vertices[face.vIndices[2]].z]
			let normal = calcNormal(v0, v1, v2)
			if (normal === null) {
				if (face.vIndices.length >= 4) {
					let v3 = [vertices[face.vIndices[3]].x, vertices[face.vIndices[3]].y, vertices[face.vIndices[3]].z]
					normal = calcNormal(v1, v2, v3)
				}
				if (normal === null) {
					normal = [0.0, 1.0, 0.0]
				}
			}
			if (reverse) {
				normal[0] = -normal[0]
				normal[1] = -normal[1]
				normal[2] = -normal[2]
			}
			face.normal = new Normal(normal[0], normal[1], normal[2])
			/**
			 * 将包含 3 个以上顶点索引的平面拆分成三角形
			 */
			if (face.vIndices.length > 3) {
				const n = face.vIndices.length - 2
				const newVIndices = new Array(n * 3)
				const newNIndices = new Array(n * 3)
				for (let i = 0; i < n; i++) {
					newVIndices[i * 3 + 0] = face.vIndices[0]
					newVIndices[i * 3 + 1] = face.vIndices[i + 1]
					newVIndices[i * 3 + 2] = face.vIndices[i + 2]
					newNIndices[i * 3 + 0] = face.nIndices[0]
					newNIndices[i * 3 + 1] = face.nIndices[i + 1]
					newNIndices[i * 3 + 2] = face.nIndices[i + 2]
				}
				face.vIndices = newVIndices
				face.nIndices = newNIndices
			}
			face.numIndices = face.vIndices.length
			return face
		}

		_isMTLComplete() {
			if (this.mtls.length === 0) {
				return true
			}
			for (let i = 0; i < this.mtls.length; i++) {
				if (!this.mtls[i].complete) {
					return false
				}
			}
			return true
		}

		_findColor(name) {
			for (let i = 0; i < this.mtls.length; i++) {
				for (let j = 0; j < this.mtls[i].materials.length; j++) {
					if (this.mtls[i].materials[j].name === name) {
						return this.mtls[i].materials[j].color
					}
				}
			}
			return new Color(0.8, 0.8, 0.8, 1)
		}
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	class modelObj {
		static version = '1.2.1'

		static generate(objFilePath) {
			return new OBJDoc(objFilePath)
		}
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = modelObj
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return modelObj
		})
	} else {
		;(function () {
			return this || (0, eval)('this')
		})().modelObj = modelObj
	}
})()
