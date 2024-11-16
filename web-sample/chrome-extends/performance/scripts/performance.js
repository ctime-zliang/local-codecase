;(e => {
	const t = [0, 1, 2],
		a = [
			[[0, 0, null, 0]],
			[
				[0, 0, null, 14],
				[0, 14, null, 14],
				[0, 28, null, 20],
				[0, 48, null, 14],
				[52, 48, null, 14],
				[0, 62, null, 20],
			],
			[
				[0, 0, null, 14],
				[0, 14, null, 14],
				[0, 28, null, 20],
			],
		],
		i = []
	let l = t[1],
		o = 200
	const n = [30, 3],
		r = [(n[0] - 1) * n[1], 0],
		s = [20, 30],
		c = [0.6, 0.9],
		m = ['rgba(255, 0, 0, 1)', 'rgba(255, 126, 82, 1)', 'rgba(0, 255, 0, 1)'],
		d = 10,
		A = '_performance-monitor-container',
		y = {
			cssText: `\n            .${A} {\n                \n\t\tdisplay: flex;\n\t\tposition: fixed; \n\t\ttop: 2px;\n\t\tleft: 2px;\n\t\tcursor: move;\n\t\tpadding: 3px 4px 4px 4px;\n\t\topacity: 1;\n\t\tborder: 1px solid rgba(50, 50, 50, 1);\n\t\tborder-radius: 2px;\n\t\tbackground-color: rgba(25, 25, 25, 0.85);\n\t\tbox-shadow: rgba(75, 75, 75, 0.35) 0 0 5px;\n\t\tz-index: 999999999;\n\t\t-webkit-transform: translate3d(0, 0, 1px) scale(1.0);\n\t\t-moz-transform: translate3d(0, 0, 1px) scale(1.0);\n\t\ttransform: translate3d(0, 0, 1px) scale(1.0);\n\t\n            }\n\t\t\t.${A}-hidden {\n                \n\t\tdisplay: none !important;\n\t\topacity: 0.35 !important;\n\t\tbackground-color: rgba(25, 25, 25, 0) !important;\n\t\n            }\n        `,
		},
		C = {},
		R = {
			setCommonProfile(e) {
				;(o = o >= 1e3 ? 1e3 : o), (C.visibilityState = 'visible'), (C.panelRect = null), (C.ctx = null), C.mainCanvasElement && (C.ctx = C.mainCanvasElement.getContext('2d'))
				const t = 1.5 * o
				;(C.maxBlockInterval = t >= 1e3 ? 1e3 : t), (C.prevRefreshViewTimeStamp = C.prevRAFExecuteTimeStamp = e), (C.rafExecuteDiffTime = C.refreshViewDiffTime = 0)
			},
			setRAFCommonProfile(e) {
				;(C.rAFIntervalCount = C.rAFRatioCycleAverage = C.rAFRatioInstant = 0), (C.rAFRatioCycleAverageYPositions = []), (C.maxRAFRatioCycleAverage = 60)
			},
			setRAFPolylineProfile(e, t, a, i, l) {
				const o = C.ctx.createLinearGradient(t, a, i, l)
				o.addColorStop(0, 'rgba(47, 224, 212, 0.9)'), o.addColorStop(0.6, 'rgba(2, 199, 252, 0.9)'), o.addColorStop(1, 'rgba(19, 135, 251, 0.9)'), (C.rAFLinearGradient = o)
			},
			setRICCommonProfile(e) {
				;(C.rICIntervalCount = C.rdleRatioCycleAverage = 0), (C.rdleRatioCycleAverageYPositions = [])
			},
			setRdlePolylineProfile(e, t, a, i, l) {
				const o = C.ctx.createLinearGradient(t, a, i, l)
				o.addColorStop(0, 'rgba(47, 224, 212, 0.9)'), o.addColorStop(0.6, 'rgba(2, 199, 252, 0.9)'), o.addColorStop(1, 'rgba(19, 135, 251, 0.9)'), (C.rICLinearGradient = o)
			},
		},
		f = a => {
			t.slice(1).includes(l) ? (C.rICIntervalCount++, e.requestIdleCallback(f)) : e.requestIdleCallback(f)
		},
		v = {
			fillRAFPolylineBlockData(e, t) {
				C.rAFRatioCycleAverageYPositions = [].concat(C.rAFRatioCycleAverageYPositions, new Array(e).fill(t))
			},
			fillRdlePolylineBlockData(e, t) {
				C.rdleRatioCycleAverageYPositions = [].concat(C.rdleRatioCycleAverageYPositions, new Array(e).fill(t))
			},
			calcRAFCommonData() {
				;(C.rAFRatioCycleAverage = C.rAFIntervalCount / (C.refreshViewDiffTime / 1e3)),
					C.maxRAFRatioCycleAverage <= C.rAFRatioCycleAverage && (C.maxRAFRatioCycleAverage = C.rAFRatioCycleAverage)
			},
			calcRAFPolylineData(e, t) {
				C.rAFRatioCycleAverageYPositions.push(e + ((C.maxRAFRatioCycleAverage - C.rAFRatioCycleAverage) / C.maxRAFRatioCycleAverage) * t),
					C.rAFRatioCycleAverageYPositions.length >= n[0] + 1 &&
						(C.rAFRatioCycleAverageYPositions = C.rAFRatioCycleAverageYPositions.slice(C.rAFRatioCycleAverageYPositions.length - n[0], C.rAFRatioCycleAverageYPositions.length))
			},
			calcRdleCommonData() {
				C.rdleRatioCycleAverage = C.rICIntervalCount / (C.maxRAFRatioCycleAverage * (C.refreshViewDiffTime / 1e3))
			},
			calcRdlePolylineData(e, t) {
				C.rdleRatioCycleAverageYPositions.push(e + C.rdleRatioCycleAverage * t),
					C.rdleRatioCycleAverageYPositions.length >= n[0] + 1 &&
						(C.rdleRatioCycleAverageYPositions = C.rdleRatioCycleAverageYPositions.slice(C.rdleRatioCycleAverageYPositions.length - n[0], C.rdleRatioCycleAverageYPositions.length))
			},
		},
		u = a => {
			if (!t.slice(1).includes(l)) return void e.requestAnimationFrame(u)
			;(C.refreshViewDiffTime = a - C.prevRefreshViewTimeStamp), (C.rafExecuteDiffTime = a - C.prevRAFExecuteTimeStamp), C.rAFIntervalCount++, (C.rAFRatioInstant = 1e3 / C.rafExecuteDiffTime)
			let n = !1
			if ('visible' === C.visibilityState && C.refreshViewDiffTime >= C.maxBlockInterval) {
				const e = (C.refreshViewDiffTime / o) | 0
				l === t[1] && (v.fillRAFPolylineBlockData(e, i[2][1] + i[2][3]), v.fillRdlePolylineBlockData(e, i[5][1])), l === t[2] && v.fillRAFPolylineBlockData(e, i[2][1] + i[2][3]), (n = !0)
			}
			;(Math.abs(C.refreshViewDiffTime - o) <= 5 || C.refreshViewDiffTime >= o) &&
				(l === t[1] && (v.calcRAFCommonData(), v.calcRAFPolylineData(i[2][1], i[2][3]), v.calcRdleCommonData(), v.calcRdlePolylineData(i[5][1], i[5][3])),
				l === t[2] && (v.calcRAFCommonData(), v.calcRAFPolylineData(i[2][1], i[2][3])),
				(n = !0)),
				n && (x(), S(), (C.prevRefreshViewTimeStamp = a), (C.rICIntervalCount = C.rAFIntervalCount = 0)),
				(C.prevRAFExecuteTimeStamp = a),
				e.requestAnimationFrame(u)
		},
		g = {},
		p = {
			memoryDataSubmit() {
				const e = performance.memory || {}
				;(g.jsHeapSizeLimit = e.jsHeapSizeLimit || 0), (g.totalJSHeapSize = e.totalJSHeapSize || 0), (g.usedJSHeapSize = e.usedJSHeapSize || 0)
			},
			rafCommonDataSubmit() {
				;(g.rAFRatioInstant = C.rAFRatioInstant.toFixed(2)), (g.rAFRatioCycleAverage = C.rAFRatioCycleAverage.toFixed(2)), (g.rAFIntervalCount = C.rAFIntervalCount)
			},
			rafPolylineDataSubmit() {
				g.rAFRatioCycleAverageYPositions = [...C.rAFRatioCycleAverageYPositions]
			},
			rdleCommonDataSubmit() {
				;(g.rdleRatioCycleAverage = C.rdleRatioCycleAverage.toFixed(4)), (g.rICIntervalCount = C.rICIntervalCount)
			},
			refreshTextDataSubmit() {
				g.refreshViewDiffTime = C.refreshViewDiffTime.toFixed(2)
			},
			rdlePolylineDataSubmit() {
				g.rdleRatioCycleAverageYPositions = [...C.rdleRatioCycleAverageYPositions]
			},
		},
		x = () => {
			l === t[1] && (p.memoryDataSubmit(), p.rafCommonDataSubmit(), p.rafPolylineDataSubmit(), p.rdleCommonDataSubmit(), p.refreshTextDataSubmit(), p.rdlePolylineDataSubmit()),
				l === t[2] && (p.memoryDataSubmit(), p.rafCommonDataSubmit(), p.rafPolylineDataSubmit())
		},
		F = {
			drawMemoryText(e, t) {
				const a = `${(g.usedJSHeapSize / Math.pow(1024, 2)).toFixed(2)}/${(g.totalJSHeapSize / Math.pow(1024, 2)).toFixed(2)} M`
				;(C.ctx.fillStyle = g.usedJSHeapSize >= g.jsHeapSizeLimit * c[1] ? m[0] : g.usedJSHeapSize >= g.jsHeapSizeLimit * c[0] && g.usedJSHeapSize < g.jsHeapSizeLimit * c[1] ? m[1] : m[2]),
					C.ctx.fillText(a, e, t)
			},
			drawRAFRefreshText(e, t) {
				const a = `${g.refreshViewDiffTime}`
				;(C.ctx.fillStyle = m[2]), C.ctx.fillText(a, e, t)
			},
			drawRAFText(e, t) {
				const a = `${g.rAFRatioCycleAverage}/${g.rAFRatioInstant}/${g.rAFIntervalCount}`,
					i = 0 | g.rAFRatioInstant
				;(C.ctx.fillStyle = i < s[0] ? m[0] : i >= s[0] && i < s[1] ? m[1] : m[2]), C.ctx.fillText(a, e, t)
			},
			drawRICText(e, t) {
				const a = `${g.rICIntervalCount}/${(100 * Math.max(0, 1 - +g.rdleRatioCycleAverage)).toFixed(2)}%`
				;(C.ctx.fillStyle = m[2]), C.ctx.fillText(a, e, t)
			},
			drawPolyline(e, t, a) {
				const i = C.ctx
				i.beginPath()
				const l = (n[0] - e.length) * n[1]
				i.moveTo(l, e[0])
				let o = 0
				for (o = 1; o < e.length; o++) i.lineTo(l + o * n[1], e[o])
				i.stroke(), (i.strokeStyle = 'rgba(19, 98, 251, 1.0)'), e.length >= 2 && (i.lineTo(l + (o - 1) * n[1], t), i.lineTo(l, t), i.stroke()), (i.fillStyle = a), i.fill()
			},
		},
		S = () => (
			C.ctx.clearRect(0, 0, r[0], r[1]),
			(C.ctx.lineWidth = 1),
			(C.ctx.font = '10px arial, sans-serif'),
			(C.ctx.textBaseline = 'top'),
			l === t[1]
				? (F.drawMemoryText(i[0][0], i[0][1] + (i[0][3] - d) / 2),
				  F.drawRAFText(i[1][0], i[1][1] + (i[1][3] - d) / 2),
				  F.drawPolyline(g.rAFRatioCycleAverageYPositions, i[2][1] + i[2][3], C.rAFLinearGradient),
				  F.drawRICText(i[3][0], i[3][1] + (i[3][3] - d) / 2),
				  F.drawRAFRefreshText(i[4][0], i[4][1] + (i[4][3] - d) / 2),
				  void F.drawPolyline(g.rdleRatioCycleAverageYPositions, i[5][1] + i[5][3], C.rICLinearGradient))
				: l === t[2]
				? (F.drawMemoryText(i[0][0], i[0][1] + (i[0][3] - d) / 2),
				  F.drawRAFText(i[1][0], i[1][1] + (i[1][3] - d) / 2),
				  void F.drawPolyline(g.rAFRatioCycleAverageYPositions, i[2][1] + i[2][3], C.rAFLinearGradient))
				: void 0
		),
		h = () => {
			;(() => {
				try {
					const a = e.localStorage.getItem('_performance_mode')
					if (null === a || isNaN(+a) || !t.includes(+a)) return void e.localStorage.setItem('_performance_mode', l)
					l = +a
				} catch (e) {}
			})(),
				i.splice(0),
				a[l].forEach((e, t) => (i[t] = [...e])),
				(r[1] = i[i.length - 1][1] + i[i.length - 1][3]),
				(() => {
					const e = performance.now()
					R.setCommonProfile(e),
						l === t[1] &&
							(R.setRAFCommonProfile(e),
							R.setRAFPolylineProfile(e, i[2][0], i[2][1], i[2][0], i[2][1] + i[2][3]),
							R.setRICCommonProfile(e),
							R.setRdlePolylineProfile(e, i[5][0], i[5][1], i[5][0], i[5][1] + i[5][3])),
						l === t[2] && (R.setRAFCommonProfile(e), R.setRAFPolylineProfile(e, i[2][0], i[2][1], i[2][0], i[2][1] + i[2][3]))
				})(),
				(C.mainCanvasElement.width = r[0]),
				(C.mainCanvasElement.height = r[1]),
				t.slice(1).includes(l) ? (C.containerElement.style.display = 'flex') : (C.containerElement.style.display = 'none')
		},
		P = () => {
			;(() => {
				const e = document.createElement('style')
				;(e.type = 'text/css'),
					e.styleSheet ? (e.styleSheet.cssText = y.cssText) : e.appendChild(document.createTextNode(y.cssText)),
					(document.head || document.getElementsByTagName('head')[0]).appendChild(e)
			})(),
				(document.body || document.getElementsByTagName('body')[0]).appendChild(
					document.createRange().createContextualFragment(`<div class="${A}"><canvas width="${r[0]}" height="${r[1]}"></canvas></div>`)
				),
				(C.containerElement = document.querySelector(`.${A}`)),
				(C.mainCanvasElement = C.containerElement.getElementsByTagName('canvas')[0]),
				chrome.runtime.onMessage.addListener((a, i, o) => {
					if ('USER_CHANGE_MODE' === a.action && t.includes(+a.data.modeValue)) {
						try {
							e.localStorage.setItem('_performance_mode', ((l = +a.data.modeValue), l))
						} catch (e) {}
						h()
					}
				}),
				C.containerElement.addEventListener(
					'mouseenter',
					t => {
						;(C.panelRect = C.containerElement.getBoundingClientRect()), e.setTimeout(() => C.containerElement.classList.add(`${A}-hidden`))
					},
					!0
				),
				document.addEventListener('visibilitychange', t => {
					if ('hidden' === document.visibilityState) return e.clearTimeout(C.visiblityChangeTimer), void (C.visibilityState = document.visibilityState)
					C.visiblityChangeTimer = e.setTimeout(e => (C.visibilityState = e), 300, document.visibilityState)
				}),
				document.addEventListener(
					'mousemove',
					e => {
						t.slice(1).includes(l) &&
							C.panelRect &&
							(e.clientX >= C.panelRect.left && e.clientX <= C.panelRect.right && e.clientY >= C.panelRect.top && e.clientY <= C.panelRect.bottom
								? C.containerElement.classList.add(`${A}-hidden`)
								: C.containerElement.classList.remove(`${A}-hidden`))
					},
					!0
				),
				h(),
				e.requestAnimationFrame(u),
				e.requestAnimationFrame(f)
		}
	e.addEventListener('DOMContentLoaded', () => {
		e.setTimeout(P)
	})
})(window)
