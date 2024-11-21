function draw1Renderer(type, glControl, callback) {
	let program = null
	let commonWebGLVariableLocation = null
	switch (type) {
		case 'st01': {
			const COMMON_VERTEX_SHADER = `
                precision mediump float;
                varying vec4 v_Color;
                varying vec2 v_textureCoord;
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
                    v_textureCoord = a_textureCoord;
                }
            `
			const COMMON_FRAGMENT_SHADER = `
                precision mediump float;
                varying vec4 v_Color;
                varying vec2 v_textureCoord;
                // 纹理参数(组)
                uniform sampler2D u_texture;
                void main() {
                    gl_FragColor = v_Color;
                    vec4 color = texture2D(u_texture, v_textureCoord);
                    // 在 X 轴方向上, 将片元 X 轴坐标值按 {dotSize} 长度划分组
                    // 在每组内部按 {portionsSize} 长度继续划分等长小份
                    // 第 1 份(每组的第 0 至 {dotSize / portionsSize * 1 - 1} 个像素)像素组仅保留 R 通道
                    // 第 2 份(每组的第 {dotSize / portionsSize * 1 - 1 + 1} 至 {dotSize / portionsSize * 2 - 1} 个像素)像素组仅保留 G 通道
                    // 第 3 份(每组的第 {dotSize / portionsSize * 2 - 1 + 1} 至 {dotSize / portionsSize * 3 - 1} 个像素)像素组仅保留 B 通道
                    float dotGroupSize = 9.0;
                    float portionsSize = 3.0;
                    if ((mod(gl_FragCoord.xy.x, dotGroupSize)) < portionsSize * 1.0) {
                        color.rgb.r *= 1.0;
                        color.rgb.g *= 0.0;
                        color.rgb.b *= 0.0;
                    } else if ((mod(gl_FragCoord.xy.x, dotGroupSize)) < portionsSize * 2.0) {
                        color.rgb.r *= 0.0;
                        color.rgb.g *= 1.0;
                        color.rgb.b *= 0.0;
                    } else if ((mod(gl_FragCoord.xy.x, dotGroupSize)) < portionsSize * 3.0) {
                        color.rgb.r *= 0.0;
                        color.rgb.g *= 0.0;
                        color.rgb.b *= 1.0;
                    }
                    // 在 Y 轴方向上, 将片元 Y 轴坐标值按 {dotGroupSize} 长度划分组
                    // 每组的第 0 - {ySplit - 1} 个像素不渲染
                    // 即在 Y 轴方向上, 片元将出现长度为 {ySplit} 的间隔
                    float ySplit = 6.0;
                    if (mod(gl_FragCoord.xy.y, dotGroupSize) < ySplit) {
                        discard;
                    }
                    gl_FragColor = vec4(color.rgb, 1.0);
                }
            `
			program = ven$createProgram(glControl.gl, COMMON_VERTEX_SHADER, COMMON_FRAGMENT_SHADER)
			commonWebGLVariableLocation = ven$getWebGLVariableLocation(glControl.gl, program, {
				glAttributes: ['a_ObjPosition', 'a_Color', 'a_textureCoord'],
				glUniforms: ['u_ModelMatrix', 'u_ViewMatrix', 'u_ProjMatrix', 'u_texture'],
			})
			break
		}
		case 'st02': {
			const COMMON_VERTEX_SHADER = `
                precision mediump float;
                varying vec4 v_Color;
                varying vec2 v_textureCoord;
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
                    v_textureCoord = a_textureCoord;
                }
            `
			const COMMON_FRAGMENT_SHADER = `
                precision mediump float;
                #define SUBPIXEL_SIZE 10.0
                varying vec4 v_Color;
                varying vec2 v_textureCoord;
                // 纹理参数(组)
                uniform sampler2D u_texture;
                // 其他参数
                uniform vec2 u_resolution;
                void main() {
                    gl_FragColor = v_Color;
                    vec2 p = gl_FragCoord.xy / SUBPIXEL_SIZE;
                    vec2 uv = floor(p) * SUBPIXEL_SIZE / u_resolution.xy;
                    uv.x = -uv.x;
                    vec4 color = texture2D(u_texture, -uv);    
                    vec4 result = vec4(0.0, 0.0, 0.0, 1.0);
                    vec2 remainder = floor(mod(p, 2.0) + 0.5);
                    if (remainder.x == 1.0) {
                        if (remainder.y == 1.0) {
                            result.g = color.g / sqrt(2.0);
                        } else {
                            result.r = color.r;
                        }
                    } else {
                        if (remainder.y == 1.0) {
                            result.b = color.b;
                        } else {
                            result.g = color.g / sqrt(2.0);
                        }
                    }
                    gl_FragColor = result;
                }
            `
			program = ven$createProgram(glControl.gl, COMMON_VERTEX_SHADER, COMMON_FRAGMENT_SHADER)
			commonWebGLVariableLocation = ven$getWebGLVariableLocation(glControl.gl, program, {
				glAttributes: ['a_ObjPosition', 'a_Color', 'a_textureCoord'],
				glUniforms: ['u_ModelMatrix', 'u_ViewMatrix', 'u_ProjMatrix', 'u_texture', 'u_resolution'],
			})
			break
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
