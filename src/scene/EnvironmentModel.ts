import {
    type AbstractMesh,
    Mesh,
    Vector3,
    Matrix,
} from "@babylonjs/core"
import type { LoadedAsset } from "./ModelLoader"

interface InstanceData {
    p: { x: number; y: number; z: number }
    r: { x: number; y: number; z: number }
    s: { x: number; y: number; z: number }
    t: string
}

const MESH_TYPES = [
    'Tree_A1',
    'Tree_B1_9m_01',
    'Tree_B1_9m_02',
    'Tree_C1_9',
    'Tree_C1_11',
    'Rock_Boulder',
    'Rock_Wall',
    'Grass_A1_40',
    'Grass_A1_50',
    'Flower',
    'Ground',
]

export default class EnvironmentModel {
    static async create(asset: LoadedAsset): Promise<EnvironmentModel> {
        const r = await fetch('/environmentData.json')
        const data: InstanceData[] = await r.json()
        return new EnvironmentModel(asset, data)
    }

    private constructor(asset: LoadedAsset, data: InstanceData[]) {
        const root = asset.root
        root.scaling.scaleInPlace(7)

        const meshMap = new Map<string, AbstractMesh>()
        for (const mesh of asset.meshes) {
            for (const type of MESH_TYPES) {
                if (mesh.name.includes(type)) {
                    meshMap.set(type, mesh)
                    break
                }
            }
            mesh.receiveShadows = true
            mesh.position = Vector3.Zero()
            mesh.rotation = Vector3.Zero()
            mesh.layerMask = 0b01
        }

        for (const d of data) {
            const mesh = meshMap.get(d.t) as Mesh
            if (!mesh) {
                continue
            }

            const m1 = Matrix.Translation(d.p.x, d.p.y, d.p.z)
            const m2 = Matrix.Scaling(d.s.x, d.s.y, d.s.z)
            const m3 = Matrix.RotationX(d.r.x)
            const m4 = Matrix.RotationY(d.r.y)
            const m5 = Matrix.RotationZ(d.r.z)

            const matrix = m3.multiply(m4).multiply(m5).multiply(m2).multiply(m1)
            mesh.thinInstanceAdd(matrix)
        }
    }
}
