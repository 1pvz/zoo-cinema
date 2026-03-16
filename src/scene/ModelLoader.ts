import {
    Scene,
    Vector3,
    BoundingInfo,
    type AbstractMesh,
    type Skeleton,
    type AnimationGroup,
    type ISceneLoaderAsyncResult,
    ImportMeshAsync,
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"

export interface ModelConfig {
    [name: string]: string
}

export interface LoadedAsset {
    meshes: AbstractMesh[]
    root: AbstractMesh
    skeletons: Skeleton[]
    animationGroups: AnimationGroup[]
}

const animalModels: ModelConfig = {
    fox: 'model/fox.glb',
}

export default class ModelLoader {
    private readonly _scene: Scene
    private readonly _assets: Map<string, LoadedAsset> = new Map()

    constructor(scene: Scene) {
        this._scene = scene
    }

    async loadAnimals(): Promise<void> {
        await this.loadModels(animalModels)
    }

    async loadModels(config: ModelConfig): Promise<void> {
        const tasks = Object.entries(config).map(async ([name, path]) => {
            const result = await this._loadGlb(path)
            const root = this._findRoot(result.meshes)
            this._assets.set(name, {
                meshes: result.meshes as AbstractMesh[],
                root,
                skeletons: result.skeletons,
                animationGroups: result.animationGroups,
            })
        })
        await Promise.all(tasks)
    }

    private async _loadGlb(path: string): Promise<ISceneLoaderAsyncResult> {
        return ImportMeshAsync(path, this._scene)
    }

    private _findRoot(meshes: AbstractMesh[]): AbstractMesh {
        const root = meshes.find(m => m.parent == null)!

        let min: Vector3 | null = null
        let max: Vector3 | null = null
        for (const mesh of meshes) {
            const bb = mesh.getBoundingInfo().boundingBox
            if (min === null) {
                min = bb.minimumWorld.clone()
            }
            if (max === null) {
                max = bb.maximumWorld.clone()
            }
            min = Vector3.Minimize(min, bb.minimumWorld)
            max = Vector3.Maximize(max, bb.maximumWorld)
        }

        if (min && max) {
            root.setBoundingInfo(new BoundingInfo(min, max))
        }

        return root
    }

    get names(): string[] {
        return [...this._assets.keys()]
    }
}
