// VERSION*/
// B&B - Engine.DSa.1.0
//
// Modified by Wildcard Group (18 October 2026): deck loader limited to Core V3.1 and
// Core V3.1 + Wildcard Group expansion, ?deck= URL parameter, attribution text. See MODIFICATIONS.md.
//

//UI Elements

var cardData
function opendeckselector() {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("deckselectoropen").style.display = "none";
  }
  
  function closedeckselector() {
    document.getElementById("myForm").style.display = "none";
      document.getElementById("deckselectoropen").style.display = "block";
  }
  

  function updatedeck(choice) {
          deck = choice;
          if (localStorage.getItem("deckKey") === null)
          {
            console.log("first time?");
            localStorage.setItem("deckKey", "CoreV22");
          }
          localStorage.setItem("deckKey", deck);
          //console.log(deck);

          //If we are loading the same deck, we don't need to reload
          if (choice != localStorage.getItem("deckKey"))
            loaddeck();
  }
  
  var selecteddeck;
  
  //DECK LOADER
  // Modified by Wildcard Group (18 October 2026): this copy ships two decks, the Core Deck V3.1 and
  // the Core Deck plus the Wildcard Group expansion. A ?deck= parameter in the URL (used by the landing
  // page and by the deck selector form) wins over the stored choice; unknown keys fall back to the Core Deck.
  async function loaddeck() {

  var urlDeck = new URLSearchParams(window.location.search).get("deck");
  if (urlDeck)
  {
    try { localStorage.setItem("deckKey", urlDeck); } catch(e) {}
  }
  try { selecteddeck = urlDeck || localStorage.getItem("deckKey"); } catch(e) { selecteddeck = urlDeck; }
  //if it is null, that means it is the first time that we are entering the website, so let's just set it to the core deck
  if (selecteddeck === null)
  {
    selecteddeck = 'CoreV3.1';
  }
      cardlist = undefined;
      if (selecteddeck == 'CoreV3.1'){
          cardlist = 'decks/CoreV3.1/carddb.json'
          }
      if (selecteddeck == 'WildcardGroup'){
          cardlist = 'decks/WildcardGroup/carddb.json'
          }
      if (cardlist === undefined)
      {
        console.log("deck '" + selecteddeck + "' is not part of this copy, loading CoreV3.1");
        selecteddeck = 'CoreV3.1';
        cardlist = 'decks/CoreV3.1/carddb.json';
      }
      // tick the loaded deck in the deck selector
      $("input[name='deck'][value='" + selecteddeck + "']").prop("checked", true);
      try{
        let result = $.getJSON(cardlist, function(h) {
          $(a).html("<img class='full' src='"+h.red+"'>");
          $(b).html("<img class='full' src='"+h.yellow+"'>");
          $(c).html("<img class='full' src='"+h.brown+"'>");
          $(d).html("<img class='full' src='"+h.purple+"'>");

          $(inita).html("<img src='"+h.red+"'>");
          $(initb).html("<img src='"+h.yellow+"'>");
          $(initc).html("<img src='"+h.brown+"'>");
          $(initd).html("<img src='"+h.purple+"'>");

          $(e).html("<img style='width:200px;' src='"+h.grey+"'>");

          //Update Consultant image
          $(f).html('<img style="width:200px;" src="' + h.green +'">');

          //update logo
          // Wildcard Group: attribution text added above the original logo links; the two BHIS logos
          // are stacked, the deck partner logo is as tall as the two together
          $(copyright).html("<p class='attr-text'>Backdoors &amp; Breaches is the property of <a target='_blank' href='https://www.blackhillsinfosec.com/'>Black Hills InfoSec</a>. Deck: " + h.title + ".</p><div class='attr-logos'><div class='attr-bhis'><a target='_blank' href='https://www.blackhillsinfosec.com/projects/backdoorsandbreaches' aria-label='Backdoors &amp; Breaches'><div id='bb'></div></a><a target='_blank' href='https://www.blackhillsinfosec.com/' aria-label='Black Hills Information Security'><div id='bh'></div></a></div><a class='attr-partner' target='_blank' href='"+h.link+"' aria-label='Deck partner'><div class='sponsor' style=' background-image: url("+h.logo+");'></div></a></div>");
    
          cardData = h; //set cardData to equal the JSON, so we simply reference memory rather than download again
        });
        await result;
      }
      catch(error)
      {
        console.log(error);
      }
            
        
  
  }

  async function initDeck()
  {
    await(loaddeck());
    initCardList();
    rando();
  }
  