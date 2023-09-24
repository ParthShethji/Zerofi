"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAccount } from "wagmi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { socialABI, socialPool } from "@/lib/utils";
import { getEthersSigner } from "@/lib/signer";
import { Contract } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { RocketIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useToast } from "../ui/use-toast";
import axios from "axios";
export default function BorrowWidget({ score }: { score: string }) {
  const INTEREST_RATE = {
    percentage: 20,
    scNumber: BigInt(6341958396752918000),
  };
  const { address } = useAccount();
  const [duration, setDuration] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>("0");
  // const { config, error } = usePrepareContractWrite({
  //   address: socialPool,
  //   abi: socialABI,
  //   functionName: "borrow",
  //   args: [
  //     {
  //       amount: BigInt(1),
  //       limitRepayDate: BigInt(1),
  //       borrower: "0x674dc72D0738D2f905aE9F3ef17C0384c8bd28d2",
  //       interestRate: BigInt(1),
  //     },
  //     "0x",
  //     BigInt(123),
  //   ],
  // });
  // const { write } = useContractWrite(config);

  async function borrow() {
    const signer = await getEthersSigner();
    if (!signer || !address) return;
    const contract = new Contract(socialPool, socialABI, signer);
    const authorizedAmount = Math.min(parseFloat(score), Number(amount));
    const amountInWei = BigInt(Number(authorizedAmount) * 10 ** 18);
    const nowInSec = Math.floor(Date.now() / 1000);
    const durationInSec = Number(duration) * 24 * 60 * 60;
    const limitRepayDate = nowInSec + durationInSec;
    const loanTerms = [
      address,
      amountInWei,
      INTEREST_RATE.scNumber,
      limitRepayDate,
    ];
    const apiSignature = "0x";
    const apiNonce = 123;
    const tx = await contract.borrow(loanTerms, apiSignature, apiNonce);
    console.log({ tx });
    const txResponse = await signer.sendTransaction(tx);
    console.log({ txResponse });
    //TODO: post on lens
  }

  async function requestLoan() {
    console.log("requestLoan");
    // const signer = await getEthersSigner();
    // if (!signer || !address) return;
    // const contract = new Contract(p2pLending, p2pABI, signer);
    // const amountInWei = Number(amount) * 10 ** 18;
    // const nowInSec = Math.floor(Date.now() / 1000);
    // const durationInSec = Number(duration) * 24 * 60 * 60;
    // const limitRepayDate = nowInSec + durationInSec;
    // const interestRate = INTEREST_RATE.scNumber;
    // const tx = await contract.requestLoan(amountInWei, interestRate, limitRepayDate);
    // console.log({ tx });
    // const txResponse = await signer.sendTransaction(tx);
    // console.log({ txResponse });
    // //TODO: post on lens
  }

  return (
    <div className="w-[50%] rounded-3xl z-20 h-[105%] gap-3 bg-[#100c17] flex flex-col py-8 px-16 drop-shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-5">Borrow USDC</h1>
      <div className="bg-white/5 rounded-xl px-3 py-5">
        <h1 className="text-sm text-gray-300 pl-3">Borrow Amount</h1>
        <Input
          placeholder={`0`}
          className="border-none text-3xl"
          onChange={(e) => setAmount(e.target.value)}
        />
        <p className="text-xs text-right text-gray-600 pr-3">
          Max {score} instant USDC
        </p>
      </div>
      <Select value={duration} onValueChange={(value) => setDuration(value)}>
        <SelectTrigger className="w-full mt-3">
          <SelectValue placeholder="Duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 Day</SelectItem>
          <SelectItem value="7">7 Days</SelectItem>
          <SelectItem value="30">30 Days</SelectItem>
        </SelectContent>
      </Select>

      {/* <Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog> */}

      {/* <Button
        className="mt-3 cursor-pointer bg-white text-black disabled:opacity-50"
        disabled={amount == "0" || duration == "0" || !duration || !amount}
        onClick={() => borrow()}
      >
        Borrow
      </Button> */}

      <Dialog>
        <DialogTrigger className="w-full mb-3">
          <Button
            disabled={amount == "0" || duration == "0" || !duration || !amount}
            className="mt-3 cursor-pointer bg-white text-black disabled:opacity-50"
          >
            Borrow
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Borrow {amount} USDC :
            </DialogTitle>
            <DialogDescription className="flex justify-center flex-col">
              <Alert className="border-none flex flex-col items-center justify-center">
                <AlertTitle>Conditions of loan:</AlertTitle>
                <div className="flex w-full justify-evenly mt-4">
                  <p>{INTEREST_RATE.percentage} % APR</p>
                  <p>{duration} days to repay</p>
                </div>
              </Alert>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="mx-auto w-5/12 text-black p-8"
                  onClick={() => borrow()}
                >
                  <p>
                    Borrow{" "}
                    <span className="font-bold">
                      {Math.min(parseFloat(score), Number(amount))} USDC
                    </span>{" "}
                    from social pool
                  </p>
                </Button>
                {parseFloat(amount) - parseFloat(score) > 0 && (
                  <Button
                    variant="outline"
                    className="mx-auto w-5/12 text-black p-8"
                    onClick={() => requestLoan()}
                  >
                    <p>
                      Ask{" "}
                      <span className="font-bold">
                        {parseFloat(amount || "0") - parseFloat(score)} USDC
                      </span>{" "}
                      to your network
                    </p>
                  </Button>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
