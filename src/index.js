import * as THREE from 'three'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeeeeee)
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onWindowResize)
  camera.position.z = 3

  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(0, 2, 12)
  scene.add(pointLight)

  const textureLoader = new THREE.TextureLoader()
  const textureBaseColor = textureLoader.load(
    '../static/textures/basecolor.jpg'
  )
  const textureHeight = textureLoader.load('../static/textures/height.png')
  const textureNormal = textureLoader.load('../static/textures/normal.jpg')
  const textureRoughness = textureLoader.load(
    '../static/textures/roughness.jpg'
  )

  // 도형 추가
  const geometry1 = new THREE.SphereGeometry(0.4, 32, 16)
  const material1 = new THREE.MeshStandardMaterial({
    map: textureBaseColor,
  })
  const obj1 = new THREE.Mesh(geometry1, material1)

  obj1.position.x = -2

  const geometry2 = new THREE.SphereGeometry(0.4, 32, 16)
  const material2 = new THREE.MeshStandardMaterial({
    map: textureBaseColor,
    normalMap: textureNormal,
    displacementMap: textureHeight,
    displacementScale: 0.08,
  })
  const obj2 = new THREE.Mesh(geometry2, material2)

  obj2.position.x = -1

  const geometry3 = new THREE.SphereGeometry(0.4, 32, 16)
  const material3 = new THREE.MeshStandardMaterial({
    map: textureBaseColor,
    normalMap: textureNormal,
    displacementMap: textureHeight,
    displacementScale: 0.08,
    roughnessMap: textureRoughness,
    roughness: 0.5,
  })
  const obj3 = new THREE.Mesh(geometry3, material3)

  const geometry4 = new THREE.TorusGeometry(0.3, 0.15, 16, 40)
  const material4 = new THREE.MeshLambertMaterial({
    color: 0xff7f00,
  })
  const obj4 = new THREE.Mesh(geometry4, material4)

  obj4.position.x = 1

  const geometry5 = new THREE.TorusGeometry(0.3, 0.15, 16, 40)
  const material5 = new THREE.MeshPhongMaterial({
    color: 0xff7f00,
    shininess: 90,
    specular: 0x004fff,
  })
  const obj5 = new THREE.Mesh(geometry5, material5)

  obj5.position.x = 2

  function render(time) {
    time *= 0.0009
    obj1.rotation.y = time
    obj2.rotation.y = time
    obj3.rotation.y = time
    obj4.rotation.y = time
    obj5.rotation.y = time
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  scene.add(obj1)
  scene.add(obj2)
  scene.add(obj3)
  scene.add(obj4)
  scene.add(obj5)

  requestAnimationFrame(render)
  document.body.appendChild(renderer.domElement)
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
