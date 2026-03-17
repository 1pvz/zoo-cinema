import {
    type Scene,
    type ArcRotateCamera,
    Vector3,
    ActionManager,
    ExecuteCodeAction,
} from "@babylonjs/core"
import type Player from "./Player"

export default class PlayerController {
    private readonly _scene: Scene
    private readonly _player: Player
    private readonly _camera: ArcRotateCamera
    private readonly _inputMap: Record<string, boolean> = {}

    constructor(scene: Scene, player: Player, camera: ArcRotateCamera) {
        this._scene = scene
        this._player = player
        this._camera = camera

        this._setupInput()

        this._scene.onBeforeRenderObservable.add(() => {
            this._update()
        })
    }

    private _setupInput() {
        this._scene.actionManager = new ActionManager(this._scene)

        this._scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
                this._inputMap[event.sourceEvent.key] = true
            })
        )

        this._scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
                this._inputMap[event.sourceEvent.key] = false
                if (event.sourceEvent.key === 'r') {
                    this._player.running = !this._player.running
                }
            })
        )
    }

    private _updateCamera() {
        const pos = this._player.mesh.position
        this._camera.target = new Vector3(pos.x, pos.y + 15, pos.z)
    }

    private _update() {
        this._player.updateTransform(this._inputMap, this._camera)
        this._player.updateStatus(this._inputMap)
        this._updateCamera()
    }
}
