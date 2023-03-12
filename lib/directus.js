import getConfig from "next/config";
import { Directus } from "@directus/sdk";

const { publicRuntimeConfig: { url }, serverRuntimeConfig: { token } } = getConfig();

const directus = new Directus(url);

export async function getDirectusClient() {
  await directus.auth.static(token);
  return directus;
}
