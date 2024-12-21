
'use client'

import { useState } from "react"
import { mnemonicToSeed } from "bip39"
import { Wallet, HDNodeWallet } from "ethers"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const EthWallet = ({ mnemonic }: { mnemonic: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [addresses, setAddresses] = useState<string[]>([])

  const addEthereumWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic)
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`
      const hdNode = HDNodeWallet.fromSeed(seed)
      const child = hdNode.derivePath(derivationPath)
      const privateKey = child.privateKey
      const wallet = new Wallet(privateKey)
      setCurrentIndex(currentIndex + 1)
      setAddresses([...addresses, wallet.address])
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
        {addresses.map((address, index) => (
          <div key={index} className="bg-secondary p-2 rounded mb-2">
            Wallet {index + 1}: {address}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

