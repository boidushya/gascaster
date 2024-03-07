/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { neynar } from "frog/hubs";
import { getFrameMetadata, handle } from "frog/next";
import {
  type NeynarVariables,
  neynar as neynarMiddleWare,
} from "frog/middlewares";
import { getAddressFromUser } from "@/utils/functions";

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
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;

  const address = getAddressFromUser(c.var.interactor);

  const hasAddress = address !== null;

  console.log("url", process.env.VERCEL_URL);

  console.log(address);

  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api`
  );

  console.log("frameTags", frameTags);
  console.log("process.env.VERCEL_URL", process.env.VERCEL_URL);

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {status === "response"
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ""}`
            : "Welcome!"}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button value="apples">Apples</Button>,
      <Button value="oranges">Oranges</Button>,
      <Button value="bananas">Bananas</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
