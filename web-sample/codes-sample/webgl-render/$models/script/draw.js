function drawCanvas(containerElement) {
	const canvasElement = containerElement.querySelector('canvas')
	Program.glControl.gl = ven$initWebGLContext(canvasElement)
	Program.init(containerElement)

	/**
	 * WebGL 坐标系变换
	 * 		模型坐标系 (a_ObjPosition)
	 * 			| (模型变换 u_ModelMatrix)
	 * 		世界坐标系 (v_ObjPosition)
	 * 			| (视图变换 u_ViewMatrix)
	 * 		观察坐标系
	 * 			| (投影变换 u_ProjMatrix)
	 * 		裁剪坐标系
	 * 			| (透视除法)
	 * 		NDC 坐标系
	 * 			| (视口变换)
	 * 		屏幕坐标系
	 */
	/**
	 * 物体表面光反射
	 * 		在此光照模型(冯氏光照模型)中, 视点在可视范围内任意一点看到的物体表面反射的颜色和光强都是一样的
	 * 		因此物体反光亮度只取决于入射光所在直线与物体表面法线所在直线的夹角, 在向量维度来讲, 则是入射光反方向向量与物体表面法线向量的夹角 θ
	 * 			入射光垂直于物体表面照射时, 反光最亮
	 * 			入射光平行于物体表面时, 没有反光
	 * 		物体表面光反射颜色
	 * 			= 环境光反射颜色 + 光源漫反射颜色
	 *
	 * 环境光反射
	 * 		此处假设物体接收到的环境光入射光的方向和强度都是"均匀"的, 所以物体反射光的颜色和强度也都是"均匀"的
	 * 		环境光反射颜色
	 * 			= 入射光颜色 x 物体表面基底色
	 * 光源漫反射
	 * 		θ 即 表面法线向量与入射光反方向向量的夹角
	 * 		光源漫反射颜色
	 * 			= 入射光颜色 x 物体表面基底色 x cos(θ)
	 * 			= 入射光颜色 x 物体表面基底色 x (表面法线向量 {点乘} 入射光反方向向量)
	 */
	const COMMON_VERTEX_SHADER = `
		precision mediump float;
		varying vec4 v_Color;
		varying vec3 v_Normal;
		varying vec3 v_ObjPosition;
		varying float v_Dist;
		// 顶点配置(组)
		attribute vec3 a_ObjPosition;
		attribute vec4 a_Color;
		attribute vec3 a_Normal;
		// 变换矩阵(组)
		uniform mat4 u_NormalMatrix;
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		// 参数(组)
		uniform vec3 u_EyePosition;
		void main() {
			gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_ObjPosition, 1.0);
			// 计算顶点的世界坐标
			v_ObjPosition = vec3(u_ModelMatrix * vec4(a_ObjPosition, 1.0));
			// 根据法线变换矩阵更新法线坐标
			// 即计算法线的世界坐标
			v_Normal = vec3(u_NormalMatrix * vec4(a_Normal, 1.0));
			v_Color = a_Color;
			// 计算顶点(世界坐标系)到视点的距离
			// v_Dist = distance(u_ModelMatrix * vec4(a_ObjPosition, 1.0), vec4(u_EyePosition, 1.0));
			v_Dist = gl_Position.w;
		}
	`
	const COMMON_FRAGMENT_SHADER = `
		precision mediump float;
		varying vec4 v_Color;
		varying vec3 v_Normal;
		varying vec3 v_ObjPosition;
		varying float v_Dist;
		// 参数(组)
		uniform float u_lightIntensityGain;
		uniform float u_illuType;
		uniform bool u_Clicked;
		uniform vec3 u_FogColor;
		uniform vec2 u_FogDist;
		// 点光配置(组)
		uniform vec3 u_LightPosition;
		uniform vec3 u_LightDirection;
		uniform vec3 u_LightColor;
		uniform vec3 u_AmbientLightColor;
		void main() {
			if (u_Clicked) {
				gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
			} else {
				float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
				if (u_illuType == 1.0) {  // 平行光
					vec3 normal = normalize(v_Normal);
					// 对于平行光, 此处需要传入入射光反方向归一化向量
					vec3 lightDirection = u_LightDirection;
					// 计算入射光反方向归一化向量与法线的点积
					float nDotL = max(dot(lightDirection, normal), 0.0);
					// 计算漫反射光和环境光的色值
					vec3 diffuse = u_LightColor * v_Color.rgb * nDotL * u_lightIntensityGain;
					gl_FragColor = vec4(diffuse + u_AmbientLightColor * v_Color.rgb, v_Color.a);
					// vec3 ambientMixinColor = diffuse + u_AmbientLightColor * v_Color.rgb;
					// vec3 fogMixinColor = mix(u_FogColor, vec3(ambientMixinColor), fogFactor);
					// gl_FragColor = vec4(fogMixinColor, v_Color.a);
				} else {  // 点光
					vec3 normal = normalize(v_Normal);
					// 计算点光源相对于物体顶点(表面)的方向, 记作光线方向
					// 归一化此向量
					vec3 lightDirection = normalize(u_LightPosition - v_ObjPosition);
					// 计算入射光反方向归一化向量与法线的点积
					float nDotL = max(dot(lightDirection, normal), 0.0);
					// 计算漫反射光和环境光的色值
					vec3 diffuse = u_LightColor * v_Color.rgb * nDotL * u_lightIntensityGain;
					gl_FragColor = vec4(diffuse + u_AmbientLightColor * v_Color.rgb, v_Color.a);
					// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
					// vec3 ambientMixinColor = diffuse + u_AmbientLightColor * v_Color.rgb;
					// vec3 fogMixinColor = mix(u_FogColor, vec3(ambientMixinColor), fogFactor);
					// gl_FragColor = vec4(fogMixinColor, v_Color.a);
				}
			}
		}
	`

	Program.glControl.gl.clearColor(Program.profile.clearColor.r / 255, Program.profile.clearColor.g / 255, Program.profile.clearColor.b / 255, 1.0)
	Program.glControl.gl.clear(Program.glControl.gl.COLOR_BUFFER_BIT | Program.glControl.gl.DEPTH_BUFFER_BIT)
	Program.glControl.gl.enable(Program.glControl.gl.BLEND)
	Program.glControl.gl.enable(Program.glControl.gl.CULL_FACE)
	Program.glControl.gl.enable(Program.glControl.gl.DEPTH_TEST)
	Program.glControl.gl.enable(Program.glControl.gl.POLYGON_OFFSET_FILL)
	Program.glControl.gl.polygonOffset(1.0, 1.0)
	// Program.glControl.gl.blendFunc(Program.glControl.gl.SRC_ALPHA, Program.glControl.gl.ONE_MINUS_SRC_ALPHA)

	Program.glControl.commonLight = {
		glAttributes: {},
		glUniforms: {},
		program: null,
	}
	Program.glControl.commonLight.program = ven$createProgram(Program.glControl.gl, COMMON_VERTEX_SHADER, COMMON_FRAGMENT_SHADER)
	const commonWebGLVariableLocation = ven$getWebGLVariableLocation(Program.glControl.gl, Program.glControl.commonLight.program, {
		glAttributes: ['a_Normal', 'a_ObjPosition', 'a_Color'],
		glUniforms: [
			'u_illuType',
			'u_LightColor',
			'u_LightPosition',
			'u_LightDirection',
			'u_AmbientLightColor',
			'u_lightIntensityGain',
			'u_NormalMatrix',
			'u_ModelMatrix',
			'u_ViewMatrix',
			'u_ProjMatrix',
			'u_Clicked',
			'u_EyePosition',
			'u_FogColor',
			'u_FogDist',
		],
	})
	Program.glControl.commonLight.glAttributes = commonWebGLVariableLocation.glAttributes
	Program.glControl.commonLight.glUniforms = commonWebGLVariableLocation.glUniforms

	const setWebGLRenderClickedStatus = () => {}
	const setWebGLRenderNormalStatus = () => {}
	Program.glControl.setWebGLRenderClickedStatus = setWebGLRenderClickedStatus
	Program.glControl.setWebGLRenderNormalStatus = setWebGLRenderNormalStatus

	const canvas = {
		status: null,
		init(status, gl, frameBuffer) {
			this.status = status
			/**
			 * 绑定创建的帧缓冲区
			 * 		使绘图结果生成在帧缓冲区
			 */
			gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
		},
		clear(gl) {
			gl.viewport(0, 0, canvasElement.width, canvasElement.height)
			gl.clearColor(Program.profile.clearColor.r / 255, Program.profile.clearColor.g / 255, Program.profile.clearColor.b / 255, 1.0)
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		},
		setProfile(gl, itemProgramControl) {
			const { glUniforms } = itemProgramControl

			/**
			 * 创建透视投影矩阵
			 */
			const projectionMatrix4 = Ven$CanvasMatrix4.setPerspective(
				Program.profile.persProjection.fovy,
				Program.profile.persProjection.aspect,
				Program.profile.persProjection.near,
				Program.profile.persProjection.far
			)
			/**
			 * 创建正交投影矩阵
			 */
			const orthoMatrix4 = Ven$CanvasMatrix4.setOrtho(
				Program.profile.orthoProjection.left,
				Program.profile.orthoProjection.right,
				Program.profile.orthoProjection.bottom,
				Program.profile.orthoProjection.top,
				Program.profile.orthoProjection.near,
				Program.profile.orthoProjection.far
			)
			/**
			 * 创建视图矩阵
			 */
			const lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(
				new Ven$Vector3(Program.profile.lookAt.eyePosition.x, Program.profile.lookAt.eyePosition.y, Program.profile.lookAt.eyePosition.z),
				new Ven$Vector3(Program.profile.lookAt.atPosition.x, Program.profile.lookAt.atPosition.y, Program.profile.lookAt.atPosition.z),
				new Ven$Vector3(0, 1, 0)
			)

			gl.uniform3fv(
				glUniforms.u_EyePosition,
				new Float32Array([Program.profile.lookAt.eyePosition.x, Program.profile.lookAt.eyePosition.y, Program.profile.lookAt.eyePosition.z])
			)

			gl.uniform1f(glUniforms.u_illuType, Program.profile.light.illuType)
			if (Program.profile.light.illuType === 1) {
				/**
				 * 平行光
				 * 		依据光照模型, 此处传给着色器的光源方向需要取反, 以便在着色器中正确求取入射光反方向向量与物体表面法线向量的夹角
				 */
				const lightDirection = new Ven$Vector3(
					-Program.profile.light.direction.x,
					-Program.profile.light.direction.y,
					-Program.profile.light.direction.z
				)
				const lightNormalizeDirection = lightDirection.normalize()
				gl.uniform3fv(
					glUniforms.u_LightDirection,
					new Float32Array([lightNormalizeDirection.x, lightNormalizeDirection.y, lightNormalizeDirection.z])
				)
			}
			if (Program.profile.light.illuType === 2) {
				/**
				 * 点光
				 */
				gl.uniform3fv(
					glUniforms.u_LightPosition,
					new Float32Array([Program.profile.light.position.x, Program.profile.light.position.y, Program.profile.light.position.z])
				)
			}
			gl.uniform3f(
				glUniforms.u_LightColor,
				Program.profile.light.color.r / 255,
				Program.profile.light.color.g / 255,
				Program.profile.light.color.b / 255
			)
			gl.uniform1f(glUniforms.u_lightIntensityGain, Program.profile.light.intensityGain)
			gl.uniform3f(
				glUniforms.u_AmbientLightColor,
				Program.profile.light.ambient.r,
				Program.profile.light.ambient.g,
				Program.profile.light.ambient.b
			)
			gl.uniformMatrix4fv(glUniforms.u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
			if (Program.profile.projectionType === 1) {
				gl.uniformMatrix4fv(glUniforms.u_ProjMatrix, false, new Float32Array(projectionMatrix4.data))
			}
			if (Program.profile.projectionType === 2) {
				gl.uniformMatrix4fv(glUniforms.u_ProjMatrix, false, new Float32Array(orthoMatrix4.data))
			}
		},
		render(gl, vertexFeatureSize, modelInstances, itemProgramControl) {
			modelInstances.forEach(modelInstanceItem => {
				this.applyModelMatrix(gl, modelInstanceItem, itemProgramControl)
				this.drawBuffer(gl, vertexFeatureSize, modelInstanceItem, itemProgramControl)
			})
		},
		drawBuffer(gl, vertexFeatureSize, modelInstanceItem, itemProgramControl) {
			const { normalBuffer, featureBuffer, vertexBuffer, colorBuffer, indexBuffer, texCoordBuffer, vertexDatas } = modelInstanceItem
			const { vertexNormals: normalData, vertexFeature: featureData, vertexCoordinate: texCoordData } = vertexDatas
			const { colors, vertices, normals, indices } = vertexDatas
			const { glAttributes } = itemProgramControl

			if (Program.profile.modelSourceType === 1) {
				ven$initAttributeVariable(
					gl,
					glAttributes.a_Normal,
					normalBuffer,
					{
						size: 3,
					},
					{
						data: normalData,
					}
				)
				ven$initAttributeVariable(gl, glAttributes.a_ObjPosition, featureBuffer, {
					size: 3,
					stride: 28,
				})
				ven$initAttributeVariable(gl, glAttributes.a_Color, featureBuffer, {
					size: 4,
					stride: 28,
					offset: 12,
				})
				gl.bufferData(gl.ARRAY_BUFFER, featureData, gl.STATIC_DRAW)
				gl.drawArrays(gl.TRIANGLES, 0, vertexFeatureSize / 7)
			}
			if (Program.profile.modelSourceType === 2) {
				ven$initAttributeVariable(
					gl,
					glAttributes.a_Normal,
					normalBuffer,
					{
						size: 3,
					},
					{
						data: normals,
					}
				)
				ven$initAttributeVariable(
					gl,
					glAttributes.a_ObjPosition,
					vertexBuffer,
					{
						size: 3,
					},
					{
						data: vertices,
					}
				)
				ven$initAttributeVariable(
					gl,
					glAttributes.a_Color,
					colorBuffer,
					{
						size: 4,
					},
					{
						data: colors,
					}
				)
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
				gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
			}
		},
		applyModelMatrix(gl, modelInstance, itemProgramControl) {
			const { glUniforms } = itemProgramControl
			/**
			 * 创建旋转矩阵
			 */
			let modelRotationMatrix4 = Ven$CanvasMatrix4.initMatrix()
			if (Program.profile.rotationCalculationType === 1) {
				/**
				 * 矩阵旋转
				 */
				const modelRotationXMatrix4 = Ven$CanvasMatrix4.setRotate(
					Ven$Angles.degreeToRadian(modelInstance.modelRatation.x),
					new Ven$Vector3(1, 0, 0)
				)
				const modelRotationYMatrix4 = Ven$CanvasMatrix4.setRotate(
					Ven$Angles.degreeToRadian(modelInstance.modelRatation.y),
					new Ven$Vector3(0, 1, 0)
				)
				const modelRotationZMatrix4 = Ven$CanvasMatrix4.setRotate(
					Ven$Angles.degreeToRadian(modelInstance.modelRatation.z),
					new Ven$Vector3(0, 0, 1)
				)
				modelRotationMatrix4 = modelRotationXMatrix4.multiply4(modelRotationYMatrix4).multiply4(modelRotationZMatrix4)
			}
			if (Program.profile.rotationCalculationType === 3) {
				/**
				 * 四元数旋转
				 */
				const currentMatrixData = Program.glControl.modelInstances[0].modeControl.currentMatrixData
				if (currentMatrixData) {
					modelRotationMatrix4 = Ven$CanvasMatrix4.setFromArray(currentMatrixData)
				}
			}
			/**
			 * 创建平移矩阵
			 */
			const modelOffsetMatrix4 = Ven$CanvasMatrix4.setTranslate(
				new Ven$Vector3(modelInstance.modelOffset.x, modelInstance.modelOffset.y, modelInstance.modelOffset.z)
			)
			/**
			 * 创建缩放矩阵
			 */
			const modelScaleMatrix4 = Ven$CanvasMatrix4.setScale(
				new Ven$Vector3(modelInstance.modelScale.x, modelInstance.modelScale.y, modelInstance.modelScale.z)
			)
			/**
			 * 生成模型变换矩阵
			 */
			const modelEffectMatrix4 = modelRotationMatrix4.multiply4(modelScaleMatrix4).multiply4(modelOffsetMatrix4)
			/**
			 * 创建法线变换矩阵
			 */
			const modelEffectInverseMatrix4 = Ven$CanvasMatrix4.setInverse(modelEffectMatrix4)
			const modelEffectInverseTransposeMatrix4 = Ven$CanvasMatrix4.setTranspose(modelEffectInverseMatrix4)
			const normalMatrix4 = modelEffectInverseTransposeMatrix4

			gl.uniformMatrix4fv(glUniforms.u_ModelMatrix, false, new Float32Array(modelEffectMatrix4.data))
			gl.uniformMatrix4fv(glUniforms.u_NormalMatrix, false, new Float32Array(normalMatrix4.data))
		},
	}

	const stepControl = new Ven$StepControl(0, 90, 360)
	let angle = 0
	const exec = () => {
		if (!Program.isRender) {
			window.requestAnimationFrame(exec)
			stepControl.updateLastStamp()
			return
		}
		Program.isRender = false
		Program.renderModelInfomationView(Program.glControl.modelInstances)
		if (Program.profile.autoTransformation) {
			angle = stepControl.getNextValue() % 360
			Program.getModelInstances(Program.glControl.modelInstances).forEach(modelInstanceItem => {
				modelInstanceItem.modelRatation.y = angle
			})
			Program.isRender = true
		}
		canvas.init('CANVAS', Program.glControl.gl, null)
		Program.glControl.gl.useProgram(Program.glControl.commonLight.program)
		canvas.clear(Program.glControl.gl)
		canvas.setProfile(Program.glControl.gl, Program.glControl.commonLight)
		canvas.render(
			Program.glControl.gl,
			Program.glControl.vertexFeatureSize,
			Program.glControl.modelInstances,
			Program.glControl.commonLight,
			false
		)
		stepControl.updateLastStamp()
		window.requestAnimationFrame(exec)
	}
	exec()

	console.log(Program.glControl)
}
