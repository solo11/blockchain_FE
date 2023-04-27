import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, Box,
    Text,
    Button, TagLabel} from "@chakra-ui/react";
import React, { useState } from "react";

import { NFTStorage } from 'nft.storage'

import './upload.css'
import { AttachmentIcon } from "@chakra-ui/icons";

import PhotoSharingNFT from '../contracts/PhotoSharingNFT.json'


export default function UploadPage() {

const [imageName, setimageName] = useState('')
const [imageDesc, setimageDesc] = useState('')

const [user, setUser] = useState('')

const handleImageName = (e) => setimageName(e.target.value)
const handleImageDesc = (e) => setimageDesc(e.target.value)

const isError = imageName === ''

const APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEUxRmVjYzcxNThjNThCMzZmOTkzMjdkYkFFREM3ZjQ1NWVkMzU3RDQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MTc5MjAyOTA0NCwibmFtZSI6ImJjcCJ9.2M10xANG_hQUHZrnwtZ-QNqGFtDD887hEKtL73ldVCQ'

const [uploadedFile, setUploadedFile] = useState();
const [metaDataURL, setMetaDataURl] = useState();
const [txURL, setTxURL] = useState();
const [txStatus, setTxStatus] = useState();
const [imageView, setImageView] = useState();
const [error, setError] = useState();


const handleFileUpload = (event) => {
console.log("file is uploaded");
setUploadedFile(event.target.files[0]);
setTxStatus("");
setImageView("");
setMetaDataURl("");
setTxURL("");

}

const getIPFSGatewayURL = (ipfsURL)=>{
let urlArray = ipfsURL.split("/");
let ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
console.log(ipfsGateWayURL)
return ipfsGateWayURL;
}

const getUser = async() => {
    const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);
                try {
            const transaction = await contract.getUsername();
            console.log('User registered',transaction)
            if(transaction == 'user not registered') { 
                setUser('') 
                return transaction
            }
            else {
                setUser(transaction)
                return transaction
            }
        }
            catch (e) {
                console.log('User not registered')
                return 
               
            }
}

const uploadNFTContent = async(inputFile,imageName,imageDesc,user) =>{
const nftStorage = new NFTStorage({token: APIKEY,});
try {
    setTxStatus("Uploading NFT to IPFS & Filecoin via NFT.storage.");
    const metaData = await nftStorage.store({
        name: imageName,
        description: imageDesc,
        username: user,
        image: inputFile
    });
    setMetaDataURl(getIPFSGatewayURL(metaData.url));
    console.log(metaData)
    return metaData;

} catch (error) {
    // setError(error);
    console.log(error);
}
}

const mintNFTToken = async(event, uploadedFile,imageName,imageDesc) =>{

const user = await getUser();

if(user == 'user not registered') { 
    console.log('User not registered cannot upload')
    return 
}


if(uploadedFile == undefined) {
    event.preventDefault();
    setError('Please select the file')
    console.log(error)
}
else {
    console.log(error)
event.preventDefault();
const metaData = await uploadNFTContent(uploadedFile,imageName,imageDesc,user);
console.log(metaData)
console.log(error)
const ethers = require("ethers");
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

//Pull the deployed contract instance
let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);

const transaction = await contract.uploadPost(metaData.url,metaData.data.name,metaData.data.description);
console.log('NFT Minted tokenid: ',transaction)
previewNFT(metaData);
}
}

const previewNFT = (metaData) =>{
try {
let imgViewString = getIPFSGatewayURL(metaData.data.image.pathname);;
setImageView(imgViewString);
setMetaDataURl(getIPFSGatewayURL(metaData.url));
setTxStatus("NFT is minted successfully!");
}
catch (e) {
    // setError('File error :')
}
}

return (
<center>
<div>
<Text paddingTop={7} >Upload Image</Text>
<Box backgroundColor={'grey-500'} margin={10} padding={7} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>  
<form>
<FormControl isRequired>
<FormLabel fontSize={15}>Image Name</FormLabel>
<Input type='text' value={imageName} onChange={handleImageName} />
{!isError ? (
  <FormHelperText>
    Name of the image
  </FormHelperText>
) : (
  <FormErrorMessage>Image name is required.</FormErrorMessage>
)}
</FormControl>

<FormControl paddingTop={3} isRequired>
<FormLabel fontSize={15}>Image Description</FormLabel>
<Input type='text' value={imageDesc} onChange={handleImageDesc} />
{!isError ? (
  <FormHelperText>
    Description of the image
  </FormHelperText>
) : (
  <FormErrorMessage>Image description is required.</FormErrorMessage>
)}
</FormControl>

<FormControl paddingTop={3} isRequired>
<FormLabel   className="label-file" fontSize={15}>Choose image

<Input className="input-file" type="file" onChange={handleFileUpload}  />
<AttachmentIcon marginLeft={2}/>

</FormLabel>

{!isError ? (
  <FormHelperText>
    choose the image file
  </FormHelperText>
) : (
  <FormErrorMessage>Image is required.</FormErrorMessage>
)}
</FormControl> 


</form>
<Button style={{marginTop:20}} onClick={e=>mintNFTToken(e, uploadedFile,imageName,imageDesc)}>Mint NFT</Button>
{imageView && <img className='NFTImg' src={imageView} alt="NFT preview"/>}   
</Box>
</div>
</center>
)
}
