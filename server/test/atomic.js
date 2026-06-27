import axios from "axios";

const req1 = axios.post("http://localhost:3000/api/cart/add", {
  modelId: "69af97badf7091322ba5cc83",
  quantity: 1,
  userId: "6890a26a128b9605263a4526",
});
const req2 = axios.post("http://localhost:3000/api/cart/add", {
  modelId: "69af97badf7091322ba5cc83",
  quantity: 1,
  userId: "688eefea283667a0d6556361",
});

Promise.allSettled([req1, req2]).then((results) => {
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Req ${index + 1} thành công:`, result.value.data);
    } else {
      console.error(`Req ${index + 1} bị lỗi:`, result.reason.message);
    }
  });
});
