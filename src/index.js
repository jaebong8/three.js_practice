import * as THREE from 'three'
import { WEBGL } from './webgl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// if (WEBGL.isWebGLAvailable()) {
//   const scene = new THREE.Scene()
//   scene.background = new THREE.Color(0xeeeeee)
//   const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   )

//   const renderer = new THREE.WebGLRenderer({
//     antialias: true,
//     alpha: true,
//   })
//   renderer.setSize(window.innerWidth, window.innerHeight)

//   function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//   }
//   window.addEventListener('resize', onWindowResize)
//   camera.position.z = 3

//   const pointLight = new THREE.PointLight(0xffffff, 1)
//   pointLight.position.set(0, 2, 12)
//   scene.add(pointLight)

//   const textureLoader = new THREE.TextureLoader()
//   const textureBaseColor = textureLoader.load(
//     '../static/textures/basecolor.jpg'
//   )
//   const textureHeight = textureLoader.load('../static/textures/height.png')
//   const textureNormal = textureLoader.load('../static/textures/normal.jpg')
//   const textureRoughness = textureLoader.load(
//     '../static/textures/roughness.jpg'
//   )

//   // 도형 추가
//   const geometry1 = new THREE.SphereGeometry(0.4, 32, 16)
//   const material1 = new THREE.MeshStandardMaterial({
//     map: textureBaseColor,
//   })
//   const obj1 = new THREE.Mesh(geometry1, material1)

//   obj1.position.x = -2

//   const geometry2 = new THREE.SphereGeometry(0.4, 32, 16)
//   const material2 = new THREE.MeshStandardMaterial({
//     map: textureBaseColor,
//     normalMap: textureNormal,
//     displacementMap: textureHeight,
//     displacementScale: 0.08,
//   })
//   const obj2 = new THREE.Mesh(geometry2, material2)

//   obj2.position.x = -1

//   const geometry3 = new THREE.SphereGeometry(0.4, 32, 16)
//   const material3 = new THREE.MeshStandardMaterial({
//     map: textureBaseColor,
//     normalMap: textureNormal,
//     displacementMap: textureHeight,
//     displacementScale: 0.08,
//     roughnessMap: textureRoughness,
//     roughness: 0.5,
//   })
//   const obj3 = new THREE.Mesh(geometry3, material3)

//   const geometry4 = new THREE.TorusGeometry(0.3, 0.15, 16, 40)
//   const material4 = new THREE.MeshLambertMaterial({
//     color: 0xff7f00,
//   })
//   const obj4 = new THREE.Mesh(geometry4, material4)

//   obj4.position.x = 1

//   const geometry5 = new THREE.TorusGeometry(0.3, 0.15, 16, 40)
//   const material5 = new THREE.MeshPhongMaterial({
//     color: 0xff7f00,
//     shininess: 90,
//     specular: 0x004fff,
//   })
//   const obj5 = new THREE.Mesh(geometry5, material5)

//   obj5.position.x = 2

//   function render(time) {
//     time *= 0.0009
//     obj1.rotation.y = time
//     obj2.rotation.y = time
//     obj3.rotation.y = time
//     obj4.rotation.y = time
//     obj5.rotation.y = time
//     renderer.render(scene, camera)
//     requestAnimationFrame(render)
//   }
//   scene.add(obj1)
//   scene.add(obj2)
//   scene.add(obj3)
//   scene.add(obj4)
//   scene.add(obj5)

//   requestAnimationFrame(render)
//   document.body.appendChild(renderer.domElement)
// } else {
//   var warning = WEBGL.getWebGLErrorMessage()
//   document.body.appendChild(warning)
// }

// if (WEBGL.isWebGLAvailable()) {
//   const scene = new THREE.Scene()
//   scene.background = new THREE.Color(0xeeeeee)
//   const renderer = new THREE.WebGLRenderer({
//     antialias: true,
//     alpha: true,
//   })
//   document.body.appendChild(renderer.domElement)
//   renderer.shadowMap.enabled = true
//   //camera
//   const fov = 47
//   const aspect = window.innerWidth / window.innerHeight
//   const near = 0.1
//   const far = 1000
//   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
//   camera.position.set(2, 1, 5)
//   camera.lookAt(new THREE.Vector3(0, 0, 0))

//   renderer.setSize(window.innerWidth, window.innerHeight)

//   function onWindowResize() {
//     camera.aspect = aspect
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//   }
//   window.addEventListener('resize', onWindowResize)

//   //light
//   const pointLight = new THREE.PointLight(0xffffff, 1)
//   const pointLight2 = new THREE.PointLight(0xffffff, 1)
//   const ambientLight = new THREE.AmbientLight(0xffffff, 1)
//   const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
//   const dlHelper = new THREE.DirectionalLightHelper(
//     directionalLight,
//     0.5,
//     0x0000ff
//   )
//   const plHelper = new THREE.PointLightHelper(pointLight, 0.1)
//   const plHelper2 = new THREE.PointLightHelper(pointLight2, 0.1)
//   pointLight.position.set(1, 2, 0)
//   pointLight2.position.set(1.5, 1.5, -1)
//   directionalLight.position.set(1, 1, -0.3)
//   // scene.add(directionalLight)
//   // scene.add(dlHelper)
//   scene.add(pointLight2)
//   scene.add(plHelper)
//   scene.add(plHelper2)
//   pointLight2.castShadow = true
//   pointLight2.shadow.radius = 8
//   directionalLight.shadow.mapSize.width = 1024
//   directionalLight.shadow.mapSize.height = 1024

//   //도형
//   const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5)
//   const geometry = new THREE.SphereGeometry(0.5, 32, 16)
//   const material = new THREE.MeshStandardMaterial({
//     color: 0xff7f00,
//   })
//   const obj = new THREE.Mesh(geometry, material)
//   const obj2 = new THREE.Mesh(geometry2, material)
//   obj2.position.set(0.9, 0.9, 0)
//   obj.position.set(0, 0.1, 0)
//   scene.add(obj)
//   scene.add(obj2)
//   obj.castShadow = true
//   obj.receiveShadow = true
//   obj2.castShadow = true

//   //바닥
//   const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1)
//   const planeMaterial = new THREE.MeshStandardMaterial({
//     color: 0x008040,
//   })
//   const plane = new THREE.Mesh(planeGeometry, planeMaterial)
//   plane.rotation.x = -0.5 * Math.PI
//   plane.position.y = -0.5
//   scene.add(plane)
//   plane.receiveShadow = true

//   function render(time) {
//     renderer.render(scene, camera)
//   }
//   requestAnimationFrame(render)
// } else {
//   var warning = WEBGL.getWebGLErrorMessage()
//   document.body.appendChild(warning)
// }

if (WEBGL.isWebGLAvailable()) {
  const fogColor = 0x888888
  const objColor = 0xffffff
  const floorColor = 0x555555
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(floorColor)
  // scene.fog = new THREE.Fog(fogColor, 1, 3)
  scene.fog = new THREE.FogExp2(fogColor, 0.7)
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  document.body.appendChild(renderer.domElement)
  renderer.shadowMap.enabled = true
  //camera
  const fov = 80
  const aspect = window.innerWidth / window.innerHeight
  const near = 0.1
  const far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 0.5, 1.5)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  renderer.setSize(window.innerWidth, window.innerHeight)
  const controls = new OrbitControls(camera, renderer.domElement)

  // controls.minDistance = 3
  // controls.maxDistance = 6
  // controls.maxPolarAngle = Math.PI / 2 - 0.1
  controls.enableDamping = true
  function onWindowResize() {
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onWindowResize)

  const pointLight = new THREE.PointLight(0xffffff, 1)

  pointLight.position.set(0, 0, 1)
  scene.add(pointLight)

  //도형
  const geometry = new THREE.TorusGeometry(0.3, 0.15, 16, 40)
  const material = new THREE.MeshStandardMaterial({
    color: objColor,
  })
  const obj = new THREE.Mesh(geometry, material)
  obj.position.set(0, 0.2, 0)
  scene.add(obj)

  //바닥
  const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1)
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: floorColor,
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.y = -0.5
  scene.add(plane)
  plane.receiveShadow = true
  controls.update()
  function render(time) {
    renderer.render(scene, camera)
    obj.rotation.y += 0.01
    controls.update()
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
