const sanitizeUser = (user) => {
//   delete result.password;
//   delete result.refreshToken;
//   delete result.refreshTokenExpireAt;
//   delete result.verificationToken;
//   delete result.verificationTokenExpireAt;
//   delete result.resetPasswordToken;
//   delete result.resetPasswordExpireAt;
  return {
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    avatar: user.avatar
  };
};

export { sanitizeUser };
