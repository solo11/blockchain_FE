import { Button } from "@chakra-ui/react";
import { useMetaMask } from "metamask-react";
import { useEffect } from "react";
import Web3 from "web3"
import PhotoSharingNFT from '../contracts/PhotoSharingNFT.json'





export default function Register() {
    const { status, connect, account, chainId, ethereum } = useMetaMask();

    
        // const web3 = new Web3(ethereum)
        // const networkId =  web3.eth.net.getId();
        // const nftContract = new web3.eth.Contract(PhotoSharingNFT.abi,PhotoSharingNFT.networks[networkId].address)

        // console.log(nftContract)


        async function registerUser(name,ethereum){
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(PhotoSharingNFT.address, PhotoSharingNFT.abi, signer);
                try {
            const transaction = await contract.register(name);
            console.log('User registered',transaction)}
            catch (e) {
                console.log('User already registered')
                // const transaction = await contract.unregister();
            }
        }

    return( 
        <div>
                <Button onClick={() => registerUser('user1',ethereum,account)}>Register </Button>
        </div>
    )
}