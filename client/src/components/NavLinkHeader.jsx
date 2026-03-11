import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import useCategoryStore from "../store/categoryStore";

const NavLinkHeader = () => {
  const categoryList = useCategoryStore((state) => state.categoryList); 
  if (!categoryList || categoryList.length === 0) return null;
  // get 7 categories 
  const listOfCategories = categoryList.slice(0, 7);
  return (
    <ul className="items-center xl:gap-x-3 lg:gap-x-2 gap-x-1 justify-center hidden md:flex border-t border-gray-100">
      {listOfCategories.map((cate) => (
        <li key={cate._id} className="relative">
          <Link to={`products/_${cate.slug}`}>
            <Button            
              className="link !py-2"
            >
              {cate.name}
            </Button>
          </Link>
          {cate.children && cate.children.length > 0 && (
            <ul className="submenu absolute top-[100%] left-0 bg-white shadow-sm z-10">
              {cate.children.map((child) => ( 
                <li key={child._id}>
                  <Link to={`products/_${child.slug}`}>
                    <Button
                      className="link"
                    >
                      {child.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NavLinkHeader;
