import * as THREE from "three";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
// 拆分v
export const sgroup = (array, subGroupLength) => {
    let index = 0;
    let newArray = [];
    while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}

// 生成字体
export const ceretext = (font, text) => {
    const textarrt = {
        font: font,
        size: 0.05,
        height: 0.006,
        curveSegments: 3,
        bevelThickness: 3,
        bevelSize: 0.1
    }

    return new TextGeometry(text, textarrt);
}


// 获取球形顶点坐标
// 球直径 sqsize, 线段数量 linklen
export const getSphericalXyzAll = (sqsize, linklen) => {
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