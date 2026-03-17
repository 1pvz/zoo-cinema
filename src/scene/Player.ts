import {
    type AbstractMesh,
    type Skeleton,
    type AnimationGroup,
    type ArcRotateCamera,
    Vector3,
    Quaternion,
} from "@babylonjs/core"
import type { LoadedAsset } from "./ModelLoader"

type PlayerStatus = 'idle' | 'walk' | 'run'

export default class Player {
    readonly mesh: AbstractMesh
    readonly skeletons: Skeleton[]
    readonly animationGroups: AnimationGroup[]
    readonly animations: {
        idle: AnimationGroup
        walk: AnimationGroup
        run: AnimationGroup
    }

    status: PlayerStatus = 'idle'
    moveSpeed = 0.2
    running = false

    constructor(asset: LoadedAsset) {
        this.mesh = asset.root
        this.skeletons = asset.skeletons
        this.animationGroups = asset.animationGroups

        this.animations = {
            idle: this._findAnimation('Rig|Idle'),
            walk: this._findAnimation('Rig|Walk'),
            run: this._findAnimation('Rig|Run'),
        }

        this.mesh.scaling.scaleInPlace(2)
        this.mesh.position = Vector3.Zero()
        this.mesh.rotationQuaternion = Quaternion.Identity()

        this.animations.idle.start(true)
    }

    updateTransform(inputMap: Record<string, boolean>, camera: ArcRotateCamera) {
        const moveSpeed = this.moveSpeed

        if (inputMap['w'] || inputMap['a'] || inputMap['s'] || inputMap['d'] || inputMap['q'] || inputMap['e']) {
            let v: Vector3
            if (inputMap['w']) {
                v = new Vector3(-moveSpeed, 0, 0)
            } else if (inputMap['s']) {
                v = new Vector3(moveSpeed, 0, 0)
            } else if (inputMap['a']) {
                v = new Vector3(0, 0, -moveSpeed)
            } else if (inputMap['d']) {
                v = new Vector3(0, 0, moveSpeed)
            } else if (inputMap['q']) {
                v = new Vector3(0, moveSpeed, 0)
            } else {
                v = new Vector3(0, -moveSpeed, 0)
            }

            const quat = Quaternion.FromEulerAngles(0, -camera.alpha, 0)
            const rotated = Vector3.Zero()
            v.rotateByQuaternionToRef(quat, rotated)
            this.mesh.position.addInPlace(rotated)
        }

        if (inputMap['w'] || inputMap['a'] || inputMap['s'] || inputMap['d']) {
            let angle: number
            if (inputMap['w']) {
                angle = Math.PI / 2
            } else if (inputMap['a']) {
                angle = 0
            } else if (inputMap['s']) {
                angle = 3 * Math.PI / 2
            } else {
                angle = Math.PI
            }

            angle -= camera.alpha
            const target = Quaternion.FromEulerAngles(0, angle, 0)
            const current = this.mesh.rotationQuaternion!
            this.mesh.rotationQuaternion = Quaternion.Slerp(current, target, 0.1)
        }
    }

    updateStatus(inputMap: Record<string, boolean>) {
        const moving = inputMap['w'] || inputMap['a'] || inputMap['s'] || inputMap['d']

        let newStatus: PlayerStatus
        if (moving) {
            if (this.running) {
                newStatus = 'run'
                this.moveSpeed = 0.5
            } else {
                newStatus = 'walk'
                this.moveSpeed = 0.2
            }
        } else {
            newStatus = 'idle'
        }

        if (newStatus !== this.status) {
            this.animations[this.status].stop()
            this.status = newStatus
            this.animations[this.status].start(true)
        }
    }

    private _findAnimation(name: string): AnimationGroup {
        const group = this.animationGroups.find(g => g.name === name)
        if (!group) {
            throw new Error(`Animation "${name}" not found`)
        }
        return group
    }
}
