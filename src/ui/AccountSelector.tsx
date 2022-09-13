import { ComponentChildren, FunctionalComponent, h } from 'preact';
import { AccountWithBalances } from 'src/types';

interface AccountSelectorProps {
  currentAccount: string;
  accounts: AccountWithBalances[];
  onChange: h.JSX.GenericEventHandler<HTMLSelectElement>;
}

function formatAddress(address: string): string {
  return address.slice(0,4) + '...' + address.slice(-4);
}

function formatEther(balance: string): string {
  return balance.slice(0,10);
}

const AccountSelector: FunctionalComponent<AccountSelectorProps> = (props: AccountSelectorProps) => {
  return (
    <select value={props.currentAccount} onChange={ props.onChange }>
      { props.accounts.map( (account: AccountWithBalances ) => (
        <option value={account.address} key={account.address}>
          { formatAddress( account.address )} - {formatEther(account.balance)} eth
        </option>
      ))}      
    </select>
  );
}

export default AccountSelector;

