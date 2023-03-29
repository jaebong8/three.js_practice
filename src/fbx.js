import * as THREE from 'three'
import { WEBGL } from './webgl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

if (WEBGL.isWebGLAvailable()) {
  const floorColor = 0x555555
  const scene = new THREE.Scene()
  let mixer
  const clock = new THREE.Clock()
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
  camera.position.set(0, 0, 2)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  scene.add(camera)

  const ambientLight = new THREE.DirectionalLight(0xffffff, 1)
  const lightHelper = new THREE.DirectionalLightHelper(
    ambientLight,
    0.5,
    '0x0000ff'
  )
  ambientLight.position.set(-1, 2, 3)
  scene.add(ambientLight)
  scene.add(lightHelper)
  renderer.setSize(window.innerWidth, window.innerHeight)
  const controls = new OrbitControls(camera, renderer.domElement)
  //   controls.enableDamping = true
  //   controls.minDistance = 20
  //   controls.maxDistance = 800
  // controls.maxPolarAngle = Math.PI / 2 - 0.1

  function render(time) {
    time *= 0.001
    renderer.render(scene, camera)
    const delta = clock.getDelta()
    if (mixer) {
      mixer.update(delta)
    }
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  function onWindowResize() {
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onWindowResize)

  const loader = new FBXLoader()
  loader.load('../static/dancing.fbx', (object) => {
    mixer = new THREE.AnimationMixer(object)
    const action = mixer.clipAction(object.animations[0])
    action.play()
    scene.add(object)
    zoomFit(object, camera, 'Z', true)
  })
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}

const zoomFit = (object3D, camera, viewMode, bFront) => {
  const box = new THREE.Box3().setFromObject(object3D)
  const sizeBox = box.getSize(new THREE.Vector3()).length()
  const centerBox = box.getCenter(new THREE.Vector3())

  let offsetX = 0,
    offsetY = 0,
    offsetZ = 0
  viewMode === 'X'
    ? (offsetX = 1)
    : viewMode === 'Y'
    ? (offsetY = 1)
    : (offsetZ = 1)

  if (!bFront) {
    offsetX *= -1
    offsetY *= -1
    offsetZ *= -1
  }
  camera.position.set(
    centerBox.x + offsetX,
    centerBox.y + offsetY,
    centerBox.z + offsetZ
  )

  const halfSizeModel = sizeBox * 0.5
  const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5)
  const distance = halfSizeModel / Math.tan(halfFov)
  const direction = new THREE.Vector3()
    .subVectors(camera.position, centerBox)
    .normalize()
  const position = direction.multiplyScalar(distance).add(centerBox)

  camera.position.copy(position)
  camera.near = sizeBox / 100
  camera.far = sizeBox * 100

  camera.updateProjectionMatrix()

  camera.lookAt(centerBox.x, centerBox.y, centerBox.z)
  controls.target.set(centerBox.x, centerBox.y, centerBox.z)
}
