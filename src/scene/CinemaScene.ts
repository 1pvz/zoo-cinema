import {
    Scene,
    Color4,
    Vector3,
    ArcRotateCamera,
    HemisphericLight,
    DirectionalLight,
    CascadedShadowGenerator,
    ShadowGenerator,
    GrainPostProcess,
    TonemapPostProcess,
    TonemappingOperator,
    DefaultRenderingPipeline,
    SSAORenderingPipeline,
} from "@babylonjs/core"
import type ZooEngine from "../ZooEngine"

export default class CinemaScene {
    readonly scene: Scene
    readonly camera: ArcRotateCamera
    readonly cameraVideo: ArcRotateCamera

    constructor(zooEngine: ZooEngine) {
        this.scene = new Scene(zooEngine.engine)
        this.scene.clearColor = new Color4(1, 1, 1, 1)

        this.camera = this._createCamera('camera', zooEngine.canvas)
        this.camera.layerMask = 0b01

        this.cameraVideo = this._createCamera('cameraVideo', zooEngine.canvas)
        this.cameraVideo.layerMask = 0b10


        this.scene.activeCameras?.push(this.camera)
        this.scene.activeCameras?.push(this.cameraVideo)

        this._setupLights()
        this._setupPostProcess()
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

        const shadowLight = new DirectionalLight('shadowLight', new Vector3(-1, -2, -1), this.scene)
        shadowLight.position = new Vector3(320, 570, 370)
        shadowLight.intensity = 0.8

        const sg = new CascadedShadowGenerator(2048, shadowLight)
        sg.filter = ShadowGenerator.FILTER_PCF
        sg.bias = 0.0002

        const animalLight = new DirectionalLight('animalLight', new Vector3(-1, -2, -1), this.scene)
        animalLight.position = new Vector3(320, 570, 370)
        animalLight.intensity = 0.4
    }

    private _setupPostProcess() {
        const camera = this.camera

        const grain = new GrainPostProcess('grain', 1, camera)
        grain.samples = 4
        grain.intensity = 5

        new TonemapPostProcess('tonemap', TonemappingOperator.Photographic, 2.5, camera)

        const pipeline = new DefaultRenderingPipeline('default', true, this.scene, [camera])
        pipeline.bloomEnabled = true
        pipeline.bloomThreshold = 0.05
        pipeline.bloomWeight = 0.3
        pipeline.bloomKernel = 64
        pipeline.bloomScale = 0.5
        pipeline.imageProcessingEnabled = false

        const ssao = new SSAORenderingPipeline('ssao', this.scene, 0.75, [camera])
        ssao.totalStrength = 1.35
        ssao.base = 0.80
        ssao.radius = 0.0006
        ssao.area = 0.0015
        ssao.fallOff = 0.0000001
    }
}
