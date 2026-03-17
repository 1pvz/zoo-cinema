import {
    type Scene,
    type Engine,
    EngineInstrumentation,
} from "@babylonjs/core"
import {
    AdvancedDynamicTexture,
    StackPanel,
    TextBlock,
    Control,
} from "@babylonjs/gui"

export default class PerfMonitor {
    constructor(engine: Engine, scene: Scene) {
        const instrumentation = new EngineInstrumentation(engine)
        instrumentation.captureGPUFrameTime = true
        instrumentation.captureShaderCompilationTime = true

        const ui = AdvancedDynamicTexture.CreateFullscreenUI("perfUI", true, scene)
        if (ui.layer) {
            ui.layer.layerMask = 0b01
        }
        const panel = new StackPanel()
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        panel.isVertical = true
        ui.addControl(panel)

        const createLabel = (): TextBlock => {
            const tb = new TextBlock()
            tb.color = "white"
            tb.fontSize = 16
            tb.height = "30px"
            tb.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
            tb.paddingRight = "10px"
            panel.addControl(tb)
            return tb
        }

        const texts = Array.from({ length: 5 }, createLabel)

        scene.onBeforeRenderObservable.add(() => {
            texts[0].text = "current frame time (GPU): " + (instrumentation.gpuFrameTimeCounter.current * 0.000001).toFixed(2) + "ms"
            texts[1].text = "average frame time (GPU): " + (instrumentation.gpuFrameTimeCounter.average * 0.000001).toFixed(2) + "ms"
            texts[2].text = "total shader compilation time: " + (instrumentation.shaderCompilationTimeCounter.total).toFixed(2) + "ms"
            texts[3].text = "average shader compilation time: " + (instrumentation.shaderCompilationTimeCounter.average).toFixed(2) + "ms"
            texts[4].text = "compiler shaders count: " + instrumentation.shaderCompilationTimeCounter.count
        })
    }
}
