const SHADER_PROFILE = {
	program1: {
		vertex: `
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
            }
        `,
		fragment: `
            precision mediump float;
            varying vec4 v_Color;
            void main() {
                gl_FragColor = v_Color;
            }
        `,
	},
	program2: {
		vertex: `
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
            }
        `,
		fragment: `
            precision mediump float;
            varying vec4 v_Color;
            void main() {
                gl_FragColor = vec4((gl_FragCoord.x - 200.0) / 100.0, v_Color.g, v_Color.b, 1.0);
            }
        `,
	},
	program3: {
		vertex: `
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
            }
        `,
		fragment: `
            precision mediump float;
            varying vec4 v_Color;
            void main() {
                gl_FragColor = v_Color;
            }
        `,
	},
}
