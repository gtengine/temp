import { apiList } from "@qsoc/js-api/dist/constants/api-list";

export const kindOfApi = [
  { title: "C", version: "1.0" },
  { title: "JS", version: "1.0" },
];

export const apis = [
  { field: "api", name: apiList.loopback, function: console.log },
  { field: "api", name: apiList.getFWInfo, function: console.log },
];
