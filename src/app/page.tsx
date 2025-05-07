'use client'
import Image from "next/image";
import picBack from "../pic/token-staking.png";
import picCoin from "../pic/Bag.gif";
import  {tokenSADR, tokenCADR, tokenRABI, tokenSABI, tokenStakingADR, tokenStakingABI} from "../DataFile";
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";




export default function Home() {

  const [stakeBalance, setStakeBalance] = useState<number>(0);
  const [rewardBalance, setRewardBalance] = useState<number>(0);
  const refStakeInput = useRef<HTMLInputElement | null>(null);



  const ContractConnect = async(contractAddress: string, contractABI: object[] )=>{

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if(window.ethereum){
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });  
      if (accounts.length === 0) {
          console.log("No connected account found!");
      } else {
          console.log("Connected account:", accounts[0]);
      }
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      return [contract, accounts[0]];
    }
  }

  useEffect(()=>{
    const connectCTokenS = async()=>{
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      if(window.ethereum){
        const contractTokenS = await ContractConnect(tokenSADR, tokenSABI);
        if(contractTokenS){
          const BalTokenS = await contractTokenS[0].balanceOf(contractTokenS[1]);
          setStakeBalance(BalTokenS);
        }
      }
    }

    const connectCTokenC = async()=>{
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      if(window.ethereum){
        const contractTokenC = await ContractConnect(tokenCADR, tokenRABI);
        if(contractTokenC){
          const BalTokenC = await contractTokenC[0].balanceOf(contractTokenC[1]);
          setRewardBalance(BalTokenC);
        }
      }
    }

    connectCTokenS();
    connectCTokenC();
  });

  const handleStake = async()=>{

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if(window.ethereum){
      const contractTokenS = await ContractConnect(tokenSADR, tokenSABI);
      if(contractTokenS){
        if(refStakeInput.current?.value){
          const Valeth = ethers.parseEther(refStakeInput.current?.value);
          const res = await contractTokenS[0].approve(tokenStakingADR, Valeth);
          if(res){
            const contractStaking = await ContractConnect(tokenStakingADR, tokenStakingABI);
            if(contractStaking){
              const Valeth = ethers.parseEther(refStakeInput.current?.value);
              await contractStaking[0].stakeT(Valeth);
            }
          }
        }else{
          alert("Plese enter valid value...");
        }
      }
    }
  }


  return (
    <>
    <div className="h-dvh overflow-hidden bg-blue-950 relative">
      <div className="flex justify-center items-center text-2xl font-bold mt-7 border-white border-y-1 mx-7 lg:mx-48 py-3">
        <h1 className="text-white ">Staking token</h1>
      </div>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-14 mt-14">
        <div className="flex gap-1 ">
          <Image src={picCoin} alt="picBalance" width={30} height={30}  />
          <h1 className="text-white">{`Token stake balance: ${stakeBalance}`}</h1>
        </div>
        <div className="flex gap-1 ">
          <Image src={picCoin} alt="picBalance" width={30} height={30} />
          <h1 className="text-white">{`Token reward balance: ${rewardBalance}`}</h1>
        </div>
      </div>
      <div className="flex flex-col  justify-center  items-center mt-14 gap-7">
        <div className="flex justify-center items-center gap-3">
          <input ref={refStakeInput} placeholder=" Enter value as a Ether..." className="bg-gray-300 h-8" type="number" name="stakeInput" id="stakeInput" />
          <button onClick={handleStake} className="text-white py-1 px-7 bg-amber-700 hover:bg-amber-800 hover:cursor-pointer">Stake</button>
        </div>
        <div>
          <button className="text-white py-1 px-14 bg-amber-700 hover:bg-amber-800 hover:cursor-pointer">Get Reward</button>
        </div>
      </div>
      <div>
        <Image src={picBack} alt="picBack" className="absolute bottom-[-92]" />
      </div>
    </div>
    </>
  );
}
