// const profile = {
//     isAnimation: false,
//     frames: [],
//     frameEcharts: null,
//     animateCallbackTimer: null
// }

// function insertHtml() {
//     const appContainer = document.getElementById('appContainer')
//     appContainer.innerHTML = `
//         <div>
//             <button id="startAnimateBtn" class="btn btn-default">Start Animate</button>
//             <div id="echartsContainer" style="width: 720px; height: 480px; border: 1px solid #666666; border-radius: 3px;"></div>
//         </div>
//     `
//     /* ... */
//     let boxHtml = '<div>'
//     for (let i = 0; i < 500; i++) {
//         let itemTop = 0 + 100 * i + i * 5
//         boxHtml += `<div class="box" style="position: absolute; left: 0; top: ${itemTop}px; width: 100px; height: 100px; background-color: #ff6600;"></div>`
//     }
//     boxHtml += `</div>`
//     document.body.appendChild(ven$createElementFragment(boxHtml))
// }

// function jQueryAnimate() {
//     profile.isAnimation = true
//     window.setTimeout(() => {
//         $('.box').stop().animate(
//             {
//                 left: 1000,
//                 width: 200
//             },
//             10000,
//             'linear',
//             () => {
//                 window.clearTimeout(profile.animateCallbackTimer)
//                 profile.animateCallbackTimer = window.setTimeout(() => {
//                     profile.isAnimation = false
//                     profile.frameEcharts.setOption(createEchartsOption(profile.frames))
//                     console.log(profile.frames)
//                 }, 800)
//             }
//         )
//     }, 500)
// }

// function bindEvent() {
//     const startAnimateBtn = document.getElementById('startAnimateBtn')
//     ven$bindEvent(startAnimateBtn, 'click', function() {
//         this.style.cursor = 'default'
//         this.style.pointerEvents = 'none'
//         jQueryAnimate()
//         recordFrame()
//     })
// }

// function recordFrame() {
//     profile.frames.push(window.fpsRuntimeConfig.rAFCount)
//     if (!profile.isAnimation) {
//         return
//     }
//     window.requestAnimationFrame(recordFrame)
// }

// function createEchartsOption(seriesData) {
//     const xAxisData = []
//     seriesData.forEach((item, index) => {
//         xAxisData.push(index)
//     })
//     const option = {
//         xAxis: {
//             type: 'category',
//             data: xAxisData
//         },
//         yAxis: {
//             type: 'value',
//             data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160]
//         },
//         series: [
//             {
//                 type: 'line',
//                 smooth: true,
//                 data: seriesData
//             }
//         ]
//     }
//     return option
// }

// function initEcharts(option) {
//     profile.frameEcharts = echarts.init(document.getElementById('echartsContainer'))
// }

// function main() {
//     insertHtml()
//     bindEvent()
// }

// document.addEventListener('DOMContentLoaded', function() {
//     main()
//     initEcharts()
// })
