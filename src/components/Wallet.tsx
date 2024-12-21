
'use client'

import { useState } from 'react'
import { generateMnemonic } from "bip39"
import { Toaster } from 'sonner'
import { SolanaWallet } from '../components/SolanaWallet'
import { EthWallet } from '../components/EthWallet'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [mnemonic, setMnemonic] = useState("")

  const generateNewMnemonic = () => {
    const newMnemonic = generateMnemonic()
    setMnemonic(newMnemonic)
  }

  const mnemonicWords = mnemonic.split(" ")

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Wallet Creator</CardTitle>
          <CardDescription>Generate a mnemonic and create Solana or Ethereum wallets</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateNewMnemonic} className="mb-4">Generate New Mnemonic</Button>
          {mnemonic && (
            <Table>
              <TableHeader>
                <TableRow>
                  {[...Array(3)].map((_, colIndex) => (
                    <TableHead key={colIndex}>Word {colIndex + 1}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(4)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {[...Array(3)].map((_, colIndex) => {
                      const wordIndex = rowIndex * 3 + colIndex
                      return (
                        <TableCell key={colIndex}>
                          {wordIndex + 1}. {mnemonicWords[wordIndex] || ''}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {mnemonic && (
        <Tabs defaultValue="solana" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="solana">Solana Wallet</TabsTrigger>
            <TabsTrigger value="ethereum">Ethereum Wallet</TabsTrigger>
          </TabsList>
          <TabsContent value="solana">
            <SolanaWallet mnemonic={mnemonic} />
          </TabsContent>
          <TabsContent value="ethereum">
            <EthWallet mnemonic={mnemonic} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

