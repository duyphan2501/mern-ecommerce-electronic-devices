import { IoChatboxOutline } from "react-icons/io5";
import { IoMdArrowDropright } from "react-icons/io";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { FaFacebookF, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa6";

const policies = [
  "Chính sách bảo mật",
  "Chính sách vận chuyển",
  "Chính sách đổi trả",
  "Chính sách bảo hành",
  "Chính sách bảo trì",
];

const socilMediaLinks = [
  {
    name: "Facebook",
    icon: <FaFacebookF size={15} />,
    link: "https://facebook.com",
  },
  {
    name: "Instagram",
    icon: <FaInstagram size={15} />,
    link: "https://instagram.com",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin size={15} />,
    link: "https://linkedin.com",
  },
  {
    name: "YouTube",
    icon: <FaYoutube size={15} />,
    link: "https://youtube.com",
  },
];

const Footer = () => {
  return (
    <footer>
        <div className="border-t border-gray-300"></div>
      <div className="container">
        <div className="md:flex py-5 px-4"> 
          <div className="pl-2 md:pl-0 flex flex-col gap-2 md:gap-4 lg:w-1/3">
            <p className="text-xl font-bold font-sans underline">Thông tin liên hệ</p>
            <div className="">
              <p className="text-2xl font-bold uppercase text-primary mb-1">
                Company Name
              </p>
              <p>19 Đ. Nguyễn Hữu Thọ, Tân Phong, Quận 7, Hồ Chí Minh</p>
            </div>
            <p>elec@yourcompany.com</p>
            <p className="text-xl font-bold text-highlight">
              (+84) 924-830-423
            </p>
            <div className="md:flex items-center hidden">
              <IoChatboxOutline size={40} className="text-primary" />
              <p className="ml-2 font-semibold text-lg text-gray-600 w-[200px] capitalize">
                Liên hệ để được hỗ trợ ngay
              </p>
            </div>
          </div>
          <div className="xl:flex justify-between w-full lg:w-2/3 pl-2 lg:pl-10 space-y-5 mt-5 ">
            <div className="flex flex-col gap-2 md:gap-4 items-center">
              <p className="text-xl font-bold font-sans underline">Chính sách hỗ trợ</p>
              <ul className="space-y-2 support">
                {policies.map((policy, index) => {
                  return (
                    <li key={index}>
                      <a href="#" className="text-gray-600 flex items-center">
                        <IoMdArrowDropright size={20} /> {policy}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-col gap-2 md:gap-5">
              <p className="text-xl font-bold font-sans text-center xl:text-left">Đăng ký ngay</p>
              <p className="hidden sm:block text-center xl:text-left">
                Đăng đý để nhận được thông báo sớm nhất về các ưu đãi đặc biệt
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="outline-[1px] outline-gray-300 bg-white rounded p-3 focus:outline-[1px] border-0 focus:outline-gray-400 w-full"
                />
                <Button className="!inline-block !px-2 !bg-[#50e3c2] !text-black !font-sans !font-bold hover:!text-">
                  Đăng ký ngay
                </Button>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Đồng ý với các chính sách của chúng tôi"
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-t border-gray-300">
        <div className="container py-3 md:flex justify-between items-center">
          <div className="">
            <ul className="flex items-center gap-3 justify-center">
              {socilMediaLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.link} >
                    <div className="w-8 h-8 flex items-center justify-center border rounded-full bg-gray-100 hover:bg-[#0d68f3] hover:text-white transition">
                      {link.icon}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-gray-600 text-sm md:pt-0 pt-3 text-center">
            © {new Date().getFullYear()} Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
