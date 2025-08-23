const estimateMoney = (money) => {
  const remainder = money % 1000;
  const integerPart = money - remainder;
  const formatedPart = remainder < 500 ? 0 : 1000;
  return integerPart + formatedPart;
};

const formatMoney = (money) => {
  const estimated = estimateMoney(money);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(estimated);
};

export default formatMoney;
