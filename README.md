# Decentralized Record of Value (DRV)

## Privacy

DRV records may be announced publicly in the form of a publicly-viewable blockchain that can be read from a number of random peers. Only records with a high confidence level that are validated in multiple instances of DRV should be included, although transactions that were recently added may be shown in an unverified state until their validation process is complete. The public can see the amount and kind of currency transferred in every transaction, but the identities of the parties involved are obfuscated behind their respective address hashes in order to maintain a level of individual privacy.

## Dereva

[Dereva](https://github.com/bennyschmidt/dereva) is a deployable digital currency that also extends `drv-core` with native content types and file storage enabling robust non-fungible records. For fungible systems, it allows any user with quantifiable Dereva (a minimum account balance of 0.0000000001) to define and alias their own token to sell or freely distribute in any amount and denomination they choose, limited to their account balance.

## Decentralization

Anyone can create their own token, or their own content protocol, by forking the [Dereva](https://github.com/bennyschmidt/dereva) repository and serving it to the web with their new token name and configuration. The codebase installs a local copy of `drv-core`, so that every instance of Dereva runs its own blockchain instance.

Transactions are broadcasted to other nodes in the peer network, who run their own validation logic to determine if it should be entered into their blockchain instance or not. Because everyone installs the same blockchain, the validation logic should be identical. But if a host tampers with their local blockchain code, they may yield different validation results than other nodes. Enforcing a protocol should vary depending on how strict it is, but it usually includes satisfying unit tests in order to be included in peer lists.

Anyone can determine the validity of a transaction against a certain confidence threshold by counting at any time how many instances have validated it versus how many instances are running. As more peers run a transaction, confidence is built, and upon a certain threshold determined by the user a transaction may be deemed valid.

When performing a basic balance inquiry or when transferring Dereva to another user, like any other request the values are determined functionally - that is, they are calculated at the time it's needed to be across a number of peer instances until the provided confidence threshold is met.

## Contracts

Contracts are agreements between participants in a transaction that are specified in the request by their string name (e.g. `{ contract: "DRV100" }`). Currently there are 2 kinds of contracts:

**[DRV100](https://github.com/bennyschmidt/DRV100) (Record)**

**[DRV200](https://github.com/bennyschmidt/DRV200) (Non-Fungible Record)**

Contracts can encompass just one, or many transactions, and even establish long-term payment schedules involving various layers of validation and user interaction.

## Validations

Validations are lifecycle hooks that run before a transaction is completed, and their `Boolean` return value determines whether or not the transaction will continue. Currently there are 2 kinds of validations:

**Record**

**Non-Fungible Record**

## Enforcements

Enforcements are lifecycle hooks that run after a transaction has completed. The [Broadcast](https://github.com/bennyschmidt/drv-core/blob/master/enforcements/broadcast.js) enforcement included in this distribution ensures that a transaction is broadcasted to peer lists.
