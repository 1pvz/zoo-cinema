import ZooEngine from "./ZooEngine"
import CinemaScene from "./scene/CinemaScene"
import Environment from "./scene/Environment"
import ModelLoader from "./scene/ModelLoader"

const __main = async () => {
    const canvas = document.getElementById('id-render-canvas') as HTMLCanvasElement
    const engine = ZooEngine.init(canvas)
    const cinema = new CinemaScene(engine)
    new Environment(cinema.scene)

    const modelLoader = new ModelLoader(cinema.scene)
    await modelLoader.loadAnimals()
    console.log('load animals', modelLoader.names)

    engine.startRenderLoop(cinema.scene)
}

__main()
