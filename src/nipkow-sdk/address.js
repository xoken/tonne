import nexa from "./nexa";

export class Address {
  getUTXOsByAddress = (address, pagesize) => {
    const data = {
      address: address,
      pagesize: pagesize.toString(),
    };
    const queryParam = new URLSearchParams(data);
    const response = nexa.get("addresses/utxos", { params: queryParam });
    return response;
  };
}
