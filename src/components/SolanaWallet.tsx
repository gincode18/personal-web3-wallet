
'use client'

import { useState } from "react"
import { mnemonicToSeed } from "bip39"
import { derivePath } from "ed25519-hd-key"
import { Keypair } from "@solana/web3.js"
import nacl from "tweetnacl"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SolanaWallet({ mnemonic }: { mnemonic: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [publicKeys, setPublicKeys] = useState<string[]>([])

  const addSolanaWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic)
      const path = `m/44'/501'/${currentIndex}'/0'`
      const derivedSeed = derivePath(path, seed.toString("hex")).key
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
      const keypair = Keypair.fromSecretKey(secret)
      setCurrentIndex(currentIndex + 1)
      setPublicKeys([...publicKeys, keypair.publicKey.toBase58()])
      toast.success('Solana wallet added successfully!')
    } catch (error) {
      toast.error('Failed to add Solana wallet')
      console.error(error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solana Wallets</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={addSolanaWallet} className="mb-4">Add Solana Wallet</Button>
        {publicKeys.map((publicKey, index) => (
          <div key={index} className="bg-secondary p-2 rounded mb-2">
            Wallet {index + 1}: {publicKey}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

