// import * as THREE from "three";
// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
// import * as TWEEN from "@tweenjs/tween.js"

// /Users/gaowenzhen/ProjectAll/xinlink/ips-interface/node_modules/three/examples/jsm/libs/tween.module.min.js
// import Stats from 'three/examples/jsm/libs/stats.module.js';
import CoordAll from "../../../abi/coord10610.json";
const coordInit = (options) => {

    const container = document.querySelector(options.domId)
    if (!container) {
        return
    }
    let canvasdom = container.querySelector('canvas')
    if (canvasdom) {
        container.innerHTML = ''
    }

    let animatime = ''
    const wordDestroy = () => {
        scene.dispose()
        renderer.dispose()
        if(animatime){
          cancelAnimationFrame(animatime)
        }
        container.innerHTML = ''
    }

    if (options.isclear === true) {
      wordDestroy()
    }

    // console.dir(container.clientHeight)

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 10000);
    camera.position.z = 0.5;

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, });
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // // ---stats--
    // const stats = new Stats();
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.top = '0px';
    // container.appendChild( stats.domElement );
    // // --- stats -- end

    // 初次场景缩放
    let isStartZoom = true
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // 创建截角面体，以及变形后坐标
    const OctahedronPositionAttr = () => {
        const reqData = {
            "name": "Truncated Octahedron",
            "category": ["Archimedean Solid"],
            "vertex": [[0, 0, 1.054093], [0.6324555, 0, 0.843274], [-0.421637, 0.4714045, 0.843274], [-0.07027284, -0.6285394, 0.843274], [0.843274, 0.4714045, 0.421637], [0.5621827, -0.6285394, 0.6324555], [-0.9135469, 0.3142697, 0.421637], [-0.2108185, 0.942809, 0.421637], [-0.5621827, -0.7856742, 0.421637], [0.9838197, 0.3142697, -0.2108185], [0.421637, 0.942809, 0.2108185], [0.7027284, -0.7856742, 0], [-0.7027284, 0.7856742, 0], [-0.9838197, -0.3142697, 0.2108185], [-0.421637, -0.942809, -0.2108185], [0.5621827, 0.7856742, -0.421637], [0.9135469, -0.3142697, -0.421637], [0.2108185, -0.942809, -0.421637], [-0.5621827, 0.6285394, -0.6324555], [-0.843274, -0.4714045, -0.421637], [0.07027284, 0.6285394, -0.843274], [0.421637, -0.4714045, -0.843274], [-0.6324555, 0, -0.843274], [0, 0, -1.054093]],
            "edge": [[0, 3], [3, 5], [5, 1], [1, 0], [2, 7], [7, 12], [12, 6], [6, 2], [4, 9], [9, 15], [15, 10], [10, 4], [8, 13], [13, 19], [19, 14], [14, 8], [11, 17], [17, 21], [21, 16], [16, 11], [18, 20], [20, 23], [23, 22], [22, 18], [1, 4], [10, 7], [2, 0], [6, 13], [8, 3], [5, 11], [16, 9], [14, 17], [12, 18], [22, 19], [15, 20], [21, 23]],
            "face": [[0, 3, 5, 1], [2, 7, 12, 6], [4, 9, 15, 10], [8, 13, 19, 14], [11, 17, 21, 16], [18, 20, 23, 22], [0, 1, 4, 10, 7, 2], [0, 2, 6, 13, 8, 3], [1, 5, 11, 16, 9, 4], [3, 8, 14, 17, 11, 5], [6, 12, 18, 22, 19, 13], [7, 10, 15, 20, 18, 12], [9, 16, 21, 23, 20, 15], [14, 19, 22, 23, 21, 17]]
        }

        // 创建点
        var vertices = []
        for (var i = 0; i < reqData.vertex.length; i++) {
            let vitem = reqData.vertex[i]
            vertices.push(vitem[0])
            vertices.push(vitem[1])
            vertices.push(vitem[2])
        }

        // 创建面
        var faces = []
        for (var faceNum = 0; faceNum < reqData.face.length; faceNum++) {
            for (var i = 0; i < reqData.face[faceNum].length - 2; i++) {
                faces.push(reqData.face[faceNum][0], reqData.face[faceNum][i + 1], reqData.face[faceNum][i + 2]);
            }
        }
        const Polygeometry = new THREE.PolyhedronGeometry(vertices, faces, 1, 0);

        // let normal = Polygeometry.attributes.normal
        // let array = normal.array

        // // // 每个面中心转坐标
        // let itemsArray = sgroup(array, 3)
        // // 14面坐标
        // let fecstextindex = [0, 11, 12, 22, 28, 33, 44, 55, 66, 77, 88, 99, 110, 121]
        // // 创建面上字
        // let facespoins = [].concat(reqData.vertex)
        // for (let r = 0; r < fecstextindex.length; r++) {
        //     let itemindex = fecstextindex[r]
        //     if (itemsArray[itemindex]) {
        //         let rsx = itemsArray[itemindex][0]
        //         let rsy = itemsArray[itemindex][1]
        //         let rsz = itemsArray[itemindex][2]
        //         let items = [rsx, rsy, rsz]
        //         facespoins.push(items)
        //     }
        // }
       
        // 球体变形坐标
        // let facespoins = [].concat(reqData.vertex)
        let faceitems = [[0.2981424033641815,-0.3333333730697632,0.8944271802902222],[-0.596284806728363,0.6666666269302368,0.4472135901451111],[0.7453559637069702,0.6666666865348816,3.973643103449831e-8],[-0.7453559637069702,-0.6666666865348816,-6.194976975848476e-8],[0.596284806728363,-0.6666666269302368,-0.4472135901451111],[-0.29814237356185913,0.33333340287208557,-0.8944271802902222],[0.25819888710975647,0.5773502588272095,0.7745966911315918],[-0.6024640798568726,-0.19245007634162903,0.7745966911315918],[0.9467292428016663,-0.19245007634162903,0.25819888710975647],[0.08606628328561783,-0.9622504711151123,0.2581988275051117],[-0.9467292428016663,0.19245009124279022,-0.2581988573074341],[-0.08606627583503723,0.9622504711151123,-0.2581988275051117],[0.6024640798568726,0.19245004653930664,-0.774596631526947],[-0.25819888710975647,-0.5773502588272095,-0.7745966911315918]]
        let vertex =faceitems.concat(reqData.vertex)
        return { vertex, Polygeometry }

    }

    const ceretext = (font, text) => {
        const textarrt = {
            font: font,
            size: 6,
            height: 2,
            curveSegments: 3,
            bevelThickness: 3,
            bevelSize: 0.5
        }

        return new THREE.TextGeometry(text, textarrt);
    }

    // xyz,and text item all
    let arrowcolor = 0x4C5080;
    let slecolor = 0xffffff;
    // const arrowcolor = new THREE.Color("rgb(176, 233, 252)");
    const linkArrow = (font, texts) => {

        let arrowScene = new THREE.Object3D()
        arrowScene.scale.set(0.005, 0.005, 0.005)
        let arrowPos = new THREE.Vector3(0, 0, 0);
        let x = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), arrowPos, 40, arrowcolor, 6, 3)
        let y = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), arrowPos, 40, arrowcolor, 6, 3)
        let z = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), arrowPos, 40, arrowcolor, 6, 3)
        arrowScene.add(x);
        arrowScene.add(y);
        arrowScene.add(z);

        const textGeo = ceretext(font, texts.join())
        textGeo.computeBoundingBox()
        textGeo.translate(5, 5, 5)
        let textMeshs = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial({ color: arrowcolor }));
        // textMeshs.name = index
        textMeshs.rotation.set(0, 2, 2)
        arrowScene.add(textMeshs)
        var linknadtext = new THREE.Object3D()
        linknadtext.add(arrowScene);
        textGeo.dispose();
        return linknadtext
    }

    // 获取球形顶点坐标
    // 球直径 sqsize, 线段数量 linklen
    const getSphericalXyzAll = (sqsize, linklen) => {
        // 创建圆形多面体，用来定位
        let pSphereGeometry = new THREE.DodecahedronGeometry(sqsize, linklen);
        pSphereGeometry.deleteAttribute('normal');
        pSphereGeometry.deleteAttribute('uv');

        // 获取圆形多面体所有的position
        pSphereGeometry = THREE.BufferGeometryUtils.mergeVertices(pSphereGeometry);
        // 取到球形顶点坐标，用来分布xyz线效果+文字的位置
        const positionAttribute = pSphereGeometry.getAttribute('position');
        return positionAttribute
    }

    // 纠正分布球体表面朝向
    let lookDirection = new THREE.Vector3();
    let target = new THREE.Vector3();
    // 创建xyz+文字，位置
    const createdItemXyzText = (q,rexyz) => {
          // // 坐标线段x,y, z + 文字到这个组内
          let textgroup = new THREE.Object3D();
          let newPosite = { x: positionAttribute.getX(q), y: positionAttribute.getY(q), z: positionAttribute.getZ(q) }
          let texts = CoordAll[q]
          // let texts = [Math.abs(newPosite.x).toFixed(2), Math.abs(newPosite.y).toFixed(2), Math.abs(newPosite.z).toFixed(2)]
          if(rexyz && typeof rexyz !== 'undefined'){
            texts = rexyz
          }
          textgroup = linkArrow(glopfont, texts)
          textgroup.position.set(newPosite.x, newPosite.y, newPosite.z)

          lookDirection.subVectors(textgroup.position, new THREE.Vector3(0, 0, 0)).normalize();
          target.copy(textgroup.position).add(lookDirection);
          textgroup.lookAt(target);
          textgroup.rotation.y = Math.random() * Math.PI;
          // 创建到全局Object3D对象内
          textgroup.name = q
          return textgroup
    }

    // 全部坐标,第一场景进入时
    let glopfont = null
    // 全部xyz线段+文字
    let txtlinkall = null
    // 创建圆形多面体，用来定位,
    let positionAttribute = [];
    function TextAndxyzMeshsAll(sqsize, linklen) {
        if (options.xyz && options.xyz !== 'undefined') {
           isqus = 2
        }
        txtlinkall = new THREE.Object3D()
        // // 创建圆形多面体，用来定位,
        positionAttribute = getSphericalXyzAll(sqsize, linklen)

        // font 坐标加文字数据等文字都加载完成再渲染整个
        const loader = new THREE.FontLoader();
        loader.load('/static/fonts/helvetiker_bold.typeface.json', function (font) {

            glopfont = font
            // 遍历圆形所有顶点坐标，xyz，创建文字
            // console.dir(positionAttribute.count)
            for (let q = 0; q < positionAttribute.count; q++) {

                // // 坐标线段x,y, z + 文字到这个组内
                // let textgroup = new THREE.Object3D();
                // let newPosite = { x: positionAttribute.getX(q), y: positionAttribute.getY(q), z: positionAttribute.getZ(q) }
                // let texts = [Math.abs(newPosite.x).toFixed(2), Math.abs(newPosite.y).toFixed(2), Math.abs(newPosite.z).toFixed(2)]
                // textgroup = linkArrow(font, texts)
                // textgroup.position.set(newPosite.x, newPosite.y, newPosite.z)

                // lookDirection.subVectors(textgroup.position, new THREE.Vector3(0, 0, 0)).normalize();
                // target.copy(textgroup.position).add(lookDirection);
                // textgroup.lookAt(target);
                // textgroup.rotation.y = Math.random() * Math.PI;
                // // 创建到全局Object3D对象内
                // textgroup.name = q
                let textgroup = createdItemXyzText(q)

                if(options.xyz && options.xyz !== 'undefined') {
                    textgroup.visible = false
                }
                txtlinkall.add(textgroup);

            }
            // 写入场景内
            scene.add(txtlinkall)
            if (options.xyz && options.xyz !== 'undefined') {
                ceretePolygeome(options.xyz)
            }
            animate()
        });
    }

    // 桌面
    // 创建全局监听事件

    container.addEventListener('resize', onWindowResize);
    container.addEventListener('click', onPointeronClick);

    let userIsMovexy = { x: 0, y: 0 }
    const constroStart = (event) => {
        let reevent = event || event.changedTouches[0]
        userIsMovexy.x = reevent.clientX;
        userIsMovexy.y = reevent.clientY;
    }

    container.addEventListener('mousedown', constroStart, false)
    container.addEventListener('touchstart', constroStart, { passive: false })

    // 鼠标移动时修改色，
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onMouseMove = (event) => {

        if (!txtlinkall && txtlinkall.children.length < 1) {
            return
        }
        // container.offsetWidth / container.offsetHeight
        //container.clientWidth, container.clientHeight
        event.preventDefault();
        // cavan在div内非window下全屏
        mouse.x = ((event.clientX - container.offsetLeft) / container.clientWidth) * 2 - 1;
        mouse.y = - ((event.clientY - container.offsetTop) / container.clientHeight) * 2 + 1;

        // 全屏，用了window.inniwidth
        // mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
        // mouse.y = - (event.clientY / container.clientHeight) * 2 + 1;

    }
    container.addEventListener('mousemove', onMouseMove, false);

 
    // 委托
    function onWindowResize() {
        //container.clientWidth, container.clientHeight
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    // 动态创建，截角八面体
    // 变形速度
    let spes = 700
    const ceretePolygeome = () => {
        let { vertex, Polygeometry } = OctahedronPositionAttr()
        let heiposins = []
        if (txtlinkall.children.length > 0) {
            let vindex = 0

            for (let r = 0; r < txtlinkall.children.length; r++) {
                const object = txtlinkall.children[r];

                if (object.children[0] && r !== selindex) {

                    object.children[0].children.map((objitem) => {
                        if (objitem.type === "Mesh") {
                            objitem.material.color.setHex(arrowcolor);
                        } else {
                            objitem.setColor(arrowcolor);
                        }
                    })

                }
                if (!vertex[vindex] || r === selindex) {
                 
                    //object.visible = false
                    let hiedPosition1 = new THREE.Vector3(0, 0, 0);
                    let heiween = new TWEEN.Tween(object.position).to(hiedPosition1, spes);
                    heiween.start()
                    heiposins.push(r)
                } else {
                    object.visible = true
                    let newPosition1 = new THREE.Vector3(vertex[vindex][0], vertex[vindex][1], vertex[vindex][2]);
                    let newtween = new TWEEN.Tween(object.position).to(newPosition1, spes);
                    newtween.start()
                }
                vindex++
                if (vertex.length === vindex) {
                    if (!sptemesh) {
                        const edges = new THREE.EdgesGeometry(Polygeometry);
                        sptemesh = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: arrowcolor }));
                        sptemesh.visible = false
                        scene.add(sptemesh);
                    }
                    // 开启旋转
                   isrotation = true
                }
                
            }

           
            setTimeout(() => {

                setTimeout(() => {
                    // 隐藏
                    for (let h = 0; h < heiposins.length; h++) {
                        let heiindex = heiposins[h]
                        let hienditem = txtlinkall.children[heiindex]
                        hienditem.visible = false
                    }
                    
                    // 创建选中坐标
                    let selitemobj = ''
                    let scaleval = 1.5
                    if (options.xyz && options.xyz !== 'undefined') {
                        selitemobj = createdItemXyzText(selindex,options.xyz)
                        scaleval = 3.2
                       // camera.position.z = 3.6
                    } else {
                        selitemobj = txtlinkall.children[selindex]
                    }

                    showselitem = selitemobj.clone()
                    showselitem.name = "selitem"
                    showselitem.scale.set(scaleval, scaleval, scaleval)
                    showselitem.visible = true
                    showselitem.position.set(0, 0, 0)
                    if (showselitem.children) {
    
                        showselitem.children[0].children.map((objitem, i) => {
    
                            if (objitem.type === "Mesh") {
                                objitem.material.color.setHex(slecolor)
                            } else {
                                objitem.setColor(slecolor);
                            }
    
                        })
    
                    }
                    scene.add(showselitem);
                    isrotation = false

                    camera.position.z = 2.2
     
                }, 300)
    
                if (sptemesh) {
                    sptemesh.visible = true
                }
                isqus = 2
            }, 450)

        }
    }


    // ===== moblie touche === end

    // 判断: 1全部球体，2截角8面体，3小球体
    let isqus = 1
    let sptemesh = null
    // 整体转
    let isrotation = false
  
    // 选中的下标
    let selindex = 0;
    let showselitem = null;
    let clicktime = ''
    function onPointeronClick(event) {

        let reevent = event || event.changedTouches[0]
        let { clientX, clientY } = reevent
        if (isrotation || userIsMovexy.x !== clientX && clientY !== userIsMovexy.y) {
            return
        }
        if (!txtlinkall || txtlinkall.children.length < 1 || !txtlinkall.children[selindex]) {
            return
        }

       if (clicktime && typeof clicktime !== undefined) {
         clearTimeout(clicktime)
       }
       clicktime = setTimeout(()=> {

        // 如果已是8面体，还原球体
        if (txtlinkall && isqus === 2) {
            // 整体转
            isrotation = true
            setTimeout(() => {
                // 还原球体全部坐标
                for (let q = 0; q < positionAttribute.count; q++) {
                    let rePosite = { x: positionAttribute.getX(q), y: positionAttribute.getY(q), z: positionAttribute.getZ(q) }
                    let reitem = txtlinkall.children[q];
                    if (reitem) {
                        reitem.visible = true
                        if (reitem.children[0] && q !== selindex) {

                            reitem.children[0].children.map((objitem) => {

                                if (objitem.type === "Mesh") {
                                    objitem.material.color.setHex(arrowcolor)
                                } else {
                                    objitem.setColor(arrowcolor);
                                }

                            })

                        }

                        let newPosition = new THREE.Vector3(rePosite.x, rePosite.y, rePosite.z);
                        let newtween = new TWEEN.Tween(reitem.position).to(newPosition, spes);
                        newtween.start()
                    }

                }
                // camera.position.z = 6
                sptemesh.visible = false
                setTimeout(() => {
                    isrotation = false
                }, 350)
                if(camera.position.z < 5){
                    camera.position.z = 5
                }
                // 删除中心坐标
                let selectedObject = scene.getObjectByName('selitem');
                scene.remove(selectedObject);

            }, 350)

            isqus = 1
            return
        }

        // 整体球时,创建截角8面体
        ceretePolygeome()
        
    }, 180)
    }

    const redevattr = (object) => {
        object.rotation.y += 0.005;
        object.rotation.z += 0.005;
        object.children[0].scale.set(0.005, 0.005, 0.005);
        object.children[0].children.map((reobjitem) => {
            if (reobjitem.type === "Mesh") {
                reobjitem.material.color.setHex(arrowcolor);
            }
            if (reobjitem.type === 'ArrowHelper') {
                reobjitem.setColor(arrowcolor);
            }
        })
    }

    // 创建全部坐标+文字,
    TextAndxyzMeshsAll(2.5, 5)
    function animate(time) {

        // camera.lookAt(scene.position);
        camera.updateMatrixWorld();

        // 坐标线段+文字旋转
        if (isqus === 1 && txtlinkall) {
            if (txtlinkall.children.length > 0 && !isrotation) {


                for (let r = 0; r < txtlinkall.children.length; r++) {
                    const object = txtlinkall.children[r];

                    if (selindex !== r) {
                        redevattr(object)
                    }
                }

                // 光线投射，事件感应
                raycaster.setFromCamera(mouse, camera);
                let intersects = raycaster.intersectObjects(txtlinkall.children, true);
                if (intersects && intersects.length > 0) {
                    let itemobj = intersects[0].object.parent
                    if (itemobj.type === 'Object3D' && itemobj.children.length === 4) {
                        let selname = itemobj.parent.name + ''
                        if (selname && selname !== undefined) {
                            let sleobjitem = txtlinkall.children[itemobj.parent.name]
                            if (itemobj.parent === sleobjitem && selindex !== itemobj.parent.name) {
                                selindex = itemobj.parent.name
                                let pitemobj = sleobjitem.children[0]
                                pitemobj.scale.set(0.01, 0.01, 0.01);
                                pitemobj.children.map((reobjitem) => {
                                    if (reobjitem.type === "Mesh") {
                                        reobjitem.material.color.setHex(slecolor);
                                    }
                                    if (reobjitem.type === 'ArrowHelper') {
                                        reobjitem.setColor(slecolor)
                                    }
                                })

                            }

                        }
                    }
                }
            }
        }


        if (isqus === 2 && sptemesh) {
            let rzy = 0.0005
            sptemesh.rotation.y += rzy;
            sptemesh.rotation.z += rzy;
            txtlinkall.rotation.y += rzy;
            txtlinkall.rotation.z += rzy;
            if (showselitem) {
                showselitem.rotation.y += rzy;
                showselitem.rotation.z += rzy;
            }
        }

        // 旋转中加速子球
        if(isrotation && sptemesh){
            sptemesh.rotation.y += 0.15;
        }

        // 整体快速旋转
        if (isrotation && txtlinkall) {
            txtlinkall.rotation.y += 0.15
        }

        if (isStartZoom && (!options.xyz || options.xyz === 'undefined')) {
            if (camera.position.z < 4.8) {
                camera.position.z += 0.1;
            }
            if (camera.position.z > 4.8) {
                isStartZoom = false
                controls.saveState()
            }
        }

        renderer.render(scene, camera);
        TWEEN.update(time);
        controls.update();
        animatime = requestAnimationFrame(animate);
    }

    return wordDestroy

}

export default coordInit;