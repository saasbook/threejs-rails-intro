import * as Three from 'three'

function main() {
    const canvas = document.getElementById("cube_canvas");

    const renderer = new Three.WebGLRenderer({canvas, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 10;


    const camera = new Three.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    //camera.position.y = -1;

    const scene = new Three.Scene();

    const color = 0xFFFFFF;
    const intensity = 1;

    const light = new Three.DirectionalLight(color, intensity);

    light.position.set(-1, 2, 4);

    scene.add(light);


    // let's make a box

    const geometry = new Three.BoxGeometry(1, 1, 1);
    const material = new Three.MeshPhongMaterial({color: 0xFAAD80});

    const box = new Three.Mesh(geometry, material);

    scene.add(box);

    // totally forgot

    //renderer.render(scene, camera);

    function render(time) {
        time *= 0.001;

        box.rotation.x = time * 0.5;
        box.rotation.y = time * 0.5;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}


main();