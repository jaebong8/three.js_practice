import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry'
class App {
  constructor() {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(renderer.domElement)

    this._renderer = renderer

    const scene = new THREE.Scene()
    this._scene = scene
    const axesHelper = new THREE.AxesHelper(3)
    scene.add(axesHelper)

    this._setupCamera()
    this._setupLight()
    this._setupBackground()
    this._setupModel()
    this._setupControls()

    window.onresize = this.resize.bind(this)
    this.resize()

    requestAnimationFrame(this.render.bind(this))
  }

  _setupControls() {
    new OrbitControls(this._camera, this._renderer.domElement)
  }

  _setupBackground() {
    const loader = new THREE.TextureLoader()
    loader.load('../static/puresky2.jpg', (texture) => {
      const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height)
      renderTarget.fromEquirectangularTexture(this._renderer, texture)
      this._scene.background = renderTarget.texture
    })
  }

  _setupModel() {
    const teapotGepometry = new TeapotGeometry(0.7, 24)
    const teapotMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      ior: 2.5,
      thickness: 0.1,
      transmission: 1,
      side: THREE.DoubleSide,
    })
    const teapot = new THREE.Mesh(teapotGepometry, teapotMaterial)
    this._scene.add(teapot)
  }

  _setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )

    camera.position.set(0, 4, 9)
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

    const torus = this._scene.getObjectByName('torus')
    if (torus) {
      torus.rotation.x = Math.sin(time)
    }
  }

  render(time) {
    this._scene.traverse((obj) => {
      if (obj instanceof THREE.Object3D) {
        const mesh = obj.children[0]
        const cubeCamera = obj.children[1]

        if (
          mesh instanceof THREE.Mesh &&
          cubeCamera instanceof THREE.CubeCamera
        ) {
          mesh.visible = false
          cubeCamera.update(this._renderer, this._scene)
          mesh.visible = true
        }
      }
    })

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
