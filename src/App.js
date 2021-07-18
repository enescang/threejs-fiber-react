import ReactDOM from 'react-dom'
import React, { Suspense, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber'
import { OrbitControls as OrbitoControl } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {CubeTextureLoader} from 'three'
import * as THREE from 'three/build/three.module'
import Model from './Scene';
import RangeRover from './RangeRover';
import {OrbitControls, PerspectiveCamera, Sky, Stars} from '@react-three/drei'

extend({ OrbitControls });

function SkyBox() {
    const { scene } = useThree();
    // const loader = new CubeTextureLoader();  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.  
    // const texture = loader.load([
    //     "assets/images/space/1.jpg",
    //     "assets/images/space/2.jpg",
    //     "assets/images/space/3.jpg",
    //     "assets/images/space/4.jpg",
    //     "assets/images/space/5.jpg",
    //     "assets/images/space/6.jpg",
    // ]);  // Set the scene background property to the resulting texture.  
    const space_texture = useLoader(THREE.TextureLoader, "assets/images/space/5.jpg")

    scene.background = space_texture;
    return null;
}

function Box(props) {
    // This reference will give us direct access to the THREE.Mesh object
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

const CameraControls = () => {
    const { camera, gl: { domElement } } = useThree();
    camera.position.set(100,49,120)

    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef();
    useFrame((state) => controls.current.update());
    return (
        <orbitControls
            ref={controls}
            args={[camera, domElement]}
            enableZoom={true}
            position={[10, 7, 5]}

        // maxAzimuthAngle={Math.PI / 4} 
        // maxPolarAngle={Math.PI} 
        // minAzimuthAngle={-Math.PI / 4} 
        // minPolarAngle={0} 
        />
    );
};

const Orbi =()=>{
    const { camera, gl: { domElement } } = useThree();
    camera.position.set(100,49,120)

    return (
        <>
        <PerspectiveCamera ref={camera} position={[0, 5, 5]} />
            <OrbitControls camera={camera} />
        </>
    )
}

const GrassTerrain = ()=>{
    const {scene} = useThree()
    const groundTexture = useLoader(THREE.TextureLoader, 'assets/terrain/grasslight.jpg' );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    const groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

    let mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = - 79;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    return null;
}

const APP = () => {
    const style3 = {
        height: "75px",
    };
    const flexer = {
        border: "1px solid black",
        display: "flex",
        flexWrap: "wrap",
    }
    const [carColor, setCarColor] = useState(null)
    const [carTexture, setCarTexture] = useState(null)


    return (
        <>
            <Canvas style={{  height: window.innerHeight - 100, width: window.innerWidth }}>
                <ambientLight />
                {/* <CameraControls /> */}
                <Orbi />
                {/* <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} /> */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
               
                <directionalLight castShadow={true} position={[0, 1, 0]} />
                <pointLight position={[0, 300, 500]} intensity={0.01} />
                <pointLight position={[-20, 0, -90]} />
                <pointLight position={[0, 100, -500]} />
                <pointLight position={[-500, 300, 500]} />
                {/* <SkyBox /> */}
                <Suspense fallback={<Box />}>
                    <RangeRover
                        position={[-1.4, -1.1, -0.4]}
                        carColor={carColor}
                        carTexture={carTexture}
                    />
                    {/* <Model
                    position={[-1.4, -1.1, -0.4]}
                    carColor = {carColor}
                    carTexture = {carTexture}
                    /> */}
                     {/* <GrassTerrain /> */}
                </Suspense>

            </Canvas>

            <div style={flexer}>
                <div onClick={() => { setCarColor("#fbda74") }} style={{ width: "60px", height: "60px", backgroundColor: "#fbda74", margin: "4px" }}>A</div>
                <div onClick={() => { setCarColor("#db3434") }} style={{ width: "60px", height: "60px", backgroundColor: "#db3434", margin: "4px" }}>A</div>
                <div onClick={() => { setCarTexture("brown_dot") }} style={{ width: "60px", height: "60px", backgroundColor: "#db3434", margin: "4px" }}>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/brown-dot.png`} width={"60px"} height={"60px"} ></img>
                </div>
                <div onClick={() => { setCarTexture("point") }} style={{ width: "60px", height: "60px", backgroundColor: "#db3434", margin: "4px" }}>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/point.png`} width={"60px"} height={"60px"} ></img>
                </div>
                <div onClick={() => { setCarTexture("space") }} style={{ width: "60px", height: "60px", backgroundColor: "#db3434", margin: "4px" }}>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/space/4.jpg`} width={"60px"} height={"60px"} ></img>
                </div>
            </div>
        </>
    )
}

export default APP