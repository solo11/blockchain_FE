import {React, useEffect, useState} from "react";

export default function Gallery() {

    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEUxRmVjYzcxNThjNThCMzZmOTkzMjdkYkFFREM3ZjQ1NWVkMzU3RDQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MTc5MjAyOTA0NCwibmFtZSI6ImJjcCJ9.2M10xANG_hQUHZrnwtZ-QNqGFtDD887hEKtL73ldVCQ'

    const [postsData, setpostsData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadPosts = async () => {
          try {
            setLoading(true)
            let cids = await fetch('https://api.nft.storage/', {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            })
            cids = await cids.json()

            const temp = []
            for (let cid of cids.value) {
              if (cid?.cid) {
                let data = await fetch(
                  `https://ipfs.io/ipfs/${cid.cid}/metadata.json`,
                )
                data = await data.json()
      
                const getImage = (ipfsURL) => {
                  if (!ipfsURL) return
                  ipfsURL = ipfsURL.split('://')
                  return 'https://ipfs.io/ipfs/' + ipfsURL[1]
                }
    
                data.image = await getImage(data.image)
                data.cid = cid.cid
                data.created = cid.created
                temp.push(data)
              }
            }
            setpostsData(temp)
            setLoading(false)

          } catch (error) {
            console.log(error)
            setLoading(false)
          }
        }
        loadPosts()

      }, [])

    return(
        <div>{loading ? <div>loading</div>: <div>Loaded {postsData.length}</div>}</div>
    )
}