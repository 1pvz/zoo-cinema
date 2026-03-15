import { FreeCamera, Vector3 } from "@babylonjs/core";
import type ZooEngine from "./ZooEngine";

export default class ZooCamera {
    private _camera: FreeCamera

    constructor(name: string, position: Vector3, engine: ZooEngine) {
        this._camera = new FreeCamera(name, position, engine.scene)
        this._camera.setTarget(Vector3.Zero())
        this._camera.attachControl(engine.canvas, false)
    }
}
