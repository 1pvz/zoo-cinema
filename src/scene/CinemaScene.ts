import {
    Scene,
    Color4,
    Vector3,
    ArcRotateCamera,
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
}
