export const parse = (data: any[]) =>
  data.map((item) => {
    const values = Object.values(item);
    if (values.length === 1) {
      const itemData: any = values[0];
      Object.values(itemData).forEach((itemValue, itemKey) => {
        if (Array.isArray(itemValue)) {
          const property = Object.keys(itemData)[itemKey];
          itemData[property] = parse(itemValue);
        }
      });
      return itemData;
    }
    return item;
  });
