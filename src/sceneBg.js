import * as THREE from 'three'
import { WEBGL } from './webgl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

if (WEBGL.isWebGLAvailable()) {
  const floorColor = 0x000000
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
  camera.position.set(0, 0, 80)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  scene.add(camera)

  const ambientLight = new THREE.DirectionalLight(0xffffff, 1.5)
  const lightHelper = new THREE.DirectionalLightHelper(
    ambientLight,
    0.5,
    '0x0000ff'
  )
  ambientLight.position.set(-1, 2, 20)
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

  const setupModel = () => {
    const pmremG = new THREE.PMREMGenerator(renderer)
    const renderTarget = pmremG.fromCubemap(scene.background)
    const geometry = new THREE.SphereGeometry()

    const material = new THREE.MeshStandardMaterial({
      color: '#2ecc71',
      roughness: 0,
      metalness: 1,
      envMap: renderTarget.texture,
    })
    const material2 = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0,
      metalness: 1,
      envMap: renderTarget.texture,
    })

    const [rangeMin, rangeMax] = [-20.0, 20.0]
    const gap = 10.0

    let flag = true

    for (let x = rangeMin; x <= rangeMax; x += gap) {
      for (let y = rangeMin; y <= rangeMax; y += gap) {
        for (let z = rangeMin * 10; z <= rangeMax; z += gap) {
          flag = !flag

          const mesh = new THREE.Mesh(geometry, flag ? material : material2)
          mesh.position.set(x, y, z)
          scene.add(mesh)
        }
      }
    }
  }

  //   큐브맵
  const loader = new THREE.CubeTextureLoader()
  loader.load(
    [
      '../static/skybox/bay_ft.jpg',
      '../static/skybox/bay_bk.jpg',
      '../static/skybox/bay_up.jpg',
      '../static/skybox/bay_dn.jpg',
      '../static/skybox/bay_rt.jpg',
      '../static/skybox/bay_lf.jpg',
    ],
    (texture) => {
      scene.background = texture
      setupModel()
    }
  )

  // 정방향 맵
  //   const loader = new THREE.TextureLoader()
  //   loader.load('../static/cannon.jpeg', (texture) => {
  //     const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height)
  //     renderTarget.fromEquirectangularTexture(renderer, texture)
  //     scene.background = renderTarget.texture
  //   })
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
