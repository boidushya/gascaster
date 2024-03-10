/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import {
  type NeynarVariables,
  neynar as neynarMiddleWare,
} from "frog/middlewares";
import {
  getAddressFromEns,
  getAddressFromUser,
  getBaseUrl,
  getGasTextContent,
  getL2GasData,
} from "@/utils/functions";

const app = new Frog<{ Variables: NeynarVariables }>({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
  verify: false,
});

app.use(
  neynarMiddleWare({
    apiKey: "NEYNAR_FROG_FM",
    features: ["interactor"],
  })
);

app.frame("/", async (c) => {
  const { inputText } = c;

  let resolvedAddress = "";

  const fontData = await fetch(`${getBaseUrl()}/assets/satoshi.ttf`).then(
    (res) => res.arrayBuffer()
  );

  const imageOptions = {
    fonts: [
      {
        name: "Satoshi",
        data: fontData,
      },
    ],
  };

  if (inputText) {
    if (/0x[a-zA-Z0-9]{40}/g.test(inputText.trim())) {
      resolvedAddress = inputText.trim();
    } else {
      try {
        resolvedAddress = await getAddressFromEns(inputText.trim());
      } catch (e) {
        return c.res({
          image: `${getBaseUrl()}/assets/home.png`,
          intents: [
            <TextInput placeholder="Enter address or leave empty to check own (ENS Supported)..." />,
            <Button value="address">Check</Button>,
          ],
          imageOptions,
        });
      }
    }
  }

  const address = getAddressFromUser(c.var.interactor);
  const hasAddress = address !== null;

  if (!hasAddress && !resolvedAddress) {
    return c.res({
      image: `${getBaseUrl()}/assets/home.png`,
      intents: [
        <TextInput placeholder="Enter address (ENS Supported)..." />,
        <Button value="address">Check Mine!</Button>,
      ],
      imageOptions,
    });
  }

  if (hasAddress && !resolvedAddress) {
    resolvedAddress = address as `0x${string}`;
  }

  const content = await getGasTextContent(
    resolvedAddress as `0x${string}`,
    !inputText
  );

  return c.res({
    image: (
      <div
        style={{
          background:
            "linear-gradient(to right, rgb(0,0,0,0.4) ,rgb(0,0,0,0.4) ),linear-gradient(45deg, #4E3992, #4A6AC7, #7C44A4)",
        }}
        tw="relative w-full h-full flex flex-col items-center justify-center text-white/60"
      >
        <div tw="absolute bottom-0 w-full flex items-center justify-between px-8 pb-4">
          <svg
            height="65"
            width="117"
            viewBox="0 0 117 65"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title tw="hidden">Gascaster</title>

            <path d="M12 34.4951V8H14.7079V34.4951H12ZM16.0619 34.4951V8H17.4158V34.4951H16.0619ZM21.4777 34.4951V8H22.8317V34.4951H21.4777ZM19.8981 49C19.0556 49 18.3335 48.7755 17.7318 48.3264C17.13 47.9073 16.6636 47.2935 16.3327 46.4852C16.0017 45.7068 15.8362 44.7937 15.8362 43.7459C15.8362 42.3688 16.0468 41.276 16.4681 40.4677C16.8893 39.6594 17.4008 39.0905 18.0025 38.7612C18.6043 38.4618 19.2061 38.3122 19.8078 38.3122C20.4397 38.3122 21.0414 38.4768 21.6131 38.8061C22.2149 39.1055 22.6511 39.5246 22.9219 40.0635L22.1096 40.6922L21.9742 40.8269L21.929 40.7371C21.929 40.6473 21.914 40.5575 21.8839 40.4677C21.8237 40.4078 21.7335 40.303 21.6131 40.1533C21.3423 39.854 21.0715 39.6444 20.8007 39.5246C20.5299 39.4049 20.199 39.345 19.8078 39.345C18.9955 39.345 18.3185 39.6594 17.7769 40.2881C17.2654 40.9467 17.0096 42.0095 17.0096 43.4765C17.0096 44.9135 17.2654 46.0212 17.7769 46.7996C18.2884 47.578 18.9955 47.9671 19.8981 47.9671C20.2291 47.9671 20.5751 47.9073 20.9361 47.7875C21.3273 47.6977 21.6432 47.548 21.8839 47.3384V44.8686H19.9884V43.8357H22.9671V47.9222C21.9742 48.6407 20.9512 49 19.8981 49Z" />
            <path d="M21.9326 34.4951V8H23.2865V34.4951H21.9326ZM24.6405 34.4951V8H25.9944V34.4951H24.6405ZM30.0563 34.4951V8H32.7642V34.4951H30.0563ZM31.0492 45.7667H27.6643L26.6263 48.8204H25.4528L29.2891 38.2223H29.4245L33.3058 48.8204H32.0872L31.0492 45.7667ZM30.7333 44.8686L29.3793 40.9168L27.9802 44.8686H30.7333Z" />
            <path d="M31.8651 34.4951V8H34.573V34.4951H31.8651ZM35.927 34.4951V8H39.9889V34.4951H35.927ZM41.3428 34.4951V8H42.6968V34.4951H41.3428ZM39.2667 49C37.9128 49 36.8146 48.5509 35.9721 47.6528L36.604 46.6199L36.6491 46.4852L36.7845 46.5301C36.7845 46.5601 36.7995 46.6199 36.8296 46.7097C36.8296 46.7696 36.8597 46.8445 36.9199 46.9343C36.95 46.9942 37.0101 47.054 37.1004 47.1139C37.7323 47.6528 38.5145 47.9222 39.4473 47.9222C40.049 47.9222 40.5605 47.7576 40.9818 47.4283C41.403 47.069 41.6136 46.6499 41.6136 46.1709C41.6136 45.8416 41.5384 45.5571 41.3879 45.3176C41.2676 45.1081 41.0419 44.8985 40.711 44.6889C40.38 44.4794 39.8685 44.2249 39.1765 43.9255C38.1535 43.5363 37.4163 43.0873 36.965 42.5783C36.5438 42.0694 36.3332 41.5005 36.3332 40.8719C36.3332 40.0935 36.619 39.4648 37.1907 38.9858C37.7623 38.5068 38.5296 38.2673 39.4924 38.2673C40.0641 38.2673 40.6057 38.387 41.1172 38.6265C41.5986 38.866 42.0348 39.1804 42.426 39.5696L41.6587 40.6024L41.5685 40.5126C41.5685 40.4827 41.5534 40.4378 41.5233 40.3779C41.5233 40.2881 41.4933 40.2132 41.4331 40.1533C41.403 40.0635 41.3428 39.9887 41.2525 39.9288C41.0118 39.6893 40.726 39.5097 40.395 39.3899C40.0942 39.3001 39.7331 39.2552 39.3119 39.2552C38.7703 39.2552 38.3491 39.4049 38.0482 39.7043C37.7172 40.0037 37.5517 40.3629 37.5517 40.782C37.5517 41.1114 37.6119 41.3958 37.7323 41.6353C37.8827 41.8748 38.1384 42.0993 38.4995 42.3089C38.8606 42.5484 39.4021 42.8029 40.1242 43.0723C41.1172 43.4914 41.8092 43.9106 42.2003 44.3297C42.5614 44.7788 42.7419 45.3326 42.7419 45.9912C42.7419 46.5002 42.6215 46.9792 42.3808 47.4283C42.1101 47.8773 41.7189 48.2516 41.2074 48.5509C40.6658 48.8503 40.0189 49 39.2667 49Z" />
            <path d="M41.7977 34.4951V8H43.1516V34.4951H41.7977ZM47.2135 34.4951V8H48.5674V34.4951H47.2135ZM52.6293 34.4951V8H55.3372V34.4951H52.6293ZM49.8311 49C49.0489 49 48.3568 48.8054 47.7551 48.4162C47.1232 48.027 46.6268 47.4432 46.2657 46.6648C45.9047 45.8565 45.7241 44.8536 45.7241 43.6561C45.7241 42.3987 45.9197 41.3658 46.3108 40.5575C46.702 39.7791 47.1984 39.2103 47.8002 38.851C48.402 38.5217 49.0489 38.3571 49.7409 38.3571C50.4931 38.3571 51.14 38.5367 51.6815 38.8959C52.2231 39.2552 52.6293 39.7492 52.9001 40.3779L51.9072 40.8719L51.7718 40.9168L51.7267 40.8269V40.6922C51.7267 40.5725 51.6515 40.4078 51.501 40.1982C51.2603 39.8689 50.9895 39.6294 50.6886 39.4797C50.3878 39.3301 50.0718 39.2552 49.7409 39.2552C48.8382 39.2552 48.1312 39.6444 47.6197 40.4228C47.1383 41.1712 46.8976 42.234 46.8976 43.6112C46.8976 44.4494 47.0179 45.2129 47.2586 45.9014C47.5294 46.5601 47.8754 47.069 48.2967 47.4283C48.748 47.7875 49.2444 47.9671 49.786 47.9671C50.2072 47.9671 50.5984 47.8624 50.9594 47.6528C51.3506 47.4133 51.6665 47.0989 51.9072 46.7097L52.7647 47.2935C52.4037 47.8624 51.9975 48.2815 51.5462 48.5509C51.0647 48.8503 50.4931 49 49.8311 49Z" />
            <path d="M51.7302 34.4951V8H53.0842V34.4951H51.7302ZM54.4381 34.4951V8H55.7921V34.4951H54.4381ZM59.854 34.4951V8H62.5619V34.4951H59.854ZM60.8469 45.7667H57.462L56.4239 48.8204H55.2505L59.0867 38.2223H59.2221L63.1035 48.8204H61.8849L60.8469 45.7667ZM60.5309 44.8686L59.177 40.9168L57.7779 44.8686H60.5309Z" />
            <path d="M61.6628 34.4951V8H64.3707V34.4951H61.6628ZM65.7246 34.4951V8H69.7865V34.4951H65.7246ZM71.1405 34.4951V8H72.4944V34.4951H71.1405ZM69.0644 49C67.7104 49 66.6122 48.5509 65.7698 47.6528L66.4016 46.6199L66.4467 46.4852L66.5821 46.5301C66.5821 46.5601 66.5972 46.6199 66.6273 46.7097C66.6273 46.7696 66.6574 46.8445 66.7175 46.9343C66.7476 46.9942 66.8078 47.054 66.8981 47.1139C67.5299 47.6528 68.3122 47.9222 69.2449 47.9222C69.8467 47.9222 70.3582 47.7576 70.7794 47.4283C71.2006 47.069 71.4113 46.6499 71.4113 46.1709C71.4113 45.8416 71.336 45.5571 71.1856 45.3176C71.0652 45.1081 70.8396 44.8985 70.5086 44.6889C70.1777 44.4794 69.6662 44.2249 68.9741 43.9255C67.9511 43.5363 67.214 43.0873 66.7627 42.5783C66.3414 42.0694 66.1308 41.5005 66.1308 40.8719C66.1308 40.0935 66.4167 39.4648 66.9883 38.9858C67.56 38.5068 68.3272 38.2673 69.2901 38.2673C69.8617 38.2673 70.4033 38.387 70.9148 38.6265C71.3962 38.866 71.8325 39.1804 72.2236 39.5696L71.4564 40.6024L71.3661 40.5126C71.3661 40.4827 71.3511 40.4378 71.321 40.3779C71.321 40.2881 71.2909 40.2132 71.2307 40.1533C71.2006 40.0635 71.1405 39.9887 71.0502 39.9288C70.8095 39.6893 70.5237 39.5097 70.1927 39.3899C69.8918 39.3001 69.5308 39.2552 69.1095 39.2552C68.5679 39.2552 68.1467 39.4049 67.8458 39.7043C67.5149 40.0037 67.3494 40.3629 67.3494 40.782C67.3494 41.1114 67.4096 41.3958 67.5299 41.6353C67.6804 41.8748 67.9361 42.0993 68.2972 42.3089C68.6582 42.5484 69.1998 42.8029 69.9219 43.0723C70.9148 43.4914 71.6068 43.9106 71.998 44.3297C72.359 44.7788 72.5396 45.3326 72.5396 45.9912C72.5396 46.5002 72.4192 46.9792 72.1785 47.4283C71.9077 47.8773 71.5166 48.2516 71.0051 48.5509C70.4635 48.8503 69.8166 49 69.0644 49Z" />
            <path d="M71.5953 34.4951V8H74.3032V34.4951H71.5953ZM75.6572 34.4951V8H79.7191V34.4951H75.6572ZM83.7809 34.4951V8H85.1349V34.4951H83.7809ZM78.32 39.4348H75.3864V38.402H82.6075V39.4348H79.5385V48.8204H78.32V39.4348Z" />
            <path d="M81.5279 34.4951V8H82.8818V34.4951H81.5279ZM86.9437 34.4951V8H89.6516V34.4951H86.9437ZM91.0056 34.4951V8H92.3595V34.4951H91.0056ZM85.7703 38.402H92.179V39.4348H86.8534V42.8478H91.2764V43.9255H86.8534V47.7875H92.1339V48.8204H85.7703V38.402Z" />
            <path d="M91.4604 34.4951V8H94.1683V34.4951H91.4604ZM98.2302 34.4951V8H99.5842V34.4951H98.2302ZM100.938 34.4951V8H105V34.4951H100.938ZM95.6577 38.402H98.7267C99.9302 38.402 100.803 38.6714 101.344 39.2103C101.916 39.7192 102.202 40.4527 102.202 41.4107C102.202 42.0095 102.006 42.5783 101.615 43.1172C101.224 43.6561 100.712 44.0153 100.081 44.195L102.518 48.8204H101.209L98.8621 44.2399H96.8311V48.8204H95.6577V38.402ZM98.8621 43.207C99.5842 43.207 100.126 43.0424 100.487 42.713C100.818 42.4137 100.983 41.9796 100.983 41.4107C100.983 40.8419 100.818 40.3779 100.487 40.0186C100.126 39.6893 99.5842 39.5246 98.8621 39.5246H96.8311V43.207H98.8621Z" />
            <path d="M12 34.4951V8H14.7079V34.4951H12ZM16.0619 34.4951V8H17.4158V34.4951H16.0619ZM21.4777 34.4951V8H22.8317V34.4951H21.4777ZM19.8981 49C19.0556 49 18.3335 48.7755 17.7318 48.3264C17.13 47.9073 16.6636 47.2935 16.3327 46.4852C16.0017 45.7068 15.8362 44.7937 15.8362 43.7459C15.8362 42.3688 16.0468 41.276 16.4681 40.4677C16.8893 39.6594 17.4008 39.0905 18.0025 38.7612C18.6043 38.4618 19.2061 38.3122 19.8078 38.3122C20.4397 38.3122 21.0414 38.4768 21.6131 38.8061C22.2149 39.1055 22.6511 39.5246 22.9219 40.0635L22.1096 40.6922L21.9742 40.8269L21.929 40.7371C21.929 40.6473 21.914 40.5575 21.8839 40.4677C21.8237 40.4078 21.7335 40.303 21.6131 40.1533C21.3423 39.854 21.0715 39.6444 20.8007 39.5246C20.5299 39.4049 20.199 39.345 19.8078 39.345C18.9955 39.345 18.3185 39.6594 17.7769 40.2881C17.2654 40.9467 17.0096 42.0095 17.0096 43.4765C17.0096 44.9135 17.2654 46.0212 17.7769 46.7996C18.2884 47.578 18.9955 47.9671 19.8981 47.9671C20.2291 47.9671 20.5751 47.9073 20.9361 47.7875C21.3273 47.6977 21.6432 47.548 21.8839 47.3384V44.8686H19.9884V43.8357H22.9671V47.9222C21.9742 48.6407 20.9512 49 19.8981 49Z" />
            <path d="M21.9326 34.4951V8H23.2865V34.4951H21.9326ZM24.6405 34.4951V8H25.9944V34.4951H24.6405ZM30.0563 34.4951V8H32.7642V34.4951H30.0563ZM31.0492 45.7667H27.6643L26.6263 48.8204H25.4528L29.2891 38.2223H29.4245L33.3058 48.8204H32.0872L31.0492 45.7667ZM30.7333 44.8686L29.3793 40.9168L27.9802 44.8686H30.7333Z" />
            <path d="M31.8651 34.4951V8H34.573V34.4951H31.8651ZM35.927 34.4951V8H39.9889V34.4951H35.927ZM41.3428 34.4951V8H42.6968V34.4951H41.3428ZM39.2667 49C37.9128 49 36.8146 48.5509 35.9721 47.6528L36.604 46.6199L36.6491 46.4852L36.7845 46.5301C36.7845 46.5601 36.7995 46.6199 36.8296 46.7097C36.8296 46.7696 36.8597 46.8445 36.9199 46.9343C36.95 46.9942 37.0101 47.054 37.1004 47.1139C37.7323 47.6528 38.5145 47.9222 39.4473 47.9222C40.049 47.9222 40.5605 47.7576 40.9818 47.4283C41.403 47.069 41.6136 46.6499 41.6136 46.1709C41.6136 45.8416 41.5384 45.5571 41.3879 45.3176C41.2676 45.1081 41.0419 44.8985 40.711 44.6889C40.38 44.4794 39.8685 44.2249 39.1765 43.9255C38.1535 43.5363 37.4163 43.0873 36.965 42.5783C36.5438 42.0694 36.3332 41.5005 36.3332 40.8719C36.3332 40.0935 36.619 39.4648 37.1907 38.9858C37.7623 38.5068 38.5296 38.2673 39.4924 38.2673C40.0641 38.2673 40.6057 38.387 41.1172 38.6265C41.5986 38.866 42.0348 39.1804 42.426 39.5696L41.6587 40.6024L41.5685 40.5126C41.5685 40.4827 41.5534 40.4378 41.5233 40.3779C41.5233 40.2881 41.4933 40.2132 41.4331 40.1533C41.403 40.0635 41.3428 39.9887 41.2525 39.9288C41.0118 39.6893 40.726 39.5097 40.395 39.3899C40.0942 39.3001 39.7331 39.2552 39.3119 39.2552C38.7703 39.2552 38.3491 39.4049 38.0482 39.7043C37.7172 40.0037 37.5517 40.3629 37.5517 40.782C37.5517 41.1114 37.6119 41.3958 37.7323 41.6353C37.8827 41.8748 38.1384 42.0993 38.4995 42.3089C38.8606 42.5484 39.4021 42.8029 40.1242 43.0723C41.1172 43.4914 41.8092 43.9106 42.2003 44.3297C42.5614 44.7788 42.7419 45.3326 42.7419 45.9912C42.7419 46.5002 42.6215 46.9792 42.3808 47.4283C42.1101 47.8773 41.7189 48.2516 41.2074 48.5509C40.6658 48.8503 40.0189 49 39.2667 49Z" />
            <path d="M41.7977 34.4951V8H43.1516V34.4951H41.7977ZM47.2135 34.4951V8H48.5674V34.4951H47.2135ZM52.6293 34.4951V8H55.3372V34.4951H52.6293ZM49.8311 49C49.0489 49 48.3568 48.8054 47.7551 48.4162C47.1232 48.027 46.6268 47.4432 46.2657 46.6648C45.9047 45.8565 45.7241 44.8536 45.7241 43.6561C45.7241 42.3987 45.9197 41.3658 46.3108 40.5575C46.702 39.7791 47.1984 39.2103 47.8002 38.851C48.402 38.5217 49.0489 38.3571 49.7409 38.3571C50.4931 38.3571 51.14 38.5367 51.6815 38.8959C52.2231 39.2552 52.6293 39.7492 52.9001 40.3779L51.9072 40.8719L51.7718 40.9168L51.7267 40.8269V40.6922C51.7267 40.5725 51.6515 40.4078 51.501 40.1982C51.2603 39.8689 50.9895 39.6294 50.6886 39.4797C50.3878 39.3301 50.0718 39.2552 49.7409 39.2552C48.8382 39.2552 48.1312 39.6444 47.6197 40.4228C47.1383 41.1712 46.8976 42.234 46.8976 43.6112C46.8976 44.4494 47.0179 45.2129 47.2586 45.9014C47.5294 46.5601 47.8754 47.069 48.2967 47.4283C48.748 47.7875 49.2444 47.9671 49.786 47.9671C50.2072 47.9671 50.5984 47.8624 50.9594 47.6528C51.3506 47.4133 51.6665 47.0989 51.9072 46.7097L52.7647 47.2935C52.4037 47.8624 51.9975 48.2815 51.5462 48.5509C51.0647 48.8503 50.4931 49 49.8311 49Z" />
            <path d="M51.7302 34.4951V8H53.0842V34.4951H51.7302ZM54.4381 34.4951V8H55.7921V34.4951H54.4381ZM59.854 34.4951V8H62.5619V34.4951H59.854ZM60.8469 45.7667H57.462L56.4239 48.8204H55.2505L59.0867 38.2223H59.2221L63.1035 48.8204H61.8849L60.8469 45.7667ZM60.5309 44.8686L59.177 40.9168L57.7779 44.8686H60.5309Z" />
            <path d="M61.6628 34.4951V8H64.3707V34.4951H61.6628ZM65.7246 34.4951V8H69.7865V34.4951H65.7246ZM71.1405 34.4951V8H72.4944V34.4951H71.1405ZM69.0644 49C67.7104 49 66.6122 48.5509 65.7698 47.6528L66.4016 46.6199L66.4467 46.4852L66.5821 46.5301C66.5821 46.5601 66.5972 46.6199 66.6273 46.7097C66.6273 46.7696 66.6574 46.8445 66.7175 46.9343C66.7476 46.9942 66.8078 47.054 66.8981 47.1139C67.5299 47.6528 68.3122 47.9222 69.2449 47.9222C69.8467 47.9222 70.3582 47.7576 70.7794 47.4283C71.2006 47.069 71.4113 46.6499 71.4113 46.1709C71.4113 45.8416 71.336 45.5571 71.1856 45.3176C71.0652 45.1081 70.8396 44.8985 70.5086 44.6889C70.1777 44.4794 69.6662 44.2249 68.9741 43.9255C67.9511 43.5363 67.214 43.0873 66.7627 42.5783C66.3414 42.0694 66.1308 41.5005 66.1308 40.8719C66.1308 40.0935 66.4167 39.4648 66.9883 38.9858C67.56 38.5068 68.3272 38.2673 69.2901 38.2673C69.8617 38.2673 70.4033 38.387 70.9148 38.6265C71.3962 38.866 71.8325 39.1804 72.2236 39.5696L71.4564 40.6024L71.3661 40.5126C71.3661 40.4827 71.3511 40.4378 71.321 40.3779C71.321 40.2881 71.2909 40.2132 71.2307 40.1533C71.2006 40.0635 71.1405 39.9887 71.0502 39.9288C70.8095 39.6893 70.5237 39.5097 70.1927 39.3899C69.8918 39.3001 69.5308 39.2552 69.1095 39.2552C68.5679 39.2552 68.1467 39.4049 67.8458 39.7043C67.5149 40.0037 67.3494 40.3629 67.3494 40.782C67.3494 41.1114 67.4096 41.3958 67.5299 41.6353C67.6804 41.8748 67.9361 42.0993 68.2972 42.3089C68.6582 42.5484 69.1998 42.8029 69.9219 43.0723C70.9148 43.4914 71.6068 43.9106 71.998 44.3297C72.359 44.7788 72.5396 45.3326 72.5396 45.9912C72.5396 46.5002 72.4192 46.9792 72.1785 47.4283C71.9077 47.8773 71.5166 48.2516 71.0051 48.5509C70.4635 48.8503 69.8166 49 69.0644 49Z" />
            <path d="M71.5953 34.4951V8H74.3032V34.4951H71.5953ZM75.6572 34.4951V8H79.7191V34.4951H75.6572ZM83.7809 34.4951V8H85.1349V34.4951H83.7809ZM78.32 39.4348H75.3864V38.402H82.6075V39.4348H79.5385V48.8204H78.32V39.4348Z" />
            <path d="M81.5279 34.4951V8H82.8818V34.4951H81.5279ZM86.9437 34.4951V8H89.6516V34.4951H86.9437ZM91.0056 34.4951V8H92.3595V34.4951H91.0056ZM85.7703 38.402H92.179V39.4348H86.8534V42.8478H91.2764V43.9255H86.8534V47.7875H92.1339V48.8204H85.7703V38.402Z" />
            <path d="M91.4604 34.4951V8H94.1683V34.4951H91.4604ZM98.2302 34.4951V8H99.5842V34.4951H98.2302ZM100.938 34.4951V8H105V34.4951H100.938ZM95.6577 38.402H98.7267C99.9302 38.402 100.803 38.6714 101.344 39.2103C101.916 39.7192 102.202 40.4527 102.202 41.4107C102.202 42.0095 102.006 42.5783 101.615 43.1172C101.224 43.6561 100.712 44.0153 100.081 44.195L102.518 48.8204H101.209L98.8621 44.2399H96.8311V48.8204H95.6577V38.402ZM98.8621 43.207C99.5842 43.207 100.126 43.0424 100.487 42.713C100.818 42.4137 100.983 41.9796 100.983 41.4107C100.983 40.8419 100.818 40.3779 100.487 40.0186C100.126 39.6893 99.5842 39.5246 98.8621 39.5246H96.8311V43.207H98.8621Z" />
          </svg>
          <svg
            height="29"
            width="141"
            viewBox="0 0 141 29"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title tw="hidden">Farcaster</title>
            <path d="M5.55072 0.377808H25.3788V28.6223H22.4682V15.6845H22.4397C22.118 12.1088 19.118 9.30667 15.4647 9.30667C11.8115 9.30667 8.81149 12.1088 8.48979 15.6845H8.46126V28.6223H5.55072V0.377808Z" />
            <path d="M0.275362 4.38666L1.45777 8.39556H2.45825V24.6134C1.95593 24.6134 1.54872 25.0213 1.54872 25.5245V26.6178H1.36683C0.864501 26.6178 0.457252 27.0257 0.457252 27.5289V28.6223H10.6442V27.5289C10.6442 27.0257 10.2369 26.6178 9.73462 26.6178H9.55273V25.5245C9.55273 25.0213 9.14548 24.6134 8.64315 24.6134H7.55172V4.38666H0.275362Z" />
            <path d="M22.6502 24.6134C22.1478 24.6134 21.7406 25.0213 21.7406 25.5245V26.6178H21.5587C21.0564 26.6178 20.6492 27.0257 20.6492 27.5289V28.6223H30.8361V27.5289C30.8361 27.0257 30.4288 26.6178 29.9265 26.6178H29.7446V25.5245C29.7446 25.0213 29.3374 24.6134 28.8351 24.6134V8.39556H29.8355L31.018 4.38666H23.7416V24.6134H22.6502Z" />
            <path d="M132.794 23.0071V10.2598H135.702V12.3844H135.835C136.066 11.6485 136.464 11.0814 137.027 10.6831C137.596 10.2792 138.245 10.0773 138.974 10.0773C139.14 10.0773 139.325 10.0856 139.529 10.1021C139.739 10.1132 139.913 10.1326 140.052 10.1602V12.9238C139.924 12.8796 139.723 12.8408 139.447 12.8077C139.176 12.7689 138.914 12.7496 138.66 12.7496C138.113 12.7496 137.621 12.8685 137.185 13.1064C136.754 13.3388 136.415 13.6624 136.166 14.0774C135.917 14.4923 135.793 14.9709 135.793 15.5131V23.0071H132.794Z" />
            <path d="M124.598 23.2561C123.323 23.2561 122.221 22.9905 121.293 22.4594C120.37 21.9227 119.661 21.1648 119.164 20.1855C118.666 19.2007 118.418 18.0416 118.418 16.7082C118.418 15.3969 118.666 14.2461 119.164 13.2558C119.666 12.2599 120.367 11.4853 121.268 10.9321C122.168 10.3733 123.226 10.0939 124.441 10.0939C125.225 10.0939 125.965 10.2211 126.661 10.4756C127.363 10.7246 127.981 11.1119 128.517 11.6375C129.058 12.1631 129.484 12.8325 129.793 13.6459C130.102 14.4536 130.257 15.4163 130.257 16.5339V17.4551H119.826V15.4301H127.382C127.377 14.8547 127.252 14.343 127.009 13.8948C126.766 13.4411 126.427 13.0843 125.99 12.8243C125.559 12.5642 125.057 12.4342 124.483 12.4342C123.869 12.4342 123.331 12.5836 122.867 12.8824C122.403 13.1756 122.041 13.5629 121.782 14.0442C121.527 14.52 121.398 15.0429 121.392 15.6127V17.3804C121.392 18.1218 121.527 18.758 121.798 19.2892C122.069 19.8148 122.447 20.2187 122.933 20.5008C123.419 20.7774 123.988 20.9158 124.64 20.9158C125.076 20.9158 125.471 20.8549 125.825 20.7332C126.178 20.6059 126.484 20.4206 126.744 20.1772C127.004 19.9337 127.2 19.6322 127.332 19.2726L130.132 19.5879C129.956 20.3293 129.619 20.9766 129.122 21.5299C128.63 22.0776 128.001 22.5037 127.233 22.808C126.465 23.1067 125.587 23.2561 124.598 23.2561Z" />
            <path d="M116.593 10.2598V12.5836H109.278V10.2598H116.593ZM111.084 7.20582H114.083V19.173C114.083 19.5769 114.144 19.8867 114.265 20.1025C114.392 20.3127 114.558 20.4566 114.762 20.534C114.967 20.6115 115.193 20.6502 115.442 20.6502C115.629 20.6502 115.801 20.6364 115.955 20.6087C116.116 20.581 116.237 20.5562 116.32 20.534L116.825 22.8826C116.665 22.938 116.436 22.9988 116.137 23.0652C115.845 23.1316 115.486 23.1703 115.061 23.1814C114.309 23.2035 113.633 23.0901 113.031 22.8411C112.429 22.5866 111.951 22.1938 111.597 21.6627C111.25 21.1316 111.079 20.4676 111.084 19.6709V7.20582Z" />
            <path d="M107.493 13.6293L104.759 13.928C104.681 13.6514 104.546 13.3913 104.353 13.1479C104.165 12.9045 103.911 12.7081 103.59 12.5587C103.27 12.4093 102.878 12.3346 102.414 12.3346C101.79 12.3346 101.265 12.4701 100.84 12.7413C100.42 13.0124 100.213 13.3637 100.218 13.7952C100.213 14.1659 100.348 14.4675 100.624 14.6998C100.906 14.9322 101.37 15.1231 102.016 15.2725L104.187 15.7372C105.391 15.9972 106.286 16.4094 106.871 16.9737C107.462 17.5381 107.76 18.2767 107.766 19.1896C107.76 19.9918 107.525 20.7 107.062 21.3141C106.603 21.9227 105.965 22.3985 105.148 22.7415C104.33 23.0846 103.392 23.2561 102.331 23.2561C100.774 23.2561 99.5196 22.9297 98.5696 22.2768C97.6197 21.6184 97.0536 20.7028 96.8715 19.5299L99.7959 19.2477C99.9285 19.8231 100.21 20.2574 100.641 20.5506C101.072 20.8439 101.632 20.9905 102.323 20.9905C103.035 20.9905 103.607 20.8439 104.038 20.5506C104.474 20.2574 104.692 19.895 104.692 19.4634C104.692 19.0983 104.551 18.7968 104.27 18.5588C103.994 18.321 103.563 18.1384 102.977 18.0111L100.807 17.5547C99.5859 17.3002 98.683 16.8714 98.0977 16.2683C97.512 15.6597 97.2222 14.8907 97.2275 13.9612C97.2222 13.1756 97.4347 12.4951 97.8656 11.9196C98.3019 11.3387 98.9069 10.8906 99.68 10.5752C100.459 10.2543 101.356 10.0939 102.372 10.0939C103.864 10.0939 105.037 10.412 105.894 11.0483C106.755 11.6845 107.288 12.5448 107.493 13.6293Z" />
            <path d="M87.7004 23.2644C86.8937 23.2644 86.1676 23.1205 85.5213 22.8329C84.8808 22.5396 84.3724 22.1081 83.9971 21.5382C83.6271 20.9683 83.4417 20.2657 83.4417 19.4303C83.4417 18.711 83.5743 18.1163 83.8395 17.646C84.1047 17.1757 84.4666 16.7995 84.925 16.5173C85.3834 16.2351 85.8995 16.0221 86.4741 15.8783C87.0541 15.7289 87.6533 15.621 88.2718 15.5546C89.0175 15.4772 89.6224 15.408 90.0862 15.3472C90.5503 15.2807 90.8872 15.1811 91.0971 15.0484C91.3124 14.9101 91.4201 14.6971 91.4201 14.4094V14.3595C91.4201 13.7344 91.2351 13.2503 90.8651 12.9072C90.4951 12.5642 89.9622 12.3927 89.2659 12.3927C88.5317 12.3927 87.9488 12.5531 87.5178 12.874C87.0926 13.1949 86.8057 13.5739 86.6563 14.011L83.8563 13.6126C84.0769 12.8381 84.4416 12.1908 84.9495 11.6707C85.4579 11.1451 86.0792 10.7522 86.8139 10.4922C87.5486 10.2267 88.3602 10.0939 89.2496 10.0939C89.8627 10.0939 90.473 10.1658 91.0804 10.3096C91.6882 10.4535 92.2432 10.6914 92.7458 11.0234C93.2484 11.3498 93.6515 11.7952 93.9552 12.3595C94.2647 12.9238 94.419 13.6293 94.419 14.4757V23.0071H91.5359V21.256H91.4369C91.2543 21.6101 90.9977 21.9421 90.6662 22.2519C90.3404 22.5562 89.929 22.8024 89.4317 22.9905C88.9401 23.1731 88.363 23.2644 87.7004 23.2644ZM88.4789 21.0569C89.0809 21.0569 89.6028 20.9379 90.0448 20.7C90.4869 20.4566 90.8262 20.1357 91.064 19.7373C91.3067 19.339 91.4283 18.9046 91.4283 18.4344V16.9323C91.3345 17.0097 91.1745 17.0816 90.9477 17.148C90.7267 17.2144 90.4783 17.2725 90.2024 17.3223C89.9261 17.3721 89.6527 17.4163 89.3822 17.4551C89.1112 17.4938 88.8767 17.527 88.6778 17.5547C88.2304 17.6155 87.8301 17.7151 87.4765 17.8534C87.1229 17.9918 86.8442 18.1854 86.6399 18.4344C86.4353 18.6778 86.3334 18.9932 86.3334 19.3804C86.3334 19.9337 86.5347 20.3514 86.9379 20.6336C87.341 20.9158 87.8547 21.0569 88.4789 21.0569Z" />
            <path d="M76.1243 23.2561C74.8543 23.2561 73.7631 22.9767 72.852 22.4179C71.9462 21.8591 71.2476 21.0873 70.756 20.1025C70.2697 19.1121 70.0266 17.9724 70.0266 16.6833C70.0266 15.3886 70.2755 14.2461 70.7724 13.2558C71.2697 12.2599 71.9708 11.4853 72.877 10.9321C73.788 10.3733 74.8653 10.0939 76.1079 10.0939C77.1406 10.0939 78.0545 10.2848 78.8502 10.6665C79.6508 11.0427 80.2889 11.5766 80.7637 12.2682C81.2388 12.9543 81.5094 13.7565 81.5757 14.6749H78.7094C78.5932 14.0608 78.3169 13.549 77.8806 13.1396C77.45 12.7247 76.8729 12.5172 76.1493 12.5172C75.5361 12.5172 74.9975 12.6832 74.5338 13.0151C74.0696 13.3416 73.7078 13.8118 73.4483 14.426C73.1942 15.0401 73.0673 15.7759 73.0673 16.6335C73.0673 17.5021 73.1942 18.249 73.4483 18.8742C73.7025 19.4939 74.0586 19.9724 74.517 20.31C74.9811 20.6419 75.5251 20.8079 76.1493 20.8079C76.5909 20.8079 76.9859 20.7249 77.3338 20.5589C77.6874 20.3874 77.9829 20.1412 78.2203 19.8203C78.4581 19.4994 78.621 19.1094 78.7094 18.6502H81.5757C81.5041 19.552 81.2389 20.3515 80.7804 21.0486C80.322 21.7402 79.6979 22.2823 78.9079 22.6752C78.1184 23.0625 77.1905 23.2561 76.1243 23.2561Z" />
            <path d="M61.8477 23.0071V10.2598H64.7557V12.3844H64.8883C65.12 11.6485 65.5178 11.0814 66.081 10.6831C66.6499 10.2792 67.2991 10.0773 68.028 10.0773C68.1938 10.0773 68.3788 10.0856 68.583 10.1021C68.793 10.1132 68.967 10.1326 69.1053 10.1602V12.9238C68.978 12.8796 68.7766 12.8408 68.5004 12.8077C68.2298 12.7689 67.9675 12.7496 67.7133 12.7496C67.1665 12.7496 66.6749 12.8685 66.2386 13.1064C65.808 13.3388 65.4683 13.6624 65.2195 14.0774C64.971 14.4923 64.847 14.9709 64.847 15.5131V23.0071H61.8477Z" />
            <path d="M52.113 23.2644C51.3067 23.2644 50.5806 23.1205 49.9343 22.8329C49.2938 22.5396 48.7855 22.1081 48.4097 21.5382C48.0397 20.9683 47.8547 20.2657 47.8547 19.4303C47.8547 18.711 47.9873 18.1163 48.2526 17.646C48.5178 17.1757 48.8792 16.7995 49.3376 16.5173C49.796 16.2351 50.3125 16.0221 50.8872 15.8783C51.4672 15.7289 52.0664 15.621 52.6848 15.5546C53.4305 15.4772 54.0351 15.408 54.4992 15.3472C54.9629 15.2807 55.3002 15.1811 55.5098 15.0484C55.7255 14.9101 55.8331 14.6971 55.8331 14.4094V14.3595C55.8331 13.7344 55.6481 13.2503 55.2781 12.9072C54.9077 12.5642 54.3748 12.3927 53.679 12.3927C52.9443 12.3927 52.3619 12.5531 51.9309 12.874C51.5056 13.1949 51.2183 13.5739 51.0693 14.011L48.2689 13.6126C48.4899 12.8381 48.8546 12.1908 49.3626 11.6707C49.8709 11.1451 50.4922 10.7522 51.2269 10.4922C51.9612 10.2267 52.7732 10.0939 53.6626 10.0939C54.2753 10.0939 54.8856 10.1658 55.4934 10.3096C56.1008 10.4535 56.6558 10.6914 57.1584 11.0234C57.661 11.3498 58.0642 11.7952 58.3683 12.3595C58.6773 12.9238 58.832 13.6293 58.832 14.4757V23.0071H55.9489V21.256H55.8495C55.6673 21.6101 55.4103 21.9421 55.0792 22.2519C54.7534 22.5562 54.3416 22.8024 53.8447 22.9905C53.3532 23.1731 52.7761 23.2644 52.113 23.2644ZM52.8919 21.0569C53.494 21.0569 54.0158 20.9379 54.4579 20.7C54.8995 20.4566 55.2392 20.1357 55.4766 19.7373C55.7197 19.339 55.8413 18.9046 55.8413 18.4344V16.9323C55.7476 17.0097 55.5871 17.0816 55.3608 17.148C55.1398 17.2144 54.8913 17.2725 54.615 17.3223C54.3392 17.3721 54.0658 17.4163 53.7948 17.4551C53.5243 17.4938 53.2897 17.527 53.0908 17.5547C52.6435 17.6155 52.2428 17.7151 51.8895 17.8534C51.5359 17.9918 51.2572 18.1854 51.0525 18.4344C50.8483 18.6778 50.7464 18.9932 50.7464 19.3804C50.7464 19.9337 50.9478 20.3514 51.3509 20.6336C51.7541 20.9158 52.2677 21.0569 52.8919 21.0569Z" />
            <path d="M46.5356 10.2598V12.5836H39.0131V10.2598H46.5356ZM40.8934 23.0071V9.05648C40.8934 8.19893 41.0702 7.4852 41.4239 6.91534C41.7828 6.34548 42.2633 5.91945 42.8654 5.63729C43.4675 5.35513 44.1359 5.21405 44.8701 5.21405C45.3895 5.21405 45.8504 5.25554 46.254 5.33852C46.6571 5.42155 46.9551 5.49621 47.1487 5.56263L46.5519 7.88634C46.4251 7.8476 46.265 7.80889 46.0714 7.77015C45.8782 7.72587 45.6629 7.70377 45.4251 7.70377C44.8673 7.70377 44.4727 7.83932 44.2406 8.11041C44.0143 8.37597 43.9009 8.75772 43.9009 9.25566V23.0071H40.8934Z" />
          </svg>
        </div>

        <p tw="flex text-white text-5xl font-bold text-center leading-none mx-4 flex-wrap items-center justify-center">
          {content.term}'ve spent a total of{" "}
          <span
            style={{
              whiteSpace: "pre",
            }}
            tw="text-pink-300"
          >
            {" "}
            {content.totalGas} ETH{" "}
          </span>
          on gas. Right now, that's{" "}
          <span
            style={{
              whiteSpace: "pre",
            }}
            tw="text-pink-300"
          >
            {" "}
            ${content.price}
          </span>
          .
        </p>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter another address..." />,
      <Button action={`/compare/${resolvedAddress}`}>Compare</Button>,
      <Button.Reset>Reset</Button.Reset>,
      <Button.Link href="https://warpcast.com/boi">Follow Me</Button.Link>,
    ],
    imageOptions,
  });
});

export const GET = handle(app);
export const POST = handle(app);
