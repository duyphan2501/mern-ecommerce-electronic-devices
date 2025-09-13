import axios from "axios";

const req1 = axios.post("http://localhost:3000/api/cart/add", {
  modelId: "689c398f98d103722d8f5b1a",
  quantity: 1,
  userId: "6890a26a128b9605263a4526"
});
const req2 = axios.post("http://localhost:3000/api/cart/add", {
  modelId: "689c398f98d103722d8f5b1a",
  quantity: 1,
  userId: "688eefea283667a0d6556361",
});

Promise.all([req1, req2])
  .then(([res1, res2]) => {
    console.log(res1.data);
    console.log(res2.data);
  })
  .catch((err) => {
    console.log(err);
  });
