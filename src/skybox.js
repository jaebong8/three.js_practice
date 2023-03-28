import * as THREE from 'three'
import { WEBGL } from './webgl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

if (WEBGL.isWebGLAvailable()) {
  const fogColor = 0x888888
  const objColor = 0xffffff
  const floorColor = 0x555555
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(floorColor)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  document.body.appendChild(renderer.domElement)

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  const skyMaterialArray = []

  const texture_ft = new THREE.TextureLoader().load(
    '../static/skybox/bay_ft.jpg'
  )
  const texture_bk = new THREE.TextureLoader().load(
    '../static/skybox/bay_bk.jpg'
  )
  const texture_dn = new THREE.TextureLoader().load(
    '../static/skybox/bay_dn.jpg'
  )
  const texture_lf = new THREE.TextureLoader().load(
    '../static/skybox/bay_lf.jpg'
  )
  const texture_rt = new THREE.TextureLoader().load(
    '../static/skybox/bay_rt.jpg'
  )
  const texture_up = new THREE.TextureLoader().load(
    '../static/skybox/bay_up.jpg'
  )

  skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_ft,
    })
  )
  skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_bk,
    })
  )
  skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_up,
    })
  )
  skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_dn,
    })
  )
  skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_rt,
    })
  )
  skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_lf,
    })
  )

  skyMaterialArray.forEach((material) => {
    material.side = THREE.BackSide
  })

  //camera
  const fov = 50
  const aspect = window.innerWidth / window.innerHeight
  const near = 1
  const far = 4000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 20, 100)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // 메쉬
  const skyGeometry = new THREE.BoxGeometry(2400, 2400, 2400)
  //   const skyMaterial = new THREE.MeshStandardMaterial({
  //     // color: 0x333333,
  //     map: texture,
  //   })

  const sky = new THREE.Mesh(skyGeometry, skyMaterialArray)
  scene.add(sky)

  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)
  renderer.setSize(window.innerWidth, window.innerHeight)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.minDistance = 20
  controls.maxDistance = 800
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
