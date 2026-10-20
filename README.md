# Backdoors & Breaches online: Wildcard Group edition

This is the version of the online Backdoors & Breaches game that Wildcard Group hosts at **https://play.wildcardgroup.be/**, with the agreement of Black Hills Information Security. It is a fork of the open-source [play.backdoorsandbreaches.com](https://github.com/blackhillsinfosec/play.backdoorsandbreaches.com) by BHIS.

**Backdoors & Breaches is an incident response card game by [Black Hills Information Security](https://www.blackhillsinfosec.com/).** All credit for the game, its design and the Core Deck goes to BHIS, and for the online engine (B&B Shuffle, Engine-V1) to Richard Phung ([P3hndrx](https://github.com/p3hndrx)) and BHIS.

- The original online game by BHIS: https://play.backdoorsandbreaches.com/
- All about Backdoors & Breaches: https://home.backdoorsandbreaches.com/
- The Core Deck: [BHIS Spearphish General Store](https://spearphish-general-store.myshopify.com/collections/backdoors-breaches-incident-response-card-game)

## What this edition adds

Two decks: the Core Deck V3.1, unchanged, and the Core Deck V3.1 plus the ten cards of the Wildcard Group expansion, made in cooperation with BHIS. Also Wildcard Group styling, a phone layout and short links. The full list is in [MODIFICATIONS.md](MODIFICATIONS.md).

- Play with the Wildcard Group expansion: https://play.wildcardgroup.be/wildcard/
- Play with the Core Deck: https://play.wildcardgroup.be/core/
- About the expansion and the physical pack: https://wildcardgroup.be/deck/

## Branches

- `wildcardgroup` (default): the code that runs on play.wildcardgroup.be. The repository root is the website root.
- `ICS-OT-V1.1`: the BHIS branch this edition is based on, unchanged (commit `bfc3570`).

## Licence

The code is free software under the GNU General Public License v3 ([LICENSE](LICENSE)), as in the BHIS repository. The Backdoors & Breaches name, the logos, the card designs and the card art are not covered by the GPL and remain the property of Black Hills Information Security.

Wildcard Group CommV · https://wildcardgroup.be · info@wildcardgroup.be

---

*The original README of B&B Shuffle follows.*

<img src="https://raw.githubusercontent.com/p3hndrx/B-B-Shuffle/Engine-V1/App/img/bb-logo.png" width="500px"
     alt="BackDoors & Breaches"
     style="float: left; margin-right: 10px;" />

# B&B-Shuffle
Dashboard for conducting [Backdoors & Breaches](https://www.blackhillsinfosec.com/projects/backdoorsandbreaches/) sessions over Zoom.

Backdoors & Breaches is the property of [Black Hills InfoSec](https://www.blackhillsinfosec.com/). It is a great tool for conducting incident response walkthroughs and training seminars.


# About This Script
This is a simple HTML page, best viewed at 1920x1080.

Consists of HTML, CSS, and JS to control basic behaviors.

## ChangeLog
[Change Log](ChangeLog.md)

## Features:
- Dice Roll
- Card Shuffle
- Injects
- Floating Counters

# How it Works
When you reload the page, you will get:
- 4x Scenario Cards (Top)
- 4x Randomly Assigned Established Procedures (2nd Row)
- 6x Randomly Assigned Remaining Procedures

There will be a dice box at the bottom, an Inject card dealer, and 3x stacked tokens for marking.
As the DM, you will get the solution to the Scenario (popup at bottom right).

<img src="https://raw.githubusercontent.com/p3hndrx/B-B-Shuffle/Engine-V1/Screenshots/dashboard.png" width="900px"
     alt="Dashboard"
     style="float: left; margin-right: 10px;" />

## NOTES: 
- Once you click the scenario card to reveal, you cannot flip it back.
- To facilitate narration and pre-staging the game, the DM can choose to reveal the solution:

<img src="https://raw.githubusercontent.com/p3hndrx/B-B-Shuffle/Engine-V1/Screenshots/dm-only.png" width="700px"
     alt="Dashboard"
     style="float: left; margin-right: 10px;" />

- There are 2 buttons for rolling Established Procedures and Other Procedures (respectively)
  - The totals and success/failure of the Dice Roll is calculated in the Game Progress box

<img src="https://raw.githubusercontent.com/p3hndrx/B-B-Shuffle/Engine-V1/Screenshots/roll.png" width="500px"
     alt="Dashboard"
     style="float: left; margin-right: 10px;" />

- Click DRAW INJECT to draw an inject card, CLEAR is self-explanatory

<img src="https://raw.githubusercontent.com/p3hndrx/B-B-Shuffle/Engine-V1/Screenshots/inject2.png" width="250px"
     alt="Dashboard"
     style="float: left; margin-right: 10px;" />
<img src="https://raw.githubusercontent.com/p3hndrx/B-B-Shuffle/Engine-V1/Screenshots/inject1.png" width="250px"
     alt="Dashboard"
     style="float: left; margin-right: 10px;" />

- All cards activate the lightbox.

<img src="https://raw.githubusercontent.com/p3hndrx/B-B-Shuffle/Engine-V1/Screenshots/card-display.png" width="500px"
     alt="Dashboard"
     style="float: left; margin-right: 10px;" />

- Chips can be dragged onto procedure cards to denote they are deactivated for x # of turns

<img src="https://raw.githubusercontent.com/p3hndrx/B-B-Shuffle/Engine-V1/Screenshots/chips.png" width="500px"
     alt="Dashboard"
     style="float: left; margin-right: 10px;" />

## CardList
- via Google Sheets - [Card List](https://docs.google.com/spreadsheets/d/1RNBFr4o9OPYWwR7mxdadHQwxRayylZewcphdS3K6-og/edit?usp=sharing)
- [Solution](https://docs.google.com/spreadsheets/d/1R4Za4jGgzn5LLQJia1CCZVuAVdcvOR9FQO7B7ZeBXGw/edit?usp=sharing)

## Scripts/Snippets/Tutorials Referenced
- [Flip Cards with Javascript](https://www.ricardomoreira.io/blog/2020-06-15-flip-cards-with-javascript/) by Ricardo Moreira
- [How to Create a Draggable Div](https://www.w3schools.com/howto/howto_js_draggable.asp) by W3Schools
- [How to Randomize (shuffle) a Javascript Array](https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array) via Stackoverflow
- [Lightbox](https://lokeshdhakar.com/projects/lightbox2/) by Lokesh Dhakar. (+[JQuery](https://jquery.com/))
- [Google Fonts](https://fonts.google.com/)
- And of course, the great folks over at [Black Hills InfoSec](https://www.blackhillsinfosec.com/) for the art assets.

<img src="https://raw.githubusercontent.com/p3hndrx/B-B-Shuffle/Engine-V1/App/img/blackhills-logo.png" width="200px"
     alt="Black Hills InfoSec"
     style="float: left; margin-right: 10px;" />
