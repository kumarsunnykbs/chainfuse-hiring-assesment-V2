const User = require("../models/user");
const randoms = require("../helpers/randoms");

const getAllUsers = async () => {
	const posts = await User.find({signed: true});
    return posts;
}

const getUserById = async (userID) => {
	 try {
      const post = await User.findOne({ _id: userID });
      return post;
    } catch(error) {
      console.log(error);
      return null;
    }
}

const getUserBy = async (payload) => {
  try {
    const post = await User.findOne(payload);
    return post;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getUsersBy = async (payload) => {
  try {
    const post = await User.find(payload);
    return post;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getUserByWallet = async (walletAddress) => {
  try {
     const post = await User.findOne({ walletAddress: walletAddress });
     return post;
   } catch(error) {
     console.log(error);
     return null;
   }
}

const addUser = async (payload) => {
    try{
      if(!payload.walletAddress)
        return null;

      const post = new User({
        walletAddress: payload.walletAddress,
        twitter: payload.twitter,
        discord: payload.discord,
        userName: randoms.getUserName(6),
        userAvatar: "default.jpg",
        jwt_token: payload.token
      })
      await post.save();
      return post;
    }catch(error){
      console.log(error)
      return null;
    }
}

const updateUser = async (userID, payload, files = null) => {
  try {
    if(files){
      
      let myFile = files.file;
      let tempNum = randoms.randomNumber(6);
      let image_name = tempNum + ".jpg";
      
      myFile.mv('./public/useravatar/'+image_name, async function (uploadErr) {});

      await User.updateOne({_id: userID}, {...payload, updated: Date.now(), userAvatar: image_name});
      return User.findOne({_id: userID});
    }
    else{
      await User.updateOne({_id: userID}, {...payload, updated: Date.now()});
      return User.findOne({_id: userID});
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  

}

const releaseHolding = async (userID, symbol, type, cryptoAmount = 0, cryptoPrice = 0) => {
  try {
    let userDetail = await User.findOne({_id: userID});
    let index = 0;
    userDetail.crypto.map((el, idx) => {
      if(el.symbol == symbol)
        index = idx + 1
    })

    if(type == "buy"){
      if(userDetail.usd_holding < cryptoAmount * cryptoPrice)
          return null;

      if(index){
        userDetail.crypto[index - 1].amount = userDetail.crypto[index - 1].amount + cryptoAmount;
        userDetail.usd_holding = userDetail.usd_holding - cryptoAmount * cryptoPrice;
      }else{
      
        userDetail.crypto.push({symbol: symbol, amount: cryptoAmount, holding: 0});
        userDetail.usd_holding = userDetail.usd_holding - cryptoAmount * cryptoPrice;
      }
    }

    if(type == "sell"){
      // if(userDetail.usd_holding < cryptoAmount * cryptoPrice)
      //     return null;
          
      if(index){
        if(userDetail.crypto[index - 1].holding < cryptoAmount)
          return null;
        userDetail.crypto[index - 1].holding = userDetail.crypto[index - 1].holding - cryptoAmount;
        userDetail.usd_balance = userDetail.usd_balance + cryptoAmount * cryptoPrice;
      }
      else
       return null;
    }

    await userDetail.save();
    return userDetail;

  } catch (error) {
    console.log(error);
    return null;
  }
  

}

const cancelHolding = async (userID, symbol, type,  cryptoAmount = 0, cryptoPrice = 0) => {
  try {
    console.log(`${userID}_${symbol}_${type}_${cryptoAmount}_${cryptoPrice}`);
    let userDetail = await User.findOne({_id: userID});
    
    if(type == "buy"){
      if(userDetail.usd_holding < parseFloat(cryptoPrice) * parseFloat(cryptoAmount))
        return null;
      userDetail.usd_balance = userDetail.usd_balance + parseFloat(cryptoPrice) * parseFloat(cryptoAmount);
      userDetail.usd_holding = userDetail.usd_holding - parseFloat(cryptoPrice) * parseFloat(cryptoAmount);
    }

    if(type == "sell"){

      let index = 0;
      userDetail.crypto.map((el, idx) => {
        if(el.symbol == symbol)
          index = idx + 1
      })
      if(index){
        if(userDetail.crypto[index - 1].holding < parseFloat(cryptoAmount))
          return null;
        userDetail.crypto[index - 1].holding = userDetail.crypto[index - 1].holding - parseFloat(cryptoAmount);
        userDetail.crypto[index - 1].amount = userDetail.crypto[index - 1].amount + parseFloat(cryptoAmount);
      }
      else
        return null;
    }

    await userDetail.save();
    return userDetail;

  } catch (error) {
    console.log(error);
    return null;
  }
  

}

const makeHolding = async (userID, symbol, type, cryptoAmount = 0, cryptoPrice = 0) => {
  try {
    let userDetail = await User.findOne({_id: userID});
    let index = 0;
    userDetail.crypto.map((el, idx) => {
      if(el.symbol == symbol)
        index = idx + 1
    })
    console.log(userDetail.usd_balance < parseFloat(cryptoAmount) * parseFloat(cryptoPrice));
    if(type == "buy"){
      if(userDetail.usd_balance < parseFloat(cryptoAmount) * parseFloat(cryptoPrice))
          return null;

      userDetail.usd_holding = userDetail.usd_holding + parseFloat(cryptoAmount) * parseFloat(cryptoPrice);
      userDetail.usd_balance = userDetail.usd_balance - parseFloat(cryptoAmount) * parseFloat(cryptoPrice);
    }

    if(type == "sell"){
      // if(userDetail.usd_holding < cryptoAmount * cryptoPrice)
      //     return null;
          
      if(index){
        if(userDetail.crypto[index - 1].amount < parseFloat(cryptoAmount))
          return null;
        userDetail.crypto[index - 1].holding = userDetail.crypto[index - 1].holding + parseFloat(cryptoAmount);
        userDetail.crypto[index - 1].amount = userDetail.crypto[index - 1].amount - parseFloat(cryptoAmount);

      }
       
      else
        return null;
    }

    await userDetail.save();
    return userDetail;

  } catch (error) {
    console.log(error);
    return null;
  }
  

}

const makeMarket = async (userID, symbol, type, cryptoAmount = 0, cryptoPrice = 0) => {
  try {
    let userDetail = await User.findOne({_id: userID});
    let index = 0;
    userDetail.crypto.map((el, idx) => {
      if(el.symbol == symbol)
        index = idx + 1
    })

    if(type == "buy"){
      if(userDetail.usd_balance < cryptoAmount * cryptoPrice)
          return null;

          if(index){
            userDetail.crypto[index - 1].amount = parseFloat(userDetail.crypto[index - 1].amount) + parseFloat(cryptoAmount);
            userDetail.usd_balance = parseFloat(userDetail.usd_balance) - parseFloat(cryptoAmount) * parseFloat(cryptoPrice);
          }else{
            userDetail.crypto.push({symbol: symbol, amount: parseFloat(cryptoAmount), holding: 0});
            userDetail.usd_balance = parseFloat(userDetail.usd_balance) - parseFloat(cryptoAmount) * parseFloat(cryptoPrice);
          }
    }

    if(type == "sell"){
      console.log("cgecj", index);
      if(index){
        if(userDetail.crypto[index - 1].amount < parseFloat(cryptoAmount))
          return null;
        
        userDetail.crypto[index - 1].amount = parseFloat(userDetail.crypto[index - 1].amount) - parseFloat(cryptoAmount);
        userDetail.usd_balance = parseFloat(userDetail.usd_balance) + parseFloat(cryptoAmount) * parseFloat(cryptoPrice);
      }
      else
       return null;
  }
    await userDetail.save();
    return userDetail;

  } catch (error) {
    console.log(error);
    return null;
  }
  

}



const deleteUser = async (userId) => {
	try {
      const post = await User.findOne({ _id: userId });
      post.deleted = true;
      await post.save();
      return post;
      // res.status(204).send();
    } catch(error) {
      console.log(error);
      return null;
    }
}


module.exports = {
	getAllUsers,
	getUserByWallet,
  getUserBy,
  getUsersBy,
	getUserById,
  releaseHolding,
  cancelHolding,
  makeHolding,
  makeMarket,
  addUser,
	updateUser,
	deleteUser
}