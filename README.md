# Decentralized Record of Value (DRV)

## Privacy

DRV records may be announced publicly in the form of a publicly-viewable blockchain that can be read from a number of random peers. The public can see the amount and kind of currency transferred in every transaction, but the identities of the parties involved are obfuscated behind their respective address hashes in order to maintain a level of individual privacy.

In non-fungible systems (like [Dereva](https://github.com/bennyschmidt/dereva)), any data stored in files on the blockchain can be made viewable by the public, but the sender's & recipient's identities are still obfuscated by default. If the magnet URI is known, the file can be displayed in a browser (in JSON format).

## Dereva

[Dereva](https://github.com/bennyschmidt/dereva) is a deployable Node.js [service](https://github.com/bennyschmidt/node-service-library) that extends basic ledger functionality with native content types and file storage, enabling robust non-fungible records in addition to fungible transactions. You can install & use it as a library, or deploy this code as a REST API. For fungible systems, it allows any user with quantifiable Dereva to alias & denominate their own token to sell or freely distribute.

## Decentralization

Anyone can create their own token, or their own content protocol, by forking the [Dereva](https://github.com/bennyschmidt/dereva) repository and serving it to the web with their new token name and configuration. The codebase installs a local copy of `drv-core`, so that every instance of Dereva runs its own blockchain instance. 

`drv-core` broadcasts transactions to other nodes in the peer network, who run their own validation logic to determine if it should be entered into their blockchain instance or not. Because everyone installs the same blockchain, the validation logic should be identical. But if a host tampered with their local blockchain code, they may yield different validation results than other nodes. Implementing a protocol layer on top of `drv-core` (like Dereva) is thus usually necessary, and enforcing it should vary depending on how strict it needs to be, but it usually includes satisfying unit tests in order to be retained in peer lists.

![drv-dereva-diagram](https://user-images.githubusercontent.com/45407493/230754918-3e27727e-407e-4908-be20-df75a9868962.png)

## Consensus

Anyone can determine the validity of a transaction against a certain confidence threshold by counting how many instances have validated it versus the total being queried. As more peers run a transaction, confidence is built, and upon a certain threshold determined by the user a transaction may be deemed valid.

When performing a basic balance inquiry or when transferring Dereva to another user, like any other request the values are determined functionally - in other words, calculated at the time it's needed to be across a number of peer instances until the provided confidence threshold is met.

## Contracts

Contracts are agreements between participants in a transaction that help enforce the protocol. The contract type is specified in the request by it's string name (e.g. `{ contract: "DRV100" }`). Currently there are 2 kinds of contracts:

**[DRV100](https://github.com/bennyschmidt/DRV100) (Record)**

**[DRV200](https://github.com/bennyschmidt/DRV200) (Non-Fungible Record)**

## Validations

Validations are lifecycle hooks that run before a transaction is completed, and their `Boolean` return value determines whether or not the transaction will continue. Currently there are 2 kinds of validations:

**Record**

**Non-Fungible Record**

## Enforcements

Enforcements are lifecycle hooks that run after a transaction has completed. The [Broadcast](https://github.com/bennyschmidt/drv-core/blob/master/enforcements/broadcast.js) enforcement included in this distribution ensures that a transaction is broadcasted to peers in a network (defined by peer lists). But DRV is not limited to just peer-to-peer activity. An enforcement could, for example, activate a machine in a device network, or run a callback script.
