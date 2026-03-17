import ZooEngine from "./ZooEngine"
import CinemaScene from "./scene/CinemaScene"
import Environment from "./scene/Environment"
import ModelLoader from "./scene/ModelLoader"
import Player from "./scene/Player"
import PlayerController from "./scene/PlayerController"
import VideoScreen from "./scene/VideoScreen"
import EnvironmentModel from "./scene/EnvironmentModel"

const __main = async () => {
    const canvas = document.getElementById('id-render-canvas') as HTMLCanvasElement
    const engine = ZooEngine.init(canvas)
    const cinema = new CinemaScene(engine)
    new Environment(cinema.scene)

    const modelLoader = new ModelLoader(cinema.scene)
    await modelLoader.loadAnimals()
    await modelLoader.loadEnvironments()

    const envAsset = modelLoader.getAsset('env')!
    await EnvironmentModel.create(envAsset)

    const asset = modelLoader.getAsset('fox')!
    const player = new Player(asset)
    new PlayerController(cinema.scene, player, cinema.camera)
    new VideoScreen(cinema.scene, '/video/zootopia.mp4')

    engine.startRenderLoop(cinema.scene)
}

__main()
