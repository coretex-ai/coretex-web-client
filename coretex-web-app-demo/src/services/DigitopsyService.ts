import axios from "axios";

const ENDPOINT_DATA = {
  url: "https://api.coretex.ai/api/v1/endpoint/invoke/3057-digitopsy-internvl-ep",
  token:
    "0tRx9Tn9LHTHLnXoesrLdYkGrzFMwuEO2tg6NZsUePHV9fs5Ad4Po4HlT2xOzvGhHdlJgTrm7mAH7SezWAW1Dj8E12uFijdCu1rdNGYy0o7hDr7iQqXyGbiiO448CHNJ",
};

export class DigitopsyService {
  static invoke = (image: File) => {
    return axios.post(
      ENDPOINT_DATA.url,
      { image, debug: true },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "endpoint-token": ENDPOINT_DATA.token,
        },
      }
    );
  };

  static submitDataForAnalysis = (debug_file: File) => {
    return axios.post(
      `${ENDPOINT_DATA.url}?analyze=true`,
      { debug_file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "endpoint-token": ENDPOINT_DATA.token,
        },
      }
    );
  };
}
