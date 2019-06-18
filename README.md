# CRX3 extension ID incorrect on Selenium addExtensions

Need to get this fixed before [crx2 full deprecation](https://www.chromium.org/crx2-deprecation)

Versions used:
1) Chromedriver `75.0.3770.90` ([link](https://www.npmjs.com/package/chromedriver))
1) Selenium-webdriver `4.0.0-alpha.3` ([link](https://www.npmjs.com/package/selenium-webdriver))

### Issue Description
Selenium provides an `addExtensions` hook to install CRX files into Chromedriver on launch. This hook works fine for CRX2 files, but the extension ID is incorrect when given an CRX3 file (the file is parsed with CRX2 logic despite being a CRX3 format file). HOWEVER, the extension ID is CORRECTLY parsed if I drag&drop the exact same extension into the Chrome window created by Selenium.

### Steps to reproduce

#### Proving to yourself the extension ID is ``ffnbelfdoeiohenkjibnmadjiehjhajb``
1) (optional) Download the Yoroi extension for CRX2 and CRX3 (**note**: the files are already provided for you in this Github repository so you don't have to download them unless you're paranoid about the files I provided)
   1) [CRX2](https://clients2.google.com/service/update2/crx?response=redirect&prodversion=75.0.3770.90&acceptformat=crx2&x=id%3Dffnbelfdoeiohenkjibnmadjiehjhajb%26uc)
   2) [CRX3](https://clients2.google.com/service/update2/crx?response=redirect&prodversion=75.0.3770.90&acceptformat=crx3&x=id%3Dffnbelfdoeiohenkjibnmadjiehjhajb%26uc)
1) (optional) Verify you downloaded the CRX3 version using https://crx-checker.appspot.com/
1) Open [chrome://extensions/](chrome://extensions/)
1) Enable `Developer Mode`
1) Drag & Drop the CRX2 or CRX3 into Chrome and note the extension ID is `ffnbelfdoeiohenkjibnmadjiehjhajb` in both cases

#### Showing ID is correct on CRX2 but incorrect on CRX3

1) `npm install`
1) `npm run test-v2` and note it succeeds with the right ID (`ffnbelfdoeiohenkjibnmadjiehjhajb`)
1) `npm run test-v3` and note it fails. If you click on the extension logo at the top-right of your browser, you will note instead the ID has become `jnbggedlnjedoclkloemghehimmjlfea`

#### Showing the ID is properly stored inside CRX file

1) Check the ID inside CRX2 is correct with `npm run pubkey-v2` (output provided below for convenience)
2) Check one of the IDs inside CRX3 is correct with `npm run pubkey-v3` (output provided for convenience. Note CRX3 allows for multiple pub keys)

##### pubkey-v2 output

```
== CRX2 ==
pub key: 30820122300d06092a864886f70d01010105000382010f003082010a0282010100cd2ee6b1c94fa447bcd4b9439d888291f17ab233cdaa569d2a98b4c87f637baaab5f86b15b08b87a16728e77673f0502c62d4ca011822e25fcee0aa83c305a8c73eab5ad821df9b70df57a893f5b388fc8d703812505af90420051db5abda20598df942a4f2f0bde5bb5eb1d209d9fc4b33af25c202c08dce7bbfe6f42449064d264e610f54a67340c72aef4bc3acc6f2850809458a8b9b85407e60ea21644e174b4be73342bdf6979d0e0d79b281db3f339a373547293ae6a3833057de35fd96bc4979ba5b7897a4c35e739fa75b0daa015033e2d7ea35bb2353d3b40846c52b6036050119ef01e49d5b2b0237a30a02db1262e301beea7fa86df9ff4af67350203010001

id: ffnbelfdoeiohenkjibnmadjiehjhajb
```

##### pubkey-v3 output

Note: 2nd ID is the one we want
```
== CRX3 ==

pub key: 30820122300d06092a864886f70d01010105000382010f003082010a02820101008ffbbf5c3763943cb0ee01c4b5a69ab19f46746f1638a0322735ddf0716b0edcf625cbb2edeafb32d5af1e03430346f0a739db23961d65e57851f084b00e12ac0e5bdcc9d64c7c00d5b81b88333e2fdaebaaf71a75c2ae3a54de378f10d228e684794d15b4f3bd3f56d33c3f18abfc2e05c01e0831b661d0fd9f4f3f640d1793bcad41c748be0027a84d7042920554a66db8de566e204970ee103e6bd27c31bd1b6ea43c46629f086693f92a5131a8dbb59db90f73e8a0093201e97b2a8a36a0cf17b050709da2f9a46f624db6c931fcf30812ff93bd6231d81cea1a9ef581287f755ed2277ac296f59ddb18fc76dc46f057c05834c8222d2a6575a7d90862cd0203010001
id: lfoeajgcchlidpicbabpmckkejpckcfb

pub key: 30820122300d06092a864886f70d01010105000382010f003082010a0282010100cd2ee6b1c94fa447bcd4b9439d888291f17ab233cdaa569d2a98b4c87f637baaab5f86b15b08b87a16728e77673f0502c62d4ca011822e25fcee0aa83c305a8c73eab5ad821df9b70df57a893f5b388fc8d703812505af90420051db5abda20598df942a4f2f0bde5bb5eb1d209d9fc4b33af25c202c08dce7bbfe6f42449064d264e610f54a67340c72aef4bc3acc6f2850809458a8b9b85407e60ea21644e174b4be73342bdf6979d0e0d79b281db3f339a373547293ae6a3833057de35fd96bc4979ba5b7897a4c35e739fa75b0daa015033e2d7ea35bb2353d3b40846c52b6036050119ef01e49d5b2b0237a30a02db1262e301beea7fa86df9ff4af67350203010001
id: ffnbelfdoeiohenkjibnmadjiehjhajb

pub key: 3059301306072a8648ce3d020106082a8648ce3d03010703420004b402f9a91caee10c84f8dc9b177298a5e032d5db2b59d849c0efbee86bf9f86252b86a35536c078b38d4ff9addbcddf9bc482269cc2d6ca10160b451e37bd1cf
id: gbphpckglpmphemnalmbpocejhmmjla
```

## Root cause

The root cause is that even though the file is CRX3, the parsing logic for CRX2 is used. You can check this by running `npm run pubkey-broken` which uses the CRX2 parsing algorithm on a CRX3 file.

Output
```
== INCORRECT CRX PARSER ==
pub key: a60230820122300d06092a864886f70d01010105000382010f003082010a02820101008ffbbf5c3763943cb0ee01c4b5a69ab19f46746f1638a0322735ddf0716b0edcf625cbb2edeafb32d5af1e03430346f0a739db23961d65e57851f084b00e12ac0e5bdcc9d64c7c00d5b81b88333e2fdaebaaf71a75c2ae3a54de378f10d228e684794d15b4f3bd3f56d33c3f18abfc2e05c01e0831b661d0fd9f4f3f640d1793bcad41c748be0027a84d7042920554a66db8de566e204970ee103e6bd27c31bd1b6ea43c46629f086693f92a5131a8dbb59db90f73e8a0093201e97b2a8a36a0cf17b050709da2f9a46f624db6c931fcf30812ff93bd6231d81cea1a9ef581287f755ed2277ac296f59ddb18fc76dc46f057c05834c8222d2a6575a7d90862cd02030100011280020d859f07eec02380d5a8fac1f79cad841be5ca47f4a45c1ebae26d91fc5b1b1e2e846fbd22b99775a520f9169ba793cb6916fc1cabb785b5cbe6a2aee0f3d170f800a9766069ba902d20e115d6481061ce73b32963ab36637a7f5821fe9bc00787c7fff0ea7428c3bea260625dab874fe30c7e0cf0d5e06b0195b4f14bf526eb5a4ff46a861f30201000a6221223c20c3df505d0346fd854db510d99e01bf3c9aeaad757746f97cd7ad30a44805d74cd806a695d4b4e8e4214cf35154a268833e3591ed36976224ed8dec0a94e155af0bdd28115ddb9911230b81e92963ece7b2c993d8fc3562db2de8231ee3105668a794463a3b305827d74c5715a464c4e6612ac040aa60230820122300d06092a864886f70d01010105000382010f003082010a0282010100cd2ee6b1c94fa447bcd4b9439d888291f17ab233cdaa569d2a98b4c87f637baaab5f86b15b08b87a16728e77673f0502c62d4ca011822e25fcee0aa83c305a8c73eab5ad821df9b70df57a893f5b388fc8d703812505af90420051db5abda20598df942a4f2f0bde5bb5eb1d209d9fc4b33af25c202c08dce7bbfe6f42449064d264e610f54a67340c72aef4bc3acc6f2850809458a8b9b85407e60ea21644e174b4be73342bdf6979d0e0d79b281db3f339a373547293ae6a3833057de35fd96bc4979ba5b7897a4c35e739fa75b0daa015033e2d7ea35bb2353d3b40846c52b6036050119ef01e49d5b2b0237a30a02db1262e301beea7fa86df9ff4af673502030100011280027e85389e8bc8f8a23eb96377c1bed04f32e2a099bfc9423d2f13b6d2a71ce5e1f0dc69bfd65c19580bc995b0633f2440c51cecb91df65dedd5b4daea9f0cc7fd44d680cc428d6b005bd22082efe9eec50de958d4c9c0920cc4bad32cf3df537ea64c90d7cb180dffccf9e0b186e2da6fe668690d51c95ebc423290d5b1f621ba1a046c650d35552d8c6e296e7b1b2e32fb7ffca99fb75c350e57c029583e239989598d013900c157e15ef39d7a92d72328d4242c860833180f18439e691c4a4e6910876de04e3678819a4b227a0c1036342d86cc8e7559172631de029894dbd88c74e1c1fb11d50fb804313b3d57f7c65e1758f9c970165fd016f80e345aad651aa7010a5b3059301306072a8648ce3d020106082a8648ce3d03010703420004b402f9a91caee10c84f8dc9b177298a5e032d5db2b59d849c0efbee86bf9f86252b86a35536c078b38d4ff9addbcddf9bc482269cc2d6ca10160b451e37bd1cf124830460221009ab9373af723e7a9fa3a017c8103687837fd05ba10d727c362da7068c01b0ace022100b0e50f9f63d942c7fbb6332e25fe468e4d2dace0ff4579ba6b4997cec25a222f82f104120a1055d14b53e48e74da981dc03984797091504b0304

id: jnbggedlnjedoclkloemghehimmjlfea
```

### Other helpful tips

You can find the CRX parsing code of Chromium [here](https://github.com/chromium/chromium/tree/master/components/crx_file)

You can check the contents of both CRX files is byte-for-byte the same either by unzipping both files or checking their content from https://robwu.nl/crxviewer/

Selenium-Webderive code for adding an extension [can be found here](https://github.com/SeleniumHQ/selenium/blob/d5a93cc0559fa27c367b71a212b0e613e1d9a7dd/javascript/node/selenium-webdriver/chrome.js#L426)
