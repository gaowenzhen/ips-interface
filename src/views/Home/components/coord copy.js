import * as THREE from "three";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
// import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
// import Stats from 'three/examples/jsm/libs/stats.module.js';

const coordInit = (container) => {

    if (!container) {
        return
    }
    let isclear = container.querySelector('canvas')
    if (isclear) {
        container.innerHTML = ''
    }
    console.dir('coord')

    const clock = new THREE.Clock();
    // 初次场景缩放
    let isStartZoom = true


    // 截面八角,初次放大
    let sqStartZom = true
 
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, container.width / container.height, 1, 10000);
    camera.position.z = 0.5;

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true, });
    renderer.setPixelRatio(window.devicePixelRatio);
    // container.offsetWidth / container.offsetHeight
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    
    
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // // ---stats--
    // const stats = new Stats();
	// stats.domElement.style.position = 'absolute';
	// stats.domElement.style.top = '0px';
	// container.appendChild( stats.domElement );
    // // --- stats -- end


    const controls = new OrbitControls(camera, renderer.domElement);


    // 单个，8面截体 + 文字
    let sptemesh = null
    const truOctahedron = () => {

        if (sptemesh) {
            scene.add(sptemesh)
            return
        }

        const reqData = {
            "name": "Truncated Octahedron",
            "category": ["Archimedean Solid"],
            "vertex": [[0, 0, 1.054093], [0.6324555, 0, 0.843274], [-0.421637, 0.4714045, 0.843274], [-0.07027284, -0.6285394, 0.843274], [0.843274, 0.4714045, 0.421637], [0.5621827, -0.6285394, 0.6324555], [-0.9135469, 0.3142697, 0.421637], [-0.2108185, 0.942809, 0.421637], [-0.5621827, -0.7856742, 0.421637], [0.9838197, 0.3142697, -0.2108185], [0.421637, 0.942809, 0.2108185], [0.7027284, -0.7856742, 0], [-0.7027284, 0.7856742, 0], [-0.9838197, -0.3142697, 0.2108185], [-0.421637, -0.942809, -0.2108185], [0.5621827, 0.7856742, -0.421637], [0.9135469, -0.3142697, -0.421637], [0.2108185, -0.942809, -0.421637], [-0.5621827, 0.6285394, -0.6324555], [-0.843274, -0.4714045, -0.421637], [0.07027284, 0.6285394, -0.843274], [0.421637, -0.4714045, -0.843274], [-0.6324555, 0, -0.843274], [0, 0, -1.054093]],
            "edge": [[0, 3], [3, 5], [5, 1], [1, 0], [2, 7], [7, 12], [12, 6], [6, 2], [4, 9], [9, 15], [15, 10], [10, 4], [8, 13], [13, 19], [19, 14], [14, 8], [11, 17], [17, 21], [21, 16], [16, 11], [18, 20], [20, 23], [23, 22], [22, 18], [1, 4], [10, 7], [2, 0], [6, 13], [8, 3], [5, 11], [16, 9], [14, 17], [12, 18], [22, 19], [15, 20], [21, 23]],
            "face": [[0, 3, 5, 1], [2, 7, 12, 6], [4, 9, 15, 10], [8, 13, 19, 14], [11, 17, 21, 16], [18, 20, 23, 22], [0, 1, 4, 10, 7, 2], [0, 2, 6, 13, 8, 3], [1, 5, 11, 16, 9, 4], [3, 8, 14, 17, 11, 5], [6, 12, 18, 22, 19, 13], [7, 10, 15, 20, 18, 12], [9, 16, 21, 23, 20, 15], [14, 19, 22, 23, 21, 17]]
        }

        var vertices = []
        for (var i = 0; i < reqData.vertex.length; i++) {
            let vitem = reqData.vertex[i]
            vertices.push(vitem[0])
            vertices.push(vitem[1])
            vertices.push(vitem[2])
        }

        var faces = []
        for (var faceNum = 0; faceNum < reqData.face.length; faceNum++) {
            for (var i = 0; i < reqData.face[faceNum].length - 2; i++) {
                faces.push(reqData.face[faceNum][0], reqData.face[faceNum][i + 1], reqData.face[faceNum][i + 2]);
            }
        }

        const material = new THREE.MeshNormalMaterial({ opacity: 0.8 })
        const geometry = new THREE.PolyhedronGeometry(vertices, faces, 1, 0);

        let normal = geometry.attributes.normal
        let array = normal.array
        let actsptemesh = new THREE.Mesh(geometry, material)

        let Octahedrontext = []

        let itemsArray = sgroup(array, 3)
        let fecstextindex = [0, 11, 12, 22, 28, 33, 44, 55, 66, 77, 88, 99, 110, 121]
        for (let r = 0; r < fecstextindex.length; r++) {
            let itemindex = fecstextindex[r]
            if (itemsArray[itemindex]) {
                let rsx = itemsArray[itemindex][0]
                let rsy = itemsArray[itemindex][1]
                let rsz = itemsArray[itemindex][2]
                let rstext = Math.abs(rsz).toFixed(1) + Math.abs(rsx).toFixed(1) + Math.abs(rsy).toFixed(1)
                rstext = rstext.replace(/^0\.?/, "")
                rstext = rstext.replace(/\./g, ",")
                const textGeo = ceretext(glopfont, rstext)
                // textGeo.rotateY(Math.random() * r * Math.PI)
                textGeo.translate(rsx, rsy, rsz)
                Octahedrontext.push(textGeo)
            }
        }

        let qcttxtbuffer = BufferGeometryUtils.mergeBufferGeometries(Octahedrontext, false);
        qcttxtbuffer.computeVertexNormals()

        let textMeshs = new THREE.Mesh(qcttxtbuffer, new THREE.MeshBasicMaterial({ color: 0xffffff }));

        sptemesh = new THREE.Group()
        sptemesh.add(actsptemesh, textMeshs);
        sptemesh.scale.set(2.2, 2.2, 2.2);
        scene.add(sptemesh)

    }


    // 分组
    function sgroup(array, subGroupLength) {
        let index = 0;
        let newArray = [];
        while (index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
    }

    // 创建字
    const ceretext = (font, text) => {
        const textarrt = {
            font: font,
            size: 0.04,
            height: 0.005,
            curveSegments: 3,
            bevelThickness: 3,
            bevelSize: 0.1
        }

        return new TextGeometry(text, textarrt);
    }

    // 获取球形顶点坐标
    // 球直径 sqsize, 线段数量 linklen
    const getSphericalXyzAll = (sqsize, linklen) => {
        // 创建圆形多面体，用来定位
        let pSphereGeometry = new THREE.DodecahedronGeometry(sqsize, linklen);
        pSphereGeometry.deleteAttribute('normal');
        pSphereGeometry.deleteAttribute('uv');

        // 获取圆形多面体所有的position
        pSphereGeometry = BufferGeometryUtils.mergeVertices(pSphereGeometry);
        // 取到球形顶点坐标，用来分布xyz线效果+文字的位置
        const positionAttribute = pSphereGeometry.getAttribute('position');
        return positionAttribute
    }

    // 3根线（x,y,z）
    const xyzlinkbuffer = () => {
         // 单个坐标线段x,y,z，效果
         const linksize = 0.1
         const linkvertices = [
             0, 0, 0, linksize, 0, 0,
             0, 0, 0, 0, linksize, 0,
             0, 0, 0, 0, 0, linksize
         ];
         // 3条线色
         const linkcolors = [
             1, 0, 0, 1, 0.6, 0,
             0, 1, 0, 0.6, 1, 0,
             0, 0, 1, 0, 0.6, 1
         ];
 
         // xyz线段效果写入缓冲中
         const linkgeometry = new THREE.BufferGeometry();
         linkgeometry.setAttribute('position', new THREE.Float32BufferAttribute(linkvertices, 3));
         linkgeometry.setAttribute('color', new THREE.Float32BufferAttribute(linkcolors, 3)); 
         return linkgeometry
    }

    // xyz,and text item all
    const linkArrow = (font, texts) => {
        let retextBufferGeometry = []
        let arrowScene = new THREE.Group()
        arrowScene.scale.set(0.005, 0.005, 0.005)
        let arrowPos = new THREE.Vector3(0, 0, 0);
        let x = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), arrowPos, 30, 0x7F2020, 6, 3)
        let y = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), arrowPos, 30, 0x207F20, 6, 3)
        let z = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), arrowPos, 30, 0x20207F, 6, 3)
        arrowScene.add(x);
        arrowScene.add(y);
        arrowScene.add(z);
        const textGeo = ceretext(font, "x:(" + texts[0]+")")
        textGeo.translate(0.13, 0, 0)
        const textGeo1 = ceretext(font, "y:("+texts[1]+")")
        textGeo1.translate(0, 0.13, 0)
        const textGeo2 = ceretext(font, "z:("+texts[2]+")")
        textGeo2.translate(0, 0, 0.13)
        retextBufferGeometry.push(textGeo)
        retextBufferGeometry.push(textGeo1)
        retextBufferGeometry.push(textGeo2)
        let mergedGeometrytext = BufferGeometryUtils.mergeBufferGeometries(retextBufferGeometry, false);
        mergedGeometrytext.computeVertexNormals()
        let textMeshs = new THREE.Mesh(mergedGeometrytext, new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));
        var linknadtext = new THREE.Object3D()
        linknadtext.add(textMeshs, arrowScene);
        return linknadtext
    }

    // 全部坐标,第一场景进入时
    let glopfont = null
    // 全部xyz线段+文字
    let txtlinkall = null
    function TextAndxyzMeshsAll(sqsize, linklen) {
        txtlinkall = new THREE.Object3D()
       
        // 线段材质
        const materiallink = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 6.0, toneMapped: false, side: THREE.DoubleSide });

        // 创建圆形多面体，用来定位,
        const positionAttribute = getSphericalXyzAll(sqsize, linklen)


        // font 坐标加文字数据等文字都加载完成再渲染整个
        const loader = new FontLoader();

        // 能直接读取public目录
        loader.load('/static/fonts/helvetiker_bold.typeface.json', function (font) {

            glopfont = font

             // 纠正分布球体表面朝向
             let lookDirection = new THREE.Vector3();
             let target = new THREE.Vector3();

            // 遍历圆形所有顶点坐标，xyz，创建文字
            for (let q = 0; q < positionAttribute.count; q++) {

                // 坐标线段x,y, z + 文字到这个组内
                let textgroup = new THREE.Group();
                textgroup.name = 'txtlinkid_' + q
                // 克隆出x,y,z线段模型
                let xyzitem = xyzlinkbuffer().clone()
                // 修改x,y,z,线段模型位置
                xyzitem.translate(positionAttribute.getX(q), positionAttribute.getY(q), positionAttribute.getZ(q))
                // 读出x,y,z
                let item = xyzitem.attributes.position.array
                // text，xyz，3方向的文字字
                let retextBufferGeometry = []
                // 箭头
                let ConeBufferGeometry = []
                // 拆3个一组
                let itemsArray = sgroup(item, 3)
                for (let s = 0; s < itemsArray.length; s++) {
                    let sitem = itemsArray[s]
                    // 创建出球型态，新xyz
                    let posts = new THREE.Vector3(sitem[0], sitem[1], sitem[2])

                    // text
                    if ((s % 2) === 1) {

                        // 碰到x,y,z方向就添加文字
                        let rstext = null
                        if (s === 1) {
                            rstext = "x:(" + Math.abs(posts.x).toFixed(2)+")"
                        }
                        if (s === 3) {
                            rstext = "y:("+Math.abs(posts.y).toFixed(2)+")"
                        }
                        if (s === 5) {
                            rstext = "z:("+Math.abs(posts.z).toFixed(2)+")"
                        }
                        // 创建文字
                        if (rstext) {
                            const textGeo = ceretext(font, rstext)
                            textGeo.translate(posts.x, posts.y, posts.z)
                            retextBufferGeometry.push(textGeo)

                            // 创建锥子
                            let coneGeometry = new THREE.ConeBufferGeometry( 0.015, 0.03, 6);
                            
                            if(s === 1){
                                // 修改位置
                               coneGeometry.translate(posts.x, posts.y, posts.z);
                              // coneGeometry.rotateX(Math.PI / 12);
                            //    const quaternion = new THREE.Quaternion();
                            //    quaternion.setFromAxisAngle( new THREE.Vector3( posts.x, posts.y, posts.z ), 1.2 );

                            //    let mx = new THREE.Matrix4().lookAt(new THREE.Vector3( posts.x, posts.y, posts.z ),new THREE.Vector3( posts.x, posts.y-=0.02, posts.z ),new THREE.Vector3( posts.x, posts.y, posts.z ));
                            //   let qt = new THREE.Quaternion().setFromRotationMatrix(mx);
                            //    coneGeometry.applyQuaternion(qt);

                            } else {
                                coneGeometry.translate(posts.x, posts.y, posts.z);
                            }
                            //coneGeometry.rotateX(Math.PI * 0.5);
                            //cone.geometry.rotateY(Math.PI * 0.25);
                           // cone.geometry.rotateZ(Math.PI * 0.75);
                            ConeBufferGeometry.push(coneGeometry)
                        }
                    }
                }
                // 把x,y,z,的text 合并到一个Buffer内
                let mergedGeometrytext = BufferGeometryUtils.mergeBufferGeometries(retextBufferGeometry, false);
                mergedGeometrytext.computeVertexNormals()
                // 字buffer
                let textMeshs = new THREE.Mesh(mergedGeometrytext, new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));
                // x,y,z线段效果
                const linkmesh = new THREE.Line(xyzitem, materiallink)
               
                // 锥形
                 // 把x,y,z,的text 合并到一个Buffer内
                let mergedGeometryconegeo = BufferGeometryUtils.mergeBufferGeometries(ConeBufferGeometry, false);
                mergedGeometryconegeo.computeVertexNormals()
                let conebuffMeshs = new THREE.Mesh(mergedGeometryconegeo, new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));

                // 合并写入到组内
                textgroup.add(textMeshs, linkmesh,conebuffMeshs)
                
                lookDirection.subVectors( textgroup.position, new THREE.Vector3(0,0,0) ).normalize();
                target.copy( textgroup.position ).add( lookDirection );
                textgroup.lookAt( target );
                textgroup.rotation.x = Math.random() * Math.PI;
                textgroup.rotation.z = Math.random() * Math.PI;

                // 非buffer
                // let newPosite = {x: positionAttribute.getX(q), y: positionAttribute.getY(q), z: positionAttribute.getZ(q)}
                // let texts = [Math.abs(newPosite.x).toFixed(2), Math.abs(newPosite.y).toFixed(2),Math.abs(newPosite.z).toFixed(2)]
                // textgroup = linkArrow(font, texts)
                // textgroup.position.set(newPosite.x,newPosite.y,newPosite.z)

                // lookDirection.subVectors( textgroup.position, new THREE.Vector3(0,0,0) ).normalize();
                // target.copy( textgroup.position ).add( lookDirection );
                // textgroup.lookAt( target );
                // textgroup.rotation.y = Math.random() * Math.PI;
                // ----非buffer end

                // 创建到全局Object3D对象内
                txtlinkall.add(textgroup)
                // mergedGeometrytext.dispose()
                // if(q > 40){
                //   break;
                // }

            }
            // 写入场景内
            scene.add(txtlinkall)
        });

        animate();

    }

    // 桌面
    // 创建全局监听事件
    container.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onWindowResize);
    container.addEventListener('click', onPointeronClick);
    // 区分点击，还是移动
    // 鼠标按下时
    container.addEventListener('mousedown', onPointeronMousedown);
    // 鼠标左键松开时
    container.addEventListener('mouseup', onPointeronMouseup);

// container.offsetWidth / container.offsetHeight
    // 委托
    function onWindowResize() {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }

    function onPointerMove(event) {
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        pointer.x = (event.clientX / container.offsetWidth) * 2 - 1;
        pointer.y = - (event.clientY / container.offsetHeight) * 2 + 1;
        mouval.m = event.clientX
    }

    // ----区分点击 start，还是拖动
    let mouval = { d: null, m: null, u: null }
    function onPointeronMousedown(event) {
        mouval.d = event.clientX
    }

    function onPointeronMouseup(event) {
        mouval.u = event.clientX
    }
    // ----区分点击 end-----


    // 移动端
    // ===== moblie touche === start
    document.addEventListener('touchmove', touchMove, { passive: false });
    document.addEventListener('touchend', touchend, { passive: false })
    document.addEventListener('touchstart', touchstart, { passive: false })

    // 触摸移动中
    function touchMove(event) {
        if (event.touches && event.touches.length == 2) {
            isTwoFingers = true
        } else {
            isTwoFingers = false
        }
        let newevent = event.changedTouches[0]
        mouval.m = newevent.clientX
        //console.dir('touchmove')

    }
    // 触摸结束
    function touchend(event) {
        let newevent = event.changedTouches[0]
        mouval.u = newevent.clientX
        //console.dir('touchend')
    }
    // 触摸开始
    // 单双指 isTwoFingers
    let isTwoFingers = false
    function touchstart(event) {
        if (event.touches && event.touches.length == 2) {
            isTwoFingers = true
        } else {
            isTwoFingers = false
        }
        let newevent = event.changedTouches[0]
        mouval.d = newevent.clientX
        // console.dir('touchstart')
    }


    function restartControls() {
        controls.reset()
        isStartZoom = false
        camera.position.z = 8
    }

    // ===== moblie touche === end

    // 判断: 1全部球体，2截角8面体，3小球体
    let isqus = 1
    function onPointeronClick(event) {

        // 区分鼠标点击和移动
        const { m, d, u } = mouval
        if (u !== d && m !== u) {
            return
        }
        // 移动版下，判断单算自
        if (isTwoFingers) {
            return
        }

        const clickpointer = new THREE.Vector2();

        var rect = renderer.domElement.getBoundingClientRect();
        clickpointer.x = ((event.clientX - rect.left) / (rect.width - rect.left)) * 2 - 1;
        clickpointer.y - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

        // 用户点击后获取被点击对象，这里有不准确问题，要改进
        raycaster.setFromCamera(clickpointer, camera);
        let intersects = null
        if (isqus === 1) {
            intersects = raycaster.intersectObjects(txtlinkall.children);
            if (intersects.length > 0) {
                restartControls()
                let moveobject = intersects[0].object
                // console.dir(1111)
                // 如果是组就进入，8面体
                if (moveobject.parent.type === 'Object3D') {
                    console.dir(2222)
                    // 给相机加个放大效果
                    let zomm = setInterval(() => {
                        camera.position.z -= 0.1;
                        if (camera.position.z < 0.001) {
                            // 效果结束
                            clearInterval(zomm)
                            isqus = 2
                            scene.remove(txtlinkall)
                            renderer.renderLists.dispose()
                            txtlinkall = null
                            // 镜头恢复
                            camera.position.z = 8
                            // 创建8面体
                            truOctahedron()
                            sqStartZom = false
                            controls.saveState()
                        }
                    }, 10)
                }
            }
        }


        // 点击截面8角体，
        // 按数据判断，没有下级就直接跳转到，具体界面
        // 如果有下级，就进入球体状态
        if (isqus === 2) {
            intersects = raycaster.intersectObjects(sptemesh.children, true);
            if (intersects.length > 0) {
                restartControls()
                let zomm = setInterval(() => {
                    camera.position.z -= 0.1;
                    if (camera.position.z < 0.01) {
                        // 效果结束
                        clearInterval(zomm)
                        isqus = 3
                        sqStartZom = true
                        scene.remove(sptemesh)
                        renderer.renderLists.dispose();
                        sptemesh = null
                        // 镜头恢复
                        camera.position.z = 8
                        // 小球少字坐标
                        TextAndxyzMeshsAll(1, 1)
                        txtlinkall.scale.set(2.5, 2.5, 2.5);
                    }
                }, 10)
                

            }
        }
        // 小球体
        if (isqus === 3) {

            intersects = raycaster.intersectObjects(txtlinkall.children);
            if (intersects.length > 0) {
                let moveobject = intersects[0].object
                // 如果是组就进入，8面体
                if (moveobject.parent.type === 'Object3D') {
                    alert(moveobject.parent.name)
                }
            }
        }
    }

    // 创建全部坐标+文字,
    TextAndxyzMeshsAll(3, 6)

    // 渲染
    function animate() {

        // camera.lookAt(scene.position);
        camera.updateMatrixWorld();
        // 光线投射，事件感应
        raycaster.setFromCamera(pointer, camera);
        // let intersects = null
        // if (isqus === 1) {
        //     intersects = raycaster.intersectObjects(txtlinkall.children);
        //     if (intersects.length > 0) {

        //         // .object.parent
        //         //for (let s = 0; s < intersects.length; s++) {
        //         let moveobject = intersects[0].object
        //         if (moveobject.parent.type === 'Object3D') {

        //             let groupobject = moveobject.parent
        //             let uuid = groupobject.uuid
        //             let isuuid = rayceventobject.find((item) => {
        //                 return item === uuid
        //             })

        //             if (!isuuid) {
        //                 rayceventobject.push(uuid)
        //                 groupobject.children[0].material.color.set(0xff0000);
        //                 groupobject.children[1].material.color.set(0xff0000);
        //             }
        //         }
        //         //}

        //     } else {

        //         if (rayceventobject.length > 0) {
        //             for (let c = 0; c < rayceventobject.length; c++) {
        //                 let uuid = rayceventobject[c]
        //                 let itemgroup = txtlinkall.children.find((gitem) => {
        //                     return gitem.uuid === uuid
        //                 })
        //                 if (itemgroup) {
        //                     itemgroup.children[0].material.color.set(Math.random() * 0xffffff);
        //                     itemgroup.children[1].material.color.set(Math.random() * 0xffffff);
        //                     // itemgroup.scale.set(1, 1, 1)
        //                 }
        //             }
        //             rayceventobject = []
        //         }
        //     }
        // }


        // 坐标线段+文字旋转
        if ((isqus === 1 || isqus === 3) && txtlinkall) {
            if (txtlinkall.children.length > 0) {
                for (let r = 0; r < txtlinkall.children.length; r++) {
                    const object = txtlinkall.children[r];
                    object.rotation.y += 0.001;
                    object.rotation.z += 0.001;
                }
            }
        }


        if (isqus === 2 && sptemesh) {
            // intersects = raycaster.intersectObjects(sptemesh.children, true);
            //if (intersects.length > 0) {
            sptemesh.rotation.y += 0.001;
            sptemesh.rotation.z += 0.001;

            if (sptemesh.scale.x < 0.3 && sqStartZom && !isTwoFingers) {
                let rzom = sptemesh.scale.x + 0.01
                sptemesh.scale.set(rzom, rzom, rzom)
                sqStartZom = false
            }
            //}
        }


        if (isStartZoom) {
            if (camera.position.z < 8) {
                camera.position.z += 0.1;
            }
            if (camera.position.z > 8) {
                isStartZoom = false
                controls.saveState()
            }
            // console.dir(controls)
        }

        renderer.render(scene, camera);
        // stats.update();
        controls.update();
        requestAnimationFrame(animate);

    }

}

export default coordInit;