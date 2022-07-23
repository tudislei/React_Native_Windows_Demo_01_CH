import React from 'react';
import { Text, View, Image } from 'react-native';
import { flexRowMid, flexRowSpace } from '../styles';
import { requireCardThumbnails } from './getCardThumbnails';

export const RenderCardContent = props => {

        let {cardInfo,mode,indexInList,expandedCardIndexInList,
              oneCardBlockWidth,oneCardBlockHeight, //might change later , base on isExpanded
              showDeckMode} = props

        if (!cardInfo){ return null}
        
        const isExpanded = 'deck-'+mode+'-'+indexInList == expandedCardIndexInList 
        const cardName = cardInfo.FIELD2
        
        let cardType = cardInfo.FIELD4
  
        const cardTypeList = {
            'Hybrid':'purple',
            'Utility':'rgb(119,82,137)',
            'Attack':'rgb(255,0,0)',
            'Block':'rgb(0,128,0)',
            'Armor':'rgb(128,128,128)',
            'Assist':'rgb(199,214,219)',
            'Move':'rgb(0,0,255)',
            'Boost':'rgb(255,165,0)',
            'Handicap':'rgb(0,0,0)'
        }
        const cardTypeListForThumbnail = {
            'Hybrid':'purple',
            'Utility':'rgb(119,82,137)',
            'Attack':'rgb(121,42,41)',
            'Block':'rgb(99,146,74)',
            'Armor':'rgb(138,148,152)',
            'Assist':'rgb(199,214,219)',
            'Move':'rgb(39,84,136)',
            'Boost':'rgb(209,110,23)',
            'Handicap':'rgb(39,39,39)'
        }
  
        let basicValues = [null,null,null,null,null]
        if (cardInfo.FIELD7){ basicValues[0] = cardInfo.FIELD7 }
  
        if (cardInfo.FIELD9){ 
          basicValues[1] = cardInfo.FIELD9
        }
        if (cardType.indexOf("Attack")>-1){
          basicValues[1] = basicValues[1] || '??'
          const minRange = cardInfo.FIELD8
          if (minRange){
            basicValues[1] = minRange + '/' + basicValues[1]
          }
        }
  
        let isTrigger1ArmorValue , isTrigger2ArmorValue , hasBlockCardRollValue = false
        if (cardInfo.FIELD21 && cardInfo.FIELD21.indexOf('<u>Armor ')>-1){
          const armorValue = cardInfo.FIELD21.split('<u>Armor ')[1].split('</u>')[0]
          const armorTrigger = cardInfo.FIELD12
          isTrigger1ArmorValue = true
          basicValues[2] = !armorTrigger || armorTrigger==0 ? armorValue : armorTrigger+'/'+armorValue
        } else if (cardInfo.FIELD25 && cardInfo.FIELD25.indexOf('<u>Armor ')>-1){
          const armorValue = cardInfo.FIELD25.split('<u>Armor ')[1].split('</u>')[0]
          const armorTrigger = cardInfo.FIELD15
          isTrigger2ArmorValue = true
          basicValues[2] = !armorTrigger || armorTrigger==0 ? armorValue : armorTrigger+'/'+armorValue
        }
  
        if (cardInfo.FIELD4 && cardInfo.FIELD4.indexOf('Block')>-1 && cardInfo.FIELD12){
          hasBlockCardRollValue = true
          basicValues[3] = cardInfo.FIELD12
        }
  
        if (cardType.indexOf("Move")>-1){ basicValues[4] = cardInfo.FIELD10 || 0 }
  
        const renderCardText = () => {
            const textPart1 = !cardInfo.FIELD12 || cardInfo.FIELD12==0 || isTrigger1ArmorValue || hasBlockCardRollValue
                          ? cardInfo.FIELD21
                          : `<u>(Roll ${('+'+cardInfo.FIELD12).replace("+-","-")}</u>)${cardInfo.FIELD21}`
            const textPart2 = !cardInfo.FIELD15 || cardInfo.FIELD15==0 || isTrigger2ArmorValue || hasBlockCardRollValue
                          ? cardInfo.FIELD25
                          : `<u>(Roll ${('+'+cardInfo.FIELD15).replace("+-","-")}</u>)${cardInfo.FIELD25}`
            let textString = cardInfo.FIELD18 + textPart1 + textPart2
            const key = indexInList+'-Text-'
            textString = textString.split('<br />').join(' ').split('<br>').join(' ')
            const textParts = []
            let index = 0 , currentString = ''
            while ( textString!='' ){
                if (textString.indexOf('<u>')==0 && textString.indexOf('</u>')>-1){
                  if (currentString){
                    textParts.push([0,currentString])
                    currentString = ''
                  }
                  index = textString.indexOf('</u>') + 4
                  textParts.push([1, textString.slice(0,index).replace("</u>","").replace("<u>","")  ])
                  textString = textString.slice( index,textString.length )
                } else {
                  currentString += textString[0]
                  textString = textString.slice( 1,textString.length )
                }
            }
            if (currentString){
                textParts.push([0,currentString])
                currentString = ''
            }
            const answer = []
            for (let i=0;i<textParts.length;i++){
              answer.push(
                <Text key={key+i} style={ textParts[i][0]==0 ? {} : {
                  fontWeight:'bold',color:'rgb(30,30,150)'
                } }>
                    {textParts[i][1]}
                </Text>
              )
            }
            return answer
        }
        let specialBorder1 = <View style={{
                                  position:'absolute',
                                  backgroundColor:cardTypeList[cardType],
                                  height:3,width:'100%',marginTop:'98.1%'
                                }}/>
        //if there are multiple types, add different borders to the card block
        let specialBorder2 = null,
            specialBackground = null
        if (cardType.indexOf(",")>-1){
          const cardTypes = cardType.split(",")
          cardTypes.sort((a,b)=> b=='Attack' ? 1 : -1 )        
          for (let i=0;i<cardTypes.length;i++){
            if (i>1){ break ; }
            if (i==0){
              cardType = cardTypes[i]
              specialBorder1 = <View style={{
                                  position:'absolute',
                                  backgroundColor:cardTypeList[cardTypes[i]],
                                  height:3,width:'48%',marginTop:'98.1%'
                                }}/>
            } else {
              specialBorder2 = <View style={{
                position:'absolute',
                backgroundColor:cardTypeList[cardTypes[i]],
                height:3,width:'48%',marginLeft:'52%',marginTop:'98.1%'
              }}/>
              specialBackground = <View style={{
                position:'absolute',
                backgroundColor:cardTypeListForThumbnail[cardTypes[i]],
                height:'222%',width:'100%',marginLeft:'33%',transform: [{ rotate: '60deg' }]
              }}/>
            }
          }
        }
  
        const cardQuality = cardInfo['FIELD41']
        const cardQualityColor = {
            "AAA":'rgb(209,111,240)', //purple
            "AA":'rgb(225,223,175)', //gold
            "A":'rgb(227,237,237)', //silver
            "B":'white',//'rgb(224,210,200)',
            "C":'white',//'rgb(173,161,129)',
            "E":'white'
        }
        
        if (showDeckMode == 'Thumbnail'){
            if (!isExpanded){
                let cardThumbnail = null
                const thumbnailWidth = oneCardBlockWidth,
                      thumbnailHeight = oneCardBlockHeight,
                     // thumbnailName = cardName.split(" ").join("_")+'.png'
                      thumbnailName = cardName.split(" ").join("_")+'.png'
                try{
                    cardThumbnail = <Image
                    style={{width:thumbnailWidth,height:thumbnailHeight}}
                    source={ requireCardThumbnails[ thumbnailName ] }
                  />
                }catch(err){
                }
                return <View style={{width:thumbnailWidth,height:thumbnailHeight,
                                    backgroundColor: cardTypeListForThumbnail[cardType], // 'black',
                                    }}>
                    {specialBackground}
                    {cardThumbnail}
                </View>
            } else {
              oneCardBlockWidth = oneCardBlockWidth*2 , oneCardBlockHeight = oneCardBlockWidth
            }
        }

        return mode == 'move' //default move 
          ? <Text style={{textAlign:'center',fontSize:oneCardBlockHeight*0.1,
                          backgroundColor:cardQualityColor[cardQuality]}}>
                    {`${cardName} (${basicValues[4] || 0 })`}
            </Text>
          : //else
            <View style={{width:'98%', height:'98%',
                          backgroundColor: mode=='potentialDeck' ? 'rgba(0,0,255,0.03)' : 'white',
                          }}>
                
                {specialBorder1}
                {specialBorder2}
  
                <View style={{width:'100%',height:oneCardBlockHeight*0.15,...flexRowMid}}>
                  <Text style={{textAlign:'center',fontSize:oneCardBlockHeight*0.09,
                                fontWeight:'600',color:'rgb(50,100,150)',
                                borderStyle:'solid',borderWidth:0,borderBottomWidth:2,
                                borderColor:cardQualityColor[cardQuality]}}>
                    {cardName}
                  </Text>
                </View>
  
                <View id='basicValuesRow'
                      style={{width:'100%',height:oneCardBlockHeight*0.18,
                              ...isExpanded ? flexRowMid : flexRowSpace}}>
                      {basicValues.map((item,index)=>{
                        const colorList = [
                          'rgb(220,0,0)',
                          'rgb(0,0,200)',
                          'gray',
                          'green',
                          'blue'
                        ]
                        return <View key={indexInList+'-'+index}
                                     style={{width:oneCardBlockWidth*0.98*0.18,height:oneCardBlockHeight*0.15,
                                            marginHorizontal: isExpanded
                                                          ? oneCardBlockWidth*0.015
                                                          : 0,
                                            backgroundColor:'rgba(0,0,0,0.1)',
                                            }}>
                                <Text style={{textAlign:'center',color:colorList[index],fontWeight:'600'}}>
                                   {item}
                                </Text>
                            </View>
                      })}                          
                </View>
  
                {!cardInfo.FIELD5 && !cardInfo.FIELD6 ? null :
                  <View id='Text'
                        style={{width:'100%',height:oneCardBlockHeight*0.09,...flexRowSpace}}>
                        <Text style={{fontSize:oneCardBlockHeight*0.065}}>
                            {cardInfo.FIELD5}
                        </Text>
                        <Text style={{fontSize:oneCardBlockHeight*0.065}}>
                            {cardInfo.FIELD6}
                        </Text>
                  </View>
                }
  
                <View id='Text'
                      style={{width:'100%',...flexRowSpace,
                            height:!cardInfo.FIELD5 && !cardInfo.FIELD6 
                              ? oneCardBlockHeight*0.64
                              : oneCardBlockHeight*0.55,
                            maxWidth:oneCardBlockWidth*2}}>
                      <Text style={{fontSize:oneCardBlockHeight*0.09}}>
                          {renderCardText()}
                      </Text>
                </View>
                
            </View>
                  
}