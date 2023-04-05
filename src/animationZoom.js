import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class App {
  constructor() {
    const divContainer = document.querySelector('#webgl-container')
    this._divContainer = divContainer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    divContainer.appendChild(renderer.domElement)

    this._renderer = renderer
    renderer.shadowMap.enabled = true
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
    this._controls = new OrbitControls(this._camera, this._renderer.domElement)
  }

  _setupModel() {
    const gltfLoader = new GLTFLoader()

    const items = [
      { url: '../static/toyota/scene.gltf' },
      { url: '../static/ford_mustang/scene.gltf' },
    ]

    items.forEach((item, index) => {
      gltfLoader.load(item.url, (gltf) => {
        const obj3d = gltf.scene

        const box = new THREE.Box3().setFromObject(obj3d)
        const sizeBox = box.max.z - box.min.z
        const scale = 1 / sizeBox
        const tx = index / (items.length - 1) - 0.5
        obj3d.scale.set(scale, scale, scale)
        obj3d.position.set(tx, -box.min.y * scale, 0)

        this._scene.add(obj3d)
        obj3d.name = 'car'

        // this._scene.add(new THREE.BoxHelper(obj3d))

        obj3d.traverse((child) => {
          child.castShadow = true
          child.receiveShadow = true
        })
      })

      const boxGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 64)
      const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0x454545,
        metalness: 0.5,
        roughness: 0.5,
      })
      const box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.receiveShadow = true
      box.position.y = -0.05
      box.name = 'box'
      this._scene.add(box)
    })
  }

  _setupPicking() {
    const raycaster = new THREE.Raycaster()
    this._divContainer.addEventListener('dblclick', this._onDbClick.bind(this))
    this._raycaster = raycaster
  }

  _onDbClick(event) {
    const width = this._divContainer.clientWidth
    const height = this._divContainer.clientHeight
    const xy = {
      x: (event.offsetX / width) * 2 - 1,
      y: -(event.offsetY / height) * 2 + 1,
    }
    this._raycaster.setFromCamera(xy, this._camera)

    const cars = []
    this._scene.traverse((obj3d) => {
      if (obj3d.name === 'car') {
        cars.push(obj3d)
      }
    })

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i]
      const targets = this._raycaster.intersectObject(car)
      if (targets.length > 0) {
        this._zoomFit(car, 70)
        return
      }
    }

    const box = this._scene.getObjectByName('box')
    this._zoomFit(box, 45)
  }

  _zoomFit(object3d, viewAngle) {
    const box = new THREE.Box3().setFromObject(object3d)
    const sizeBox = box.getSize(new THREE.Vector3()).length()
    const centerBox = box.getCenter(new THREE.Vector3())

    const direction = new THREE.Vector3(0, 1, 0)
    direction.applyAxisAngle(
      new THREE.Vector3(1, 0, 0),
      THREE.MathUtils.degToRad(viewAngle)
    )

    const halfSizeModel = sizeBox * 0.5
    const halfFov = THREE.MathUtils.degToRad(this._camera.fov * 0.5)
    const distance = halfSizeModel / Math.tan(halfFov)
    const newPosition = new THREE.Vector3().copy(
      direction.multiplyScalar(distance).add(centerBox)
    )
    // this._camera.position.copy(newPosition)

    gsap.to(this._camera.position, {
      duration: 1.5,
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
    })
    // this._controls.target.copy(centerBox)

    gsap.to(this._controls.target, {
      duration: 1.5,
      x: centerBox.x,
      y: centerBox.y,
      z: centerBox.z,
      onUpdate: () => {
        this._camera.lookAt(
          this._controls.target.x,
          this._controls.target.y,
          this._controls.target.z
        )
      },
    })
  }
  _setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )

    camera.position.set(0, 0, 2)
    this._camera = camera
  }

  _setupLight() {
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4)
    this._scene.add(hemisphereLight)

    const color = 0xffffff
    const intensity = 1.5

    const light1 = new THREE.DirectionalLight(color, intensity)
    light1.position.set(-1, 2, 0)
    this._scene.add(light1)

    const light2 = new THREE.DirectionalLight(color, intensity)
    light2.castShadow = true
    light2.position.set(1, 4, 0)
    light2.shadow.mapSize.width = light2.shadow.mapSize.height = 1024 * 10
    light2.shadow.radius = 4
    light2.shadow.bias = 0.0001
    this._scene.add(light2)
  }

  update(time) {
    time *= 0.001 // second unit
    this._controls.update()
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
