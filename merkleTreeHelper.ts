const fs = require("fs");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

let merkleTreeSaveToBasePath = "F:\\codes\\github\\ips-contract\\scripts\\coordinatesJson\\merkleTrees\\";

function formatCoordinate(level: number, tokenId: number, x: number, y: number, z: number) {
  var formatRsp = ethers.utils.solidityKeccak256(
    ["uint256", "string", "uint256", "string", "uint256", "string", "uint256", "string", "uint256"],
    [level, "_", tokenId, "_", x, "_", y, "_", z]
  );

  //   return `${level}_${tokenId}_${x}_${y}_${z}`;
  return formatRsp;
}

//#2 转化坐标数据结构
async function formatCoordinateData(fromJsonFile: string, level: number) {
  var coordinateConfigSource = await fs.readFileSync(fromJsonFile, "utf-8");
  var coordinateBeforeArray = JSON.parse(coordinateConfigSource);
  var coordinateAfterArray = new Array();
  
  for (let i = 0; i < coordinateBeforeArray.length; i++) {
    var coordinateBefore = coordinateBeforeArray[i];
    var coordinateAfterFormat = formatCoordinate(level, i, coordinateBefore[0], coordinateBefore[1], coordinateBefore[2]);
    coordinateAfterArray.push(coordinateAfterFormat);
  }

  return coordinateAfterArray;
}

//生成默克尔树，并获取根hash
async function buildMerkleTree(coordinateArrayFormated: any) {
  //第二步：生成这些坐标的默克尔树
//   const leafNodes = coordinateArrayFormated.map((str: string) => keccak256(str));
  const merkleTree = new MerkleTree(coordinateArrayFormated, keccak256, { sortPairs: true });
  const root_hash = merkleTree.getHexRoot();
  console.log(`rootHash:${root_hash}`);

  //第三步：将结果保存到文件中
  const merkleTreeSaveTo = `${merkleTreeSaveToBasePath + new Date().getTime()}.json`;
  await fs.writeFileSync(merkleTreeSaveTo, merkleTree.toString());

  return merkleTree;
}

// #1 生成证明
async function generateProof(fromJsonFile: string, level: number, nftTokenId: number, x: number, y: number, z: number) {
  //生成树
  const coordinateArrayFormated = await formatCoordinateData(fromJsonFile, level);
  const merkleTree = await buildMerkleTree(coordinateArrayFormated);

  //生成坐标的叶子
  const coordinateAfterFormat = formatCoordinate(level, nftTokenId, x, y, z);
//   const leaf = keccak256(coordinateAfterFormat);

  console.log(`coordinateAfterFormat:${coordinateAfterFormat.toString("hex")}`);
//   console.log(`leafHex:${leaf.toString("hex")}`);

  const proof = merkleTree.getProof(coordinateAfterFormat);
  return { proof: proof, proofHex: merkleTree.getHexProof(coordinateAfterFormat)};
}

//默克尔树使用流程测试
async function merkelTreeTest() {
  //参数
  let fromJsonFile = "F:\\codes\\github\\ips-contract\\scripts\\coordinatesJson\\coord10610.json";
  let level = 27; //当前球的层数
  let targetTokenId = 3; //当前tokenId
  let [x, y, z] = [4, 48, 4]; //tokenId对应的坐标

  //第一步：格式化坐标文件：将坐标加上层级和tokenId重新写到一个数组中,如：第27层球的tokenId为0的坐标是[1,51,1],重写结果为"27_0_1_51_1"
  const coordinateArrayFormated = await formatCoordinateData(fromJsonFile, level);

  //第二步：用刚格式化后的数据生成默克尔树
  const merkleTree = await buildMerkleTree(coordinateArrayFormated);
  const root = merkleTree.getRoot();
  const root_hash = merkleTree.getHexRoot();
  console.log(`rootHash:${root_hash}`);

  //第三步：获取需要证明的页节点
  const coordinateAfterFormat = formatCoordinate(level, targetTokenId, x, y, z);

  //生成证明 或 const proof = (await generateProof(fromJsonFile, level, targetTokenId, x, y, z)).proof;
  const proof = merkleTree.getProof(coordinateAfterFormat);

  console.log(`coordinateAfterFormat:${coordinateAfterFormat}`);
  console.log(`leaf:${coordinateAfterFormat}`);
  console.log(`hexProof:${merkleTree.getHexProof(coordinateAfterFormat)}`);

  //第四步：验证刚生成的证明
  console.log(`proof verify result:${merkleTree.verify(proof, coordinateAfterFormat, root)}`);
}

// merkelTreeTest();

export { merkelTreeTest };
export { generateProof };
