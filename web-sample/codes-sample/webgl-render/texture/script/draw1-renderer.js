function draw1Renderer(type, glControl, callback) {
	let program = null
	let commonWebGLVariableLocation = null
	switch (type) {
		case 'st01': {
			const COMMON_VERTEX_SHADER = `
                precision mediump float;
                varying vec4 v_Color;
                varying vec2 v_TextureCoord;
                // 顶点配置(组)
                attribute vec3 a_ObjPosition;
                attribute vec4 a_Color;
                attribute vec2 a_textureCoord;
                // 变换矩阵(组)
                uniform mat4 u_ModelMatrix;
                uniform mat4 u_ViewMatrix;
                uniform mat4 u_ProjMatrix;
                void main() {
                    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_ObjPosition, 1.0);
                    v_Color = a_Color;
                    v_TextureCoord = a_textureCoord;
                }
            `
			const COMMON_FRAGMENT_SHADER = `
                precision mediump float;
                varying vec4 v_Color;
                varying vec2 v_TextureCoord;
                // 纹理参数(组)
                uniform sampler2D u_texture;
                void main() {
                    gl_FragColor = v_Color;
                    vec4 color = texture2D(u_texture, v_TextureCoord);
                    vec2 xy = gl_FragCoord.xy * 1.0;
                    vec3 rgb = color.rgb;
                    float dot_size = 9.0;
                    float dot_size_1of3 = dot_size / 3.0;
                    if ((mod(xy.x, dot_size)) < dot_size_1of3 * 1.0) {
                        rgb.r *= 1.0;
                        rgb.g *= 0.0;
                        rgb.b *= 0.0;
                    } else if ((mod(xy.x, dot_size)) < dot_size_1of3 * 2.0) {
                        rgb.r *= 0.0;
                        rgb.g *= 1.0;
                        rgb.b *= 0.0;
                    } else if ((mod(xy.x, dot_size)) < dot_size_1of3 * 3.0) {
                        rgb.r *= 0.0;
                        rgb.g *= 0.0;
                        rgb.b *= 1.0;
                    }
                    if (mod(xy.y, dot_size) < dot_size_1of3 / 2.0) {
                        discard;
                    }
                    gl_FragColor = vec4(rgb, 1.0);
                }
            `
			program = ven$createProgram(glControl.gl, COMMON_VERTEX_SHADER, COMMON_FRAGMENT_SHADER)
			commonWebGLVariableLocation = ven$getWebGLVariableLocation(glControl.gl, program, {
				glAttributes: ['a_ObjPosition', 'a_Color', 'a_textureCoord'],
				glUniforms: ['u_ModelMatrix', 'u_ViewMatrix', 'u_ProjMatrix', 'u_texture'],
			})
		}
	}
	if (!program || !commonWebGLVariableLocation) {
		throw new Error('init renderer failer.')
	}
	glControl.commonLight.program = program
	glControl.commonLight.glAttributes = commonWebGLVariableLocation.glAttributes
	glControl.commonLight.glUniforms = commonWebGLVariableLocation.glUniforms
	callback && callback()
}
