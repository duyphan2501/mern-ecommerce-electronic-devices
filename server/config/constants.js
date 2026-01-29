// 1. Thời gian tính bằng GIÂY (dùng để cộng thêm)
export const CART_TTL_REDIS = {
  GUEST: 60 * 60 * 24 * 3,   // 3 ngày
  USER: 60 * 60 * 24 * 7,    // 7 ngày
  RESERVATION: 60 * 60 * 2,  // 2 giờ
};

// 2. Thời gian tính bằng MILI GIÂY (dùng cho Cookie/Frontend)
export const CART_TTL_MS = {
  GUEST: CART_TTL_REDIS.GUEST * 1000,
  USER: CART_TTL_REDIS.USER * 1000,
  RESERVATION: CART_TTL_REDIS.RESERVATION * 1000,
};

// 3. Hàm tạo mốc thời gian EXPIRE_AT (Dạng STRING để tránh lỗi Redis)
export const getCartExpireAt = (type = 'GUEST') => {
  const now = Math.floor(Date.now() / 1000);
  const ttl = CART_TTL_REDIS[type] || CART_TTL_REDIS.GUEST;
  return String(now + ttl); // Luôn trả về String cho Redis
};

export const getReserveExpireAt = () => {
  const now = Math.floor(Date.now() / 1000);
  return String(now + CART_TTL_REDIS.RESERVATION); // Luôn trả về String
};
