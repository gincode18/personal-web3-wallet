'use client'

import { useState, useEffect } from "react"
import { mnemonicToSeed } from "bip39"
import { derivePath } from "ed25519-hd-key"
import { Keypair, PublicKey } from "@solana/web3.js"
import nacl from "tweetnacl"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

interface SolanaWalletData {
  publicKey: string
  secretKey: Uint8Array
}

export function SolanaWallet({ mnemonic }: { mnemonic: string }) {
  const [wallets, setWallets] = useState<SolanaWalletData[]>([])

  useEffect(() => {
    const storedWallets = localStorage.getItem('solanaWallets')
    if (storedWallets) {
      setWallets(JSON.parse(storedWallets))
    }
  }, [])

  const addSolanaWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic)
      const path = `m/44'/501'/${wallets.length}'/0'`
      const derivedSeed = derivePath(path, seed.toString("hex")).key
      const keypair = Keypair.fromSeed(derivedSeed)
      const newWallet: SolanaWalletData = {
        publicKey: keypair.publicKey.toBase58(),
        secretKey: keypair.secretKey
      }
      const updatedWallets = [...wallets, newWallet]
      setWallets(updatedWallets)
      localStorage.setItem('solanaWallets', JSON.stringify(updatedWallets))
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
        <AnimatePresence>
          {wallets.map((wallet, index) => (
            <motion.div
              key={wallet.publicKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-secondary p-2 rounded mb-2"
            >
              <p>Wallet {index + 1}</p>
              <p>Public Key: {wallet.publicKey}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

