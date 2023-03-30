import * as THREE from 'three'
import { WEBGL } from './webgl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// if (WEBGL.isWebGLAvailable()) {
//   const floorColor = 0x000000
//   const scene = new THREE.Scene()
//   scene.background = new THREE.Color(floorColor)

//   const renderer = new THREE.WebGLRenderer({
//     antialias: true,
//     alpha: true,
//   })
//   document.body.appendChild(renderer.domElement)

//   const axesHelper = new THREE.AxesHelper(3)
//   scene.add(axesHelper)

//   //camera
//   const fov = 50
//   const aspect = window.innerWidth / window.innerHeight
//   const near = 1
//   const far = 4000
//   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
//   camera.position.set(0, 0, 10)
//   camera.lookAt(new THREE.Vector3(0, 0, 0))
//   scene.add(camera)

//   const ambientLight = new THREE.DirectionalLight(0xffffff, 1.5)
//   const lightHelper = new THREE.DirectionalLightHelper(
//     ambientLight,
//     0.5,
//     '0x0000ff'
//   )
//   ambientLight.position.set(-1, 2, 4)
//   scene.add(ambientLight)
//   scene.add(lightHelper)
//   renderer.setSize(window.innerWidth, window.innerHeight)
//   const controls = new OrbitControls(camera, renderer.domElement)
//   controls.enableDamping = true
//   //   controls.minDistance = 20
//   //   controls.maxDistance = 800
//   // controls.maxPolarAngle = Math.PI / 2 - 0.1

//   /////////////////////////////////////////////

//   const renderTargetOptions = {
//     format: THREE.RGBAFormat,
//     generateMipmaps: true,
//     minFilter: THREE.LinearMipmapLinearFilter,
//   }
//   const sphereRenderTarget = new THREE.WebGLCubeRenderTarget(
//     512,
//     renderTargetOptions
//   )
//   const sphereCamera = new THREE.CubeCamera(0.1, 1000, sphereRenderTarget)

//   const sphereGeometry = new THREE.SphereGeometry(1.5)
//   const sphereMaterial = new THREE.MeshPhongMaterial({
//     color: 0xffffff,
//     envMap: sphereRenderTarget.texture,
//     reflectivity: 0.95,
//   })
//   const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
//   const spherePivot = new THREE.Object3D()
//   spherePivot.add(sphere)
//   spherePivot.add(sphereCamera)

//   spherePivot.position.set(1, 0, 1)
//   scene.add(spherePivot)

//   const cylinderGeometry = new THREE.CylinderGeometry(0.5, 1, 3, 32)
//   const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
//   const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
//   cylinder.position.set(-1, 0, -1)
//   scene.add(cylinder)

//   const torusGeometry = new THREE.TorusGeometry(4, 0.5, 24, 64)
//   const torusMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
//   const torus = new THREE.Mesh(torusGeometry, torusMaterial)
//   scene.add(torus)
//   torus.rotation.x = Math.PI / 2
//   torus.name = 'torus'

//   const planeGeometry = new THREE.PlaneGeometry(12, 12)
//   const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
//   const plane = new THREE.Mesh(planeGeometry, planeMaterial)
//   scene.add(plane)
//   plane.rotation.x = -Math.PI / 2
//   plane.position.y = -4.8

//   ///////////////////////////////////

//   controls.update()
//   function render(time) {
//     time *= 0.00001
//     torus.rotation.x = Math.sin(time)
//     renderer.render(scene, camera)
//     controls.update()

//     scene.traverse((obj) => {
//       if (obj instanceof THREE.Object3D) {
//         const mesh = obj.children[0]
//         const cubeCamera = obj.children[1]
//         // console.log(mesh, cubeCamera)
//         if (
//           mesh instanceof THREE.Mesh &&
//           cubeCamera instanceof THREE.CubeCamera
//         ) {
//           //   console.log(obj)
//           mesh.visible = false
//           //   console.log(mesh.visible)

//           cubeCamera.update(renderer, scene)
//           mesh.visible = true
//           //   console.log(cubeCamera)
//         }
//       }
//     })

//     requestAnimationFrame(render)
//   }

//   requestAnimationFrame(render)

//   function onWindowResize() {
//     camera.aspect = aspect
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//   }
//   window.addEventListener('resize', onWindowResize)
// } else {
//   var warning = WEBGL.getWebGLErrorMessage()
//   document.body.appendChild(warning)
// }

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

    window.onresize = this.resize.bind(this)
    this.resize()

    requestAnimationFrame(this.render.bind(this))
  }

  _setupControls() {
    new OrbitControls(this._camera, this._renderer.domElement)
  }

  _setupModel() {
    const renderTargetOptions = {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    }

    const sphereRenderTarget = new THREE.WebGLCubeRenderTarget(
      512,
      renderTargetOptions
    )
    const sphereCamera = new THREE.CubeCamera(0.1, 1000, sphereRenderTarget)
    const sphereGeometry = new THREE.SphereGeometry(1.5)
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: sphereRenderTarget.texture,
      reflectivity: 0.95,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    const spherePivot = new THREE.Object3D()
    spherePivot.add(sphere)
    spherePivot.add(sphereCamera)
    spherePivot.position.set(1, 0, 1)
    this._scene.add(spherePivot)

    const cylinderRenderTarget = new THREE.WebGLCubeRenderTarget(
      2048,
      renderTargetOptions
    )
    const cylinderCamera = new THREE.CubeCamera(0.1, 1000, cylinderRenderTarget)
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 1, 3, 32)
    const cylinderMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: cylinderRenderTarget.texture,
      reflectivity: 0.95,
    })
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
    const cylinderPivot = new THREE.Object3D()
    cylinderPivot.add(cylinder)
    cylinderPivot.add(cylinderCamera)
    cylinderPivot.position.set(-1, 0, -1)
    this._scene.add(cylinderPivot)

    const torusRenderTarget = new THREE.WebGLCubeRenderTarget(
      2048,
      renderTargetOptions
    )
    const torusCamera = new THREE.CubeCamera(0.1, 1000, torusRenderTarget)
    const torusGeometry = new THREE.TorusGeometry(4, 0.5, 24, 64)
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: torusRenderTarget.texture,
      reflectivity: 0.95,
    })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    const torusPivot = new THREE.Object3D()
    torusPivot.add(torus)
    torusPivot.add(torusCamera)
    torus.rotation.x = Math.PI / 2
    this._scene.add(torusPivot)
    torus.name = 'torus'

    const planeRenderTarget = new THREE.WebGLCubeRenderTarget(
      2048,
      renderTargetOptions
    )
    const planeCamera = new THREE.CubeCamera(0.1, 1000, planeRenderTarget)
    const planeGeometry = new THREE.PlaneGeometry(12, 12)
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: planeRenderTarget.texture,
      reflectivity: 0.95,
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    const planePivot = new THREE.Object3D()
    planePivot.add(plane)
    planePivot.add(planeCamera)
    plane.rotation.x = -Math.PI / 2
    planePivot.position.y = -4.8
    this._scene.add(planePivot)
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
