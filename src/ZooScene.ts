import { HemisphericLight, Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";
import ZooCamera from "./ZooCamera";
import type ZooEngine from "./ZooEngine";

export default class ZooScene {
    private _engine: ZooEngine
    private _camera: ZooCamera

    constructor(engine: ZooEngine) {
        this._engine = engine
        this._camera = new ZooCamera('camera1', new Vector3(0, 5, -10), engine)
        new HemisphericLight('light1', new Vector3(0, 1, 0), engine.scene)

        this.createObject()
    }

    private createObject() {
        const scene = this._engine.scene

        // Create a built-in "sphere" shape using the SphereBuilder
        const sphere = MeshBuilder.CreateSphere('sphere1', {
            segments: 16,
            diameter: 2,
            sideOrientation: Mesh.FRONTSIDE
        }, scene);
        // Move the sphere upward 1/2 of its height
        sphere.position.y = 1;

        // Create a built-in "ground" shape;
        const ground = MeshBuilder.CreateGround('ground1', {
            width: 6,
            height: 6,
            subdivisions: 2,
            updatable: false,
        }, scene);
    }
}
