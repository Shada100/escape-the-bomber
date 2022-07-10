import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";

const WalletConnectB = ({ account, connectWall }) => {
  const connectWallet = () => {
    connectWall();
  };

  return (
    <div>
      <Button
        onClick={() => {
          connectWallet();
        }}
        bgColor="green.500"
        minW={"9rem"}
      >
        {account ? `${truncateEthAddress(account)}` : "Connect Wallet"}
      </Button>
    </div>
  );
};

export default WalletConnectB;
