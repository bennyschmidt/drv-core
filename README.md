# Decentralized Record of Value (DRV)

## Privacy

DRV records may be announced publicly in the form of a publicly-viewable blockchain that can be read from a number of random peers. The public can see the amount and kind of currency transferred in every transaction, but the identities of the parties involved are obfuscated behind their respective address hashes in order to maintain a level of individual privacy.

In non-fungible systems (like [Dereva](https://github.com/bennyschmidt/dereva)), any data stored in files on the blockchain can be made viewable by the public, but the sender's & recipient's identities are still obfuscated by default. If the magnet URI is known, the file can be displayed in a browser (in JSON format).

## Dereva

[Dereva](https://github.com/bennyschmidt/dereva) is a deployable Node.js [service](https://github.com/bennyschmidt/node-service-library) that extends basic ledger functionality with native content types and file storage, enabling robust non-fungible records in addition to fungible transactions. You can install & use it as a library, or deploy this code as a REST API. For fungible systems, it allows any user with quantifiable Dereva to alias & denominate their own token to sell or freely distribute.

There is no requirement to use Dereva with `drv-core`.

## Consensus

Anyone can determine the validity of a transaction against a certain confidence threshold by counting how many instances have validated it versus the total being queried. As more peers run a transaction, confidence is built, and upon a certain threshold determined by the user a transaction may be deemed valid.

When performing a basic balance inquiry or when transferring DRV to another user, like any other request the values are determined functionally - in other words, calculated at the time it's needed to be across a number of peer instances until the provided confidence threshold is met.

## Enforcements

Enforcements are lifecycle hooks that run after a transaction has completed. The [Broadcast](https://github.com/bennyschmidt/drv-core/blob/master/enforcements/broadcast.js) enforcement included in this distribution ensures that a transaction is broadcasted to peers in a network (defined by peer lists). But DRV is not limited to just peer-to-peer activity. An enforcement could, for example, activate a machine in a device network, or run a callback script.
