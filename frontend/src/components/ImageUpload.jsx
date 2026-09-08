import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { CardContent } from "./ui/card";
import { X } from "lucide-react";

const ImageUpload = ({ productData, setProductData }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...prev.productImg, ...files],
      }));
    }
  };

  const removeFiles = (idx) => {
    const files = productData.productImg.filter((_, index) => index !== idx);

    setProductData((prev) => ({
      ...prev,
      productImg: files,
    }));
  };
  return (
    <div className="grid gap-2">
      <Label>Product Images</Label>

      <Input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />

      <Button
        variant="outline"
        onClick={() => document.getElementById("file-upload").click()}
        className="cursor-pointer"
        type="button"
      >
        Upload Images
      </Button>

      {/* image Preview */}

      {productData.productImg.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
          {productData.productImg.map((file, idx) => {
            // check if file is already a File (from input) or a DB object/string
            let preview;

            if (file instanceof File) {
              preview = URL.createObjectURL(file);
            } else if (typeof file === "string") {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            } else {
              return null;
            }
            return (
              <Card key={idx} className="relative group overflow-hidden">
                <CardContent>
                  <img
                    src={preview}
                    alt=""
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-md"
                  />

                  {/* remove button */}
                  <button
                    onClick={() => removeFiles(idx)}
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 cursor-pointer rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                </CardContent>
              </Card>
            );
            // Continue rendering image here...
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
