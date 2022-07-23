
async function checkLootFairyLocation(AllModules){
  const fetch = require('node-fetch')
  const path = 'http://ln.to/LFG/'
  try{
    const res = await fetch(path)
    const resText = await res.text()
    const sepSymbol1 = '<h1>Current Loot Fairy Location: <font color="red">'
    if (resText.indexOf(sepSymbol1)==-1){ return {error:'LF has not been fount yet.'} }
    const lootFairyModuleTitle = String(resText.split(sepSymbol1)[1].split('(')[0] ).trim().
                                 split("&apos;").join("'")
    if (!lootFairyModuleTitle){ return {error:'LF has not been fount yet.'} }
  
    let foundModule = null
    for (let i=0;i<AllModules.length;i++){
        if (AllModules[i].moduleName == lootFairyModuleTitle){ 
            foundModule = AllModules[i] ; break
         } 
    }
    if (!foundModule){ return {error:'LF has not been fount yet.'} }

    const sepSymbol2 = 'clock.setTime('
    if (resText.indexOf(sepSymbol2)==-1){ return {error:'Remaining time is unknown'} }
    const remainingTime = parseInt(resText.split(sepSymbol2)[1].split(')')[0])
    return {foundModule,remainingTime}
  }catch(err){
    //console.error(err)
    return {error:err.message}
  }
}

export {checkLootFairyLocation}