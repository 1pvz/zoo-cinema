import ZooEngine from "./ZooEngine"
import ZooScene from "./ZooScene";

const __main = () => {
    // Get the canvas DOM element
    const canvas = document.getElementById('id-render-canvas') as HTMLCanvasElement
    // Load the 3D engine
    // var engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    const engine = ZooEngine.init(canvas);
    // CreateScene function that creates and return the scene
    // var createScene = function(){
    //     // Create a basic BJS Scene object
    //     var scene = engine.scene
    //     // // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    //     // var camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
    //     // // Target the camera to scene origin
    //     // camera.setTarget(Vector3.Zero());
    //     // // Attach the camera to the canvas
    //     // camera.attachControl(canvas, false);
    //     const camera = new ZooCamera('camera1', new Vector3(0, 5, -10), engine)
    //     // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    //     var light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
    //     // Create a built-in "sphere" shape using the SphereBuilder
    //     var sphere = MeshBuilder.CreateSphere('sphere1', {segments: 16, diameter: 2, sideOrientation: Mesh.FRONTSIDE}, scene);
    //     // Move the sphere upward 1/2 of its height
    //     sphere.position.y = 1;
    //     // Create a built-in "ground" shape;
    //     var ground = MeshBuilder.CreateGround("ground1", { width: 6, height: 6, subdivisions: 2, updatable: false }, scene);
    //     // Return the created scene
    //     return scene;
    // }
    // // call the createScene function
    // var scene = createScene();
    const scene = new ZooScene(engine)
    // run the render loop
    // engine.runRenderLoop(function(){
    //     scene.render();
    // });
    // the canvas/window resize event handler
    // window.addEventListener('resize', function(){
    //     engine.resize();
    // });
    engine.startRenderLoop()
}

__main()
