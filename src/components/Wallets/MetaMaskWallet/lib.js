const passworder = require('./browser-passworder.ts')

// Deduplicates array with rudimentary non-recursive shallow comparison of keys
function dedupe (arr) {
  const result = []
  arr?.forEach(x => {
    if (!result.find(y => Object.keys(x).length === Object.keys(y).length && Object.entries(x).every(([k,ex]) => y[k] === ex ))) {
      result.push(x)
    }
  })
  return result
}

function decodeMnemonic(mnemonic) {
  if (typeof mnemonic === 'string') {
    return mnemonic
  } else {
    return Buffer.from(mnemonic).toString('utf8')
  }
}

function isVaultValid (vault) {
  return typeof vault === 'object'
    && ['data', 'iv', 'salt'].every(e => typeof vault[e] === 'string')
}

async function decryptVaultSync(password, vault) {
  if (vault.data && vault.data.mnemonic) {
    return [vault]
  }

  const keyringsWithEncodedMnemonic = await passworder.decrypt(password, JSON.stringify(vault));
  console.log("keyringsWithEncodedMnemonic:", keyringsWithEncodedMnemonic)
  const keyringsWithDecodedMnemonic = await Promise.all(
    keyringsWithEncodedMnemonic.map(keyring => {
      if ('mnemonic' in keyring.data) {
        return Object.assign(
          {},
          keyring,
          {
            data: Object.assign(
              {},
              keyring.data,
              { mnemonic: decodeMnemonic(keyring.data.mnemonic) }
            )
          }
        )
      } else {
        return keyring
      }
    })
  );
  console.log("keyringsWithDecodedMnemonic:", keyringsWithDecodedMnemonic)
  return keyringsWithDecodedMnemonic;
}

function decryptVault(password, vault) {
  if (vault.data && vault.data.mnemonic) {
    return [vault]
  }
  return passworder.decrypt(password, JSON.stringify(vault))
  .then((keyringsWithEncodedMnemonic) => {
    const keyringsWithDecodedMnemonic = keyringsWithEncodedMnemonic.map(keyring => {
      if ('mnemonic' in keyring.data) {
        console.log("keyring if mnemonic:", keyring)
        return Object.assign(
          {},
          keyring,
          {
            data: Object.assign(
              {},
              keyring.data,
              { mnemonic: decodeMnemonic(keyring.data.mnemonic) }
            )
          }
        )
      } else {
        console.log("keyring:", keyring)
        return keyring
      }
    })
    return keyringsWithDecodedMnemonic;
  })
}
module.exports = {
  decryptVault,
  decryptVaultSync,
  isVaultValid,
}