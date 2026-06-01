import BlogCard from "./BlogCard"
const blogs = [
    {
        image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29sYXJ8ZW58MHx8MHx8fDA%3D",
        title: "Công ty TNHH Name Việt Nam - Giải pháp năng lượng mặt trời hàng đầu",
        content: "Công ty TNHH Name Việt Nam là một trong những công ty hàng đầu tại Việt Nam trong lĩnh vực cung cấp giải pháp năng lượng mặt trời. Với đội ngũ kỹ sư giàu kinh nghiệm và công nghệ tiên tiến, chúng tôi cam kết mang đến cho khách hàng những sản phẩm và dịch vụ chất lượng nhất.",
        date: "2023-10-01",
    },
    {
        image: "https://images.unsplash.com/photo-1545209575-704d1434f9cd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHx8",
        title: "Lắp đặt hệ thống điện mặt trời tại Name Việt Nam",
        content: "Chúng tôi cung cấp dịch vụ lắp đặt hệ thống điện mặt trời chất lượng cao, giúp tiết kiệm chi phí điện năng và bảo vệ môi trường. Đội ngũ kỹ thuật viên của chúng tôi sẽ tư vấn và lắp đặt hệ thống phù hợp với nhu cầu của bạn.",
        date: "2023-10-02",
    },
    {
        image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNvbGFyfGVufDB8fDB8fHww",
        title: "Bảo trì hệ thống điện mặt trời - Dịch vụ chuyên nghiệp tại Name Việt Nam",
        content: "Dịch vụ bảo trì hệ thống điện mặt trời của chúng tôi đảm bảo hệ thống hoạt động hiệu quả và bền bỉ. Chúng tôi cung cấp các gói bảo trì định kỳ để đảm bảo hiệu suất tối ưu cho hệ thống của bạn.",
        date: "2023-10-03",
    },
    {
        image: "https://images.unsplash.com/photo-1545208942-e1c9c916524b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D",
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