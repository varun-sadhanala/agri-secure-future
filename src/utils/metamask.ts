
import { toast } from "sonner";

export interface MetaMaskState {
  accounts: string[];
  balance: string;
  chainId: string;
  isConnected: boolean;
}

export async function connectToMetaMask(): Promise<MetaMaskState | null> {
  // Check if MetaMask is installed
  if (typeof window.ethereum === 'undefined') {
    toast.error("MetaMask is not installed. Please install it to continue.");
    return null;
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Get account balance
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [accounts[0], 'latest'],
    });
    
    // Get chain ID
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    // Convert balance from wei to ether
    const balanceInEth = parseInt(balance, 16) / 1e18;
    
    const state: MetaMaskState = {
      accounts,
      balance: balanceInEth.toFixed(4),
      chainId,
      isConnected: true,
    };
    
    toast.success("Successfully connected to MetaMask!");
    return state;
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    toast.error("Failed to connect to MetaMask. Please try again.");
    return null;
  }
}

export async function sendTransaction(to: string, amountInEth: string): Promise<string | null> {
  if (typeof window.ethereum === 'undefined') {
    toast.error("MetaMask is not installed!");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const from = accounts[0];
    
    // Convert amount from ETH to wei
    const amountInWei = (Number(amountInEth) * 1e18).toString(16);
    
    // Send transaction
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from,
        to,
        value: '0x' + amountInWei,
      }],
    });
    
    toast.success("Transaction sent successfully!");
    return txHash;
  } catch (error) {
    console.error("Error sending transaction:", error);
    toast.error("Failed to send transaction. Please try again.");
    return null;
  }
}

// For TypeScript compatibility with window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
