import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const FilterSidebar = ({ allProducts,priceRange,search,setSearch,category,setCategory,brand,setBrand,setPriceRange}) => {
  const Categories = allProducts.map((p) => p.category);
  const uniqueCategory = ["All", ...new Set(Categories)];
  const Brands = allProducts.map((p) => p.brand);
  const uniqueBrand = ["All", ...new Set(Brands)];

  const handleCategoryClick=(val)=>{
    setCategory(val);
  }

  const handleBrandChange=(e)=>{
    setBrand(e.target.value);
  }
  
  const handleMinChange=(e)=>{
    const value=Number(e.target.value);
    if(value<=priceRange[1])setPriceRange([value,priceRange[1]])
  }
  
  const handleMaxChange=(e)=>{
    const value=Number(e.target.value);
    if(value>=priceRange[0])setPriceRange([priceRange[0],value])
  }

  const resetFilters=()=>{
   setSearch("");
   setCategory("All");
   setBrand("All");
   setPriceRange([0,999999]);
  }

  return (
    <div className="bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64">
      {/* Search */}
      <Input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="bg-white p-2 rounded-md border-gray-400 w-full border-2"
      />
      {/* category */}
      <h1 className="mt-5 font-semibold text-xl ">Category</h1>
      <div className="flex flex-col gap-2 mt-3">
        {uniqueCategory.map((item, index) => {
          return (
            <div key={index} className="flex items-center gap-2">
              <input type="radio" 
               checked={category===item}
               onChange={()=>handleCategoryClick(item)}
               className="cursor-pointer"
               />
              <label htmlFor="">{item}</label>
            </div>
          );
        })}
      </div>
      <h1 className="mt-5 font-semibold text-xl mb-3">Brand</h1>
      <select
        name=""
        id=""
        className="bg-white w-full p-2 border-gray-200 border-2 cursor-pointer rounded-md"
        value={brand}
        onChange={handleBrandChange}
      >
        {uniqueBrand.map((item, index) => {
          return (
            <option value={item} key={index}>
              {item}
            </option>
          );
        })}
      </select>
      {/* price range */}
      <h1 className="mt-5 font-semibold text-xl mb-3">Price Range</h1>

      <div className="flex flex-col gap-2">
        <label>
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            max="5000"
            className="w-20 p-1 border border-gray-300 rounded"
            value={priceRange[0]}
            onChange={handleMinChange}
          />

          <span>-</span>

          <input
            type="number"
            min="0"
            max="999999"
            className="w-20 p-1 border border-gray-300 rounded"
            value={priceRange[1]}
            onChange={handleMaxChange}
          />
        </div>

        <input type="range"  min="0" max="5000" step="100" 
        className="w-full cursor-pointer "
        value={priceRange[0]}
        onChange={handleMinChange}
         />

        <input
          type="range"
          min="0"
          max="999999"
          step="100"
          className="w-full cursor-pointer"
          value={priceRange[1]}
          onChange={handleMaxChange}
        />
      </div>

      {/* Reset button */}

      <Button onClick={resetFilters} className="bg-black font-semibold cursor-pointer text-white mt-5 w-full">Reset Filters</Button>
    </div>
  );
};

export default FilterSidebar;
