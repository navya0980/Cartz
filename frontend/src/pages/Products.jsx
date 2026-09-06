import FilterSidebar from "@/components/FilterSidebar";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";

const Products = () => {
  const { products } = useSelector((store) => store.product);
  const { user } = useSelector((store) => store.user);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [sortOrder,setSortOrder]=useState('lowToHigh');

  const dispatch = useDispatch();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_URL}/product/products`);
      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    if (search.trim() !== "") {
      // Fixed typo here: changed 'inlcudes' to 'includes'
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1],
    );

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [allProducts, search, category, brand, priceRange, sortOrder]);

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <div className="pt-13 pb-10">
      <div className="max-w-7xl mx-auto flex gap-7">
        <FilterSidebar
          allProducts={allProducts}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
          search={search}
          setSearch={setSearch}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        {/* product section */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-6">
            <Select onValueChange={(val)=>setSortOrder(val)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* <SelectLabel>Sort by price</SelectLabel> */}

                  <SelectItem value="lowToHigh"  >Price: Low to High</SelectItem>
                  <SelectItem value="highToLow"  >Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-3 lg:grid-cols-5 gap-7">
            {products.map((product) => {
              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  loading={loading}
                  user={user}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
