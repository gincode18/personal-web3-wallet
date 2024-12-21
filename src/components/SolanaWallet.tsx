
'use client'

import { useState, useEffect } from "react"
import { mnemonicToSeed } from "bip39"
import { derivePath } from "ed25519-hd-key"
import { Keypair } from "@solana/web3.js"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import bs58 from 'bs58'

interface SolanaWalletData {
  publicKey: string
  secretKey: string // Store as base58 encoded string
}

export function SolanaWallet({ mnemonic }: { mnemonic: string }) {
  const [wallets, setWallets] = useState<SolanaWalletData[]>([])
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({})

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
        secretKey: bs58.encode(keypair.secretKey) // Encode secret key as base58
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

  const togglePrivateKey = (publicKey: string) => {
    setVisibleKeys(prev => ({ ...prev, [publicKey]: !prev[publicKey] }))
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
              className="bg-secondary p-4 rounded-lg mb-4"
            >
              <p className="font-semibold mb-2">Wallet {index + 1}</p>
              <p className="mb-2"><span className="font-medium">Public Key:</span> {wallet.publicKey}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Private Key:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePrivateKey(wallet.publicKey)}
                >
                  {visibleKeys[wallet.publicKey] ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
              {visibleKeys[wallet.publicKey] && (
                <p className="text-sm break-all bg-muted p-2 rounded">
                  {wallet.secretKey}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

