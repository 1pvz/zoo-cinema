import {
    Scene,
    Color3,
    Vector3,
    MeshBuilder,
    StandardMaterial,
    VideoTexture,
    Mesh,
} from "@babylonjs/core"
import { AdvancedDynamicTexture, Ellipse, TextBlock } from "@babylonjs/gui"

export default class VideoScreen {
    private readonly _plane: Mesh
    private readonly _videoTexture: VideoTexture
    private readonly _pauseIcon: Ellipse
    private _focused = false

    constructor(scene: Scene, videoUrl: string) {
        this._plane = MeshBuilder.CreatePlane('videoScreen', {
            width: 160,
            height: 90,
            sideOrientation: Mesh.DOUBLESIDE,
        }, scene)
        this._plane.position = new Vector3(0, 20, 0)
        this._plane.layerMask = 0b01

        const material = new StandardMaterial('videoScreenMat', scene)
        this._videoTexture = new VideoTexture('videoTex', videoUrl, scene)
        material.diffuseTexture = this._videoTexture
        material.roughness = 1
        material.emissiveColor = Color3.White()
        this._plane.material = material

        this._pauseIcon = this._createPauseIcon(scene)

        this._setupClickToggle(scene)
        this._setupKeyToggle(scene)
    }

    private _createPauseIcon(scene: Scene): Ellipse {
        const overlay = MeshBuilder.CreatePlane('videoOverlay', {
            width: 160,
            height: 90,
            sideOrientation: Mesh.DOUBLESIDE,
        }, scene)
        overlay.position = new Vector3(0, 0, -0.1)
        overlay.layerMask = 0b01
        overlay.isPickable = false
        overlay.parent = this._plane

        const guiTexture = AdvancedDynamicTexture.CreateForMesh(overlay, 1024, 576)
        guiTexture.hasAlpha = true

        const circle = new Ellipse('pauseCircle')
        circle.width = '120px'
        circle.height = '120px'
        circle.color = 'white'
        circle.thickness = 4
        circle.background = 'rgba(0, 0, 0, 0.5)'
        circle.isVisible = false
        guiTexture.addControl(circle)

        const icon = new TextBlock('pauseText', '▶')
        icon.color = 'white'
        icon.fontSize = 60
        icon.paddingLeft = '10px'
        circle.addControl(icon)

        return circle
    }

    private _setupClickToggle(scene: Scene): void {
        this._plane.isPickable = true

        scene.onPointerDown = () => {
            const pickResult = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh === this._plane)
            if (pickResult?.hit) {
                this._focused = true
                this._toggle()
            } else {
                this._focused = false
            }
        }
    }

    private _setupKeyToggle(scene: Scene): void {
        scene.onKeyboardObservable.add((kbInfo) => {
            if (this._focused && kbInfo.type === 2 && kbInfo.event.code === 'Space') {
                kbInfo.event.preventDefault()
                this._toggle()
            }
        })
    }

    private _toggle(): void {
        const video = this._videoTexture.video
        if (video.paused) {
            video.play()
            this._pauseIcon.isVisible = false
        } else {
            video.pause()
            this._pauseIcon.isVisible = true
        }
    }

    play(): void {
        this._videoTexture.video.play()
    }

    pause(): void {
        this._videoTexture.video.pause()
    }
}
