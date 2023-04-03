import * as THREE from 'three'
import { WEBGL } from './webgl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

if (WEBGL.isWebGLAvailable()) {
  const floorColor = 0x555555
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(floorColor)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  document.body.appendChild(renderer.domElement)

  const axesHelper = new THREE.AxesHelper(3)
  scene.add(axesHelper)

  //camera
  const fov = 50
  const aspect = window.innerWidth / window.innerHeight
  const near = 1
  const far = 4000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 0, 10)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  scene.add(camera)

  const ambientLight = new THREE.DirectionalLight(0xffffff, 1)
  const lightHelper = new THREE.DirectionalLightHelper(
    ambientLight,
    0.5,
    '0x0000ff'
  )
  ambientLight.position.set(-1, 2, 4)
  scene.add(ambientLight)
  scene.add(lightHelper)
  renderer.setSize(window.innerWidth, window.innerHeight)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  //   controls.minDistance = 20
  //   controls.maxDistance = 800
  // controls.maxPolarAngle = Math.PI / 2 - 0.1

  controls.update()
  function render(time) {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  function onWindowResize() {
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onWindowResize)
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}

// class App {
//   constructor() {
//     const renderer = new THREE.WebGLRenderer({ antialias: true })
//     renderer.setPixelRatio(window.devicePixelRatio)
//     document.body.appendChild(renderer.domElement)

//     this._renderer = renderer

//     const scene = new THREE.Scene()
//     this._scene = scene

//     this._setupCamera()
//     this._setupLight()
//     this._setupModel()
//     this._setupControls()

//     window.onresize = this.resize.bind(this)
//     this.resize()

//     requestAnimationFrame(this.render.bind(this))
//   }

//   _setupControls() {
//     new OrbitControls(this._camera, this._renderer.domElement)
//   }

//   _setupModel() {}

//   _setupCamera() {
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       100
//     )

//     camera.position.set(0, 4, 9)
//     this._camera = camera
//   }

//   _setupLight() {
//     this._scene.add(new THREE.AmbientLight(0xffffff, 0.2))

//     const color = 0xffffff
//     const intensity = 5
//     const light = new THREE.DirectionalLight(color, intensity)
//     light.position.set(-1, 2, 4)
//     this._scene.add(light)
//   }

//   update(time) {
//     time *= 0.001 // second unit
//   }

//   render(time) {
//     this._renderer.render(this._scene, this._camera)
//     this.update(time)

//     requestAnimationFrame(this.render.bind(this))
//   }

//   resize() {
//     const width = window.innerWidth
//     const height = window.innerHeight

//     this._camera.aspect = width / height
//     this._camera.updateProjectionMatrix()

//     this._renderer.setSize(width, height)
//   }
// }

// window.onload = function () {
//   new App()
// }
