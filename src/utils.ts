import { RequestOptions } from "https";
import { Options } from "./types";

type Params = {
  [key: string]: string | number | boolean | undefined | null;
};

// Check null
const check = (value: string | number | boolean | undefined | null) => {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  } else if (typeof value === null || typeof value === undefined) {
    return false;
  } else {
    throw new Error(`Check failed:\n type: ${typeof value}\n value: ${value}`);
  }
};

const makeQueryParams = (params?: Params) => {
  if (!params) return "";

  return Object.entries(params)
    .map(([key, value]) => `${key}=${check(value) ? value : ""}`)
    .join("&");
};

const makePath = (path?: string | null, queryParams?: string) => {
  let _path = path;
  if (!path) return "";
  if (!queryParams) return path;
  if (path.includes("://")) _path = path.split("://")[1];

  return `${_path}?${queryParams}`;
};

export const makeHttpsOptions = ({
  path,
  params,
  ...urlOptions
}: Options): RequestOptions => {
  const queryParams = makeQueryParams(params);
  const finalPath = makePath(path, queryParams);

  return {
    ...urlOptions,
    path: finalPath,
  };
};
