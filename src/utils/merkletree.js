const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
import tokenXyzAll from "./formatedData.json"

function formatCoordinate(level, tokenId, x, y, z) {
    var formatRsp = ethers.utils.solidityKeccak256(
      ["uint256", "string", "uint256", "string", "uint256", "string", "uint256", "string", "uint256"],
      [level, "_", tokenId, "_", x, "_", y, "_", z]
    );
    return formatRsp;
}

// 全局，执行一次
export const bindmerkletree = () => {
    const merkleTree = new MerkleTree(tokenXyzAll, keccak256, { sortPairs: true });
    return merkleTree;
}

export const getItem = () => {
    const coordinateAfterFormat = formatCoordinate(level, nftTokenId, x, y, z);
    const proof = merkleTree.getProof(coordinateAfterFormat);
    return { proof: proof, proofHex: merkleTree.getHexProof(coordinateAfterFormat)};
}
