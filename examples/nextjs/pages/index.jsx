import Head from "next/head";
import { useEffect, useState } from "react";
import { useArjs } from 'arjs-react';
import { readFile } from "../src/readFile";
import { useRef } from "react";

export default function Home() {
  const [key, setKey] = useState(""),
    [cinput, setCinput] = useState(""),
    [swinput, setSWinput] = useState(""),
    [rinput, setRinput] = useState(""),
    [cstate, setCstate] = useState("");

  const wallet = useArjs();
  const activate = (connector, key) => wallet.connect(connector, key)

  const [balance, setBalance] = useState("N/A");
  const [address, setAddress] = useState("N/A");

  wallet.ready(() => {
    if (wallet.status == "connected") (async () => {
      setBalance(wallet.getArweave().ar.winstonToAr(await wallet.getBalance("self")))
      setAddress(await wallet.getAddress())
    })()
  })

  useEffect(() => {
    console.log(cstate)
  },[cstate])

  async function getKey(e) {
    let file = e.target.files[0], res;
    await readFile(file).then(result => res = result)
    setKey(res)
  }

  const finput = useRef();

  const reset = () => {
    finput.current.value = "";
  };

  function getCinput(e) {
    setCinput(e.target.value)
  }
  function getRinput(e) {
    setRinput(e.target.value)
  }
  function getSWinput(e) {
    setSWinput(e.target.value)
  }

  return (
    <div className='container mx-auto'>
      <Head>
        <title>arjs-react + next.js Example</title>
        <meta charSet={"UTF-8"} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </Head>
      <main className='bg-gray-600 rounded-3xl p-8 text-white max-w-xl mx-auto my-4'>
        <div>
          <h1 className='font-extrabold text-2xl mb-2.5'>arjs-react + next.js Example</h1>
          <div>
        <div className='grid grid-cols-3 gap-2 pb-8 h-36'>
            <div className='h-12 col-span-3'>
            <h2 className='h-6 font-bold  bg-gray-600'>Status: {(wallet.isloading > 0)? <span className="text-blue-500 fas fa-sync-alt animate-spin"></span> : (wallet.status == 'connected') ? <span className="text-green-500 fas fa-circle"></span>:<span className="text-red-500 fas fa-times"></span>}</h2>
            <h2 className='h-6 font-bold bg-gray-600'>Connected Wallet: {(wallet.provider != 'disconnected')?wallet.provider: 'none'}</h2>
          </div>
          <div className='h-16 col-span-3'>
            <h2 className='h-8 font-bold bg-gray-700 px-2 pt-0.5 rounded-lg border-2 border-gray-500 mb-1 whitespace-nowrap overflow-scroll md:overflow-auto'>Addy: {(wallet.provider != 'disconnected')?address: 'N/A'}</h2>
            <h2 className='h-8 font-bold bg-gray-700 px-2 pt-0.5 rounded-lg border-2 border-gray-500 overflow-scroll md:overflow-auto'>Balance: {(wallet.provider != 'disconnected')?balance: 'N/A'}</h2>
          </div>
        </div>

            <div className='grid grid-cols-3 gap-x-2 gap-y-0 pb-4'>
              <label className='font-bold col-span-3'>
                Wallet Key:
              </label>
              <input
                className='rounded-lg px-2 border-2 bg-gray-300 border-gray-900 text-black col-span-2'
                type="file"
                onChange={getKey}
                ref={finput}
              />
              <button className={((wallet.status == 'connected')?
                'bg-gray-600 text-gray-500 rounded-lg px-4 border-2 border-gray-500':
                'bg-gray-300 text-black rounded-lg px-4 border-2 border-gray-900')}
                disabled={(wallet.status == 'connected')}
                onClick={async () => activate('arweave', key)}>
                Arweave
              </button>
              <p className='font-bold col-span-3 mx-auto'> or </p>
              <button className={((wallet.status == 'connected')?
                'bg-gray-600 text-gray-500 rounded-lg px-4 border-2 border-gray-500 col-span-3':
                'bg-gray-300 text-black rounded-lg px-4 border-2 border-gray-900 col-span-3')}
                disabled={(wallet.status == 'connected')}
                onClick={() => activate('arconnect', { permissions: ["SIGN_TRANSACTION"] })}>
                ArConnect
              </button>
              <button className='bg-gray-300 text-black rounded-lg px-4 border-2 border-gray-900 mt-1 col-span-3 justify-self-center'
                onClick={() => {wallet.disconnect(); reset();}}>
                Disconnect
              </button>
            </div>
            <div className='grid grid-cols-3  gap-x-2 gap-y-0  pb-2'>
              <label className='font-bold col-span-3'>
                SW Contract ID:
              </label>
              <input
                className='rounded-lg h-8 md:place-self-auto text-black px-2 border-2 border-gray-900 col-span-2 mt-5 md:mt-0'
                type="text"
                onChange={getCinput}
              />
              <button className={((wallet.status != 'connected')?
              'bg-gray-600 text-gray-500 rounded-lg px-4 border-2 border-gray-500 col-span-1':
              'bg-gray-300 text-black rounded-lg px-4 border-2 border-gray-900 col-span-1')}
                onClick={async () => setCstate(await wallet.smartweave.read(cinput))}
                disabled={(wallet.status != 'connected')}>
                Read Contract
              </button>
            </div>
            <div className='grid grid-cols-3 grid-rows-2 gap-x-2 gap-y-0 pb-2'>
              <label className='font-bold col-span-3 '>
                Contract Input:
              </label>
              <input
                className='rounded-lg max-h-8 text-black px-2 border-2 border-gray-900 col-span-2 row-span-2'
                type="text"
                value={rinput}
                placeholder={'Contract Address'}
                onChange={getRinput}
              />
              <button className={((wallet.status != 'connected')?
              'bg-gray-600 text-gray-500 rounded-lg px-4 border-2 border-gray-500 col-span-1 row-span-4':
              'bg-gray-300 text-black rounded-lg px-4 border-2 border-gray-900 col-span-1 row-span-4')}
                onClick={async () => setCstate(await wallet.smartweave.iread(swinput, rinput))}
                disabled={(wallet.status != 'connected')}>
                Submit SW Transaction
              </button>
              <input
                className='rounded-lg max-h-8 text-black px-2 border-2 border-gray-900 col-span-2 row-span-2'
                type="text"
                value={swinput}
                placeholder={'Contract Input JSON'}
                onChange={getSWinput}
              />
            </div>
            <pre className='col-span-3 mx-auto pt-8 rounded lg bg-gray-900 overflow-scroll h-full w-full max-h-48 max-w-2xl'>{JSON.stringify(cstate, null, 2)}</pre>
          </div>
        </div>
      </main>
    </div>
  );
}