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
    const teapotRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    })

    teapotRenderTarget._pmremGen = new THREE.PMREMGenerator(this._renderer)
    const teapotCamera = new THREE.CubeCamera(0.01, 10, teapotRenderTarget)

    const teapotGepometry = new TeapotGeometry(0.7, 24)
    const teapotMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      ior: 2.5,
      thickness: 0.2,
      transmission: 1,
      side: THREE.DoubleSide,
      envMap: teapotRenderTarget.texture,
      envMapIntensity: 1,
    })
    const teapot = new THREE.Mesh(teapotGepometry, teapotMaterial)
    teapot.add(teapotCamera)
    this._scene.add(teapot)
    this._teapot = teapot

    const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1.5, 32)
    const cylinderMaterial = new THREE.MeshNormalMaterial()
    const cylinderPivot = new THREE.Object3D()
    for (let degree = 0; degree <= 360; degree += 30) {
      const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
      const radian = THREE.MathUtils.degToRad(degree)
      console.log('radian', radian, degree)
      cylinder.position.set(2 * Math.sin(radian), 0, 2 * Math.cos(radian))
      cylinderPivot.add(cylinder)
    }
    this._scene.add(cylinderPivot)
    this._cylinderPivot = cylinderPivot
  }

  _setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )

    camera.position.set(0, 4, 5)
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
    if (this._cylinderPivot) {
      this._cylinderPivot.rotation.y = Math.sin(time * 0.5)
    }

    if (this._teapot) {
      this._teapot.visible = false

      const teapotCamera = this._teapot.children[0]
      teapotCamera.update(this._renderer, this._scene)

      const renderTarget = teapotCamera.renderTarget._pmremGen.fromCubemap(
        teapotCamera.renderTarget.texture
      )

      this._teapot.material.envMap = renderTarget.texture
      this._teapot.material.needsUpdate = true
      this._teapot.visible = true
    }
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
