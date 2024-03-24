import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext, } from "react";
import { View, StyleSheet, Pressable, Alert, RefreshControl, ScrollView } from "react-native";
import { StateContext } from "../Context/StateContext";
import {
  NativeBaseProvider,
  Box,
  VStack,
  Center,
  useToast,
  HStack,
  Text
} from "native-base";

import NumberFormat from "react-number-format";
import moment from "moment";
import { SwipeView, EasySwipe, LeftButton, RightButton  } from 'easy-swipe-view';

import { SafeAreaView } from 'react-native-safe-area-context';

const darkColors = {
  background: '#0e0e0e',
  primary: '#BB86FC',
  primary2: '#3700b3',
  secondary: '#03DAC6',
  onBackground: '#FFFFFF',
  error: '#CF6679',
};

const colorEmphasis = {
  high: 0.87,
  medium: 0.6,
  disabled: 0.38,
};

const extractItemKey = item => {
  return item.id.toString();
};
const Item = ({ item }) => {
  return (
    <View style={styles.item}>
      <View style={styles.messageContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.order}
        </Text>
        <Text style={styles.amount} numberOfLines={1}>
          Үнийн дүн: <NumberFormat
            value={parseInt(item.amount)}
            displayType={"text"}
            thousandSeparator={true}
            renderText={(formattedValues) => (
              <Text
                bold
              >
                {formattedValues}₮
              </Text>
            )}
          />
        </Text>
        <Text style={styles.text} numberOfLines={3} lineHeight={15}>
          {item.summary}
        </Text>
        <Text style={styles.text} numberOfLines={3} lineHeight={15}>
          {moment(item.date).format("YYYY-MM-DD LT")}
        </Text>
      </View>
    </View>
  );
};

export default function AdminStatisticScreen({ navigation }, props) {
  const warnToast = useToast();
  const [userData, setUserData] = useContext(StateContext);
  const [groupMonthTransActions, setGroupMonthTransActions] = useState([])
  const [lastTenTransActions, setLastTenTransActions] = useState([])
  const [totalTransActions, setTotalTransActions] = useState([])
  const [totalWallets, setTotalWallets] = useState([])
  const [allSelledCard, setAllSelledCard] = useState([])
  const [problem, setProblem] = useState("")
  const [data, setData] = useState([]);
  const [checkShow, setCheckShow] = useState(false)

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    GetData()
    bossCheckList()
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  var stackFive = []

  const deleteItem = itemId => {

    // ! Please don't do something like this in production. Use proper state management.
    const newState = [...data];
    const filteredState = newState.filter(item => item.id !== itemId);
    return setData(filteredState);
  };

  const archiveItem = itemId => {
    Alert.alert(
      'Сануулга',
      ``,
      [
        {
          text: 'Болих',
          style: 'cancel',
        },
        {
          text: 'Чек тавих',
          onPress: () => {
            // Remove the item from the state
            const updatedData = data.filter(item => item.id !== itemId);
            setData(updatedData);
            bossCheckIt(itemId);
          },
          style: 'destructive',
        },
      ],
    );
  };

  const QuickActions = (index, qaItem) => {
    return (
      <View style={styles.qaContainer}>
        <View style={[styles.button]}>
          <Pressable onPress={() => { archiveItem(qaItem.id) }}>
            <Text style={[styles.buttonText, styles.button1Text]}>Check</Text>
          </Pressable>
        </View>
      </View>
    );
  };
  function renderItemSeparator() {
    return <View style={styles.itemSeparator} />;
  }
  const bossCheckList = () => {

    stackFive = []
    let dataReq = JSON.stringify({ walletSuperId: userData.wallets.walletSuperId });

    let config = {
      method: 'POST',
      url: `${baseUrl}/transactions/bosschecklist`,
      headers: {
        'Content-Type': 'application/json',

      },
      maxRedirects: 0,
      data: dataReq
    };

    axios(config)
      .then((response) => {
        if (response.data.data.length > 0) {
          setCheckShow(true)
          response.data.data.map(el => {
            stackFive.push({ id: el._id, order: el.orderNumber, amount: el.amount.$numberDecimal, summary: el.summary, date: el.createdAt })
          })
          setData(stackFive)
        }
        else {
          setCheckShow(false)
        }

      })
      .catch((error) => {
        console.log(error);
      });
  }
  const bossCheckIt = (itemId) => {

    let dataBossCheckIt = JSON.stringify({ walletSuperId: userData.wallets.walletSuperId, id: itemId });

    let config = {
      method: 'POST',
      url: `${baseUrl}/transactions/bosscheckit`,
      headers: {
        'Content-Type': 'application/json',

      },
      maxRedirects: 0,
      data: dataBossCheckIt
    };

    axios(config)
      .then((response) => {
        if (response.data.success === true) {
          warnToast.show({
            backgroundColor: "green.600",
            px: "2",
            py: "1",
            rounded: "sm",
            height: "50",
            width: "250",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            title: "Чек тавигдсан",
            placement: "top",
          });
        }
        else {
          warnToast.show({
            backgroundColor: "red.400",
            px: "2",
            py: "1",
            rounded: "sm",
            height: "50",
            width: "250",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            title: "Тамир хандана уу",
            placement: "top",
          });
        }

        setData([])
        bossCheckList()
      })
      .catch((error) => {
        warnToast.show({
          backgroundColor: "red.400",
          px: "2",
          py: "1",
          rounded: "sm",
          height: "50",
          width: "250",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          title: "Дахин оролдоно уу",
          placement: "top",
        });
      });
  }

  const GetData = () => {
    var problemStack = 0
    var stackOne = []
    var stackTwo = []
    var stackThree = []
    var stackFour = []
    var request = JSON.stringify({
      walletSuperId: userData.wallets.walletSuperId,
    });
    var config = {
      method: "POST",
      url: `${baseUrl}/transactions/statistic`,
      headers: {
        "Content-Type": "application/json",

      },
      data: request,
    };
    axios(config)
      .then(function (response) {
        if (response.data.success === true) {
          var giftcardValue = 0
          var purchaseValue = 0
          var bonusValue = 0
          var operatorChargeValue = 0
          var couponValue = 0
          response.data.data[0].groupMonthTransActions.map(el => {
            stackOne.push({ date: el._id[0].date, purpose: el._id[1].purpose, trnxType: el._id[2].trnxType, value: el.sum.$numberDecimal })
          })
          setGroupMonthTransActions(stackOne)
          setLastTenTransActions(response.data.data[0].lastTenTransActions)
          response.data.data[0].totalTransActions.map(el => {
            stackTwo.push({ purpose: el._id[0].purpose, trnxType: el._id[1].trnxType, value: el.sum.$numberDecimal })
          })
          setTotalTransActions(stackTwo)
          response.data.data[0].totalWallets.map(el => {
            stackThree.push({ role: el._id[0].role, value: el.sum.$numberDecimal })
          })
          setTotalWallets(stackThree)

          response.data.data[0].allSelledCard.map(el => {
            stackFour.push({ amount: el._id.amount.$numberDecimal, value: el.count })
          })
          setAllSelledCard(stackFour)

          stackTwo.map(elem => {
            if (elem.purpose === "membercard") {
              if (elem.trnxType === "Орлого") {
                giftcardValue = giftcardValue + parseInt(elem.value)

              } else if (elem.trnxType === "Зарлага") {
                giftcardValue = giftcardValue - parseInt(elem.value)
              }
              else if (elem.trnxType === "Урамшуулал") {
                giftcardValue = giftcardValue - parseInt(elem.value)
              }
            }
            else if (elem.purpose === "purchase") {
              if (elem.trnxType === "Орлого") {
                purchaseValue = purchaseValue + parseInt(elem.value)
              } else if (elem.trnxType === "Зарлага") {
                purchaseValue = purchaseValue - parseInt(elem.value)
              }
            }
            else if (elem.purpose === "bonus") {
              if (elem.trnxType === "Орлого") {
                bonusValue = bonusValue + parseInt(elem.value)
              } else if (elem.trnxType === "Зарлага") {
                bonusValue = bonusValue - parseInt(elem.value)
              }
            }
            else if (elem.purpose === "operatorCharge") {
              if (elem.trnxType === "Орлого") {
                operatorChargeValue = operatorChargeValue + parseInt(elem.value)
              } else if (elem.trnxType === "Зарлага") {
                operatorChargeValue = operatorChargeValue - parseInt(elem.value)
              }
            }
            else if (elem.purpose === "coupon") {
              if (elem.trnxType === "Орлого") {
                couponValue = couponValue + parseInt(elem.value)
              }
            }
          })
          stackThree.map(lu => {
            if (lu.role === "user") {
              problemStack = problemStack + parseInt(lu.value)
            }
            else if (lu.role === "variance") {
              problemStack = problemStack - parseInt(lu.value)
            }
            else if (lu.role === "saler") {
              problemStack = problemStack + parseInt(lu.value)
            }
            else if (lu.role === "operator") {
              problemStack = problemStack + parseInt(lu.value)
            }
            else if (lu.role === "admin") {
              problemStack = problemStack + parseInt(lu.value)
            }
          })
          if (problemStack - 1000000000 === couponValue && giftcardValue === 0 && operatorChargeValue === 0 && bonusValue === 0 && purchaseValue === 0) {
            setProblem("Систем ямар нэгэн асуудалгүй")
          } else {
            setProblem("Системд асуудал байна")
          }
        }
      })
      .catch(function (error) {
        warnToast.show({
          backgroundColor: "red.400",
          px: "2",
          py: "1",
          rounded: "sm",
          height: "50",
          width: "250",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          title: "Татан авалт амжилтгүй",
          placement: "top",
        });
      });
  };
  // console.log(groupMonthTransActions)
  // console.log(lastTenTransActions)
  // console.log(totalTransActions)
  // console.log(totalWallets)
  useEffect(() => {
    bossCheckList()
    GetData()
    setGroupMonthTransActions([])
    setLastTenTransActions([])
    setTotalTransActions([])
    setTotalWallets([])
    setAllSelledCard([])
    setProblem("")


  }, [])

  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <ScrollView
          disableVirtualization
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <SafeAreaView>
            <VStack ><Center><Text><Text bold>{problem}</Text></Text></Center>
              <Box shadow={5} borderRadius={10} mt={5} bg={"cyan.50"} height={150} mr={"5%"} ml={"5%"} width={"90%"}>
                <VStack>
                  <Center justifyItems={"center"}>

                    <Text bold shadow={2} textAlign={"center"} fontSize={20}>Борлуулсан багцын хураангүй</Text></Center>
                  <HStack>
                    <Box ml={30}>
                      {allSelledCard.map(el => {
                        return (<View key={el.amount}><Text >
                          <NumberFormat
                            value={parseInt(el.amount)}
                            displayType={"text"}
                            thousandSeparator={true}
                            renderText={(formattedValues) => (
                              <Text
                                mr={50}
                                bold
                              >
                                {formattedValues}{" x "}{el.value}{" = "}<NumberFormat
                                  value={parseInt(el.amount * el.value)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  renderText={(formattedValues) => (
                                    <Text
                                      bold
                                    >
                                      {formattedValues}₮
                                    </Text>
                                  )}
                                />
                              </Text>
                            )}
                          />
                        </Text></View>)
                      })}
                      {allSelledCard.length > 2 ? (
                        <View >
                          {/* <Text pt={1}>Нийт ширхэг: <Text bold>{allSelledCard[0].value + allSelledCard[1].value + allSelledCard[2].value} </Text>
                          </Text>
                          <Text>Нийт дүн:{" "}
                            <NumberFormat
                              value={parseInt(allSelledCard[0].amount * allSelledCard[0].value) + parseInt(allSelledCard[1].amount * allSelledCard[1].value) + parseInt(allSelledCard[2].amount * allSelledCard[2].value)}
                              displayType={"text"}
                              thousandSeparator={true}
                              renderText={(formattedValues) => (
                                <Text
                                  bold
                                >
                                  {formattedValues}₮
                                </Text>
                              )}
                            />
                          </Text> */}
                        </View>
                      ) : (<View></View>)
                      }</Box></HStack></VStack>
              </Box>
            </VStack>
            <View>
              {checkShow ? (<Box height={"100%"}><View shadow={5} height={"70%"} width={"95%"} alignSelf="center"  >
                <SafeAreaView>
                  <View justifyContent="flex-start" backgroundColor="green">
                    <View style={styles.headerContainer}><Text pt={2} style={styles.headerText}>Check list</Text></View>
                  </View>

                  {/* <SwipeableFlatList
                    nestedScrollEnabled={true}

                    keyExtractor={extractItemKey}
                    data={data}
                    renderItem={({ item }) => (
                      <Item item={item} deleteItem={() => deleteItem} />
                    )}
                    maxSwipeDistance={100}
                    renderQuickActions={({ index, item }) => QuickActions(index, item)}
                    contentContainerStyle={styles.contentContainerStyle}
                    shouldBounceOnMount={true}
                    ItemSeparatorComponent={renderItemSeparator}

                  /> */}
                </SafeAreaView>
              </View></Box>) : (<Box mt={15} width={"95%"} height={"90%"} alignSelf="center"   ><View borderRadius={10} height={50} justifyContent="center" alignItems="center" backgroundColor="#6AC47E">
                <View><Text pt={2} style={styles.headerText}>Check байхгүй</Text></View>
              </View></Box>)}
            </View>
          </SafeAreaView>
        </ScrollView>
      </SafeAreaView >
    </NativeBaseProvider >
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#a4b0be',
    maxHeight: "100%",
  },
  headerContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ff6348"
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: darkColors.onBackground,
    opacity: colorEmphasis.high,
  },
  item: {
    marginTop: 10,
    backgroundColor: '#ced6e0',
    height: 100,
    flexDirection: 'row',
    padding: 10,
    justifyContent: "center"
  },
  messageContainer: {
    justifyContent: "center",
    backgroundColor: darkColors.backgroundColor,
    maxWidth: 400,
  },
  name: {
    fontSize: 17,
    color: "#2C3A47",
    opacity: colorEmphasis.high,
    fontWeight: '800',
  },
  amount: {
    fontSize: 15,
    color: "#182C61",
    opacity: colorEmphasis.high,
    fontWeight: 'bold',
  },
  text: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#000007",
    opacity: colorEmphasis.medium,
  },

  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: darkColors.onBackground,
    opacity: colorEmphasis.medium,
  },
  qaContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    width: 100,
    marginTop: 10,
    backgroundColor: "#747d8c",
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    opacity: colorEmphasis.high,
  },
  button1Text: {
    fontSize: 20,
    color: "#7bed9f",
  },
  button2Text: {
    color: darkColors.secondary,
  },
  button3Text: {
    color: darkColors.error,
  },
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: darkColors.backgroundColor,
  },

});