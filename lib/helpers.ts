export const parse = (data: any[]) =>
  data.map((item) => {
    const itemData: any = Object.values(item)[0];
    Object.values(itemData).forEach((itemValue, itemKey) => {
      if (Array.isArray(itemValue)) {
        const property = Object.keys(itemData)[itemKey];
        itemData[property] = parse(itemValue);
      }
    });
    return itemData;
  });
