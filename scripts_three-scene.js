(function () {
  const MODEL_PATH = 'assets/models/T_shirt_gltf.zip.gltf';

  const shirtConfigs = [
    { color: '#C8D5B9', line1: 'BUILT NOT', line2: 'BORROWED', pos: [0, 0, 0] },
    { color: '#E8C4C0', line1: 'CASH FLOW IS', line2: 'CHARACTER', pos: [2.5, -0.5, -6] },
    { color: '#C4BDB3', line1: 'THE MARKET', line2: "DOESN'T CARE", pos: [-2.5, 0.3, -12] },
    { color: '#DDD8EE', line1: 'ASSETS OVER', line2: 'AESTHETICS', pos: [1.5, -0.3, -18] },
    { color: '#EDE6D6', line1: 'BUY THE DIP', line2: 'IN YOURSELF', pos: [0, 0, -24] }
  ];

  const camPath = [
    { pos: { x: 0, y: 0.3, z: 5.5 }, look: { x: 0, y: 0, z: 0 } },
    { pos: { x: 1.5, y: 0, z: -2 }, look: { x: 2.5, y: -0.5, z: -6 } },
    { pos: { x: -1.5, y: 0.2, z: -8 }, look: { x: -2.5, y: 0.3, z: -12 } },
    { pos: { x: 1.0, y: 0, z: -14 }, look: { x: 1.5, y: -0.3, z: -18 } },
    { pos: { x: 0, y: 0, z: -20 }, look: { x: 0, y: 0, z: -24 } }
  ];

  const speeds = [0.004, 0.003, 0.005, 0.003, 0.004];

  let scene;
  let renderer;
  let camera;
  let particles;
  let shirts = [];
  let baseShirtY = [];
  let time = 0;
  const mouse = { x: 0, y: 0 };
  const proxy = { progress: 0 };

  function initCore(canvas) {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xF5F0E8, 8, 22);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xF5F0E8, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const ambient = new THREE.AmbientLight(0xFFF8F0, 0.8);
    const dir1 = new THREE.DirectionalLight(0xFFFFFF, 1.4);
    dir1.position.set(5, 8, 5);
    const dir2 = new THREE.DirectionalLight(0xC8D5B9, 0.6);
    dir2.position.set(-6, 3, -3);
    const p1 = new THREE.PointLight(0xE8C4C0, 1.2);
    p1.position.set(3, 4, 3);
    const p2 = new THREE.PointLight(0xB5A898, 0.8);
    p2.position.set(-3, -2, 4);
    scene.add(ambient, dir1, dir2, p1, p2);

    createParticles();
    bindInput();
    bindResize();
  }

  function buildShirt(hexColor, line1, line2) {
    const group = new THREE.Group();
    const c = new THREE.Color(hexColor);
    const dark = new THREE.Color(hexColor).multiplyScalar(0.82);
    const mid = new THREE.Color(hexColor).multiplyScalar(0.91);

    const mat = (col) => new THREE.MeshStandardMaterial({ color: col, roughness: 0.85, metalness: 0.0 });

    const tc = document.createElement('canvas');
    tc.width = 512;
    tc.height = 640;
    const ctx = tc.getContext('2d');
    ctx.fillStyle = '#' + c.getHexString();
    ctx.fillRect(0, 0, 512, 640);
    ctx.fillStyle = 'rgba(44,42,37,0.80)';
    ctx.font = '500 42px Arial';
    ctx.textAlign = 'center';
    if (line1) ctx.fillText(line1, 256, 290);
    if (line2) ctx.fillText(line2, 256, 342);
    ctx.fillStyle = 'rgba(44,42,37,0.40)';
    ctx.font = '300 20px Arial';
    ctx.fillText('TRUST.', 256, 415);
    const tex = new THREE.CanvasTexture(tc);
    tex.encoding = THREE.sRGBEncoding;

    const front = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.4), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: 0.0 }));
    front.position.z = 0.16;
    group.add(front);

    const back = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.4), mat(mid));
    back.position.z = -0.16;
    back.rotation.y = Math.PI;
    group.add(back);

    const sideGeo = new THREE.BoxGeometry(0.32, 2.4, 0.32);
    const sL = new THREE.Mesh(sideGeo, mat(dark));
    sL.position.set(-1.0, 0, 0);
    const sR = new THREE.Mesh(sideGeo, mat(dark));
    sR.position.set(1.0, 0, 0);
    group.add(sL, sR);

    const bot = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.14, 0.32), mat(dark));
    bot.position.set(0, -1.2, 0);
    group.add(bot);

    const slL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.50, 0.28), mat(mid));
    slL.position.set(-1.46, 0.90, 0);
    slL.rotation.z = 0.28;
    group.add(slL);

    const cL = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.26, 0.30), mat(dark));
    cL.position.set(-1.82, 0.60, 0);
    group.add(cL);

    const slR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.50, 0.28), mat(mid));
    slR.position.set(1.46, 0.90, 0);
    slR.rotation.z = -0.28;
    group.add(slR);

    const cR = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.26, 0.30), mat(dark));
    cR.position.set(1.82, 0.60, 0);
    group.add(cR);

    const shGeo = new THREE.BoxGeometry(0.55, 0.20, 0.32);
    const shL = new THREE.Mesh(shGeo, mat(c));
    shL.position.set(-0.72, 1.1, 0);
    const shR = new THREE.Mesh(shGeo, mat(c));
    shR.position.set(0.72, 1.1, 0);
    group.add(shL, shR);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.075, 10, 28, Math.PI), mat(dark));
    collar.position.set(0, 1.12, 0.14);
    collar.rotation.x = -0.1;
    group.add(collar);

    return group;
  }

  function createProceduralShirts() {
    shirts = shirtConfigs.map((cfg) => {
      const s = buildShirt(cfg.color, cfg.line1, cfg.line2);
      s.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      scene.add(s);
      return s;
    });
    baseShirtY = shirts.map(s => s.position.y);
  }

  function tintModel(root, colorHex) {
    const color = new THREE.Color(colorHex);
    root.traverse((obj) => {
      if (!obj.isMesh) return;
      const m = obj.material;
      if (Array.isArray(m)) {
        obj.material = m.map((mat) => {
          const nm = mat.clone();
          nm.color = color.clone();
          nm.roughness = 0.85;
          nm.metalness = 0.0;
          return nm;
        });
      } else if (m) {
        const nm = m.clone();
        nm.color = color.clone();
        nm.roughness = 0.85;
        nm.metalness = 0.0;
        obj.material = nm;
      }
      obj.castShadow = false;
      obj.receiveShadow = false;
    });
  }

  function placeAndNormalizeModel(model, cfg) {
    model.rotation.y = Math.PI;
    model.scale.setScalar(9.5);
    model.position.set(cfg.pos[0], cfg.pos[1] - 15.4, cfg.pos[2]);
  }

  function createModelShirts(master) {
    shirts = shirtConfigs.map((cfg) => {
      const clone = master.clone(true);
      tintModel(clone, cfg.color);
      placeAndNormalizeModel(clone, cfg);
      scene.add(clone);
      return clone;
    });
    baseShirtY = shirts.map(s => s.position.y);
  }

  function loadModelShirtsOrFallback() {
    return new Promise((resolve) => {
      if (typeof THREE.GLTFLoader !== 'function') {
        createProceduralShirts();
        resolve({ mode: 'procedural' });
        return;
      }

      const loader = new THREE.GLTFLoader();
      loader.load(
        MODEL_PATH,
        (gltf) => {
          createModelShirts(gltf.scene);
          resolve({ mode: 'gltf' });
        },
        undefined,
        () => {
          createProceduralShirts();
          resolve({ mode: 'procedural' });
        }
      );
    });
  }

  function createParticles() {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const baseY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 16;
      positions[idx + 1] = (Math.random() - 0.5) * 12;
      positions[idx + 2] = -28 + Math.random() * 30;
      baseY[i] = positions[idx + 1];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.userData.baseY = baseY;

    const mat = new THREE.PointsMaterial({ size: 0.025, color: 0xB5A898, transparent: true, opacity: 0.6 });
    particles = new THREE.Points(geo, mat);
    scene.add(particles);
  }

  function bindInput() {
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    });
  }

  function bindResize() {
    window.addEventListener('resize', () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  function updateCameraFromScroll() {
    const scaled = proxy.progress * (camPath.length - 1);
    const i0 = Math.floor(scaled);
    const i1 = Math.min(i0 + 1, camPath.length - 1);
    const t = scaled - i0;

    const from = camPath[i0];
    const to = camPath[i1];

    const baseX = THREE.MathUtils.lerp(from.pos.x, to.pos.x, t);
    const baseYCam = THREE.MathUtils.lerp(from.pos.y, to.pos.y, t);
    const baseZ = THREE.MathUtils.lerp(from.pos.z, to.pos.z, t);

    camera.position.z = baseZ;
    camera.position.x += (baseX + mouse.x * 0.3 - camera.position.x) * 0.02;
    camera.position.y += (baseYCam + mouse.y * 0.15 - camera.position.y) * 0.02;

    const look = new THREE.Vector3(
      THREE.MathUtils.lerp(from.look.x, to.look.x, t),
      THREE.MathUtils.lerp(from.look.y, to.look.y, t),
      THREE.MathUtils.lerp(from.look.z, to.look.z, t)
    );
    camera.lookAt(look);
  }

  function animate() {
    requestAnimationFrame(animate);
    time += 0.016;

    shirts.forEach((s, i) => {
      s.rotation.y += speeds[i];
      s.position.y = baseShirtY[i] + Math.sin(time * 0.8 + i) * 0.03;
    });

    updateCameraFromScroll();

    if (particles) {
      particles.rotation.y += 0.0003;
      const arr = particles.geometry.attributes.position.array;
      const baseY = particles.geometry.userData.baseY;
      const count = baseY.length;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] = baseY[i] + Math.sin(time + i) * 0.0002;
      }
      particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  async function start(canvas) {
    initCore(canvas);
    await loadModelShirtsOrFallback();
    animate();
  }

  window.TrustScene = {
    start,
    proxy,
    getCamPath() {
      return camPath;
    }
  };
})();