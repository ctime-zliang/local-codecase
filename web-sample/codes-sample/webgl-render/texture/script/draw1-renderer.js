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
                    float dotSize = 9.0;
                    // 在 X 轴方向上, 将片元 X 轴坐标值按 {dotSize} 长度划分组
                    // 每组的第 0 - 2 个像素仅保留 R 通道
                    // 每组的第 3 - 5 个像素仅保留 G 通道
                    // 每组的第 6 - 8 个像素仅保留 B 通道
                    if ((mod(gl_FragCoord.xy.x, dotSize)) < 3.0) {
                        color.rgb.r *= 1.0;
                        color.rgb.g *= 0.0;
                        color.rgb.b *= 0.0;
                    } else if ((mod(gl_FragCoord.xy.x, dotSize)) < 6.0) {
                        color.rgb.r *= 0.0;
                        color.rgb.g *= 1.0;
                        color.rgb.b *= 0.0;
                    } else if ((mod(gl_FragCoord.xy.x, dotSize)) < 9.0) {
                        color.rgb.r *= 0.0;
                        color.rgb.g *= 0.0;
                        color.rgb.b *= 1.0;
                    }
                    float ySplit = 6.0;
                    if (mod(gl_FragCoord.xy.y, dotSize) < ySplit) {
                        // 在 Y 轴方向上, 将片元 Y 轴坐标值按 {dotSize} 长度划分组
                        // 每组的第 0 - {ySplit - 1} 个像素不渲染
                        // 即在 Y 轴方向上, 片元将出现长度为 {ySplit} 的间隔
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
                #define PIXELSIZE 3.0
                varying vec4 v_Color;
                varying vec2 v_textureCoord;
                // 纹理参数(组)
                uniform sampler2D u_texture;
                uniform vec2 u_resolution;
                void main() {
                    gl_FragColor = v_Color;
                    vec2 cor;
                    cor.x = gl_FragCoord.x / PIXELSIZE;
                    cor.y = (gl_FragCoord.y + PIXELSIZE * 1.5 * mod(floor(cor.x), 2.0)) / (PIXELSIZE * 3.0);
                    cor.y = -cor.y;
                    vec2 ico = floor(cor);
                    vec2 fco = fract(cor);
                    vec3 pix = step(1.5, mod(vec3(0.0, 1.0, 2.0) + ico.x, 3.0));
                    vec3 ima = texture2D(u_texture, PIXELSIZE * ico * vec2(1.0, 3.0) / u_resolution.xy).xyz;
                    vec3 col = pix * dot(pix, ima);
                    col *= step(abs(fco.x - 0.5), 0.4);
                    col *= step(abs(fco.y - 0.5), 0.4);
                    col *= 1.2;
                    gl_FragColor = vec4(col, 1.0);
                }
            `
			program = ven$createProgram(glControl.gl, COMMON_VERTEX_SHADER, COMMON_FRAGMENT_SHADER)
			commonWebGLVariableLocation = ven$getWebGLVariableLocation(glControl.gl, program, {
				glAttributes: ['a_ObjPosition', 'a_Color', 'a_textureCoord'],
				glUniforms: ['u_ModelMatrix', 'u_ViewMatrix', 'u_ProjMatrix', 'u_texture', 'u_resolution'],
			})
			break
		}
		case 'st03': {
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
                #define SUBPIXEL_SIZE 2.0
                varying vec4 v_Color;
                varying vec2 v_textureCoord;
                // 纹理参数(组)
                uniform sampler2D u_texture;
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
