import { FreeCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import type ZooEngine from "./ZooEngine";

export default class CinemaScene {
    readonly scene: Scene
    private _camera: FreeCamera

    constructor(zooEngine: ZooEngine) {
        this.scene = new Scene(zooEngine.engine)
        this._camera = this._createCamera('camera1', zooEngine.canvas)
        this._setupLights()
        this.createObject()
        this._setupGround()
    }

    private _createCamera(name: string, canvas: HTMLCanvasElement) {
        const c = new FreeCamera(name, new Vector3(0, 5, -10), this.scene)
        c.setTarget(Vector3.Zero())
        c.attachControl(canvas, false)
        return c
    }

    private _setupLights() {
        new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene)
    }

    private _setupGround() {
        // Create a built-in "ground" shape;
        const ground = MeshBuilder.CreateGround('ground1', {
            width: 6,
            height: 6,
            subdivisions: 2,
            updatable: false,
        }, this.scene);
    }

    private createObject() {
        const scene = this.scene

        // Create a built-in "sphere" shape using the SphereBuilder
        const sphere = MeshBuilder.CreateSphere('sphere1', {
            segments: 16,
            diameter: 2,
            sideOrientation: Mesh.FRONTSIDE
        }, scene);
        // Move the sphere upward 1/2 of its height
        sphere.position.y = 1;
    }
}
