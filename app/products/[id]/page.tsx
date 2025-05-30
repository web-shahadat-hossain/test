// // import ProductDetailsClient from "./ProductDetailsClient";
// // import { getProductById } from "@/lib/utils/service/product";

// import { getProductById } from "@/lib/utils/service/product";
// import ProductDetailsClient from "./ProductDetailsClient";

// export default async function Page({ params }: { params: { id: string } }) {
//   const product = await getProductById(params.id);

//   if (!product) {
//     return (
//       <div className="min-h-screen py-12 bg-gray-50/50">
//         <div className="container px-4 mx-auto text-center">
//           <h1 className="mb-4 text-2xl font-bold text-gray-900">
//             Product not found
//           </h1>
//         </div>
//       </div>
//     );
//   }

//   return <ProductDetailsClient product={product} />;
// }

// import ProductDetailsClient from "./ProductDetailsClient";
// import { getProductById } from "@/lib/utils/service/product";
import { getProductById } from "@/lib/utils/service/product";
import ProductDetailsClient from "./ProductDetailsClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Add await here
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen py-12 bg-gray-50/50">
        <div className="container px-4 mx-auto text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Product not found
          </h1>
        </div>
      </div>
    );
  }

  return <ProductDetailsClient product={product} />;
}
