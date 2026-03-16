import ZooEngine from "./ZooEngine"
import CinemaScene from "./CinemaScene";

const __main = () => {
    const canvas = document.getElementById('id-render-canvas') as HTMLCanvasElement
    const engine = ZooEngine.init(canvas);
    const cinema = new CinemaScene(engine)
    engine.startRenderLoop(cinema.scene)
}

__main()
