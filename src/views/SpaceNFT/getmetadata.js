
import axios from "axios";
export const getMetaData = (list,isreimgpath) => {

  return new Promise((resolve, reject) => {
    let newitem = []
    let i = 0
    const getitemdata = async () => {

      if (list[i] && i < list.length) {
        try {
          let itemobj = list[i]
          if (!/\.json/g.test(itemobj.ipfsUri)) {
            itemobj.ipfsUri = itemobj.ipfsUri + '.json'
          }
         // get meta .json
          const item = await axios.get(itemobj.ipfsUri)
          if (item.data) {
            itemobj.coord = item.data.coord
            let newurl = item.data.image
            if (/^ipfs:\/\//g.test(newurl) && isreimgpath === true) {
              newurl = newurl.replace('ipfs://', 'https://ipfs.io/ipfs/')
            }
            itemobj['image'] = newurl
            itemobj['name'] = item.data.name
            newitem.push(itemobj)
          }
          i += 1
          getitemdata()

        } catch (error) {
          reject(error)
        }

      } else {
        resolve(newitem);
      }
    }
     getitemdata()
  });
}