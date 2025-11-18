interface CreditWalletProps {
  balance: number;
}

export default function CreditWallet({ balance }: CreditWalletProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">Credit Wallet 💰</h2>
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6 mb-4">
        <p className="text-white text-sm mb-1">Available Balance</p>
        <p className="text-white text-4xl font-bold">{balance.toLocaleString()}</p>
        <p className="text-white/80 text-xs mt-1">Credits</p>
      </div>
      <div className="space-y-2">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition">
          Transfer Credits
        </button>
        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition">
          Redeem Rewards
        </button>
        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition">
          Transaction History
        </button>
      </div>
    </div>
  );
}
