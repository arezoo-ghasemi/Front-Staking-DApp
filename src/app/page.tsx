'use client'
import Image from "next/image";
import picBack from "../pic/token-staking.png";
import picCoin from "../pic/Bag.gif";
import  {tokenSADR, tokenCADR, tokenRABI, tokenSABI, tokenStakingADR, tokenStakingABI} from "../DataFile";
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";




export default function Home() {

  const [tokenSBalance, setTokenSBalance] = useState<number>(0);
  const [TokenCBalance, setTokenCBalance] = useState<number>(0);
  const [stakeBalance, setStakeBalance] = useState<number>(0);
  const [rewardBalance, setRewardBalance] = useState<number>(0);
  const refStakeInput = useRef<HTMLInputElement | null>(null);
  const refAmountInput = useRef<HTMLInputElement | null>(null);
  




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

  const connectCTokenS = async()=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if(window.ethereum){
      const contractTokenS = await ContractConnect(tokenSADR, tokenSABI);
      if(contractTokenS){
        const BalTokenS = await contractTokenS[0].balanceOf(contractTokenS[1]);
        setTokenSBalance(Number(ethers.formatEther(await BalTokenS)));
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
        setTokenCBalance(Number(ethers.formatEther(await BalTokenC)));        
        if(ethers.formatEther(await BalTokenC)== "10000.0"){
          const contractT = await ContractConnect(tokenCADR, tokenRABI);
          if(contractT){
             await contractT[0].transfer(tokenStakingADR, ethers.parseEther("3000"));            
          }
        }
      }
    }
  }

  const connectStakingToken = async()=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if(window.ethereum){
      const contractS= await ContractConnect(tokenStakingADR, tokenStakingABI);
      if(contractS){
        const BalTokenC = await contractS[0].getAmountStaking();
        setStakeBalance(Number(ethers.formatEther(await BalTokenC)));
      }
    }
  }

  const connectCRewardToken = async()=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if(window.ethereum){
      const contractC = await ContractConnect(tokenStakingADR, tokenStakingABI);
      if(contractC){
        const BalTokenC = await contractC[0].getRewardRemind();
        setRewardBalance(Number(ethers.formatEther(await BalTokenC)));        
      }
    }
  }

  useEffect(()=>{
    connectCTokenS();
    connectCTokenC();
    connectStakingToken();
    connectCRewardToken();
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
          if(await res){
            const contractStaking = await ContractConnect(tokenStakingADR, tokenStakingABI);
            if(contractStaking){
              const Valeth = ethers.parseEther(refStakeInput.current?.value);              
              const res = await contractStaking[0].stake(Valeth);  
              if(await res){
                if(refStakeInput.current?.value){
                  refStakeInput.current.value = "";
                }
                alert("Staking done sunccessfuly...");
                await connectCTokenS();
                await connectStakingToken();
                await connectCRewardToken();
              }else{
                alert("Transaction faild...");
              }            
            }
          }
        }else{
          alert("Plese enter valid value...");
        }
      }
    }
  }

  const handleGetReward = async()=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if(window.ethereum){
      const contractS = await ContractConnect(tokenStakingADR, tokenStakingABI);
      if(contractS){
        const res = await contractS[0].getReward();
        if(await res){
          alert("Get Reward done successfuly...");
          await connectCTokenC();
          await connectCRewardToken();
        }else{
          alert("Get Reward faild... ");
        }
        
      }
    }
  }

  const handleGetAmount = async()=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if(window.ethereum){
      if(refAmountInput.current?.value){
        const contractS = await ContractConnect(tokenStakingADR, tokenStakingABI);
        if(contractS){
          const Valeth = ethers.parseEther(refAmountInput.current?.value);          
          const res = await contractS[0].withdrow(Valeth);
          if(await res){
            alert("Get Stakint token done successfuly...");
            refAmountInput.current.value = "";
            await connectCTokenS();
            await connectStakingToken();
          }else{
            alert("Get Staking token faild... ");
          }
          
        }
      }else{
        alert("Please fill InputBox... ");
      }
    }

  }


  return (
    <>
    <div className="h-dvh overflow-hidden bg-blue-950 relative">
      <div className="flex justify-center items-center text-2xl font-bold mt-7 border-white border-y-1 mx-7 lg:mx-48 py-3">
        <h1 className="text-white ">Staking token</h1>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:w-1/2  gap-3 lg:gap-14 mt-14">
          <div className="flex gap-1 ">
            <Image src={picCoin} alt="picBalance" width={30} height={30}  />
            <h1 className="text-white">{`Token stake balance: ${tokenSBalance}`}</h1>
          </div>
          <div className="flex gap-1 ">
            <Image src={picCoin} alt="picBalance" width={30} height={30} />
            <h1 className="text-white">{`Token reward balance: ${TokenCBalance}`}</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:w-1/2 gap-3 lg:gap-14 mt-3 lg:mt-7">
          <div className="flex gap-1 ">
            <Image src={picCoin} alt="picBalance" width={30} height={30}  />
            <h1 className="text-white">{`Stake balance: ${stakeBalance}`}</h1>
          </div>
          <div className="flex gap-1 ">
            <Image src={picCoin} alt="picBalance" width={30} height={30} />
            <h1 className="text-white">{`Reward balance: ${rewardBalance}`}</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full  justify-center  items-center mt-3 lg:mt-14 gap-3">
        <div className="lg:w-full flex justify-center items-center gap-3">
          <input ref={refStakeInput} placeholder=" Enter value as a Ether..." className="bg-gray-300 lg:w-1/2 h-8" type="text" name="stakeInput" id="stakeInput" />
          <button onClick={handleStake} className="text-white py-1 px-12 bg-amber-700 hover:bg-amber-800 hover:cursor-pointer">Stake</button>
        </div>
        <div className="lg:w-full flex justify-center items-center gap-3">
          <input ref={refAmountInput} placeholder=" Enter value as a Ether..." className="bg-gray-300 lg:w-1/2 h-8" type="text" name="stakeInput" id="stakeInput" />
          <button onClick={handleGetAmount} className="text-white py-1 px-7 bg-amber-700 hover:bg-amber-800 hover:cursor-pointer">Get amount</button>
        </div>
        <div className="lg:w-full flex justify-center items-center gap-3">
          <button onClick={handleGetReward} className="text-white py-1 px-7 bg-amber-700 hover:bg-amber-800 hover:cursor-pointer">Get Reward</button>
        </div>
      </div>
      <div>
        <Image src={picBack} alt="picBack" className="absolute bottom-[-62]" width={300} height={300}/>
      </div>
    </div>
    </>
  );
}
