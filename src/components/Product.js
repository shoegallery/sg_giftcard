import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, SafeAreaView, Platform } from "react-native";
import axios from "axios";
import Carousel from "react-native-snap-carousel-v4";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image, Box } from "native-base";
const Product = () => {
  const getData = () => {
    const safebox = [];
    let config = {
      method: "get",
      url: "https://api.zochil.cloud/v2/catalog/products/by-shop/2706?limit=100&featured=1",
      headers: {},
      maxRedirects: 0,
    };

    axios(config)
      .then((response) => {
        response.data.products.map((el) => {
          safebox.push({
            headImage: JSON.parse(el.images)[0].url,
            link: `https://shoegallery.mn/products/${el.category_id}/${el.id}`,
          });

          if (safebox.length == response.data.count) {
            safebox.push({
              headImage: JSON.parse(el.images)[0].url,
              link: `https://shoegallery.mn/products/${el.category_id}/${el.id}`,
            });
            setCarouselItems(safebox);
          }
        });
      })
      .catch((error) => { });
  };

  const exampleItems = [
    {
      title: "Item 1",
      text: "Text 1",
    },
    {
      title: "Item 2",
      text: "Text 2",
    },
    {
      title: "Item 3",
      text: "Text 3",
    },
    {
      title: "Item 4",
      text: "Text 4",
    },
    {
      title: "Item 5",
      text: "Text 5",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);
  const ref = useRef(null);

  const renderItem = useCallback(
    ({ item, index }) => (
      Platform.OS === "ios" ? (<View
        style={{
          alignContent: "center",
          alignContent: "center",
          backgroundColor: "floralwhite",
          borderRadius: 5,
          height: hp("30%"),
          width: hp("30%"),
          alignItems: "center",

          marginLeft: wp("15,5%"),
          marginRight: wp("29,5%"),
        }}
      >
        <Image
          size="full"
          alt=" "
          source={{
            uri: item.headImage,
          }}
        />
      </View>) : (<View
        style={{
          alignContent: "center",
          alignContent: "center",
          backgroundColor: "floralwhite",
          borderRadius: 5,
          height: hp("30%"),
          width: hp("30%"),
          alignItems: "center",

          marginLeft: wp("18,5%"),
          marginRight: wp("24,5%"),
        }}
      >
        <Image
          size="full"
          alt=" "
          source={{
            uri: item.headImage,
          }}
        />
      </View>)

    ),
    []
  );
  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView
      style={{
        borderRadius: 15,
        width: wp("95%"),
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          alignItems: "center",
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >

        <Carousel
          layout="stack"
          ref={ref}
          data={carouselItems}
          sliderWidth={250}
          itemHeight={hp("30%")}
          itemWidth={hp("30%")}
          renderItem={renderItem}
          onSnapToItem={(index) => setActiveIndex(index)}
        />
      </View>

    </SafeAreaView >
  );
};

export default Product;
