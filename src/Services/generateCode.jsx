export const generateCode = () => {
  const maxSize = 8;
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = lowercase.toUpperCase();
  const numbers = "0123456789";

  const combined = lowercase + uppercase + numbers;
  let inviteCode = "";

  for (let i = 0; i < maxSize; i++) {
    let random = Math.floor(Math.random() * combined.length);
    inviteCode += combined.charAt(random);
  }

  return inviteCode;
};

generateCode();
