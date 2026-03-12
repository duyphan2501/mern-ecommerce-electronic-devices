import BlogCard from "./BlogCard"
const blogs = [
    {
        image: "https://serviceapi.spicezgold.com/download/1750304462017_1000005912.jpg",
        title: "Công ty TNHH Name Việt Nam - Giải pháp năng lượng mặt trời hàng đầu",
        content: "Công ty TNHH Name Việt Nam là một trong những công ty hàng đầu tại Việt Nam trong lĩnh vực cung cấp giải pháp năng lượng mặt trời. Với đội ngũ kỹ sư giàu kinh nghiệm và công nghệ tiên tiến, chúng tôi cam kết mang đến cho khách hàng những sản phẩm và dịch vụ chất lượng nhất.",
        date: "2023-10-01",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741758993155_6-4.jpg",
        title: "Lắp đặt hệ thống điện mặt trời tại Name Việt Nam",
        content: "Chúng tôi cung cấp dịch vụ lắp đặt hệ thống điện mặt trời chất lượng cao, giúp tiết kiệm chi phí điện năng và bảo vệ môi trường. Đội ngũ kỹ thuật viên của chúng tôi sẽ tư vấn và lắp đặt hệ thống phù hợp với nhu cầu của bạn.",
        date: "2023-10-02",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741758867669_7-6.jpg",
        title: "Bảo trì hệ thống điện mặt trời - Dịch vụ chuyên nghiệp tại Name Việt Nam",
        content: "Dịch vụ bảo trì hệ thống điện mặt trời của chúng tôi đảm bảo hệ thống hoạt động hiệu quả và bền bỉ. Chúng tôi cung cấp các gói bảo trì định kỳ để đảm bảo hiệu suất tối ưu cho hệ thống của bạn.",
        date: "2023-10-03",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741758867669_7-6.jpg",
        title: "Giải pháp năng lượng mặt trời cho doanh nghiệp tại Name Việt Nam",
        content: "Chúng tôi cung cấp giải pháp năng lượng mặt trời toàn diện cho doanh nghiệp, giúp giảm chi phí điện năng và nâng cao hiệu quả kinh doanh. Liên hệ với chúng tôi để được tư vấn chi tiết.",
        date: "2023-10-04",
    },
]

const BlogGrid = () => {
  return (
    <div>
        <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {blogs.map((blog, index) => {
                return (
                    <div className="" key={index}>
                        <BlogCard image={blog.image} title={blog.title} content={blog.content} date={blog.date}/>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default BlogGrid