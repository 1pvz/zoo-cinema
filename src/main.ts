import ZooEngine from "./ZooEngine"
import CinemaScene from "./scene/CinemaScene"
import Environment from "./scene/Environment"

const __main = () => {
    const canvas = document.getElementById('id-render-canvas') as HTMLCanvasElement
    const engine = ZooEngine.init(canvas)
    const cinema = new CinemaScene(engine)
    new Environment(cinema.scene)
    engine.startRenderLoop(cinema.scene)
}

__main()
