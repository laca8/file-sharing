export type objectId = { _id: string };

export type user = {
  username: string;
  password: string;
};
export type folder = {
  name: string;
};
export type file = FormData;

export type Config = {
  headers?: Record<string, string>;
};
