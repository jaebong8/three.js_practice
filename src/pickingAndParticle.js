import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Particle {
  constructor(scene, geometry, material, x, y) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, 0)
    scene.add(mesh)
    mesh.wrapper = this
    this.awakenTime = undefined
    this._mesh = mesh
  }

  awake(time) {
    console.log(this.awakenTime)
    if (!this.awakenTime) {
      this.awakenTime = time
    }
  }

  update(time) {
    if (this.awakenTime) {
      const period = 12.0
      const t = time - this.awakenTime
      if (t >= period) this.awakenTime = undefined
      this._mesh.rotation.x = THREE.MathUtils.lerp(
        0,
        Math.PI * 2 * period,
        t / period
      )
    }
  }
}
class App {
  constructor() {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(renderer.domElement)

    this._renderer = renderer

    const scene = new THREE.Scene()
    this._scene = scene

    this._setupCamera()
    this._setupLight()
    this._setupModel()
    this._setupControls()
    this._setupPicking()

    window.onresize = this.resize.bind(this)
    this.resize()

    requestAnimationFrame(this.render.bind(this))
  }

  _setupControls() {
    new OrbitControls(this._camera, this._renderer.domElement)
  }

  _setupPicking() {
    const raycaster = new THREE.Raycaster()
    raycaster.cursorNormalizedPosition = undefined
    this._renderer.domElement.addEventListener(
      'mousemove',
      this._onMouseMove.bind(this)
    )
    this._raycaster = raycaster
  }

  _onMouseMove(e) {
    const width = this._renderer.domElement.clientWidth
    const height = this._renderer.domElement.clientHeight
    const x = (e.offsetX / width) * 2 - 1
    const y = (e.offsetY / height) * 2 + 1
    this._raycaster.cursorNormalizedPosition = { x, y }
  }
  _setupModel() {
    const geometry = new THREE.BoxGeometry()
    for (let x = -20; x <= 20; x += 1.1) {
      for (let y = -20; y <= 20; y += 1.1) {
        const color = new THREE.Color()
        color.setHSL(0, 0, 0.1)
        const material = new THREE.MeshStandardMaterial({ color })
        new Particle(this._scene, geometry, material, x, y)
      }
    }
  }

  _setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )

    camera.position.set(0, 0, 40)
    this._camera = camera
  }

  _setupLight() {
    this._scene.add(new THREE.AmbientLight(0xffffff, 0.2))

    const color = 0xffffff
    const intensity = 5
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this._scene.add(light)
  }

  update(time) {
    time *= 0.001 // second unit
    if (this._raycaster && this._raycaster.cursorNormalizedPosition) {
      this._raycaster.setFromCamera(
        this._raycaster.cursorNormalizedPosition,
        this._camera
      )
      const targets = this._raycaster.intersectObjects(this._scene.children)
      //   console.log(this._raycaster.intersectObjects(this._scene.children))
      if (targets.length > 0) {
        const mesh = targets[0].object
        const particle = mesh.wrapper

        particle.awake(time)
      }
    }

    this._scene.traverse((obj3d) => {
      if (obj3d instanceof THREE.Mesh) {
        obj3d.wrapper.update(time)
      }
    })
  }

  render(time) {
    this._renderer.render(this._scene, this._camera)
    this.update(time)

    requestAnimationFrame(this.render.bind(this))
  }

  resize() {
    const width = window.innerWidth
    const height = window.innerHeight

    this._camera.aspect = width / height
    this._camera.updateProjectionMatrix()

    this._renderer.setSize(width, height)
  }
}

window.onload = function () {
  new App()
}
