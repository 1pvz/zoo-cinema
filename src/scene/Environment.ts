import {
    Scene,
    Color3,
    MeshBuilder,
    StandardMaterial,
    Texture,
    CubeTexture,
    Animation,
} from "@babylonjs/core"

export default class Environment {
    constructor(scene: Scene) {
        this._setupSkyBox(scene)
    }
    
    private _setupSkyBox(scene: Scene): void {
        const skybox = MeshBuilder.CreateBox('skyBox', { size: 6000 }, scene)
        skybox.layerMask = 0b01

        const material = new StandardMaterial('skyBoxMat', scene)
        material.backFaceCulling = false
        material.reflectionTexture = new CubeTexture('texture/skybox/skybox', scene)
        material.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE
        material.diffuseColor = new Color3(0, 0, 0)
        material.specularColor = new Color3(0, 0, 0)
        skybox.material = material

        const frameRate = 0.001
        const keyFrames = [
            {
                frame: 0,
                value: 0,
            },
            {
                frame: 1,
                value: Math.PI * 2,
            },
        ]

        const animY = new Animation(
            'skyRotateY',
            'rotation.y',
            frameRate,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE,
        )
        animY.setKeys(keyFrames)

        const animX = new Animation(
            'skyRotateX',
            'rotation.x',
            frameRate,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE,
        )
        animX.setKeys(keyFrames)

        skybox.animations.push(animY)
        skybox.animations.push(animX)
        scene.beginAnimation(skybox, 0, keyFrames.length, true)
    }
}
