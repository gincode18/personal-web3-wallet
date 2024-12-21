'use client'

import { useState, useEffect } from "react"
import { mnemonicToSeed } from "bip39"
import { Wallet, HDNodeWallet } from "ethers"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

interface EthWalletData {
  address: string
  privateKey: string
}

export const EthWallet = ({ mnemonic }: { mnemonic: string }) => {
  const [wallets, setWallets] = useState<EthWalletData[]>([])

  useEffect(() => {
    const storedWallets = localStorage.getItem('ethWallets')
    if (storedWallets) {
      setWallets(JSON.parse(storedWallets))
    }
  }, [])

  const addEthereumWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic)
      const derivationPath = `m/44'/60'/${wallets.length}'/0'`
      const hdNode = HDNodeWallet.fromSeed(seed)
      const child = hdNode.derivePath(derivationPath)
      const wallet = new Wallet(child.privateKey)
      const newWallet: EthWalletData = {
        address: wallet.address,
        privateKey: wallet.privateKey
      }
      const updatedWallets = [...wallets, newWallet]
      setWallets(updatedWallets)
      localStorage.setItem('ethWallets', JSON.stringify(updatedWallets))
      toast.success('Ethereum wallet added successfully!')
    } catch (error) {
      toast.error('Failed to add Ethereum wallet')
      console.error(error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ethereum Wallets</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={addEthereumWallet} className="mb-4">Add Ethereum Wallet</Button>
        <AnimatePresence>
          {wallets.map((wallet, index) => (
            <motion.div
              key={wallet.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-secondary p-2 rounded mb-2"
            >
              <p>Wallet {index + 1}</p>
              <p>Address: {wallet.address}</p>
              <p>PrivateKey: {wallet.privateKey}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

