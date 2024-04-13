import { useState } from "react";
import server from "./server";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256, keccak224, keccak384, keccak512 } from "ethereum-cryptography/keccak.js";


function Transfer({ signature, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  
  async function transfer(evt) {
    evt.preventDefault();
    const publicKey = "0319c4207b482da07765ae412dee0ef70e4f1210efb6c59c4d579c6b54d6b60a4e";
    const hashedMessage=keccak256(utf8ToBytes(publicKey));
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        //public key , signature , hashed message
        signature: signature,
        publicKey:publicKey,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an signature, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
