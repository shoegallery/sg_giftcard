import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, SafeAreaView } from "react-native";
import axios from "axios";
import Carousel from "react-native-snap-carousel-v4";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "native-base";
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
      .catch((error) => {});
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
      <View
        style={{
          alignContent: "center",
          alignContent: "center",
          backgroundColor: "floralwhite",
          borderRadius: 5,
          height: hp("26%"),
          width: hp("26%"),
          alignItems: "center",

          marginLeft: 50,
          marginRight: 100,
        }}
      >
        <Image
          size="full"
          alt="fallback text"
          source={{
            uri: item.headImage,
          }}
        />
      </View>
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
        backgroundColor: "#ffab91",
        paddingTop: hp("2%"),
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Carousel
          layout="stack"
          ref={ref}
          data={carouselItems}
          sliderWidth={120}
          itemHeight={hp("27%")}
          itemWidth={hp("27%")}
          renderItem={renderItem}
          onSnapToItem={(index) => setActiveIndex(index)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Product;
