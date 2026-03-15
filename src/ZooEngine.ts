import { Engine, Scene } from "@babylonjs/core"

export default class ZooEngine {
    private static _instance: ZooEngine | null = null
    readonly canvas: HTMLCanvasElement
    readonly engine: Engine
    readonly scene: Scene

    private constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.engine = new Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            disableWebGL2Support: false,
        })
        this.scene = new Scene(this.engine)

        window.addEventListener('resize', () => {
            this.engine.resize()
        })
    }

    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.scene.render()
        })
    }

    static init(canvas: HTMLCanvasElement) {
        if (this._instance === null) {
            this._instance = new ZooEngine(canvas)
        }
        return this._instance
    }

    static getInstance() {
        return this._instance
    }
}
