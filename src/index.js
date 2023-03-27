import * as THREE from 'three'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene()
  // scene.background = new THREE.Color(0x004fff)/
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

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
  const material = new THREE.MeshStandardMaterial({
    color: 0x999999,
  })

  const cube = new THREE.Mesh(geometry, material)

  const geometry2 = new THREE.IcosahedronGeometry(0.5, 1)
  const material2 = new THREE.MeshStandardMaterial({
    color: 0x999999,
  })

  const cube2 = new THREE.Mesh(geometry2, material2)
  cube2.position.x = -1
  const geometry3 = new THREE.ConeGeometry(0.3, 0.5, 0.5)
  const material3 = new THREE.MeshStandardMaterial({
    color: 0x999999,
  })

  const cube3 = new THREE.Mesh(geometry3, material3)
  cube3.position.x = 1
  function render(time) {
    time *= 0.0005
    cube.rotation.x = time
    cube.rotation.y = time
    cube2.rotation.x = time
    cube2.rotation.y = time
    cube3.rotation.x = time
    cube3.rotation.y = time
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  scene.add(cube)
  scene.add(cube2)
  scene.add(cube3)
  requestAnimationFrame(render)
  document.body.appendChild(renderer.domElement)
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
