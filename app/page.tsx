import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";
import { Novatrix } from "uvcanvas";

import { getBaseUrl } from "@/utils/functions";
import Logo from "@/assets/logo.png";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(`${getBaseUrl()}/api`);

  return {
    other: frameTags,
  };
}

export default function Home() {
  return (
    <main className="bg-gray-950/90 h-screen w-full grid place-items-center text-white relative">
      <div className="flex flex-col items-center gap-4">
        <Image src={Logo} width={128} height={128} alt="Gascaster logo" />
        <a
          href="https://warpcast.com/boi"
          style={{
            boxShadow:
              "inset 0 1.5px 1.5px 0 #ffffff1a,0 50px 100px -20px #32325d40,0 30px 60px -30px #0000004d",
          }}
          className="flex flex-nowrap items-center gap-1 px-2 py-1 bg-[#472A91] rounded-xl font-medium pr-3"
        >
          <svg className="w-8 h-8" viewBox="0 0 1260 1260">
            <title className="hidden">Warpcast</title>
            <path
              d="M826.513 398.633L764.404 631.889L702.093 398.633H558.697L495.789 633.607L433.087 398.633H269.764L421.528 914.36H562.431L629.807 674.876L697.181 914.36H838.388L989.819 398.633H826.513Z"
              fill="white"
            />
          </svg>
          <span>Follow me on Warpcast</span>
        </a>
      </div>
      <div className="absolute top-0 left-0 h-full w-full z-[-1]">
        <Novatrix />
      </div>
    </main>
  );
}
