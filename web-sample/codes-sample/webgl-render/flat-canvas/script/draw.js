function drawCanvas(containerElement) {
	const canvasElement = containerElement.querySelector('canvas')
	Program.glControl.gl = ven$initWebGLContext(canvasElement)
	Program.init(containerElement)

	const COMMON_VERTEX_SHADER = `
		precision mediump float;
		varying vec4 v_Color;
		// 顶点配置(组)
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		// 变换矩阵(组)
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		void main() {
			gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
			v_Color = a_Color;
			gl_PointSize = 5.0;
		}
	`
	const COMMON_FRAGMENT_SHADER = `
		precision mediump float;
		varying vec4 v_Color;
		void main() {
			gl_FragColor = v_Color;
		}
	`

	Program.glControl.gl.clearColor(Program.profile.clearColor.r / 255, Program.profile.clearColor.g / 255, Program.profile.clearColor.b / 255, 1.0)
	Program.glControl.gl.clear(Program.glControl.gl.COLOR_BUFFER_BIT | Program.glControl.gl.DEPTH_BUFFER_BIT)
	Program.glControl.gl.enable(Program.glControl.gl.BLEND)
	Program.glControl.gl.enable(Program.glControl.gl.CULL_FACE)
	Program.glControl.gl.enable(Program.glControl.gl.DEPTH_TEST)
	Program.glControl.gl.enable(Program.glControl.gl.POLYGON_OFFSET_FILL)
	Program.glControl.gl.polygonOffset(1.0, 1.0)
	Program.glControl.gl.blendFunc(Program.glControl.gl.SRC_ALPHA, Program.glControl.gl.ONE_MINUS_SRC_ALPHA)

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

			gl.uniformMatrix4fv(glUniforms.u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
			gl.uniformMatrix4fv(glUniforms.u_ProjMatrix, false, new Float32Array(orthoMatrix4.data))
		},
		render(gl, vertexFeatureSize, modelInstances, itemProgramControl) {
			modelInstances.forEach(modelInstanceItem => {
				this.applyModelMatrix(gl, modelInstanceItem, itemProgramControl)
				this.drawBuffer(gl, vertexFeatureSize, modelInstanceItem, itemProgramControl)
			})
		},
		drawBuffer(gl, vertexFeatureSize, modelInstanceItem, itemProgramControl) {
			const { featureBuffer, vertexDatas } = modelInstanceItem
			const { vertexFeature: featureData } = vertexDatas
			const { glAttributes } = itemProgramControl

			ven$initAttributeVariable(gl, glAttributes.a_Position, featureBuffer, {
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
		},
		applyModelMatrix(gl, modelInstance, itemProgramControl) {
			const { glUniforms } = itemProgramControl
			/**
			 * 创建旋转矩阵
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
			const modelEffectMatrix4 = modelRotationXMatrix4
				.multiply4(modelRotationYMatrix4)
				.multiply4(modelRotationZMatrix4)
				.multiply4(modelScaleMatrix4)
				.multiply4(modelOffsetMatrix4)
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

	const exec = () => {
		if (!Program.isRender) {
			window.requestAnimationFrame(exec)
			return
		}
		Program.isRender = false
		canvas.init('CANVAS', Program.glControl.gl, null)
		const selectedProgram = Program.profile.selectedProgram
		Program.glControl.gl.useProgram(Program.glControl[selectedProgram].program)
		canvas.clear(Program.glControl.gl)
		canvas.setProfile(Program.glControl.gl, Program.glControl[selectedProgram])
		canvas.render(Program.glControl.gl, Program.glControl.vertexFeatureSize, Program.glControl.modelInstances, Program.glControl[selectedProgram])
		window.requestAnimationFrame(exec)
	}
	exec()

	console.log(Program.glControl)
}
