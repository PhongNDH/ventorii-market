'use client';

import { useMemo } from 'react';
import { ArgentMobileConnector } from 'starknetkit/argentMobile';
import { WebWalletConnector } from 'starknetkit/webwallet';
import {
  StarknetConfig,
  publicProvider,
  braavos,
  argent,
  jsonRpcProvider,
} from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  // const provider = publicProvider();

  const connectors = useMemo(() => {
    return [
      braavos(),
      argent(),
      new WebWalletConnector({ url: 'https://web.argent.xyz' }),
      new ArgentMobileConnector(),
    ];
  }, []);

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={jsonRpcProvider({
        rpc: () => ({
          nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
        }),
      })}
      connectors={connectors}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
