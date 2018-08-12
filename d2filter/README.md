# Filter for DOTA2's items
---
In-browser items list with the ability to filter them based on the following criteria:

* **Attributes**
  * Strength
  * Intelligence
  * Agility
  * All Attributes
  

* **Health/Mana**
  * Health
  * Health Regeneration
  * Health Restoration
  * Mana
  * Mana Regeneration
  * Mana Restoration


* **Defensive**
  * Armor / Armor reduce/penetration
  * Magic resist / Magic Resist Reduce
  * Evasion / Miss / Accuracy
  * Physical / Magical damage block / immunity
  

* **Utility / Misc**
  * Creature Summons / Control / Illusions creating
  * Attack / spell / item cast range increase
  * Cooldown reduction
  * Invisbility and vision (true sight, night vision increase, wards etc)
  * Gold / experience
  * Disabled (stun, root, silence etc)
  * Movement speed increase / slows
  * General mobility items (example: Blink Dagger, Force Staff, moving through units)
  
* **Item properties**
  * Shareable
  * Toggable
  * Consumable (after a certain times of used the item disappears, usually 1, but not limited to)
  * Shareable (can give the item itself to another player, or one of its uses)
  * Starting Items (items which can be bought with the 650 starting gold)
  
* **Shop**
  * Home
  * Side
  * Secret Shop
  
 ---
 
 In addition to selecting them, you can also view their description (on hover or full page tooltip) as it is in the game itself: *gold cost*, *active* and *passive skills*, *side info*, *lore*, *cooldown* and/or *mana* cost
  
  
  ---
  
  Uses the <a href="https://modernizr.com/">Modernizr</a> library to detect the presence of **Flexbox** and **CSS Filters** (in order to provide fallback alternative in such cases)

---

## Browser Support

Works on **Firefox 9+** and **Chrome 11+** with fallback required.

Fully featured on **Firefox 35+** and **Chrome 30+**.

Tested on physical/virtual devices mobile devices (**Android 5.0**, **iOS 8.0**) using <a href="https://www.browserstack.com/">Browserstack</a>.

Layout responds to different devices by making use of CSS's Media Queries.
