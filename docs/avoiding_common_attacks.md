# Avoiding Common Attacks

### 1. Checks-Effects-Interactions (Avoiding state changes after external calls)
<!-- Describe places in the contract where this pattern is used and why it is useful -->
<!-- Describe what attack this prevents -->

### 2. Re-entrancy
https://swcregistry.io/docs/SWC-107
<!-- Describe how single function and cross function re-entrancy is prevented -->
<!-- Describe what attack this prevents -->

### 3. Proper use of .call
https://swcregistry.io/docs/SWC-104
<!-- Describe where and why call is used -->
<!-- Describe why checking the return value of call is a good practice -->
<!-- Bonus: Describe why call is preferred to transfer -->

<!--
Bonus: Pull Over Push (Prioritize receiving contract calls over making contract calls)
Instead of sending funds on burn us a pull pattern and a withdraw method
-->
