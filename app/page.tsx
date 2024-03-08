import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";
import Image from "next/image";

import styles from "./page.module.css";
import { getBaseUrl } from "@/utils/functions";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(`${getBaseUrl()}/api`);

  return {
    other: frameTags,
  };
}

export default function Home() {
  return <main className={styles.main}>Gascaster? Gascaster.</main>;
}
