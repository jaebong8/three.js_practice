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
