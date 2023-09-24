"use client";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // const getStarted = () => {
  //   if (ready && !authenticated) {
  //     login();
  //   }
  //   if (ready && authenticated) {
  //     router.push("/loans");
  //   }
  // };

  return (
    <main className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center text-white">
      <Logo width={300} height={300} />
      <h1 className="font-bold text-6xl my-3 mt-10">
        Instant loans with no collaterals
      </h1>
      <p className="italic mb-3">Your network is your networth</p>
      <div className="flex gap-3">
        {/* <Button onClick={getStarted} variant={"secondary"} className="mt-5">
          Get Started
        </Button>
        <Button onClick={getStarted} className="mt-5">
          Learn More
        </Button> */}
      </div>
    </main>
  );
}
