export default async function priceComma(price) {
  const country = navigator.language;
  if (price && typeof price.toLocaleString === 'function') {
    return price.toLocaleString(country, {
      currency: 'KRW',
    });
  } else {
    return price;
  }
}
