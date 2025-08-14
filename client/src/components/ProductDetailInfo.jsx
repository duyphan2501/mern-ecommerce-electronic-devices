import { useState } from "react";
import CommentCard from "./CommentCard";
import { Button, Rating, Stack, TextField } from "@mui/material";

const comment = {
  avatar: "https://ecommerce-frontend-view.netlify.app/user.jpg",
  name: "Duy Phan",
  date: "2023-10-04",
  comment: "Best product",
  rating: 5,
};

const ProductDetailInfo = ({ product }) => {
  const [activeTab, setActive] = useState(0);

  return (
    <div className="">
      <div className="flex gap-10">
        <p
          className={`link font-semibold text-lg ${
            activeTab === 0 && "text-blue-500 border-b-3"
          }`}
          onClick={() => setActive(0)}
        >
          Thông tin sản phẩm
        </p>
        <p
          className={`link font-semibold text-lg ${
            activeTab === 1 && "text-blue-500 border-b-3"
          }`}
          onClick={() => setActive(1)}
        >
          Bình luận ({4})
        </p>
      </div>
      <div className="py-5">
        {activeTab === 0 ? (
          <p className="">{product.description}</p>
        ) : (
          <div className="shadow rounded px-5 py-2">
            <div className="">
              <h3 className="font-bold text-lg">Phản hồi từ khách hàng</h3>
              <div className="p-2 max-h-[400px] overflow-y-scroll">
                {Array.from({ length: 5 }).map(() => {
                  return <CommentCard comment={comment} />;
                })}
              </div>
            </div>
            <div className="p-3 shadow rounded bg-gray-100 my-5">
               <h4 className="text-lg font-bold mb-3">Bình luận</h4> 
                <TextField id="outlined-basic" label="Viết gì đó..." variant="outlined" className="bg-white w-full mt-3" multiline={true} rows={4} />
                <div className="my-3">
                  <Stack spacing={1}>
                    <Rating
                      size="medium"
                      name="half-rating"
                      precision={0.5}
                      defaultValue={5}
                    />
                  </Stack>
                </div>
                <Button className="!bg-blue-500 !text-white !font-sans !font-semibold hover:!bg-black">Gửi bình luận</Button>
                
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailInfo;
