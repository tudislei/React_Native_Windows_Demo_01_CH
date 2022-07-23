const cardsInfoFromCSV = require('../assets/cards.json')
const allMonstersInfo1 = require('../assets/monsters.json')
const cocCharacterDecks = require('../assets/CoCCharacters.json')
const allMonstersInfo = [...allMonstersInfo1,...cocCharacterDecks]

const allCardsInfo = {}, cardNameToID = {},
      specialKeywordDeck = [
        {keywordInText:String('Create a random <u>Radioactive</u>').toUpperCase(),
            keywordInParams:'radioactive',cardPool:{} },
        {keywordInText:String('Create a random Spirit card').toUpperCase(),
            keywordInParams:'spirit',cardPool:{} },
        {keywordInText:String('Create a random Werewolf card').toUpperCase(),
            keywordInParams:'werewolf',cardPool:{} },
        {keywordInText:String('Create a random Vampire card').toUpperCase(),
            keywordInParams:'vampire',cardPool:{} },
        {keywordInText:String('Create a random Zombie card').toUpperCase(),
            keywordInParams:'zombie',cardPool:{} },
        {keywordInText:String('Create a random Sculptor card').toUpperCase(),
            keywordInParams:'sculptor',cardPool:{} },
        {keywordInText:String('Create a random Pirate card').toUpperCase(),
            keywordInParams:'pirate',cardPool:{} },
        {keywordInText:String('Create a random Pixie card').toUpperCase(),
            keywordInParams:'pixie',cardPool:{} },
      ];

cardsInfoFromCSV.map(item=>{
    const replaceKeyWordList = [
        ["For each point of damage this Attack does, <u>Heal ","<u>Vampire "]
    ];
    for (let i=0;i<replaceKeyWordList.length;i++){
        [18,21,25].map(index=>{
            item['FIELD'+index] = item['FIELD'+index].replace(replaceKeyWordList[i][0],replaceKeyWordList[i][1])
        })
    }
    const cardId = item['24']
    const cardName = item['FIELD2']
    const params = item['FIELD39']
    allCardsInfo[cardId] = item
    cardNameToID[ cardName ] = cardId
    cardNameToID[ cardName.toUpperCase() ] = cardId
    if (params){
        for (let k=0;k<specialKeywordDeck.length;k++){
            if (params.indexOf( specialKeywordDeck[k]['keywordInParams'] )>-1){
                specialKeywordDeck[k]['cardPool'][ cardId ] =1 
            }
        }
    }
})

const checkTagList = [
    {tag:'Punish',type:'Attack',keywords:["for each card in target's hand."],filters:[]},
    {tag:'Ally+Attack',type:'Attack',keywords:['for every ally within'],filters:[]},
    {tag:'Spawn',keywords:['Spawn a','<u>Spawn</u>'],filters:[]},
    {tag:'Vulnerable',keywords:[' damage, add '],filters:['Attach to target.']},
    {tag:'Vampire',type:'Attack',keywords:['For each point of damage this attack does, <u>Heal '],filters:[]},
    {tag:'Heal',keywords:['Heal ','heals ','Heals '],filters:['For each point of damage this attack does, <u>Heal ']},
    {tag:'Push allies',keywords:['other allies.','Other allies Move','<u>Push 2</u> every character adjacent to you at the start of this Move. <u>Unblockable</u>.'],filters:['Heal']},
    {tag:'Cantrip',keywords:['<u>Cantrip</u>'],filters:[]},
    {tag:'Free Action',keywords:['<u>Free Action</u>'],filters:[]},
    {tag:'Encumber',keywords:['<u>Encumber'],filters:['<u>Encumber 1</u>. <u>Keep</u>.','<u>Encumber 1</u>. <u>Saving Roll</u>. <u>Keep</u>.']},
    {tag:'+Terrain',keywords:[' become'],filters:[]},
    {tag:'Slide',keywords:['<u>Slide '],filters:[]},    
    {tag:'Instant-Kill',type:'Attack',keywords:['At the start of each round, if this card expires this round, kill the target.'],filters:[]},
    {tag:'Multi-target',type:'Attack',keywords:['Choose up'],filters:[]},
    {tag:'Behind-Attack',type:'Attack',keywords:['if you are behind'],filters:[]},
    {tag:'Poison',type:'Attack',keywords:['<u>Poison '],filters:[]},
    {tag:'Stun',type:'Attack',keywords:['<u>Stun</u>'],filters:[]},
    {tag:'Injury',type:'Attack',keywords:['Attach to target. Target may not gain health.'],filters:[]},    
    {tag:'Penetrate',type:'Attack',keywords:['<u>Penetrating</u>'],filters:[]},
    {tag:'Step Attack',type:'Attack',keywords:['<u>Step '],filters:[]},
    {tag:'Discard',type:'Attack',keywords:['Target discards','discards all','Discard all armor'],filters:[]},
    {tag:'Immunity',keywords:['<u>Immunity</u>'],filters:[]},
    {tag:'Invisible',keywords:['may not be target'],filters:[]},
    {tag:'Heavy Armor',keywords:['<u>Armor 3</u>','<u>Armor 4</u>','<u>Armor 5</u>','<u>Armor 6</u>','<u>Armor 7</u>','<u>Armor 8</u>','<u>Armor 9</u>'],filters:[]},
    {tag:'Dash Damage',keywords:['for every square moved'],filters:[]},
    {tag:'Teleport',keywords:['<u>Teleport</u>'],filters:[]},
    {tag:'Block any',keywords:['<u>Block any</u>'],filters:[]},
    {tag:'Block Melee',keywords:['<u>Block Melee</u>'],filters:[]},
    {tag:'Block Magic',keywords:['<u>Block Magic</u>'],filters:[]},
    {tag:'Cone',keywords:['<u>Cone</u>'],filters:[]},

    //providing type only
    {tag:'Heavy Attack',type:'Attack'}, 
    {tag:'AAA',type:'SUPER'}, 
]

const tagTypeList = {}
checkTagList.map(item=>{ tagTypeList[item.tag] = item.type })

function checkTags(decks){
    let tags = {}
    for (let i=0;i<decks.length;i++){
        const cardInfo = allCardsInfo[ decks[i] ]
        if (!cardInfo){ continue }
        if (cardInfo.FIELD41 == 'AAA' ){ tags['AAA'] = 0 }
        if (cardInfo.FIELD7 && parseInt(cardInfo.FIELD7)>=10){ tags['Heavy Attack'] = 0 }
        checkTagList.map(({tag,keywords,filters},checkListIndex)=>{
            [18,21,25].map(index=>{
                if (!keywords){ return null }
                const string = cardInfo['FIELD'+index]
                if (!string){ return null }
                let hasKeyword = false
                keywords.map(keyword=>{ 
                    if (string.indexOf(keyword)>-1){ hasKeyword = true }; return null
                })
                if (!hasKeyword){ return null }
                let hasFilter = false
                filters.map(filter=>{ 
                    if (string.indexOf(filter)>-1){ hasFilter = true }; return null
                })
                if (!hasFilter){ tags[tag] = checkListIndex }
                return null
            }) 
            return null
        })
    }
    const answer = Object.keys(tags)
    answer.sort((a,b)=> tags[a] < tags[b] ? -1 : 1 )
    return answer
}

function countTrait(decks){
    let traitCount = 0
    decks.map(cardId=>{
        const cardInfo = allCardsInfo[cardId]
        if (!cardInfo){ return null }
        if ( cardInfo.FIELD18 && cardInfo.FIELD18.indexOf('<u>Trait</u>')>-1 ){
          traitCount++
        }
    })
    return traitCount
}

function checkHighestNumbers(decks){
    let highestAttack = 0 , highestRange = 0 , highestRangeString = []
    decks.map(cardId=>{
      try{
        const cardInfo = allCardsInfo[cardId]
        if (!cardInfo){ return null }
        
        const attackPoint = cardInfo.FIELD7
        if (attackPoint && parseInt(attackPoint)>highestAttack ){
          highestAttack = parseInt(attackPoint)
        }
        if (attackPoint){
            const pureRangePoint = cardInfo.FIELD9 || 999
            let otherValue = 0
            if (pureRangePoint!=999){
              if (cardInfo.FIELD18 && cardInfo.FIELD18.indexOf('<u>Burst ')>-1){
                otherValue = parseInt(otherValue) + parseInt(cardInfo.FIELD18.split('<u>Burst ')[1].split('</u>')[0])
              }
              if (cardInfo.FIELD18 && cardInfo.FIELD18.indexOf('<u>Step ')>-1){
                otherValue = parseInt(otherValue) + parseInt(cardInfo.FIELD18.split('<u>Step ')[1].split('</u>')[0])
              }
            }
            const rangePoint = parseInt(pureRangePoint) + parseInt(otherValue)
            if (rangePoint && parseInt(rangePoint)>highestRange){
              highestRange = parseInt(rangePoint)
              highestRangeString = [pureRangePoint,otherValue]
            }
        }
      }catch(err){

      }
    })
    return {highestAttack , highestRange , highestRangeString}
}   

function sortAndGetPotentialDeck(cardInfo){
    console.log(JSON.stringify(cardInfo))
    const {decks,defaultMove} = cardInfo

    if (decks && decks.length>0){

          //sorting according to the card types
          const cardTypeList = {
              'Attack':20,
              'Utility':30,
              'Block':40,
              'Armor':50,
              'Assist':60,
              'Hybrid':65,
              'Move':70,
              'Boost':80,
              'Handicap':90
          }

          decks.sort((a,b)=>{
            const InfoA = allCardsInfo[a]
            const InfoB = allCardsInfo[b]
            if (!InfoA || !InfoB){ return -1 }
            let typeA = cardTypeList[InfoA.FIELD4]
                ? cardTypeList[InfoA.FIELD4]
                : InfoA.FIELD4.indexOf('Attack')>-1
                  ? cardTypeList['Attack']
                  : cardTypeList['Hybrid']                                     
            let typeB = cardTypeList[InfoB.FIELD4]
                ? cardTypeList[InfoB.FIELD4]
                : InfoB.FIELD4.indexOf('Attack')>-1
                  ? cardTypeList['Attack']
                  : cardTypeList['Hybrid']        
            if (typeA>typeB){
                return 1
            } else if (typeA<typeB){
                return -1
            } else {
                if (InfoA.FIELD4.indexOf('Attack')>-1){ //if are attack cards , sort base on Attack point
                  const attackA = InfoA.FIELD7 || 0
                  const attackB = InfoB.FIELD7 || 0
                  return parseInt(attackA) < parseInt(attackB) ? 1 : -1
                } else {
                  const qualityList = {
                      "AAA":1,
                      "AA":2,
                      "A":3,
                      "B":4,
                      "C":5,
                      "D":6,
                      "E":7
                  }  
                  return qualityList[InfoA.FIELD41] < qualityList[InfoB.FIELD41] ? -1 : 1
                }
              }
          })

          cardInfo.decks = decks
          //sorting according to the card types

          //identify those "Created" cards which are not in the deck list
          let potentialDeck = {}
          const fullDeck = defaultMove ? [ defaultMove,...decks ] : decks
          for (let i=0;i<fullDeck.length;i++){
            const cardInfo = allCardsInfo[fullDeck[i]]
            if (!cardInfo){ continue }
            if (cardInfo.FIELD2 == 'Adaptable'){ continue } //conflicts with the rules
            if (cardInfo.FIELD2 == 'Walpurgis Night'){
                potentialDeck[848] = 1
                potentialDeck[849] = 1
                potentialDeck[850] = 1
                potentialDeck[851] = 1
                continue
            }
            [18,21,25].map(index=>{
              let cardText = cardInfo['FIELD'+index]
              if (!cardText){ return null }
              cardText = cardText.toUpperCase()
              if (cardText.indexOf("CREATE A ")==-1){ return null}
              if (cardText.indexOf("RANDOM")==-1){ //case 1 , a specific card

                cardText.split("CREATE A ").map((newCardText,createCardIndex)=>{
                    if (createCardIndex==0){ return null }                    
                    if (newCardText.indexOf(' CARD ')>-1){
                        newCardText = newCardText.split(" CARD ")[0]
                    } else {            
                        if (newCardText.indexOf(' CARD.')>-1){
                            newCardText = newCardText.split(" CARD.")[0]
                        } else {
                            newCardText = newCardText.split(" CARD<")[0]
                        }
                    }
                    newCardText = newCardText.toUpperCase().trim()
                    if (cardNameToID[ newCardText ]){
                        potentialDeck[ cardNameToID[newCardText] ] = true
                    } else {
                        console.error(' what is this potential card : ',newCardText)
                    }
                })      

              } else { //case 2 , from a pool
                for (let k=0;k<specialKeywordDeck.length;k++){
                    if (cardText.indexOf( specialKeywordDeck[k]['keywordInText'] )>-1){
                        potentialDeck = {...potentialDeck,...specialKeywordDeck[k]['cardPool']}
                    }
                }
              }

              return null
            })
          }
          potentialDeck = Object.keys(potentialDeck)
          cardInfo.potentialDeck = potentialDeck
          //identify those "Created" cards which are not in the deck list

    }

    return cardInfo
}

const monsterNameIndex = {}
allMonstersInfo.map((item,index)=>monsterNameIndex[item.name] = index)

export {allCardsInfo,allMonstersInfo,monsterNameIndex,
        checkTags,countTrait,checkHighestNumbers,
        tagTypeList,sortAndGetPotentialDeck}