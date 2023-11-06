import { EventLog } from "ethers"
import { Inter } from 'next/font/google'
import { getEventsOn, getEventsOff, getHistoryEvent, getNativeTransaction, startMoralis } from '../../hooks/event'
import { useState } from 'react'
import QRCode from "react-qr-code";
import { Toaster, toast } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [address, setAddress] = useState("0x5f278CcD052b2118cE65589820D715a6717d31a4")
  const [amount, setAmount] = useState(0)
  const [startBlock, setStartBlock] = useState(0)
  const [endBlock, setEndBlock] = useState(0)
  const [qrValue, setQrValue] = useState("")
  const [isGenerated, setIsGenerated] = useState(false)
  const [isStartMoralis, setIsStartMoralis] = useState(false)

  const handleOn = () => {
    // getEventsOn(address ? address : "")
  }

  const handleOff = () => {
    // getEventsOff()
    return toast.success('This is a sonner toast')
  }

  const handleCreateQr = async () => {
    // toast.success('Success payment !')
    const baseQr = "ethereum:0xcDeD27552d2Afec1d2B94eF6103822497F710226@5/transfer?address=";
    const qrVal = baseQr + address + `&uint256=${amount}e18`
    setQrValue(qrVal);
    setIsGenerated(true);
    await getEventsOn(address, amount).then((res: EventLog) => {
      // console.log("res :: ", res);
      getEventsOff()
      setIsGenerated(false)
    })
  }

  const handleGetNativeTx = async () => {
    if (!isStartMoralis) {
      await startMoralis()
      setIsStartMoralis(true)
    }
    getNativeTransaction(startBlock, endBlock)
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <Toaster richColors position="top-center" />
      <p className='text-xl mb-8'>PoC : Payment</p>

      <div className='flex flex-col items-center mb-8'>
        <p>Generate QR Code</p>
        <div className='flex flex-col my-6 justify-center gap-4 text-black'>
          <input
            value={address}
            onChange={(e) => { setAddress(e.target.value) }}
            className='w-[300px] h-[40px] rounded-md pl-4'
            placeholder='Receieve Address :' />
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(Number(e.target.value)) }}
            className='w-[300px] h-[40px] rounded-md pl-4'
            placeholder='Amount :' />
        </div>
        <button className='px-4 py-2 bg-purple-400 rounded-md' onClick={() => {
          handleCreateQr()
        }}>Generate QR</button>

        <div className='flex flex-col my-6 justify-center gap-4 text-black'>
          <input
            type="number"
            value={startBlock}
            onChange={(e) => { setStartBlock(Number(e.target.value)) }}
            className='w-[300px] h-[40px] rounded-md pl-4'
            placeholder='Start Block :' />
          <input
            type="number"
            value={endBlock}
            onChange={(e) => { setEndBlock(Number(e.target.value)) }}
            className='w-[300px] h-[40px] rounded-md pl-4'
            placeholder='End Block :' />
        </div>
        <button className='mt-4 px-4 py-2 bg-pink-400 rounded-md' onClick={() => {
          getHistoryEvent(address, startBlock ? startBlock : 9967510, endBlock ? endBlock : 9967583)
        }}>History Events</button>
      </div>

      <button className='px-4 py-2 bg-orange-400 rounded-md' onClick={() => {
        handleGetNativeTx()
      }}>Native Transaction</button>

      <div>
        {isGenerated ? <QRCode value={qrValue}></QRCode> : <></>}
      </div>

      {/* <div className='w-[80vw] flex flex-row justify-center gap-4 mt-8'>
        <button className='px-4 py-2 bg-green-300 rounded-md' onClick={() => {
          handleOn()
        }}>Fetch Event On</button>
        <button className='px-4 py-2 bg-red-300 rounded-md' onClick={() => {
          handleOff()
        }}>Fetch Event Off</button>
      </div> */}
    </main>
  )
}