
import {React, useState, useEffect} from "react"


import {BiLike, BiChat, BiShare} from 'react-icons/bi'

import { Card,
    CardFooter,
    Image,
    Heading,
    Stack,
    Text,
    CardBody,
    Button,
    Flex,
    Spacer,
    CardHeader,
    Avatar,
    Box,
    Center,
    Input
   
   } from '@chakra-ui/react'

import PhotoSharingNFT from '../contracts/PhotoSharingNFT.json'



export default function Profile() {

    const[posts,setPosts] = useState(undefined)

    const[posts_final,setPosts_final] = useState(undefined)

    const [first, setFirst] = useState(true)

    const[loaded,setLoaded] = useState(false)

    const[loaded_loc,setLoaded_loc] = useState(false)



    useEffect( () => {


        console.log(loaded)
        const getAllPosts = async () => {

            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            //Pull the deployed contract instance
            let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);
                try {
            const transaction = await contract.getAllNFTs();
            console.log('All NFTS',transaction)
            setPosts(transaction)
            console.log('loading')
            
            const temp = []
            for (let index = 0; index < posts.length; index++) {
                var tokenid = posts[index]['tokenId'].toNumber()
                var price = posts[index]['price'].toNumber()
                var forSale = posts[index]['forSale']
                var cid = posts[index][2];
                var address = posts[index][1];

                const id =  cid.split("/")
                cid = id[2]
                  let data = await fetch(
                      `https://ipfs.io/ipfs/${cid}/metadata.json`,
                    )
                var js_data = await data.json()
                temp.push({address , js_data, tokenid, price, forSale})
            }
            setPosts_final(temp)
            setLoaded(true)
        }
            catch (e) {
                console.log('User already registered')
                // const transaction = await contract.unregister();
            }
        }

        if(posts_final == undefined){
            console.log(posts_final)
            getAllPosts()
            .catch(console.error)
        }

    },[posts])


    const getIPFSGatewayURL = (ipfsURL)=>{
        let urlArray = ipfsURL.split("/");
        let ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
        console.log(ipfsGateWayURL)
        return ipfsGateWayURL;
        }

        const getImage = (ipfsURL) => {
            if (!ipfsURL) return
            ipfsURL = ipfsURL.split('://')
            return 'https://ipfs.io/ipfs/' + ipfsURL[1]
          }

          

async function getData(url) {
    
   const id =  url.split("/")
  const  cid = id[2]
  console.log(cid)
    let data = await fetch(
        `https://ipfs.io/ipfs/${cid}/metadata.json`,
      )
      var js_data = await data.json()
      console.log(js_data)
      return js_data
   }

async function updatePrice(tokenId,amount) {

    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    //Pull the deployed contract instance
    let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);
        try {
    const transaction = await contract.sellNFT();
    console.log('All NFTS',transaction)
    setPosts(transaction)
    
    console.log('loading')
}
catch(e) {
    console.error
}
}
function Post({cid,address}) {

        var address = cid['address']
        var data = cid['js_data']
        var forSale = cid['forSale']
        var price = cid['price']

        // console.log(address,data.image)
        var ipfsURL = data.image
        console.log(ipfsURL)
        ipfsURL = ipfsURL.split('://')
        // ipfsURL = ipfsURL[3].split('/')
        
        var image =  'https://ipfs.io/ipfs/' + ipfsURL[1]
        console.log(image)
        return(
            <Center>
            <Card margin='4'  minW={'300px'}>
<CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name={data.username} src='https://bit.ly/sage-adebayo' />

        <Box>
          <Heading size='sm'>{data.username}</Heading>

        </Box>
      </Flex>
    </Flex>
  </CardHeader>

            <CardBody>

              <Stack mt='=4' spacing='3' direction='row'>
                <div style={{maxWidth:'300px'}}>
                <Image
                src={image}
                borderRadius='lg'
              />
              </div>

              <Flex direction='column'>
            <Heading size='md'>{data.name}</Heading>
                <br/>
                <Text  size='md'>
                    {data.description}  
                </Text>

                </Flex>
              </Stack>
            </CardBody>
        <Flex>
            <CardFooter >
            { forSale ?
                <Button variant='solid' colorScheme='blue'>
                  Buy now
                </Button> :
                <div>
             <Input width={'150px'} type="number" />
              <Button margin={'10px'} variant='solid' colorScheme='blue' onClick={() => {}}>
                Sell
              </Button>
                </div>
               
            }
                <Spacer />
    <Button flex='1' variant='ghost' leftIcon={<BiLike />}>

    </Button>
    <Button flex='1' variant='ghost' leftIcon={<BiChat />}>

    </Button>
    <Button flex='1' variant='ghost' leftIcon={<BiShare />}>

    </Button>
                <Text p="1" textAlign='right' color='blue.600' fontSize='xl'>
                  ETH {'0'}
                </Text>
   
            </CardFooter>
            </Flex>
          </Card>
          </Center> )
    }


    return(
           <div>

            {/* { loaded && first  ?

                // posts.map(function(ob,i){
                //     return <Post cid={ob}/>
                // }) 
                posts.map((post,i) => {
                    console.log(post[2],post[1])
                    
                    if(i==post.length){
                        setFirst(false)
                    }
                    
                    
                    // setLoaded(false)
                //    
                // }
                //    />
                } )

                : undefined
            } */}

            {posts_final != undefined ? posts_final.map((post,i) => {
                return(
                <Post key={i} cid={post}/>)
            }) : undefined}
            {/* <Button onClick={() => {getAllPosts()}}> Get NFTS</Button> */}
           </div> 
    )
}