import {
    Scene,
    Color4,
    Vector3,
    ArcRotateCamera,
    HemisphericLight,
} from "@babylonjs/core"
import type ZooEngine from "../ZooEngine"

export default class CinemaScene {
    readonly scene: Scene
    readonly camera: ArcRotateCamera

    constructor(zooEngine: ZooEngine) {
        this.scene = new Scene(zooEngine.engine)
        this.scene.clearColor = new Color4(1, 1, 1, 1)

        this.camera = this._createCamera('camera', zooEngine.canvas)
        this.camera.layerMask = 0b01

        this.scene.activeCameras?.push(this.camera)

        this._setupLights()
    }

    private _createCamera(name: string, canvas: HTMLCanvasElement): ArcRotateCamera {
        const camera = new ArcRotateCamera(name, 4.5, 2, 60, Vector3.Zero(), this.scene)
        camera.attachControl(canvas, true)
        camera.lowerBetaLimit = 0
        camera.upperBetaLimit = Math.PI / 2 + 0.25
        camera.inertia = 0
        camera.angularSensibilityX = 150
        camera.angularSensibilityY = 150
        return camera
    }

    private _setupLights() {
        const ambient = new HemisphericLight('ambient', new Vector3(0, 1, 0), this.scene)
        ambient.intensity = 0.5
    }
}
