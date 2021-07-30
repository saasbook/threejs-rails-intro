import * as Three from 'three'

function main() {
    const canvas = document.getElementById('cube_canvas');
    let renderer = new Three.WebGLRenderer({canvas});
    const mouse = new THREE.Vector2();
    const clock = new Three.Clock();
    let raycaster = new Three.Raycaster();
    
    let scene = new Three.Scene();
    let camera = new Three.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 10000);

    const rotateY = new THREE.Matrix4().makeRotationY( 0.005 ); 
    
    const pointSize = 0.05;
    const width = 80;
    const length = 160;
    let toggle = 0;
    let spheres = [];
    let sphereIndex = 0;

    camera.position.set(10, 10, 10);
    
    camera.lookAt(scene.position);
    camera.updateMatrix();

    const points1 = generatePoints(new Three.Color(1, 0, 0), width, length);
    points1.scale.set(5, 10, 10);
    points1.position.set(-5, 0, 0)
    scene.add(points1);

    const points2 = generatePoints(new Three.Color(0, 1, 0), width, length);
    points2.scale.set(5, 10, 10);
    points2.position.set(0, 0, 0)
    scene.add(points2);

    const points3 = generatePoints(new Three.Color(0, 0, 1), width, length);
    points3.scale.set(5, 10, 10);
    points3.position.set(5, 0, 0);
    scene.add(points3);

    const points = [points1 , points2, points3];

    const sphereGeometry = new Three.SphereGeometry(0.1, 32, 32);
    const sphereMaterial = new Three.MeshBasicMaterial({color: 0xff0000});
    

    for (let i = 0; i < 40; i++) {
        const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        spheres.push(sphere);
    }


    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener( 'resize', onWindowResize );
    document.addEventListener( 'pointermove', onPointerMove );
    animate();

    function onPointerMove(event) {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.render(window.innerWidth, window.innerHeight);

    }


    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {

        camera.applyMatrix4(rotateY);

        camera.updateMatrixWorld();

        raycaster.setFromCamera( mouse, camera );
    
        const intersections = raycaster.intersectObjects( points );
        let intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;
    
        if ( toggle > 0.02 && intersection !== null ) {
    
            spheres[ sphereIndex ].position.copy( intersection.point );
            spheres[ sphereIndex ].scale.set( 1, 1, 1 );
            sphereIndex = ( sphereIndex + 1 ) % spheres.length;
    
            toggle = 0;
    
        }
    
        for ( let i = 0; i < spheres.length; i ++ ) {
    
            const sphere = spheres[ i ];
            sphere.scale.multiplyScalar( 0.98 );
            sphere.scale.clampScalar( 0.01, 1 );
    
        }
    
        toggle += clock.getDelta();
    
        renderer.render( scene, camera );
    }


    function generatePoints(color, width, length) {

        const geometry = customGeometry(width, length, color);
        const material = new Three.PointsMaterial({size: pointSize, vertexColors: true});

        return new Three.Points(geometry, material);
    }

    function customGeometry(width, length, color) {
        const geometry = new Three.BufferGeometry();
        const numPoints = width * length;

        const positions = new Float32Array(numPoints * 3); 
        const colors = new Float32Array(numPoints * 3);

        let curr = 0; 

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < length; j++) {
                const u = i / width;
                const v = j / length;

                const x = u - 0.5;
                const y = (Math.cos(u * Math.PI * 4) + Math.sin(v * Math.PI * 8)) / 20;
                const z = v - 0.5;

                positions[3 * curr] = x;
                positions[3 * curr + 1] = y;
                positions[3 * curr + 2] = z;

                const intensity = (y + 0.1) * 5;
                colors[3 * curr] = color.r * intensity;
                colors[3 * curr + 1] = color.g * intensity;
                colors[3 * curr + 2] = color.b * intensity;

                curr++;
            }
        }
        console.log(positions);
        geometry.setAttribute('position', new Three.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new Three.BufferAttribute(colors, 3));
        geometry.computeBoundingBox();
        return geometry;

    }

}

main();

