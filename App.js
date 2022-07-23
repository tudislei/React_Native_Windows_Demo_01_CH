import React,{useState,useEffect,useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,TextInput ,Image,
  View,TouchableOpacity,
  useWindowDimensions
} from 'react-native';
import { flexColMid, flexColSpace, flexRowMid, flexRowSpace, flexRowWrap } from './styles';

import {allCardsInfo,allMonstersInfo,checkHighestNumbers,checkTags,
       countTrait, monsterNameIndex, sortAndGetPotentialDeck, tagTypeList}
       from './component/getCardAndMonsterInfo'
import {AllModules, dlcNameList} from './component/getModules'
import {requireMonsterIcons} from './component/getMonsterIcons'
import {requireModulesCover} from './component/getModules'
import { checkLootFairyLocation } from './component/checkLootFairyLocation';
import { getDateString } from './component/getDateString';
import { RenderCardContent } from './component/RenderCardContent';

const App = () => {

  const scrollRef = useRef(null);

  const [showPage, set_showPage] = useState('monsters');
  const [searchHP, set_searchHP] = useState('');
  const [searchName, set_searchName] = useState('');

  const [showDeckMode, set_showDeckMode] = useState('Detail');

  const [monsterList, set_monsterList] = useState([]);
  const [checkingMonster, set_checkingMonster] = useState(null)
  const [expandedCardIndexInList, set_expandedCardIndexInList] = useState(-1)
  const [showPotentialDeck, set_showPotentialDeck] = useState(true);

  const [showingModuleList, set_showingModuleList] = useState([...AllModules]);
  const [showingOneModule, set_showingOneModule] = useState(null)
  const [moduleOfLootFairy, set_moduleOfLootFairy] = useState(null)
  const [lootFairyRemainingTime, set_lootFairyRemainingTime] = useState(null)

  const windowHeight = useWindowDimensions().height
  const windowWidth = useWindowDimensions().width

  useEffect(()=>{
    if (showingOneModule){ 
      try{
        scrollRef.current.scrollTo({ y: 0, animated: true })
      }catch(err){ }
    }
  },[showingOneModule])  

  useEffect(()=>{
    set_searchHP(null)
    set_searchName(null)
  },[showPage])

  useEffect(()=>{
    if (showPage=='monsters'){
      if (searchHP || searchName){ 
        const newList = []
  
        //searching method one
        for (let i=0;i<allMonstersInfo.length;i++){
          let shouldShowBecauseOfHp = false , shouldShowBecauseOfName = false
          if (searchHP && allMonstersInfo[i].hp==searchHP){ shouldShowBecauseOfHp = true }
          if (searchName){
            const {name,nameInGame,editorName} = allMonstersInfo[i]
            function checkName(inString){
              inString = !inString ? '' : inString.toUpperCase()
              const value = String(searchName).toUpperCase()
              if (inString.indexOf(value)==0){ return true }
            }
            if (checkName(name) || checkName(nameInGame) || checkName(editorName) ){
              shouldShowBecauseOfName = true
            }
          }
          let shouldShow = false
          if (searchHP && searchName){
            shouldShow = shouldShowBecauseOfHp && shouldShowBecauseOfName
          } else {
            shouldShow = shouldShowBecauseOfHp || shouldShowBecauseOfName
          }
          if (shouldShow){ 
            newList.push( allMonstersInfo[i] )
          }
        }
  
        // if there are no result after filtering, then use searching method two
        if (newList.length==0 && searchName){
          for (let i=0;i<allMonstersInfo.length;i++){
            let shouldShowBecauseOfHp = false , shouldShowBecauseOfName = false
            if (searchHP && allMonstersInfo[i].hp==searchHP){ shouldShowBecauseOfHp = true }
            if (searchName){
              const {name,nameInGame,editorName} = allMonstersInfo[i]
              function checkName(inString){
                inString = !inString ? '' : inString.toUpperCase()
                const value = String(searchName).toUpperCase()
                if (inString.indexOf(value)>-1){ return true }
              }
              if (checkName(name) || checkName(nameInGame) || checkName(editorName) ){
                shouldShowBecauseOfName = true
              }
            }
            let shouldShow = false
            if (searchHP && searchName){
              shouldShow = shouldShowBecauseOfHp && shouldShowBecauseOfName
            } else {
              shouldShow = shouldShowBecauseOfHp || shouldShowBecauseOfName
            }
            if (shouldShow){ 
              newList.push( allMonstersInfo[i] )
            }
          }
        }
  
        set_monsterList(newList)
      } else {
        set_monsterList([])
      }
      set_checkingMonster(null)
      set_expandedCardIndexInList(null)
      set_showPotentialDeck(true)
    } else {
      const newList = []
      AllModules.map(item=>{
        const {moduleName,moduleLevel} = item
        let shouldShow = true
        if (searchHP && moduleLevel!=searchHP){ shouldShow = false }
        if (searchName && String(moduleName).toUpperCase().indexOf(searchName.toUpperCase())==-1 ){ shouldShow = false }
        if (shouldShow){ newList.push(item) }
      })
      set_showingModuleList(newList)
      set_showingOneModule(null)
    }
  },[searchHP,searchName])

  const hasFoundLF = moduleOfLootFairy && lootFairyRemainingTime && 
                     new Date() < new Date(lootFairyRemainingTime)

  const inputBoxStyle = {textAlign:'center',borderRadius:windowWidth/80,...flexRowSpace,
                        backgroundColor:'white'}

  const searchBarHeight = windowHeight*0.1
  const searchBar = <View style={{ height:searchBarHeight,border:'2px solid black',
                      ...flexRowSpace}}>  
                      <TextInput  
                        style={{width:windowWidth*0.4,...inputBoxStyle,fontSize:windowWidth**0.4,
                                color:'brown',fontWeight:"bold"}}
                        onChangeText={set_searchHP}
                        value={searchHP}
                        placeholder={ showPage == 'monsters' ? "HP of the monster" : 'Level of the module' }  
                      />
                      <TouchableOpacity onPress={()=>{
                        set_expandedCardIndexInList(null)
                        if (showPage!='monsters'){
                          if (checkingMonster){
                            set_checkingMonster(null)
                            return null
                          }
                          if (!showingOneModule){ 
                            set_showPage('monsters')
                            set_showingModuleList(AllModules) //back to default
                          } else {
                            set_showingOneModule(null)
                            return null
                          }
                        }
                        set_searchHP(null)
                        set_searchName(null)
                      }}>
                        <View style={{height:"100%"}}>
                          <Text style={{fontSize:windowWidth*0.022,color:'white'}}>
                             {showPage=='monsters'
                                  ? 
                                    searchHP || searchName 
                                     ? "Clear"
                                     : ""
                                  : 'Back'
                            }
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TextInput
                        style={{width:windowWidth*0.4,...inputBoxStyle,fontSize:windowWidth**0.4,
                                 color:'brown',fontWeight:"bold"}}
                        onChangeText={set_searchName}
                        value={searchName}
                        placeholder={ showPage == 'monsters' ? "Name of the monster" : 'Name of the module' }  
                      />
                  </View>

  const noResult = <View style={{height:windowHeight*0.15,...flexRowMid}}>
          <Text style={{fontSize:windowWidth/30,color:'rgb(50,100,150)',fontWeight:'500',textAlign:'center'}}>
              No result.
          </Text>
        </View>      

  const oneMonsterCard = (monsterInfo,key)=>{
      const fontSize = windowWidth**0.42
      const {name,nameInGame,hp,icon} = monsterInfo
      let iconImage = null
      if ( requireMonsterIcons[icon] ){
        try{
          iconImage = <Image
            style={{width:fontSize*1.9,height:fontSize*1.9,marginRight:fontSize,
                    marginVertical:fontSize*0.1}}
            source={ requireMonsterIcons[icon] }
          />
        }catch(err){
        } 
      } 
      
      const trimName = nameString=>{
        if (nameString && nameString.indexOf('<br />')>-1){
          nameString = nameString.split('<br />')
          nameString = nameString[nameString.length-1]
        }
        return <Text style={{textAlign:'center',fontSize}}>{nameString}</Text>
      }

      return <TouchableOpacity key={'monsterCard-'+key}
                  style={{width:windowWidth/3.5,
                          borderStyle:'solid',borderWidth:2,borderColor:'rgb(50,100,150)',
                          borderRadius:5,marginVertical:windowWidth/80,
                          backgroundColor:'white',cursor:'pointer'}}
                    onPress={()=> set_checkingMonster( sortAndGetPotentialDeck(monsterInfo) )}
                  >
              <View style={{...flexRowMid}}>
                {iconImage}
                <Text style={{textAlign:'center',fontWeight:'bold',color:'rgb(50,100,150)',fontSize}}>
                  {'HP : '+hp}
                </Text>
              </View>
              <View style={{marginVertical:3}}>
                {trimName(name)}
              </View>
              { nameInGame.indexOf(name)>-1 || name.indexOf(nameInGame)-1 ? null : 
                <View>
                  {trimName(nameInGame)}
                </View>
              }
      </TouchableOpacity>
  }

  const monsterListBlock = <ScrollView  
     style={{height:windowHeight-searchBarHeight-5,
            backgroundColor:'rgb(250, 245, 230)'}}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={flexRowWrap}
    >
      {
        monsterList.length == 0 
      ? 
        <View>

            {noResult}

            <View style={{height:windowHeight*0.55,...flexRowSpace,width:'90%',marginLeft:'5%'}}> 

               <TouchableOpacity onPress={ async()=>{
                      set_showPage('modules')
                      set_showingModuleList(AllModules)
                      if (hasFoundLF){ return null }
                      const {foundModule,remainingTime,error} = await checkLootFairyLocation(AllModules)
                      if (error){ return null }
                      set_lootFairyRemainingTime(remainingTime*1000 + new Date().valueOf() )
                      set_moduleOfLootFairy(foundModule)
                }}> 
                  <View style={{width:windowWidth*0.2,height:windowHeight*0.15,backgroundColor:'rgb(0,122,204)'
                                ,borderRadius:windowWidth*0.01
                                ,...flexRowSpace}}>
                    <Text style={{color:'white',textAlign:'center',fontSize:windowHeight*0.035}}>See Modules</Text>
                  </View>
               </TouchableOpacity>

               <TouchableOpacity onPress={()=>{
                            set_searchName('COC-')
                        }}>
                  <View style={{width:windowWidth*0.2,height:windowHeight*0.15,backgroundColor:'rgb(0,122,204)'
                                ,borderRadius:windowWidth*0.01
                                ,...flexRowSpace}}>
                    <Text style={{color:'white',textAlign:'center',fontSize:windowHeight*0.035}}>COC</Text>
                  </View>
               </TouchableOpacity>

               <TouchableOpacity onPress={()=>set_searchName('cards pool')}>
                  <View style={{width:windowWidth*0.2,height:windowHeight*0.15,backgroundColor:'rgb(0,122,204)'
                                ,borderRadius:windowWidth*0.01
                                ,...flexRowSpace}}>
                    <Text style={{color:'white',textAlign:'center',fontSize:windowHeight*0.033}}>Check Form pools</Text>
                  </View>
               </TouchableOpacity>

            </View>

            <View style={{height:windowHeight*0.25,...flexRowMid}}>
              <Text style={{fontSize:windowHeight/50,color:'black',textAlign:'center'}}>
                All the images in this software are copyrighted to <Text style={{color:'rgb(50,100,150)',fontWeight:'600'}}>The Knights of Unity</Text>.{"\n\n"}
                This software should not be put into any kind of commercial use.{"\n\n"}
                <Text style={{color:'gray',fontSize:10}}>2022-04-14 v1.0.0</Text>
              </Text>
            </View>

        </View>
      :
        monsterList.map((item,index)=>oneMonsterCard(item,index))
      }
  </ScrollView>

  let monsterInfoPage = null
  if (checkingMonster){

    const iconSize = windowHeight/10.5
    let oneCardBlockWidth = windowHeight*0.2 , oneCardBlockHeight = oneCardBlockWidth
    if (showDeckMode=='Thumbnail'){
      oneCardBlockWidth = windowHeight*0.1 , oneCardBlockHeight = oneCardBlockWidth * 37 / 62
    }

    const renderCardContent = (cardInfo,mode,indexInList) => {
       return <RenderCardContent {...{cardInfo,mode,indexInList,
                                      oneCardBlockWidth,oneCardBlockHeight,
                                      expandedCardIndexInList,showDeckMode}}/>   
    }
    

    let iconImage = null
    if ( requireMonsterIcons[checkingMonster.icon] ){
      try{
        iconImage = <Image
          style={{width:iconSize,height:iconSize,borderRadius:iconSize*0.05}}
          source={ requireMonsterIcons[checkingMonster.icon] }
        />
      }catch(err){
      } 
    } 
    const {decks,potentialDeck} = checkingMonster
    const fullDecks = [...decks,...potentialDeck]
    const tagsArray = checkTags(fullDecks), 
          traitCount = countTrait(decks),
          {highestAttack , highestRange , highestRangeString} = checkHighestNumbers(fullDecks)

    const oneCardBlockStyle = {width:oneCardBlockWidth,height:oneCardBlockHeight,
                              backgroundColor:'white',
                              borderRadius:oneCardBlockHeight*0.045,
                              ...flexColMid,marginBottom:5}

    const renderOneCardBlock = (cardId,type,index) => {
      const cardData = allCardsInfo[cardId]
      if (!cardData){ return null}
      const cardBlockKey = 'deck-'+type+'-'+index
      const isExpanded = cardBlockKey == expandedCardIndexInList 
      return <TouchableOpacity key={cardBlockKey}
               onPress={()=>{
                 if (String(cardData.FIELD18 + cardData.FIELD21 + cardData.FIELD25).length<80 && showDeckMode=='Detail' ){
                   //Not a long text , no need to expand on click
                   set_expandedCardIndexInList(null)
                   return null
                 }
                 set_expandedCardIndexInList(isExpanded ? null : cardBlockKey)
               }}>                    
              <View style={{...oneCardBlockStyle,
                            width: isExpanded
                                ? showDeckMode=='Thumbnail' 
                                    ? oneCardBlockWidth*4 
                                    : oneCardBlockWidth*2
                                : oneCardBlockWidth ,
                            height: isExpanded && showDeckMode=='Thumbnail'
                                   ? oneCardBlockWidth*2
                                   : oneCardBlockHeight}}>
                  {renderCardContent(cardData,type,index)}
              </View>
       </TouchableOpacity>
    }

    monsterInfoPage = <View>

          <View style={{width:'100%',...flexRowMid}}>
            <TouchableOpacity
                  onPress={()=>set_showDeckMode( showDeckMode == 'Detail' ? 'Thumbnail' : 'Detail' )}
                  style={{backgroundColor: "rgb(204,122,0)",
                          height:windowHeight*0.06,width:'20%',
                          ...flexRowMid}}>
                <Text style={{color:'white',fontWeight:'500',fontSize:windowHeight*0.028}}>
                    {showDeckMode}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                  onPress={()=>{  
                    set_checkingMonster(null)
                    set_expandedCardIndexInList(null)
                  }}
                  style={{backgroundColor: "rgb(0,122,204)",
                          height:windowHeight*0.06,width:'80%',
                          ...flexRowMid}}>
                <Text style={{color:'rgb(220,220,220)',fontWeight:'500',fontSize:windowHeight*0.028}}>
                    {'Back from : '+checkingMonster.editorName}
                </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{height:windowHeight-searchBarHeight-windowHeight*0.06-5,
                      backgroundColor:'rgb(250, 245, 230)'}}
                  contentInsetAdjustmentBehavior="automatic"
                  contentContainerStyle={{
                    //display:'flex',flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap'
                  }}>

              <View id='top' style={{marginVertical:windowHeight*0.01,...flexRowSpace,}}>
                  <View style={{width:iconSize*2,height:'100%',...flexRowMid}}>
                     {iconImage}
                  </View>
                  <View style={{width:windowWidth*0.3,...flexColSpace}}>
                    <Text style={{fontSize:windowWidth**0.43,color:'rgb(50,100,150)',fontWeight:'600'}}>
                        HP : {checkingMonster.hp}
                    </Text>
                    <Text style={{fontSize:windowWidth**0.43,color:'rgb(254,80,0)',fontWeight:'600'}}>
                        Stars : {checkingMonster.vpWorth}
                    </Text>
                  </View>
                  <View style={{width:(windowWidth-iconSize*2-windowWidth*0.3),...flexRowWrap,height:'100%'}}>
                     {tagsArray.map((item,index)=>{
                       let backgroundColor = 'white' , color = 'black'
                       if (tagTypeList[item]=='Attack'){ backgroundColor = 'rgba(255,0,0,0.1)' }
                       if (tagTypeList[item]=='SUPER'){ backgroundColor = 'rgb(102, 5, 247)'; color = 'white' }
                       return <View key={"tag-"+index}
                                    style={{minWidth:windowHeight*0.1,...flexRowMid,
                                            borderRadius:windowHeight*0.01,
                                            paddingHorizontal:windowHeight*0.006,
                                            margin:windowHeight*0.008,
                                            backgroundColor
                                            }}>
                              <Text style={{fontSize:windowHeight*0.025,fontWeight:'600',color}}> {item} </Text>
                         </View>
                     })}
                  </View>
              </View>

              <View id='sepLine1'
                    style={{...flexRowMid,borderStyle:'solid',borderColor:'white',
                             borderWidth:0,borderTopWidth:2
                            }}/>


              <View id='deckSummary' style={{marginVertical:windowHeight*0.01,...flexRowSpace,}}>
                <View style={{...flexColSpace}}>
                    <Text style={{color:'rgb(50,100,150)',fontWeight:'600'}}>
                      Draw{" = "+checkingMonster.drawPerROund}
                    </Text>
                     { !traitCount 
                      ? 
                        <Text style={{color:'black',fontWeight:'700'}}>
                          <Text style={{fontWeight:'100'}}>{" in "}</Text>{decks.length}
                        </Text>
                      : 
                        <View style={{...flexRowMid}}>
                          <Text style={{color:'black',fontWeight:'700'}}>
                            <Text style={{fontWeight:'100'}}>{" in "}</Text>{(decks.length - traitCount)}
                          </Text>
                          <Text style={{color:'rgba(0,0,0,0.3)',fontWeight:'700'}}>
                            {' + ' + traitCount}
                          </Text>
                        </View>
                      }
                </View>
                <View style={{...flexColSpace}}>
                    <Text style={{color:'rgb(50,100,150)',fontWeight:'600'}}>Max.Attack</Text>
                    <Text style={{color:'rgb(220,10,10)',fontWeight:'700'}}>{highestAttack}</Text>
                </View>
                <View style={{...flexColSpace}}>
                    <Text style={{color:'rgb(50,100,150)',fontWeight:'600'}}>Range</Text>
                    {highestRange == 999 ? <Text style={{color:'rgb(0,0,200)',fontWeight:'700'}}>??</Text> :
                        !highestRangeString[1] 
                        ? <Text style={{color:'rgb(0,0,200)',fontWeight:'700'}}>{highestRangeString[0]}</Text>
                        : <View style={flexRowMid}>
                            <Text style={{color:'rgb(0,0,200)',fontWeight:'700'}}>{highestRangeString[0]}</Text>
                            <Text style={{color:'rgb(200,0,200)',fontWeight:'700'}}>{' + '+highestRangeString[1]}</Text>
                          </View>
                    }
                </View>
                <View style={{...flexColSpace}}>
                    <Text style={{color:'rgb(50,100,150)',fontWeight:'600'}}>Default</Text>
                    {renderCardContent(allCardsInfo[checkingMonster.defaultMove],'move',-1)}
                </View>
              </View>


              <View id='deckList' style={flexRowWrap}>
                  {decks.map( (cardId,indexInList) => renderOneCardBlock(cardId,'normal',indexInList) )}
                  {potentialDeck.length == 0 ? null :
                   <TouchableOpacity onPress={()=> set_showPotentialDeck( !showPotentialDeck ) }>
                    <View style={{...oneCardBlockStyle,backgroundColor:'rgba(0,255,0,0.1)'}}>
                      {showDeckMode=='Thumbnail'
                        ?
                          <View>
                            <Text style={{color:"rgb(20,70,20)"}}>{"⮞➤⮞"}</Text>
                          </View>
                        :
                          <>
                            <View>
                              <Text style={{color:"rgb(20,70,20)"}}>Created Cards</Text>
                            </View>
                            <View>
                              <Text style={{color:"rgb(20,70,20)"}}>{"\n⮞➤⮞➤⮞\n"}</Text>
                            </View>
                            <View>
                              <Text style={{color:"rgb(20,70,20)",fontWeight:'bold'}}>Click to {showPotentialDeck ? 'Hide' : 'Show'} </Text>
                            </View>
                          </>
                      }
                    </View>
                   </TouchableOpacity>
                  }
                  { !showPotentialDeck ? null : 
                      potentialDeck.map( (cardId,indexInList) => renderOneCardBlock(cardId,'potentialDeck',indexInList) )
                  }
              </View>

          </ScrollView>
      </View>

  } 

  let showContent = checkingMonster ? monsterInfoPage : monsterListBlock
  
  if (showPage=='modules' && !checkingMonster ){

    const oneModuleCard = moduleInfo => {
      const {moduleName,moduleLevel,moduleDLC} = moduleInfo
      const isThisLF = hasFoundLF && moduleOfLootFairy.moduleName == moduleName
      return <TouchableOpacity key={"module-"+moduleName}
                               onPress={()=>{
                                  set_showingOneModule( showingOneModule && showingOneModule.moduleName == moduleName 
                                                          ? null : moduleInfo)
                                }}>
        <View style={{height:windowHeight*0.07,width:windowWidth*0.45,margin:windowHeight*0.01,
                            backgroundColor: isThisLF ? 'yellow' : 'white',
                            ...flexRowSpace,borderStyle:'solid',borderColor:'black',
                            borderWidth:1.5}}>
          <View style={{height:'100%',width:'80%',...flexRowMid}}>
            <Text>
              {moduleName}
            </Text>
          </View>
          <View style={{height:'100%',width:'10%',...flexRowMid,
                        borderStyle:'solid',borderColor:'black',borderWidth:0,borderLeftWidth:1.5}}>
            <Text style={{fontWeight:'500',fontSize:windowWidth*0.015}}>
              {moduleLevel}
            </Text>
          </View>
          <View style={{height:'100%',width:'10%',...flexRowMid,
                        borderStyle:'solid',borderColor:'black',borderWidth:0,borderLeftWidth:1.5}}>
            <Text style={{fontSize:windowWidth*0.02}}>
              {!moduleDLC ? null : dlcNameList[moduleDLC]}
            </Text>
          </View>
      </View>
      </TouchableOpacity>
    } 
    const oneStageOfModule = (monsterList,coverImgName,index) => {
       coverImgName = coverImgName+'__'+index+'.jpg'
       let coverImage = null
       try{
        coverImage = <Image
            style={{height:windowHeight*0.5,marginVertical:windowHeight*0.02}}
            resizeMode="contain"
            source={ requireModulesCover[coverImgName.split(" ").join("_")] }
          />
       }catch(err){
        //console.error(err)
       }
       const monsterArray = []
       monsterList.map(item=>{
         for (let i=0;i<item[1];i++){
           const monsterIndex = monsterNameIndex[item[0]]
           if (!monsterIndex){ return null }
           monsterArray.push( allMonstersInfo[monsterIndex] )
         } 
       })

       return <View key={'stage-'+index} style={{width:'100%'}}>

            <View style={flexColMid}>
              {coverImage}
            </View>

            <Text style={{textAlign:'center',fontSize:windowHeight*0.025,fontWeight:'600',color:'gray'}}>
               Stage {index}
            </Text>

            <View style={{...flexRowWrap}}>
                { monsterArray.map((item,indexInStage)=>oneMonsterCard(item,index+'-'+indexInStage)) }
            </View>

            <View id='sepLine'
                  style={{
                          backgroundColor:'gray',
                          height:2,width:'100%',marginTop:windowHeight*0.01
                        }}/>
         </View>
    } 

    let moduleContent = null
    if (showingOneModule){
      const {moduleName,moduleStages} = showingOneModule
      moduleContent = <>
          <View style={{width:'100%',...flexRowMid}}>
            {oneModuleCard(showingOneModule)}
          </View>
          {moduleStages.map(({monsterList},index)=>oneStageOfModule(monsterList,moduleName,(index+1)))}
       </>
    } else { //list
        const lootFairyBar = !hasFoundLF ? null : 
         <TouchableOpacity onPress={()=>set_showingOneModule(moduleOfLootFairy)}>
            <View style={{width:'100%',height:windowHeight*0.08,...flexRowSpace,backgroundColor:'rgb(0,122,204)'}}>
              <Text style={{fontSize:Math.min(windowWidth*0.027,windowHeight*0.025),color:'white'}}>
                    LF :
                    {" "+moduleOfLootFairy.moduleName+" ("+moduleOfLootFairy.moduleLevel+")"}
                    {!moduleOfLootFairy.moduleDLC ? null : ", "+dlcNameList[moduleOfLootFairy.moduleDLC]}
                    {", until "+getDateString(lootFairyRemainingTime)}
              </Text>
            </View>
          </TouchableOpacity>

        moduleContent = showingModuleList.length==0 ? noResult : 
           <View style={{width:'100%',...flexRowWrap}}>
              {lootFairyBar}
              {showingModuleList.map(item=>oneModuleCard(item))}
           </View>
                          
    }

    const modulePage = <ScrollView ref={scrollRef}
      style={{height:windowHeight-searchBarHeight-5,
              backgroundColor:'rgb(250, 245, 230)'}}
        contentInsetAdjustmentBehavior="automatic"
        //contentContainerStyle={flexRowWrap}
      >
          {moduleContent}

      </ScrollView>

    showContent = modulePage
  }
   
  return <SafeAreaView style={{backgroundColor: 'gray'}}>            
            {searchBar}
            {showContent}
        </SafeAreaView>
};

export default App;
